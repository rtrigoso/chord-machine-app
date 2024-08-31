import { expect, test, describe } from 'vitest';
import { render } from '@testing-library/preact';
import { ChordDisplay } from './ChordDisplay';

describe('ChordDisplay', () => {
    test('renders a component', () => {
        const { container } = render(<ChordDisplay rootNote={"C"} name={"minor"} />);
        expect(container.textContent).toContain('CD#G')
    });
});