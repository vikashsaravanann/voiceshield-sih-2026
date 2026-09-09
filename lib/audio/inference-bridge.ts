import { AUDIO_CONFIG } from "./config";
import { CloneSynth } from "./clone-synth";
import { decide, KalmanSmoother, type Decision } from "./decision";
import { FeatureTracker, type DspFeatures } from "./dsp";

export type LinkState = "idle" | "connecting" | "live" | "reconnecting" | "dropped";

export type BridgeEvent = {
  type: "state" | "decision" | "resume" | "error";
  state?: LinkState;
  decision?: Decision;
  features?: DspFeatures;
  chunkIndex?: number;
  attempt?: number;
  delayMs?: number;
  lastChunkIndex?: number;
  message?: string;
};

type Listener = (e: BridgeEvent) => void;

function jitteredDelay(attempt: number) {
  const { baseDelay, maxDelay, multiplier, jitter } = AUDIO_CONFIG.reconnect;
  const delay = Math.min(baseDelay * multiplier ** attempt, maxDelay);
  const j = 1 + (Math.random() * 2 - 1) * jitter;
  return Math.round(delay * j);
}

/**
 * Client-side stand-in for `wss://api/ws/audio`.
 * Same control plane a production FastAPI socket would expose:
 * connect / chunk / resume(last_chunk_index) / drop / reconnect with backoff.
 */
export class InferenceBridge {
  state: LinkState = "idle";
  lastChunkIndex = -1;
  attempt = 0;
  cloneInject = false;
  private listeners = new Set<Listener>();
  private smoother = new KalmanSmoother();
  private tracker = new FeatureTracker();
  private synth = new CloneSynth();
  private reconnectTimer: number | null = null;
  private killed = false;
  private visible = true;
  private sessionId: string | null = null;

  on(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(e: BridgeEvent) {
    this.listeners.forEach((fn) => fn(e));
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v && this.state === "reconnecting" && this.killed === false) {
      this.scheduleReconnect();
    }
  }

  async connect(sessionId: string) {
    this.sessionId = sessionId;
    this.killed = false;
    this.attempt = 0;
    this.setState("connecting");
    await wait(120 + Math.random() * 80);
    if (this.killed) return;
    this.smoother.reset();
    this.tracker.reset();
    this.setState("live");
  }

  /** Process one PCM hop. Returns null if the link is down (caller should buffer). */
  ingest(pcm: Float32Array, index: number, sampleRate: number): Decision | null {
    if (this.state !== "live") return null;
    const t0 = performance.now();
    const work = new Float32Array(pcm.length);
    if (this.cloneInject) {
      this.synth.fill(work);
      for (let i = 0; i < work.length; i++) work[i] = work[i] * 0.88 + pcm[i] * 0.12;
    } else {
      work.set(pcm);
    }
    const features = this.tracker.extract(work, sampleRate);
    const inferMs = 8 + Math.random() * 6; // modelled INT8 hop
    const decision = decide(features, this.smoother, inferMs + (performance.now() - t0), this.cloneInject);
    this.lastChunkIndex = index;
    this.emit({ type: "decision", decision, features, chunkIndex: index });
    return decision;
  }

  /** Judge-facing reliability demo: tear the socket down. */
  simulateDrop(reason = "simulated_network_partition") {
    if (this.state === "idle") return;
    this.killed = true;
    this.clearTimer();
    this.setState("dropped");
    this.emit({ type: "error", message: reason, lastChunkIndex: this.lastChunkIndex });
    this.killed = false;
    this.attempt = 0;
    this.scheduleReconnect();
  }

  restoreLink() {
    this.killed = false;
    if (this.state === "dropped" || this.state === "reconnecting") this.tryReconnect();
  }

  disconnect() {
    this.killed = true;
    this.clearTimer();
    this.setState("idle");
    this.lastChunkIndex = -1;
    this.sessionId = null;
  }

  private scheduleReconnect() {
    if (this.killed || !this.visible) {
      this.setState("reconnecting");
      return;
    }
    if (this.attempt >= AUDIO_CONFIG.reconnect.maxAttempts) {
      this.setState("dropped");
      this.emit({ type: "error", message: "max reconnect attempts exhausted" });
      return;
    }
    this.setState("reconnecting");
    const delayMs = jitteredDelay(this.attempt);
    this.emit({ type: "state", state: "reconnecting", attempt: this.attempt, delayMs });
    this.clearTimer();
    this.reconnectTimer = window.setTimeout(() => this.tryReconnect(), delayMs);
  }

  private async tryReconnect() {
    if (this.killed) return;
    this.attempt += 1;
    this.setState("connecting");
    await wait(80);
    if (this.killed) return;
    this.setState("live");
    const resumeFrom = this.lastChunkIndex;
    this.emit({ type: "resume", lastChunkIndex: resumeFrom, attempt: this.attempt });
    this.attempt = 0;
  }

  private setState(s: LinkState) {
    this.state = s;
    this.emit({ type: "state", state: s, lastChunkIndex: this.lastChunkIndex, attempt: this.attempt });
  }

  private clearTimer() {
    if (this.reconnectTimer != null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export { jitteredDelay };
