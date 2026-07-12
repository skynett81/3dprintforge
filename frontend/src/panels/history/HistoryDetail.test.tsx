import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../i18n';
import type { HistoryRow } from '../../types';

const getHistoryDetail = vi.fn();
vi.mock('../../api', () => ({ api: { getHistoryDetail: (...a: unknown[]) => getHistoryDetail(...a) } }));

import { HistoryDetail } from './HistoryDetail';

const row = {
  id: 785,
  filename: 'Test print',
  status: 'completed',
  printer_id: 'p1',
  started_at: '2026-07-05T15:19:55Z',
} as HistoryRow;

function renderDetail() {
  return render(<I18nProvider lang="en"><HistoryDetail row={row} /></I18nProvider>);
}

describe('HistoryDetail', () => {
  beforeEach(() => getHistoryDetail.mockReset());

  it('shows the real filament colour used and an actual-colour toggle', async () => {
    getHistoryDetail.mockResolvedValue({
      filaments_used: [{ spool_id: 24, color_hex: '898989', multi_color_hexes: null, material: 'PETG', name: 'PETG Gray', color_name: 'Gray', used_g: 16.6 }],
      cost: null,
    });
    renderDetail();
    expect(await screen.findByText('PETG Gray')).toBeInTheDocument();
    // Single-colour print → the preview offers to recolour to the real colour.
    expect(await screen.findByText('Actual colour')).toBeInTheDocument();
  });

  it('shows the print cost breakdown and total', async () => {
    getHistoryDetail.mockResolvedValue({
      filaments_used: [],
      cost: { filament_cost: 5.96, electricity_cost: 0, depreciation_cost: 0, labor_cost: 0, markup_amount: 0, total_cost: 5.96, currency: 'NOK' },
    });
    renderDetail();
    // Appears as both the filament line and the total.
    expect((await screen.findAllByText('5.96 NOK')).length).toBeGreaterThan(0);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });
});
