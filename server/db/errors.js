import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:errors');

// ---- Errors ----

export function getErrors(limit = 50, printerId = null) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT * FROM error_log WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM error_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function addError(e) {
  const db = getDb();
  const ctx = e.context ? JSON.stringify(e.context) : null;
  return db.prepare('INSERT INTO error_log (printer_id, timestamp, code, message, severity, context) VALUES (?, ?, ?, ?, ?, ?)').run(
    e.printer_id || null, e.timestamp || new Date().toISOString(), e.code, e.message, e.severity, ctx
  );
}

export function acknowledgeError(id) {
  const db = getDb();
  return db.prepare('UPDATE error_log SET acknowledged = 1 WHERE id = ?').run(id);
}

export function deleteError(id) {
  const db = getDb();
  return db.prepare('DELETE FROM error_log WHERE id = ?').run(id);
}

export function acknowledgeAllErrors(printerId = null) {
  const db = getDb();
  if (printerId) {
    return db.prepare('UPDATE error_log SET acknowledged = 1 WHERE printer_id = ? AND acknowledged = 0').run(printerId);
  }
  return db.prepare('UPDATE error_log SET acknowledged = 1 WHERE acknowledged = 0').run();
}

export function deduplicateHmsErrors() {
  const db = getDb();
  const dupes = db.prepare(`
    DELETE FROM error_log WHERE id IN (
      SELECT e.id FROM error_log e
      INNER JOIN (
        SELECT code, printer_id, MIN(id) as keep_id
        FROM error_log
        WHERE code LIKE 'HMS_%'
        GROUP BY code, printer_id
      ) k ON e.code = k.code AND e.printer_id IS k.printer_id AND e.id != k.keep_id
      WHERE e.code LIKE 'HMS_%'
    )
  `).run();
  return dupes.changes;
}

// ---- Protection Settings & Log ----

export function getProtectionSettings(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM protection_settings WHERE printer_id = ?').get(printerId) || null;
}

export function upsertProtectionSettings(printerId, settings) {
  const db = getDb();
  db.prepare(`INSERT INTO protection_settings
    (printer_id, enabled, spaghetti_action, first_layer_action, foreign_object_action, nozzle_clump_action,
     cooldown_seconds, auto_resume, temp_deviation_action, filament_runout_action, print_error_action,
     fan_failure_action, print_stall_action, temp_deviation_threshold, filament_low_pct, stall_minutes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(printer_id) DO UPDATE SET
      enabled = excluded.enabled,
      spaghetti_action = excluded.spaghetti_action,
      first_layer_action = excluded.first_layer_action,
      foreign_object_action = excluded.foreign_object_action,
      nozzle_clump_action = excluded.nozzle_clump_action,
      cooldown_seconds = excluded.cooldown_seconds,
      auto_resume = excluded.auto_resume,
      temp_deviation_action = excluded.temp_deviation_action,
      filament_runout_action = excluded.filament_runout_action,
      print_error_action = excluded.print_error_action,
      fan_failure_action = excluded.fan_failure_action,
      print_stall_action = excluded.print_stall_action,
      temp_deviation_threshold = excluded.temp_deviation_threshold,
      filament_low_pct = excluded.filament_low_pct,
      stall_minutes = excluded.stall_minutes
  `).run(
    printerId,
    settings.enabled ?? 1,
    settings.spaghetti_action || 'pause',
    settings.first_layer_action || 'notify',
    settings.foreign_object_action || 'pause',
    settings.nozzle_clump_action || 'pause',
    settings.cooldown_seconds ?? 60,
    settings.auto_resume ?? 0,
    settings.temp_deviation_action || 'notify',
    settings.filament_runout_action || 'notify',
    settings.print_error_action || 'notify',
    settings.fan_failure_action || 'notify',
    settings.print_stall_action || 'notify',
    settings.temp_deviation_threshold ?? 15,
    settings.filament_low_pct ?? 5,
    settings.stall_minutes ?? 10
  );
}

export function addProtectionLog(entry) {
  const db = getDb();
  return db.prepare(`INSERT INTO protection_log
    (printer_id, event_type, action_taken, print_id, notes)
    VALUES (?, ?, ?, ?, ?)`).run(
    entry.printer_id, entry.event_type, entry.action_taken,
    entry.print_id || null, entry.notes || null
  );
}

export function getProtectionLog(printerId, limit = 50) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT * FROM protection_log WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM protection_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function resolveProtectionAlert(logId) {
  const db = getDb();
  db.prepare("UPDATE protection_log SET resolved = 1, resolved_at = datetime('now') WHERE id = ?").run(logId);
}

export function getActiveAlerts(printerId) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT * FROM protection_log WHERE printer_id = ? AND resolved = 0 ORDER BY timestamp DESC').all(printerId);
  }
  return db.prepare('SELECT * FROM protection_log WHERE resolved = 0 ORDER BY timestamp DESC').all();
}

export function clearProtectionLog(printerId, resolvedOnly) {
  const db = getDb();
  if (printerId && resolvedOnly) {
    db.prepare('DELETE FROM protection_log WHERE printer_id = ? AND resolved = 1').run(printerId);
  } else if (printerId) {
    db.prepare('DELETE FROM protection_log WHERE printer_id = ?').run(printerId);
  } else if (resolvedOnly) {
    db.prepare('DELETE FROM protection_log WHERE resolved = 1').run();
  } else {
    db.prepare('DELETE FROM protection_log').run();
  }
}

// ── Error Patterns CRUD ──

export function saveErrorPattern(data) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO error_patterns (pattern_name, description, error_codes, conditions, frequency, severity, suggestion, confidence, first_seen, last_seen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    data.pattern_name || null, data.description || null,
    typeof data.error_codes === 'string' ? data.error_codes : JSON.stringify(data.error_codes || []),
    typeof data.conditions === 'string' ? data.conditions : JSON.stringify(data.conditions || {}),
    data.frequency ?? 0, data.severity || 'info', data.suggestion || null,
    data.confidence ?? 0, data.first_seen || null, data.last_seen || null
  );
  return Number(r.lastInsertRowid);
}

export function getErrorPatterns() {
  const db = getDb();
  return db.prepare('SELECT * FROM error_patterns ORDER BY frequency DESC, confidence DESC').all();
}

export function getErrorPattern(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM error_patterns WHERE id = ?').get(id) || null;
}

export function clearErrorPatterns() {
  const db = getDb();
  db.prepare('DELETE FROM error_patterns').run();
}

export function saveErrorCorrelation(data) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO error_correlations (error_code, factor, factor_value, correlation_strength, sample_size)
    VALUES (?, ?, ?, ?, ?)`).run(
    data.error_code, data.factor, data.factor_value || null,
    data.correlation_strength ?? 0, data.sample_size ?? 0
  );
  return Number(r.lastInsertRowid);
}

export function getErrorCorrelations(code) {
  const db = getDb();
  if (code) {
    return db.prepare('SELECT * FROM error_correlations WHERE error_code = ? ORDER BY correlation_strength DESC').all(code);
  }
  return db.prepare('SELECT * FROM error_correlations ORDER BY correlation_strength DESC').all();
}

export function clearErrorCorrelations() {
  const db = getDb();
  db.prepare('DELETE FROM error_correlations').run();
}

export function upsertPrinterHealthScore(data) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM printer_health_scores WHERE printer_id = ?').get(data.printer_id);
  if (existing) {
    db.prepare(`UPDATE printer_health_scores SET health_score = ?, error_frequency = ?, mtbf_hours = ?, risk_factors = ?, trend = ?, calculated_at = datetime('now') WHERE id = ?`).run(
      data.health_score ?? 0, data.error_frequency ?? 0, data.mtbf_hours ?? null,
      typeof data.risk_factors === 'string' ? data.risk_factors : JSON.stringify(data.risk_factors || []),
      data.trend || 'stable', existing.id
    );
    return existing.id;
  }
  const r = db.prepare(`INSERT INTO printer_health_scores (printer_id, health_score, error_frequency, mtbf_hours, risk_factors, trend)
    VALUES (?, ?, ?, ?, ?, ?)`).run(
    data.printer_id, data.health_score ?? 0, data.error_frequency ?? 0, data.mtbf_hours ?? null,
    typeof data.risk_factors === 'string' ? data.risk_factors : JSON.stringify(data.risk_factors || []),
    data.trend || 'stable'
  );
  return Number(r.lastInsertRowid);
}

export function getPrinterHealthScores() {
  const db = getDb();
  return db.prepare('SELECT * FROM printer_health_scores ORDER BY health_score ASC').all();
}

export function getPrinterHealthScore(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM printer_health_scores WHERE printer_id = ?').get(printerId) || null;
}

export function getErrorsForAnalysis() {
  const db = getDb();
  return db.prepare(`SELECT e.*, p.name as printer_name FROM error_log e LEFT JOIN printers p ON e.printer_id = p.id ORDER BY e.timestamp DESC`).all();
}

export function getHistoryForErrorAnalysis() {
  const db = getDb();
  return db.prepare(`SELECT printer_id, started_at, finished_at, filename, status, duration_seconds, filament_type, filament_brand, speed_level, nozzle_target, bed_target FROM print_history ORDER BY started_at DESC`).all();
}
