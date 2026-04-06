/**
 * 3DPrintForge — Setup Wizard Server (v2)
 * Standalone lightweight HTTP server for first-time configuration.
 *
 * 7-step wizard: EULA → System Check → Network Scan → Printers → Security → Settings → Finish
 *
 * Security:
 *  - Generates a one-time token on startup, printed in the terminal
 *  - All API calls require this token (header or query param)
 *  - Refuses to start if setup is already completed (flag in SQLite)
 *  - Binds only to localhost by default (use --lan to allow LAN access)
 *
 * After finish:
 *  - Spawns the main dashboard server as a detached child process
 *  - Waits for it to be ready, then exits — seamless handoff on same port
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, openSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawn } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const CONFIG_PATH = join(ROOT, 'config.json');
const DATA_DIR = join(ROOT, 'data');
const CERTS_DIR = join(ROOT, 'certs');
const SETUP_HTML = join(ROOT, 'public', 'setup.html');
const EULA_PATH = join(ROOT, 'EULA.md');
const DB_PATH = join(DATA_DIR, 'dashboard.db');

const PORT = parseInt(process.env.PORT || '3000', 10);
const ALLOW_LAN = process.argv.includes('--lan');
const BIND_HOST = ALLOW_LAN ? '0.0.0.0' : '127.0.0.1';

// ── Security token ──────────────────────────────────────────
const SETUP_TOKEN = randomBytes(24).toString('base64url');

// ── SQLite setup-complete flag ──────────────────────────────
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec(`CREATE TABLE IF NOT EXISTS setup_state (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
)`);

function isSetupComplete() {
  const row = db.prepare("SELECT value FROM setup_state WHERE key = 'setup_complete'").get();
  return row?.value === 'true';
}

function markSetupComplete() {
  db.prepare("INSERT OR REPLACE INTO setup_state (key, value, updated_at) VALUES ('setup_complete', 'true', datetime('now'))").run();
}

function setState(key, value) {
  db.prepare("INSERT OR REPLACE INTO setup_state (key, value, updated_at) VALUES (?, ?, datetime('now'))").run(key, value);
}

// ── Refuse if already set up (unless --force) ───────────────
if (isSetupComplete() && !process.argv.includes('--force')) {
  console.error('');
  console.error('  Setup has already been completed.');
  console.error('  To re-run the wizard, use: node server/setup-wizard.js --force');
  console.error('  To start the dashboard: npm start');
  console.error('');
  process.exit(1);
}

// ── Auth middleware ──────────────────────────────────────────
function authenticate(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader === `Bearer ${SETUP_TOKEN}`) return true;
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.searchParams.get('token') === SETUP_TOKEN) return true;
  return false;
}

function unauthorized(res) {
  res.writeHead(401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Invalid or missing setup token' }));
}

// ── Password hashing (inline — avoid importing auth.js which pulls config/db) ──
function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64, { N: 16384 });
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

// ── System checks ───────────────────────────────────────────
function checkSystem() {
  const checks = {};

  const nodeVer = process.versions.node;
  const nodeMajor = parseInt(nodeVer.split('.')[0], 10);
  checks.node = { version: nodeVer, ok: nodeMajor >= 22 };

  try {
    const ffVer = execSync('ffmpeg -version 2>&1', { timeout: 5000 }).toString().split('\n')[0];
    checks.ffmpeg = { version: ffVer.replace('ffmpeg version ', '').split(' ')[0], ok: true };
  } catch {
    checks.ffmpeg = { version: null, ok: false };
  }

  checks.dependencies = { ok: existsSync(join(ROOT, 'node_modules', 'mqtt')) };
  checks.config = { exists: existsSync(CONFIG_PATH) };
  checks.dataDir = { exists: existsSync(DATA_DIR) };

  checks.ssl = {
    cert: existsSync(join(CERTS_DIR, 'cert.pem')),
    key: existsSync(join(CERTS_DIR, 'key.pem'))
  };

  try {
    const dfOut = execSync(`df -BM "${ROOT}" | tail -1`, { timeout: 3000 }).toString().trim();
    const parts = dfOut.split(/\s+/);
    checks.disk = { available_mb: parseInt(parts[3], 10) || 0, ok: (parseInt(parts[3], 10) || 0) >= 100 };
  } catch {
    checks.disk = { available_mb: 0, ok: true };
  }

  try {
    const memOut = execSync("free -m | grep Mem | awk '{print $2, $7}'", { timeout: 3000 }).toString().trim();
    const [totalStr, availStr] = memOut.split(/\s+/);
    checks.ram = { total_mb: parseInt(totalStr, 10) || 0, available_mb: parseInt(availStr, 10) || 0, ok: (parseInt(availStr, 10) || 0) >= 128 };
  } catch {
    checks.ram = { total_mb: 0, available_mb: 0, ok: true };
  }

  try {
    const testFile = join(DATA_DIR, '.write-test');
    writeFileSync(testFile, 'ok');
    try { unlinkSync(testFile); } catch {}
    checks.writable = { ok: true };
  } catch {
    checks.writable = { ok: false };
  }

  try { checks.os = execSync('uname -srm', { timeout: 3000 }).toString().trim(); }
  catch { checks.os = 'unknown'; }

  try { checks.ip = execSync("hostname -I 2>/dev/null | awk '{print $1}'", { timeout: 3000 }).toString().trim() || 'localhost'; }
  catch { checks.ip = 'localhost'; }

  checks.compatible = checks.node.ok && checks.writable.ok;
  return checks;
}

function installDependencies() {
  try {
    execSync('npm install --production', { cwd: ROOT, timeout: 120000, stdio: 'pipe' });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.stderr?.toString() || e.message };
  }
}

function installFfmpeg() {
  try {
    execSync('sudo apt-get update -qq && sudo apt-get install -y ffmpeg', { timeout: 120000, stdio: 'pipe' });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.stderr?.toString() || e.message };
  }
}

// ── Network scan (lazy import — deps may not be installed yet) ──
async function scanNetwork() {
  try {
    const { PrinterDiscovery } = await import('./printer-discovery.js');
    const discovery = new PrinterDiscovery();
    const results = await discovery.scanAll(6000);
    return { ok: true, printers: results || [] };
  } catch (e) {
    return { ok: false, printers: [], error: e.message };
  }
}

// ── Test connection by printer type ──
async function testConnection(printer) {
  const { type, ip, serial, accessCode, apiKey, port } = printer;
  const timeout = 8000;

  try {
    if (type === 'bambu') {
      const { testMqttConnection } = await import('./printer-discovery.js');
      return await testMqttConnection(ip, serial, accessCode, timeout);
    }

    if (type === 'moonraker') {
      const p = port || 80;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);
      const res = await fetch(`http://${ip}:${p}/printer/info`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const data = await res.json();
      return { ok: true, info: { hostname: data.result?.hostname, software: data.result?.software_version } };
    }

    if (type === 'prusalink') {
      const p = port || 80;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);
      const res = await fetch(`http://${ip}:${p}/api/version`, {
        headers: { 'X-Api-Key': apiKey || '' },
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const data = await res.json();
      return { ok: true, info: { api: data.api, server: data.server, text: data.text } };
    }

    return { ok: false, error: 'Unknown printer type: ' + type };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Save config (multi-brand) ───────────────────────────────
function saveConfig(data) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(CERTS_DIR)) mkdirSync(CERTS_DIR, { recursive: true });

  const config = {
    printers: (data.printers || []).map((p, i) => ({
      id: p.id || `printer-${i + 1}`,
      name: p.name || `Printer ${i + 1}`,
      type: p.type || 'bambu',
      ip: p.ip || '',
      port: p.port || null,
      serial: p.serial || '',
      accessCode: p.accessCode || '',
      model: p.model || ''
    })),
    auth: data.auth || { enabled: false },
    server: {
      port: parseInt(data.port, 10) || 3000,
      httpsPort: parseInt(data.httpsPort, 10) || 3443,
      cameraWsPortStart: parseInt(data.cameraWsPortStart, 10) || 9001,
      forceHttps: !!data.forceHttps
    },
    camera: {
      enabled: data.cameraEnabled !== false,
      resolution: data.cameraResolution || '1920x1080',
      framerate: parseInt(data.cameraFramerate, 10) || 15,
      bitrate: data.cameraBitrate || '1000k'
    },
    notifications: data.notifications || { enabled: false, channels: {} }
  };

  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  try { execSync(`chmod 600 "${CONFIG_PATH}"`, { timeout: 2000, stdio: 'pipe' }); } catch {}
  return config;
}

function createSystemdService() {
  const nodePath = process.execPath;
  const user = process.env.USER || 'nobody';
  const service = `[Unit]
Description=3DPrintForge
After=network.target

[Service]
Type=simple
User=${user}
WorkingDirectory=${ROOT}
ExecStart=${nodePath} server/index.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`;
  try {
    const servicePath = '/etc/systemd/system/3dprintforge.service';
    execSync(`sudo tee ${servicePath} > /dev/null`, { input: service, timeout: 10000 });
    execSync('sudo systemctl daemon-reload', { timeout: 10000, stdio: 'pipe' });
    execSync('sudo systemctl enable 3dprintforge', { timeout: 10000, stdio: 'pipe' });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function spawnDashboard() {
  const logFile = join(DATA_DIR, 'dashboard-start.log');
  const out = openSync(logFile, 'a');
  const err = openSync(logFile, 'a');
  const child = spawn(process.execPath, ['server/index.js'], {
    cwd: ROOT, detached: true, stdio: ['ignore', out, err],
    env: { ...process.env, NODE_ENV: 'production' }
  });
  child.unref();
  console.log(`  [setup] Dashboard spawned (PID: ${child.pid}), log: ${logFile}`);
  return child.pid;
}

function closeServer() {
  return new Promise((resolve) => {
    server.close(() => resolve());
    setTimeout(resolve, 1000);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// ── HTTP server ─────────────────────────────────────────────
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  // ── Setup page (inject token) ──
  if (path === '/' || path === '/setup') {
    let html = readFileSync(SETUP_HTML, 'utf-8');
    html = html.replace('{{SETUP_TOKEN}}', SETUP_TOKEN);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // ── API routes — all require token ──
  if (path.startsWith('/setup/api/')) {
    if (!authenticate(req)) return unauthorized(res);

    // Step 0: EULA
    if (path === '/setup/api/eula' && method === 'GET') {
      const text = existsSync(EULA_PATH) ? readFileSync(EULA_PATH, 'utf-8') : 'EULA file not found.';
      return json(res, { text });
    }

    if (path === '/setup/api/accept-eula' && method === 'POST') {
      setState('eula_accepted', new Date().toISOString());
      return json(res, { ok: true });
    }

    // Step 1: System check
    if (path === '/setup/api/check' && method === 'GET') {
      return json(res, checkSystem());
    }

    if (path === '/setup/api/install-deps' && method === 'POST') {
      return json(res, installDependencies());
    }

    if (path === '/setup/api/install-ffmpeg' && method === 'POST') {
      return json(res, installFfmpeg());
    }

    // Step 2: Network scan
    if (path === '/setup/api/scan' && method === 'POST') {
      const result = await scanNetwork();
      return json(res, result);
    }

    // Step 3: Test connection
    if (path === '/setup/api/test-connection' && method === 'POST') {
      const data = await readBody(req);
      if (!data.ip) return json(res, { ok: false, error: 'IP address required' }, 400);
      const result = await testConnection(data);
      return json(res, result);
    }

    // Step 4: Create admin
    if (path === '/setup/api/create-admin' && method === 'POST') {
      const data = await readBody(req);
      if (!data.username || data.username.length < 3) return json(res, { ok: false, error: 'Username must be at least 3 characters' }, 400);
      if (!data.password || data.password.length < 8) return json(res, { ok: false, error: 'Password must be at least 8 characters' }, 400);
      const hashed = hashPassword(data.password);
      setState('auth_config', JSON.stringify({
        enabled: data.enableAuth !== false,
        username: data.username,
        password: hashed,
        sessionDurationHours: data.sessionDurationHours || 24
      }));
      return json(res, { ok: true });
    }

    // Step 5: Save config
    if (path === '/setup/api/save' && method === 'POST') {
      const data = await readBody(req);
      try {
        // Merge auth config from step 4
        const authRow = db.prepare("SELECT value FROM setup_state WHERE key = 'auth_config'").get();
        if (authRow?.value) {
          data.auth = JSON.parse(authRow.value);
        }
        const config = saveConfig(data);
        return json(res, { ok: true, config });
      } catch (e) {
        return json(res, { ok: false, error: e.message }, 500);
      }
    }

    // Step 6: Systemd + Finish
    if (path === '/setup/api/systemd' && method === 'POST') {
      return json(res, createSystemdService());
    }

    if (path === '/setup/api/finish' && method === 'POST') {
      markSetupComplete();
      db.close();

      const dashPort = (() => {
        try { return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8')).server?.port || PORT; }
        catch { return PORT; }
      })();

      json(res, { ok: true, dashPort, message: 'Closing wizard and starting dashboard...' });

      setTimeout(async () => {
        console.log('  [setup] Closing wizard server...');
        await closeServer();
        await new Promise(r => setTimeout(r, 500));
        console.log('  [setup] Spawning dashboard server...');
        spawnDashboard();
        setTimeout(() => { process.exit(0); }, 1000);
      }, 200);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // ── Static assets (no auth needed for CSS/SVG/JS) ──
  const filePath = join(PUBLIC_DIR, path);
  if (filePath.startsWith(PUBLIC_DIR) && existsSync(filePath)) {
    const ext = path.split('.').pop();
    const mimes = { css: 'text/css', js: 'application/javascript', svg: 'image/svg+xml', png: 'image/png', ico: 'image/x-icon', json: 'application/json', woff2: 'font/woff2' };
    res.writeHead(200, { 'Content-Type': mimes[ext] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, BIND_HOST, () => {
  const ip = (() => { try { return execSync("hostname -I 2>/dev/null | awk '{print $1}'", { timeout: 3000 }).toString().trim(); } catch { return 'localhost'; } })();
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log('  ║   3DPrintForge — Setup Wizard                       ║');
  console.log(`  ║   http://${BIND_HOST === '0.0.0.0' ? ip : 'localhost'}:${PORT}                          ║`);
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log(`  ║   Setup token: ${SETUP_TOKEN}    ║`);
  console.log('  ╚══════════════════════════════════════════════════════╝');
  console.log('');
  if (BIND_HOST === '127.0.0.1') {
    console.log('  Bound to localhost only. Use --lan to allow network access.');
  }
  console.log('  Open the URL in your browser. The token will be filled automatically.');
  console.log('');
});
