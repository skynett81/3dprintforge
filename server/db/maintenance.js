import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:maintenance');

// ---- Private helpers ----

function seedDefaultSchedule(printerId) {
  const db = getDb();
  const existing = db.prepare('SELECT COUNT(*) as c FROM maintenance_schedule WHERE printer_id = ?').get(printerId);
  if (existing.c > 0) return;
  const defaults = [
    ['nozzle', 100, 'Clean nozzle'],
    ['ptfe_tube', 500, 'Check PTFE tube'],
    ['linear_rods', 200, 'Lubricate rods'],
    ['carbon_rods', 500, 'Inspect carbon rods'],
    ['build_plate', 50, 'Clean build plate'],
    ['general', 1000, 'General maintenance']
  ];
  const stmt = db.prepare('INSERT INTO maintenance_schedule (printer_id, component, interval_hours, label) VALUES (?, ?, ?, ?)');
  for (const [comp, hours, label] of defaults) {
    stmt.run(printerId, comp, hours, label);
  }
}

function estimateNozzleWear(session) {
  if (!session) return null;
  const isHardened = (session.nozzle_type || '').toLowerCase().includes('hardened');
  const baseLife = isHardened ? 1500 : 400;
  const effectiveHours = session.total_print_hours + (session.abrasive_filament_g / 100) * 3;
  const wearPct = Math.min(100, Math.round((effectiveHours / baseLife) * 100));
  let condition = 'good';
  if (wearPct >= 80) condition = 'replace_soon';
  else if (wearPct >= 50) condition = 'worn';
  return { percentage: wearPct, condition, base_life_hours: baseLife };
}

// ---- Nozzle Sessions ----

export function getActiveNozzleSession(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM nozzle_sessions WHERE printer_id = ? AND retired_at IS NULL ORDER BY installed_at DESC LIMIT 1').get(printerId) || null;
}

export function getNozzleSessions(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM nozzle_sessions WHERE printer_id = ? ORDER BY installed_at DESC').all(printerId);
}

export function createNozzleSession(printerId, nozzleType, nozzleDiameter) {
  const db = getDb();
  return db.prepare('INSERT INTO nozzle_sessions (printer_id, nozzle_type, nozzle_diameter) VALUES (?, ?, ?)').run(printerId, nozzleType, nozzleDiameter);
}

export function retireNozzleSession(sessionId) {
  const db = getDb();
  return db.prepare(`UPDATE nozzle_sessions SET retired_at = datetime('now') WHERE id = ?`).run(sessionId);
}

export function updateNozzleSessionCounters(sessionId, hours, filamentG, abrasiveG) {
  const db = getDb();
  return db.prepare('UPDATE nozzle_sessions SET total_print_hours = total_print_hours + ?, total_filament_g = total_filament_g + ?, abrasive_filament_g = abrasive_filament_g + ?, print_count = print_count + 1 WHERE id = ?').run(hours, filamentG, abrasiveG, sessionId);
}

// ---- Maintenance Log & Schedule ----

export function addMaintenanceEvent(event) {
  const db = getDb();
  return db.prepare('INSERT INTO maintenance_log (printer_id, component, action, notes, nozzle_type, nozzle_diameter) VALUES (?, ?, ?, ?, ?, ?)').run(
    event.printer_id, event.component, event.action, event.notes || null, event.nozzle_type || null, event.nozzle_diameter || null
  );
}

export function getMaintenanceLog(printerId, limit = 50) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT * FROM maintenance_log WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM maintenance_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function getMaintenanceSchedule(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM maintenance_schedule WHERE printer_id = ? AND enabled = 1 ORDER BY component').all(printerId);
}

export function upsertMaintenanceSchedule(printerId, component, intervalHours, label) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM maintenance_schedule WHERE printer_id = ? AND component = ?').get(printerId, component);
  if (existing) {
    return db.prepare('UPDATE maintenance_schedule SET interval_hours = ?, label = ? WHERE id = ?').run(intervalHours, label, existing.id);
  }
  return db.prepare('INSERT INTO maintenance_schedule (printer_id, component, interval_hours, label) VALUES (?, ?, ?, ?)').run(printerId, component, intervalHours, label);
}

export function getMaintenanceStatus(printerId) {
  const db = getDb();
  seedDefaultSchedule(printerId);

  const totalHours = db.prepare('SELECT COALESCE(SUM(duration_seconds), 0) / 3600.0 as hours FROM print_history WHERE printer_id = ?').get(printerId);
  const totalPrints = db.prepare('SELECT COUNT(*) as count FROM print_history WHERE printer_id = ?').get(printerId);
  const totalFilament = db.prepare('SELECT COALESCE(SUM(filament_used_g), 0) as grams FROM print_history WHERE printer_id = ?').get(printerId);

  const schedule = getMaintenanceSchedule(printerId);
  const components = [];

  for (const sched of schedule) {
    const lastEvent = db.prepare('SELECT timestamp FROM maintenance_log WHERE printer_id = ? AND component = ? ORDER BY timestamp DESC LIMIT 1').get(printerId, sched.component);

    let hoursSinceMaint = totalHours.hours;
    if (lastEvent) {
      const since = db.prepare('SELECT COALESCE(SUM(duration_seconds), 0) / 3600.0 as hours FROM print_history WHERE printer_id = ? AND started_at > ?').get(printerId, lastEvent.timestamp);
      hoursSinceMaint = since.hours;
    }

    components.push({
      component: sched.component,
      label: sched.label,
      interval_hours: sched.interval_hours,
      hours_since_maintenance: Math.round(hoursSinceMaint * 10) / 10,
      percentage: Math.min(100, Math.round((hoursSinceMaint / sched.interval_hours) * 100)),
      overdue: hoursSinceMaint >= sched.interval_hours,
      last_maintenance: lastEvent?.timestamp || null
    });
  }

  const nozzle = getActiveNozzleSession(printerId);

  return {
    total_print_hours: Math.round(totalHours.hours * 10) / 10,
    total_prints: totalPrints.count,
    total_filament_g: Math.round(totalFilament.grams),
    components,
    active_nozzle: nozzle ? {
      id: nozzle.id,
      type: nozzle.nozzle_type,
      diameter: nozzle.nozzle_diameter,
      installed_at: nozzle.installed_at,
      print_hours: Math.round(nozzle.total_print_hours * 10) / 10,
      filament_g: Math.round(nozzle.total_filament_g),
      abrasive_g: Math.round(nozzle.abrasive_filament_g),
      print_count: nozzle.print_count,
      wear_estimate: estimateNozzleWear(nozzle)
    } : null,
    nozzle_history: getNozzleSessions(printerId)
  };
}

// ---- AMS Snapshots ----

export function addAmsSnapshot(s) {
  const db = getDb();
  return db.prepare(`INSERT INTO ams_snapshots (printer_id, ams_unit, tray_id, tray_type, tray_color, tray_brand, tray_name, remain_pct, humidity, ams_temp,
    tag_uid, tray_uuid, tray_info_idx, tray_weight, tray_diameter, drying_temp, drying_time, nozzle_temp_min, nozzle_temp_max, bed_temp_recommend, k_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    s.printer_id, s.ams_unit, s.tray_id, s.tray_type || null, s.tray_color || null,
    s.tray_brand || null, s.tray_name || null, s.remain_pct ?? null, s.humidity || null, s.ams_temp || null,
    s.tag_uid || null, s.tray_uuid || null, s.tray_info_idx || null,
    s.tray_weight ?? null, s.tray_diameter ?? null,
    s.drying_temp ?? null, s.drying_time ?? null,
    s.nozzle_temp_min ?? null, s.nozzle_temp_max ?? null,
    s.bed_temp_recommend ?? null, s.k_value ?? null
  );
}

export function getAmsStats(printerId) {
  const db = getDb();
  const where = printerId ? ' WHERE printer_id = ?' : '';
  const params = printerId ? [printerId] : [];
  const byBrand = db.prepare(`SELECT tray_brand as brand, tray_type as type, COUNT(DISTINCT timestamp) as uses FROM ams_snapshots${where}${where ? ' AND' : ' WHERE'} tray_brand IS NOT NULL GROUP BY tray_brand, tray_type ORDER BY uses DESC LIMIT 10`).all(...params);
  const humidity = db.prepare(`SELECT ams_unit, ROUND(AVG(CAST(humidity AS REAL)), 1) as avg, ROUND(MIN(CAST(humidity AS REAL)), 1) as min_h, ROUND(MAX(CAST(humidity AS REAL)), 1) as max_h, COUNT(*) as readings FROM ams_snapshots${where}${where ? ' AND' : ' WHERE'} humidity IS NOT NULL GROUP BY ams_unit`).all(...params);
  return { filament_by_brand: byBrand, humidity_by_unit: humidity };
}

// ---- Build Plates ----

export function getBuildPlates(printerId = null) {
  const db = getDb();
  if (printerId) return db.prepare('SELECT * FROM build_plates WHERE printer_id = ? ORDER BY installed_at DESC').all(printerId);
  return db.prepare('SELECT * FROM build_plates ORDER BY printer_id, installed_at DESC').all();
}

export function getBuildPlate(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM build_plates WHERE id = ?').get(id) || null;
}

export function addBuildPlate(bp) {
  const db = getDb();
  const result = db.prepare('INSERT INTO build_plates (printer_id, name, type, material, surface_condition, notes) VALUES (?, ?, ?, ?, ?, ?)').run(
    bp.printer_id, bp.name, bp.type || 'smooth_pei', bp.material || null, bp.surface_condition || 'good', bp.notes || null);
  return Number(result.lastInsertRowid);
}

export function updateBuildPlate(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['name', 'type', 'material', 'surface_condition', 'print_count', 'notes', 'active']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE build_plates SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteBuildPlate(id) {
  const db = getDb();
  db.prepare('DELETE FROM build_plates WHERE id = ?').run(id);
}

export function incrementBuildPlatePrintCount(printerId) {
  const db = getDb();
  db.prepare('UPDATE build_plates SET print_count = print_count + 1 WHERE printer_id = ? AND active = 1').run(printerId);
}

// ---- Dryer Models ----

export function getDryerModels() {
  const db = getDb();
  return db.prepare('SELECT * FROM dryer_models ORDER BY brand, model').all();
}

export function getDryerModel(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM dryer_models WHERE id = ?').get(id) || null;
}

export function addDryerModel(d) {
  const db = getDb();
  const result = db.prepare('INSERT INTO dryer_models (brand, model, max_temp, tray_count, max_spool_diameter, has_humidity_sensor, wattage, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    d.brand, d.model, d.max_temp || null, d.tray_count || 1, d.max_spool_diameter || null, d.has_humidity_sensor ? 1 : 0, d.wattage || null, d.notes || null);
  return Number(result.lastInsertRowid);
}

export function updateDryerModel(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['brand', 'model', 'max_temp', 'tray_count', 'max_spool_diameter', 'has_humidity_sensor', 'wattage', 'notes']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE dryer_models SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteDryerModel(id) {
  const db = getDb();
  db.prepare('DELETE FROM dryer_models WHERE id = ?').run(id);
}

// ---- Storage Conditions ----

export function getStorageConditions(spoolId) {
  const db = getDb();
  return db.prepare('SELECT * FROM storage_conditions WHERE spool_id = ? ORDER BY recorded_at DESC').all(spoolId);
}

export function getLatestStorageCondition(spoolId) {
  const db = getDb();
  return db.prepare('SELECT * FROM storage_conditions WHERE spool_id = ? ORDER BY recorded_at DESC LIMIT 1').get(spoolId) || null;
}

export function addStorageCondition(s) {
  const db = getDb();
  const result = db.prepare('INSERT INTO storage_conditions (spool_id, humidity, temperature, container_type, desiccant_type, desiccant_replaced, sealed, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    s.spool_id, s.humidity || null, s.temperature || null, s.container_type || null, s.desiccant_type || null, s.desiccant_replaced || null, s.sealed ? 1 : 0, s.notes || null);
  return Number(result.lastInsertRowid);
}

export function deleteStorageCondition(id) {
  const db = getDb();
  db.prepare('DELETE FROM storage_conditions WHERE id = ?').run(id);
}

// ── Wear Prediction CRUD ──

export function upsertWearPrediction(data) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM wear_predictions WHERE printer_id = ? AND component = ?').get(data.printer_id, data.component);
  if (existing) {
    db.prepare(`UPDATE wear_predictions SET predicted_failure_at = ?, confidence = ?, hours_remaining = ?, cycles_remaining = ?, based_on_hours = ?, based_on_cycles = ?, calculated_at = datetime('now') WHERE id = ?`).run(
      data.predicted_failure_at || null, data.confidence || 0, data.hours_remaining || 0, data.cycles_remaining || null,
      data.based_on_hours || 0, data.based_on_cycles || null, existing.id
    );
    return existing.id;
  }
  const r = db.prepare(`INSERT INTO wear_predictions (printer_id, component, predicted_failure_at, confidence, hours_remaining, cycles_remaining, based_on_hours, based_on_cycles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    data.printer_id, data.component, data.predicted_failure_at || null, data.confidence || 0,
    data.hours_remaining || 0, data.cycles_remaining || null, data.based_on_hours || 0, data.based_on_cycles || null
  );
  return Number(r.lastInsertRowid);
}

export function getWearPredictions(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM wear_predictions WHERE printer_id = ? ORDER BY hours_remaining ASC').all(printerId);
}

export function getAllWearPredictions() {
  const db = getDb();
  return db.prepare('SELECT * FROM wear_predictions ORDER BY hours_remaining ASC').all();
}

export function addWearAlert(data) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO wear_alerts (printer_id, component, alert_type, message) VALUES (?, ?, ?, ?)`).run(
    data.printer_id, data.component, data.alert_type || 'warning', data.message || ''
  );
  return Number(r.lastInsertRowid);
}

export function getWearAlerts(printerId) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT * FROM wear_alerts WHERE printer_id = ? AND acknowledged = 0 ORDER BY triggered_at DESC').all(printerId);
  }
  return db.prepare('SELECT * FROM wear_alerts WHERE acknowledged = 0 ORDER BY triggered_at DESC').all();
}

export function acknowledgeWearAlert(id) {
  const db = getDb();
  db.prepare('UPDATE wear_alerts SET acknowledged = 1 WHERE id = ?').run(id);
}

export function addMaintenanceCost(data) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO maintenance_costs (printer_id, component, cost, currency, maintenance_log_id) VALUES (?, ?, ?, ?, ?)`).run(
    data.printer_id, data.component, data.cost, data.currency || 'NOK', data.maintenance_log_id || null
  );
  return Number(r.lastInsertRowid);
}

export function getMaintenanceCosts(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM maintenance_costs WHERE printer_id = ? ORDER BY recorded_at DESC').all(printerId);
}

export function getTotalMaintenanceCost(printerId) {
  const db = getDb();
  const row = db.prepare('SELECT COALESCE(SUM(cost), 0) as total, currency FROM maintenance_costs WHERE printer_id = ? GROUP BY currency').get(printerId);
  return row || { total: 0, currency: 'NOK' };
}

// ── Material Recommendations CRUD ──

export function upsertMaterialRecommendation(data) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM material_recommendations WHERE filament_type = ? AND COALESCE(filament_brand, \'\') = COALESCE(?, \'\')').get(data.filament_type, data.filament_brand || null);
  if (existing) {
    db.prepare(`UPDATE material_recommendations SET recommended_nozzle_temp = ?, recommended_bed_temp = ?, recommended_speed_level = ?, success_rate = ?, sample_size = ?, avg_print_time_min = ?, notes = ?, calculated_at = datetime('now') WHERE id = ?`).run(
      data.recommended_nozzle_temp ?? null, data.recommended_bed_temp ?? null, data.recommended_speed_level ?? null,
      data.success_rate ?? null, data.sample_size ?? null, data.avg_print_time_min ?? null, data.notes || null, existing.id
    );
    return existing.id;
  }
  const r = db.prepare(`INSERT INTO material_recommendations (filament_type, filament_brand, recommended_nozzle_temp, recommended_bed_temp, recommended_speed_level, success_rate, sample_size, avg_print_time_min, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    data.filament_type, data.filament_brand || null,
    data.recommended_nozzle_temp ?? null, data.recommended_bed_temp ?? null, data.recommended_speed_level ?? null,
    data.success_rate ?? null, data.sample_size ?? null, data.avg_print_time_min ?? null, data.notes || null
  );
  return Number(r.lastInsertRowid);
}

export function getMaterialRecommendations() {
  const db = getDb();
  return db.prepare('SELECT * FROM material_recommendations ORDER BY success_rate DESC').all();
}

export function getMaterialRecommendation(type, brand) {
  const db = getDb();
  if (brand) {
    return db.prepare('SELECT * FROM material_recommendations WHERE filament_type = ? AND filament_brand = ?').get(type, brand) || null;
  }
  return db.prepare('SELECT * FROM material_recommendations WHERE filament_type = ? AND filament_brand IS NULL').get(type) || null;
}

export function saveMaterialComparison(data) {
  const db = getDb();
  // Delete old comparison for this type+metric, then insert
  db.prepare('DELETE FROM material_comparisons WHERE filament_type = ? AND metric = ?').run(data.filament_type, data.metric);
  const r = db.prepare('INSERT INTO material_comparisons (filament_type, metric, rankings) VALUES (?, ?, ?)').run(
    data.filament_type, data.metric, typeof data.rankings === 'string' ? data.rankings : JSON.stringify(data.rankings)
  );
  return Number(r.lastInsertRowid);
}

export function getMaterialComparisons(type) {
  const db = getDb();
  return db.prepare('SELECT * FROM material_comparisons WHERE filament_type = ? ORDER BY calculated_at DESC').all(type);
}

export function getHistoryForRecommendations() {
  const db = getDb();
  return db.prepare(`SELECT filament_type, filament_brand, status, nozzle_target, bed_target, speed_level, duration_seconds
    FROM print_history WHERE filament_type IS NOT NULL AND filament_type != ''`).all();
}
