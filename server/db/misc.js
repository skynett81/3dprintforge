import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:misc');

// ---- Tags ----

export function getTags(category) {
  const db = getDb();
  const base = `SELECT t.*, (SELECT COUNT(*) FROM entity_tags et WHERE et.tag_id = t.id) AS usage_count FROM tags t`;
  if (category) return db.prepare(base + ' WHERE t.category = ? ORDER BY t.name').all(category);
  return db.prepare(base + ' ORDER BY t.category, t.name').all();
}

export function createTag(name, category, color) {
  const db = getDb();
  const r = db.prepare('INSERT INTO tags (name, category, color) VALUES (?, ?, ?)').run(name, category || 'custom', color || null);
  return r.lastInsertRowid;
}

export function updateTag(id, name, category, color) {
  const db = getDb();
  db.prepare('UPDATE tags SET name = ?, category = ?, color = ? WHERE id = ?').run(name, category || 'custom', color || null, id);
}

export function deleteTag(id) {
  const db = getDb();
  db.prepare('DELETE FROM entity_tags WHERE tag_id = ?').run(id);
  db.prepare('DELETE FROM tags WHERE id = ?').run(id);
}

export function getEntitiesByTag(entityType, tagId) {
  const db = getDb();
  return db.prepare('SELECT entity_id FROM entity_tags WHERE entity_type = ? AND tag_id = ?').all(entityType, tagId).map(r => r.entity_id);
}

export function assignTag(entityType, entityId, tagId) {
  const db = getDb();
  db.prepare('INSERT OR IGNORE INTO entity_tags (entity_type, entity_id, tag_id) VALUES (?, ?, ?)').run(entityType, entityId, tagId);
}

export function unassignTag(entityType, entityId, tagId) {
  const db = getDb();
  db.prepare('DELETE FROM entity_tags WHERE entity_type = ? AND entity_id = ? AND tag_id = ?').run(entityType, entityId, tagId);
}

export function getEntityTags(entityType, entityId) {
  const db = getDb();
  return db.prepare(`SELECT t.* FROM tags t JOIN entity_tags et ON t.id = et.tag_id
    WHERE et.entity_type = ? AND et.entity_id = ?
    ORDER BY t.name`).all(entityType, entityId);
}

export function bulkAssignTag(tagId, entityType, entityIds) {
  const db = getDb();
  const stmt = db.prepare('INSERT OR IGNORE INTO entity_tags (entity_type, entity_id, tag_id) VALUES (?, ?, ?)');
  let count = 0;
  for (const id of entityIds) { stmt.run(entityType, id, tagId); count++; }
  return count;
}

export function bulkUnassignTag(tagId, entityType, entityIds) {
  const db = getDb();
  const placeholders = entityIds.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM entity_tags WHERE tag_id = ? AND entity_type = ? AND entity_id IN (${placeholders})`).run(tagId, entityType, ...entityIds);
  return result.changes;
}

// ---- NFC Mappings ----

export function getNfcMappings() {
  const db = getDb();
  return db.prepare(`SELECT n.*, fp.name AS spool_name, fp.color_hex
    FROM nfc_mappings n
    LEFT JOIN spools s ON n.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    ORDER BY n.created_at DESC`).all();
}

export function lookupNfcTag(uid) {
  const db = getDb();
  return db.prepare(`SELECT n.*, fp.name AS spool_name, fp.color_hex, fp.material, v.name AS vendor_name
    FROM nfc_mappings n
    LEFT JOIN spools s ON n.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE n.tag_uid = ?`).get(uid);
}

export function linkNfcTag(tagUid, spoolId, standard, data) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM nfc_mappings WHERE tag_uid = ?').get(tagUid);
  if (existing) {
    db.prepare('UPDATE nfc_mappings SET spool_id = ?, standard = ?, data = ?, last_scanned = datetime(\'now\') WHERE tag_uid = ?')
      .run(spoolId, standard || 'openspool', data || null, tagUid);
    return existing.id;
  }
  const r = db.prepare('INSERT INTO nfc_mappings (tag_uid, spool_id, standard, data, last_scanned) VALUES (?, ?, ?, ?, datetime(\'now\'))')
    .run(tagUid, spoolId, standard || 'openspool', data || null);
  return r.lastInsertRowid;
}

export function unlinkNfcTag(uid) {
  const db = getDb();
  db.prepare('DELETE FROM nfc_mappings WHERE tag_uid = ?').run(uid);
}

export function updateNfcScan(uid) {
  const db = getDb();
  db.prepare('UPDATE nfc_mappings SET last_scanned = datetime(\'now\') WHERE tag_uid = ?').run(uid);
}

// ---- Spool Checkout ----

export function checkoutSpool(spoolId, actor, fromLocation) {
  const db = getDb();
  db.prepare('UPDATE spools SET checked_out = 1, checked_out_at = datetime(\'now\'), checked_out_by = ?, checked_out_from = ? WHERE id = ?')
    .run(actor || null, fromLocation || null, spoolId);
  db.prepare('INSERT INTO spool_checkout_log (spool_id, action, from_location, actor) VALUES (?, ?, ?, ?)')
    .run(spoolId, 'checkout', fromLocation || null, actor || null);
  // Note: addSpoolEvent is in spools.js — call directly here to avoid circular import
  db.prepare('INSERT INTO spool_events (spool_id, event_type, details, actor) VALUES (?, ?, ?, ?)')
    .run(spoolId, 'checked_out', JSON.stringify({ by: actor, from: fromLocation }), actor || null);
}

export function checkinSpool(spoolId, actor, toLocation) {
  const db = getDb();
  const spool = db.prepare('SELECT checked_out_from FROM spools WHERE id = ?').get(spoolId);
  db.prepare('UPDATE spools SET checked_out = 0, checked_out_at = NULL, checked_out_by = NULL, checked_out_from = NULL WHERE id = ?')
    .run(spoolId);
  db.prepare('INSERT INTO spool_checkout_log (spool_id, action, from_location, to_location, actor) VALUES (?, ?, ?, ?, ?)')
    .run(spoolId, 'checkin', spool?.checked_out_from || null, toLocation || null, actor || null);
  db.prepare('INSERT INTO spool_events (spool_id, event_type, details, actor) VALUES (?, ?, ?, ?)')
    .run(spoolId, 'checked_in', JSON.stringify({ by: actor, to: toLocation }), actor || null);
}

export function getCheckedOutSpools() {
  const db = getDb();
  return db.prepare(`SELECT s.*, fp.name AS profile_name, fp.material, fp.color_hex, fp.color_name, v.name AS vendor_name
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.checked_out = 1 ORDER BY s.checked_out_at DESC`).all();
}

export function getCheckoutLog(spoolId, limit = 50) {
  const db = getDb();
  if (spoolId) {
    return db.prepare('SELECT * FROM spool_checkout_log WHERE spool_id = ? ORDER BY timestamp DESC LIMIT ?').all(spoolId, limit);
  }
  return db.prepare('SELECT * FROM spool_checkout_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

// ---- G-Code Macros ----

export function getMacros(category) {
  const db = getDb();
  if (category) return db.prepare('SELECT * FROM gcode_macros WHERE category = ? ORDER BY sort_order, name').all(category);
  return db.prepare('SELECT * FROM gcode_macros ORDER BY sort_order, name').all();
}

export function getMacro(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM gcode_macros WHERE id = ?').get(id) || null;
}

export function addMacro(m) {
  const db = getDb();
  const r = db.prepare('INSERT INTO gcode_macros (name, description, gcode, category, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(m.name, m.description || null, m.gcode, m.category || 'manual', m.sort_order || 0);
  return r.lastInsertRowid;
}

export function updateMacro(id, m) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'gcode', 'category', 'sort_order']) {
    if (m[key] !== undefined) { fields.push(`${key} = ?`); values.push(m[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE gcode_macros SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteMacro(id) {
  const db = getDb();
  db.prepare('DELETE FROM gcode_macros WHERE id = ?').run(id);
}

// ---- Outgoing Webhooks ----

export function getWebhookConfigs() {
  const db = getDb();
  return db.prepare('SELECT * FROM webhook_configs ORDER BY created_at DESC').all();
}

export function getWebhookConfig(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM webhook_configs WHERE id = ?').get(id) || null;
}

export function addWebhookConfig(w) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO webhook_configs (name, url, secret, events, headers, template, retry_count, retry_delay_s, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    w.name, w.url, w.secret || null,
    JSON.stringify(w.events || []), JSON.stringify(w.headers || {}),
    w.template || 'generic', w.retry_count ?? 3, w.retry_delay_s ?? 10, w.active ?? 1
  );
  return Number(r.lastInsertRowid);
}

export function updateWebhookConfig(id, w) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['name', 'url', 'secret', 'template', 'retry_count', 'retry_delay_s', 'active']) {
    if (w[key] !== undefined) { fields.push(`${key} = ?`); values.push(w[key]); }
  }
  if (w.events !== undefined) { fields.push('events = ?'); values.push(JSON.stringify(w.events)); }
  if (w.headers !== undefined) { fields.push('headers = ?'); values.push(JSON.stringify(w.headers)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE webhook_configs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteWebhookConfig(id) {
  const db = getDb();
  db.prepare('DELETE FROM webhook_configs WHERE id = ?').run(id);
}

export function getActiveWebhooks() {
  const db = getDb();
  return db.prepare('SELECT * FROM webhook_configs WHERE active = 1').all();
}

export function addWebhookDelivery(d) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status, attempts)
    VALUES (?, ?, ?, ?, ?)`).run(d.webhook_id, d.event_type, d.payload, d.status || 'pending', d.attempts || 0);
  return Number(r.lastInsertRowid);
}

export function updateWebhookDelivery(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['status', 'attempts', 'last_attempt', 'response_code', 'response_body']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE webhook_deliveries SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function getWebhookDeliveries(webhookId, limit = 50) {
  const db = getDb();
  return db.prepare('SELECT * FROM webhook_deliveries WHERE webhook_id = ? ORDER BY created_at DESC LIMIT ?').all(webhookId, limit);
}

export function getPendingDeliveries() {
  const db = getDb();
  return db.prepare("SELECT wd.*, wc.url, wc.secret, wc.headers, wc.template, wc.retry_count, wc.retry_delay_s FROM webhook_deliveries wd JOIN webhook_configs wc ON wd.webhook_id = wc.id WHERE wd.status IN ('pending','retrying') AND wc.active = 1 ORDER BY wd.created_at ASC LIMIT 50").all();
}

// ---- Timelapse ----

export function getTimelapseRecordings(printerId = null, limit = 50) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT * FROM timelapse_recordings WHERE printer_id = ? ORDER BY started_at DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM timelapse_recordings ORDER BY started_at DESC LIMIT ?').all(limit);
}

export function getTimelapseRecording(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM timelapse_recordings WHERE id = ?').get(id) || null;
}

export function addTimelapseRecording(r) {
  const db = getDb();
  const result = db.prepare('INSERT INTO timelapse_recordings (printer_id, print_history_id, filename, format, file_path, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(r.printer_id, r.print_history_id || null, r.filename || null, r.format || 'mp4', r.file_path || null, r.status || 'recording');
  return Number(result.lastInsertRowid);
}

export function updateTimelapseRecording(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['filename', 'format', 'duration_seconds', 'frame_count', 'file_size_bytes', 'file_path', 'status', 'completed_at', 'print_history_id']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE timelapse_recordings SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteTimelapseRecording(id) {
  const db = getDb();
  db.prepare('DELETE FROM timelapse_recordings WHERE id = ?').run(id);
}

// ---- Push Subscriptions ----

export function getPushSubscriptions() {
  const db = getDb();
  return db.prepare('SELECT * FROM push_subscriptions ORDER BY created_at DESC').all();
}

export function addPushSubscription(sub) {
  const db = getDb();
  try {
    const result = db.prepare('INSERT OR REPLACE INTO push_subscriptions (endpoint, keys_p256dh, keys_auth, user_agent) VALUES (?, ?, ?, ?)')
      .run(sub.endpoint, sub.keys_p256dh || null, sub.keys_auth || null, sub.user_agent || null);
    return Number(result.lastInsertRowid);
  } catch (e) {
    return null;
  }
}

export function deletePushSubscription(endpoint) {
  const db = getDb();
  db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);
}

export function deletePushSubscriptionById(id) {
  const db = getDb();
  db.prepare('DELETE FROM push_subscriptions WHERE id = ?').run(id);
}

// ---- Notifications ----

export function addNotificationLog(entry) {
  const db = getDb();
  return db.prepare(`INSERT INTO notification_log
    (event_type, channel, printer_id, title, message, status, error_info)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    entry.event_type, entry.channel, entry.printer_id || null,
    entry.title, entry.message, entry.status || 'sent', entry.error_info || null
  );
}

export function getNotificationLog(limit = 50, offset = 0) {
  const db = getDb();
  return db.prepare('SELECT * FROM notification_log ORDER BY timestamp DESC LIMIT ? OFFSET ?')
    .all(limit, offset);
}

export function addNotificationQueue(entry) {
  const db = getDb();
  return db.prepare(`INSERT INTO notification_queue
    (event_type, printer_id, printer_name, title, message, event_data)
    VALUES (?, ?, ?, ?, ?, ?)`).run(
    entry.event_type, entry.printer_id || null, entry.printer_name || null,
    entry.title, entry.message, entry.event_data ? JSON.stringify(entry.event_data) : null
  );
}

export function getNotificationQueue() {
  const db = getDb();
  return db.prepare('SELECT * FROM notification_queue ORDER BY queued_at ASC').all();
}

export function clearNotificationQueue() {
  const db = getDb();
  return db.prepare('DELETE FROM notification_queue').run();
}

// ---- Update History ----

export function addUpdateEntry(entry) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO update_history (from_version, to_version, method, status, backup_path)
    VALUES (?, ?, ?, ?, ?)
  `).run(entry.from_version, entry.to_version, entry.method, entry.status || 'started', entry.backup_path || null);
  return result.lastInsertRowid;
}

export function updateUpdateEntry(id, status, errorMessage, durationMs) {
  const db = getDb();
  db.prepare('UPDATE update_history SET status = ?, error_message = ?, duration_ms = ? WHERE id = ?')
    .run(status, errorMessage || null, durationMs || null, id);
}

export function getUpdateHistory(limit = 20) {
  const db = getDb();
  return db.prepare('SELECT * FROM update_history ORDER BY timestamp DESC LIMIT ?').all(limit);
}

// ---- Model Links ----

export function getModelLink(printerId, filename) {
  const db = getDb();
  return db.prepare('SELECT * FROM model_links WHERE printer_id = ? AND filename = ?').get(printerId, filename);
}

export function setModelLink(link) {
  const db = getDb();
  return db.prepare(`INSERT INTO model_links (printer_id, filename, source, source_id, title, url, image, designer, description, category, print_settings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(printer_id, filename) DO UPDATE SET
      source = excluded.source,
      source_id = excluded.source_id,
      title = excluded.title,
      url = excluded.url,
      image = excluded.image,
      designer = excluded.designer,
      description = excluded.description,
      category = excluded.category,
      print_settings = excluded.print_settings,
      linked_at = datetime('now')
  `).run(
    link.printer_id, link.filename, link.source, link.source_id,
    link.title || null, link.url || null, link.image || null, link.designer || null,
    link.description || null, link.category || null,
    link.print_settings ? (typeof link.print_settings === 'string' ? link.print_settings : JSON.stringify(link.print_settings)) : null
  );
}

export function deleteModelLink(printerId, filename) {
  const db = getDb();
  return db.prepare('DELETE FROM model_links WHERE printer_id = ? AND filename = ?').run(printerId, filename);
}

export function getRecentModelLinks(limit = 10) {
  const db = getDb();
  return db.prepare('SELECT * FROM model_links ORDER BY linked_at DESC LIMIT ?').all(limit);
}

// ---- Custom Fields ----

export function getCustomFieldDefs(entityType = null) {
  const db = getDb();
  if (entityType) return db.prepare('SELECT * FROM custom_field_defs WHERE entity_type = ? ORDER BY sort_order, field_name').all(entityType);
  return db.prepare('SELECT * FROM custom_field_defs ORDER BY entity_type, sort_order, field_name').all();
}

export function getCustomFieldDef(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM custom_field_defs WHERE id = ?').get(id) || null;
}

export function addCustomFieldDef(d) {
  const db = getDb();
  const result = db.prepare('INSERT INTO custom_field_defs (entity_type, field_name, field_label, field_type, options, default_value, required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    d.entity_type, d.field_name, d.field_label, d.field_type || 'text', d.options ? JSON.stringify(d.options) : null, d.default_value || null, d.required ? 1 : 0, d.sort_order || 0);
  return Number(result.lastInsertRowid);
}

export function updateCustomFieldDef(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['field_label', 'field_type', 'default_value', 'required', 'sort_order']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (updates.options !== undefined) { fields.push('options = ?'); values.push(JSON.stringify(updates.options)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE custom_field_defs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCustomFieldDef(id) {
  const db = getDb();
  db.prepare('DELETE FROM custom_field_values WHERE field_id = ?').run(id);
  db.prepare('DELETE FROM custom_field_defs WHERE id = ?').run(id);
}

export function getCustomFieldValues(entityType, entityId) {
  const db = getDb();
  return db.prepare('SELECT cfv.*, cfd.field_name, cfd.field_label, cfd.field_type FROM custom_field_values cfv JOIN custom_field_defs cfd ON cfv.field_id = cfd.id WHERE cfv.entity_type = ? AND cfv.entity_id = ?').all(entityType, entityId);
}

export function setCustomFieldValue(fieldId, entityType, entityId, value) {
  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO custom_field_values (field_id, entity_type, entity_id, value) VALUES (?, ?, ?, ?)').run(fieldId, entityType, entityId, value);
}

export function deleteCustomFieldValues(entityType, entityId) {
  const db = getDb();
  db.prepare('DELETE FROM custom_field_values WHERE entity_type = ? AND entity_id = ?').run(entityType, entityId);
}

// ---- Export Templates ----

export function getExportTemplates(entityType = null) {
  const db = getDb();
  if (entityType) return db.prepare('SELECT * FROM export_templates WHERE entity_type = ? ORDER BY name').all(entityType);
  return db.prepare('SELECT * FROM export_templates ORDER BY entity_type, name').all();
}

export function getExportTemplate(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM export_templates WHERE id = ?').get(id) || null;
}

export function addExportTemplate(t) {
  const db = getDb();
  const result = db.prepare('INSERT INTO export_templates (name, entity_type, format, columns, filters) VALUES (?, ?, ?, ?, ?)').run(
    t.name, t.entity_type, t.format || 'csv', JSON.stringify(t.columns), t.filters ? JSON.stringify(t.filters) : null);
  return Number(result.lastInsertRowid);
}

export function deleteExportTemplate(id) {
  const db = getDb();
  db.prepare('DELETE FROM export_templates WHERE id = ?').run(id);
}

// ---- Failure Detection ----

export function getFailureDetections(printerId = null, limit = 50) {
  const db = getDb();
  if (printerId) return db.prepare('SELECT * FROM failure_detections WHERE printer_id = ? ORDER BY detected_at DESC LIMIT ?').all(printerId, limit);
  return db.prepare('SELECT * FROM failure_detections ORDER BY detected_at DESC LIMIT ?').all(limit);
}

export function getFailureDetection(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM failure_detections WHERE id = ?').get(id) || null;
}

export function addFailureDetection(d) {
  const db = getDb();
  const result = db.prepare('INSERT INTO failure_detections (printer_id, print_history_id, detection_type, confidence, frame_path, action_taken, details) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    d.printer_id, d.print_history_id || null, d.detection_type, d.confidence || null, d.frame_path || null, d.action_taken || null, d.details ? JSON.stringify(d.details) : null);
  return Number(result.lastInsertRowid);
}

export function acknowledgeFailureDetection(id) {
  const db = getDb();
  db.prepare('UPDATE failure_detections SET acknowledged = 1 WHERE id = ?').run(id);
}

export function deleteFailureDetection(id) {
  const db = getDb();
  db.prepare('DELETE FROM failure_detections WHERE id = ?').run(id);
}

// ---- Price History ----

export function getPriceHistory(profileId, limit = 100) {
  const db = getDb();
  return db.prepare('SELECT * FROM price_history WHERE filament_profile_id = ? ORDER BY recorded_at DESC LIMIT ?').all(profileId, limit);
}

export function addPriceEntry(p) {
  const db = getDb();
  const result = db.prepare('INSERT INTO price_history (filament_profile_id, vendor_id, price, currency, source) VALUES (?, ?, ?, ?, ?)').run(
    p.filament_profile_id, p.vendor_id || null, p.price, p.currency || 'USD', p.source || 'manual');
  return Number(result.lastInsertRowid);
}

export function getLowestPrice(profileId) {
  const db = getDb();
  return db.prepare('SELECT MIN(price) as min_price, currency FROM price_history WHERE filament_profile_id = ?').get(profileId) || null;
}

export function getPriceStats(profileId) {
  const db = getDb();
  return db.prepare('SELECT MIN(price) as min_price, MAX(price) as max_price, AVG(price) as avg_price, COUNT(*) as entries FROM price_history WHERE filament_profile_id = ?').get(profileId) || null;
}

// ---- Price Alerts ----

export function getPriceAlerts() {
  const db = getDb();
  return db.prepare(`SELECT pa.*, fp.name AS profile_name, fp.material, fp.color_hex, v.name AS vendor_name,
    (SELECT MIN(ph.price) FROM price_history ph WHERE ph.filament_profile_id = pa.filament_profile_id) AS lowest_price,
    (SELECT ph.price FROM price_history ph WHERE ph.filament_profile_id = pa.filament_profile_id ORDER BY ph.recorded_at DESC LIMIT 1) AS latest_price
    FROM price_alerts pa
    LEFT JOIN filament_profiles fp ON pa.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    ORDER BY pa.created_at DESC`).all();
}

export function getPriceAlert(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM price_alerts WHERE id = ?').get(id) || null;
}

export function addPriceAlert(a) {
  const db = getDb();
  const result = db.prepare('INSERT INTO price_alerts (filament_profile_id, target_price, currency, source_url, notify) VALUES (?, ?, ?, ?, ?)').run(
    a.filament_profile_id, a.target_price, a.currency || 'USD', a.source_url || null, a.notify !== false ? 1 : 0);
  return Number(result.lastInsertRowid);
}

export function updatePriceAlert(id, fields) {
  const db = getDb();
  const allowed = ['target_price', 'currency', 'source_url', 'notify', 'triggered'];
  const sets = [];
  const vals = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) { sets.push(`${key} = ?`); vals.push(fields[key]); }
  }
  if (sets.length === 0) return;
  vals.push(id);
  db.prepare(`UPDATE price_alerts SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
}

export function deletePriceAlert(id) {
  const db = getDb();
  db.prepare('DELETE FROM price_alerts WHERE id = ?').run(id);
}

export function checkPriceAlerts() {
  const db = getDb();
  return db.prepare(`SELECT pa.*, fp.name AS profile_name, fp.material, v.name AS vendor_name,
    (SELECT ph.price FROM price_history ph WHERE ph.filament_profile_id = pa.filament_profile_id ORDER BY ph.recorded_at DESC LIMIT 1) AS latest_price
    FROM price_alerts pa
    LEFT JOIN filament_profiles fp ON pa.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE pa.notify = 1 AND pa.triggered = 0
    AND (SELECT ph.price FROM price_history ph WHERE ph.filament_profile_id = pa.filament_profile_id ORDER BY ph.recorded_at DESC LIMIT 1) <= pa.target_price`).all();
}

export function triggerPriceAlert(id) {
  const db = getDb();
  db.prepare("UPDATE price_alerts SET triggered = 1, triggered_at = datetime('now') WHERE id = ?").run(id);
}

// ---- Hardware Database ----

export function getHardwareItems(category) {
  const db = getDb();
  if (category) return db.prepare('SELECT * FROM hardware_items WHERE category = ? ORDER BY name').all(category);
  return db.prepare('SELECT * FROM hardware_items ORDER BY category, name').all();
}

export function getHardwareItem(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM hardware_items WHERE id = ?').get(id) || null;
}

export function addHardwareItem(h) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO hardware_items (category, name, brand, model, compatible_printers, specs, purchase_price, purchase_date, purchase_url, rating, notes, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    h.category, h.name, h.brand || null, h.model || null,
    JSON.stringify(h.compatible_printers || []), JSON.stringify(h.specs || {}),
    h.purchase_price || null, h.purchase_date || null, h.purchase_url || null,
    h.rating || null, h.notes || null, h.image_url || null
  );
  return Number(r.lastInsertRowid);
}

export function updateHardwareItem(id, h) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['category', 'name', 'brand', 'model', 'purchase_price', 'purchase_date', 'purchase_url', 'rating', 'notes', 'image_url']) {
    if (h[key] !== undefined) { fields.push(`${key} = ?`); values.push(h[key]); }
  }
  if (h.compatible_printers !== undefined) { fields.push('compatible_printers = ?'); values.push(JSON.stringify(h.compatible_printers)); }
  if (h.specs !== undefined) { fields.push('specs = ?'); values.push(JSON.stringify(h.specs)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE hardware_items SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteHardwareItem(id) {
  const db = getDb();
  db.prepare('DELETE FROM hardware_items WHERE id = ?').run(id);
}

export function assignHardware(hardwareId, printerId) {
  const db = getDb();
  db.prepare('INSERT INTO hardware_printer_assignments (hardware_id, printer_id) VALUES (?, ?)').run(hardwareId, printerId);
}

export function unassignHardware(hardwareId, printerId) {
  const db = getDb();
  db.prepare("UPDATE hardware_printer_assignments SET removed_at = datetime('now') WHERE hardware_id = ? AND printer_id = ? AND removed_at IS NULL").run(hardwareId, printerId);
}

export function getHardwareForPrinter(printerId) {
  const db = getDb();
  return db.prepare(`SELECT hi.*, hpa.installed_at FROM hardware_items hi
    JOIN hardware_printer_assignments hpa ON hi.id = hpa.hardware_id
    WHERE hpa.printer_id = ? AND hpa.removed_at IS NULL
    ORDER BY hi.category, hi.name`).all(printerId);
}

export function getHardwareAssignments(hardwareId) {
  const db = getDb();
  return db.prepare('SELECT * FROM hardware_printer_assignments WHERE hardware_id = ? ORDER BY installed_at DESC').all(hardwareId);
}

// ---- Material Reference ----

export function getMaterials() {
  const db = getDb();
  return db.prepare('SELECT * FROM material_reference ORDER BY category, material').all();
}

export function getMaterial(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM material_reference WHERE id = ?').get(id) || null;
}

export function getMaterialByName(name) {
  const db = getDb();
  return db.prepare('SELECT * FROM material_reference WHERE material = ? COLLATE NOCASE').get(name) || null;
}

export function updateMaterial(id, m) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['material', 'category', 'difficulty', 'strength', 'temp_resistance', 'moisture_sensitivity', 'flexibility', 'layer_adhesion', 'nozzle_temp_min', 'nozzle_temp_max', 'bed_temp_min', 'bed_temp_max', 'chamber_temp', 'enclosure', 'typical_density', 'tips', 'nozzle_recommendation', 'abrasive', 'food_safe', 'uv_resistant']) {
    if (m[key] !== undefined) { fields.push(`${key} = ?`); values.push(m[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE material_reference SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function addMaterial(m) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO material_reference (material, category, difficulty, strength, temp_resistance, moisture_sensitivity, flexibility, layer_adhesion, nozzle_temp_min, nozzle_temp_max, bed_temp_min, bed_temp_max, chamber_temp, enclosure, typical_density, tips, nozzle_recommendation, abrasive, food_safe, uv_resistant)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    m.material, m.category || 'standard', m.difficulty || 1, m.strength || 3, m.temp_resistance || 3,
    m.moisture_sensitivity || 3, m.flexibility || 1, m.layer_adhesion || 3,
    m.nozzle_temp_min || null, m.nozzle_temp_max || null, m.bed_temp_min || null, m.bed_temp_max || null,
    m.chamber_temp || null, m.enclosure || 0, m.typical_density || null,
    m.tips || null, m.nozzle_recommendation || null, m.abrasive || 0, m.food_safe || 0, m.uv_resistant || 0
  );
  return Number(r.lastInsertRowid);
}

// ---- Material Substitutions ----

export function getMaterialSubstitutions(material) {
  const db = getDb();
  if (material) {
    return db.prepare(`SELECT * FROM material_substitutions
      WHERE material = ? OR substitute_material = ?
      ORDER BY compatibility_pct DESC`).all(material, material);
  }
  return db.prepare('SELECT * FROM material_substitutions ORDER BY material, compatibility_pct DESC').all();
}

export function addMaterialSubstitution(sub) {
  const db = getDb();
  return db.prepare(`INSERT OR REPLACE INTO material_substitutions
    (material, substitute_material, compatibility_pct, notes, conditions)
    VALUES (?, ?, ?, ?, ?)`).run(
    sub.material, sub.substitute_material, sub.compatibility_pct || 80,
    sub.notes || null, sub.conditions || null);
}

export function deleteMaterialSubstitution(id) {
  const db = getDb();
  db.prepare('DELETE FROM material_substitutions WHERE id = ?').run(id);
}

export function findSubstitutesForMaterial(material) {
  const db = getDb();
  const subs = db.prepare(`SELECT ms.*, fp.name as available_profile, fp.color_hex,
    (SELECT COUNT(*) FROM spools s WHERE s.filament_profile_id = fp.id AND s.archived = 0 AND s.remaining_weight_g > 50) as available_spools,
    (SELECT SUM(s.remaining_weight_g) FROM spools s WHERE s.filament_profile_id = fp.id AND s.archived = 0) as available_weight_g
    FROM material_substitutions ms
    LEFT JOIN filament_profiles fp ON fp.material = ms.substitute_material
    WHERE ms.material = ?
    ORDER BY ms.compatibility_pct DESC`).all(material);
  return subs.filter(s => s.available_spools > 0);
}

// ---- RAL Colors ----

export function getRalColors() {
  const db = getDb();
  return db.prepare('SELECT * FROM ral_colors ORDER BY code').all();
}

// Private helper for RAL color matching
function _hexToLab(hex) {
  const h = hex.replace('#', '').substring(0, 6);
  let r = parseInt(h.substring(0, 2), 16) / 255;
  let g = parseInt(h.substring(2, 4), 16) / 255;
  let b = parseInt(h.substring(4, 6), 16) / 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
  return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

export function findClosestRal(hexColor) {
  const db = getDb();
  if (!hexColor) return null;
  const target = _hexToLab(hexColor);
  const rals = db.prepare('SELECT * FROM ral_colors').all();
  let best = null;
  let bestDist = Infinity;
  for (const ral of rals) {
    const lab = _hexToLab(ral.hex);
    const dist = Math.sqrt(
      Math.pow(target.l - lab.l, 2) +
      Math.pow(target.a - lab.a, 2) +
      Math.pow(target.b - lab.b, 2)
    );
    if (dist < bestDist) {
      bestDist = dist;
      best = { ...ral, delta_e: Math.round(dist * 10) / 10 };
    }
  }
  return best;
}

// ---- Storage Alerts ----

export function getStorageAlerts() {
  const db = getDb();
  const alerts = [];
  const locations = db.prepare(`SELECT * FROM locations
    WHERE humidity_min IS NOT NULL OR humidity_max IS NOT NULL
      OR temp_min IS NOT NULL OR temp_max IS NOT NULL`).all();
  for (const loc of locations) {
    const conditions = db.prepare(`SELECT sc.*, s.id as spool_id, fp.name as profile_name, fp.material
      FROM storage_conditions sc
      JOIN spools s ON sc.spool_id = s.id
      LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
      WHERE (s.location = ? OR s.location_id = ?)
        AND sc.recorded_at >= datetime('now', '-24 hours')
      ORDER BY sc.recorded_at DESC`).all(loc.name, loc.id);
    for (const c of conditions) {
      if (loc.humidity_min != null && c.humidity != null && c.humidity < loc.humidity_min) {
        alerts.push({ type: 'humidity_low', location: loc.name, spool_id: c.spool_id, profile: c.profile_name, material: c.material, value: c.humidity, threshold: loc.humidity_min });
      }
      if (loc.humidity_max != null && c.humidity != null && c.humidity > loc.humidity_max) {
        alerts.push({ type: 'humidity_high', location: loc.name, spool_id: c.spool_id, profile: c.profile_name, material: c.material, value: c.humidity, threshold: loc.humidity_max });
      }
      if (loc.temp_min != null && c.temperature != null && c.temperature < loc.temp_min) {
        alerts.push({ type: 'temp_low', location: loc.name, spool_id: c.spool_id, profile: c.profile_name, material: c.material, value: c.temperature, threshold: loc.temp_min });
      }
      if (loc.temp_max != null && c.temperature != null && c.temperature > loc.temp_max) {
        alerts.push({ type: 'temp_high', location: loc.name, spool_id: c.spool_id, profile: c.profile_name, material: c.material, value: c.temperature, threshold: loc.temp_max });
      }
    }
  }
  return alerts;
}

// ---- Print Profiles ----

export function getProfiles() {
  const db = getDb();
  return db.prepare('SELECT * FROM print_profiles ORDER BY use_count DESC, name ASC').all();
}

export function getProfileById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM print_profiles WHERE id = ?').get(id);
}

export function addProfile(p) {
  const db = getDb();
  return db.prepare(
    `INSERT INTO print_profiles (name, description, filament_type, filament_brand, printer_model, nozzle_diameter, nozzle_type, bed_temp, nozzle_temp, speed_level, fan_speed, layer_height, infill_percent, wall_count, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(p.name, p.description || '', p.filament_type || null, p.filament_brand || null, p.printer_model || null, p.nozzle_diameter || 0.4, p.nozzle_type || 'stainless_steel', p.bed_temp || null, p.nozzle_temp || null, p.speed_level || 2, p.fan_speed || null, p.layer_height || null, p.infill_percent || null, p.wall_count || null, p.notes || '');
}

export function updateProfile(id, p) {
  const db = getDb();
  return db.prepare(
    `UPDATE print_profiles SET name=?, description=?, filament_type=?, filament_brand=?, printer_model=?, nozzle_diameter=?, nozzle_type=?, bed_temp=?, nozzle_temp=?, speed_level=?, fan_speed=?, layer_height=?, infill_percent=?, wall_count=?, notes=?, updated_at=datetime('now') WHERE id=?`
  ).run(p.name, p.description || '', p.filament_type || null, p.filament_brand || null, p.printer_model || null, p.nozzle_diameter || 0.4, p.nozzle_type || 'stainless_steel', p.bed_temp || null, p.nozzle_temp || null, p.speed_level || 2, p.fan_speed || null, p.layer_height || null, p.infill_percent || null, p.wall_count || null, p.notes || '', id);
}

export function deleteProfile(id) {
  const db = getDb();
  return db.prepare('DELETE FROM print_profiles WHERE id = ?').run(id);
}

export function incrementProfileUse(id) {
  const db = getDb();
  return db.prepare('UPDATE print_profiles SET use_count = use_count + 1, last_used_at = datetime(\'now\') WHERE id = ?').run(id);
}

// ---- Screenshots ----

export function getScreenshots(printerId = null, limit = 50, offset = 0) {
  const db = getDb();
  if (printerId) {
    return db.prepare('SELECT id, printer_id, filename, print_file, notes, captured_at FROM screenshots WHERE printer_id = ? ORDER BY captured_at DESC LIMIT ? OFFSET ?').all(printerId, limit, offset);
  }
  return db.prepare('SELECT id, printer_id, filename, print_file, notes, captured_at FROM screenshots ORDER BY captured_at DESC LIMIT ? OFFSET ?').all(limit, offset);
}

export function getScreenshotById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM screenshots WHERE id = ?').get(id);
}

export function addScreenshot(data) {
  const db = getDb();
  return db.prepare('INSERT INTO screenshots (printer_id, filename, data, print_file, thumbnail_data, notes) VALUES (?, ?, ?, ?, ?, ?)').run(data.printer_id || null, data.filename, data.data, data.print_file || null, data.thumbnail_data || null, data.notes || '');
}

export function deleteScreenshot(id) {
  const db = getDb();
  return db.prepare('DELETE FROM screenshots WHERE id = ?').run(id);
}

export function deleteScreenshotsBulk(ids) {
  const db = getDb();
  const placeholders = ids.map(() => '?').join(',');
  return db.prepare(`DELETE FROM screenshots WHERE id IN (${placeholders})`).run(...ids);
}

export function linkScreenshotToPrint(screenshotId, printHistoryId) {
  const db = getDb();
  db.prepare('UPDATE screenshots SET print_history_id = ? WHERE id = ?').run(printHistoryId, screenshotId);
}

export function getScreenshotsForPrint(printHistoryId) {
  const db = getDb();
  return db.prepare('SELECT id, printer_id, filename, print_file, thumbnail_data, notes, captured_at FROM screenshots WHERE print_history_id = ? ORDER BY captured_at DESC')
    .all(printHistoryId);
}

// ---- Knowledge Base ----

export function getKbPrinters() {
  const db = getDb();
  return db.prepare('SELECT * FROM kb_printers ORDER BY release_year DESC, model').all();
}

export function getKbPrinter(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM kb_printers WHERE id = ?').get(id);
}

export function addKbPrinter(p) {
  const db = getDb();
  const r = db.prepare('INSERT INTO kb_printers (model,full_name,image_url,release_year,build_volume,max_speed,nozzle_type,nozzle_diameter_default,supported_nozzle_sizes,has_ams,has_enclosure,has_lidar,has_camera,has_aux_fan,heated_bed_max,nozzle_temp_max,supported_filaments,connectivity,weight_kg,price_usd,pros,cons,tips,specs_json,wiki_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
    p.model,p.full_name,p.image_url||null,p.release_year||null,p.build_volume||null,p.max_speed||null,p.nozzle_type||'proprietary',p.nozzle_diameter_default||0.4,p.supported_nozzle_sizes||'[0.2,0.4,0.6,0.8]',p.has_ams?1:0,p.has_enclosure?1:0,p.has_lidar?1:0,p.has_camera?1:0,p.has_aux_fan?1:0,p.heated_bed_max||null,p.nozzle_temp_max||null,p.supported_filaments||'[]',p.connectivity||'["wifi"]',p.weight_kg||null,p.price_usd||null,p.pros||'[]',p.cons||'[]',p.tips||null,p.specs_json||'{}',p.wiki_url||null
  );
  return Number(r.lastInsertRowid);
}

export function updateKbPrinter(id, p) {
  const db = getDb();
  const fields = []; const vals = [];
  for (const k of ['model','full_name','image_url','release_year','build_volume','max_speed','nozzle_type','nozzle_diameter_default','supported_nozzle_sizes','has_ams','has_enclosure','has_lidar','has_camera','has_aux_fan','heated_bed_max','nozzle_temp_max','supported_filaments','connectivity','weight_kg','price_usd','pros','cons','tips','specs_json','wiki_url']) {
    if (p[k] !== undefined) { fields.push(`${k} = ?`); vals.push(p[k]); }
  }
  if (!fields.length) return;
  fields.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(`UPDATE kb_printers SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
}

export function deleteKbPrinter(id) {
  const db = getDb();
  db.prepare('DELETE FROM kb_printers WHERE id = ?').run(id);
  db.prepare("DELETE FROM kb_tags WHERE entity_type = 'printer' AND entity_id = ?").run(id);
}

export function getKbAccessories(category) {
  const db = getDb();
  if (category) return db.prepare('SELECT * FROM kb_accessories WHERE category = ? ORDER BY name').all(category);
  return db.prepare('SELECT * FROM kb_accessories ORDER BY category, name').all();
}

export function getKbAccessory(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM kb_accessories WHERE id = ?').get(id);
}

export function addKbAccessory(a) {
  const db = getDb();
  const r = db.prepare('INSERT INTO kb_accessories (name,category,brand,model,image_url,compatible_printers,description,price_usd,purchase_url,tips,specs_json,rating) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(
    a.name,a.category||'other',a.brand||'Bambu Lab',a.model||null,a.image_url||null,a.compatible_printers||'[]',a.description||null,a.price_usd||null,a.purchase_url||null,a.tips||null,a.specs_json||'{}',a.rating||null
  );
  return Number(r.lastInsertRowid);
}

export function updateKbAccessory(id, a) {
  const db = getDb();
  const fields = []; const vals = [];
  for (const k of ['name','category','brand','model','image_url','compatible_printers','description','price_usd','purchase_url','tips','specs_json','rating']) {
    if (a[k] !== undefined) { fields.push(`${k} = ?`); vals.push(a[k]); }
  }
  if (!fields.length) return;
  fields.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(`UPDATE kb_accessories SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
}

export function deleteKbAccessory(id) {
  const db = getDb();
  db.prepare('DELETE FROM kb_accessories WHERE id = ?').run(id);
  db.prepare("DELETE FROM kb_tags WHERE entity_type = 'accessory' AND entity_id = ?").run(id);
}

export function getKbFilaments(material, brand) {
  const db = getDb();
  let sql = 'SELECT * FROM kb_filaments'; const params = []; const where = [];
  if (material) { where.push('material = ?'); params.push(material); }
  if (brand) { where.push('brand = ?'); params.push(brand); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY material, brand, variant';
  return db.prepare(sql).all(...params);
}

export function getKbFilament(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM kb_filaments WHERE id = ?').get(id);
}

export function addKbFilament(f) {
  const db = getDb();
  const r = db.prepare('INSERT INTO kb_filaments (material,brand,variant,category,difficulty,nozzle_temp_min,nozzle_temp_max,bed_temp_min,bed_temp_max,chamber_temp,fan_speed_min,fan_speed_max,enclosure_required,nozzle_recommendation,abrasive,moisture_sensitivity,strength,flexibility,heat_resistance,layer_adhesion,food_safe,uv_resistant,tips_print,tips_storage,tips_post,compatible_printers,profile_json,wiki_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
    f.material,f.brand||null,f.variant||null,f.category||'standard',f.difficulty||1,f.nozzle_temp_min||null,f.nozzle_temp_max||null,f.bed_temp_min||null,f.bed_temp_max||null,f.chamber_temp||null,f.fan_speed_min||null,f.fan_speed_max||null,f.enclosure_required?1:0,f.nozzle_recommendation||'brass',f.abrasive?1:0,f.moisture_sensitivity||3,f.strength||3,f.flexibility||1,f.heat_resistance||3,f.layer_adhesion||3,f.food_safe?1:0,f.uv_resistant?1:0,f.tips_print||null,f.tips_storage||null,f.tips_post||null,f.compatible_printers||'[]',f.profile_json||null,f.wiki_url||null
  );
  return Number(r.lastInsertRowid);
}

export function updateKbFilament(id, f) {
  const db = getDb();
  const fields = []; const vals = [];
  for (const k of ['material','brand','variant','category','difficulty','nozzle_temp_min','nozzle_temp_max','bed_temp_min','bed_temp_max','chamber_temp','fan_speed_min','fan_speed_max','enclosure_required','nozzle_recommendation','abrasive','moisture_sensitivity','strength','flexibility','heat_resistance','layer_adhesion','food_safe','uv_resistant','tips_print','tips_storage','tips_post','compatible_printers','profile_json','wiki_url']) {
    if (f[k] !== undefined) { fields.push(`${k} = ?`); vals.push(f[k]); }
  }
  if (!fields.length) return;
  fields.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(`UPDATE kb_filaments SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
}

export function deleteKbFilament(id) {
  const db = getDb();
  db.prepare('DELETE FROM kb_filaments WHERE id = ?').run(id);
  db.prepare("DELETE FROM kb_tags WHERE entity_type = 'filament' AND entity_id = ?").run(id);
}

export function getKbProfiles(printer, material) {
  const db = getDb();
  let sql = 'SELECT * FROM kb_profiles'; const params = []; const where = [];
  if (printer) { where.push('printer_model = ?'); params.push(printer); }
  if (material) { where.push('filament_material = ?'); params.push(material); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY printer_model, filament_material, name';
  return db.prepare(sql).all(...params);
}

export function getKbProfile(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM kb_profiles WHERE id = ?').get(id);
}

export function addKbProfile(p) {
  const db = getDb();
  const r = db.prepare('INSERT INTO kb_profiles (name,printer_model,filament_material,filament_brand,nozzle_size,layer_height,print_speed,infill_pct,wall_count,top_layers,bottom_layers,retraction_distance,retraction_speed,description,tips,settings_json,source_url,author,difficulty) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
    p.name,p.printer_model||null,p.filament_material||null,p.filament_brand||null,p.nozzle_size||0.4,p.layer_height||null,p.print_speed||null,p.infill_pct||null,p.wall_count||null,p.top_layers||null,p.bottom_layers||null,p.retraction_distance||null,p.retraction_speed||null,p.description||null,p.tips||null,p.settings_json||'{}',p.source_url||null,p.author||null,p.difficulty||1
  );
  return Number(r.lastInsertRowid);
}

export function updateKbProfile(id, p) {
  const db = getDb();
  const fields = []; const vals = [];
  for (const k of ['name','printer_model','filament_material','filament_brand','nozzle_size','layer_height','print_speed','infill_pct','wall_count','top_layers','bottom_layers','retraction_distance','retraction_speed','description','tips','settings_json','source_url','author','difficulty']) {
    if (p[k] !== undefined) { fields.push(`${k} = ?`); vals.push(p[k]); }
  }
  if (!fields.length) return;
  fields.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(`UPDATE kb_profiles SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
}

export function deleteKbProfile(id) {
  const db = getDb();
  db.prepare('DELETE FROM kb_profiles WHERE id = ?').run(id);
  db.prepare("DELETE FROM kb_tags WHERE entity_type = 'profile' AND entity_id = ?").run(id);
}

export function searchKb(query) {
  const db = getDb();
  const q = `%${query}%`;
  const printers = db.prepare("SELECT id, model AS title, full_name AS subtitle, 'printer' AS type FROM kb_printers WHERE model LIKE ? OR full_name LIKE ? OR tips LIKE ?").all(q,q,q);
  const accessories = db.prepare("SELECT id, name AS title, category AS subtitle, 'accessory' AS type FROM kb_accessories WHERE name LIKE ? OR description LIKE ? OR tips LIKE ?").all(q,q,q);
  const filaments = db.prepare("SELECT id, (brand || ' ' || material || COALESCE(' ' || variant, '')) AS title, category AS subtitle, 'filament' AS type FROM kb_filaments WHERE material LIKE ? OR brand LIKE ? OR variant LIKE ? OR tips_print LIKE ?").all(q,q,q,q);
  const profiles = db.prepare("SELECT id, name AS title, (printer_model || ' / ' || filament_material) AS subtitle, 'profile' AS type FROM kb_profiles WHERE name LIKE ? OR description LIKE ? OR tips LIKE ? OR printer_model LIKE ? OR filament_material LIKE ?").all(q,q,q,q,q);
  return [...printers, ...accessories, ...filaments, ...profiles];
}

export function getKbStats() {
  const db = getDb();
  return {
    printers: db.prepare('SELECT COUNT(*) as count FROM kb_printers').get().count,
    accessories: db.prepare('SELECT COUNT(*) as count FROM kb_accessories').get().count,
    filaments: db.prepare('SELECT COUNT(*) as count FROM kb_filaments').get().count,
    profiles: db.prepare('SELECT COUNT(*) as count FROM kb_profiles').get().count
  };
}

export function getKbTags(entityType, entityId) {
  const db = getDb();
  return db.prepare('SELECT * FROM kb_tags WHERE entity_type = ? AND entity_id = ?').all(entityType, entityId);
}

export function addKbTag(entityType, entityId, tag) {
  const db = getDb();
  const r = db.prepare('INSERT OR IGNORE INTO kb_tags (entity_type, entity_id, tag) VALUES (?, ?, ?)').run(entityType, entityId, tag);
  return Number(r.lastInsertRowid);
}

export function deleteKbTag(id) {
  const db = getDb();
  db.prepare('DELETE FROM kb_tags WHERE id = ?').run(id);
}

// ---- Courses ----

export function getCourses(category = null) {
  const db = getDb();
  if (category) return db.prepare('SELECT * FROM courses WHERE category = ? ORDER BY difficulty, title').all(category);
  return db.prepare('SELECT * FROM courses ORDER BY category, difficulty, title').all();
}

export function getCourse(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM courses WHERE id = ?').get(id) || null;
}

export function addCourse(c) {
  const db = getDb();
  const result = db.prepare('INSERT INTO courses (title, description, category, difficulty, content, steps, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    c.title, c.description || null, c.category || 'general', c.difficulty || 1, c.content || null, c.steps ? JSON.stringify(c.steps) : null, c.estimated_minutes || null);
  return Number(result.lastInsertRowid);
}

export function updateCourse(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of ['title', 'description', 'category', 'difficulty', 'content', 'estimated_minutes']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (updates.steps !== undefined) { fields.push('steps = ?'); values.push(JSON.stringify(updates.steps)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE courses SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCourse(id) {
  const db = getDb();
  db.prepare('DELETE FROM course_progress WHERE course_id = ?').run(id);
  db.prepare('DELETE FROM courses WHERE id = ?').run(id);
}

export function getCourseProgress(courseId, userId) {
  const db = getDb();
  return db.prepare('SELECT * FROM course_progress WHERE course_id = ? AND user_id = ?').get(courseId, userId) || null;
}

export function upsertCourseProgress(courseId, userId, updates) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM course_progress WHERE course_id = ? AND user_id = ?').get(courseId, userId);
  if (existing) {
    const fields = [];
    const values = [];
    for (const key of ['status', 'current_step', 'completed_at', 'completed_steps']) {
      if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
    }
    if (fields.length === 0) return;
    values.push(existing.id);
    db.prepare(`UPDATE course_progress SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  } else {
    db.prepare('INSERT INTO course_progress (course_id, user_id, status, current_step, completed_steps) VALUES (?, ?, ?, ?, ?)').run(
      courseId, userId, updates.status || 'in_progress', updates.current_step || 0, updates.completed_steps || '[]');
  }
}

export function getUserCourseProgress(userId) {
  const db = getDb();
  return db.prepare('SELECT cp.*, c.title, c.category, c.difficulty FROM course_progress cp JOIN courses c ON cp.course_id = c.id WHERE cp.user_id = ? ORDER BY cp.started_at DESC').all(userId);
}

export function getAllCoursesWithProgress(userId) {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, cp.status AS progress_status, cp.current_step, cp.completed_steps,
           cp.completed_at, cp.started_at AS progress_started_at
    FROM courses c
    LEFT JOIN course_progress cp ON cp.course_id = c.id AND cp.user_id = ?
    ORDER BY c.category, c.difficulty, c.title
  `).all(userId);
}

// ---- Bed Mesh Data ----

export function addBedMesh(printerId, meshData, stats) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO bed_mesh_data (printer_id, mesh_data, mesh_rows, mesh_cols, z_min, z_max, z_mean, z_std_dev, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    printerId, JSON.stringify(meshData), stats.rows, stats.cols, stats.zMin, stats.zMax, stats.zMean, stats.zStdDev, stats.source || 'auto'
  );
  return Number(r.lastInsertRowid);
}

export function getBedMeshHistory(printerId, limit = 10) {
  const db = getDb();
  return db.prepare('SELECT * FROM bed_mesh_data WHERE printer_id = ? ORDER BY captured_at DESC LIMIT ?').all(printerId, limit);
}

export function getLatestBedMesh(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM bed_mesh_data WHERE printer_id = ? ORDER BY captured_at DESC LIMIT 1').get(printerId) || null;
}

export function deleteBedMesh(id) {
  const db = getDb();
  db.prepare('DELETE FROM bed_mesh_data WHERE id = ?').run(id);
}

// ---- Layer Pauses ----

export function addLayerPause(printerId, layerNumbers, reason) {
  const db = getDb();
  const r = db.prepare('INSERT INTO layer_pauses (printer_id, layer_numbers, reason) VALUES (?, ?, ?)').run(printerId, JSON.stringify(layerNumbers), reason || null);
  return Number(r.lastInsertRowid);
}

export function getLayerPauses(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM layer_pauses WHERE printer_id = ? ORDER BY created_at DESC').all(printerId);
}

export function getActiveLayerPauses(printerId) {
  const db = getDb();
  return db.prepare('SELECT * FROM layer_pauses WHERE printer_id = ? AND active = 1').all(printerId);
}

export function deleteLayerPause(id) {
  const db = getDb();
  db.prepare('DELETE FROM layer_pauses WHERE id = ?').run(id);
}

export function deactivateLayerPauses(printerId) {
  const db = getDb();
  db.prepare('UPDATE layer_pauses SET active = 0 WHERE printer_id = ?').run(printerId);
}

export function markLayerTriggered(id, layerNum) {
  const db = getDb();
  const row = db.prepare('SELECT triggered_layers FROM layer_pauses WHERE id = ?').get(id);
  if (!row) return;
  const triggered = JSON.parse(row.triggered_layers || '[]');
  if (!triggered.includes(layerNum)) {
    triggered.push(layerNum);
    db.prepare('UPDATE layer_pauses SET triggered_layers = ? WHERE id = ?').run(JSON.stringify(triggered), id);
  }
}

// ---- Filament Changes ----

export function createFilamentChange(printerId, fromSpoolId, toSpoolId, amsUnit, amsTray) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO filament_changes (printer_id, from_spool_id, to_spool_id, ams_unit, ams_tray, status, current_step)
    VALUES (?, ?, ?, ?, ?, 'in_progress', 'pause')`).run(printerId, fromSpoolId || null, toSpoolId || null, amsUnit ?? null, amsTray ?? null);
  return Number(r.lastInsertRowid);
}

export function updateFilamentChange(id, opts) {
  const db = getDb();
  const fields = []; const values = [];
  for (const key of ['status', 'current_step', 'error_message', 'completed_at']) {
    if (opts[key] !== undefined) { fields.push(`${key} = ?`); values.push(opts[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE filament_changes SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function getActiveFilamentChange(printerId) {
  const db = getDb();
  return db.prepare("SELECT * FROM filament_changes WHERE printer_id = ? AND status = 'in_progress' ORDER BY started_at DESC LIMIT 1").get(printerId) || null;
}

export function getFilamentChangeHistory(printerId, limit = 20) {
  const db = getDb();
  return db.prepare('SELECT * FROM filament_changes WHERE printer_id = ? ORDER BY started_at DESC LIMIT ?').all(printerId, limit);
}

// ---- Widget Layouts ----

export function getWidgetLayouts() {
  const db = getDb();
  return db.prepare('SELECT * FROM widget_layouts ORDER BY is_active DESC, updated_at DESC').all();
}

export function getActiveWidgetLayout() {
  const db = getDb();
  return db.prepare('SELECT * FROM widget_layouts WHERE is_active = 1 LIMIT 1').get() || null;
}

export function saveWidgetLayout(name, layout) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM widget_layouts WHERE name = ?').get(name);
  if (existing) {
    db.prepare('UPDATE widget_layouts SET layout = ?, updated_at = datetime(\'now\') WHERE id = ?').run(JSON.stringify(layout), existing.id);
    return existing.id;
  }
  const r = db.prepare('INSERT INTO widget_layouts (name, layout, is_active) VALUES (?, ?, 0)').run(name, JSON.stringify(layout));
  return Number(r.lastInsertRowid);
}

export function setActiveWidgetLayout(id) {
  const db = getDb();
  db.prepare('UPDATE widget_layouts SET is_active = 0').run();
  db.prepare('UPDATE widget_layouts SET is_active = 1 WHERE id = ?').run(id);
}

export function deleteWidgetLayout(id) {
  const db = getDb();
  db.prepare('DELETE FROM widget_layouts WHERE id = ?').run(id);
}

// ---- Plugins ----

export function getPlugins() {
  const db = getDb();
  return db.prepare('SELECT * FROM plugins ORDER BY name ASC').all();
}

export function getPlugin(name) {
  const db = getDb();
  return db.prepare('SELECT * FROM plugins WHERE name = ?').get(name) || null;
}

export function getPluginById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM plugins WHERE id = ?').get(id) || null;
}

export function registerPlugin(data) {
  const db = getDb();
  const r = db.prepare(`INSERT INTO plugins (name, version, description, author, entry_point, hooks, settings_schema, panels, enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET version = excluded.version, description = excluded.description,
      author = excluded.author, entry_point = excluded.entry_point, hooks = excluded.hooks,
      settings_schema = excluded.settings_schema, panels = excluded.panels`).run(
    data.name, data.version || '0.0.1', data.description || '', data.author || '',
    data.entry_point || 'index.js', data.hooks || '[]', data.settings_schema || '{}',
    data.panels || '[]', data.enabled !== undefined ? data.enabled : 1
  );
  return Number(r.lastInsertRowid);
}

export function updatePluginEnabled(name, enabled) {
  const db = getDb();
  db.prepare('UPDATE plugins SET enabled = ? WHERE name = ?').run(enabled ? 1 : 0, name);
}

export function removePlugin(name) {
  const db = getDb();
  const p = db.prepare('SELECT id FROM plugins WHERE name = ?').get(name);
  if (p) {
    db.prepare('DELETE FROM plugin_state WHERE plugin_id = ?').run(p.id);
  }
  db.prepare('DELETE FROM plugins WHERE name = ?').run(name);
}

export function getPluginState(pluginId, key) {
  const db = getDb();
  return db.prepare('SELECT value FROM plugin_state WHERE plugin_id = ? AND key = ?').get(pluginId, key) || null;
}

export function setPluginState(pluginId, key, value) {
  const db = getDb();
  db.prepare('INSERT INTO plugin_state (plugin_id, key, value) VALUES (?, ?, ?) ON CONFLICT(plugin_id, key) DO UPDATE SET value = excluded.value').run(pluginId, key, value);
}

export function getPluginSettings(pluginId) {
  const db = getDb();
  const row = db.prepare("SELECT value FROM plugin_state WHERE plugin_id = ? AND key = '_settings'").get(pluginId);
  if (!row) return {};
  try { return JSON.parse(row.value); } catch { return {}; }
}

export function setPluginSettings(pluginId, settings) {
  const db = getDb();
  const val = typeof settings === 'string' ? settings : JSON.stringify(settings);
  db.prepare("INSERT INTO plugin_state (plugin_id, key, value) VALUES (?, '_settings', ?) ON CONFLICT(plugin_id, key) DO UPDATE SET value = excluded.value").run(pluginId, val);
}

// ---- Spoolman-style per-spool metrics ----

export function getSpoolmanPerSpoolMetrics() {
  const db = getDb();
  return db.prepare(`SELECT s.id, s.remaining_weight_g, s.used_weight_g, s.initial_weight_g, s.cost,
    fp.name as filament_name, fp.material, fp.density, fp.diameter, fp.color_hex,
    v.name as vendor_name
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.archived = 0`).all();
}

// ---- Expired/Expiring Spools ----

export function getExpiredSpools() {
  const db = getDb();
  return db.prepare(`SELECT s.*, fp.name as profile_name, fp.material, v.name as vendor_name
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.expiry_date IS NOT NULL AND s.expiry_date != '' AND s.expiry_date < datetime('now')
      AND s.archived = 0
    ORDER BY s.expiry_date ASC`).all();
}

export function getExpiringSpools(daysAhead = 30) {
  const db = getDb();
  return db.prepare(`SELECT s.*, fp.name as profile_name, fp.material, v.name as vendor_name,
    ROUND(julianday(s.expiry_date) - julianday('now')) as days_until_expiry
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.expiry_date IS NOT NULL AND s.expiry_date != ''
      AND s.expiry_date >= datetime('now')
      AND s.expiry_date <= datetime('now', '+' || ? || ' days')
      AND s.archived = 0
    ORDER BY s.expiry_date ASC`).all(daysAhead);
}

// ---- Auto-Generated Spool Names ----

export function generateSpoolName(profileId) {
  const db = getDb();
  const profile = db.prepare('SELECT fp.*, v.name as vendor_name FROM filament_profiles fp LEFT JOIN vendors v ON fp.vendor_id = v.id WHERE fp.id = ?').get(profileId);
  if (!profile) return 'Spool';
  const count = db.prepare('SELECT COUNT(*) as cnt FROM spools WHERE filament_profile_id = ?').get(profileId).cnt;
  const vendor = profile.vendor_name || 'Unknown';
  const material = profile.material || 'PLA';
  const name = profile.name || '';
  return `${vendor} ${material}${name ? ' ' + name : ''} #${count + 1}`;
}

// ---- Search (spools by color) ----

export function searchSpoolsByColor(hex, tolerance = 30) {
  const db = getDb();
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const all = db.prepare("SELECT s.*, fp.name as profile_name, fp.material, v.name as vendor_name FROM spools s LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id LEFT JOIN vendors v ON fp.vendor_id = v.id WHERE s.color_hex IS NOT NULL AND s.color_hex != ''").all();
  return all.filter(s => {
    const ch = s.color_hex.replace('#', '');
    if (ch.length < 6) return false;
    const sr = parseInt(ch.substring(0, 2), 16);
    const sg = parseInt(ch.substring(2, 4), 16);
    const sb = parseInt(ch.substring(4, 6), 16);
    return Math.sqrt((r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2) <= tolerance;
  }).map(s => {
    const ch = s.color_hex.replace('#', '');
    const sr = parseInt(ch.substring(0, 2), 16);
    const sg = parseInt(ch.substring(2, 4), 16);
    const sb = parseInt(ch.substring(4, 6), 16);
    return { ...s, color_distance: Math.sqrt((r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2) };
  }).sort((a, b) => a.color_distance - b.color_distance);
}
