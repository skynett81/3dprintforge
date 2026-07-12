import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../i18n';
import { HistoryDetail } from './HistoryDetail';
import type { HistoryRow } from '../../types';

const row = {
  id: 792,
  filename: 'Test print',
  status: 'completed',
  printer_id: 'p1',
  started_at: '2026-07-05T15:19:55Z',
} as HistoryRow;

describe('HistoryDetail', () => {
  it('shows the G-code/slicer preview image for the print', () => {
    render(<I18nProvider lang="en"><HistoryDetail row={row} /></I18nProvider>);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/api/history/792/thumbnail');
  });
});
