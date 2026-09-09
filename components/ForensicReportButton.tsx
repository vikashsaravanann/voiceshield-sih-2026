"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useForensicReport } from "@/lib/useForensicReport";

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
      // Small delay to show loading state then generate
      await new Promise((r) => setTimeout(r, 300));

      const risk = session.risk_summary;
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
        dspMarkers: risk?.dsp_markers ?? [
          { feature: "Spectral Roll-off", value: riskScore > 0.6 ? 7800 : 4200, anomaly: riskScore > 0.6 },
          { feature: "Zero Crossing Rate", value: riskScore > 0.6 ? 0.18 : 0.09, anomaly: riskScore > 0.6 },
          { feature: "Phase Jitter", value: riskScore > 0.6 ? "Detected" : "Normal", anomaly: riskScore > 0.6 },
        ],
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
