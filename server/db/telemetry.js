import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:telemetry');

// ---- Power Readings ----

export function getPowerReading(printId) {
  const db = getDb();
  return db.prepare('SELECT * FROM power_readings WHERE print_id = ?').get(printId) || null;
}

export function getPowerReadings(limit = 20) {
  const db = getDb();
  return db.prepare('SELECT * FROM power_readings ORDER BY started_at DESC LIMIT ?').all(limit);
}

export function upsertPowerReading(printId, startedAt, endedAt, totalWh, avgWatts, peakWatts, durationSeconds, readingCount) {
  const db = getDb();
  const existing = db.prepare('SELECT id, total_wh, peak_watts, duration_seconds, reading_count FROM power_readings WHERE print_id = ?').get(printId);
  if (existing) {
    const newWh = existing.total_wh + totalWh;
    const newPeak = Math.max(existing.peak_watts || 0, peakWatts);
    const newCount = existing.reading_count + readingCount;
    const newDur = (existing.duration_seconds || 0) + durationSeconds;
    const newAvg = newDur > 0 ? Math.round((newWh / (newDur / 3600)) || 0) : 0;
    db.prepare('UPDATE power_readings SET total_wh = ?, avg_watts = ?, peak_watts = ?, ended_at = ?, duration_seconds = ?, reading_count = ? WHERE id = ?')
      .run(newWh, newAvg, newPeak, endedAt, newDur, newCount, existing.id);
  } else {
    db.prepare('INSERT INTO power_readings (print_id, started_at, ended_at, total_wh, avg_watts, peak_watts, duration_seconds, reading_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(printId, startedAt, endedAt, totalWh, avgWatts, peakWatts, durationSeconds, readingCount);
  }
}

// ---- Remote Nodes ----

export function getRemoteNodes() {
  const db = getDb();
  return db.prepare('SELECT * FROM remote_nodes ORDER BY name').all();
}

export function getRemoteNode(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM remote_nodes WHERE id = ?').get(id);
}

export function addRemoteNode(node) {
  const db = getDb();
  const result = db.prepare('INSERT INTO remote_nodes (name, base_url, api_key, enabled) VALUES (?, ?, ?, ?)').run(
    node.name, node.base_url, node.api_key || null, node.enabled !== false ? 1 : 0
  );
  return result.lastInsertRowid;
}

export function updateRemoteNode(id, node) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['name', 'base_url', 'api_key', 'enabled', 'last_seen', 'last_error']) {
    if (node[key] !== undefined) { fields.push(`${key} = ?`); values.push(key === 'enabled' ? (node[key] ? 1 : 0) : node[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE remote_nodes SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteRemoteNode(id) {
  const db = getDb();
  db.prepare('DELETE FROM remote_nodes WHERE id = ?').run(id);
}

// ---- Telemetry ----

export function insertTelemetryBatch(records) {
  const db = getDb();
  const stmt = db.prepare(`INSERT INTO telemetry (printer_id, timestamp, nozzle_temp, bed_temp, chamber_temp,
    nozzle_target, bed_target, fan_cooling, fan_aux, fan_chamber, fan_heatbreak, speed_mag, wifi_signal, print_progress, layer_num, print_stage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const r of records) {
    stmt.run(r.printer_id, r.timestamp, r.nozzle_temp, r.bed_temp, r.chamber_temp,
      r.nozzle_target, r.bed_target, r.fan_cooling, r.fan_aux, r.fan_chamber, r.fan_heatbreak,
      r.speed_mag, r.wifi_signal, r.print_progress, r.layer_num, r.print_stage ?? null);
  }
}

export function getTelemetry(printerId, from, to, resolution = '1m') {
  const db = getDb();
  const bucketExpr = {
    '30s': "strftime('%Y-%m-%d %H:%M:', timestamp) || CASE WHEN CAST(strftime('%S', timestamp) AS INTEGER) < 30 THEN '00' ELSE '30' END",
    '1m':  "strftime('%Y-%m-%d %H:%M:00', timestamp)",
    '5m':  "strftime('%Y-%m-%d %H:', timestamp) || printf('%02d', (CAST(strftime('%M', timestamp) AS INTEGER) / 5) * 5) || ':00'",
    '15m': "strftime('%Y-%m-%d %H:', timestamp) || printf('%02d', (CAST(strftime('%M', timestamp) AS INTEGER) / 15) * 15) || ':00'",
    '1h':  "strftime('%Y-%m-%d %H:00:00', timestamp)"
  };
  const bucket = bucketExpr[resolution] || bucketExpr['1m'];

  return db.prepare(`
    SELECT ${bucket} as time_bucket,
      ROUND(AVG(nozzle_temp), 1) as nozzle_temp,
      ROUND(AVG(bed_temp), 1) as bed_temp,
      ROUND(AVG(chamber_temp), 1) as chamber_temp,
      ROUND(AVG(nozzle_target), 1) as nozzle_target,
      ROUND(AVG(bed_target), 1) as bed_target,
      ROUND(AVG(fan_cooling)) as fan_cooling,
      ROUND(AVG(fan_aux)) as fan_aux,
      ROUND(AVG(fan_chamber)) as fan_chamber,
      ROUND(AVG(fan_heatbreak)) as fan_heatbreak,
      ROUND(AVG(speed_mag)) as speed_mag,
      MAX(wifi_signal) as wifi_signal,
      ROUND(AVG(print_progress)) as print_progress,
      MAX(layer_num) as layer_num
    FROM telemetry
    WHERE printer_id = ? AND timestamp >= ? AND timestamp <= ?
    GROUP BY time_bucket
    ORDER BY time_bucket
  `).all(printerId, from, to);
}

export function purgeTelemetry(retentionDays = 30) {
  const db = getDb();
  return db.prepare("DELETE FROM telemetry WHERE timestamp < datetime('now', '-' || ? || ' days')").run(retentionDays);
}

// ---- Component Wear ----

export function upsertComponentWear(printerId, component, addHours, addCycles = 0) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM component_wear WHERE printer_id = ? AND component = ?').get(printerId, component);
  if (existing) {
    return db.prepare("UPDATE component_wear SET total_hours = total_hours + ?, total_cycles = total_cycles + ?, last_updated = datetime('now') WHERE id = ?")
      .run(addHours, addCycles, existing.id);
  }
  return db.prepare('INSERT INTO component_wear (printer_id, component, total_hours, total_cycles) VALUES (?, ?, ?, ?)')
    .run(printerId, component, addHours, addCycles);
}

export function getComponentWear(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM component_wear WHERE printer_id = ? ORDER BY component').all(printerId);
}

// ---- Firmware History ----

export function addFirmwareEntry(entry) {
  const db = getDb();
  // Avoid duplicate entries for same printer/module/version
  const existing = db.prepare('SELECT id FROM firmware_history WHERE printer_id = ? AND module = ? AND sw_ver = ?')
    .get(entry.printer_id, entry.module, entry.sw_ver);
  if (existing) return;
  return db.prepare('INSERT INTO firmware_history (printer_id, module, sw_ver, hw_ver, sn) VALUES (?, ?, ?, ?, ?)')
    .run(entry.printer_id, entry.module, entry.sw_ver || null, entry.hw_ver || null, entry.sn || null);
}

export function getFirmwareHistory(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM firmware_history WHERE printer_id = ? ORDER BY timestamp DESC').all(printerId);
}

export function getLatestFirmware(printerId) {
  const db = getDb();
  return db.prepare(`SELECT module, sw_ver, hw_ver, sn, MAX(timestamp) as timestamp
    FROM firmware_history WHERE printer_id = ? GROUP BY module ORDER BY module`).all(printerId);
}

// Update the latest entry for a printer+module with available-version info
export function setFirmwareUpdateStatus({ printer_id, module, sw_ver, latest_available, update_available, changelog, release_url, dev_commits_ahead, dev_commits_json }) {
  const db = getDb();
  const checkedAt = new Date().toISOString();
  const devAhead = dev_commits_ahead || 0;
  const devJson = dev_commits_json || null;
  // Ensure a row exists for this printer+module+current version
  const existing = db.prepare('SELECT id FROM firmware_history WHERE printer_id = ? AND module = ? AND sw_ver = ?')
    .get(printer_id, module, sw_ver);
  if (existing) {
    db.prepare(`UPDATE firmware_history SET latest_available = ?, update_available = ?, changelog = ?, release_url = ?, checked_at = ?, dev_commits_ahead = ?, dev_commits_json = ? WHERE id = ?`)
      .run(latest_available || null, update_available ? 1 : 0, changelog || null, release_url || null, checkedAt, devAhead, devJson, existing.id);
  } else {
    db.prepare(`INSERT INTO firmware_history (printer_id, module, sw_ver, latest_available, update_available, changelog, release_url, checked_at, dev_commits_ahead, dev_commits_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(printer_id, module, sw_ver, latest_available || null, update_available ? 1 : 0, changelog || null, release_url || null, checkedAt, devAhead, devJson);
  }
}

// Get all printers with available updates (stable or dev)
export function getAvailableFirmwareUpdates() {
  const db = getDb();
  return db.prepare(`
    SELECT fh.*, p.name as printer_name, p.model, p.type as printer_type
    FROM firmware_history fh
    LEFT JOIN printers p ON fh.printer_id = p.id
    WHERE (fh.update_available = 1 OR fh.dev_commits_ahead > 0)
    AND fh.id IN (
      SELECT MAX(id) FROM firmware_history
      WHERE (update_available = 1 OR dev_commits_ahead > 0)
      GROUP BY printer_id, module
    )
    ORDER BY fh.checked_at DESC
  `).all();
}

// Get firmware status for a specific printer (current + latest)
export function getFirmwareStatus(printerId) {
  const db = getDb();
  return db.prepare(`
    SELECT module, sw_ver as current, latest_available, update_available, changelog, release_url, checked_at
    FROM firmware_history
    WHERE printer_id = ?
    AND id IN (SELECT MAX(id) FROM firmware_history WHERE printer_id = ? GROUP BY module)
    ORDER BY module
  `).all(printerId, printerId);
}

// ---- XCam Events ----

export function addXcamEvent(event) {
  const db = getDb();
  return db.prepare('INSERT INTO xcam_events (printer_id, event_type, action_taken, print_id) VALUES (?, ?, ?, ?)')
    .run(event.printer_id, event.event_type, event.action_taken || null, event.print_id || null);
}

export function getXcamEvents(printerId, limit = 50) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT * FROM xcam_events WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM xcam_events ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function getXcamStats(printerId = null) {
  const db = getDb();
  const where = printerId ? ' WHERE printer_id = ?' : '';
  const params = printerId ? [printerId] : [];
  const total = db.prepare(`SELECT COUNT(*) as count FROM xcam_events${where}`).get(...params);
  const byType = db.prepare(`SELECT event_type, COUNT(*) as count FROM xcam_events${where} GROUP BY event_type`).all(...params);

  const stats = { total: total.count, spaghetti: 0, first_layer: 0, foreign_object: 0, nozzle_clump: 0 };
  for (const row of byType) {
    if (row.event_type === 'spaghetti_detected') stats.spaghetti = row.count;
    else if (row.event_type === 'first_layer_issue') stats.first_layer = row.count;
    else if (row.event_type === 'foreign_object') stats.foreign_object = row.count;
    else if (row.event_type === 'nozzle_clump') stats.nozzle_clump = row.count;
  }
  return stats;
}

// ---- AMS Tray Lifetime ----

export function upsertAmsTrayLifetime(entry) {
  const db = getDb();
  const key = entry.tray_uuid || `pos_${entry.ams_unit}_${entry.tray_id}`;
  const existing = db.prepare('SELECT id, tray_uuid FROM ams_tray_lifetime WHERE printer_id = ? AND ams_unit = ? AND tray_id = ? AND (tray_uuid = ? OR (tray_uuid IS NULL AND ? IS NULL))')
    .get(entry.printer_id, entry.ams_unit, entry.tray_id, key, key);
  if (existing) {
    return db.prepare("UPDATE ams_tray_lifetime SET last_seen = datetime('now'), tray_uuid = COALESCE(?, tray_uuid) WHERE id = ?")
      .run(entry.tray_uuid || null, existing.id);
  }
  return db.prepare('INSERT INTO ams_tray_lifetime (printer_id, ams_unit, tray_id, tray_uuid) VALUES (?, ?, ?, ?)')
    .run(entry.printer_id, entry.ams_unit, entry.tray_id, entry.tray_uuid || null);
}

export function updateAmsTrayFilamentUsed(printerId, amsUnit, trayId, usedG) {
  const db = getDb();
  db.prepare("UPDATE ams_tray_lifetime SET total_filament_used_g = total_filament_used_g + ?, last_seen = datetime('now') WHERE printer_id = ? AND ams_unit = ? AND tray_id = ?")
    .run(usedG, printerId, amsUnit, trayId);
}

export function getAmsTrayLifetime(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM ams_tray_lifetime WHERE printer_id = ? ORDER BY ams_unit, tray_id').all(printerId);
}

// ---- MQTT Debug Log ----

export function addMqttDebugEntry(printerId, direction, topic, payload) {
  const db = getDb();
  db.prepare('INSERT INTO mqtt_debug_log (printer_id, direction, topic, payload) VALUES (?, ?, ?, ?)').run(printerId, direction, topic, payload);
  // Ring buffer: keep max 500 entries per printer
  db.prepare('DELETE FROM mqtt_debug_log WHERE printer_id = ? AND id NOT IN (SELECT id FROM mqtt_debug_log WHERE printer_id = ? ORDER BY id DESC LIMIT 500)').run(printerId, printerId);
}

export function getMqttDebugLog(printerId, limit = 100) {
  const db = getDb();
  return db.prepare('SELECT * FROM mqtt_debug_log WHERE printer_id = ? ORDER BY id DESC LIMIT ?').all(printerId, limit);
}

export function clearMqttDebugLog(printerId) {
  const db = getDb();
  db.prepare('DELETE FROM mqtt_debug_log WHERE printer_id = ?').run(printerId);
}

export function checkFirmwareUpdate(printerId) {
  const db = getDb();
  const modules = db.prepare(`SELECT module, MAX(sw_ver) as current_ver, latest_available, update_available
    FROM firmware_history WHERE printer_id = ? GROUP BY module ORDER BY module`).all(printerId);
  return modules;
}
