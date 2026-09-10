import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import UserMenu from "@/components/UserMenu";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch recent sessions
  const { data: dbSessions, error } = await supabase
    .from("sessions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(50);

  if (error) console.error("Unable to load dashboard sessions:", error.message);

  const sessions = dbSessions ?? [];

  // Calculate stats
  const total = sessions.length;
  const blocked = sessions.filter((s) => s.status === "flagged" || s.risk_summary?.decision === "blocked").length;
  const averageRisk = total
    ? sessions.reduce((sum, session) => sum + Number(session.risk_summary?.avg_risk ?? 0), 0) / total
    : 0;
  const latencyValues = sessions
    .map((session) => Number(session.risk_summary?.latency_ms))
    .filter((latency) => Number.isFinite(latency) && latency > 0);

  const stats = {
    total,
    blocked,
    averageRisk,
    averageLatency: latencyValues.length
      ? latencyValues.reduce((sum, latency) => sum + latency, 0) / latencyValues.length
      : null,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950">
      <div className="absolute right-4 top-4 z-50 sm:right-6 sm:top-6 lg:right-10 lg:top-10">
        <UserMenu />
      </div>
      <DashboardClient sessions={sessions} stats={stats} />
    </div>
  );
}
