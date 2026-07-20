import type { AudioChunk } from './audio';
import type { PitchResult } from './pitch';

export interface YinOptions {
  tolerance?: number;
  interpolate?: boolean;
  minFrequency?: number;
  maxFrequency?: number;
}

export function getYinPitch(chunk: AudioChunk, options: YinOptions = {}): PitchResult {
  const {
    tolerance = 0.1,
    interpolate = true,
    minFrequency = 20,
    maxFrequency = 22050,
  } = options;

  const { sampleRate, id } = chunk;
  const samples = chunk.samples instanceof Float32Array
    ? chunk.samples
    : Float32Array.from(Object.values(chunk.samples as unknown as Record<string, number>));
  const frameSize = samples.length;
  const yinSize = Math.floor(frameSize / 2) + 1;

  const tauMax = Math.min(Math.ceil(sampleRate / minFrequency), Math.floor(frameSize / 2));
  const tauMin = Math.min(Math.floor(sampleRate / maxFrequency), Math.floor(frameSize / 2));

  console.log(tauMax, maxFrequency, tauMin, minFrequency);
  // Difference function: yin[tau] = sum of squared differences at lag tau
  const yin = new Float32Array(yinSize);
  yin[0] = 1;
  for (let tau = 1; tau < yinSize; tau++) {
    yin[tau] = 0;
    for (let j = 0; j < yinSize - 1; j++) {
      yin[tau] += (samples[j] - samples[j + tau]) ** 2;
    }
  }

  // Cumulative mean normalized difference function
  let sum = 0;
  for (let tau = 1; tau < yinSize; tau++) {
    sum += yin[tau];
    yin[tau] = (yin[tau] * tau) / sum;
    // Guard against NaN from near-zero sums
    if (isNaN(yin[tau])) {
      yin[tau] = 1;
    }
  }

  const threshold = tolerance;
  let bestTau = 0;
  let bestVal = 1;

  // First pass: smallest tau where CMNDF dips below threshold, then walk to local minimum
  for (let tau = tauMin; tau <= tauMax; tau++) {
    if (yin[tau] < threshold) {
      while (tau + 1 <= tauMax && yin[tau + 1] < yin[tau]) tau++;
      bestTau = tau;
      bestVal = yin[tau];
      break;
    }
  }

  // Fallback: global minimum in valid range
  if (bestTau === 0) {
    for (let tau = tauMin; tau <= tauMax; tau++) {
      if (yin[tau] < bestVal) {
        bestVal = yin[tau];
        bestTau = tau;
      }
    }
  }

  if (bestTau === 0) {
    return { id, frequency: 0, confidence: 0 };
  }

  let period = bestTau;

  // Parabolic interpolation for sub-sample accuracy
  if (interpolate && bestTau > 0 && bestTau < yinSize - 1) {
    const s0 = yin[bestTau - 1], s1 = yin[bestTau], s2 = yin[bestTau + 1];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (denom !== 0) {
      period = bestTau + (s2 - s0) / denom;
    }
  }

  return { id, frequency: sampleRate / period, confidence: Math.max(0, 1 - bestVal) };
}
