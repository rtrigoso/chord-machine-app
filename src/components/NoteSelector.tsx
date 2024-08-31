import './NoteSelector.css';
import { Note, NOTES } from "@/constants/music";
import { Signal } from "@preact/signals";
import { Component, Fragment } from "preact";
import { get } from 'lodash';

interface NoteSelectorProps {
    selected: Signal<Note>;
}

class NoteSelector extends Component<NoteSelectorProps> {
    constructor(props: NoteSelectorProps) {
        super(props);
    }

    select (evt: Event) {
        const note = get(evt, 'target.value', this.props.selected.value);
        this.props.selected.value = note
    }

    render () {
        const { props, select } = this;
        const { selected } = props;

        return (
            <div class="note-selector" >
                <label for="note-selection">
                    Select Root Note:
                </label>
                <select
                    name="note-selection"
                    onInput={select.bind(this)}
                    class="note-selection">
                    {
                        NOTES.map((note) => (
                            <Fragment key={note}>
                                <option
                                    selected={note === selected.value}
                                    value={note}>
                                        {note}
                                </option>
                            </Fragment>
                        ))
                    }
                </select> 
            </div>
        );
    }
}

export { NoteSelector };