// accessory-detector.js
// Maps a printer's raw hardware fingerprint to a human-readable list of
// connected accessories. Two sources, both already captured live:
//   - Moonraker/Klipper: the configured object list (state._klipper_objects)
//   - Bambu: the printer model + AMS + camera + chamber from the MQTT state
// Returns: [{ id, name, category, count, detail }] — count groups duplicates
// (e.g. four filament sensors), detail carries the per-unit names.

// Klipper object name -> accessory. Matched against the leading token; the
// remainder (e.g. "cavity" in "temperature_sensor cavity") becomes the detail.
// Order matters — first match wins, so specific patterns precede generic ones.
const KLIPPER_MAP = [
  { re: /^(adxl345|lis2dw|mpu9250|mpu6050|icm20948)\b/, id: 'accelerometer', name: 'Accelerometer', category: 'calibration' },
  { re: /^resonance_tester\b/, id: 'input_shaper', name: 'Input shaper (resonance)', category: 'calibration' },
  { re: /^(beacon|cartographer|eddy)\b/, id: 'eddy_probe', name: 'Eddy-current probe', category: 'probe' },
  { re: /^bltouch\b/, id: 'bltouch', name: 'BLTouch probe', category: 'probe' },
  { re: /^smart_effector\b/, id: 'smart_effector', name: 'Smart Effector', category: 'probe' },
  { re: /^probe\b/, id: 'probe', name: 'Z-probe', category: 'probe' },
  { re: /^bed_mesh\b/, id: 'bed_mesh', name: 'Bed mesh leveling', category: 'leveling' },
  { re: /^quad_gantry_level\b/, id: 'qgl', name: 'Quad gantry level', category: 'leveling' },
  { re: /^z_tilt\b/, id: 'z_tilt', name: 'Z-tilt adjust', category: 'leveling' },
  { re: /^(mmu|ercf|afc|box_turtle|tradrack)\b/, id: 'mmu', name: 'Multi-material unit', category: 'multimaterial' },
  { re: /^filament_entangle_detect\b/, id: 'entangle_sensor', name: 'Filament entangle detector', category: 'filament' },
  { re: /^filament_(switch|motion)_sensor\b/, id: 'filament_sensor', name: 'Filament runout sensor', category: 'filament' },
  { re: /^purifier\b/, id: 'air_purifier', name: 'Air purifier', category: 'air' },
  { re: /^nevermore\b/, id: 'air_filter', name: 'Air filter (Nevermore)', category: 'air' },
  { re: /^defect_detection\b/, id: 'ai_camera', name: 'AI defect detection', category: 'camera' },
  { re: /^heater_generic\b/, id: 'extra_heater', name: 'Auxiliary heater', category: 'thermal' },
  { re: /^temperature_sensor\b/, id: 'temp_sensor', name: 'Temperature sensor', category: 'thermal' },
  { re: /^(neopixel|dotstar|led|pca953|pca9632)\b/, id: 'led', name: 'LED lighting', category: 'lighting' },
  { re: /^controller_fan\b/, id: 'controller_fan', name: 'Controller fan', category: 'cooling' },
  { re: /^heater_fan\b/, id: 'hotend_fan', name: 'Hotend fan', category: 'cooling' },
  { re: /^fan_generic\b/, id: 'aux_fan', name: 'Auxiliary fan', category: 'cooling' },
  { re: /^display\b/, id: 'display', name: 'Display', category: 'ui' },
];

function detectKlipperAccessories(objects) {
  if (!Array.isArray(objects)) return [];
  const groups = new Map(); // id -> { id, name, category, count, detail:[] }
  for (const obj of objects) {
    const name = String(obj || '');
    if (name.startsWith('gcode_macro')) continue; // macros aren't hardware
    for (const m of KLIPPER_MAP) {
      if (m.re.test(name)) {
        const g = groups.get(m.id) || { id: m.id, name: m.name, category: m.category, count: 0, detail: [] };
        g.count++;
        const suffix = name.replace(m.re, '').trim();
        if (suffix) g.detail.push(suffix);
        groups.set(m.id, g);
        break;
      }
    }
  }
  return [...groups.values()];
}

function detectBambuAccessories(state, model) {
  const out = [];
  const s = state || {};
  // AMS units (count + model)
  const amsUnits = (s.ams && Array.isArray(s.ams.ams)) ? s.ams.ams : [];
  if (amsUnits.length > 0) {
    let amsModel = (s._ams_models && s._ams_models[0]?.model) || null;
    if (!amsModel) {
      // Fall back to the live tray data: AMS 2 Pro / HT report humidity_raw (%)
      // and temp; the classic AMS reports only the 1-5 humidity level; AMS Lite
      // has no humidity sensor at all.
      const u0 = amsUnits[0] || {};
      if (u0.humidity_raw != null) amsModel = 'ams_2_pro';
      else if (u0.humidity != null && u0.humidity !== '') amsModel = 'ams';
      else amsModel = (model && model.amsDefault) || 'ams_lite';
    }
    const label = { ams_2_pro: 'AMS 2 Pro', ams_ht: 'AMS HT', ams_lite: 'AMS Lite', ams: 'AMS' }[amsModel] || 'AMS';
    out.push({ id: 'ams', name: label, category: 'multimaterial', count: amsUnits.length, detail: [] });
  }
  // External spool
  if (s.vt_tray && s.vt_tray.tray_type) {
    out.push({ id: 'ext_spool', name: 'External spool', category: 'filament', count: 1, detail: [] });
  }
  // Camera
  if (s.ipcam && (s.ipcam.ipcam_dev === '1' || s.ipcam.mode_bits != null || s.ipcam.ipcam_record)) {
    out.push({ id: 'camera', name: 'Camera', category: 'camera', count: 1, detail: [] });
  }
  // Chamber heater / chamber temperature (H2D and others)
  if (s.chamber_temper != null && s.chamber_temper !== '' && Number(s.chamber_temper) >= 0) {
    out.push({ id: 'chamber', name: 'Heated chamber', category: 'thermal', count: 1, detail: [] });
  }
  // Air filter / purifier (some Bambu report it)
  if (s.air_filter != null || (s.ams_status && s.fan_gear)) { /* covered by model below */ }
  // Nozzle
  if (s.nozzle_diameter || s.nozzle_type) {
    out.push({ id: 'nozzle', name: 'Nozzle', category: 'extruder', count: model?.nozzleCount || 1, detail: [String(s.nozzle_diameter ? s.nozzle_diameter + 'mm' : '') + (s.nozzle_type ? ' ' + s.nozzle_type : '')].filter(x => x.trim()) });
  }
  return out;
}

/**
 * Detect connected accessories for a printer.
 * @param {{ type: string, state: object, model?: object }} ctx
 * @returns {Array<{id,name,category,count,detail}>}
 */
export function detectAccessories(ctx) {
  const { type, state, model } = ctx || {};
  const t = String(type || '').toLowerCase();
  if (t === 'moonraker' || t === 'klipper') {
    return detectKlipperAccessories(state?._klipper_objects);
  }
  if (t === 'bambu' || t === 'mqtt') {
    return detectBambuAccessories(state, model);
  }
  return [];
}

export const _internals = { detectKlipperAccessories, detectBambuAccessories, KLIPPER_MAP };
