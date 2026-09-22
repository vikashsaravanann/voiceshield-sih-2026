export type {
  ProviderState,
  ProviderHealth,
  TranscriptionResult,
  StructuredAnalysis,
  RiskLevel,
} from "./types";

export {
  getTranscriptionHealth,
  transcribe,
} from "./transcription";

export {
  getThroughputsHealth,
  analyzeTranscript,
} from "./throughputs";

export { validateStructuredAnalysis } from "./analysis-schema";

import { getTranscriptionHealth } from "./transcription";
import { getThroughputsHealth } from "./throughputs";

/** Aggregate provider readiness for ops / health endpoints */
export function getProviderReadiness() {
  return {
    transcription: getTranscriptionHealth(),
    throughputs: getThroughputsHealth(),
    realTimeDetection: {
      id: "aasist-realtime",
      note: "Served by FastAPI apps/api — separate host; not this Next.js process",
    },
  };
}
