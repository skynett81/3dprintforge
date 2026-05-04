import { readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONFIG_PATH = join(ROOT, 'config.json');
const ENV_PATH = join(ROOT, '.env');

// Minimal .env parser (KEY=VALUE per line, # comments, optional surrounding quotes).
// Avoids a dotenv dependency. Used both at startup and by saveSecretsToEnv.
function parseEnvFile(content) {
  const out = {};
  for (const raw of content.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    if (key) out[key] = val;
  }
  return out;
}

function serializeEnvFile(obj) {
  const lines = [];
  for (const [key, val] of Object.entries(obj)) {
    const v = String(val ?? '');
    if (/[\s"'\\#$]/.test(v)) {
      const escaped = v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      lines.push(`${key}="${escaped}"`);
    } else {
      lines.push(`${key}=${v}`);
    }
  }
  return lines.join('\n') + '\n';
}

// Load .env into process.env BEFORE loadConfig reads env vars, so manual
// `npm start` runs work the same as systemd's EnvironmentFile=. Systemd-set
// vars take precedence (we only fill keys that aren't already set).
if (existsSync(ENV_PATH)) {
  try {
    const parsed = parseEnvFile(readFileSync(ENV_PATH, 'utf-8'));
    for (const [k, v] of Object.entries(parsed)) {
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch { /* ignore — defaults will apply */ }
}

const DEFAULTS = {
  printers: [],
  auth: {
    enabled: false,
    password: '',
    username: '',
    users: [],
    sessionDurationHours: 24
  },
  server: { port: 3000, httpsPort: 3443, cameraWsPortStart: 9001, forceHttps: true },
  camera: { enabled: true, resolution: '640x480', framerate: 15, bitrate: '1000k' },
  notifications: {
    enabled: false,
    channels: {
      telegram:  { enabled: false, botToken: '', chatId: '' },
      discord:   { enabled: false, webhookUrl: '' },
      email:     { enabled: false, host: '', port: 587, user: '', pass: '', from: '', to: '' },
      webhook:   { enabled: false, url: '', headers: {} },
      ntfy:      { enabled: false, serverUrl: 'https://ntfy.sh', topic: '', token: '' },
      pushover:  { enabled: false, apiToken: '', userKey: '' },
      sms:       { enabled: false, provider: 'twilio', accountSid: '', authToken: '', fromNumber: '', toNumber: '', gatewayUrl: '', gatewayHeaders: '', extraParams: '' }
    },
    events: {
      print_started:   { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      print_finished:  { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      print_failed:    { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      print_cancelled: { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      printer_error:   { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      maintenance_due: { enabled: false, channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      bed_cooled:        { enabled: false, channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      update_available:  { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      drying_due:        { enabled: false, channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      filament_low_stock: { enabled: false, channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      queue_item_started:  { enabled: false, channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      queue_item_completed: { enabled: false, channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      queue_item_failed:   { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] },
      queue_completed:     { enabled: true,  channels: ['telegram','discord','email','webhook','ntfy','pushover','sms'] }
    },
    quietHours: { enabled: false, start: '23:00', end: '07:00' },
    bedCooledThreshold: 30,
    incoming_webhooks: {
      octoeverywhere_secret: '',
      obico_secret: '',
      simplyprint_secret: ''
    }
  },
  spoolman: {
    enabled: false,
    url: ''
  },
  update: {
    autoCheck: true,
    checkIntervalHours: 6,
    includePrerelease: false,
    githubToken: ''
  },
  bambuCloud: {
    accessToken: '',
    refreshToken: '',
    accountEmail: '',
    tokenExpiresAt: 0
  },
  network: {
    extraSubnets: [],
    rediscoveryIntervalSeconds: 60,
    scanTimeoutMs: 5000
  }
};

function migrateLegacyConfig(config) {
  // Migrate old single-printer format to new printers array
  if (config.printer && !config.printers) {
    config.printers = [];
    if (config.printer.ip || config.printer.serial) {
      config.printers.push({
        id: 'default',
        name: 'Printer',
        ip: config.printer.ip || '',
        serial: config.printer.serial || '',
        accessCode: config.printer.accessCode || '',
        model: ''
      });
    }
    delete config.printer;
  }
  // Migrate cameraWsPort -> cameraWsPortStart
  if (config.server?.cameraWsPort && !config.server?.cameraWsPortStart) {
    config.server.cameraWsPortStart = config.server.cameraWsPort;
    delete config.server.cameraWsPort;
  }
  return config;
}

function loadConfig() {
  let config = structuredClone(DEFAULTS);

  if (existsSync(CONFIG_PATH)) {
    try {
      let file = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
      file = migrateLegacyConfig(file);
      config = deepMerge(config, file);
      // Secure config file permissions (owner-only read/write)
      try { chmodSync(CONFIG_PATH, 0o600); } catch { /* Windows etc. */ }
    } catch (e) {
      console.warn('[config] Could not read config.json:', e.message);
    }
  }

  // Env overrides (adds/overrides first printer)
  if (process.env.BAMBU_IP || process.env.BAMBU_SERIAL) {
    if (config.printers.length === 0) {
      config.printers.push({ id: 'default', name: 'Printer', ip: '', serial: '', accessCode: '', model: '' });
    }
    if (process.env.BAMBU_IP) config.printers[0].ip = process.env.BAMBU_IP;
    if (process.env.BAMBU_SERIAL) config.printers[0].serial = process.env.BAMBU_SERIAL;
    if (process.env.BAMBU_ACCESS_CODE) config.printers[0].accessCode = process.env.BAMBU_ACCESS_CODE;
  }
  if (process.env.PORT) config.server.port = parseInt(process.env.PORT);
  if (process.env.SERVER_PORT) config.server.port = parseInt(process.env.SERVER_PORT);
  if (process.env.GITHUB_TOKEN) config.update.githubToken = process.env.GITHUB_TOKEN;

  // Bambu Cloud tokens — sourced from .env. Auto-refreshed tokens are written
  // back to .env via saveSecretsToEnv (see bambu-cloud.js), keeping all
  // secrets in one file (config.json stays free of bearer tokens).
  if (process.env.BAMBU_CLOUD_ACCESS_TOKEN) config.bambuCloud.accessToken = process.env.BAMBU_CLOUD_ACCESS_TOKEN;
  if (process.env.BAMBU_CLOUD_REFRESH_TOKEN) config.bambuCloud.refreshToken = process.env.BAMBU_CLOUD_REFRESH_TOKEN;
  if (process.env.BAMBU_CLOUD_EMAIL) config.bambuCloud.accountEmail = process.env.BAMBU_CLOUD_EMAIL;
  if (process.env.BAMBU_CLOUD_TOKEN_EXPIRES_AT) {
    const n = parseInt(process.env.BAMBU_CLOUD_TOKEN_EXPIRES_AT, 10);
    if (!Number.isNaN(n)) config.bambuCloud.tokenExpiresAt = n;
  }

  // Auth env overrides
  if (process.env.REQUIRE_AUTH === 'true' || process.env.REQUIRE_AUTH === '1') {
    config.auth.enabled = true;
  }
  if (process.env.BAMBU_AUTH_PASSWORD) {
    config.auth.password = process.env.BAMBU_AUTH_PASSWORD;
    config.auth.enabled = true;
  }
  if (process.env.BAMBU_AUTH_USERNAME) {
    config.auth.username = process.env.BAMBU_AUTH_USERNAME;
  }

  // Security warning: auth disabled
  if (!config.auth.enabled) {
    console.warn('\n' + '='.repeat(70));
    console.warn('⚠  WARNING: Authentication is DISABLED');
    console.warn('   All API endpoints are accessible without credentials.');
    console.warn('   Set REQUIRE_AUTH=true or enable auth in Settings to secure this instance.');
    console.warn('='.repeat(70) + '\n');
  }

  return config;
}

/** Return config with secrets masked — safe for API responses */
export function getSafeConfig() {
  const safe = structuredClone(config);
  // Mask sensitive fields
  if (safe.update?.githubToken) safe.update.githubToken = '***';
  if (safe.bambuCloud) {
    if (safe.bambuCloud.accessToken) safe.bambuCloud.accessToken = '***';
    if (safe.bambuCloud.refreshToken) safe.bambuCloud.refreshToken = '***';
  }
  if (safe.auth?.password) safe.auth.password = '***';
  if (safe.auth?.users) {
    safe.auth.users = safe.auth.users.map(u => ({ ...u, password: '***' }));
  }
  // Mask printer access codes, tokens, and passwords
  if (safe.printers) {
    safe.printers = safe.printers.map(p => ({
      ...p,
      accessCode: p.accessCode ? '***' : '',
      token: p.token ? '***' : '',
      password: p.password ? '***' : '',
    }));
  }
  // Mask incoming-webhook shared secrets (OctoEverywhere / Obico / SimplyPrint)
  const iw = safe.notifications?.incoming_webhooks;
  if (iw) {
    if (iw.octoeverywhere_secret) iw.octoeverywhere_secret = '***';
    if (iw.obico_secret) iw.obico_secret = '***';
    if (iw.simplyprint_secret) iw.simplyprint_secret = '***';
  }

  // Mask notification secrets
  const nc = safe.notifications?.channels;
  if (nc) {
    if (nc.telegram?.botToken) nc.telegram.botToken = '***';
    if (nc.email?.pass) nc.email.pass = '***';
    if (nc.pushover?.apiToken) nc.pushover.apiToken = '***';
    if (nc.ntfy?.token) nc.ntfy.token = '***';
    if (nc.sms?.authToken) nc.sms.authToken = '***';
  }
  return safe;
}

// Persist secrets to .env (chmod 600). Empty/null values delete the key.
// Updates are reflected immediately in process.env so the running process
// can read fresh values without restart. Used for auto-refreshed tokens
// that must outlive the current session (e.g. Bambu Cloud refresh).
export function saveSecretsToEnv(updates) {
  let current = {};
  if (existsSync(ENV_PATH)) {
    try { current = parseEnvFile(readFileSync(ENV_PATH, 'utf-8')); } catch { /* start fresh */ }
  }
  const merged = { ...current };
  for (const [key, val] of Object.entries(updates)) {
    if (val === '' || val == null) {
      delete merged[key];
      delete process.env[key];
    } else {
      merged[key] = String(val);
      process.env[key] = String(val);
    }
  }
  // Pass mode at create time so a brand-new .env is born 0600 — closes the
  // narrow race where another local process could read the file between
  // writeFileSync (default umask, ~0644) and chmodSync. For an existing
  // file the OS preserves the prior mode and the chmodSync below normalises
  // anything that's drifted (e.g. a hand-edited file).
  writeFileSync(ENV_PATH, serializeEnvFile(merged), { mode: 0o600 });
  try { chmodSync(ENV_PATH, 0o600); } catch { /* Windows etc. */ }
  return merged;
}

export function saveConfig(updates) {
  let current = {};
  if (existsSync(CONFIG_PATH)) {
    try {
      current = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (e) { /* start fresh */ }
  }
  const merged = deepMerge(current, updates);
  // Same reasoning as saveSecretsToEnv: born-0600 closes the umask race
  // window for first-creation.
  writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), { mode: 0o600 });
  try { chmodSync(CONFIG_PATH, 0o600); } catch { /* Windows etc. */ }
  return merged;
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export const config = loadConfig();
export const ROOT_DIR = ROOT;
export const PUBLIC_DIR = join(ROOT, 'public');
export const DATA_DIR = join(ROOT, 'data');
