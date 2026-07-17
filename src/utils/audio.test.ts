import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signal } from '@preact/signals';
import { fileToArrayBuffer, createMediaRecorder, decodeAudioBuffer, getPlayback, chunkAudioBuffer } from './audio';

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fileToArrayBuffer', () => {
  it('resolves with the file array buffer', async () => {
    const buffer = new ArrayBuffer(8);
    const file = { arrayBuffer: vi.fn().mockResolvedValue(buffer) } as unknown as File;

    const result = await fileToArrayBuffer(file);

    expect(result).toBe(buffer);
  });
});

describe('createMediaRecorder', () => {
  function makeMockRecorder() {
    const recorder = {
      start: vi.fn(),
      stop: vi.fn(),
      ondataavailable: null as ((e: { data: Blob }) => void) | null,
    };
    vi.stubGlobal('MediaRecorder', function () { return recorder; });
    return recorder;
  }

  it('returns callable start and stop functions', () => {
    const mockRecorder = makeMockRecorder();
    const sig = signal<ArrayBuffer | null>(null);
    const { start, stop } = createMediaRecorder({} as MediaStream, sig);

    start();
    stop();

    expect(mockRecorder.start).toHaveBeenCalled();
    expect(mockRecorder.stop).toHaveBeenCalled();
  });

  it('updates the signal with the blob array buffer when dataavailable fires', async () => {
    const mockRecorder = makeMockRecorder();
    const sig = signal<ArrayBuffer | null>(null);
    const buffer = new ArrayBuffer(16);
    const blob = { arrayBuffer: vi.fn().mockResolvedValue(buffer) } as unknown as Blob;

    createMediaRecorder({} as MediaStream, sig);
    await mockRecorder.ondataavailable!({ data: blob });

    expect(sig.value).toBe(buffer);
  });
});

describe('getPlayback', () => {
  it('returns a function that calls source.start()', () => {
    const start = vi.fn();
    const connect = vi.fn();
    const source = { buffer: null, connect, start };
    const createBufferSource = vi.fn(() => source);
    vi.stubGlobal('AudioContext', function () {
      return { createBufferSource, destination: {} };
    });

    const audioBuffer = {} as AudioBuffer;
    const play = getPlayback(audioBuffer);

    expect(source.buffer).toBe(audioBuffer);
    expect(connect).toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();

    play();

    expect(start).toHaveBeenCalled();
  });
});

describe('chunkAudioBuffer', () => {
  function makeMockAudioBuffer(samples: number[], sampleRate: number): AudioBuffer {
    return {
      getChannelData: vi.fn(() => new Float32Array(samples)),
      sampleRate,
      length: samples.length,
      duration: samples.length / sampleRate,
      numberOfChannels: 1,
    } as unknown as AudioBuffer;
  }

  // sampleRate=100 → chunkSize = floor(100 * 0.02) = 2 samples per chunk
  it('returns an empty array for an empty audio buffer', () => {
    const audioBuffer = makeMockAudioBuffer([], 100);
    expect(chunkAudioBuffer(audioBuffer)).toEqual([]);
  });

  it('returns the correct number of chunks when the buffer divides evenly', () => {
    const audioBuffer = makeMockAudioBuffer([1, 2, 3, 4, 5, 6], 100);
    expect(chunkAudioBuffer(audioBuffer)).toHaveLength(3);
  });

  it('returns the correct number of chunks when the buffer has a remainder', () => {
    const audioBuffer = makeMockAudioBuffer([1, 2, 3, 4, 5], 100);
    expect(chunkAudioBuffer(audioBuffer)).toHaveLength(3);
  });

  it('assigns sequential indices to each chunk', () => {
    const audioBuffer = makeMockAudioBuffer([1, 2, 3, 4, 5, 6], 100);
    const chunks = chunkAudioBuffer(audioBuffer);
    expect(chunks.map(c => c.index)).toEqual([0, 1, 2]);
  });

  it('computes correct startTime and endTime for each chunk', () => {
    const audioBuffer = makeMockAudioBuffer([1, 2, 3, 4, 5, 6], 100);
    const chunks = chunkAudioBuffer(audioBuffer);
    expect(chunks[0].startTime).toBeCloseTo(0);
    expect(chunks[0].endTime).toBeCloseTo(0.02);
    expect(chunks[1].startTime).toBeCloseTo(0.02);
    expect(chunks[1].endTime).toBeCloseTo(0.04);
    expect(chunks[2].startTime).toBeCloseTo(0.04);
    expect(chunks[2].endTime).toBeCloseTo(0.06);
  });

  it('slices the correct samples into each chunk', () => {
    const audioBuffer = makeMockAudioBuffer([1, 2, 3, 4, 5, 6], 100);
    const chunks = chunkAudioBuffer(audioBuffer);
    expect(Array.from(chunks[0].samples)).toEqual([1, 2]);
    expect(Array.from(chunks[1].samples)).toEqual([3, 4]);
    expect(Array.from(chunks[2].samples)).toEqual([5, 6]);
  });

  it('clips the last chunk to the remaining samples when the buffer has a remainder', () => {
    const audioBuffer = makeMockAudioBuffer([1, 2, 3, 4, 5], 100);
    const chunks = chunkAudioBuffer(audioBuffer);
    expect(Array.from(chunks[2].samples)).toEqual([5]);
    expect(chunks[2].endTime).toBeCloseTo(0.05);
  });

  it('uses a chunkSize based on the actual sampleRate', () => {
    // sampleRate=44100 → chunkSize = floor(44100 * 0.02) = 882
    const samples = new Array(882 * 3).fill(0).map((_, i) => i);
    const audioBuffer = makeMockAudioBuffer(samples, 44100);
    const chunks = chunkAudioBuffer(audioBuffer);
    expect(chunks).toHaveLength(3);
    expect(chunks[0].samples).toHaveLength(882);
  });
});

describe('decodeAudioBuffer', () => {
  it('resolves with an AudioBuffer decoded from the array buffer', async () => {
    const mockAudioBuffer = {} as AudioBuffer;
    const decodeAudioData = vi.fn().mockResolvedValue(mockAudioBuffer);
    vi.stubGlobal('AudioContext', function () { return { decodeAudioData }; });

    const arrayBuffer = new ArrayBuffer(8);
    const result = await decodeAudioBuffer(arrayBuffer);

    expect(result).toBe(mockAudioBuffer);
    expect(decodeAudioData).toHaveBeenCalledWith(arrayBuffer);
  });
});
