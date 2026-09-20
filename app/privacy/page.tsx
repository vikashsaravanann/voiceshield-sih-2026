import React from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Lock,
  Server,
  Trash2,
  Scale,
  ArrowRight,
  Database,
  EyeOff,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | VoiceShield | Logic Intelligence Technologies",
  description:
    "Privacy and data-protection design for VoiceShield — an AI security product by Logic Intelligence Technologies Pvt. Ltd.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans pb-24">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950/60 to-[#030712] -z-10" />

      <section className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl pt-16 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 uppercase">
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                VOICESHIELD
              </Link>
              <span>/</span>
              <span className="text-emerald-400 font-bold">PRIVACY</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                DPDP ACT 2023–ALIGNED DESIGN
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-slate-900 text-slate-300 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                CONFIGURABLE RETENTION
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Scale className="w-3.5 h-3.5" />
              <span>PRIVACY & DATA-PROTECTION DESIGN · LIT VoiceShield</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              Privacy policy & data protection
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
              VoiceShield is an AI security product by{" "}
              <strong className="text-white font-semibold">
                Logic Intelligence Technologies Pvt. Ltd.
              </strong>
              . It is designed to support privacy-preserving processing of eligible
              voice interactions, with configurable retention and access controls
              depending on deployment and contract. Public wording does not claim
              universal zero-retention or certified compliance without verified scope.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[
              { k: "RETENTION", v: "CONFIGURABLE", d: "Standard and enterprise retention options." },
              { k: "PURPOSE", v: "SECURITY SIGNALS", d: "Fraud-risk and synthetic-voice indicators — not advertising." },
              { k: "ACCESS", v: "ROLE-BASED", d: "Operator and API access under authorization." },
              { k: "INCIDENT RESPONSE", v: "OPERATIONAL TARGET", d: "Response timelines defined by deployment policy." },
            ].map((s) => (
              <div key={s.k} className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{s.k}</span>
                <span className="text-base font-mono font-black text-emerald-400 uppercase block">{s.v}</span>
                <p className="text-xs text-slate-400 leading-normal">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 space-y-16">
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">1.0</span>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Purpose limitation</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            Voice interactions processed through VoiceShield are analyzed for configurable security, fraud-risk, and synthetic-voice indicators. They are not used for advertising profiling or unrelated commercial targeting.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Security analysis</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Detection and forensic paths are intended to produce risk signals and structured evidence for authorized operators.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Minimization</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Deployments should retain only what is required for the configured security and audit purposes, subject to customer policy.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">2.0</span>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Processing architecture</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            Real-time detection paths are designed to avoid placing an LLM in the hot loop. Async forensic workflows may use transcription and structured analysis where configured. Exact storage and retention behavior depends on deployment mode and customer contract.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { t: "Streaming path", d: "Session-oriented audio feature evaluation for risk signals.", icon: Server },
              { t: "Access controls", d: "Role-based operator and API access where authentication is enabled.", icon: Lock },
              { t: "Audit orientation", d: "Detection and access events intended for reviewable logs.", icon: Database },
            ].map((x) => (
              <div key={x.t} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <x.icon className="w-5 h-5 text-emerald-400" />
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">{x.t}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">3.0</span>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">DPDP Act 2023</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            VoiceShield is designed to support privacy and data-protection requirements, including applicable considerations under India's Digital Personal Data Protection Act 2023, depending on processing activities, deployment location, and contractual configuration. This is not a claim of universal certification for every deployment.
          </p>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed">
              Enterprise customers should document lawful purpose, retention, subprocessors, and access rights in their own DPA / processing schedules where required.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">4.0</span>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Contact</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            Privacy and security enquiries for VoiceShield:
            <br />
            <a href="mailto:admin@logicintelligencetechnologies.in" className="text-emerald-400 hover:underline font-mono">
              admin@logicintelligencetechnologies.in
            </a>
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to VoiceShield
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
