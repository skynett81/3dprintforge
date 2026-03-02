import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, unlinkSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from './config.js';
import { addFailureDetection, getInventorySetting } from './database.js';

const FRAMES_DIR = join(DATA_DIR, 'detection_frames');

export class FailureDetectionService {
  constructor(printerManager, notifier, broadcastFn) {
    this._printerManager = printerManager;
    this._notifier = notifier;
    this._broadcast = broadcastFn;
    this._monitors = new Map(); // printerId -> { timer, lastFrame }
    this._enabled = false;
  }

  init() {
    if (!existsSync(FRAMES_DIR)) mkdirSync(FRAMES_DIR, { recursive: true });
    this._enabled = getInventorySetting('ai_detection_enabled') === '1';
    console.log(`[ai-detect] Service initialized (enabled: ${this._enabled})`);
  }

  startMonitoring(printerId, printerIp, accessCode) {
    if (!this._enabled) return;
    if (this._monitors.has(printerId)) return;

    const interval = parseInt(getInventorySetting('ai_detection_interval') || '60') * 1000;
    const monitor = {
      timer: setInterval(() => this._captureAndAnalyze(printerId, printerIp, accessCode), interval),
      lastFrame: null,
      frameCount: 0
    };
    this._monitors.set(printerId, monitor);
    console.log(`[ai-detect] Monitoring started for ${printerId} (interval: ${interval / 1000}s)`);
  }

  stopMonitoring(printerId) {
    const monitor = this._monitors.get(printerId);
    if (monitor) {
      clearInterval(monitor.timer);
      this._monitors.delete(printerId);
      console.log(`[ai-detect] Monitoring stopped for ${printerId}`);
    }
  }

  isMonitoring(printerId) {
    return this._monitors.has(printerId);
  }

  getActiveMonitors() {
    return Array.from(this._monitors.keys());
  }

  shutdown() {
    for (const [pid] of this._monitors) this.stopMonitoring(pid);
  }

  async _captureAndAnalyze(printerId, printerIp, accessCode) {
    const framePath = join(FRAMES_DIR, `${printerId}_${Date.now()}.jpg`);

    try {
      // Capture a single frame via RTSP
      await this._captureFrame(printerIp, accessCode, framePath);

      if (!existsSync(framePath)) return;

      // Analyze the frame for common failure patterns
      const result = await this._analyzeFrame(framePath, printerId);

      if (result.detected) {
        const sensitivity = getInventorySetting('ai_detection_sensitivity') || 'medium';
        const thresholds = { low: 0.8, medium: 0.6, high: 0.4 };
        const threshold = thresholds[sensitivity] || 0.6;

        if (result.confidence >= threshold) {
          const action = getInventorySetting('ai_detection_action') || 'notify';

          const detectionId = addFailureDetection({
            printer_id: printerId,
            detection_type: result.type,
            confidence: result.confidence,
            frame_path: framePath,
            action_taken: action,
            details: result.details
          });

          // Notify
          if (this._notifier) {
            this._notifier.notify('print_failure_detected', {
              printer_id: printerId,
              detection_type: result.type,
              confidence: Math.round(result.confidence * 100),
              action: action
            });
          }

          if (this._broadcast) {
            this._broadcast('failure_detected', { id: detectionId, printer_id: printerId, type: result.type, confidence: result.confidence });
          }

          return;
        }
      }

      // Clean up frame if no detection
      try { unlinkSync(framePath); } catch {}
    } catch (e) {
      console.warn(`[ai-detect] Analysis error for ${printerId}:`, e.message);
      try { unlinkSync(framePath); } catch {}
    }
  }

  _captureFrame(ip, accessCode, outputPath) {
    return new Promise((resolve, reject) => {
      const args = [
        '-y', '-rtsp_transport', 'tcp',
        '-i', `rtsps://bblp:${accessCode}@${ip}:322/streaming/live/1`,
        '-frames:v', '1', '-q:v', '2',
        outputPath
      ];
      const proc = spawn('ffmpeg', args, { stdio: 'pipe', timeout: 15000 });
      proc.on('close', code => code === 0 ? resolve() : reject(new Error(`FFmpeg exit ${code}`)));
      proc.on('error', reject);
      setTimeout(() => { try { proc.kill('SIGKILL'); } catch {} }, 15000);
    });
  }

  async _analyzeFrame(framePath, printerId) {
    // Heuristic-based detection using image analysis
    // Compares consecutive frames for anomalies
    const monitor = this._monitors.get(printerId);
    if (!monitor) return { detected: false };

    try {
      const currentFrame = readFileSync(framePath);
      const currentSize = currentFrame.length;

      if (monitor.lastFrame) {
        const lastSize = monitor.lastFrame.length;
        const sizeDiff = Math.abs(currentSize - lastSize) / Math.max(lastSize, 1);

        // Sudden large change in frame size can indicate spaghetti/detachment
        if (sizeDiff > 0.4 && monitor.frameCount > 3) {
          monitor.lastFrame = currentFrame;
          monitor.frameCount++;
          return {
            detected: true,
            type: 'anomaly_detected',
            confidence: Math.min(0.5 + sizeDiff * 0.5, 0.95),
            details: { size_change: sizeDiff, frames_analyzed: monitor.frameCount }
          };
        }

        // Very small frame = possible camera obstruction or nozzle blob
        if (currentSize < 5000) {
          monitor.lastFrame = currentFrame;
          monitor.frameCount++;
          return {
            detected: true,
            type: 'camera_obstruction',
            confidence: 0.7,
            details: { frame_size: currentSize }
          };
        }
      }

      monitor.lastFrame = currentFrame;
      monitor.frameCount++;
    } catch {}

    return { detected: false };
  }
}
