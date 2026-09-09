/**
 * Lightweight vocoder-style injector for the live demo.
 * Produces locked-F0, frame-quantised, source-filter speech-like audio
 * that the DSP scorer treats as synthetic — no third-party TTS required.
 */

function biquadResonator(freq: number, q: number, sr: number) {
  const w = (2 * Math.PI * freq) / sr;
  const alpha = Math.sin(w) / (2 * q);
  const b0 = alpha;
  const b1 = 0;
  const b2 = -alpha;
  const a0 = 1 + alpha;
  const a1 = -2 * Math.cos(w);
  const a2 = 1 - alpha;
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  return (x: number) => {
    const y = (b0 / a0) * x + (b1 / a0) * x1 + (b2 / a0) * x2 - (a1 / a0) * y1 - (a2 / a0) * y2;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    return y;
  };
}

export class CloneSynth {
  private t = 0;
  private readonly sr: number;
  private readonly period: number;
  private f1: (x: number) => number;
  private f2: (x: number) => number;
  private f3: (x: number) => number;
  private frameGain = 0.6;
  private framePos = 0;
  private readonly frameHop: number;

  constructor(sr = 16000, f0 = 118) {
    this.sr = sr;
    this.period = Math.round(sr / f0);
    this.f1 = biquadResonator(730, 12, sr);
    this.f2 = biquadResonator(1090, 14, sr);
    this.f3 = biquadResonator(2440, 10, sr);
    this.frameHop = Math.round(sr * 0.02);
  }

  fill(out: Float32Array) {
    for (let i = 0; i < out.length; i++) {
      const pulse = this.t % this.period === 0 ? 1 : 0;
      const buzz = pulse + 0.015 * (Math.random() * 2 - 1);
      let y = this.f1(buzz) + 0.7 * this.f2(buzz) + 0.45 * this.f3(buzz);
      if (this.framePos === 0) {
        this.frameGain = 0.45 + 0.35 * Math.random();
      }
      this.framePos = (this.framePos + 1) % this.frameHop;
      y *= this.frameGain * 0.22;
      if (this.t % 256 === 0) y += 0.04;
      out[i] = Math.max(-1, Math.min(1, y));
      this.t += 1;
    }
  }

  reset() {
    this.t = 0;
    this.framePos = 0;
  }
}
