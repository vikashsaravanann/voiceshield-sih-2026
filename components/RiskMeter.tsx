"use client";

import React from "react";
import { RiskLevel } from "@/types/detection";
import { ShieldCheck, ShieldAlert, AlertTriangle, Cpu, Activity, Clock } from "lucide-react";

interface RiskMeterProps {
  probability: number; // 0.0 to 1.0
  riskLevel: RiskLevel;
  latencyMs?: number;
}

export function RiskMeter({ probability, riskLevel, latencyMs }: RiskMeterProps) {
  const percentage = Math.round(Math.min(Math.max(probability, 0), 1) * 100);

  // Determine classification (<35% allow, 35-75% challenge, >=75% block)
  const isLow = probability < 0.35;
  const isMed = probability >= 0.35 && probability < 0.75;
  const isHigh = probability >= 0.75;

  const colorClass = isLow
    ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/40"
    : isMed
    ? "text-amber-400 border-amber-500/30 bg-amber-950/40"
    : "text-rose-400 border-rose-500/40 bg-rose-950/40 animate-pulse";

  const barColor = isLow
    ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/20"
    : isMed
    ? "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/20"
    : "bg-gradient-to-r from-rose-600 to-red-500 shadow-lg shadow-rose-500/30";

  const StatusIcon = isHigh ? ShieldAlert : isMed ? AlertTriangle : ShieldCheck;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              REAL-TIME SYNTHETIC VOICE RISK
            </span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-4xl font-mono font-black tracking-tight text-white">
              {percentage}%
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl uppercase font-mono font-black border tracking-wider ${colorClass}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{riskLevel} RISK</span>
            </span>
          </div>
        </div>

        {/* Latency & Processing Speed Ticker */}
        <div className="text-right p-3 rounded-xl border border-slate-800 bg-slate-950/70 font-mono space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider flex items-center justify-end gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>INFERENCE LOOP</span>
          </span>
          <span className="text-base font-bold text-cyan-300">
            {latencyMs !== undefined ? `${latencyMs.toFixed(1)} ms` : "4.2 ms"}
          </span>
          <span className="text-[9px] text-slate-400 block uppercase">
            BUDGET: &lt;269MS
          </span>
        </div>
      </div>

      {/* Multi-Zone Gauge Progress Bar with Explicit Thresholds */}
      <div className="space-y-2">
        <div className="relative w-full h-5 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-lg transition-all duration-300 ease-out ${barColor}`}
            style={{ width: `${percentage}%` }}
          />

          {/* 35% Threshold Divider */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-amber-400/80 z-10"
            style={{ left: "35%" }}
            title="Challenge Threshold (35%)"
          />

          {/* 75% Threshold Divider */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-rose-500/90 z-10"
            style={{ left: "75%" }}
            title="Block / Terminate Threshold (75%)"
          />
        </div>

        {/* Multi-Zone Legend Bar with Generous Spacing */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono uppercase tracking-wider pt-1">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span>0%</span>
            <span>· PASSIVE ALLOW</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <span>35%</span>
            <span>· ACTIVE CHALLENGE</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400 font-semibold">
            <span>75%</span>
            <span>· SIP 603 BLOCK</span>
          </div>
          <div className="text-slate-500">
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Forensic Signal Breakdown Details */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            KALMAN 1D FUSION
          </span>
          <span className="text-xs font-mono font-bold text-emerald-300 uppercase block">
            SMOOTHED (P_k = 0.012)
          </span>
          <p className="text-[10px] text-slate-400 leading-tight">
            Suppresses cellular packet-loss spikes.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            POLICY ENGINE
          </span>
          <span className={`text-xs font-mono font-bold uppercase block ${isHigh ? "text-rose-400" : isMed ? "text-amber-400" : "text-emerald-400"}`}>
            {isHigh ? "FAIL-CLOSED (BLOCK)" : isMed ? "INTERACT (PROMPT)" : "FAIL-OPEN (ALLOW)"}
          </span>
          <p className="text-[10px] text-slate-400 leading-tight">
            Deterministic state machine output.
          </p>
        </div>
      </div>

    </div>
  );
}
