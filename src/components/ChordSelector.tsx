import { ChordName, CHORD_NAMES } from "@/constants/music";
import { Component, Fragment } from "preact";

interface ChordSelectorProps {
    setChordName: (name: ChordName) => void
}

interface ChordSelectorState {
    selected: ChordName;
};

class ChordSelector extends Component<ChordSelectorProps, ChordSelectorState> {
    constructor() {
        super();

        this.state = {
            selected: CHORD_NAMES[0]
        };
    }

    #select (name: ChordName) {
        this.setState({ selected: name});
        this.props.setChordName(name);
    }

    render () {
        const { selected } = this.state;

        return (
            <div class="note-selector" >
                <label for="note-selection">

                </label>
                <select name="note-selection" class="note-selection">
                    {
                        CHORD_NAMES.map((name) => (
                            <Fragment key={name}>
                                <option
                                    selected={name === selected}
                                    onSelect={(): void => { this.#select(name); }}
                                    value={name}>
                                        {name}
                                </option>
                            </Fragment>
                        ))
                    }
                </select> 
            </div>
        );
    }
}

export { ChordSelector };