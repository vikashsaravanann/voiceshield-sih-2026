import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Activity,
  Languages,
  WifiOff,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "VoiceShield | AI Anti-Spoofing for Telephony",
  description:
    "Detect the clone. Protect the conversation. Real-time AI voice-cloning detection for Indian telecoms and BFSI networks. SIH 2026 — Problem ID SIH26104.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield | AI Anti-Spoofing for Telephony",
    description:
      "Detect the clone. Protect the conversation. Real-time AI voice-cloning detection for Indian telecoms and BFSI networks. SIH 2026 — Problem ID SIH26104.",
    images: [{ url: "/banner.png", width: 1200, height: 630, alt: "VoiceShield Banner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield | AI Anti-Spoofing for Telephony",
    description:
      "Detect the clone. Protect the conversation. Real-time AI voice-cloning detection for Indian telecoms and BFSI networks. SIH 2026 — Problem ID SIH26104.",
    images: ["/banner.png"],
  },
};

export default function HomePage() {
  // Performance: Keep this page static to ensure instant LCP times.

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Banner - Added after user feedback to make SIH branding prominent */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 py-2.5 px-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SMART INDIA HACKATHON 2026 | PROBLEM ID: SIH26104 | AICTE CYBER SECURITY CELL</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs text-slate-300 font-mono mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Production-Grade Telephony Voice Anti-Spoofing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Detect the clone. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Protect the conversation.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Real-time AI voice cloning detection and active prevention for Indian telecommunication and BFSI networks. Sub-250ms latency with zero disk retention.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/demo"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>START LIVE DEMO</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-mono font-bold text-xs tracking-widest uppercase transition-all active:scale-95"
          >
            SOC DASHBOARD
          </Link>
        </div>
      </section>

      {/* Target Metrics */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 block mb-1">
              &lt; 250 ms
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              END-TO-END LATENCY
            </span>
          </div>
          <div className="p-4">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-300 block mb-1">
              &lt; 5.4%
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              TELEPHONY EER (G.711)
            </span>
          </div>
          <div className="p-4">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400 block mb-1">
              0 BYTES
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              AUDIO ON DISK (DPDP)
            </span>
          </div>
          <div className="p-4">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 block mb-1">
              100%
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              RLS AUDIT LOGGED
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            DEFENSE ARCHITECTURE
          </span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">ENGINEERED FOR INDIAN VOICE SECURITY</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">STREAMING WEBSOCKET INFERENCE</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              333ms raw PCM audio hops evaluated via hybrid DSP and deep attention heads in volatile RAM without blocking.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">EXPLAINABLE AI SPECTROGRAM</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Waterfall spectral heatmaps surface plain-English anomaly markers like unnatural high-frequency energy and phase variance.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">MULTILINGUAL CHALLENGE-RESPONSE</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unpredictable phonemic phrases in Hindi, Tamil, and English that commercial voice clones cannot articulate in real time.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">RESILIENT JITTERED FALLBACK</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              4-second circular ring buffer prevents packet loss during network severance, resuming seamlessly with monotonic chunk tracking.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">APPEND-ONLY RLS AUDIT TRAIL</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every detection event, connection drop, and auth challenge logged to Supabase Postgres protected by strict Row-Level Security.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">ZERO RAW AUDIO PERSISTENCE</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Strict compliance with Digital Personal Data Protection (DPDP) Act. All feature tensors processed in ephemeral RAM.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
