/**
 * Bambu Lab state maps — job states, HMS error system, fan IDs
 * Derived from BambuStudio DevStatus, DevHMS, DevFan
 */

// 12 distinct job states (more granular than our 5)
export const BAMBU_JOB_STATES = {
  IDLE: { label: 'Idle', category: 'idle' },
  SLICING: { label: 'Slicing', category: 'preparing' },
  PREPARE: { label: 'Preparing', category: 'preparing' },
  STARTING: { label: 'Starting', category: 'preparing' },
  RUNNING: { label: 'Printing', category: 'printing' },
  PAUSE: { label: 'Paused', category: 'paused' },
  PAUSING: { label: 'Pausing...', category: 'paused' },
  RESUMING: { label: 'Resuming...', category: 'printing' },
  FINISH: { label: 'Finished', category: 'finished' },
  FAILED: { label: 'Failed', category: 'error' },
  FINISHING: { label: 'Finishing...', category: 'finished' },
  STOPPING: { label: 'Stopping...', category: 'idle' },
};

// HMS severity levels
export const HMS_SEVERITY = {
  1: { label: 'Fatal', color: '#ff1744', icon: '🔴' },
  2: { label: 'Serious', color: '#ff5252', icon: '🟠' },
  3: { label: 'Common', color: '#ffab00', icon: '🟡' },
  4: { label: 'Info', color: '#448aff', icon: '🔵' },
};

// HMS module IDs
export const HMS_MODULES = {
  0x01: 'Print Head',
  0x02: 'Motion',
  0x03: 'MC Board',
  0x04: 'Stepper',
  0x05: 'Mainboard',
  0x06: 'Heating',
  0x07: 'AMS',
  0x08: 'Tool Head',
  0x09: 'Bed',
  0x0A: 'Filament',
  0x0B: 'Firmware',
  0x0C: 'X-Cam',
  0x0D: 'Chamber',
  0x0E: 'Nozzle',
  0x0F: 'Network',
  0x10: 'System',
};

// Fan IDs and names
export const BAMBU_FANS = {
  0: { name: 'Heat Break', gcode: 'P0' },
  1: { name: 'Part Cooling', gcode: 'P1' },
  2: { name: 'Aux Cooling', gcode: 'P2' },
  3: { name: 'Chamber', gcode: 'P3' },
  4: { name: 'Heat Break 2', gcode: 'P4' },
  5: { name: 'MC Board', gcode: 'P5' },
  6: { name: 'Inner Loop', gcode: 'P6' },
};

// Air duct modes
export const AIR_DUCT_MODES = {
  0: 'Cooling',
  1: 'Heating',
  2: 'Exhaust',
  3: 'Full Cooling',
};

// AMS status codes
export const AMS_STATUS = {
  0x00: 'Idle',
  0x01: 'Filament Change',
  0x02: 'RFID Identifying',
  0x03: 'Assisting',
  0x04: 'Calibrating',
  0x07: 'Cold Pull',
  0x10: 'Self Check',
  0x20: 'Debug',
};

// Speed levels
export const SPEED_LEVELS = {
  1: { name: 'Silent', percent: 50 },
  2: { name: 'Standard', percent: 100 },
  3: { name: 'Sport', percent: 124 },
  4: { name: 'Ludicrous', percent: 166 },
};

// Nozzle types
export const NOZZLE_TYPES = {
  'hardened_steel': 'Hardened Steel',
  'stainless_steel': 'Stainless Steel',
  'brass': 'Brass',
};

// Storage states
export const STORAGE_STATES = {
  0: 'No SD Card',
  1: 'Normal',
  2: 'Abnormal',
  3: 'Read Only',
};

/**
 * Parse HMS error code into module + severity
 * @param {number} code - HMS error code (e.g. 0x0700_0100)
 * @returns {{ module: string, severity: object, code: number }}
 */
export function parseHmsCode(code) {
  const moduleId = (code >> 24) & 0xFF;
  const severityId = (code >> 16) & 0x0F;
  return {
    module: HMS_MODULES[moduleId] || `Unknown (0x${moduleId.toString(16)})`,
    severity: HMS_SEVERITY[severityId] || HMS_SEVERITY[4],
    code,
    codeHex: '0x' + code.toString(16).padStart(8, '0').toUpperCase(),
  };
}
