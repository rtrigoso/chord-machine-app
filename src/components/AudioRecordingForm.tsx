import { useEffect, useState } from "preact/hooks";
import { requestAudioStream } from "@/utils/mediaDevices";

const RECORDING_DURATION_MS = 5000;

interface AudioRecordingFormProps {
    onAudioInputSelected: (stream: MediaStream) => void;
    onRecordingStart: () => void;
    onRecordingStop: () => void;
}

export function AudioRecordingForm({ onAudioInputSelected, onRecordingStart, onRecordingStop }: AudioRecordingFormProps) {
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        requestAudioStream()
            .then((stream) => {
                setMediaStream(stream);
                onAudioInputSelected(stream);
            })
            .catch(() => setPermissionDenied(true));
    }, []);

    const handleRecord = () => {
        onRecordingStart();
        setTimeout(onRecordingStop, RECORDING_DURATION_MS);
    };

    if (permissionDenied) {
        return <p>user audio device permissions are required for recording</p>;
    }

    return (
        <form>
            <button type="button" disabled={!mediaStream} onClick={handleRecord}>Record</button>
        </form>
    );
}
