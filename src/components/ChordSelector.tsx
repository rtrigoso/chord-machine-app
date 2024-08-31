import { ChordName, CHORD_NAMES } from "@/constants/music";
import { Signal } from "@preact/signals";
import { Component, Fragment } from "preact";
import { get } from 'lodash';

interface ChordSelectorProps {
    selected: Signal<ChordName>;
}


class ChordSelector extends Component<ChordSelectorProps> {
    constructor(props: ChordSelectorProps) {
        super(props);
    }

    select (evt: Event) {
        const name: ChordName = get(evt, 'target.value', this.props.selected.value);
        this.props.selected.value = name
    }

    render () {
        const { props, select } = this;
        const { selected } = props;

        return (
            <div class="note-selector" >
                <label for="note-selection">
                    Select Chord
                </label>
                <select
                    name="note-selection"
                    onInput={select.bind(this)}
                    class="note-selection">
                    {
                        CHORD_NAMES.map((name) => (
                            <Fragment key={name}>
                                <option
                                    selected={name === selected.value}
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