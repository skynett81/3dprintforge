// API helpers — JSON response writer + per-IP rate limiters.
//
// Extracted from api-routes.js so they can be unit-tested without
// importing the 14k-line route module (which has heavy side effects:
// DB initialisation, plugin loading, etc.). Pure functions, no global
// state beyond two in-memory rate-limit Maps that auto-prune.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { maybeCompressJson } from './http-compression.js';

const _pkgVersion = (() => {
  try {
    const path = join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
    return JSON.parse(readFileSync(path, 'utf-8')).version;
  } catch { return '0.0.0'; }
})();

/** Send a JSON body. Brotli/gzip-compressed when the client supports it
 *  AND the body is large enough to benefit (see http-compression.js).
 *  Optional `extraHeaders` merge after the defaults but before the
 *  encoding header so a caller can't accidentally suppress Vary. */
export function sendJson(res, data, status = 200, extraHeaders = null) {
  const json = JSON.stringify(data);
  const { body, headers: encHeaders } = maybeCompressJson(json, res.req);
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Version': _pkgVersion,
    ...(extraHeaders || {}),
    ...encHeaders,
  };
  res.writeHead(status, headers);
  res.end(body);
}

// ---- Login rate limiter (per IP, 5 attempts / 15 min) ----
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const _loginAttempts = new Map();

export function checkLoginRate(ip) {
  const now = Date.now();
  const entry = _loginAttempts.get(ip);
  if (!entry || now - entry.firstAttempt > LOGIN_WINDOW_MS) {
    // Hard cap (matches the API limiter) — without it, a botnet
    // scattered across many unique IPs grows the map unbounded until
    // the 5-minute cleanup tick fires.
    if (_loginAttempts.size >= 10000) {
      const oldest = _loginAttempts.keys().next().value;
      if (oldest !== undefined) _loginAttempts.delete(oldest);
    }
    _loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  entry.count++;
  return entry.count <= LOGIN_MAX_ATTEMPTS;
}

// ---- General API rate limiter (per IP, 200 / minute) ----
const API_RATE_MAX = 200;
const API_RATE_WINDOW_MS = 60_000;
const _apiRates = new Map();

export function checkApiRate(ip) {
  const now = Date.now();
  const entry = _apiRates.get(ip);
  if (!entry || now - entry.windowStart > API_RATE_WINDOW_MS) {
    if (_apiRates.size >= 10000) {
      const oldest = _apiRates.keys().next().value;
      if (oldest !== undefined) _apiRates.delete(oldest);
    }
    _apiRates.set(ip, { count: 1, windowStart: now });
    return true;
  }
  entry.count++;
  return entry.count <= API_RATE_MAX;
}

export function getApiRateHeaders(ip) {
  const entry = _apiRates.get(ip);
  if (!entry) return { 'X-RateLimit-Limit': API_RATE_MAX, 'X-RateLimit-Remaining': API_RATE_MAX };
  const remaining = Math.max(0, API_RATE_MAX - entry.count);
  const reset = Math.ceil((entry.windowStart + API_RATE_WINDOW_MS - Date.now()) / 1000);
  return { 'X-RateLimit-Limit': API_RATE_MAX, 'X-RateLimit-Remaining': remaining, 'X-RateLimit-Reset': Math.max(0, reset) };
}

// Test-only: reset both limiters between cases. The map references are
// module-private otherwise.
export function _resetRateLimiters() {
  _loginAttempts.clear();
  _apiRates.clear();
}

// Cleanup stale entries every 5 minutes. unref() so this timer doesn't
// keep the Node process alive on its own (e.g. during test teardown).
const _cleanup = setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of _loginAttempts) {
    if (now - entry.firstAttempt > LOGIN_WINDOW_MS) _loginAttempts.delete(ip);
  }
  for (const [ip, entry] of _apiRates) {
    if (now - entry.windowStart > API_RATE_WINDOW_MS) _apiRates.delete(ip);
  }
}, 5 * 60 * 1000);
if (_cleanup.unref) _cleanup.unref();

export const _internals = { _loginAttempts, _apiRates, LOGIN_MAX_ATTEMPTS, API_RATE_MAX };
