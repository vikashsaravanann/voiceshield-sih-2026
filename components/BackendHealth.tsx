"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ServerCrash,
  RefreshCw,
  Cpu,
  Wifi,
  Database,
  Activity,
  Zap,
} from "lucide-react";

type Health = {
  status: string;
  model_loaded: boolean;
  model_name: string;
  version: string;
  device: string;
  store_raw_audio: boolean;
};

function apiBaseUrl() {
  if (process.env.NEXT_PUBLIC_FASTAPI_HTTP_URL)
    return process.env.NEXT_PUBLIC_FASTAPI_HTTP_URL;
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return "https://voiceshield-sih-2026-production.up.railway.app";
  }
  return "http://localhost:8000";
}

interface BackendHealthProps {
  compact?: boolean;
  wsConnected?: boolean; // passed from demo page so we know WS is live
}

export function BackendHealth({
  compact = false,
  wsConnected = false,
}: BackendHealthProps) {
  const [health, setHealth] = useState<Health | null>(null);
  const [httpError, setHttpError] = useState(false);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const check = async () => {
    setRetrying(true);
    setHttpStatus(null);
    try {
      const res = await fetch(`${apiBaseUrl()}/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      setHttpStatus(res.status);
      if (!res.ok) throw new Error("not ok");
      const data = (await res.json()) as Health;
      setHealth(data);
      setHttpError(false);
    } catch {
      setHttpError(true);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    void check();
    const t = window.setInterval(check, 20000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WebSocket connection is the ground truth — if WS is alive, backend IS up.
  const online = Boolean(health && !httpError) || wsConnected;

  // ── Compact pill ──────────────────────────────────────────────────────────
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono font-semibold ${
          online
            ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
            : "border-amber-500/30 bg-amber-950/30 text-amber-400"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            online ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
          }`}
        />
        {online ? "API ONLINE" : loading ? "CONNECTING…" : "API STANDBY"}
      </span>
    );
  }

  // ── Full card ─────────────────────────────────────────────────────────────
  const statusLabel = online
    ? "Inference API · Online"
    : loading
    ? "Inference API · Connecting…"
    : "Inference API · Standby";

  const statusSub = wsConnected && httpError
    ? `WebSocket active — HTTP health probe returned ${httpStatus ?? "no response"}.`
    : httpError
    ? httpStatus === 404
      ? "Inference service is not registered at this URL yet. The browser shell remains available."
      : "Inference service is unavailable. Retry after the backend is awake."
    : loading
    ? "Probing the SIH inference service…"
    : "All systems nominal.";

  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-500 ${
        online
          ? "border-emerald-500/30 bg-emerald-950/10 shadow-lg shadow-emerald-500/5"
          : httpError
          ? "border-slate-700/60 bg-slate-900/50"
          : "border-slate-800/80 bg-slate-900/40"
      }`}
    >
      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        {/* Icon + title */}
        <div className="flex items-center gap-4">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              online
                ? "border-emerald-500/30 bg-emerald-950/40"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            {online ? (
              <CheckCircle2 className="text-emerald-400 w-5 h-5" />
            ) : (
              <ServerCrash
                className={`w-5 h-5 ${
                  loading ? "text-slate-500 animate-pulse" : "text-slate-500"
                }`}
              />
            )}
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold tracking-[0.2em] text-slate-500 uppercase mb-0.5">
              Control Plane
            </p>
            <h2 className="text-sm font-bold text-white leading-tight">
              {statusLabel}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-lg">{statusSub}</p>
          </div>
        </div>

        {/* Right: live pulse + retry */}
        <div className="flex items-center gap-3 shrink-0">
          {online && (
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          )}
          {httpError && !wsConnected && (
            <button
              onClick={check}
              disabled={retrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`}
              />
              {retrying ? "Checking…" : "Retry"}
            </button>
          )}
        </div>
      </div>

      {/* ── Health detail grid (only when HTTP is healthy) ─────────────────── */}
      {health && !httpError && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Cpu,
              label: "Model",
              value: health.model_name || "DSP + Groq",
            },
            { icon: Zap, label: "Version", value: `v${health.version}` },
            {
              icon: Wifi,
              label: "Runtime",
              value: health.device?.toUpperCase() || "CPU",
            },
            {
              icon: Database,
              label: "Audio Storage",
              value: health.store_raw_audio ? "Retained" : "RAM Only ✓",
              highlight: !health.store_raw_audio,
            },
          ].map(({ icon: Icon, label, value, highlight }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-slate-500">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  {label}
                </span>
              </div>
              <p
                className={`text-sm font-bold ${
                  highlight ? "text-emerald-400" : "text-white"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── WS-connected but HTTP failed (CORS) → brief reassurance ──────── */}
      {wsConnected && httpError && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
          <p className="text-xs text-emerald-300/80 leading-relaxed">
            <strong className="text-emerald-300">✅ Backend Confirmed Online:</strong> Your
            WebSocket connection is live and streaming audio in real-time. The HTTP health
            endpoint returned {httpStatus ?? "no response"}, but the active stream is authoritative.
          </p>
        </div>
      )}

      {/* ── Both offline → demo mode note ───────────────────────────────── */}
      {!online && !loading && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-950/10 px-4 py-3">
          <p className="text-xs text-amber-300/80 leading-relaxed">
            <strong className="text-amber-300">ℹ️ Browser Shell Active:</strong> The visual
            console remains available, but live inference and risk updates require the backend
            WebSocket. Retry after the service is deployed or awake.
          </p>
        </div>
      )}
    </div>
  );
}
