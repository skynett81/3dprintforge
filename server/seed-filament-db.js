// Seed filament database from SpoolmanDB + 3DFilamentProfiles.com data
// Usage: node server/seed-filament-db.js [--fetch-3dfp]
// Or via API: POST /api/community-filaments/seed

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { upsertCommunityFilament, clearCommunityFilaments, initDatabase } from './database.js';

const __dirname_seed = dirname(fileURLToPath(import.meta.url));

function categorize(material, materialType) {
  const m = (material || '').toUpperCase();
  const t = (materialType || '').toUpperCase();
  // Composite check first (CF/GF variants)
  if (t.includes('CF') || t.includes('GF') || m.includes('-CF') || m.includes('-GF') || m.includes('CARBON')) return 'composite';
  // Flexible
  if (['TPU', 'TPE', 'TPC'].some(x => m.startsWith(x))) return 'flexible';
  // Engineering (careful: PA must not match PLA, PC must not match PCTG/PCABS)
  if (m === 'PA' || m === 'PC' || m.startsWith('PA-') || m.startsWith('PA6') || m.startsWith('PA12') || m.startsWith('PAHT') || m === 'PEEK' || m === 'PEI') return 'engineering';
  if (m === 'PCTG' || m === 'PCABS' || m.startsWith('PC+') || m.startsWith('PCPBT')) return 'engineering';
  // Support
  if (['PVA', 'HIPS', 'BVOH'].some(x => m === x || m.startsWith(x))) return 'support';
  // Specialty (exact matches to avoid PE matching PETG/PEEK)
  if (['PP', 'EVA', 'WOOD', 'METAL', 'PEARL', 'PVDF', 'FLAX'].some(x => m === x || m.startsWith(x + '+'))) return 'specialty';
  if (m === 'PE') return 'specialty';
  return 'standard';
}

function normalizeBrandKey(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function loadSpoolmanDb() {
  const path = join(__dirname_seed, 'spoolmandb.json');
  if (!existsSync(path)) return [];
  const items = JSON.parse(readFileSync(path, 'utf8'));
  return items.map(item => {
    const tempRange = item.extruder_temp_range || [];
    const bedRange = item.bed_temp_range || [];
    return {
      manufacturer: item.manufacturer,
      name: item.name || null,
      material: item.material || 'PLA',
      density: item.density || null,
      diameter: item.diameter || 1.75,
      weight: item.weight || 1000,
      spool_weight: item.spool_weight || null,
      extruder_temp: item.extruder_temp || null,
      bed_temp: item.bed_temp || null,
      color_name: item.color_name || item.name || null,
      color_hex: (item.color_hex || '').replace('#', '') || null,
      color_hexes: item.color_hexes ? JSON.stringify(item.color_hexes) : null,
      finish: item.finish || null,
      pattern: item.pattern || null,
      translucent: item.translucent ? 1 : 0,
      glow: item.glow ? 1 : 0,
      multi_color_direction: item.multi_color_direction || null,
      spool_type: item.spool_type || null,
      extruder_temp_min: tempRange[0] || null,
      extruder_temp_max: tempRange[1] || null,
      bed_temp_min: bedRange[0] || null,
      bed_temp_max: bedRange[1] || null,
      td_value: null,
      shore_hardness: null,
      source: 'spoolmandb',
      brand_key: normalizeBrandKey(item.manufacturer),
      category: categorize(item.material, null),
      external_source_id: `smdb:${normalizeBrandKey(item.manufacturer)}:${(item.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}:${item.material}`,
      updated_at: new Date().toISOString()
    };
  });
}

function load3dfpData(filePath) {
  if (!existsSync(filePath)) return [];
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));
  const filaments = raw.filaments || raw;
  if (!Array.isArray(filaments)) return [];

  return filaments.filter(f => !f.deleted).map(f => {
    const props = f.properties || {};
    const defaults = f.default_properties || {};
    const priceData = f.price_data || {};

    return {
      manufacturer: f.brand_name,
      name: f.color || null,
      material: f.material || 'PLA',
      material_type: f.material_type || null,
      color_name: f.color || null,
      color_hex: (f.rgb || '').replace('#', '') || null,
      extruder_temp: props.temp_max || defaults.temp_max || null,
      bed_temp: props.bed_temp_max || defaults.bed_temp_max || null,
      density: null,
      diameter: 1.75,
      weight: 1000,
      spool_weight: props.spool_weight || defaults.spool_weight || null,
      pressure_advance_k: (props.k_value != null && props.k_value > 0) ? props.k_value : null,
      max_volumetric_speed: defaults.max_volumetric_speed || null,
      flow_ratio: props.flow_ratio || defaults.flow_ratio || null,
      fan_speed_min: props.fan_speed_min || defaults.fan_speed_min || null,
      fan_speed_max: props.fan_speed_max || defaults.fan_speed_max || null,
      chamber_temp: defaults.chamber_temp || null,
      td_value: (f.td_value && f.td_value > 0) ? f.td_value : null,
      total_td_votes: f.total_td_votes || 0,
      image_url: priceData.image?.url || null,
      purchase_url: f.website || priceData.href || null,
      price: priceData.price || null,
      price_currency: priceData.listings?.[0]?.price?.currency || (priceData.price ? 'USD' : null),
      brand_key: f.brand_key || normalizeBrandKey(f.brand_name),
      category: categorize(f.material, f.material_type),
      source: '3dfp',
      external_source_id: `3dfp:${f.id}`,
      updated_at: f.updated_at || new Date().toISOString()
    };
  });
}

async function fetch3dfpData() {
  console.log('[seed] Fetching from 3dfilamentprofiles.com...');
  try {
    const resp = await fetch('https://3dfilamentprofiles.com/filaments', {
      headers: {
        'rsc': '1',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(30000)
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();

    // Parse RSC format: lines are ref_id:json_content
    const lines = text.split('\n').filter(l => l.includes(':'));
    const refs = {};
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx < 0) continue;
      const refId = line.substring(0, colonIdx).trim();
      const content = line.substring(colonIdx + 1).trim();
      if (content.startsWith('{') || content.startsWith('[')) {
        try { refs[refId] = JSON.parse(content); } catch { /* skip */ }
      }
    }

    // Find the filaments array in parsed refs
    for (const val of Object.values(refs)) {
      if (val?.filaments && Array.isArray(val.filaments)) {
        const outPath = join(__dirname_seed, 'filament-profiles-data.json');
        writeFileSync(outPath, JSON.stringify(val, null, 2));
        console.log(`[seed] Saved ${val.filaments.length} filaments to filament-profiles-data.json`);
        return val.filaments.length;
      }
      // Check nested data nodes
      if (Array.isArray(val)) {
        for (const item of val) {
          if (item?.filaments && Array.isArray(item.filaments)) {
            const outPath = join(__dirname_seed, 'filament-profiles-data.json');
            writeFileSync(outPath, JSON.stringify(item, null, 2));
            console.log(`[seed] Saved ${item.filaments.length} filaments to filament-profiles-data.json`);
            return item.filaments.length;
          }
        }
      }
    }

    // Try finding any large array that looks like filament data
    for (const val of Object.values(refs)) {
      if (Array.isArray(val) && val.length > 100 && val[0]?.brand_name) {
        const outPath = join(__dirname_seed, 'filament-profiles-data.json');
        writeFileSync(outPath, JSON.stringify({ filaments: val }, null, 2));
        console.log(`[seed] Saved ${val.length} filaments to filament-profiles-data.json`);
        return val.length;
      }
    }

    console.warn('[seed] Could not find filaments in RSC response. Using local data only.');
    return 0;
  } catch (e) {
    console.warn(`[seed] Failed to fetch from 3dfp: ${e.message}. Using local data only.`);
    return 0;
  }
}

export async function seedFilamentDatabase(options = {}) {
  const fetch3dfp = options.fetch3dfp !== false;
  let stats = { spoolmandb: 0, threedfp: 0, total: 0, upserted: 0 };

  // Try fetching 3dfp data if requested
  if (fetch3dfp) {
    await fetch3dfpData();
  }

  // Load SpoolmanDB data
  const spoolmanItems = loadSpoolmanDb();
  stats.spoolmandb = spoolmanItems.length;
  console.log(`[seed] Loaded ${spoolmanItems.length} filaments from SpoolmanDB`);

  // Load 3dfp data if available
  const threeDfpPath = join(__dirname_seed, 'filament-profiles-data.json');
  const threeDfpItems = load3dfpData(threeDfpPath);
  stats.threedfp = threeDfpItems.length;
  console.log(`[seed] Loaded ${threeDfpItems.length} filaments from 3DFilamentProfiles`);

  // Merge: 3dfp first (has richer data), then spoolmandb fills gaps
  const allItems = [...threeDfpItems, ...spoolmanItems];
  stats.total = allItems.length;

  // Upsert all items
  let count = 0;
  const batchSize = 500;
  for (let i = 0; i < allItems.length; i += batchSize) {
    const batch = allItems.slice(i, i + batchSize);
    for (const item of batch) {
      try {
        upsertCommunityFilament(item);
        count++;
      } catch (e) {
        // Skip individual failures
      }
    }
    if (i % 2000 === 0 && i > 0) console.log(`[seed] Progress: ${i}/${allItems.length}`);
  }

  stats.upserted = count;
  console.log(`[seed] Done. Upserted ${count} filaments.`);
  return stats;
}

// CLI entry point
if (process.argv[1]?.endsWith('seed-filament-db.js')) {
  initDatabase();
  const args = process.argv.slice(2);
  const fetch3dfp = args.includes('--fetch-3dfp') || args.includes('--fetch');
  seedFilamentDatabase({ fetch3dfp }).then(stats => {
    console.log('[seed] Final stats:', JSON.stringify(stats));
    process.exit(0);
  }).catch(e => {
    console.error('[seed] Error:', e);
    process.exit(1);
  });
}
