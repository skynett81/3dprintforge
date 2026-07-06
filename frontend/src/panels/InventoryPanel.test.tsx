import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InventoryPanel } from './InventoryPanel';

// Realistic API payloads keyed by URL, so mounting exercises real render paths.
const stats = {
  total_spools: 18, total_remaining_g: 14237, total_used_g: 3013, total_cost: 3517, low_stock_count: 1,
  by_material: [{ material: 'PLA', count: 6, remaining_g: 3227 }, { material: 'PETG', count: 9, remaining_g: 8009 }],
  by_vendor: [{ vendor: 'Elegoo', count: 6, remaining_g: 5931, total_cost: 774 }],
};
const spools = [
  { id: 24, profile_name: 'Bambu PLA Basic', material: 'PLA', color_hex: '898989', vendor_name: 'Bambu', remaining_weight_g: 120, initial_weight_g: 1000, cost: 199, location: 'AMS2', archived: 0, last_used_at: '2026-07-05 10:00:00' },
  { id: 25, profile_name: 'Elegoo PETG', material: 'PETG', color_hex: '3b82f6', vendor_name: 'Elegoo', remaining_weight_g: 800, initial_weight_g: 1000, cost: 129, location: 'Shelf B', archived: 0 },
];

function payloadFor(url: string): unknown {
  if (url.includes('/inventory/stats')) return stats;
  if (url.includes('/inventory/spools/expiring')) return [];
  if (url.includes('/inventory/spools') && url.endsWith('/timeline')) return [];
  if (url.endsWith('/inventory/spools')) return spools;
  if (url.includes('/inventory/filaments')) return [{ id: 1, name: 'PLA Basic', material: 'PLA', color_name: 'Black', color_hex: '111111' }];
  if (url.includes('/inventory/locations')) return [{ id: 1, name: 'Shelf B', description: 'Main', max_spools: 20 }];
  if (url.includes('/inventory/stock-activity')) return [{ source: 'usage', type: 'consume', delta_g: -16, reason: 'Print', timestamp: '2026-07-05 10:00:00', spool_label: 'Bambu PLA', spool_color: '898989' }];
  if (url.includes('/inventory/stock-targets')) return [];
  if (url.includes('/inventory/drying/status')) return [{ id: 24, last_dried_at: null, profile_name: 'PLA', material: 'PLA', color_hex: '898989', drying_status: 'overdue', days_since_dried: 45, max_days_without_drying: 30 }];
  return [];
}

afterEach(() => { vi.restoreAllMocks(); });

describe('InventoryPanel (smoke)', () => {
  it('renders every tab with realistic data without crashing', async () => {
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(payloadFor(url)) } as Response));
    vi.stubGlobal('fetch', fetchMock);

    render(<InventoryPanel />);

    // Overview (default): KPI + a material breakdown
    await waitFor(() => expect(screen.getByText('Stock value')).toBeTruthy());
    expect(screen.getByText('Stock by material')).toBeTruthy();

    // Spools table: a header column and a spool row
    fireEvent.click(screen.getByRole('button', { name: 'Spools' }));
    await waitFor(() => expect(screen.getByText('Bambu PLA Basic')).toBeTruthy());

    // Profiles, Locations, Control, Activity all mount without throwing
    fireEvent.click(screen.getByRole('button', { name: 'Profiles' }));
    fireEvent.click(screen.getByRole('button', { name: 'Locations' }));
    await waitFor(() => expect(screen.getByText('Shelf B')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Control' }));
    await waitFor(() => expect(screen.getByText('Minimum stock levels')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Activity' }));
  });
});
