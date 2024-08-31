import { expect, test, describe } from 'vitest';
import { render } from '@testing-library/preact';
import { ChordSelector } from './ChordSelector';

describe('ChordSelector', () => {
    test('renders a component', () => {
        const dummyCallback = () => {};
        const { container } = render(<ChordSelector setNote={dummyCallback}/>);
        expect(container.textContent).toContain('minor');
    });
});