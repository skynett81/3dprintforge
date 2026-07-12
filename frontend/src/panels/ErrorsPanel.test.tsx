import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { ToastProvider } from '../toast';

const listErrors = vi.fn();
vi.mock('../api', () => ({
  api: { listErrors: (...a: unknown[]) => listErrors(...a), ackError: vi.fn(), ackAllErrors: vi.fn() },
}));

import { ErrorsPanel } from './ErrorsPanel';

const err = {
  id: 1, printer_id: '3dsky', timestamp: '2026-07-05T15:21:10Z',
  code: '0500_8062', message: 'Error: 0500_8062', severity: 'error', acknowledged: 0,
  context: JSON.stringify({ gcode_state: 'PAUSE', bed_temper: 71, wiki_url: 'https://wiki.bambulab.com/x' }),
};

describe('ErrorsPanel', () => {
  beforeEach(() => { listErrors.mockReset(); listErrors.mockResolvedValue([err]); });

  it('opens a detail popup with context fields and a troubleshooting link', async () => {
    render(<I18nProvider lang="en"><ToastProvider><ErrorsPanel /></ToastProvider></I18nProvider>);
    fireEvent.click(await screen.findByText('0500_8062'));
    expect(await screen.findByText('Troubleshooting guide →')).toBeInTheDocument();
    expect(screen.getByText('PAUSE')).toBeInTheDocument();       // a context value
    expect(screen.getByText('Gcode State')).toBeInTheDocument(); // humanised context key
  });
});
