// Spoolman-compatible API
// ------------------------
// Lets 3DPrintForge act as a Spoolman server so Moonraker / Klipper front-ends
// (Mainsail, Fluidd, KlipperScreen) can read our inventory and report filament
// usage directly — point their `[spoolman] server:` at this host and our spools
// show up there, no separate Spoolman instance needed.
//
// Implements the read + usage subset of Spoolman's v1 API that those clients
// actually call: /info, /health, /spool[/:id], /spool/:id/use, /filament,
// /vendor. Our spools are mapped onto Spoolman's schema on the fly.

import { getSpools, getSpool, useSpoolWeight, addSpool, updateSpool, deleteSpool } from './db/spools.js';
import {
  getFilamentProfiles, getFilamentProfile, addFilamentProfile, updateFilamentProfile, deleteFilamentProfile,
  getVendors, addVendor, updateVendor, deleteVendor,
} from './db/filament-profiles.js';

// Spoolman API version we present ourselves as (clients gate behaviour on it).
const SPOOLMAN_VERSION = '0.22.0';

function emptySpoolWeight(s) {
  return s.spool_weight || s.profile_spool_weight_g || s.vendor_empty_spool_weight_g || s.bambu_spool_weight_g || 0;
}

function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }

function toSpoolmanVendor(s) {
  if (!s.vendor_id && !s.vendor_name) return null;
  return {
    id: s.vendor_id || 0,
    name: s.vendor_name || 'Unknown',
    empty_spool_weight: s.vendor_empty_spool_weight_g || null,
  };
}

function toSpoolmanFilament(s) {
  const f = {
    id: s.filament_profile_id || s.id,
    name: s.profile_name || s.color_name || s.material || 'Filament',
    material: s.material || null,
    price: s.profile_price != null ? s.profile_price : null,
    density: s.density || 1.24,
    diameter: s.diameter || 1.75,
    weight: s.initial_weight_g || null,        // net filament weight (g)
    spool_weight: emptySpoolWeight(s) || null, // empty spool weight (g)
    article_number: s.article_number || null,
    color_hex: s.color_hex || null,
  };
  if (s.multi_color_hexes) f.multi_color_hexes = s.multi_color_hexes;
  const vendor = toSpoolmanVendor(s);
  if (vendor) f.vendor = vendor;
  return f;
}

function toSpoolmanSpool(s) {
  return {
    id: s.id,
    registered: s.created_at || null,
    first_used: s.first_used_at || null,
    last_used: s.last_used_at || null,
    filament: toSpoolmanFilament(s),
    remaining_weight: round2(Math.max(0, s.remaining_weight_g || 0)),
    used_weight: round2(Math.max(0, s.used_weight_g || 0)),
    remaining_length: s.remaining_length_m != null ? Math.round(s.remaining_length_m * 1000) : null,
    used_length: s.used_length_m != null ? Math.round(s.used_length_m * 1000) : null,
    location: s.location || null,
    comment: s.comment || null,
    archived: !!s.archived,
  };
}

// Convert a filament length (mm) to grams using the spool's density + diameter.
function lengthMmToGrams(lengthMm, s) {
  const d = s.diameter || 1.75;          // mm
  const density = s.density || 1.24;     // g/cm^3
  const areaMm2 = Math.PI * (d / 2) * (d / 2);
  const volMm3 = Number(lengthMm) * areaMm2;
  return (volMm3 * density) / 1000;      // 1 cm^3 = 1000 mm^3
}

// Map a standalone filament profile row to the Spoolman filament shape (used
// for create/update responses, where we don't have a joined spool row).
function profileToSpoolmanFilament(p) {
  if (!p) return null;
  const f = {
    id: p.id,
    name: p.name || p.color_name || p.material || 'Filament',
    material: p.material || null,
    price: p.price != null ? p.price : null,
    density: p.density || 1.24,
    diameter: p.diameter || 1.75,
    spool_weight: p.spool_weight_g || null,
    article_number: p.article_number || null,
    color_hex: p.color_hex || null,
  };
  if (p.vendor_id || p.vendor_name) f.vendor = { id: p.vendor_id || 0, name: p.vendor_name || 'Unknown' };
  return f;
}

function vendorRowToSpoolman(v) {
  if (!v) return null;
  return { id: v.id, name: v.name, empty_spool_weight: v.empty_spool_weight_g != null ? v.empty_spool_weight_g : null };
}

/**
 * Handle a Spoolman v1 API request.
 * @returns {{status:number, json:any}|null} null when the path is not ours.
 */
export function handleSpoolmanApi(method, pathname, query, body) {
  if (method === 'GET' && pathname === '/api/v1/info') {
    return { status: 200, json: {
      version: SPOOLMAN_VERSION,
      debug_mode: false,
      automatic_backups: false,
      data_dir: '',
      backups_dir: '',
      db_type: 'sqlite',
      git_commit: null,
      build_date: null,
    } };
  }

  if (method === 'GET' && pathname === '/api/v1/health') {
    return { status: 200, json: { status: 'healthy' } };
  }

  if (method === 'GET' && pathname === '/api/v1/spool') {
    const allowArchived = query.get('allow_archived') === 'true';
    const filters = allowArchived ? {} : { archived: false };
    const res = getSpools(filters);
    const rows = res.rows || res;
    return { status: 200, json: rows.map(toSpoolmanSpool) };
  }

  const idGet = pathname.match(/^\/api\/v1\/spool\/(\d+)$/);
  if (idGet && method === 'GET') {
    const s = getSpool(parseInt(idGet[1], 10));
    if (!s) return { status: 404, json: { message: 'Spool not found' } };
    return { status: 200, json: toSpoolmanSpool(s) };
  }

  const useMatch = pathname.match(/^\/api\/v1\/spool\/(\d+)\/use$/);
  if (useMatch && method === 'PUT') {
    const id = parseInt(useMatch[1], 10);
    const s = getSpool(id);
    if (!s) return { status: 404, json: { message: 'Spool not found' } };
    let grams = null;
    if (body && body.use_weight != null) grams = Number(body.use_weight);
    else if (body && body.use_length != null) grams = lengthMmToGrams(body.use_length, s);
    if (grams == null || !isFinite(grams)) {
      return { status: 400, json: { message: 'use_weight (g) or use_length (mm) is required' } };
    }
    useSpoolWeight(id, grams, 'spoolman');
    return { status: 200, json: toSpoolmanSpool(getSpool(id)) };
  }

  if (method === 'GET' && pathname === '/api/v1/filament') {
    const res = getSpools({ archived: false });
    const rows = res.rows || res;
    const seen = new Map();
    for (const s of rows) {
      const fid = s.filament_profile_id || s.id;
      if (!seen.has(fid)) seen.set(fid, toSpoolmanFilament(s));
    }
    return { status: 200, json: [...seen.values()] };
  }

  if (method === 'GET' && pathname === '/api/v1/vendor') {
    const res = getSpools({ archived: false });
    const rows = res.rows || res;
    const seen = new Map();
    for (const s of rows) {
      const v = toSpoolmanVendor(s);
      if (v && !seen.has(v.id)) seen.set(v.id, v);
    }
    return { status: 200, json: [...seen.values()] };
  }

  const b = body || {};
  const filamentRef = (b.filament_id != null) ? b.filament_id : (b.filament && b.filament.id);
  const vendorRef = (b.vendor_id != null) ? b.vendor_id : (b.vendor && b.vendor.id);

  // ── Spool create / update / delete ──────────────────────────────────
  if (method === 'POST' && pathname === '/api/v1/spool') {
    const initial = b.initial_weight != null ? Number(b.initial_weight) : undefined;
    let remaining = b.remaining_weight != null ? Number(b.remaining_weight) : undefined;
    if (remaining === undefined && initial !== undefined && b.used_weight != null) remaining = initial - Number(b.used_weight);
    const r = addSpool({
      filament_profile_id: filamentRef || null,
      initial_weight_g: initial,
      remaining_weight_g: remaining,
      used_weight_g: b.used_weight != null ? Number(b.used_weight) : undefined,
      location: b.location || null,
      lot_number: b.lot_nr || null,
      comment: b.comment || null,
      extra_fields: b.extra || null,
    });
    return { status: 201, json: toSpoolmanSpool(getSpool(r.id)) };
  }

  const spoolIdPath = pathname.match(/^\/api\/v1\/spool\/(\d+)$/);
  if (spoolIdPath && method === 'PATCH') {
    const id = parseInt(spoolIdPath[1], 10);
    const cur = getSpool(id);
    if (!cur) return { status: 404, json: { message: 'Spool not found' } };
    let extra = cur.extra_fields;
    if (typeof extra === 'string') { try { extra = JSON.parse(extra); } catch (e) { extra = null; } }
    if (b.extra !== undefined) extra = b.extra;
    updateSpool(id, {
      filament_profile_id: filamentRef != null ? filamentRef : cur.filament_profile_id,
      remaining_weight_g: b.remaining_weight != null ? Number(b.remaining_weight) : cur.remaining_weight_g,
      used_weight_g: b.used_weight != null ? Number(b.used_weight) : cur.used_weight_g,
      initial_weight_g: b.initial_weight != null ? Number(b.initial_weight) : cur.initial_weight_g,
      cost: cur.cost,
      lot_number: b.lot_nr !== undefined ? b.lot_nr : cur.lot_number,
      purchase_date: cur.purchase_date,
      location: b.location !== undefined ? b.location : cur.location,
      printer_id: cur.printer_id, ams_unit: cur.ams_unit, ams_tray: cur.ams_tray,
      archived: b.archived != null ? (b.archived ? 1 : 0) : cur.archived,
      comment: b.comment !== undefined ? b.comment : cur.comment,
      extra_fields: extra,
      spool_weight: cur.spool_weight, storage_method: cur.storage_method,
      tray_id_name: cur.tray_id_name,
      color_hex_override: cur.color_hex_override, color_name_override: cur.color_name_override,
    });
    return { status: 200, json: toSpoolmanSpool(getSpool(id)) };
  }
  if (spoolIdPath && method === 'DELETE') {
    const id = parseInt(spoolIdPath[1], 10);
    if (!getSpool(id)) return { status: 404, json: { message: 'Spool not found' } };
    deleteSpool(id);
    return { status: 200, json: { message: 'Deleted' } };
  }

  // ── Filament create / update / delete ───────────────────────────────
  if (method === 'POST' && pathname === '/api/v1/filament') {
    const r = addFilamentProfile({
      vendor_id: vendorRef || null,
      name: b.name || 'Filament',
      material: b.material || 'PLA',
      color_hex: b.color_hex || null,
      density: b.density != null ? b.density : 1.24,
      diameter: b.diameter != null ? b.diameter : 1.75,
      spool_weight_g: b.spool_weight != null ? b.spool_weight : null,
      price: b.price != null ? b.price : null,
      article_number: b.article_number || null,
    });
    return { status: 201, json: profileToSpoolmanFilament(getFilamentProfile(r.id)) };
  }
  const filIdPath = pathname.match(/^\/api\/v1\/filament\/(\d+)$/);
  if (filIdPath && method === 'PATCH') {
    const id = parseInt(filIdPath[1], 10);
    const cur = getFilamentProfile(id);
    if (!cur) return { status: 404, json: { message: 'Filament not found' } };
    updateFilamentProfile(id, Object.assign({}, cur, {
      vendor_id: vendorRef != null ? vendorRef : cur.vendor_id,
      name: b.name != null ? b.name : cur.name,
      material: b.material != null ? b.material : cur.material,
      color_hex: b.color_hex != null ? b.color_hex : cur.color_hex,
      density: b.density != null ? b.density : cur.density,
      diameter: b.diameter != null ? b.diameter : cur.diameter,
      spool_weight_g: b.spool_weight != null ? b.spool_weight : cur.spool_weight_g,
      price: b.price != null ? b.price : cur.price,
      article_number: b.article_number != null ? b.article_number : cur.article_number,
    }));
    return { status: 200, json: profileToSpoolmanFilament(getFilamentProfile(id)) };
  }
  if (filIdPath && method === 'DELETE') {
    const id = parseInt(filIdPath[1], 10);
    if (!getFilamentProfile(id)) return { status: 404, json: { message: 'Filament not found' } };
    deleteFilamentProfile(id);
    return { status: 200, json: { message: 'Deleted' } };
  }

  // ── Vendor create / update / delete ─────────────────────────────────
  if (method === 'POST' && pathname === '/api/v1/vendor') {
    const r = addVendor({ name: b.name || 'Vendor', empty_spool_weight_g: b.empty_spool_weight != null ? b.empty_spool_weight : null });
    return { status: 201, json: vendorRowToSpoolman({ id: r.id, name: b.name || 'Vendor', empty_spool_weight_g: b.empty_spool_weight != null ? b.empty_spool_weight : null }) };
  }
  const venIdPath = pathname.match(/^\/api\/v1\/vendor\/(\d+)$/);
  if (venIdPath && method === 'PATCH') {
    const id = parseInt(venIdPath[1], 10);
    updateVendor(id, { name: b.name, empty_spool_weight_g: b.empty_spool_weight });
    return { status: 200, json: vendorRowToSpoolman({ id, name: b.name, empty_spool_weight_g: b.empty_spool_weight }) };
  }
  if (venIdPath && method === 'DELETE') {
    const id = parseInt(venIdPath[1], 10);
    deleteVendor(id);
    return { status: 200, json: { message: 'Deleted' } };
  }

  return null;
}
