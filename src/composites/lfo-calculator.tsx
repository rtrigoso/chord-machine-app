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
        <div class="flex flex-col m-2 gap-2 lg:w-1/3 w-full">
            <div class="flex flex-col justify-center gap-1">
                <label for="step-count">
                    Repeat loop every
                    <select
                        name="step-count"
                        id="step-count"
                        class="rounded-md cursor-pointer border border-dashed border-white text-center p-1 mx-1"
                        onInput={selectOption}>
                        {optionKeys.map(key => (
                            <option key={key} value={key} class="decoration-wavy font-bold font-serif">
                                {STEP_LOOP_OPTIONS[key]}
                            </option>
                        ))}
                    </select>
                    step{stepsValue > 1 ? 's' : ''} using the following parameter values
                </label>
                <div class="flex flex-col justify-center gap-1">
                    <div class="flex justify-between">
                        <div>Speed:</div>
                        <div>Mult:</div>
                    </div>
                    {CalculateOptions(stepsValue).map(data => (
                        <div key={`${data.spd}-${data.mult}`} class="flex justify-between">
                            <div>{data.spd}</div>
                            <div>{data.mult}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
