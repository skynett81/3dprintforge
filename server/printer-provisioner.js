/**
 * PrinterProvisioner — Auto-configures printers for optimal camera support.
 *
 * For Snapmaker U1 (and similar printers with unisrv):
 * - Configures nginx to serve /tmp/.monitor.jpg at /webcam/?action=snapshot
 * - This makes the standard HTTP camera polling work without SSH per-frame
 * - Persists across reboots (nginx config is permanent)
 *
 * Provisioning runs once per printer and is idempotent.
 */

import { Client as SSHClient } from 'ssh2';
import { createLogger } from './logger.js';

const log = createLogger('provision');

// Nginx snippet that serves the live monitor image at the webcam endpoint
const NGINX_CAMERA_SNIPPET = `
# 3DPrintForge camera proxy — serves unisrv live monitor image
# This replaces the mjpgstreamer upstream that isn't running
location = /webcam/snapshot {
    alias /tmp/.monitor.jpg;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
    add_header Content-Type "image/jpeg" always;
    add_header Access-Control-Allow-Origin "*";
    etag off;
    if_modified_since off;
}
location = /webcam/action/snapshot {
    alias /tmp/.monitor.jpg;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
    add_header Content-Type "image/jpeg" always;
    add_header Access-Control-Allow-Origin "*";
    etag off;
    if_modified_since off;
}
`;

// Marker to identify our config
const MARKER = '# 3DPrintForge camera proxy';

const SSH_CREDENTIALS = [
  { username: 'root', password: 'snapmaker' },
  { username: 'lava', password: 'snapmaker' },
  { username: 'root', password: 'makerbase' },
];

/**
 * Provision camera for a Moonraker printer.
 * Checks if the webcam endpoint works; if not, tries to configure nginx via SSH.
 * Returns true if camera is now available via HTTP.
 */
export async function provisionCamera(printerIp, port = 80) {
  // 1. Check if webcam already works
  const webcamOk = await _testWebcam(printerIp, port);
  if (webcamOk) {
    log.info(`${printerIp}: webcam allerede OK via HTTP`);
    return true;
  }

  // 2. Check if this is a printer we can configure (has SSH + unisrv)
  const creds = await _findSshCredentials(printerIp);
  if (!creds) {
    log.info(`${printerIp}: ingen SSH-tilgang — kan ikke konfigurere kamera automatisk`);
    return false;
  }

  // 3. Check if unisrv is running and monitor.jpg exists
  const hasMonitor = await _checkMonitorFile(printerIp, creds);
  if (!hasMonitor) {
    log.info(`${printerIp}: ingen live kamerafil funnet`);
    return false;
  }

  // 4. Configure nginx to serve the monitor image
  const configured = await _configureNginx(printerIp, creds);
  if (!configured) {
    log.info(`${printerIp}: kunne ikke konfigurere nginx`);
    return false;
  }

  // 5. Verify it works now
  // Small delay for nginx reload
  await new Promise(r => setTimeout(r, 1500));
  const works = await _testWebcam(printerIp, port);
  if (works) {
    log.info(`${printerIp}: kamera konfigurert og verifisert via HTTP`);
  } else {
    log.info(`${printerIp}: nginx konfigurert men webcam svarer ikke ennå`);
  }
  return works;
}

async function _testWebcam(ip, port) {
  // Try multiple snapshot paths and ports
  const endpoints = [
    `http://${ip}:${port}/webcam/snapshot`,
    `http://${ip}:${port}/webcam/?action=snapshot`,
    `http://${ip}:8080/`,
    `http://${ip}:8080/?action=snapshot`,
    `http://${ip}:8081/?action=snapshot`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now(), { signal: AbortSignal.timeout(3000) });
      if (!res.ok) continue;
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('image')) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 500) return true;
    } catch { /* next */ }
  }
  return false;
}

function _findSshCredentials(ip) {
  return new Promise((resolve) => {
    let idx = 0;
    function tryNext() {
      if (idx >= SSH_CREDENTIALS.length) return resolve(null);
      const creds = SSH_CREDENTIALS[idx++];
      const conn = new SSHClient();
      const timer = setTimeout(() => { conn.end(); tryNext(); }, 5000);

      conn.on('ready', () => {
        clearTimeout(timer);
        conn.end();
        resolve(creds);
      });
      conn.on('error', () => { clearTimeout(timer); tryNext(); });

      conn.connect({
        host: ip, port: 22,
        username: creds.username, password: creds.password,
        readyTimeout: 4000,
        algorithms: { kex: ['diffie-hellman-group14-sha256', 'diffie-hellman-group14-sha1', 'ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'ecdh-sha2-nistp521'] }
      });
    }
    tryNext();
  });
}

function _sshExec(ip, creds, cmd) {
  return new Promise((resolve) => {
    const conn = new SSHClient();
    const timer = setTimeout(() => { conn.end(); resolve(null); }, 10000);

    conn.on('ready', () => {
      conn.exec(cmd, (err, stream) => {
        if (err) { clearTimeout(timer); conn.end(); resolve(null); return; }
        let out = '';
        stream.on('data', (d) => { out += d; });
        stream.stderr.on('data', (d) => { out += d; });
        stream.on('close', () => { clearTimeout(timer); conn.end(); resolve(out); });
      });
    });
    conn.on('error', () => { clearTimeout(timer); resolve(null); });

    conn.connect({
      host: ip, port: 22,
      username: creds.username, password: creds.password,
      readyTimeout: 5000,
      algorithms: { kex: ['diffie-hellman-group14-sha256', 'diffie-hellman-group14-sha1', 'ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'ecdh-sha2-nistp521'] }
    });
  });
}

async function _checkMonitorFile(ip, creds) {
  const result = await _sshExec(ip, creds,
    'test -f /tmp/.monitor.jpg && stat -c %s /tmp/.monitor.jpg || echo 0'
  );
  if (!result) return false;
  const size = parseInt(result.trim());
  return size > 500;
}

async function _configureNginx(ip, creds) {
  // Use a separate config file in conf.d — never modify the main site config
  const confPath = '/etc/nginx/conf.d/3dprintforge-camera.conf';

  // Check if already configured
  const existing = await _sshExec(ip, creds, `test -f ${confPath} && echo EXISTS`);
  if (existing && existing.trim() === 'EXISTS') {
    log.info(`${ip}: nginx allerede konfigurert — laster på nytt`);
    await _sshExec(ip, creds, 'nginx -s reload 2>/dev/null');
    return true;
  }

  // Find the server port from existing site config
  const siteConfig = await _sshExec(ip, creds, 'ls /etc/nginx/sites-enabled/fluidd /etc/nginx/sites-enabled/mainsail 2>/dev/null');
  if (!siteConfig || !siteConfig.trim()) {
    log.info(`${ip}: ingen fluidd/mainsail nginx-config funnet`);
    return false;
  }

  // Create a separate server block on port 8080 that serves the camera image
  // Every request returns /tmp/.monitor.jpg regardless of path/query
  const serverConf = `# 3DPrintForge camera proxy — auto-generated
# Serves unisrv live monitor image for 3DPrintForge dashboard
server {
    listen 8080;
    listen [::]:8080;

    types { }
    default_type image/jpeg;

    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    add_header Pragma "no-cache" always;
    add_header Access-Control-Allow-Origin "*" always;
    etag off;
    if_modified_since off;

    location / {
        root /tmp;
        try_files /.monitor.jpg =404;
    }
}
`;

  // Write config, test, and reload
  const writeCmd = `cat > /tmp/_3dpf_cam.conf << 'NGINX_EOF'
${serverConf}
NGINX_EOF
mv /tmp/_3dpf_cam.conf ${confPath} && nginx -t 2>&1 && nginx -s reload 2>&1`;

  const result = await _sshExec(ip, creds, writeCmd);

  if (result && result.includes('successful')) {
    log.info(`${ip}: nginx kamera-server konfigurert på port 8080`);
    return true;
  }

  // Rollback on failure
  await _sshExec(ip, creds, `rm -f ${confPath} && nginx -s reload 2>/dev/null`);
  log.error(`${ip}: nginx-config feilet: ${result?.slice(0, 200)}`);
  return false;
}
