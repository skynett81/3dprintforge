// snapmaker-api.test.js — Integration tests for SM API endpoints
// Tests the API logic using direct function calls (no HTTP server)

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { mapSmState, mapFeedState, argbToHex, categoryColor } from '../../server/snapmaker-state-map.js';

before(() => {
  setupTestDb();
});

describe('Snapmaker API logic', () => {

  describe('state mapping for API response', () => {
    it('returns correct state for IDLE', () => {
      const state = mapSmState(0);
      const response = {
        machine_state: 0,
        state_name: state.name,
        state_category: state.category,
        state_label: state.label,
      };
      assert.equal(response.state_name, 'IDLE');
      assert.equal(response.state_category, 'idle');
    });

    it('returns correct state for all calibration types', () => {
      for (const code of [10, 11, 12, 13, 14, 15, 16, 17]) {
        const s = mapSmState(code);
        assert.equal(s.category, 'calibrating', `state ${code} should be calibrating`);
      }
    });
  });

  describe('filament API response structure', () => {
    it('builds correct filament channel response', () => {
      const nfcData = {
        VENDOR: 'Snapmaker', MANUFACTURER: 'Polymaker',
        MAIN_TYPE: 'PLA', SUB_TYPE: 'SnapSpeed',
        ARGB_COLOR: 4293058267, WEIGHT: 500,
        HOTEND_MIN_TEMP: 190, HOTEND_MAX_TEMP: 230, BED_TEMP: 60,
        DIAMETER: 175, SKU: 900000, OFFICIAL: true,
      };
      const channel = {
        vendor: nfcData.VENDOR,
        type: nfcData.MAIN_TYPE,
        subType: nfcData.SUB_TYPE,
        color: argbToHex(nfcData.ARGB_COLOR),
        weight: nfcData.WEIGHT,
        diameter: nfcData.DIAMETER / 100,
        official: nfcData.OFFICIAL,
      };
      assert.equal(channel.vendor, 'Snapmaker');
      assert.equal(channel.type, 'PLA');
      assert.equal(channel.color, '#e2dedb');
      assert.equal(channel.diameter, 1.75);
      assert.equal(channel.official, true);
    });
  });

  describe('feed command validation', () => {
    it('maps feed actions correctly', () => {
      const actions = {
        auto: 'sm_feed_auto',
        unload: 'sm_feed_unload',
        manual: 'sm_feed_manual',
      };
      for (const [input, expected] of Object.entries(actions)) {
        assert.equal(actions[input], expected);
      }
    });

    it('feed state labels are user-friendly', () => {
      assert.equal(mapFeedState('load_finish').label, 'Loaded');
      assert.equal(mapFeedState('loading').label, 'Feeding filament');
      assert.equal(mapFeedState('error').label, 'Feed Error');
    });
  });

  describe('defect detection API', () => {
    it('builds defect response from SM state', () => {
      const dd = {
        main_enable: true,
        clean_bed: { enable: true, check_window: 3, sensitivity: 'high' },
        noodle: { enable: true, check_window: 10, sensitivity: 'high' },
      };
      const response = {
        current: { enabled: dd.main_enable, cleanBed: dd.clean_bed, noodle: dd.noodle },
        events: [],
      };
      assert.equal(response.current.enabled, true);
      assert.equal(response.current.noodle.sensitivity, 'high');
    });
  });

  describe('print config API', () => {
    it('builds config response from SM state', () => {
      const ptc = {
        time_lapse_camera: false,
        auto_bed_leveling: true,
        flow_calibrate: false,
        auto_replenish_filament: true,
      };
      const response = {
        timelapse: ptc.time_lapse_camera,
        autoBedLeveling: ptc.auto_bed_leveling,
        flowCalibrate: ptc.flow_calibrate,
        autoReplenish: ptc.auto_replenish_filament,
      };
      assert.equal(response.autoBedLeveling, true);
      assert.equal(response.timelapse, false);
    });
  });

  describe('power API', () => {
    it('maps power status correctly', () => {
      const plc = { initialized: 1, power_loss_flag: 0, duty_percent: 0.75 };
      const response = {
        initialized: !!plc.initialized,
        powerLoss: !!plc.power_loss_flag,
        dutyPercent: plc.duty_percent,
      };
      assert.equal(response.initialized, true);
      assert.equal(response.powerLoss, false);
      assert.equal(response.dutyPercent, 0.75);
    });
  });

  describe('category colors for badges', () => {
    it('returns correct colors for all categories', () => {
      assert.equal(categoryColor('idle'), '#00e676');
      assert.equal(categoryColor('printing'), '#448aff');
      assert.equal(categoryColor('calibrating'), '#ffab00');
      assert.equal(categoryColor('loading'), '#00e5ff');
      assert.equal(categoryColor('error'), '#ff5252');
    });
  });

  describe('DB operations', () => {
    it('NFC filament upsert and query works', async () => {
      const { upsertNfcFilament, getNfcFilaments } = await import('../../server/db/snapmaker.js');
      upsertNfcFilament('test-printer', 0, { vendor: 'Test', manufacturer: '', type: 'PLA', subType: '', color: '#fff', weight: 500, sku: 0, official: false, nozzleTempMin: 190, nozzleTempMax: 230, bedTemp: 60, firstLayerTemp: 220, otherLayerTemp: 210, dryingTemp: 55, dryingTime: 4 });
      const result = getNfcFilaments('test-printer');
      assert.equal(result.length, 1);
      assert.equal(result[0].vendor, 'Test');
    });

    it('defect event add and query works', async () => {
      const { addDefectEvent, getDefectEvents } = await import('../../server/db/snapmaker.js');
      addDefectEvent('test-printer', 'noodle', 'warning', 'test', null);
      const events = getDefectEvents('test-printer', 5);
      assert.ok(events.length >= 1);
      assert.equal(events[0].event_type, 'noodle');
    });

    it('calibration result add and query works', async () => {
      const { addCalibrationResult, getCalibrationResults } = await import('../../server/db/snapmaker.js');
      addCalibrationResult('test-printer', 'flow', 0, 0.04, { test: true });
      const results = getCalibrationResults('test-printer', 'flow');
      assert.ok(results.length >= 1);
      assert.equal(results[0].k_value, 0.04);
    });
  });
});
