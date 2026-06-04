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
    private timeoutId: ReturnType<typeof setTimeout> | undefined;

    constructor(props: ChordDisplayProps) {
        super(props);
    }

    refreshDisplay () {
        const randomTimeout = 100 * Math.floor(Math.random() * 10);
        const stopLoading = () => this.setState({ isLoading: false });
        this.setState({ isLoading: true });
        this.timeoutId = setTimeout(stopLoading, randomTimeout);
    }

    componentDidMount () {
        this.refreshDisplay();
    }

    componentWillUnmount () {
        clearTimeout(this.timeoutId);
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