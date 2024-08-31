import { Note, NOTES } from "@/constants/music";
import { Component, Fragment } from "preact";

interface NoteSelectorProps {
    setNote: (note: Note) => void
}

interface NoteSelectorState {
    selected: Note;
};

class NoteSelector extends Component<NoteSelectorProps, NoteSelectorState> {
    constructor() {
        super();

        this.state = {
            selected: "C"
        };
    }

    #select (note: Note) {
        this.props.setNote(note);
        return note;
    }

    render () {
        const { selected } = this.state;

        return (
            <div class="note-selector" >
                <label for="note-selection">

                </label>
                <select name="note-selection" class="note-selection">
                    {
                        NOTES.map((note) => (
                            <Fragment key={note}>
                                <option
                                    selected={note === selected}
                                    onSelect={(): void => { this.#select(note); }}
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