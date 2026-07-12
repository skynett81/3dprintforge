import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { ToastProvider } from '../toast';

const listErrors = vi.fn();
const getHmsInfo = vi.fn();
vi.mock('../api', () => ({
  api: {
    listErrors: (...a: unknown[]) => listErrors(...a),
    getHmsInfo: (...a: unknown[]) => getHmsInfo(...a),
    ackError: vi.fn(), ackAllErrors: vi.fn(),
  },
}));

import { ErrorsPanel } from './ErrorsPanel';

const err = {
  id: 1, printer_id: '3dsky', timestamp: '2026-07-05T15:21:10Z',
  code: '07FF_8007', message: 'Error: 07FF_8007', severity: 'error', acknowledged: 0,
  context: JSON.stringify({ gcode_state: 'PAUSE', bed_temper: 71 }),
};

describe('ErrorsPanel', () => {
  beforeEach(() => {
    listErrors.mockReset(); listErrors.mockResolvedValue([err]);
    getHmsInfo.mockReset(); getHmsInfo.mockResolvedValue({ code: '07FF_8007', description: 'Please observe the nozzle and click Done.', wiki_url: 'https://wiki.bambulab.com/x' });
  });

  it('resolves the code to a description and shows context + troubleshooting link', async () => {
    render(<I18nProvider lang="en"><ToastProvider><ErrorsPanel /></ToastProvider></I18nProvider>);
    fireEvent.click(await screen.findByText('07FF_8007'));
    expect(await screen.findByText('Please observe the nozzle and click Done.')).toBeInTheDocument(); // resolved description
    expect(screen.getByText('What it means')).toBeInTheDocument();
    expect(screen.getByText('PAUSE')).toBeInTheDocument();       // a context value
    expect(screen.getByText('Troubleshooting guide →')).toBeInTheDocument();
  });
});
