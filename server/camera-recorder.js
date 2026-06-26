// camera-recorder.js — record a printer's live camera to an MP4 file.
//
// The camera pipelines (Bambu JPEG-over-TLS, Moonraker snapshots) all surface
// the feed as a stream of JPEG frames. This recorder pipes those frames into
// ffmpeg (image2pipe) and encodes H.264/MP4, timestamping by arrival time so
// the clip's duration matches real elapsed time even when the frame rate is
// uneven. Self-contained; the camera just calls writeFrame() for each frame.

import { spawn } from 'node:child_process';
import { statSync } from 'node:fs';
import { createLogger } from './logger.js';

const log = createLogger('camera-rec');

// Hard safety cap so a forgotten recording can't fill the disk.
const MAX_DURATION_MS = 2 * 60 * 60 * 1000; // 2h

export class CameraRecorder {
  constructor(outPath, opts = {}) {
    this.outPath = outPath;
    this.fps = Math.min(30, Math.max(1, parseInt(opts.fps) || 15));
    this.proc = null;
    this.startedAt = 0;
    this.frames = 0;
    this.stopping = false;
    this._onStop = opts.onStop || null; // (result) => void, called when finalised
    this._maxTimer = null;
  }

  start() {
    if (this.proc) return;
    // The frame stream is concatenated JPEGs = MJPEG, so use the mjpeg demuxer.
    // -use_wallclock_as_timestamps stamps each frame by arrival time so the clip
    // duration reflects real elapsed time even at an uneven frame rate; -r gives
    // a constant output rate that fills that real-time span.
    const args = [
      '-hide_banner', '-loglevel', 'error',
      '-f', 'mjpeg', '-use_wallclock_as_timestamps', '1', '-i', 'pipe:0',
      '-an',
      '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
      '-r', String(this.fps), '-movflags', '+faststart',
      '-y', this.outPath,
    ];
    this.proc = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'pipe'] });
    this.startedAt = Date.now();
    let stderr = '';
    this.proc.stderr.on('data', (d) => { stderr += d.toString(); if (stderr.length > 4000) stderr = stderr.slice(-4000); });
    this.proc.stdin.on('error', () => { /* EPIPE when ffmpeg exits — ignore */ });
    this.proc.on('close', (code) => {
      if (this._maxTimer) { clearTimeout(this._maxTimer); this._maxTimer = null; }
      const durationS = Math.round((Date.now() - this.startedAt) / 1000);
      let sizeBytes = 0;
      try { sizeBytes = statSync(this.outPath).size; } catch { /* missing */ }
      const ok = code === 0 && this.frames > 0 && sizeBytes > 0;
      if (!ok) log.warn(`ffmpeg recording ended code=${code} frames=${this.frames} size=${sizeBytes} ${stderr ? '| ' + stderr.split('\n').filter(Boolean).slice(-1)[0] : ''}`);
      this.proc = null;
      if (this._onStop) { try { this._onStop({ ok, durationS, sizeBytes, frames: this.frames }); } catch (e) { log.warn('onStop failed: ' + e.message); } }
    });
    this.proc.on('error', (e) => { log.error('ffmpeg spawn failed: ' + e.message); });
    // Auto-stop at the safety cap.
    this._maxTimer = setTimeout(() => { log.warn('Recording hit max duration — stopping'); this.stop(); }, MAX_DURATION_MS);
    return true;
  }

  writeFrame(jpeg) {
    if (!this.proc || this.stopping || !this.proc.stdin.writable) return;
    try { this.proc.stdin.write(jpeg); this.frames++; }
    catch { /* backpressure/closed — drop the frame */ }
  }

  // End input; the 'close' handler finalises and calls onStop.
  stop() {
    if (!this.proc || this.stopping) return;
    this.stopping = true;
    try { this.proc.stdin.end(); } catch { /* ignore */ }
    // If ffmpeg doesn't exit promptly, force it.
    setTimeout(() => { if (this.proc) { try { this.proc.kill('SIGINT'); } catch { /* ignore */ } } }, 4000);
  }

  get active() { return !!this.proc && !this.stopping; }
}
