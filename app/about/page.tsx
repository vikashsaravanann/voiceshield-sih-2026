"use client";

import React from "react";
import Link from "next/link";
import { Shield, Users, Award, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      role: "Team Lead & ML Systems Architect",
      focus: "Model selection, dual-stream INT8 quantization, calibration, and policy thresholds",
    },
    {
      role: "Audio DSP & Speech Processing Engineer",
      focus: "LFCC linear filterbanks, bispectral quadratic coupling B(f1, f2), VAD gating",
    },
    {
      role: "Real-Time Streaming & Backend Specialist",
      focus: "WebSocket duplex streaming, ring buffer replay, Redis session state, SIP trunking",
    },
    {
      role: "Security & Full-Stack Systems Engineer",
      focus: "Dynamic phonemic challenge-response, DPDP Act 2023 zero-retention, SOC dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>SMART INDIA HACKATHON 2026 · SIH26104</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            ABOUT VOICESHIELD
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Engineered specifically for the AICTE Cyber Security Cell problem statement: AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            THE CORE MISSION
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            STOPPING VOICE CLONE FRAUD INSIDE THE CALL, NOT AFTER IT
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Existing speech forensics tools are offline batch processors — they report fraud hours after the treasury wire transfer has occurred. V-SHIELD introduces active inline mitigation: detecting vocoder artifacts in 250ms streaming windows and arming unpredictable phonemic challenges before sensitive or privileged transactions are authorized.
          </p>
        </div>

        {/* Engineering Roles */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              ENGINEERING COMPOSITION
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>ROLE 0{idx + 1}</span>
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                  {member.role}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {member.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance and Repositories */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 font-mono text-xs">
          <span className="text-emerald-400 font-bold uppercase tracking-widest">
            VERIFIED REPOSITORIES &amp; PLATFORM TARGETS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>TEAM ORG REPO:</span>
              <span className="text-emerald-400 font-bold">voiceshield-team/voiceshield-sih-2026</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>LIVE VERCEL:</span>
              <span className="text-emerald-400 font-bold">voiceshield-sih-2026.vercel.app</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>FASTAPI WORKER:</span>
              <span className="text-cyan-400 font-bold">voiceshield-api (Railway / Render)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>DATABASE REGION:</span>
              <span className="text-emerald-400 font-bold">ap-south-1 (Mumbai, India)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
