import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

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

  const stats = {
    total,
    blocked,
  };

  return <DashboardClient sessions={sessions || []} stats={stats} />;
}

