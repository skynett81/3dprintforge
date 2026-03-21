// api-routes.js — Tynn dispatcher som delegerer til domene-rute-moduler
// Beholder: setter-eksporter, handleAuthApiRequest, pre-auth ruter,
//           dispatchWebhooksForEvent, og hjelpefunksjoner for metrics/status/docs.

import {
  getPrinters, getHistory, getFilament, getInventorySetting, getActiveWebhooks,
  addWebhookDelivery, updateWebhookDelivery, getProjectByShareToken,
  getSpoolmanPerSpoolMetrics
} from './database.js';
import { saveConfig, config } from './config.js';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isAuthEnabled, isMultiUser, validateCredentials, createSession, destroySession,
  getSessionToken, validateSession, hashPassword, validateApiKey, generateApiKey,
  hasPermission, validateCredentialsDB, getSessionUser, requirePermission
} from './auth.js';
import { getAllBreakerStatus } from './circuit-breaker.js';
import {
  checkLoginRate, checkApiRate, getApiRateHeaders, sendJson, readBody, pkgVersion as _pkgVersion
} from './api-helpers.js';
import { createLogger } from './logger.js';

// ---- Domene-rute-moduler ----
import { handlePrinterRoutes } from './routes/printers.js';
import { handleInventoryRoutes } from './routes/inventory.js';
import { handleHistoryRoutes } from './routes/history.js';
import { handleMonitoringRoutes } from './routes/monitoring.js';
import { handleQueueRoutes } from './routes/queue.js';
import { handleAuthRoutes } from './routes/auth.js';
import { handleSystemRoutes } from './routes/system.js';
import { handleModelRoutes } from './routes/models.js';
import { handleCommunityRoutes } from './routes/community.js';
import { handleProjectRoutes } from './routes/projects.js';
import { handleEcommerceRoutes } from './routes/ecommerce.js';
import { handlePluginRoutes } from './routes/plugins.js';

const log = createLogger('api');

// ---- Modul-nivå tilstandsvariabler (settes via setter-eksporter) ----
let _broadcastFn = null;
let _onPrinterRemoved = null;
let _onPrinterAdded = null;
let _onPrinterUpdated = null;
let _onDemoPurge = null;
let _notifier = null;
let _updater = null;
let _hub = null;
let _guard = null;
let _queueManager = null;
let _timelapseService = null;
let _ecomLicense = null;
let _printerManager = null;
let _failureDetector = null;
let _discovery = null;
let _testMqttConnection = null;
let _bambuCloud = null;
let _wearPrediction = null;
let _materialRecommender = null;
let _errorPatternAnalyzer = null;
let _pluginManager = null;

// ---- Setter-eksporter ----

export function setGuard(guard) {
  _guard = guard;
}

export function setNotifier(notifier) {
  _notifier = notifier;
}

export function setUpdater(updater) {
  _updater = updater;
}

export function setHub(hub) {
  _hub = hub;
}

export function setQueueManager(qm) {
  _queueManager = qm;
}

export function setTimelapseService(tl) {
  _timelapseService = tl;
}

export function setEcomLicense(mgr) {
  _ecomLicense = mgr;
}

export function setPrinterManager(pm) {
  _printerManager = pm;
}

export function setFailureDetector(fd) {
  _failureDetector = fd;
}

export function setDiscovery(discovery, testFn) {
  _discovery = discovery;
  _testMqttConnection = testFn;
}

export function setBambuCloud(cloud) {
  _bambuCloud = cloud;
}

export function setWearPrediction(wp) {
  _wearPrediction = wp;
}

export function setMaterialRecommender(mr) {
  _materialRecommender = mr;
}

export function setErrorPatternAnalyzer(epa) {
  _errorPatternAnalyzer = epa;
}

export function setPluginManager(pm) {
  _pluginManager = pm;
}

export function setApiBroadcast(fn) {
  _broadcastFn = fn;
}

export function setOnPrinterRemoved(fn) {
  _onPrinterRemoved = fn;
}

export function setOnPrinterAdded(fn) {
  _onPrinterAdded = fn;
}

export function setOnPrinterUpdated(fn) {
  _onPrinterUpdated = fn;
}

export function setOnDemoPurge(fn) {
  _onDemoPurge = fn;
}

// ---- Permission enforcement ----

function getRoutePermission(method, path) {
  if (method === 'GET') return 'view';

  if (path.startsWith('/api/users') || path.startsWith('/api/roles') || path.startsWith('/api/keys')) return 'admin';
  if (path === '/api/auth/config' || path.startsWith('/api/auth/totp')) return 'admin';
  if (path === '/api/community-filaments/seed' || path === '/api/kb/seed') return 'admin';
  if (path === '/api/update/apply') return 'admin';
  if (path === '/api/demo') return 'admin';
  if (path === '/api/hub/settings') return 'admin';

  if (path.match(/^\/api\/printers\/[^/]+\/files\/print$/)) return 'print';
  if (path === '/api/printer-groups/staggered-start') return 'print';
  if (path.startsWith('/api/slicer/')) return 'print';

  if (path.startsWith('/api/queue')) return 'queue';

  if (path.startsWith('/api/discovery')) return 'admin';
  if (path.startsWith('/api/bambu-cloud')) return 'admin';
  if (path === '/api/printers' && method === 'POST') return 'admin';
  if (path.match(/^\/api\/printers\/[^/]+$/) && (method === 'PUT' || method === 'DELETE')) return 'controls';
  if (path.startsWith('/api/maintenance') || path.startsWith('/api/protection')) return 'controls';
  if (path === '/api/waste') return 'controls';
  if (path.match(/^\/api\/printers\/[^/]+\/files/)) return 'controls';

  if (path.startsWith('/api/filament') || path.startsWith('/api/inventory')) return 'filament';
  if (path.startsWith('/api/community-filaments')) return 'filament';
  if (path.startsWith('/api/brand-defaults') || path.startsWith('/api/custom-fields')) return 'filament';
  if (path.startsWith('/api/price-history') || path.startsWith('/api/price-alerts') || path.startsWith('/api/build-plates')) return 'filament';
  if (path.startsWith('/api/dryer-models') || path.startsWith('/api/storage-conditions')) return 'filament';
  if (path.startsWith('/api/tags') || path.startsWith('/api/nfc')) return 'filament';
  if (path.startsWith('/api/palette')) return 'filament';
  if (path.startsWith('/api/spoolman')) return 'filament';

  if (path.startsWith('/api/macros')) return 'macros';

  if (path.startsWith('/api/notifications') || path.startsWith('/api/webhooks')) return 'admin';
  if (path.startsWith('/api/hardware') || path.startsWith('/api/materials')) return 'admin';
  if (path.startsWith('/api/printer-groups')) return 'admin';
  if (path.startsWith('/api/ecommerce')) return 'admin';
  if (path.startsWith('/api/export')) return 'admin';
  if (path.startsWith('/api/courses') || path.startsWith('/api/kb')) return 'admin';
  if (path.startsWith('/api/backup')) return 'admin';
  if (path.startsWith('/api/timelapse') && method === 'DELETE') return 'admin';
  if (path.startsWith('/api/plugins') && method !== 'GET') return 'admin';
  if (path.startsWith('/api/remote-nodes') || path.startsWith('/api/ha-discovery')) return 'admin';
  if (path.startsWith('/api/scheduler') && (method === 'POST' || method === 'PUT' || method === 'DELETE')) return 'controls';
  if (path.startsWith('/api/library') && (method === 'POST' || method === 'PUT' || method === 'DELETE')) return 'controls';
  if (path.startsWith('/api/model-link')) return 'controls';

  if (path.startsWith('/api/push')) return 'view';

  return method === 'GET' ? 'view' : 'admin';
}

function requirePerm(req, res, permission) {
  if (!requirePermission(req, permission)) {
    sendJson(res, { error: 'Forbidden', required: permission }, 403);
    return false;
  }
  return true;
}

// ---- Auth-handler (beholdes her for bakoverkompatibilitet) ----

export async function handleAuthApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  try {
    if (method === 'GET' && path === '/api/auth/status') {
      const enabled = isAuthEnabled();
      const token = getSessionToken(req);
      const authenticated = enabled ? validateSession(token) : true;
      const requiresUsername = isMultiUser() || !!(config.auth?.username);
      let user = null;
      if (authenticated && token) {
        const session = getSessionUser(token);
        if (session) {
          user = {
            username: session.username,
            displayName: session.displayName || session.username,
            roleName: session.roleName || 'admin',
            permissions: session.permissions || ['*']
          };
        }
      }
      return sendJson(res, { enabled, authenticated, requiresUsername, user });
    }

    if (method === 'POST' && path === '/api/auth/login') {
      if (!isAuthEnabled()) {
        return sendJson(res, { ok: true });
      }
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
      if (!checkLoginRate(clientIp)) {
        return sendJson(res, { error: 'Too many login attempts. Try again later.' }, 429);
      }
      return readBody(req, (body) => {
        const { password, username } = body;
        const dbUser = validateCredentialsDB(username, password);
        if (dbUser) {
          const token = createSession(dbUser);
          const maxAge = (config.auth?.sessionDurationHours || 24) * 3600;
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `bambu_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`
          });
          return res.end(JSON.stringify({ ok: true }));
        }
        if (!validateCredentials(password, username)) {
          return sendJson(res, { error: 'Invalid credentials' }, 401);
        }
        const token = createSession({ username: username || 'admin', permissions: ['*'] });
        const maxAge = (config.auth?.sessionDurationHours || 24) * 3600;
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `bambu_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`
        });
        res.end(JSON.stringify({ ok: true }));
      });
    }

    if (method === 'POST' && path === '/api/auth/logout') {
      const token = getSessionToken(req);
      if (token) destroySession(token);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': 'bambu_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    sendJson(res, { error: 'Not found' }, 404);
  } catch (e) {
    log.error('Auth-api feil: ' + e.message);
    sendJson(res, { error: 'Server error' }, 500);
  }
}

// ---- Hoved API-dispatcher ----

export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // Generell API rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkApiRate(clientIp)) {
    const headers = getApiRateHeaders(clientIp);
    res.writeHead(429, { 'Content-Type': 'application/json', ...headers });
    res.end(JSON.stringify({ error: 'Too many requests', retry_after: headers['X-RateLimit-Reset'] }));
    return;
  }
  const rateHeaders = getApiRateHeaders(clientIp);
  for (const [k, v] of Object.entries(rateHeaders)) res.setHeader(k, v);

  // ---- Pre-auth offentlige ruter ----

  // Delt prosjektstatus — alltid tilgjengelig, ingen auth nødvendig
  const sharedMatch = path.match(/^\/api\/shared\/([a-f0-9-]+)$/);
  if (method === 'GET' && sharedMatch) {
    const project = getProjectByShareToken(sharedMatch[1]);
    if (!project) return sendJson(res, { error: 'Not found' }, 404);
    return sendJson(res, {
      name: project.name,
      status: project.status,
      description: project.description,
      deadline: project.deadline,
      customer_name: project.customer_name,
      prints: (project.prints || []).map(p => ({
        filename: p.print_filename || p.filename,
        status: p.print_status || p.status,
        filament_used_g: p.filament_used_g
      })),
      total_prints: project.total_prints,
      completed_prints: project.completed_prints
    });
  }

  // Offentlig statussidde — ingen auth nødvendig
  if (method === 'GET' && path === '/api/status/public') {
    const enabled = getInventorySetting('public_status_enabled');
    if (enabled !== '1' && enabled !== 'true') return sendJson(res, { error: 'Public status page is disabled' }, 403);
    return sendJson(res, _getPublicStatus());
  }

  // Helsesjekk — ingen auth nødvendig
  if (method === 'GET' && path === '/api/health') {
    const health = {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      version: _pkgVersion,
      node: process.version,
      timestamp: new Date().toISOString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
    return;
  }

  // Prometheus-kompatibelt metrics-endepunkt — ingen auth nødvendig
  if (method === 'GET' && path === '/api/metrics') {
    const metrics = _collectMetrics();
    res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });
    res.end(metrics);
    return;
  }

  // ---- Sentralisert tilgangskontroll ----
  if (isAuthEnabled()) {
    const perm = getRoutePermission(method, path);
    if (!requirePerm(req, res, perm)) return;
  }

  // ---- API Docs ----
  if (method === 'GET' && path === '/api/docs') {
    return sendJson(res, _getApiDocs());
  }

  // ---- Bygg ctx-objekt for alle rute-moduler ----
  const ctx = {
    printerManager: _printerManager,
    hub: _hub,
    guard: _guard,
    notifier: _notifier,
    updater: _updater,
    queueManager: _queueManager,
    timelapseService: _timelapseService,
    ecomLicense: _ecomLicense,
    failureDetector: _failureDetector,
    discovery: _discovery,
    testMqttConnection: _testMqttConnection,
    bambuCloud: _bambuCloud,
    wearPrediction: _wearPrediction,
    materialRecommender: _materialRecommender,
    errorPatternAnalyzer: _errorPatternAnalyzer,
    pluginManager: _pluginManager,
    broadcast: _broadcastFn,
    onPrinterRemoved: _onPrinterRemoved,
    onPrinterAdded: _onPrinterAdded,
    onPrinterUpdated: _onPrinterUpdated,
    onDemoPurge: _onDemoPurge
  };

  // ---- Dispatcher: kall rute-moduler i rekkefølge ----
  try {
    const handlers = [
      handlePrinterRoutes,
      handleInventoryRoutes,
      handleHistoryRoutes,
      handleMonitoringRoutes,
      handleQueueRoutes,
      handleAuthRoutes,
      handleSystemRoutes,
      handleModelRoutes,
      handleCommunityRoutes,
      handleProjectRoutes,
      handleEcommerceRoutes,
      handlePluginRoutes,
    ];

    for (const handler of handlers) {
      const handled = await handler(method, path, req, res, null, ctx);
      if (handled) return;
    }

    // 404
    sendJson(res, { error: 'Ikke funnet' }, 404);
  } catch (e) {
    log.error('Feil: ' + e.message);
    sendJson(res, { error: 'Serverfeil' }, 500);
  }
}

// ---- Offentlig status ----

function _getPublicStatus() {
  const printers = getPrinters();
  const result = [];
  for (const p of printers) {
    const raw = _hub?.printerStates?.[p.id] || {};
    const state = raw.print || raw;
    const gcodeState = state.gcode_state || 'OFFLINE';
    const isPrinting = ['RUNNING', 'PREPARE', 'PAUSE'].includes(gcodeState);
    const fanPct = (v) => v != null ? Math.round((parseInt(v) / 15) * 100) : null;

    let ams = null;
    if (state.ams?.ams) {
      ams = state.ams.ams.map((unit, ui) => ({
        id: ui,
        trays: (unit.tray || []).map((tr, ti) => ({
          slot: ti + 1,
          color: tr.tray_color || null,
          type: tr.tray_type || null,
          remaining: tr.remain != null ? parseInt(tr.remain) : null
        })).filter(tr => tr.color || tr.type)
      })).filter(u => u.trays.length > 0);
    }

    let lights = null;
    if (Array.isArray(state.lights_report)) {
      lights = {};
      for (const l of state.lights_report) {
        if (l.node === 'chamber_light') lights.chamber = l.mode === 'on';
        if (l.node === 'work_light') lights.work = l.mode === 'on';
      }
    }

    result.push({
      id: p.id, name: p.name, model: p.model || null,
      status: gcodeState,
      progress: isPrinting ? (parseInt(state.mc_percent) || 0) : null,
      remaining_minutes: isPrinting ? (parseInt(state.mc_remaining_time) || 0) : null,
      current_file: isPrinting ? (state.subtask_name || null) : null,
      layer: isPrinting ? (parseInt(state.layer_num) || 0) : null,
      total_layers: isPrinting ? (parseInt(state.total_layer_num) || 0) : null,
      nozzle_temp: state.nozzle_temper ?? null,
      nozzle_target: state.nozzle_target_temper ?? null,
      bed_temp: state.bed_temper ?? null,
      bed_target: state.bed_target_temper ?? null,
      chamber_temp: state.chamber_temper ?? null,
      wifi_signal: state.wifi_signal ?? null,
      speed_percent: state.spd_mag ?? null,
      fan_part: fanPct(state.cooling_fan_speed),
      fan_aux: fanPct(state.big_fan1_speed),
      fan_chamber: fanPct(state.big_fan2_speed),
      ams, lights
    });
  }
  return { printers: result, timestamp: new Date().toISOString() };
}

// ---- Prometheus metrics ----

function _collectMetrics() {
  const lines = [];

  const printers = getPrinters();
  lines.push('# HELP bambu_printers_total Total number of configured printers');
  lines.push('# TYPE bambu_printers_total gauge');
  lines.push(`bambu_printers_total ${printers.length}`);

  try {
    const history = getHistory(9999, 0);
    const completed = history.filter(h => h.status === 'completed').length;
    const failed = history.filter(h => h.status === 'failed').length;
    const cancelled = history.filter(h => h.status === 'cancelled').length;

    lines.push('# HELP bambu_prints_total Total number of prints by status');
    lines.push('# TYPE bambu_prints_total counter');
    lines.push(`bambu_prints_total{status="completed"} ${completed}`);
    lines.push(`bambu_prints_total{status="failed"} ${failed}`);
    lines.push(`bambu_prints_total{status="cancelled"} ${cancelled}`);

    const totalFilamentG = history.reduce((sum, h) => sum + (h.filament_used_g || 0), 0);
    lines.push('# HELP bambu_filament_used_grams_total Total filament used in grams');
    lines.push('# TYPE bambu_filament_used_grams_total counter');
    lines.push(`bambu_filament_used_grams_total ${Math.round(totalFilamentG)}`);

    const totalSeconds = history.reduce((sum, h) => sum + (h.duration_seconds || 0), 0);
    lines.push('# HELP bambu_print_seconds_total Total print time in seconds');
    lines.push('# TYPE bambu_print_seconds_total counter');
    lines.push(`bambu_print_seconds_total ${totalSeconds}`);

    const total = history.length;
    const rate = total > 0 ? (completed / total) : 0;
    lines.push('# HELP bambu_success_rate Print success rate');
    lines.push('# TYPE bambu_success_rate gauge');
    lines.push(`bambu_success_rate ${Math.round(rate * 10000) / 10000}`);
  } catch (e) { log.warn('Feil ved generering av print-metrikk: ' + e.message); }

  try {
    const spools = getFilament();
    lines.push('# HELP bambu_spools_total Total spools in inventory');
    lines.push('# TYPE bambu_spools_total gauge');
    lines.push(`bambu_spools_total ${spools.length}`);

    const totalWeightG = spools.reduce((sum, s) => sum + (s.remaining_weight_g || s.weight_g || 0), 0);
    lines.push('# HELP bambu_inventory_weight_grams Total filament weight in inventory');
    lines.push('# TYPE bambu_inventory_weight_grams gauge');
    lines.push(`bambu_inventory_weight_grams ${Math.round(totalWeightG)}`);
  } catch (e) { log.warn('Feil ved generering av filament-metrikk: ' + e.message); }

  try {
    const perSpool = getSpoolmanPerSpoolMetrics();
    if (perSpool.length > 0) {
      lines.push('# HELP bambu_spool_remaining_weight_grams Remaining filament weight per spool');
      lines.push('# TYPE bambu_spool_remaining_weight_grams gauge');
      lines.push('# HELP bambu_spool_used_weight_grams Used filament weight per spool');
      lines.push('# TYPE bambu_spool_used_weight_grams gauge');
      lines.push('# HELP bambu_spool_initial_weight_grams Initial filament weight per spool');
      lines.push('# TYPE bambu_spool_initial_weight_grams gauge');
      lines.push('# HELP bambu_spool_price Spool price');
      lines.push('# TYPE bambu_spool_price gauge');
      lines.push('# HELP bambu_filament_info Filament metadata');
      lines.push('# TYPE bambu_filament_info gauge');
      for (const s of perSpool) {
        const labels = `spool_id="${s.id}",filament="${(s.filament_name || '').replace(/"/g, '')}"`;
        const infoLabels = `spool_id="${s.id}",vendor="${(s.vendor_name || '').replace(/"/g, '')}",material="${s.material || ''}",color="${s.color_hex || ''}"`;
        lines.push(`bambu_spool_remaining_weight_grams{${labels}} ${s.remaining_weight_g || 0}`);
        lines.push(`bambu_spool_used_weight_grams{${labels}} ${s.used_weight_g || 0}`);
        lines.push(`bambu_spool_initial_weight_grams{${labels}} ${s.initial_weight_g || 0}`);
        if (s.cost) lines.push(`bambu_spool_price{${labels}} ${s.cost}`);
        lines.push(`bambu_filament_info{${infoLabels}} 1`);
      }
    }
  } catch (e) { log.warn('Feil ved generering av spole-metrikk: ' + e.message); }

  lines.push('# HELP bambu_uptime_seconds Server uptime in seconds');
  lines.push('# TYPE bambu_uptime_seconds gauge');
  lines.push(`bambu_uptime_seconds ${Math.round(process.uptime())}`);

  const mem = process.memoryUsage();
  lines.push('# HELP bambu_memory_heap_bytes Heap memory usage in bytes');
  lines.push('# TYPE bambu_memory_heap_bytes gauge');
  lines.push(`bambu_memory_heap_bytes ${mem.heapUsed}`);

  lines.push('# HELP bambu_info Dashboard info');
  lines.push('# TYPE bambu_info gauge');
  lines.push(`bambu_info{version="${_pkgVersion}",node="${process.version}"} 1`);

  try {
    for (const b of getAllBreakerStatus()) {
      lines.push(`bambu_circuit_breaker{service="${b.name}",state="${b.state}"} ${b.failures}`);
    }
  } catch (e) { log.warn('Feil ved generering av circuit breaker-metrikk: ' + e.message); }

  return lines.join('\n') + '\n';
}

// ---- OpenAPI docs ----

function _getApiDocs() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Bambu Dashboard API',
      version: _pkgVersion,
      description: 'REST API for Bambu Dashboard — a self-hosted 3D printer management system.'
    },
    servers: [{ url: '/api', description: 'Relative API base' }],
    security: [{ session: [] }, { apiKey: [] }],
    components: {
      securitySchemes: {
        session: { type: 'apiKey', in: 'cookie', name: 'session' },
        apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication & sessions' },
      { name: 'Printers', description: 'Printer management & control' },
      { name: 'History', description: 'Print history & statistics' },
      { name: 'Inventory', description: 'Spool inventory management' },
      { name: 'Filament', description: 'Legacy filament CRUD' },
      { name: 'Profiles', description: 'Filament profiles & vendors' },
      { name: 'Tags', description: 'Tagging system for spools' },
      { name: 'Drying', description: 'Drying sessions & presets' },
      { name: 'Queue', description: 'Print queue management' },
      { name: 'Maintenance', description: 'Printer maintenance tracking' },
      { name: 'Notifications', description: 'Notification configuration' },
      { name: 'Webhooks', description: 'Webhook management & delivery' },
      { name: 'Users', description: 'User & role management (admin)' },
      { name: 'Hardware', description: 'Hardware inventory' },
      { name: 'Materials', description: 'Material database' },
      { name: 'Ecommerce', description: 'E-commerce integration' },
      { name: 'Slicer', description: 'Cloud slicer service' },
      { name: 'NFC', description: 'NFC tag mapping' },
      { name: 'Community', description: 'Community filament database' },
      { name: 'Timelapse', description: 'Timelapse recordings' },
      { name: 'Status', description: 'Public status page' },
      { name: 'System', description: 'Settings, backup, update' }
    ],
    message: 'Full OpenAPI endpoint list available in legacy api-routes.js — se /api/docs for live data.'
  };
}

// ---- Webhook Dispatcher ----

async function _dispatchWebhook(whConfig, payload, deliveryId) {
  const url = new URL(whConfig.url);
  const isHttps = url.protocol === 'https:';
  const reqModule = isHttps ? (await import('node:https')).default : (await import('node:http')).default;

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'User-Agent': 'BambuDashboard-Webhook/1.0',
    ...(typeof whConfig.headers === 'string' ? JSON.parse(whConfig.headers) : (whConfig.headers || {}))
  };

  if (whConfig.secret) {
    headers['X-Webhook-Signature'] = 'sha256=' + createHmac('sha256', whConfig.secret).update(payload).digest('hex');
  }

  return new Promise((resolve) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers,
      rejectUnauthorized: true
    };

    const req = reqModule.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        try {
          updateWebhookDelivery(deliveryId, {
            status: success ? 'sent' : 'failed',
            attempts: 1,
            last_attempt: new Date().toISOString(),
            response_code: res.statusCode,
            response_body: data.substring(0, 500)
          });
        } catch (e) { log.warn('Failed to log webhook delivery', e.message); }
        resolve(success);
      });
    });

    req.on('error', (err) => {
      try {
        updateWebhookDelivery(deliveryId, {
          status: 'failed',
          attempts: 1,
          last_attempt: new Date().toISOString(),
          response_body: err.message
        });
      } catch (e) { log.warn('Failed to log webhook failure', e.message); }
      resolve(false);
    });

    req.setTimeout(10000, () => { req.destroy(); });
    req.write(payload);
    req.end();
  });
}

export function dispatchWebhooksForEvent(eventType, title, message, data) {
  try {
    const webhooks = getActiveWebhooks();
    for (const wh of webhooks) {
      const events = typeof wh.events === 'string' ? JSON.parse(wh.events) : (wh.events || []);
      if (events.length > 0 && !events.includes(eventType) && !events.includes('*')) continue;

      let payload;
      if (wh.template === 'discord') {
        const colors = { print_started: 3447003, print_finished: 3066993, print_failed: 15158332, print_cancelled: 15844367, printer_error: 15158332, test: 10181046 };
        payload = JSON.stringify({
          embeds: [{ title, description: message, color: colors[eventType] || 9807270, timestamp: new Date().toISOString(), footer: { text: 'Bambu Dashboard' } }]
        });
      } else if (wh.template === 'slack') {
        payload = JSON.stringify({ text: `*${title}*\n${message}` });
      } else if (wh.template === 'homey') {
        payload = JSON.stringify({
          event: eventType, title, message,
          printer_name: data?.printerName || '',
          printer_id: data?.printerId || '',
          file_name: data?.filename || '',
          progress: data?.progress ?? 0,
          status: data?.status || eventType,
          timestamp: new Date().toISOString()
        });
      } else {
        payload = JSON.stringify({
          event: eventType, title, message,
          timestamp: new Date().toISOString(),
          data: data || {}
        });
      }

      const deliveryId = addWebhookDelivery({ webhook_id: wh.id, event_type: eventType, payload, status: 'pending' });
      _dispatchWebhook(wh, payload, deliveryId).catch(e => log.warn('Webhook dispatch failed', e.message));
    }
  } catch (e) {
    log.error('Webhook dispatch error: ' + e.message);
  }
}
