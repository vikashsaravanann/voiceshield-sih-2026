export default function BriefPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_42%)]" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-8">
        <header className="space-y-4 border-b border-slate-800 pb-10">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-emerald-400">
            VoiceShield · PRODUCT BRIEF
          </p>
          <h1 className="text-4xl font-extrabold tracking-[0.12em] text-white">
            ARCHITECTURE AND LIVE SCRIPT
          </h1>
          <p className="max-w-2xl text-sm leading-7 tracking-wide text-slate-400">
            Product brief for VoiceShield — a Logic Intelligence Technologies product. Architecture, prevention loop, and the live demo script in one page so evaluators see the full stack without splitting the pack.
          </p>
        </header>
        <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-sm font-bold tracking-[0.22em] text-emerald-300">FIVE SUBSYSTEMS</h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              ["01", "INGEST", "SIP / WebRTC / PSTN resampled to 16-bit PCM at 16 kHz."],
              ["02", "WINDOW", "Silero VAD plus a 250–333 ms ring. Demo default is 333 ms."],
              ["03", "FEATURES", "LFCC, F0, harmonicity, phase continuity, energy slope."],
              ["04", "DECIDE", "Kalman fusion over 1.5 s → GREEN / AMBER / RED."],
              ["05", "ACT", "Phonemic challenge, block, and append-only audit. No waveform on disk."],
            ].map(([n, title, copy]) => (
              <li key={n} className="space-y-2 rounded-xl border border-slate-800 bg-[#070b12] p-5">
                <p className="text-[10px] tracking-[0.24em] text-emerald-500">{n}</p>
                <h3 className="text-sm font-extrabold tracking-[0.18em] text-white">{title}</h3>
                <p className="text-sm leading-6 tracking-wide text-slate-400">{copy}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-sm font-bold tracking-[0.22em] text-emerald-300">NINE-MINUTE SCRIPT</h2>
          <ol className="space-y-4">
            {[
              "Open VoiceShield. State the product mission — cloned voices on telephony and enterprise channels.",
              "Start the live path. Speak ten seconds. Show GREEN and hop latency.",
              "Inject the cloned stream. Risk should cross 75% and arm the challenge.",
              "Switch Hindi / Tamil prompt. Fail-closed if clone injection stays on.",
              "Simulate a drop. Banner, ring buffer, jittered reconnect, resume.",
              "Open VAULT. Show session row and forensic export.",
              "Close on DPDP: no waveform persisted — only scores and outcomes.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4 text-sm leading-7 tracking-wide text-slate-300">
                <span className="font-mono text-emerald-400">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="grid gap-5 md:grid-cols-3">
          {[
            ["FRONTEND", "Next.js on Vercel. Web Audio. Exponential backoff."],
            ["WORKER", "FastAPI WebSocket in apps/api. Render or GPU Space."],
            ["STORE", "Supabase Auth + RLS. Feature vectors only. Never PCM."],
          ].map(([title, copy]) => (
            <article key={title} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h2 className="text-sm font-extrabold tracking-[0.2em] text-white">{title}</h2>
              <p className="text-sm leading-6 tracking-wide text-slate-400">{copy}</p>
            </article>
          ))}
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-sm font-bold tracking-[0.22em] text-emerald-300">LOGIC INTELLIGENCE TECHNOLOGIES · PRODUCT OWNERSHIP</h2>
          <p className="text-sm leading-7 tracking-wide text-slate-400">
            VoiceShield is designed, built, and operated by Logic Intelligence Technologies as an enterprise AI security product — not a separate company.
          </p>
          <ul className="space-y-3 text-sm leading-7 tracking-wide text-slate-300">
            <li><span className="text-emerald-400 font-semibold">Product &amp; architecture</span> — real-time anti-spoofing pipeline, WebSocket inference path, forensic and SOC surfaces.</li>
            <li><span className="text-emerald-400 font-semibold">Engineering</span> — Next.js console, FastAPI inference host, AASIST / feature fusion, challenge-response, audit logging.</li>
            <li><span className="text-emerald-400 font-semibold">Security &amp; compliance</span> — DPDP-aligned defaults, no waveform on disk, server-side secrets only, enterprise evaluation access control.</li>
            <li><span className="text-emerald-400 font-semibold">Go-to-market</span> — demo request workflow on logicintelligencetechnologies.in, partner pilots, and production deployment planning.</li>
          </ul>
          <p className="text-xs tracking-wide text-slate-500">
            Company: Logic Intelligence Technologies · Product: VoiceShield · Domain: www.logicintelligencetechnologies.in/voice-shield
          </p>
        </section>

      </div>
    </div>
  );
}
