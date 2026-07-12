// tigertag.js — TigerTag RFID filament tag support (https://tigertag.io).
//
// TigerTag is an open RFID standard for filament spools: an NTAG/NDEF chip
// carries an 80/144/180-byte binary payload (material, brand, colour, nozzle/
// bed temps, weight …). We use the official offline `tigertag` SDK to decode a
// scanned dump, then normalise it to the same shape as our OpenSpool support so
// the existing spool-matching / AMS-apply flow can be reused.

import { TigerTag, TigerTagDB } from 'tigertag';

let _db;
function db() { if (!_db) _db = new TigerTagDB(); return _db; }

function toBytes(input) {
  if (input instanceof Uint8Array) return input;
  if (Buffer.isBuffer(input)) return input;
  if (Array.isArray(input)) return Uint8Array.from(input);
  if (typeof input === 'string') {
    const hex = input.replace(/[^0-9a-fA-F]/g, '');
    if (!hex || hex.length % 2 !== 0) throw new Error('invalid hex dump');
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }
  throw new Error('unsupported dump input');
}

const clean = (v) => (v && v !== 'Unknown' ? v : null);
const hex6 = (h) => String(h || '').replace(/^#/, '').toUpperCase().slice(0, 6);

/** Map a TigerTag toDict() result to our normalised (OpenSpool-compatible) shape. */
export function normalizeTigerTagDict(d) {
  const nozzle = (d && d.temperatures && d.temperatures.on_chip && d.temperatures.on_chip.nozzle) || {};
  const bed = (d && d.temperatures && d.temperatures.on_chip && d.temperatures.on_chip.bed) || {};
  const primary = (d && d.colors && d.colors.primary) || {};
  return {
    protocol: 'tigertag',
    type: clean(d && d.material && d.material.label),
    variant: clean(d && d.type && d.type.label),
    brand: clean(d && d.brand && d.brand.label),
    colorHex: hex6(primary.hex) || null,
    minTemp: nozzle.min || null,
    maxTemp: nozzle.max || null,
    bedMin: bed.min || null,
    bedMax: bed.max || null,
    diameter: clean(d && d.diameter && d.diameter.label),
    weightG: (d && d.measure && d.measure.measure_gr) || null,
    uid: (d && d.uid) || null,
  };
}

/** Decode a TigerTag dump (hex string or bytes) to normalised filament fields. */
export function parseTigerTagDump(input) {
  const bytes = toBytes(input);
  let tag;
  try { tag = TigerTag.fromDump(bytes); }
  catch (e) { throw new Error('not a TigerTag dump: ' + e.message); }
  return normalizeTigerTagDict(tag.toDict(db()));
}
