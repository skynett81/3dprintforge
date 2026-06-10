/**
 * Bambu Lab Cloud API client — full Cloud + IoT API coverage.
 * Uses node:https (no external dependencies).
 */
import https from 'node:https';
import { spawn } from 'node:child_process';
import { saveSecretsToEnv, config } from './config.js';
import { createLogger } from './logger.js';

const log = createLogger('bambu-cloud');
const API_BASE = 'api.bambulab.com';
// Authenticator-app 2FA ("tfa") is verified on the web sign-in host, which
// sits behind Cloudflare and challenges obviously-non-browser clients — so a
// realistic User-Agent is required.
const TFA_HOST = 'bambulab.com';
const BROWSER_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// Summarise a login response without leaking token material — strings longer
// than 16 chars (tokens/keys) are replaced with their length.
function _shape(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = (typeof v === 'string' && v.length > 16) ? `<${v.length} chars>` : v;
  }
  return JSON.stringify(out);
}

// Read a cookie value from a Set-Cookie header array (each entry starts with
// "name=value; …").
function _cookieVal(setCookie, name) {
  for (const c of (setCookie || [])) {
    const m = c.match(new RegExp('^' + name + '=([^;]+)'));
    if (m) return decodeURIComponent(m[1]);
  }
  return '';
}

// Parse a `curl -D` header dump (status line + headers) into status + cookies.
function _parseCurlHeaders(headerText) {
  let statusCode = 0;
  const setCookie = [];
  for (const line of (headerText || '').split(/\r?\n/)) {
    const sm = line.match(/^HTTP\/[\d.]+\s+(\d+)/);
    if (sm) statusCode = parseInt(sm[1], 10);
    const cm = line.match(/^set-cookie:\s*(.+)$/i);
    if (cm) setCookie.push(cm[1]);
  }
  return { statusCode, setCookie };
}

// Seconds until a JWT expires, or a 90-day default if undecodable.
function _jwtExpiresIn(jwt) {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'));
    if (payload.exp) return Math.max(60, payload.exp - Math.floor(Date.now() / 1000));
  } catch { /* not a decodable JWT */ }
  return 7776000;
}

export class BambuCloud {
  constructor() {
    this._token = config.bambuCloud?.accessToken || '';
    this._refreshToken = config.bambuCloud?.refreshToken || '';
    this._email = config.bambuCloud?.accountEmail || '';
    this._expiresAt = config.bambuCloud?.tokenExpiresAt || 0;
    this._tfaKey = ''; // ephemeral — set during an in-progress 2FA login
    this._refreshTimer = null;
    this._startAutoRefresh();
  }

  isAuthenticated() {
    return !!this._token;
  }

  // Decode the access-token JWT to extract the Bambu user ID. The middle
  // segment is base64url-encoded JSON containing `uid`. Required for
  // cloud-MQTT auth (username `u_<uid>`).
  getUserId() {
    if (!this._token) return null;
    try {
      const seg = this._token.split('.')[1];
      if (!seg) return null;
      const padded = seg.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(seg.length / 4) * 4, '=');
      const json = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
      return json.uid || json.userId || null;
    } catch {
      return null;
    }
  }

  // Credentials for cloud-MQTT broker. Region selects host:
  //   eu → eu.mqtt.bambulab.com (default)
  //   us → us.mqtt.bambulab.com
  //   cn → cn.mqtt.bambulab.com
  getCloudMqttCredentials(region) {
    if (!this.isAuthenticated()) return null;
    const uid = this.getUserId();
    if (!uid) return null;
    const r = (region || process.env.BAMBU_REGION || 'eu').toLowerCase();
    const hosts = { us: 'us.mqtt.bambulab.com', eu: 'eu.mqtt.bambulab.com', cn: 'cn.mqtt.bambulab.com' };
    return {
      host: hosts[r] || hosts.eu,
      port: 8883,
      username: `u_${uid}`,
      password: this._token,
    };
  }

  isTokenExpiring() {
    if (!this._expiresAt) return false;
    // Token is "expiring" if less than 7 days remain
    return Date.now() > this._expiresAt - 7 * 24 * 60 * 60 * 1000;
  }

  getStatus() {
    return {
      authenticated: this.isAuthenticated(),
      email: this._email || null,
      tokenExpiring: this.isTokenExpiring(),
      expiresAt: this._expiresAt || null,
    };
  }

  // ---- Auth ----

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
      this._email = email;
      return { needsVerification: true };
    }

    // Authenticator-app 2FA — the account has TOTP enabled. Bambu returns a
    // tfaKey here; the code is verified against the web sign-in host.
    if (res.loginType === 'tfa') {
      this._email = email;
      this._tfaKey = res.tfaKey || '';
      return { needsTfa: true };
    }

    if (res.accessToken) {
      this._saveToken(email, res);
      return { ok: true, email };
    }

    // Unrecognised 200-response — log its shape (no token material) so we can
    // see what Bambu actually returned (e.g. an authenticator-app 2FA flow
    // the code doesn't yet handle).
    log.warn('Login: unrecognised response shape: ' + _shape(res));
    throw new Error(res.message || res.error || 'Login failed');
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
   * Step 2 (authenticator-app 2FA): submit the 6-digit TOTP code from the
   * user's authenticator app. Verified against the web sign-in host, which
   * returns the access token as a Set-Cookie (token=…) rather than JSON.
   * Returns { ok: true, email } on success.
   */
  async verifyTfa(code) {
    if (!this._tfaKey) throw new Error('No 2FA session in progress — please log in again.');

    const res = await this._curlTfa({ tfaKey: this._tfaKey, tfaCode: String(code).trim() });

    // Cloudflare served its JS challenge instead of the API (the curl build on
    // this host couldn't pass it). Be explicit + point at the workaround.
    if (!res.json && /just a moment|challenge-platform|cf-mitigated|cf_chl/i.test(res.raw || '')) {
      throw new Error('Bambu blocked the 2FA request (Cloudflare). As a workaround, switch your Bambu account to email 2-step verification (or disable 2FA), then log in again.');
    }

    const token = _cookieVal(res.setCookie, 'token') || res.json?.accessToken || res.json?.token || '';

    if (!token) {
      // Bambu reports a bad/expired code as JSON { code, error }.
      if (res.json?.error || res.json?.message) {
        throw new Error(res.json.error || res.json.message);
      }
      // Otherwise the success shape differs from what we expected — log it
      // (no token material) so we can adapt, and fail clearly.
      log.warn('TFA verify: no token. status=' + res.statusCode + ' set-cookie=' +
        JSON.stringify((res.setCookie || []).map(c => c.split('=')[0])) + ' body=' + _shape(res.json || {}));
      throw new Error(res.statusCode >= 400 ? `2FA failed (HTTP ${res.statusCode})` : '2FA: no token returned');
    }

    this._tfaKey = '';
    this._saveToken(this._email, {
      accessToken: token,
      refreshToken: _cookieVal(res.setCookie, 'refreshToken') || res.json?.refreshToken || '',
      expiresIn: _jwtExpiresIn(token),
    });
    return { ok: true, email: this._email };
  }

  /**
   * Refresh the access token using the stored refresh token.
   * Returns { ok: true } on success.
   */
  async refreshToken() {
    if (!this._refreshToken) throw new Error('No refresh token available');

    const res = await this._request('POST', '/v1/user-service/user/refreshtoken', {
      refreshToken: this._refreshToken,
    });

    if (res.accessToken) {
      this._saveToken(this._email, res);
      return { ok: true };
    }

    throw new Error(res.message || 'Token refresh failed');
  }

  /** Logout — clear stored token. */
  logout() {
    this._token = '';
    this._refreshToken = '';
    this._email = '';
    this._expiresAt = 0;
    this._tfaKey = '';
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    saveSecretsToEnv({
      BAMBU_CLOUD_ACCESS_TOKEN: '',
      BAMBU_CLOUD_REFRESH_TOKEN: '',
      BAMBU_CLOUD_EMAIL: '',
      BAMBU_CLOUD_TOKEN_EXPIRES_AT: '',
    });
    config.bambuCloud = { accessToken: '', refreshToken: '', accountEmail: '', tokenExpiresAt: 0 };
  }

  // ---- IoT Service ----

  /** List printers bound to the authenticated account. */
  async getPrinters() {
    this._requireAuth();
    const res = await this._authedGet('/v1/iot-service/api/user/bind');

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

  /** Get current printer status from cloud. */
  async getPrinterStatus() {
    this._requireAuth();
    return this._authedGet('/v1/iot-service/api/user/print');
  }

  /** Get device firmware version info. */
  async getDeviceVersion() {
    this._requireAuth();
    return this._authedGet('/v1/iot-service/api/user/device/version');
  }

  /** Update device info (e.g. name). */
  async updateDeviceInfo(updates) {
    this._requireAuth();
    return this._request('PATCH', '/v1/iot-service/api/user/device/info', updates, this._token);
  }

  /** Get a specific print task by ID. */
  async getTask(taskId) {
    this._requireAuth();
    return this._authedGet(`/v1/iot-service/api/user/task/${encodeURIComponent(taskId)}`);
  }

  /** Get upload/mesh notification status. */
  async getNotification() {
    this._requireAuth();
    return this._authedGet('/v1/iot-service/api/user/notification');
  }

  /** List user projects. */
  async getProjects() {
    this._requireAuth();
    return this._authedGet('/v1/iot-service/api/user/project');
  }

  /** Get project details by ID. */
  async getProject(projectId) {
    this._requireAuth();
    return this._authedGet(`/v1/iot-service/api/user/project/${encodeURIComponent(projectId)}`);
  }

  /** Generate TUTK connection code for camera. */
  async getTTCode() {
    this._requireAuth();
    return this._request('POST', '/v1/iot-service/api/user/ttcode', {}, this._token);
  }

  /** Get slicer settings catalog. */
  async getSlicerSettings() {
    this._requireAuth();
    return this._authedGet('/v1/iot-service/api/slicer/setting');
  }

  /** Get a specific slicer setting by ID. */
  async getSlicerSetting(settingId) {
    this._requireAuth();
    return this._authedGet(`/v1/iot-service/api/slicer/setting/${encodeURIComponent(settingId)}`);
  }

  /** Download slicer resources. */
  async getSlicerResource() {
    this._requireAuth();
    return this._authedGet('/v1/iot-service/api/slicer/resource');
  }

  // ---- User Service ----

  /** Get print task history from the cloud account. */
  async getTaskHistory() {
    this._requireAuth();
    const res = await this._authedGet('/v1/user-service/my/tasks?limit=500');
    return res.hits || res.tasks || [];
  }

  /** Get a specific print task by ID (user-service). */
  async getUserTask(taskId) {
    this._requireAuth();
    return this._authedGet(`/v1/user-service/my/task/${encodeURIComponent(taskId)}`);
  }

  /** Get printed plates for a print instance. */
  async getPrintedPlates(instanceId) {
    this._requireAuth();
    return this._authedGet(`/v1/user-service/my/task/printedplates?instanceId=${encodeURIComponent(instanceId)}`);
  }

  /** Get messages by type. */
  async getMessages(type, limit = 20, offset = 0) {
    this._requireAuth();
    const qs = `type=${encodeURIComponent(type)}&limit=${limit}&offset=${offset}`;
    return this._authedGet(`/v1/user-service/my/messages?${qs}`);
  }

  /** Get unread message count. */
  async getMessageCount() {
    this._requireAuth();
    return this._authedGet('/v1/user-service/my/message/count');
  }

  /** Get latest message. */
  async getLatestMessage() {
    this._requireAuth();
    return this._authedGet('/v1/user-service/my/message/latest');
  }

  /** Mark messages as read. */
  async markMessagesRead(messageIds) {
    this._requireAuth();
    return this._request('POST', '/v1/user-service/my/message/read', { messageIds }, this._token);
  }

  /** Get device task notification status. */
  async getDeviceTaskStatus() {
    this._requireAuth();
    return this._authedGet('/v1/user-service/my/message/device/taskstatus');
  }

  /** Mark device task notifications as read. */
  async markDeviceTasksRead(taskIds) {
    this._requireAuth();
    return this._request('POST', '/v1/user-service/my/message/device/tasks/read', { taskIds }, this._token);
  }

  /** Get model/printer profile. */
  async getModelProfile() {
    this._requireAuth();
    return this._authedGet('/v1/user-service/my/model/profile');
  }

  /** Check for app updates. */
  async checkAppUpdate() {
    this._requireAuth();
    return this._authedGet('/v1/user-service/latest/app');
  }

  // ---- Design / MakerWorld ----

  /** Get design details by ID. */
  async getDesign(designId) {
    this._requireAuth();
    return this._authedGet(`/v1/design-service/design/${encodeURIComponent(designId)}`);
  }

  /** Get 3MF download URL for a design instance. */
  async getDesign3mf(instanceId) {
    this._requireAuth();
    return this._authedGet(`/v1/design-service/instance/${encodeURIComponent(instanceId)}/f3mf`);
  }

  /** Search designs. */
  async searchDesigns(query, limit = 20, offset = 0) {
    this._requireAuth();
    const qs = `keyword=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
    return this._authedGet(`/v1/search-service/select/design2?${qs}`);
  }

  /** Get user favorites. */
  async getFavorites(userId) {
    this._requireAuth();
    return this._authedGet(`/v1/design-service/favorites/designs/${encodeURIComponent(userId)}`);
  }

  // ---- Cloud File Upload & Print ----

  /** Get pre-signed S3 upload URL for file upload to cloud. */
  async getUploadUrl(filename) {
    this._requireAuth();
    return this._authedGet(`/v1/iot-service/api/user/upload?filename=${encodeURIComponent(filename)}`);
  }

  /**
   * Upload file to Bambu Lab cloud via pre-signed S3 URL.
   * Returns { ok, key } on success.
   */
  async uploadFileToCloud(filename, fileBuffer) {
    this._requireAuth();
    const uploadInfo = await this.getUploadUrl(filename);
    if (!uploadInfo?.url) throw new Error('No upload URL received');

    // PUT to S3 pre-signed URL
    return new Promise((resolve, reject) => {
      const url = new URL(uploadInfo.url);
      const req = https.request({
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileBuffer.length,
        },
      }, (res) => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ ok: true, key: uploadInfo.key || filename, ossPath: uploadInfo.ossPath || null });
          } else {
            reject(new Error(`S3 upload failed: HTTP ${res.statusCode}`));
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(120000, () => { req.destroy(); reject(new Error('Upload timeout')); });
      req.write(fileBuffer);
      req.end();
    });
  }

  /** Start cloud print on a printer. */
  async startCloudPrint(deviceId, filename, fileUrl, settings = {}) {
    this._requireAuth();
    return this._request('POST', '/v1/iot-service/api/user/print', {
      dev_id: deviceId,
      filename,
      url: fileUrl,
      ...settings,
    }, this._token);
  }

  /** Create a new print job in cloud. */
  async createTask(task) {
    this._requireAuth();
    return this._request('POST', '/v1/user-service/my/task', task, this._token);
  }

  // ---- Device Binding ----

  /** Bind a new printer to the account. */
  async bindDevice(deviceId, accessCode) {
    this._requireAuth();
    return this._request('POST', '/v1/iot-service/api/user/bind', {
      dev_id: deviceId,
      dev_access_code: accessCode,
    }, this._token);
  }

  /** Remove a printer from the account. */
  async unbindDevice(deviceId) {
    this._requireAuth();
    return this._request('DELETE', `/v1/iot-service/api/user/bind?dev_id=${encodeURIComponent(deviceId)}`, null, this._token);
  }

  // ---- Cloud Video ----

  /** Get cloud video streaming URL for a device. */
  async getCloudVideoUrl(deviceId) {
    this._requireAuth();
    return this._authedGet(`/v1/iot-service/api/user/device/video?dev_id=${encodeURIComponent(deviceId)}`);
  }

  // ---- User Profile ----

  /** Get user profile. */
  async getUserProfile() {
    this._requireAuth();
    return this._authedGet('/v1/user-service/my/profile');
  }

  /** Update user profile. */
  async updateUserProfile(updates) {
    this._requireAuth();
    return this._request('PUT', '/v1/user-service/my/profile', updates, this._token);
  }

  /** Get user preferences. */
  async getUserPreferences() {
    this._requireAuth();
    return this._authedGet('/v1/design-user-service/my/preference');
  }

  // ---- 2FA Email Code ----

  /** Send 2FA verification code to email (separate from login flow). */
  async sendVerificationEmail(email) {
    return this._request('POST', '/v1/user-service/user/sendemail/code', {
      account: email,
      type: 'login',
    });
  }

  // ---- Cloud Files ----

  /** List cloud files (projects, uploads). */
  async getCloudFiles(limit = 50, offset = 0) {
    this._requireAuth();
    // Projects via IoT service
    const projects = await this._authedGet('/v1/iot-service/api/user/project').catch(() => ({}));
    // Tasks via user service
    const tasks = await this._authedGet(`/v1/user-service/my/tasks?limit=${limit}&offset=${offset}`).catch(() => ({}));
    return {
      projects: projects.projects || projects.list || [],
      tasks: tasks.hits || tasks.tasks || [],
    };
  }

  // ---- Helpers ----

  _requireAuth() {
    if (!this._token) throw new Error('Not authenticated');
  }

  _authedGet(path) {
    return this._request('GET', path, null, this._token);
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
    saveSecretsToEnv({
      BAMBU_CLOUD_ACCESS_TOKEN: cloud.accessToken,
      BAMBU_CLOUD_REFRESH_TOKEN: cloud.refreshToken,
      BAMBU_CLOUD_EMAIL: cloud.accountEmail,
      BAMBU_CLOUD_TOKEN_EXPIRES_AT: cloud.tokenExpiresAt,
    });
    config.bambuCloud = cloud;
  }

  /** Auto-refresh token when it's about to expire. Checks every 12 hours. */
  _startAutoRefresh() {
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    this._refreshTimer = setInterval(async () => {
      if (this._refreshToken && this.isTokenExpiring()) {
        try {
          await this.refreshToken();
        } catch {
          // Silently fail — user will see tokenExpiring in status
        }
      }
    }, 12 * 60 * 60 * 1000);
    if (this._refreshTimer.unref) this._refreshTimer.unref();
  }

  /** HTTPS request helper. Returns parsed JSON body. */
  // POST to the Cloudflare-protected 2FA sign-in endpoint via `curl`.
  // Node's built-in TLS stack has a JA3 fingerprint Cloudflare bot-management
  // challenges (verified: every Node https/http2 attempt got a 403 JS
  // challenge regardless of headers), whereas curl's passes. The POST body
  // (tfaKey + one-time code) goes over stdin so it never lands in argv/ps;
  // response headers are dumped to a fd we read separately from the body.
  _curlTfa(body) {
    return new Promise((resolve, reject) => {
      const url = `https://${TFA_HOST}/api/sign-in/tfa`;
      const args = [
        '-s', '-i', '--max-time', '15',
        '-X', 'POST', url,
        '-H', 'Content-Type: application/json',
        '-H', `User-Agent: ${BROWSER_UA}`,
        '-H', 'Accept: application/json, text/plain, */*',
        '-H', 'Accept-Language: en-US,en;q=0.9',
        '-H', `Origin: https://${TFA_HOST}`,
        '-H', `Referer: https://${TFA_HOST}/en/sign-in`,
        '-d', '@-', // POST body from stdin (keeps the code out of argv/ps)
      ];
      let proc;
      try {
        proc = spawn('curl', args);
      } catch (e) {
        reject(new Error('Authenticator 2FA needs `curl` installed on the server.'));
        return;
      }
      let stdout = '', stderr = '';
      proc.stdout.on('data', (d) => { stdout += d; });
      proc.stderr.on('data', (d) => { stderr += d; });
      proc.on('error', (e) => {
        reject(new Error(e.code === 'ENOENT'
          ? 'Authenticator 2FA needs `curl` installed on the server.'
          : 'curl failed: ' + e.message));
      });
      proc.on('close', (codeN) => {
        // `-i` prints the header block, a blank line, then the body. The body
        // is small (no Expect/100-continue), so the first blank line is the
        // boundary.
        const idx = stdout.indexOf('\r\n\r\n');
        const headerText = idx >= 0 ? stdout.slice(0, idx) : '';
        const bodyText = idx >= 0 ? stdout.slice(idx + 4) : stdout;
        const { statusCode, setCookie } = _parseCurlHeaders(headerText);
        if (!statusCode && codeN !== 0) {
          reject(new Error('curl exited with code ' + codeN + (stderr ? ': ' + stderr.trim().slice(0, 120) : '')));
          return;
        }
        let json = null;
        try { json = JSON.parse(bodyText); } catch { /* non-JSON (CF html) */ }
        resolve({ statusCode, setCookie, json, raw: bodyText });
      });
      proc.stdin.on('error', () => { /* ignore EPIPE if curl exits early */ });
      proc.stdin.write(JSON.stringify(body));
      proc.stdin.end();
    });
  }

  _request(method, path, body, token) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': BROWSER_UA,
        'Accept': 'application/json, text/plain, */*',
      };
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
              // Bambu's API returns the human-readable reason under `error`
              // (e.g. "Incorrect account or password."); `message` is usually
              // absent. Surface whichever exists so the user sees the real
              // cause instead of a bare HTTP code.
              reject(new Error(json.message || json.error || `HTTP ${res.statusCode}`));
            } else {
              resolve(json);
            }
          } catch {
            // Non-JSON body (e.g. a Cloudflare/HTML block page) — include a
            // snippet so it's diagnosable rather than a bare status code.
            const snippet = raw.replace(/\s+/g, ' ').trim().slice(0, 120);
            reject(new Error(`Unexpected response (HTTP ${res.statusCode})${snippet ? ': ' + snippet : ''}`));
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
