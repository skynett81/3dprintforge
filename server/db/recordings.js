// Camera video recordings — on-demand MP4 captures of a printer's live camera.
// (Frame-based timelapses live in timelapse_recordings; these are real video.)

import { getDb } from './connection.js';

export function addRecording(rec) {
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO camera_recordings (printer_id, filename, status, print_history_id)
     VALUES (?, ?, 'recording', ?)`
  ).run(rec.printer_id, rec.filename, rec.print_history_id != null ? rec.print_history_id : null);
  return Number(result.lastInsertRowid);
}

// Mark a recording finished (or failed) and store its duration/size.
export function finalizeRecording(id, { duration_s, size_bytes, status = 'done' } = {}) {
  const db = getDb();
  db.prepare(
    `UPDATE camera_recordings SET ended_at = datetime('now'), duration_s = ?, size_bytes = ?, status = ? WHERE id = ?`
  ).run(
    duration_s != null ? Math.round(duration_s) : null,
    size_bytes != null ? Math.round(size_bytes) : null,
    status,
    id
  );
  return getRecording(id);
}

export function getRecordings(filters = {}) {
  const db = getDb();
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.printer_id) { where += ' AND r.printer_id = ?'; params.push(filters.printer_id); }
  if (filters.status) { where += ' AND r.status = ?'; params.push(filters.status); }
  return db.prepare(
    `SELECT r.*, p.name AS printer_name FROM camera_recordings r
     LEFT JOIN printers p ON r.printer_id = p.id${where} ORDER BY r.started_at DESC, r.id DESC`
  ).all(...params);
}

export function getRecording(id) {
  const db = getDb();
  return db.prepare(
    `SELECT r.*, p.name AS printer_name FROM camera_recordings r
     LEFT JOIN printers p ON r.printer_id = p.id WHERE r.id = ?`
  ).get(id) || null;
}

// Remove the DB row and return it so the caller can unlink the file.
export function deleteRecording(id) {
  const db = getDb();
  const row = getRecording(id);
  db.prepare('DELETE FROM camera_recordings WHERE id = ?').run(id);
  return row;
}

// On startup, any recording still marked 'recording' was interrupted by a
// restart/crash — mark it failed so the UI doesn't show a stuck spinner.
export function markStaleRecordingsFailed() {
  const db = getDb();
  return db.prepare("UPDATE camera_recordings SET status = 'failed' WHERE status = 'recording'").run().changes;
}
