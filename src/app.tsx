import './app.css';
import { signal } from "@preact/signals";
import { CHORD_NAMES, Note, BALANCE_MAP, Balance } from './constants/music';
import { NoteSelector } from './components/NoteSelector';
import { ChordDisplay } from './components/ChordDisplay';
import { Fragment } from 'preact/jsx-runtime';
import { BalanceSelector } from './components/BalanceSelector';

export function App() {
  const rootNote = signal<Note>("C");
  const balance = signal<Balance>(BALANCE_MAP[3]);

  return (
    <>
      <NoteSelector selected={rootNote} />
      <BalanceSelector selected={balance} />
      <div class="chords">
      {
        CHORD_NAMES.map((name) => (
          <Fragment key={name}>
              <ChordDisplay name={name} rootNote={rootNote} balance={balance}/>
          </Fragment>
        ))
      }
      </div>
    </>
  )
}
