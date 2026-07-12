#!/usr/bin/env node
// Update server/hms-codes-full.json from the ha-bambulab error/HMS text table.
//
// Source: https://github.com/greghesp/ha-bambulab
//   custom_components/bambu_lab/pybambu/hms_error_text/hms_en.json.gz
// which aggregates Bambu Lab's own device_error (print errors) + device_hms
// text. The data is Bambu's factual error strings; ha-bambulab is the
// aggregator. Re-run this to refresh the table.
//
// Output: { "<HEXCODE>": "<description>" } — HEXCODE is uppercase with no
// separators (8 hex = print error, 16 hex = HMS), matched by lookupHmsCode.

import { writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SRC = 'https://raw.githubusercontent.com/greghesp/ha-bambulab/main/custom_components/bambu_lab/pybambu/hms_error_text/hms_en.json.gz';

const res = await fetch(SRC);
if (!res.ok) { console.error('Download failed:', res.status); process.exit(1); }
const data = JSON.parse(gunzipSync(Buffer.from(await res.arrayBuffer())).toString('utf8'));

const out = {};
const take = (dict) => {
  for (const [code, entry] of Object.entries(dict || {})) {
    let desc = null;
    if (entry && typeof entry === 'object') desc = Object.keys(entry)[0] || null;
    else if (typeof entry === 'string') desc = entry;
    if (desc) out[String(code).toUpperCase()] = desc;
  }
};
take(data.device_error);
take(data.device_hms);

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'server', 'hms-codes-full.json');
writeFileSync(outPath, JSON.stringify(out));
console.log(`Wrote ${Object.keys(out).length} codes to ${outPath}`);
