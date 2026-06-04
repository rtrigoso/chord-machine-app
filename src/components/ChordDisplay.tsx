import { Balance, ChordName, Note } from "@/constants/music";
import { GetNotesInChord } from "@/utils/music";
import { Signal } from "@preact/signals";

interface ChordDisplayProps {
    name: ChordName;
    rootNote: Signal<Note>;
    balance: Signal<Balance>;
}

export function ChordDisplay({ name, rootNote, balance }: ChordDisplayProps) {
    const [notes, distancesFromRootInSemitones] = GetNotesInChord(rootNote.value, name, balance.value);

    return (
        <div class="flex justify-between">
            <div class="chord-display-name normal-case">{name}</div>
            <div class="chord-display-notes flex flex-column gap-1">
                {notes.map((note, index) => (
                    <span key={note} class="chord-display-note">{note}/{distancesFromRootInSemitones[index]}</span>
                ))}
            </div>
        </div>
    );
}
