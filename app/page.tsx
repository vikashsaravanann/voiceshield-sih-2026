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
  title: "VoiceShield | AI-Powered Voice Security & Compliance Intelligence",
  description:
    "VoiceShield — an AI security product by Logic Intelligence Technologies Pvt. Ltd. Analyze eligible voice interactions for configurable fraud-risk, security, compliance and quality signals, with structured evidence designed for enterprise workflows.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield | AI-Powered Voice Security & Compliance Intelligence",
    description:
      "An AI security product by Logic Intelligence Technologies Pvt. Ltd. Configurable fraud-risk, security, compliance and quality signals with structured evidence for enterprise workflows.",
    images: [{ url: "/banner.png", width: 1200, height: 630, alt: "VoiceShield Banner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield | AI-Powered Voice Security & Compliance Intelligence",
    description:
      "An AI security product by Logic Intelligence Technologies Pvt. Ltd. Voice security and compliance intelligence for enterprise workflows.",
    images: ["/banner.png"],
  },
};

const CORPORATE_REQUEST =
  "https://www.logicintelligencetechnologies.in/voice-shield/request";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 py-2.5 px-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            A LOGIC INTELLIGENCE TECHNOLOGIES PRODUCT | AI SECURITY &amp; VOICE
            FRAUD INTELLIGENCE
          </span>
        </div>
      </div>

      <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs text-slate-300 font-mono mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI-Powered Voice Security &amp; Compliance Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Detect the clone. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Protect the conversation.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Analyze eligible voice interactions for configurable fraud-risk,
          security, compliance and quality signals, with structured evidence
          designed for enterprise workflows. Built for telecom, BFSI, BPO and
          high-volume voice operations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={CORPORATE_REQUEST}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>REQUEST ACCESS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link
            href="/architecture"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-mono font-bold text-xs tracking-widest uppercase transition-all active:scale-95"
          >
            EXPLORE PLATFORM
          </Link>
          <Link
            href="/docs"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 font-mono font-bold text-xs tracking-widest uppercase transition-all active:scale-95"
          >
            VIEW API / DOCS
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-800/80 bg-slate-900/40 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 block mb-1">
              REAL-TIME
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              DETECTION PATH
            </span>
          </div>
          <div className="p-4">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-teal-300 block mb-1">
              STRUCTURED
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              EVIDENCE OUTPUT
            </span>
          </div>
          <div className="p-4">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-400 block mb-1">
              CONFIGURABLE
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              RETENTION POLICY
            </span>
          </div>
          <div className="p-4">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 block mb-1">
              AUDIT-ORIENTED
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
              RLS LOGGING
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            DEFENSE ARCHITECTURE
          </span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            ENGINEERED FOR ENTERPRISE VOICE SECURITY
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
            VoiceShield is a product of Logic Intelligence Technologies Pvt.
            Ltd. Capabilities below describe the product architecture; live
            production behaviour depends on deployed models, hosts and
            configuration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">
              STREAMING WEBSOCKET INFERENCE
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Chunked PCM audio evaluated via feature extraction and a
              latency-focused model path. Designed so large LLM analysis is not
              placed in the real-time detector loop.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">
              EXPLAINABLE SPECTRAL SIGNALS
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Spectral and signal markers surface anomaly indicators operators
              can review. Explanations never replace structured evidence.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">
              CHALLENGE-RESPONSE WORKFLOWS
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Optional challenge prompts support active verification workflows
              where configured for the deployment.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">
              RESILIENT STREAM BUFFERING
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ring-buffer and reconnect strategies reduce impact of transient
              network loss during live sessions.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">
              APPEND-ORIENTED AUDIT TRAIL
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detection events, connection changes and auth challenges are
              designed to log to PostgreSQL with Row-Level Security where
              enabled.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase">
              PRIVACY-AWARE PROCESSING
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Designed to support configurable retention and privacy-oriented
              defaults. Exact retention depends on deployment, contracts and
              provider chain — not a universal zero-retention guarantee.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
