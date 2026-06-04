import { useSignal } from "@preact/signals";
import { CHORD_NAMES, Note, BALANCE_MAP, Balance } from '../constants/music';
import { NoteSelector } from '../components/NoteSelector';
import { ChordDisplay } from '../components/ChordDisplay';
import { Fragment } from 'preact/jsx-runtime';
import { BalanceSelector } from '../components/BalanceSelector';

export default function ChordCalculator() {
  const rootNote = useSignal<Note>("C");
  const balance = useSignal<Balance>(BALANCE_MAP[3]);

  return (
    <div class="flex flex-col m-2 gap-2 lg:w-1/3 w-full">
      <NoteSelector selected={rootNote} />
      <BalanceSelector selected={balance} />
      <div>
      {
        CHORD_NAMES.map((name, index) => (
          <Fragment key={name}>
            <div class={index % 2 ? 'bg-elektron-primary m-1' : 'bg-elektron-secondary p-1'}>
              <ChordDisplay name={name} rootNote={rootNote} balance={balance} />
            </div>
          </Fragment>
        ))
      }
      </div>
    </div>
  )
}
