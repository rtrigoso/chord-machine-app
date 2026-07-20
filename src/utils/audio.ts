import type { Signal } from '@preact/signals';

export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

export function createMediaRecorder(stream: MediaStream, bufferSignal: Signal<ArrayBuffer | null>) {
  const recorder = new MediaRecorder(stream);

  recorder.ondataavailable = async (e: BlobEvent) => {
    bufferSignal.value = await e.data.arrayBuffer();
  };

  return {
    start: () => recorder.start(),
    stop: () => recorder.stop(),
  };
}

export async function decodeAudioBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  const ctx = new AudioContext();
  return ctx.decodeAudioData(arrayBuffer);
}

export interface AudioChunk {
  id: string;
  startTime: number;
  endTime: number;
  samples: Float32Array;
  sampleRate: number;
}

export function chunkAudioBuffer(audioBuffer: AudioBuffer, chunkSize = 1000): AudioChunk[] {
  const samples = audioBuffer.getChannelData(0);
  const { sampleRate } = audioBuffer;
  const chunks: AudioChunk[] = [];

  for (let i = 0; i * chunkSize < samples.length; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, samples.length);
    const startTime = start / sampleRate;
    const endTime = end / sampleRate;
    const chunkSamples = samples.slice(start, end);

    if (chunkSamples.length < chunkSize / 2 && chunks.length > 0) {
      const prev = chunks[chunks.length - 1];
      const merged = new Float32Array(prev.samples.length + chunkSamples.length);
      merged.set(prev.samples);
      merged.set(chunkSamples, prev.samples.length);
      chunks[chunks.length - 1] = { ...prev, samples: merged, endTime };
    } else {
      chunks.push({ id: crypto.randomUUID(), startTime, endTime, samples: chunkSamples, sampleRate });
    }
  }

  return chunks.map(chunk =>
    chunk.samples.length % 2 === 1
      ? { ...chunk, samples: chunk.samples.slice(0, -1) }
      : chunk
  );
}

export function getPlayback(audioBuffer: AudioBuffer): () => void {
  const ctx = new AudioContext();
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  return () => source.start();
}
