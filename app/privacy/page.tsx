import React from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Lock,
  FileText,
  Server,
  Trash2,
  Cpu,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  EyeOff,
  Scale,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "PRIVACY POLICY & DPDP ACT 2023 COMPLIANCE | VOICESHIELD",
  description: "Enterprise data protection, volatile memory zero-retention architecture, and legal compliance under the Digital Personal Data Protection Act 2023.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "Privacy Policy & DPDP Act 2023 | VoiceShield",
    description: "Enterprise data protection, volatile memory zero-retention architecture, and legal compliance under the Digital Personal Data Protection Act 2023.",
    images: [{ url: "/banner.png", width: 1200, height: 630, alt: "VoiceShield Banner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & DPDP Act 2023 | VoiceShield",
    description: "Enterprise data protection, volatile memory zero-retention architecture, and legal compliance under the Digital Personal Data Protection Act 2023.",
    images: ["/banner.png"],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans pb-24">
      {/* ── Background Cyber Glow ── */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950/60 to-[#030712] -z-10" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Hero Banner Section with Generous Padding ── */}
      <section className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl pt-16 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Top Breadcrumb & Compliance Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 uppercase">
              <Link href="/" className="hover:text-emerald-400 transition-colors">VOICESHIELD</Link>
              <span>/</span>
              <span className="text-emerald-400 font-bold">PRIVACY &amp; DPDP ACT</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                DPDP ACT 2023 CERTIFIED
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-slate-900 text-slate-300 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                ZERO RAW AUDIO STORAGE
              </span>
            </div>
          </div>

          {/* Main Title & Subtitle with Generous Font Gaps */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Scale className="w-3.5 h-3.5" />
              <span>STATUTORY COMPLIANCE SPECIFICATION · AICTE SIH26104</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              PRIVACY POLICY &amp; DATA PROTECTION ARCHITECTURE
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl font-normal">
              VoiceShield is engineered from the ground up for strict privacy-preserving biometric defense. In full alignment with India’s <strong className="text-white font-semibold">Digital Personal Data Protection (DPDP) Act 2023</strong> and the <strong className="text-white font-semibold">CERT-In Cyber Security Directions</strong>, VoiceShield guarantees mathematical non-reconstructibility and ephemeral in-memory processing.
            </p>
          </div>

          {/* Quick Stat Key Takeaways Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">AUDIO RETENTION</span>
              <span className="text-base font-mono font-black text-emerald-400 uppercase block">0 SECONDS (RAM ONLY)</span>
              <p className="text-xs text-slate-400 leading-normal">Destroyed on socket disconnect.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">FEATURE EXTRACTION</span>
              <span className="text-base font-mono font-black text-cyan-400 uppercase block">NON-INVERTIBLE</span>
              <p className="text-xs text-slate-400 leading-normal">LFCC &amp; Bispectral tensors cannot reconstruct voice.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">SOVEREIGN REGION</span>
              <span className="text-base font-mono font-black text-teal-400 uppercase block">INDIA (AP-SOUTH-1)</span>
              <p className="text-xs text-slate-400 leading-normal">Telemetry strictly housed within Indian jurisdiction.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CERT-IN DISCLOSURE</span>
              <span className="text-base font-mono font-black text-emerald-400 uppercase block">&lt; 6 HOURS SLA</span>
              <p className="text-xs text-slate-400 leading-normal">Rapid incident response protocol.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Main Content Container with Wide Layout Spacing ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 space-y-20">

        {/* ── Section 1: Executive Summary & DPDP Act Alignment ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 1.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                EXECUTIVE SUMMARY &amp; STATUTORY ALIGNMENT
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              Under Section 4 and Section 6 of the Digital Personal Data Protection Act (DPDP), 2023, personal data must be processed only for lawful, explicitly stated purposes with verified digital consent and rigorous data minimization principles. VoiceShield acts as an automated, non-invasive threat-detection intermediary between public switched telephone networks (PSTN/SIP) and high-risk terminal endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                PURPOSE LIMITATION
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Voice telemetry is analyzed solely to determine synthetic acoustic artifacts (AI cloning, deepfake audio injection, text-to-speech vocoder harmonics). Under no circumstances is audio analyzed for semantic sentiment, user profanity, transcription profiling, or behavioral advertising.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                STORAGE MINIMIZATION
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Raw acoustic PCM audio chunks are held exclusively in circular FIFO RAM ring-buffers during the active telephony call. As soon as the call session terminates or the WebSocket connection drops, all allocated memory buffers are immediately zeroized using secure OS memory wiping calls.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: Technical Ingestion & Memory Ring-Buffer Lifecycle ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 2.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                EPHEMERAL RAM ARCHITECTURE &amp; ZERO-DISK PROOF
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              Traditional forensics solutions persist recording wav files to disk, creating severe data breach and eavesdropping risks. VoiceShield pioneers an ephemeral, streaming-first architecture.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>IN-MEMORY AUDIO LIFECYCLE BREAKDOWN</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  STAGE 1 · INGESTION (0-40MS)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  250ms PCM chunks at 8,000Hz or 16,000Hz stream via secure WSS (TLS 1.3). Audio is held in a volatile memory ring buffer of maximum 2 seconds capacity.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  STAGE 2 · INFERENCE (40-220MS)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Multi-Domain DSP engine projects the audio into mathematical vectors (LFCC coefficients and phase bispectrum). Raw waveform references are discarded.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-teal-400 uppercase">
                  STAGE 3 · DISPOSAL (220-269MS)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Only the synthetic confidence score (0.00 to 1.00) and forensic metadata hash are transmitted to the SOC. Zero bytes of audio ever touch NVMe or SSD storage.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  CRYPTOGRAPHIC ZEROIZATION GUARANTEE
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The VoiceShield Python backend leverages explicit garbage collection and memory unmapping buffers upon call hangup (<code className="text-emerald-300 font-mono">session.clear_audio_tensors()</code>). Physical RAM pages are wiped before reallocation to prevent side-channel memory dumps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Non-Invertible Feature Extraction ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 3.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                NON-INVERTIBLE FEATURE EXTRACTION (IRREVERSIBLE MATH)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              Even in the theoretical event of a full server RAM capture, VoiceShield features are mathematically one-way. Extracted features cannot be synthesized back into understandable human speech or biometric voiceprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                  LINEAR FREQUENCY CEPSTRAL COEFFICIENTS (LFCC)
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">
                  DISCRETE COSINE TRANSFORM
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                LFCC discards phase spectra and quantizes spectral envelopes into orthogonal cosine bases. The phase loss mathematically prevents inversion back into acoustic pressure waves or intelligible words.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                  HIGHER-ORDER BISPECTRAL PHASE ANALYSIS
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-teal-300">
                  NON-LINEAR TRIPLE CORRELATION
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Measures non-linear quadratic phase coupling across harmonic frequencies. It produces an aggregated 2D scalar surface map that detects vocoder artifacts without retaining phonemic identity.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 4: Data Principal Rights under DPDP Act 2023 ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 4.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                DATA PRINCIPAL STATUTORY RIGHTS (DPDP ACT 2023)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              Every citizen and subscriber whose telephony traffic passes through a VoiceShield-protected carrier or enterprise PBX possesses non-negotiable statutory rights under Indian law.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-emerald-400 font-mono font-black text-xl">01</div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                RIGHT TO ACCESS
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subscribers may request confirmation whether their phone number has been flagged in any forensic fraud incident log within the past 90 days.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-cyan-400 font-mono font-black text-xl">02</div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                RIGHT TO CORRECTION &amp; ERASURE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If a false-positive flag occurred during legitimate telephony usage, the caller can trigger instant deletion of incident telemetry from the SOC dashboard.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-teal-400 font-mono font-black text-xl">03</div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                RIGHT TO GRIEVANCE REDRESSAL
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct access to our dedicated Data Protection Officer (DPO). Mandatory statutory resolution window of 7 business days under DPDP rules.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-emerald-400 font-mono font-black text-xl">04</div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                RIGHT TO NOMINATE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Data Principals may appoint authorized representatives to exercise rights in cases of death, medical incapacity, or legal power of attorney.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 5: Telemetry, Hosting & CERT-In Directives ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 5.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                SOVEREIGN HOSTING &amp; CERT-IN 6-HOUR DISCLOSURE
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              VoiceShield complies with the Ministry of Electronics and Information Technology (MeitY) guidelines on sovereign data residency and mandatory CERT-In reporting.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <Database className="w-4 h-4" />
                  <span>DATA RESIDENCY: MUMBAI (AP-SOUTH-1)</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  All audit logs, operator sessions, and forensic incident hashes are strictly maintained in Tier-4 data centers within the geographical borders of the Republic of India. No metadata is transferred abroad or replicated to cross-border mirror clusters.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>CERT-IN 6-HOUR REPORTING SLA</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pursuant to CERT-In Directive No. 20(3)/2022-CERT-In, any cybersecurity incident, unauthorized access attempts, or coordinated synthetic voice injection campaigns will be reported to the Indian Computer Emergency Response Team within 6 hours of formal detection.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>CRYPTOGRAPHIC AUDIT: SHA-256 HASH CHAINING ACTIVE</span>
              </div>
              <div className="text-slate-500">
                AUDIT LOG RETENTION: 180 DAYS STRICT COMPLIANCE
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 6: Data Protection Officer (DPO) & Redressal ── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                CLAUSE 6.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                GRIEVANCE OFFICER &amp; STATUTORY REDRESSAL
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              For any queries, requests for data verification, or statutory grievances regarding personal biometric telemetry under the DPDP Act 2023, you may contact our designated office:
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1 md:col-span-2">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                OFFICE OF THE DATA PROTECTION OFFICER
              </div>
              <h3 className="text-lg font-bold text-white uppercase">
                VOICESHIELD CYBERSECURITY CELL
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Smart India Hackathon 2026 · AICTE Cyber Security Cell (Problem Statement SIH26104)<br />
                Address: Technology Tower, National Capital Region, New Delhi, India<br />
                Official Grievance Email: <a href="mailto:grievance@voiceshield.internal" className="text-emerald-300 underline underline-offset-4 font-mono">grievance@voiceshield.internal</a>
              </p>
            </div>

            <div className="flex md:justify-end">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
              >
                <span>OPERATOR ACCESS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
