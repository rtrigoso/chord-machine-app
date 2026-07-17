import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/preact';
import { AudioRecordingForm } from './AudioRecordingForm';
import * as mediaDevices from '@/utils/mediaDevices';

vi.mock('@/utils/mediaDevices');

describe('AudioRecordingForm', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.mocked(mediaDevices.requestAudioStream).mockReset();
    });

    afterEach(() => vi.useRealTimers());

    test('renders a disabled record button while waiting for permissions', () => {
        vi.mocked(mediaDevices.requestAudioStream).mockReturnValue(new Promise(() => {}));
        const { getByRole } = render(
            <AudioRecordingForm onAudioInputSelected={vi.fn()} onRecordingStart={vi.fn()} onRecordingStop={vi.fn()} />
        );
        expect(getByRole('button', { name: 'Record' })).toHaveProperty('disabled', true);
    });

    test('enables the record button and calls onAudioInputSelected when permissions are granted', async () => {
        const mockStream = {} as MediaStream;
        vi.mocked(mediaDevices.requestAudioStream).mockResolvedValue(mockStream);
        const onAudioInputSelected = vi.fn();
        const { getByRole } = render(
            <AudioRecordingForm onAudioInputSelected={onAudioInputSelected} onRecordingStart={vi.fn()} onRecordingStop={vi.fn()} />
        );
        await act(async () => {
            await Promise.resolve();
        });
        expect(getByRole('button', { name: 'Record' })).toHaveProperty('disabled', false);
        expect(onAudioInputSelected).toHaveBeenCalledWith(mockStream);
    });

    test('shows error message when permissions are denied', async () => {
        vi.mocked(mediaDevices.requestAudioStream).mockRejectedValue(new Error('Permission denied'));
        const { getByText } = render(
            <AudioRecordingForm onAudioInputSelected={vi.fn()} onRecordingStart={vi.fn()} onRecordingStop={vi.fn()} />
        );
        await act(async () => {
            await Promise.resolve();
        });
        expect(getByText('user audio device permissions are required for recording')).toBeDefined();
    });

    test('calls onRecordingStart when the record button is clicked', async () => {
        vi.mocked(mediaDevices.requestAudioStream).mockResolvedValue({} as MediaStream);
        const onRecordingStart = vi.fn();
        const { getByRole } = render(
            <AudioRecordingForm onAudioInputSelected={vi.fn()} onRecordingStart={onRecordingStart} onRecordingStop={vi.fn()} />
        );
        await act(async () => { await Promise.resolve(); });
        fireEvent.click(getByRole('button', { name: 'Record' }));
        expect(onRecordingStart).toHaveBeenCalled();
    });

    test('calls onRecordingStop 5 seconds after recording starts', async () => {
        vi.mocked(mediaDevices.requestAudioStream).mockResolvedValue({} as MediaStream);
        const onRecordingStop = vi.fn();
        const { getByRole } = render(
            <AudioRecordingForm onAudioInputSelected={vi.fn()} onRecordingStart={vi.fn()} onRecordingStop={onRecordingStop} />
        );
        await act(async () => { await Promise.resolve(); });
        fireEvent.click(getByRole('button', { name: 'Record' }));
        expect(onRecordingStop).not.toHaveBeenCalled();
        await act(async () => { vi.advanceTimersByTime(5000); });
        expect(onRecordingStop).toHaveBeenCalled();
    });
});
