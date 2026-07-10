import { useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

const CHORDS = [
  { chord: "Octave", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷2", vco1_sub2: null, vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "Off or any" },
  { chord: "Root + 5th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷3", vco1_sub2: "÷6", vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-JI or off" },
  { chord: "Minor triad", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5", vco1_sub2: "÷6", vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-JI or 8-JI" },
  { chord: "Major triad", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET or 12-JI" },
  { chord: "Suspended 2nd", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷9 (2nd)", vco1_sub2: "÷3 (5th)", vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET or 12-JI" },
  { chord: "Suspended 4th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: null, vco1_sub2: "÷3 (5th)", vco2: "4th, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Diminished triad", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷11 (~49¢ flat dim5 approx)", vco1_sub2: null, vco2: "Min 3rd, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Augmented triad", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5 (3rd)", vco1_sub2: null, vco2: "Aug 5th, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Major 7th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "Major 7th, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Dominant 7th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "Minor 7th, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Minor 7th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷7 (~31¢ flat min7 approx)", vco1_sub2: "÷3 (5th)", vco2: "Minor 3rd, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Major 6th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "6th, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Minor 6th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷13 (~rough 6th approx)", vco1_sub2: "÷3 (5th)", vco2: "Minor 3rd, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Add9", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "9th, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Half-diminished 7th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷7 (~31¢ flat min7 approx)", vco1_sub2: "÷11 (~49¢ flat dim5 approx)", vco2: "Minor 3rd, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Diminished 7th", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷11 (~49¢ flat dim5 approx)", vco1_sub2: "÷13 (~rough dim7 approx)", vco2: "Minor 3rd, quantized", vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET" },
  { chord: "Harmonic 7th (JI color)", vco1: "Root pitch", vco1_muted: false, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷7 (~31¢ flat 7th)", vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-JI or 8-JI" },
  { chord: "Rootless power chord", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷3", vco1_sub2: null, vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "Off or any" },
  { chord: "Rootless major triad", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET or 12-JI" },
  { chord: "Rootless sus2", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷9 (2nd)", vco1_sub2: "÷3 (5th)", vco2: null, vco2_muted: false, vco2_sub1: null, vco2_sub2: null, quantize: "12-ET or 12-JI" },
  { chord: "Rootless major 7th", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "Same pitch as VCO1", vco2_muted: true, vco2_sub1: "÷15 (maj7)", vco2_sub2: null, quantize: "12-ET or 12-JI" },
  { chord: "Rootless add9", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "Same pitch as VCO1", vco2_muted: true, vco2_sub1: "÷9 (9th)", vco2_sub2: null, quantize: "12-ET or 12-JI" },
  { chord: "Rootless harmonic 7th (JI color)", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "Same pitch as VCO1", vco2_muted: true, vco2_sub1: "÷7 (blue 7th)", vco2_sub2: null, quantize: "12-JI or 8-JI" },
  { chord: "Rootless major 9th", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "Same pitch as VCO1", vco2_muted: true, vco2_sub1: "÷9 (9th)", vco2_sub2: "÷15 (maj7)", quantize: "12-ET or 12-JI" },
  { chord: "Rootless harmonic 9th (JI color)", vco1: "Root pitch", vco1_muted: true, vco1_sub1: "÷5 (3rd)", vco1_sub2: "÷3 (5th)", vco2: "Same pitch as VCO1", vco2_muted: true, vco2_sub1: "÷7 (blue 7th)", vco2_sub2: "÷9 (9th)", quantize: "12-JI or 8-JI" },
  { chord: "Full extended chord", vco1: "Tuned to a chord tone", vco1_muted: false, vco1_sub1: "Any ÷1–16", vco1_sub2: "Any ÷1–16", vco2: "Tuned to a different chord tone", vco2_muted: false, vco2_sub1: "Any ÷1–16", vco2_sub2: "Any ÷1–16", quantize: "Either" },
];

const ROWS: { label: string; key: keyof typeof CHORDS[0] }[] = [
  { label: "VCO1", key: "vco1" },
  { label: "VCO1 Muted", key: "vco1_muted" },
  { label: "VCO1 Sub1", key: "vco1_sub1" },
  { label: "VCO1 Sub2", key: "vco1_sub2" },
  { label: "VCO2", key: "vco2" },
  { label: "VCO2 Muted", key: "vco2_muted" },
  { label: "VCO2 Sub1", key: "vco2_sub1" },
  { label: "VCO2 Sub2", key: "vco2_sub2" },
  { label: "Quantize", key: "quantize" },
];

function formatValue(value: string | boolean | null): string {
  if (value === null) return "—";
  if (value === true) return "Yes";
  if (value === false) return "No";
  return value;
}

export default function SubharmonicChords() {
  const selected = useSignal(CHORDS[0].chord);

  function selectChord(evt: JSX.TargetedInputEvent<HTMLSelectElement>) {
    selected.value = evt.currentTarget.value;
  }

  const chord = CHORDS.find(c => c.chord === selected.value) ?? CHORDS[0];

  return (
    <div class="flex flex-col m-2 gap-2 w-full">
      <p class="text-center text-yellow-600 border-b border-elektron-secondary pb-2">
        Helps you create chords using the subharmonic oscillator settings on the Moog Subharmonicon.
      </p>
      <div class="flex flex-col justify-center gap-1 text-center">
        <label for="chord-select">
          Select a chord
          <br />
          <select
            name="chord-select"
            id="chord-select"
            class="cursor-pointer text-center p-1 mx-1 mt-2 max-w-fit"
            onInput={selectChord}
          >
            {CHORDS.map(c => (
              <option key={c.chord} value={c.chord}>
                {c.chord}
              </option>
            ))}
          </select>
        </label>

        <table class="border-separate mx-auto text-left mt-2">
          <thead>
            <tr>
              <th class="text-yellow-600">Setting</th>
              <th class="text-yellow-600">Value</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.key} class={i % 2 ? 'bg-elektron-primary' : 'bg-elektron-secondary'}>
                <td class="px-2 py-1">{row.label}</td>
                <td class="px-2 py-1">{formatValue(chord[row.key] as string | boolean | null)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
