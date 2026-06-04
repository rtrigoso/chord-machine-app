import { Balance, ChordName, Note } from "@/constants/music";
import { GetNotesInChord } from "@/utils/music";
import { Signal } from "@preact/signals";
import { Component, Fragment } from "preact";

interface ChordDisplayProps {
    name: ChordName;
    rootNote: Signal<Note>;
    balance: Signal<Balance>;
};

class ChordDisplay extends Component<ChordDisplayProps> {
    constructor(props: ChordDisplayProps) {
        super(props);
    }

    render () {
        const { rootNote, name, balance } = this.props;
        const [notes, distancesFromRootInSemitones] = GetNotesInChord(rootNote.value, name, balance.value);

        return (
            <div class="flex justify-between" >
                <div class="chord-display-name normal-case">{name}</div>
                <div
                    class="chord-display-notes flex flex-column gap-1"
                >
                {
                    notes.map((note, index) => (
                        <Fragment key={note}>
                            <span class="chord-display-note">{note}/{distancesFromRootInSemitones[index]}</span>
                        </Fragment>
                    ))
                }
                </div>
            </div>
        );
    }
}

export { ChordDisplay };
