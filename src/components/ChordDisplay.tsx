import { ChordName, Note, Notes } from "@/constants/music";
import { GetNotesInChord } from "@/utils/music";
import { Component, Fragment } from "preact";

interface ChordDisplayProps {
    name: ChordName;
    rootNote: Note;
};

class ChordDisplay extends Component<ChordDisplayProps> {
    constructor(props: ChordDisplayProps) {
        super(props);
    }

    render () {
        const { rootNote, name } = this.props;
        const notes: Notes = GetNotesInChord(rootNote, name)

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