import { describe, it, expect } from 'vitest';
import { costBreakdown, avgPerPrint } from './costs';
import type { CostSummary } from './types';

const s: CostSummary = {
  print_count: 10, total_filament: 100, total_electricity: 20,
  total_depreciation: 0, total_labor: 50, total_markup: 30, grand_total: 200,
};

describe('costs', () => {
  it('costBreakdown drops zeros and sorts largest first', () => {
    expect(costBreakdown(s).map((x) => x.key)).toEqual(['filament', 'labor', 'markup', 'electricity']);
  });
  it('avgPerPrint divides grand total by count', () => {
    expect(avgPerPrint(s)).toBe(20);
    expect(avgPerPrint({ ...s, print_count: 0 })).toBe(0);
  });
});
