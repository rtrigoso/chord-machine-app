export type AudioInputMode = "upload" | "record";

interface AudioInputModeSelectorProps {
    onUploadSelected: () => void;
    onRecordSelected: () => void;
    selected?: AudioInputMode;
}

export function AudioInputModeSelector({ onUploadSelected, onRecordSelected, selected }: AudioInputModeSelectorProps) {
    return (
        <div class="flex gap-4">
            <label>
                <input
                    type="radio"
                    name="audio-input-mode"
                    value="upload"
                    checked={selected === "upload"}
                    onChange={onUploadSelected}
                />
                {" "}Upload
            </label>
            <label>
                <input
                    type="radio"
                    name="audio-input-mode"
                    value="record"
                    checked={selected === "record"}
                    onChange={onRecordSelected}
                />
                {" "}Record
            </label>
        </div>
    );
}
