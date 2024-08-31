import './app.css';
import { useState } from 'preact/hooks';
import { Note } from './constants/music';
import { NoteSelector } from './components/NoteSelector';
import { ChordDisplay } from './components/ChordDisplay';

export function App() {
  const [note, setNote] = useState<Note>("C");

  return (
    <>
      <NoteSelector setNote={setNote}/>
      <ChordDisplay name='minor' rootNote={note} />
    </>
  )
}
