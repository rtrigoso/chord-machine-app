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
  index: number;
  startTime: number;
  endTime: number;
  samples: Float32Array;
}

export function chunkAudioBuffer(audioBuffer: AudioBuffer): AudioChunk[] {
  const samples = audioBuffer.getChannelData(0);
  const { sampleRate } = audioBuffer;
  const chunkSize = Math.floor(sampleRate * 0.02);
  const chunks: AudioChunk[] = [];

  for (let i = 0; i * chunkSize < samples.length; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, samples.length);
    chunks.push({
      index: i,
      startTime: start / sampleRate,
      endTime: end / sampleRate,
      samples: samples.slice(start, end),
    });
  }

  return chunks;
}

export function getPlayback(audioBuffer: AudioBuffer): () => void {
  const ctx = new AudioContext();
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  return () => source.start();
}
