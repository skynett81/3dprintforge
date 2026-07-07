// Tiny hash router: the URL after #/ is "<panel>[/<sub>]".
// Hash-based so the static server needs no SPA-fallback config — /v2/ always
// serves index.html and the app reads the fragment itself.

export interface Route {
  panel: string;
  sub: string | null;
  detail: string | null;
}

export function parseHash(hash: string): Route {
  const cleaned = (hash || '').replace(/^#\/?/, '').replace(/\/+$/, '');
  const segs = cleaned.split('/').filter(Boolean).map((s) => decodeURIComponent(s));
  return { panel: segs[0] || 'dashboard', sub: segs[1] || null, detail: segs[2] || null };
}

export function buildHash(panel: string, sub?: string | null, detail?: string | null): string {
  const parts = [panel, sub, detail].filter((p): p is string => !!p).map((p) => encodeURIComponent(p));
  return `#/${parts.join('/')}`;
}
