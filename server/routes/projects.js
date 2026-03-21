// routes/projects.js — Prosjekter, invoices, export-templates, user-kvoter, printer-grupper, screenshots
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getProjects, getProject, addProject, updateProject, deleteProject,
  getProjectPrints, addProjectPrint, updateProjectPrint, deleteProjectPrint,
  getProjectWithDetails, getProjectCostSummary, getProjectTimeline,
  getProjectInvoices, createInvoice, getInvoice, updateInvoiceStatus,
  addTimelineEvent, generateShareToken, getOverdueProjects, getProjectDashboard,
  getExportTemplates, addExportTemplate, deleteExportTemplate,
  getAllSpoolsForExport, getAllFilamentProfilesForExport, getAllVendorsForExport,
  getHistory,
  getUserQuota, upsertUserQuota, getUserTransactions, addUserTransaction,
  getPrinterGroups, getPrinterGroup, addPrinterGroup, updatePrinterGroup, deletePrinterGroup,
  addPrinterToGroup, removePrinterFromGroup, getGroupMembers, getPrinterGroupsForPrinter,
  getScreenshots, getScreenshotById, addScreenshot, deleteScreenshot,
  getFailureDetections, getFailureDetection, acknowledgeFailureDetection, deleteFailureDetection
} from '../database.js';
import { sendJson, readBody } from '../api-helpers.js';
import { validate } from '../validate.js';

// ---- Validation Schemas ----
const PRINTER_GROUP_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const PROJECT_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 },
  description: { type: 'string', maxLength: 2000 },
  client_name: { type: 'string', maxLength: 200 },
  status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'cancelled'] }
};

const PROJECT_UPDATE_SCHEMA = {
  name: { type: 'string', minLength: 1, maxLength: 200 },
  description: { type: 'string', maxLength: 2000 },
  client_name: { type: 'string', maxLength: 200 },
  status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'cancelled'] }
};

const INVOICE_SCHEMA = {
  customer_name: { type: 'string', maxLength: 200 },
  currency: { type: 'string', maxLength: 10 }
};

const INVOICE_STATUS_SCHEMA = {
  status: { type: 'string', required: true, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'] }
};

const EXPORT_TEMPLATE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  entity_type: { type: 'string', required: true, minLength: 1, maxLength: 50 }
};

const USER_TRANSACTION_SCHEMA = {
  type: { type: 'string', required: true, minLength: 1, maxLength: 50 },
  amount: { type: 'number', required: true }
};

// Hjelper for HTML-rendering av faktura
function _renderInvoiceHtml(inv) {
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const items = (() => { try { return JSON.parse(inv.items || '[]'); } catch { return []; } })();
  const total = typeof inv.total === 'number' ? inv.total.toFixed(2) : (inv.total || '0.00');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${esc(inv.invoice_number)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;color:#333}
.header{display:flex;justify-content:space-between;margin-bottom:30px}
h1{color:#1a1a2e;font-size:1.5rem}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px}
table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;border-bottom:1px solid #ddd}
th{background:#f5f5f5;font-weight:600}.total{text-align:right;font-size:1.1rem;font-weight:700;margin-top:20px}
.status{padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;display:inline-block}
.status-draft{background:#e3e3e3;color:#555}.status-sent{background:#dbeafe;color:#1e40af}
.status-paid{background:#dcfce7;color:#166534}.status-overdue{background:#fee2e2;color:#991b1b}
@media print{body{margin:20px}}</style></head><body>
<div class="header"><div><h1>INVOICE</h1><div>#${esc(inv.invoice_number)}</div></div>
<div><span class="status status-${esc(inv.status || 'draft')}">${esc((inv.status || 'draft').toUpperCase())}</span></div></div>
<div class="info-grid"><div><strong>Bill To:</strong><br>${esc(inv.customer_name || 'N/A')}<br>${esc(inv.customer_email || '')}<br>${esc(inv.customer_address || '')}</div>
<div><strong>Invoice Date:</strong> ${esc(inv.issued_at ? inv.issued_at.substring(0, 10) : 'N/A')}<br>
<strong>Due Date:</strong> ${esc(inv.due_date || 'N/A')}<br>
${inv.sent_at ? `<strong>Sent:</strong> ${esc(inv.sent_at.substring(0, 10))}<br>` : ''}</div></div>
<table><thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>
${items.map(item => `<tr><td>${esc(item.description || item.name || '')}</td><td>${esc(item.quantity || 1)}</td><td>${esc(item.unit_price || item.price || 0)}</td><td>${esc(((item.quantity || 1) * (item.unit_price || item.price || 0)).toFixed(2))}</td></tr>`).join('')}
</tbody></table>
<div class="total">Total: ${esc(total)} ${esc(inv.currency || 'NOK')}</div>
${inv.notes ? `<p style="margin-top:20px;color:#666">${esc(inv.notes)}</p>` : ''}
</body></html>`;
}

export async function handleProjectRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Printer Groups ----
  if (method === 'GET' && path === '/api/printer-groups') {
    const groups = getPrinterGroups();
    for (const g of groups) g.members = getGroupMembers(g.id);
    sendJson(res, groups);
    return true;
  }
  const pgMatch = path.match(/^\/api\/printer-groups\/(\d+)$/);
  if (pgMatch && method === 'GET') {
    const g = getPrinterGroup(parseInt(pgMatch[1]));
    if (!g) return sendJson(res, { error: 'Not found' }, 404), true;
    g.members = getGroupMembers(g.id);
    sendJson(res, g);
    return true;
  }
  if (method === 'POST' && path === '/api/printer-groups') {
    return readBody(req, (b) => {
      const vr = validate(PRINTER_GROUP_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addPrinterGroup(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (pgMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(PRINTER_GROUP_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      updatePrinterGroup(parseInt(pgMatch[1]), b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (pgMatch && method === 'DELETE') {
    deletePrinterGroup(parseInt(pgMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  const pgMemberMatch = path.match(/^\/api\/printer-groups\/(\d+)\/members$/);
  if (pgMemberMatch && method === 'POST') {
    return readBody(req, (b) => {
      if (!b.printer_id) return sendJson(res, { error: 'printer_id required' }, 400);
      addPrinterToGroup(parseInt(pgMemberMatch[1]), b.printer_id);
      sendJson(res, { ok: true });
    }), true;
  }
  const pgMemberDelMatch = path.match(/^\/api\/printer-groups\/(\d+)\/members\/([a-zA-Z0-9_-]+)$/);
  if (pgMemberDelMatch && method === 'DELETE') {
    removePrinterFromGroup(parseInt(pgMemberDelMatch[1]), pgMemberDelMatch[2]);
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/printers\/[a-zA-Z0-9_-]+\/groups$/)) {
    const pid = path.split('/')[3];
    sendJson(res, getPrinterGroupsForPrinter(pid));
    return true;
  }
  if (method === 'POST' && path === '/api/printer-groups/staggered-start') {
    return readBody(req, (b) => {
      if (!b.group_id || !b.filename) return sendJson(res, { error: 'group_id and filename required' }, 400);
      const group = getPrinterGroup(b.group_id);
      if (!group) return sendJson(res, { error: 'Group not found' }, 404);
      const members = getGroupMembers(group.id);
      const delay = group.stagger_delay_s || b.delay_seconds || 30;
      const results = [];
      for (let i = 0; i < members.length; i++) {
        results.push({ printer_id: members[i].printer_id, delay_s: i * delay, start_order: i + 1 });
      }
      sendJson(res, { group: group.name, filename: b.filename, schedule: results });
    }), true;
  }

  // ---- Projects ----
  if (method === 'GET' && path === '/api/projects/dashboard') {
    sendJson(res, getProjectDashboard());
    return true;
  }
  if (method === 'GET' && path === '/api/projects/overdue') {
    sendJson(res, getOverdueProjects());
    return true;
  }
  if (method === 'GET' && path === '/api/projects') {
    const status = url.searchParams.get('status');
    sendJson(res, getProjects(status || null));
    return true;
  }

  const projMatch = path.match(/^\/api\/projects\/(\d+)$/);
  const projDetailsMatch = path.match(/^\/api\/projects\/(\d+)\/details$/);
  if (projDetailsMatch && method === 'GET') {
    const p = getProjectWithDetails(parseInt(projDetailsMatch[1]));
    if (!p) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, p);
    return true;
  }

  const projCostMatch = path.match(/^\/api\/projects\/(\d+)\/cost-summary$/);
  if (projCostMatch && method === 'GET') {
    sendJson(res, getProjectCostSummary(parseInt(projCostMatch[1])));
    return true;
  }

  const projTimelineMatch = path.match(/^\/api\/projects\/(\d+)\/timeline$/);
  if (projTimelineMatch && method === 'GET') {
    sendJson(res, getProjectTimeline(parseInt(projTimelineMatch[1])));
    return true;
  }

  const projInvoicesMatch = path.match(/^\/api\/projects\/(\d+)\/invoices$/);
  if (projInvoicesMatch && method === 'GET') {
    sendJson(res, getProjectInvoices(parseInt(projInvoicesMatch[1])));
    return true;
  }
  if (projInvoicesMatch && method === 'POST') {
    return readBody(req, (b) => {
      const vr = validate(INVOICE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      b.project_id = parseInt(projInvoicesMatch[1]);
      if (!b.invoice_number) b.invoice_number = 'INV-' + Date.now();
      const id = createInvoice(b);
      addTimelineEvent(b.project_id, 'invoice_created', 'Invoice ' + b.invoice_number + ' created');
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }

  const projShareMatch = path.match(/^\/api\/projects\/(\d+)\/share$/);
  if (projShareMatch && method === 'POST') {
    return readBody(req, (b) => {
      const projectId = parseInt(projShareMatch[1]);
      const p = getProject(projectId);
      if (!p) return sendJson(res, { error: 'Not found' }, 404);
      if (b.enabled === false) {
        updateProject(projectId, { share_enabled: 0 });
        return sendJson(res, { ok: true, share_enabled: false });
      }
      let token = p.share_token;
      if (!token) token = generateShareToken(projectId);
      else updateProject(projectId, { share_enabled: 1 });
      addTimelineEvent(projectId, 'share_toggled', 'Share link ' + (b.enabled === false ? 'disabled' : 'enabled'));
      sendJson(res, { ok: true, share_token: token, share_enabled: true });
    }), true;
  }

  const projLinkQueueMatch = path.match(/^\/api\/projects\/(\d+)\/link-queue$/);
  if (projLinkQueueMatch && method === 'POST') {
    return readBody(req, (b) => {
      const projectId = parseInt(projLinkQueueMatch[1]);
      if (!b.queue_item_id) return sendJson(res, { error: 'queue_item_id required' }, 400);
      const id = addProjectPrint({ project_id: projectId, queue_item_id: b.queue_item_id, filename: b.filename || null, status: 'pending' });
      addTimelineEvent(projectId, 'queue_linked', 'Queue item #' + b.queue_item_id + ' linked');
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }

  if (projMatch && method === 'GET') {
    const p = getProject(parseInt(projMatch[1]));
    if (!p) return sendJson(res, { error: 'Not found' }, 404), true;
    p.prints = getProjectPrints(p.id);
    sendJson(res, p);
    return true;
  }
  if (method === 'POST' && path === '/api/projects') {
    return readBody(req, (b) => {
      const vr = validate(PROJECT_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addProject(b);
      addTimelineEvent(id, 'project_created', 'Project "' + b.name + '" created');
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (projMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(PROJECT_UPDATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const projectId = parseInt(projMatch[1]);
      updateProject(projectId, b);
      if (b.status) addTimelineEvent(projectId, 'status_changed', 'Status changed to ' + b.status);
      sendJson(res, { ok: true });
    }), true;
  }
  if (projMatch && method === 'DELETE') {
    deleteProject(parseInt(projMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  const projPrintMatch = path.match(/^\/api\/projects\/(\d+)\/prints$/);
  if (projPrintMatch && method === 'GET') {
    sendJson(res, getProjectPrints(parseInt(projPrintMatch[1])));
    return true;
  }
  if (projPrintMatch && method === 'POST') {
    return readBody(req, (b) => {
      b.project_id = parseInt(projPrintMatch[1]);
      const id = addProjectPrint(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }

  const projPrintItemMatch = path.match(/^\/api\/projects\/prints\/(\d+)$/);
  if (projPrintItemMatch && method === 'PUT') {
    return readBody(req, (b) => {
      updateProjectPrint(parseInt(projPrintItemMatch[1]), b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (projPrintItemMatch && method === 'DELETE') {
    deleteProjectPrint(parseInt(projPrintItemMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Invoices ----
  const invoiceMatch = path.match(/^\/api\/invoices\/(\d+)$/);
  if (invoiceMatch && method === 'GET') {
    const inv = getInvoice(parseInt(invoiceMatch[1]));
    if (!inv) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, inv);
    return true;
  }
  const invoiceHtmlMatch = path.match(/^\/api\/invoices\/(\d+)\/html$/);
  if (invoiceHtmlMatch && method === 'GET') {
    const inv = getInvoice(parseInt(invoiceHtmlMatch[1]));
    if (!inv) return sendJson(res, { error: 'Not found' }, 404), true;
    const html = _renderInvoiceHtml(inv);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return true;
  }
  const invoiceStatusMatch = path.match(/^\/api\/invoices\/(\d+)\/status$/);
  if (invoiceStatusMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(INVOICE_STATUS_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const sentAt = b.status === 'sent' ? new Date().toISOString() : null;
      updateInvoiceStatus(parseInt(invoiceStatusMatch[1]), b.status, sentAt);
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Export Templates ----
  if (method === 'GET' && path === '/api/export/templates') {
    const entityType = url.searchParams.get('entity_type');
    sendJson(res, getExportTemplates(entityType || null));
    return true;
  }
  if (method === 'POST' && path === '/api/export/templates') {
    return readBody(req, (b) => {
      const vr = validate(EXPORT_TEMPLATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      if (!b.columns) return sendJson(res, { error: 'columns required' }, 400);
      const id = addExportTemplate(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  const etMatch = path.match(/^\/api\/export\/templates\/(\d+)$/);
  if (etMatch && method === 'DELETE') {
    deleteExportTemplate(parseInt(etMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // Generic export endpoints
  if (method === 'GET' && path === '/api/export/spools') {
    const format = url.searchParams.get('format') || 'csv';
    const data = getAllSpoolsForExport();
    if (format === 'json') return sendJson(res, data), true;
    if (data.length === 0) { res.writeHead(200, { 'Content-Type': 'text/csv' }); res.end(''); return true; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => { const v = row[k]; return v === null || v === undefined ? '' : `"${String(v).replace(/"/g, '""')}"`; }).join(','))].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="spools.csv"' });
    res.end(csv);
    return true;
  }
  if (method === 'GET' && path === '/api/export/filament-profiles') {
    const format = url.searchParams.get('format') || 'csv';
    const data = getAllFilamentProfilesForExport();
    if (format === 'json') return sendJson(res, data), true;
    if (data.length === 0) { res.writeHead(200, { 'Content-Type': 'text/csv' }); res.end(''); return true; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => { const v = row[k]; return v === null || v === undefined ? '' : `"${String(v).replace(/"/g, '""')}"`; }).join(','))].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="filament_profiles.csv"' });
    res.end(csv);
    return true;
  }
  if (method === 'GET' && path === '/api/export/vendors') {
    const format = url.searchParams.get('format') || 'csv';
    const data = getAllVendorsForExport();
    if (format === 'json') return sendJson(res, data), true;
    if (data.length === 0) { res.writeHead(200, { 'Content-Type': 'text/csv' }); res.end(''); return true; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => { const v = row[k]; return v === null || v === undefined ? '' : `"${String(v).replace(/"/g, '""')}"`; }).join(','))].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="vendors.csv"' });
    res.end(csv);
    return true;
  }
  if (method === 'GET' && path === '/api/export/history') {
    const format = url.searchParams.get('format') || 'csv';
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const data = getHistory(null, limit);
    if (format === 'json') return sendJson(res, data), true;
    if (data.length === 0) { res.writeHead(200, { 'Content-Type': 'text/csv' }); res.end(''); return true; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => { const v = row[k]; return v === null || v === undefined ? '' : `"${String(v).replace(/"/g, '""')}"`; }).join(','))].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="print_history.csv"' });
    res.end(csv);
    return true;
  }

  // ---- User Quotas ----
  const uqMatch = path.match(/^\/api\/users\/(\d+)\/quota$/);
  if (uqMatch && method === 'GET') {
    sendJson(res, getUserQuota(parseInt(uqMatch[1])) || { balance: 0 });
    return true;
  }
  if (uqMatch && method === 'PUT') {
    return readBody(req, (b) => {
      try {
        upsertUserQuota(parseInt(uqMatch[1]), b);
        sendJson(res, { ok: true });
      } catch (e) { sendJson(res, { error: e.message }, 400); }
    }), true;
  }
  const utMatch = path.match(/^\/api\/users\/(\d+)\/transactions$/);
  if (utMatch && method === 'GET') {
    const limit = parseInt(url.searchParams.get('limit') || '50');
    sendJson(res, getUserTransactions(parseInt(utMatch[1]), limit));
    return true;
  }
  if (utMatch && method === 'POST') {
    return readBody(req, (b) => {
      const vr = validate(USER_TRANSACTION_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      b.user_id = parseInt(utMatch[1]);
      try {
        const id = addUserTransaction(b);
        sendJson(res, { ok: true, id }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 400); }
    }), true;
  }

  // ---- Failure Detection ----
  if (method === 'GET' && path === '/api/failure-detections') {
    const printerId = url.searchParams.get('printer_id');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    sendJson(res, getFailureDetections(printerId || null, limit));
    return true;
  }
  const fdMatch = path.match(/^\/api\/failure-detections\/(\d+)$/);
  if (fdMatch && method === 'GET') {
    const d = getFailureDetection(parseInt(fdMatch[1]));
    if (!d) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, d);
    return true;
  }
  if (fdMatch && method === 'DELETE') {
    deleteFailureDetection(parseInt(fdMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  const fdAckMatch = path.match(/^\/api\/failure-detections\/(\d+)\/acknowledge$/);
  if (fdAckMatch && method === 'POST') {
    acknowledgeFailureDetection(parseInt(fdAckMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Screenshots ----
  if (method === 'GET' && path === '/api/screenshots') {
    const printerId = url.searchParams.get('printer_id') || null;
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    sendJson(res, getScreenshots(printerId, limit, offset));
    return true;
  }
  const screenshotMatch = path.match(/^\/api\/screenshots\/(\d+)$/);
  if (screenshotMatch && method === 'GET') {
    const shot = getScreenshotById(parseInt(screenshotMatch[1]));
    if (!shot) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, shot);
    return true;
  }
  if (method === 'POST' && path === '/api/screenshots') {
    return readBody(req, (b) => {
      if (!b.data || !b.filename) return sendJson(res, { error: 'data and filename required' }, 400);
      addScreenshot(b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (screenshotMatch && method === 'DELETE') {
    deleteScreenshot(parseInt(screenshotMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  return false;
}
