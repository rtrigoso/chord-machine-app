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
