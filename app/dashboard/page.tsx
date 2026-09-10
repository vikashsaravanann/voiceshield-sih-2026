import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import UserMenu from "@/components/UserMenu";

export const revalidate = 0; // Force dynamic to always fetch fresh data

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch recent sessions
  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching sessions:", error);
  }

  // Calculate stats
  const total = sessions?.length || 0;
  const blocked = sessions?.filter((s) => s.status === "flagged" || s.risk_summary?.decision === "blocked").length || 0;
  const averageRisk = total
    ? (sessions ?? []).reduce((sum, session) => sum + Number(session.risk_summary?.avg_risk ?? 0), 0) / total
    : 0;

  const stats = {
    total,
    blocked,
    averageRisk,
  };

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
        <UserMenu />
      </div>
      <DashboardClient sessions={sessions || []} stats={stats} />
    </div>
  );
}
