import { Balance } from "@/constants/music";
import { JSX } from "preact/jsx-runtime";
import { Person } from "./Person";

interface BalanceOptionProps {
    balance: Balance;
    checked: boolean;
    onSelect: (evt: JSX.TargetedEvent<HTMLInputElement>) => void;
}

export function BalanceOption({ balance, checked, onSelect }: BalanceOptionProps) {
    return (
        <div class="flex flex-row items-center">
            <input
                type="radio"
                checked={checked}
                id={`encoder-${balance.encoder}`}
                name="balance-selection"
                value={balance.encoder}
                onInput={onSelect}
            />
            <label class="flex flex-row" for={`encoder-${balance.encoder}`}>
                {
                    balance.value.map((isActive, i) => (
                        <Person key={i} active={isActive} level={balance.noteOctaves[i]} />
                    ))
                }
            </label>
        </div>
    );
}
