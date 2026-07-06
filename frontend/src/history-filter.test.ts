import { describe, it, expect } from 'vitest';
import { filterHistory } from './history-filter';
import type { HistoryRow } from './types';

const rows: HistoryRow[] = [
  { id: 1, printer_id: 'a', filename: 'x', status: 'completed', started_at: '' },
  { id: 2, printer_id: 'b', filename: 'y', status: 'failed', started_at: '' },
  { id: 3, printer_id: 'a', filename: 'z', status: 'cancelled', started_at: '' },
  { id: 4, printer_id: 'a', filename: 'w', status: 'finish', started_at: '' },
];

describe('filterHistory', () => {
  it('all + all returns everything', () => {
    expect(filterHistory(rows, 'all', 'all')).toHaveLength(4);
  });
  it('completed includes finish + completed', () => {
    expect(filterHistory(rows, 'completed', 'all').map((r) => r.id)).toEqual([1, 4]);
  });
  it('failed includes failed + cancelled', () => {
    expect(filterHistory(rows, 'failed', 'all').map((r) => r.id)).toEqual([2, 3]);
  });
  it('filters by printer', () => {
    expect(filterHistory(rows, 'all', 'a').map((r) => r.id)).toEqual([1, 3, 4]);
  });
  it('combines status + printer', () => {
    expect(filterHistory(rows, 'completed', 'a').map((r) => r.id)).toEqual([1, 4]);
  });
});
