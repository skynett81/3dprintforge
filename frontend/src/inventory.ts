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

// The stock-activity feed unions real ledger movements (with delta_g) and a
// raw event log (delta_g null, reason = JSON blob). Only the former belong in
// a human ledger view.
export function isRealMovement(m: { delta_g: number | null }): boolean {
  return m.delta_g != null;
}

const TYPE_LABELS: Record<string, string> = {
  consume: 'Print', adjust: 'Adjustment', receive: 'Received', relocate: 'Moved',
  refill: 'Refill', correction: 'Correction', archive: 'Archived',
};

// A readable label for a movement: prefer a clean reason, but never surface a
// raw JSON details blob — fall back to a friendly type name.
export function movementLabel(m: { type: string; reason?: string | null }): string {
  const r = (m.reason || '').trim();
  if (r && !r.startsWith('{') && !r.startsWith('[')) return r;
  return TYPE_LABELS[m.type] || m.type || 'Movement';
}

// Human label for a spool timeline event. The `details` field is often a raw
// JSON blob (e.g. {"weight_g":16.6,"source":"moonraker-estimate"}); never show
// that verbatim — summarise per event type instead.
export function spoolEventLabel(e: { event_type: string; details?: string | null }): string {
  const raw = (e.details || '').trim();
  let d: Record<string, unknown> | null = null;
  if (raw.startsWith('{')) {
    try { const p = JSON.parse(raw); if (p && typeof p === 'object') d = p as Record<string, unknown>; } catch { /* not JSON */ }
  }
  const num = (v: unknown): number => (typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  switch (e.event_type) {
    case 'used': { const w = num(d?.weight_g); return Number.isFinite(w) ? `Used ${Math.round(w)} g` : 'Used'; }
    case 'adjusted': { const a = num(d?.from); const b = num(d?.to); return Number.isFinite(a) && Number.isFinite(b) ? `Adjusted ${Math.round(a)} → ${Math.round(b)} g` : 'Adjusted'; }
    case 'relocated': return d?.to ? `Moved to ${String(d.to)}` : 'Moved';
    case 'created': return 'Created';
    case 'edited': return 'Edited';
    case 'archived': return 'Archived';
    case 'dried': return 'Marked dried';
    default:
      if (raw && !raw.startsWith('{') && !raw.startsWith('[')) return `${cap(e.event_type)} · ${raw}`;
      return cap(e.event_type || 'Event');
  }
}

export interface MaterialShare { material: string; count: number; remaining_g: number; pct: number; }

export function materialShare(rows: { material: string; count: number; remaining_g: number }[]): MaterialShare[] {
  const total = rows.reduce((a, r) => a + (r.remaining_g || 0), 0) || 1;
  return rows.map((r) => ({ ...r, pct: Math.round((r.remaining_g / total) * 100) }));
}
