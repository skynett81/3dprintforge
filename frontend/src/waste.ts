import type { WasteStats } from './types';

export interface WasteSlice { key: string; value: number }

// Break waste into its sources, largest first, dropping zeros.
export function wasteBreakdown(b: WasteStats['waste_breakdown']): WasteSlice[] {
  return [
    { key: 'color_change', value: b.color_change_g || 0 },
    { key: 'failed', value: b.failed_g || 0 },
    { key: 'purge', value: b.purge_g || 0 },
    { key: 'manual', value: b.manual_g || 0 },
  ].filter((x) => x.value > 0).sort((a, b2) => b2.value - a.value);
}
