import type { CostSummary } from './types';

export interface CostSlice { key: string; value: number }

// Break a cost summary into its components, largest first, for a bar chart.
export function costBreakdown(s: CostSummary): CostSlice[] {
  return [
    { key: 'filament', value: s.total_filament || 0 },
    { key: 'electricity', value: s.total_electricity || 0 },
    { key: 'depreciation', value: s.total_depreciation || 0 },
    { key: 'labor', value: s.total_labor || 0 },
    { key: 'markup', value: s.total_markup || 0 },
  ].filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
}

export function avgPerPrint(s: CostSummary): number {
  return s.print_count > 0 ? s.grand_total / s.print_count : 0;
}
