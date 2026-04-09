/**
 * Analytics Module — AWStats-inspired web analytics for 3DPrintForge
 *
 * Captures HTTP request metrics, WebSocket stats, camera bandwidth,
 * user sessions, and printer utilization. Aggregates hourly and daily.
 *
 * Zero external dependencies — uses SQLite via existing db module.
 *
 * SECTION INDEX:
 * Line ~20   Request interceptor (middleware)
 * Line ~80   In-memory buffer + flush
 * Line ~140  WebSocket tracking
 * Line ~170  Camera stream tracking
 * Line ~200  Session tracking
 * Line ~230  User-Agent parsing
 * Line ~270  API: query functions
 * Line ~380  Cleanup / retention
 */

import { getDb } from './db/connection.js';

const log = { info: (...a) => console.log('[analytics]', ...a) };

// ── In-memory buffers ──
let _requestBuffer = [];
let _wsStats = { connections: 0, messagesIn: 0, messagesOut: 0, bytesIn: 0, bytesOut: 0 };
let _cameraStats = {}; // printerId → { streams: 0, bytes: 0 }
let _sessions = new Map(); // ip → { firstSeen, lastSeen, hits, userAgent }
const FLUSH_INTERVAL = 60000; // 60 seconds
let _flushTimer = null;

// ══════════════════════════════════════════
// REQUEST INTERCEPTOR
// ══════════════════════════════════════════

/**
 * Record an HTTP request. Call from handleRequest() in index.js.
 * @param {object} opts
 */
export function recordRequest(opts) {
  const { method, path, status, responseTimeMs, requestSize, responseSize, userAgent, ip, user } = opts;

  // Normalize path (remove IDs to group endpoints)
  const normalizedPath = path
    .replace(/\/\d+/g, '/:id')
    .replace(/\/[a-f0-9-]{36}/g, '/:uuid')
    .replace(/\?.*$/, '');

  _requestBuffer.push({
    ts: Date.now(),
    method: method || 'GET',
    path: normalizedPath,
    status: status || 200,
    responseTimeMs: responseTimeMs || 0,
    requestSize: requestSize || 0,
    responseSize: responseSize || 0,
    ip: ip || '',
    user: user || '',
  });

  // Update session
  _updateSession(ip, userAgent);

  // Parse user-agent for device stats
  if (userAgent) _trackDevice(userAgent);
}

// ══════════════════════════════════════════
// FLUSH TO DATABASE
// ══════════════════════════════════════════

export function startFlushTimer() {
  if (_flushTimer) return;
  _flushTimer = setInterval(() => _flush(), FLUSH_INTERVAL);
  log.info('Analytics flush timer started (60s interval)');
}

export function stopFlushTimer() {
  if (_flushTimer) { clearInterval(_flushTimer); _flushTimer = null; }
}

function _flush() {
  if (_requestBuffer.length === 0) return;

  try {
    const db = getDb();
    const hour = new Date();
    hour.setMinutes(0, 0, 0);
    const hourKey = hour.toISOString();

    // Aggregate buffer into hourly buckets
    const byEndpoint = {};
    let totalRequests = 0, totalErrors = 0, totalBytes = 0, totalTimeMs = 0;

    for (const req of _requestBuffer) {
      totalRequests++;
      totalBytes += (req.requestSize + req.responseSize);
      totalTimeMs += req.responseTimeMs;
      if (req.status >= 400) totalErrors++;

      const key = `${req.method} ${req.path}`;
      if (!byEndpoint[key]) byEndpoint[key] = { hits: 0, errors: 0, totalMs: 0, bytes: 0 };
      byEndpoint[key].hits++;
      if (req.status >= 400) byEndpoint[key].errors++;
      byEndpoint[key].totalMs += req.responseTimeMs;
      byEndpoint[key].bytes += req.responseSize;
    }

    // Upsert hourly aggregate
    db.prepare(`INSERT INTO analytics_hourly (hour, requests, errors, bytes, avg_response_ms, ws_connections, ws_messages, camera_bytes, endpoints_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(hour) DO UPDATE SET
        requests = requests + excluded.requests,
        errors = errors + excluded.errors,
        bytes = bytes + excluded.bytes,
        avg_response_ms = (avg_response_ms + excluded.avg_response_ms) / 2,
        ws_connections = excluded.ws_connections,
        ws_messages = excluded.ws_messages,
        camera_bytes = excluded.camera_bytes,
        endpoints_json = excluded.endpoints_json
    `).run(
      hourKey, totalRequests, totalErrors, totalBytes,
      totalRequests > 0 ? Math.round(totalTimeMs / totalRequests) : 0,
      _wsStats.connections, _wsStats.messagesIn + _wsStats.messagesOut,
      Object.values(_cameraStats).reduce((s, c) => s + c.bytes, 0),
      JSON.stringify(byEndpoint)
    );

    // Flush sessions
    for (const [ip, sess] of _sessions) {
      db.prepare(`INSERT OR REPLACE INTO analytics_sessions (ip, user_agent, first_seen, last_seen, hits, device_type)
        VALUES (?, ?, ?, ?, ?, ?)`).run(
        ip, sess.userAgent || '', sess.firstSeen, sess.lastSeen, sess.hits, sess.deviceType || 'unknown'
      );
    }

    _requestBuffer = [];
  } catch (e) {
    // Non-critical — skip this flush
  }
}

// ══════════════════════════════════════════
// WEBSOCKET TRACKING
// ══════════════════════════════════════════

export function recordWsConnect() { _wsStats.connections++; }
export function recordWsDisconnect() { _wsStats.connections = Math.max(0, _wsStats.connections - 1); }
export function recordWsMessage(direction, bytes) {
  if (direction === 'in') { _wsStats.messagesIn++; _wsStats.bytesIn += bytes; }
  else { _wsStats.messagesOut++; _wsStats.bytesOut += bytes; }
}

export function getWsStats() {
  return { ..._wsStats };
}

// ══════════════════════════════════════════
// CAMERA STREAM TRACKING
// ══════════════════════════════════════════

export function recordCameraStream(printerId, bytes) {
  if (!_cameraStats[printerId]) _cameraStats[printerId] = { streams: 0, bytes: 0 };
  _cameraStats[printerId].bytes += bytes;
}

export function recordCameraStart(printerId) {
  if (!_cameraStats[printerId]) _cameraStats[printerId] = { streams: 0, bytes: 0 };
  _cameraStats[printerId].streams++;
}

export function getCameraStats() {
  return { ..._cameraStats };
}

// ══════════════════════════════════════════
// SESSION TRACKING
// ══════════════════════════════════════════

function _updateSession(ip, userAgent) {
  if (!ip) return;
  const now = new Date().toISOString();
  if (!_sessions.has(ip)) {
    _sessions.set(ip, { firstSeen: now, lastSeen: now, hits: 1, userAgent, deviceType: _parseDeviceType(userAgent) });
  } else {
    const sess = _sessions.get(ip);
    sess.lastSeen = now;
    sess.hits++;
  }
}

// ══════════════════════════════════════════
// USER-AGENT PARSING
// ══════════════════════════════════════════

const _deviceCounts = { desktop: 0, mobile: 0, tablet: 0, bot: 0, unknown: 0 };
const _browserCounts = {};
const _osCounts = {};

function _parseDeviceType(ua) {
  if (!ua) return 'unknown';
  const lower = ua.toLowerCase();
  if (lower.includes('bot') || lower.includes('crawl') || lower.includes('spider')) return 'bot';
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) return 'mobile';
  if (lower.includes('ipad') || lower.includes('tablet')) return 'tablet';
  return 'desktop';
}

function _trackDevice(ua) {
  if (!ua) return;
  const type = _parseDeviceType(ua);
  _deviceCounts[type] = (_deviceCounts[type] || 0) + 1;

  // Browser
  let browser = 'Other';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';
  _browserCounts[browser] = (_browserCounts[browser] || 0) + 1;

  // OS
  let os = 'Other';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  _osCounts[os] = (_osCounts[os] || 0) + 1;
}

// ══════════════════════════════════════════
// QUERY FUNCTIONS (for API endpoints)
// ══════════════════════════════════════════

export function getOverview() {
  try {
    const db = getDb();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const todayStats = db.prepare(`SELECT SUM(requests) as requests, SUM(errors) as errors, SUM(bytes) as bytes, AVG(avg_response_ms) as avg_ms
      FROM analytics_hourly WHERE hour >= ?`).get(todayStr);

    const totalSessions = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM analytics_sessions WHERE last_seen >= ?').get(todayStr);

    return {
      today: {
        requests: todayStats?.requests || 0,
        errors: todayStats?.errors || 0,
        bytes: todayStats?.bytes || 0,
        avgResponseMs: Math.round(todayStats?.avg_ms || 0),
      },
      activeSessions: totalSessions?.count || 0,
      websocket: getWsStats(),
      camera: getCameraStats(),
      devices: { ..._deviceCounts },
      browsers: { ..._browserCounts },
      os: { ..._osCounts },
    };
  } catch { return { today: {}, activeSessions: 0, websocket: {}, camera: {}, devices: {}, browsers: {}, os: {} }; }
}

export function getHourlyStats(days = 7) {
  try {
    const db = getDb();
    const since = new Date(); since.setDate(since.getDate() - days);
    return db.prepare('SELECT * FROM analytics_hourly WHERE hour >= ? ORDER BY hour').all(since.toISOString());
  } catch { return []; }
}

export function getTopEndpoints(limit = 20) {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT endpoints_json FROM analytics_hourly WHERE hour >= datetime("now", "-24 hours")').all();
    const combined = {};
    for (const row of rows) {
      try {
        const endpoints = JSON.parse(row.endpoints_json);
        for (const [key, val] of Object.entries(endpoints)) {
          if (!combined[key]) combined[key] = { hits: 0, errors: 0, avgMs: 0 };
          combined[key].hits += val.hits;
          combined[key].errors += val.errors;
          combined[key].avgMs = Math.round((combined[key].avgMs + (val.totalMs / val.hits)) / 2);
        }
      } catch {}
    }
    return Object.entries(combined)
      .sort((a, b) => b[1].hits - a[1].hits)
      .slice(0, limit)
      .map(([endpoint, stats]) => ({ endpoint, ...stats }));
  } catch { return []; }
}

export function getActiveSessions() {
  try {
    const db = getDb();
    return db.prepare('SELECT * FROM analytics_sessions WHERE last_seen >= datetime("now", "-1 hour") ORDER BY last_seen DESC').all();
  } catch { return []; }
}

export function getErrorBreakdown() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT endpoints_json FROM analytics_hourly WHERE hour >= datetime("now", "-24 hours")').all();
    const errors = {};
    for (const row of rows) {
      try {
        const endpoints = JSON.parse(row.endpoints_json);
        for (const [key, val] of Object.entries(endpoints)) {
          if (val.errors > 0) {
            if (!errors[key]) errors[key] = 0;
            errors[key] += val.errors;
          }
        }
      } catch {}
    }
    return Object.entries(errors).sort((a, b) => b[1] - a[1]).map(([endpoint, count]) => ({ endpoint, count }));
  } catch { return []; }
}

// ══════════════════════════════════════════
// CLEANUP / RETENTION
// ══════════════════════════════════════════

export function cleanup() {
  try {
    const db = getDb();
    // Retain 90 days of hourly data
    db.prepare("DELETE FROM analytics_hourly WHERE hour < datetime('now', '-90 days')").run();
    // Retain 30 days of sessions
    db.prepare("DELETE FROM analytics_sessions WHERE last_seen < datetime('now', '-30 days')").run();
    log.info('Analytics cleanup complete');
  } catch {}
}

// ══════════════════════════════════════════
// DATABASE MIGRATION
// ══════════════════════════════════════════

export function createAnalyticsTables() {
  try {
    const db = getDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS analytics_hourly (
        hour TEXT PRIMARY KEY,
        requests INTEGER DEFAULT 0,
        errors INTEGER DEFAULT 0,
        bytes INTEGER DEFAULT 0,
        avg_response_ms INTEGER DEFAULT 0,
        ws_connections INTEGER DEFAULT 0,
        ws_messages INTEGER DEFAULT 0,
        camera_bytes INTEGER DEFAULT 0,
        endpoints_json TEXT DEFAULT '{}'
      );
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        ip TEXT PRIMARY KEY,
        user_agent TEXT,
        first_seen TEXT,
        last_seen TEXT,
        hits INTEGER DEFAULT 0,
        device_type TEXT DEFAULT 'unknown'
      );
      CREATE INDEX IF NOT EXISTS idx_analytics_hourly_hour ON analytics_hourly(hour);
      CREATE INDEX IF NOT EXISTS idx_analytics_sessions_last ON analytics_sessions(last_seen);
    `);
    log.info('Analytics tables ready');
  } catch (e) {
    log.info('Analytics tables error: ' + e.message);
  }
}
