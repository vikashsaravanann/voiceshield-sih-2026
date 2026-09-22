import type { RiskLevel, StructuredAnalysis } from "./types";

const RISK: RiskLevel[] = ["low", "medium", "high", "critical", "unknown"];

/**
 * Validate structured analysis. Never invent evidence.
 * Invalid shapes → safe unknown result with empty evidence.
 */
export function validateStructuredAnalysis(
  input: unknown
): StructuredAnalysis {
  if (!input || typeof input !== "object") {
    return emptyAnalysis("mock");
  }

  const o = input as Record<string, unknown>;
  const riskLevel = RISK.includes(o.riskLevel as RiskLevel)
    ? (o.riskLevel as RiskLevel)
    : "unknown";

  const indicators = Array.isArray(o.indicators)
    ? o.indicators.filter((x): x is string => typeof x === "string").slice(0, 50)
    : [];

  const categories = Array.isArray(o.categories)
    ? o.categories.filter((x): x is string => typeof x === "string").slice(0, 20)
    : [];

  const evidenceRaw = Array.isArray(o.evidence) ? o.evidence : [];
  const evidence = evidenceRaw
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map((e) => ({
      type: typeof e.type === "string" ? e.type : "unspecified",
      description:
        typeof e.description === "string" ? e.description.slice(0, 500) : "",
      transcriptRef:
        typeof e.transcriptRef === "string" ? e.transcriptRef : undefined,
      timestampMs:
        typeof e.timestampMs === "number" ? e.timestampMs : undefined,
    }))
    .filter((e) => e.description.length > 0)
    .slice(0, 50);

  const confidence =
    typeof o.confidence === "number" &&
    o.confidence >= 0 &&
    o.confidence <= 1
      ? o.confidence
      : undefined;

  return {
    riskLevel,
    confidence,
    indicators,
    evidence,
    categories,
    explanation:
      typeof o.explanation === "string"
        ? o.explanation.slice(0, 2000)
        : undefined,
    policyRef: typeof o.policyRef === "string" ? o.policyRef : undefined,
    model: typeof o.model === "string" ? o.model : undefined,
    provider: o.provider === "throughputs" ? "throughputs" : "mock",
    mock: Boolean(o.mock) || o.provider !== "throughputs",
  };
}

function emptyAnalysis(
  provider: "mock" | "throughputs"
): StructuredAnalysis {
  return {
    riskLevel: "unknown",
    indicators: [],
    evidence: [],
    categories: [],
    provider,
    mock: provider === "mock",
  };
}
