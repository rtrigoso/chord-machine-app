import { useRef, useState } from "preact/hooks";

interface AudioUploadFormProps {
    onAudioSubmission: (file: File) => void;
}

export function AudioUploadForm({ onAudioSubmission }: AudioUploadFormProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [hasFile, setHasFile] = useState(false);

    const handleFileChange = () => setHasFile(!!inputRef.current?.files?.[0]);

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        const file = inputRef.current?.files?.[0];
        if (file) {
            onAudioSubmission(file);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input ref={inputRef} type="file" accept="audio/*" onChange={handleFileChange} />
            <button type="submit" disabled={!hasFile}>Submit</button>
        </form>
    );
}
