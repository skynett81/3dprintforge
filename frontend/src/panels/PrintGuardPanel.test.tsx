import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { ToastProvider } from '../toast';

const listPrinters = vi.fn();
const getProtectionLog = vi.fn();
const getGuardStatus = vi.fn();
vi.mock('../api', () => ({
  api: {
    listPrinters: (...a: unknown[]) => listPrinters(...a),
    getProtectionLog: (...a: unknown[]) => getProtectionLog(...a),
    getGuardStatus: (...a: unknown[]) => getGuardStatus(...a),
    testGuard: vi.fn(), snoozeGuard: vi.fn(), setGuardEnabled: vi.fn(), resolveProtection: vi.fn(),
  },
}));

import { PrintGuardPanel } from './PrintGuardPanel';

describe('PrintGuardPanel', () => {
  beforeEach(() => {
    listPrinters.mockReset().mockResolvedValue([{ id: 'p1', name: 'P2S' }]);
    getProtectionLog.mockReset().mockResolvedValue([
      { id: 1, printer_id: 'p1', timestamp: new Date(Date.now() - 1000).toISOString(), event_type: 'spaghetti_detected', resolved: 0 },
    ]);
    getGuardStatus.mockReset().mockResolvedValue({ settings: { enabled: 1, snooze_until: null, spaghetti_action: 'pause' }, alerts: [] });
  });

  it('shows a per-printer guard card with status, reliability and actions', async () => {
    render(<I18nProvider lang="en"><ToastProvider><PrintGuardPanel /></ToastProvider></I18nProvider>);
    expect(await screen.findByText('P2S')).toBeInTheDocument();
    expect(await screen.findByText('Armed')).toBeInTheDocument();       // guard on, not printing
    expect(screen.getByText('Test alert')).toBeInTheDocument();          // action
    expect(screen.getByText('Incidents (7d)')).toBeInTheDocument();      // reliability
    // The recent spaghetti event counts toward the 7-day reliability.
    expect(screen.getAllByText('Spaghetti Detected').length).toBeGreaterThan(0);
    // Wall mode + alerts opt-in live in the header.
    expect(screen.getByText('Wall mode')).toBeInTheDocument();
    expect(screen.getByText(/Alerts o(n|ff)/)).toBeInTheDocument();
    // Per-card sensor-history toggle.
    expect(screen.getByText(/Sensors/)).toBeInTheDocument();
  });
});
