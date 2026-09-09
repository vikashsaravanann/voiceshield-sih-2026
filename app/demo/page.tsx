"use client";

import React, { useState } from "react";
import { AudioStreamer } from "@/components/AudioStreamer";
import { RiskMeter } from "@/components/RiskMeter";
import { SpectrogramView } from "@/components/SpectrogramView";
import { ChallengeResponse } from "@/components/ChallengeResponse";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { SessionSummary } from "@/components/SessionSummary";
import { DetectionResponse, ConnectionState, SessionStats } from "@/types/detection";
import { Mic, MicOff, WifiOff, Volume2, ShieldAlert } from "lucide-react";

export default function DemoPage() {
  const [latestDetection, setLatestDetection] = useState<DetectionResponse | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
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
    // Auto-trigger phonemic challenge if risk enters medium or high zone
    if (res.spoof_probability >= 0.35 && !challengeActive) {
      setChallengeActive(true);
    }
  };

  const currentProbability = latestDetection?.spoof_probability ?? 0.04;
  const currentRisk = latestDetection?.risk_level ?? "low";
  const latencyMs = latestDetection?.latency_ms ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-1">
              <span>SIH26104 OPERATOR CONSOLE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Live Voice Clone Detection Path
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              333ms raw PCM16 audio hops inspected via hybrid LFCC & deep neural representations.
            </p>
          </div>

          <AudioStreamer
            onRiskUpdate={handleRiskUpdate}
            onConnectionChange={setConnectionState}
            onStatsUpdate={setStats}
          >
            {({
              isStreaming,
              connectionState,
              reconnectAttempt,
              reconnectDelayMs,
              bufferedCount,
              start,
              stop,
              simulateDisconnect,
              toggleCloneSimulation,
              isSimulatingClone,
            }) => (
              <div className="flex flex-col items-end gap-3">
                <ConnectionStatus
                  state={connectionState}
                  reconnectAttempt={reconnectAttempt}
                  reconnectDelayMs={reconnectDelayMs}
                  bufferedChunksCount={bufferedCount}
                />

                <div className="flex items-center gap-2 flex-wrap">
                  {!isStreaming ? (
                    <button
                      onClick={start}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Live Audio</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={stop}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Stop Stream</span>
                      </button>

                      {/* Judge Demo Control: Inject Cloned Audio */}
                      <button
                        onClick={toggleCloneSimulation}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                          isSimulatingClone
                            ? "bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                        }`}
                        title="Simulate injection of neural vocoder synthetic voice"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isSimulatingClone ? "Cloned Stream Active" : "Inject Clone Audio"}</span>
                      </button>

                      {/* Judge Demo Control: Simulate Drop */}
                      <button
                        onClick={simulateDisconnect}
                        className="px-3 py-2.5 rounded-xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-950/50 text-amber-300 text-xs font-bold tracking-wider transition-all flex items-center gap-1.5"
                        title="Simulate network sever to demonstrate ring buffering and session resume"
                      >
                        <WifiOff className="w-4 h-4" />
                        <span>Simulate Network Drop</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </AudioStreamer>
        </div>

        {/* Live Visualizers Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Risk Meter */}
          <RiskMeter
            probability={currentProbability}
            riskLevel={currentRisk}
            latencyMs={latencyMs}
          />

          {/* Right: Spectrogram & Explainability */}
          <SpectrogramView
            markers={latestDetection?.explainability_markers}
            isActive={connectionState === "connected"}
            spoofProbability={currentProbability}
          />
        </div>

        {/* Active Challenge-Response Trigger */}
        {challengeActive && (
          <div className="transition-all animate-fadeIn">
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
              }}
            />
          </div>
        )}

        {/* Session Forensics Summary */}
        <SessionSummary stats={stats} />
      </div>
    </div>
  );
}
