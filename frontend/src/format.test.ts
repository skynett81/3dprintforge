import { describe, it, expect } from 'vitest';
import { formatBytes, formatUptime } from './format';

describe('formatBytes', () => {
  it('scales bytes to human units', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(2_417_910)).toBe('2.3 MB');
  });
});

describe('formatUptime', () => {
  it('formats seconds into d/h/m', () => {
    expect(formatUptime(90)).toBe('1m');
    expect(formatUptime(3700)).toBe('1h 1m');
    expect(formatUptime(90000)).toBe('1d 1h');
  });
});
