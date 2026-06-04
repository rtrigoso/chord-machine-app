import { Note, NOTES } from "@/constants/music";
import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { NoteOption } from "./NoteOption";

interface NoteSelectorProps {
    selected: Signal<Note>;
}

function NoteSelector({ selected }: NoteSelectorProps) {
    function select(evt: JSX.TargetedEvent<HTMLSelectElement>) {
        selected.value = evt.currentTarget.value as Note;
    }

    return (
        <div class="flex gap-1 justify-center bg-inherit">
            <label for="note-selection">
                Select Root Note:
            </label>
            <select
                name="note-selection"
                onInput={select}
                class="note-selection">
                {
                    NOTES.map((note) => (
                        <NoteOption key={note} note={note} selected={note === selected.value} />
                    ))
                }
            </select>
        </div>
    );
}

export { NoteSelector };
