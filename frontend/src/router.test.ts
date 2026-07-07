import { describe, it, expect } from 'vitest';
import { parseHash, buildHash } from './router';

describe('parseHash', () => {
  it('defaults to dashboard when empty', () => {
    expect(parseHash('')).toEqual({ panel: 'dashboard', sub: null, detail: null });
    expect(parseHash('#/')).toEqual({ panel: 'dashboard', sub: null, detail: null });
  });
  it('parses panel, sub and detail', () => {
    expect(parseHash('#/fleet')).toEqual({ panel: 'fleet', sub: null, detail: null });
    expect(parseHash('#/inventory/spools')).toEqual({ panel: 'inventory', sub: 'spools', detail: null });
    expect(parseHash('#/inventory/locations/2')).toEqual({ panel: 'inventory', sub: 'locations', detail: '2' });
    expect(parseHash('#/inventory/spools/')).toEqual({ panel: 'inventory', sub: 'spools', detail: null });
  });
});

describe('buildHash', () => {
  it('round-trips with parseHash', () => {
    expect(buildHash('fleet')).toBe('#/fleet');
    expect(buildHash('inventory', 'control')).toBe('#/inventory/control');
    expect(buildHash('inventory', 'locations', '2')).toBe('#/inventory/locations/2');
    expect(parseHash(buildHash('inventory', 'locations', '2'))).toEqual({ panel: 'inventory', sub: 'locations', detail: '2' });
  });
});
