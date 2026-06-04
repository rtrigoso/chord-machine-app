import { expect, test, describe } from 'vitest';
import { signal } from '@preact/signals';
import { render, fireEvent } from '@testing-library/preact';
import { BalanceSelector } from './BalanceSelector';
import { BALANCE_MAP } from '@/constants/music';

describe('BalanceSelector', () => {
    test('renders a radio input for each balance option', () => {
        const selected = signal(BALANCE_MAP[3]);
        const { container } = render(<BalanceSelector selected={selected} />);
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios.length).toBe(BALANCE_MAP.length);
    });

    test('marks the correct radio as checked', () => {
        const selected = signal(BALANCE_MAP[3]);
        const { container } = render(<BalanceSelector selected={selected} />);
        const checked = container.querySelector('input[type="radio"]:checked') as HTMLInputElement;
        expect(parseInt(checked.value)).toBe(BALANCE_MAP[3].encoder);
    });

    test('updates the signal when a different option is selected', () => {
        const selected = signal(BALANCE_MAP[0]);
        const { container } = render(<BalanceSelector selected={selected} />);
        const target = BALANCE_MAP[5];
        const radio = container.querySelector(`input[value="${target.encoder}"]`) as HTMLInputElement;
        fireEvent.input(radio, { target: { value: String(target.encoder) } });
        expect(selected.value.encoder).toBe(target.encoder);
    });
});
