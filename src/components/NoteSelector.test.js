import { expect, test, describe } from 'vitest';
import { render } from '@testing-library/preact';
import { NoteSelector } from './NoteSelector';

describe('NoteSelector', () => {
    test('renders a component', () => {
        const dummyCallback = () => {};
        const { container } = render(<NoteSelector setNote={dummyCallback}/>);
        expect(container.textContent).toContain('C')
    });
});