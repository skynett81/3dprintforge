import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../i18n';
import type { HistoryRow } from '../../types';

const getHistoryDetail = vi.fn();
const getCloudTasks = vi.fn();
vi.mock('../../api', () => ({
  api: {
    getHistoryDetail: (...a: unknown[]) => getHistoryDetail(...a),
    getCloudTasks: (...a: unknown[]) => getCloudTasks(...a),
  },
}));

import { HistoryDetail } from './HistoryDetail';

const row = {
  id: 785,
  filename: '0.28mm layer, 2 walls, 10% infill',
  status: 'completed',
  printer_id: 'p1',
  started_at: '2026-07-05T15:19:55Z',
} as HistoryRow;

function renderDetail() {
  return render(<I18nProvider lang="en"><HistoryDetail row={row} /></I18nProvider>);
}

describe('HistoryDetail', () => {
  beforeEach(() => {
    getHistoryDetail.mockReset();
    getCloudTasks.mockReset().mockResolvedValue([]);
  });

  it('shows the real filament colour used and an actual-colour toggle', async () => {
    getHistoryDetail.mockResolvedValue({
      filaments_used: [{ spool_id: 24, color_hex: '898989', multi_color_hexes: null, material: 'PETG', name: 'PETG Gray', color_name: 'Gray', used_g: 16.6 }],
      cost: null,
    });
    renderDetail();
    expect(await screen.findByText('PETG Gray')).toBeInTheDocument();
    expect(await screen.findByText('Actual colour')).toBeInTheDocument();
  });

  it('shows the print cost breakdown and total', async () => {
    getHistoryDetail.mockResolvedValue({
      filaments_used: [],
      cost: { filament_cost: 5.96, electricity_cost: 0, depreciation_cost: 0, labor_cost: 0, markup_amount: 0, total_cost: 5.96, currency: 'NOK' },
    });
    renderDetail();
    expect((await screen.findAllByText('5.96 NOK')).length).toBeGreaterThan(0);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('shows the real AMS colour (targetColor), overriding the mis-matched spool', async () => {
    // Usage log matched a grey spool, but the AMS actually loaded white PETG.
    getHistoryDetail.mockResolvedValue({
      filaments_used: [{ spool_id: 24, color_hex: '898989', multi_color_hexes: null, material: 'PETG', name: 'PETG Gray', color_name: 'Gray', used_g: 16.6 }],
      cost: null,
    });
    getCloudTasks.mockResolvedValue([
      { title: '0.28mm layer, 2 walls, 10% infill', amsDetailMapping: [{ sourceColor: '898989FF', targetColor: 'FFFFFFFF', filamentType: 'PETG', weight: 59 }] },
    ]);
    renderDetail();
    expect(await screen.findByText('PETG')).toBeInTheDocument();      // from the AMS mapping
    expect(screen.queryByText('PETG Gray')).toBeNull();              // spool-log colour overridden
  });

  it('uses the Bambu cloud design name and colour cover when matched', async () => {
    getHistoryDetail.mockResolvedValue({ filaments_used: [], cost: null });
    getCloudTasks.mockResolvedValue([
      { title: '0.28mm layer, 2 walls, 10% infill', designTitle: 'Smart Watch Charging stand', cover: 'https://cloud/cover.png' },
    ]);
    renderDetail();
    expect(await screen.findByText('Smart Watch Charging stand')).toBeInTheDocument();
    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', 'https://cloud/cover.png');
  });
});
