/**
 * G-code & M-code reference database.
 *
 * Curated catalog of the most commonly used G-code commands across the
 * Marlin, Klipper, and RepRap firmware families. Entries include:
 *   - description (one line, what the command does)
 *   - parameters (named with brief usage notes)
 *   - example (canonical usage)
 *   - firmwares (which dialect supports it; "all" for shared)
 *   - category (movement / temperature / fan / extruder / setup / tool)
 *
 * Designed so that the UI can render a sortable / searchable table and
 * the editor can show inline tooltips for cursor-position lookup.
 *
 * The dataset is intentionally curated rather than scraped — printer
 * documentation has many fragmented variants and contradictions; we keep
 * the high-signal ~120 entries that cover real-world print files.
 */

const REFERENCE = [
  // ── Movement (G0–G92) ───────────────────────────────────────────────
  { code: 'G0',   category: 'movement',    desc: 'Rapid linear move (non-print). Same as G1 in Marlin/Klipper.',
    params: { X: 'X position', Y: 'Y position', Z: 'Z position', E: 'extruder distance', F: 'feedrate (mm/min)' },
    example: 'G0 X150 Y150 F4800', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'G1',   category: 'movement',    desc: 'Linear move with extrusion.',
    params: { X: 'X', Y: 'Y', Z: 'Z', E: 'extrude length', F: 'feedrate (mm/min)' },
    example: 'G1 X100 Y100 E5.0 F1200', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'G2',   category: 'movement',    desc: 'Clockwise arc move.',
    params: { X: 'end X', Y: 'end Y', I: 'center offset X', J: 'center offset Y', E: 'extrude', F: 'feedrate' },
    example: 'G2 X10 Y10 I5 J0 F1200', firmwares: ['Marlin', 'Klipper'] },
  { code: 'G3',   category: 'movement',    desc: 'Counter-clockwise arc move.',
    params: { X: 'end X', Y: 'end Y', I: 'center offset X', J: 'center offset Y', E: 'extrude', F: 'feedrate' },
    example: 'G3 X10 Y10 I5 J0 F1200', firmwares: ['Marlin', 'Klipper'] },
  { code: 'G4',   category: 'movement',    desc: 'Dwell (pause for a duration).',
    params: { P: 'milliseconds', S: 'seconds' },
    example: 'G4 P500', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'G10',  category: 'extruder',    desc: 'Retract filament (firmware retraction).',
    params: { S: 'optional swap retract' },
    example: 'G10', firmwares: ['Marlin', 'Klipper'] },
  { code: 'G11',  category: 'extruder',    desc: 'Recover filament after retraction.',
    params: {},
    example: 'G11', firmwares: ['Marlin', 'Klipper'] },
  { code: 'G17',  category: 'movement',    desc: 'Select XY plane for arc moves.', params: {}, example: 'G17', firmwares: ['Marlin', 'RepRap'] },
  { code: 'G18',  category: 'movement',    desc: 'Select XZ plane for arc moves.', params: {}, example: 'G18', firmwares: ['Marlin'] },
  { code: 'G19',  category: 'movement',    desc: 'Select YZ plane for arc moves.', params: {}, example: 'G19', firmwares: ['Marlin'] },
  { code: 'G20',  category: 'setup',       desc: 'Set units to inches.', params: {}, example: 'G20', firmwares: ['Marlin', 'RepRap'] },
  { code: 'G21',  category: 'setup',       desc: 'Set units to millimeters.', params: {}, example: 'G21', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'G28',  category: 'movement',    desc: 'Home axes.',
    params: { X: 'home X only', Y: 'home Y only', Z: 'home Z only' },
    example: 'G28 ; home all', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'G29',  category: 'setup',       desc: 'Auto bed leveling (probe grid).',
    params: { S: 'save mesh slot', P: 'mesh density', T: 'topology output' },
    example: 'G29', firmwares: ['Marlin'] },
  { code: 'G30',  category: 'setup',       desc: 'Single Z probe at current position.', params: { X: 'probe X', Y: 'probe Y' },
    example: 'G30 X100 Y100', firmwares: ['Marlin', 'Klipper'] },
  { code: 'G80',  category: 'setup',       desc: 'Cancel mesh bed leveling.', params: {}, example: 'G80', firmwares: ['Marlin'] },
  { code: 'G90',  category: 'setup',       desc: 'Use absolute coordinates.', params: {}, example: 'G90', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'G91',  category: 'setup',       desc: 'Use relative coordinates.', params: {}, example: 'G91', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'G92',  category: 'setup',       desc: 'Set position (offset axes).',
    params: { X: 'set X', Y: 'set Y', Z: 'set Z', E: 'set extruder', '': 'no params resets E to 0' },
    example: 'G92 E0', firmwares: ['Marlin', 'Klipper', 'RepRap'] },

  // ── Temperature (M104–M191) ─────────────────────────────────────────
  { code: 'M104', category: 'temperature', desc: 'Set hotend temperature (no wait).',
    params: { S: 'target °C', T: 'tool index' },
    example: 'M104 S210 T0', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M106', category: 'fan',         desc: 'Set part-cooling fan speed.',
    params: { S: '0–255', P: 'fan index' },
    example: 'M106 S128', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M107', category: 'fan',         desc: 'Turn part-cooling fan off.',
    params: { P: 'fan index' },
    example: 'M107', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M109', category: 'temperature', desc: 'Set hotend temperature and wait.',
    params: { S: 'target °C', R: 'cooling target', T: 'tool index' },
    example: 'M109 S210', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M140', category: 'temperature', desc: 'Set bed temperature (no wait).',
    params: { S: 'target °C' },
    example: 'M140 S60', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M141', category: 'temperature', desc: 'Set chamber temperature.',
    params: { S: 'target °C' },
    example: 'M141 S40', firmwares: ['Marlin', 'RepRap'] },
  { code: 'M190', category: 'temperature', desc: 'Set bed temperature and wait.',
    params: { S: 'target °C', R: 'cooling target' },
    example: 'M190 S60', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M191', category: 'temperature', desc: 'Set chamber temperature and wait.',
    params: { S: 'target °C' },
    example: 'M191 S40', firmwares: ['Marlin', 'RepRap'] },
  { code: 'M155', category: 'temperature', desc: 'Auto-report temperatures every N seconds.',
    params: { S: 'interval seconds (0 = off)' },
    example: 'M155 S2', firmwares: ['Marlin'] },

  // ── Extruder modes ──────────────────────────────────────────────────
  { code: 'M82',  category: 'extruder',    desc: 'Use absolute extruder coordinates.', params: {}, example: 'M82', firmwares: ['Marlin', 'Klipper'] },
  { code: 'M83',  category: 'extruder',    desc: 'Use relative extruder coordinates.', params: {}, example: 'M83', firmwares: ['Marlin', 'Klipper'] },
  { code: 'M204', category: 'movement',    desc: 'Set printing acceleration limits.',
    params: { P: 'print accel', T: 'travel accel', R: 'retract accel', S: 'all (legacy)' },
    example: 'M204 P1500 T3000', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M205', category: 'movement',    desc: 'Set advanced settings (jerk, junction deviation).',
    params: { X: 'X jerk', Y: 'Y jerk', Z: 'Z jerk', E: 'E jerk', J: 'junction deviation' },
    example: 'M205 X10 Y10 Z0.4 E5', firmwares: ['Marlin'] },
  { code: 'M220', category: 'movement',    desc: 'Set feedrate percentage (speed override).',
    params: { S: 'percent (100 = normal)' },
    example: 'M220 S100', firmwares: ['Marlin', 'Klipper'] },
  { code: 'M221', category: 'extruder',    desc: 'Set flow percentage (extrusion override).',
    params: { S: 'percent (100 = normal)', T: 'tool index' },
    example: 'M221 S95', firmwares: ['Marlin', 'Klipper'] },
  { code: 'M900', category: 'extruder',    desc: 'Set linear advance (Marlin) / pressure advance.',
    params: { K: 'K value', T: 'tool index' },
    example: 'M900 K0.04', firmwares: ['Marlin'] },

  // ── Tool changing (multi-extruder) ──────────────────────────────────
  { code: 'T0',   category: 'tool',        desc: 'Select tool 0.', params: {}, example: 'T0', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'T1',   category: 'tool',        desc: 'Select tool 1.', params: {}, example: 'T1', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'T2',   category: 'tool',        desc: 'Select tool 2.', params: {}, example: 'T2', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'T3',   category: 'tool',        desc: 'Select tool 3.', params: {}, example: 'T3', firmwares: ['Marlin', 'Klipper', 'RepRap'] },

  // ── State / housekeeping ────────────────────────────────────────────
  { code: 'M0',   category: 'control',     desc: 'Unconditional stop / wait for user.', params: { S: 'seconds to wait' }, example: 'M0', firmwares: ['Marlin', 'RepRap'] },
  { code: 'M1',   category: 'control',     desc: 'Conditional stop (same as M0 when not in a program).', params: {}, example: 'M1', firmwares: ['Marlin'] },
  { code: 'M17',  category: 'control',     desc: 'Enable stepper motors.', params: { X: 'X', Y: 'Y', Z: 'Z', E: 'E' }, example: 'M17', firmwares: ['Marlin', 'RepRap'] },
  { code: 'M18',  category: 'control',     desc: 'Disable stepper motors (free wheels).', params: {}, example: 'M18', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M84',  category: 'control',     desc: 'Stop idle hold; disable steppers after timeout.', params: { S: 'idle timeout seconds' }, example: 'M84 S60', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M73',  category: 'control',     desc: 'Set print progress %.', params: { P: 'percent', R: 'minutes remaining' }, example: 'M73 P50 R45', firmwares: ['Marlin'] },
  { code: 'M75',  category: 'control',     desc: 'Start print job timer.', params: {}, example: 'M75', firmwares: ['Marlin'] },
  { code: 'M76',  category: 'control',     desc: 'Pause print job timer.', params: {}, example: 'M76', firmwares: ['Marlin'] },
  { code: 'M77',  category: 'control',     desc: 'Stop print job timer.', params: {}, example: 'M77', firmwares: ['Marlin'] },
  { code: 'M115', category: 'control',     desc: 'Get firmware version + capabilities.', params: {}, example: 'M115', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M114', category: 'control',     desc: 'Report current position.', params: {}, example: 'M114', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M119', category: 'control',     desc: 'Report endstop status.', params: {}, example: 'M119', firmwares: ['Marlin', 'Klipper', 'RepRap'] },
  { code: 'M300', category: 'control',     desc: 'Play tone on buzzer.',
    params: { S: 'frequency Hz', P: 'duration ms' },
    example: 'M300 S1000 P200', firmwares: ['Marlin', 'Klipper'] },
  { code: 'M117', category: 'control',     desc: 'Display message on LCD.', params: {}, example: 'M117 Hello', firmwares: ['Marlin', 'Klipper'] },
  { code: 'M118', category: 'control',     desc: 'Echo string back to host.', params: {}, example: 'M118 Layer 5 done', firmwares: ['Marlin'] },

  // ── EEPROM / configuration ──────────────────────────────────────────
  { code: 'M500', category: 'setup',       desc: 'Save current settings to EEPROM.', params: {}, example: 'M500', firmwares: ['Marlin'] },
  { code: 'M501', category: 'setup',       desc: 'Load settings from EEPROM.', params: {}, example: 'M501', firmwares: ['Marlin'] },
  { code: 'M502', category: 'setup',       desc: 'Reset settings to firmware defaults.', params: {}, example: 'M502', firmwares: ['Marlin'] },
  { code: 'M503', category: 'setup',       desc: 'Report current settings.', params: {}, example: 'M503', firmwares: ['Marlin'] },
  { code: 'M851', category: 'setup',       desc: 'Set Z probe offset.', params: { X: 'X offset', Y: 'Y offset', Z: 'Z offset' }, example: 'M851 Z-1.5', firmwares: ['Marlin'] },

  // ── Klipper-specific macros ────────────────────────────────────────
  { code: 'BED_MESH_CALIBRATE', category: 'setup', desc: 'Probe bed mesh (Klipper). Equivalent to G29 on Marlin.',
    params: { PROFILE: 'name (default)', METHOD: 'manual / probe' },
    example: 'BED_MESH_CALIBRATE', firmwares: ['Klipper'] },
  { code: 'BED_MESH_PROFILE', category: 'setup', desc: 'Manage saved bed mesh profiles.',
    params: { LOAD: 'name', SAVE: 'name', REMOVE: 'name' },
    example: 'BED_MESH_PROFILE LOAD=default', firmwares: ['Klipper'] },
  { code: 'PROBE', category: 'setup', desc: 'Trigger probe at current XY (Klipper).', params: {}, example: 'PROBE', firmwares: ['Klipper'] },
  { code: 'SHAPER_CALIBRATE', category: 'setup', desc: 'Run input shaper calibration (Klipper).',
    params: { AXIS: 'X|Y' },
    example: 'SHAPER_CALIBRATE', firmwares: ['Klipper'] },
  { code: 'SET_PRESSURE_ADVANCE', category: 'extruder', desc: 'Set Klipper pressure advance.',
    params: { ADVANCE: 'value', SMOOTH_TIME: 'seconds' },
    example: 'SET_PRESSURE_ADVANCE ADVANCE=0.04', firmwares: ['Klipper'] },
  { code: 'TUNING_TOWER', category: 'setup', desc: 'Modify a setting linearly with Z (calibration helper).',
    params: { COMMAND: 'gcode', PARAMETER: 'param', START: 'start val', FACTOR: 'rate per mm' },
    example: 'TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=0 FACTOR=0.01', firmwares: ['Klipper'] },
  { code: 'SAVE_CONFIG', category: 'setup', desc: 'Save Klipper-side config (calibration results).', params: {}, example: 'SAVE_CONFIG', firmwares: ['Klipper'] },
  { code: 'PAUSE', category: 'control', desc: 'Pause the active print (Klipper).', params: {}, example: 'PAUSE', firmwares: ['Klipper'] },
  { code: 'RESUME', category: 'control', desc: 'Resume from pause.', params: {}, example: 'RESUME', firmwares: ['Klipper'] },
  { code: 'CANCEL_PRINT', category: 'control', desc: 'Cancel the running print.', params: {}, example: 'CANCEL_PRINT', firmwares: ['Klipper'] },
  { code: 'FIRMWARE_RESTART', category: 'control', desc: 'Restart firmware (Klipper).', params: {}, example: 'FIRMWARE_RESTART', firmwares: ['Klipper'] },
  { code: 'SET_GCODE_OFFSET', category: 'setup', desc: 'Set Z baby-step offset.',
    params: { Z: 'offset', Z_ADJUST: 'delta', MOVE: '1 to apply immediately' },
    example: 'SET_GCODE_OFFSET Z_ADJUST=0.05 MOVE=1', firmwares: ['Klipper'] },

  // ── Bambu Lab-specific G-code commands ────────────────────────────
  { code: 'M620', category: 'tool',  desc: 'AMS retract / load command (Bambu).',
    params: { S: 'tray slot', M: 'mode' },
    example: 'M620 S0', firmwares: ['Bambu'] },
  { code: 'M621', category: 'tool',  desc: 'AMS unload command (Bambu).',
    params: { S: 'tray slot' },
    example: 'M621 S0', firmwares: ['Bambu'] },
  { code: 'M622', category: 'tool',  desc: 'Conditional execution (Bambu).',
    params: { J: 'condition', D: 'value' },
    example: 'M622 J1', firmwares: ['Bambu'] },
  { code: 'M623', category: 'tool',  desc: 'Conditional end (Bambu).',
    params: {},
    example: 'M623', firmwares: ['Bambu'] },
  { code: 'M73', category: 'control', desc: 'Set print progress (Bambu / Marlin variant).',
    params: { P: 'percent', R: 'minutes remaining' },
    example: 'M73 P25 R45', firmwares: ['Bambu', 'Marlin'] },

  // ── Misc ──────────────────────────────────────────────────────────
  { code: 'M122', category: 'control', desc: 'TMC stepper diagnostics.', params: { S: 'sensor index' }, example: 'M122', firmwares: ['Marlin', 'Klipper'] },
  { code: 'M150', category: 'control', desc: 'Set RGB / NeoPixel color.',
    params: { R: 'red', U: 'green', B: 'blue', P: 'brightness', I: 'pixel index' },
    example: 'M150 R255 U0 B0', firmwares: ['Marlin'] },
  { code: 'M201', category: 'movement', desc: 'Set max acceleration limits per axis.',
    params: { X: 'X limit', Y: 'Y limit', Z: 'Z limit', E: 'E limit' },
    example: 'M201 X3000 Y3000 Z100', firmwares: ['Marlin', 'RepRap'] },
  { code: 'M203', category: 'movement', desc: 'Set max feedrate per axis.',
    params: { X: 'X', Y: 'Y', Z: 'Z', E: 'E' },
    example: 'M203 X300 Y300 Z5 E25', firmwares: ['Marlin', 'RepRap'] },
  { code: 'M211', category: 'control', desc: 'Enable / disable software endstops.',
    params: { S: '0=off, 1=on' },
    example: 'M211 S1', firmwares: ['Marlin'] },
  { code: 'M412', category: 'control', desc: 'Configure filament runout sensor.',
    params: { S: '0/1', H: 'host handle' },
    example: 'M412 S1', firmwares: ['Marlin'] },
  { code: 'M600', category: 'control', desc: 'Filament change (pause and prompt to swap).',
    params: { X: 'park X', Y: 'park Y', Z: 'park lift', U: 'unload length', L: 'load length' },
    example: 'M600', firmwares: ['Marlin'] },
  { code: 'M601', category: 'control', desc: 'Pause print (filament change variant).', params: {}, example: 'M601', firmwares: ['Marlin'] },
  { code: 'M603', category: 'control', desc: 'Configure filament change parameters.',
    params: { L: 'load length', U: 'unload length' },
    example: 'M603 L150 U450', firmwares: ['Marlin'] },
];

const CATEGORIES = ['movement', 'temperature', 'fan', 'extruder', 'setup', 'tool', 'control'];
const FIRMWARES = ['Marlin', 'Klipper', 'RepRap', 'Bambu'];

/**
 * Return the entire reference table.
 */
export function listReference() {
  return REFERENCE.slice();
}

/**
 * Look up a single command by code (case-insensitive).
 *
 * @param {string} code
 * @returns {object | null}
 */
export function getReference(code) {
  if (!code) return null;
  const u = String(code).toUpperCase();
  return REFERENCE.find(r => r.code.toUpperCase() === u) || null;
}

/**
 * Filter the reference table by free-text query, category, and firmware.
 *
 * @param {{q?: string, category?: string, firmware?: string}} opts
 */
export function searchReference(opts = {}) {
  const q = String(opts.q || '').trim().toLowerCase();
  const cat = String(opts.category || '').trim().toLowerCase();
  const fw = String(opts.firmware || '').trim().toLowerCase();
  return REFERENCE.filter(r => {
    if (cat && r.category.toLowerCase() !== cat) return false;
    if (fw && !r.firmwares.some(f => f.toLowerCase() === fw)) return false;
    if (!q) return true;
    if (r.code.toLowerCase().includes(q)) return true;
    if (r.desc.toLowerCase().includes(q)) return true;
    if (Object.entries(r.params || {}).some(([k, v]) =>
      k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q))) return true;
    return false;
  });
}

export function listCategories() { return CATEGORIES.slice(); }
export function listFirmwares() { return FIRMWARES.slice(); }
