// Tiny JSON-catalog cache for static server-side data files (HMS error
// codes, Bambu printer DB, brand profiles, Snapmaker machine defs).
//
// Why a cache: ~9 endpoints read 10-50 KB JSON files and re-parse them on
// every request. The files are checked-in catalogs that don't change at
// runtime — first read pays the disk + parse, subsequent reads return
// the parsed object directly. ~7x faster steady-state for /api/hms-codes.
//
// Why not require()/JSON modules: ESM lacks `require`, and JSON modules
// (--experimental-json-modules) are still flagged. A 30-line cache covers
// the use case without runtime flags.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from './logger.js';

const log = createLogger('json-cache');

const _cache = new Map();
const _SERVER_DIR = dirname(fileURLToPath(import.meta.url));

/** Load a JSON file by absolute path. Cached on first read. Returns the
 *  parsed object on success, null on read/parse error (logged). */
export function loadJson(absPath) {
  let cached = _cache.get(absPath);
  if (cached !== undefined) return cached;
  try {
    cached = JSON.parse(readFileSync(absPath, 'utf8'));
  } catch (e) {
    log.warn(`Could not load JSON ${absPath}: ${e.message}`);
    cached = null;
  }
  _cache.set(absPath, cached);
  return cached;
}

/** Load a JSON file relative to server/ root. Path segments are joined
 *  with `path.join`. Example: `loadServerJson('data', 'bambu-printer-db.json')` */
export function loadServerJson(...parts) {
  return loadJson(join(_SERVER_DIR, ...parts));
}

/** Drop one entry (or all entries) from the cache. Intended for tests
 *  and hot-reload tooling — production shouldn't need this. */
export function invalidateJson(absPath) {
  if (absPath === undefined) _cache.clear();
  else _cache.delete(absPath);
}

/** Cache-Control headers for endpoints returning static-derived JSON.
 *  Browsers keep the response for 24h and `immutable` blocks the
 *  conditional-GET round-trip that would otherwise still hit the network.
 *  Server restart loads fresh JSON, so deploys propagate as TTL expires. */
export const IMMUTABLE_JSON_HEADERS = Object.freeze({ 'Cache-Control': 'public, max-age=86400, immutable' });

/** Convenience: cached HMS error-code catalog (also used directly by the
 *  /api/hms-codes route). Returns {} if the file is missing/unreadable
 *  rather than throwing — endpoints are non-critical. */
export function getHmsCodes() {
  return loadServerJson('hms-codes.json') || {};
}
