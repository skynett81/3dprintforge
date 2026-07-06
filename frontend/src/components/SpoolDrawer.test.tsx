import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpoolDrawer } from './SpoolDrawer';
import type { Spool } from '../types';

const spool: Spool = {
  id: 24, profile_name: 'Bambu PLA Basic', material: 'PLA', color_hex: '898989',
  vendor_name: 'Bambu Lab', remaining_weight_g: 520, initial_weight_g: 1000, cost: 199, location: 'AMS2',
};

afterEach(() => { vi.restoreAllMocks(); });

describe('SpoolDrawer', () => {
  it('saves edited remaining weight to the spool endpoint', async () => {
    // The drawer fetches the spool timeline on mount, so return an array by
    // default; the save call is a separate PUT we assert on below.
    const fetchMock = vi.fn((_url: string, _opts?: RequestInit) =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) } as Response));
    vi.stubGlobal('fetch', fetchMock);

    render(<SpoolDrawer spool={spool} onClose={() => {}} onChanged={() => {}} />);
    const remaining = screen.getByLabelText('Remaining (g)') as HTMLInputElement;
    fireEvent.change(remaining, { target: { value: '450' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(fetchMock.mock.calls.some(([, o]) => (o as RequestInit)?.method === 'PUT')).toBe(true));
    const putCall = fetchMock.mock.calls.find(([, o]) => (o as RequestInit)?.method === 'PUT')!;
    const [url, opts] = putCall;
    expect(url).toBe('/api/inventory/spools/24');
    expect(JSON.parse(String((opts as RequestInit)?.body)).remaining_weight_g).toBe(450);
  });
});
