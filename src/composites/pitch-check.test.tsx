import { expect, test, describe, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import PitchCheck from './pitch-check';

vi.mock('@/components/AudioUploadForm', () => ({
    AudioUploadForm: () => <div data-testid="audio-upload-form" />,
}));

vi.mock('@/components/AudioRecordingForm', () => ({
    AudioRecordingForm: () => <div data-testid="audio-recording-form" />,
}));

describe('PitchCheck', () => {
    test('shows the upload form by default', () => {
        const { getByTestId, queryByTestId } = render(<PitchCheck />);
        expect(getByTestId('audio-upload-form')).toBeDefined();
        expect(queryByTestId('audio-recording-form')).toBeNull();
    });

    test('shows the record form when the record option is selected', () => {
        const { getByLabelText, getByTestId, queryByTestId } = render(<PitchCheck />);
        fireEvent.click(getByLabelText('Record'));
        expect(getByTestId('audio-recording-form')).toBeDefined();
        expect(queryByTestId('audio-upload-form')).toBeNull();
    });

    test('shows the upload form again when switching back to upload', () => {
        const { getByLabelText, getByTestId, queryByTestId } = render(<PitchCheck />);
        fireEvent.click(getByLabelText('Record'));
        fireEvent.click(getByLabelText('Upload'));
        expect(getByTestId('audio-upload-form')).toBeDefined();
        expect(queryByTestId('audio-recording-form')).toBeNull();
    });

    test('upload radio is checked by default', () => {
        const { getByLabelText } = render(<PitchCheck />);
        expect((getByLabelText('Upload') as HTMLInputElement).checked).toBe(true);
        expect((getByLabelText('Record') as HTMLInputElement).checked).toBe(false);
    });

    test('record radio is checked after selecting record', () => {
        const { getByLabelText } = render(<PitchCheck />);
        fireEvent.click(getByLabelText('Record'));
        expect((getByLabelText('Record') as HTMLInputElement).checked).toBe(true);
        expect((getByLabelText('Upload') as HTMLInputElement).checked).toBe(false);
    });
});
