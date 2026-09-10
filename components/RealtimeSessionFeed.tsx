"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { format } from "date-fns";

type DetectionEvent = {
  id: string;
  session_id: string;
  created_at: string;
  risk_level: "low" | "medium" | "high";
  spoof_probability: number;
  latency_ms: number;
};

export function RealtimeSessionFeed() {
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [isActive, setIsActive] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "detection_events",
        },
        (payload) => {
          const newEvent = payload.new as DetectionEvent;
          setEvents((prev) => {
            const updated = [newEvent, ...prev];
            return updated.slice(0, 20); // Keep last 20
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <h3 className="text-lg font-bold text-white font-sans">Live Feed</h3>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          )}
          <span className="text-xs font-mono tracking-widest text-slate-400">
            {isActive ? "LIVE" : "CONNECTING..."}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {events.length === 0 ? (
            <div className="text-center text-sm text-slate-500 py-10 font-mono">Waiting for events...</div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className="animate-in fade-in slide-in-from-top-4 duration-300 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">
                    {ev.created_at ? format(new Date(ev.created_at), "HH:mm:ss") : "--:--:--"}
                  </span>
                  <span className="text-slate-500">#{ev.session_id ? ev.session_id.substring(0, 8) : "unknown"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        ev.risk_level === "high"
                          ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                          : ev.risk_level === "medium"
                          ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        ev.risk_level === "high"
                          ? "text-rose-400"
                          : ev.risk_level === "medium"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {Math.round((ev.spoof_probability || 0) * 100)}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{ev.latency_ms || 0}ms</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
