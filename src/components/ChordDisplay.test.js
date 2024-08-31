import { expect, test, describe } from 'vitest';
import { signal } from "@preact/signals";
import { render } from '@testing-library/preact';
import { ChordDisplay } from './ChordDisplay';

describe('ChordDisplay', () => {
    test('renders a component', () => {
        const rootNote = signal("C");
        const { container } = render(<ChordDisplay rootNote={rootNote} name={"minor"} />);
        expect(container.textContent).toContain('minorCD#G')
    });
});