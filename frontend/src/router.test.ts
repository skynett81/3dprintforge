import { describe, it, expect } from 'vitest';
import { parseHash, buildHash } from './router';

describe('parseHash', () => {
  it('defaults to dashboard when empty', () => {
    expect(parseHash('')).toEqual({ panel: 'dashboard', sub: null });
    expect(parseHash('#/')).toEqual({ panel: 'dashboard', sub: null });
  });
  it('parses panel and optional sub', () => {
    expect(parseHash('#/fleet')).toEqual({ panel: 'fleet', sub: null });
    expect(parseHash('#/inventory/spools')).toEqual({ panel: 'inventory', sub: 'spools' });
    expect(parseHash('#/inventory/spools/')).toEqual({ panel: 'inventory', sub: 'spools' });
  });
});

describe('buildHash', () => {
  it('round-trips with parseHash', () => {
    expect(buildHash('fleet')).toBe('#/fleet');
    expect(buildHash('inventory', 'control')).toBe('#/inventory/control');
    expect(parseHash(buildHash('inventory', 'control'))).toEqual({ panel: 'inventory', sub: 'control' });
  });
});
