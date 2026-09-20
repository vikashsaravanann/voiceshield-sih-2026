"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Mic,
  Activity,
  Lock,
  Radio,
  FileText,
  Layers,
} from "lucide-react";

/**
 * VoiceShield demo entry — full interactive console requires backend WebSocket.
 * This page is the production access gate + product overview for the live console.
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,30,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,30,60,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="border-b border-slate-800/80 bg-slate-950/90 py-2.5 px-4 sm:px-6 text-[11px] font-mono text-slate-400 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            VoiceShield · Logic Intelligence Technologies
          </span>
          <span className="text-teal-400 font-semibold uppercase">
            DPDP-aware design · Configurable retention
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className="border border-slate-800/90 rounded-2xl sm:rounded-3xl bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              AI Security & Voice Fraud Intelligence
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              A Logic Intelligence Technologies product
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            Live voice clone
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              detection console
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Continuous audio-frame inspection for synthetic impersonation on telephony
            and voice channels. The interactive operator console (mic stream, risk meter,
            spectrogram, challenge gate) requires an approved access grant and a live
            inference host.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <Link
              href="https://www.logicintelligencetechnologies.in/voice-shield/request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-mono font-black text-xs tracking-widest uppercase shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              Request demo access
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/architecture"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 font-mono font-bold text-xs tracking-widest uppercase hover:border-slate-500 hover:text-white transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Architecture
            </Link>
            <Link
              href="https://www.logicintelligencetechnologies.in/voice-shield"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 font-mono font-bold text-xs tracking-widest uppercase hover:border-slate-500 hover:text-white transition-all"
            >
              Product overview
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Mic, title: "Capture & VAD", spec: "PCM16 @ 16 kHz", desc: "Sliding audio window with volatile ring-buffer." },
            { icon: Activity, title: "DSP & neural infer", spec: "LFCC + bispectrum", desc: "AASIST-style features for vocoder artifacts." },
            { icon: Radio, title: "Fusion & policy", spec: "Risk → action", desc: "Allow / challenge / cut telephony policy hooks." },
            { icon: Lock, title: "Privacy posture", spec: "DPDP-aware", desc: "Configurable retention; no training on customer audio by default." },
          ].map(({ icon: Icon, title, spec, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono text-cyan-400">{spec}</span>
              </div>
              <p className="text-sm font-bold uppercase tracking-wider text-white">{title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
            <FileText className="w-4 h-4 text-cyan-400" />
            Access policy
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Console credentials and WebSocket endpoints are issued after your request is
            reviewed. Until then, use{" "}
            <Link
              href="https://www.logicintelligencetechnologies.in/voice-shield/request"
              className="text-emerald-400 hover:underline"
            >
              Request demo access
            </Link>{" "}
            on the company site. Approved users receive the live console URL by email.
          </p>
        </div>
      </div>
    </div>
  );
}
