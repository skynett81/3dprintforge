import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../i18n';
import type { HistoryRow } from '../../types';

vi.mock('../../api', () => ({
  api: {
    getHistoryFilaments: () => Promise.resolve([
      { spool_id: 24, color_hex: '898989', multi_color_hexes: null, material: 'PETG', name: 'PETG Gray', color_name: 'Gray', used_g: 16.6 },
    ]),
  },
}));

import { HistoryDetail } from './HistoryDetail';

const row = {
  id: 785,
  filename: 'Test print',
  status: 'completed',
  printer_id: 'p1',
  started_at: '2026-07-05T15:19:55Z',
} as HistoryRow;

describe('HistoryDetail', () => {
  it('shows the G-code/slicer preview image for the print', () => {
    render(<I18nProvider lang="en"><HistoryDetail row={row} /></I18nProvider>);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/api/history/785/thumbnail');
  });

  it('shows the real filament colour used, resolved from the spool', async () => {
    render(<I18nProvider lang="en"><HistoryDetail row={row} /></I18nProvider>);
    // "PETG Gray" comes from the used spool, not the (blank) history row colour.
    expect(await screen.findByText('PETG Gray')).toBeInTheDocument();
  });
});
