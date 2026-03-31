import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:printers');

// ---- Printer CRUD ----

export function getPrinters() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM printers ORDER BY added_at').all();
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    ip: r.ip,
    serial: r.serial,
    accessCode: r.access_code,
    model: r.model,
    type: r.type || null,
    added_at: r.added_at,
    electricity_rate_kwh: r.electricity_rate_kwh,
    printer_wattage: r.printer_wattage,
    machine_cost: r.machine_cost,
    machine_lifetime_hours: r.machine_lifetime_hours
  }));
}

export function addPrinter(p) {
  const db = getDb();
  return db.prepare('INSERT INTO printers (id, name, ip, serial, access_code, model, type) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    p.id, p.name, p.ip || null, p.serial || null, p.accessCode || null, p.model || null, p.type || null
  );
}

export function updatePrinter(id, p) {
  const db = getDb();
  return db.prepare(`UPDATE printers SET name=?, ip=?, serial=?, access_code=?, model=?, type=?,
    electricity_rate_kwh=?, printer_wattage=?, machine_cost=?, machine_lifetime_hours=? WHERE id=?`).run(
    p.name, p.ip || null, p.serial || null, p.accessCode || null, p.model || null, p.type || null,
    p.electricity_rate_kwh ?? null, p.printer_wattage ?? null, p.machine_cost ?? null, p.machine_lifetime_hours ?? null, id
  );
}

export function deletePrinter(id) {
  const db = getDb();
  return db.prepare('DELETE FROM printers WHERE id=?').run(id);
}

// ---- Demo data cleanup ----

export function getDemoPrinterIds() {
  const db = getDb();
  return db.prepare("SELECT id FROM printers WHERE id LIKE 'demo-%'").all().map(r => r.id);
}

export function purgeDemoData() {
  const db = getDb();
  const ids = getDemoPrinterIds();
  if (ids.length === 0) return { deleted: 0 };

  const placeholders = ids.map(() => '?').join(',');
  const tables = [
    'print_history', 'error_log', 'ams_snapshots', 'filament_waste',
    'nozzle_sessions', 'maintenance_log', 'maintenance_schedule',
    'telemetry', 'component_wear', 'firmware_history',
    'xcam_events', 'ams_tray_lifetime', 'filament_inventory',
    'protection_log', 'protection_settings', 'notification_log',
    'notification_queue', 'model_links'
  ];

  let deleted = 0;
  for (const table of tables) {
    try {
      const r = db.prepare(`DELETE FROM ${table} WHERE printer_id IN (${placeholders})`).run(...ids);
      deleted += r.changes;
    } catch { /* table may not exist */ }
  }

  // Delete spools assigned to demo printers + their usage logs and drying sessions
  try {
    const demoSpoolIds = db.prepare(`SELECT id FROM spools WHERE printer_id IN (${placeholders})`).all(...ids).map(r => r.id);
    if (demoSpoolIds.length > 0) {
      const sp = demoSpoolIds.map(() => '?').join(',');
      try { db.prepare(`DELETE FROM spool_usage_log WHERE spool_id IN (${sp})`).run(...demoSpoolIds); } catch (e) { log.debug('Kunne ikke slette spool_usage_log-rader: ' + e.message); }
      try { db.prepare(`DELETE FROM drying_sessions WHERE spool_id IN (${sp})`).run(...demoSpoolIds); } catch (e) { log.debug('Kunne ikke slette drying_sessions-rader: ' + e.message); }
      const r = db.prepare(`DELETE FROM spools WHERE id IN (${sp})`).run(...demoSpoolIds);
      deleted += r.changes;
    }
  } catch (e) { log.warn('Feil ved sletting av spoledata for skrivere: ' + e.message); }

  // Delete the printers themselves
  for (const id of ids) {
    db.prepare('DELETE FROM printers WHERE id = ?').run(id);
  }
  deleted += ids.length;

  return { deleted, printerIds: ids };
}

// ---- Printer Groups ----

export function getPrinterGroups() {
  const db = getDb();
  return db.prepare('SELECT * FROM printer_groups ORDER BY name').all();
}

export function getPrinterGroup(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM printer_groups WHERE id = ?').get(id) || null;
}

export function addPrinterGroup(g) {
  const db = getDb();
  const result = db.prepare('INSERT INTO printer_groups (name, description, parent_id, color, stagger_delay_s, max_concurrent, power_limit_w) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    g.name, g.description || null, g.parent_id || null, g.color || null, g.stagger_delay_s || 0, g.max_concurrent || 0, g.power_limit_w || 0);
  return Number(result.lastInsertRowid);
}

export function updatePrinterGroup(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'parent_id', 'color', 'stagger_delay_s', 'max_concurrent', 'power_limit_w']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE printer_groups SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deletePrinterGroup(id) {
  const db = getDb();
  db.prepare('DELETE FROM printer_group_members WHERE group_id = ?').run(id);
  db.prepare('DELETE FROM printer_groups WHERE id = ?').run(id);
}

export function addPrinterToGroup(groupId, printerId) {
  const db = getDb();
  db.prepare('INSERT OR IGNORE INTO printer_group_members (group_id, printer_id) VALUES (?, ?)').run(groupId, printerId);
}

export function removePrinterFromGroup(groupId, printerId) {
  const db = getDb();
  db.prepare('DELETE FROM printer_group_members WHERE group_id = ? AND printer_id = ?').run(groupId, printerId);
}

export function getGroupMembers(groupId) {
  const db = getDb();
  return db.prepare('SELECT * FROM printer_group_members WHERE group_id = ? ORDER BY sort_order').all(groupId);
}

export function getPrinterGroupsForPrinter(printerId) {
  const db = getDb();
  return db.prepare('SELECT pg.* FROM printer_groups pg JOIN printer_group_members pgm ON pg.id = pgm.group_id WHERE pgm.printer_id = ?').all(printerId);
}

// ---- Printer Capabilities ----

const _capCache = {};
export function getPrinterCapabilities(printerId) {
  const db = getDb();
  if (_capCache[printerId]) return _capCache[printerId];
  const printer = db.prepare('SELECT model FROM printers WHERE id = ?').get(printerId);
  if (!printer?.model) return null;
  const kb = db.prepare('SELECT build_volume, heated_bed_max, nozzle_temp_max, supported_filaments, has_enclosure FROM kb_printers WHERE model = ? OR full_name LIKE ?').get(printer.model, `%${printer.model}%`);
  if (!kb) return null;
  let bv = null;
  if (kb.build_volume) { const m = kb.build_volume.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/i); if (m) bv = { w: parseInt(m[1]), d: parseInt(m[2]), h: parseInt(m[3]) }; }
  const caps = { build_volume: bv, heated_bed_max: kb.heated_bed_max, nozzle_temp_max: kb.nozzle_temp_max, has_enclosure: kb.has_enclosure, supported_filaments: kb.supported_filaments ? JSON.parse(kb.supported_filaments) : [] };
  _capCache[printerId] = caps;
  return caps;
}

// ---- Maintenance Mode ----

export function setMaintenanceMode(printerId, enabled, note) {
  const db = getDb();
  db.prepare('UPDATE printers SET maintenance_mode = ?, maintenance_note = ?, maintenance_since = ? WHERE id = ?')
    .run(enabled ? 1 : 0, note || null, enabled ? new Date().toISOString() : null, printerId);
}

export function getMaintenanceModePrinters() {
  const db = getDb();
  return db.prepare('SELECT id, name, model, maintenance_note, maintenance_since FROM printers WHERE maintenance_mode = 1').all();
}
