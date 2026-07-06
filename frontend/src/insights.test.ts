import { describe, it, expect } from 'vitest';
import { earnedCount, achPct, activityTotals } from './insights';
import type { Achievement, ActivityDay } from './types';

const ach = (earned: boolean, current: number, target: number): Achievement =>
  ({ id: 'x', icon: '', title: 'T', desc: 'D', category: 'c', earned, current, target, progress: 0 });

describe('insights', () => {
  it('earnedCount', () => {
    expect(earnedCount([ach(true, 1, 1), ach(false, 0, 5), ach(true, 5, 5)])).toBe(2);
  });
  it('achPct clamps to 100', () => {
    expect(achPct({ current: 3, target: 10 })).toBe(30);
    expect(achPct({ current: 20, target: 10 })).toBe(100);
    expect(achPct({ current: 1, target: 0 })).toBe(0);
  });
  it('activityTotals sums days/prints/hours/filament and tolerates null hours', () => {
    const days: ActivityDay[] = [
      { day: 'a', prints: 2, completed: 2, failed: 0, cancelled: 0, hours: 3, filament_g: 40 },
      { day: 'b', prints: 3, completed: 3, failed: 0, cancelled: 0, hours: 1.5, filament_g: 10 },
      // real data sometimes has null hours — must not crash or NaN the total
      { day: 'c', prints: 1, completed: 1, failed: 0, cancelled: 0, hours: null as unknown as number, filament_g: 5 },
    ];
    expect(activityTotals(days)).toEqual({ days: 3, prints: 6, hours: 4.5, filament_g: 55 });
  });
});
