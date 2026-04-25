// gcode-time-estimator.test.js — Unit tests for the G-code estimator

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { estimate, formatTime, _internals } from '../../server/gcode-time-estimator.js';

describe('gcode-time-estimator: formatTime', () => {
  it('formats hours/minutes/seconds correctly', () => {
    assert.equal(formatTime(0), '0s');
    assert.equal(formatTime(45), '45s');
    assert.equal(formatTime(125), '2m 5s');
    assert.equal(formatTime(3725), '1h 2m 5s');
  });
});

describe('gcode-time-estimator: trapezoidal motion', () => {
  it('returns zero for zero distance', () => {
    assert.equal(_internals._trapezoidalTime(0, 100, 1500), 0);
  });

  it('returns triangular profile for short distances', () => {
    const t = _internals._trapezoidalTime(1, 100, 1500);
    // Below cruise threshold — triangular: 2 * sqrt(d/a)
    assert.ok(Math.abs(t - 2 * Math.sqrt(1 / 1500)) < 1e-6);
  });

  it('returns trapezoidal profile when cruise reached', () => {
    const t = _internals._trapezoidalTime(100, 50, 500);
    assert.ok(t > 0);
    // Sanity: must be larger than just constant-velocity time
    assert.ok(t > 100 / 50 - 0.001);
  });
});

describe('gcode-time-estimator: estimate', () => {
  it('returns zero for empty input', () => {
    const r = estimate('');
    assert.equal(r.timeSeconds, 0);
    assert.equal(r.extrudeLengthMm, 0);
  });

  it('estimates a simple linear move', () => {
    // Use a longer extrusion so the rounded cost is non-zero.
    const gcode = `
G90
G92 E0
G1 X100 Y0 E2000 F1200
`;
    const r = estimate(gcode);
    assert.ok(r.timeSeconds > 0);
    assert.equal(r.extrudeLengthMm, 2000);
    assert.ok(r.weightG > 0);
    assert.ok(r.cost > 0);
  });

  it('tracks bounding box only on extrusion moves', () => {
    const gcode = `
G90
G92 E0
G1 X10 Y10 Z0.2 ; travel-only move (no E)
G1 X50 Y50 Z0.2 E5 F1200
G1 X80 Y80 Z0.2 E10 F1200
`;
    const r = estimate(gcode);
    assert.equal(r.bbox.min[0], 50);
    assert.equal(r.bbox.max[0], 80);
    assert.equal(r.bbox.min[1], 50);
    assert.equal(r.bbox.max[1], 80);
  });

  it('counts layers from Z-up moves', () => {
    const gcode = `
G90
G92 E0
G1 X10 Y10 Z0.2 E1
G1 X20 Y10 Z0.4 E1
G1 X30 Y10 Z0.6 E1
`;
    const r = estimate(gcode);
    assert.ok(r.layerCount >= 2);
  });

  it('counts layers from slicer LAYER_CHANGE comments', () => {
    const gcode = `
;LAYER_CHANGE
G1 X10 Y10 Z0.2 E1
;LAYER_CHANGE
G1 X20 Y20 Z0.4 E1
;LAYER_CHANGE
`;
    const r = estimate(gcode);
    assert.equal(r.layerCount, 3);
  });

  it('handles relative E coordinates (M83)', () => {
    const gcode = `
G90
M83
G1 X100 Y0 E5 F1200
G1 X200 Y0 E5 F1200
`;
    const r = estimate(gcode);
    assert.equal(r.extrudeLengthMm, 10);
  });

  it('respects custom filament density and price', () => {
    // 5000 mm of 1.75 PLA at 1.24 g/cm³ ≈ 14.9 g → at $30/kg ≈ $0.45.
    const gcode = `G90
G92 E0
G1 X100 Y0 E5000 F1200`;
    const r = estimate(gcode, {
      filamentDiameterMm: 1.75,
      filamentDensityGcm3: 1.24,
      filamentPricePerKg: 30,
    });
    assert.ok(r.weightG > 14 && r.weightG < 16);
    assert.ok(r.cost > 0.4 && r.cost < 0.5);
  });

  it('includes G4 dwell in the time', () => {
    const r1 = estimate('G4 P1000');  // 1 second
    assert.ok(r1.timeSeconds >= 1);
    const r2 = estimate('G4 S2');     // 2 seconds
    assert.ok(r2.timeSeconds >= 2);
  });

  it('parses slicer header comments', () => {
    const gcode = `; estimated printing time (normal mode) = 1h 30m 45s
; filament used [mm] = 1234.5
; filament used [g] = 3.21
G92 E0
G1 X100 Y0 E5 F1200
`;
    const r = estimate(gcode);
    assert.ok(r.slicerHeader.slicerTimeSeconds >= 5400);
    assert.ok(r.slicerHeader.slicerFilamentMm > 1000);
  });
});
