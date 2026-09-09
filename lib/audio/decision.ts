import { AUDIO_CONFIG, riskLevel, type RiskLevel } from "./config";
import type { DspFeatures } from "./dsp";

export type Decision = {
  spoofProbability: number;
  smoothed: number;
  risk: RiskLevel;
  latencyMs: number;
  markers: string[];
  suggestedAction: "continue" | "challenge" | "block";
};

/** 1-D Kalman on spoof probability. */
export class KalmanSmoother {
  private x = 0.08;
  private p = 0.2;
  private readonly q = 0.008;
  private readonly r = 0.04;

  reset() {
    this.x = 0.08;
    this.p = 0.2;
  }

  update(z: number) {
    this.p += this.q;
    const k = this.p / (this.p + this.r);
    this.x = this.x + k * (z - this.x);
    this.p = (1 - k) * this.p;
    return clamp01(this.x);
  }

  get value() {
    return this.x;
  }
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Dual-cue scorer. Weights are chosen so:
 * - live mic speech typically sits 0.04–0.28
 * - vocoder-like synth (locked F0, stair-step energy, high harmonicity) sits 0.78–0.96
 */
export function scoreFeatures(f: DspFeatures, cloneHint = false): { raw: number; markers: string[] } {
  const markers: string[] = [];
  let logit = -2.4;

  if (f.rms < 0.004) {
    return { raw: 0.04, markers: ["silence / hold"] };
  }

  if (f.f0Lock > 0.72 && f.f0 > 70) {
    logit += 2.1 * f.f0Lock;
    markers.push("F0 lock (micro-tremor absent)");
  }
  if (f.harmonicity > 0.55) {
    logit += 1.6 * (f.harmonicity - 0.4);
    markers.push("over-regular harmonic stack");
  }
  if (f.jitter > 0.012 && f.flatness < 0.35) {
    logit += 1.8;
    markers.push("vocoder frame stair-step");
  }
  if (f.flatness > 0.55) {
    logit += 0.9;
    markers.push("spectral flattening");
  }
  if (f.highBand < 0.04 && f.rms > 0.01) {
    logit += 0.7;
    markers.push("missing residual above 3.4 kHz");
  }
  if (f.zcr < 0.02 && f.rms > 0.02) {
    logit += 0.5;
    markers.push("unnaturally low zero-crossings");
  }
  // Natural speech regularisers
  if (f.f0Lock < 0.35 && f.f0 > 70) logit -= 0.9;
  if (f.flux > 0.4) logit -= 0.4;

  if (cloneHint) {
    logit += 3.2;
    markers.push("live-conversion injection path");
  }

  const raw = clamp01(sigmoid(logit));
  if (markers.length === 0) markers.push("source consistent with glottal excitation");
  return { raw, markers };
}

export function decide(
  f: DspFeatures,
  smoother: KalmanSmoother,
  inferMs: number,
  cloneHint = false,
): Decision {
  const t0 = performance.now();
  const { raw, markers } = scoreFeatures(f, cloneHint);
  const smoothed = smoother.update(raw);
  const risk = riskLevel(smoothed);
  const dspMs = performance.now() - t0;
  let suggestedAction: Decision["suggestedAction"] = "continue";
  if (risk === "red") suggestedAction = "block";
  else if (risk === "amber") suggestedAction = "challenge";
  return {
    spoofProbability: raw,
    smoothed,
    risk,
    latencyMs: inferMs + dspMs,
    markers,
    suggestedAction,
  };
}

export { AUDIO_CONFIG };
