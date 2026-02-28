import crypto from 'node:crypto';
import { config } from './config.js';

// In-memory session store: Map<token, { createdAt, username }>
const sessions = new Map();
let _cleanupInterval = null;

export function initAuth() {
  const durationMs = (config.auth?.sessionDurationHours || 24) * 3600000;
  _cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [token, session] of sessions) {
      if (now - session.createdAt > durationMs) {
        sessions.delete(token);
      }
    }
  }, 15 * 60 * 1000);

  if (isAuthEnabled()) {
    console.log('[auth] Authentication enabled');
  }
}

export function shutdownAuth() {
  if (_cleanupInterval) clearInterval(_cleanupInterval);
}

export function isAuthEnabled() {
  if (!config.auth?.enabled) return false;
  // Multi-user mode or legacy single-user mode
  return !!(config.auth.users?.length > 0 || config.auth.password);
}

export function isMultiUser() {
  return !!(config.auth?.users?.length > 0);
}

export function validateCredentials(password, username) {
  if (!isAuthEnabled()) return false;

  // Multi-user mode: check against users array
  if (config.auth.users?.length > 0) {
    return config.auth.users.some(u => u.username === username && u.password === password);
  }

  // Legacy single-user mode
  if (password !== config.auth.password) return false;
  if (config.auth.username && username !== config.auth.username) return false;
  return true;
}

export function createSession(username) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    createdAt: Date.now(),
    username: username || null
  });
  return token;
}

export function validateSession(token) {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;

  const durationMs = (config.auth?.sessionDurationHours || 24) * 3600000;
  if (Date.now() - session.createdAt > durationMs) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token) {
  sessions.delete(token);
}

export function getSessionToken(req) {
  // 1. Check cookie
  const cookies = req.headers.cookie || '';
  const match = cookies.match(/bambu_session=([a-f0-9]{64})/);
  if (match) return match[1];

  // 2. Check query param (for WebSocket or external clients)
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const token = url.searchParams.get('token');
    if (token && /^[a-f0-9]{64}$/.test(token)) return token;
  } catch {}

  return null;
}

// Paths that bypass auth
const PUBLIC_PATHS = new Set([
  '/login.html',
  '/assets/favicon.svg'
]);

export function isPublicPath(pathname) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/api/auth/')) return true;
  return false;
}
