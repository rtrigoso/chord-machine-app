import { ChordName, Note, Notes } from "@/constants/music";
import { GetNotesInChord } from "@/utils/music";
import { Signal } from "@preact/signals";
import { Component, Fragment } from "preact";

interface ChordDisplayProps {
    name: Signal<ChordName>;
    rootNote: Signal<Note>;
};

class ChordDisplay extends Component<ChordDisplayProps> {
    constructor(props: ChordDisplayProps) {
        super(props);
    }

    render () {
        const { rootNote, name } = this.props;
        const notes: Notes = GetNotesInChord(rootNote.value, name.value)

        return (
            <div class="chord-display" >
                {
                    notes.map(note => (
                        <Fragment key={note}>
                            <>{note}</>
                        </Fragment>
                    ))
                }
            </div>
        );
    }
}

export { ChordDisplay };