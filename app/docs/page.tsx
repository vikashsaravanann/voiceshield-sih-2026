"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Terminal,
  Code2,
  PhoneCall,
  ShieldAlert,
  Copy,
  Check,
  Server,
  Radio,
  ArrowRight,
} from "lucide-react";

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DEVELOPER &amp; INTEGRATOR DOCUMENTATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            API &amp; PROTOCOL SPECIFICATION
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Integrate V-SHIELD into existing SIP trunks, Asterisk/FreeSWITCH PBX cores, WebRTC gateways, and telephonic banking IVRs using standard streaming WebSockets and REST audit endpoints.
          </p>
        </div>

        {/* Quick Reference Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold block mb-1">
              STREAMING PROTOCOL
            </span>
            <span className="text-base font-bold text-white font-mono block">WebSocket Binary PCM16</span>
            <span className="text-xs text-slate-400">16 kHz, single-channel mono, 333ms hops</span>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <span className="text-[11px] font-mono text-teal-400 uppercase font-bold block mb-1">
              AVERAGE LATENCY
            </span>
            <span className="text-base font-bold text-white font-mono block">&lt; 269ms Round-Trip</span>
            <span className="text-xs text-slate-400">Bounded inside conversational pause</span>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold block mb-1">
              DATA PRIVACY
            </span>
            <span className="text-base font-bold text-white font-mono block">DPDP Act 2023 Compliant</span>
            <span className="text-xs text-slate-400">0 bytes of raw audio persisted to disk</span>
          </div>
        </div>

        {/* Section 1: Streaming WebSocket Protocol */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  STREAMING WEBSOCKET INTAKE
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  ENDPOINT: <code className="text-emerald-400">/ws/audio</code> (WSS)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              The streaming pipeline communicates over a duplex WebSocket connection. Clients send initial session handshake JSON, stream continuous raw PCM16 binary chunks, and receive real-time detection telemetry JSON payloads within 269ms.
            </p>

            <div className="space-y-2">
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase">
                1. SESSION INITIALIZATION (CLIENT → SERVER)
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`{
  "type": "session.start",
  "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "sample_rate": 16000,
  "channels": 1,
  "chunk_ms": 333,
  "client": {
    "platform": "telephony-sip-gateway",
    "codec": "G.711u"
  }
}`}
              </pre>
            </div>

            <div className="space-y-2 pt-3">
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase">
                2. REAL-TIME DETECTION TELEMETRY (SERVER → CLIENT)
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`{
  "type": "detection.result",
  "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "chunk_index": 42,
  "spoof_probability": 0.0412,
  "risk_level": "low",
  "suggested_action": "continue",
  "latency_ms": 23.8,
  "explainability_markers": {
    "high_frequency_anomaly": 0.03,
    "phase_discontinuity": 0.04,
    "prosody_irregularity": 0.05
  },
  "model": {
    "name": "aasist",
    "version": "0.1.0"
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Section 2: REST API Endpoints */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                REST API SPECIFICATIONS
              </h2>
              <span className="text-xs font-mono text-slate-400">
                AUDIT, HEALTH &amp; MULTILINGUAL CHALLENGES
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                  GET
                </span>
                <span className="text-slate-400">/health</span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Returns service status, loaded ML model name, CPU execution device, and zero audio storage verification flag.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                  GET
                </span>
                <span className="text-slate-400">/api/challenges?language=hi</span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Retrieves dynamic phonemic challenge phrases in English, Hindi, or Tamil designed with high stop-consonant transitions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold border border-blue-500/30">
                  POST
                </span>
                <span className="text-slate-400">/api/challenges/verify</span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Verifies caller response spoof probability against the 0.35 threshold and enforces fail-closed authorization.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                  GET
                </span>
                <span className="text-slate-400">/api/sessions</span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Fetches audited call sessions with risk summaries, duration, chunk counts, and policy verdicts with Supabase RLS.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Telephony Integration Guide */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                TELEPHONY &amp; SIP TRUNK INTEGRATION
              </h2>
              <span className="text-xs font-mono text-slate-400">
                ASTERISK / FREESWITCH / TWILIO COMPATIBLE
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            V-SHIELD acts as transparent media-path middleware. It consumes the bi-directional RTP stream without terminating the call. When a spoof is detected or challenge is required, V-SHIELD returns policy action codes to the switch (e.g. SIP 603 Decline, prompt injection, or human supervisor transfer).
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              SAMPLE TWILIO MEDIA STREAMS TwiML CONFIGURATION
            </span>
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto">
{`<Response>
  <Start>
    <Stream url="wss://voiceshield-sih-2026-production.up.railway.app/ws/audio" track="inbound_track">
      <Parameter name="codec" value="audio/x-mulaw" />
      <Parameter name="rate" value="8000" />
    </Stream>
  </Start>
  <Dial>+91-1800-BANKING-IVR</Dial>
</Response>`}
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}
