"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  Radio,
  Clock,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Volume2,
  CheckCircle2,
} from "lucide-react";

export default function ArchitecturePage() {
  const subsystems = [
    {
      num: "01",
      title: "INGESTION & PREPROCESSING",
      badge: "SS1 · PROTOCOL INTAKE",
      desc: "WebRTC and SIP/RTP media streams ingested into single-channel 16-bit linear PCM at 16 kHz. Silero Voice Activity Detection (VAD) discards background silence, comfort noise, and hold music so only active speech enters the classifier.",
      metrics: ["250ms sliding ring buffer", "125ms hop (50% overlap)", "Zero audio persistence"],
    },
    {
      num: "02",
      title: "MULTI-DOMAIN DSP EXTRACTION",
      badge: "SS2 · ACOUSTIC INSPECTION",
      desc: "Extracts dual-domain acoustic markers: Linear Frequency Cepstral Coefficients (LFCC) across 0–8 kHz preserving high-frequency vocoder residuals, Bispectral matrix B(f1, f2) measuring quadratic phase non-linearities, and F0 pitch jitter with cycle-to-cycle variance.",
      metrics: ["LFCC linear filterbank", "Bispectral phase coupling", "F0 micro-tremor tracking"],
    },
    {
      num: "03",
      title: "QUANTIZED NEURAL CLASSIFIER",
      badge: "SS3 · DUAL-STREAM INFERENCE",
      desc: "Dual-stream neural backbone: Modified RawNet2 with parameterized sinc-convolutions for raw waveform inspection combined with a lightweight 2D ResNet with Squeeze-and-Excitation for spectral envelopes. Quantized to INT8 ONNX for sub-40ms CPU inference.",
      metrics: ["INT8 quantized graph", "< 38ms CPU inference", "< 120MB RAM footprint"],
    },
    {
      num: "04",
      title: "KALMAN SMOOTHING & TRI-STATE",
      badge: "SS4 · DECISION LOGIC",
      desc: "Rolling 1-D Kalman filter over 1.5-second observation window suppresses isolated false-positive spikes from cellular packet loss or talker overlap. Emits a deterministic tri-state policy verdict: GREEN (<0.35), AMBER (0.35–0.75), or RED (≥0.75).",
      metrics: ["1.5s rolling Kalman filter", "Green / Amber / Red thresholds", "2.5ms logic latency"],
    },
    {
      num: "05",
      title: "ACTIVE MITIGATION & CHALLENGE",
      badge: "SS5 · ACTIVE ENFORCEMENT",
      desc: "When score enters the Amber band in a sensitive transaction, the engine injects an unpredictable multilingual phonemic verification prompt (EN/HI/TA/TE). Tests caller response latency: humans answer under 800ms while neural vocoders require 800–2500ms pipeline latency.",
      metrics: ["Dynamic phonemic prompt", "Speech latency timer (<800ms)", "Fail-closed enforcement"],
    },
  ];

  const latencyBudget = [
    { label: "FRAME INGESTION & VAD", time: "200.0 ms", pct: 74, color: "bg-emerald-500" },
    { label: "DSP (LFCC + BISPECTRUM)", time: "16.5 ms", pct: 6, color: "bg-teal-400" },
    { label: "INT8 NEURAL INFERENCE", time: "38.0 ms", pct: 14, color: "bg-cyan-400" },
    { label: "KALMAN SMOOTHING & LOGIC", time: "2.5 ms", pct: 1, color: "bg-indigo-400" },
    { label: "WEBSOCKET TELEMETRY DISPATCH", time: "12.0 ms", pct: 5, color: "bg-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Title */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>SIH26104 · TECHNICAL ARCHITECTURE SPECIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            SYSTEM ARCHITECTURE &amp; DETECTION PIPELINE
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            V-SHIELD is a real-time, privacy-preserving audio verification engine designed for Indian telephony and VoIP ecosystems. Built to decide in under 269ms, survive 8 kHz G.711 narrowband compression, and operate with zero raw-audio persistence under India's DPDP Act 2023.
          </p>
        </div>

        {/* Subsystems Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>FIVE COUPLED SUBSYSTEMS</span>
            </h2>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
              END-TO-END STREAMING GRAPH
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subsystems.map((s) => (
              <div
                key={s.num}
                className="relative rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-emerald-400 tracking-widest">
                      SUBSYSTEM {s.num}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest bg-slate-800 text-slate-300 uppercase">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-1.5">
                  {s.metrics.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-emerald-400/90">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Final Policy Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900/60 to-slate-950 p-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>POLICY ENFORCEMENT HOOK</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wide">
                  FAIL-CLOSED FOR PAYMENTS · FAIL-OPEN FOR SOS
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Integrators bind policy actions (Allow, Challenge, Terminate, Escalate) to transaction value and caller roles. High-value RTGS/NEFT transfers are fail-closed; emergency lines remain open with operator alerts.
                </p>
              </div>

              <Link
                href="/demo"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono tracking-widest uppercase transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>TEST IN LIVE DEMO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 269ms Latency Budget */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                REAL-TIME TELEMETRY PROFILE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                269.0 MS TOTAL DECISION ROUND-TRIP
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>MEASURED ON 4-CORE INTEL/AMD CPU (NO GPU REQUIRED)</span>
            </div>
          </div>

          <div className="space-y-4">
            {latencyBudget.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold uppercase">{item.label}</span>
                  <span className="text-emerald-400 font-bold">{item.time}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 font-mono text-center pt-2">
            Sum of ingestion window, DSP feature compute, INT8 neural inference, Kalman logic, and network dispatch remains strictly inside a natural conversational pause.
          </p>
        </div>

        {/* DPDP Act 2023 & Security Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Lock className="w-4 h-4" />
              <span>DPDP ACT 2023 COMPLIANCE SPECIFICATION</span>
            </div>
            <h3 className="text-lg font-black text-white uppercase">ZERO RAW-AUDIO PERSISTENCE BY DESIGN</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">1.</span>
                <span><strong>Volatile RAM Only:</strong> Audio frames reside strictly in circular volatile memory queues, overwritten immediately after feature extraction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">2.</span>
                <span><strong>Non-Reconstructible Vectors:</strong> Extracted LFCC and bispectral features cannot be inverse-synthesized into intelligible human speech.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">3.</span>
                <span><strong>Append-Only Audit:</strong> Telemetry logs store session ID, C(t) risk trace, codec tag, and timestamps only — never waveform bytes.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Radio className="w-4 h-4" />
              <span>TELEPHONY CODEC INVARIANCE (8 KHZ)</span>
            </div>
            <h3 className="text-lg font-black text-white uppercase">ROBUST AGAINST INDIAN NARROWBAND PATHS</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">1.</span>
                <span><strong>G.711 / AMR Adaptation:</strong> Trained and validated on band-limited 300–3400 Hz telephony audio with comfort-noise insertion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">2.</span>
                <span><strong>Target EER ≤ 5.4%:</strong> Maintained on held-out telephony-transcoded evaluation split, avoiding optimistic broadband-only lab results.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">3.</span>
                <span><strong>Accent Resilience:</strong> Trained on Indian English, Hindi, Tamil, and Telugu to prevent regional phonetics from triggering false challenges.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
