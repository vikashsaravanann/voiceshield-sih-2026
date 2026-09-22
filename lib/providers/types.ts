/**
 * Provider readiness states — never treat MOCK as production.
 */
export type ProviderState =
  | "MOCK"
  | "PLACEHOLDER"
  | "CONFIGURED"
  | "CONNECTED"
  | "DEGRADED"
  | "FAILED"
  | "DISABLED";

export type TranscriptionProviderId = "mock" | "deepgram" | "whisper";

export type AnalysisProviderId = "mock" | "throughputs";

export type RiskLevel = "low" | "medium" | "high" | "critical" | "unknown";

export interface ProviderHealth {
  id: string;
  state: ProviderState;
  message?: string;
  checkedAt: string;
}

export interface TranscriptionRequest {
  /** Opaque reference — never log raw audio bytes */
  audioRef: string;
  mimeType?: string;
  language?: string;
}

export interface TranscriptionResult {
  text: string;
  provider: TranscriptionProviderId;
  confidence?: number;
  durationMs?: number;
  mock: boolean;
}

export interface AnalysisRequest {
  transcript: string;
  sessionId?: string;
  /** Policy / configuration reference */
  policyRef?: string;
}

/** Structured analysis — never treat free-form LLM text as truth */
export interface StructuredAnalysis {
  riskLevel: RiskLevel;
  confidence?: number;
  indicators: string[];
  evidence: AnalysisEvidence[];
  categories: string[];
  explanation?: string;
  policyRef?: string;
  model?: string;
  provider: AnalysisProviderId;
  mock: boolean;
}

export interface AnalysisEvidence {
  type: string;
  description: string;
  /** Transcript span or timestamp reference if available */
  transcriptRef?: string;
  timestampMs?: number;
}
