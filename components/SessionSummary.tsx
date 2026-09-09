"use client";

import React from "react";
import { SessionStats } from "@/types/detection";

interface SessionSummaryProps {
  stats: SessionStats;
  onRestart?: () => void;
}

export function SessionSummary({ stats, onRestart }: SessionSummaryProps) {
  const avgRiskPct = Math.round(stats.avgRisk * 100);
  const maxRiskPct = Math.round(stats.maxRisk * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Session Forensics & Evaluation
          </span>
          <h3 className="text-xl font-bold text-white">Call Defense Summary</h3>
        </div>
        {onRestart && (
          <button
            onClick={onRestart}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider transition-colors"
          >
            Start New Session
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {/* Total Chunks */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Chunks</span>
          <span className="text-xl font-bold text-white font-mono">{stats.totalChunks}</span>
          <span className="text-[10px] text-slate-500 block">333ms hops</span>
        </div>

        {/* Avg Risk */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Avg Risk</span>
          <span
            className={`text-xl font-bold font-mono ${
              avgRiskPct > 30 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {avgRiskPct}%
          </span>
          <span className="text-[10px] text-slate-500 block">Mean probability</span>
        </div>

        {/* Max Risk */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Max Risk</span>
          <span
            className={`text-xl font-bold font-mono ${
              maxRiskPct > 70 ? "text-rose-500" : maxRiskPct > 30 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {maxRiskPct}%
          </span>
          <span className="text-[10px] text-slate-500 block">Peak threshold</span>
        </div>

        {/* High Risk Frames */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Flagged Hops</span>
          <span className="text-xl font-bold text-rose-400 font-mono">{stats.highRiskCount}</span>
          <span className="text-[10px] text-slate-500 block">p ≥ 0.70</span>
        </div>

        {/* Connection Drops */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Drops</span>
          <span className="text-xl font-bold text-amber-300 font-mono">{stats.dropCount}</span>
          <span className="text-[10px] text-slate-500 block">Recovered</span>
        </div>

        {/* Challenge Result */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Challenge</span>
          <span
            className={`text-xl font-bold uppercase font-mono ${
              stats.challengeResult === "passed"
                ? "text-emerald-400"
                : stats.challengeResult === "failed"
                ? "text-rose-500"
                : "text-slate-400"
            }`}
          >
            {stats.challengeResult || "None"}
          </span>
          <span className="text-[10px] text-slate-500 block">Phonemic state</span>
        </div>
      </div>
    </div>
  );
}
