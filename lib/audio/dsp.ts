/** Multi-parametric DSP feature extraction for a 16 kHz analysis window. */

export type DspFeatures = {
  rms: number;
  zcr: number;
  centroid: number;
  flatness: number;
  f0: number;
  f0Lock: number;
  harmonicity: number;
  highBand: number;
  flux: number;
  jitter: number;
};

function hann(n: number, N: number) {
  return 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
}

/** In-place radix-2 real FFT → magnitude spectrum (N/2 bins). */
function magSpectrum(frame: Float32Array): Float32Array {
  const N = frame.length;
  const re = new Float32Array(N);
  const im = new Float32Array(N);
  for (let i = 0; i < N; i++) re[i] = frame[i];
  fft(re, im);
  const mag = new Float32Array(N / 2);
  for (let i = 0; i < N / 2; i++) mag[i] = Math.hypot(re[i], im[i]);
  return mag;
}

function fft(re: Float32Array, im: Float32Array) {
  const n = re.length;
  let j = 0;
  for (let i = 0; i < n; i++) {
    if (i < j) {
      let t = re[i];
      re[i] = re[j];
      re[j] = t;
      t = im[i];
      im[i] = im[j];
      im[j] = t;
    }
    let m = n >> 1;
    while (m >= 1 && j >= m) {
      j -= m;
      m >>= 1;
    }
    j += m;
  }
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const step = (2 * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let k = 0; k < half; k++) {
        const ang = step * k;
        const cos = Math.cos(ang);
        const sin = -Math.sin(ang);
        const tr = cos * re[i + k + half] - sin * im[i + k + half];
        const ti = sin * re[i + k + half] + cos * im[i + k + half];
        re[i + k + half] = re[i + k] - tr;
        im[i + k + half] = im[i + k] - ti;
        re[i + k] += tr;
        im[i + k] += ti;
      }
    }
  }
}

function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

export function extractFeatures(pcm: Float32Array, sampleRate: number, prevMag?: Float32Array): {
  features: DspFeatures;
  mag: Float32Array;
} {
  const n = pcm.length;
  let rms = 0;
  let zcr = 0;
  for (let i = 0; i < n; i++) {
    rms += pcm[i] * pcm[i];
    if (i > 0 && ((pcm[i] >= 0 && pcm[i - 1] < 0) || (pcm[i] < 0 && pcm[i - 1] >= 0))) zcr += 1;
  }
  rms = Math.sqrt(rms / Math.max(1, n));
  zcr = zcr / Math.max(1, n - 1);

  const N = Math.min(2048, nextPow2(n));
  const frame = new Float32Array(N);
  const offset = Math.max(0, n - N);
  for (let i = 0; i < N; i++) {
    const s = offset + i < n ? pcm[offset + i] : 0;
    frame[i] = s * hann(i, N);
  }
  const mag = magSpectrum(frame);

  let specSum = 0;
  let specW = 0;
  let geo = 0;
  let arith = 0;
  let bins = 0;
  const nyquist = sampleRate / 2;
  let high = 0;
  let low = 0;
  for (let i = 1; i < mag.length; i++) {
    const f = (i / mag.length) * nyquist;
    const m = mag[i] + 1e-12;
    specSum += m;
    specW += m * f;
    arith += m;
    geo += Math.log(m);
    bins += 1;
    if (f > 3400) high += m;
    else low += m;
  }
  const centroid = specSum > 0 ? specW / specSum / nyquist : 0;
  const flatness = bins > 0 ? Math.exp(geo / bins) / (arith / bins + 1e-12) : 0;
  const highBand = high / (high + low + 1e-12);

  let flux = 0;
  if (prevMag && prevMag.length === mag.length) {
    for (let i = 0; i < mag.length; i++) {
      const d = mag[i] - prevMag[i];
      if (d > 0) flux += d;
    }
    flux /= mag.length;
  }

  const f0 = estimateF0(pcm, sampleRate);
  const harmonicity = estimateHarmonicity(mag, f0, sampleRate);

  // Frame-to-frame energy jitter (vocoders often stair-step).
  const hop = Math.max(64, Math.floor(n / 8));
  const energies: number[] = [];
  for (let i = 0; i + hop <= n; i += hop) {
    let e = 0;
    for (let k = 0; k < hop; k++) e += pcm[i + k] * pcm[i + k];
    energies.push(Math.sqrt(e / hop));
  }
  let jitter = 0;
  for (let i = 1; i < energies.length; i++) {
    jitter += Math.abs(energies[i] - energies[i - 1]);
  }
  jitter = energies.length > 1 ? jitter / (energies.length - 1) : 0;

  return {
    features: {
      rms,
      zcr,
      centroid,
      flatness,
      f0,
      f0Lock: 0,
      harmonicity,
      highBand,
      flux,
      jitter,
    },
    mag,
  };
}

function estimateF0(pcm: Float32Array, sr: number): number {
  const minP = Math.floor(sr / 400);
  const maxP = Math.floor(sr / 60);
  let best = 0;
  let bestLag = minP;
  const n = Math.min(pcm.length, 2048);
  for (let lag = minP; lag <= maxP; lag++) {
    let sum = 0;
    const lim = n - lag;
    for (let i = 0; i < lim; i++) sum += pcm[i] * pcm[i + lag];
    if (sum > best) {
      best = sum;
      bestLag = lag;
    }
  }
  const energy = pcm.reduce((a, x) => a + x * x, 0);
  if (best < 0.25 * energy) return 0;
  return sr / bestLag;
}

function estimateHarmonicity(mag: Float32Array, f0: number, sr: number): number {
  if (f0 < 60) return 0;
  const nyquist = sr / 2;
  let num = 0;
  let den = 0;
  for (let h = 1; h <= 8; h++) {
    const f = h * f0;
    if (f >= nyquist) break;
    const bin = Math.round((f / nyquist) * mag.length);
    if (bin > 0 && bin < mag.length) {
      num += mag[bin];
      den += mag[bin] + (mag[bin - 1] ?? 0) + (mag[bin + 1] ?? 0);
    }
  }
  return den > 0 ? num / den : 0;
}

const F0_HISTORY = 8;

export class FeatureTracker {
  private f0s: number[] = [];
  private prevMag?: Float32Array;

  extract(pcm: Float32Array, sampleRate: number): DspFeatures {
    const { features, mag } = extractFeatures(pcm, sampleRate, this.prevMag);
    this.prevMag = mag;
    if (features.f0 > 0) {
      this.f0s.push(features.f0);
      if (this.f0s.length > F0_HISTORY) this.f0s.shift();
    }
    if (this.f0s.length >= 3) {
      const mean = this.f0s.reduce((a, b) => a + b, 0) / this.f0s.length;
      const var_ = this.f0s.reduce((a, b) => a + (b - mean) ** 2, 0) / this.f0s.length;
      const cv = Math.sqrt(var_) / (mean + 1e-6);
      features.f0Lock = Math.max(0, 1 - cv * 8);
    }
    return features;
  }

  reset() {
    this.f0s = [];
    this.prevMag = undefined;
  }
}
