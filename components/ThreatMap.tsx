"use client";

import React, { useMemo } from "react";
import { Globe, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ThreatEvent {
  id: string;
  lat: number;
  lng: number;
  risk: number;
  label: string;
}

export function ThreatMap({ sessions }: { sessions: any[] }) {
  const threats = useMemo<ThreatEvent[]>(() => {
    return sessions.flatMap((session) => {
      const location = session.risk_summary?.location ?? session.client_info?.location;
      if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") return [];
      return [{
        id: session.id,
        lat: location.lat,
        lng: location.lng,
        label: location.label || "Observed location",
        risk: session.risk_summary?.max_risk ?? 0,
      }];
    });
  }, [sessions]);

  // Convert lat/lng to SVG percentages (0-100)
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[350px]">
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Regional Detection Activity
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-slate-400">Session telemetry</span>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800/50">
        {/* Abstract Map Background (Grid style) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        <AnimatePresence>
          {threats.map((t) => {
            const pos = getPosition(t.lat, t.lng);
            const isHighRisk = t.risk > 0.7;
            const color = isHighRisk ? "text-rose-500" : "text-amber-400";
            const bgColor = isHighRisk ? "bg-rose-500" : "bg-amber-400";

            return (
              <motion.div
                key={t.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={pos}
              >
                <div className="relative flex items-center justify-center">
                  <span className={`absolute w-8 h-8 rounded-full ${bgColor} opacity-20 animate-ping`} />
                  <Crosshair className={`w-4 h-4 ${color}`} />
                  <span className="absolute left-5 whitespace-nowrap text-[10px] font-mono text-slate-400">{t.label}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {threats.length === 0 ? (
          <div className="absolute inset-0 grid place-items-center text-center text-xs text-slate-500">
            Location telemetry is unavailable for the recorded sessions.
          </div>
        ) : null}
        
        {/* Overlay scanning effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-full w-full animate-scan pointer-events-none" />
      </div>
    </div>
  );
}
