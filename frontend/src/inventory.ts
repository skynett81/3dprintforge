import type { Spool } from './types';

export function spoolPct(s: Pick<Spool, 'remaining_weight_g' | 'initial_weight_g'>): number {
  if (!s.initial_weight_g || s.initial_weight_g <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((s.remaining_weight_g / s.initial_weight_g) * 100)));
}

export function isLow(s: Pick<Spool, 'remaining_weight_g' | 'initial_weight_g'>, thresholdPct = 15): boolean {
  return s.initial_weight_g > 0 && spoolPct(s) < thresholdPct;
}

// Value of the filament still on the spool: purchase cost pro-rated by how
// much material remains. A full spool is worth its cost; a half-empty one half.
export function spoolValue(s: Pick<Spool, 'remaining_weight_g' | 'initial_weight_g' | 'cost'>): number {
  if (!s.cost || s.cost <= 0 || !s.initial_weight_g || s.initial_weight_g <= 0) return 0;
  return Math.round(s.cost * Math.min(1, (s.remaining_weight_g || 0) / s.initial_weight_g));
}

export function matchesQuery(s: Spool, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [s.profile_name, s.color_name, s.vendor_name, s.material, s.location]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(needle);
}

export type SortKey = 'remaining' | 'pct' | 'name' | 'material';

export function sortSpools(list: Spool[], key: SortKey, dir: 'asc' | 'desc'): Spool[] {
  const sign = dir === 'asc' ? 1 : -1;
  const val = (s: Spool): number | string => {
    switch (key) {
      case 'remaining': return s.remaining_weight_g || 0;
      case 'pct': return spoolPct(s);
      case 'material': return (s.material || '').toLowerCase();
      case 'name': return (s.profile_name || s.color_name || '').toLowerCase();
    }
  };
  return [...list].sort((a, b) => {
    const av = val(a); const bv = val(b);
    if (av < bv) return -1 * sign;
    if (av > bv) return 1 * sign;
    return 0;
  });
}

export interface MaterialShare { material: string; count: number; remaining_g: number; pct: number; }

export function materialShare(rows: { material: string; count: number; remaining_g: number }[]): MaterialShare[] {
  const total = rows.reduce((a, r) => a + (r.remaining_g || 0), 0) || 1;
  return rows.map((r) => ({ ...r, pct: Math.round((r.remaining_g / total) * 100) }));
}
