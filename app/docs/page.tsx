export default function DocsPage() {
  return (
    <article className="prose">
      <p className="eyebrow">SIH pack</p>
      <h1>Judge script and blueprint</h1>
      <h2>Nine-minute live script</h2>
      <ol>
        <li>Open VoiceShield. State SIH26104 — cloned voices on Indian telephony.</li>
        <li>Start live path. Speak 10 s. Show Green, stable F0, hop latency under 50 ms in-browser.</li>
        <li>Inject cloned stream. C(t) should cross 75% and arm the phonemic challenge.</li>
        <li>Switch Hindi / Tamil prompt. Fail-closed if clone injection is still on.</li>
        <li>Simulate drop. Banner, ring buffer, jittered reconnect, resume from last_chunk_index.</li>
        <li>Sign in. Show vault row, detection timeline, connection audit.</li>
        <li>Close on DPDP: no waveform persisted; only scores, hops, and challenge outcomes.</li>
      </ol>
      <h2>Production stack</h2>
      <ul>
        <li>Frontend — this Next.js app on Vercel, Web Audio, backoff client.</li>
        <li>Backend — FastAPI + WebSocket in <code>apps/api</code> on Render or a GPU Hugging Face Space.</li>
        <li>Data — Supabase Postgres + Auth + RLS (see <code>infra/migrations</code>).</li>
        <li>ML — AASIST / RawNet2 / Wav2Vec2-AASIST / TFPARN.</li>
      </ul>
      <h2>Reconnect parameters</h2>
      <pre>{`baseDelay    = 1000
maxDelay     = 30000
multiplier   = 2
jitter       = 0.2
maxAttempts  = 10
chunkMs      = 333
bufferSec    = 4
green        < 0.35
red          >= 0.75`}</pre>
    </article>
  );
}
