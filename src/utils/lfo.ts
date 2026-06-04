import { BASE, MULTIPLIER, SPEEDS } from "@/constants/music";

export function CalculateOptions(stepsValue: number) {
    let combinations = [];
    for (let spd of SPEEDS) {
        for (let mult of MULTIPLIER) {
            const calculatedSteps = BASE / (spd * mult);

            if (Math.abs(calculatedSteps - stepsValue) < 0.0001) {
                combinations.push({ spd, mult });
            }
        }
    }

    return combinations;
}