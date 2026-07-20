// @ts-ignore — no TS declarations for the ES dist paths
import Essentia from 'essentia.js/dist/essentia.js-core.es.js';
// @ts-ignore
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';
import { NOTES, type Note } from '@constants/music';
import type { AudioChunk } from './audio';
import type { YinOptions } from './algorithms';

export const PITCH_YIN = 'PitchYin' as const;
export const PITCH_YIN_FFT = 'PitchYinFFT' as const;
export const PITCH_SPECTRAL_PEAK = 'SpectralPeak' as const;
export type PitchAlgorithm = typeof PITCH_YIN | typeof PITCH_YIN_FFT | typeof PITCH_SPECTRAL_PEAK;

export interface PitchResult {
  id: string;
  frequency: number;
  confidence: number;
}

export interface NoteResult {
  id: string;
  value: Note;
  centsOff: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const essentia: any = new Essentia(EssentiaWASM);

export function getPitch(chunk: AudioChunk, algorithm: PitchAlgorithm, yinOptions?: YinOptions): PitchResult {
  const frameSize = chunk.samples.length;
  const frame = essentia.arrayToVector(chunk.samples);

  const { frame: windowed } = essentia.Windowing(frame, true, frameSize, 'hann');

  if (algorithm === PITCH_YIN) {
    const { pitch, pitchConfidence } = essentia.PitchYin(
      windowed,
      frameSize,
      yinOptions?.interpolate ?? true,
      yinOptions?.maxFrequency ?? 22050,
      yinOptions?.minFrequency ?? 20,
      chunk.sampleRate,
      yinOptions?.tolerance ?? 0.15,
    );
    return { id: chunk.id, frequency: pitch, confidence: pitchConfidence };
  }
  const { spectrum } = essentia.Spectrum(windowed, frameSize);

  if (algorithm === PITCH_YIN_FFT) {
    const { pitch, pitchConfidence } = essentia.PitchYinFFT(spectrum, frameSize, true, 22050, 20, chunk.sampleRate, 0.1);
    return { id: chunk.id, frequency: pitch, confidence: pitchConfidence };
  }

  const { frequencies, magnitudes } = essentia.SpectralPeaks(spectrum, 0, chunk.sampleRate / 2, 1, 0, 'magnitude', chunk.sampleRate);
  const freqArray = essentia.vectorToArray(frequencies);
  const magArray = essentia.vectorToArray(magnitudes);
  return { id: chunk.id, frequency: freqArray[0] ?? 0, confidence: magArray[0] ?? 0 };
}

export function toNote(pitchResult: PitchResult): NoteResult {
  const exactMidi = 12 * Math.log2(pitchResult.frequency / 440) + 69;
  const roundedMidi = Math.round(exactMidi);
  const centsOff = Math.round((exactMidi - roundedMidi) * 100);
  const pitchClass = ((roundedMidi % 12) + 12) % 12;
  const noteIndex = (pitchClass - 9 + 12) % 12;

  return {
    id: pitchResult.id,
    value: NOTES[noteIndex],
    centsOff,
  };
}

export function getPitches(chunks: AudioChunk[], algorithm: PitchAlgorithm, yinOptions?: YinOptions): PitchResult[] {
  return chunks.map(chunk => getPitch(chunk, algorithm, yinOptions));
}
