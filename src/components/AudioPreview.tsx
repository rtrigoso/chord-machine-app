import { useState } from "preact/hooks";

interface AudioPreviewProps {
    onPlay: () => void;
    audioBuffer?: AudioBuffer;
}

function startPlaybackTimer(duration: number, onTick: (elapsed: number) => void): void {
    let ticks = 0;
    const interval = setInterval(() => {
        ticks++;
        const next = Math.min(ticks * 0.1, duration);
        onTick(next);
        if (next >= duration) clearInterval(interval);
    }, 100);
}

export function AudioPreview({ onPlay, audioBuffer }: AudioPreviewProps) {
    const [elapsed, setElapsed] = useState(0);

    function handlePlay() {
        if (audioBuffer) {
            setElapsed(0);
            startPlaybackTimer(audioBuffer.duration, setElapsed);
        }
        onPlay();
    }

    return (
        <div class="relative">
            {audioBuffer && (
                <span class="absolute top-0 right-0 text-xs">
                    {elapsed.toFixed(1)}s / {audioBuffer.duration.toFixed(1)}s
                </span>
            )}
            <div class="flex justify-center">
                <button type="button" onClick={handlePlay}>Play</button>
            </div>
        </div>
    );
}
