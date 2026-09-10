"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/browser";
import { AlertTriangle, X } from "lucide-react";

type Alert = {
  id: string;
  session_id: string;
  timestamp: number;
};

export function LiveAlertToast() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const supabase = createClient();
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.error("Audio playback failed", err);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("live-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "detection_events",
          filter: "risk_level=eq.high",
        },
        (payload) => {
          const newEvent = payload.new;
          const newAlert: Alert = {
            id: newEvent.id || Math.random().toString(),
            session_id: newEvent.session_id || "unknown",
            timestamp: Date.now(),
          };
          setAlerts((prev) => [...prev, newAlert]);
          playBeep();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setAlerts((prev) => prev.filter((a) => now - a.timestamp < 8000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center p-4 pointer-events-none gap-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto w-full max-w-3xl bg-rose-950/90 border border-rose-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-300 relative overflow-hidden flex items-center justify-between"
        >
          <div className="absolute bottom-0 left-0 h-1 bg-rose-500 animate-[shrink_8s_linear_forwards]" style={{ width: "100%" }} />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
            <div>
              <p className="text-rose-50 font-bold font-sans text-lg">⚠️ THREAT DETECTED — Voice clone signature confirmed.</p>
              <p className="text-rose-200/70 text-sm font-mono mt-1">Session {alert.session_id.substring(0, 8)} blocked.</p>
            </div>
          </div>
          <button
            onClick={() => dismiss(alert.id)}
            className="p-3 hover:bg-rose-900/50 rounded-xl transition-all duration-200 active:scale-95"
          >
            <X className="w-5 h-5 text-rose-400" />
          </button>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
}
