import './app.css';
import { signal } from "@preact/signals";
import { CHORD_NAMES, Note } from './constants/music';
import { NoteSelector } from './components/NoteSelector';
import { ChordDisplay } from './components/ChordDisplay';
import { Fragment } from 'preact/jsx-runtime';

export function App() {
  const rootNote = signal<Note>("C");

  return (
    <>
      <NoteSelector selected={rootNote} />
      <div class="chords">
      {
        CHORD_NAMES.map((name) => (
          <Fragment key={name}>
              <ChordDisplay name={name} rootNote={rootNote} />
          </Fragment>
        ))
      }
      </div>
    </>
  )
}
