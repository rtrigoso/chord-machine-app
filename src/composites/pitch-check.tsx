import { useState } from "preact/hooks";
import { AudioUploadForm } from "@/components/AudioUploadForm";
import { AudioRecordingForm } from "@/components/AudioRecordingForm";

type AudioInputMode = "upload" | "record";

export default function PitchCheck() {
    const [mode, setMode] = useState<AudioInputMode>("upload");

    const handleAudioSubmission = (file: File) => {
        console.log("audio file submitted", file);
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

    return (
        <div class="p-4 flex flex-col gap-4">
            <div class="flex gap-4">
                <label>
                    <input
                        type="radio"
                        name="audio-input-mode"
                        value="upload"
                        checked={mode === "upload"}
                        onChange={() => setMode("upload")}
                    />
                    {" "}Upload
                </label>
                <label>
                    <input
                        type="radio"
                        name="audio-input-mode"
                        value="record"
                        checked={mode === "record"}
                        onChange={() => setMode("record")}
                    />
                    {" "}Record
                </label>
            </div>

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
        </div>
    );
}
