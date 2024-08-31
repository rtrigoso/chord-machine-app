import './app.css';
import { signal } from "@preact/signals";
import { ChordName, Note } from './constants/music';
import { NoteSelector } from './components/NoteSelector';
import { ChordDisplay } from './components/ChordDisplay';
import { ChordSelector } from './components/ChordSelector';

export function App() {
  const rootNote = signal<Note>("C");
  const chordName = signal<ChordName>("minor");

  return (
    <>
      <NoteSelector selected={rootNote} />
      <ChordSelector selected={chordName} />
      <ChordDisplay name={chordName} rootNote={rootNote} />
    </>
  )
}
