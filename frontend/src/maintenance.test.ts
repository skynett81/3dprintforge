import { describe, it, expect } from 'vitest';
import { overdueCount, barPct } from './maintenance';
import type { MaintComponent } from './types';

const c = (overdue: boolean, percentage: number): MaintComponent => ({
  component: 'x', label: 'X', interval_hours: 50, hours_since_maintenance: 0,
  percentage, overdue, last_maintenance: null,
});

describe('maintenance', () => {
  it('overdueCount counts overdue components', () => {
    expect(overdueCount([c(true, 120), c(false, 40), c(true, 200)])).toBe(2);
  });
  it('barPct clamps to 0..100', () => {
    expect(barPct({ percentage: 62 })).toBe(62);
    expect(barPct({ percentage: 180 })).toBe(100);
    expect(barPct({ percentage: -5 })).toBe(0);
  });
});
