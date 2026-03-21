import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:queue');

// ---- Print Queue ----

export function createQueue(opts) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO print_queue (name, description, status, auto_start, cooldown_seconds, bed_clear_gcode, priority_mode, target_printer_id, created_by, stagger_seconds)
    VALUES (?, ?, 'active', ?, ?, ?, ?, ?, ?, ?)`).run(
    opts.name, opts.description || null, opts.auto_start ? 1 : 0,
    opts.cooldown_seconds || 60, opts.bed_clear_gcode || null,
    opts.priority_mode || 'fifo', opts.target_printer_id || null, opts.created_by || null,
    opts.stagger_seconds || 0
  );
  return r.lastInsertRowid;
}

export function getQueues(status) {
  const db = getDb();
  let sql = `SELECT q.*, (SELECT COUNT(*) FROM queue_items qi WHERE qi.queue_id = q.id) AS item_count,
    (SELECT COUNT(*) FROM queue_items qi WHERE qi.queue_id = q.id AND qi.status = 'completed') AS completed_count,
    (SELECT COUNT(*) FROM queue_items qi WHERE qi.queue_id = q.id AND qi.status = 'printing') AS printing_count
    FROM print_queue q`;
  if (status) {
    sql += ` WHERE q.status = ?`;
    return db.prepare(sql + ' ORDER BY q.created_at DESC').all(status);
  }
  return db.prepare(sql + ' ORDER BY q.created_at DESC').all();
}

export function getQueue(id) {
  const db = getDb();
  const queue = db.prepare('SELECT * FROM print_queue WHERE id = ?').get(id);
  if (!queue) return null;
  queue.items = db.prepare('SELECT * FROM queue_items WHERE queue_id = ? ORDER BY sort_order, priority DESC, added_at').all(id);
  return queue;
}

export function updateQueue(id, opts) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'status', 'priority_mode', 'target_printer_id', 'bed_clear_gcode', 'completed_at']) {
    if (opts[key] !== undefined) { fields.push(`${key} = ?`); values.push(opts[key]); }
  }
  if (opts.auto_start !== undefined) { fields.push('auto_start = ?'); values.push(opts.auto_start ? 1 : 0); }
  if (opts.cooldown_seconds !== undefined) { fields.push('cooldown_seconds = ?'); values.push(opts.cooldown_seconds); }
  if (opts.stagger_seconds !== undefined) { fields.push('stagger_seconds = ?'); values.push(opts.stagger_seconds); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE print_queue SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteQueue(id) {
  const db = getDb();
  db.prepare('DELETE FROM queue_log WHERE queue_id = ?').run(id);
  db.prepare('DELETE FROM queue_items WHERE queue_id = ?').run(id);
  db.prepare('DELETE FROM print_queue WHERE id = ?').run(id);
}

export function addQueueItem(queueId, item) {
  const db = getDb();
  const maxSort = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM queue_items WHERE queue_id = ?').get(queueId);
  const targetPrinters = item.target_printers ? JSON.stringify(item.target_printers) : null;
  const r = db.prepare(`INSERT INTO queue_items (queue_id, filename, printer_id, status, priority, copies, estimated_duration_s, estimated_filament_g, required_material, required_nozzle_mm, notes, sort_order, target_printers)
    VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    queueId, item.filename, item.printer_id || null, item.priority || 0,
    item.copies || 1, item.estimated_duration_s || null, item.estimated_filament_g || null,
    item.required_material || null, item.required_nozzle_mm || null, item.notes || null,
    (maxSort?.m || 0) + 1, targetPrinters
  );
  return r.lastInsertRowid;
}

export function getQueueItem(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM queue_items WHERE id = ?').get(id);
}

export function updateQueueItem(id, opts) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['filename', 'printer_id', 'status', 'notes', 'started_at', 'completed_at']) {
    if (opts[key] !== undefined) { fields.push(`${key} = ?`); values.push(opts[key]); }
  }
  for (const key of ['priority', 'copies', 'copies_completed', 'print_history_id', 'estimated_duration_s', 'sort_order']) {
    if (opts[key] !== undefined) { fields.push(`${key} = ?`); values.push(opts[key]); }
  }
  if (opts.estimated_filament_g !== undefined) { fields.push('estimated_filament_g = ?'); values.push(opts.estimated_filament_g); }
  if (opts.required_material !== undefined) { fields.push('required_material = ?'); values.push(opts.required_material); }
  if (opts.required_nozzle_mm !== undefined) { fields.push('required_nozzle_mm = ?'); values.push(opts.required_nozzle_mm); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE queue_items SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteQueueItem(id) {
  const db = getDb();
  db.prepare('DELETE FROM queue_items WHERE id = ?').run(id);
}

export function reorderQueueItems(queueId, itemIds) {
  const db = getDb();
  const stmt = db.prepare('UPDATE queue_items SET sort_order = ? WHERE id = ? AND queue_id = ?');
  for (let i = 0; i < itemIds.length; i++) {
    stmt.run(i + 1, itemIds[i], queueId);
  }
}

export function getNextPendingItem(queueId, priorityMode) {
  const db = getDb();
  if (priorityMode === 'priority') {
    return db.prepare('SELECT * FROM queue_items WHERE queue_id = ? AND status = ? ORDER BY priority DESC, sort_order, added_at LIMIT 1').get(queueId, 'pending');
  }
  return db.prepare('SELECT * FROM queue_items WHERE queue_id = ? AND status = ? ORDER BY sort_order, added_at LIMIT 1').get(queueId, 'pending');
}

export function getActiveQueueItems() {
  const db = getDb();
  return db.prepare(`SELECT qi.*, pq.name AS queue_name FROM queue_items qi
    JOIN print_queue pq ON qi.queue_id = pq.id
    WHERE qi.status IN ('printing', 'assigned')
    ORDER BY qi.started_at DESC`).all();
}

export function addQueueLog(queueId, itemId, printerId, event, details) {
  const db = getDb();
  db.prepare('INSERT INTO queue_log (queue_id, item_id, printer_id, event, details) VALUES (?, ?, ?, ?, ?)').run(
    queueId, itemId || null, printerId || null, event, details || null
  );
}

export function getQueueLog(queueId, limit = 50) {
  const db = getDb();
  if (queueId) {
    return db.prepare('SELECT * FROM queue_log WHERE queue_id = ? ORDER BY timestamp DESC LIMIT ?').all(queueId, limit);
  }
  return db.prepare('SELECT * FROM queue_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

// ---- Scheduled Prints ----

export function getScheduledPrints(from, to) {
  const db = getDb();
  let sql = 'SELECT * FROM scheduled_prints WHERE 1=1';
  const params = [];
  if (from) { sql += ' AND scheduled_at >= ?'; params.push(from); }
  if (to) { sql += ' AND scheduled_at <= ?'; params.push(to); }
  sql += ' ORDER BY scheduled_at ASC';
  return db.prepare(sql).all(...params);
}

export function getScheduledPrint(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM scheduled_prints WHERE id = ?').get(id);
}

export function addScheduledPrint(sp) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO scheduled_prints (title, filename, printer_id, scheduled_at, repeat_rule, repeat_end, color, notes, status, queue_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    sp.title, sp.filename, sp.printer_id || null, sp.scheduled_at,
    sp.repeat_rule || null, sp.repeat_end || null, sp.color || '#1279ff',
    sp.notes || null, sp.status || 'pending', sp.queue_id || null
  );
  return Number(r.lastInsertRowid);
}

export function updateScheduledPrint(id, sp) {
  const db = getDb();
  const fields = [];
  const vals = [];
  for (const key of ['title', 'filename', 'printer_id', 'scheduled_at', 'repeat_rule', 'repeat_end', 'color', 'notes', 'status', 'queue_id', 'last_run']) {
    if (sp[key] !== undefined) { fields.push(`${key} = ?`); vals.push(sp[key]); }
  }
  if (!fields.length) return;
  vals.push(id);
  db.prepare(`UPDATE scheduled_prints SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
}

export function deleteScheduledPrint(id) {
  const db = getDb();
  db.prepare('DELETE FROM scheduled_prints WHERE id = ?').run(id);
}

// ---- File Library ----

export function getFileLibrary(opts = {}) {
  const db = getDb();
  let sql = 'SELECT * FROM file_library WHERE 1=1';
  const params = [];
  if (opts.category) { sql += ' AND category = ?'; params.push(opts.category); }
  if (opts.file_type) { sql += ' AND file_type = ?'; params.push(opts.file_type); }
  if (opts.search) { sql += ' AND (original_name LIKE ? OR tags LIKE ? OR notes LIKE ?)'; const s = `%${opts.search}%`; params.push(s, s, s); }
  sql += ' ORDER BY added_at DESC';
  if (opts.limit) { sql += ' LIMIT ?'; params.push(opts.limit); }
  if (opts.offset) { sql += ' OFFSET ?'; params.push(opts.offset); }
  return db.prepare(sql).all(...params);
}

export function getFileLibraryItem(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM file_library WHERE id = ?').get(id);
}

export function addFileLibraryItem(item) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO file_library (filename, original_name, file_type, file_size, category, tags, notes, estimated_time_s, estimated_filament_g, filament_type, thumbnail_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    item.filename, item.original_name, item.file_type, item.file_size || 0,
    item.category || 'uncategorized', item.tags || null, item.notes || null,
    item.estimated_time_s || null, item.estimated_filament_g || null,
    item.filament_type || null, item.thumbnail_path || null
  );
  return Number(r.lastInsertRowid);
}

export function updateFileLibraryItem(id, item) {
  const db = getDb();
  const fields = [];
  const vals = [];
  for (const key of ['original_name', 'category', 'tags', 'notes', 'estimated_time_s', 'estimated_filament_g', 'filament_type', 'print_count', 'last_printed', 'thumbnail_path']) {
    if (item[key] !== undefined) { fields.push(`${key} = ?`); vals.push(item[key]); }
  }
  if (!fields.length) return;
  vals.push(id);
  db.prepare(`UPDATE file_library SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
}

export function deleteFileLibraryItem(id) {
  const db = getDb();
  db.prepare('DELETE FROM file_library WHERE id = ?').run(id);
}

export function getFileLibraryCategories() {
  const db = getDb();
  return db.prepare('SELECT category, COUNT(*) as count FROM file_library GROUP BY category ORDER BY count DESC').all();
}

export function incrementFileLibraryPrintCount(id) {
  const db = getDb();
  db.prepare('UPDATE file_library SET print_count = print_count + 1, last_printed = datetime(\'now\') WHERE id = ?').run(id);
}

// ---- Slicer Jobs ----

export function addSlicerJob(data) {
  const db = getDb();
  const result = db.prepare(`INSERT INTO slicer_jobs (printer_id, original_filename, stored_filename, status, slicer_used, file_size, auto_queue, estimated_filament_g, estimated_time_s)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    data.printer_id || null, data.original_filename, data.stored_filename || null,
    data.status || 'uploading', data.slicer_used || null, data.file_size || 0, data.auto_queue ? 1 : 0,
    data.estimated_filament_g || null, data.estimated_time_s || null
  );
  return Number(result.lastInsertRowid);
}

export function getSlicerJobByFilename(filename) {
  const db = getDb();
  return db.prepare('SELECT * FROM slicer_jobs WHERE original_filename = ? ORDER BY created_at DESC LIMIT 1').get(filename) || null;
}

export function updateSlicerJob(id, data) {
  const db = getDb();
  const sets = [];
  const params = [];
  for (const [k, v] of Object.entries(data)) {
    sets.push(`${k} = ?`);
    params.push(v);
  }
  if (!sets.length) return;
  params.push(id);
  db.prepare(`UPDATE slicer_jobs SET ${sets.join(', ')} WHERE id = ?`).run(...params);
}

export function getSlicerJob(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM slicer_jobs WHERE id = ?').get(id) || null;
}

export function getSlicerJobs(limit = 50) {
  const db = getDb();
  return db.prepare('SELECT * FROM slicer_jobs ORDER BY created_at DESC LIMIT ?').all(limit);
}

export function deleteSlicerJob(id) {
  const db = getDb();
  db.prepare('DELETE FROM slicer_jobs WHERE id = ?').run(id);
}
