import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTimeoutPromise, requestAudioStream } from './mediaDevices';

describe('createTimeoutPromise', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    test('rejects with a timeout error after the specified duration', async () => {
        const [promise] = createTimeoutPromise(1000);
        vi.advanceTimersByTime(1000);
        await expect(promise).rejects.toThrow('Audio permission request timed out');
    });

    test('does not reject before the specified duration', async () => {
        const [promise, timer] = createTimeoutPromise(1000);
        vi.advanceTimersByTime(999);
        const result = await Promise.race([promise.catch(() => 'rejected'), Promise.resolve('pending')]);
        expect(result).toBe('pending');
        clearTimeout(timer);
    });
});

describe('requestAudioStream', () => {
    const mockGetUserMedia = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
        Object.defineProperty(navigator, 'mediaDevices', {
            value: { getUserMedia: mockGetUserMedia },
            configurable: true,
        });
        mockGetUserMedia.mockReset();
    });

    afterEach(() => vi.useRealTimers());

    test('resolves with the media stream when permissions are granted', async () => {
        const mockStream = {} as MediaStream;
        mockGetUserMedia.mockResolvedValue(mockStream);
        await expect(requestAudioStream()).resolves.toBe(mockStream);
    });

    test('rejects when permissions are denied', async () => {
        mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));
        await expect(requestAudioStream()).rejects.toThrow('Permission denied');
    });

    test('rejects with a timeout error when the request exceeds the timeout', async () => {
        mockGetUserMedia.mockReturnValue(new Promise(() => {}));
        const promise = requestAudioStream(1000);
        vi.advanceTimersByTime(1000);
        await expect(promise).rejects.toThrow('Audio permission request timed out');
    });

    test('clears the timeout when the stream resolves', async () => {
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
        mockGetUserMedia.mockResolvedValue({} as MediaStream);
        await requestAudioStream();
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});
