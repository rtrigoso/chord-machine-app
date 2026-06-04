import RootBalanceOn from '@assets/root-balance-on.svg';
import RootBalanceOff from '@assets/root-balance-off.svg';
import OverBalanceOn from '@assets/over-balance-on.svg';
import OverBalanceOff from '@assets/over-balance-off.svg';
import UnderBalanceOn from '@assets/under-balance-on.svg';
import UnderBalanceOff from '@assets/under-balance-off.svg';

interface SrcMap {
    [key: string]: string
}

const srcMap: SrcMap = {
    'RootBalanceOn': RootBalanceOn,
    'RootBalanceOff': RootBalanceOff,
    'OverBalanceOn': OverBalanceOn,
    'OverBalanceOff': OverBalanceOff,
    'UnderBalanceOn': UnderBalanceOn,
    'UnderBalanceOff': UnderBalanceOff,
};

interface PersonProps {
    active?: boolean;
    level?: number;
}

const octaveLabel: Record<number, string> = {
    [-1]: 'octave 0',
    [0]:  'octave 1 (middle)',
    [1]:  'octave 2',
};

export function Person({ active = true, level = 0 }: PersonProps = {}) {
    const suffix = active ? 'On' : 'Off';
    let prefix = 'Root';
    switch (level) {
        case -1: prefix = 'Under'; break;
        case 1:  prefix = 'Over';  break;
    }
    const alt = `${octaveLabel[level] ?? `octave level ${level}`}, ${active ? 'active' : 'inactive'}`;
    return <img src={srcMap[`${prefix}Balance${suffix}`]} class="person-icon" alt={alt} />;
}
