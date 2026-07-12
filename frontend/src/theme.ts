export type Theme = 'dark' | 'light';
const KEY = 'v2.theme';

/** Persisted choice, else the OS preference, else dark. */
export function initialTheme(): Theme {
  try { const s = localStorage.getItem(KEY); if (s === 'light' || s === 'dark') return s; } catch { /* ignore */ }
  try { if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'; } catch { /* ignore */ }
  return 'dark';
}

export function applyTheme(t: Theme): void {
  try { document.documentElement.dataset.theme = t; } catch { /* ignore */ }
  try { localStorage.setItem(KEY, t); } catch { /* ignore */ }
}
