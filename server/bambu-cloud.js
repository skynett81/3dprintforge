/**
 * Bambu Lab Cloud API client — full Cloud + IoT API coverage.
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
    this._refreshTimer = null;
    this._startAutoRefresh();
  }

  isAuthenticated() {
    return !!this._token;
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
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    saveConfig({
      bambuCloud: { accessToken: '', refreshToken: '', accountEmail: '', tokenExpiresAt: 0 }
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
    saveConfig({ bambuCloud: cloud });
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
