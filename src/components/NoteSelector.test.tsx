import { expect, test, describe } from 'vitest';
import { signal } from "@preact/signals";
import { render } from '@testing-library/preact';
import { NoteSelector } from './NoteSelector';
import { Note } from "@/constants/music";

describe('NoteSelector', () => {
    test('renders a component', () => {
        const rootNote = signal<Note>("C");
        const { container } = render(<NoteSelector selected={rootNote}/>);
        expect(container.textContent).toContain('C')
    });
});
