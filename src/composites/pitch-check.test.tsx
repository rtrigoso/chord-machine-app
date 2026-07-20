import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render, fireEvent, act, waitFor } from '@testing-library/preact';
import PitchCheck from './pitch-check';
import { AudioUploadForm } from '@/components/AudioUploadForm';
import ProcessButton from '@/components/ProcessButton';
import * as audioUtils from '@utils/audio';

vi.mock('@/components/AudioUploadForm');
vi.mock('@/components/AudioRecordingForm', () => ({
    AudioRecordingForm: () => <div data-testid="audio-recording-form" />,
}));
vi.mock('@/components/AudioPreview', () => ({
    AudioPreview: () => <div data-testid="audio-preview" />,
}));
vi.mock('@/components/ProcessButton');
vi.mock('@utils/audio');

beforeEach(() => {
    vi.mocked(AudioUploadForm).mockImplementation(
        ({ onAudioSubmission }) => <div data-testid="audio-upload-form" data-on-submit={onAudioSubmission} />
    );
    vi.mocked(ProcessButton).mockImplementation(
        ({ onProcessStart }) => <button data-testid="process-button" onClick={onProcessStart} />
    );
    vi.mocked(audioUtils.getPlayback).mockReturnValue(vi.fn());
});

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

describe('PitchCheck sampleRate', () => {
    test('does not show sample rate before a file is submitted', () => {
        const { queryByText } = render(<PitchCheck />);
        expect(queryByText(/Sample rate/)).toBeNull();
    });

    test('shows the sample rate after a file is submitted', async () => {
        let capturedOnAudioSubmission!: (file: File) => void;
        vi.mocked(AudioUploadForm).mockImplementation(({ onAudioSubmission }) => {
            capturedOnAudioSubmission = onAudioSubmission;
            return <div data-testid="audio-upload-form" />;
        });

        vi.mocked(audioUtils.fileToArrayBuffer).mockResolvedValue(new ArrayBuffer(8));
        vi.mocked(audioUtils.decodeAudioBuffer).mockResolvedValue({ sampleRate: 44100 } as AudioBuffer);

        const { getByText } = render(<PitchCheck />);

        await act(async () => { await capturedOnAudioSubmission(new File([], 'test.mp3')); });

        await waitFor(() => expect(getByText('Sample rate: 44100 Hz')).toBeDefined());
    });

    test('updates the sample rate when a new file is submitted', async () => {
        let capturedOnAudioSubmission!: (file: File) => void;
        vi.mocked(AudioUploadForm).mockImplementation(({ onAudioSubmission }) => {
            capturedOnAudioSubmission = onAudioSubmission;
            return <div data-testid="audio-upload-form" />;
        });

        vi.mocked(audioUtils.fileToArrayBuffer).mockResolvedValue(new ArrayBuffer(8));
        vi.mocked(audioUtils.decodeAudioBuffer)
            .mockResolvedValueOnce({ sampleRate: 44100 } as AudioBuffer)
            .mockResolvedValueOnce({ sampleRate: 48000 } as AudioBuffer);

        const { getByText } = render(<PitchCheck />);

        await act(async () => { await capturedOnAudioSubmission(new File([], 'first.mp3')); });
        await waitFor(() => expect(getByText('Sample rate: 44100 Hz')).toBeDefined());

        await act(async () => { await capturedOnAudioSubmission(new File([], 'second.mp3')); });
        await waitFor(() => expect(getByText('Sample rate: 48000 Hz')).toBeDefined());
    });
});

describe('PitchCheck ProcessButton', () => {
    function setupWithSubmit() {
        let capturedOnAudioSubmission!: (file: File) => void;
        vi.mocked(AudioUploadForm).mockImplementation(({ onAudioSubmission }) => {
            capturedOnAudioSubmission = onAudioSubmission;
            return <div data-testid="audio-upload-form" />;
        });
        vi.mocked(audioUtils.fileToArrayBuffer).mockResolvedValue(new ArrayBuffer(8));
        vi.mocked(audioUtils.decodeAudioBuffer).mockResolvedValue({ sampleRate: 44100 } as AudioBuffer);
        return { capturedOnAudioSubmission: () => capturedOnAudioSubmission };
    }

    test('is not shown before audio is submitted', () => {
        const { queryByTestId } = render(<PitchCheck />);
        expect(queryByTestId('process-button')).toBeNull();
    });

    test('is shown after audio is submitted', async () => {
        const { capturedOnAudioSubmission } = setupWithSubmit();
        const { queryByTestId } = render(<PitchCheck />);

        await act(async () => { await capturedOnAudioSubmission()(new File([], 'test.mp3')); });

        await waitFor(() => expect(queryByTestId('process-button')).toBeDefined());
    });

    test('is hidden after clicking it', async () => {
        const { capturedOnAudioSubmission } = setupWithSubmit();
        const { queryByTestId, getByTestId } = render(<PitchCheck />);

        await act(async () => { await capturedOnAudioSubmission()(new File([], 'test.mp3')); });
        await waitFor(() => expect(queryByTestId('process-button')).toBeDefined());

        fireEvent.click(getByTestId('process-button'));

        await waitFor(() => expect(queryByTestId('process-button')).toBeNull());
    });

    test('reappears after a new audio file is submitted', async () => {
        const { capturedOnAudioSubmission } = setupWithSubmit();
        const { queryByTestId, getByTestId } = render(<PitchCheck />);

        await act(async () => { await capturedOnAudioSubmission()(new File([], 'first.mp3')); });
        await waitFor(() => expect(queryByTestId('process-button')).toBeDefined());

        fireEvent.click(getByTestId('process-button'));
        await waitFor(() => expect(queryByTestId('process-button')).toBeNull());

        await act(async () => { await capturedOnAudioSubmission()(new File([], 'second.mp3')); });
        await waitFor(() => expect(queryByTestId('process-button')).toBeDefined());
    });
});
