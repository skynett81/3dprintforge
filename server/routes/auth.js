// routes/auth.js — Roller, brukere, API-nøkler, auth-konfig, TOTP 2FA
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getRoles, getRole, addRole, updateRole, deleteRole,
  getUsers, getUser, addUser, updateUser, deleteUser,
  getApiKeys, addApiKey, deleteApiKey, deactivateApiKey,
  getNotificationLog, getUpdateHistory
} from '../database.js';
import { hashPassword, generateApiKey, isAuthEnabled } from '../auth.js';
import { config, saveConfig } from '../config.js';
import { sendJson, readBody } from '../api-helpers.js';
import { createLogger } from '../logger.js';
import { randomBytes, createHmac } from 'node:crypto';
import { validate } from '../validate.js';

// ---- Validation Schemas ----
const ROLE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const USER_CREATE_SCHEMA = {
  username: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  password: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const USER_UPDATE_SCHEMA = {
  username: { type: 'string', minLength: 1, maxLength: 100 },
  password: { type: 'string', minLength: 1, maxLength: 200 },
  display_name: { type: 'string', maxLength: 100 }
};

const API_KEY_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const TOTP_ENABLE_SCHEMA = {
  secret: { type: 'string', required: true, minLength: 1 },
  code: { required: true }
};

const NOTIFICATION_TEST_SCHEMA = {
  channel: { type: 'string', required: true, minLength: 1 },
  config: { required: true }
};

const log = createLogger('route:auth');

// TOTP-hjelper (inline siden den er enkel og ikke avhenger av tredjepart)
function _generateTotpSecret(buffer) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const byte of buffer) bits += byte.toString(2).padStart(8, '0');
  let secret = '';
  for (let i = 0; i + 5 <= bits.length; i += 5) secret += alphabet[parseInt(bits.substring(i, i + 5), 2)];
  return secret;
}

function _verifyTotp(secret, code, window = 1) {
  const epoch = Math.floor(Date.now() / 1000);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const c of secret.toUpperCase()) {
    const idx = alphabet.indexOf(c);
    if (idx >= 0) bits += idx.toString(2).padStart(5, '0');
  }
  const keyBytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) keyBytes.push(parseInt(bits.substring(i, i + 8), 2));
  const key = Buffer.from(keyBytes);

  for (let i = -window; i <= window; i++) {
    const counter = Math.floor(epoch / 30) + i;
    const buf = Buffer.alloc(8);
    buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
    buf.writeUInt32BE(counter & 0xFFFFFFFF, 4);
    const h = createHmac('sha1', key).update(buf).digest();
    const offset = h[h.length - 1] & 0x0F;
    const otp = ((h[offset] & 0x7F) << 24 | h[offset + 1] << 16 | h[offset + 2] << 8 | h[offset + 3]) % 1000000;
    if (String(otp).padStart(6, '0') === String(code).padStart(6, '0')) return true;
  }
  return false;
}

export async function handleAuthRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Auth Config ----
  if (method === 'GET' && path === '/api/auth/config') {
    const ac = structuredClone(config.auth || {});
    if (ac.password) ac.password = '***';
    if (ac.users) {
      ac.users = ac.users.map(u => ({ username: u.username, password: '***' }));
    }
    ac.envManaged = !!(process.env.BAMBU_AUTH_PASSWORD);
    sendJson(res, ac);
    return true;
  }

  if (method === 'PUT' && path === '/api/auth/config') {
    if (process.env.BAMBU_AUTH_PASSWORD) {
      return sendJson(res, { error: 'Auth is managed via environment variables' }, 400), true;
    }
    return readBody(req, (b) => {
      if (Array.isArray(b.users)) {
        const existingUsers = config.auth?.users || [];
        b.users = b.users
          .filter(u => u.username && u.username.trim())
          .map(u => {
            if (u.password === '***') {
              const existing = existingUsers.find(e => e.username === u.username);
              return { username: u.username.trim(), password: existing?.password || '' };
            }
            const pw = u.password || '';
            return { username: u.username.trim(), password: pw ? hashPassword(pw) : '' };
          })
          .filter(u => u.password);
      }
      if (b.password === '***') {
        b.password = config.auth?.password || '';
      } else if (b.password && !b.password.startsWith('scrypt:')) {
        b.password = hashPassword(b.password);
      }
      const hasUsers = b.users?.length > 0;
      const hasPassword = !!b.password;
      if (!hasUsers && !hasPassword) b.enabled = false;
      config.auth = { ...config.auth, ...b };
      saveConfig({ auth: config.auth });
      log.info('Auth config oppdatert: enabled=' + config.auth.enabled + ', users=' + (config.auth.users?.length || 0));
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- TOTP 2FA ----
  if (method === 'GET' && path === '/api/auth/totp/status') {
    const totpEnabled = !!(config.auth?.totpSecret);
    sendJson(res, { enabled: totpEnabled });
    return true;
  }

  if (method === 'POST' && path === '/api/auth/totp/generate') {
    const secretBytes = randomBytes(20);
    const secret = _generateTotpSecret(secretBytes);
    // Lagre midlertidig nøkkel i minnet til bekreftelse
    const issuer = 'BambuDashboard';
    const label = config.auth?.username || 'admin';
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    sendJson(res, { secret, otpauth_url: otpauthUrl });
    return true;
  }

  if (method === 'POST' && path === '/api/auth/totp/enable') {
    return readBody(req, (b) => {
      const vr = validate(TOTP_ENABLE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      if (!_verifyTotp(b.secret, String(b.code))) {
        return sendJson(res, { error: 'Invalid TOTP code' }, 400);
      }
      config.auth = { ...config.auth, totpSecret: b.secret };
      saveConfig({ auth: config.auth });
      sendJson(res, { ok: true });
    }), true;
  }

  if (method === 'POST' && path === '/api/auth/totp/disable') {
    return readBody(req, (b) => {
      if (!b.code && config.auth?.totpSecret) {
        // Krever at gjeldende TOTP-kode bekrefter deaktivering
        return sendJson(res, { error: 'code required to disable TOTP' }, 400);
      }
      if (config.auth?.totpSecret && !_verifyTotp(config.auth.totpSecret, String(b.code))) {
        return sendJson(res, { error: 'Invalid TOTP code' }, 400);
      }
      const { totpSecret: _, ...rest } = config.auth || {};
      config.auth = rest;
      saveConfig({ auth: config.auth });
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Notifications ----
  if (method === 'GET' && path === '/api/notifications/config') {
    const nc = structuredClone(config.notifications || {});
    if (nc.channels?.telegram?.botToken) nc.channels.telegram.botToken = '***';
    if (nc.channels?.email?.pass) nc.channels.email.pass = '***';
    if (nc.channels?.ntfy?.token && nc.channels.ntfy.token) nc.channels.ntfy.token = '***';
    if (nc.channels?.pushover?.apiToken) nc.channels.pushover.apiToken = '***';
    sendJson(res, nc);
    return true;
  }

  if (method === 'PUT' && path === '/api/notifications/config') {
    return readBody(req, (b) => {
      const current = config.notifications || {};
      if (b.channels?.telegram?.botToken === '***') b.channels.telegram.botToken = current.channels?.telegram?.botToken || '';
      if (b.channels?.email?.pass === '***') b.channels.email.pass = current.channels?.email?.pass || '';
      if (b.channels?.ntfy?.token === '***') b.channels.ntfy.token = current.channels?.ntfy?.token || '';
      if (b.channels?.pushover?.apiToken === '***') b.channels.pushover.apiToken = current.channels?.pushover?.apiToken || '';
      saveConfig({ notifications: b });
      config.notifications = b;
      if (ctx.notifier) ctx.notifier.reloadConfig(b);
      sendJson(res, { ok: true });
    }), true;
  }

  if (method === 'POST' && path === '/api/notifications/test') {
    return readBody(req, async (b) => {
      const vr = validate(NOTIFICATION_TEST_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      if (!ctx.notifier) return sendJson(res, { error: 'Notifier not initialized' }, 500);
      try {
        await ctx.notifier.testChannel(b.channel, b.config);
        sendJson(res, { ok: true });
      } catch (err) {
        sendJson(res, { error: err.message }, 400);
      }
    }), true;
  }

  if (method === 'GET' && path === '/api/notifications/log') {
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    sendJson(res, getNotificationLog(limit, offset));
    return true;
  }

  // ---- Update ----
  if (method === 'GET' && path === '/api/update/status') {
    if (!ctx.updater) return sendJson(res, { error: 'Updater not initialized' }, 500), true;
    sendJson(res, ctx.updater.getStatus());
    return true;
  }

  if (method === 'POST' && path === '/api/update/check') {
    if (!ctx.updater) return sendJson(res, { error: 'Updater not initialized' }, 500), true;
    try {
      const status = await ctx.updater.checkForUpdate(true);
      sendJson(res, status);
    } catch (err) {
      sendJson(res, { error: err.message }, 500);
    }
    return true;
  }

  if (method === 'POST' && path === '/api/update/apply') {
    if (!ctx.updater) return sendJson(res, { error: 'Updater not initialized' }, 500), true;
    try {
      const result = await ctx.updater.applyUpdate();
      sendJson(res, result);
    } catch (err) {
      const status = err.message.includes('print') ? 409 : 400;
      sendJson(res, { error: err.message }, status);
    }
    return true;
  }

  if (method === 'GET' && path === '/api/update/history') {
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    sendJson(res, getUpdateHistory(limit));
    return true;
  }

  // ---- User Roles ----
  if (method === 'GET' && path === '/api/roles') {
    sendJson(res, getRoles());
    return true;
  }

  if (method === 'POST' && path === '/api/roles') {
    return readBody(req, (b) => {
      const vr = validate(ROLE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const id = addRole(b);
        sendJson(res, { ok: true, id }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }

  const roleMatch = path.match(/^\/api\/roles\/(\d+)$/);
  if (roleMatch) {
    const roleId = parseInt(roleMatch[1]);
    if (method === 'GET') {
      const role = getRole(roleId);
      if (!role) return sendJson(res, { error: 'Role not found' }, 404), true;
      sendJson(res, role);
      return true;
    }
    if (method === 'PUT') {
      return readBody(req, (b) => {
        try { updateRole(roleId, b); sendJson(res, { ok: true }); }
        catch (e) { sendJson(res, { error: e.message }, 500); }
      }), true;
    }
    if (method === 'DELETE') {
      deleteRole(roleId);
      sendJson(res, { ok: true });
      return true;
    }
  }

  // ---- Users Management ----
  if (method === 'GET' && path === '/api/users') {
    const users = getUsers().map(u => ({ ...u, password_hash: undefined }));
    sendJson(res, users);
    return true;
  }

  if (method === 'POST' && path === '/api/users') {
    return readBody(req, (b) => {
      const vr = validate(USER_CREATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const id = addUser({
          username: b.username,
          password_hash: hashPassword(b.password),
          role_id: b.role_id || null,
          display_name: b.display_name || null
        });
        sendJson(res, { ok: true, id }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }

  const userMatch = path.match(/^\/api\/users\/(\d+)$/);
  if (userMatch) {
    const userId = parseInt(userMatch[1]);
    if (method === 'GET') {
      const user = getUser(userId);
      if (!user) return sendJson(res, { error: 'User not found' }, 404), true;
      sendJson(res, { ...user, password_hash: undefined });
      return true;
    }
    if (method === 'PUT') {
      return readBody(req, (b) => {
        const vr = validate(USER_UPDATE_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        try {
          const updates = {};
          if (b.username) updates.username = b.username;
          if (b.display_name !== undefined) updates.display_name = b.display_name;
          if (b.role_id !== undefined) updates.role_id = b.role_id;
          if (b.password) updates.password_hash = hashPassword(b.password);
          updateUser(userId, updates);
          sendJson(res, { ok: true });
        } catch (e) { sendJson(res, { error: e.message }, 500); }
      }), true;
    }
    if (method === 'DELETE') {
      deleteUser(userId);
      sendJson(res, { ok: true });
      return true;
    }
  }

  // ---- API Keys ----
  if (method === 'GET' && path === '/api/keys') {
    sendJson(res, getApiKeys());
    return true;
  }

  if (method === 'POST' && path === '/api/keys') {
    return readBody(req, (b) => {
      const vr = validate(API_KEY_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const { key, hash, prefix } = generateApiKey();
        const id = addApiKey({
          name: b.name,
          key_hash: hash,
          key_prefix: prefix,
          permissions: b.permissions || ['*'],
          user_id: b.user_id || null,
          expires_at: b.expires_at || null
        });
        sendJson(res, { ok: true, id, key, prefix }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }

  const keyMatch = path.match(/^\/api\/keys\/(\d+)$/);
  if (keyMatch && method === 'DELETE') {
    deleteApiKey(parseInt(keyMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  const keyDeactivateMatch = path.match(/^\/api\/keys\/(\d+)\/deactivate$/);
  if (keyDeactivateMatch && method === 'POST') {
    deactivateApiKey(parseInt(keyDeactivateMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  return false;
}
