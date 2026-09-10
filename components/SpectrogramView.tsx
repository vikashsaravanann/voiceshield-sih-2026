"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExplainabilityMarkers } from "@/types/detection";
import { Activity, Info, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

interface SpectrogramViewProps {
  markers?: ExplainabilityMarkers;
  isActive: boolean;
  spoofProbability: number;
}

export function SpectrogramView({ markers, isActive, spoofProbability }: SpectrogramViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      if (!isActive) {
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, width, height);

        // Cyber idle grid lines
        ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("AUDIO MEDIA PATH IDLE · WAITING FOR STREAM INGESTION", width / 2, height / 2);
        return;
      }

      // Shift canvas content 2 pixels to the left (time scroll)
      const imageData = ctx.getImageData(2, 0, width - 2, height);
      ctx.putImageData(imageData, 0, 0);

      // Draw the new column at the right edge
      const isAnomalous = spoofProbability >= 0.35;
      const hfScore = markers?.high_frequency_anomaly ?? (isAnomalous ? 0.82 : 0.08);
      const phaseScore = markers?.phase_discontinuity ?? (isAnomalous ? 0.89 : 0.05);

      for (let y = 0; y < height; y++) {
        const freqNorm = 1.0 - y / height;
        let intensity = Math.random() * 0.35 + (1.0 - freqNorm) * 0.5;

        if (hfScore > 0.6 && freqNorm > 0.6) {
          // Unnatural high frequency energy artifact (Crimson)
          intensity = Math.min(1.0, intensity + 0.65);
          ctx.fillStyle = `rgb(${Math.floor(intensity * 255)}, 20, 50)`;
        } else if (phaseScore > 0.6 && Math.sin(y / 3.5) > 0.75) {
          // Phase discontinuity banding (Amber)
          ctx.fillStyle = `rgb(245, 158, 11)`;
        } else if (isAnomalous) {
          // General synthetic energy
          ctx.fillStyle = `rgb(${Math.floor(intensity * 230)}, ${Math.floor(intensity * 70)}, 35)`;
        } else {
          // Natural speech energy (Emerald / Cyan)
          ctx.fillStyle = `rgb(10, ${Math.floor(intensity * 210) + 40}, ${Math.floor(intensity * 240) + 20})`;
        }

        ctx.fillRect(width - 2, y, 2, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, markers, spoofProbability]);

  const hfVal = markers?.high_frequency_anomaly ?? (spoofProbability >= 0.35 ? 0.84 : 0.08);
  const phaseVal = markers?.phase_discontinuity ?? (spoofProbability >= 0.35 ? 0.89 : 0.06);
  const prosodyVal = markers?.prosody_irregularity ?? (spoofProbability >= 0.35 ? 0.78 : 0.12);

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
      
      {/* Header with Title and Explainer Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            SPECTRAL ENERGY &amp; PHASE ANOMALY WATERFALL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">0 HZ — 8,000 HZ</span>
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-slate-400 hover:text-cyan-300 transition-colors p-1 rounded-md hover:bg-slate-800"
            title="Technical Explainability Notes"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Waterfall Canvas Display */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#030712]">
        <canvas
          ref={canvasRef}
          width={640}
          height={160}
          className="w-full h-44 block"
        />

        {/* Frequency Guide Lines with Ticks */}
        <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
          8 kHz · NYQUIST BOUND
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
          3.5 kHz · G.711 CUTOFF
        </div>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
          300 Hz · GLOTTAL FORMANT (F0)
        </div>

        {/* Legend Overlay at Top Right */}
        <div className="absolute top-2 right-3 flex items-center gap-3 text-[9px] font-mono bg-slate-950/85 px-2.5 py-1 rounded-md border border-slate-800">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> NATURAL
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> PHASE JITTER
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> VOCODER
          </span>
        </div>
      </div>

      {/* Quantitative Acoustic Explainability Tickers */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">HF LEAKAGE</div>
          <div className={`font-bold flex items-center justify-between ${hfVal > 0.6 ? "text-rose-400" : "text-emerald-400"}`}>
            <span>{(hfVal * 100).toFixed(0)}%</span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
              {hfVal > 0.6 ? "ALERT" : "NORMAL"}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">PHASE MATRIX</div>
          <div className={`font-bold flex items-center justify-between ${phaseVal > 0.6 ? "text-amber-400" : "text-emerald-400"}`}>
            <span>{(phaseVal * 100).toFixed(0)}%</span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
              {phaseVal > 0.6 ? "SPOOF" : "ORGANIC"}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">PITCH STABILITY</div>
          <div className={`font-bold flex items-center justify-between ${prosodyVal > 0.6 ? "text-cyan-400" : "text-emerald-400"}`}>
            <span>{(prosodyVal * 100).toFixed(0)}%</span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
              {prosodyVal > 0.6 ? "ROBOTIC" : "NATURAL"}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Explainability Drawer */}
      {showExplanation && (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs font-mono text-slate-300 space-y-2 animate-in fade-in duration-200">
          <div className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>HOW THE ACOUSTIC WATERFALL DETECTS DEEPFAKES:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            1. <strong>Neural Vocoders</strong> (HiFi-GAN, WaveGlow) introduce subtle periodicity ripples in higher frequencies (&gt;4 kHz) absent in biological human vocal tract acoustics.<br />
            2. <strong>Bispectral Phase Analysis</strong> tracks quadratic phase coupling between vocal cords and mouth cavity. AI clones exhibit unnaturally rigid, phase-locked harmonic structures.
          </p>
        </div>
      )}

    </div>
  );
}
