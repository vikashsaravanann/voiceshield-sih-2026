/**
 * VoiceShield — Protocol and Detection Types
 * SIH26104 | voiceshield-team/voiceshield-sih-2026
 */

export type RiskLevel = "low" | "medium" | "high";

export type SuggestedAction = "monitor" | "challenge" | "block";

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline_buffering";

export interface ExplainabilityMarkers {
  high_frequency_anomaly: number;
  phase_discontinuity: number;
  prosody_irregularity: number;
}

export interface ModelMetadata {
  name: string;
  version: string;
}

export interface DetectionResponse {
  type: "detection.result";
  session_id: string;
  chunk_index: number;
  spoof_probability: number;
  risk_level: RiskLevel;
  suggested_action: SuggestedAction;
  latency_ms: number;
  explainability_markers: ExplainabilityMarkers;
  model: ModelMetadata;
}

export interface InitMessage {
  type: "session.start";
  session_id: string;
  user_id: string;
  sample_rate: number;
  channels: number;
  chunk_ms: number;
  client?: Record<string, any>;
}

export interface ResumeMessage {
  type: "session.resume";
  session_id: string;
  last_processed_chunk_index: number;
}

export interface EndMessage {
  type: "session.end";
  session_id: string;
}

export interface SessionStats {
  totalChunks: number;
  avgRisk: number;
  maxRisk: number;
  highRiskCount: number;
  dropCount: number;
  reconnectTimeMs: number;
  challengeResult?: "passed" | "failed" | "pending";
}
