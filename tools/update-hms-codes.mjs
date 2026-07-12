#!/usr/bin/env node
// Update server/hms-codes-full.json directly from Bambu Lab's own error text
// service (no third-party aggregator).
//
// Origin: https://e.bambulab.com/query.php?lang=en&d=<serial_prefix>
// returns { result: 0, data: { device_error: {...}, device_hms: {...} } } for
// one printer family. The table is split per device, so we fetch every family
// and merge. Device serial prefixes are Bambu's own (see Bambu Studio /
// e.bambulab). Re-run to refresh.
//
// Output: { "<HEXCODE>": "<description>" } — HEXCODE uppercase, no separators
// (8 hex = print error, 16 hex = HMS), matched by lookupHmsCode.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DEVICE_PREFIXES = ['00M', '03W', '039', '030', '01S', '01P', '22E', '093', '094'];
const LANG = 'en';

const out = {};
// Bambu returns { device_error: { en: [{ ecode, intro }] }, device_hms: {...} }.
const take = (section) => {
  const arr = (section && section.en) || [];
  for (const item of arr) {
    const code = String(item?.ecode || '').toUpperCase();
    if (!/^[0-9A-F]{8,16}$/.test(code)) continue; // 8 hex = print error, 16 = HMS
    const desc = item?.intro || item?.desc || null;
    if (desc && !out[code]) out[code] = desc;
  }
};

for (const d of DEVICE_PREFIXES) {
  try {
    const res = await fetch(`https://e.bambulab.com/query.php?lang=${LANG}&d=${d}`);
    if (!res.ok) { console.warn(`  ${d}: HTTP ${res.status}, skipping`); continue; }
    const json = await res.json();
    if (json.result !== 0 || typeof json.data !== 'object') { console.warn(`  ${d}: no data`); continue; }
    const before = Object.keys(out).length;
    take(json.data.device_error);
    take(json.data.device_hms);
    console.log(`  ${d}: +${Object.keys(out).length - before} codes`);
  } catch (e) {
    console.warn(`  ${d}: ${e.message}`);
  }
}

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'server', 'hms-codes-full.json');
writeFileSync(outPath, JSON.stringify(out));
console.log(`Wrote ${Object.keys(out).length} codes to ${outPath}`);
