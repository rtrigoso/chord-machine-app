import { useSignal } from "@preact/signals";
import { STEP_LOOP_OPTIONS } from "@/constants/music";
import { CalculateOptions } from "@/utils/lfo";
import { JSX } from "preact/jsx-runtime";

const optionKeys = Object.keys(STEP_LOOP_OPTIONS);

export default function LFOCalculator() {
    const selected = useSignal(optionKeys[0]);

    function selectOption(evt: JSX.TargetedInputEvent<HTMLSelectElement>) {
        selected.value = evt.currentTarget.value;
    }

    const stepsValue = parseFloat(selected.value);

    return (
        <div class="flex flex-col m-2 gap-2 w-full">
            <div class="flex flex-col justify-center gap-1 text-center">
                <p class="text-yellow-600 border-b border-elektron-secondary pb-2">
          Find the Speed and Mult values to sync an LFO to a specific number of steps on an Elektron synthesizer like the Syntakt or Model:Cycles.
        </p>
        <label for="step-count">
                    Repeat loop every
                    <br/>
                    <select
                        name="step-count"
                        id="step-count"
                        class="cursor-pointer text-center p-1 mx-1 max-w-fit"
                        onInput={selectOption}>
                        {optionKeys.map(key => (
                            <option key={key} value={key} class="decoration-wavy font-bold font-mono">
                                {STEP_LOOP_OPTIONS[key]}
                            </option>
                        ))}
                    </select>
                    <br/>
                    step{stepsValue > 1 ? 's' : ''} using the following parameter values
                </label>
                <table id="lfo_args_table" class="border-separate border-spacing-x-4 mx-auto text-center">
                    <thead>
                        <tr>
                            <th>Speed</th>
                            <th>Mult</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CalculateOptions(stepsValue).map(data => (
                            <tr key={`${data.spd}-${data.mult}`}>
                                <td class="text-center">{data.spd}</td>
                                <td class="text-center">{data.mult}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
