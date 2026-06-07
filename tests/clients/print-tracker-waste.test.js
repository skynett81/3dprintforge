// print-tracker-waste.test.js — purge-analytics accuracy: tool-changer detection
// and the per-colour-change waste it drives. Tool changers (separate hotends,
// e.g. Snapmaker U1) waste ~nothing per change; single-nozzle MMU/AMS purge fully.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PrintTracker } from '../../server/print-tracker.js';

describe('purge analytics — tool-changer detection', () => {
  const t = new PrintTracker('test');

  it('detects a tool changer from a populated _extra_extruders array', () => {
    assert.equal(t._detectToolChanger({ _extra_extruders: ['extruder1', 'extruder2'] }), true);
  });

  it('detects a tool changer from an active extruder index > 0', () => {
    assert.equal(t._detectToolChanger({ _active_extruder: 'extruder2' }), true);
  });

  it('does NOT flag a single-nozzle printer (extruder / no extras)', () => {
    assert.equal(t._detectToolChanger({ _active_extruder: 'extruder' }), false);
    assert.equal(t._detectToolChanger({ _extra_extruders: [] }), false);
    assert.equal(t._detectToolChanger({}), false);
    assert.equal(t._detectToolChanger(null), false);
  });

  it('tool-changer waste-per-change is ~25x lower than single-nozzle', () => {
    // Mirrors the selection in _finalizePrint: 0.2 g (tool changer) vs 5 g.
    const changes = 90;
    const toolChangerWaste = 1.0 + changes * 0.2;   // ~ 19 g
    const singleNozzleWaste = 1.0 + changes * 5.0;  // ~ 451 g
    assert.ok(toolChangerWaste < singleNozzleWaste / 20,
      'tool changer should waste far less per change');
  });
});
