import React from "react";
import Link from "next/link";
import {
  Shield,
  FileCheck,
  PhoneCall,
  Zap,
  Lock,
  AlertOctagon,
  Scale,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  Sliders,
  Radio,
} from "lucide-react";

export const metadata = {
  title: "TERMS OF SERVICE & TELEPHONY ACCEPTABLE USE | VOICESHIELD",
  description: "Operational service agreement, telephony middleware terms, fail-safe protocols, and Smart India Hackathon 2026 evaluation conditions.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans pb-24">
      {/* ── Background Cyber Glow ── */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950/60 to-[#030712] -z-10" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* ── Hero Banner Section with Generous Padding & Spacing ── */}
      <section className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl pt-16 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Breadcrumbs & Operational Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 uppercase">
              <Link href="/" className="hover:text-cyan-400 transition-colors">VOICESHIELD</Link>
              <span>/</span>
              <span className="text-cyan-400 font-bold">TERMS OF SERVICE</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                TELEPHONY SPEC V2.4 ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-slate-900 text-slate-300 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                SIH26104 COMPLIANT
              </span>
            </div>
          </div>

          {/* Main Title & Subtitle with Generous Font Gaps */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Scale className="w-3.5 h-3.5" />
              <span>OPERATIONAL CARRIER &amp; EVALUATION AGREEMENT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              TERMS OF SERVICE &amp; ACCEPTABLE USE POLICY
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl font-normal">
              These terms govern the operational deployment, programmatic API access, SIP trunk interception middleware, and Smart India Hackathon 2026 evaluation usage of the <strong className="text-white font-semibold">VoiceShield Real-Time Audio Deepfake Mitigation System</strong>.
            </p>
          </div>

          {/* Key Operational Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">LATENCY GUARANTEE</span>
              <span className="text-base font-mono font-black text-cyan-400 uppercase block">&lt; 269MS ROUND-TRIP</span>
              <p className="text-xs text-slate-400 leading-normal">Zero human-noticeable telephony lag.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">EMERGENCY PROTOCOL</span>
              <span className="text-base font-mono font-black text-emerald-400 uppercase block">FAIL-OPEN (112 / SOS)</span>
              <p className="text-xs text-slate-400 leading-normal">Uninterrupted emergency life-safety routing.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">FINANCIAL PROTOCOL</span>
              <span className="text-base font-mono font-black text-rose-400 uppercase block">FAIL-CLOSED (HIGH RISK)</span>
              <p className="text-xs text-slate-400 leading-normal">Instant block of suspicious voice fund transfers.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CODEC INVARIANCE</span>
              <span className="text-base font-mono font-black text-teal-400 uppercase block">G.711 / AMR / OPUS</span>
              <p className="text-xs text-slate-400 leading-normal">Robust across PSTN, VoIP &amp; 4G/5G VoLTE.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Main Content Container with Wide Spacing ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 space-y-20">

        {/* ── Clause 1: Permitted Scope & Architecture ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 1.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                AUTHORIZED DEPLOYMENT SCOPE &amp; TELEPHONY ARCHITECTURE
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              VoiceShield is strictly authorized for deployment as an inline or tap audio inspection filter across authenticated telecommunication networks, enterprise PBXs, and banking voice-biometric authentication channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                CARRIER &amp; SIP TRUNK INTEGRATION
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Telecommunications service providers may integrate VoiceShield via Session Border Controllers (SBCs), SIP REC protocols, or media-forking WebSocket gateways. Inspection is confined strictly to acoustic biometric verification signals.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                BANKING FRAUD PREVENTION (IVR &amp; CONTACT CENTERS)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Financial institutions utilizing VoiceShield for wire transfer authorization, high-net-worth customer callback verification, or OTP-over-voice validation must enforce real-time mitigation webhooks to freeze suspect transactions before fund release.
              </p>
            </div>
          </div>
        </section>

        {/* ── Clause 2: Dual Fail-Safe Standard ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 2.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                REAL-TIME ACTIVE MITIGATION &amp; DUAL FAIL-SAFE STANDARD
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              To guarantee zero disruption to public safety while stopping sophisticated deepfake scams, all VoiceShield instances adhere to the deterministic Dual Fail-Safe protocol:
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Fail Open */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    CRITICAL LIFE-SAFETY · EMERGENCY (112 / 100 / SOS)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold">
                    FAIL-OPEN
                  </span>
                </div>
                <h3 className="text-base font-bold text-white uppercase">
                  UNINTERRUPTED EMERGENCY ROUTING
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Calls originating from or terminating at emergency responder gateways must never be severed, delayed, or degraded. If backend network congestion or hardware stress exceeds 269ms, emergency audio bypasses inspection instantly.
                </p>
              </div>

              {/* Fail Closed */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    FINANCIAL TRANSACTIONS &amp; HIGH-RISK WIRES
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[10px] font-bold">
                    FAIL-CLOSED
                  </span>
                </div>
                <h3 className="text-base font-bold text-white uppercase">
                  ACTIVE MITIGATION &amp; CHALLENGE GATE
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When synthetic probability exceeds 0.85 (High Risk threshold), VoiceShield transmits an immediate SIP BYE or automated phonemic challenge injection (<code className="text-rose-300 font-mono">MITIGATION: CHALLENGE_REQUIRED</code>), requiring the caller to speak random non-linear words.
                </p>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase">KALMAN FILTER SMOOTHING: WINDOW SIZE = 5 CHUNKS</span>
              <span className="text-cyan-400 font-bold uppercase">FALSE-POSITIVE SUPPRESSION ACTIVE</span>
            </div>
          </div>
        </section>

        {/* ── Clause 3: Smart India Hackathon Evaluation License ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 3.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                SMART INDIA HACKATHON 2026 EVALUATION LICENSE
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              Evaluation judges, ministry officials, and academic mentors reviewing Problem Statement <strong className="text-white font-semibold">SIH26104</strong> (AICTE Cyber Security Cell) are granted full non-exclusive rights to inspect live operational metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                RIGHT 01 · INSTANT DEMO
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                ONE-CLICK JUDGE BYPASS
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Judges can trigger instantaneous demo access from the login screen without requiring pre-registered carrier credentials.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                RIGHT 02 · FORENSIC AUDIT
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                OFFICIAL FIR EVIDENCE PDF
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full programmatic ability to generate court-admissible Indian Evidence Act Section 65B-compliant forensic deepfake audit certificates.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-xs font-mono font-bold text-teal-400 uppercase">
                RIGHT 03 · ADVERSARIAL STRESS
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                STREAM INGESTION TESTING
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Judges may inject synthetic audio (ElevenLabs, Bark, Tortoise, SV2TTS) into the live WebSocket to stress-test real-time classification.
              </p>
            </div>
          </div>
        </section>

        {/* ── Clause 4: Telephony Compliance & Indian Regulations ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 4.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                TELECOMMUNICATIONS COMPLIANCE &amp; STATUTORY RULES
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              VoiceShield complies with all prevailing statutory guidelines issued by the Department of Telecommunications (DoT), the Telecom Regulatory Authority of India (TRAI), and the Information Technology Act 2000.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  TELECOMMUNICATIONS ACT 2023 &amp; TELEGRAPH RULES
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  VoiceShield is classified as automated cybersecurity defense equipment. Because it extracts non-invertible mathematical features without recording conversation audio, it does not constitute unauthorized wiretapping under Rule 419A of the Indian Telegraph Rules.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  TRAI UNSOLICITED COMMERCIAL COMMUNICATIONS (UCC)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In conjunction with TRAI DLT headers, VoiceShield can detect unauthorized AI robocalls and automated pre-recorded voice synthesis spoofing legitimate banking SMS headers.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <span className="uppercase">INDEMNITY: ZERO CIVIL LIABILITY FOR VALID PROTOCOL ACTIONS</span>
              <span className="text-emerald-400 font-bold uppercase">REVISED SEPTEMBER 2026</span>
            </div>
          </div>
        </section>

        {/* ── Clause 5: Operational Access & Action ── */}
        <section className="space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white uppercase">
                READY TO OPERATE OR EVALUATE VOICESHIELD?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Connect your SIP trunk, launch the live browser microphone evaluation, or inspect live telemetry on the Security Operations Center dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/demo"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                LIVE MIC DEMO
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all active:scale-95"
              >
                <span>OPERATOR SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
