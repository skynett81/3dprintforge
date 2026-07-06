import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrinterDrawer } from './PrinterDrawer';
import type { Printer } from '../types';

const printer: Printer = { id: 'snapmaker-u1', name: 'Snapmaker U1', model: 'U1', type: 'moonraker', status: 'online' };

afterEach(() => { vi.restoreAllMocks(); });

describe('PrinterDrawer', () => {
  it('sends a set_light control command to the right endpoint', async () => {
    const fetchMock = vi.fn((_url: string, _opts?: RequestInit) =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true, action: 'set_light' }) } as Response));
    vi.stubGlobal('fetch', fetchMock);

    render(<PrinterDrawer printer={printer} live={{ gcode_state: 'IDLE' }} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Light on'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/printers/snapmaker-u1/control');
    expect(JSON.parse(String(opts?.body))).toEqual({ action: 'set_light', on: true });
  });

  it('disables Stop when the printer is not printing', () => {
    render(<PrinterDrawer printer={printer} live={{ gcode_state: 'IDLE' }} onClose={() => {}} />);
    expect(screen.getByText('Stop')).toBeDisabled();
  });
});
