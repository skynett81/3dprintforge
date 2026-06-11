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

import { getSpools, getSpool, useSpoolWeight } from './db/spools.js';

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

  return null;
}
