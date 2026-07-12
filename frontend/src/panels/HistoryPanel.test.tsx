import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../i18n';

// Isolate the hooks-order regression from HistoryDetail's own data needs.
vi.mock('./history/HistoryDetail', () => ({
  HistoryDetail: () => <div>DETAIL VIEW</div>,
}));
vi.mock('../api', () => ({
  api: {
    listHistory: () => Promise.resolve([
      { id: 792, filename: '0.2mm layer, 2 walls', status: 'completed', printer_id: 'p1', started_at: '2026-07-12T10:00:00Z' },
    ]),
    getCloudTasks: () => Promise.resolve([
      { title: '0.2mm layer, 2 walls', designTitle: 'Phone Stand' },
    ]),
  },
}));

import { HistoryPanel } from './HistoryPanel';

describe('HistoryPanel', () => {
  it('opens a selected print without a Rules-of-Hooks crash (React #300)', async () => {
    // `selected` is set while the list still loads async (deep-link or click),
    // so the loading -> loaded re-render must not change the hook count. If the
    // conditional detail return sits before the useMemo hooks, this transition
    // throws React #300 and blanks the page.
    render(
      <I18nProvider lang="en"><HistoryPanel selected="792" /></I18nProvider>,
    );
    expect(await screen.findByText('DETAIL VIEW')).toBeInTheDocument();
  });

  it('lists prints by their real design name, not the profile-string filename', async () => {
    render(<I18nProvider lang="en"><HistoryPanel /></I18nProvider>);
    // Filename is "0.2mm layer, 2 walls" but the cloud task design title wins.
    expect(await screen.findByText('Phone Stand')).toBeInTheDocument();
    expect(screen.queryByText('0.2mm layer, 2 walls')).toBeNull();
  });
});
