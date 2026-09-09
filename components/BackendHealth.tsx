"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Database,
  ServerCrash,
  RefreshCw,
  Cpu,
  Wifi,
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
    return "https://voiceshield-sih-2026.onrender.com";
  }
  return "http://localhost:8000";
}

export function BackendHealth({ compact = false }: { compact?: boolean }) {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const check = async () => {
    try {
      setRetrying(true);
      const response = await fetch(`${apiBaseUrl()}/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("health check failed");
      const data = (await response.json()) as Health;
      setHealth(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (cancelled) return;
      await check();
    };
    void run();
    const timer = window.setInterval(run, 20000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const online = Boolean(health && !error);

  // ── Compact mode (for inline use) ────────────────────────────────────────
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono ${
          online
            ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
            : "border-amber-500/30 bg-amber-950/30 text-amber-300"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            online ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
          }`}
        />
        {online ? "API ONLINE" : loading ? "CONNECTING…" : "API STANDBY"}
      </span>
    );
  }

  // ── Full mode ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-500 ${
        online
          ? "border-emerald-500/30 bg-emerald-950/10 shadow-lg shadow-emerald-500/5"
          : error
          ? "border-amber-500/25 bg-amber-950/10"
          : "border-slate-800/80 bg-slate-900/50"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: icon + title */}
        <div className="flex items-center gap-4">
          <div
            className={`p-2.5 rounded-xl border ${
              online
                ? "border-emerald-500/30 bg-emerald-950/40"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            {online ? (
              <CheckCircle2 className="text-emerald-400 w-5 h-5" />
            ) : (
              <ServerCrash
                className={`w-5 h-5 ${error ? "text-amber-400" : "text-slate-500 animate-pulse"}`}
              />
            )}
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold tracking-[0.2em] text-slate-500 uppercase mb-0.5">
              Control Plane
            </p>
            <h2 className="text-base font-bold text-white leading-tight">
              {online
                ? "Inference API · Online"
                : error
                ? "Inference API · Standby Mode"
                : "Inference API · Connecting…"}
            </h2>
            {!online && (
              <p className="text-xs text-slate-500 mt-0.5">
                {error
                  ? "Render free tier may be cold-starting. This takes ~50 seconds. Demo still runs locally."
                  : "Waiting for health response from the SIH inference service…"}
              </p>
            )}
          </div>
        </div>

        {/* Right: status + retry */}
        <div className="flex items-center gap-3 shrink-0">
          <Activity
            className={`w-4 h-4 ${online ? "text-emerald-400 animate-pulse" : "text-slate-600"}`}
          />
          {error && (
            <button
              onClick={check}
              disabled={retrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`} />
              {retrying ? "Checking…" : "Retry"}
            </button>
          )}
        </div>
      </div>

      {/* Health detail grid (shown when online) */}
      {online && health && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Cpu, label: "Model", value: health.model_name || "DSP+Groq" },
            { icon: Activity, label: "Version", value: `v${health.version}` },
            { icon: Wifi, label: "Runtime", value: health.device || "CPU" },
            {
              icon: Database,
              label: "Audio Storage",
              value: health.store_raw_audio ? "Retained" : "RAM Only ✓",
              highlight: !health.store_raw_audio,
            },
          ].map(({ icon: Icon, label, value, highlight }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-slate-500">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
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

      {/* Offline fallback note */}
      {error && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-950/20 px-4 py-3">
          <p className="text-xs text-amber-300/80 leading-relaxed">
            <strong className="text-amber-300">ℹ️ Demo Mode Active:</strong> The DSP engine and Risk Meter are running
            entirely in your browser. All visualizations work without the cloud API. The Render
            backend will auto-wake within 50 seconds.
          </p>
        </div>
      )}
    </div>
  );
}
