"use client";

import React, { useEffect, useRef } from "react";
import { ExplainabilityMarkers } from "@/types/detection";

interface SpectrogramViewProps {
  markers?: ExplainabilityMarkers;
  isActive: boolean;
  spoofProbability: number;
}

export function SpectrogramView({ markers, isActive, spoofProbability }: SpectrogramViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Buffer to hold spectral columns (scrolling waterfall spectrogram)
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      if (!isActive) {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#334155";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("AUDIO STREAM IDLE — SPECTROGRAM READY", width / 2, height / 2);
        return;
      }

      // Shift canvas content 2 pixels to the left (scrolling time axis)
      const imageData = ctx.getImageData(2, 0, width - 2, height);
      ctx.putImageData(imageData, 0, 0);

      // Draw the new column at the right edge
      const isAnomalous = spoofProbability >= 0.3;
      const highFreqAlert = markers && markers.high_frequency_anomaly > 0.6;
      const phaseAlert = markers && markers.phase_discontinuity > 0.6;

      for (let y = 0; y < height; y++) {
        const freqNorm = 1.0 - y / height;
        let intensity = Math.random() * 0.4 + (1.0 - freqNorm) * 0.5;

        // Anomaly overlay
        if (highFreqAlert && freqNorm > 0.65) {
          // Unnatural high frequency energy artifact
          intensity = Math.min(1.0, intensity + 0.6);
          ctx.fillStyle = `rgb(${Math.floor(intensity * 255)}, 30, 45)`;
        } else if (phaseAlert && Math.sin(y / 4) > 0.8) {
          // Phase discontinuity banding
          ctx.fillStyle = `rgb(240, 140, 20)`;
        } else if (isAnomalous) {
          ctx.fillStyle = `rgb(${Math.floor(intensity * 220)}, ${Math.floor(intensity * 60)}, 30)`;
        } else {
          // Natural speech energy (cyan / green spectrum)
          ctx.fillStyle = `rgb(16, ${Math.floor(intensity * 200) + 40}, ${Math.floor(intensity * 240) + 20})`;
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

  const activeAlerts: string[] = [];
  if (markers) {
    if (markers.high_frequency_anomaly > 0.6) activeAlerts.push("unnatural high-frequency energy");
    if (markers.phase_discontinuity > 0.6) activeAlerts.push("phase discontinuity / vocoder grid");
    if (markers.prosody_irregularity > 0.6) activeAlerts.push("prosody irregularity / robotic pitch");
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Spectral Energy Waterfall & Explainability Heatmap
        </span>
        <span className="text-xs font-mono text-slate-500">0 Hz — 8,000 Hz</span>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={160}
          className="w-full h-40 block"
        />

        {/* Frequency guide lines */}
        <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
          8 kHz (Linear Highs)
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
          3.5 kHz (Telephony Cutoff)
        </div>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
          300 Hz (Formant Core)
        </div>
      </div>

      {/* Explainable AI Labels */}
      <div className="mt-3 min-h-[32px] flex flex-wrap items-center gap-2">
        {activeAlerts.length > 0 ? (
          activeAlerts.map((alert, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Detected: {alert}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-500 font-mono">
            Spectral and phase continuity within natural biological human bounds.
          </span>
        )}
      </div>
    </div>
  );
}
