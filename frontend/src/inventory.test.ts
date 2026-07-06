import { describe, it, expect } from 'vitest';
import { spoolPct, isLow, matchesQuery, sortSpools, materialShare, spoolValue } from './inventory';
import type { Spool } from './types';

function spool(p: Partial<Spool>): Spool {
  return { id: 1, remaining_weight_g: 500, initial_weight_g: 1000, archived: 0, ...p } as Spool;
}

describe('spoolPct', () => {
  it('computes clamped percent', () => {
    expect(spoolPct({ remaining_weight_g: 500, initial_weight_g: 1000 })).toBe(50);
    expect(spoolPct({ remaining_weight_g: 0, initial_weight_g: 0 })).toBe(0);
    expect(spoolPct({ remaining_weight_g: 1500, initial_weight_g: 1000 })).toBe(100);
  });
});

describe('isLow', () => {
  it('flags spools below threshold', () => {
    expect(isLow({ remaining_weight_g: 100, initial_weight_g: 1000 })).toBe(true);
    expect(isLow({ remaining_weight_g: 500, initial_weight_g: 1000 })).toBe(false);
    expect(isLow({ remaining_weight_g: 0, initial_weight_g: 0 })).toBe(false);
  });
});

describe('matchesQuery', () => {
  const s = spool({ profile_name: 'Bambu PLA Basic', color_name: 'Black', vendor_name: 'Bambu', material: 'PLA', location: 'Shelf B' });
  it('matches across fields, empty query matches all', () => {
    expect(matchesQuery(s, '')).toBe(true);
    expect(matchesQuery(s, 'black')).toBe(true);
    expect(matchesQuery(s, 'shelf')).toBe(true);
    expect(matchesQuery(s, 'petg')).toBe(false);
  });
});

describe('sortSpools', () => {
  const list = [spool({ id: 1, remaining_weight_g: 300 }), spool({ id: 2, remaining_weight_g: 900 }), spool({ id: 3, remaining_weight_g: 100 })];
  it('sorts by remaining asc/desc without mutating', () => {
    expect(sortSpools(list, 'remaining', 'asc').map((s) => s.id)).toEqual([3, 1, 2]);
    expect(sortSpools(list, 'remaining', 'desc').map((s) => s.id)).toEqual([2, 1, 3]);
    expect(list.map((s) => s.id)).toEqual([1, 2, 3]);
  });
});

describe('spoolValue', () => {
  it('pro-rates cost by remaining fraction', () => {
    expect(spoolValue({ cost: 200, remaining_weight_g: 500, initial_weight_g: 1000 })).toBe(100);
    expect(spoolValue({ cost: 200, remaining_weight_g: 1000, initial_weight_g: 1000 })).toBe(200);
    expect(spoolValue({ cost: 0, remaining_weight_g: 500, initial_weight_g: 1000 })).toBe(0);
  });
});

describe('materialShare', () => {
  it('adds percentage of total remaining', () => {
    const out = materialShare([
      { material: 'PLA', count: 2, remaining_g: 750 },
      { material: 'PETG', count: 1, remaining_g: 250 },
    ]);
    expect(out[0].pct).toBe(75);
    expect(out[1].pct).toBe(25);
  });
});
