import type { HistoryRow } from './types';

export type StatusFilter = 'all' | 'completed' | 'failed';

const COMPLETED = new Set(['completed', 'finish']);
const FAILED = new Set(['failed', 'error', 'cancelled']);

// Pure filtering for the History table — extracted so it can be unit-tested
// without a DOM. `printer` is a printer_id or 'all'.
export function filterHistory(rows: HistoryRow[], status: StatusFilter, printer: string): HistoryRow[] {
  return rows.filter((r) => {
    if (printer !== 'all' && r.printer_id !== printer) return false;
    const s = r.status.toLowerCase();
    if (status === 'completed') return COMPLETED.has(s);
    if (status === 'failed') return FAILED.has(s);
    return true;
  });
}
