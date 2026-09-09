/**
 * VoiceShield — Audio Streaming Configuration
 * SIH26104 | voiceshield-team/voiceshield-sih-2026
 *
 * Chunk size trade-offs:
 * - 250ms: Lowest latency (~150ms round-trip), higher network message overhead, faster UI responsiveness.
 * - 333ms: Recommended default (balanced). Provides 5,328 samples at 16kHz—sufficient spectral resolution
 *          for LFCC filterbanks while staying well within the <250ms perception window.
 * - 500ms: Higher latency (~350ms round-trip), delivers greater context for deep neural attention heads,
 *          smoother spectrogram heatmaps.
 */

export const AUDIO_CONFIG = {
  sampleRate: 16000,
  channels: 1,
  chunkMs: 333 as const,
  ringBufferSeconds: 4,
  maxReconnectAttempts: 10,
  chunkSizeSamples: Math.floor((16000 * 333) / 1000), // 5,328 samples
  sampleByteLength: 2, // 16-bit PCM = 2 bytes per sample
};

export type TunableChunkMs = 250 | 333 | 500;
