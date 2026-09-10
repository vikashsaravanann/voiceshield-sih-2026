import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import UserMenu from "@/components/UserMenu";

export const revalidate = 0; // Force dynamic to always fetch fresh data

const DEFAULT_SESSIONS = [
  {
    id: "sess_inw24_00192",
    started_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "flagged",
    risk_summary: {
      max_risk: 0.94,
      avg_risk: 0.88,
      decision: "blocked",
      latency_ms: 22.4,
    },
    client_info: { browser: "SIP Trunk / Twilio", os: "Asterisk PBX" },
  },
  {
    id: "sess_inw24_00191",
    started_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    status: "active",
    risk_summary: {
      max_risk: 0.06,
      avg_risk: 0.04,
      decision: "allowed",
      latency_ms: 18.2,
    },
    client_info: { browser: "Chrome / WebRTC", os: "macOS 14" },
  },
  {
    id: "sess_inw24_00190",
    started_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "flagged",
    risk_summary: {
      max_risk: 0.98,
      avg_risk: 0.91,
      decision: "blocked",
      latency_ms: 24.1,
    },
    client_info: { browser: "FreeSWITCH VoIP", os: "Debian SBC" },
  },
  {
    id: "sess_inw24_00189",
    started_at: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    status: "active",
    risk_summary: {
      max_risk: 0.12,
      avg_risk: 0.08,
      decision: "allowed",
      latency_ms: 19.5,
    },
    client_info: { browser: "Mobile VoLTE", os: "Android 14" },
  },
  {
    id: "sess_inw24_00188",
    started_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    status: "flagged",
    risk_summary: {
      max_risk: 0.86,
      avg_risk: 0.79,
      decision: "blocked",
      latency_ms: 21.0,
    },
    client_info: { browser: "IVR Gateway", os: "Cisco SBC" },
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch recent sessions
  const { data: dbSessions, error } = await supabase
    .from("sessions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Database query fallback to baseline sessions:", error.message);
  }

  // Use database sessions or baseline mock sessions if database table is empty
  const sessions = (dbSessions && dbSessions.length > 0) ? dbSessions : DEFAULT_SESSIONS;

  // Calculate stats
  const total = sessions.length;
  const blocked = sessions.filter((s) => s.status === "flagged" || s.risk_summary?.decision === "blocked").length;
  const averageRisk = total
    ? sessions.reduce((sum, session) => sum + Number(session.risk_summary?.avg_risk ?? 0), 0) / total
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
      <DashboardClient sessions={sessions} stats={stats} />
    </div>
  );
}
