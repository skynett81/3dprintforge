import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../toast';
import { SchedulerPanel } from './SchedulerPanel';

afterEach(() => vi.restoreAllMocks());

describe('SchedulerPanel', () => {
  it('schedules a print via POST /api/scheduler with an ISO datetime', async () => {
    const fetchMock = vi.fn((url: string, opts?: RequestInit) =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(opts?.method === 'POST' ? { ok: true, id: 1 } : []) } as Response));
    vi.stubGlobal('fetch', fetchMock);

    render(<ToastProvider><SchedulerPanel /></ToastProvider>);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    fireEvent.click(screen.getByText('+ Schedule print'));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Batch A' } });
    fireEvent.change(screen.getByLabelText('File'), { target: { value: 'a.3mf' } });
    fireEvent.change(screen.getByLabelText('When'), { target: { value: '2026-08-01T09:30' } });
    fireEvent.click(screen.getByText('Schedule'));

    await waitFor(() => {
      const post = fetchMock.mock.calls.find((c) => (c[1] as RequestInit)?.method === 'POST');
      expect(post).toBeTruthy();
      const body = JSON.parse(String((post![1] as RequestInit).body));
      expect(body.title).toBe('Batch A');
      expect(body.filename).toBe('a.3mf');
      expect(body.scheduled_at).toContain('2026-08-01'); // ISO string
    });
  });
});
