// OpenSpool interop — https://github.com/spuder/OpenSpool
//
// OpenSpool is an open NFC standard: an NTAG 215/216 carries an NDEF
// application/json record describing the filament on the spool. Scanning it
// (with the OpenSpool ESP32 reader, or Web NFC in a browser) lets a printer
// auto-configure its AMS slot. We don't need their hardware to be a good
// citizen of the format — we can produce OpenSpool tags for our inventory,
// parse scanned tags, match them to spools, and push the same AMS setting to
// Bambu printers over MQTT that OpenSpool does.

export const OPENSPOOL_PROTOCOL = 'openspool';
export const OPENSPOOL_VERSION = '1.0';

const hex6 = (v) => String(v || '').replace(/^#/, '').toUpperCase().slice(0, 6);

/**
 * Build an OpenSpool tag payload from one of our spool rows (the shape
 * returned by SPOOL_SELECT: material, color_hex, vendor_name, nozzle temps).
 */
export function buildOpenSpoolTag(spool) {
  if (!spool) throw new Error('spool required');
  const tag = {
    protocol: OPENSPOOL_PROTOCOL,
    version: OPENSPOOL_VERSION,
    type: String(spool.material || 'PLA'),
    color_hex: hex6(spool.color_hex) || 'FFFFFF',
    brand: String(spool.vendor_name || 'Generic'),
  };
  if (spool.nozzle_temp_min != null) tag.min_temp = String(spool.nozzle_temp_min);
  if (spool.nozzle_temp_max != null) tag.max_temp = String(spool.nozzle_temp_max);
  return tag;
}

/**
 * Parse and validate an OpenSpool tag (object or JSON string) into a
 * normalized descriptor. Throws on a non-OpenSpool payload.
 */
export function parseOpenSpoolTag(input) {
  let obj = input;
  if (typeof input === 'string') {
    try { obj = JSON.parse(input); } catch { throw new Error('invalid JSON payload'); }
  }
  if (!obj || typeof obj !== 'object') throw new Error('invalid tag');
  if (String(obj.protocol || '').toLowerCase() !== OPENSPOOL_PROTOCOL) throw new Error('not an OpenSpool tag');
  const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
  return {
    version: String(obj.version || OPENSPOOL_VERSION),
    type: String(obj.type || '').trim() || null,
    colorHex: hex6(obj.color_hex) || null,
    brand: String(obj.brand || '').trim() || null,
    minTemp: num(obj.min_temp),
    maxTemp: num(obj.max_temp),
  };
}

/** openspool.io preview URL for a tag (handy for QR / share links). */
export function openSpoolPreviewUrl(tag) {
  const q = new URLSearchParams();
  if (tag.color_hex || tag.colorHex) q.set('color_hex', hex6(tag.color_hex || tag.colorHex));
  if (tag.type) q.set('type', String(tag.type));
  if (tag.brand) q.set('brand', String(tag.brand));
  const min = tag.min_temp ?? tag.minTemp;
  const max = tag.max_temp ?? tag.maxTemp;
  if (min != null && min !== '') q.set('min_temp', String(min));
  if (max != null && max !== '') q.set('max_temp', String(max));
  return `https://openspool.io/tag_info?${q.toString()}`;
}

/**
 * Match a parsed OpenSpool tag against our spool list. Scores material (type)
 * exact, colour exact, then brand; returns the best candidate or null plus the
 * ranked shortlist.
 */
export function matchSpoolToTag(parsed, spools) {
  const list = Array.isArray(spools) ? spools : [];
  const type = (parsed.type || '').toLowerCase();
  const color = (parsed.colorHex || '').toUpperCase();
  const brand = (parsed.brand || '').toLowerCase();
  const scored = list
    .map((s) => {
      let score = 0;
      if (type && String(s.material || '').toLowerCase() === type) score += 3;
      if (color && hex6(s.color_hex) === color) score += 2;
      if (brand && String(s.vendor_name || '').toLowerCase() === brand) score += 1;
      return { spool: s, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  return { matched: scored[0]?.spool ?? null, candidates: scored.slice(0, 5).map((r) => ({ id: r.spool.id, score: r.score })) };
}

/**
 * Turn a parsed OpenSpool tag into the argument object for
 * buildAmsFilamentSettingCommand (via _buildCommand action 'ams_filament_setting').
 * Bambu tray_color is 8-hex RGBA, so we append an opaque alpha.
 */
export function tagToAmsSetting(parsed, amsId, slotId) {
  const color6 = (parsed.colorHex || 'FFFFFF').slice(0, 6);
  return {
    action: 'ams_filament_setting',
    ams_id: Number(amsId),
    slot_id: Number(slotId),
    tray_color: `${color6}FF`,
    tray_type: parsed.type || 'PLA',
    nozzle_temp_min: parsed.minTemp ?? 190,
    nozzle_temp_max: parsed.maxTemp ?? 230,
  };
}
