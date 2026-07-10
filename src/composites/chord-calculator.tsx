import { useSignal } from "@preact/signals";
import { CHORD_NAMES, Note, BALANCE_MAP, Balance } from '../constants/music';
import { NoteSelector } from '../components/NoteSelector';
import { ChordDisplay } from '../components/ChordDisplay';
import { BalanceSelector } from '../components/BalanceSelector';

export default function ChordCalculator() {
  const rootNote = useSignal<Note>("C");
  const balance = useSignal<Balance>(BALANCE_MAP[3]);

  return (
    <div class="flex flex-col m-2 gap-2 w-full">
      <p class="text-center text-yellow-600 border-b border-elektron-secondary pb-2">
        Translates chord names into individual notes for programming into an Elektron synthesizer like the Syntakt or Model:Cycles.
      </p>
      <NoteSelector selected={rootNote} />
      <BalanceSelector selected={balance} />
      <div>
        {CHORD_NAMES.map((name, index) => (
          <div key={name} class={index % 2 ? 'bg-elektron-primary m-1' : 'bg-elektron-secondary p-1'}>
            <ChordDisplay name={name} rootNote={rootNote} balance={balance} />
          </div>
        ))}
      </div>
    </div>
  )
}
