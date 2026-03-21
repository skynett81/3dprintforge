// routes/system.js — Backup, system info, Spoolman, konfig, reports, HA discovery, remote nodes,
//                    scheduler, filbibliotek, milestones, power monitor, circuit breakers, etc.
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getPrinters, getInventorySetting, setInventorySetting, getAllInventorySettings,
  getWidgetLayouts, getActiveWidgetLayout, saveWidgetLayout, setActiveWidgetLayout, deleteWidgetLayout,
  getTimeTracking, addTimeTracking, getTimeTrackingStats,
  getRemoteNodes, getRemoteNode, addRemoteNode, updateRemoteNode, deleteRemoteNode,
  getScheduledPrints, getScheduledPrint, addScheduledPrint, updateScheduledPrint, deleteScheduledPrint,
  getFileLibrary, getFileLibraryItem, addFileLibraryItem, updateFileLibraryItem, deleteFileLibraryItem,
  getFileLibraryCategories, incrementFileLibraryPrintCount,
  getWebhookConfigs, getWebhookConfig, addWebhookConfig, updateWebhookConfig, deleteWebhookConfig,
  getActiveWebhooks, addWebhookDelivery, updateWebhookDelivery, getWebhookDeliveries,
  savePrintCost, getPrintCost, getCostReport, getCostSummary, getCostStatistics,
  getMacros, getMacro, addMacro, updateMacro, deleteMacro,
  getHardwareItems, getHardwareItem, addHardwareItem, updateHardwareItem, deleteHardwareItem,
  assignHardware, unassignHardware, getHardwareForPrinter, getHardwareAssignments,
  getMaterials, getMaterial, getMaterialByName, updateMaterial, addMaterial,
  getProfiles, getProfileById, addProfile, updateProfile, deleteProfile, incrementProfileUse,
  getDailyActivity, getActivityStreaks,
  getHistory, getFilament
} from '../database.js';
import { createBackup, listBackups, restoreBackup, uploadBackup } from '../backup.js';
import { saveConfig, config, DATA_DIR } from '../config.js';
import { parse3mf, parseGcode } from '../file-parser.js';
import { generateReport, sendReportEmail, restartReportService } from '../report-service.js';
import { restartHaDiscovery, getHaDiscoveryStatus } from '../ha-discovery.js';
import { getRemoteNodeStates, restartRemoteNodes, testRemoteNode } from '../remote-nodes.js';
import { getMilestones, getMilestoneFile, getArchivedMilestones, getArchivedMilestoneFile } from '../milestone-service.js';
import { getAllBreakerStatus } from '../circuit-breaker.js';
import { validate } from '../validate.js';
import { sendJson, readBody, readBinaryBody } from '../api-helpers.js';
import { createLogger } from '../logger.js';
import { existsSync, statSync, createReadStream, unlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as _energy from '../energy-service.js';
import * as _power from '../power-monitor.js';

const log = createLogger('route:system');
const __dirname = dirname(fileURLToPath(import.meta.url));

const WEBHOOK_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  url: { type: 'url', required: true },
  events: { type: 'string' }
};

const PROFILE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  filament_type: { type: 'string', maxLength: 50 },
  nozzle_temp: { type: 'number', min: 0, max: 500 },
  bed_temp: { type: 'number', min: 0, max: 150 },
  speed: { type: 'number', min: 0 }
};

const MACRO_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const MACRO_UPDATE_SCHEMA = {
  name: { type: 'string', minLength: 1, maxLength: 200 }
};

const REMOTE_NODE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 },
  url: { type: 'url', required: true }
};

const REMOTE_NODE_UPDATE_SCHEMA = {
  name: { type: 'string', minLength: 1, maxLength: 200 },
  url: { type: 'url' }
};

const SCHEDULER_SCHEMA = {
  filename: { type: 'string', required: true, minLength: 1, maxLength: 500 },
  scheduled_at: { type: 'string', required: true, minLength: 1 }
};

const SCHEDULER_UPDATE_SCHEMA = {
  filename: { type: 'string', minLength: 1, maxLength: 500 },
  scheduled_at: { type: 'string', minLength: 1 }
};

const HARDWARE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const HARDWARE_ASSIGN_SCHEMA = {
  hardware_id: { required: true },
  printer_id: { required: true }
};

const HARDWARE_UNASSIGN_SCHEMA = {
  hardware_id: { required: true }
};

const MATERIAL_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const LIBRARY_ITEM_SCHEMA = {
  filename: { type: 'string', required: true, minLength: 1, maxLength: 500 }
};

const WIDGET_LAYOUT_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const WIDGET_ACTIVE_SCHEMA = {
  id: { required: true }
};

export async function handleSystemRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Prometheus (legacy path) ----
  if (method === 'GET' && path === '/metrics') {
    // Håndteres av hoved-dispatcher, pass-through her
    return false;
  }

  // ---- Database Backup ----
  if (method === 'POST' && path === '/api/backup') {
    try {
      const result = createBackup('manual');
      sendJson(res, { ok: true, ...result });
    } catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  if (method === 'GET' && path === '/api/backup/list') {
    sendJson(res, listBackups());
    return true;
  }

  const backupDlMatch = path.match(/^\/api\/backup\/download\/(.+\.db)$/);
  if (backupDlMatch && method === 'GET') {
    const backupPath = join(__dirname, '..', '..', 'data', 'backups', backupDlMatch[1]);
    if (!existsSync(backupPath)) return sendJson(res, { error: 'Not found' }, 404), true;
    const stat = statSync(backupPath);
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${backupDlMatch[1]}"`,
      'Content-Length': stat.size
    });
    createReadStream(backupPath).pipe(res);
    return true;
  }

  if (method === 'DELETE' && path.match(/^\/api\/backup\/(.+\.db)$/)) {
    const fname = path.match(/^\/api\/backup\/(.+\.db)$/)[1];
    const backupPath = join(__dirname, '..', '..', 'data', 'backups', fname);
    if (!existsSync(backupPath)) return sendJson(res, { error: 'Not found' }, 404), true;
    try { unlinkSync(backupPath); sendJson(res, { ok: true }); }
    catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  const restoreMatch = path.match(/^\/api\/backup\/restore\/(.+\.db)$/);
  if (restoreMatch && method === 'POST') {
    try {
      const result = restoreBackup(decodeURIComponent(restoreMatch[1]));
      sendJson(res, { ok: true, ...result, restart_required: true });
    } catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  if (method === 'POST' && path === '/api/backup/upload') {
    return new Promise((resolve) => {
      const chunks = [];
      let totalSize = 0;
      const MAX_SIZE = 100 * 1024 * 1024;
      req.on('data', (chunk) => {
        totalSize += chunk.length;
        if (totalSize > MAX_SIZE) { req.destroy(); return; }
        chunks.push(chunk);
      });
      req.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const fname = url.searchParams.get('filename') || 'uploaded-backup.db';
          const result = uploadBackup(buffer, fname);
          resolve(sendJson(res, { ok: true, ...result }));
        } catch (e) { resolve(sendJson(res, { error: e.message }, 500)); }
      });
      req.on('error', () => resolve(sendJson(res, { error: 'Upload failed' }, 500)));
    }), true;
  }

  // ---- System Info ----
  if (method === 'GET' && path === '/api/system/info') {
    const dbPath = join(__dirname, '..', '..', 'data', 'dashboard.db');
    const dbSize = existsSync(dbPath) ? statSync(dbPath).size : 0;
    const uptime = process.uptime();
    const mem = process.memoryUsage();
    sendJson(res, {
      uptime, uptime_seconds: Math.floor(uptime),
      memoryUsage: { rss: mem.rss, heapUsed: mem.heapUsed, heapTotal: mem.heapTotal },
      node_version: process.version, nodeVersion: process.version,
      platform: `${process.platform} ${process.arch}`,
      printerCount: getPrinters().length, printer_count: getPrinters().length,
      dbSize, db_size: dbSize, db_version: 76,
      pid: process.pid, memory_mb: Math.round(mem.rss / 1024 / 1024)
    });
    return true;
  }

  // ---- Spoolman ----
  if (method === 'GET' && path === '/api/spoolman/spools') {
    if (!config.spoolman?.enabled || !config.spoolman?.url) {
      return sendJson(res, { error: 'Spoolman not configured' }, 400), true;
    }
    try {
      const resp = await fetch(`${config.spoolman.url}/api/v1/spool`, { signal: AbortSignal.timeout(5000) });
      const data = await resp.json();
      sendJson(res, data);
    } catch (e) { sendJson(res, { error: e.message }, 502); }
    return true;
  }

  if (method === 'POST' && path === '/api/spoolman/use') {
    if (!config.spoolman?.enabled || !config.spoolman?.url) {
      return sendJson(res, { error: 'Spoolman not configured' }, 400), true;
    }
    return readBody(req, async (b) => {
      if (!b.id || !b.weight) return sendJson(res, { error: 'id and weight required' }, 400);
      try {
        const resp = await fetch(`${config.spoolman.url}/api/v1/spool/${b.id}/use`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ use_weight: b.weight }),
          signal: AbortSignal.timeout(5000)
        });
        const data = await resp.json();
        sendJson(res, data);
      } catch (e) { sendJson(res, { error: e.message }, 502); }
    }), true;
  }

  if (method === 'GET' && path === '/api/spoolman/test') {
    const testUrl = url.searchParams.get('url') || config.spoolman?.url;
    if (!testUrl) return sendJson(res, { error: 'URL required' }, 400), true;
    try {
      const resp = await fetch(`${testUrl}/api/v1/info`, { signal: AbortSignal.timeout(5000) });
      const data = await resp.json();
      sendJson(res, { ok: true, version: data.version || null });
    } catch (e) { sendJson(res, { ok: false, error: e.message }); }
    return true;
  }

  if (method === 'PUT' && path === '/api/spoolman/config') {
    return readBody(req, (b) => {
      config.spoolman = { enabled: !!b.enabled, url: (b.url || '').replace(/\/+$/, '') };
      saveConfig({ spoolman: config.spoolman });
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Macros ----
  if (method === 'GET' && path === '/api/macros') {
    sendJson(res, getMacros());
    return true;
  }

  const macroIdMatch = path.match(/^\/api\/macros\/(\d+)$/);
  if (method === 'POST' && path === '/api/macros') {
    return readBody(req, (b) => {
      const vr = validate(MACRO_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addMacro(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (macroIdMatch && method === 'GET') {
    const m = getMacro(parseInt(macroIdMatch[1]));
    if (!m) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, m);
    return true;
  }
  if (macroIdMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(MACRO_UPDATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      updateMacro(parseInt(macroIdMatch[1]), b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (macroIdMatch && method === 'DELETE') {
    deleteMacro(parseInt(macroIdMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Webhooks ----
  if (method === 'GET' && path === '/api/webhooks') {
    sendJson(res, getWebhookConfigs());
    return true;
  }
  if (method === 'POST' && path === '/api/webhooks') {
    return readBody(req, (b) => {
      const vr = validate(WEBHOOK_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: 'Validation failed', details: vr.errors }, 400);
      const id = addWebhookConfig(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  const webhookMatch = path.match(/^\/api\/webhooks\/(\d+)$/);
  if (webhookMatch) {
    const wid = parseInt(webhookMatch[1]);
    if (method === 'GET') { sendJson(res, getWebhookConfig(wid) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => { updateWebhookConfig(wid, b); sendJson(res, { ok: true }); }), true;
    }
    if (method === 'DELETE') { deleteWebhookConfig(wid); sendJson(res, { ok: true }); return true; }
  }

  // Webhook deliveries
  if (method === 'GET' && path === '/api/webhooks/deliveries') {
    const webhookId = url.searchParams.get('webhook_id') ? parseInt(url.searchParams.get('webhook_id')) : null;
    const limit = parseInt(url.searchParams.get('limit') || '50');
    sendJson(res, getWebhookDeliveries(webhookId, limit));
    return true;
  }

  // ---- Reports ----
  if (method === 'POST' && path === '/api/reports/generate') {
    return readBody(req, async (b) => {
      try {
        const report = await generateReport(b.type || 'weekly', b.format || 'json', b.printer_id || null);
        sendJson(res, report);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }

  if (method === 'POST' && path === '/api/reports/send') {
    return readBody(req, async (b) => {
      try {
        const result = await sendReportEmail(b.type || 'weekly');
        sendJson(res, result);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }

  if (method === 'POST' && path === '/api/reports/restart') {
    try { restartReportService(); sendJson(res, { ok: true }); }
    catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  // ---- HA Discovery ----
  if (method === 'GET' && path === '/api/ha-discovery/status') {
    sendJson(res, getHaDiscoveryStatus());
    return true;
  }

  if (method === 'POST' && path === '/api/ha-discovery/restart') {
    try { await restartHaDiscovery(); sendJson(res, { ok: true }); }
    catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  // ---- Remote Nodes ----
  if (method === 'GET' && path === '/api/remote-nodes') {
    sendJson(res, getRemoteNodes());
    return true;
  }

  if (method === 'GET' && path === '/api/remote-nodes/status') {
    sendJson(res, getRemoteNodeStates());
    return true;
  }

  if (method === 'POST' && path === '/api/remote-nodes/restart') {
    try { await restartRemoteNodes(); sendJson(res, { ok: true }); }
    catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  const remoteNodeMatch = path.match(/^\/api\/remote-nodes\/(\d+)$/);
  if (method === 'POST' && path === '/api/remote-nodes') {
    return readBody(req, (b) => {
      const vr = validate(REMOTE_NODE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addRemoteNode(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (remoteNodeMatch) {
    const nid = parseInt(remoteNodeMatch[1]);
    if (method === 'GET') { sendJson(res, getRemoteNode(nid) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => {
        const vr = validate(REMOTE_NODE_UPDATE_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        updateRemoteNode(nid, b); sendJson(res, { ok: true });
      }), true;
    }
    if (method === 'DELETE') { deleteRemoteNode(nid); sendJson(res, { ok: true }); return true; }
  }

  if (method === 'POST' && path.match(/^\/api\/remote-nodes\/\d+\/test$/)) {
    const nid = parseInt(path.split('/')[3]);
    try {
      const result = await testRemoteNode(nid);
      sendJson(res, result);
    } catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  // ---- Print Scheduler ----
  if (method === 'GET' && path === '/api/scheduler') {
    sendJson(res, getScheduledPrints());
    return true;
  }
  if (method === 'POST' && path === '/api/scheduler') {
    return readBody(req, (b) => {
      const vr = validate(SCHEDULER_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addScheduledPrint(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  const schedulerMatch = path.match(/^\/api\/scheduler\/(\d+)$/);
  if (schedulerMatch) {
    const sid = parseInt(schedulerMatch[1]);
    if (method === 'GET') { sendJson(res, getScheduledPrint(sid) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => {
        const vr = validate(SCHEDULER_UPDATE_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        updateScheduledPrint(sid, b); sendJson(res, { ok: true });
      }), true;
    }
    if (method === 'DELETE') { deleteScheduledPrint(sid); sendJson(res, { ok: true }); return true; }
  }

  // ---- File Library ----
  if (method === 'GET' && path === '/api/library') {
    sendJson(res, getFileLibrary({
      category: url.searchParams.get('category') || undefined,
      file_type: url.searchParams.get('type') || undefined,
      search: url.searchParams.get('q') || undefined,
      limit: parseInt(url.searchParams.get('limit')) || 50,
      offset: parseInt(url.searchParams.get('offset')) || 0
    }));
    return true;
  }

  if (method === 'GET' && path === '/api/library/categories') {
    sendJson(res, getFileLibraryCategories());
    return true;
  }

  if (method === 'POST' && path === '/api/library/upload') {
    const origName = url.searchParams.get('filename');
    if (!origName) return sendJson(res, { error: 'filename param required' }, 400), true;
    const ext = origName.split('.').pop().toLowerCase();
    const allowed = ['stl', '3mf', 'obj', 'step', 'gcode'];
    if (!allowed.includes(ext)) return sendJson(res, { error: 'Unsupported file type' }, 400), true;
    return readBinaryBody(req, (buffer) => {
      const ts = Date.now();
      const safeName = origName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storedName = `lib_${ts}_${safeName}`;
      const libDir = join(DATA_DIR, 'library');
      try { mkdirSync(libDir, { recursive: true }); } catch (e) { log.debug('Kunne ikke opprette bibliotekmappe: ' + e.message); }
      writeFileSync(join(libDir, storedName), buffer);
      let thumbPath = null;
      if (ext === '3mf') {
        try {
          const thumbNames = ['Metadata/plate_1.png', 'Metadata/top_1.png', 'Metadata/plate_2.png', 'Metadata/thumbnail.png'];
          const thumbBuf = _extractZipFile(buffer, thumbNames);
          if (thumbBuf) {
            const thumbName = `thumb_${ts}.png`;
            writeFileSync(join(libDir, thumbName), thumbBuf);
            thumbPath = thumbName;
          }
        } catch (e) { log.debug('Kunne ikke pakke ut thumbnail fra 3MF: ' + e.message); }
      }
      let est = {};
      try {
        if (ext === '3mf') est = parse3mf(buffer) || {};
        else if (ext === 'gcode') est = parseGcode(buffer.toString('utf-8', 0, Math.min(buffer.length, 200000))) || {};
      } catch (e) { log.debug('Kunne ikke parse fil for estimater (' + ext + '): ' + e.message); }
      const id = addFileLibraryItem({
        filename: storedName, original_name: origName, file_type: ext,
        file_size: buffer.length,
        category: url.searchParams.get('category') || 'uncategorized',
        tags: url.searchParams.get('tags') || null,
        estimated_time_s: est.estimated_time || null,
        estimated_filament_g: est.filament_used_g || null,
        filament_type: est.filament_type || null,
        thumbnail_path: thumbPath
      });
      sendJson(res, { id, filename: storedName }, 201);
    }), true;
  }

  if (method === 'POST' && path === '/api/library') {
    return readBody(req, (b) => {
      const vr = validate(LIBRARY_ITEM_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addFileLibraryItem(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }

  const libraryMatch = path.match(/^\/api\/library\/(\d+)$/);
  if (libraryMatch) {
    const lid = parseInt(libraryMatch[1]);
    if (method === 'GET') { sendJson(res, getFileLibraryItem(lid) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => { updateFileLibraryItem(lid, b); sendJson(res, { ok: true }); }), true;
    }
    if (method === 'DELETE') {
      const item = getFileLibraryItem(lid);
      if (item) {
        try { unlinkSync(join(DATA_DIR, 'library', item.filename)); } catch (e) { log.debug('Kunne ikke slette bibliotekfil ' + item.filename + ': ' + e.message); }
        if (item.thumbnail_path) try { unlinkSync(join(DATA_DIR, 'library', item.thumbnail_path)); } catch (e) { log.debug('Kunne ikke slette thumbnail ' + item.thumbnail_path + ': ' + e.message); }
      }
      deleteFileLibraryItem(lid);
      sendJson(res, { ok: true });
      return true;
    }
  }

  const libThumbMatch = path.match(/^\/api\/library\/(\d+)\/thumbnail$/);
  if (libThumbMatch && method === 'GET') {
    const item = getFileLibraryItem(parseInt(libThumbMatch[1]));
    if (!item || !item.thumbnail_path) return sendJson(res, { error: 'No thumbnail' }, 404), true;
    const thumbFile = join(DATA_DIR, 'library', item.thumbnail_path);
    if (!existsSync(thumbFile)) return sendJson(res, { error: 'Not found' }, 404), true;
    res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
    createReadStream(thumbFile).pipe(res);
    return true;
  }

  const libDownloadMatch = path.match(/^\/api\/library\/(\d+)\/download$/);
  if (libDownloadMatch && method === 'GET') {
    const item = getFileLibraryItem(parseInt(libDownloadMatch[1]));
    if (!item) return sendJson(res, { error: 'Not found' }, 404), true;
    const filePath = join(DATA_DIR, 'library', item.filename);
    if (!existsSync(filePath)) return sendJson(res, { error: 'File not found' }, 404), true;
    const stat = statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${item.original_name || item.filename}"`,
      'Content-Length': stat.size
    });
    createReadStream(filePath).pipe(res);
    return true;
  }

  if (method === 'POST' && path.match(/^\/api\/library\/\d+\/print$/)) {
    incrementFileLibraryPrintCount(parseInt(path.split('/')[3]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Activity Heatmap ----
  if (method === 'GET' && path === '/api/stats/activity') {
    const days = parseInt(url.searchParams.get('days') || '365');
    sendJson(res, getDailyActivity(days));
    return true;
  }

  if (method === 'GET' && path === '/api/stats/streaks') {
    sendJson(res, getActivityStreaks());
    return true;
  }

  // ---- Widget Layouts ----
  if (method === 'GET' && path === '/api/widget-layouts') {
    sendJson(res, getWidgetLayouts());
    return true;
  }
  if (method === 'GET' && path === '/api/widget-layouts/active') {
    sendJson(res, getActiveWidgetLayout());
    return true;
  }
  if (method === 'POST' && path === '/api/widget-layouts') {
    return readBody(req, (b) => {
      const vr = validate(WIDGET_LAYOUT_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = saveWidgetLayout(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (method === 'PUT' && path === '/api/widget-layouts/active') {
    return readBody(req, (b) => {
      const vr = validate(WIDGET_ACTIVE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      setActiveWidgetLayout(b.id);
      sendJson(res, { ok: true });
    }), true;
  }
  const widgetLayoutMatch = path.match(/^\/api\/widget-layouts\/(\d+)$/);
  if (widgetLayoutMatch && method === 'DELETE') {
    deleteWidgetLayout(parseInt(widgetLayoutMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Time Tracking ----
  if (method === 'GET' && path === '/api/time-tracking') {
    const printerId = url.searchParams.get('printer_id') || null;
    const limit = parseInt(url.searchParams.get('limit') || '100');
    sendJson(res, getTimeTracking(printerId, limit));
    return true;
  }
  if (method === 'POST' && path === '/api/time-tracking') {
    return readBody(req, (b) => {
      const id = addTimeTracking(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (method === 'GET' && path === '/api/time-tracking/stats') {
    const printerId = url.searchParams.get('printer_id') || null;
    sendJson(res, getTimeTrackingStats(printerId));
    return true;
  }

  // ---- Power Monitor ----
  if (method === 'GET' && path === '/api/power/status') {
    sendJson(res, _power.getStatus ? _power.getStatus() : { status: 'unavailable' });
    return true;
  }
  if (method === 'GET' && path === '/api/power/history') {
    const limit = parseInt(url.searchParams.get('limit') || '100');
    sendJson(res, _power.getHistory ? _power.getHistory(limit) : []);
    return true;
  }

  // ---- Energy Prices ----
  if (method === 'GET' && path === '/api/energy/price') {
    sendJson(res, _energy.getCurrentPrice ? _energy.getCurrentPrice() : null);
    return true;
  }
  if (method === 'GET' && path === '/api/energy/history') {
    const limit = parseInt(url.searchParams.get('limit') || '24');
    sendJson(res, _energy.getPriceHistory ? _energy.getPriceHistory(limit) : []);
    return true;
  }
  if (method === 'GET' && path === '/api/energy/config') {
    sendJson(res, _energy.getConfig ? _energy.getConfig() : {});
    return true;
  }
  if (method === 'PUT' && path === '/api/energy/config') {
    return readBody(req, (b) => {
      if (_energy.updateConfig) _energy.updateConfig(b);
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Circuit Breakers ----
  if (method === 'GET' && path === '/api/circuit-breakers') {
    sendJson(res, getAllBreakerStatus());
    return true;
  }

  // ---- Milestones ----
  if (method === 'GET' && path === '/api/milestones') {
    sendJson(res, getMilestones());
    return true;
  }
  if (method === 'GET' && path === '/api/milestones/archived') {
    sendJson(res, getArchivedMilestones());
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/milestones\/[^/]+$/)) {
    const fname = path.split('/').pop();
    const data = getMilestoneFile(fname);
    if (!data) return sendJson(res, { error: 'Not found' }, 404), true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return true;
  }

  // ---- Inventory Settings ----
  if (method === 'GET' && path === '/api/settings') {
    sendJson(res, getAllInventorySettings());
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/settings\/[^/]+$/)) {
    const key = path.split('/').pop();
    const value = getInventorySetting(key);
    sendJson(res, { key, value });
    return true;
  }
  if (method === 'PUT' && path.match(/^\/api\/settings\/[^/]+$/)) {
    const key = path.split('/').pop();
    return readBody(req, (b) => {
      setInventorySetting(key, b.value !== undefined ? b.value : b);
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Hardware Database ----
  if (method === 'GET' && path === '/api/hardware') {
    sendJson(res, getHardwareItems());
    return true;
  }
  if (method === 'POST' && path === '/api/hardware') {
    return readBody(req, (b) => {
      const vr = validate(HARDWARE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addHardwareItem(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  const hwMatch = path.match(/^\/api\/hardware\/(\d+)$/);
  if (hwMatch) {
    const hid = parseInt(hwMatch[1]);
    if (method === 'GET') { sendJson(res, getHardwareItem(hid) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => { updateHardwareItem(hid, b); sendJson(res, { ok: true }); }), true;
    }
    if (method === 'DELETE') { deleteHardwareItem(hid); sendJson(res, { ok: true }); return true; }
  }

  if (method === 'GET' && path.match(/^\/api\/hardware\/printer\/[^/]+$/)) {
    const printerId = path.split('/').pop();
    sendJson(res, getHardwareForPrinter(printerId));
    return true;
  }

  if (method === 'POST' && path === '/api/hardware/assign') {
    return readBody(req, (b) => {
      const vr = validate(HARDWARE_ASSIGN_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      assignHardware(b.hardware_id, b.printer_id, b.notes || null);
      sendJson(res, { ok: true });
    }), true;
  }

  if (method === 'POST' && path === '/api/hardware/unassign') {
    return readBody(req, (b) => {
      const vr = validate(HARDWARE_UNASSIGN_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      unassignHardware(b.hardware_id);
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Materials Database ----
  if (method === 'GET' && path === '/api/materials') {
    sendJson(res, getMaterials());
    return true;
  }
  if (method === 'POST' && path === '/api/materials') {
    return readBody(req, (b) => {
      const vr = validate(MATERIAL_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addMaterial(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  const matMatch = path.match(/^\/api\/materials\/(\d+)$/);
  if (matMatch) {
    const mid = parseInt(matMatch[1]);
    if (method === 'GET') { sendJson(res, getMaterial(mid) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => { updateMaterial(mid, b); sendJson(res, { ok: true }); }), true;
    }
  }

  // ---- Print Profiles ----
  if (method === 'GET' && path === '/api/profiles') {
    sendJson(res, getProfiles());
    return true;
  }
  if (method === 'POST' && path === '/api/profiles') {
    return readBody(req, (b) => {
      const vr = validate(PROFILE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: 'Validation failed', details: vr.errors }, 400);
      addProfile(b);
      sendJson(res, { ok: true });
    }), true;
  }
  const profileMatch = path.match(/^\/api\/profiles\/(\d+)$/);
  if (profileMatch) {
    const pid = parseInt(profileMatch[1]);
    if (method === 'GET') { sendJson(res, getProfileById(pid) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => { updateProfile(pid, b); sendJson(res, { ok: true }); }), true;
    }
    if (method === 'DELETE') { deleteProfile(pid); sendJson(res, { ok: true }); return true; }
  }
  const profileUseMatch = path.match(/^\/api\/profiles\/(\d+)\/use$/);
  if (profileUseMatch && method === 'POST') {
    incrementProfileUse(parseInt(profileUseMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Telemetry stats proxy ----
  if (method === 'GET' && path === '/api/telemetry/stats') {
    try {
      const resp = await fetch('https://telemetry.geektech.no/stats', { signal: AbortSignal.timeout(5000) });
      const data = await resp.json();
      sendJson(res, data);
    } catch {
      sendJson(res, { error: 'Telemetry unavailable' }, 502);
    }
    return true;
  }

  // ---- Achievements ----
  if (method === 'GET' && path === '/api/achievements') {
    sendJson(res, _calculateAchievements());
    return true;
  }

  return false;
}

// ---- Achievements kalkulering ----
function _calculateAchievements() {
  const history = getHistory(9999, 0);
  const spools = getFilament();

  const totalPrints = history.length;
  const completedPrints = history.filter(h => h.status === 'completed').length;
  const failedPrints = history.filter(h => h.status === 'failed').length;
  const totalFilamentG = history.reduce((sum, h) => sum + (h.filament_used_g || 0), 0);
  const totalSeconds = history.reduce((sum, h) => sum + (h.duration_seconds || 0), 0);
  const totalHours = totalSeconds / 3600;
  const uniqueFilaments = new Set(history.map(h => h.filament_type).filter(Boolean)).size;
  const uniqueColors = new Set(history.map(h => h.filament_color).filter(c => c && c.length >= 6)).size;
  const uniqueBrands = new Set(history.map(h => h.filament_brand).filter(Boolean)).size;
  const uniquePrinters = new Set(history.map(h => h.printer_id).filter(Boolean)).size;
  const uniqueNozzles = new Set(history.filter(h => h.nozzle_diameter).map(h => h.nozzle_diameter)).size;
  const uniqueModels = new Set(history.map(h => h.filename).filter(Boolean)).size;
  const successRate = totalPrints > 0 ? (completedPrints / totalPrints * 100) : 0;
  const longestPrint = Math.max(0, ...history.map(h => h.duration_seconds || 0));
  const shortestCompleted = history.filter(h => h.status === 'completed' && h.duration_seconds > 0);
  const shortestPrint = shortestCompleted.length > 0 ? Math.min(...shortestCompleted.map(h => h.duration_seconds)) : 0;
  const heaviestPrint = Math.max(0, ...history.map(h => h.filament_used_g || 0));
  const lightestCompleted = history.filter(h => h.status === 'completed' && h.filament_used_g > 0);
  const lightestPrint = lightestCompleted.length > 0 ? Math.min(...lightestCompleted.map(h => h.filament_used_g)) : 0;
  const totalLayers = history.reduce((sum, h) => sum + (h.layer_count || 0), 0);
  const sorted = history.filter(h => h.status).sort((a, b) => new Date(a.started_at) - new Date(b.started_at));
  const consecutiveSuccess = _longestStreak(sorted);

  const speedModes = new Set(history.map(h => h.speed_level).filter(Boolean));
  const ludicrousPrints = history.filter(h => h.speed_level === 4 && h.status === 'completed').length;
  const silentPrints = history.filter(h => h.speed_level === 1 && h.status === 'completed').length;

  const nightPrints = history.filter(h => { if (!h.started_at) return false; const hr = new Date(h.started_at).getHours(); return hr >= 0 && hr < 5; }).length;
  const earlyPrints = history.filter(h => { if (!h.started_at) return false; const hr = new Date(h.started_at).getHours(); return hr >= 5 && hr < 7; }).length;
  const weekendPrints = history.filter(h => { if (!h.started_at) return false; const d = new Date(h.started_at).getDay(); return d === 0 || d === 6; }).length;

  const printDays = new Set(history.filter(h => h.started_at).map(h => h.started_at.substring(0, 10)));
  const printMonths = new Set(history.filter(h => h.started_at).map(h => h.started_at.substring(0, 7)));
  const dailyStreak = _longestDailyStreak(printDays);
  const weeklyStreak = _longestWeeklyStreak(printDays);

  const maxNozzleTemp = Math.max(0, ...history.map(h => h.max_nozzle_temp || 0));
  const maxBedTemp = Math.max(0, ...history.map(h => h.max_bed_temp || 0));
  const amsPrints = history.filter(h => h.ams_units_used && h.ams_units_used > 1).length;
  const multiColorPrints = history.filter(h => h.color_changes && h.color_changes > 0).length;
  const comebackKing = _hasComeback(sorted, 3);
  const comebackLegend = _hasComeback(sorted, 5);

  const modelCounts = {};
  for (const h of history) { if (h.filename) modelCounts[h.filename] = (modelCounts[h.filename] || 0) + 1; }
  const maxReprints = Math.max(0, ...Object.values(modelCounts));

  const printsByDay = {};
  for (const h of history) { if (h.started_at) { const d = h.started_at.substring(0, 10); printsByDay[d] = (printsByDay[d] || 0) + 1; } }
  const maxPrintsOneDay = Math.max(0, ...Object.values(printsByDay));

  const firstPrintDate = sorted.length > 0 && sorted[0].started_at ? new Date(sorted[0].started_at) : null;
  const accountAgeDays = firstPrintDate ? Math.floor((Date.now() - firstPrintDate) / 86400000) : 0;
  const accountAgeWeeks = Math.floor(accountAgeDays / 7);
  const accountAgeMonths = firstPrintDate ? _monthsDiff(firstPrintDate, new Date()) : 0;
  const printsPerWeek = accountAgeWeeks > 0 ? completedPrints / accountAgeWeeks : 0;
  const printsPerMonth = accountAgeMonths > 0 ? completedPrints / accountAgeMonths : 0;

  const sortedDays = [...printDays].sort();
  let longestGap = 0;
  for (let i = 1; i < sortedDays.length; i++) {
    const gap = Math.floor((new Date(sortedDays[i]) - new Date(sortedDays[i - 1])) / 86400000);
    longestGap = Math.max(longestGap, gap);
  }

  const totalSpoolWeight = spools.reduce((s, sp) => s + (sp.remaining_weight_g || 0), 0);
  const spoolVendors = new Set(spools.map(s => s.vendor_name).filter(Boolean)).size;
  const spoolColors = new Set(spools.filter(s => s.color_hex && s.color_hex.length >= 6).map(s => s.color_hex.substring(0, 6))).size;

  const all = [
    { id: 'first_print', icon: '\u{1F3AF}', title: 'First Print', desc: 'Complete your first print', target: 1, current: completedPrints, category: 'prints' },
    { id: 'prints_10', icon: '\u2B50', title: 'Getting Started', desc: 'Complete 10 prints', target: 10, current: completedPrints, category: 'prints' },
    { id: 'prints_50', icon: '\u{1F525}', title: 'On a Roll', desc: 'Complete 50 prints', target: 50, current: completedPrints, category: 'prints' },
    { id: 'prints_100', icon: '\u{1F4AF}', title: 'Centurion', desc: 'Complete 100 prints', target: 100, current: completedPrints, category: 'prints' },
    { id: 'prints_500', icon: '\u{1F3C6}', title: 'Print Master', desc: 'Complete 500 prints', target: 500, current: completedPrints, category: 'prints' },
    { id: 'prints_1000', icon: '\u{1F451}', title: 'Print Legend', desc: 'Complete 1,000 prints', target: 1000, current: completedPrints, category: 'prints' },
    { id: 'prints_2500', icon: '\u{1F30C}', title: 'Galaxy Brain', desc: 'Complete 2,500 prints', target: 2500, current: completedPrints, category: 'prints' },
    { id: 'prints_5000', icon: '\u{1F680}', title: 'To Infinity', desc: 'Complete 5,000 prints', target: 5000, current: completedPrints, category: 'prints' },
    { id: 'batch_5', icon: '\u{1F4E6}', title: 'Batch Job', desc: '5 prints in a single day', target: 5, current: maxPrintsOneDay, category: 'prints' },
    { id: 'batch_10', icon: '\u{1F3ED}', title: 'Factory Mode', desc: '10 prints in a single day', target: 10, current: maxPrintsOneDay, category: 'prints' },
    { id: 'batch_20', icon: '\u26A1', title: 'Assembly Line', desc: '20 prints in a single day', target: 20, current: maxPrintsOneDay, category: 'prints' },
    { id: 'reprint_5', icon: '\u{1F504}', title: 'Repeat Customer', desc: 'Print the same model 5 times', target: 5, current: maxReprints, category: 'prints' },
    { id: 'reprint_20', icon: '\u{1F3F7}\uFE0F', title: 'Mass Production', desc: 'Print the same model 20 times', target: 20, current: maxReprints, category: 'prints' },
    { id: 'unique_50', icon: '\u{1F4DA}', title: 'Diverse Portfolio', desc: 'Print 50 unique models', target: 50, current: uniqueModels, category: 'prints' },
    { id: 'unique_200', icon: '\u{1F30D}', title: 'World Builder', desc: 'Print 200 unique models', target: 200, current: uniqueModels, category: 'prints' },
    { id: 'filament_1kg', icon: '\u{1F9F5}', title: '1 kg Club', desc: 'Use 1 kg of filament', target: 1000, current: Math.round(totalFilamentG), category: 'filament' },
    { id: 'filament_10kg', icon: '\u{1F3A8}', title: 'Filament Enthusiast', desc: 'Use 10 kg of filament', target: 10000, current: Math.round(totalFilamentG), category: 'filament' },
    { id: 'filament_50kg', icon: '\u{1F3ED}', title: 'Production Line', desc: 'Use 50 kg of filament', target: 50000, current: Math.round(totalFilamentG), category: 'filament' },
    { id: 'filament_100kg', icon: '\u{1F30B}', title: 'Plastic Volcano', desc: 'Use 100 kg of filament', target: 100000, current: Math.round(totalFilamentG), category: 'filament' },
    { id: 'materials_3', icon: '\u{1F3AD}', title: 'Material Explorer', desc: 'Use 3 different filament types', target: 3, current: uniqueFilaments, category: 'filament' },
    { id: 'materials_6', icon: '\u{1F308}', title: 'Rainbow Maker', desc: 'Use 6 different filament types', target: 6, current: uniqueFilaments, category: 'filament' },
    { id: 'materials_10', icon: '\u{1F52C}', title: 'Material Scientist', desc: 'Use 10 different filament types', target: 10, current: uniqueFilaments, category: 'filament' },
    { id: 'colors_10', icon: '\u{1F3A8}', title: 'Color Palette', desc: 'Print with 10 different colors', target: 10, current: uniqueColors, category: 'filament' },
    { id: 'colors_25', icon: '\u{1F308}', title: 'Chromatic', desc: 'Print with 25 different colors', target: 25, current: uniqueColors, category: 'filament' },
    { id: 'brands_3', icon: '\u{1F6CD}\uFE0F', title: 'Brand Taster', desc: 'Use filament from 3 brands', target: 3, current: uniqueBrands, category: 'filament' },
    { id: 'brands_5', icon: '\u{1F6D2}', title: 'Brand Connoisseur', desc: 'Use filament from 5 brands', target: 5, current: uniqueBrands, category: 'filament' },
    { id: 'heavy_print', icon: '\u{1F4AA}', title: 'Heavy Lifter', desc: 'Complete a single print using 500g+', target: 500, current: Math.round(heaviestPrint), category: 'filament' },
    { id: 'mega_print', icon: '\u{1F9BE}', title: 'Mega Build', desc: 'Complete a single print using 1 kg+', target: 1000, current: Math.round(heaviestPrint), category: 'filament' },
    { id: 'tiny_print', icon: '\u{1F90F}', title: 'Precision Work', desc: 'Complete a print using under 2g', target: 1, current: (lightestPrint > 0 && lightestPrint < 2) ? 1 : 0, category: 'filament' },
    { id: 'multicolor_1', icon: '\u{1F3A8}', title: 'Color Mixing', desc: 'Complete a multi-color print', target: 1, current: multiColorPrints, category: 'filament' },
    { id: 'multicolor_25', icon: '\u{1F5BC}\uFE0F', title: 'Artist', desc: 'Complete 25 multi-color prints', target: 25, current: multiColorPrints, category: 'filament' },
    { id: 'ams_10', icon: '\u{1F504}', title: 'AMS Powered', desc: 'Complete 10 prints using multiple AMS slots', target: 10, current: amsPrints, category: 'filament' },
    { id: 'hours_24', icon: '\u23F0', title: 'Full Day', desc: 'Print for 24 total hours', target: 24, current: Math.round(totalHours * 10) / 10, category: 'time' },
    { id: 'hours_100', icon: '\u23F1\uFE0F', title: 'Time Invested', desc: 'Print for 100 total hours', target: 100, current: Math.round(totalHours * 10) / 10, category: 'time' },
    { id: 'hours_500', icon: '\u{1F550}', title: 'Dedicated Maker', desc: 'Print for 500 total hours', target: 500, current: Math.round(totalHours * 10) / 10, category: 'time' },
    { id: 'hours_1000', icon: '\u{1F3C5}', title: 'Thousand Hour Club', desc: 'Print for 1,000 total hours', target: 1000, current: Math.round(totalHours * 10) / 10, category: 'time' },
    { id: 'hours_2500', icon: '\u{1F31F}', title: 'Time Lord', desc: 'Print for 2,500 total hours', target: 2500, current: Math.round(totalHours * 10) / 10, category: 'time' },
    { id: 'marathon', icon: '\u{1F3C3}', title: 'Marathon Print', desc: 'Complete a print over 12 hours', target: 43200, current: longestPrint, category: 'time' },
    { id: 'ultramarathon', icon: '\u{1F9BE}', title: 'Ultra Marathon', desc: 'Complete a print over 24 hours', target: 86400, current: longestPrint, category: 'time' },
    { id: 'ironman', icon: '\u{1F9D7}', title: 'Ironman', desc: 'Complete a print over 48 hours', target: 172800, current: longestPrint, category: 'time' },
    { id: 'speedster', icon: '\u26A1', title: 'Speed Demon', desc: 'Complete a print in under 30 minutes', target: 1, current: (shortestPrint > 0 && shortestPrint < 1800) ? 1 : 0, category: 'time' },
    { id: 'quickdraw', icon: '\u{1F4A8}', title: 'Quick Draw', desc: 'Complete a print in under 10 minutes', target: 1, current: (shortestPrint > 0 && shortestPrint < 600) ? 1 : 0, category: 'time' },
    { id: 'night_owl', icon: '\u{1F989}', title: 'Night Owl', desc: 'Start 10 prints between midnight and 5 AM', target: 10, current: nightPrints, category: 'time' },
    { id: 'early_bird', icon: '\u{1F426}', title: 'Early Bird', desc: 'Start 10 prints between 5 AM and 7 AM', target: 10, current: earlyPrints, category: 'time' },
    { id: 'weekend_warrior', icon: '\u{1F3D6}\uFE0F', title: 'Weekend Warrior', desc: 'Complete 50 weekend prints', target: 50, current: weekendPrints, category: 'time' },
    { id: 'streak_5', icon: '\u{1F517}', title: 'Winning Streak', desc: '5 successful prints in a row', target: 5, current: consecutiveSuccess, category: 'quality' },
    { id: 'streak_20', icon: '\u{1F48E}', title: 'Flawless Run', desc: '20 successful prints in a row', target: 20, current: consecutiveSuccess, category: 'quality' },
    { id: 'streak_50', icon: '\u{1F3C6}', title: 'Untouchable', desc: '50 successful prints in a row', target: 50, current: consecutiveSuccess, category: 'quality' },
    { id: 'streak_100', icon: '\u{1F47D}', title: 'Inhuman Precision', desc: '100 successful prints in a row', target: 100, current: consecutiveSuccess, category: 'quality' },
    { id: 'success_95', icon: '\u{1F3AF}', title: 'Sharpshooter', desc: '95%+ success rate (min 20 prints)', target: 95, current: totalPrints >= 20 ? Math.round(successRate * 10) / 10 : 0, category: 'quality' },
    { id: 'success_99', icon: '\u{1F9EC}', title: 'Almost Perfect', desc: '99%+ success rate (min 50 prints)', target: 99, current: totalPrints >= 50 ? Math.round(successRate * 10) / 10 : 0, category: 'quality' },
    { id: 'zero_fails', icon: '\u2728', title: 'Perfect Week', desc: '0 failed prints this week', target: 1, current: _noFailsThisWeek(history) ? 1 : 0, category: 'quality' },
    { id: 'comeback', icon: '\u{1F4AA}', title: 'Comeback Kid', desc: 'Succeed after 3 consecutive failures', target: 1, current: comebackKing ? 1 : 0, category: 'quality' },
    { id: 'comeback_legend', icon: '\u{1F9D7}', title: 'Never Give Up', desc: 'Succeed after 5 consecutive failures', target: 1, current: comebackLegend ? 1 : 0, category: 'quality' },
    { id: 'layers_100k', icon: '\u{1F4C8}', title: 'Layer by Layer', desc: 'Accumulate 100,000 total layers', target: 100000, current: totalLayers, category: 'quality' },
    { id: 'layers_1m', icon: '\u{1F3D7}\uFE0F', title: 'Skyscraper', desc: 'Accumulate 1,000,000 total layers', target: 1000000, current: totalLayers, category: 'quality' },
    { id: 'multi_printer_2', icon: '\u{1F5A8}\uFE0F', title: 'Dual Operator', desc: 'Print on 2 different printers', target: 2, current: uniquePrinters, category: 'exploration' },
    { id: 'multi_printer_3', icon: '\u{1F3E2}', title: 'Print Farm', desc: 'Print on 3+ different printers', target: 3, current: uniquePrinters, category: 'exploration' },
    { id: 'multi_printer_5', icon: '\u{1F3ED}', title: 'Fleet Commander', desc: 'Print on 5+ different printers', target: 5, current: uniquePrinters, category: 'exploration' },
    { id: 'nozzle_2', icon: '\u{1F50D}', title: 'Nozzle Swap', desc: 'Use 2 different nozzle sizes', target: 2, current: uniqueNozzles, category: 'exploration' },
    { id: 'nozzle_4', icon: '\u{1F52E}', title: 'Nozzle Collector', desc: 'Use 4+ different nozzle sizes', target: 4, current: uniqueNozzles, category: 'exploration' },
    { id: 'all_speeds', icon: '\u{1F3CE}\uFE0F', title: 'Speed Explorer', desc: 'Use all 4 speed modes', target: 4, current: speedModes.size, category: 'exploration' },
    { id: 'ludicrous_10', icon: '\u{1F680}', title: 'Ludicrous Speed', desc: 'Complete 10 prints in Ludicrous mode', target: 10, current: ludicrousPrints, category: 'exploration' },
    { id: 'ludicrous_50', icon: '\u{1F4A5}', title: 'Warp Drive', desc: 'Complete 50 prints in Ludicrous mode', target: 50, current: ludicrousPrints, category: 'exploration' },
    { id: 'silent_10', icon: '\u{1F910}', title: 'Ninja Mode', desc: 'Complete 10 prints in Silent mode', target: 10, current: silentPrints, category: 'exploration' },
    { id: 'hot_nozzle', icon: '\u{1F321}\uFE0F', title: 'Feeling the Heat', desc: 'Print at 280\u00B0C+ nozzle temperature', target: 280, current: maxNozzleTemp, category: 'exploration' },
    { id: 'hot_bed', icon: '\u{1F525}', title: 'Hot Plate', desc: 'Print at 100\u00B0C+ bed temperature', target: 100, current: maxBedTemp, category: 'exploration' },
    { id: 'daily_3', icon: '\u{1F4C5}', title: 'Three Day Run', desc: 'Print 3 days in a row', target: 3, current: dailyStreak, category: 'dedication' },
    { id: 'daily_7', icon: '\u{1F4C6}', title: 'Weekly Printer', desc: 'Print every day for a week', target: 7, current: dailyStreak, category: 'dedication' },
    { id: 'daily_14', icon: '\u{1F3C3}\u200D\u2642\uFE0F', title: 'Two Week Streak', desc: 'Print every day for 2 weeks', target: 14, current: dailyStreak, category: 'dedication' },
    { id: 'daily_30', icon: '\u{1F525}', title: 'Monthly Machine', desc: 'Print every day for a month', target: 30, current: dailyStreak, category: 'dedication' },
    { id: 'weekly_4', icon: '\u{1F4AA}', title: 'Consistent Maker', desc: 'Print at least once a week for 4 weeks', target: 4, current: weeklyStreak, category: 'dedication' },
    { id: 'weekly_12', icon: '\u{1F9D1}\u200D\u{1F3A8}', title: 'Quarter Master', desc: 'Print at least once a week for 12 weeks', target: 12, current: weeklyStreak, category: 'dedication' },
    { id: 'weekly_26', icon: '\u{1F3C5}', title: 'Half Year Hero', desc: 'Print at least once a week for 26 weeks', target: 26, current: weeklyStreak, category: 'dedication' },
    { id: 'monthly_6', icon: '\u{1F30D}', title: 'Seasoned Maker', desc: 'Print in 6 different months', target: 6, current: printMonths.size, category: 'dedication' },
    { id: 'monthly_12', icon: '\u{1F389}', title: 'Year-Round Maker', desc: 'Print in 12 different months', target: 12, current: printMonths.size, category: 'dedication' },
    { id: 'print_days_100', icon: '\u{1F4C5}', title: '100 Print Days', desc: 'Have 100 unique days with prints', target: 100, current: printDays.size, category: 'dedication' },
    { id: 'print_days_365', icon: '\u{1F38A}', title: 'Year of Making', desc: 'Have 365 unique days with prints', target: 365, current: printDays.size, category: 'dedication' },
    { id: 'weekly_52', icon: '\u{1F451}', title: 'Year-Long Commitment', desc: 'Print at least once a week for 52 weeks', target: 52, current: weeklyStreak, category: 'dedication' },
    { id: 'daily_60', icon: '\u{1F9D8}', title: 'Zen Master', desc: 'Print every day for 60 days', target: 60, current: dailyStreak, category: 'dedication' },
    { id: 'daily_90', icon: '\u{1F3C6}', title: 'Unstoppable', desc: 'Print every day for 90 days straight', target: 90, current: dailyStreak, category: 'dedication' },
    { id: 'daily_180', icon: '\u{1F30C}', title: 'Half Year Streak', desc: 'Print every day for 180 days', target: 180, current: dailyStreak, category: 'dedication' },
    { id: 'daily_365', icon: '\u{1F3C6}', title: 'The Undying Flame', desc: 'Print every single day for an entire year', target: 365, current: dailyStreak, category: 'dedication' },
    { id: 'comeback_from_gap', icon: '\u{1F504}', title: 'The Return', desc: 'Resume printing after a 30+ day break', target: 30, current: longestGap, category: 'dedication' },
    { id: 'age_week', icon: '\u{1F331}', title: 'First Week', desc: 'Your printing journey is 1 week old', target: 7, current: accountAgeDays, category: 'milestones' },
    { id: 'age_month', icon: '\u{1F33F}', title: 'One Month In', desc: 'Your printing journey is 1 month old', target: 30, current: accountAgeDays, category: 'milestones' },
    { id: 'age_3months', icon: '\u{1F333}', title: 'Quarter Veteran', desc: 'Your printing journey is 3 months old', target: 90, current: accountAgeDays, category: 'milestones' },
    { id: 'age_6months', icon: '\u{1F334}', title: 'Half Year Maker', desc: 'Your printing journey is 6 months old', target: 180, current: accountAgeDays, category: 'milestones' },
    { id: 'age_1year', icon: '\u{1F3C5}', title: 'One Year Anniversary', desc: 'Your printing journey is 1 year old', target: 365, current: accountAgeDays, category: 'milestones' },
    { id: 'age_2years', icon: '\u{1F396}\uFE0F', title: 'Two Year Veteran', desc: 'Your printing journey is 2 years old', target: 730, current: accountAgeDays, category: 'milestones' },
    { id: 'monthly_24', icon: '\u{1F30D}', title: 'Two-Year Streak', desc: 'Print in 24 different months', target: 24, current: printMonths.size, category: 'milestones' },
    { id: 'avg_5_per_week', icon: '\u{1F4C8}', title: 'Power User', desc: 'Average 5+ prints per week over your career', target: 5, current: Math.round(printsPerWeek * 10) / 10, category: 'milestones' },
    { id: 'avg_50_per_month', icon: '\u{1F4C8}', title: 'Production Mode', desc: 'Average 50+ prints per month over your career', target: 50, current: Math.round(printsPerMonth * 10) / 10, category: 'milestones' },
    { id: 'spools_10', icon: '\u{1F4E6}', title: 'Stocked Up', desc: 'Have 10+ spools in inventory', target: 10, current: spools.length, category: 'collection' },
    { id: 'spools_25', icon: '\u{1F3EA}', title: 'Mini Warehouse', desc: 'Have 25+ spools in inventory', target: 25, current: spools.length, category: 'collection' },
    { id: 'spools_50', icon: '\u{1F3E0}', title: 'Filament Hoarder', desc: 'Have 50+ spools in inventory', target: 50, current: spools.length, category: 'collection' },
    { id: 'spools_100', icon: '\u{1F3ED}', title: 'Warehouse Manager', desc: 'Have 100+ spools in inventory', target: 100, current: spools.length, category: 'collection' },
    { id: 'spool_vendors_3', icon: '\u{1F6D2}', title: 'Vendor Variety', desc: 'Have spools from 3+ vendors', target: 3, current: spoolVendors, category: 'collection' },
    { id: 'spool_vendors_5', icon: '\u{1F30E}', title: 'Global Shopper', desc: 'Have spools from 5+ vendors', target: 5, current: spoolVendors, category: 'collection' },
    { id: 'spool_colors_10', icon: '\u{1F3A8}', title: 'Color Collector', desc: 'Have 10+ unique colors in inventory', target: 10, current: spoolColors, category: 'collection' },
    { id: 'spool_colors_25', icon: '\u{1F308}', title: 'Rainbow Stash', desc: 'Have 25+ unique colors in inventory', target: 25, current: spoolColors, category: 'collection' },
    { id: 'stock_5kg', icon: '\u{1F4E6}', title: '5 kg Reserve', desc: 'Have 5 kg of filament in stock', target: 5000, current: Math.round(totalSpoolWeight), category: 'collection' },
    { id: 'stock_25kg', icon: '\u{1F9F1}', title: 'Filament Fortress', desc: 'Have 25 kg of filament in stock', target: 25000, current: Math.round(totalSpoolWeight), category: 'collection' },
  ];

  return all.map(a => ({ ...a, earned: a.current >= a.target, progress: Math.min(1, a.current / a.target) }));
}

function _longestStreak(sorted) {
  let max = 0, cur = 0;
  for (const h of sorted) {
    if (h.status === 'completed') { cur++; max = Math.max(max, cur); }
    else cur = 0;
  }
  return max;
}

function _noFailsThisWeek(history) {
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const thisWeek = history.filter(h => new Date(h.started_at) >= weekAgo);
  return thisWeek.length > 0 && thisWeek.every(h => h.status !== 'failed');
}

function _hasComeback(sorted, failCount) {
  let fails = 0;
  for (const h of sorted) {
    if (h.status === 'failed') { fails++; }
    else if (h.status === 'completed') { if (fails >= failCount) return true; fails = 0; }
    else { fails = 0; }
  }
  return false;
}

function _longestDailyStreak(daySet) {
  if (daySet.size === 0) return 0;
  const days = [...daySet].sort();
  let max = 1, cur = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) { cur++; max = Math.max(max, cur); }
    else if (diff > 1) { cur = 1; }
  }
  return max;
}

function _longestWeeklyStreak(daySet) {
  if (daySet.size === 0) return 0;
  const days = [...daySet].sort();
  const weeks = new Set();
  for (const d of days) {
    const dt = new Date(d);
    const jan1 = new Date(dt.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((dt - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    weeks.add(`${dt.getFullYear()}-W${weekNum}`);
  }
  const sortedW = [...weeks].sort();
  let max = 1, cur = 1;
  for (let i = 1; i < sortedW.length; i++) {
    const [py, pw] = sortedW[i - 1].split('-W').map(Number);
    const [cy, cw] = sortedW[i].split('-W').map(Number);
    if ((cy === py && cw === pw + 1) || (cy === py + 1 && pw >= 52 && cw === 1)) { cur++; max = Math.max(max, cur); }
    else { cur = 1; }
  }
  return max;
}

function _monthsDiff(d1, d2) {
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

// ---- ZIP-fil uttrekker (for 3MF thumbnail) ----
function _extractZipFile(zipBuf, targetPaths) {
  let eocdOff = -1;
  for (let i = zipBuf.length - 22; i >= Math.max(0, zipBuf.length - 65557); i--) {
    if (zipBuf.readUInt32LE(i) === 0x06054b50) { eocdOff = i; break; }
  }
  if (eocdOff < 0) return null;
  const cdOffset = zipBuf.readUInt32LE(eocdOff + 16);
  const entryCount = zipBuf.readUInt16LE(eocdOff + 10);
  let pos = cdOffset;
  for (let i = 0; i < entryCount; i++) {
    if (pos + 46 > zipBuf.length || zipBuf.readUInt32LE(pos) !== 0x02014b50) break;
    const compression = zipBuf.readUInt16LE(pos + 10);
    const compressedSize = zipBuf.readUInt32LE(pos + 20);
    const fnLen = zipBuf.readUInt16LE(pos + 28);
    const extraLen = zipBuf.readUInt16LE(pos + 30);
    const commentLen = zipBuf.readUInt16LE(pos + 32);
    const localOffset = zipBuf.readUInt32LE(pos + 42);
    const filename = zipBuf.subarray(pos + 46, pos + 46 + fnLen).toString('utf8');
    if (targetPaths.some(tp => filename === tp || filename.toLowerCase() === tp.toLowerCase())) {
      if (localOffset + 30 > zipBuf.length || zipBuf.readUInt32LE(localOffset) !== 0x04034b50) return null;
      const lfhFnLen = zipBuf.readUInt16LE(localOffset + 26);
      const lfhExtraLen = zipBuf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lfhFnLen + lfhExtraLen;
      if (dataStart + compressedSize > zipBuf.length) return null;
      const data = zipBuf.subarray(dataStart, dataStart + compressedSize);
      if (compression === 0) return data;
      if (compression === 8) { try { return inflateRawSync(data); } catch { return null; } }
      return null;
    }
    pos += 46 + fnLen + extraLen + commentLen;
  }
  return null;
}
