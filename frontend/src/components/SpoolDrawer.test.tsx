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
    const fetchMock = vi.fn((_url: string, _opts?: RequestInit) =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) } as Response));
    vi.stubGlobal('fetch', fetchMock);

    render(<SpoolDrawer spool={spool} onClose={() => {}} onChanged={() => {}} />);
    const remaining = screen.getByLabelText('Remaining (g)') as HTMLInputElement;
    fireEvent.change(remaining, { target: { value: '450' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/inventory/spools/24');
    expect((opts as RequestInit).method).toBe('PUT');
    expect(JSON.parse(String(opts?.body)).remaining_weight_g).toBe(450);
  });
});
