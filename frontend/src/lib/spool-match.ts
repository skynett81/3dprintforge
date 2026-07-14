// spool-match.ts — match a slicer filament slot (colour + material) against the
// real 3DPrintForge spool inventory, so the slicer knows what you actually own:
// how many grams are in stock, whether it's enough for the print, and what it
// costs from real spool prices. Ported from the desktop fork's ForgeSpoolMatch.
import type { Spool } from '../types';

export interface SpoolMatchResult {
  spoolCount: number;
  availableG: number;
  costPerG: number;       // remaining-weighted avg kr/g across priced matches, or -1
  matched: boolean;
  /** Set once a needed amount is known: is available ≥ needed? */
  sufficient: boolean;
  deficitG: number;       // max(0, needed - available) when needed known, else 0
  /** IDs of the matched spools, best-stocked first (for fleet calibration lookup). */
  spoolIds: number[];
}

const hexToRgb = (h?: string | null): [number, number, number] | null => {
  const x = String(h ?? '').replace(/^#/, '');
  if (x.length < 6) return null;
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
};
const colorClose = (a: string, b: string, tol = 42): boolean => {
  const ra = hexToRgb(a), rb = hexToRgb(b);
  if (!ra || !rb) return false;
  return Math.hypot(ra[0] - rb[0], ra[1] - rb[1], ra[2] - rb[2]) <= tol;
};

/**
 * Match `color`+`material` against active spools. When `neededG` > 0 the result
 * also reports whether stock is sufficient. Material is compared case-insensitively
 * on the base material; empty material means "don't constrain by material".
 */
export function matchSpools(color: string, material: string, spools: Spool[], neededG = 0): SpoolMatchResult {
  const mat = (material || '').toUpperCase();
  const matched = spools.filter((s) => {
    if (s.archived) return false;
    if (mat && (s.material || '').toUpperCase() !== mat) return false;
    return colorClose(color, s.color_hex ?? '');
  }).sort((a, b) => (b.remaining_weight_g || 0) - (a.remaining_weight_g || 0));
  let availableG = 0, wCost = 0, wSum = 0;
  for (const s of matched) {
    const rem = Math.max(0, s.remaining_weight_g || 0);
    availableG += rem;
    if (s.cost && s.initial_weight_g) { wCost += (s.cost / s.initial_weight_g) * rem; wSum += rem; }
  }
  const costPerG = wSum > 0 ? wCost / wSum : -1;
  return {
    spoolCount: matched.length,
    availableG,
    costPerG,
    matched: matched.length > 0,
    sufficient: neededG > 0 ? availableG >= neededG : true,
    deficitG: neededG > 0 ? Math.max(0, neededG - availableG) : 0,
    spoolIds: matched.map((s) => s.id),
  };
}
