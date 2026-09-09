export default function ArchitecturePage() {
  return (
    <article className="prose">
      <p className="eyebrow">VSHIELD-TECH-2026-V1</p>
      <h1>Architecture</h1>
      <p>
        Five coupled subsystems sit on the media path. This console runs the same control plane in-browser
        (DSP, Kalman, backoff, ring buffer). Production inference is an INT8 ONNX graph on a GPU Space or CPU
        FastAPI worker at <code>apps/api</code>.
      </p>
      <ol style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--steel)" }}>
        <li>Inbound: SIP / WebRTC / PSTN → 16-bit PCM</li>
        <li>Subsystem 1 — resample + Silero VAD + 250–333 ms ring</li>
        <li>Subsystem 2 — LFCC, bispectrum, F0 / energy trajectory</li>
        <li>Subsystem 3 — RawNet2 + SE-ResNet fused INT8 ONNX</li>
        <li>Subsystem 4 — Kalman over 1.5 s → Green / Amber / Red</li>
        <li>Subsystem 5 — phonemic challenge + policy hooks</li>
      </ol>
      <h2>WebSocket fallback</h2>
      <p>
        On <code>onclose</code> / <code>onerror</code> the client enters <code>reconnecting</code>. Delay is{" "}
        <code>min(1000 · 2^attempt, 30000) · (1 ± 0.2 jitter)</code>. Capture continues into a 4 s circular PCM
        buffer. On resume the client sends <code>last_chunk_index</code> and replays hops after that index.
      </p>
      <h2>GPU posture (Hugging Face Spaces)</h2>
      <ul>
        <li>Docker Space, CUDA 12.1 runtime, pinned torch+cu121 wheels.</li>
        <li>Warm-up: load graph, three dummy hops, expose /health with nvidia-smi + torch.cuda.</li>
        <li>Keep-alive pinger every 3 minutes on /health. Batch size 1, FP16 or INT8.</li>
        <li>Structured logs: hop latency, GPU memory, session id — never PCM.</li>
      </ul>
      <h2>Chunk tuning</h2>
      <p>
        250 ms = 4000 samples. 333 ms ≈ 5333 samples (SIH default). 500 ms = 8000 samples. Demo default is 333 ms
        / 4 s buffer.
      </p>
      <h2>Audit and DPDP</h2>
      <p>
        <code>connection_audit_logs</code> and <code>auth_audit_logs</code> are append-only. Feature vectors are
        not invertible to speech. A demo fails if a waveform file exists at stop.
      </p>
    </article>
  );
}
