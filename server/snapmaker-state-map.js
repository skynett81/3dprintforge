/**
 * Snapmaker U1 Machine State Map
 * Maps integer state codes from machine_state_manager Klipper module
 * to human-readable names, categories, and labels
 */

// Main states from machine_state_manager.main_state
export const SM_STATES = {
  0: { name: 'IDLE', category: 'idle', label: 'Idle' },
  1: { name: 'PRINTING', category: 'printing', label: 'Printing' },
  2: { name: 'PAUSED', category: 'printing', label: 'Paused' },
  3: { name: 'CANCELLED', category: 'idle', label: 'Cancelled' },
  4: { name: 'FINISHED', category: 'idle', label: 'Finished' },
  5: { name: 'ERROR', category: 'error', label: 'Error' },
  10: { name: 'HOMING', category: 'calibrating', label: 'Homing' },
  11: { name: 'BED_LEVELING', category: 'calibrating', label: 'Bed Leveling' },
  12: { name: 'XYZ_CALIBRATE', category: 'calibrating', label: 'XYZ Calibration' },
  13: { name: 'FLOW_CALIBRATE', category: 'calibrating', label: 'Flow Calibration' },
  14: { name: 'SHAPER_CALIBRATE', category: 'calibrating', label: 'Input Shaper Calibration' },
  15: { name: 'SCREWS_TILT', category: 'calibrating', label: 'Screw Tilt Adjustment' },
  16: { name: 'PARK_CALIBRATE', category: 'calibrating', label: 'Park Position Calibration' },
  17: { name: 'HOMING_ORIGIN', category: 'calibrating', label: 'Homing Origin Calibration' },
  20: { name: 'AUTO_LOAD', category: 'loading', label: 'Loading Filament' },
  21: { name: 'AUTO_UNLOAD', category: 'unloading', label: 'Unloading Filament' },
  22: { name: 'MANUAL_LOAD', category: 'loading', label: 'Manual Feed' },
  23: { name: 'REPLENISH', category: 'loading', label: 'Replenishing Filament' },
  30: { name: 'UPGRADING', category: 'maintenance', label: 'Firmware Upgrading' },
  31: { name: 'ABNORMAL', category: 'error', label: 'Abnormal State' },
};

// Action codes (finer-grained sub-states)
export const SM_ACTION_CODES = {
  0: 'idle',
  1: 'homing', 2: 'detect_plate', 3: 'heating',
  4: 'pause', 5: 'resume', 6: 'cancel',
  10: 'pre_extrude', 11: 'clean_nozzle', 12: 'bed_detect',
  13: 'flow_calibrate', 14: 'shaper_calibrate',
  20: 'feed_load', 21: 'feed_unload', 22: 'feed_flush',
  23: 'feed_prepare', 24: 'feed_finish',
  30: 'print_start_line', 31: 'switch_extruder',
  40: 'power_loss_resume', 41: 'reprint',
};

// Filament feed channel states (from u1-klipper filament_feed.py — all 40+ states)
export const SM_FEED_STATES = {
  // Idle states
  idle: { label: 'Idle', category: 'idle' },
  standby: { label: 'Standby', category: 'idle' },

  // Preload (filament detected at port, not yet in extruder)
  preload_prepare: { label: 'Preload: preparing', category: 'loading', step: 1 },
  preload_feeding: { label: 'Preload: feeding to buffer', category: 'loading', step: 2 },
  preload_finish: { label: 'Preload: done', category: 'idle', step: 3 },
  preload_error: { label: 'Preload: error', category: 'error' },

  // Auto-load (full load into extruder + nozzle)
  load_prepare: { label: 'Preparing to load', category: 'loading', step: 1 },
  load_homing: { label: 'Homing extruder', category: 'loading', step: 2 },
  load_picking: { label: 'Picking up tool head', category: 'loading', step: 3 },
  load_heating: { label: 'Heating nozzle', category: 'loading', step: 4 },
  loading: { label: 'Feeding filament', category: 'loading', step: 5 },
  load_extrude: { label: 'Extruding into nozzle', category: 'loading', step: 6 },
  load_flush: { label: 'Flushing old filament', category: 'loading', step: 7 },
  load_verify: { label: 'Verifying feed', category: 'loading', step: 8 },
  load_finish: { label: 'Loaded', category: 'idle', step: 9 },
  load_error: { label: 'Load error', category: 'error' },

  // Auto-unload
  unload_prepare: { label: 'Preparing to unload', category: 'unloading', step: 1 },
  unload_heating: { label: 'Heating for unload', category: 'unloading', step: 2 },
  unloading: { label: 'Retracting filament', category: 'unloading', step: 3 },
  unload_retract: { label: 'Retracting from nozzle', category: 'unloading', step: 4 },
  unload_parking: { label: 'Parking tool head', category: 'unloading', step: 5 },
  unload_finish: { label: 'Unloaded', category: 'idle', step: 6 },
  unload_error: { label: 'Unload error', category: 'error' },

  // Runout handling (during print)
  runout_detected: { label: 'Filament runout!', category: 'error' },
  runout_pause: { label: 'Pausing for runout', category: 'error' },
  runout_unload: { label: 'Removing empty spool', category: 'unloading' },
  runout_wait: { label: 'Insert new filament', category: 'loading' },
  runout_load: { label: 'Loading new spool', category: 'loading' },
  runout_resume: { label: 'Resuming print', category: 'loading' },

  // Manual feed
  manual_prepare: { label: 'Manual: ready', category: 'loading', step: 1 },
  manual_heating: { label: 'Manual: heating', category: 'loading', step: 2 },
  manual_extrude: { label: 'Manual: extruding', category: 'loading', step: 3 },
  manual_flush: { label: 'Manual: flushing', category: 'loading', step: 4 },
  manual_finish: { label: 'Manual: done', category: 'idle', step: 5 },
  manual_cancel: { label: 'Manual: cancelled', category: 'idle' },

  // Error states
  error: { label: 'Feed Error', category: 'error' },
  heating: { label: 'Heating nozzle', category: 'loading' },
  cooling: { label: 'Cooling down', category: 'unloading' },
  motor_error: { label: 'Motor error', category: 'error' },
  tachometer_error: { label: 'Tachometer error', category: 'error' },
  port_not_detected: { label: 'No port detected', category: 'error' },
  filament_stuck: { label: 'Filament stuck', category: 'error' },
};

/**
 * Map a machine state integer to a state object
 * @param {number} stateCode - main_state from machine_state_manager
 * @returns {{ name: string, category: string, label: string }}
 */
export function mapSmState(stateCode) {
  return SM_STATES[stateCode] || { name: 'UNKNOWN', category: 'unknown', label: `Unknown (${stateCode})` };
}

/**
 * Map a feed channel state string to a feed state object
 * @param {string} state - channel_state from filament_feed
 * @returns {{ label: string, category: string }}
 */
export function mapFeedState(state) {
  return SM_FEED_STATES[state] || { label: state || 'Unknown', category: 'unknown' };
}

/**
 * Convert Snapmaker ARGB integer to CSS hex color
 * @param {number} argb - ARGB color value (e.g. 4293058267)
 * @returns {string} CSS hex color (e.g. '#E3A3DB')
 */
export function argbToHex(argb) {
  if (!argb || argb === 0) return '#808080';
  const r = (argb >> 16) & 0xFF;
  const g = (argb >> 8) & 0xFF;
  const b = argb & 0xFF;
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

/**
 * Get category color for status badges
 * @param {string} category
 * @returns {string} CSS color
 */
export function categoryColor(category) {
  const colors = {
    idle: '#00e676',
    printing: '#448aff',
    calibrating: '#ffab00',
    loading: '#00e5ff',
    unloading: '#00e5ff',
    error: '#ff5252',
    maintenance: '#ff9100',
    unknown: '#888888',
  };
  return colors[category] || colors.unknown;
}
