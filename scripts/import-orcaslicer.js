#!/usr/bin/env node
/**
 * Import OrcaSlicer filament profiles into 3DPrintForge database.
 *
 * Fetches @base profiles from OrcaSlicer GitHub repo and inserts them
 * as filament_profiles + vendors into the dashboard database.
 *
 * Usage: node --experimental-sqlite scripts/import-orcaslicer.js [--dry-run]
 *
 * Data source: https://github.com/OrcaSlicer/OrcaSlicer
 * License: AGPL-3.0 (data used as reference material)
 */

import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const DATA_DIR = join(import.meta.dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'dashboard.db');
const DRY_RUN = process.argv.includes('--dry-run');

const ORCA_RAW = 'https://raw.githubusercontent.com/OrcaSlicer/OrcaSlicer/main/resources/profiles';

// BBL.json has the most complete set (Bambu + third-party profiles for Bambu printers)
// OrcaFilamentLibrary.json has additional third-party profiles
const INDEXES = [
  { url: `${ORCA_RAW}/BBL.json`, label: 'Bambu Lab ecosystem', prefix: 'BBL' },
  { url: `${ORCA_RAW}/OrcaFilamentLibrary.json`, label: 'OrcaSlicer library', prefix: 'OrcaFilamentLibrary' },
];

// Vendor name normalization
const VENDOR_MAP = {
  'Bambu': 'Bambu Lab',
  'eSUN': 'eSUN',
  'Polymaker': 'Polymaker',
  'PolyLite': 'Polymaker',
  'PolyTerra': 'Polymaker',
  'Panchroma': 'Polymaker',
  'Overture': 'Overture',
  'SUNLU': 'SUNLU',
  'COEX': 'COEX',
  'Generic': 'Generic',
  'Elegoo': 'Elegoo',
  'FusRock': 'FusRock',
  'AliZ': 'AliZ',
  'Elas': 'Elas',
  'NIT': 'NIT',
  'Numakers': 'Numakers',
  'FDplast': 'FDplast',
  'FILL3D': 'FILL3D',
  'Fiberon': 'Fiberon',
  'Valment': 'Valment',
};

async function fetchJson(url) {
  // Encode spaces in URL path (OrcaSlicer filenames have spaces)
  const encoded = url.replace(/ /g, '%20');
  const res = await fetch(encoded);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${encoded}`);
  return res.json();
}

function parseVal(v) {
  // OrcaSlicer stores values as ["string"] arrays
  if (Array.isArray(v)) return v[0];
  return v;
}

function parseNum(v) {
  const s = parseVal(v);
  if (s == null || s === '') return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

async function main() {
  if (!existsSync(DB_PATH)) {
    console.error(`Database not found: ${DB_PATH}`);
    process.exit(1);
  }

  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode=WAL');
  db.exec('PRAGMA foreign_keys=ON');

  // Collect all @base profile sub_paths from indexes
  const baseProfiles = new Map(); // name -> sub_path (dedup)

  for (const idx of INDEXES) {
    console.log(`\nFetching index: ${idx.label}...`);
    const data = await fetchJson(idx.url);
    const list = data.filament_list || [];
    let count = 0;
    for (const entry of list) {
      if (entry.name.includes('@base') && !baseProfiles.has(entry.name)) {
        // Build full URL: profiles/{prefix}/{sub_path}
        baseProfiles.set(entry.name, `${idx.prefix}/${entry.sub_path}`);
        count++;
      }
    }
    console.log(`  Found ${count} new @base profiles (${baseProfiles.size} total)`);
  }

  console.log(`\nFetching ${baseProfiles.size} individual profile files...`);

  // Fetch all @base profiles
  const profiles = [];
  let fetched = 0;
  const errors = [];

  for (const [name, subPath] of baseProfiles) {
    const url = `${ORCA_RAW}/${subPath}`;
    try {
      const data = await fetchJson(url);
      profiles.push({ name, data });
      fetched++;
      if (fetched % 20 === 0) process.stdout.write(`  ${fetched}/${baseProfiles.size}\r`);
    } catch (e) {
      errors.push({ name, error: e.message });
    }
  }
  console.log(`  Fetched ${fetched}/${baseProfiles.size} profiles (${errors.length} errors)`);
  if (errors.length > 0) {
    console.log('  Errors:', errors.slice(0, 5).map(e => `${e.name}: ${e.error}`).join('; '));
  }

  // Also fetch the blacklist
  console.log('\nFetching filament blacklist...');
  let blacklist = [];
  try {
    const blData = await fetchJson('https://raw.githubusercontent.com/OrcaSlicer/OrcaSlicer/main/resources/printers/filaments_blacklist.json');
    // Blacklist can be an object with prohibition/warning arrays, or a flat array
    if (Array.isArray(blData)) {
      blacklist = blData;
    } else {
      blacklist = [...(blData.prohibition || []).map(r => ({ ...r, action: 'prohibition' })),
                   ...(blData.warning || []).map(r => ({ ...r, action: 'warning' }))];
    }
    console.log(`  ${blacklist.length} blacklist rules`);
  } catch (e) {
    console.log(`  Failed: ${e.message}`);
  }

  // ---- Insert into database ----
  if (DRY_RUN) {
    console.log('\n=== DRY RUN — showing what would be inserted ===\n');
  }

  // Ensure vendors exist
  const getVendor = db.prepare('SELECT id FROM vendors WHERE name = ?');
  const insertVendor = db.prepare('INSERT INTO vendors (name, created_at) VALUES (?, datetime(\'now\'))');

  const vendorIds = {};
  const getOrCreateVendor = (vendorName) => {
    if (vendorIds[vendorName]) return vendorIds[vendorName];
    const row = getVendor.get(vendorName);
    if (row) { vendorIds[vendorName] = row.id; return row.id; }
    if (DRY_RUN) { vendorIds[vendorName] = -1; return -1; }
    const result = insertVendor.run(vendorName);
    vendorIds[vendorName] = Number(result.lastInsertRowid);
    return vendorIds[vendorName];
  };

  // Check for existing profiles
  const findProfile = db.prepare(
    'SELECT id FROM filament_profiles WHERE name = ? AND material = ? AND vendor_id = ?'
  );
  const insertProfile = db.prepare(`
    INSERT INTO filament_profiles (
      name, material, vendor_id, density, diameter,
      nozzle_temp_min, nozzle_temp_max, bed_temp_min, bed_temp_max,
      spool_weight_g, price, external_id, extra_fields, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  let inserted = 0;
  let skipped = 0;
  let vendorsCreated = 0;

  for (const { name, data } of profiles) {
    // Parse vendor from profile name
    const nameParts = name.replace(' @base', '').split(' ');
    const vendorKey = nameParts[0];
    const vendorName = VENDOR_MAP[vendorKey] || vendorKey;
    const materialName = nameParts.slice(1).join(' ') || vendorKey;

    // Parse data
    const filamentType = parseVal(data.filament_type) || materialName.split(' ')[0];
    const density = parseNum(data.filament_density);
    const diameter = parseNum(data.filament_diameter) || 1.75;
    const cost = parseNum(data.filament_cost);
    const nozzleTempMin = parseNum(data.nozzle_temperature_range_low);
    const nozzleTempMax = parseNum(data.nozzle_temperature_range_high);
    const nozzleTemp = parseNum(data.nozzle_temperature);

    // Bed temp: use hot_plate as default (most common)
    const bedTempHot = parseNum(data.hot_plate_temp);
    const bedTempCool = parseNum(data.cool_plate_temp);
    const bedTempEng = parseNum(data.eng_plate_temp);
    const bedTempText = parseNum(data.textured_plate_temp);
    const bedTemps = [bedTempCool, bedTempHot, bedTempEng, bedTempText].filter(v => v != null && v > 0);
    const bedTempMin = bedTemps.length > 0 ? Math.min(...bedTemps) : null;
    const bedTempMax = bedTemps.length > 0 ? Math.max(...bedTemps) : null;

    const filamentId = parseVal(data.filament_id) || null;
    const maxVolumetricSpeed = parseNum(data.filament_max_volumetric_speed);
    const flowRatio = parseNum(data.filament_flow_ratio);
    const isSupport = parseVal(data.filament_is_support) === '1';
    const isSoluble = parseVal(data.filament_soluble) === '1';
    const vitTemp = parseNum(data.temperature_vitrification);

    // Extra fields for rich data
    const extra = {};
    if (maxVolumetricSpeed) extra.max_volumetric_speed = maxVolumetricSpeed;
    if (flowRatio && flowRatio !== 1) extra.flow_ratio = flowRatio;
    if (isSupport) extra.is_support = true;
    if (isSoluble) extra.is_soluble = true;
    if (vitTemp) extra.vitrification_temp = vitTemp;
    if (bedTempCool) extra.cool_plate_temp = bedTempCool;
    if (bedTempHot) extra.hot_plate_temp = bedTempHot;
    if (bedTempEng) extra.eng_plate_temp = bedTempEng;
    if (bedTempText) extra.textured_plate_temp = bedTempText;

    // Plate compatibility from temps
    const plateCompat = {};
    if (bedTempCool && bedTempCool > 0) plateCompat.cool_plate = true;
    if (bedTempHot && bedTempHot > 0) plateCompat.hot_plate = true;
    if (bedTempEng && bedTempEng > 0) plateCompat.engineering_plate = true;
    if (bedTempText && bedTempText > 0) plateCompat.textured_pei = true;
    if (Object.keys(plateCompat).length > 0) extra.plate_compatibility = plateCompat;

    extra.source = 'orcaslicer';
    extra.orca_profile_name = name;

    const displayName = `${vendorName === 'Generic' ? '' : vendorName + ' '}${materialName}`.trim();

    // Get or create vendor
    const existingVendorCount = Object.keys(vendorIds).length;
    const vendorId = getOrCreateVendor(vendorName);
    if (Object.keys(vendorIds).length > existingVendorCount) vendorsCreated++;

    // Check if already exists
    const existing = findProfile.get(displayName, filamentType, vendorId);
    if (existing) {
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  + ${displayName} (${filamentType}) [${vendorName}] — nozzle: ${nozzleTempMin || nozzleTemp}–${nozzleTempMax || nozzleTemp}°C, bed: ${bedTempMin}–${bedTempMax}°C, density: ${density}`);
      inserted++;
      continue;
    }

    try {
      insertProfile.run(
        displayName,
        filamentType,
        vendorId,
        density,
        diameter,
        nozzleTempMin || nozzleTemp,
        nozzleTempMax || nozzleTemp,
        bedTempMin,
        bedTempMax,
        null, // spool_weight_g — varies
        cost,
        filamentId,
        Object.keys(extra).length > 0 ? JSON.stringify(extra) : null
      );
      inserted++;
    } catch (e) {
      console.error(`  Error inserting ${displayName}: ${e.message}`);
    }
  }

  // Insert blacklist rules
  if (blacklist.length > 0) {
    // Store in a simple table if it exists, otherwise just report
    try {
      db.exec(`CREATE TABLE IF NOT EXISTS filament_blacklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filament_type TEXT,
        type_suffix TEXT,
        vendor TEXT,
        name_filter TEXT,
        action TEXT NOT NULL,
        slot TEXT,
        model_ids TEXT,
        description TEXT,
        wiki_url TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )`);

      const insertBlacklist = db.prepare(`
        INSERT OR IGNORE INTO filament_blacklist (filament_type, type_suffix, vendor, name_filter, action, slot, model_ids, description, wiki_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let blInserted = 0;
      for (const rule of blacklist) {
        if (!DRY_RUN) {
          insertBlacklist.run(
            rule.type || null,
            rule.type_suffix || null,
            rule.vendor || null,
            rule.name || null,
            rule.action,
            rule.slot || null,
            rule.model_id ? JSON.stringify(rule.model_id) : null,
            rule.description || null,
            rule.wiki || null
          );
        }
        blInserted++;
      }
      console.log(`\nBlacklist: ${blInserted} rules ${DRY_RUN ? '(dry run)' : 'inserted'}`);
    } catch (e) {
      console.log(`\nBlacklist table: ${e.message}`);
    }
  }

  console.log(`
=== Import Complete ===
  Vendors created: ${vendorsCreated}
  Profiles inserted: ${inserted}
  Profiles skipped (already exist): ${skipped}
  Blacklist rules: ${blacklist.length}
  ${DRY_RUN ? '(DRY RUN — no changes made)' : ''}

  Data source: OrcaSlicer (AGPL-3.0)
  Repository: https://github.com/OrcaSlicer/OrcaSlicer
`);

  db.close();
}

main().catch(e => { console.error(e); process.exit(1); });
