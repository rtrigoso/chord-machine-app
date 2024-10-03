import './ChordDisplay.css';
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
    isInSemitones: boolean; 
    isLoading: boolean;
}

class ChordDisplay extends Component<ChordDisplayProps, ChordDisplayState> {
    constructor(props: ChordDisplayProps) {
        super(props);
    }

    onHover () {
        this.setState({ isInSemitones: true });
        setTimeout(() => {
            this.setState({ isInSemitones: false });
        }, 1000);
    }

    onDrop () {
        this.setState({ isInSemitones: false });
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
        const { isInSemitones, isLoading } = this.state;
        const { rootNote, name, balance } = this.props;
        const [notes, distancesFromRootInSemitones] = GetNotesInChord(rootNote.value, name, balance.value);

        return (
            <div class={`chord-display ${isLoading ? 'is-loading' : ''}`} >
                <div class="chord-display-name">{name}</div>
                <div 
                    class="chord-display-notes" 
                    onMouseEnter={this.onHover.bind(this)}
                    onMouseLeave={this.onDrop.bind(this)}
                >
                {
                    (isInSemitones ? distancesFromRootInSemitones : notes).map(note => (
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