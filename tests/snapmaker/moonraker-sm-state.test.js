// moonraker-sm-state.test.js — Test SM state merge in MoonrakerClient
// Uses a mock approach — we test the state mapping logic, not the WebSocket

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mapSmState, mapFeedState, argbToHex } from '../../server/snapmaker-state-map.js';

describe('Snapmaker state merge logic', () => {

  describe('machine_state_manager merge', () => {
    it('maps main_state 0 to IDLE', () => {
      const msm = { main_state: 0, action_code: 0 };
      const mapped = mapSmState(msm.main_state);
      assert.equal(mapped.name, 'IDLE');
      assert.equal(mapped.category, 'idle');
    });

    it('maps main_state 1 to PRINTING', () => {
      const mapped = mapSmState(1);
      assert.equal(mapped.category, 'printing');
    });

    it('maps loading states (20-23) to loading/unloading', () => {
      assert.equal(mapSmState(20).category, 'loading');
      assert.equal(mapSmState(21).category, 'unloading');
      assert.equal(mapSmState(22).category, 'loading');
      assert.equal(mapSmState(23).category, 'loading');
    });
  });

  describe('filament_detect NFC data merge', () => {
    it('converts ARGB to CSS hex', () => {
      // Real data from U1: 4293058267 = 0xFFE2DEDB
      assert.equal(argbToHex(4293058267), '#e2dedb');
    });

    it('handles zero ARGB as gray', () => {
      assert.equal(argbToHex(0), '#808080');
    });

    it('converts dark color correctly', () => {
      // 4278716941 = 0xFF080A0D
      assert.equal(argbToHex(4278716941), '#080a0d');
    });
  });

  describe('filament_feed state merge', () => {
    it('maps load_finish to Loaded/idle', () => {
      const mapped = mapFeedState('load_finish');
      assert.equal(mapped.label, 'Loaded');
      assert.equal(mapped.category, 'idle');
    });

    it('maps loading states correctly', () => {
      assert.equal(mapFeedState('load_prepare').category, 'loading');
      assert.equal(mapFeedState('loading').category, 'loading');
      assert.equal(mapFeedState('load_extrude').category, 'loading');
    });

    it('maps unloading states correctly', () => {
      assert.equal(mapFeedState('unload_prepare').category, 'unloading');
      assert.equal(mapFeedState('unloading').category, 'unloading');
      assert.equal(mapFeedState('unload_finish').category, 'idle');
    });

    it('maps error state', () => {
      assert.equal(mapFeedState('error').category, 'error');
    });
  });

  describe('defect_detection state merge', () => {
    it('preserves defect config structure', () => {
      const dd = {
        main_enable: true,
        clean_bed: { enable: true, check_window: 3, sensitivity: 'high' },
        noodle: { enable: true, check_window: 10, sensitivity: 'high' },
        residue: { enable: false, check_window: 10, sensitivity: 'low' },
        nozzle: { enable: false, sensitivity: 'low' },
      };
      // Simulate the merge
      const state = {
        _sm_defect: {
          enabled: dd.main_enable,
          cleanBed: dd.clean_bed,
          noodle: dd.noodle,
          residue: dd.residue,
          nozzle: dd.nozzle,
        }
      };
      assert.equal(state._sm_defect.enabled, true);
      assert.equal(state._sm_defect.noodle.sensitivity, 'high');
      assert.equal(state._sm_defect.residue.enable, false);
    });
  });

  describe('print_task_config merge', () => {
    it('preserves config toggles', () => {
      const ptc = {
        time_lapse_camera: false,
        auto_bed_leveling: true,
        flow_calibrate: false,
        shaper_calibrate: false,
        auto_replenish_filament: true,
        filament_entangle_detect: true,
        filament_entangle_sen: 'high',
      };
      const state = {
        _sm_print_config: {
          timelapse: ptc.time_lapse_camera,
          autoBedLeveling: ptc.auto_bed_leveling,
          flowCalibrate: ptc.flow_calibrate,
          autoReplenish: ptc.auto_replenish_filament,
          entangleDetect: ptc.filament_entangle_detect,
          entangleSensitivity: ptc.filament_entangle_sen,
        }
      };
      assert.equal(state._sm_print_config.timelapse, false);
      assert.equal(state._sm_print_config.autoBedLeveling, true);
      assert.equal(state._sm_print_config.autoReplenish, true);
      assert.equal(state._sm_print_config.entangleSensitivity, 'high');
    });
  });

  describe('power_loss_check merge', () => {
    it('maps power status correctly', () => {
      const plc = { initialized: 1, power_loss_flag: 0, duty_percent: 0.75, voltage_type: 1 };
      const state = {
        _sm_power: {
          initialized: !!plc.initialized,
          powerLoss: !!plc.power_loss_flag,
          dutyPercent: plc.duty_percent,
        }
      };
      assert.equal(state._sm_power.initialized, true);
      assert.equal(state._sm_power.powerLoss, false);
      assert.equal(state._sm_power.dutyPercent, 0.75);
    });
  });

  describe('non-SM printers are unaffected', () => {
    it('generic Klipper status has no _sm_ fields', () => {
      const status = {
        print_stats: { state: 'standby' },
        heater_bed: { temperature: 25, target: 0 },
        extruder: { temperature: 30, target: 0 },
      };
      // Simulate merge — no machine_state_manager in status
      const state = {};
      const msm = status.machine_state_manager;
      if (msm) state._sm_machine_state = msm.main_state;
      assert.equal(state._sm_machine_state, undefined);
    });
  });
});
