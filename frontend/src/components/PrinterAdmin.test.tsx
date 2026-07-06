import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../toast';
import { PrinterAdmin } from './PrinterAdmin';

const printers = [{ id: 'u1', name: 'Snapmaker U1', ip: '192.168.1.5', type: 'moonraker', status: 'online' }];

function mockFetch(handler: (url: string, opts?: RequestInit) => unknown) {
  return vi.fn((url: string, opts?: RequestInit) =>
    Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(handler(url, opts)) } as Response));
}

afterEach(() => vi.restoreAllMocks());

describe('PrinterAdmin', () => {
  it('lists printers and creates a new one via POST /api/printers', async () => {
    const fetchMock = mockFetch((url) => (url === '/api/printers' ? printers : { ok: true, id: 'x' }));
    vi.stubGlobal('fetch', fetchMock);

    render(<ToastProvider><PrinterAdmin /></ToastProvider>);
    await waitFor(() => expect(screen.getByText('Snapmaker U1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('+ Add printer'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New P1S' } });
    fireEvent.change(screen.getByLabelText('IP address'), { target: { value: '10.0.0.9' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      const post = fetchMock.mock.calls.find((c) => (c[1] as RequestInit)?.method === 'POST');
      expect(post).toBeTruthy();
      expect(post![0]).toBe('/api/printers');
      const body = JSON.parse(String((post![1] as RequestInit).body));
      expect(body.name).toBe('New P1S');
      expect(body.ip).toBe('10.0.0.9');
    });
  });
});
