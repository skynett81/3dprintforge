import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './toast';

function Fire() {
  const toast = useToast();
  return <button onClick={() => toast('Saved', 'success')}>fire</button>;
}

describe('ToastProvider', () => {
  it('shows a toast when useToast is called, and dismisses on click', () => {
    render(<ToastProvider><Fire /></ToastProvider>);
    expect(screen.queryByText('Saved')).toBeNull();
    fireEvent.click(screen.getByText('fire'));
    const toast = screen.getByText('Saved');
    expect(toast).toBeInTheDocument();
    fireEvent.click(toast);
    expect(screen.queryByText('Saved')).toBeNull();
  });
});
