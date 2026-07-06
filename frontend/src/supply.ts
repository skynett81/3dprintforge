import type { MaterialForecast } from './types';

// Days of stock left at the recent average daily consumption. null when the
// material hasn't been used (no burn rate to divide by).
export function runwayDays(m: Pick<MaterialForecast, 'in_stock_g' | 'avg_daily_g'>): number | null {
  if (!m.avg_daily_g || m.avg_daily_g <= 0) return null;
  return Math.round(m.in_stock_g / m.avg_daily_g);
}

// Soonest-to-empty first; materials with no burn rate sort last.
export function byRunway(a: MaterialForecast, b: MaterialForecast): number {
  const ra = runwayDays(a);
  const rb = runwayDays(b);
  if (ra == null) return rb == null ? 0 : 1;
  if (rb == null) return -1;
  return ra - rb;
}
