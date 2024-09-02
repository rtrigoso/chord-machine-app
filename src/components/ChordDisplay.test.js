import { expect, test, describe } from 'vitest';
import { signal } from "@preact/signals";
import { render } from '@testing-library/preact';
import { ChordDisplay } from './ChordDisplay';
import { BALANCE_MAP } from "@/constants/music";

describe('ChordDisplay', () => {
    test('renders a component', () => {
        const rootNote = signal("C");
        const balance = signal(BALANCE_MAP[3]);
        const { container } = render(<ChordDisplay rootNote={rootNote} name={"minor"} balance={balance}/>);
        expect(container.textContent).toContain('minorCD#G')
    });
});