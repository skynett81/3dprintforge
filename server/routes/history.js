// routes/history.js — Print history, statistikk, filament, waste, vedlikehold
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getHistory, getHistoryById, addHistory, updateHistoryNotes,
  getStatistics, getCostStatistics, recalculateAllCosts, getHardwareStats,
  getFilament, addFilament, updateFilament, deleteFilament,
  addWaste, deleteWaste, getWasteStats, getWasteHistory, backfillWaste,
  getMaintenanceStatus, addMaintenanceEvent, getMaintenanceLog,
  getMaintenanceSchedule, upsertMaintenanceSchedule,
  getActiveNozzleSession, retireNozzleSession, createNozzleSession,
  addMaintenanceCost, getMaintenanceCosts, getTotalMaintenanceCost,
  getErrors, acknowledgeError, deleteError, acknowledgeAllErrors, deduplicateHmsErrors,
  getTelemetry, getComponentWear, getFirmwareHistory, getXcamEvents, getXcamStats,
  getAmsTrayLifetime, savePrintCost, getPrintCost, getCostReport, getCostSummary,
  estimatePrintCostAdvanced, getSpoolBySlot, checkFirmwareUpdate
} from '../database.js';
import { getPrinters } from '../database.js';
import { sendJson, readBody } from '../api-helpers.js';
import { createLogger } from '../logger.js';
import { validate } from '../validate.js';

const log = createLogger('route:history');

// ---- Validation Schemas ----
const HISTORY_NOTES_SCHEMA = {
  notes: { type: 'string', maxLength: 5000 }
};

const MAINTENANCE_EVENT_SCHEMA = {
  component: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  action: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const MAINTENANCE_SCHEDULE_SCHEMA = {
  printer_id: { required: true },
  component: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  interval_hours: { type: 'number', required: true, min: 1 }
};

const NOZZLE_CHANGE_SCHEMA = {
  printer_id: { required: true },
  nozzle_type: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  nozzle_diameter: { type: 'number', required: true, min: 0.1, max: 5 }
};

const WASTE_SCHEMA = {
  waste_g: { type: 'number', required: true, min: 0.001 }
};

const PRINT_COST_SCHEMA = {
  printer_id: { required: true }
};

export async function handleHistoryRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- History ----
  if (method === 'GET' && path === '/api/history') {
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const printerId = url.searchParams.get('printer_id') || null;
    const status = url.searchParams.get('status') || null;
    const rows = getHistory(limit, offset, printerId, status);
    // Berik rader som mangler filamentmerke/type fra tilknyttet lager-spool
    for (const row of rows) {
      if ((!row.filament_brand || !row.filament_type) && row.printer_id && row.tray_id != null) {
        try {
          const spool = getSpoolBySlot(row.printer_id, 0, parseInt(row.tray_id));
          if (spool) {
            if (!row.filament_brand) row.filament_brand = spool.vendor_name || spool.profile_name || null;
            if (!row.filament_type) row.filament_type = spool.material || null;
          }
        } catch { /* ignorer */ }
      }
    }
    sendJson(res, rows);
    return true;
  }

  // ---- Oppdater historikk-notater ----
  const histUpdateMatch = path.match(/^\/api\/history\/(\d+)$/);
  if (histUpdateMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(HISTORY_NOTES_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const data = typeof b === 'string' ? JSON.parse(b) : b;
        const id = parseInt(histUpdateMatch[1]);
        const existing = getHistoryById(id);
        if (!existing) return sendJson(res, { error: 'Not found' }, 404);
        const notes = data.notes != null ? String(data.notes) : existing.notes;
        const updated = updateHistoryNotes(id, notes);
        sendJson(res, updated);
      } catch (e) {
        sendJson(res, { error: e.message }, 400);
      }
    }), true;
  }

  // ---- CSV/JSON export ----
  if (method === 'GET' && path === '/api/history/export') {
    const printerId = url.searchParams.get('printer_id') || null;
    const format = url.searchParams.get('format') || 'csv';
    const rows = getHistory(10000, 0, printerId);
    const dateStr = new Date().toISOString().split('T')[0];

    let printerMap = {};
    try {
      for (const p of getPrinters()) printerMap[p.id] = p.name;
    } catch { /* ignorer */ }
    for (const row of rows) {
      row._printer_name = printerMap[row.printer_id] || row.printer_id || '';
    }

    if (format === 'json') {
      const jsonRows = rows.map(r => ({
        date: r.started_at || '', printer: r._printer_name, filename: r.filename || '',
        status: r.status || '', duration_min: r.duration_seconds ? Math.round(r.duration_seconds / 60) : 0,
        filament_used_g: r.filament_used_g || 0, filament_type: r.filament_type || '',
        color: r.filament_color || '', layers: r.layer_count || 0, notes: r.notes || ''
      }));
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="print-history-${dateStr}.json"`
      });
      res.end(JSON.stringify(jsonRows, null, 2));
      return true;
    }

    function csvEscape(val) {
      const s = String(val == null ? '' : val);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    }
    const header = 'Date,Printer,Filename,Status,Duration (min),Filament Used (g),Filament Type,Color,Layers,Notes\n';
    const csv = header + rows.map(r =>
      [r.started_at || '', r._printer_name, r.filename || '', r.status || '',
       r.duration_seconds ? Math.round(r.duration_seconds / 60) : 0, r.filament_used_g || 0,
       r.filament_type || '', r.filament_color || '', r.layer_count || 0, r.notes || ''].map(csvEscape).join(',')
    ).join('\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="print-history-${dateStr}.csv"`
    });
    res.end(csv);
    return true;
  }

  // ---- Statistikk ----
  if (method === 'GET' && path === '/api/statistics') {
    const printerId = url.searchParams.get('printer_id') || null;
    const from = url.searchParams.get('from') || null;
    const to = url.searchParams.get('to') || null;
    sendJson(res, getStatistics(printerId, from, to));
    return true;
  }

  if (method === 'GET' && path === '/api/statistics/costs') {
    const printerId = url.searchParams.get('printer_id') || null;
    const from = url.searchParams.get('from') || null;
    const to = url.searchParams.get('to') || null;
    sendJson(res, getCostStatistics(printerId, from, to));
    return true;
  }

  if (method === 'POST' && path === '/api/statistics/costs/recalculate') {
    sendJson(res, recalculateAllCosts());
    return true;
  }

  if (method === 'GET' && path === '/api/statistics/hardware') {
    const printerId = url.searchParams.get('printer_id') || null;
    sendJson(res, getHardwareStats(printerId));
    return true;
  }

  if (method === 'GET' && path === '/api/stats/export') {
    const printerId = url.searchParams.get('printer_id') || null;
    const from = url.searchParams.get('from') || null;
    const to = url.searchParams.get('to') || null;
    const format = url.searchParams.get('format') || 'csv';
    const dateStr = new Date().toISOString().split('T')[0];
    const stats = getStatistics(printerId, from, to);
    const metrics = [
      { metric: 'Total Prints', value: stats.total_prints || 0 },
      { metric: 'Successful Prints', value: stats.completed_prints || 0 },
      { metric: 'Failed Prints', value: stats.failed_prints || 0 },
      { metric: 'Total Filament Used (g)', value: Math.round(stats.total_filament_g || 0) },
      { metric: 'Total Print Time (hours)', value: stats.total_hours || 0 },
      { metric: 'Average Print Time (min)', value: stats.avg_print_minutes || 0 },
      { metric: 'Success Rate (%)', value: stats.success_rate || 0 }
    ];
    if (format === 'json') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="print-statistics-${dateStr}.json"` });
      res.end(JSON.stringify(metrics, null, 2));
      return true;
    }
    const csv = 'Metric,Value\n' + metrics.map(m => `${m.metric},${m.value}`).join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="print-statistics-${dateStr}.csv"` });
    res.end(csv);
    return true;
  }

  // ---- Aktivitetskalender ----
  if (method === 'GET' && path === '/api/stats/calendar') {
    const hist = getHistory(99999, 0);
    const yearParam = url.searchParams.get('year');
    const now = new Date();
    const year = yearParam ? parseInt(yearParam) : now.getFullYear();
    const yearsWithData = new Set();
    for (const h of hist) { if (h.started_at) yearsWithData.add(parseInt(h.started_at.substring(0, 4))); }
    yearsWithData.add(now.getFullYear());
    const calendar = {};
    const startDate = new Date(year, 0, 1);
    const endDate = year === now.getFullYear() ? now : new Date(year, 11, 31);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0];
      calendar[key] = { date: key, prints: 0, completed: 0, failed: 0, hours: 0 };
    }
    for (const h of hist) {
      if (!h.started_at) continue;
      const key = h.started_at.split('T')[0];
      if (calendar[key]) {
        calendar[key].prints++;
        if (h.status === 'completed') calendar[key].completed++;
        if (h.status === 'failed') calendar[key].failed++;
        calendar[key].hours += (h.duration_seconds || 0) / 3600;
      }
    }
    sendJson(res, { year, years: [...yearsWithData].sort(), days: Object.values(calendar) });
    return true;
  }

  // ---- Filament ----
  if (method === 'GET' && path === '/api/filament') {
    const printerId = url.searchParams.get('printer_id') || null;
    sendJson(res, getFilament(printerId));
    return true;
  }
  if (method === 'POST' && path === '/api/filament') {
    return readBody(req, (b) => { addFilament(b); sendJson(res, { ok: true }, 201); }), true;
  }
  const filamentMatch = path.match(/^\/api\/filament\/(\d+)$/);
  if (filamentMatch && method === 'PUT') {
    return readBody(req, (b) => { updateFilament(parseInt(filamentMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (filamentMatch && method === 'DELETE') {
    deleteFilament(parseInt(filamentMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Waste ----
  if (method === 'GET' && path === '/api/waste/stats') {
    const printerId = url.searchParams.get('printer_id') || null;
    const startupPurgeG = parseFloat(url.searchParams.get('startup_purge_g')) || 1.0;
    const wastePerChangeG = parseFloat(url.searchParams.get('waste_per_change_g')) || 5.0;
    sendJson(res, getWasteStats(printerId, startupPurgeG, wastePerChangeG));
    return true;
  }
  if (method === 'GET' && path === '/api/waste/history') {
    sendJson(res, getWasteHistory(parseInt(url.searchParams.get('limit')) || 50, url.searchParams.get('printer_id') || null));
    return true;
  }
  if (method === 'POST' && path === '/api/waste/backfill') {
    return readBody(req, (b) => {
      const startupPurgeG = parseFloat(b.startup_purge_g) || 1.0;
      const wastePerChangeG = parseFloat(b.waste_per_change_g) || 5;
      const updated = backfillWaste(startupPurgeG, wastePerChangeG);
      sendJson(res, { ok: true, updated });
    }), true;
  }
  if (method === 'POST' && path === '/api/waste') {
    return readBody(req, (b) => {
      const vr = validate(WASTE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      addWaste({ printer_id: b.printer_id || null, waste_g: b.waste_g, reason: b.reason || 'manual', notes: b.notes || null });
      sendJson(res, { ok: true }, 201);
    }), true;
  }
  if (method === 'DELETE' && path.startsWith('/api/waste/')) {
    const id = parseInt(path.split('/')[3]);
    if (!id) return sendJson(res, { error: 'Invalid id' }, 400), true;
    deleteWaste(id);
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'GET' && path === '/api/waste/export') {
    const printerId = url.searchParams.get('printer_id') || null;
    const stats = getWasteStats(printerId);
    const rows = stats.recent || [];
    let csv = 'Date,Printer,Weight (g),Color Changes,Type,Notes\n';
    for (const r of rows) {
      const date = r.timestamp || '';
      const printer = (r.printer_id || '').replace(/"/g, '""');
      const notes = (r.notes || '').replace(/"/g, '""');
      csv += `"${date}","${printer}",${r.waste_g},${r.color_changes || 0},"${r.reason}","${notes}"\n`;
    }
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="waste-export.csv"' });
    res.end(csv);
    return true;
  }

  // ---- Maintenance ----
  if (method === 'GET' && path === '/api/maintenance/status') {
    const printerId = url.searchParams.get('printer_id');
    if (!printerId) return sendJson(res, { error: 'printer_id required' }, 400), true;
    sendJson(res, getMaintenanceStatus(printerId));
    return true;
  }
  if (method === 'GET' && path === '/api/maintenance/log') {
    sendJson(res, getMaintenanceLog(url.searchParams.get('printer_id') || null, parseInt(url.searchParams.get('limit')) || 50));
    return true;
  }
  if (method === 'POST' && path === '/api/maintenance/log') {
    return readBody(req, (b) => {
      const vr = validate(MAINTENANCE_EVENT_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      addMaintenanceEvent(b);
      sendJson(res, { ok: true }, 201);
    }), true;
  }
  if (method === 'GET' && path === '/api/maintenance/schedule') {
    const printerId = url.searchParams.get('printer_id');
    if (!printerId) return sendJson(res, { error: 'printer_id required' }, 400), true;
    sendJson(res, getMaintenanceSchedule(printerId));
    return true;
  }
  if (method === 'PUT' && path === '/api/maintenance/schedule') {
    return readBody(req, (b) => {
      const vr = validate(MAINTENANCE_SCHEDULE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      upsertMaintenanceSchedule(b.printer_id, b.component, b.interval_hours, b.label || b.component);
      sendJson(res, { ok: true });
    }), true;
  }
  if (method === 'POST' && path === '/api/maintenance/nozzle-change') {
    return readBody(req, (b) => {
      const vr = validate(NOZZLE_CHANGE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const active = getActiveNozzleSession(b.printer_id);
      if (active) retireNozzleSession(active.id);
      createNozzleSession(b.printer_id, b.nozzle_type, b.nozzle_diameter);
      addMaintenanceEvent({ printer_id: b.printer_id, component: 'nozzle', action: 'replaced', notes: b.notes || null, nozzle_type: b.nozzle_type, nozzle_diameter: b.nozzle_diameter });
      sendJson(res, { ok: true }, 201);
    }), true;
  }

  // ---- Errors ----
  if (method === 'GET' && path === '/api/errors') {
    sendJson(res, getErrors(parseInt(url.searchParams.get('limit')) || 50, url.searchParams.get('printer_id') || null));
    return true;
  }
  if (method === 'POST' && path === '/api/errors/acknowledge-all') {
    return readBody(req, (b) => {
      acknowledgeAllErrors(b?.printer_id || null);
      sendJson(res, { ok: true });
    }), true;
  }
  const errorMatch = path.match(/^\/api\/errors\/(\d+)$/);
  if (errorMatch && method === 'PATCH') { acknowledgeError(parseInt(errorMatch[1])); sendJson(res, { ok: true }); return true; }
  if (errorMatch && method === 'DELETE') { deleteError(parseInt(errorMatch[1])); sendJson(res, { ok: true }); return true; }
  if (method === 'POST' && path === '/api/errors/deduplicate-hms') {
    sendJson(res, { ok: true, removed: deduplicateHmsErrors() });
    return true;
  }

  // ---- Telemetry ----
  if (method === 'GET' && path === '/api/telemetry') {
    const printerId = url.searchParams.get('printer_id');
    if (!printerId) return sendJson(res, { error: 'printer_id required' }, 400), true;
    const from = url.searchParams.get('from') || new Date(Date.now() - 3600000).toISOString();
    const to = url.searchParams.get('to') || new Date().toISOString();
    const resolution = url.searchParams.get('resolution') || '1m';
    sendJson(res, getTelemetry(printerId, from, to, resolution));
    return true;
  }

  // ---- Component Wear ----
  if (method === 'GET' && path === '/api/wear') {
    const printerId = url.searchParams.get('printer_id');
    if (!printerId) return sendJson(res, { error: 'printer_id required' }, 400), true;
    sendJson(res, getComponentWear(printerId));
    return true;
  }

  // ---- Firmware History ----
  if (method === 'GET' && path === '/api/firmware') {
    const printerId = url.searchParams.get('printer_id');
    if (!printerId) return sendJson(res, { error: 'printer_id required' }, 400), true;
    sendJson(res, getFirmwareHistory(printerId));
    return true;
  }

  // ---- XCam Events ----
  if (method === 'GET' && path === '/api/xcam/events') {
    sendJson(res, getXcamEvents(url.searchParams.get('printer_id') || null, parseInt(url.searchParams.get('limit')) || 50));
    return true;
  }
  if (method === 'GET' && path === '/api/xcam/stats') {
    sendJson(res, getXcamStats(url.searchParams.get('printer_id') || null));
    return true;
  }

  // ---- AMS Tray Lifetime ----
  if (method === 'GET' && path === '/api/ams/lifetime') {
    const printerId = url.searchParams.get('printer_id');
    if (!printerId) return sendJson(res, { error: 'printer_id required' }, 400), true;
    sendJson(res, getAmsTrayLifetime(printerId));
    return true;
  }

  // ---- Print Costs ----
  if (method === 'POST' && path === '/api/print-cost') {
    return readBody(req, (b) => {
      const vr = validate(PRINT_COST_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = savePrintCost(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (method === 'GET' && path.match(/^\/api\/print-cost\/[^/]+$/)) {
    const printerId = path.split('/').pop();
    sendJson(res, getPrintCost(printerId));
    return true;
  }
  if (method === 'GET' && path === '/api/cost-report') {
    const printerId = url.searchParams.get('printer_id') || null;
    sendJson(res, getCostReport(printerId));
    return true;
  }
  if (method === 'GET' && path === '/api/cost-summary') {
    sendJson(res, getCostSummary());
    return true;
  }

  return false;
}
