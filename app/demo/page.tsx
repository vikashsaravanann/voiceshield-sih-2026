"use client";

import React, { useState } from "react";
import { AudioStreamer } from "@/components/AudioStreamer";
import { RiskMeter } from "@/components/RiskMeter";
import { SpectrogramView } from "@/components/SpectrogramView";
import { ChallengeResponse } from "@/components/ChallengeResponse";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { SessionSummary } from "@/components/SessionSummary";
import { BackendHealth } from "@/components/BackendHealth";
import {
  DetectionResponse,
  ConnectionState,
  SessionStats,
} from "@/types/detection";
import {
  Mic,
  MicOff,
  WifiOff,
  Volume2,
  ShieldAlert,
  Shield,
  Activity,
  Cpu,
  Lock,
  Zap,
  Radio,
} from "lucide-react";

// ─── Step pipeline ──────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  { id: "01", label: "CAPTURE", icon: Mic, desc: "PCM16 @ 16kHz" },
  { id: "02", label: "INFER", icon: Cpu, desc: "DSP + Groq LPU" },
  { id: "03", label: "DECIDE", icon: Activity, desc: "Kalman fusion" },
  { id: "04", label: "PREVENT", icon: Lock, desc: "Policy gate" },
] as const;

export default function DemoPage() {
  const [latestDetection, setLatestDetection] =
    useState<DetectionResponse | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [stats, setStats] = useState<SessionStats>({
    totalChunks: 0,
    avgRisk: 0,
    maxRisk: 0,
    highRiskCount: 0,
    dropCount: 0,
    reconnectTimeMs: 0,
  });
  const [challengeActive, setChallengeActive] = useState(false);

  const handleRiskUpdate = (res: DetectionResponse) => {
    setLatestDetection(res);
    if (res.spoof_probability >= 0.35 && !challengeActive) {
      setChallengeActive(true);
    }
  };

  const prob = latestDetection?.spoof_probability ?? 0.04;
  const risk = latestDetection?.risk_level ?? "low";
  const latencyMs = latestDetection?.latency_ms ?? 0;
  const isConnected = connectionState === "connected";
  const isHigh = risk === "high";
  const isMed = risk === "medium";

  const decisionLabel = isHigh
    ? "BLOCK / ESCALATE"
    : isMed
    ? "CHALLENGE CALLER"
    : "ALLOW / MONITOR";

  const decisionColor = isHigh
    ? "text-rose-400 border-rose-500/40 bg-rose-950/30"
    : isMed
    ? "text-amber-400 border-amber-500/40 bg-amber-950/30"
    : "text-emerald-400 border-emerald-500/40 bg-emerald-950/30";

  const stepActive = (idx: number) => {
    if (idx === 0) return connectionState !== "disconnected";
    if (idx === 1) return Boolean(latestDetection);
    if (idx === 2) return Boolean(latestDetection);
    if (idx === 3) return challengeActive || isHigh;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      {/* ── Background grid ──────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,30,60,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,30,60,0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Glow orbs ─────────────────────────────────────────────── */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ══════════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════════ */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono font-semibold tracking-[0.2em] text-emerald-400 uppercase">
                  SIH26104 · Operator Console
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Live Voice Clone
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  {" "}Detection Path
                </span>
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                333 ms raw PCM16 audio hops inspected via hybrid LFCC &amp; deep neural representations.
                Sub-300 ms decision latency.
              </p>
            </div>

            {/* Right: Controls */}
            <AudioStreamer
              onRiskUpdate={handleRiskUpdate}
              onConnectionChange={setConnectionState}
              onStatsUpdate={setStats}
            >
              {({
                isStreaming,
                connectionState: cs,
                reconnectAttempt,
                reconnectDelayMs,
                bufferedCount,
                start,
                stop,
                simulateDisconnect,
                toggleCloneSimulation,
                isSimulatingClone,
              }) => (
                <div className="flex flex-col items-end gap-4 shrink-0">
                  {/* Connection Status */}
                  <ConnectionStatus
                    state={cs}
                    reconnectAttempt={reconnectAttempt}
                    reconnectDelayMs={reconnectDelayMs}
                    bufferedChunksCount={bufferedCount}
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 justify-end">
                    {!isStreaming ? (
                      <button
                        onClick={start}
                        className="
                          inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                          bg-gradient-to-r from-emerald-500 to-teal-500
                          hover:from-emerald-400 hover:to-teal-400
                          text-slate-950 font-bold text-xs tracking-widest uppercase
                          transition-all duration-200 shadow-lg shadow-emerald-500/25
                          active:scale-95
                        "
                      >
                        <Mic className="w-4 h-4" />
                        Start Live Audio
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={stop}
                          className="
                            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                            bg-rose-600/90 hover:bg-rose-500 border border-rose-500/30
                            text-white font-bold text-xs tracking-widest uppercase
                            transition-all duration-200 active:scale-95 shadow-lg shadow-rose-500/20
                          "
                        >
                          <MicOff className="w-4 h-4" />
                          Stop Stream
                        </button>

                        <button
                          onClick={toggleCloneSimulation}
                          className={`
                            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border
                            text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-95
                            ${isSimulatingClone
                              ? "bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20 animate-pulse"
                              : "bg-slate-900 text-slate-300 border-slate-700 hover:border-rose-500/40 hover:text-rose-300"
                            }
                          `}
                        >
                          <Volume2 className="w-4 h-4" />
                          {isSimulatingClone ? "Cloned Stream Active" : "Inject Clone Audio"}
                        </button>

                        <button
                          onClick={simulateDisconnect}
                          className="
                            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                            border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40
                            text-amber-300 text-xs font-bold tracking-widest uppercase
                            transition-all duration-200 active:scale-95
                          "
                        >
                          <WifiOff className="w-4 h-4" />
                          Simulate Network Drop
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </AudioStreamer>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            BACKEND HEALTH
        ══════════════════════════════════════════════════════════ */}
        <BackendHealth />

        {/* ══════════════════════════════════════════════════════════
            PIPELINE STEPS
        ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map(({ id, label, icon: Icon, desc }, idx) => {
            const active = stepActive(idx);
            return (
              <div
                key={id}
                className={`
                  relative rounded-xl border p-5 transition-all duration-500 overflow-hidden
                  ${active
                    ? "border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-500/10"
                    : "border-slate-800/80 bg-slate-900/40"
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-semibold tracking-widest ${active ? "text-emerald-400" : "text-slate-600"}`}>
                    STEP {id}
                  </span>
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-600"}`} />
                </div>
                <p className={`text-sm font-extrabold tracking-[0.15em] uppercase ${active ? "text-white" : "text-slate-500"}`}>
                  {label}
                </p>
                <p className={`text-[11px] mt-1 ${active ? "text-emerald-400/70" : "text-slate-600"}`}>
                  {desc}
                </p>
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════
            RISK METER + SPECTROGRAM (2-col grid)
        ══════════════════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-6">
          <RiskMeter
            probability={prob}
            riskLevel={risk}
            latencyMs={latencyMs}
          />
          <SpectrogramView
            markers={latestDetection?.explainability_markers}
            isActive={isConnected}
            spoofProbability={prob}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            POLICY DECISION BANNER
        ══════════════════════════════════════════════════════════ */}
        <div className={`rounded-2xl border p-6 transition-all duration-500 ${decisionColor} backdrop-blur-md`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${decisionColor}`}>
                {isHigh ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : (
                  <Shield className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-mono font-semibold tracking-widest opacity-70 uppercase mb-1">
                  Policy Decision
                </p>
                <h2 className="text-xl font-extrabold tracking-wide">
                  {decisionLabel}
                </h2>
              </div>
            </div>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border ${decisionColor}`}>
              <Radio className="w-3.5 h-3.5" />
              {latestDetection
                ? `Model confidence ${Math.round((1 - prob) * 100)}%`
                : "Awaiting audio input"}
            </span>
          </div>
          <p className="mt-4 text-sm opacity-80 leading-relaxed">
            {isHigh
              ? "⚠️ Synthetic vocoder artifacts confirmed. Session flagged. Block the call and escalate to operator review. Forensic log saved to Supabase."
              : isMed
              ? "🟡 Acoustic anomalies detected in high-frequency bands. The caller must complete the multilingual phonemic challenge before proceeding."
              : "✅ No active spoof signal detected. Spectral and phase continuity within natural biological human bounds. Continue monitoring the call path."}
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CHALLENGE-RESPONSE (conditional)
        ══════════════════════════════════════════════════════════ */}
        {challengeActive && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ChallengeResponse
              onChallengeComplete={(passed, newRisk) => {
                setStats((prev) => ({
                  ...prev,
                  challengeResult: passed ? "passed" : "failed",
                }));
                if (latestDetection) {
                  setLatestDetection({
                    ...latestDetection,
                    spoof_probability: newRisk,
                    risk_level: "low",
                  });
                }
                setChallengeActive(false);
              }}
              spoofProbability={prob}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            SESSION FORENSICS
        ══════════════════════════════════════════════════════════ */}
        <SessionSummary stats={stats} />

        {/* ══════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════ */}
        <div className="border-t border-slate-800/60 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-500/60" />
            <span>VoiceShield · SIH26104 · AICTE Cyber Security Cell</span>
          </div>
          <span>DPDP Compliant · PCM destroyed in ephemeral RAM · No audio stored</span>
        </div>

      </div>
    </div>
  );
}
