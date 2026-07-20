import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { AudioPreview } from './AudioPreview';

describe('AudioPreview', () => {
    it('renders the play button', () => {
        render(<AudioPreview onPlay={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Play' })).toBeDefined();
    });

    it('calls onPlay when the play button is clicked', () => {
        const onPlay = vi.fn();
        render(<AudioPreview onPlay={onPlay} />);
        fireEvent.click(screen.getByRole('button', { name: 'Play' }));
        expect(onPlay).toHaveBeenCalledOnce();
    });

    it('does not show duration when audioBuffer is not provided', () => {
        render(<AudioPreview onPlay={vi.fn()} />);
        expect(screen.queryByText(/s$/)).toBeNull();
    });

    it('shows the total duration when audioBuffer is provided', () => {
        const audioBuffer = { duration: 3.756 } as AudioBuffer;
        render(<AudioPreview onPlay={vi.fn()} audioBuffer={audioBuffer} />);
        expect(screen.getByText('3.8s')).toBeDefined();
    });
});
