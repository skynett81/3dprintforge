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

// Filament feed channel states (from filament_feed module)
export const SM_FEED_STATES = {
  idle: { label: 'Idle', category: 'idle' },
  load_prepare: { label: 'Preparing to load', category: 'loading' },
  loading: { label: 'Loading filament', category: 'loading' },
  load_extrude: { label: 'Extruding', category: 'loading' },
  load_flush: { label: 'Flushing', category: 'loading' },
  load_finish: { label: 'Loaded', category: 'idle' },
  unload_prepare: { label: 'Preparing to unload', category: 'unloading' },
  unloading: { label: 'Unloading filament', category: 'unloading' },
  unload_retract: { label: 'Retracting', category: 'unloading' },
  unload_finish: { label: 'Unloaded', category: 'idle' },
  error: { label: 'Feed Error', category: 'error' },
  heating: { label: 'Heating nozzle', category: 'loading' },
  cooling: { label: 'Cooling down', category: 'unloading' },
  manual_prepare: { label: 'Manual feed ready', category: 'loading' },
  manual_extrude: { label: 'Manual extruding', category: 'loading' },
  manual_flush: { label: 'Manual flushing', category: 'loading' },
  manual_finish: { label: 'Manual feed done', category: 'idle' },
  manual_cancel: { label: 'Manual feed cancelled', category: 'idle' },
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
