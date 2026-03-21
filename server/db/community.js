import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:community');

const CF_COLUMNS = ['manufacturer', 'name', 'material', 'density', 'diameter', 'weight', 'spool_weight', 'extruder_temp', 'bed_temp', 'color_name', 'color_hex', 'td_value', 'shore_hardness', 'source', 'pressure_advance_k', 'max_volumetric_speed', 'flow_ratio', 'retraction_distance', 'retraction_speed', 'fan_speed_min', 'fan_speed_max', 'chamber_temp', 'material_type', 'category', 'difficulty', 'image_url', 'purchase_url', 'price', 'price_currency', 'brand_key', 'external_source_id', 'total_td_votes', 'tips', 'updated_at', 'finish', 'pattern', 'translucent', 'glow', 'multi_color_direction', 'spool_type', 'extruder_temp_min', 'extruder_temp_max', 'bed_temp_min', 'bed_temp_max', 'color_hexes'];

// ---- Community Filaments ----

export function getCommunityFilaments(filters = {}) {
  const db = getDb();
  let where = 'WHERE 1=1';
  const params = [];
  if (filters.manufacturer) { where += ' AND manufacturer = ?'; params.push(filters.manufacturer); }
  if (filters.material) { where += ' AND material = ?'; params.push(filters.material); }
  if (filters.material_type) { where += ' AND material_type = ?'; params.push(filters.material_type); }
  if (filters.category) { where += ' AND category = ?'; params.push(filters.category); }
  if (filters.color_hex) { where += ' AND color_hex = ?'; params.push(filters.color_hex.replace('#', '')); }
  if (filters.has_k_value) { where += ' AND pressure_advance_k IS NOT NULL'; }
  if (filters.has_td) { where += ' AND td_value IS NOT NULL AND td_value > 0'; }
  if (filters.translucent) { where += ' AND translucent = 1'; }
  if (filters.glow) { where += ' AND glow = 1'; }
  if (filters.multi_color) { where += ' AND multi_color_direction IS NOT NULL'; }
  if (filters.temp_min) { where += ' AND extruder_temp >= ?'; params.push(filters.temp_min); }
  if (filters.temp_max) { where += ' AND extruder_temp <= ?'; params.push(filters.temp_max); }
  if (filters.search) { where += ' AND (name LIKE ? OR manufacturer LIKE ? OR color_name LIKE ? OR material LIKE ?)'; params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`); }

  const allowedSort = ['manufacturer', 'name', 'material', 'extruder_temp', 'pressure_advance_k', 'td_value', 'price', 'category', 'rating_avg', 'created_at'];
  let sort = allowedSort.includes(filters.sort) ? filters.sort : 'manufacturer';
  let dir = filters.sort_dir === 'DESC' ? 'DESC' : 'ASC';
  if (filters.sort === 'rating') { sort = 'rating_count'; dir = 'DESC'; where += ' AND rating_count > 0'; }
  if (filters.sort === 'newest') { sort = 'created_at'; dir = 'DESC'; }
  const order = `ORDER BY ${sort} ${dir}, manufacturer ASC, name ASC`;

  if (filters.limit) {
    const total = db.prepare(`SELECT COUNT(*) as c FROM community_filaments ${where}`).get(...params).c;
    const countParams = [...params];
    params.push(filters.limit);
    if (filters.offset) params.push(filters.offset);
    const rows = db.prepare(`SELECT * FROM community_filaments ${where} ${order} LIMIT ?${filters.offset ? ' OFFSET ?' : ''}`).all(...params);
    return { rows, total };
  }
  return db.prepare(`SELECT * FROM community_filaments ${where} ${order}`).all(...params);
}

export function getCommunityFilament(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM community_filaments WHERE id = ?').get(id) || null;
}

export function searchCommunityByColor(hex, tolerance = 30) {
  const db = getDb();
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const all = db.prepare("SELECT * FROM community_filaments WHERE color_hex IS NOT NULL AND color_hex != ''").all();
  return all.filter(f => {
    const fr = parseInt(f.color_hex.substring(0, 2), 16);
    const fg = parseInt(f.color_hex.substring(2, 4), 16);
    const fb = parseInt(f.color_hex.substring(4, 6), 16);
    const dist = Math.sqrt((r - fr) ** 2 + (g - fg) ** 2 + (b - fb) ** 2);
    return dist <= tolerance;
  }).map(f => ({ ...f, distance: Math.sqrt((r - parseInt(f.color_hex.substring(0, 2), 16)) ** 2 + (g - parseInt(f.color_hex.substring(2, 4), 16)) ** 2 + (b - parseInt(f.color_hex.substring(4, 6), 16)) ** 2) }))
    .sort((a, b) => a.distance - b.distance);
}

export function getCommunityManufacturers() {
  const db = getDb();
  return db.prepare('SELECT DISTINCT manufacturer FROM community_filaments ORDER BY manufacturer').all().map(r => r.manufacturer);
}

export function getCommunityMaterials() {
  const db = getDb();
  return db.prepare('SELECT DISTINCT material FROM community_filaments ORDER BY material').all().map(r => r.material);
}

export function addCommunityFilament(f) {
  const db = getDb();
  const cols = CF_COLUMNS.filter(c => f[c] !== undefined);
  const placeholders = cols.map(() => '?').join(', ');
  const vals = cols.map(c => f[c] ?? null);
  const result = db.prepare(`INSERT INTO community_filaments (${cols.join(', ')}) VALUES (${placeholders})`).run(...vals);
  return Number(result.lastInsertRowid);
}

export function updateCommunityFilament(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  for (const key of CF_COLUMNS) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE community_filaments SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCommunityFilament(id) {
  const db = getDb();
  db.prepare('DELETE FROM community_filaments WHERE id = ?').run(id);
}

export function getOwnedCommunityIds() {
  const db = getDb();
  const rows = db.prepare(`SELECT cf.id FROM community_filaments cf
    INNER JOIN filament_profiles fp ON LOWER(cf.material) = LOWER(fp.material)
    INNER JOIN vendors v ON fp.vendor_id = v.id AND LOWER(cf.manufacturer) = LOWER(v.name)
    WHERE fp.id IN (SELECT DISTINCT filament_profile_id FROM spools WHERE archived = 0 AND filament_profile_id IS NOT NULL)`).all();
  return rows.map(r => r.id);
}

export function getCommunityFilamentStats() {
  const db = getDb();
  return {
    total: db.prepare('SELECT COUNT(*) as c FROM community_filaments').get().c,
    brands: db.prepare('SELECT COUNT(DISTINCT manufacturer) as c FROM community_filaments').get().c,
    materials: db.prepare('SELECT COUNT(DISTINCT material) as c FROM community_filaments').get().c,
    with_k_value: db.prepare('SELECT COUNT(*) as c FROM community_filaments WHERE pressure_advance_k IS NOT NULL').get().c,
    with_td: db.prepare('SELECT COUNT(*) as c FROM community_filaments WHERE td_value IS NOT NULL AND td_value > 0').get().c,
    with_finish: db.prepare('SELECT COUNT(*) as c FROM community_filaments WHERE finish IS NOT NULL').get().c,
    translucent: db.prepare('SELECT COUNT(*) as c FROM community_filaments WHERE translucent = 1').get().c,
    glow_in_dark: db.prepare('SELECT COUNT(*) as c FROM community_filaments WHERE glow = 1').get().c,
    multi_color: db.prepare('SELECT COUNT(*) as c FROM community_filaments WHERE multi_color_direction IS NOT NULL').get().c,
    top_brands: db.prepare('SELECT manufacturer, COUNT(*) as count FROM community_filaments GROUP BY manufacturer ORDER BY count DESC LIMIT 20').all(),
    material_breakdown: db.prepare('SELECT material, COUNT(*) as count FROM community_filaments GROUP BY material ORDER BY count DESC').all(),
    finish_breakdown: db.prepare("SELECT COALESCE(finish, 'unknown') as finish, COUNT(*) as count FROM community_filaments WHERE finish IS NOT NULL GROUP BY finish ORDER BY count DESC").all()
  };
}

export function upsertCommunityFilament(f) {
  const db = getDb();
  if (f.external_source_id) {
    const existing = db.prepare('SELECT id FROM community_filaments WHERE external_source_id = ?').get(f.external_source_id);
    if (existing) { updateCommunityFilament(existing.id, f); return existing.id; }
  }
  const existing = db.prepare("SELECT id FROM community_filaments WHERE manufacturer = ? AND COALESCE(name,'') = ? AND material = ? AND COALESCE(color_name,'') = ?").get(f.manufacturer, f.name || '', f.material, f.color_name || '');
  if (existing) { updateCommunityFilament(existing.id, f); return existing.id; }
  return addCommunityFilament(f);
}

export function clearCommunityFilaments(source = null) {
  const db = getDb();
  if (source) db.prepare('DELETE FROM community_filaments WHERE source = ?').run(source);
  else db.prepare('DELETE FROM community_filaments').run();
}

export function getCommunityFilamentCategories() {
  const db = getDb();
  return db.prepare('SELECT COALESCE(category, \'uncategorized\') as category, COUNT(*) as count FROM community_filaments GROUP BY category ORDER BY count DESC').all();
}

// ---- Brand Defaults ----

export function getBrandDefaults(manufacturer = null) {
  const db = getDb();
  if (manufacturer) return db.prepare('SELECT * FROM brand_defaults WHERE manufacturer = ? ORDER BY material').all(manufacturer);
  return db.prepare('SELECT * FROM brand_defaults ORDER BY manufacturer, material').all();
}

export function getBrandDefault(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM brand_defaults WHERE id = ?').get(id) || null;
}

export function upsertBrandDefault(d) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM brand_defaults WHERE manufacturer = ? AND (material = ? OR (material IS NULL AND ? IS NULL))').get(d.manufacturer, d.material || null, d.material || null);
  if (existing) {
    db.prepare('UPDATE brand_defaults SET default_density = ?, default_diameter = ?, default_spool_weight = ?, default_net_weight = ?, default_extruder_temp = ?, default_bed_temp = ?, default_max_speed = ?, default_retraction = ?, notes = ? WHERE id = ?').run(
      d.default_density || null, d.default_diameter || 1.75, d.default_spool_weight || null, d.default_net_weight || 1000, d.default_extruder_temp || null, d.default_bed_temp || null, d.default_max_speed || null, d.default_retraction || null, d.notes || null, existing.id);
    return existing.id;
  }
  const result = db.prepare('INSERT INTO brand_defaults (manufacturer, material, default_density, default_diameter, default_spool_weight, default_net_weight, default_extruder_temp, default_bed_temp, default_max_speed, default_retraction, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    d.manufacturer, d.material || null, d.default_density || null, d.default_diameter || 1.75, d.default_spool_weight || null, d.default_net_weight || 1000, d.default_extruder_temp || null, d.default_bed_temp || null, d.default_max_speed || null, d.default_retraction || null, d.notes || null);
  return Number(result.lastInsertRowid);
}

export function deleteBrandDefault(id) {
  const db = getDb();
  db.prepare('DELETE FROM brand_defaults WHERE id = ?').run(id);
}

// ---- Community Sharing ----

export function shareFilamentProfile(profileId, sharedBy) {
  const db = getDb();
  const profile = db.prepare(`SELECT fp.*, v.name as vendor_name FROM filament_profiles fp LEFT JOIN vendors v ON fp.vendor_id = v.id WHERE fp.id = ?`).get(profileId);
  if (!profile) return null;
  const existing = db.prepare('SELECT id FROM community_filaments WHERE shared_from_profile_id = ?').get(profileId);
  if (existing) return Number(existing.id);
  const r = db.prepare(`INSERT INTO community_filaments
    (manufacturer, name, material, density, diameter, weight, extruder_temp, bed_temp, color_name, color_hex,
     pressure_advance_k, max_volumetric_speed, flow_ratio, retraction_distance, retraction_speed,
     source, shared_by, shared_from_profile_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user_shared', ?, ?)`).run(
    profile.vendor_name || 'Unknown', profile.name, profile.material,
    profile.density, profile.diameter, profile.spool_weight_g,
    profile.nozzle_temp_min, profile.bed_temp_min,
    profile.color_name, profile.color_hex,
    profile.pressure_advance_k, profile.max_volumetric_speed,
    profile.flow_ratio, profile.retraction_distance, profile.retraction_speed,
    sharedBy || 'anonymous', profileId
  );
  return Number(r.lastInsertRowid);
}

export function rateCommunityFilament(filamentId, userId, rating, comment) {
  const db = getDb();
  db.prepare(`INSERT INTO community_ratings (community_filament_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?) ON CONFLICT(community_filament_id, user_id) DO UPDATE SET rating = excluded.rating, comment = excluded.comment, created_at = datetime('now')`)
    .run(filamentId, userId || 'default', rating, comment || null);
  const agg = db.prepare('SELECT SUM(rating) as s, COUNT(*) as c FROM community_ratings WHERE community_filament_id = ?').get(filamentId);
  db.prepare('UPDATE community_filaments SET rating_sum = ?, rating_count = ? WHERE id = ?').run(agg.s || 0, agg.c || 0, filamentId);
  return { rating_sum: agg.s || 0, rating_count: agg.c || 0, average: agg.c > 0 ? (agg.s / agg.c).toFixed(1) : null };
}

export function getCommunityFilamentRatings(filamentId) {
  const db = getDb();
  return db.prepare('SELECT * FROM community_ratings WHERE community_filament_id = ? ORDER BY created_at DESC').all(filamentId);
}

export function submitTdVote(filamentId, userId, tdValue) {
  const db = getDb();
  db.prepare(`INSERT INTO td_votes (community_filament_id, user_id, td_value)
    VALUES (?, ?, ?) ON CONFLICT(community_filament_id, user_id) DO UPDATE SET td_value = excluded.td_value, created_at = datetime('now')`)
    .run(filamentId, userId || 'default', tdValue);
  const agg = db.prepare('SELECT AVG(td_value) as avg, MIN(td_value) as min, MAX(td_value) as max, COUNT(*) as count FROM td_votes WHERE community_filament_id = ?').get(filamentId);
  const avgTd = agg.avg ? Math.round(agg.avg * 100) / 100 : null;
  db.prepare('UPDATE community_filaments SET td_value = ?, total_td_votes = ? WHERE id = ?').run(avgTd, agg.count, filamentId);
  return { td_value: avgTd, total_td_votes: agg.count, td_min: agg.min, td_max: agg.max };
}

export function getTdVotes(filamentId) {
  const db = getDb();
  return db.prepare('SELECT * FROM td_votes WHERE community_filament_id = ? ORDER BY created_at DESC').all(filamentId);
}

export function importCommunityToInventory(communityId, vendorId) {
  const db = getDb();
  const cf = db.prepare('SELECT * FROM community_filaments WHERE id = ?').get(communityId);
  if (!cf) return null;
  const r = db.prepare(`INSERT INTO filament_profiles
    (vendor_id, name, material, color_name, color_hex, density, diameter, spool_weight_g,
     nozzle_temp_min, bed_temp_min, pressure_advance_k, max_volumetric_speed,
     flow_ratio, retraction_distance, retraction_speed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    vendorId || null, cf.name || cf.material, cf.material,
    cf.color_name, cf.color_hex, cf.density, cf.diameter, cf.weight,
    cf.extruder_temp, cf.bed_temp, cf.pressure_advance_k,
    cf.max_volumetric_speed, cf.flow_ratio, cf.retraction_distance, cf.retraction_speed
  );
  return Number(r.lastInsertRowid);
}
