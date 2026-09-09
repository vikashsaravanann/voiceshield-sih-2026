/** VoiceShield streaming defaults — SIH demo-tuned. */

export const AUDIO_CONFIG = {
  sampleRate: 16000,
  chunkMs: 333,
  bufferDurationSec: 4,
  /** Exponential backoff for the inference link. */
  reconnect: {
    baseDelay: 1000,
    maxDelay: 30000,
    multiplier: 2,
    jitter: 0.2,
    maxAttempts: 10,
  },
  thresholds: {
    green: 0.35,
    red: 0.75,
  },
  /** Consecutive Amber/Red hops before a challenge is armed. */
  challengeAfterHops: 4,
} as const;

export type RiskLevel = "green" | "amber" | "red";

export function riskLevel(c: number): RiskLevel {
  if (c < AUDIO_CONFIG.thresholds.green) return "green";
  if (c >= AUDIO_CONFIG.thresholds.red) return "red";
  return "amber";
}

export function samplesPerChunk(chunkMs = AUDIO_CONFIG.chunkMs) {
  return Math.round((AUDIO_CONFIG.sampleRate * chunkMs) / 1000);
}

export function ringCapacity(bufferSec = AUDIO_CONFIG.bufferDurationSec, chunkMs = AUDIO_CONFIG.chunkMs) {
  return Math.max(4, Math.ceil((bufferSec * 1000) / chunkMs));
}

export const CHALLENGE_PHRASES = {
  en: "The blue quartz globe rolled through the red velvet track",
  hi: "Neela quartz golak laal velvet path par lughak gaya",
  ta: "Neela quartz golam sivappu velvet vazhiyil urundathu",
} as const;

export type ChallengeLang = keyof typeof CHALLENGE_PHRASES;
