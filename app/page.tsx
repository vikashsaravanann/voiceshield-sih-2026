import Link from "next/link";
import { ArrowRight, Gauge, Lock, Radio, Shield, Waypoints } from "lucide-react";

export default function Home() {
  return (
    <div className="hero">
      <p className="eyebrow">SIH 2026 · SIH26104 · AICTE Cyber Security Cell</p>
      <h1>Detect cloned voices before the transfer leaves the bank.</h1>
      <p className="lede">
        VoiceShield inspects live SIP, VoIP and browser media in 333 ms hops, scores neural-vocoder artefacts,
        and challenges an Amber speaker before a privileged transfer leaves the bank. Raw audio never hits disk.
      </p>
      <div className="cta">
        <Link href="/demo" className="btn btn-primary">
          Open live console <ArrowRight size={16} />
        </Link>
        <Link href="/architecture" className="btn btn-ghost">
          Read the architecture
        </Link>
      </div>

      <dl className="metrics">
        {[
          ["≤ 3.2%", "EER · 16 kHz reference"],
          ["≤ 5.4%", "EER · G.711 / AMR-NB"],
          ["269 ms", "Decision round-trip"],
          ["< 0.8%", "False positives in office noise"],
        ].map(([k, v]) => (
          <div className="card" key={v}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="grid3">
        {[
          {
            icon: Radio,
            title: "Streaming media path",
            body: "16 kHz capture, 333 ms hops, 4 s ring buffer, WebSocket control plane with exponential backoff and last_chunk_index resume.",
          },
          {
            icon: Gauge,
            title: "DSP + dual-path scoring",
            body: "LFCC-style linear bands, F0 lock, harmonicity, vocoder stair-step jitter. Kalman-smoothed C(t) maps to Green / Amber / Red.",
          },
          {
            icon: Lock,
            title: "Active mitigation",
            body: "Unpredictable phonemic prompts in English, Hindi and Tamil. Human latency vs 800–2500 ms live-conversion stacks.",
          },
        ].map((c) => (
          <article className="card" key={c.title} style={{ padding: "1.25rem" }}>
            <c.icon size={20} color="var(--accent)" strokeWidth={1.6} />
            <h2>{c.title}</h2>
            <p>{c.body}</p>
          </article>
        ))}
      </div>

      <section style={{ marginTop: "4rem" }}>
        <p className="eyebrow">Five subsystems</p>
        <h2 style={{ margin: "0.4rem 0 0", fontSize: "1.4rem" }}>From packet to policy in one hop budget</h2>
        <div className="pipe">
          {[
            ["01", "Capture", "SIP / WebRTC / mic → 16 kHz PCM. Silero-class VAD. 250–333 ms hops."],
            ["02", "DSP", "LFCC banks, F0 lock, harmonicity, bispectrum, stair-step jitter."],
            ["03", "Score", "RawNet2 + SE-ResNet fused INT8. Browser demo uses the same cues."],
            ["04", "Kalman", "C(t) over 1.5 s. Green < 0.35 · Amber · Red ≥ 0.75."],
            ["05", "Act", "EN / HI / TA challenge. Fail closed. Persist scores, never PCM."],
          ].map(([n, t, b]) => (
            <article key={n}>
              <div className="n">{n}</div>
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Shield size={20} color="var(--accent)" />
          <div>
            <h2>National impact</h2>
            <p>
              CEO-fraud RTGS instructions, IVR voiceprint bypass, and virtual-kidnapping calls all ride the same
              narrowband channel. VoiceShield is specified for that channel — not a studio file — and aligns with
              I4C / CERT-In: stop the transfer, keep the waveform off durable storage, leave an audit object of
              scores and challenge outcomes.
            </p>
            <Link href="/docs" style={{ display: "inline-flex", gap: 8, marginTop: 16, color: "var(--steel)", fontSize: 14 }}>
              SIH pitch pack <Waypoints size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
