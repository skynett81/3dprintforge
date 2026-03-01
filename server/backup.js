import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from './config.js';

const DB_PATH = join(DATA_DIR, 'dashboard.db');
const BACKUP_DIR = join(DATA_DIR, 'backups');
const MAX_BACKUPS = 7;

export function createBackup(label = 'manual') {
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
  const filename = `dashboard-${label}-${timestamp}.db`;
  const destPath = join(BACKUP_DIR, filename);
  copyFileSync(DB_PATH, destPath);
  pruneOldBackups();
  const stat = statSync(destPath);
  console.log(`[backup] Backup opprettet: ${filename} (${Math.round(stat.size / 1024)}KB)`);
  return { filename, size: stat.size, created_at: stat.mtime.toISOString() };
}

export function listBackups() {
  if (!existsSync(BACKUP_DIR)) return [];
  return readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.db'))
    .map(f => {
      const stat = statSync(join(BACKUP_DIR, f));
      return { filename: f, size: stat.size, created_at: stat.mtime.toISOString() };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function pruneOldBackups() {
  const backups = listBackups();
  if (backups.length > MAX_BACKUPS) {
    for (const old of backups.slice(MAX_BACKUPS)) {
      try { unlinkSync(join(BACKUP_DIR, old.filename)); } catch {}
    }
  }
}

let _nightlyTimer = null;
export function startNightlyBackup() {
  const msUntil3AM = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(3, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next - now;
  };
  const schedule = () => {
    _nightlyTimer = setTimeout(() => {
      try { createBackup('nightly'); }
      catch (e) { console.error('[backup] Nattlig backup feilet:', e.message); }
      schedule();
    }, msUntil3AM());
  };
  schedule();
  console.log('[backup] Nattlig backup aktivert (kl 03:00)');
}
