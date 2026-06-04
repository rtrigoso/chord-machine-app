import { expect, test, describe } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import LFOCalculator from './lfo-calculator';

describe('LFOCalculator', () => {
    test('renders the step count select', () => {
        const { container } = render(<LFOCalculator />);
        expect(container.querySelector('select#step-count')).not.toBeNull();
    });

    test('renders speed and multiplier labels', () => {
        const { container } = render(<LFOCalculator />);
        expect(container.textContent).toContain('Speed:');
        expect(container.textContent).toContain('Mult:');
    });

    test('updates displayed options when a new step value is selected', () => {
        const { container } = render(<LFOCalculator />);
        const select = container.querySelector('select#step-count') as HTMLSelectElement;
        fireEvent.input(select, { target: { value: '1024' } });
        expect(container.textContent).toContain('1');
        expect(container.textContent).toContain('2');
    });
});
