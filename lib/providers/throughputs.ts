import type {
  AnalysisProviderId,
  AnalysisRequest,
  ProviderHealth,
  StructuredAnalysis,
} from "./types";
import { validateStructuredAnalysis } from "./analysis-schema";

/**
 * THROUGHPUTS is a gateway, not a model.
 * VoiceShield → this abstraction → THROUGHPUTS → configured model ID.
 */
function analysisProvider(): AnalysisProviderId {
  const raw = (process.env.ANALYSIS_PROVIDER || "mock").toLowerCase();
  if (raw === "throughputs") return "throughputs";
  return "mock";
}

export function getThroughputsHealth(): ProviderHealth {
  const checkedAt = new Date().toISOString();
  const provider = analysisProvider();

  if (provider === "mock") {
    return {
      id: "throughputs",
      state: "MOCK",
      message: "ANALYSIS_PROVIDER=mock — async analysis not production",
      checkedAt,
    };
  }

  const base = process.env.THROUGHPUTS_BASE_URL;
  const key = process.env.THROUGHPUTS_API_KEY;
  const model = process.env.THROUGHPUTS_MODEL;

  if (!base || !key || !model) {
    return {
      id: "throughputs",
      state: "FAILED",
      message:
        "THROUGHPUTS_BASE_URL, THROUGHPUTS_API_KEY, and THROUGHPUTS_MODEL required when ANALYSIS_PROVIDER=throughputs",
      checkedAt,
    };
  }

  return {
    id: "throughputs",
    state: "CONFIGURED",
    message: "THROUGHPUTS credentials present — health-check before CONNECTED",
    checkedAt,
  };
}

/**
 * Async forensic analysis path only — never call from real-time WebSocket loop.
 */
export async function analyzeTranscript(
  req: AnalysisRequest
): Promise<StructuredAnalysis> {
  const health = getThroughputsHealth();
  const provider = analysisProvider();

  if (provider === "throughputs" && health.state === "FAILED") {
    throw new Error(health.message || "THROUGHPUTS not configured");
  }

  if (provider === "mock" || health.state === "MOCK") {
    const mock: StructuredAnalysis = {
      riskLevel: "unknown",
      indicators: [],
      evidence: [],
      categories: [],
      explanation:
        "Mock analysis — no model invoked. Configure ANALYSIS_PROVIDER=throughputs with verified model ID.",
      policyRef: req.policyRef,
      provider: "mock",
      mock: true,
    };
    return validateStructuredAnalysis(mock);
  }

  // Live gateway call deferred until model ID catalogue is verified.
  throw new Error(
    "THROUGHPUTS live adapter enabled only after controlled activation with verified THROUGHPUTS_MODEL"
  );
}
