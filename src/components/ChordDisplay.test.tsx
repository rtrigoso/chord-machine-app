import { expect, test, describe } from 'vitest';
import { signal } from "@preact/signals";
import { render } from '@testing-library/preact';
import { ChordDisplay } from './ChordDisplay';
import { BALANCE_MAP, Note, Balance } from "@/constants/music";

describe('ChordDisplay', () => {
    test('renders a component', () => {
        const rootNote = signal<Note>("C");
        const balance = signal<Balance>(BALANCE_MAP[3]);
        const { container } = render(<ChordDisplay rootNote={rootNote} name={"minor"} balance={balance}/>);
        expect(container.textContent).toContain('minorC/0D#/3G/7')
    });
});
