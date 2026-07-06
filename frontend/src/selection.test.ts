import { describe, it, expect } from 'vitest';
import { toggle } from './selection';

describe('toggle', () => {
  it('adds when absent, removes when present, immutably', () => {
    const a = new Set<number>([1]);
    const b = toggle(a, 2);
    expect([...b].sort()).toEqual([1, 2]);
    expect([...a]).toEqual([1]); // original untouched
    const c = toggle(b, 1);
    expect([...c]).toEqual([2]);
  });
});
