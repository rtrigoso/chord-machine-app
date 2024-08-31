import './ChordDisplay.css';
import { ChordName, Note, Notes } from "@/constants/music";
import { GetNotesInChord } from "@/utils/music";
import { Signal } from "@preact/signals";
import { Component, Fragment } from "preact";

interface ChordDisplayProps {
    name: ChordName;
    rootNote: Signal<Note>;
};

class ChordDisplay extends Component<ChordDisplayProps> {
    constructor(props: ChordDisplayProps) {
        super(props);
    }

    render () {
        const { rootNote, name } = this.props;
        const notes: Notes = GetNotesInChord(rootNote.value, name)

        return (
            <div class="chord-display" >
                <div class="chord-display-name">{name}</div>
                <div class="chord-display-notes">
                {
                    notes.map(note => (
                        <Fragment key={note}>
                            <span class="chord-display-note">{note}</span>
                        </Fragment>
                    ))
                }
                </div>
            </div>
        );
    }
}

export { ChordDisplay };