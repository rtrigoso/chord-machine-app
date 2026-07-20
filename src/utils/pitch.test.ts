import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AudioChunk } from './audio';

const mocks = vi.hoisted(() => {
  const mockArrayToVector = vi.fn((arr: unknown) => arr);
  const mockVectorToArray = vi.fn((arr: unknown) => arr);
  const mockPeakDetection = vi.fn();
  const mockWindowing = vi.fn();
  const mockSpectrum = vi.fn();
  const mockPitchYinFFT = vi.fn();

  const instance = {
    arrayToVector: mockArrayToVector,
    vectorToArray: mockVectorToArray,
    PeakDetection: mockPeakDetection,
    Windowing: mockWindowing,
    Spectrum: mockSpectrum,
    PitchYinFFT: mockPitchYinFFT,
  };

  // regular function (not arrow) so `new MockEssentia()` returns instance
  function MockEssentiaFn() { return instance; }

  return {
    mockArrayToVector,
    mockVectorToArray,
    mockPeakDetection,
    mockWindowing,
    mockSpectrum,
    mockPitchYinFFT,
    MockEssentia: vi.fn(MockEssentiaFn),
    mockEssentiaWASM: vi.fn(),
  };
});

vi.mock('essentia.js/dist/essentia.js-core.es.js', () => ({ default: mocks.MockEssentia }));
vi.mock('essentia.js/dist/essentia-wasm.es.js', () => ({ EssentiaWASM: mocks.mockEssentiaWASM }));

import { getPitch, getPitches, toNote, PITCH_YIN, PITCH_YIN_FFT, type PitchResult } from './pitch';

function makeChunk(samples: number[] | Float32Array, id = 'test-chunk-id', sampleRate = 44100): AudioChunk {
  return { id, startTime: 0, endTime: 0.02, samples: samples instanceof Float32Array ? samples : new Float32Array(samples), sampleRate };
}

function makeSine(frequency: number, sampleRate: number, numSamples: number): Float32Array {
  const out = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    out[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
  }
  return out;
}

describe('getPitch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe(PITCH_YIN, () => {
    it('returns id, frequency and confidence from getYinPitch', () => {
      const samples = makeSine(440, 44100, 2048);
      const result = getPitch(makeChunk(samples, 'test-chunk-id', 44100), PITCH_YIN);

      expect(result.id).toBe('test-chunk-id');
      expect(result.frequency).toBeCloseTo(440, 0);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('does not call Windowing, Spectrum, or PitchYinFFT', () => {
      mocks.mockPeakDetection.mockReturnValue({ positions: [50], amplitudes: [-0.1] });

      getPitch(makeChunk(Array(200).fill(0)), PITCH_YIN);

      expect(mocks.mockWindowing).not.toHaveBeenCalled();
      expect(mocks.mockSpectrum).not.toHaveBeenCalled();
      expect(mocks.mockPitchYinFFT).not.toHaveBeenCalled();
    });
  });

  describe(PITCH_YIN_FFT, () => {
    it('pipes frame through Windowing → Spectrum → PitchYinFFT', () => {
      const chunk = makeChunk([0.1, 0.1, -0.3, 0.2]);
      const windowed = new Float32Array([0.05, 0.1, -0.3, 0.1]);
      const spectrum = new Float32Array([0.2, 0.8, 0.1]);

      mocks.mockWindowing.mockReturnValue({ frame: windowed });
      mocks.mockSpectrum.mockReturnValue({ spectrum });
      mocks.mockPitchYinFFT.mockReturnValue({ pitch: 220, pitchConfidence: 0.85 });

      getPitch(chunk, PITCH_YIN_FFT);

      expect(mocks.mockWindowing).toHaveBeenCalledWith(chunk.samples, true, chunk.samples.length, 'hann');
      expect(mocks.mockSpectrum).toHaveBeenCalledWith(windowed, chunk.samples.length);
      expect(mocks.mockPitchYinFFT).toHaveBeenCalledWith(spectrum, chunk.samples.length, true, 22050, 20, chunk.sampleRate, 0.1);
    });

    it('returns id, frequency and confidence from PitchYinFFT', () => {
      mocks.mockWindowing.mockReturnValue({ frame: new Float32Array([0]) });
      mocks.mockSpectrum.mockReturnValue({ spectrum: new Float32Array([0]) });
      mocks.mockPitchYinFFT.mockReturnValue({ pitch: 261.63, pitchConfidence: 0.72 });

      const result = getPitch(makeChunk([0, 1, 0, -1]), PITCH_YIN_FFT);

      expect(result).toEqual({ id: 'test-chunk-id', frequency: 261.63, confidence: 0.72 });
    });

    it('does not call PeakDetection', () => {
      mocks.mockWindowing.mockReturnValue({ frame: new Float32Array([0]) });
      mocks.mockSpectrum.mockReturnValue({ spectrum: new Float32Array([0]) });
      mocks.mockPitchYinFFT.mockReturnValue({ pitch: 440, pitchConfidence: 0.9 });

      getPitch(makeChunk([0, 1]), PITCH_YIN_FFT);

      expect(mocks.mockPeakDetection).not.toHaveBeenCalled();
    });
  });
});

describe('getPitches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a PitchResult for every chunk', () => {
    const chunks = [makeChunk([0, 1], 'id-a'), makeChunk([1, 0], 'id-b'), makeChunk([-1, 0], 'id-c')];
    mocks.mockPeakDetection.mockReturnValue({ positions: [50], amplitudes: [-0.1] });

    const results = getPitches(chunks, PITCH_YIN);

    expect(results).toHaveLength(3);
  });

  it('preserves the chunk id on each result so chunks and results can be matched', () => {
    const chunks = [makeChunk([0, 1], 'id-a'), makeChunk([1, 0], 'id-b')];
    mocks.mockPeakDetection.mockReturnValue({ positions: [50], amplitudes: [-0.1] });

    const results = getPitches(chunks, PITCH_YIN);

    expect(results.map(r => r.id)).toEqual(['id-a', 'id-b']);
  });

  it('processes all chunks with the given algorithm', () => {
    const chunks = [
      makeChunk(makeSine(440, 44100, 2048), 'id-a', 44100),
      makeChunk(makeSine(220, 44100, 2048), 'id-b', 44100),
    ];

    const results = getPitches(chunks, PITCH_YIN);

    expect(results[0].id).toBe('id-a');
    expect(results[0].frequency).toBeCloseTo(440, 0);
    expect(results[1].id).toBe('id-b');
    expect(results[1].frequency).toBeCloseTo(220, 0);
  });

  it('returns an empty array for an empty chunk list', () => {
    const results = getPitches([], PITCH_YIN);
    expect(results).toEqual([]);
  });
});

describe('toNote', () => {
  function makePitchResult(frequency: number, id = 'pitch-id'): PitchResult {
    return { id, frequency, confidence: 0.9 };
  }

  it('propagates the PitchResult id to the NoteResult', () => {
    const result = toNote(makePitchResult(440, 'my-id'));
    expect(result.id).toBe('my-id');
  });

  it('identifies A4 (440 Hz) as A with 0 cents deviation', () => {
    const result = toNote(makePitchResult(440));
    expect(result.value).toBe('A');
    expect(result.centsOff).toBe(0);
  });

  it('identifies C4 (~261.63 Hz) as C with 0 cents deviation', () => {
    const result = toNote(makePitchResult(261.6256));
    expect(result.value).toBe('C');
    expect(result.centsOff).toBe(0);
  });

  it('identifies A#4 (~466.16 Hz) as A# with 0 cents deviation', () => {
    const result = toNote(makePitchResult(440 * Math.pow(2, 1 / 12)));
    expect(result.value).toBe('A#');
    expect(result.centsOff).toBe(0);
  });

  it('returns positive centsOff when frequency is sharp of the nearest note', () => {
    const result = toNote(makePitchResult(440 * Math.pow(2, 25 / 1200)));
    expect(result.value).toBe('A');
    expect(result.centsOff).toBe(25);
  });

  it('returns negative centsOff when frequency is flat of the nearest note', () => {
    const result = toNote(makePitchResult(440 * Math.pow(2, -30 / 1200)));
    expect(result.value).toBe('A');
    expect(result.centsOff).toBe(-30);
  });
});
