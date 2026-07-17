import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signal } from '@preact/signals';
import { fileToArrayBuffer, createMediaRecorder, decodeAudioBuffer } from './audio';

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
