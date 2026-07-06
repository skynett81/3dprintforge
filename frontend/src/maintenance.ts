import type { MaintComponent } from './types';

export function overdueCount(components: MaintComponent[]): number {
  return components.filter((c) => c.overdue).length;
}

// Clamp the API percentage to a bar width; overdue can exceed 100.
export function barPct(c: Pick<MaintComponent, 'percentage'>): number {
  return Math.max(0, Math.min(100, Math.round(c.percentage)));
}
