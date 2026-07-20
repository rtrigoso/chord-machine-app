import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import ProcessButton from './ProcessButton';

describe('ProcessButton', () => {
  it('renders a button when not loading', () => {
    render(<ProcessButton onProcessStart={vi.fn()} isLoading={false} />);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('calls onProcessStart when the button is clicked', () => {
    const onProcessStart = vi.fn();
    render(<ProcessButton onProcessStart={onProcessStart} isLoading={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onProcessStart).toHaveBeenCalledOnce();
  });

  it('shows processing text and no button when isLoading is true', () => {
    render(<ProcessButton onProcessStart={vi.fn()} isLoading={true} />);
    expect(screen.getByText('processing...')).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
