import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import { AudioInputModeSelector } from './AudioInputModeSelector';

describe('AudioInputModeSelector', () => {
    it('renders upload and record radio buttons', () => {
        const { getByRole } = render(
            <AudioInputModeSelector onUploadSelected={vi.fn()} onRecordSelected={vi.fn()} />
        );
        expect(getByRole('radio', { name: 'Upload' })).toBeDefined();
        expect(getByRole('radio', { name: 'Record' })).toBeDefined();
    });

    it('calls onUploadSelected when the upload radio is changed', () => {
        const onUploadSelected = vi.fn();
        const { getByRole } = render(
            <AudioInputModeSelector onUploadSelected={onUploadSelected} onRecordSelected={vi.fn()} />
        );
        fireEvent.change(getByRole('radio', { name: 'Upload' }));
        expect(onUploadSelected).toHaveBeenCalled();
    });

    it('calls onRecordSelected when the record radio is changed', () => {
        const onRecordSelected = vi.fn();
        const { getByRole } = render(
            <AudioInputModeSelector onUploadSelected={vi.fn()} onRecordSelected={onRecordSelected} />
        );
        fireEvent.change(getByRole('radio', { name: 'Record' }));
        expect(onRecordSelected).toHaveBeenCalled();
    });

    it('does not call onRecordSelected when the upload radio is changed', () => {
        const onRecordSelected = vi.fn();
        const { getByRole } = render(
            <AudioInputModeSelector onUploadSelected={vi.fn()} onRecordSelected={onRecordSelected} />
        );
        fireEvent.change(getByRole('radio', { name: 'Upload' }));
        expect(onRecordSelected).not.toHaveBeenCalled();
    });

    it('does not call onUploadSelected when the record radio is changed', () => {
        const onUploadSelected = vi.fn();
        const { getByRole } = render(
            <AudioInputModeSelector onUploadSelected={onUploadSelected} onRecordSelected={vi.fn()} />
        );
        fireEvent.change(getByRole('radio', { name: 'Record' }));
        expect(onUploadSelected).not.toHaveBeenCalled();
    });

    it('checks the upload radio when selected is "upload"', () => {
        const { getByRole } = render(
            <AudioInputModeSelector selected="upload" onUploadSelected={vi.fn()} onRecordSelected={vi.fn()} />
        );
        expect((getByRole('radio', { name: 'Upload' }) as HTMLInputElement).checked).toBe(true);
        expect((getByRole('radio', { name: 'Record' }) as HTMLInputElement).checked).toBe(false);
    });

    it('checks the record radio when selected is "record"', () => {
        const { getByRole } = render(
            <AudioInputModeSelector selected="record" onUploadSelected={vi.fn()} onRecordSelected={vi.fn()} />
        );
        expect((getByRole('radio', { name: 'Record' }) as HTMLInputElement).checked).toBe(true);
        expect((getByRole('radio', { name: 'Upload' }) as HTMLInputElement).checked).toBe(false);
    });

    it('checks no radio when selected is omitted', () => {
        const { getByRole } = render(
            <AudioInputModeSelector onUploadSelected={vi.fn()} onRecordSelected={vi.fn()} />
        );
        expect((getByRole('radio', { name: 'Upload' }) as HTMLInputElement).checked).toBe(false);
        expect((getByRole('radio', { name: 'Record' }) as HTMLInputElement).checked).toBe(false);
    });
});
