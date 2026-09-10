"use client";

import React, { useState, useRef } from "react";
import type { ForensicReportData, ForensicSlice } from "@/lib/audio/forensicAnalyzer";
import { AlertCircle, Clock, Zap, Layers, Sparkles, ZoomIn, ZoomOut, CheckCircle2, ShieldAlert } from "lucide-react";

interface SplicingHeatmapProps {
  report: ForensicReportData;
  currentTimeMs: number;
  onSeek: (timeMs: number) => void;
  isPlaying: boolean;
}

export function SplicingHeatmap({ report, currentTimeMs, onSeek, isPlaying }: SplicingHeatmapProps) {
  const [hoveredSlice, setHoveredSlice] = useState<ForensicSlice | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<ForensicSlice | null>(null);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4>(1);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalDurationMs = report.durationSeconds * 1000;
  const playheadPercent = totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0;
  const inspectedSlice = selectedSlice ?? hoveredSlice ?? report.slices[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || report.slices.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const targetMs = ratio * totalDurationMs;

    const matchedSlice =
      report.slices.find((s) => targetMs >= s.startTimeMs && targetMs <= s.endTimeMs) ||
      report.slices[Math.floor(ratio * report.slices.length)];

    setHoveredSlice(matchedSlice ?? null);
    setHoverPosition({ x, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredSlice(null);
    setHoverPosition(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const targetMs = Math.round(ratio * totalDurationMs);
    onSeek(targetMs);

    const matched =
      report.slices.find((s) => targetMs >= s.startTimeMs && targetMs <= s.endTimeMs) ||
      report.slices[Math.floor(ratio * report.slices.length)];
    if (matched) setSelectedSlice(matched);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">ACOUSTIC SLICES:</span>
            <span className="text-emerald-400 font-bold">{report.totalChunks} WINDOWS (333ms)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>ENTROPY:</span>
            <span className="text-cyan-300 font-bold">{report.entropyScore} BITS</span>
          </div>
        </div>

        {/* Zoom Level Pill & Legend */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              onClick={() => setZoomLevel(1)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                zoomLevel === 1 ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-500 hover:text-white"
              }`}
            >
              1X FIT
            </button>
            <button
              onClick={() => setZoomLevel(2)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                zoomLevel === 2 ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-500 hover:text-white"
              }`}
            >
              2X ZOOM
            </button>
            <button
              onClick={() => setZoomLevel(4)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                zoomLevel === 4 ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-500 hover:text-white"
              }`}
            >
              4X ZOOM
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-500/90" />
              <span className="text-slate-400">Human (&lt;35%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-amber-500/90" />
              <span className="text-slate-400">Artifacts (35-75%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-rose-500/90" />
              <span className="text-slate-400">Deepfake (&gt;75%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-0.5 border-t-2 border-dashed border-cyan-400" />
              <span className="text-cyan-300 font-semibold">Splice Joint</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-2xl overflow-x-auto">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{ width: `${zoomLevel * 100}%` }}
          className="relative h-32 cursor-crosshair overflow-hidden rounded-xl bg-slate-900/90 select-none shadow-inner border border-slate-800/80 transition-all duration-200"
        >
          {/* Subtle audio waveform grid background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Slices Bar Grid */}
          <div className="absolute inset-0 flex items-stretch">
            {report.slices.map((slice) => {
              const isHigh = slice.spoofProbability >= 0.75;
              const isMed = slice.spoofProbability >= 0.35 && !isHigh;
              const isSelected = selectedSlice?.index === slice.index;

              const bgColor = isHigh
                ? "bg-rose-500/85 hover:bg-rose-400"
                : isMed
                ? "bg-amber-500/75 hover:bg-amber-400"
                : "bg-emerald-500/65 hover:bg-emerald-400";

              return (
                <div
                  key={slice.index}
                  style={{ width: `${100 / report.slices.length}%` }}
                  className={`relative h-full flex flex-col justify-end transition-all duration-100 ${bgColor} ${
                    isSelected ? "ring-2 ring-white z-10" : ""
                  }`}
                >
                  {/* Normalized RMS Waveform Height */}
                  <div
                    style={{
                      height: `${Math.min(100, Math.max(14, slice.waveformRms * 360))}%`,
                    }}
                    className="w-full bg-white/25 rounded-t-sm"
                  />

                  {/* Splice Joint Visual Marker */}
                  {slice.isSpliced && (
                    <div
                      className="absolute inset-y-0 left-0 w-[2px] bg-cyan-400 shadow-[0_0_12px_#22d3ee] z-20"
                      title="Splicing Transition Boundary"
                    >
                      <div className="absolute top-1 -left-1 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Spliced Region Highlight Overlays */}
          {report.spliceRegions
            .filter((r) => r.type === "synthetic_insertion")
            .map((reg, idx) => {
              const leftPct = (reg.startTimeMs / totalDurationMs) * 100;
              const widthPct = (reg.durationMs / totalDurationMs) * 100;
              return (
                <div
                  key={idx}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  className="pointer-events-none absolute inset-y-0 border-x-2 border-rose-500 bg-rose-600/15 z-15"
                >
                  <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded bg-rose-950/90 border border-rose-500/60 text-[9px] font-mono font-black text-rose-200 tracking-wider shadow-md">
                    CLONE SPLICED #{idx + 1} ({(reg.durationMs / 1000).toFixed(2)}s)
                  </div>
                </div>
              );
            })}

          {/* Current Playhead */}
          <div
            style={{ left: `${playheadPercent}%` }}
            className="pointer-events-none absolute inset-y-0 w-[2px] bg-white shadow-[0_0_12px_#ffffff] z-30 transition-all duration-75"
          >
            <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] border-2 border-slate-900" />
          </div>

          {/* Hover Floating Tooltip */}
          {hoveredSlice && hoverPosition && (
            <div
              style={{
                left: `${Math.min(
                  hoverPosition.x,
                  containerRef.current ? containerRef.current.clientWidth - 210 : 200
                )}px`,
                top: "12px",
              }}
              className="pointer-events-none absolute z-40 w-48 rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl text-[10px] font-mono space-y-1.5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400 font-bold">SLICE #{hoveredSlice.index + 1}</span>
                <span className="text-cyan-400 font-bold">
                  {(hoveredSlice.startTimeMs / 1000).toFixed(2)}s - {(hoveredSlice.endTimeMs / 1000).toFixed(2)}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SPOOF PROB:</span>
                <span
                  className={`font-black ${
                    hoveredSlice.spoofProbability >= 0.75
                      ? "text-rose-400"
                      : hoveredSlice.spoofProbability >= 0.35
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {(hoveredSlice.spoofProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1 text-[9px] text-slate-400 pt-1 border-t border-slate-900">
                <div className="flex justify-between">
                  <span>Centroid:</span>
                  <span className="text-slate-200">{hoveredSlice.spectralCentroidHz} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span>Vocoder Dispersion:</span>
                  <span className="text-slate-200">
                    {(hoveredSlice.markers.highFrequencyAnomaly * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phase Jump:</span>
                  <span className="text-slate-200">
                    {(hoveredSlice.markers.phaseDiscontinuity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              {hoveredSlice.isSpliced && (
                <div className="mt-1 flex items-center gap-1 text-[9px] text-cyan-300 font-bold pt-1 border-t border-slate-800">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>SPLICE TRANSITION DETECTED</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timeline Axis Markers */}
        <div className="mt-2.5 flex justify-between text-[10px] font-mono text-slate-500">
          <span>0.00s</span>
          <span>{(report.durationSeconds * 0.25).toFixed(2)}s</span>
          <span>{(report.durationSeconds * 0.5).toFixed(2)}s</span>
          <span>{(report.durationSeconds * 0.75).toFixed(2)}s</span>
          <span>{report.durationSeconds.toFixed(2)}s</span>
        </div>
      </div>

      {/* Inspected Slice Deep-Dive Strip */}
      {inspectedSlice && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 font-mono text-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold uppercase">
                INSPECTING WINDOW #{inspectedSlice.index + 1}
              </span>
              <span className="text-cyan-300">
                ({(inspectedSlice.startTimeMs / 1000).toFixed(2)}s – {(inspectedSlice.endTimeMs / 1000).toFixed(2)}s)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">WINDOW VERDICT:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  inspectedSlice.spoofProbability >= 0.75
                    ? "bg-rose-950/80 border-rose-500/40 text-rose-300"
                    : inspectedSlice.spoofProbability >= 0.35
                    ? "bg-amber-950/80 border-amber-500/40 text-amber-300"
                    : "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                }`}
              >
                {inspectedSlice.spoofProbability >= 0.75
                  ? "CLONED SYNTHESIS"
                  : inspectedSlice.spoofProbability >= 0.35
                  ? "ELEVATED ARTIFACTS"
                  : "BIOLOGICAL VOICE"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400">SPECTRAL CENTROID</div>
              <div className="text-sm font-bold text-white mt-0.5">{inspectedSlice.spectralCentroidHz} Hz</div>
              <div className="text-[9px] text-slate-500">Normal human: 900–1800Hz</div>
            </div>
            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400">SPECTRAL TILT (HF/LF)</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{inspectedSlice.spectralTiltDb} dB</div>
              <div className="text-[9px] text-slate-500">Vocoder leakage flag: &gt; -6dB</div>
            </div>
            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400">PHASE DERIVATIVE</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                {(inspectedSlice.markers.phaseDiscontinuity * 100).toFixed(0)}%
              </div>
              <div className="text-[9px] text-slate-500">Biological phase &lt; 25%</div>
            </div>
            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400">PROSODY JUMP</div>
              <div className="text-sm font-bold text-purple-300 mt-0.5">
                {(inspectedSlice.markers.prosodyIrregularity * 100).toFixed(0)}%
              </div>
              <div className="text-[9px] text-slate-500">Inter-frame pitch stability</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
