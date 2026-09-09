"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Database, ServerCrash } from "lucide-react";

type Health = {
  status: string;
  model_loaded: boolean;
  model_name: string;
  version: string;
  device: string;
  store_raw_audio: boolean;
};

function apiBaseUrl() {
  if (process.env.NEXT_PUBLIC_FASTAPI_HTTP_URL) return process.env.NEXT_PUBLIC_FASTAPI_HTTP_URL;
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return "https://voiceshield-api.onrender.com";
  }
  return "http://localhost:8000";
}

export function BackendHealth({ compact = false }: { compact?: boolean }) {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const response = await fetch(`${apiBaseUrl()}/health`, { cache: "no-store" });
        if (!response.ok) throw new Error("health check failed");
        const data = (await response.json()) as Health;
        if (!cancelled) {
          setHealth(data);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };
    void check();
    const timer = window.setInterval(check, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const online = Boolean(health && !error);
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono ${online ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300" : "border-amber-500/30 bg-amber-950/30 text-amber-300"}`}>
        <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
        {online ? "API ONLINE" : "API CHECKING"}
      </span>
    );
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {online ? <CheckCircle2 className="text-emerald-400" size={18} /> : <ServerCrash className="text-amber-400" size={18} />}
          <div>
            <p className="eyebrow">Control plane</p>
            <h2 className="mt-1 text-base font-semibold text-white">{online ? "Inference API online" : "Inference API unavailable"}</h2>
          </div>
        </div>
        <Activity size={16} className={online ? "text-emerald-400" : "text-amber-400"} />
      </div>
      {health ? (
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400 sm:grid-cols-4">
          <span><strong className="block text-slate-200">{health.model_name}</strong>model</span>
          <span><strong className="block text-slate-200">v{health.version}</strong>version</span>
          <span><strong className="block text-slate-200">{health.device}</strong>runtime</span>
          <span className="flex items-start gap-1"><Database size={12} className="mt-0.5" /><strong className="text-emerald-300">{health.store_raw_audio ? "retained" : "RAM only"}</strong></span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">Waiting for the SIH inference service health response.</p>
      )}
    </section>
  );
}
