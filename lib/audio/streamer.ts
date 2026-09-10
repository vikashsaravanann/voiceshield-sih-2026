import { AUDIO_CONFIG, ringCapacity, samplesPerChunk } from "./config";
import { ChunkRingBuffer } from "./ring-buffer";
import { InferenceBridge, type BridgeEvent } from "./inference-bridge";
import type { Decision } from "./decision";
import type { DspFeatures } from "./dsp";

export type StreamSnapshot = {
  state: InferenceBridge["state"];
  chunkIndex: number;
  buffered: number;
  decision: Decision | null;
  features: DspFeatures | null;
  pcm: Float32Array | null;
  reconnectAttempt: number;
  reconnectDelayMs: number;
  lastChunkIndex: number;
};

type SnapFn = (s: StreamSnapshot) => void;

function downsample(input: Float32Array, fromRate: number, toRate: number) {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const outLen = Math.floor(input.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const x = i * ratio;
    const i0 = Math.floor(x);
    const i1 = Math.min(input.length - 1, i0 + 1);
    const t = x - i0;
    out[i] = input[i0] * (1 - t) + input[i1] * t;
  }
  return out;
}

/**
 * Captures mic audio, downsamples to 16 kHz, emits 333 ms hops, keeps a 4 s
 * ring buffer, and replays unsent hops after a socket resume.
 */
export class AudioStreamer {
  readonly bridge = new InferenceBridge();
  private ctx: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private proc: AudioWorkletNode | null = null;
  private stream: MediaStream | null = null;
  private acc: Float32Array = new Float32Array(0);
  private ring = new ChunkRingBuffer(ringCapacity());
  private index = 0;
  private running = false;
  private snapshot: StreamSnapshot = {
    state: "idle",
    chunkIndex: 0,
    buffered: 0,
    decision: null,
    features: null,
    pcm: null,
    reconnectAttempt: 0,
    reconnectDelayMs: 0,
    lastChunkIndex: -1,
  };
  private listeners = new Set<SnapFn>();
  sessionId = "";

  constructor() {
    this.bridge.on((e) => this.onBridge(e));
  }

  onSnapshot(fn: SnapFn) {
    this.listeners.add(fn);
    fn(this.snapshot);
    return () => this.listeners.delete(fn);
  }

  get cloneInject() {
    return this.bridge.cloneInject;
  }
  set cloneInject(v: boolean) {
    this.bridge.cloneInject = v;
  }

  async start(sessionId: string) {
    this.sessionId = sessionId;
    this.index = 0;
    this.ring.clear();
    this.acc = new Float32Array(0);
    this.running = true;

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    const ctx = new AudioContext();
    this.ctx = ctx;
    if (ctx.state === "suspended") await ctx.resume();
    this.source = ctx.createMediaStreamSource(this.stream);
    await ctx.audioWorklet.addModule("/audio-processor.js");
    const proc = new AudioWorkletNode(ctx, "voiceshield-audio-processor");
    this.proc = proc;
    proc.port.onmessage = (event: MessageEvent<Float32Array>) => {
      const pcm = downsample(event.data, ctx.sampleRate, AUDIO_CONFIG.sampleRate);
      this.onAudio(pcm);
    };
    const mute = ctx.createGain();
    mute.gain.value = 0;
    this.source.connect(proc);
    proc.connect(mute);
    mute.connect(ctx.destination);
    await this.bridge.connect(sessionId);
  }

  stop() {
    this.running = false;
    this.bridge.disconnect();
    try {
      this.proc?.disconnect();
      this.source?.disconnect();
      this.stream?.getTracks().forEach((t) => t.stop());
      void this.ctx?.close();
    } catch {
      /* already torn down */
    }
    this.proc = null;
    this.source = null;
    this.stream = null;
    this.ctx = null;
    this.push({ state: "idle", decision: null, pcm: null });
  }

  dropLink() {
    this.bridge.simulateDrop();
  }

  private onAudio(input: Float32Array) {
    if (!this.running) return;
    const merged = new Float32Array(this.acc.length + input.length);
    merged.set(this.acc);
    merged.set(input, this.acc.length);
    this.acc = merged;
    const need = samplesPerChunk();
    while (this.acc.length >= need) {
      const pcm = this.acc.slice(0, need);
      this.acc = this.acc.slice(need);
      const chunk = { index: this.index++, pcm, at: performance.now() };
      this.ring.push(chunk);
      const decision = this.bridge.ingest(pcm, chunk.index, AUDIO_CONFIG.sampleRate);
      this.push({
        chunkIndex: chunk.index,
        buffered: this.ring.size,
        pcm,
        decision: decision ?? this.snapshot.decision,
        lastChunkIndex: this.bridge.lastChunkIndex,
        state: this.bridge.state,
      });
    }
  }

  private onBridge(e: BridgeEvent) {
    if (e.type === "state") {
      this.push({
        state: e.state ?? this.snapshot.state,
        reconnectAttempt: e.attempt ?? this.snapshot.reconnectAttempt,
        reconnectDelayMs: e.delayMs ?? this.snapshot.reconnectDelayMs,
        lastChunkIndex: e.lastChunkIndex ?? this.snapshot.lastChunkIndex,
      });
    }
    if (e.type === "decision") {
      this.push({
        decision: e.decision ?? null,
        features: e.features ?? null,
        chunkIndex: e.chunkIndex ?? this.snapshot.chunkIndex,
        state: "live",
      });
    }
    if (e.type === "resume") {
      const pending = this.ring.since(e.lastChunkIndex ?? -1);
      for (const c of pending) {
        this.bridge.ingest(c.pcm, c.index, AUDIO_CONFIG.sampleRate);
      }
      this.push({
        state: "live",
        buffered: this.ring.size,
        lastChunkIndex: this.bridge.lastChunkIndex,
        reconnectAttempt: 0,
      });
    }
  }

  private push(partial: Partial<StreamSnapshot>) {
    this.snapshot = { ...this.snapshot, ...partial };
    this.listeners.forEach((fn) => fn(this.snapshot));
  }
}
