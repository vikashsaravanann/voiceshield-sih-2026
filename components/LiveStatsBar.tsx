"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function LiveStatsBar() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    threatsBlocked: 0,
    activeStreams: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("sessions")
        .select("status, risk_summary")
        .gte("started_at", today.toISOString());
      
      if (data) {
        setStats({
          totalSessions: data.length,
          threatsBlocked: data.filter((s: any) => s.status === "flagged" || s.risk_summary?.decision === "blocked").length,
          activeStreams: data.filter((s: any) => s.status === "active").length,
        });
      }
    };
    
    fetchStats();

    const channel = supabase
      .channel("live-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 font-mono">Total Sessions Today</p>
        <p className="text-3xl font-sans font-bold text-slate-100">{stats.totalSessions}</p>
      </div>
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500/80 mb-2 font-mono">Threats Blocked</p>
        <p className="text-3xl font-sans font-bold text-rose-400">{stats.threatsBlocked}</p>
      </div>
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-500/80 mb-2 font-mono">Active Streams</p>
        <p className="text-3xl font-sans font-bold text-cyan-400 flex items-center gap-3">
          {stats.activeStreams > 0 && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          )}
          {stats.activeStreams}
        </p>
      </div>
    </div>
  );
}
