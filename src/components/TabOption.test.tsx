import { expect, test, describe, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import TabOption from './TabOption';

describe('TabOption', () => {
    test('renders the label', () => {
        const { container } = render(
            <TabOption id="chords" label="chord translator" selected={false} onClick={() => {}} />
        );
        expect(container.textContent).toContain('chord translator');
    });

    test('applies selected style when selected', () => {
        const { container } = render(
            <TabOption id="chords" label="chord translator" selected={true} onClick={() => {}} />
        );
        expect(container.querySelector('.bg-elektron-secondary')).not.toBeNull();
    });

    test('applies unselected style when not selected', () => {
        const { container } = render(
            <TabOption id="chords" label="chord translator" selected={false} onClick={() => {}} />
        );
        expect(container.querySelector('.bg-elektron-primary')).not.toBeNull();
    });

    test('calls onClick when clicked', () => {
        const onClick = vi.fn();
        const { container } = render(
            <TabOption id="chords" label="chord translator" selected={false} onClick={onClick} />
        );
        fireEvent.click(container.querySelector('a')!);
        expect(onClick).toHaveBeenCalledOnce();
    });
});
