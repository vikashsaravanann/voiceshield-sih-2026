"use client";

import { FileWarning } from "lucide-react";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  started_at: string;
  status?: string;
  risk_summary?: {
    max_risk?: number;
    decision?: string;
  };
}

export function I4CReportButton({ session }: { session: Session }) {
  const router = useRouter();
  
  const maxRisk = session.risk_summary?.max_risk ? Math.round(session.risk_summary.max_risk * 100) : 0;
  const isBlocked = session.status === 'flagged' || session.risk_summary?.decision === 'blocked';

  if (!isBlocked) return null;

  const handleClick = () => {
    router.push(`/report?sessionId=${session.id}&riskScore=${maxRisk}`);
  };

  return (
    <button
      onClick={handleClick}
      title="File I4C Cybercrime Report"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 select-none bg-amber-950/60 border-amber-500/30 text-amber-300 hover:bg-amber-900/60 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 ml-2"
    >
      <FileWarning className="w-3.5 h-3.5" />
      <span>I4C Portal</span>
    </button>
  );
}
