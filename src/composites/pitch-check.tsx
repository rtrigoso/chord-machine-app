import { useState, useEffect } from "preact/hooks";
import { AudioUploadForm } from "@/components/AudioUploadForm";
import { AudioRecordingForm } from "@/components/AudioRecordingForm";
import { AudioPreview } from "@/components/AudioPreview";
import { AudioInputModeSelector, AudioInputMode } from "@/components/AudioInputModeSelector";
import { getPlayback, fileToArrayBuffer, decodeAudioBuffer, chunkAudioBuffer, type AudioChunk } from "@utils/audio";
import { getPitches, toNote, PITCH_YIN, PITCH_YIN_FFT, PITCH_SPECTRAL_PEAK, type PitchAlgorithm, type PitchResult, type NoteResult } from "@utils/pitch";
import ProcessButton from "@/components/ProcessButton";

function toNotes(pitchResults: PitchResult[]): NoteResult[] {
    return pitchResults.map(toNote);
}

export default function PitchCheck() {
    const [mode, setMode] = useState<AudioInputMode>("upload");
    const [algorithm, setAlgorithm] = useState<PitchAlgorithm>(PITCH_YIN);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>(undefined);
    const [sampleRate, setSampleRate] = useState<number | undefined>(undefined);
    const [isProcessing, setIsProcessing] = useState(false);
    const [chunkSampleCount, setChunkSampleCount] = useState(1000);
    const [minFrequency, setMinFrequency] = useState(500);
    const [tolerance, setTolerance] = useState(0.15);
    const [chunks, setChunks] = useState<AudioChunk[] | undefined>(undefined);
    const [requiredMinFrequency, setRequiredMinFrequency] = useState<number | undefined>(undefined);
    const [pitchResults, setPitchResults] = useState<PitchResult[] | undefined>(undefined);
    const [noteResults, setNoteResults] = useState<NoteResult[] | undefined>(undefined);

    useEffect(() => {
        setSampleRate(audioBuffer?.sampleRate);
        setIsProcessing(false);
        setRequiredMinFrequency(undefined);
    }, [audioBuffer]);

    useEffect(() => {
        if (chunks === undefined || chunks.length === 0) return;
        const { sampleRate, samples } = chunks[0];
        setRequiredMinFrequency((2 * sampleRate) / samples.length);
        setPitchResults(getPitches(chunks, algorithm, { minFrequency, tolerance }));
    }, [chunks]);

    useEffect(() => {
        if (pitchResults === undefined) return;
        setNoteResults(toNotes(pitchResults));
    }, [pitchResults]);

    useEffect(() => {
        if (noteResults === undefined) return;
        setIsProcessing(false);
        console.log(`algorithm: ${algorithm} | chunk samples: ${chunkSampleCount} | min frequency: ${minFrequency} Hz`);
        noteResults!.forEach((note, i) => {
            const confidence = pitchResults![i].confidence.toFixed(2);
            const { id, samples } = chunks![i];
            console.log(`[${id}] ${note.value} | confidence: ${confidence} | cents off: ${note.centsOff} | frames: ${samples.length}`);
        });
    }, [noteResults]);

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

    const handleAudioProcessing = () => {
        setIsProcessing(true);
        const newChunks = chunkAudioBuffer(audioBuffer!, chunkSampleCount);
        setChunks(newChunks);
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
            {requiredMinFrequency !== undefined && algorithm === PITCH_YIN && (
                <p>Min detectable frequency: {requiredMinFrequency.toFixed(1)} Hz</p>
            )}
            <label>
                Algorithm:{" "}
                <select value={algorithm} onChange={e => setAlgorithm((e.target as HTMLSelectElement).value as PitchAlgorithm)}>
                    <option value={PITCH_YIN}>PitchYin</option>
                    <option value={PITCH_YIN_FFT}>PitchYinFFT</option>
                    <option value={PITCH_SPECTRAL_PEAK}>SpectralPeak</option>
                </select>
            </label>
            <label>
                Samples per chunk:{" "}
                <select value={chunkSampleCount} onChange={e => setChunkSampleCount(Number((e.target as HTMLSelectElement).value))}>
                    {Array.from({ length: 20 }, (_, i) => (i + 1) * 100).map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </label>
            <label>
                Tolerance:{" "}
                <select value={tolerance} onChange={e => setTolerance(Number((e.target as HTMLSelectElement).value))}>
                    {Array.from({ length: 10 }, (_, i) => parseFloat(((i + 1) * 0.05).toFixed(2))).map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </label>
            <label>
                Min frequency:{" "}
                <select value={minFrequency} onChange={e => setMinFrequency(Number((e.target as HTMLSelectElement).value))}>
                    {Array.from({ length: 20 }, (_, i) => (i + 1) * 100).map(n => (
                        <option key={n} value={n}>{n} Hz</option>
                    ))}
                </select>
            </label>
            <AudioPreview onPlay={handlePlay} audioBuffer={audioBuffer} />
            {audioBuffer !== undefined && !isProcessing && (
                <ProcessButton onProcessStart={handleAudioProcessing} isLoading={isProcessing} />
            )}
        </div>
    );
}
