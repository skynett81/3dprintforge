// nfc-codec.js
// Decode/encode the open NFC filament-tag standards so any tag a phone or USB
// reader scans resolves to a normalised filament record, and so we can write
// tags ourselves. Standards covered:
//   - OpenSpool   — NDEF application/json {protocol:"openspool", ...}
//   - OpenPrintTag/OpenTag3D — NDEF application/json (Prusa / generic)
//   - TigerTag    — 144-byte binary block layout on NTAG21x, IDs resolved via
//                   the public TigerTag REST API (no auth)
//   - Bambu / Snapmaker tags are read by the printer firmware, not here.
//
// Everything normalises to:
//   { standard, material, color_hex, brand, min_temp, max_temp,
//     bed_temp, diameter_mm, weight_g, remaining_g, raw }

import { createLogger } from './logger.js';
const log = createLogger('nfc-codec');

function _hex6(c) { return String(c || '').replace(/^#/, '').toUpperCase().slice(0, 6); }
function _num(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }

// ── OpenSpool / OpenPrintTag / OpenTag3D: NDEF application/json ──────────────
export function parseJsonTag(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const proto = String(obj.protocol || obj.standard || '').toLowerCase();
  const standard = proto.includes('openprinttag') ? 'openprinttag'
    : proto.includes('opentag') ? 'opentag3d'
    : 'openspool';
  return {
    standard,
    material: obj.type || obj.material || obj.material_type || null,
    color_hex: _hex6(obj.color_hex || obj.color || obj.color_hex_1) || null,
    brand: obj.brand || obj.manufacturer || obj.vendor || null,
    min_temp: _num(obj.min_temp ?? obj.nozzle_temp_min ?? obj.temp_min),
    max_temp: _num(obj.max_temp ?? obj.nozzle_temp_max ?? obj.temp_max),
    bed_temp: _num(obj.bed_temp ?? obj.bed_temperature),
    diameter_mm: _num(obj.diameter ?? obj.diameter_mm) || 1.75,
    weight_g: _num(obj.weight ?? obj.weight_g ?? obj.net_weight),
    remaining_g: _num(obj.remaining ?? obj.remaining_g ?? obj.remaining_weight),
    raw: obj,
  };
}

// ── TigerTag: 144-byte block layout (pages 0x04–0x27 on NTAG21x) ─────────────
// IDs for material/brand are resolved against the public API; the rest is read
// straight off the bytes. Offsets per the TigerTag RFID Guide.
const TIGERTAG_PROTO = 0x5BF59264;
const TT_DIAMETER = { 0x38: 1.75, 0xDD: 2.85, 0x49: 3.0 };
const TT_UNIT = { 0x15: 1, 0x23: 1000 }; // grams, kilograms → multiplier to g

export function parseTigerTag(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : Uint8Array.from(bytes || []);
  if (b.length < 32) return null;
  const u16 = (o) => (b[o] << 8) | b[o + 1];
  const u24 = (o) => (b[o] << 16) | (b[o + 1] << 8) | b[o + 2];
  const u32 = (o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
  if (u32(0) !== TIGERTAG_PROTO) return null; // not a TigerTag
  const unitMul = TT_UNIT[b[23]] || 1;
  const colorRgba = [b[16], b[17], b[18], b[19]];
  return {
    standard: 'tigertag',
    material: null,                 // resolved from materialId via API
    materialId: u16(8),
    brand: null,                    // resolved from brandId via API
    brandId: u16(14),
    color_hex: colorRgba.slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase(),
    diameter_mm: TT_DIAMETER[b[13]] || 1.75,
    min_temp: u16(24) || null,
    max_temp: u16(26) || null,
    bed_temp: b[30] || null,
    dry_temp: b[28] || null,
    weight_g: u24(20) * unitMul || null,
    remaining_g: u24(76) * unitMul || null,
    productId: u32(4),
    raw: { proto: '0x' + u32(0).toString(16) },
  };
}

// ── TigerTag online ID → label resolution (public, no-auth, cached) ─────────
const TT_API = 'https://api.tigertag.io/api:tigertag';
let _ttCache = null; let _ttCacheAt = 0;
async function _ttMaps() {
  if (_ttCache && Date.now() - _ttCacheAt < 24 * 3600e3) return _ttCache;
  try {
    const grab = async (p) => { const r = await fetch(TT_API + p); return r.ok ? r.json() : null; };
    const [mat, brand] = await Promise.all([grab('/material/get/all'), grab('/brand/get/all')]);
    const toMap = (arr, idKey = 'id', lblKey = 'label') => {
      const m = {}; for (const x of (Array.isArray(arr) ? arr : arr?.items || [])) m[x[idKey] ?? x.value] = x[lblKey] ?? x.name ?? x.label; return m;
    };
    _ttCache = { material: toMap(mat), brand: toMap(brand) };
    _ttCacheAt = Date.now();
  } catch (e) { log.warn('TigerTag API resolve failed: ' + e.message); _ttCache = _ttCache || { material: {}, brand: {} }; }
  return _ttCache;
}
export async function resolveTigerTag(parsed) {
  if (!parsed || parsed.standard !== 'tigertag') return parsed;
  const maps = await _ttMaps();
  return { ...parsed, material: maps.material[parsed.materialId] || parsed.material, brand: maps.brand[parsed.brandId] || parsed.brand };
}

// ── Encode an OpenSpool NDEF record from one of our spools (for writing) ─────
export function encodeOpenSpool(spool) {
  const payload = {
    protocol: 'openspool',
    version: '1.0',
    type: spool.material || spool.type || 'PLA',
    color_hex: _hex6(spool.color_hex || spool.color) || 'FFFFFF',
    brand: spool.brand || spool.vendor_name || spool.profile_name || 'Generic',
    min_temp: String(spool.nozzle_temp_min || spool.min_temp || 200),
    max_temp: String(spool.nozzle_temp_max || spool.max_temp || 220),
  };
  return {
    standard: 'openspool',
    mediaType: 'application/json',
    json: payload,
    // NDEF record a browser/Web NFC writer or reader can use directly.
    ndef: { recordType: 'mime', mediaType: 'application/json', data: JSON.stringify(payload) },
  };
}

// ── Auto-detect + parse any supported input ─────────────────────────────────
// input: { json } | { bytes } | { ndef: [{recordType,mediaType,data}] }
export async function decodeTag(input) {
  if (!input) return null;
  // Raw JSON object (already parsed NDEF text/json record)
  if (input.json) return parseJsonTag(input.json);
  // NDEF records array
  if (Array.isArray(input.ndef)) {
    for (const rec of input.ndef) {
      const txt = typeof rec.data === 'string' ? rec.data : null;
      if (txt && /application\/json|^\s*\{/.test(rec.mediaType || txt)) {
        try { return parseJsonTag(JSON.parse(txt)); } catch { /* not json */ }
      }
    }
  }
  // Raw bytes — try TigerTag binary
  if (input.bytes) {
    const tt = parseTigerTag(input.bytes);
    if (tt) return await resolveTigerTag(tt);
  }
  return null;
}
