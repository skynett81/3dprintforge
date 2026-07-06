import { describe, it, expect } from 'vitest';
import { readLive, isPrinting } from './live';

describe('readLive', () => {
  it('extracts common fields from a live print payload', () => {
    const l = readLive({ gcode_state: 'RUNNING', mc_percent: 42, nozzle_temper: 210, bed_temper: 60, mc_remaining_time: 33 });
    expect(l.gcodeState).toBe('RUNNING');
    expect(l.progress).toBe(42);
    expect(l.nozzle).toBe(210);
    expect(l.bed).toBe(60);
    expect(l.remainingMin).toBe(33);
  });

  it('tolerates missing / undefined state', () => {
    const l = readLive(undefined);
    expect(l.gcodeState).toBeNull();
    expect(l.progress).toBeNull();
    expect(l.nozzle).toBeNull();
  });

  it('parses numeric strings', () => {
    expect(readLive({ bed_temper: '55.5' }).bed).toBe(55.5);
  });
});

describe('isPrinting', () => {
  it('true while RUNNING', () => {
    expect(isPrinting(readLive({ gcode_state: 'RUNNING' }))).toBe(true);
  });
  it('true with partial progress and no idle/finish state', () => {
    expect(isPrinting(readLive({ mc_percent: 50 }))).toBe(true);
  });
  it('false when idle', () => {
    expect(isPrinting(readLive({ gcode_state: 'IDLE', mc_percent: 0 }))).toBe(false);
  });
  it('false when finished', () => {
    expect(isPrinting(readLive({ gcode_state: 'FINISH', mc_percent: 100 }))).toBe(false);
  });
});
