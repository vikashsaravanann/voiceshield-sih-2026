"use client";

import { AUDIO_CONFIG, CHALLENGE_PHRASES, type ChallengeLang } from "@/lib/audio/config";
import { AudioStreamer, type StreamSnapshot } from "@/lib/audio/streamer";
import type { Decision } from "@/lib/audio/decision";
import { useEffect, useRef, useState } from "react";
import { Activity, AudioLines, Mic, Radio, ShieldAlert, Unplug } from "lucide-react";

const RISK_COLOR = { green: "var(--ok)", amber: "var(--warn)", red: "var(--danger)" } as const;
const LINK_LABEL: Record<StreamSnapshot["state"], string> = {
  idle: "Idle",
  connecting: "Connecting",
  live: "Live",
  reconnecting: "Reconnecting",
  dropped: "Dropped",
};

export function LiveConsole() {
  const streamerRef = useRef<AudioStreamer | null>(null);
  const [snap, setSnap] = useState<StreamSnapshot | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloneOn, setCloneOn] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [hops, setHops] = useState(0);
  const [drops, setDrops] = useState(0);
  const [resumes, setResumes] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [challenge, setChallenge] = useState<{
    lang: ChallengeLang;
    armedAt: number;
    resolved?: boolean;
    passed?: boolean;
  } | null>(null);
  const amberStreak = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);
  const lastHop = useRef(-1);

  useEffect(() => {
    const s = new AudioStreamer();
    streamerRef.current = s;
    const offSnap = s.onSnapshot((next) => {
      setSnap({ ...next });
      if (next.decision && next.state === "live" && next.chunkIndex !== lastHop.current) {
        lastHop.current = next.chunkIndex;
        setHistory((h) => {
          const n = [...h, next.decision!.smoothed];
          return n.length > 96 ? n.slice(-96) : n;
        });
        setHops((n) => n + 1);
        if (next.decision.risk !== "green") amberStreak.current += 1;
        else amberStreak.current = 0;
        if (amberStreak.current >= AUDIO_CONFIG.challengeAfterHops) {
          setChallenge((c) => c ?? { lang: "en", armedAt: performance.now() });
        }
      }
      drawSpec(canvasRef.current, next.pcm);
      drawWave(waveRef.current, next.pcm);
    });
    const offBridge = s.bridge.on((e) => {
      if (e.type === "error") setDrops((n) => n + 1);
      if (e.type === "resume") setResumes((n) => n + 1);
    });
    const vis = () => s.bridge.setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => {
      offSnap();
      offBridge();
      document.removeEventListener("visibilitychange", vis);
      s.stop();
    };
  }, []);

  async function start() {
    setError(null);
    setHistory([]);
    setHops(0);
    setDrops(0);
    setResumes(0);
    setChallenge(null);
    amberStreak.current = 0;
    const id = crypto.randomUUID();
    setSessionId(id);
    try {
      await streamerRef.current?.start(id);
      setRunning(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Microphone permission is required for the live path.");
    }
  }

  function stop() {
    streamerRef.current?.stop();
    setRunning(false);
  }

  function toggleClone() {
    const next = !cloneOn;
    setCloneOn(next);
    if (streamerRef.current) streamerRef.current.cloneInject = next;
  }

  function drop() {
    streamerRef.current?.dropLink();
  }

  function resolveChallenge(passed: boolean) {
    setChallenge((c) => (c ? { ...c, resolved: true, passed } : c));
    amberStreak.current = 0;
  }

  const d: Decision | null = snap?.decision ?? null;
  const risk = d?.risk ?? "green";
  const pct = Math.round((d?.smoothed ?? 0) * 100);

  return (
    <div>
      <div className="row">
        {!running ? (
          <button type="button" className="btn btn-primary" onClick={() => void start()}>
            <Mic size={16} /> Start live path
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={stop}>
            Stop session
          </button>
        )}
        <button type="button" className={cloneOn ? "btn btn-danger" : "btn btn-ghost"} disabled={!running} onClick={toggleClone}>
          <ShieldAlert size={16} /> {cloneOn ? "Clone injection on" : "Inject cloned stream"}
        </button>
        <button type="button" className="btn btn-ghost" disabled={!running} onClick={drop}>
          <Unplug size={16} /> Simulate drop
        </button>
        <p className="hint">PCM stays in RAM. Sign in after Supabase is wired to persist the vault.</p>
      </div>
      {error ? <p className="err">{error}</p> : null}

      <div className="board">
        <section className="card">
          <p className="eyebrow">Spoof probability</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
            <p className="pct" style={{ color: RISK_COLOR[risk] }}>
              {pct}
              <span style={{ fontSize: 18, color: "var(--muted)" }}>%</span>
            </p>
            <span className="badge" style={{ background: `color-mix(in oklab, ${RISK_COLOR[risk]} 18%, transparent)`, color: RISK_COLOR[risk] }}>
              {risk === "green" ? "Verified human" : risk === "amber" ? "Suspicious / challenge" : "Confirmed spoof"}
            </span>
          </div>
          <div className="bar">
            <span style={{ width: `${pct}%`, background: RISK_COLOR[risk] }} />
          </div>
          <dl className="stats">
            <div>
              <dt>Hop latency</dt>
              <dd>{d ? `${d.latencyMs.toFixed(1)} ms` : "—"}</dd>
            </div>
            <div>
              <dt>Chunks</dt>
              <dd>{hops}</dd>
            </div>
            <div>
              <dt>Link</dt>
              <dd>{snap ? LINK_LABEL[snap.state] : "Idle"}</dd>
            </div>
            <div>
              <dt>Ring buffer</dt>
              <dd>{snap?.buffered ?? 0} hops</dd>
            </div>
            <div>
              <dt>Drops</dt>
              <dd>{drops}</dd>
            </div>
            <div>
              <dt>Resumes</dt>
              <dd>{resumes}</dd>
            </div>
          </dl>
          {snap?.state === "reconnecting" || snap?.state === "connecting" ? (
            <p className="hint" style={{ marginTop: 12, color: "var(--warn)" }}>
              {snap.state === "connecting" ? "Bringing the inference link up…" : "Connection lost — reconnecting"}
              {snap.reconnectDelayMs ? ` in ${snap.reconnectDelayMs} ms` : ""}
              {snap.reconnectAttempt ? ` (attempt ${snap.reconnectAttempt})` : ""}. Ring holds the last {AUDIO_CONFIG.bufferDurationSec}s.
            </p>
          ) : null}
        </section>
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <p className="eyebrow">
              <AudioLines size={14} style={{ verticalAlign: "middle" }} /> Waveform · 16 kHz
            </p>
            <p className="eyebrow">{AUDIO_CONFIG.chunkMs} ms hops</p>
          </div>
          <canvas ref={waveRef} width={800} height={80} style={{ height: 64 }} />
          <p className="eyebrow" style={{ marginTop: 16 }}>
            <Activity size={14} style={{ verticalAlign: "middle" }} /> Linear spectrogram
          </p>
          <canvas ref={canvasRef} width={800} height={160} style={{ height: 144, marginTop: 8 }} />
          <Sparkline values={history} />
        </section>
      </div>

      <div className="board" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
        <section className="card">
          <p className="eyebrow">Explainability</p>
          <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
            {(d?.markers ?? ["Awaiting active speech"]).map((m) => (
              <li key={m} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--accent)", marginTop: 7 }} />
                {m}
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <p className="eyebrow">Phonemic challenge</p>
          {!challenge ? (
            <p className="hint" style={{ marginTop: 12 }}>
              Armed when Kalman-smoothed C(t) stays Amber/Red for {AUDIO_CONFIG.challengeAfterHops} hops. Inject a clone to trip it.
            </p>
          ) : (
            <div>
              <p style={{ fontSize: 14 }}>Read exactly:</p>
              <p style={{ background: "var(--elevated)", padding: "12px", borderRadius: 8, fontWeight: 500 }}>
                “{CHALLENGE_PHRASES[challenge.lang]}”
              </p>
              <div className="row" style={{ marginTop: 8 }}>
                {(Object.keys(CHALLENGE_PHRASES) as ChallengeLang[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={challenge.lang === lang ? "btn btn-primary" : "btn btn-ghost"}
                    style={{ minHeight: 32, padding: "0.3rem 0.75rem", fontSize: 12 }}
                    onClick={() => setChallenge({ ...challenge, lang })}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              {challenge.resolved ? (
                <p style={{ color: challenge.passed ? "var(--ok)" : "var(--danger)", fontSize: 14 }}>
                  {challenge.passed ? "Human latency + score returned to Green." : "Held — clone-like latency or residual spoof score."}
                </p>
              ) : (
                <div className="row" style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => resolveChallenge(!cloneOn && (d?.smoothed ?? 1) < 0.45)}
                  >
                    Record response
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => resolveChallenge(false)}>
                    Fail closed
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <p className="hint" style={{ marginTop: 16, fontFamily: "var(--mono)" }}>
        Session {sessionId ? sessionId.slice(0, 8) : "—"} · last_chunk_index {snap?.lastChunkIndex ?? -1} ·{" "}
        <Radio size={12} style={{ verticalAlign: "middle" }} /> {AUDIO_CONFIG.reconnect.baseDelay}ms base · ×
        {AUDIO_CONFIG.reconnect.multiplier} · jitter {AUDIO_CONFIG.reconnect.jitter * 100}% · max {AUDIO_CONFIG.reconnect.maxAttempts}
      </p>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 800;
  const h = 56;
  if (values.length < 2) return <div style={{ marginTop: 12, height: 56, background: "var(--elevated)", borderRadius: 8 }} />;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - v * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ marginTop: 12, height: 56, width: "100%" }}>
      <polyline fill="none" stroke="var(--accent)" strokeWidth="1.5" points={pts} />
    </svg>
  );
}

function drawWave(canvas: HTMLCanvasElement | null, pcm: Float32Array | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.fillStyle = "#0c121a";
  ctx.fillRect(0, 0, width, height);
  if (!pcm) return;
  ctx.strokeStyle = "#5eead4";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  const step = Math.max(1, Math.floor(pcm.length / width));
  for (let x = 0; x < width; x++) {
    const s = pcm[x * step] ?? 0;
    const y = height / 2 + s * (height * 0.42);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawSpec(canvas: HTMLCanvasElement | null, pcm: Float32Array | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  if (!pcm) {
    ctx.fillStyle = "#0c121a";
    ctx.fillRect(0, 0, width, height);
    return;
  }
  const img = ctx.getImageData(1, 0, width - 1, height);
  ctx.putImageData(img, 0, 0);
  const bins = 64;
  const slice = Math.floor(pcm.length / bins);
  for (let y = 0; y < height; y++) {
    const bin = Math.floor((1 - y / height) * (bins - 1));
    let e = 0;
    const start = bin * slice;
    for (let i = 0; i < slice; i++) e += Math.abs(pcm[start + i] ?? 0);
    const v = Math.min(1, e / (slice * 0.08));
    ctx.fillStyle = `rgb(${Math.floor(20 + v * 80)},${Math.floor(40 + v * 180)},${Math.floor(50 + v * 160)})`;
    ctx.fillRect(width - 1, y, 1, 1);
  }
}
