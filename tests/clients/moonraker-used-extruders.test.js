// moonraker-used-extruders.test.js — deriveUsedExtruders()
//
// Used to populate the Snapmaker U1's print_task_config (SET_PRINT_USED_EXTRUDERS)
// from Moonraker file metadata before a print, so its firmware auto-feed /
// auto-unload / flow-calibration engage.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deriveUsedExtruders } from '../../server/moonraker-client.js';

describe('deriveUsedExtruders', () => {
  it('returns indices with non-zero filament weight (filament_weights array)', () => {
    assert.deepEqual(deriveUsedExtruders({ filament_weights: [12.5, 0, 4.2, 0] }), [0, 2]);
  });

  it('falls back to filament_weight (array)', () => {
    assert.deepEqual(deriveUsedExtruders({ filament_weight: [0, 9] }), [1]);
  });

  it('handles a delimited string of weights', () => {
    assert.deepEqual(deriveUsedExtruders({ filament_weight: '10; 0; 3' }), [0, 2]);
    assert.deepEqual(deriveUsedExtruders({ filament_weight: '5,5' }), [0, 1]);
  });

  it('handles a single number (single-extruder print)', () => {
    assert.deepEqual(deriveUsedExtruders({ filament_weight: 18 }), [0]);
  });

  it('returns [] when usage cannot be determined', () => {
    assert.deepEqual(deriveUsedExtruders(null), []);
    assert.deepEqual(deriveUsedExtruders({}), []);
    assert.deepEqual(deriveUsedExtruders({ filament_weights: [0, 0] }), []);
    assert.deepEqual(deriveUsedExtruders({ filament_weights: 'abc' }), []);
  });
});
