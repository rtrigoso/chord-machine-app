const PERMISSION_TIMEOUT_MS = 5000;

export function createTimeoutPromise(timeoutMs: number): [Promise<never>, ReturnType<typeof setTimeout>] {
    let timer!: ReturnType<typeof setTimeout>;
    const promise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Audio permission request timed out')), timeoutMs);
    });
    return [promise, timer];
}

export async function requestAudioStream(timeoutMs = PERMISSION_TIMEOUT_MS): Promise<MediaStream> {
    const [timeoutPromise, timer] = createTimeoutPromise(timeoutMs);
    try {
        return await Promise.race([
            navigator.mediaDevices.getUserMedia({ audio: true }),
            timeoutPromise,
        ]);
    } finally {
        clearTimeout(timer);
    }
}
