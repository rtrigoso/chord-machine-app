import './BalanceSelector.css';
import { Balance, BALANCE_MAP } from "@/constants/music";
import { Signal } from "@preact/signals";
import { Fragment } from "preact";
import { JSX } from "preact/jsx-runtime";
import { toInteger } from 'lodash';
import { BalanceOption } from "./BalanceOption";

interface BalanceSelectorProps {
    selected: Signal<Balance>;
}

function BalanceSelector({ selected }: BalanceSelectorProps) {
    function select(evt: JSX.TargetedEvent<HTMLInputElement>) {
        const match = BALANCE_MAP.find(balance => balance.encoder === toInteger(evt.currentTarget.value));
        if (!match) return;
        selected.value = match;
    }

    return (
        <div class="flex flex-wrap gap-1 justify-center">
            {
                BALANCE_MAP.map((balance) => (
                    <Fragment key={balance.encoder}>
                        <BalanceOption
                            balance={balance}
                            checked={selected.value.encoder === balance.encoder}
                            onSelect={select}
                        />
                    </Fragment>
                ))
            }
        </div>
    );
}

export { BalanceSelector };
