import { Note } from "@/constants/music";

interface NoteOptionProps {
    note: Note;
    selected: boolean;
}

export function NoteOption({ note, selected }: NoteOptionProps) {
    return (
        <option selected={selected} value={note}>
            {note}
        </option>
    );
}
