// inventory-qr.js — Inventory Fase 2: assign short QR codes to parts, stock
// items and locations, and resolve a scanned code (or a URL containing one)
// back to the entity + a /v2 navigation hash.

import { randomBytes } from 'node:crypto';
import { getDb } from './db/connection.js';

const PREFIX = { part: 'P', stock: 'S', location: 'L' };
const TABLE = { part: 'parts', stock: 'stock_items', location: 'locations' };

function genCode(type) {
  return (PREFIX[type] || 'X') + randomBytes(4).toString('hex').toUpperCase();
}

/** Assign a code to an entity if it lacks one; idempotent. Returns null if the entity is missing. */
export function ensureQr(type, id) {
  const table = TABLE[type];
  if (!table) return null;
  const db = getDb();
  const row = db.prepare(`SELECT id, qr_uid FROM ${table} WHERE id = ?`).get(id);
  if (!row) return null;
  if (row.qr_uid) return { qr_uid: row.qr_uid };
  let code = genCode(type);
  for (let i = 0; i < 5 && db.prepare(`SELECT 1 FROM ${table} WHERE qr_uid = ?`).get(code); i++) code = genCode(type);
  db.prepare(`UPDATE ${table} SET qr_uid = ? WHERE id = ?`).run(code, id);
  return { qr_uid: code };
}

// Accepts a bare code or a URL (…/qr/CODE) and upper-cases it.
function normalize(code) {
  const s = String(code || '').trim();
  const seg = s.split(/[/?#]/).filter(Boolean).pop() || s;
  return seg.toUpperCase();
}

export function codeToHash(type, id) {
  if (type === 'part') return `#/inventory/parts/${id}`;
  if (type === 'location') return `#/inventory/locations/${id}`;
  if (type === 'stock') return '#/inventory/stock';
  return '#/inventory';
}

export function resolveCode(code) {
  const c = normalize(code);
  if (!c) return null;
  const db = getDb();
  for (const [type, table] of Object.entries(TABLE)) {
    const row = db.prepare(`SELECT * FROM ${table} WHERE qr_uid = ?`).get(c);
    if (row) {
      let name = row.name;
      if (type === 'stock') {
        const part = db.prepare('SELECT name FROM parts WHERE id = ?').get(row.part_id);
        name = part ? part.name : `#${row.id}`;
      }
      return { type, id: row.id, name: name || `#${row.id}`, hash: codeToHash(type, row.id), qr_uid: c };
    }
  }
  return null;
}
