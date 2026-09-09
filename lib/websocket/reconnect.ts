/**
 * VoiceShield — WebSocket Reconnection with Jittered Exponential Backoff
 * SIH26104 | voiceshield-team/voiceshield-sih-2026
 */

export interface ReconnectConfig {
  baseDelayMs: number;
  multiplier: number;
  maxDelayMs: number;
  jitterRatio: number;
  maxAttempts: number;
}

export const RECONNECT_CONFIG: ReconnectConfig = {
  baseDelayMs: 1000,
  multiplier: 2,
  maxDelayMs: 30000,
  jitterRatio: 0.2, // +/- 20%
  maxAttempts: 10,
};

/**
 * Calculates exponential backoff delay with uniform jitter.
 * delay = min(baseDelay * 2^attempt, maxDelay) * (1 +/- jitterRatio)
 */
export function getReconnectDelay(
  attempt: number,
  config: ReconnectConfig = RECONNECT_CONFIG
): number {
  const delay = Math.min(
    config.baseDelayMs * Math.pow(config.multiplier, attempt),
    config.maxDelayMs
  );
  const jitter = delay * config.jitterRatio * (Math.random() * 2 - 1);
  return Math.max(200, Math.floor(delay + jitter));
}

/**
 * Helper to manage visibility state: pauses reconnection timer when page is hidden
 * and immediately triggers when tab returns to foreground.
 */
export function onVisibilityChange(onResume: () => void): () => void {
  if (typeof document === "undefined") return () => {};

  const handler = () => {
    if (document.visibilityState === "visible") {
      onResume();
    }
  };

  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}
