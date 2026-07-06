import { describe, it, expect } from 'vitest';
import { runwayDays, byRunway } from './supply';
import type { MaterialForecast } from './types';

const m = (material: string, in_stock_g: number, avg_daily_g: number): MaterialForecast =>
  ({ material, in_stock_g, avg_daily_g, total_used_g: 0, active_days: 0, spool_count: 0 });

describe('supply', () => {
  it('runwayDays divides stock by burn rate', () => {
    expect(runwayDays(m('PLA', 1000, 100))).toBe(10);
    expect(runwayDays(m('PLA', 950, 100))).toBe(10); // rounded
  });
  it('runwayDays is null with no burn rate', () => {
    expect(runwayDays(m('PLA', 1000, 0))).toBeNull();
  });
  it('byRunway sorts soonest-empty first, unused last', () => {
    const list = [m('A', 1000, 50), m('B', 100, 100), m('C', 500, 0)];
    const sorted = [...list].sort(byRunway).map((x) => x.material);
    expect(sorted).toEqual(['B', 'A', 'C']); // B=1d, A=20d, C=none
  });
});
