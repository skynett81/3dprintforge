// Purchase Orders — procurement Phase 2 (InvenTree-inspired).
//
// A PURCHASE ORDER groups what you buy from one supplier and moves through a
// status lifecycle: draft -> placed -> received (or cancelled). Each LINE is a
// quantity of one supplier part / filament profile. Receiving a line creates
// real spools in inventory; partial receiving is tracked via qty_received and
// the PO auto-completes once every line is fully received.

import { getDb } from './connection.js';
import { addSpool } from './spools.js';
import { recordStockTransaction } from './stock-ledger.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:purchase-orders');

export const PO_STATUSES = ['draft', 'placed', 'shipped', 'received', 'cancelled'];

// Tracking-URL templates for carriers we can deep-link. `{n}` is the
// URL-encoded tracking number. Unknown carriers get no link.
const CARRIER_TRACKING = {
  postnord: 'https://www.postnord.no/en/track-and-trace#shipmentId={n}',
  posten: 'https://sporing.posten.no/sporing/{n}',
  bring: 'https://tracking.bring.com/tracking/{n}',
  dhl: 'https://www.dhl.com/en/express/tracking.html?AWB={n}',
  ups: 'https://www.ups.com/track?tracknum={n}',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr={n}',
  gls: 'https://gls-group.com/track?match={n}',
  usps: 'https://tools.usps.com/go/TrackConfirmAction?tLabels={n}',
};

/**
 * Build a tracking URL for a carrier + number, or null when the carrier is
 * unknown or the number is missing. Carrier match is case-insensitive.
 */
export function trackingUrl(carrier, number) {
  if (!carrier || !number) return null;
  const tpl = CARRIER_TRACKING[String(carrier).trim().toLowerCase()];
  if (!tpl) return null;
  return tpl.replace('{n}', encodeURIComponent(String(number).trim()));
}

// ---- Purchase orders ----

const PO_SELECT = `SELECT po.*, s.name AS supplier_name, s.currency AS supplier_currency,
  (SELECT COUNT(*) FROM purchase_order_lines l WHERE l.po_id = po.id) AS line_count,
  (SELECT COALESCE(SUM(l.quantity), 0) FROM purchase_order_lines l WHERE l.po_id = po.id) AS total_qty,
  (SELECT COALESCE(SUM(l.qty_received), 0) FROM purchase_order_lines l WHERE l.po_id = po.id) AS received_qty,
  (SELECT COALESCE(SUM(l.unit_price * l.quantity), 0) FROM purchase_order_lines l WHERE l.po_id = po.id) + po.shipping_cost AS total_cost
  FROM purchase_orders po
  LEFT JOIN suppliers s ON po.supplier_id = s.id`;

export function getPurchaseOrders(filters = {}) {
  const db = getDb();
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.status) { where += ' AND po.status = ?'; params.push(filters.status); }
  if (filters.supplier_id) { where += ' AND po.supplier_id = ?'; params.push(filters.supplier_id); }
  const orders = db.prepare(`${PO_SELECT}${where} ORDER BY po.created_at DESC`).all(...params);
  // Attach lines so the UI can render order detail without a second round-trip
  // (PO counts are small for a filament dashboard).
  for (const po of orders) { po.lines = getPurchaseOrderLines(po.id); po.tracking_url = trackingUrl(po.carrier, po.tracking_number); }
  return orders;
}

export function getPurchaseOrder(id) {
  const db = getDb();
  const po = db.prepare(`${PO_SELECT} WHERE po.id = ?`).get(id);
  if (!po) return null;
  po.lines = getPurchaseOrderLines(id);
  po.tracking_url = trackingUrl(po.carrier, po.tracking_number);
  return po;
}

export function addPurchaseOrder(po = {}) {
  const db = getDb();
  const status = PO_STATUSES.includes(po.status) ? po.status : 'draft';
  const result = db.prepare(
    `INSERT INTO purchase_orders (supplier_id, reference, status, order_date, target_date, currency, shipping_cost, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    po.supplier_id != null ? po.supplier_id : null,
    po.reference || null,
    status,
    po.order_date || null,
    po.target_date || null,
    po.currency || 'USD',
    po.shipping_cost != null ? po.shipping_cost : 0,
    po.notes || null
  );
  const id = Number(result.lastInsertRowid);
  if (Array.isArray(po.lines)) for (const line of po.lines) addPurchaseOrderLine(id, line);
  return getPurchaseOrder(id);
}

export function updatePurchaseOrder(id, po) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(id);
  if (!existing) return null;
  const m = { ...existing, ...po };
  if (!PO_STATUSES.includes(m.status)) m.status = existing.status;
  // Stamp received_at when transitioning into received; clear if leaving it.
  let receivedAt = existing.received_at;
  if (m.status === 'received' && existing.status !== 'received') receivedAt = new Date().toISOString();
  if (m.status !== 'received') receivedAt = m.received_at && m.status === existing.status ? m.received_at : null;
  db.prepare(
    `UPDATE purchase_orders SET supplier_id=?, reference=?, status=?, order_date=?, target_date=?,
       received_at=?, currency=?, shipping_cost=?, notes=? WHERE id=?`
  ).run(
    m.supplier_id != null ? m.supplier_id : null,
    m.reference || null,
    m.status,
    m.order_date || null,
    m.target_date || null,
    receivedAt || null,
    m.currency || 'USD',
    m.shipping_cost != null ? m.shipping_cost : 0,
    m.notes || null,
    id
  );
  return getPurchaseOrder(id);
}

/**
 * Mark a PO as shipped with carrier + tracking number. Valid from any state
 * except received or cancelled.
 */
export function markPurchaseOrderShipped(id, { carrier = null, tracking_number = null } = {}) {
  const db = getDb();
  const po = db.prepare('SELECT status FROM purchase_orders WHERE id = ?').get(id);
  if (!po) throw new Error('Purchase order not found');
  if (po.status === 'received' || po.status === 'cancelled') {
    throw new Error(`Cannot ship a ${po.status} purchase order`);
  }
  db.prepare(
    "UPDATE purchase_orders SET status = 'shipped', carrier = ?, tracking_number = ?, shipped_at = ? WHERE id = ?"
  ).run(carrier || null, tracking_number || null, new Date().toISOString(), id);
  return getPurchaseOrder(id);
}

export function deletePurchaseOrder(id) {
  const db = getDb();
  db.prepare('DELETE FROM purchase_orders WHERE id = ?').run(id);
}

// ---- Purchase order lines ----

const LINE_SELECT = `SELECT l.*, fp.name AS profile_name, fp.material AS profile_material,
  sp.sku AS supplier_sku
  FROM purchase_order_lines l
  LEFT JOIN filament_profiles fp ON l.filament_profile_id = fp.id
  LEFT JOIN supplier_parts sp ON l.supplier_part_id = sp.id`;

export function getPurchaseOrderLines(poId) {
  const db = getDb();
  return db.prepare(`${LINE_SELECT} WHERE l.po_id = ? ORDER BY l.id`).all(poId);
}

export function getPurchaseOrderLine(id) {
  const db = getDb();
  return db.prepare(`${LINE_SELECT} WHERE l.id = ?`).get(id) || null;
}

export function addPurchaseOrderLine(poId, line = {}) {
  const db = getDb();
  // Inherit profile / weight / price from the linked supplier part when not
  // explicitly given, so a line is fully specified for later receiving.
  let { filament_profile_id, weight_g, unit_price } = line;
  if (line.supplier_part_id) {
    const sp = db.prepare('SELECT * FROM supplier_parts WHERE id = ?').get(line.supplier_part_id);
    if (sp) {
      if (filament_profile_id == null) filament_profile_id = sp.filament_profile_id;
      if (weight_g == null) weight_g = sp.weight_g;
      if (unit_price == null) unit_price = sp.price;
    }
  }
  const result = db.prepare(
    `INSERT INTO purchase_order_lines (po_id, supplier_part_id, filament_profile_id, description, quantity, qty_received, unit_price, weight_g)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    poId,
    line.supplier_part_id != null ? line.supplier_part_id : null,
    filament_profile_id != null ? filament_profile_id : null,
    line.description || null,
    line.quantity != null ? line.quantity : 1,
    line.qty_received != null ? line.qty_received : 0,
    unit_price != null ? unit_price : null,
    weight_g != null ? weight_g : 1000
  );
  return getPurchaseOrderLine(Number(result.lastInsertRowid));
}

export function updatePurchaseOrderLine(id, line) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM purchase_order_lines WHERE id = ?').get(id);
  if (!existing) return null;
  const m = { ...existing, ...line };
  db.prepare(
    `UPDATE purchase_order_lines SET supplier_part_id=?, filament_profile_id=?, description=?, quantity=?, qty_received=?, unit_price=?, weight_g=? WHERE id=?`
  ).run(
    m.supplier_part_id != null ? m.supplier_part_id : null,
    m.filament_profile_id != null ? m.filament_profile_id : null,
    m.description || null,
    m.quantity != null ? m.quantity : 1,
    m.qty_received != null ? m.qty_received : 0,
    m.unit_price != null ? m.unit_price : null,
    m.weight_g != null ? m.weight_g : 1000,
    id
  );
  return getPurchaseOrderLine(id);
}

export function deletePurchaseOrderLine(id) {
  const db = getDb();
  db.prepare('DELETE FROM purchase_order_lines WHERE id = ?').run(id);
}

// ---- Receiving ----
// Receive `qty` units of a line into stock as real spools. Defaults to the full
// outstanding quantity. Each unit becomes a spool (profile, pack weight, unit
// cost). Updates qty_received and recomputes the parent PO status.
export function receivePurchaseOrderLine(lineId, qty, opts = {}) {
  const db = getDb();
  const line = db.prepare('SELECT * FROM purchase_order_lines WHERE id = ?').get(lineId);
  if (!line) throw new Error('purchase order line not found');
  const outstanding = line.quantity - line.qty_received;
  const n = qty != null ? Math.min(qty, outstanding) : outstanding;
  if (n <= 0) return { received: 0, spoolIds: [] };

  const po = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(line.po_id);
  const spoolIds = [];
  for (let i = 0; i < n; i++) {
    const weight = line.weight_g || 1000;
    const { id } = addSpool({
      filament_profile_id: line.filament_profile_id || null,
      initial_weight_g: weight,
      cost: line.unit_price != null ? line.unit_price : null,
      location: opts.location || null,
      purchase_date: (po && po.order_date) || new Date().toISOString().slice(0, 10),
    });
    // Audit the receipt in the unified stock ledger, linked back to the PO.
    try {
      recordStockTransaction({
        spool_id: id, txn_type: 'receive', delta_g: weight, balance_g: weight,
        reason: po && po.reference ? `Received from ${po.reference}` : 'Received from purchase order',
        ref_type: 'po', ref_id: line.po_id, actor: opts.actor || null,
      });
    } catch (e) { log.warn('Failed to record receive txn: ' + e.message); }
    spoolIds.push(id);
  }
  db.prepare('UPDATE purchase_order_lines SET qty_received = qty_received + ? WHERE id = ?').run(n, lineId);
  recomputePurchaseOrderStatus(line.po_id);
  return { received: n, spoolIds };
}

// Move a PO between statuses based on how much of it has been received:
// fully received -> 'received' (stamped); any receiving on a draft -> 'placed'.
export function recomputePurchaseOrderStatus(poId) {
  const db = getDb();
  const po = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(poId);
  if (!po || po.status === 'cancelled') return;
  const agg = db.prepare(
    'SELECT COALESCE(SUM(quantity),0) AS total, COALESCE(SUM(qty_received),0) AS received FROM purchase_order_lines WHERE po_id = ?'
  ).get(poId);
  if (agg.total > 0 && agg.received >= agg.total) {
    db.prepare('UPDATE purchase_orders SET status = ?, received_at = ? WHERE id = ?')
      .run('received', po.received_at || new Date().toISOString(), poId);
  } else if (agg.received > 0 && po.status === 'draft') {
    db.prepare("UPDATE purchase_orders SET status = 'placed' WHERE id = ?").run(poId);
  }
}
