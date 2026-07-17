import { useState, useEffect } from "preact/hooks";
import { AudioUploadForm } from "@/components/AudioUploadForm";
import { AudioRecordingForm } from "@/components/AudioRecordingForm";
import { AudioPreview } from "@/components/AudioPreview";
import { AudioInputModeSelector, AudioInputMode } from "@/components/AudioInputModeSelector";
import { getPlayback, fileToArrayBuffer, decodeAudioBuffer } from "@utils/audio";

export default function PitchCheck() {
    const [mode, setMode] = useState<AudioInputMode>("upload");
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>(undefined);
    const [sampleRate, setSampleRate] = useState<number | undefined>(undefined);

    useEffect(() => {
        setSampleRate(audioBuffer?.sampleRate);
    }, [audioBuffer]);

    const handleAudioSubmission = async (file: File) => {
        const arrayBuffer = await fileToArrayBuffer(file);
        const decoded = await decodeAudioBuffer(arrayBuffer);
        setAudioBuffer(decoded);
    };

    const handleAudioInputSelected = (stream: MediaStream) => {
        console.log("audio input selected", stream);
    };

    const handleRecordingStart = () => {
        console.log("recording started");
    };

    const handleRecordingStop = () => {
        console.log("recording stopped");
    };

    const handlePlay = () => {
        if (audioBuffer) {
            const start = getPlayback(audioBuffer);
            start();
        }
    };

    return (
        <div class="p-4 flex flex-col gap-4">
            <AudioInputModeSelector
                selected={mode}
                onUploadSelected={() => setMode("upload")}
                onRecordSelected={() => setMode("record")}
            />

            {mode === "upload" && (
                <AudioUploadForm onAudioSubmission={handleAudioSubmission} />
            )}
            {mode === "record" && (
                <AudioRecordingForm
                    onAudioInputSelected={handleAudioInputSelected}
                    onRecordingStart={handleRecordingStart}
                    onRecordingStop={handleRecordingStop}
                />
            )}

            {sampleRate !== undefined && <p>Sample rate: {sampleRate} Hz</p>}
            <AudioPreview onPlay={handlePlay} audioBuffer={audioBuffer} />
        </div>
    );
}
