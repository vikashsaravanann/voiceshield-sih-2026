"use client";

import React from "react";
import { classifyDualAxis } from "@/lib/audio/voiceprint";
import { ShieldAlert, ShieldCheck, UserX, Bot, Target, AlertTriangle, Radio, Lock } from "lucide-react";

interface DualAxisMatrixProps {
  speakerMatch: number; // 0.0 to 1.0
  syntheticRisk: number; // 0.0 to 1.0
  contactName?: string;
  isStreaming?: boolean;
}

export function DualAxisMatrix({
  speakerMatch,
  syntheticRisk,
  contactName = "Claimed Contact",
  isStreaming = false,
}: DualAxisMatrixProps) {
  const classification = classifyDualAxis(speakerMatch, syntheticRisk);

  // Position on radar: X = speakerMatch (0% left to 100% right), Y = syntheticRisk (0% bottom to 100% top)
  const posX = Math.max(6, Math.min(94, speakerMatch * 100));
  const posY = Math.max(6, Math.min(94, 100 - syntheticRisk * 100)); // Inverted Y

  const sipCode =
    classification.action === "critical_block"
      ? "SIP 603 DECLINE"
      : classification.action === "allow"
      ? "SIP 200 OK (ALLOW)"
      : classification.action === "verify_number"
      ? "SIP 488 NOT ACCEPTABLE"
      : "SIP 403 FORBIDDEN";

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/85 p-5 shadow-2xl backdrop-blur-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wider uppercase text-white">
              DUAL-AXIS RADAR: SPEAKER IDENTITY × SYNTHETIC RISK
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              1:1 BIOMETRIC VOICEPRINT CORRELATION COMBINED WITH AASIST VOCODER RESIDUALS
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider border uppercase flex items-center gap-1.5 shadow-md ${classification.badgeColor}`}
        >
          {classification.zone === "impersonator" && (
            <ShieldAlert className="w-3.5 h-3.5 animate-bounce text-rose-300" />
          )}
          {classification.zone === "genuine" && (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          )}
          {classification.zone === "wrong_caller" && (
            <UserX className="w-3.5 h-3.5 text-amber-300" />
          )}
          {classification.zone === "robocall" && (
            <Bot className="w-3.5 h-3.5 text-purple-300" />
          )}
          <span>{classification.label}</span>
        </div>
      </div>

      {/* 2D Tactical Radar Grid */}
      <div className="relative h-72 w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden select-none shadow-inner">
        {/* Radar Concentric Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[85%] h-[85%] rounded-full border border-slate-600" />
          <div className="w-[60%] h-[60%] rounded-full border border-slate-600 absolute" />
          <div className="w-[35%] h-[35%] rounded-full border border-slate-600 absolute" />
        </div>

        {/* Quadrant Divider Crosshairs */}
        <div className="absolute top-0 bottom-0 left-[65%] w-[1.5px] bg-slate-700/80 border-r border-dashed border-slate-600" />
        <div className="absolute left-0 right-0 top-[50%] h-[1.5px] bg-slate-700/80 border-b border-dashed border-slate-600" />

        {/* Sweeping Radar Beam (Pure CSS Animation) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(34, 211, 238, 0.25) 0deg, transparent 60deg, transparent 360deg)",
            animation: "spin 6s linear infinite",
          }}
        />

        {/* Quadrant Background Shading & Tactical Labels */}
        {/* Q4 (Top Left): Robocall */}
        <div className="absolute top-0 left-0 w-[65%] h-[50%] bg-purple-950/15 p-2.5 text-[9px] font-mono font-bold text-purple-400/80 flex flex-col justify-between">
          <span>ZONE IV: SYNTHETIC ROBOCALL (SPAM)</span>
          <span className="text-[8px] opacity-60">LOW MATCH · HIGH SYNTHETIC RISK</span>
        </div>
        {/* Q2 (Top Right): Impersonator */}
        <div className="absolute top-0 left-[65%] w-[35%] h-[50%] bg-rose-950/25 p-2.5 text-[9px] font-mono font-bold text-rose-400/90 border-l border-b border-rose-500/20 flex flex-col justify-between">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>ZONE II: DEEPFAKE CLONE</span>
          </span>
          <span className="text-[8px] opacity-80 text-rose-300">HIGH MATCH · TARGETED ATTACK</span>
        </div>
        {/* Q3 (Bottom Left): Wrong Caller */}
        <div className="absolute top-[50%] left-0 w-[65%] h-[50%] bg-amber-950/15 p-2.5 text-[9px] font-mono font-bold text-amber-400/80 flex flex-col justify-between">
          <span>ZONE III: IDENTITY MISMATCH</span>
          <span className="text-[8px] opacity-60">HUMAN SPEECH · UNREGISTERED CALLER</span>
        </div>
        {/* Q1 (Bottom Right): Genuine Owner */}
        <div className="absolute top-[50%] left-[65%] w-[35%] h-[50%] bg-emerald-950/25 p-2.5 text-[9px] font-mono font-bold text-emerald-400/90 border-l border-emerald-500/20 flex flex-col justify-between">
          <span>ZONE I: GENUINE OWNER</span>
          <span className="text-[8px] opacity-80 text-emerald-300">HIGH MATCH · NATURAL VOCAL TRACT</span>
        </div>

        {/* Animated Target Radar Reticle */}
        <div
          style={{ left: `${posX}%`, top: `${posY}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-30 pointer-events-none"
        >
          {/* Pulsing ring */}
          <div
            className={`w-9 h-9 rounded-full border-2 animate-ping absolute -top-1.5 -left-1.5 opacity-75 ${
              classification.zone === "impersonator"
                ? "border-rose-500"
                : classification.zone === "genuine"
                ? "border-emerald-500"
                : "border-cyan-400"
            }`}
          />
          {/* Center Target Dot */}
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-xl backdrop-blur-md ${
              classification.zone === "impersonator"
                ? "bg-rose-600 border-white text-white shadow-rose-500/50"
                : classification.zone === "genuine"
                ? "bg-emerald-500 border-white text-slate-950 shadow-emerald-500/50"
                : "bg-cyan-500 border-white text-slate-950 shadow-cyan-500/50"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>

          {/* Caller Label Floating Tag */}
          <div className="absolute left-8 top-0 whitespace-nowrap rounded-lg bg-slate-950/95 border border-slate-700 px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-2xl space-y-0.5">
            <div className="text-cyan-300 truncate max-w-[140px]">{contactName}</div>
            <div className="text-[9px] text-slate-400">
              Match: <span className="text-white">{(speakerMatch * 100).toFixed(0)}%</span> · Risk:{" "}
              <span className={syntheticRisk >= 0.5 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                {(syntheticRisk * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Axis Labels */}
        <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
          Speaker Identity Match → 100%
        </div>
        <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
          ↑ Synthetic Clone Risk 100%
        </div>
      </div>

      {/* Coordinate & Telephony Policy Readout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="rounded-xl bg-slate-950 border border-slate-800/90 p-3">
          <div className="text-[10px] text-slate-400 uppercase">SPEAKER MATCH (X)</div>
          <div className="text-lg font-black text-cyan-300 mt-0.5">{(speakerMatch * 100).toFixed(1)}%</div>
          <div className="text-[9px] text-slate-500">Threshold: &ge;65%</div>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800/90 p-3">
          <div className="text-[10px] text-slate-400 uppercase">SPOOF PROBABILITY (Y)</div>
          <div
            className={`text-lg font-black mt-0.5 ${
              syntheticRisk >= 0.75
                ? "text-rose-400"
                : syntheticRisk >= 0.35
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {(syntheticRisk * 100).toFixed(1)}%
          </div>
          <div className="text-[9px] text-slate-500">Threshold: &ge;50%</div>
        </div>

        <div className="col-span-2 rounded-xl bg-slate-950 border border-slate-800/90 p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">TELEPHONY SBC POLICY ACTION</div>
            <div className="text-sm font-black text-white uppercase mt-0.5 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{sipCode}</span>
            </div>
            <div className="text-[9px] text-slate-500">
              {classification.action === "critical_block"
                ? "Immediate outbound wire freeze + SMS alert"
                : classification.action === "allow"
                ? "Audio passed to operator headset"
                : "Step-up phonemic challenge required"}
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Policy Narrative */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 text-xs text-slate-300 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px] font-sans">{classification.description}</p>
      </div>
    </div>
  );
}
