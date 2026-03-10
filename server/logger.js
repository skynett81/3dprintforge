// Structured logger with JSON output support
// Replaces console.log with prefixed, leveled logging

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
let _level = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] || LOG_LEVELS.info;
let _json = process.env.LOG_FORMAT === 'json';

// Event emitter pattern for log streaming
const _listeners = [];

function _ts() {
  return new Date().toISOString();
}

function _fmt(level, prefix, msg, meta) {
  if (_json) {
    const entry = { ts: _ts(), level, prefix, msg };
    if (meta !== undefined) entry.meta = meta;
    return JSON.stringify(entry);
  }
  const tag = prefix ? `[${prefix}] ` : '';
  if (meta !== undefined) {
    return `${tag}${msg} ${typeof meta === 'object' ? JSON.stringify(meta) : meta}`;
  }
  return `${tag}${msg}`;
}

function _log(level, prefix, msg, meta) {
  if (LOG_LEVELS[level] < _level) return;
  const formatted = _fmt(level, prefix, msg, meta);
  if (level === 'error') console.error(formatted);
  else if (level === 'warn') console.warn(formatted);
  else console.log(formatted);

  // Notify listeners
  const ts = _ts();
  for (const fn of _listeners) {
    try { fn({ ts, level, prefix, msg, meta }); } catch (_) {}
  }
}

/**
 * Create a scoped logger with a fixed prefix.
 * @param {string} prefix - Log prefix e.g. 'mqtt', 'queue', 'db'
 * @returns {{ debug, info, warn, error }}
 */
export function createLogger(prefix) {
  return {
    debug: (msg, meta) => _log('debug', prefix, msg, meta),
    info:  (msg, meta) => _log('info',  prefix, msg, meta),
    warn:  (msg, meta) => _log('warn',  prefix, msg, meta),
    error: (msg, meta) => _log('error', prefix, msg, meta),
  };
}

/**
 * Register a log listener.
 * @param {function} fn - Callback receiving { ts, level, prefix, msg, meta }
 */
export function onLog(fn) {
  if (typeof fn === 'function') _listeners.push(fn);
}

/**
 * Unregister a log listener.
 * @param {function} fn
 */
export function offLog(fn) {
  const idx = _listeners.indexOf(fn);
  if (idx !== -1) _listeners.splice(idx, 1);
}

/**
 * Set global log level at runtime.
 * @param {'debug'|'info'|'warn'|'error'} level
 */
export function setLogLevel(level) {
  if (LOG_LEVELS[level] !== undefined) _level = LOG_LEVELS[level];
}

/**
 * Enable/disable JSON log output.
 * @param {boolean} enabled
 */
export function setJsonLogs(enabled) {
  _json = !!enabled;
}
