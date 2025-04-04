import { Balance, ChordName, Note } from "@/constants/music";
import { GetNotesInChord } from "@/utils/music";
import { Signal } from "@preact/signals";
import { Component, Fragment } from "preact";

interface ChordDisplayProps {
    name: ChordName;
    rootNote: Signal<Note>;
    balance: Signal<Balance>;
};

interface ChordDisplayState {
    isLoading: boolean;
}

class ChordDisplay extends Component<ChordDisplayProps, ChordDisplayState> {
    constructor(props: ChordDisplayProps) {
        super(props);
    }

    refreshDisplay () {
        const randomTimeout = 100 * Math.floor(Math.random() * 10);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, randomTimeout);
    }

    componentDidMount () {
        this.refreshDisplay();
    }

    render () {
        const { isLoading } = this.state;
        const { rootNote, name, balance } = this.props;
        const [notes, distancesFromRootInSemitones] = GetNotesInChord(rootNote.value, name, balance.value);

        return (
            <div class={`flex justify-between ${isLoading ? 'is-loading' : ''}`} >
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