/**
 * AI Forge job repository — CRUD over ai_forge_jobs (migration v133).
 */

import { getDb } from './connection.js';

const COLS = `id, job_type, prompt, params_json, status, result_path,
              result_format, result_size_bytes, repair_report_json,
              error, duration_ms, created_at, completed_at`;

/**
 * Insert a completed or failed job. Returns the inserted row (with id).
 */
export function recordAiForgeJob(rec) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO ai_forge_jobs
      (job_type, prompt, params_json, status, result_path, result_format,
       result_size_bytes, repair_report_json, error, duration_ms, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(
    rec.job_type,
    rec.prompt || null,
    rec.params_json || null,
    rec.status || 'completed',
    rec.result_path || null,
    rec.result_format || null,
    rec.result_size_bytes || null,
    rec.repair_report_json || null,
    rec.error || null,
    rec.duration_ms || null,
  );
  return getAiForgeJob(info.lastInsertRowid);
}

export function getAiForgeJob(id) {
  return getDb().prepare(`SELECT ${COLS} FROM ai_forge_jobs WHERE id = ?`).get(id);
}

export function listAiForgeJobs({ limit = 50, jobType = null } = {}) {
  const db = getDb();
  if (jobType) {
    return db.prepare(`SELECT ${COLS} FROM ai_forge_jobs WHERE job_type = ? ORDER BY id DESC LIMIT ?`)
      .all(jobType, Math.min(200, Math.max(1, limit)));
  }
  return db.prepare(`SELECT ${COLS} FROM ai_forge_jobs ORDER BY id DESC LIMIT ?`)
    .all(Math.min(200, Math.max(1, limit)));
}

export function deleteAiForgeJob(id) {
  const db = getDb();
  const info = db.prepare('DELETE FROM ai_forge_jobs WHERE id = ?').run(id);
  return info.changes > 0;
}
