// api-helpers.js — Delte hjelpefunksjoner for API-ruter
// Inneholder: sendJson, readBody, readBinaryBody, _readRawBody, fetchJson, fetchHtml, _escHtml
// og rate limiter logikk brukt på tvers av alle rute-moduler.

import https from 'node:https';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---- API-versjon ----
export const pkgVersion = (() => {
  try {
    return JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf-8')).version;
  } catch {
    return '0.0.0';
  }
})();

// ---- Login rate limiter ----
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutter
const _loginAttempts = new Map(); // ip -> { count, firstAttempt }

export function checkLoginRate(ip) {
  const now = Date.now();
  const entry = _loginAttempts.get(ip);
  if (!entry || now - entry.firstAttempt > LOGIN_WINDOW_MS) {
    _loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  entry.count++;
  return entry.count <= LOGIN_MAX_ATTEMPTS;
}

// Rydd opp utdaterte oppføringer hvert 5. minutt
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of _loginAttempts) {
    if (now - entry.firstAttempt > LOGIN_WINDOW_MS) _loginAttempts.delete(ip);
  }
}, 5 * 60 * 1000);

// ---- Generell API rate limiter ----
const API_RATE_MAX = 200;           // maks forespørsler per vindu
const API_RATE_WINDOW_MS = 60_000;  // 1 minutts vindu
const _apiRates = new Map();        // ip -> { count, windowStart }

export function checkApiRate(ip) {
  const now = Date.now();
  const entry = _apiRates.get(ip);
  if (!entry || now - entry.windowStart > API_RATE_WINDOW_MS) {
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

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of _apiRates) {
    if (now - entry.windowStart > API_RATE_WINDOW_MS) _apiRates.delete(ip);
  }
}, 60_000);

// ---- HTTP-hjelpere ----

export function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'X-API-Version': pkgVersion });
  res.end(JSON.stringify(data));
}

const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10 MB (skjermbilder kan være store)

export function readBody(req, callback) {
  let body = '';
  let size = 0;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > MAX_BODY_SIZE) {
      req.destroy();
      return;
    }
    body += chunk;
  });
  req.on('end', () => {
    if (size > MAX_BODY_SIZE) return;
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      parsed = {};
    }
    callback(parsed);
  });
}

// Binær body-leser (for filopplastinger, 100 MB grense)
const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;
export function readBinaryBody(req, callback) {
  const chunks = [];
  let size = 0;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > MAX_UPLOAD_SIZE) { req.destroy(); return; }
    chunks.push(chunk);
  });
  req.on('end', () => {
    if (size > MAX_UPLOAD_SIZE) return;
    callback(Buffer.concat(chunks));
  });
}

// Rå body-leser (for HMAC signaturverifisering)
export function _readRawBody(req, callback) {
  let body = '';
  let size = 0;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > MAX_BODY_SIZE) { req.destroy(); return; }
    body += chunk;
  });
  req.on('end', () => {
    if (size > MAX_BODY_SIZE) return;
    callback(body);
  });
}

export function fetchJson(url, timeout) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'Accept': 'application/json' },
      timeout
    }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Invalid JSON')); }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

export function fetchHtml(url, timeout) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      },
      timeout,
      maxHeaderSize: 32768
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHtml(res.headers.location, timeout).then(resolve, reject);
      }
      if (res.statusCode !== 200) { res.resume(); reject(new Error(`HTTP ${res.statusCode}`)); return; }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

export function _escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
