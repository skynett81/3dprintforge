import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:projects');

// ---- Projects ----

export function getProjects(status = null) {
  const db = getDb();
  if (status) return db.prepare('SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC').all(status);
  return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
}

export function getProject(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) || null;
}

export function addProject(p) {
  const db = getDb();
  const result = db.prepare('INSERT INTO projects (name, description, status, client_name, due_date, notes, tags) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    p.name, p.description || null, p.status || 'active', p.client_name || null, p.due_date || null, p.notes || null, p.tags ? JSON.stringify(p.tags) : null);
  return Number(result.lastInsertRowid);
}

export function updateProject(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'status', 'client_name', 'due_date', 'total_prints', 'completed_prints', 'total_cost', 'notes', 'completed_at', 'customer_name', 'customer_email', 'customer_phone', 'deadline', 'priority', 'estimated_cost', 'actual_cost', 'share_token', 'share_enabled']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (updates.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(updates.tags)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteProject(id) {
  const db = getDb();
  db.prepare('DELETE FROM project_prints WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function getProjectPrints(projectId) {
  const db = getDb();
  return db.prepare('SELECT * FROM project_prints WHERE project_id = ? ORDER BY added_at DESC').all(projectId);
}

export function addProjectPrint(pp) {
  const db = getDb();
  const result = db.prepare('INSERT INTO project_prints (project_id, print_history_id, queue_item_id, filename, status, notes) VALUES (?, ?, ?, ?, ?, ?)').run(
    pp.project_id, pp.print_history_id || null, pp.queue_item_id || null, pp.filename || null, pp.status || 'pending', pp.notes || null);
  return Number(result.lastInsertRowid);
}

export function updateProjectPrint(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['status', 'notes', 'print_history_id']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE project_prints SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteProjectPrint(id) {
  const db = getDb();
  db.prepare('DELETE FROM project_prints WHERE id = ?').run(id);
}

// ---- Order Management ----

export function getProjectWithDetails(id) {
  const db = getDb();
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!p) return null;
  p.prints = db.prepare(`
    SELECT pp.*, ph.filename as print_filename, ph.status as print_status,
           ph.duration_seconds, ph.filament_used_g, ph.filament_type,
           pc.total_cost as print_cost
    FROM project_prints pp
    LEFT JOIN print_history ph ON pp.print_history_id = ph.id
    LEFT JOIN print_costs pc ON ph.id = pc.print_history_id
    WHERE pp.project_id = ?
    ORDER BY pp.added_at DESC
  `).all(id);
  p.timeline = db.prepare('SELECT * FROM project_timeline WHERE project_id = ? ORDER BY timestamp DESC LIMIT 50').all(id);
  p.invoices = db.prepare('SELECT * FROM project_invoices WHERE project_id = ? ORDER BY created_at DESC').all(id);
  return p;
}

export function generateShareToken(projectId) {
  const db = getDb();
  const token = crypto.randomUUID();
  db.prepare('UPDATE projects SET share_token = ?, share_enabled = 1 WHERE id = ?').run(token, projectId);
  return token;
}

export function getProjectByShareToken(token) {
  const db = getDb();
  if (!token) return null;
  const p = db.prepare('SELECT * FROM projects WHERE share_token = ? AND share_enabled = 1').get(token);
  if (!p) return null;
  p.prints = db.prepare(`
    SELECT pp.*, ph.filename as print_filename, ph.status as print_status,
           ph.duration_seconds, ph.filament_used_g
    FROM project_prints pp
    LEFT JOIN print_history ph ON pp.print_history_id = ph.id
    WHERE pp.project_id = ?
    ORDER BY pp.added_at DESC
  `).all(p.id);
  return p;
}

export function createInvoice(data) {
  const db = getDb();
  const items = typeof data.items === 'string' ? data.items : JSON.stringify(data.items || []);
  const r = db.prepare(`INSERT INTO project_invoices (project_id, invoice_number, customer_name, customer_email, items, subtotal, tax_rate, tax_amount, total, currency, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    data.project_id, data.invoice_number || null,
    data.customer_name || null, data.customer_email || null,
    items, data.subtotal ?? 0, data.tax_rate ?? 0, data.tax_amount ?? 0,
    data.total ?? 0, data.currency || 'NOK', data.notes || null,
    data.status || 'draft'
  );
  return Number(r.lastInsertRowid);
}

export function getInvoice(id) {
  const db = getDb();
  const inv = db.prepare('SELECT * FROM project_invoices WHERE id = ?').get(id);
  if (!inv) return null;
  try { inv.items = JSON.parse(inv.items || '[]'); } catch { inv.items = []; }
  return inv;
}

export function getProjectInvoices(projectId) {
  const db = getDb();
  return db.prepare('SELECT * FROM project_invoices WHERE project_id = ? ORDER BY created_at DESC').all(projectId);
}

export function updateInvoiceStatus(id, status, sentAt) {
  const db = getDb();
  if (status === 'sent' && sentAt) {
    db.prepare('UPDATE project_invoices SET status = ?, sent_at = ? WHERE id = ?').run(status, sentAt, id);
  } else {
    db.prepare('UPDATE project_invoices SET status = ? WHERE id = ?').run(status, id);
  }
}

export function addTimelineEvent(projectId, type, description) {
  const db = getDb();
  const r = db.prepare('INSERT INTO project_timeline (project_id, event_type, description) VALUES (?, ?, ?)').run(projectId, type, description);
  return Number(r.lastInsertRowid);
}

export function getProjectTimeline(projectId) {
  const db = getDb();
  return db.prepare('SELECT * FROM project_timeline WHERE project_id = ? ORDER BY timestamp DESC').all(projectId);
}

export function getProjectCostSummary(projectId) {
  const db = getDb();
  const row = db.prepare(`
    SELECT
      COUNT(pp.id) as total_prints,
      SUM(CASE WHEN ph.status = 'finish' OR ph.status = 'completed' THEN 1 ELSE 0 END) as completed_prints,
      COALESCE(SUM(pc.total_cost), 0) as actual_cost,
      COALESCE(SUM(pc.filament_cost), 0) as filament_cost,
      COALESCE(SUM(pc.energy_cost), 0) as energy_cost,
      COALESCE(SUM(pc.depreciation_cost), 0) as wear_cost,
      COALESCE(SUM(pc.labor_cost), 0) as labor_cost,
      COALESCE(SUM(ph.filament_used_g), 0) as total_filament_g,
      COALESCE(SUM(ph.waste_g), 0) as total_waste_g,
      COALESCE(SUM(ph.duration_seconds), 0) as total_duration_s
    FROM project_prints pp
    LEFT JOIN print_history ph ON pp.print_history_id = ph.id
    LEFT JOIN print_costs pc ON ph.id = pc.print_history_id
    WHERE pp.project_id = ?
  `).get(projectId);
  return row || { total_prints: 0, completed_prints: 0, actual_cost: 0, filament_cost: 0, energy_cost: 0, wear_cost: 0, labor_cost: 0, total_filament_g: 0, total_waste_g: 0, total_duration_s: 0 };
}

export function getOverdueProjects() {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM projects
    WHERE (deadline IS NOT NULL AND deadline != '' AND deadline < datetime('now'))
      AND status NOT IN ('completed', 'cancelled', 'invoiced')
    ORDER BY deadline ASC
  `).all();
}

export function getProjectDashboard() {
  const db = getDb();
  const active = db.prepare(`SELECT COUNT(*) as count FROM projects WHERE status NOT IN ('completed', 'cancelled', 'invoiced')`).get();
  const overdue = db.prepare(`SELECT COUNT(*) as count FROM projects WHERE deadline IS NOT NULL AND deadline != '' AND deadline < datetime('now') AND status NOT IN ('completed', 'cancelled', 'invoiced')`).get();
  const upcoming = db.prepare(`SELECT * FROM projects WHERE deadline IS NOT NULL AND deadline != '' AND deadline >= datetime('now') AND deadline <= datetime('now', '+7 days') AND status NOT IN ('completed', 'cancelled', 'invoiced') ORDER BY deadline ASC LIMIT 10`).all();
  const revenueMonth = db.prepare(`SELECT COALESCE(SUM(total), 0) as revenue FROM project_invoices WHERE status = 'paid' AND created_at >= datetime('now', 'start of month')`).get();
  const totalPaid = db.prepare(`SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count FROM project_invoices WHERE status = 'paid'`).get();
  const recentTimeline = db.prepare(`SELECT pt.*, p.name as project_name FROM project_timeline pt LEFT JOIN projects p ON pt.project_id = p.id ORDER BY pt.timestamp DESC LIMIT 20`).all();
  return {
    active_orders: active?.count || 0,
    overdue_count: overdue?.count || 0,
    revenue_this_month: revenueMonth?.revenue || 0,
    avg_order_value: totalPaid?.count > 0 ? (totalPaid.total / totalPaid.count) : 0,
    upcoming_deadlines: upcoming,
    recent_activity: recentTimeline
  };
}
