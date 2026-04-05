/**
 * Cloudflare Tunnel integration — secure remote access without VPN
 * Manages cloudflared process for creating tunnels to localhost
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(import.meta.dirname, '..', 'data');
const TUNNEL_DIR = join(DATA_DIR, 'tunnel');
const log = { info: (...a) => console.log('[tunnel]', ...a), warn: (...a) => console.warn('[tunnel]', ...a), error: (...a) => console.error('[tunnel]', ...a) };

export class CloudflareTunnel {
  constructor() {
    this._proc = null;
    this._url = null;
    this._status = 'stopped';
    this._logs = [];
  }

  /** Check if cloudflared binary is installed */
  isAvailable() {
    try {
      execSync('which cloudflared', { stdio: 'pipe' });
      return true;
    } catch { return false; }
  }

  /** Get cloudflared version */
  getVersion() {
    try {
      return execSync('cloudflared version', { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch { return null; }
  }

  /** Start a quick tunnel (no Cloudflare account needed) */
  startQuickTunnel(localPort = 3443, protocol = 'https') {
    if (this._proc) return { ok: false, error: 'Tunnel already running' };
    if (!this.isAvailable()) return { ok: false, error: 'cloudflared not installed' };

    if (!existsSync(TUNNEL_DIR)) mkdirSync(TUNNEL_DIR, { recursive: true });

    const args = ['tunnel', '--url', `${protocol}://localhost:${localPort}`, '--no-tls-verify'];
    this._proc = spawn('cloudflared', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    this._status = 'starting';
    this._logs = [];

    this._proc.stderr.on('data', (data) => {
      const line = data.toString().trim();
      this._logs.push(line);
      if (this._logs.length > 100) this._logs.shift();

      // Extract tunnel URL from output
      const urlMatch = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (urlMatch) {
        this._url = urlMatch[0];
        this._status = 'running';
        log.info(`Quick tunnel active: ${this._url}`);
      }
    });

    this._proc.on('close', (code) => {
      this._status = 'stopped';
      this._proc = null;
      log.info(`Tunnel stopped (exit code ${code})`);
    });

    this._proc.on('error', (err) => {
      this._status = 'error';
      this._proc = null;
      log.error(`Tunnel error: ${err.message}`);
    });

    return { ok: true, status: 'starting' };
  }

  /** Stop the tunnel */
  stop() {
    if (!this._proc) return { ok: false, error: 'No tunnel running' };
    try { this._proc.kill('SIGTERM'); } catch {}
    this._proc = null;
    this._url = null;
    this._status = 'stopped';
    return { ok: true };
  }

  /** Get current tunnel status */
  getStatus() {
    return {
      available: this.isAvailable(),
      version: this.getVersion(),
      status: this._status,
      url: this._url,
      logs: this._logs.slice(-20),
    };
  }
}
