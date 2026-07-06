import { describe, it, expect } from 'vitest';
import { wasteBreakdown } from './waste';

describe('wasteBreakdown', () => {
  it('sorts largest first and drops zero sources', () => {
    const b = { purge_g: 79, color_change_g: 375, failed_g: 143.8, manual_g: 0, failed_prints: 5 };
    expect(wasteBreakdown(b).map((x) => x.key)).toEqual(['color_change', 'failed', 'purge']);
    expect(wasteBreakdown(b).map((x) => x.value)).toEqual([375, 143.8, 79]);
  });
});
