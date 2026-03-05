/**
 * Bambu Lab Cloud API client — login, 2FA, list printers.
 * Uses node:https (no external dependencies).
 */
import https from 'node:https';
import { saveConfig, config } from './config.js';

const API_BASE = 'api.bambulab.com';

export class BambuCloud {
  constructor() {
    this._token = config.bambuCloud?.accessToken || '';
    this._refreshToken = config.bambuCloud?.refreshToken || '';
    this._email = config.bambuCloud?.accountEmail || '';
    this._expiresAt = config.bambuCloud?.tokenExpiresAt || 0;
  }

  isAuthenticated() {
    return !!this._token;
  }

  getStatus() {
    return {
      authenticated: this.isAuthenticated(),
      email: this._email || null,
    };
  }

  /**
   * Step 1: Login with email + password. Triggers 2FA email.
   * Returns { needsVerification: true } or { ok: true } (if no 2FA required).
   */
  async login(email, password) {
    const res = await this._request('POST', '/v1/user-service/user/login', {
      account: email,
      password,
    });

    if (res.loginType === 'verifyCode') {
      // 2FA required — store email for verify step
      this._email = email;
      return { needsVerification: true };
    }

    // No 2FA — direct token (unlikely but handle it)
    if (res.accessToken) {
      this._saveToken(email, res);
      return { ok: true, email };
    }

    throw new Error(res.message || 'Login failed');
  }

  /**
   * Step 2: Verify 2FA code sent to email.
   * Returns { ok: true, email } on success.
   */
  async verify(email, code) {
    const res = await this._request('POST', '/v1/user-service/user/login', {
      account: email,
      code: String(code),
    });

    if (res.accessToken) {
      this._saveToken(email, res);
      return { ok: true, email };
    }

    throw new Error(res.message || 'Verification failed');
  }

  /**
   * Get printers bound to the authenticated account.
   * Returns array of { name, model, serial, ip, accessCode, nozzleDiameter }.
   */
  async getPrinters() {
    if (!this._token) throw new Error('Not authenticated');

    const res = await this._request('GET', '/v1/iot-service/api/user/bind', null, this._token);

    const devices = res.devices || [];
    return devices.map(d => ({
      name: d.name || d.dev_id || '',
      model: d.dev_product_name || d.dev_model_name || '',
      serial: d.dev_id || '',
      ip: '',
      accessCode: d.dev_access_code || '',
      nozzleDiameter: d.nozzle_diameter || 0.4,
    }));
  }

  /**
   * Get print task history from the cloud account.
   * Returns array of task objects with print details.
   */
  async getTaskHistory() {
    if (!this._token) throw new Error('Not authenticated');

    const res = await this._request('GET', '/v1/user-service/my/tasks?limit=500', null, this._token);
    return res.hits || res.tasks || [];
  }

  /**
   * Logout — clear stored token.
   */
  logout() {
    this._token = '';
    this._refreshToken = '';
    this._email = '';
    this._expiresAt = 0;
    saveConfig({
      bambuCloud: { accessToken: '', refreshToken: '', accountEmail: '', tokenExpiresAt: 0 }
    });
    config.bambuCloud = { accessToken: '', refreshToken: '', accountEmail: '', tokenExpiresAt: 0 };
  }

  /** Save token to config */
  _saveToken(email, res) {
    this._token = res.accessToken;
    this._refreshToken = res.refreshToken || '';
    this._email = email;
    this._expiresAt = Date.now() + (res.expiresIn || 7776000) * 1000;

    const cloud = {
      accessToken: this._token,
      refreshToken: this._refreshToken,
      accountEmail: email,
      tokenExpiresAt: this._expiresAt,
    };
    saveConfig({ bambuCloud: cloud });
    config.bambuCloud = cloud;
  }

  /**
   * HTTPS request helper. Returns parsed JSON body.
   */
  _request(method, path, body, token) {
    return new Promise((resolve, reject) => {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const postData = body ? JSON.stringify(body) : null;
      if (postData) headers['Content-Length'] = Buffer.byteLength(postData);

      const req = https.request({
        hostname: API_BASE,
        port: 443,
        path,
        method,
        headers,
      }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          try {
            const json = JSON.parse(raw);
            if (res.statusCode >= 400) {
              reject(new Error(json.message || `HTTP ${res.statusCode}`));
            } else {
              resolve(json);
            }
          } catch {
            reject(new Error(`Invalid response: ${res.statusCode}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(15000, () => { req.destroy(); reject(new Error('Request timeout')); });

      if (postData) req.write(postData);
      req.end();
    });
  }
}
