import { spawn } from 'node:child_process';
import { connect as tlsConnect } from 'node:tls';
import net from 'node:net';
import { WebSocketServer } from 'ws';

/**
 * CameraStream — supports two protocols:
 *   1. JPEG stream over TLS port 6000 (P1S, P1P, A1, A1 mini, P2S, H2-series)
 *   2. RTSP via ffmpeg port 322 (X1C, X1E — fallback for all models)
 *
 * Auto-detects: tries JPEG port 6000 first, falls back to RTSP port 322.
 * Clients receive JPEG frames via WebSocket (binary).
 * For RTSP mode, ffmpeg transcodes to MPEG-TS and JSMpeg decodes on client.
 */
export class CameraStream {
  constructor(config) {
    this.ip = config.printer.ip;
    this.accessCode = config.printer.accessCode;
    this.port = config.server.cameraWsPort;
    this.resolution = config.camera?.resolution || '640x480';
    this.framerate = config.camera?.framerate || 15;
    this.bitrate = config.camera?.bitrate || '1000k';
    this.enabled = config.camera?.enabled !== false;

    this.wss = null;
    this.ffmpeg = null;
    this.tlsSocket = null;
    this.clients = new Set();
    this.restartTimer = null;
    this.stopTimer = null;
    this.restartCount = 0;
    this.mode = null; // 'jpeg' or 'rtsp'
    this._headerBuf = Buffer.alloc(0);
    this._authDenied = false;
  }

  start() {
    if (!this.enabled) {
      console.log('[kamera] Kamera deaktivert i konfig');
      return;
    }

    this.wss = new WebSocketServer({ port: this.port });

    this.wss.on('error', (err) => {
      console.warn(`[kamera] WebSocket-feil på port ${this.port}: ${err.message}`);
      this.wss = null;
    });

    console.log(`[kamera] WebSocket server på port ${this.port}`);

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log(`[kamera] Klient tilkoblet (${this.clients.size} totalt), modus: ${this.mode || 'detecting'}`);

      if (this.stopTimer) {
        clearTimeout(this.stopTimer);
        this.stopTimer = null;
      }

      // If auth was previously denied, tell the new client immediately
      if (this._authDenied) {
        ws.send(JSON.stringify({ error: 'auth_denied' }));
        return;
      }

      // Start stream if not running
      if (!this.ffmpeg && !this.tlsSocket) {
        this._startStream();
      }

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[kamera] Klient frakoblet (${this.clients.size} totalt)`);

        if (this.clients.size === 0 && !this.stopTimer) {
          this.stopTimer = setTimeout(() => {
            this._stopStream();
            this.stopTimer = null;
          }, 10000);
        }
      });

      ws.on('error', () => {
        this.clients.delete(ws);
      });
    });
  }

  stop() {
    this._stopStream();
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }

  /**
   * Auto-detect: probe port 6000 (JPEG), fallback to port 322 (RTSP).
   */
  _startStream() {
    if (!this.ip) {
      console.warn('[kamera] Ingen IP-adresse konfigurert');
      return;
    }

    // Probe port 6000 first (JPEG stream)
    const probe = new net.Socket();
    probe.setTimeout(2000);

    probe.on('connect', () => {
      probe.destroy();
      console.log(`[kamera] Port 6000 åpen — bruker JPEG-stream`);
      this.mode = 'jpeg';
      this._startJpegStream();
    });

    probe.on('error', () => {
      probe.destroy();
      console.log(`[kamera] Port 6000 stengt — prøver RTSP (port 322)`);
      this.mode = 'rtsp';
      this._startFfmpeg();
    });

    probe.on('timeout', () => {
      probe.destroy();
      console.log(`[kamera] Port 6000 timeout — prøver RTSP (port 322)`);
      this.mode = 'rtsp';
      this._startFfmpeg();
    });

    probe.connect(6000, this.ip);
  }

  /**
   * JPEG stream over TLS port 6000.
   * Protocol: 80-byte auth packet → auth response → repeating [16-byte header + JPEG data].
   */
  _startJpegStream() {
    console.log(`[kamera] Kobler til JPEG-stream ${this.ip}:6000...`);

    try {
      this.tlsSocket = tlsConnect({
        host: this.ip,
        port: 6000,
        rejectUnauthorized: false, // Printer uses self-signed cert
      });
    } catch (e) {
      console.error('[kamera] TLS tilkobling feilet:', e.message);
      this._fallbackToRtsp();
      return;
    }

    this.tlsSocket.on('secureConnect', () => {
      console.log('[kamera] TLS tilkoblet — sender autentisering');

      // Build 80-byte auth packet
      const authPacket = Buffer.alloc(80);
      authPacket.writeUInt32LE(0x40, 0);    // Payload size: 64 bytes
      authPacket.writeUInt32LE(0x3000, 4);  // Type: auth request
      authPacket.writeUInt32LE(0, 8);       // Flags
      authPacket.writeUInt32LE(0, 12);      // Reserved

      // Username "bblp" padded to 32 bytes
      const user = Buffer.alloc(32, 0);
      user.write('bblp', 'utf8');
      user.copy(authPacket, 16);

      // Access code padded to 32 bytes
      const pass = Buffer.alloc(32, 0);
      pass.write(this.accessCode || '', 'utf8');
      pass.copy(authPacket, 48);

      this.tlsSocket.write(authPacket);
      this._headerBuf = Buffer.alloc(0);
      this._readState = 'auth_response'; // Wait for auth response first
      this._payloadSize = 0;
    });

    this.tlsSocket.on('data', (chunk) => {
      this._handleJpegData(chunk);
    });

    this.tlsSocket.on('error', (err) => {
      console.warn('[kamera] JPEG-stream feil:', err.message);
      this._cleanupJpeg();
      if (!this._authDenied) {
        this._scheduleRestart();
      }
    });

    this.tlsSocket.on('close', () => {
      console.log('[kamera] JPEG-stream lukket');
      this.tlsSocket = null;
      if (this.clients.size > 0 && !this._authDenied) {
        this._scheduleRestart();
      }
    });

    // Reset restart counter after 5s of stable connection
    setTimeout(() => {
      if (this.tlsSocket) this.restartCount = 0;
    }, 5000);
  }

  /**
   * Parse JPEG frames from TLS stream.
   * First response after auth: 16-byte header + 8-byte payload with result code.
   * Then repeating: [16-byte header + JPEG data].
   */
  _handleJpegData(chunk) {
    this._headerBuf = Buffer.concat([this._headerBuf, chunk]);

    while (this._headerBuf.length > 0) {
      // Auth response: 16-byte header + small payload
      if (this._readState === 'auth_response') {
        if (this._headerBuf.length < 16) return;

        const payloadSize = this._headerBuf.readUInt32LE(0);
        if (this._headerBuf.length < 16 + payloadSize) return;

        const payload = this._headerBuf.subarray(16, 16 + payloadSize);
        this._headerBuf = this._headerBuf.subarray(16 + payloadSize);

        // Check for error code 0xFFFFFFFF in payload
        if (payloadSize >= 4 && payload.readUInt32LE(0) === 0xFFFFFFFF) {
          console.warn('[kamera] Autentisering avvist — LAN Live View er trolig deaktivert på printeren');
          this._authDenied = true;
          this._broadcastError('auth_denied');
          this._cleanupJpeg();
          return;
        }

        console.log('[kamera] Autentisering godkjent — starter JPEG-stream');
        this._readState = 'header';
        continue;
      }

      if (this._readState === 'header') {
        if (this._headerBuf.length < 16) return; // Need more data

        this._payloadSize = this._headerBuf.readUInt32LE(0);
        this._headerBuf = this._headerBuf.subarray(16);

        if (this._payloadSize <= 0 || this._payloadSize > 10 * 1024 * 1024) {
          // Invalid payload — skip and reset
          this._headerBuf = Buffer.alloc(0);
          this._readState = 'header';
          return;
        }

        this._readState = 'payload';
      }

      if (this._readState === 'payload') {
        if (this._headerBuf.length < this._payloadSize) return; // Need more data

        const frame = this._headerBuf.subarray(0, this._payloadSize);
        this._headerBuf = this._headerBuf.subarray(this._payloadSize);
        this._readState = 'header';

        // Validate JPEG markers (FFD8 start)
        if (frame.length > 2 && frame[0] === 0xFF && frame[1] === 0xD8) {
          this._broadcastJpeg(frame);
        }
      }
    }
  }

  /**
   * Send JPEG frame to all WebSocket clients.
   */
  _broadcastJpeg(frame) {
    for (const ws of this.clients) {
      if (ws.readyState === 1) {
        ws.send(frame, { binary: true });
      }
    }
  }

  /**
   * Send error message to all WebSocket clients (as JSON text).
   */
  _broadcastError(error) {
    const msg = JSON.stringify({ error });
    for (const ws of this.clients) {
      if (ws.readyState === 1) {
        ws.send(msg);
      }
    }
  }

  _cleanupJpeg() {
    if (this.tlsSocket) {
      try { this.tlsSocket.destroy(); } catch {}
      this.tlsSocket = null;
    }
    this._headerBuf = Buffer.alloc(0);
  }

  _fallbackToRtsp() {
    console.log('[kamera] JPEG feilet — fallback til RTSP');
    this._cleanupJpeg();
    this.mode = 'rtsp';
    this._startFfmpeg();
  }

  /**
   * RTSP via ffmpeg (X1C, X1E, or fallback).
   * Transcodes to MPEG-TS for JSMpeg decoding on client.
   */
  _startFfmpeg() {
    const mpeg1Fps = this.framerate >= 25 ? this.framerate : 25;

    const args = [
      '-rtsp_transport', 'tcp',
      '-i', `rtsps://bblp:${this.accessCode}@${this.ip}:322/streaming/live/1`,
      '-f', 'mpegts',
      '-codec:v', 'mpeg1video',
      '-b:v', this.bitrate,
      '-r', String(mpeg1Fps),
      '-s', this.resolution,
      '-an',
      '-q:v', '5',
      'pipe:1'
    ];

    console.log(`[kamera] Starter ffmpeg (RTSP)...`);

    try {
      this.ffmpeg = spawn('ffmpeg', args, {
        stdio: ['ignore', 'pipe', 'ignore']
      });
    } catch (e) {
      console.error('[kamera] Kunne ikke starte ffmpeg:', e.message);
      return;
    }

    this.ffmpeg.stdout.on('data', (data) => {
      for (const ws of this.clients) {
        if (ws.readyState === 1) {
          ws.send(data, { binary: true });
        }
      }
    });

    this.ffmpeg.on('close', (code) => {
      console.log(`[kamera] ffmpeg avsluttet (kode: ${code})`);
      this.ffmpeg = null;
      if (this.clients.size > 0) {
        this._scheduleRestart();
      }
    });

    this.ffmpeg.on('error', (err) => {
      console.error('[kamera] ffmpeg feil:', err.message);
      this.ffmpeg = null;
    });

    setTimeout(() => {
      if (this.ffmpeg) this.restartCount = 0;
    }, 5000);
  }

  _scheduleRestart() {
    if (this.restartCount >= 5) return;
    this.restartCount++;
    const delay = Math.min(2000 * this.restartCount, 15000);
    console.log(`[kamera] Restarter om ${delay}ms (forsøk ${this.restartCount}/5)...`);
    this.restartTimer = setTimeout(() => {
      this._startStream();
    }, delay);
  }

  _stopStream() {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    if (this.ffmpeg) {
      console.log('[kamera] Stopper ffmpeg');
      this.ffmpeg.kill('SIGTERM');
      this.ffmpeg = null;
    }
    this._cleanupJpeg();
  }
}
