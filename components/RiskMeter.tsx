"use client";

import React from "react";
import { RiskLevel } from "@/types/detection";

interface RiskMeterProps {
  probability: number; // 0.0 to 1.0
  riskLevel: RiskLevel;
  latencyMs?: number;
}

export function RiskMeter({ probability, riskLevel, latencyMs }: RiskMeterProps) {
  const percentage = Math.round(Math.min(Math.max(probability, 0), 1) * 100);

  // Determine color scheme based on thresholds (<30% green, 30-70% yellow/amber, >70% red)
  const isLow = probability < 0.3;
  const isMed = probability >= 0.3 && probability < 0.7;
  const isHigh = probability >= 0.7;

  const colorClass = isLow
    ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
    : isMed
    ? "text-amber-400 border-amber-500/30 bg-amber-950/20"
    : "text-rose-500 border-rose-500/40 bg-rose-950/30 animate-pulse";

  const barColor = isLow
    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
    : isMed
    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
    : "bg-gradient-to-r from-rose-600 to-red-500";

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Real-Time Cloned Voice Risk
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>{percentage}%</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full uppercase font-bold border tracking-wider ${colorClass}`}
            >
              {riskLevel} RISK
            </span>
          </h3>
        </div>
        {latencyMs !== undefined && (
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Loop Latency</span>
            <span className="text-sm font-mono text-slate-300">{latencyMs.toFixed(1)} ms</span>
          </div>
        )}
      </div>

      {/* Progress Bar with threshold markers */}
      <div className="relative w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-300 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
        {/* 30% Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-700/80 z-10"
          style={{ left: "30%" }}
          title="Medium Risk Threshold (30%)"
        />
        {/* 70% Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-700/80 z-10"
          style={{ left: "70%" }}
          title="High Risk Threshold (70%)"
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
        <span>0% (Genuine)</span>
        <span className="text-amber-500/80">30% (Challenge)</span>
        <span className="text-rose-500/80">70% (Block)</span>
        <span>100% (Spoof)</span>
      </div>
    </div>
  );
}
