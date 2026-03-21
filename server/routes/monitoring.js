// routes/monitoring.js — Print Guard/Protection, Cost Estimator, Material Recommendations,
//                         Wear Predictions, Error Pattern Analysis, Failure Detection, Print Guard
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getSpool, getInventorySetting, getPrinters, getDemoPrinterIds, purgeDemoData,
  getFailureDetections, getFailureDetection, addFailureDetection,
  acknowledgeFailureDetection, deleteFailureDetection,
  saveCostEstimate, getCostEstimates, getCostEstimate, deleteCostEstimate,
  acknowledgeWearAlert, addMaintenanceCost, getMaintenanceCosts, getTotalMaintenanceCost,
  getPushSubscriptions, addPushSubscription, deletePushSubscription
} from '../database.js';
import { parse3mf, parseGcode } from '../file-parser.js';
import { sendJson, readBody } from '../api-helpers.js';
import { createLogger } from '../logger.js';
import { createHmac } from 'node:crypto';
import * as _energy from '../energy-service.js';
import { config } from '../config.js';
import { validate } from '../validate.js';

const log = createLogger('route:monitoring');

// ---- Validation Schemas ----
const PROTECTION_SETTINGS_SCHEMA = {
  printer_id: { required: true }
};

const PROTECTION_RESOLVE_SCHEMA = {
  logId: { required: true }
};

const PROTECTION_TEST_SCHEMA = {
  printer_id: { required: true }
};

const MAINTENANCE_COST_SCHEMA = {
  printer_id: { required: true },
  component: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  cost: { type: 'number', required: true, min: 0 }
};

const PUSH_SUBSCRIBE_SCHEMA = {
  endpoint: { type: 'string', required: true, minLength: 1 }
};

// Hjelpefunksjon for printer-kostnadsinnstillinger (brukes av cost estimator)
function getPrinterCostSettings(printerId) {
  if (!printerId) return {};
  const printers = getPrinters();
  const printer = printers.find(p => p.id === printerId);
  return printer?.cost_settings || config?.cost_settings || {};
}

export async function handleMonitoringRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Print Guard / Protection ----
  if (method === 'GET' && path === '/api/protection/settings') {
    const printerId = url.searchParams.get('printer_id');
    if (!printerId) return sendJson(res, { error: 'printer_id required' }, 400), true;
    if (!ctx.guard) return sendJson(res, { error: 'Guard not initialized' }, 500), true;
    sendJson(res, ctx.guard.getSettings(printerId));
    return true;
  }
  if (method === 'PUT' && path === '/api/protection/settings') {
    if (!ctx.guard) return sendJson(res, { error: 'Guard not initialized' }, 500), true;
    return readBody(req, (b) => {
      const vr = validate(PROTECTION_SETTINGS_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      ctx.guard.updateSettings(b.printer_id, b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (method === 'GET' && path === '/api/protection/status') {
    const printerId = url.searchParams.get('printer_id') || null;
    if (!ctx.guard) return sendJson(res, { error: 'Guard not initialized' }, 500), true;
    if (printerId) return sendJson(res, ctx.guard.getStatus(printerId)), true;
    sendJson(res, { alerts: ctx.guard.getAllActiveAlerts() });
    return true;
  }
  if (method === 'GET' && path === '/api/protection/log') {
    const printerId = url.searchParams.get('printer_id') || null;
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    if (!ctx.guard) return sendJson(res, { error: 'Guard not initialized' }, 500), true;
    sendJson(res, ctx.guard.getLog(printerId, limit));
    return true;
  }
  if (method === 'POST' && path === '/api/protection/resolve') {
    if (!ctx.guard) return sendJson(res, { error: 'Guard not initialized' }, 500), true;
    return readBody(req, (b) => {
      const vr = validate(PROTECTION_RESOLVE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      ctx.guard.resolve(b.logId);
      sendJson(res, { ok: true });
    }), true;
  }
  if (method === 'POST' && path === '/api/protection/test') {
    if (!ctx.guard) return sendJson(res, { error: 'Guard not initialized' }, 500), true;
    return readBody(req, (b) => {
      const vr = validate(PROTECTION_TEST_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const printerId = b.printer_id;
      const eventType = b.event_type || 'spaghetti_detected';
      ctx.guard.handleEvent(printerId, eventType, null);
      sendJson(res, { ok: true });
    }), true;
  }
  if (method === 'DELETE' && path === '/api/protection/log') {
    if (!ctx.guard) return sendJson(res, { error: 'Guard not initialized' }, 500), true;
    const printerId = url.searchParams.get('printer_id') || null;
    const resolved = url.searchParams.get('resolved_only');
    ctx.guard.clearLog(printerId, resolved === '1');
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Cost Estimator ----
  if (method === 'POST' && path === '/api/cost-estimator/upload') {
    const filename = url.searchParams.get('filename') || 'unknown';
    return readBody(req, async (b) => {
      // Denne ruten forventer binær body — håndteres via readBinaryBody i dispatcher
    }), true;
  }
  // Merk: /api/cost-estimator/upload krever readBinaryBody, håndteres i hoved-dispatcher

  if (method === 'GET' && path === '/api/cost-estimator/estimates') {
    const limit = parseInt(url.searchParams.get('limit') || '50');
    sendJson(res, getCostEstimates(limit));
    return true;
  }
  const ceIdMatch = path.match(/^\/api\/cost-estimator\/estimates\/(\d+)$/);
  if (ceIdMatch && method === 'GET') {
    const est = getCostEstimate(parseInt(ceIdMatch[1]));
    if (!est) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, est);
    return true;
  }
  if (ceIdMatch && method === 'DELETE') {
    deleteCostEstimate(parseInt(ceIdMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'POST' && path === '/api/cost-estimator/save') {
    return readBody(req, (b) => {
      try {
        const id = saveCostEstimate(b);
        sendJson(res, { ok: true, id }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }

  // ---- Material Recommendations ----
  if (method === 'GET' && path === '/api/materials/recommendations') {
    if (!ctx.materialRecommender) return sendJson(res, []), true;
    sendJson(res, ctx.materialRecommender.getAllRecommendations());
    return true;
  }
  if (method === 'GET' && path.startsWith('/api/materials/recommendations/') && !path.includes('/recalculate')) {
    if (!ctx.materialRecommender) return sendJson(res, { error: 'Service not initialized' }, 500), true;
    const type = decodeURIComponent(path.replace('/api/materials/recommendations/', ''));
    const brand = url.searchParams.get('brand') || null;
    const rec = ctx.materialRecommender.getRecommendation(type, brand);
    if (!rec) return sendJson(res, { error: 'No recommendation found' }, 404), true;
    sendJson(res, rec);
    return true;
  }
  if (method === 'POST' && path === '/api/materials/recommendations/recalculate') {
    if (!ctx.materialRecommender) return sendJson(res, { error: 'Service not initialized' }, 500), true;
    try {
      const results = ctx.materialRecommender.recalculate();
      sendJson(res, { ok: true, count: results.length, recommendations: results });
    } catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }
  if (method === 'GET' && path.startsWith('/api/materials/compare/')) {
    if (!ctx.materialRecommender) return sendJson(res, []), true;
    const type = decodeURIComponent(path.replace('/api/materials/compare/', ''));
    sendJson(res, ctx.materialRecommender.compareBrands(type));
    return true;
  }
  if (method === 'GET' && path === '/api/materials/suggest-settings') {
    if (!ctx.materialRecommender) return sendJson(res, { error: 'Service not initialized' }, 500), true;
    const type = url.searchParams.get('type');
    const brand = url.searchParams.get('brand') || null;
    if (!type) return sendJson(res, { error: 'type parameter required' }, 400), true;
    const suggestion = ctx.materialRecommender.suggestSettings(type, brand);
    if (!suggestion) return sendJson(res, { error: 'No data available for this material' }, 404), true;
    sendJson(res, suggestion);
    return true;
  }
  if (method === 'GET' && path === '/api/materials/success-rates') {
    if (!ctx.materialRecommender) return sendJson(res, []), true;
    sendJson(res, ctx.materialRecommender.getSuccessRates());
    return true;
  }

  // ---- Wear Predictions ----
  if (method === 'GET' && path === '/api/wear/predictions') {
    const printerId = url.searchParams.get('printer_id');
    if (ctx.wearPrediction) return sendJson(res, ctx.wearPrediction.getPredictions(printerId || null)), true;
    sendJson(res, []);
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/wear\/predictions\/[^/]+$/)) {
    const printerId = path.split('/')[4];
    if (ctx.wearPrediction) return sendJson(res, ctx.wearPrediction.getPredictions(printerId)), true;
    sendJson(res, []);
    return true;
  }
  if (method === 'POST' && path === '/api/wear/predictions/recalculate') {
    if (!ctx.wearPrediction) return sendJson(res, { error: 'Wear prediction service not initialized' }, 503), true;
    ctx.wearPrediction.recalculate();
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'GET' && path === '/api/wear/alerts') {
    const printerId = url.searchParams.get('printer_id') || null;
    if (ctx.wearPrediction) return sendJson(res, ctx.wearPrediction.getAlerts(printerId)), true;
    sendJson(res, []);
    return true;
  }
  if (method === 'POST' && path.match(/^\/api\/wear\/alerts\/\d+\/acknowledge$/)) {
    const alertId = parseInt(path.split('/')[4]);
    acknowledgeWearAlert(alertId);
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'GET' && path === '/api/wear/costs') {
    const printers = getPrinters();
    const summary = printers.map(p => {
      const total = getTotalMaintenanceCost(p.id);
      const costs = getMaintenanceCosts(p.id);
      return { printer_id: p.id, printer_name: p.name, total: total.total, currency: total.currency, items: costs };
    });
    sendJson(res, summary);
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/wear\/costs\/[^/]+$/)) {
    const printerId = path.split('/')[4];
    const total = getTotalMaintenanceCost(printerId);
    const costs = getMaintenanceCosts(printerId);
    sendJson(res, { printer_id: printerId, total: total.total, currency: total.currency, items: costs });
    return true;
  }
  if (method === 'POST' && path === '/api/wear/costs') {
    return readBody(req, (b) => {
      const vr = validate(MAINTENANCE_COST_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addMaintenanceCost(b);
      sendJson(res, { ok: true, id });
    }), true;
  }

  // ---- Error Pattern Analysis ----
  if (method === 'GET' && path === '/api/error-patterns') {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, []), true;
    sendJson(res, ctx.errorPatternAnalyzer.getAllPatterns());
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/error-patterns\/\d+$/)) {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, { error: 'Service not initialized' }, 500), true;
    const id = parseInt(path.split('/').pop());
    const pattern = ctx.errorPatternAnalyzer.getPattern(id);
    if (!pattern) return sendJson(res, { error: 'Pattern not found' }, 404), true;
    sendJson(res, pattern);
    return true;
  }
  if (method === 'POST' && path === '/api/error-patterns/analyze') {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, { error: 'Service not initialized' }, 500), true;
    try {
      ctx.errorPatternAnalyzer.analyze();
      sendJson(res, { ok: true, message: 'Analysis complete' });
    } catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }
  if (method === 'GET' && path === '/api/error-patterns/suggestions') {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, []), true;
    const printerId = url.searchParams.get('printer_id') || null;
    sendJson(res, ctx.errorPatternAnalyzer.getSuggestions(printerId));
    return true;
  }
  if (method === 'GET' && path === '/api/error-correlations') {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, []), true;
    const code = url.searchParams.get('code') || null;
    sendJson(res, ctx.errorPatternAnalyzer.getAllCorrelations(code));
    return true;
  }
  if (method === 'GET' && path.startsWith('/api/error-correlations/')) {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, []), true;
    const code = decodeURIComponent(path.replace('/api/error-correlations/', ''));
    sendJson(res, ctx.errorPatternAnalyzer.getAllCorrelations(code));
    return true;
  }
  if (method === 'GET' && path === '/api/printer-health') {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, []), true;
    sendJson(res, ctx.errorPatternAnalyzer.getAllHealthScores());
    return true;
  }
  if (method === 'GET' && path.startsWith('/api/printer-health/')) {
    if (!ctx.errorPatternAnalyzer) return sendJson(res, null), true;
    const printerId = decodeURIComponent(path.replace('/api/printer-health/', ''));
    const score = ctx.errorPatternAnalyzer.getHealthScore(printerId);
    if (!score) return sendJson(res, { error: 'No health data for this printer' }, 404), true;
    sendJson(res, score);
    return true;
  }

  // ---- Demo data ----
  if (method === 'GET' && path === '/api/demo/status') {
    const ids = getDemoPrinterIds();
    sendJson(res, { hasDemo: ids.length > 0, printerIds: ids });
    return true;
  }
  if (method === 'DELETE' && path === '/api/demo') {
    const result = purgeDemoData();
    if (result.printerIds) {
      if (ctx.onDemoPurge) ctx.onDemoPurge(result.printerIds);
      for (const id of result.printerIds) {
        if (ctx.onPrinterRemoved) ctx.onPrinterRemoved(id);
      }
      if (ctx.broadcast) ctx.broadcast('printer_meta_update', { printers: getPrinters() });
    }
    sendJson(res, result);
    return true;
  }

  // ---- Failure Detection ----
  if (method === 'GET' && path === '/api/failure-detections') {
    const printerId = url.searchParams.get('printer_id') || null;
    const limit = parseInt(url.searchParams.get('limit') || '50');
    sendJson(res, getFailureDetections(printerId, limit));
    return true;
  }
  const fdMatch = path.match(/^\/api\/failure-detections\/(\d+)$/);
  if (fdMatch) {
    const fid = parseInt(fdMatch[1]);
    if (method === 'GET') { const fd = getFailureDetection(fid); sendJson(res, fd || { error: 'Not found' }, fd ? 200 : 404); return true; }
    if (method === 'DELETE') { deleteFailureDetection(fid); sendJson(res, { ok: true }); return true; }
  }
  if (method === 'POST' && path.match(/^\/api\/failure-detections\/\d+\/acknowledge$/)) {
    const fid = parseInt(path.split('/')[3]);
    acknowledgeFailureDetection(fid);
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'POST' && path === '/api/failure-detections') {
    return readBody(req, (b) => {
      if (!b.printer_id) return sendJson(res, { error: 'printer_id required' }, 400);
      const id = addFailureDetection(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }

  // ---- Push Subscriptions ----
  if (method === 'POST' && path === '/api/push/subscribe') {
    return readBody(req, (b) => {
      const vr = validate(PUSH_SUBSCRIBE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addPushSubscription({
        endpoint: b.endpoint,
        keys_p256dh: b.keys?.p256dh || null,
        keys_auth: b.keys?.auth || null,
        user_agent: req.headers['user-agent'] || null
      });
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (method === 'POST' && path === '/api/push/unsubscribe') {
    return readBody(req, (b) => {
      const vr = validate(PUSH_SUBSCRIBE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      deletePushSubscription(b.endpoint);
      sendJson(res, { ok: true });
    }), true;
  }
  if (method === 'GET' && path === '/api/push/vapid-key') {
    const vapidPublicKey = getInventorySetting('vapid_public_key');
    sendJson(res, { key: vapidPublicKey || null });
    return true;
  }

  return false;
}
