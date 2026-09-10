"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getEnrolledVoiceprints,
  saveEnrolledVoiceprint,
  deleteEnrolledVoiceprint,
  extractAcousticEmbedding,
  type VoiceprintProfile,
} from "@/lib/audio/voiceprint";
import { UserCheck, Mic, MicOff, Plus, Trash2, CheckCircle2, Volume2, ShieldCheck, Activity } from "lucide-react";

interface VoiceprintVaultProps {
  selectedProfileId: string;
  onSelectProfile: (profile: VoiceprintProfile) => void;
}

export function VoiceprintVault({ selectedProfileId, onSelectProfile }: VoiceprintVaultProps) {
  const [profiles, setProfiles] = useState<VoiceprintProfile[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollName, setEnrollName] = useState("");
  const [enrollRole, setEnrollRole] = useState("");
  const [enrollPhone, setEnrollPhone] = useState("");
  const [recordingCountdown, setRecordingCountdown] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "processing">("idle");
  const [liveVolume, setLiveVolume] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const list = getEnrolledVoiceprints();
    setProfiles(list);
    if (!selectedProfileId && list.length > 0) {
      onSelectProfile(list[0]);
    }
  }, [selectedProfileId, onSelectProfile]);

  const handleStartEnrollment = async () => {
    if (!enrollName.trim()) return;
    try {
      setRecordingStatus("recording");
      setRecordingCountdown(5);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      const audioChunks: Float32Array[] = [];

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        audioChunks.push(new Float32Array(input));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const volInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setLiveVolume(Math.min(100, Math.round((sum / dataArray.length / 128) * 100)));
      }, 60);

      const interval = setInterval(() => {
        setRecordingCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            clearInterval(volInterval);
            finishRecording(audioChunks, stream, audioContext, processor, source);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone enrollment error:", err);
      setRecordingStatus("idle");
      alert("Microphone access was denied or is unavailable.");
    }
  };

  const finishRecording = (
    audioChunks: Float32Array[],
    stream: MediaStream,
    audioContext: AudioContext,
    processor: ScriptProcessorNode,
    source: MediaStreamAudioSourceNode
  ) => {
    setRecordingStatus("processing");
    setLiveVolume(0);
    try {
      source.disconnect();
      processor.disconnect();
      stream.getTracks().forEach((t) => t.stop());
      audioContext.close();

      const totalLen = audioChunks.reduce((acc, c) => acc + c.length, 0);
      const fullPcm = new Float32Array(totalLen);
      let offset = 0;
      for (const chunk of audioChunks) {
        fullPcm.set(chunk, offset);
        offset += chunk.length;
      }

      const { embedding, pitchMeanHz, spectralCentroid } = extractAcousticEmbedding(fullPcm);

      const newProfile: VoiceprintProfile = {
        id: `vp-custom-${Date.now()}`,
        name: enrollName.trim(),
        role: enrollRole.trim() || "Enrolled Contact",
        phoneNumber: enrollPhone.trim() || undefined,
        enrolledAt: new Date().toISOString(),
        embedding,
        pitchMeanHz,
        spectralCentroid,
      };

      const updated = saveEnrolledVoiceprint(newProfile);
      setProfiles(updated);
      onSelectProfile(newProfile);
      setIsEnrolling(false);
      setEnrollName("");
      setEnrollRole("");
      setEnrollPhone("");
      setRecordingStatus("idle");
    } catch (err) {
      console.error("Error finalizing voiceprint:", err);
      setRecordingStatus("idle");
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteEnrolledVoiceprint(id);
    setProfiles(updated);
    if (selectedProfileId === id && updated.length > 0) {
      onSelectProfile(updated[0]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/85 p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wider uppercase text-white">
              BIOMETRIC VOICEPRINT VAULT
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              TRUSTED SPEAKER ACOUSTIC EMBEDDINGS (16-DIM VECTOR HASH)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEnrolling(!isEnrolling)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase transition-all shadow-md shadow-emerald-500/10"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isEnrolling ? "CANCEL" : "ENROLL NEW VOICE"}</span>
        </button>
      </div>

      {/* Enrollment Drawer */}
      {isEnrolling && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>5-SECOND MICROPHONE ENROLLMENT</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Volatile memory (DPDP 2023)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              placeholder="Contact Name (e.g. Vikram Sharma)"
              value={enrollName}
              onChange={(e) => setEnrollName(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 outline-none"
            />
            <input
              type="text"
              placeholder="Designation (e.g. CEO / Director)"
              value={enrollRole}
              onChange={(e) => setEnrollRole(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 outline-none"
            />
            <input
              type="text"
              placeholder="Phone (e.g. +91 98201 44819)"
              value={enrollPhone}
              onChange={(e) => setEnrollPhone(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 outline-none"
            />
          </div>

          {/* Live Audio Level Meter during recording */}
          {recordingStatus === "recording" && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-mono text-emerald-300">
                <span>ACOUSTIC SPECTRUM INPUT:</span>
                <span>LEVEL: {liveVolume}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-emerald-500/30">
                <div
                  style={{ width: `${liveVolume}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-300 max-w-sm">
              {recordingStatus === "recording"
                ? `Recording voice harmonics... (${recordingCountdown}s remaining)`
                : recordingStatus === "processing"
                ? "Synthesizing acoustic voiceprint matrix & F0 formant centroid..."
                : "Speak continuously into your microphone for 5 seconds."}
            </p>

            <button
              disabled={!enrollName.trim() || recordingStatus !== "idle"}
              onClick={handleStartEnrollment}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              {recordingStatus === "recording" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>RECORDING ({recordingCountdown}S)</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>START 5S RECORDING</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {profiles.map((profile) => {
          const isSelected = profile.id === selectedProfileId;
          return (
            <div
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className={`relative cursor-pointer rounded-xl p-3.5 border transition-all duration-200 ${
                isSelected
                  ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{profile.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 truncate">{profile.role}</div>
                  {profile.phoneNumber && (
                    <div className="text-[9px] font-mono text-slate-400">{profile.phoneNumber}</div>
                  )}
                </div>

                {!profile.id.startsWith("vp-ceo") && !profile.id.startsWith("vp-family") && (
                  <button
                    onClick={(e) => handleDelete(profile.id, e)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Acoustic Vector Sub-band Mini-Bars */}
              <div className="mt-3 flex items-center gap-0.5 h-4 w-full bg-slate-900 rounded p-0.5 border border-slate-800/80">
                {profile.embedding.slice(0, 16).map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${Math.min(100, Math.max(15, val * 100))}%` }}
                    className={`flex-1 rounded-xs ${isSelected ? "bg-emerald-400" : "bg-cyan-500/60"}`}
                  />
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span>F0: {profile.pitchMeanHz}Hz</span>
                <span>Centroid: {profile.spectralCentroid}Hz</span>
                <span className="text-emerald-400 font-semibold">16-DIM</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
