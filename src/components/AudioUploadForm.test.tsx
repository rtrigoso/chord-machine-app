import { expect, test, describe, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import { AudioUploadForm } from './AudioUploadForm';

describe('AudioUploadForm', () => {
    test('renders a file input and a submit button', () => {
        const { getByRole } = render(<AudioUploadForm onAudioSubmission={vi.fn()} />);
        expect(getByRole('button', { name: 'Submit' })).toBeDefined();
        expect(getByRole('button', { name: 'Submit' })).toHaveProperty('disabled', true);
    });

    test('submit button is disabled when no file is selected', () => {
        const { getByRole } = render(<AudioUploadForm onAudioSubmission={vi.fn()} />);
        expect(getByRole('button', { name: 'Submit' })).toHaveProperty('disabled', true);
    });

    test('submit button is enabled after a file is selected', () => {
        const { getByRole } = render(<AudioUploadForm onAudioSubmission={vi.fn()} />);
        const input = getByRole('button', { name: 'Submit' }).closest('form')!.querySelector('input[type="file"]')!;
        const file = new File(['audio'], 'test.mp3', { type: 'audio/mpeg' });
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
        expect(getByRole('button', { name: 'Submit' })).toHaveProperty('disabled', false);
    });

    test('calls onAudioSubmission with the selected file on submit', () => {
        const onAudioSubmission = vi.fn();
        const { getByRole } = render(<AudioUploadForm onAudioSubmission={onAudioSubmission} />);
        const form = getByRole('button', { name: 'Submit' }).closest('form')!;
        const input = form.querySelector('input[type="file"]')!;
        const file = new File(['audio'], 'test.mp3', { type: 'audio/mpeg' });
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
        fireEvent.submit(form);
        expect(onAudioSubmission).toHaveBeenCalledWith(file);
    });
});
