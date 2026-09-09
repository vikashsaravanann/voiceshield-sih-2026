"use client";

import React from "react";
import { ConnectionState } from "@/types/detection";

interface ConnectionStatusProps {
  state: ConnectionState;
  reconnectAttempt?: number;
  reconnectDelayMs?: number;
  bufferedChunksCount?: number;
  lastError?: string;
}

export function ConnectionStatus({
  state,
  reconnectAttempt = 0,
  reconnectDelayMs = 0,
  bufferedChunksCount = 0,
  lastError,
}: ConnectionStatusProps) {
  let badgeText = "DISCONNECTED";
  let color = "bg-slate-800 text-slate-400 border-slate-700";
  let dotColor = "bg-slate-500";

  if (state === "connected") {
    badgeText = "CONNECTED (REAL-TIME)";
    color = "bg-emerald-950/60 text-emerald-300 border-emerald-500/30";
    dotColor = "bg-emerald-400 animate-pulse";
  } else if (state === "reconnecting") {
    badgeText = `RECONNECTING (ATTEMPT ${reconnectAttempt}/10)`;
    color = "bg-amber-950/60 text-amber-300 border-amber-500/40 animate-pulse";
    dotColor = "bg-amber-400";
  } else if (state === "offline_buffering") {
    badgeText = `OFFLINE — BUFFERING (${bufferedChunksCount} CHUNKS)`;
    color = "bg-rose-950/60 text-rose-300 border-rose-500/40";
    dotColor = "bg-rose-500";
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wider ${color}`}
        title={lastError || undefined}
      >
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span>{badgeText}</span>
      </div>

      {state === "reconnecting" && (
        <span className="text-[10px] text-amber-400/80 font-mono">
          Backoff delay: {(reconnectDelayMs / 1000).toFixed(1)}s (±20% jitter)
        </span>
      )}

      {bufferedChunksCount > 0 && (
        <span className="text-[10px] text-slate-400 font-mono">
          Volatile RAM Ring: {bufferedChunksCount} frames ready to replay
        </span>
      )}
    </div>
  );
}
