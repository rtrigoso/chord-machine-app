import './BalanceSelector.css';
import RootBalanceOn from '@assets/root-balance-on.svg';
import RootBalanceOff from '@assets/root-balance-off.svg';
import OverBalanceOn from '@assets/over-balance-on.svg';
import OverBalanceOff from '@assets/over-balance-off.svg';
import UnderBalanceOn from '@assets/under-balance-on.svg';
import UnderBalanceOff from '@assets/under-balance-off.svg';
import { Balance, BALANCE_MAP } from "@/constants/music";
import { Signal } from "@preact/signals";
import { Component, Fragment } from "preact";
import { get, toInteger } from 'lodash';

interface SrcMap {
    [key: string]: string
}

function Person ({ active = true, level = 0 } = {}) {
    let suffix = active ? 'On': 'Off';
    let prefix = 'Root';
    switch (level) {
        case -1:
            prefix = 'Under';
            break;
        case 1:
            prefix = 'Over';
            break;
    }

    const srcMap:SrcMap = {
        'RootBalanceOn': RootBalanceOn,
        'RootBalanceOff': RootBalanceOff,
        'OverBalanceOn': OverBalanceOn,
        'OverBalanceOff': OverBalanceOff,
        'UnderBalanceOn': UnderBalanceOn,
        'UnderBalanceOff': UnderBalanceOff,
    };

    const key = `${prefix}Balance${suffix}`;
    
    return <img src={srcMap[key]} class="person-icon" />;
};

interface BalanceSelectorProps {
    selected: Signal<Balance>;
}

class BalanceSelector extends Component<BalanceSelectorProps> {
    constructor(props: BalanceSelectorProps) {
        super(props);
    }

    select (evt: Event) {
        const encoder = get(evt, 'target.value', this.props.selected.value.encoder);
        const selected = BALANCE_MAP.find(balance => balance.encoder === toInteger(encoder));
        if (!selected) return;

        this.props.selected.value = selected;
    }

    render () {
        const { props, select } = this;
        const { selected } = props;

        return (
            <div class="balance-selector" >
                <label for="balance-selection">
                    Balance:
                </label>
                <div class="balance-options">
                    {
                        BALANCE_MAP.map((balance) => (
                            <Fragment key={balance.encoder}>
                                <div>
                                    <input 
                                        type="radio"
                                        checked={selected.value.encoder === balance.encoder}
                                        id={`encoder-${balance.encoder}`}
                                        name="balance-selection"
                                        value={balance.encoder} 
                                        onInput={select.bind(this)}
                                    /><label 
                                        for={`encoder-${balance.encoder}`}
                                    >
                                        {
                                        balance.value.map((isActive, i) => (
                                            <Person active={isActive} level={balance.noteOctaves[i]} />
                                        ))
                                        }
                                    </label>
                                </div>
                            </Fragment>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export { BalanceSelector };