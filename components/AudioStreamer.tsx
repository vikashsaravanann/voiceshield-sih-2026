"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AUDIO_CONFIG } from "@/lib/audioConfig";
import { getReconnectDelay, onVisibilityChange } from "@/lib/websocket/reconnect";
import { AudioRingBuffer } from "@/lib/audio/ringBuffer";
import {
  DetectionResponse,
  ConnectionState,
  SessionStats,
} from "@/types/detection";

interface AudioStreamerProps {
  onRiskUpdate?: (response: DetectionResponse) => void;
  onConnectionChange?: (state: ConnectionState) => void;
  onStatsUpdate?: (stats: SessionStats) => void;
  children?: (controls: {
    isStreaming: boolean;
    connectionState: ConnectionState;
    reconnectAttempt: number;
    reconnectDelayMs: number;
    bufferedCount: number;
    start: () => Promise<void>;
    stop: () => void;
    simulateDisconnect: () => void;
    toggleCloneSimulation: () => void;
    isSimulatingClone: boolean;
  }) => React.ReactNode;
}

export function AudioStreamer({
  onRiskUpdate,
  onConnectionChange,
  onStatsUpdate,
  children,
}: AudioStreamerProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [reconnectDelayMs, setReconnectDelayMs] = useState(0);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [isSimulatingClone, setIsSimulatingClone] = useState(false);

  // References
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const ringBufferRef = useRef<AudioRingBuffer>(
    new AudioRingBuffer(AUDIO_CONFIG.ringBufferSeconds, AUDIO_CONFIG.chunkMs)
  );

  const sessionIdRef = useRef<string>("");
  const chunkIndexRef = useRef<number>(0);
  const lastAckedChunkRef = useRef<number>(-1);
  const reconnectTimeoutRef = useRef<any>(null);

  // Running stats
  const statsRef = useRef<SessionStats>({
    totalChunks: 0,
    avgRisk: 0,
    maxRisk: 0,
    highRiskCount: 0,
    dropCount: 0,
    reconnectTimeMs: 0,
  });

  const updateConnection = useCallback(
    (newState: ConnectionState) => {
      setConnectionState(newState);
      onConnectionChange?.(newState);
    },
    [onConnectionChange]
  );

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    const wsUrl =
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FASTAPI_WS_URL) ||
      "ws://localhost:8000/ws/audio";

    try {
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        setReconnectAttempt(0);
        updateConnection("connected");

        // Send init or resume message
        if (lastAckedChunkRef.current >= 0) {
          ws.send(
            JSON.stringify({
              type: "session.resume",
              session_id: sessionIdRef.current,
              last_processed_chunk_index: lastAckedChunkRef.current,
            })
          );

          // Flush & replay buffered chunks
          const replayChunks = ringBufferRef.current.getReplayChunks(
            lastAckedChunkRef.current
          );
          for (const chunk of replayChunks) {
            ws.send(chunk.pcm.buffer as ArrayBuffer);
          }
          setBufferedCount(0);
        } else {
          ws.send(
            JSON.stringify({
              type: "session.start",
              session_id: sessionIdRef.current,
              user_id: "demo_user",
              sample_rate: AUDIO_CONFIG.sampleRate,
              channels: AUDIO_CONFIG.channels,
              chunk_ms: AUDIO_CONFIG.chunkMs,
              client: {
                userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "node",
                platform: typeof navigator !== "undefined" ? navigator.platform : "web",
              },
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "detection.result") {
            const resp = data as DetectionResponse;
            lastAckedChunkRef.current = resp.chunk_index;

            // Update stats
            const s = statsRef.current;
            s.totalChunks += 1;
            s.avgRisk =
              (s.avgRisk * (s.totalChunks - 1) + resp.spoof_probability) /
              s.totalChunks;
            s.maxRisk = Math.max(s.maxRisk, resp.spoof_probability);
            if (resp.risk_level === "high") s.highRiskCount += 1;

            onStatsUpdate?.({ ...s });
            onRiskUpdate?.(resp);
          }
        } catch {
          // Non-JSON frame
        }
      };

      ws.onclose = () => {
        if (isStreaming) {
          updateConnection("reconnecting");
          statsRef.current.dropCount += 1;
          scheduleReconnect();
        } else {
          updateConnection("disconnected");
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      updateConnection("reconnecting");
      scheduleReconnect();
    }
  }, [isStreaming, onRiskUpdate, onStatsUpdate, updateConnection]);

  // Schedule Exponential Backoff with Jitter
  const scheduleReconnect = useCallback(() => {
    if (reconnectAttempt >= AUDIO_CONFIG.maxReconnectAttempts) {
      updateConnection("offline_buffering");
      return;
    }

    const nextAttempt = reconnectAttempt + 1;
    setReconnectAttempt(nextAttempt);

    const delay = getReconnectDelay(nextAttempt);
    setReconnectDelayMs(delay);

    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket();
    }, delay);
  }, [reconnectAttempt, connectWebSocket, updateConnection]);

  // Handle visibility changes (pause reconnect schedules when hidden)
  useEffect(() => {
    return onVisibilityChange(() => {
      if (connectionState === "reconnecting" && !reconnectTimeoutRef.current) {
        scheduleReconnect();
      }
    });
  }, [connectionState, scheduleReconnect]);

  // Start Mic & Capture Graph
  const start = async () => {
    try {
      sessionIdRef.current = crypto.randomUUID();
      chunkIndexRef.current = 0;
      lastAckedChunkRef.current = -1;
      ringBufferRef.current.clear();
      statsRef.current = {
        totalChunks: 0,
        avgRisk: 0,
        maxRisk: 0,
        highRiskCount: 0,
        dropCount: 0,
        reconnectTimeMs: 0,
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: AUDIO_CONFIG.sampleRate,
          channelCount: AUDIO_CONFIG.channels,
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)({
        sampleRate: AUDIO_CONFIG.sampleRate,
      });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);

      // Buffer size: 4096 samples ~ 256ms at 16kHz
      const bufferSize = 4096;
      const processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
      processorNodeRef.current = processor;

      let sampleAccumulator: number[] = [];
      const requiredSamples = AUDIO_CONFIG.chunkSizeSamples;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        for (let i = 0; i < inputData.length; i++) {
          sampleAccumulator.push(inputData[i]);

          if (sampleAccumulator.length >= requiredSamples) {
            const chunkSamples = sampleAccumulator.slice(0, requiredSamples);
            sampleAccumulator = sampleAccumulator.slice(requiredSamples);

            // Convert Float32 [-1.0, 1.0] -> Int16 PCM [-32768, 32767]
            const pcm16 = new Int16Array(chunkSamples.length);
            for (let j = 0; j < chunkSamples.length; j++) {
              let s = chunkSamples[j];

              // If cloned audio injection is active, introduce vocoder phase harmonics
              if (isSimulatingClone) {
                s = Math.sin(j * 0.15) * 0.4 + (Math.random() - 0.5) * 0.05;
              }

              const clamped = Math.max(-1, Math.min(1, s));
              pcm16[j] = clamped < 0 ? clamped * 32768 : clamped * 32767;
            }

            const currentIdx = chunkIndexRef.current++;

            // Dispatch or buffer
            if (
              wsRef.current &&
              wsRef.current.readyState === WebSocket.OPEN
            ) {
              wsRef.current.send(pcm16.buffer as ArrayBuffer);
            } else {
              // Write into ring buffer during network sever
              ringBufferRef.current.push({
                index: currentIdx,
                pcm: pcm16,
                timestamp: Date.now(),
              });
              setBufferedCount(ringBufferRef.current.length);
            }
          }
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      setIsStreaming(true);
      connectWebSocket();
    } catch (err) {
      console.error("Failed to acquire microphone", err);
    }
  };

  // Stop Streaming
  const stop = () => {
    setIsStreaming(false);
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "session.end",
            session_id: sessionIdRef.current,
          })
        );
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    updateConnection("disconnected");
  };

  // Simulate network severed connection for Judge Demo
  const simulateDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.close(4001, "Simulated network drop for judge demo");
    }
  };

  // Toggle injected clone voice simulation
  const toggleCloneSimulation = () => {
    setIsSimulatingClone((prev) => !prev);
  };

  if (children) {
    return (
      <>
        {children({
          isStreaming,
          connectionState,
          reconnectAttempt,
          reconnectDelayMs,
          bufferedCount,
          start,
          stop,
          simulateDisconnect,
          toggleCloneSimulation,
          isSimulatingClone,
        })}
      </>
    );
  }

  return null;
}
