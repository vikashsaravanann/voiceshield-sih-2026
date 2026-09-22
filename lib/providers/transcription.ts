import type {
  ProviderHealth,
  TranscriptionProviderId,
  TranscriptionRequest,
  TranscriptionResult,
} from "./types";

function readProvider(): TranscriptionProviderId {
  const raw = (process.env.TRANSCRIPTION_PROVIDER || "mock").toLowerCase();
  if (raw === "deepgram" || raw === "whisper" || raw === "mock") return raw;
  return "mock";
}

/**
 * Resolve transcription provider health without calling remote APIs.
 * Production with a non-mock provider and missing keys → FAILED (not silent mock).
 */
export function getTranscriptionHealth(): ProviderHealth {
  const id = readProvider();
  const checkedAt = new Date().toISOString();

  if (id === "mock") {
    return {
      id: "transcription",
      state: "MOCK",
      message: "TRANSCRIPTION_PROVIDER=mock — not production speech-to-text",
      checkedAt,
    };
  }

  if (id === "deepgram") {
    if (!process.env.DEEPGRAM_API_KEY) {
      return {
        id: "transcription",
        state: "FAILED",
        message: "DEEPGRAM_API_KEY missing while TRANSCRIPTION_PROVIDER=deepgram",
        checkedAt,
      };
    }
    return {
      id: "transcription",
      state: "CONFIGURED",
      message: "Deepgram key present — run live health check to mark CONNECTED",
      checkedAt,
    };
  }

  if (id === "whisper") {
    // Whisper may be local path or remote; require explicit config
    if (!process.env.WHISPER_ENDPOINT && !process.env.OPENAI_API_KEY) {
      return {
        id: "transcription",
        state: "FAILED",
        message:
          "WHISPER_ENDPOINT or OPENAI_API_KEY required when TRANSCRIPTION_PROVIDER=whisper",
        checkedAt,
      };
    }
    return {
      id: "transcription",
      state: "CONFIGURED",
      message: "Whisper path configured — verify connectivity before production",
      checkedAt,
    };
  }

  return { id: "transcription", state: "DISABLED", checkedAt };
}

/**
 * Transcribe audio reference. Mock returns deterministic placeholder.
 * Does not accept or log raw audio bytes.
 */
export async function transcribe(
  req: TranscriptionRequest
): Promise<TranscriptionResult> {
  const health = getTranscriptionHealth();
  const provider = readProvider();

  if (provider !== "mock" && health.state === "FAILED") {
    throw new Error(health.message || "Transcription provider not configured");
  }

  if (provider === "mock" || health.state === "MOCK") {
    return {
      text: "[mock transcript — configure TRANSCRIPTION_PROVIDER for production]",
      provider: "mock",
      confidence: 0,
      mock: true,
    };
  }

  // Real adapters: implement when credentials verified — do not invent API shapes.
  throw new Error(
    `Transcription provider "${provider}" is CONFIGURED but live adapter is not enabled until controlled activation. audioRef=${req.audioRef.slice(0, 8)}…`
  );
}
