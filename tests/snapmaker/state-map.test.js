import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mapSmState, mapFeedState, argbToHex, categoryColor, SM_STATES, SM_FEED_STATES } from '../../server/snapmaker-state-map.js';

describe('Snapmaker State Map', () => {

  describe('mapSmState', () => {
    it('maps IDLE (0) correctly', () => {
      const s = mapSmState(0);
      assert.equal(s.name, 'IDLE');
      assert.equal(s.category, 'idle');
      assert.equal(s.label, 'Idle');
    });

    it('maps PRINTING (1) correctly', () => {
      const s = mapSmState(1);
      assert.equal(s.name, 'PRINTING');
      assert.equal(s.category, 'printing');
    });

    it('maps calibrating states', () => {
      assert.equal(mapSmState(11).category, 'calibrating');
      assert.equal(mapSmState(13).name, 'FLOW_CALIBRATE');
      assert.equal(mapSmState(14).name, 'SHAPER_CALIBRATE');
    });

    it('maps loading/unloading states', () => {
      assert.equal(mapSmState(20).category, 'loading');
      assert.equal(mapSmState(21).category, 'unloading');
    });

    it('maps error states', () => {
      assert.equal(mapSmState(5).category, 'error');
      assert.equal(mapSmState(31).category, 'error');
    });

    it('returns unknown for unmapped codes', () => {
      const s = mapSmState(999);
      assert.equal(s.name, 'UNKNOWN');
      assert.equal(s.category, 'unknown');
      assert.ok(s.label.includes('999'));
    });

    it('all defined states have required fields', () => {
      for (const [code, state] of Object.entries(SM_STATES)) {
        assert.ok(state.name, `state ${code} missing name`);
        assert.ok(state.category, `state ${code} missing category`);
        assert.ok(state.label, `state ${code} missing label`);
      }
    });
  });

  describe('mapFeedState', () => {
    it('maps load_finish correctly', () => {
      const s = mapFeedState('load_finish');
      assert.equal(s.label, 'Loaded');
      assert.equal(s.category, 'idle');
    });

    it('maps loading state', () => {
      assert.equal(mapFeedState('loading').category, 'loading');
    });

    it('maps error state', () => {
      assert.equal(mapFeedState('error').category, 'error');
    });

    it('returns unknown for unmapped states', () => {
      const s = mapFeedState('some_new_state');
      assert.equal(s.category, 'unknown');
    });

    it('all feed states have required fields', () => {
      for (const [key, state] of Object.entries(SM_FEED_STATES)) {
        assert.ok(state.label, `feed state ${key} missing label`);
        assert.ok(state.category, `feed state ${key} missing category`);
      }
    });
  });

  describe('argbToHex', () => {
    it('converts ARGB to CSS hex', () => {
      // 4293058267 = 0xFFE2DEDB → R=0xE2, G=0xDE, B=0xDB
      assert.equal(argbToHex(4293058267), '#e2dedb');
    });

    it('returns gray for 0', () => {
      assert.equal(argbToHex(0), '#808080');
    });

    it('returns gray for null', () => {
      assert.equal(argbToHex(null), '#808080');
    });

    it('converts known green', () => {
      // 0xFF080B0D = ARGB → R=8, G=11, B=13
      const hex = argbToHex(0xFF080B0D);
      assert.equal(hex, '#080b0d');
    });
  });

  describe('categoryColor', () => {
    it('returns green for idle', () => {
      assert.equal(categoryColor('idle'), '#00e676');
    });

    it('returns gray for unknown', () => {
      assert.equal(categoryColor('unknown'), '#888888');
      assert.equal(categoryColor('bogus'), '#888888');
    });
  });
});
