// routes/printers.js — Printer CRUD, discovery, Bambu Cloud, kamera, vedlikehold
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getPrinters, addPrinter, updatePrinter, deletePrinter,
  getHistory, setMaintenanceMode, getMaintenanceModePrinters
} from '../database.js';
import { validate } from '../validate.js';
import { sendJson, readBody } from '../api-helpers.js';
import { createLogger } from '../logger.js';

const log = createLogger('route:printers');

const PRINTER_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  ip: { type: 'string', pattern: /^\d{1,3}(\.\d{1,3}){3}$/ },
  serial: { type: 'string', maxLength: 200 },
  access_code: { type: 'string', maxLength: 200 },
  model: { type: 'string', enum: ['A1', 'A1 Mini', 'P1P', 'P1S', 'P2S', 'P2S Combo', 'X1', 'X1C', 'X1E', 'H2D'] }
};

const PRINTER_UPDATE_SCHEMA = {
  name: { type: 'string', minLength: 1, maxLength: 100 },
  ip: { type: 'string', pattern: /^\d{1,3}(\.\d{1,3}){3}$/ },
  serial: { type: 'string', maxLength: 200 },
  access_code: { type: 'string', maxLength: 200 },
  model: { type: 'string', enum: ['A1', 'A1 Mini', 'P1P', 'P1S', 'P2S', 'P2S Combo', 'X1', 'X1C', 'X1E', 'H2D'] }
};

function broadcastPrinterMeta(ctx) {
  if (ctx.broadcast) {
    ctx.broadcast('printer_meta_update', { printers: getPrinters() });
  }
}

export async function handlePrinterRoutes(method, path, req, res, body, ctx) {
  // ---- Printer Discovery ----
  if (method === 'GET' && path === '/api/discovery/scan') {
    if (!ctx.discovery) return sendJson(res, { error: 'Discovery not available' }, 503), true;
    try {
      const found = await ctx.discovery.scan();
      const existing = getPrinters().map(p => p.serial);
      const printers = found.map(p => ({
        ...p,
        alreadyAdded: existing.includes(p.serial)
      }));
      sendJson(res, { printers, total: found.length });
    } catch (e) {
      sendJson(res, { error: e.message }, 500);
    }
    return true;
  }

  if (method === 'GET' && path === '/api/discovery/status') {
    if (!ctx.discovery) return sendJson(res, { scanning: false, printers: [] }), true;
    sendJson(res, { scanning: ctx.discovery.isScanning(), printers: ctx.discovery.getCached() });
    return true;
  }

  if (method === 'POST' && path === '/api/discovery/test') {
    if (!ctx.testMqttConnection) return sendJson(res, { error: 'Test not available' }, 503), true;
    return readBody(req, async (b) => {
      const { ip, serial, accessCode } = b;
      if (!ip || !accessCode) return sendJson(res, { error: 'ip and accessCode required' }, 400);
      try {
        const result = await ctx.testMqttConnection(ip, serial || '', accessCode);
        sendJson(res, result);
      } catch (e) {
        sendJson(res, { ok: false, error: e.message });
      }
    }), true;
  }

  // ---- Printer Maintenance Mode ----
  if (method === 'GET' && path === '/api/printers/maintenance') {
    sendJson(res, getMaintenanceModePrinters());
    return true;
  }

  if (method === 'POST' && path.match(/^\/api\/printers\/[^/]+\/maintenance$/)) {
    const printerId = decodeURIComponent(path.split('/')[3]);
    return readBody(req, (b) => {
      setMaintenanceMode(printerId, b.enabled !== false, b.note || null);
      if (ctx.broadcast) ctx.broadcast('printer_maintenance', { printer_id: printerId, maintenance: b.enabled !== false, note: b.note || null });
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Camera: MJPEG stream + snapshot ----
  const mjpegMatch = path.match(/^\/api\/printers\/([^/]+)\/stream\.mjpeg$/);
  if (mjpegMatch && method === 'GET') {
    const pid = decodeURIComponent(mjpegMatch[1]);
    const entry = ctx.printerManager?.printers?.get(pid);
    if (!entry?.camera) return sendJson(res, { error: 'Kamera ikke tilgjengelig' }, 404), true;
    entry.camera.addMjpegClient(res);
    return true;
  }

  const frameMatch = path.match(/^\/api\/printers\/([^/]+)\/frame\.jpeg$/);
  if (frameMatch && method === 'GET') {
    const pid = decodeURIComponent(frameMatch[1]);
    const entry = ctx.printerManager?.printers?.get(pid);
    if (!entry?.camera) return sendJson(res, { error: 'Kamera ikke tilgjengelig' }, 404), true;
    const frame = entry.camera.getLastFrame();
    if (!frame) return sendJson(res, { error: 'Ingen frame tilgjengelig ennå' }, 503), true;
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': frame.length,
      'Cache-Control': 'no-cache, no-store',
    });
    res.end(frame);
    return true;
  }

  // ---- Printer CRUD ----
  if (method === 'GET' && path === '/api/printers') {
    const printers = getPrinters().map(p => ({
      ...p,
      accessCode: p.accessCode ? '***' : ''
    }));
    sendJson(res, printers);
    return true;
  }

  if (method === 'POST' && path === '/api/printers') {
    return readBody(req, (b) => {
      const vr = validate(PRINTER_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: 'Validation failed', details: vr.errors }, 400);
      b.id = b.id || b.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      addPrinter(b);
      if (ctx.onPrinterAdded) ctx.onPrinterAdded(b);
      broadcastPrinterMeta(ctx);
      sendJson(res, { ok: true, id: b.id }, 201);
    }), true;
  }

  const printerMatch = path.match(/^\/api\/printers\/([a-zA-Z0-9_-]+)$/);
  if (printerMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(PRINTER_UPDATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: 'Validation failed', details: vr.errors }, 400);
      const id = printerMatch[1];
      // Bevar eksisterende tilgangskode hvis maskert
      if (b.accessCode === '***') {
        const existing = getPrinters().find(p => p.id === id);
        b.accessCode = existing?.accessCode || '';
      }
      updatePrinter(id, b);
      if (ctx.onPrinterUpdated) ctx.onPrinterUpdated(id, { ...b, id });
      broadcastPrinterMeta(ctx);
      sendJson(res, { ok: true });
    }), true;
  }

  if (printerMatch && method === 'DELETE') {
    const id = printerMatch[1];
    deletePrinter(id);
    if (ctx.onPrinterRemoved) ctx.onPrinterRemoved(id);
    broadcastPrinterMeta(ctx);
    sendJson(res, { ok: true });
    return true;
  }

  return false;
}
