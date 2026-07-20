interface AudioPreviewProps {
    onPlay: () => void;
    audioBuffer?: AudioBuffer;
}

export function AudioPreview({ onPlay, audioBuffer }: AudioPreviewProps) {
    return (
        <div class="relative">
            {audioBuffer && (
                <span class="absolute top-0 right-0 text-xs">
                    {audioBuffer.duration.toFixed(3)}s
                </span>
            )}
            <div class="flex justify-center">
                <button type="button" onClick={onPlay}>Play</button>
            </div>
        </div>
    );
}
