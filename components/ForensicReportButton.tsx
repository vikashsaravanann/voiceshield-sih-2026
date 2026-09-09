"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useForensicReport } from "@/lib/useForensicReport";
import { createClient } from "@/lib/supabase/browser";

interface Session {
  id: string;
  started_at: string;
  status?: string;
  risk_summary?: {
    max_risk?: number;
    decision?: string;
    reason?: string;
    transcript?: string;
    detected_language?: string;
    origin_location?: string;
    dsp_markers?: { feature: string; value: string | number; anomaly: boolean }[];
    latency_ms?: number;
  };
}

export function ForensicReportButton({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const { generateReport } = useForensicReport();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const risk = session.risk_summary;
      const { data: events } = await createClient()
        .from("detection_events")
        .select("explainability_markers")
        .eq("session_id", session.id)
        .order("chunk_index", { ascending: false })
        .limit(12);
      const riskScore = risk?.max_risk ?? 0;
      const isBlocked = session.status === "flagged" || risk?.decision === "blocked";

      generateReport({
        sessionId: session.id,
        timestamp: session.started_at,
        riskScore,
        riskLevel: riskScore >= 0.75 ? "HIGH" : riskScore >= 0.4 ? "MEDIUM" : "LOW",
        transcript: risk?.transcript,
        detectedLanguage: risk?.detected_language ?? "English",
        originLocation: risk?.origin_location ?? "Unavailable (location not collected)",
        decision: isBlocked ? "blocked" : "allowed",
        reason: risk?.reason ?? (isBlocked ? "High spoof probability — vocoder artifacts detected" : "No anomalies found"),
        dspMarkers: risk?.dsp_markers ?? Object.entries(events?.[0]?.explainability_markers ?? {}).map(([feature, value]) => ({
          feature,
          value: typeof value === "number" ? value : String(value),
          anomaly: riskScore >= 0.7,
        })),
        latencyMs: risk?.latency_ms,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      title="Download Forensic PDF Report"
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold
        border transition-all duration-200 select-none
        ${loading
          ? "bg-slate-800 border-slate-700 text-slate-500 cursor-wait"
          : "bg-cyan-950/60 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95"
        }
      `}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <FileText className="w-3.5 h-3.5" />
      )}
      <span>{loading ? "Generating..." : "FIR Report"}</span>
    </button>
  );
}
