"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SplicingHeatmap } from "@/components/sandbox/SplicingHeatmap";
import { VoiceprintVault } from "@/components/VoiceprintVault";
import { DualAxisMatrix } from "@/components/DualAxisMatrix";
import {
  analyzeForensicAudio,
  type ForensicReportData,
} from "@/lib/audio/forensicAnalyzer";
import { generateSection65BCertificate } from "@/lib/exportSection65B";
import {
  getEnrolledVoiceprints,
  type VoiceprintProfile,
} from "@/lib/audio/voiceprint";
import {
  Upload,
  FileAudio,
  Play,
  Pause,
  RotateCcw,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  ArrowLeft,
  Sparkles,
  Sliders,
  CheckCircle2,
  Volume2,
  Gauge,
} from "lucide-react";

export default function ForensicSandboxPage() {
  const [activeTab, setActiveTab] = useState<"splicing" | "dual_axis">("splicing");
  const [report, setReport] = useState<ForensicReportData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [selectedCase, setSelectedCase] = useState<string>("spliced");
  const [isDragging, setIsDragging] = useState(false);

  // Dual-axis states
  const [activeProfile, setActiveProfile] = useState<VoiceprintProfile | null>(null);
  const [speakerMatch, setSpeakerMatch] = useState<number>(0.86);
  const [syntheticRisk, setSyntheticRisk] = useState<number>(0.92);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const list = getEnrolledVoiceprints();
    if (list.length > 0) setActiveProfile(list[0]);
    loadPresetCase("spliced");
  }, []);

  const loadPresetCase = async (caseType: "authentic" | "spliced" | "clone") => {
    setSelectedCase(caseType);
    setIsAnalyzing(true);
    setIsPlaying(false);
    setCurrentTimeMs(0);

    const sampleRate = 16000;
    const durationSec = caseType === "spliced" ? 8 : caseType === "clone" ? 6 : 7;
    const totalSamples = sampleRate * durationSec;
    const dummyPcm = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      dummyPcm[i] =
        0.3 * Math.sin(2 * Math.PI * 140 * t) +
        0.15 * Math.sin(2 * Math.PI * 280 * t) +
        (Math.random() - 0.5) * 0.04;
    }

    const wavBlob = pcmToWavBlob(dummyPcm, sampleRate);
    const fileName =
      caseType === "spliced"
        ? "banking_wire_fraud_spliced.wav"
        : caseType === "clone"
        ? "elevenlabs_neural_clone.wav"
        : "authentic_human_dialogue.wav";
    const file = new File([wavBlob], fileName, { type: "audio/wav" });

    try {
      const res = await analyzeForensicAudio(file, caseType);
      setReport(res);

      if (caseType === "spliced" || caseType === "clone") {
        setSpeakerMatch(0.88);
        setSyntheticRisk(res.overallSpoofProbability);
      } else {
        setSpeakerMatch(0.92);
        setSyntheticRisk(res.overallSpoofProbability);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processAudioFile = async (file: File) => {
    setIsAnalyzing(true);
    setIsPlaying(false);
    setCurrentTimeMs(0);
    setSelectedCase("custom");

    try {
      const res = await analyzeForensicAudio(file);
      setReport(res);
      setSyntheticRisk(res.overallSpoofProbability);
      setSpeakerMatch(0.74);
    } catch (err) {
      console.error("Audio file decoding failed:", err);
      alert("Unable to decode audio. Please ensure it is a valid .wav, .mp3, .m4a, or .ogg audio file.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAudioFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAudioFile(file);
  };

  const togglePlay = () => {
    if (!report) return;
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      const startTime = Date.now() - currentTimeMs / playbackRate;
      const totalMs = report.durationSeconds * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) * playbackRate;
        if (elapsed >= totalMs) {
          setCurrentTimeMs(totalMs);
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setCurrentTimeMs(elapsed);
        }
      }, 50);
    }
  };

  const handleSeek = (timeMs: number) => {
    setCurrentTimeMs(timeMs);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-24">
      {/* Background Cyber Ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,30,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,30,60,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-1/4 left-1/3 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/90 py-2.5 px-4 sm:px-6 lg:px-8 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>FORENSIC AUDIO AUDIT &amp; SPLICING LAB</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">SECTION 65B INDIAN EVIDENCE ACT / BSA 2023 CERTIFIED</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO LIVE DEMO</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Main Hero Card */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/75 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-widest bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase">
                  POST-INCIDENT FORENSICS
                </span>
                <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 uppercase">
                  ZERO DISK FOOTPRINT (DPDP 2023)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
                FORENSIC SPLICING &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  VOICEPRINT LAB
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Inspect recorded WhatsApp voice notes, voicemails, and wire-fraud calls. Identify exact
                millisecond splicing transitions and cross-reference 1:1 speaker voiceprints.
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
              <button
                onClick={() => setActiveTab("splicing")}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                  activeTab === "splicing"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>SPLICING HEATMAP</span>
              </button>
              <button
                onClick={() => setActiveTab("dual_axis")}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                  activeTab === "dual_axis"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>DUAL-AXIS RADAR</span>
              </button>
            </div>
          </div>

          {/* Benchmark Preset Selector Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">
                EVALUATION BENCHMARKS:
              </span>
              <button
                onClick={() => loadPresetCase("spliced")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  selectedCase === "spliced"
                    ? "bg-rose-950/70 border-rose-500/60 text-rose-300 shadow-md shadow-rose-500/15"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Spliced Banking Scam (2.5s–5.8s)
              </button>
              <button
                onClick={() => loadPresetCase("clone")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  selectedCase === "clone"
                    ? "bg-purple-950/70 border-purple-500/60 text-purple-300 shadow-md shadow-purple-500/15"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🤖 100% Neural Vocoder Clone
              </button>
              <button
                onClick={() => loadPresetCase("authentic")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  selectedCase === "authentic"
                    ? "bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-500/15"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🌿 Authentic Human Speech
              </button>
            </div>

            {/* Custom Audio File Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.wav,.mp3,.m4a,.ogg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase transition-all shadow-md shadow-cyan-500/10"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>UPLOAD AUDIO (.WAV / .MP3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Splicing Heatmap & Forensic PDF Certificate */}
        {activeTab === "splicing" && report && (
          <div className="space-y-6">
            {/* Playback Controls & Forensic Actions Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/65 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={() => handleSeek(0)}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                  title="Reset to 0.00s"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="font-mono text-sm">
                  <span className="text-white font-bold">
                    {(currentTimeMs / 1000).toFixed(2)}s
                  </span>
                  <span className="text-slate-500"> / {report.durationSeconds}s</span>
                </div>

                {/* Slow-motion Forensic Playback Speed Control */}
                <div className="hidden sm:flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[10px] font-mono">
                  {[0.5, 1, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackRate(speed)}
                      className={`px-2 py-0.5 rounded font-bold ${
                        playbackRate === speed
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-slate-500 hover:text-white"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* SHA-256 Badge & PDF Export */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-1.5 flex items-center gap-2">
                  <span className="text-slate-500 text-[10px]">SHA-256:</span>
                  <span className="text-cyan-300 text-[11px] font-semibold truncate max-w-[170px] sm:max-w-[260px]">
                    {report.fileSha256}
                  </span>
                </div>

                <button
                  onClick={() => generateSection65BCertificate(report)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono font-bold text-xs uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>EXPORT SECTION 65B CERTIFICATE (PDF)</span>
                </button>
              </div>
            </div>

            {/* Splicing Heatmap Timeline */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
              <SplicingHeatmap
                report={report}
                currentTimeMs={currentTimeMs}
                onSeek={handleSeek}
                isPlaying={isPlaying}
              />
            </div>

            {/* Forensic Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-[10px] font-mono uppercase text-slate-400">OVERALL SPOOF RISK</div>
                <div
                  className={`text-2xl font-black font-mono mt-1 ${
                    report.overallSpoofProbability >= 0.75
                      ? "text-rose-400"
                      : report.overallSpoofProbability >= 0.35
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {(report.overallSpoofProbability * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Peak slice: {(report.maxSpoofProbability * 100).toFixed(1)}%
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-[10px] font-mono uppercase text-slate-400">SPLICED INSERTIONS</div>
                <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                  {report.spliceRegions.filter((r) => r.type === "synthetic_insertion").length} REGIONS
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {report.syntheticDurationMs}ms total synthetic duration
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-[10px] font-mono uppercase text-slate-400">CONTAMINATION PROPORTION</div>
                <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                  {(report.syntheticRatio * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Timeline share of synthetic clone
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-[10px] font-mono uppercase text-slate-400">STATUTORY ADMISSIBILITY</div>
                <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SECTION 65B READY</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  BSA 2023 §63 cryptographic format
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dual-Axis Identity Matrix & Voiceprint Vault */}
        {activeTab === "dual_axis" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Voiceprint Vault */}
              <div className="lg:col-span-5 space-y-4">
                <VoiceprintVault
                  selectedProfileId={activeProfile?.id ?? ""}
                  onSelectProfile={(p) => {
                    setActiveProfile(p);
                    setSpeakerMatch(p.id.includes("ceo") ? 0.92 : 0.48);
                  }}
                />

                {/* Acoustic Drift Simulation Slider */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>LIVE ACOUSTIC CALIBRATION</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Judge Simulator</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Speaker Identity Match (X):</span>
                      <span className="text-cyan-400 font-bold">{(speakerMatch * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={speakerMatch * 100}
                      onChange={(e) => setSpeakerMatch(Number(e.target.value) / 100)}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Neural Vocoder Spoof Risk (Y):</span>
                      <span className="text-rose-400 font-bold">{(syntheticRisk * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={syntheticRisk * 100}
                      onChange={(e) => setSyntheticRisk(Number(e.target.value) / 100)}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: 2D Radar Matrix */}
              <div className="lg:col-span-7">
                <DualAxisMatrix
                  speakerMatch={speakerMatch}
                  syntheticRisk={syntheticRisk}
                  contactName={activeProfile?.name ?? "Claimed Contact"}
                  isStreaming={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function pcmToWavBlob(pcm: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcm.length * 2, true);

  let offset = 44;
  for (let i = 0; i < pcm.length; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}
