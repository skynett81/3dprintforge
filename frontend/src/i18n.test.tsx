import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nProvider, useT } from './i18n';

function Probe() {
  const t = useT();
  return (
    <div>
      <span data-testid="hit">{t('nav.dashboard', 'FB')}</span>
      <span data-testid="miss">{t('does.not.exist', 'Fallback text')}</span>
    </div>
  );
}

describe('i18n', () => {
  it('uses the fallback before the dictionary loads, then resolves known keys', async () => {
    // jsdom fetch returns a real language shape via a stubbed global.
    const orig = globalThis.fetch;
    globalThis.fetch = (() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ nav: { dashboard: 'Dashboard' } }) } as Response)) as typeof fetch;

    render(<I18nProvider lang="en"><Probe /></I18nProvider>);

    // Missing key always shows its fallback.
    expect(screen.getByTestId('miss').textContent).toBe('Fallback text');
    // Known key resolves once the dict has loaded.
    await waitFor(() => expect(screen.getByTestId('hit').textContent).toBe('Dashboard'));

    globalThis.fetch = orig;
  });
});
