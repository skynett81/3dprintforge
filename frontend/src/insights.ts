import type { Achievement, ActivityDay } from './types';

export function earnedCount(list: Achievement[]): number {
  return list.filter((a) => a.earned).length;
}

export function achPct(a: Pick<Achievement, 'current' | 'target'>): number {
  if (!a.target || a.target <= 0) return 0;
  return Math.min(100, Math.round((a.current / a.target) * 100));
}

export interface ActivityTotals { days: number; prints: number; hours: number; filament_g: number }

export function activityTotals(days: ActivityDay[]): ActivityTotals {
  return days.reduce<ActivityTotals>(
    (t, d) => ({ days: t.days + 1, prints: t.prints + (d.prints || 0), hours: t.hours + (d.hours || 0), filament_g: t.filament_g + (d.filament_g || 0) }),
    { days: 0, prints: 0, hours: 0, filament_g: 0 },
  );
}
