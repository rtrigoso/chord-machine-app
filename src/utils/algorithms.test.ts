import { describe, it, expect } from 'vitest';
import type { AudioChunk } from './audio';
import { getYinPitch } from './algorithms';

function makeChunk(samples: Float32Array | number[], id = 'test-id', sampleRate = 44100): AudioChunk {
  return {
    id,
    startTime: 0,
    endTime: 0.02,
    samples: samples instanceof Float32Array ? samples : new Float32Array(samples),
    sampleRate,
  };
}

function makeSine(frequency: number, sampleRate: number, numSamples: number): Float32Array {
  const out = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    out[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
  }
  return out;
}

describe('getYinPitch', () => {
  it('propagates the chunk id to the result', () => {
    const result = getYinPitch(makeChunk(Array(400).fill(0), 'my-id'));
    expect(result.id).toBe('my-id');
  });

  it('returns frequency=0 and confidence=0 for a silent signal', () => {
    const result = getYinPitch(makeChunk(Array(400).fill(0)));
    expect(result).toEqual({ id: 'test-id', frequency: 0, confidence: 0 });
  });

  it('detects the fundamental frequency of a 440 Hz sine wave', () => {
    const samples = makeSine(440, 44100, 2048);
    const result = getYinPitch(makeChunk(samples, 'id', 44100));
    expect(result.frequency).toBeCloseTo(440, 0);
  });

  it('reports high confidence for a clean sine wave', () => {
    const samples = makeSine(440, 44100, 2048);
    const result = getYinPitch(makeChunk(samples, 'id', 44100));
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('clamps confidence to 0 when the signal has no periodicity', () => {
    const result = getYinPitch(makeChunk(Array(400).fill(0)));
    expect(result.confidence).toBe(0);
  });

  it('respects a custom sampleRate when computing frequency', () => {
    const sampleRate = 22050;
    const frequency = 220;
    const samples = makeSine(frequency, sampleRate, 2048);
    const result = getYinPitch(makeChunk(samples, 'id', sampleRate));
    expect(result.frequency).toBeCloseTo(frequency, 0);
  });

  it('detects a lower frequency with a higher tolerance threshold', () => {
    const samples = makeSine(110, 44100, 4096);
    const result = getYinPitch(makeChunk(samples, 'id', 44100), { tolerance: 0.15 });
    expect(result.frequency).toBeCloseTo(110, 0);
  });

  it('accepts chunk.samples as a plain object (JSON-serialised Float32Array)', () => {
    const sine = makeSine(440, 44100, 2048);
    const samplesObj: Record<string, number> = {};
    for (let i = 0; i < sine.length; i++) samplesObj[String(i)] = sine[i];

    const chunk = {
      id: 'obj-id',
      startTime: 0,
      endTime: 0.02,
      samples: samplesObj as unknown as Float32Array,
      sampleRate: 44100,
    };
    const result = getYinPitch(chunk);
    expect(result.frequency).toBeCloseTo(440, 0);
  });
});
