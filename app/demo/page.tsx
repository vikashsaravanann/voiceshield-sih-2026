"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          VoiceShield · Logic Intelligence Technologies
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Live Demo Console
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          The full interactive demo UI is being restored. Request access from the
          company site, or open the operator console when authorized.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-widest"
          >
            Back to VoiceShield
          </Link>
          <a
            href="https://www.logicintelligencetechnologies.in/voice-shield/request"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 text-slate-300 font-mono font-bold text-xs uppercase tracking-widest hover:bg-slate-900"
          >
            Request Access <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
