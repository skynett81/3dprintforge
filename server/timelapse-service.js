// Timelapse Recording Service — captures frames from RTSP stream, assembles to MP4
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { addTimelapseRecording, updateTimelapseRecording, deleteTimelapseRecording } from './database.js';
import { DATA_DIR } from './config.js';

const TIMELAPSE_DIR = join(DATA_DIR, 'timelapse');

export class TimelapseService {
  constructor() {
    this._active = new Map(); // printerId -> { ffmpeg, recordingId, framesDir, frameCount }
  }

  init() {
    if (!existsSync(TIMELAPSE_DIR)) mkdirSync(TIMELAPSE_DIR, { recursive: true });
    console.log('[timelapse] Service initialized');
  }

  startRecording(printerId, printerIp, accessCode, printHistoryId = null) {
    if (this._active.has(printerId)) {
      console.log(`[timelapse:${printerId}] Already recording`);
      return null;
    }

    if (!printerIp || !accessCode) {
      console.log(`[timelapse:${printerId}] No IP or access code, skipping`);
      return null;
    }

    const timestamp = Date.now();
    const printerDir = join(TIMELAPSE_DIR, printerId);
    const framesDir = join(printerDir, String(timestamp));
    mkdirSync(framesDir, { recursive: true });

    const filename = `timelapse_${printerId}_${timestamp}`;
    const recordingId = addTimelapseRecording({
      printer_id: printerId,
      print_history_id: printHistoryId,
      filename,
      format: 'mp4',
      file_path: join(printerDir, `${filename}.mp4`),
      status: 'recording'
    });

    // Capture one frame every 10 seconds from RTSP stream
    const rtspUrl = `rtsps://bblp:${accessCode}@${printerIp}:322/streaming/live/1`;
    const args = [
      '-rtsp_transport', 'tcp',
      '-i', rtspUrl,
      '-vf', 'fps=1/10',
      '-q:v', '3',
      '-y',
      join(framesDir, 'frame_%06d.jpg')
    ];

    let ffmpeg;
    try {
      ffmpeg = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'ignore'] });
    } catch (e) {
      console.error(`[timelapse:${printerId}] Failed to spawn ffmpeg:`, e.message);
      updateTimelapseRecording(recordingId, { status: 'failed' });
      return null;
    }

    ffmpeg.on('error', (err) => {
      console.error(`[timelapse:${printerId}] ffmpeg error:`, err.message);
      this._active.delete(printerId);
    });

    ffmpeg.on('close', () => {
      // Normal close handled by stopRecording
    });

    this._active.set(printerId, { ffmpeg, recordingId, framesDir, frameCount: 0, filename, printerDir, timestamp });
    console.log(`[timelapse:${printerId}] Recording started (ID: ${recordingId})`);
    return recordingId;
  }

  async stopRecording(printerId, printHistoryId = null) {
    const entry = this._active.get(printerId);
    if (!entry) return null;

    // Kill ffmpeg capture
    if (entry.ffmpeg) {
      entry.ffmpeg.kill('SIGTERM');
    }
    this._active.delete(printerId);

    // Count captured frames
    let frameCount = 0;
    try {
      const files = readdirSync(entry.framesDir).filter(f => f.endsWith('.jpg'));
      frameCount = files.length;
    } catch (_) {}

    if (frameCount < 2) {
      console.log(`[timelapse:${printerId}] Only ${frameCount} frames, skipping assembly`);
      updateTimelapseRecording(entry.recordingId, { status: 'failed', frame_count: frameCount });
      this._cleanupFrames(entry.framesDir);
      return null;
    }

    // Update print_history_id if provided
    if (printHistoryId) {
      updateTimelapseRecording(entry.recordingId, { print_history_id: printHistoryId });
    }

    // Assemble frames to MP4
    updateTimelapseRecording(entry.recordingId, { status: 'processing', frame_count: frameCount });
    const outputPath = join(entry.printerDir, `${entry.filename}.mp4`);

    return new Promise((resolve) => {
      const assembleArgs = [
        '-framerate', '10',
        '-i', join(entry.framesDir, 'frame_%06d.jpg'),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '23',
        '-preset', 'fast',
        '-y',
        outputPath
      ];

      let assembler;
      try {
        assembler = spawn('ffmpeg', assembleArgs, { stdio: ['ignore', 'ignore', 'ignore'] });
      } catch (e) {
        console.error(`[timelapse:${printerId}] Assembly spawn failed:`, e.message);
        updateTimelapseRecording(entry.recordingId, { status: 'failed' });
        this._cleanupFrames(entry.framesDir);
        resolve(null);
        return;
      }

      assembler.on('close', (code) => {
        if (code === 0 && existsSync(outputPath)) {
          const stats = statSync(outputPath);
          const durationS = Math.round(frameCount / 10); // 1 frame per 10s
          updateTimelapseRecording(entry.recordingId, {
            status: 'complete',
            file_path: outputPath,
            file_size_bytes: stats.size,
            duration_seconds: durationS,
            frame_count: frameCount,
            completed_at: new Date().toISOString()
          });
          console.log(`[timelapse:${printerId}] Assembly complete: ${frameCount} frames, ${(stats.size / 1024 / 1024).toFixed(1)}MB`);
        } else {
          updateTimelapseRecording(entry.recordingId, { status: 'failed' });
          console.error(`[timelapse:${printerId}] Assembly failed (code: ${code})`);
        }
        this._cleanupFrames(entry.framesDir);
        resolve(entry.recordingId);
      });

      assembler.on('error', (err) => {
        console.error(`[timelapse:${printerId}] Assembly error:`, err.message);
        updateTimelapseRecording(entry.recordingId, { status: 'failed' });
        this._cleanupFrames(entry.framesDir);
        resolve(null);
      });
    });
  }

  isRecording(printerId) {
    return this._active.has(printerId);
  }

  getActiveRecordings() {
    const result = [];
    for (const [printerId, entry] of this._active) {
      result.push({ printerId, recordingId: entry.recordingId });
    }
    return result;
  }

  _cleanupFrames(framesDir) {
    try {
      if (existsSync(framesDir)) rmSync(framesDir, { recursive: true, force: true });
    } catch (_) {}
  }

  shutdown() {
    for (const [printerId, entry] of this._active) {
      if (entry.ffmpeg) entry.ffmpeg.kill('SIGTERM');
    }
    this._active.clear();
  }
}
