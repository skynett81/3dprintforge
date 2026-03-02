import { DatabaseSync } from 'node:sqlite';
import { join, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DATA_DIR } from './config.js';

const __filename_db = fileURLToPath(import.meta.url);
const __dirname_db = dirname(__filename_db);

const DB_PATH = join(DATA_DIR, 'dashboard.db');
let db;

export function initDatabase() {
  db = new DatabaseSync(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS printers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      ip TEXT,
      serial TEXT,
      access_code TEXT,
      model TEXT,
      added_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS print_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      filename TEXT,
      status TEXT,
      duration_seconds INTEGER,
      filament_used_g REAL,
      filament_type TEXT,
      filament_color TEXT,
      layer_count INTEGER,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS filament_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      type TEXT NOT NULL,
      color_name TEXT,
      color_hex TEXT,
      weight_total_g REAL DEFAULT 1000,
      weight_used_g REAL DEFAULT 0,
      cost_nok REAL,
      purchase_date TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS error_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      timestamp TEXT NOT NULL,
      code TEXT,
      message TEXT,
      severity TEXT
    );

    CREATE TABLE IF NOT EXISTS filament_waste (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      timestamp TEXT DEFAULT (datetime('now')),
      waste_g REAL NOT NULL,
      reason TEXT DEFAULT 'manual',
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS nozzle_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      nozzle_type TEXT NOT NULL,
      nozzle_diameter REAL NOT NULL,
      installed_at TEXT DEFAULT (datetime('now')),
      retired_at TEXT,
      total_print_hours REAL DEFAULT 0,
      total_filament_g REAL DEFAULT 0,
      abrasive_filament_g REAL DEFAULT 0,
      print_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS maintenance_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      component TEXT NOT NULL,
      action TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      notes TEXT,
      nozzle_type TEXT,
      nozzle_diameter REAL
    );

    CREATE TABLE IF NOT EXISTS maintenance_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      component TEXT NOT NULL,
      interval_hours REAL NOT NULL,
      label TEXT,
      enabled INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS ams_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      timestamp TEXT DEFAULT (datetime('now')),
      ams_unit INTEGER,
      tray_id INTEGER,
      tray_type TEXT,
      tray_color TEXT,
      tray_brand TEXT,
      tray_name TEXT,
      remain_pct INTEGER,
      humidity TEXT,
      ams_temp TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_history_printer ON print_history(printer_id);
    CREATE INDEX IF NOT EXISTS idx_errors_printer ON error_log(printer_id);
    CREATE INDEX IF NOT EXISTS idx_waste_printer ON filament_waste(printer_id);
    CREATE INDEX IF NOT EXISTS idx_nozzle_printer ON nozzle_sessions(printer_id);
    CREATE INDEX IF NOT EXISTS idx_maintenance_printer ON maintenance_log(printer_id);
    CREATE INDEX IF NOT EXISTS idx_ams_snap_printer ON ams_snapshots(printer_id);
  `);

  // Migrate: add columns to print_history if missing
  const newCols = [
    ['color_changes', 'INTEGER DEFAULT 0'],
    ['waste_g', 'REAL DEFAULT 0'],
    ['nozzle_type', 'TEXT'],
    ['nozzle_diameter', 'REAL'],
    ['speed_level', 'INTEGER'],
    ['bed_target', 'REAL'],
    ['nozzle_target', 'REAL'],
    ['max_nozzle_temp', 'REAL'],
    ['max_bed_temp', 'REAL'],
    ['filament_brand', 'TEXT'],
    ['ams_units_used', 'INTEGER'],
    ['tray_id', 'TEXT']
  ];
  for (const [col, type] of newCols) {
    try { db.exec(`ALTER TABLE print_history ADD COLUMN ${col} ${type}`); } catch (e) { /* exists */ }
  }

  // Run versioned migrations
  _runMigrations();

  console.log('[db] Database klar:', DB_PATH);
  return db;
}

// ---- Migration System ----

function _runMigrations() {
  const row = db.prepare('SELECT MAX(version) as v FROM schema_version').get();
  const currentVersion = row?.v || 0;

  const migrations = [
    { version: 1, up: _mig001_telemetry },
    { version: 2, up: _mig002_ams_extended },
    { version: 3, up: _mig003_component_wear },
    { version: 4, up: _mig004_firmware_history },
    { version: 5, up: _mig005_xcam_events },
    { version: 6, up: _mig006_ams_tray_lifetime },
    { version: 7, up: _mig007_nozzle_index },
    { version: 8, up: _mig008_filament_printer_id },
    { version: 9, up: _mig009_notifications },
    { version: 10, up: _mig010_update_history },
    { version: 11, up: _mig011_protection },
    { version: 12, up: _mig012_sensor_guards },
    { version: 13, up: _mig013_model_links },
    { version: 14, up: _mig014_model_links_metadata },
    { version: 15, up: _mig015_inventory_system },
    { version: 16, up: _mig016_inventory_enhancements },
    { version: 17, up: _mig017_finish_weights_settings },
    { version: 18, up: _mig018_external_id_fields_diameters },
    { version: 19, up: _mig019_filament_price },
    { version: 20, up: _mig020_spool_tare_weight },
    { version: 21, up: _mig021_error_acknowledged },
    { version: 22, up: _mig022_drying_management },
    { version: 23, up: _mig023_enhanced_profiles },
    { version: 24, up: _mig024_print_queue },
    { version: 25, up: _mig025_tags },
    { version: 26, up: _mig026_nfc },
    { version: 27, up: _mig027_checkout },
    { version: 28, up: _mig028_spool_events },
    { version: 29, up: _mig029_macros },
    { version: 30, up: _mig030_webhooks },
    { version: 31, up: _mig031_print_costs },
    { version: 32, up: _mig032_materials },
    { version: 33, up: _mig033_hardware },
    { version: 34, up: _mig034_permissions },
    { version: 35, up: _mig035_api_keys },
    { version: 36, up: _mig036_ecommerce },
    { version: 37, up: _mig037_timelapse },
    { version: 38, up: _mig038_push_subscriptions },
    { version: 39, up: _mig039_community_filaments },
    { version: 40, up: _mig040_brand_defaults },
    { version: 41, up: _mig041_custom_fields },
    { version: 42, up: _mig042_printer_groups },
    { version: 43, up: _mig043_projects },
    { version: 44, up: _mig044_export_templates },
    { version: 45, up: _mig045_totp },
    { version: 46, up: _mig046_user_quotas },
    { version: 47, up: _mig047_hub_kiosk },
    { version: 48, up: _mig048_failure_detection },
    { version: 49, up: _mig049_price_history },
    { version: 50, up: _mig050_multi_plate },
    { version: 51, up: _mig051_dryer_storage },
    { version: 52, up: _mig052_courses },
    { version: 53, up: _mig053_ecom_license },
    { version: 54, up: _mig054_learning_center_v2 },
  ];

  for (const m of migrations) {
    if (m.version > currentVersion) {
      try {
        m.up();
        db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(m.version);
        console.log(`[db] Migrering v${m.version} fullført`);
      } catch (e) {
        console.error(`[db] Migrering v${m.version} feilet:`, e.message);
      }
    }
  }
}

function _mig001_telemetry() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      nozzle_temp REAL,
      bed_temp REAL,
      chamber_temp REAL,
      nozzle_target REAL,
      bed_target REAL,
      fan_cooling INTEGER,
      fan_aux INTEGER,
      fan_chamber INTEGER,
      fan_heatbreak INTEGER,
      speed_mag INTEGER,
      wifi_signal TEXT,
      print_progress INTEGER,
      layer_num INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_telemetry_printer_time ON telemetry(printer_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_telemetry_time ON telemetry(timestamp);
  `);
}

function _mig002_ams_extended() {
  const cols = [
    ['tag_uid', 'TEXT'],
    ['tray_uuid', 'TEXT'],
    ['tray_info_idx', 'TEXT'],
    ['tray_weight', 'REAL'],
    ['tray_diameter', 'REAL'],
    ['drying_temp', 'INTEGER'],
    ['drying_time', 'INTEGER'],
    ['nozzle_temp_min', 'INTEGER'],
    ['nozzle_temp_max', 'INTEGER'],
    ['bed_temp_recommend', 'INTEGER'],
    ['k_value', 'REAL']
  ];
  for (const [col, type] of cols) {
    try { db.exec(`ALTER TABLE ams_snapshots ADD COLUMN ${col} ${type}`); } catch (e) { /* exists */ }
  }
}

function _mig003_component_wear() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS component_wear (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      component TEXT NOT NULL,
      total_hours REAL DEFAULT 0,
      total_cycles INTEGER DEFAULT 0,
      last_updated TEXT DEFAULT (datetime('now')),
      UNIQUE(printer_id, component)
    );
    CREATE INDEX IF NOT EXISTS idx_component_wear_printer ON component_wear(printer_id);
  `);
}

function _mig004_firmware_history() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS firmware_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      module TEXT NOT NULL,
      sw_ver TEXT,
      hw_ver TEXT,
      sn TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_firmware_printer ON firmware_history(printer_id, module);
  `);
}

function _mig005_xcam_events() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS xcam_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      event_type TEXT NOT NULL,
      action_taken TEXT,
      print_id INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_xcam_printer ON xcam_events(printer_id);
  `);
}

function _mig006_ams_tray_lifetime() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ams_tray_lifetime (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      ams_unit INTEGER NOT NULL,
      tray_id INTEGER NOT NULL,
      tray_uuid TEXT,
      total_filament_used_g REAL DEFAULT 0,
      first_seen TEXT DEFAULT (datetime('now')),
      last_seen TEXT DEFAULT (datetime('now')),
      spool_changes INTEGER DEFAULT 0,
      UNIQUE(printer_id, ams_unit, tray_id, tray_uuid)
    );
  `);
}

function _mig007_nozzle_index() {
  try { db.exec('ALTER TABLE nozzle_sessions ADD COLUMN nozzle_index INTEGER DEFAULT 0'); } catch (e) { /* exists */ }
}

function _mig008_filament_printer_id() {
  try { db.exec('ALTER TABLE filament_inventory ADD COLUMN printer_id TEXT'); } catch (e) { /* exists */ }
  try { db.exec('CREATE INDEX IF NOT EXISTS idx_filament_printer ON filament_inventory(printer_id)'); } catch (e) { /* exists */ }
}

function _mig009_notifications() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notification_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      event_type TEXT NOT NULL,
      channel TEXT NOT NULL,
      printer_id TEXT,
      title TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'sent',
      error_info TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_notif_log_time ON notification_log(timestamp);
    CREATE INDEX IF NOT EXISTS idx_notif_log_printer ON notification_log(printer_id);

    CREATE TABLE IF NOT EXISTS notification_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queued_at TEXT NOT NULL DEFAULT (datetime('now')),
      event_type TEXT NOT NULL,
      printer_id TEXT,
      printer_name TEXT,
      title TEXT,
      message TEXT,
      event_data TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_notif_queue_time ON notification_queue(queued_at);
  `);
}

function _mig010_update_history() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS update_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      from_version TEXT NOT NULL,
      to_version TEXT NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'started',
      backup_path TEXT,
      error_message TEXT,
      duration_ms INTEGER
    );
  `);
}

function _mig011_protection() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS protection_settings (
      printer_id TEXT PRIMARY KEY,
      enabled INTEGER NOT NULL DEFAULT 1,
      spaghetti_action TEXT NOT NULL DEFAULT 'pause',
      first_layer_action TEXT NOT NULL DEFAULT 'notify',
      foreign_object_action TEXT NOT NULL DEFAULT 'pause',
      nozzle_clump_action TEXT NOT NULL DEFAULT 'pause',
      cooldown_seconds INTEGER NOT NULL DEFAULT 60,
      auto_resume INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS protection_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      event_type TEXT NOT NULL,
      action_taken TEXT NOT NULL,
      print_id INTEGER,
      resolved INTEGER NOT NULL DEFAULT 0,
      resolved_at TEXT,
      notes TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_protection_log_printer ON protection_log(printer_id);
  `);
}

function _mig012_sensor_guards() {
  const cols = [
    ['temp_deviation_action', "TEXT NOT NULL DEFAULT 'notify'"],
    ['filament_runout_action', "TEXT NOT NULL DEFAULT 'notify'"],
    ['print_error_action', "TEXT NOT NULL DEFAULT 'notify'"],
    ['fan_failure_action', "TEXT NOT NULL DEFAULT 'notify'"],
    ['print_stall_action', "TEXT NOT NULL DEFAULT 'notify'"],
    ['temp_deviation_threshold', 'INTEGER NOT NULL DEFAULT 15'],
    ['filament_low_pct', 'INTEGER NOT NULL DEFAULT 5'],
    ['stall_minutes', 'INTEGER NOT NULL DEFAULT 10']
  ];
  for (const [col, type] of cols) {
    try { db.exec(`ALTER TABLE protection_settings ADD COLUMN ${col} ${type}`); } catch (e) { /* exists */ }
  }
}

function _mig013_model_links() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS model_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      filename TEXT NOT NULL,
      source TEXT NOT NULL,
      source_id TEXT NOT NULL,
      title TEXT,
      url TEXT,
      image TEXT,
      designer TEXT,
      linked_at TEXT DEFAULT (datetime('now')),
      UNIQUE(printer_id, filename)
    );
    CREATE INDEX IF NOT EXISTS idx_model_links_printer ON model_links(printer_id);
    CREATE INDEX IF NOT EXISTS idx_model_links_filename ON model_links(filename);
  `);
}

function _mig014_model_links_metadata() {
  const cols = [
    ['description', 'TEXT'],
    ['category', 'TEXT'],
    ['print_settings', 'TEXT']
  ];
  for (const [col, type] of cols) {
    try { db.exec(`ALTER TABLE model_links ADD COLUMN ${col} ${type}`); } catch (e) { /* exists */ }
  }
}

function _mig015_inventory_system() {
  // Vendors
  db.exec(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      website TEXT,
      empty_spool_weight_g REAL,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Filament profiles (a SKU / product)
  db.exec(`
    CREATE TABLE IF NOT EXISTS filament_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER REFERENCES vendors(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      material TEXT NOT NULL,
      color_name TEXT,
      color_hex TEXT,
      density REAL DEFAULT 1.24,
      diameter REAL DEFAULT 1.75,
      spool_weight_g REAL DEFAULT 1000,
      nozzle_temp_min INTEGER,
      nozzle_temp_max INTEGER,
      bed_temp_min INTEGER,
      bed_temp_max INTEGER,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_fp_vendor ON filament_profiles(vendor_id);
    CREATE INDEX IF NOT EXISTS idx_fp_material ON filament_profiles(material);
  `);

  // Individual spools
  db.exec(`
    CREATE TABLE IF NOT EXISTS spools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filament_profile_id INTEGER REFERENCES filament_profiles(id) ON DELETE SET NULL,
      remaining_weight_g REAL DEFAULT 1000,
      used_weight_g REAL DEFAULT 0,
      initial_weight_g REAL DEFAULT 1000,
      cost REAL,
      lot_number TEXT,
      purchase_date TEXT,
      first_used_at TEXT,
      last_used_at TEXT,
      location TEXT,
      printer_id TEXT,
      ams_unit INTEGER,
      ams_tray INTEGER,
      archived INTEGER DEFAULT 0,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_spools_profile ON spools(filament_profile_id);
    CREATE INDEX IF NOT EXISTS idx_spools_printer ON spools(printer_id);
    CREATE INDEX IF NOT EXISTS idx_spools_archived ON spools(archived);
    CREATE INDEX IF NOT EXISTS idx_spools_slot ON spools(printer_id, ams_unit, ams_tray);
  `);

  // Usage log per print
  db.exec(`
    CREATE TABLE IF NOT EXISTS spool_usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spool_id INTEGER NOT NULL REFERENCES spools(id) ON DELETE CASCADE,
      print_history_id INTEGER REFERENCES print_history(id) ON DELETE SET NULL,
      printer_id TEXT,
      used_weight_g REAL NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      source TEXT DEFAULT 'auto'
    );
    CREATE INDEX IF NOT EXISTS idx_sul_spool ON spool_usage_log(spool_id);
    CREATE INDEX IF NOT EXISTS idx_sul_time ON spool_usage_log(timestamp);
  `);

  // Storage locations
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Migrate existing filament_inventory data into the new system
  _migrateFilamentInventory();
}

function _migrateFilamentInventory() {
  const rows = db.prepare('SELECT * FROM filament_inventory').all();
  if (rows.length === 0) return;

  console.log(`[db] Migrating ${rows.length} filament_inventory rows to new inventory system...`);

  // Step 1: Extract unique vendors
  const vendorMap = new Map(); // brand -> vendor_id
  for (const row of rows) {
    const brand = (row.brand || '').trim();
    if (brand && !vendorMap.has(brand)) {
      try {
        const result = db.prepare('INSERT INTO vendors (name) VALUES (?)').run(brand);
        vendorMap.set(brand, Number(result.lastInsertRowid));
      } catch {
        // UNIQUE constraint — already exists
        const existing = db.prepare('SELECT id FROM vendors WHERE name = ?').get(brand);
        if (existing) vendorMap.set(brand, existing.id);
      }
    }
  }

  // Step 2: Extract unique filament profiles
  const profileMap = new Map(); // "brand|type|color_name|color_hex" -> profile_id
  for (const row of rows) {
    const brand = (row.brand || '').trim();
    const key = `${brand}|${row.type}|${row.color_name || ''}|${row.color_hex || ''}`;
    if (!profileMap.has(key)) {
      const vendorId = vendorMap.get(brand) || null;
      const result = db.prepare(`
        INSERT INTO filament_profiles (vendor_id, name, material, color_name, color_hex, spool_weight_g)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(vendorId, `${brand ? brand + ' ' : ''}${row.type}${row.color_name ? ' ' + row.color_name : ''}`,
        row.type, row.color_name || null, row.color_hex || null, row.weight_total_g || 1000);
      profileMap.set(key, Number(result.lastInsertRowid));
    }
  }

  // Step 3: Create spools from each inventory row
  for (const row of rows) {
    const brand = (row.brand || '').trim();
    const key = `${brand}|${row.type}|${row.color_name || ''}|${row.color_hex || ''}`;
    const profileId = profileMap.get(key);
    const remaining = (row.weight_total_g || 1000) - (row.weight_used_g || 0);
    db.prepare(`
      INSERT INTO spools (filament_profile_id, remaining_weight_g, used_weight_g, initial_weight_g, cost, purchase_date, printer_id, comment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(profileId, Math.max(0, remaining), row.weight_used_g || 0, row.weight_total_g || 1000,
      row.cost_nok || null, row.purchase_date || null, row.printer_id || null, row.notes || null);
  }

  console.log(`[db] Migrated: ${vendorMap.size} vendors, ${profileMap.size} profiles, ${rows.length} spools`);
}

function _mig016_inventory_enhancements() {
  // Multi-color + article number + extra fields for filament_profiles
  const fpCols = [
    ['multi_color_hexes', 'TEXT'],
    ['multi_color_direction', 'TEXT'],
    ['article_number', 'TEXT'],
    ['extra_fields', 'TEXT'],
  ];
  for (const [col, type] of fpCols) {
    try { db.exec(`ALTER TABLE filament_profiles ADD COLUMN ${col} ${type}`); } catch {}
  }
  try { db.exec('CREATE INDEX IF NOT EXISTS idx_fp_article ON filament_profiles(article_number)'); } catch {}

  // Extra fields for vendors
  try { db.exec('ALTER TABLE vendors ADD COLUMN extra_fields TEXT'); } catch {}

  // Extra fields for spools
  try { db.exec('ALTER TABLE spools ADD COLUMN extra_fields TEXT'); } catch {}
}

function _mig017_finish_weights_settings() {
  // Filament finish properties + spool weight options
  const fpCols = [
    ['finish', 'TEXT'],           // matte, glossy, satin, silk
    ['translucent', 'INTEGER'],   // 0 or 1
    ['glow', 'INTEGER'],          // 0 or 1
    ['weight_options', 'TEXT'],   // JSON array e.g. [250, 500, 1000]
  ];
  for (const [col, type] of fpCols) {
    try { db.exec(`ALTER TABLE filament_profiles ADD COLUMN ${col} ${type}`); } catch {}
  }

  // Inventory settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
}

function _mig018_external_id_fields_diameters() {
  // external_id on vendors and filament_profiles (for SpoolmanDB linking)
  for (const [tbl, col] of [['vendors','external_id'],['filament_profiles','external_id'],['filament_profiles','diameters']]) {
    try { db.exec(`ALTER TABLE ${tbl} ADD COLUMN ${col} TEXT`); } catch {}
  }

  // Custom field schema definitions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS field_schemas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      key TEXT NOT NULL,
      name TEXT NOT NULL,
      field_type TEXT NOT NULL DEFAULT 'text',
      unit TEXT,
      UNIQUE(entity_type, key)
    )
  `);

  // Migrate weight_options (simple array) to weights (array of objects with spool_type)
  // Only if weight_options has values and weights column doesn't exist yet
  try { db.exec(`ALTER TABLE filament_profiles ADD COLUMN weights TEXT`); } catch {}
  // Migrate existing weight_options to weights format
  const profiles = db.prepare('SELECT id, weight_options, spool_weight_g FROM filament_profiles WHERE weight_options IS NOT NULL').all();
  for (const p of profiles) {
    try {
      const opts = JSON.parse(p.weight_options);
      if (Array.isArray(opts) && opts.length > 0) {
        const weights = opts.map(w => ({ weight: w, spool_weight: p.spool_weight_g || null, spool_type: 'plastic' }));
        db.prepare('UPDATE filament_profiles SET weights = ? WHERE id = ?').run(JSON.stringify(weights), p.id);
      }
    } catch {}
  }
}

function _mig019_filament_price() {
  try { db.exec('ALTER TABLE filament_profiles ADD COLUMN price REAL'); } catch {}
}

function _mig020_spool_tare_weight() {
  try { db.exec('ALTER TABLE spools ADD COLUMN spool_weight REAL'); } catch {}
}

function _mig021_error_acknowledged() {
  try { db.exec('ALTER TABLE error_log ADD COLUMN acknowledged INTEGER DEFAULT 0'); } catch {}
}

function _mig022_drying_management() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS drying_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spool_id INTEGER NOT NULL REFERENCES spools(id) ON DELETE CASCADE,
      temperature INTEGER,
      duration_minutes INTEGER NOT NULL,
      method TEXT NOT NULL DEFAULT 'dryer_box',
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      humidity_before REAL,
      humidity_after REAL,
      notes TEXT,
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE INDEX IF NOT EXISTS idx_drying_spool ON drying_sessions(spool_id);
    CREATE INDEX IF NOT EXISTS idx_drying_active ON drying_sessions(active);
    CREATE INDEX IF NOT EXISTS idx_drying_started ON drying_sessions(started_at);

    CREATE TABLE IF NOT EXISTS drying_presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material TEXT NOT NULL UNIQUE,
      temperature INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      max_days_without_drying INTEGER DEFAULT 30,
      notes TEXT
    );
  `);

  const defaults = [
    ['PLA', 50, 240, 30],
    ['PLA+', 50, 240, 30],
    ['PLA Matte', 50, 240, 30],
    ['PLA Silk', 50, 240, 30],
    ['PETG', 65, 360, 14],
    ['PETG-CF', 65, 360, 14],
    ['ABS', 80, 240, 14],
    ['ASA', 80, 240, 14],
    ['TPU', 55, 300, 7],
    ['TPU 95A', 55, 300, 7],
    ['PA', 80, 480, 2],
    ['PA-CF', 80, 480, 2],
    ['PA-GF', 80, 480, 2],
    ['PA6-CF', 80, 480, 2],
    ['PAHT-CF', 80, 480, 2],
    ['PC', 80, 360, 7],
    ['PVA', 45, 360, 1],
    ['HIPS', 70, 240, 14],
    ['PET-CF', 65, 360, 14],
    ['PPA-CF', 80, 480, 5],
    ['PPA-GF', 80, 480, 5],
    ['PP', 60, 360, 14],
    ['BVOH', 45, 360, 1],
  ];
  const stmt = db.prepare('INSERT OR IGNORE INTO drying_presets (material, temperature, duration_minutes, max_days_without_drying) VALUES (?, ?, ?, ?)');
  for (const [mat, temp, dur, days] of defaults) {
    stmt.run(mat, temp, dur, days);
  }

  try { db.exec('ALTER TABLE spools ADD COLUMN last_dried_at TEXT'); } catch {}
}

function _mig023_enhanced_profiles() {
  try { db.exec('ALTER TABLE filament_profiles ADD COLUMN pressure_advance_k REAL'); } catch {}
  try { db.exec('ALTER TABLE filament_profiles ADD COLUMN max_volumetric_speed REAL'); } catch {}
  try { db.exec('ALTER TABLE filament_profiles ADD COLUMN retraction_distance REAL'); } catch {}
  try { db.exec('ALTER TABLE filament_profiles ADD COLUMN retraction_speed REAL'); } catch {}
  try { db.exec('ALTER TABLE filament_profiles ADD COLUMN cooling_fan_speed INTEGER'); } catch {}
  try { db.exec('ALTER TABLE filament_profiles ADD COLUMN optimal_settings TEXT'); } catch {}
}

function _mig024_print_queue() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS print_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      auto_start INTEGER DEFAULT 0,
      cooldown_seconds INTEGER DEFAULT 60,
      bed_clear_gcode TEXT,
      priority_mode TEXT DEFAULT 'fifo',
      target_printer_id TEXT,
      created_by TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_pq_status ON print_queue(status);

    CREATE TABLE IF NOT EXISTS queue_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_id INTEGER NOT NULL REFERENCES print_queue(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      printer_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority INTEGER DEFAULT 0,
      copies INTEGER DEFAULT 1,
      copies_completed INTEGER DEFAULT 0,
      print_history_id INTEGER REFERENCES print_history(id),
      estimated_duration_s INTEGER,
      estimated_filament_g REAL,
      required_material TEXT,
      required_nozzle_mm REAL,
      notes TEXT,
      added_at TEXT DEFAULT (datetime('now')),
      started_at TEXT,
      completed_at TEXT,
      sort_order INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_qi_queue ON queue_items(queue_id);
    CREATE INDEX IF NOT EXISTS idx_qi_status ON queue_items(status);
    CREATE INDEX IF NOT EXISTS idx_qi_printer ON queue_items(printer_id);

    CREATE TABLE IF NOT EXISTS queue_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_id INTEGER REFERENCES print_queue(id),
      item_id INTEGER REFERENCES queue_items(id),
      printer_id TEXT,
      event TEXT NOT NULL,
      details TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_ql_queue ON queue_log(queue_id);
  `);
}

function _mig025_tags() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT DEFAULT 'custom',
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS entity_tags (
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (entity_type, entity_id, tag_id)
    );
    CREATE INDEX IF NOT EXISTS idx_entity_tags ON entity_tags(entity_type, entity_id);
  `);
}

function _mig026_nfc() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS nfc_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag_uid TEXT NOT NULL UNIQUE,
      spool_id INTEGER REFERENCES spools(id) ON DELETE SET NULL,
      standard TEXT DEFAULT 'openspool',
      data TEXT,
      last_scanned TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_nfc_spool ON nfc_mappings(spool_id);
  `);
}

function _mig027_checkout() {
  const cols = [
    ['checked_out', 'INTEGER DEFAULT 0'],
    ['checked_out_at', 'TEXT'],
    ['checked_out_by', 'TEXT'],
    ['checked_out_from', 'TEXT']
  ];
  for (const [col, type] of cols) {
    try { db.exec(`ALTER TABLE spools ADD COLUMN ${col} ${type}`); } catch (e) { /* exists */ }
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS spool_checkout_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spool_id INTEGER NOT NULL REFERENCES spools(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      from_location TEXT,
      to_location TEXT,
      actor TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_checkout_spool ON spool_checkout_log(spool_id);
  `);
}

function _mig028_spool_events() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS spool_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spool_id INTEGER NOT NULL REFERENCES spools(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      details TEXT,
      actor TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_spool_events_spool ON spool_events(spool_id);
    CREATE INDEX IF NOT EXISTS idx_spool_events_type ON spool_events(event_type);
  `);
}

function _mig029_macros() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS gcode_macros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      gcode TEXT NOT NULL,
      category TEXT DEFAULT 'manual',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  // Seed preset macros
  const presets = [
    ['Home All', 'Home all axes', 'G28', 'maintenance'],
    ['Bed Level', 'Auto bed leveling', 'G29', 'maintenance'],
    ['PID Tune Nozzle', 'PID autotune nozzle at 200C', 'M303 E0 S200 C8', 'maintenance'],
    ['Disable Steppers', 'Disable stepper motors', 'M84', 'manual'],
    ['Clear Bed', 'Move printhead up and bed forward for clearing', 'G91\nG1 Z50 F600\nG90\nG1 Y250 F3000', 'post_print']
  ];
  const stmt = db.prepare('INSERT OR IGNORE INTO gcode_macros (name, description, gcode, category, sort_order) VALUES (?, ?, ?, ?, ?)');
  presets.forEach(([name, desc, gcode, cat], i) => {
    try { stmt.run(name, desc, gcode, cat, i + 1); } catch (_) {}
  });
}

function _mig030_webhooks() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS webhook_configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      secret TEXT,
      events TEXT DEFAULT '[]',
      headers TEXT DEFAULT '{}',
      template TEXT DEFAULT 'generic',
      retry_count INTEGER DEFAULT 3,
      retry_delay_s INTEGER DEFAULT 10,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS webhook_deliveries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      webhook_id INTEGER REFERENCES webhook_configs(id) ON DELETE CASCADE,
      event_type TEXT,
      payload TEXT,
      status TEXT DEFAULT 'pending',
      attempts INTEGER DEFAULT 0,
      last_attempt TEXT,
      response_code INTEGER,
      response_body TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function _mig031_print_costs() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS print_costs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      print_history_id INTEGER UNIQUE REFERENCES print_history(id) ON DELETE CASCADE,
      filament_cost REAL DEFAULT 0,
      electricity_cost REAL DEFAULT 0,
      depreciation_cost REAL DEFAULT 0,
      labor_cost REAL DEFAULT 0,
      markup_amount REAL DEFAULT 0,
      total_cost REAL DEFAULT 0,
      currency TEXT DEFAULT 'NOK',
      calculated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function _mig032_materials() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS material_reference (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material TEXT UNIQUE NOT NULL,
      category TEXT DEFAULT 'standard',
      difficulty INTEGER DEFAULT 1,
      strength INTEGER DEFAULT 3,
      temp_resistance INTEGER DEFAULT 3,
      moisture_sensitivity INTEGER DEFAULT 3,
      flexibility INTEGER DEFAULT 1,
      layer_adhesion INTEGER DEFAULT 3,
      nozzle_temp_min INTEGER,
      nozzle_temp_max INTEGER,
      bed_temp_min INTEGER,
      bed_temp_max INTEGER,
      chamber_temp INTEGER,
      enclosure INTEGER DEFAULT 0,
      typical_density REAL,
      tips TEXT,
      nozzle_recommendation TEXT,
      abrasive INTEGER DEFAULT 0,
      food_safe INTEGER DEFAULT 0,
      uv_resistant INTEGER DEFAULT 0
    );
  `);
  // Seed common materials
  const materials = [
    ['PLA', 'standard', 1, 2, 1, 2, 1, 4, 190, 230, 45, 65, null, 0, 1.24, '{"print":"Easy to print, good for beginners","storage":"Keep dry, UV sensitive","post":"Can be sanded and painted"}', 'brass', 0, 0, 0],
    ['PLA+', 'standard', 1, 3, 2, 2, 2, 4, 200, 230, 50, 65, null, 0, 1.24, '{"print":"Improved toughness over standard PLA","storage":"Keep dry","post":"Can be sanded and painted"}', 'brass', 0, 0, 0],
    ['PLA-CF', 'composite', 2, 4, 2, 2, 1, 3, 210, 240, 50, 65, null, 0, 1.29, '{"print":"Use hardened nozzle, reduced stringing","storage":"Keep dry","post":"Matte finish, limited post-processing"}', 'hardened_steel', 1, 0, 0],
    ['PETG', 'standard', 2, 3, 3, 3, 2, 4, 220, 260, 70, 90, null, 0, 1.27, '{"print":"Prone to stringing, use retraction","storage":"Absorbs moisture moderately","post":"Difficult to sand, can be painted"}', 'brass', 0, 1, 0],
    ['ABS', 'standard', 3, 3, 4, 2, 2, 3, 230, 260, 90, 110, 60, 1, 1.04, '{"print":"Needs enclosure, prone to warping","storage":"Moderate moisture sensitivity","post":"Acetone smoothing possible"}', 'brass', 0, 0, 0],
    ['ASA', 'standard', 3, 3, 4, 2, 2, 3, 235, 260, 90, 110, 60, 1, 1.07, '{"print":"Similar to ABS, better UV resistance","storage":"Moderate moisture sensitivity","post":"Acetone smoothing possible"}', 'brass', 0, 0, 1],
    ['TPU', 'flexible', 3, 2, 2, 2, 5, 4, 210, 240, 40, 60, null, 0, 1.21, '{"print":"Slow print speed, direct drive preferred","storage":"Absorbs moisture","post":"Flexible, difficult to post-process"}', 'brass', 0, 0, 0],
    ['TPU 95A', 'flexible', 3, 2, 2, 2, 5, 4, 210, 240, 40, 60, null, 0, 1.21, '{"print":"Shore 95A, moderate flexibility","storage":"Absorbs moisture","post":"Flexible parts"}', 'brass', 0, 0, 0],
    ['PA (Nylon)', 'engineering', 4, 4, 4, 5, 3, 5, 240, 270, 70, 90, 60, 1, 1.14, '{"print":"Very hygroscopic, dry before printing","storage":"Must be kept very dry","post":"Can be dyed, strong layer adhesion"}', 'brass', 0, 0, 0],
    ['PA-CF', 'composite', 4, 5, 5, 4, 1, 4, 260, 290, 80, 100, 60, 1, 1.18, '{"print":"Hardened nozzle required, dry filament","storage":"Extremely hygroscopic","post":"Strong lightweight parts"}', 'hardened_steel', 1, 0, 0],
    ['PA-GF', 'composite', 4, 5, 4, 4, 1, 4, 260, 290, 80, 100, 60, 1, 1.22, '{"print":"Hardened nozzle required, abrasive","storage":"Very hygroscopic","post":"Strong structural parts"}', 'hardened_steel', 1, 0, 0],
    ['PC', 'engineering', 4, 4, 5, 3, 2, 4, 260, 300, 100, 120, 70, 1, 1.20, '{"print":"High temps, enclosure required","storage":"Hygroscopic","post":"Very strong, heat resistant"}', 'brass', 0, 0, 1],
    ['PAHT-CF', 'composite', 5, 5, 5, 4, 1, 4, 280, 320, 90, 110, 70, 1, 1.20, '{"print":"High temp PA with carbon fiber","storage":"Keep sealed and dry","post":"Industrial strength parts"}', 'hardened_steel', 1, 0, 0],
    ['PET-CF', 'composite', 3, 4, 4, 3, 1, 3, 240, 270, 70, 90, null, 0, 1.30, '{"print":"Hardened nozzle recommended","storage":"Moderate moisture sensitivity","post":"Stiff and strong"}', 'hardened_steel', 1, 0, 0],
    ['PVA', 'support', 3, 1, 1, 5, 2, 3, 185, 210, 45, 60, null, 0, 1.23, '{"print":"Water soluble support material","storage":"Extremely hygroscopic, seal immediately","post":"Dissolves in warm water"}', 'brass', 0, 0, 0],
    ['HIPS', 'support', 2, 2, 3, 2, 2, 3, 220, 250, 90, 110, null, 1, 1.04, '{"print":"Dissolvable in limonene","storage":"Low moisture sensitivity","post":"Limonene bath to dissolve"}', 'brass', 0, 0, 0],
    ['PPA-CF', 'composite', 5, 5, 5, 4, 1, 4, 290, 320, 90, 110, 80, 1, 1.22, '{"print":"Very high temp, hardened nozzle","storage":"Keep sealed and dry","post":"Extreme performance parts"}', 'hardened_steel', 1, 0, 0],
    ['PPA-GF', 'composite', 5, 5, 5, 4, 1, 4, 290, 320, 90, 110, 80, 1, 1.25, '{"print":"Glass fiber reinforced, very abrasive","storage":"Keep sealed and dry","post":"Extreme temp resistance"}', 'hardened_steel', 1, 0, 0],
    ['PP', 'engineering', 3, 3, 3, 1, 4, 2, 210, 240, 80, 100, null, 0, 0.90, '{"print":"Poor bed adhesion, use PP sheet","storage":"Low moisture absorption","post":"Chemical resistant, food safe"}', 'brass', 0, 1, 0],
    ['PE', 'engineering', 3, 3, 3, 1, 4, 2, 200, 230, 70, 90, null, 0, 0.95, '{"print":"Difficult bed adhesion","storage":"Low moisture absorption","post":"Chemical resistant"}', 'brass', 0, 1, 0],
    ['PVDF', 'engineering', 4, 4, 5, 1, 2, 3, 240, 270, 100, 120, null, 1, 1.78, '{"print":"Chemical resistant engineering material","storage":"Low moisture sensitivity","post":"Excellent chemical resistance"}', 'brass', 0, 0, 0],
    ['POM', 'engineering', 3, 4, 4, 1, 3, 2, 200, 230, 100, 120, null, 0, 1.41, '{"print":"Low friction, poor bed adhesion","storage":"Low moisture sensitivity","post":"Self-lubricating parts"}', 'brass', 0, 0, 0],
    ['PEEK', 'high-performance', 5, 5, 5, 2, 1, 5, 370, 420, 120, 160, 120, 1, 1.30, '{"print":"Requires all-metal hotend, very high temps","storage":"Low moisture sensitivity","post":"CNC-like strength, autoclavable"}', 'hardened_steel', 0, 0, 1],
    ['PEI (ULTEM)', 'high-performance', 5, 5, 5, 2, 1, 4, 350, 400, 120, 160, 100, 1, 1.27, '{"print":"Extremely high temps, specialty printer","storage":"Low moisture sensitivity","post":"Flame retardant, autoclavable"}', 'hardened_steel', 0, 0, 1],
    ['CPE', 'engineering', 3, 3, 4, 3, 2, 3, 240, 270, 70, 90, null, 0, 1.25, '{"print":"Similar to PETG but higher temp resistance","storage":"Moderate moisture sensitivity","post":"Chemical resistant"}', 'brass', 0, 0, 0],
    ['Wood-PLA', 'specialty', 2, 1, 1, 2, 1, 3, 190, 220, 45, 65, null, 0, 1.15, '{"print":"Vary temperature for grain effect","storage":"Keep dry","post":"Can be sanded, stained, sealed"}', 'brass_large', 0, 0, 0],
    ['Silk PLA', 'specialty', 1, 2, 1, 2, 1, 4, 200, 230, 50, 65, null, 0, 1.24, '{"print":"Glossy silk finish, print slightly hotter","storage":"Keep dry","post":"Beautiful surface finish"}', 'brass', 0, 0, 0],
    ['PLA-Metal', 'specialty', 2, 2, 1, 2, 1, 3, 195, 225, 50, 65, null, 0, 2.0, '{"print":"Heavier than normal PLA, metal particles","storage":"Keep dry","post":"Can be polished for metallic look"}', 'hardened_steel', 1, 0, 0],
    ['PA6-CF', 'composite', 5, 5, 5, 5, 1, 4, 270, 300, 90, 110, 70, 1, 1.17, '{"print":"High performance carbon fiber nylon","storage":"Extremely hygroscopic","post":"Industrial grade strength"}', 'hardened_steel', 1, 0, 0],
    ['PA6-GF', 'composite', 5, 5, 4, 5, 1, 4, 270, 300, 90, 110, 70, 1, 1.23, '{"print":"Glass fiber nylon, very abrasive","storage":"Extremely hygroscopic","post":"Structural engineering parts"}', 'hardened_steel', 1, 0, 0],
  ];
  const stmt = db.prepare(`INSERT OR IGNORE INTO material_reference
    (material, category, difficulty, strength, temp_resistance, moisture_sensitivity, flexibility, layer_adhesion,
     nozzle_temp_min, nozzle_temp_max, bed_temp_min, bed_temp_max, chamber_temp, enclosure, typical_density,
     tips, nozzle_recommendation, abrasive, food_safe, uv_resistant)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  for (const m of materials) {
    try { stmt.run(...m); } catch (_) {}
  }
}

function _mig033_hardware() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS hardware_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      brand TEXT,
      model TEXT,
      compatible_printers TEXT DEFAULT '[]',
      specs TEXT DEFAULT '{}',
      purchase_price REAL,
      purchase_date TEXT,
      purchase_url TEXT,
      rating INTEGER,
      notes TEXT,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS hardware_printer_assignments (
      hardware_id INTEGER REFERENCES hardware_items(id) ON DELETE CASCADE,
      printer_id TEXT,
      installed_at TEXT DEFAULT (datetime('now')),
      removed_at TEXT,
      PRIMARY KEY (hardware_id, printer_id, installed_at)
    );
  `);
}

function _mig034_permissions() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      permissions TEXT DEFAULT '[]',
      description TEXT,
      is_default INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id INTEGER REFERENCES user_roles(id),
      display_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT
    );
  `);
  // Seed default roles
  const roles = [
    ['admin', '["*"]', 'Full access to all features', 0],
    ['operator', '["view","print","queue","controls","filament","macros"]', 'Can view and control printers, manage queue and filament', 0],
    ['viewer', '["view"]', 'Read-only access to dashboard', 1]
  ];
  const stmt = db.prepare('INSERT OR IGNORE INTO user_roles (name, permissions, description, is_default) VALUES (?, ?, ?, ?)');
  for (const r of roles) {
    try { stmt.run(...r); } catch (_) {}
  }
}

function _mig035_api_keys() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      permissions TEXT DEFAULT '["*"]',
      user_id INTEGER REFERENCES users(id),
      last_used TEXT,
      expires_at TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function _mig036_ecommerce() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ecommerce_configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL DEFAULT 'custom',
      name TEXT NOT NULL,
      webhook_secret TEXT,
      api_url TEXT,
      api_key TEXT,
      auto_queue INTEGER DEFAULT 0,
      target_queue_id INTEGER,
      sku_to_file_mapping TEXT DEFAULT '{}',
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ecommerce_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config_id INTEGER REFERENCES ecommerce_configs(id),
      order_id TEXT,
      platform_order_id TEXT,
      customer_name TEXT,
      items TEXT DEFAULT '[]',
      status TEXT DEFAULT 'received',
      queue_item_ids TEXT DEFAULT '[]',
      received_at TEXT DEFAULT (datetime('now')),
      fulfilled_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_ecom_orders_config ON ecommerce_orders(config_id);
    CREATE INDEX IF NOT EXISTS idx_ecom_orders_status ON ecommerce_orders(status);
  `);
}

function _mig037_timelapse() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS timelapse_recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT,
      print_history_id INTEGER,
      filename TEXT,
      format TEXT DEFAULT 'mp4',
      duration_seconds INTEGER,
      frame_count INTEGER DEFAULT 0,
      file_size_bytes INTEGER DEFAULT 0,
      file_path TEXT,
      status TEXT DEFAULT 'recording',
      started_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_timelapse_printer ON timelapse_recordings(printer_id);
    CREATE INDEX IF NOT EXISTS idx_timelapse_status ON timelapse_recordings(status);
  `);
}

function _mig038_push_subscriptions() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL UNIQUE,
      keys_p256dh TEXT,
      keys_auth TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

// ---- Migration v39-v52 ----

function _mig039_community_filaments() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS community_filaments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manufacturer TEXT NOT NULL,
      name TEXT,
      material TEXT NOT NULL,
      density REAL,
      diameter REAL DEFAULT 1.75,
      weight INTEGER DEFAULT 1000,
      spool_weight INTEGER,
      extruder_temp INTEGER,
      bed_temp INTEGER,
      color_name TEXT,
      color_hex TEXT,
      td_value REAL,
      shore_hardness TEXT,
      source TEXT DEFAULT 'spoolmandb',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_cf_manufacturer ON community_filaments(manufacturer);
    CREATE INDEX IF NOT EXISTS idx_cf_material ON community_filaments(material);
    CREATE INDEX IF NOT EXISTS idx_cf_color_hex ON community_filaments(color_hex);
  `);
  // Seed from spoolmandb.json
  try {
    const dataPath = join(__dirname_db, 'spoolmandb.json');
    const raw = readFileSync(dataPath, 'utf8');
    const items = JSON.parse(raw);
    const stmt = db.prepare('INSERT INTO community_filaments (manufacturer, name, material, density, diameter, weight, spool_weight, extruder_temp, bed_temp, color_name, color_hex, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const item of items) {
      stmt.run(item.manufacturer || null, item.name || null, item.material || 'PLA', item.density || null, item.diameter || 1.75, item.weight || 1000, item.spool_weight || null, item.extruder_temp || null, item.bed_temp || null, item.color_name || null, item.color_hex || null, 'spoolmandb');
    }
    console.log(`[db] Seeded ${items.length} community filaments`);
  } catch (e) {
    console.warn('[db] Could not seed community filaments:', e.message);
  }
}

function _mig040_brand_defaults() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brand_defaults (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manufacturer TEXT NOT NULL,
      material TEXT,
      default_density REAL,
      default_diameter REAL DEFAULT 1.75,
      default_spool_weight INTEGER,
      default_net_weight INTEGER DEFAULT 1000,
      default_extruder_temp INTEGER,
      default_bed_temp INTEGER,
      default_max_speed INTEGER,
      default_retraction REAL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(manufacturer, material)
    );
  `);
}

function _mig041_custom_fields() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS custom_field_defs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      field_name TEXT NOT NULL,
      field_label TEXT NOT NULL,
      field_type TEXT NOT NULL DEFAULT 'text',
      options TEXT,
      default_value TEXT,
      required INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(entity_type, field_name)
    );

    CREATE TABLE IF NOT EXISTS custom_field_values (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_id INTEGER NOT NULL REFERENCES custom_field_defs(id) ON DELETE CASCADE,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      value TEXT,
      UNIQUE(field_id, entity_type, entity_id)
    );
    CREATE INDEX IF NOT EXISTS idx_cfv_entity ON custom_field_values(entity_type, entity_id);
  `);
}

function _mig042_printer_groups() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS printer_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      parent_id INTEGER REFERENCES printer_groups(id) ON DELETE SET NULL,
      color TEXT,
      stagger_delay_s INTEGER DEFAULT 0,
      max_concurrent INTEGER DEFAULT 0,
      power_limit_w INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS printer_group_members (
      group_id INTEGER NOT NULL REFERENCES printer_groups(id) ON DELETE CASCADE,
      printer_id TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      PRIMARY KEY(group_id, printer_id)
    );
  `);
}

function _mig043_projects() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      client_name TEXT,
      due_date TEXT,
      total_prints INTEGER DEFAULT 0,
      completed_prints INTEGER DEFAULT 0,
      total_cost REAL DEFAULT 0,
      notes TEXT,
      tags TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS project_prints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      print_history_id INTEGER,
      queue_item_id INTEGER,
      filename TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      added_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pp_project ON project_prints(project_id);
  `);
}

function _mig044_export_templates() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS export_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      format TEXT NOT NULL DEFAULT 'csv',
      columns TEXT NOT NULL,
      filters TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function _mig045_totp() {
  try { db.exec('ALTER TABLE users ADD COLUMN totp_secret TEXT'); } catch {}
  try { db.exec('ALTER TABLE users ADD COLUMN totp_enabled INTEGER DEFAULT 0'); } catch {}
  try { db.exec('ALTER TABLE users ADD COLUMN totp_backup_codes TEXT'); } catch {}
}

function _mig046_user_quotas() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_quotas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      balance REAL DEFAULT 0,
      print_quota_daily INTEGER DEFAULT 0,
      print_quota_monthly INTEGER DEFAULT 0,
      filament_quota_g REAL DEFAULT 0,
      prints_today INTEGER DEFAULT 0,
      prints_this_month INTEGER DEFAULT 0,
      filament_used_g REAL DEFAULT 0,
      last_reset_daily TEXT,
      last_reset_monthly TEXT,
      UNIQUE(user_id)
    );

    CREATE TABLE IF NOT EXISTS user_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      print_history_id INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_ut_user ON user_transactions(user_id);
  `);
}

function _mig047_hub_kiosk() {
  // Hub/kiosk settings stored in inventory_settings
  // Just seed defaults
  try {
    const existing = db.prepare("SELECT value FROM inventory_settings WHERE key = 'hub_mode'").get();
    if (!existing) {
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('hub_mode', '0')").run();
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('kiosk_mode', '0')").run();
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('kiosk_panels', 'dashboard,queue')").run();
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('hub_refresh_interval', '30')").run();
    }
  } catch {}
}

function _mig048_failure_detection() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS failure_detections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      print_history_id INTEGER,
      detection_type TEXT NOT NULL,
      confidence REAL,
      frame_path TEXT,
      action_taken TEXT,
      acknowledged INTEGER DEFAULT 0,
      details TEXT,
      detected_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_fd_printer ON failure_detections(printer_id);
  `);
  // Settings
  try {
    const existing = db.prepare("SELECT value FROM inventory_settings WHERE key = 'ai_detection_enabled'").get();
    if (!existing) {
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('ai_detection_enabled', '0')").run();
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('ai_detection_interval', '60')").run();
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('ai_detection_sensitivity', 'medium')").run();
      db.prepare("INSERT INTO inventory_settings (key, value) VALUES ('ai_detection_action', 'notify')").run();
    }
  } catch {}
}

function _mig049_price_history() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filament_profile_id INTEGER REFERENCES filament_profiles(id) ON DELETE CASCADE,
      vendor_id INTEGER REFERENCES vendors(id),
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      source TEXT,
      recorded_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_ph_profile ON price_history(filament_profile_id);
  `);
}

function _mig050_multi_plate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS build_plates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'smooth_pei',
      material TEXT,
      surface_condition TEXT DEFAULT 'good',
      print_count INTEGER DEFAULT 0,
      notes TEXT,
      active INTEGER DEFAULT 1,
      installed_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_bp_printer ON build_plates(printer_id);
  `);
}

function _mig051_dryer_storage() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dryer_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      max_temp INTEGER,
      tray_count INTEGER DEFAULT 1,
      max_spool_diameter INTEGER,
      has_humidity_sensor INTEGER DEFAULT 0,
      wattage INTEGER,
      notes TEXT,
      UNIQUE(brand, model)
    );

    CREATE TABLE IF NOT EXISTS storage_conditions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spool_id INTEGER REFERENCES spools(id) ON DELETE CASCADE,
      humidity REAL,
      temperature REAL,
      container_type TEXT,
      desiccant_type TEXT,
      desiccant_replaced TEXT,
      sealed INTEGER DEFAULT 0,
      notes TEXT,
      recorded_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_sc_spool ON storage_conditions(spool_id);
  `);
  // Seed common dryer models
  const dryers = [
    ['Bambu Lab', 'AMS Lite Dryer', 55, 1, 200, 1, 40],
    ['Sunlu', 'FilaDryer S1', 55, 1, 200, 0, 48],
    ['Sunlu', 'FilaDryer S2', 70, 1, 220, 1, 110],
    ['Sunlu', 'FilaDryer S4', 70, 4, 200, 1, 350],
    ['eSun', 'eBOX Lite', 55, 1, 200, 1, 36],
    ['eSun', 'eBOX', 70, 1, 220, 1, 75],
    ['Creality', 'Filament Dryer', 55, 1, 200, 0, 45],
    ['Sovol', 'SH01', 70, 1, 220, 1, 110],
    ['Polymaker', 'PolyDryer', 70, 2, 200, 1, 120],
    ['EIBOS', 'Cyclopes', 70, 1, 210, 1, 48],
    ['PrintDry', 'Pro 3', 80, 2, 220, 0, 100],
    ['Jayo', 'Filament Dryer', 55, 1, 200, 0, 48],
  ];
  const stmt = db.prepare('INSERT OR IGNORE INTO dryer_models (brand, model, max_temp, tray_count, max_spool_diameter, has_humidity_sensor, wattage) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const d of dryers) stmt.run(...d);
}

function _mig052_courses() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'general',
      difficulty INTEGER DEFAULT 1,
      content TEXT,
      steps TEXT,
      estimated_minutes INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS course_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      user_id INTEGER,
      status TEXT DEFAULT 'not_started',
      current_step INTEGER DEFAULT 0,
      completed_at TEXT,
      started_at TEXT DEFAULT (datetime('now')),
      UNIQUE(course_id, user_id)
    );
  `);
  // Seed intro courses
  const courses = [
    ['Getting Started with Bambu Dashboard', 'Learn the basics of your dashboard', 'general', 1, null, '["Navigate the dashboard","Add your first printer","Check printer status","View print history"]', 10],
    ['Filament Management 101', 'How to track and manage your filaments', 'filament', 1, null, '["Add a vendor","Create filament profiles","Add spools to inventory","Track usage"]', 15],
    ['Print Queue Basics', 'Learn to use the print queue system', 'printing', 2, null, '["Create a queue","Add items to queue","Start printing","Monitor progress"]', 10],
    ['Advanced Cost Tracking', 'Master print cost estimation', 'printing', 3, null, '["Configure electricity rates","Set labor costs","Track per-print costs","Generate reports"]', 20],
    ['Maintenance & Hardware', 'Keep your printer running smoothly', 'maintenance', 2, null, '["Set maintenance schedules","Track component wear","Log maintenance events","Hardware database"]', 15],
  ];
  const stmt = db.prepare('INSERT INTO courses (title, description, category, difficulty, content, steps, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const c of courses) stmt.run(...c);
}

function _mig053_ecom_license() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ecom_license (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      license_key TEXT,
      geektech_email TEXT,
      geektech_api_url TEXT DEFAULT 'https://geektech.no/api/v1',
      instance_id TEXT NOT NULL,
      status TEXT DEFAULT 'inactive',
      holder_name TEXT,
      plan TEXT,
      features TEXT DEFAULT '[]',
      expires_at TEXT,
      last_validated TEXT,
      cached_response TEXT,
      last_report_at TEXT
    );

    CREATE TABLE IF NOT EXISTS ecom_fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES ecommerce_orders(id),
      ecom_config_id INTEGER REFERENCES ecommerce_configs(id),
      order_total REAL NOT NULL,
      fee_pct REAL DEFAULT 5.0,
      fee_amount REAL NOT NULL,
      currency TEXT DEFAULT 'NOK',
      reported INTEGER DEFAULT 0,
      reported_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_ecom_fees_reported ON ecom_fees(reported);
  `);

  // Initialize singleton with a generated instance_id
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  db.prepare('INSERT OR IGNORE INTO ecom_license (id, instance_id) VALUES (1, ?)').run(uuid);
}

function _mig054_learning_center_v2() {
  // Add completed_steps column for tracking individual step completion
  try { db.exec('ALTER TABLE course_progress ADD COLUMN completed_steps TEXT DEFAULT \'[]\''); } catch { /* column may exist */ }

  // Re-seed with rich course data (object steps with title, description, action)
  db.exec('DELETE FROM course_progress');
  db.exec('DELETE FROM courses');

  const courses = [
    {
      title: 'Getting Started with Bambu Dashboard',
      description: 'Learn the basics of navigating and using your dashboard.',
      category: 'getting_started', difficulty: 1, estimated_minutes: 10,
      steps: [
        { title: 'Navigate the dashboard', description: 'Open the main dashboard view and explore the live card grid showing printer status, temperatures, camera feed, and AMS slots.', action: null },
        { title: 'Add your first printer', description: 'Go to Settings > Printers and click Add Printer. Enter your Bambu Lab printer IP address, serial number, and access code.', action: '#settings/printers' },
        { title: 'Check printer status', description: 'Return to the dashboard and observe the live status indicators showing connection state, print progress, and temperature readings.', action: null },
        { title: 'View print history', description: 'Open the History panel to see all past print jobs with details like duration, filament usage, and completion status.', action: '#history' },
        { title: 'Explore the sidebar', description: 'Click through each sidebar navigation button to discover all available panels: Controls, Queue, Statistics, Telemetry, and more.', action: null }
      ]
    },
    {
      title: 'Filament Management 101',
      description: 'How to track and manage your filament inventory from vendors to spools.',
      category: 'filament', difficulty: 1, estimated_minutes: 15,
      steps: [
        { title: 'Add a vendor', description: 'Navigate to the Filament panel Manage tab and create your first filament vendor entry with their name and website.', action: '#filament/manage' },
        { title: 'Create filament profiles', description: 'In the Manage tab, add filament profiles under your vendor specifying material type, color, diameter, and temperature settings.', action: '#filament/manage' },
        { title: 'Add spools to inventory', description: 'Switch to the Inventory tab and add a physical spool by selecting a profile, entering the weight, and optionally assigning a location.', action: '#filament' },
        { title: 'Track filament usage', description: 'Start a print and watch the automatic usage tracking deduct weight from your active spool in real time.', action: '#filament' },
        { title: 'Review inventory stats', description: 'Open the Stats tab to see filament consumption breakdown by type, brand, cost summaries, and usage predictions.', action: '#filament/stats' }
      ]
    },
    {
      title: 'Print Queue Basics',
      description: 'Learn to use the print queue system for managing multiple print jobs.',
      category: 'printing', difficulty: 2, estimated_minutes: 10,
      steps: [
        { title: 'Create a queue', description: 'Open the Queue panel and create a new print queue, giving it a name and optionally assigning it to a specific printer.', action: '#queue' },
        { title: 'Add items to queue', description: 'Add print jobs to your queue by specifying the file, quantity, and priority for each item.', action: '#queue' },
        { title: 'Start printing from queue', description: 'Select a queue item and send it to the printer. The queue system will track the job from start to finish.', action: '#queue' },
        { title: 'Monitor print progress', description: 'Watch the real-time progress of your queued print on the dashboard with live updates on percentage, time remaining, and layer count.', action: null }
      ]
    },
    {
      title: 'Advanced Cost Tracking',
      description: 'Master print cost estimation with electricity rates, labor costs, and detailed reports.',
      category: 'printing', difficulty: 3, estimated_minutes: 20,
      steps: [
        { title: 'Configure electricity rates', description: 'Go to Settings > General and enter your electricity cost per kWh so the system can calculate power consumption costs for each print.', action: '#settings/general' },
        { title: 'Set labor costs', description: 'Configure your hourly labor rate to include preparation and post-processing time in cost estimates.', action: '#settings/general' },
        { title: 'Track per-print costs', description: 'View the cost breakdown for any completed print in the History panel, showing filament, electricity, and labor totals.', action: '#history' },
        { title: 'Generate cost reports', description: 'Open the Statistics panel to view aggregated cost summaries, trends over time, and cost-per-material breakdowns.', action: '#stats' },
        { title: 'Use cost estimation', description: 'Before starting a print, use the cost estimator to preview expected costs based on filament weight, print time, and your configured rates.', action: '#stats' }
      ]
    },
    {
      title: 'Maintenance & Hardware',
      description: 'Keep your printer running smoothly with scheduled maintenance and hardware tracking.',
      category: 'maintenance', difficulty: 2, estimated_minutes: 15,
      steps: [
        { title: 'View maintenance status', description: 'Open the Maintenance panel to see the current status of all tracked components including nozzle wear, print hours, and overdue alerts.', action: '#maintenance' },
        { title: 'Set maintenance schedules', description: 'Configure maintenance intervals for components like nozzles, PTFE tubes, and linear rods based on print hours or time.', action: '#maintenance' },
        { title: 'Track component wear', description: 'Monitor the Wear Tracking section to see estimated wear levels for fans, heaters, belts, and rails based on accumulated print time.', action: '#maintenance' },
        { title: 'Log maintenance events', description: 'Record when you clean, replace, lubricate, or inspect a component to keep an accurate maintenance history.', action: '#maintenance' },
        { title: 'Manage hardware inventory', description: 'Add spare parts and hardware items to the Hardware Database, assign them to printers, and track their lifecycle.', action: '#maintenance' }
      ]
    },
    {
      title: 'NFC Tag Management',
      description: 'Set up NFC tags for quick spool identification and automated tracking.',
      category: 'filament', difficulty: 2, estimated_minutes: 12,
      steps: [
        { title: 'Link an NFC tag to a spool', description: 'Open the Filament panel Tools tab, find the NFC Manager section, and scan or manually enter an NFC tag ID to link it to a spool.', action: '#filament/tools' },
        { title: 'Scan a tag to view spool info', description: 'Scan an NFC tag with your phone or reader. The dashboard will display all spool details including remaining weight, material, and color.', action: '#filament/tools' },
        { title: 'Checkout and checkin spools', description: 'Use the checkout system to track who is using which spool. Scan the NFC tag to check a spool out or back in.', action: '#filament/tools' },
        { title: 'View NFC scan history', description: 'Review the timeline of NFC scans to see when and where each spool was last identified.', action: '#filament/tools' }
      ]
    },
    {
      title: 'Drying Management',
      description: 'Track filament drying sessions and maintain optimal material storage conditions.',
      category: 'filament', difficulty: 2, estimated_minutes: 10,
      steps: [
        { title: 'Start a drying session', description: 'Go to the Filament panel Drying tab and start a new drying session by selecting spools, dryer temperature, and duration.', action: '#filament/drying' },
        { title: 'Monitor active sessions', description: 'View all active drying sessions with live countdown timers and temperature targets.', action: '#filament/drying' },
        { title: 'Use drying presets', description: 'Create reusable drying presets for common materials like PLA, PETG, and TPU with recommended temperatures and durations.', action: '#filament/drying' },
        { title: 'Review drying history', description: 'Check the drying history to see all past sessions and ensure your filaments are properly maintained.', action: '#filament/drying' }
      ]
    },
    {
      title: 'Webhooks & Notifications',
      description: 'Set up notifications and webhooks to stay informed about print events.',
      category: 'automation', difficulty: 3, estimated_minutes: 15,
      steps: [
        { title: 'Enable browser notifications', description: 'Go to Settings > General and enable browser notifications to receive alerts for print completion, failures, and warnings.', action: '#settings/general' },
        { title: 'Configure notification triggers', description: 'Open the Notifications settings tab to customize which events trigger alerts: print done, error, filament runout, and more.', action: '#settings/notifications' },
        { title: 'Add a webhook endpoint', description: 'Create a webhook that sends event data to an external URL like Discord, Slack, or your own automation system.', action: '#settings/notifications' },
        { title: 'Test your webhook', description: 'Use the Test button to send a sample payload to your webhook URL and verify it is received correctly.', action: '#settings/notifications' },
        { title: 'Review notification history', description: 'Check the Notification Log to see all sent alerts and webhook delivery statuses.', action: '#settings/notifications' }
      ]
    },
    {
      title: 'Multi-User & API Keys',
      description: 'Set up multiple users with roles, permissions, and API access for integration.',
      category: 'automation', difficulty: 3, estimated_minutes: 15,
      steps: [
        { title: 'Create user accounts', description: 'Go to Settings > System and add new user accounts with usernames, passwords, and assigned roles.', action: '#settings/system' },
        { title: 'Configure roles and permissions', description: 'Define roles that control access levels: which panels users can see and what actions they can perform.', action: '#settings/system' },
        { title: 'Enable authentication', description: 'Enable the authentication system in Settings > System so users must log in to access the dashboard.', action: '#settings/system' },
        { title: 'Generate API keys', description: 'Create API keys for external applications to interact with Bambu Dashboard programmatically via the REST API.', action: '#settings/system' },
        { title: 'Test API access', description: 'Use the generated API key as a Bearer token to make authenticated requests to any API endpoint.', action: '#settings/system' }
      ]
    },
    {
      title: 'E-Commerce Integration',
      description: 'Connect your dashboard to e-commerce platforms for order-driven printing workflows.',
      category: 'automation', difficulty: 3, estimated_minutes: 20,
      steps: [
        { title: 'Activate your license', description: 'Open Settings > System and enter your GeekTech.no license key to activate the e-commerce premium module.', action: '#settings/system' },
        { title: 'Add an e-commerce integration', description: 'Create an e-commerce configuration by selecting your platform (Shopify, WooCommerce, or Custom) and entering webhook credentials.', action: '#settings/system' },
        { title: 'Configure SKU mapping', description: 'Map product SKUs from your store to 3MF/GCODE files so orders automatically queue the correct prints.', action: '#settings/system' },
        { title: 'Receive incoming orders', description: 'Once configured, incoming orders from your store will appear automatically with customer details and item specifications.', action: '#settings/system' },
        { title: 'Track order fulfillment', description: 'Monitor order progress from received to queued to fulfilled, with automatic print queue integration.', action: '#queue' }
      ]
    }
  ];

  const stmt = db.prepare('INSERT INTO courses (title, description, category, difficulty, content, steps, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const c of courses) {
    stmt.run(c.title, c.description, c.category, c.difficulty, null, JSON.stringify(c.steps), c.estimated_minutes);
  }
}

// ---- Printer CRUD ----

export function getPrinters() {
  const rows = db.prepare('SELECT * FROM printers ORDER BY added_at').all();
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    ip: r.ip,
    serial: r.serial,
    accessCode: r.access_code,
    model: r.model,
    added_at: r.added_at
  }));
}

export function addPrinter(p) {
  return db.prepare('INSERT INTO printers (id, name, ip, serial, access_code, model) VALUES (?, ?, ?, ?, ?, ?)').run(
    p.id, p.name, p.ip || null, p.serial || null, p.accessCode || null, p.model || null
  );
}

export function updatePrinter(id, p) {
  return db.prepare('UPDATE printers SET name=?, ip=?, serial=?, access_code=?, model=? WHERE id=?').run(
    p.name, p.ip || null, p.serial || null, p.accessCode || null, p.model || null, id
  );
}

export function deletePrinter(id) {
  return db.prepare('DELETE FROM printers WHERE id=?').run(id);
}

// ---- History ----

export function getHistory(limit = 50, offset = 0, printerId = null) {
  if (printerId) {
    return db.prepare('SELECT * FROM print_history WHERE printer_id = ? ORDER BY started_at DESC LIMIT ? OFFSET ?').all(printerId, limit, offset);
  }
  return db.prepare('SELECT * FROM print_history ORDER BY started_at DESC LIMIT ? OFFSET ?').all(limit, offset);
}

export function addHistory(record) {
  const result = db.prepare(`
    INSERT INTO print_history (printer_id, started_at, finished_at, filename, status,
      duration_seconds, filament_used_g, filament_type, filament_color, layer_count,
      notes, color_changes, waste_g, nozzle_type, nozzle_diameter, speed_level,
      bed_target, nozzle_target, max_nozzle_temp, max_bed_temp, filament_brand,
      ams_units_used, tray_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(record.printer_id || null, record.started_at, record.finished_at, record.filename, record.status,
    record.duration_seconds, record.filament_used_g, record.filament_type,
    record.filament_color, record.layer_count, record.notes || null,
    record.color_changes || 0, record.waste_g || 0,
    record.nozzle_type || null, record.nozzle_diameter || null,
    record.speed_level || null, record.bed_target || null, record.nozzle_target || null,
    record.max_nozzle_temp || null, record.max_bed_temp || null,
    record.filament_brand || null, record.ams_units_used || null,
    record.tray_id || null);
  return Number(result.lastInsertRowid);
}

// ---- Statistics ----

export function getStatistics(printerId = null) {
  const where = printerId ? ' WHERE printer_id = ?' : '';
  const params = printerId ? [printerId] : [];

  const total = db.prepare(`SELECT COUNT(*) as count FROM print_history${where}`).get(...params);
  const completed = db.prepare(`SELECT COUNT(*) as count FROM print_history${where}${where ? ' AND' : ' WHERE'} status = 'completed'`).get(...params);
  const failed = db.prepare(`SELECT COUNT(*) as count FROM print_history${where}${where ? ' AND' : ' WHERE'} status = 'failed'`).get(...params);
  const cancelled = db.prepare(`SELECT COUNT(*) as count FROM print_history${where}${where ? ' AND' : ' WHERE'} status = 'cancelled'`).get(...params);
  const totalTime = db.prepare(`SELECT COALESCE(SUM(duration_seconds), 0) as seconds FROM print_history${where}`).get(...params);
  const totalFilament = db.prepare(`SELECT COALESCE(SUM(filament_used_g), 0) as grams FROM print_history${where}`).get(...params);
  const avgDuration = db.prepare(`SELECT COALESCE(AVG(duration_seconds), 0) as avg FROM print_history${where}${where ? ' AND' : ' WHERE'} status = 'completed'`).get(...params);
  const longestPrint = db.prepare(`SELECT filename, duration_seconds FROM print_history${where}${where ? ' AND' : ' WHERE'} status = 'completed' ORDER BY duration_seconds DESC LIMIT 1`).get(...params);
  const mostUsedFilament = db.prepare(`SELECT filament_type, COUNT(*) as count FROM print_history${where}${where ? ' AND' : ' WHERE'} filament_type IS NOT NULL GROUP BY filament_type ORDER BY count DESC LIMIT 1`).get(...params);

  const filamentByType = db.prepare(`SELECT filament_type as type, COALESCE(SUM(filament_used_g), 0) as grams, COUNT(*) as prints FROM print_history${where}${where ? ' AND' : ' WHERE'} filament_type IS NOT NULL GROUP BY filament_type ORDER BY grams DESC`).all(...params);

  const printsPerWeek = db.prepare(`
    SELECT strftime('%Y-W%W', started_at) as week,
           COUNT(*) as total,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
           SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
    FROM print_history${where}${where ? ' AND' : ' WHERE'} started_at >= datetime('now', '-56 days')
    GROUP BY week ORDER BY week
  `).all(...params);

  const totalCost = db.prepare("SELECT COALESCE(SUM(cost_nok * (weight_used_g / weight_total_g)), 0) as cost FROM filament_inventory WHERE weight_total_g > 0").get();

  // Success rate by filament type
  const and = where ? ' AND' : ' WHERE';
  const successByFilament = db.prepare(`SELECT filament_type as type, COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed FROM print_history${where}${and} filament_type IS NOT NULL GROUP BY filament_type ORDER BY total DESC`).all(...params);

  // Success rate by speed level
  const successBySpeed = db.prepare(`SELECT speed_level as level, COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed FROM print_history${where}${and} speed_level IS NOT NULL GROUP BY speed_level ORDER BY level`).all(...params);

  // Filament by brand
  const filamentByBrand = db.prepare(`SELECT filament_brand as brand, filament_type as type, COALESCE(SUM(filament_used_g), 0) as grams, COUNT(*) as prints FROM print_history${where}${and} filament_brand IS NOT NULL GROUP BY filament_brand, filament_type ORDER BY grams DESC`).all(...params);

  // Temperature records
  const tempStats = db.prepare(`SELECT COALESCE(MAX(max_nozzle_temp), 0) as peak_nozzle, COALESCE(AVG(max_nozzle_temp), 0) as avg_nozzle, COALESCE(MAX(max_bed_temp), 0) as peak_bed, COALESCE(AVG(max_bed_temp), 0) as avg_bed FROM print_history${where}${and} status = 'completed' AND max_nozzle_temp > 0`).get(...params);

  // Top 5 files
  const topFiles = db.prepare(`SELECT filename, COUNT(*) as count, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed FROM print_history${where}${and} filename IS NOT NULL GROUP BY filename ORDER BY count DESC LIMIT 5`).all(...params);

  // Monthly trends (last 6 months)
  const monthlyTrends = db.prepare(`SELECT strftime('%Y-%m', started_at) as month, COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed, COALESCE(SUM(duration_seconds), 0) as total_seconds, COALESCE(SUM(filament_used_g), 0) as total_filament_g FROM print_history${where}${and} started_at >= datetime('now', '-180 days') GROUP BY month ORDER BY month`).all(...params);

  // Total layers
  const totalLayers = db.prepare(`SELECT COALESCE(SUM(layer_count), 0) as total FROM print_history${where}${and} status = 'completed'`).get(...params);

  // Prints by day of week (0=Sunday)
  const printsByDayOfWeek = db.prepare(`SELECT CAST(strftime('%w', started_at) AS INTEGER) as dow, COUNT(*) as count FROM print_history${where} GROUP BY dow ORDER BY dow`).all(...params);

  // Prints by hour of day
  const printsByHour = db.prepare(`SELECT CAST(strftime('%H', started_at) AS INTEGER) as hour, COUNT(*) as count FROM print_history${where} GROUP BY hour ORDER BY hour`).all(...params);

  // AMS stats from snapshots
  const amsFilamentByBrand = db.prepare(`SELECT tray_brand as brand, tray_type as type, COUNT(*) as snapshots FROM ams_snapshots${where}${where ? ' AND' : ' WHERE'} tray_brand IS NOT NULL GROUP BY tray_brand, tray_type ORDER BY snapshots DESC LIMIT 10`).all(...params);
  const amsAvgHumidity = db.prepare(`SELECT ams_unit, ROUND(AVG(CAST(humidity AS REAL)), 1) as avg_humidity, COUNT(*) as readings FROM ams_snapshots${where}${where ? ' AND' : ' WHERE'} humidity IS NOT NULL GROUP BY ams_unit ORDER BY ams_unit`).all(...params);

  // Extra stats: waste, color changes, avg filament per print, nozzle breakdown, streaks
  const wasteStats = db.prepare(`SELECT COALESCE(SUM(waste_g), 0) as total_waste, COALESCE(SUM(color_changes), 0) as total_color_changes FROM print_history${where}`).get(...params);
  const avgFilamentPerPrint = db.prepare(`SELECT COALESCE(AVG(filament_used_g), 0) as avg FROM print_history${where}${and} status = 'completed' AND filament_used_g > 0`).get(...params);
  const nozzleBreakdown = db.prepare(`SELECT nozzle_type as type, nozzle_diameter as diameter, COUNT(*) as prints, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed FROM print_history${where}${and} nozzle_type IS NOT NULL GROUP BY nozzle_type, nozzle_diameter ORDER BY prints DESC`).all(...params);

  // Streak: consecutive completed prints (current)
  const recentPrints = db.prepare(`SELECT status FROM print_history${where} ORDER BY started_at DESC LIMIT 50`).all(...params);
  let currentStreak = 0;
  for (const p of recentPrints) {
    if (p.status === 'completed') currentStreak++;
    else break;
  }
  // Best streak ever
  let bestStreak = 0, tempStreak = 0;
  const allPrintsForStreak = db.prepare(`SELECT status FROM print_history${where} ORDER BY started_at ASC`).all(...params);
  for (const p of allPrintsForStreak) {
    if (p.status === 'completed') { tempStreak++; if (tempStreak > bestStreak) bestStreak = tempStreak; }
    else tempStreak = 0;
  }

  // Avg print time per day-of-week
  const avgDurationByDay = db.prepare(`SELECT CAST(strftime('%w', started_at) AS INTEGER) as dow, ROUND(AVG(duration_seconds) / 60) as avg_minutes FROM print_history${where}${and} status = 'completed' GROUP BY dow ORDER BY dow`).all(...params);

  // First and last print dates
  const firstPrint = db.prepare(`SELECT started_at FROM print_history${where} ORDER BY started_at ASC LIMIT 1`).get(...params);
  const lastPrint = db.prepare(`SELECT started_at FROM print_history${where} ORDER BY started_at DESC LIMIT 1`).get(...params);

  return {
    total_prints: total.count,
    completed_prints: completed.count,
    failed_prints: failed.count,
    cancelled_prints: cancelled.count,
    success_rate: total.count > 0 ? Math.round((completed.count / total.count) * 100) : 0,
    total_hours: Math.round(totalTime.seconds / 3600 * 10) / 10,
    total_filament_g: Math.round(totalFilament.grams * 10) / 10,
    avg_print_minutes: Math.round(avgDuration.avg / 60),
    longest_print: longestPrint || null,
    most_used_filament: mostUsedFilament?.type || null,
    filament_by_type: filamentByType,
    prints_per_week: printsPerWeek,
    estimated_cost_nok: Math.round(totalCost.cost * 10) / 10,
    success_by_filament: successByFilament.map(r => ({ type: r.type, total: r.total, completed: r.completed, rate: r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0 })),
    success_by_speed: successBySpeed.map(r => ({ level: r.level, total: r.total, completed: r.completed, rate: r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0 })),
    filament_by_brand: filamentByBrand,
    temp_stats: tempStats || { peak_nozzle: 0, avg_nozzle: 0, peak_bed: 0, avg_bed: 0 },
    top_files: topFiles,
    monthly_trends: monthlyTrends,
    total_layers: totalLayers.total,
    prints_by_day_of_week: printsByDayOfWeek,
    prints_by_hour: printsByHour,
    ams_filament_by_brand: amsFilamentByBrand,
    ams_avg_humidity: amsAvgHumidity,
    total_waste_g: Math.round(wasteStats.total_waste * 10) / 10,
    total_color_changes: wasteStats.total_color_changes,
    avg_filament_per_print_g: Math.round(avgFilamentPerPrint.avg * 10) / 10,
    nozzle_breakdown: nozzleBreakdown.map(r => ({ type: r.type, diameter: r.diameter, prints: r.prints, completed: r.completed, rate: r.prints > 0 ? Math.round((r.completed / r.prints) * 100) : 0 })),
    current_streak: currentStreak,
    best_streak: bestStreak,
    avg_duration_by_day: avgDurationByDay,
    first_print: firstPrint?.started_at || null,
    last_print: lastPrint?.started_at || null
  };
}

// ---- Filament ----

export function getFilament(printerId = null) {
  if (printerId) {
    return db.prepare('SELECT * FROM filament_inventory WHERE printer_id = ? ORDER BY id').all(printerId);
  }
  return db.prepare('SELECT * FROM filament_inventory ORDER BY printer_id, id').all();
}

export function addFilament(f) {
  return db.prepare(`
    INSERT INTO filament_inventory (printer_id, brand, type, color_name, color_hex, weight_total_g, weight_used_g, cost_nok, purchase_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(f.printer_id || null, f.brand, f.type, f.color_name || null, f.color_hex || null, f.weight_total_g || 1000,
    f.weight_used_g || 0, f.cost_nok || null, f.purchase_date || null, f.notes || null);
}

export function updateFilament(id, f) {
  return db.prepare(`
    UPDATE filament_inventory SET printer_id=?, brand=?, type=?, color_name=?, color_hex=?, weight_total_g=?, weight_used_g=?, cost_nok=?, notes=?
    WHERE id=?
  `).run(f.printer_id || null, f.brand, f.type, f.color_name, f.color_hex, f.weight_total_g, f.weight_used_g, f.cost_nok, f.notes, id);
}

export function deleteFilament(id) {
  return db.prepare('DELETE FROM filament_inventory WHERE id=?').run(id);
}

// ---- Errors ----

export function getErrors(limit = 50, printerId = null) {
  if (printerId) {
    return db.prepare('SELECT * FROM error_log WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM error_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function addError(e) {
  return db.prepare('INSERT INTO error_log (printer_id, timestamp, code, message, severity) VALUES (?, ?, ?, ?, ?)').run(
    e.printer_id || null, e.timestamp || new Date().toISOString(), e.code, e.message, e.severity
  );
}

export function acknowledgeError(id) {
  return db.prepare('UPDATE error_log SET acknowledged = 1 WHERE id = ?').run(id);
}

export function deleteError(id) {
  return db.prepare('DELETE FROM error_log WHERE id = ?').run(id);
}

export function acknowledgeAllErrors(printerId = null) {
  if (printerId) {
    return db.prepare('UPDATE error_log SET acknowledged = 1 WHERE printer_id = ? AND acknowledged = 0').run(printerId);
  }
  return db.prepare('UPDATE error_log SET acknowledged = 1 WHERE acknowledged = 0').run();
}

// ---- Waste Tracking ----

export function addWaste(w) {
  return db.prepare('INSERT INTO filament_waste (printer_id, waste_g, reason, notes) VALUES (?, ?, ?, ?)').run(
    w.printer_id || null, w.waste_g, w.reason || 'manual', w.notes || null
  );
}

export function getWasteHistory(limit = 50, printerId = null) {
  if (printerId) {
    return db.prepare('SELECT * FROM filament_waste WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM filament_waste ORDER BY timestamp DESC LIMIT ?').all(limit);
}

// ---- Nozzle Sessions ----

export function getActiveNozzleSession(printerId) {
  return db.prepare('SELECT * FROM nozzle_sessions WHERE printer_id = ? AND retired_at IS NULL ORDER BY installed_at DESC LIMIT 1').get(printerId) || null;
}

export function getNozzleSessions(printerId) {
  return db.prepare('SELECT * FROM nozzle_sessions WHERE printer_id = ? ORDER BY installed_at DESC').all(printerId);
}

export function createNozzleSession(printerId, nozzleType, nozzleDiameter) {
  return db.prepare('INSERT INTO nozzle_sessions (printer_id, nozzle_type, nozzle_diameter) VALUES (?, ?, ?)').run(printerId, nozzleType, nozzleDiameter);
}

export function retireNozzleSession(sessionId) {
  return db.prepare('UPDATE nozzle_sessions SET retired_at = datetime("now") WHERE id = ?').run(sessionId);
}

export function updateNozzleSessionCounters(sessionId, hours, filamentG, abrasiveG) {
  return db.prepare('UPDATE nozzle_sessions SET total_print_hours = total_print_hours + ?, total_filament_g = total_filament_g + ?, abrasive_filament_g = abrasive_filament_g + ?, print_count = print_count + 1 WHERE id = ?').run(hours, filamentG, abrasiveG, sessionId);
}

// ---- Maintenance ----

export function addMaintenanceEvent(event) {
  return db.prepare('INSERT INTO maintenance_log (printer_id, component, action, notes, nozzle_type, nozzle_diameter) VALUES (?, ?, ?, ?, ?, ?)').run(
    event.printer_id, event.component, event.action, event.notes || null, event.nozzle_type || null, event.nozzle_diameter || null
  );
}

export function getMaintenanceLog(printerId, limit = 50) {
  if (printerId) {
    return db.prepare('SELECT * FROM maintenance_log WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM maintenance_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function getMaintenanceSchedule(printerId) {
  return db.prepare('SELECT * FROM maintenance_schedule WHERE printer_id = ? AND enabled = 1 ORDER BY component').all(printerId);
}

export function upsertMaintenanceSchedule(printerId, component, intervalHours, label) {
  const existing = db.prepare('SELECT id FROM maintenance_schedule WHERE printer_id = ? AND component = ?').get(printerId, component);
  if (existing) {
    return db.prepare('UPDATE maintenance_schedule SET interval_hours = ?, label = ? WHERE id = ?').run(intervalHours, label, existing.id);
  }
  return db.prepare('INSERT INTO maintenance_schedule (printer_id, component, interval_hours, label) VALUES (?, ?, ?, ?)').run(printerId, component, intervalHours, label);
}

function seedDefaultSchedule(printerId) {
  const existing = db.prepare('SELECT COUNT(*) as c FROM maintenance_schedule WHERE printer_id = ?').get(printerId);
  if (existing.c > 0) return;
  const defaults = [
    ['nozzle', 100, 'Clean nozzle'],
    ['ptfe_tube', 500, 'Check PTFE tube'],
    ['linear_rods', 200, 'Lubricate linear rods'],
    ['carbon_rods', 500, 'Inspect carbon rods'],
    ['build_plate', 50, 'Clean build plate'],
    ['general', 1000, 'General maintenance']
  ];
  const stmt = db.prepare('INSERT INTO maintenance_schedule (printer_id, component, interval_hours, label) VALUES (?, ?, ?, ?)');
  for (const [comp, hours, label] of defaults) {
    stmt.run(printerId, comp, hours, label);
  }
}

function estimateNozzleWear(session) {
  if (!session) return null;
  const isHardened = (session.nozzle_type || '').toLowerCase().includes('hardened');
  const baseLife = isHardened ? 1500 : 400;
  const effectiveHours = session.total_print_hours + (session.abrasive_filament_g / 100) * 3;
  const wearPct = Math.min(100, Math.round((effectiveHours / baseLife) * 100));
  let condition = 'good';
  if (wearPct >= 80) condition = 'replace_soon';
  else if (wearPct >= 50) condition = 'worn';
  return { percentage: wearPct, condition, base_life_hours: baseLife };
}

export function getMaintenanceStatus(printerId) {
  seedDefaultSchedule(printerId);

  const totalHours = db.prepare('SELECT COALESCE(SUM(duration_seconds), 0) / 3600.0 as hours FROM print_history WHERE printer_id = ?').get(printerId);
  const totalPrints = db.prepare('SELECT COUNT(*) as count FROM print_history WHERE printer_id = ?').get(printerId);
  const totalFilament = db.prepare('SELECT COALESCE(SUM(filament_used_g), 0) as grams FROM print_history WHERE printer_id = ?').get(printerId);

  const schedule = getMaintenanceSchedule(printerId);
  const components = [];

  for (const sched of schedule) {
    const lastEvent = db.prepare('SELECT timestamp FROM maintenance_log WHERE printer_id = ? AND component = ? ORDER BY timestamp DESC LIMIT 1').get(printerId, sched.component);

    let hoursSinceMaint = totalHours.hours;
    if (lastEvent) {
      const since = db.prepare('SELECT COALESCE(SUM(duration_seconds), 0) / 3600.0 as hours FROM print_history WHERE printer_id = ? AND started_at > ?').get(printerId, lastEvent.timestamp);
      hoursSinceMaint = since.hours;
    }

    components.push({
      component: sched.component,
      label: sched.label,
      interval_hours: sched.interval_hours,
      hours_since_maintenance: Math.round(hoursSinceMaint * 10) / 10,
      percentage: Math.min(100, Math.round((hoursSinceMaint / sched.interval_hours) * 100)),
      overdue: hoursSinceMaint >= sched.interval_hours,
      last_maintenance: lastEvent?.timestamp || null
    });
  }

  const nozzle = getActiveNozzleSession(printerId);

  return {
    total_print_hours: Math.round(totalHours.hours * 10) / 10,
    total_prints: totalPrints.count,
    total_filament_g: Math.round(totalFilament.grams),
    components,
    active_nozzle: nozzle ? {
      id: nozzle.id,
      type: nozzle.nozzle_type,
      diameter: nozzle.nozzle_diameter,
      installed_at: nozzle.installed_at,
      print_hours: Math.round(nozzle.total_print_hours * 10) / 10,
      filament_g: Math.round(nozzle.total_filament_g),
      abrasive_g: Math.round(nozzle.abrasive_filament_g),
      print_count: nozzle.print_count,
      wear_estimate: estimateNozzleWear(nozzle)
    } : null,
    nozzle_history: getNozzleSessions(printerId)
  };
}

// ---- AMS Snapshots ----

export function addAmsSnapshot(s) {
  return db.prepare(`INSERT INTO ams_snapshots (printer_id, ams_unit, tray_id, tray_type, tray_color, tray_brand, tray_name, remain_pct, humidity, ams_temp,
    tag_uid, tray_uuid, tray_info_idx, tray_weight, tray_diameter, drying_temp, drying_time, nozzle_temp_min, nozzle_temp_max, bed_temp_recommend, k_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    s.printer_id, s.ams_unit, s.tray_id, s.tray_type || null, s.tray_color || null,
    s.tray_brand || null, s.tray_name || null, s.remain_pct ?? null, s.humidity || null, s.ams_temp || null,
    s.tag_uid || null, s.tray_uuid || null, s.tray_info_idx || null,
    s.tray_weight ?? null, s.tray_diameter ?? null,
    s.drying_temp ?? null, s.drying_time ?? null,
    s.nozzle_temp_min ?? null, s.nozzle_temp_max ?? null,
    s.bed_temp_recommend ?? null, s.k_value ?? null
  );
}

export function getAmsStats(printerId) {
  const where = printerId ? ' WHERE printer_id = ?' : '';
  const params = printerId ? [printerId] : [];
  const byBrand = db.prepare(`SELECT tray_brand as brand, tray_type as type, COUNT(DISTINCT timestamp) as uses FROM ams_snapshots${where}${where ? ' AND' : ' WHERE'} tray_brand IS NOT NULL GROUP BY tray_brand, tray_type ORDER BY uses DESC LIMIT 10`).all(...params);
  const humidity = db.prepare(`SELECT ams_unit, ROUND(AVG(CAST(humidity AS REAL)), 1) as avg, ROUND(MIN(CAST(humidity AS REAL)), 1) as min_h, ROUND(MAX(CAST(humidity AS REAL)), 1) as max_h, COUNT(*) as readings FROM ams_snapshots${where}${where ? ' AND' : ' WHERE'} humidity IS NOT NULL GROUP BY ams_unit`).all(...params);
  return { filament_by_brand: byBrand, humidity_by_unit: humidity };
}

// ---- Waste Tracking ----

export function getWasteStats(printerId = null) {
  const where = printerId ? ' WHERE printer_id = ?' : '';
  const params = printerId ? [printerId] : [];

  // From filament_waste table (manual entries)
  const manualWaste = db.prepare(`SELECT COALESCE(SUM(waste_g), 0) as total, COUNT(*) as count FROM filament_waste${where}`).get(...params);

  // From print_history (auto-tracked)
  const autoWaste = db.prepare(`SELECT COALESCE(SUM(waste_g), 0) as total, COALESCE(SUM(color_changes), 0) as changes, COUNT(CASE WHEN color_changes > 0 THEN 1 END) as prints_with_changes FROM print_history${where}`).get(...params);

  // Total prints for average
  const totalPrints = db.prepare(`SELECT COUNT(*) as count FROM print_history${where}`).get(...params);

  // Average cost per gram from inventory
  const costInfo = db.prepare("SELECT COALESCE(AVG(cost_nok / weight_total_g), 0.25) as avg_cost_per_g FROM filament_inventory WHERE weight_total_g > 0 AND cost_nok > 0").get();

  // Waste per week (combined)
  const wastePerWeek = db.prepare(`
    SELECT week, SUM(waste) as total FROM (
      SELECT strftime('%Y-W%W', started_at) as week, waste_g as waste FROM print_history${where}${where ? ' AND' : ' WHERE'} started_at >= datetime('now', '-56 days') AND waste_g > 0
      UNION ALL
      SELECT strftime('%Y-W%W', timestamp) as week, waste_g as waste FROM filament_waste${where}${where ? ' AND' : ' WHERE'} timestamp >= datetime('now', '-56 days')
    ) GROUP BY week ORDER BY week
  `).all(...params, ...params);

  // Recent events (combined from both tables)
  const recentAuto = db.prepare(`SELECT printer_id, started_at as timestamp, filename as notes, color_changes, waste_g, 'auto' as reason FROM print_history${where}${where ? ' AND' : ' WHERE'} waste_g > 0 ORDER BY started_at DESC LIMIT 20`).all(...params);
  const recentManual = db.prepare(`SELECT printer_id, timestamp, notes, 0 as color_changes, waste_g, reason FROM filament_waste${where} ORDER BY timestamp DESC LIMIT 20`).all(...params);

  const recent = [...recentAuto, ...recentManual]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20);

  const totalWasteG = manualWaste.total + autoWaste.total;
  const avgPerG = costInfo.avg_cost_per_g;

  return {
    total_waste_g: Math.round(totalWasteG * 10) / 10,
    total_color_changes: autoWaste.changes,
    total_cost: Math.round(totalWasteG * avgPerG * 10) / 10,
    avg_per_print: totalPrints.count > 0 ? Math.round((totalWasteG / totalPrints.count) * 10) / 10 : 0,
    manual_entries: manualWaste.count,
    prints_with_changes: autoWaste.prints_with_changes,
    waste_per_week: wastePerWeek,
    recent
  };
}

// ---- Telemetry ----

export function insertTelemetryBatch(records) {
  const stmt = db.prepare(`INSERT INTO telemetry (printer_id, timestamp, nozzle_temp, bed_temp, chamber_temp,
    nozzle_target, bed_target, fan_cooling, fan_aux, fan_chamber, fan_heatbreak, speed_mag, wifi_signal, print_progress, layer_num)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const r of records) {
    stmt.run(r.printer_id, r.timestamp, r.nozzle_temp, r.bed_temp, r.chamber_temp,
      r.nozzle_target, r.bed_target, r.fan_cooling, r.fan_aux, r.fan_chamber, r.fan_heatbreak,
      r.speed_mag, r.wifi_signal, r.print_progress, r.layer_num);
  }
}

export function getTelemetry(printerId, from, to, resolution = '1m') {
  const bucketExpr = {
    '30s': "strftime('%Y-%m-%d %H:%M:', timestamp) || CASE WHEN CAST(strftime('%S', timestamp) AS INTEGER) < 30 THEN '00' ELSE '30' END",
    '1m':  "strftime('%Y-%m-%d %H:%M:00', timestamp)",
    '5m':  "strftime('%Y-%m-%d %H:', timestamp) || printf('%02d', (CAST(strftime('%M', timestamp) AS INTEGER) / 5) * 5) || ':00'",
    '15m': "strftime('%Y-%m-%d %H:', timestamp) || printf('%02d', (CAST(strftime('%M', timestamp) AS INTEGER) / 15) * 15) || ':00'",
    '1h':  "strftime('%Y-%m-%d %H:00:00', timestamp)"
  };
  const bucket = bucketExpr[resolution] || bucketExpr['1m'];

  return db.prepare(`
    SELECT ${bucket} as time_bucket,
      ROUND(AVG(nozzle_temp), 1) as nozzle_temp,
      ROUND(AVG(bed_temp), 1) as bed_temp,
      ROUND(AVG(chamber_temp), 1) as chamber_temp,
      ROUND(AVG(nozzle_target), 1) as nozzle_target,
      ROUND(AVG(bed_target), 1) as bed_target,
      ROUND(AVG(fan_cooling)) as fan_cooling,
      ROUND(AVG(fan_aux)) as fan_aux,
      ROUND(AVG(fan_chamber)) as fan_chamber,
      ROUND(AVG(fan_heatbreak)) as fan_heatbreak,
      ROUND(AVG(speed_mag)) as speed_mag,
      MAX(wifi_signal) as wifi_signal,
      ROUND(AVG(print_progress)) as print_progress,
      MAX(layer_num) as layer_num
    FROM telemetry
    WHERE printer_id = ? AND timestamp >= ? AND timestamp <= ?
    GROUP BY time_bucket
    ORDER BY time_bucket
  `).all(printerId, from, to);
}

export function purgeTelemetry(retentionDays = 30) {
  return db.prepare("DELETE FROM telemetry WHERE timestamp < datetime('now', '-' || ? || ' days')").run(retentionDays);
}

// ---- Component Wear ----

export function upsertComponentWear(printerId, component, addHours, addCycles = 0) {
  const existing = db.prepare('SELECT id FROM component_wear WHERE printer_id = ? AND component = ?').get(printerId, component);
  if (existing) {
    return db.prepare("UPDATE component_wear SET total_hours = total_hours + ?, total_cycles = total_cycles + ?, last_updated = datetime('now') WHERE id = ?")
      .run(addHours, addCycles, existing.id);
  }
  return db.prepare('INSERT INTO component_wear (printer_id, component, total_hours, total_cycles) VALUES (?, ?, ?, ?)')
    .run(printerId, component, addHours, addCycles);
}

export function getComponentWear(printerId) {
  return db.prepare('SELECT * FROM component_wear WHERE printer_id = ? ORDER BY component').all(printerId);
}

// ---- Firmware History ----

export function addFirmwareEntry(entry) {
  // Avoid duplicate entries for same printer/module/version
  const existing = db.prepare('SELECT id FROM firmware_history WHERE printer_id = ? AND module = ? AND sw_ver = ?')
    .get(entry.printer_id, entry.module, entry.sw_ver);
  if (existing) return;
  return db.prepare('INSERT INTO firmware_history (printer_id, module, sw_ver, hw_ver, sn) VALUES (?, ?, ?, ?, ?)')
    .run(entry.printer_id, entry.module, entry.sw_ver || null, entry.hw_ver || null, entry.sn || null);
}

export function getFirmwareHistory(printerId) {
  return db.prepare('SELECT * FROM firmware_history WHERE printer_id = ? ORDER BY timestamp DESC').all(printerId);
}

export function getLatestFirmware(printerId) {
  return db.prepare(`SELECT module, sw_ver, hw_ver, sn, MAX(timestamp) as timestamp
    FROM firmware_history WHERE printer_id = ? GROUP BY module ORDER BY module`).all(printerId);
}

// ---- XCam Events ----

export function addXcamEvent(event) {
  return db.prepare('INSERT INTO xcam_events (printer_id, event_type, action_taken, print_id) VALUES (?, ?, ?, ?)')
    .run(event.printer_id, event.event_type, event.action_taken || null, event.print_id || null);
}

export function getXcamEvents(printerId, limit = 50) {
  if (printerId) {
    return db.prepare('SELECT * FROM xcam_events WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM xcam_events ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function getXcamStats(printerId = null) {
  const where = printerId ? ' WHERE printer_id = ?' : '';
  const params = printerId ? [printerId] : [];
  const total = db.prepare(`SELECT COUNT(*) as count FROM xcam_events${where}`).get(...params);
  const byType = db.prepare(`SELECT event_type, COUNT(*) as count FROM xcam_events${where} GROUP BY event_type`).all(...params);

  const stats = { total: total.count, spaghetti: 0, first_layer: 0, foreign_object: 0, nozzle_clump: 0 };
  for (const row of byType) {
    if (row.event_type === 'spaghetti_detected') stats.spaghetti = row.count;
    else if (row.event_type === 'first_layer_issue') stats.first_layer = row.count;
    else if (row.event_type === 'foreign_object') stats.foreign_object = row.count;
    else if (row.event_type === 'nozzle_clump') stats.nozzle_clump = row.count;
  }
  return stats;
}

// ---- AMS Tray Lifetime ----

export function upsertAmsTrayLifetime(entry) {
  const key = entry.tray_uuid || `pos_${entry.ams_unit}_${entry.tray_id}`;
  const existing = db.prepare('SELECT id, tray_uuid FROM ams_tray_lifetime WHERE printer_id = ? AND ams_unit = ? AND tray_id = ? AND (tray_uuid = ? OR (tray_uuid IS NULL AND ? IS NULL))')
    .get(entry.printer_id, entry.ams_unit, entry.tray_id, key, key);
  if (existing) {
    return db.prepare("UPDATE ams_tray_lifetime SET last_seen = datetime('now'), tray_uuid = COALESCE(?, tray_uuid) WHERE id = ?")
      .run(entry.tray_uuid || null, existing.id);
  }
  return db.prepare('INSERT INTO ams_tray_lifetime (printer_id, ams_unit, tray_id, tray_uuid) VALUES (?, ?, ?, ?)')
    .run(entry.printer_id, entry.ams_unit, entry.tray_id, entry.tray_uuid || null);
}

export function updateAmsTrayFilamentUsed(printerId, amsUnit, trayId, usedG) {
  db.prepare("UPDATE ams_tray_lifetime SET total_filament_used_g = total_filament_used_g + ?, last_seen = datetime('now') WHERE printer_id = ? AND ams_unit = ? AND tray_id = ?")
    .run(usedG, printerId, amsUnit, trayId);
}

export function getAmsTrayLifetime(printerId) {
  return db.prepare('SELECT * FROM ams_tray_lifetime WHERE printer_id = ? ORDER BY ams_unit, tray_id').all(printerId);
}

// ---- Demo data cleanup ----

export function getDemoPrinterIds() {
  return db.prepare("SELECT id FROM printers WHERE id LIKE 'demo-%'").all().map(r => r.id);
}

export function purgeDemoData() {
  const ids = getDemoPrinterIds();
  if (ids.length === 0) return { deleted: 0 };

  const placeholders = ids.map(() => '?').join(',');
  const tables = [
    'print_history', 'error_log', 'ams_snapshots', 'filament_waste',
    'nozzle_sessions', 'maintenance_log', 'maintenance_schedule',
    'telemetry', 'component_wear', 'firmware_history',
    'xcam_events', 'ams_tray_lifetime', 'filament_inventory',
    'protection_log', 'protection_settings', 'notification_log',
    'notification_queue', 'model_links'
  ];

  let deleted = 0;
  for (const table of tables) {
    try {
      const r = db.prepare(`DELETE FROM ${table} WHERE printer_id IN (${placeholders})`).run(...ids);
      deleted += r.changes;
    } catch { /* table may not exist */ }
  }

  // Delete spools assigned to demo printers + their usage logs and drying sessions
  try {
    const demoSpoolIds = db.prepare(`SELECT id FROM spools WHERE printer_id IN (${placeholders})`).all(...ids).map(r => r.id);
    if (demoSpoolIds.length > 0) {
      const sp = demoSpoolIds.map(() => '?').join(',');
      try { db.prepare(`DELETE FROM spool_usage_log WHERE spool_id IN (${sp})`).run(...demoSpoolIds); } catch {}
      try { db.prepare(`DELETE FROM drying_sessions WHERE spool_id IN (${sp})`).run(...demoSpoolIds); } catch {}
      const r = db.prepare(`DELETE FROM spools WHERE id IN (${sp})`).run(...demoSpoolIds);
      deleted += r.changes;
    }
  } catch {}

  // Delete the printers themselves
  for (const id of ids) {
    db.prepare('DELETE FROM printers WHERE id = ?').run(id);
  }
  deleted += ids.length;

  return { deleted, printerIds: ids };
}

// ---- Notifications ----

export function addNotificationLog(entry) {
  return db.prepare(`INSERT INTO notification_log
    (event_type, channel, printer_id, title, message, status, error_info)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    entry.event_type, entry.channel, entry.printer_id || null,
    entry.title, entry.message, entry.status || 'sent', entry.error_info || null
  );
}

export function getNotificationLog(limit = 50, offset = 0) {
  return db.prepare('SELECT * FROM notification_log ORDER BY timestamp DESC LIMIT ? OFFSET ?')
    .all(limit, offset);
}

export function addNotificationQueue(entry) {
  return db.prepare(`INSERT INTO notification_queue
    (event_type, printer_id, printer_name, title, message, event_data)
    VALUES (?, ?, ?, ?, ?, ?)`).run(
    entry.event_type, entry.printer_id || null, entry.printer_name || null,
    entry.title, entry.message, entry.event_data ? JSON.stringify(entry.event_data) : null
  );
}

export function getNotificationQueue() {
  return db.prepare('SELECT * FROM notification_queue ORDER BY queued_at ASC').all();
}

export function clearNotificationQueue() {
  return db.prepare('DELETE FROM notification_queue').run();
}

// ---- Update History ----

export function addUpdateEntry(entry) {
  const result = db.prepare(`
    INSERT INTO update_history (from_version, to_version, method, status, backup_path)
    VALUES (?, ?, ?, ?, ?)
  `).run(entry.from_version, entry.to_version, entry.method, entry.status || 'started', entry.backup_path || null);
  return result.lastInsertRowid;
}

export function updateUpdateEntry(id, status, errorMessage, durationMs) {
  db.prepare('UPDATE update_history SET status = ?, error_message = ?, duration_ms = ? WHERE id = ?')
    .run(status, errorMessage || null, durationMs || null, id);
}

export function getUpdateHistory(limit = 20) {
  return db.prepare('SELECT * FROM update_history ORDER BY timestamp DESC LIMIT ?').all(limit);
}

// ---- Protection Settings & Log ----

export function getProtectionSettings(printerId) {
  return db.prepare('SELECT * FROM protection_settings WHERE printer_id = ?').get(printerId) || null;
}

export function upsertProtectionSettings(printerId, settings) {
  db.prepare(`INSERT INTO protection_settings
    (printer_id, enabled, spaghetti_action, first_layer_action, foreign_object_action, nozzle_clump_action,
     cooldown_seconds, auto_resume, temp_deviation_action, filament_runout_action, print_error_action,
     fan_failure_action, print_stall_action, temp_deviation_threshold, filament_low_pct, stall_minutes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(printer_id) DO UPDATE SET
      enabled = excluded.enabled,
      spaghetti_action = excluded.spaghetti_action,
      first_layer_action = excluded.first_layer_action,
      foreign_object_action = excluded.foreign_object_action,
      nozzle_clump_action = excluded.nozzle_clump_action,
      cooldown_seconds = excluded.cooldown_seconds,
      auto_resume = excluded.auto_resume,
      temp_deviation_action = excluded.temp_deviation_action,
      filament_runout_action = excluded.filament_runout_action,
      print_error_action = excluded.print_error_action,
      fan_failure_action = excluded.fan_failure_action,
      print_stall_action = excluded.print_stall_action,
      temp_deviation_threshold = excluded.temp_deviation_threshold,
      filament_low_pct = excluded.filament_low_pct,
      stall_minutes = excluded.stall_minutes
  `).run(
    printerId,
    settings.enabled ?? 1,
    settings.spaghetti_action || 'pause',
    settings.first_layer_action || 'notify',
    settings.foreign_object_action || 'pause',
    settings.nozzle_clump_action || 'pause',
    settings.cooldown_seconds ?? 60,
    settings.auto_resume ?? 0,
    settings.temp_deviation_action || 'notify',
    settings.filament_runout_action || 'notify',
    settings.print_error_action || 'notify',
    settings.fan_failure_action || 'notify',
    settings.print_stall_action || 'notify',
    settings.temp_deviation_threshold ?? 15,
    settings.filament_low_pct ?? 5,
    settings.stall_minutes ?? 10
  );
}

export function addProtectionLog(entry) {
  return db.prepare(`INSERT INTO protection_log
    (printer_id, event_type, action_taken, print_id, notes)
    VALUES (?, ?, ?, ?, ?)`).run(
    entry.printer_id, entry.event_type, entry.action_taken,
    entry.print_id || null, entry.notes || null
  );
}

export function getProtectionLog(printerId, limit = 50) {
  if (printerId) {
    return db.prepare('SELECT * FROM protection_log WHERE printer_id = ? ORDER BY timestamp DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM protection_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function resolveProtectionAlert(logId) {
  db.prepare("UPDATE protection_log SET resolved = 1, resolved_at = datetime('now') WHERE id = ?").run(logId);
}

export function getActiveAlerts(printerId) {
  if (printerId) {
    return db.prepare('SELECT * FROM protection_log WHERE printer_id = ? AND resolved = 0 ORDER BY timestamp DESC').all(printerId);
  }
  return db.prepare('SELECT * FROM protection_log WHERE resolved = 0 ORDER BY timestamp DESC').all();
}

// ---- Model Links ----

export function getModelLink(printerId, filename) {
  return db.prepare('SELECT * FROM model_links WHERE printer_id = ? AND filename = ?').get(printerId, filename);
}

export function setModelLink(link) {
  return db.prepare(`INSERT INTO model_links (printer_id, filename, source, source_id, title, url, image, designer, description, category, print_settings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(printer_id, filename) DO UPDATE SET
      source = excluded.source,
      source_id = excluded.source_id,
      title = excluded.title,
      url = excluded.url,
      image = excluded.image,
      designer = excluded.designer,
      description = excluded.description,
      category = excluded.category,
      print_settings = excluded.print_settings,
      linked_at = datetime('now')
  `).run(
    link.printer_id, link.filename, link.source, link.source_id,
    link.title || null, link.url || null, link.image || null, link.designer || null,
    link.description || null, link.category || null,
    link.print_settings ? (typeof link.print_settings === 'string' ? link.print_settings : JSON.stringify(link.print_settings)) : null
  );
}

export function deleteModelLink(printerId, filename) {
  return db.prepare('DELETE FROM model_links WHERE printer_id = ? AND filename = ?').run(printerId, filename);
}

export function getRecentModelLinks(limit = 10) {
  return db.prepare('SELECT * FROM model_links ORDER BY linked_at DESC LIMIT ?').all(limit);
}

// ---- Vendors ----

export function getVendors(filters = {}) {
  if (filters.limit) {
    const total = db.prepare('SELECT COUNT(*) as total FROM vendors').get().total;
    const rows = db.prepare('SELECT * FROM vendors ORDER BY name LIMIT ? OFFSET ?')
      .all(filters.limit, filters.offset || 0);
    return { rows, total };
  }
  return db.prepare('SELECT * FROM vendors ORDER BY name').all();
}

export function addVendor(v) {
  const result = db.prepare('INSERT INTO vendors (name, website, empty_spool_weight_g, comment, extra_fields, external_id) VALUES (?, ?, ?, ?, ?, ?)')
    .run(v.name, v.website || null, v.empty_spool_weight_g || null, v.comment || null,
      v.extra_fields ? (typeof v.extra_fields === 'string' ? v.extra_fields : JSON.stringify(v.extra_fields)) : null,
      v.external_id || null);
  return { id: Number(result.lastInsertRowid), ...v };
}

export function updateVendor(id, v) {
  db.prepare('UPDATE vendors SET name=?, website=?, empty_spool_weight_g=?, comment=?, extra_fields=?, external_id=? WHERE id=?')
    .run(v.name, v.website || null, v.empty_spool_weight_g || null, v.comment || null,
      v.extra_fields ? (typeof v.extra_fields === 'string' ? v.extra_fields : JSON.stringify(v.extra_fields)) : null,
      v.external_id || null, id);
}

export function deleteVendor(id) {
  db.prepare('DELETE FROM vendors WHERE id=?').run(id);
}

// ---- Filament Profiles ----

export function getFilamentProfiles(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.vendor_id) { where += ' AND fp.vendor_id = ?'; params.push(filters.vendor_id); }
  if (filters.material) { where += ' AND fp.material = ?'; params.push(filters.material); }
  const baseSql = `FROM filament_profiles fp LEFT JOIN vendors v ON fp.vendor_id = v.id` + where;
  if (filters.limit) {
    const total = db.prepare(`SELECT COUNT(*) as total ${baseSql}`).get(...params).total;
    const rows = db.prepare(`SELECT fp.*, v.name as vendor_name ${baseSql} ORDER BY v.name, fp.name LIMIT ? OFFSET ?`)
      .all(...params, filters.limit, filters.offset || 0);
    return { rows, total };
  }
  return db.prepare(`SELECT fp.*, v.name as vendor_name ${baseSql} ORDER BY v.name, fp.name`).all(...params);
}

export function getFilamentProfile(id) {
  return db.prepare(`SELECT fp.*, v.name as vendor_name FROM filament_profiles fp
    LEFT JOIN vendors v ON fp.vendor_id = v.id WHERE fp.id = ?`).get(id) || null;
}

function _jsonCol(val) {
  if (!val) return null;
  return typeof val === 'string' ? val : JSON.stringify(val);
}

export function addFilamentProfile(p) {
  const result = db.prepare(`INSERT INTO filament_profiles
    (vendor_id, name, material, color_name, color_hex, density, diameter, spool_weight_g,
     nozzle_temp_min, nozzle_temp_max, bed_temp_min, bed_temp_max, comment,
     article_number, multi_color_hexes, multi_color_direction, extra_fields,
     finish, translucent, glow, weight_options, external_id, diameters, weights, price,
     pressure_advance_k, max_volumetric_speed, retraction_distance, retraction_speed, cooling_fan_speed, optimal_settings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    p.vendor_id || null, p.name, p.material, p.color_name || null, p.color_hex || null,
    p.density ?? 1.24, p.diameter ?? 1.75, p.spool_weight_g ?? 1000,
    p.nozzle_temp_min || null, p.nozzle_temp_max || null, p.bed_temp_min || null, p.bed_temp_max || null,
    p.comment || null, p.article_number || null,
    _jsonCol(p.multi_color_hexes), p.multi_color_direction || null, _jsonCol(p.extra_fields),
    p.finish || null, p.translucent ? 1 : 0, p.glow ? 1 : 0,
    _jsonCol(p.weight_options), p.external_id || null, _jsonCol(p.diameters), _jsonCol(p.weights),
    p.price ?? null,
    p.pressure_advance_k ?? null, p.max_volumetric_speed ?? null, p.retraction_distance ?? null,
    p.retraction_speed ?? null, p.cooling_fan_speed ?? null, _jsonCol(p.optimal_settings));
  return { id: Number(result.lastInsertRowid) };
}

export function updateFilamentProfile(id, p) {
  db.prepare(`UPDATE filament_profiles SET vendor_id=?, name=?, material=?, color_name=?, color_hex=?,
    density=?, diameter=?, spool_weight_g=?, nozzle_temp_min=?, nozzle_temp_max=?, bed_temp_min=?, bed_temp_max=?,
    comment=?, article_number=?, multi_color_hexes=?, multi_color_direction=?, extra_fields=?,
    finish=?, translucent=?, glow=?, weight_options=?, external_id=?, diameters=?, weights=?, price=?,
    pressure_advance_k=?, max_volumetric_speed=?, retraction_distance=?, retraction_speed=?, cooling_fan_speed=?, optimal_settings=?
    WHERE id=?`).run(
    p.vendor_id || null, p.name, p.material, p.color_name || null, p.color_hex || null,
    p.density ?? 1.24, p.diameter ?? 1.75, p.spool_weight_g ?? 1000,
    p.nozzle_temp_min || null, p.nozzle_temp_max || null, p.bed_temp_min || null, p.bed_temp_max || null,
    p.comment || null, p.article_number || null,
    _jsonCol(p.multi_color_hexes), p.multi_color_direction || null, _jsonCol(p.extra_fields),
    p.finish || null, p.translucent ? 1 : 0, p.glow ? 1 : 0,
    _jsonCol(p.weight_options), p.external_id || null, _jsonCol(p.diameters), _jsonCol(p.weights),
    p.price ?? null,
    p.pressure_advance_k ?? null, p.max_volumetric_speed ?? null, p.retraction_distance ?? null,
    p.retraction_speed ?? null, p.cooling_fan_speed ?? null, _jsonCol(p.optimal_settings), id);
}

export function deleteFilamentProfile(id) {
  db.prepare('DELETE FROM filament_profiles WHERE id=?').run(id);
}

// ---- Spools ----

const SPOOL_SELECT = `SELECT s.*,
  fp.name as profile_name, fp.material, fp.color_name, fp.color_hex,
  fp.density, fp.diameter, fp.spool_weight_g as profile_spool_weight_g,
  fp.nozzle_temp_min, fp.nozzle_temp_max, fp.bed_temp_min, fp.bed_temp_max,
  fp.article_number, fp.multi_color_hexes, fp.multi_color_direction,
  fp.extra_fields as profile_extra_fields,
  fp.finish, fp.translucent, fp.glow, fp.weight_options,
  fp.price as profile_price,
  fp.pressure_advance_k, fp.max_volumetric_speed, fp.retraction_distance, fp.retraction_speed, fp.cooling_fan_speed, fp.optimal_settings,
  fp.external_id as profile_external_id, fp.diameters, fp.weights,
  v.name as vendor_name, v.id as vendor_id, v.empty_spool_weight_g as vendor_empty_spool_weight_g,
  v.external_id as vendor_external_id
  FROM spools s
  LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
  LEFT JOIN vendors v ON fp.vendor_id = v.id`;

export function getSpools(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.archived !== undefined) { where += ' AND s.archived = ?'; params.push(filters.archived ? 1 : 0); }
  if (filters.material) { where += ' AND fp.material = ?'; params.push(filters.material); }
  if (filters.vendor_id) { where += ' AND fp.vendor_id = ?'; params.push(filters.vendor_id); }
  if (filters.location) { where += ' AND s.location = ?'; params.push(filters.location); }
  if (filters.printer_id) { where += ' AND s.printer_id = ?'; params.push(filters.printer_id); }
  const countSql = `SELECT COUNT(*) as total FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id` + where;
  const total = db.prepare(countSql).get(...params).total;
  let sql = SPOOL_SELECT + where + ' ORDER BY s.archived ASC, s.last_used_at DESC NULLS LAST, s.created_at DESC';
  if (filters.limit) { sql += ' LIMIT ?'; params.push(filters.limit); }
  if (filters.offset) { sql += ' OFFSET ?'; params.push(filters.offset); }
  return { rows: _enrichSpoolRows(db.prepare(sql).all(...params)), total };
}

export function getSpool(id) {
  const row = db.prepare(SPOOL_SELECT + ' WHERE s.id = ?').get(id) || null;
  if (row) _enrichSpoolRows([row]);
  return row;
}

export function addSpool(s) {
  const result = db.prepare(`INSERT INTO spools
    (filament_profile_id, remaining_weight_g, used_weight_g, initial_weight_g, cost, lot_number,
     purchase_date, location, printer_id, ams_unit, ams_tray, comment, extra_fields, spool_weight)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    s.filament_profile_id || null, s.remaining_weight_g ?? s.initial_weight_g ?? 1000,
    s.used_weight_g ?? 0, s.initial_weight_g ?? 1000,
    s.cost || null, s.lot_number || null, s.purchase_date || null,
    s.location || null, s.printer_id || null, s.ams_unit ?? null, s.ams_tray ?? null,
    s.comment || null, s.extra_fields ? JSON.stringify(s.extra_fields) : null,
    s.spool_weight ?? null);
  const newId = Number(result.lastInsertRowid);
  try { addSpoolEvent(newId, 'created', null, null); } catch (_) {}
  return { id: newId };
}

export function updateSpool(id, s) {
  db.prepare(`UPDATE spools SET filament_profile_id=?, remaining_weight_g=?, used_weight_g=?,
    initial_weight_g=?, cost=?, lot_number=?, purchase_date=?, location=?,
    printer_id=?, ams_unit=?, ams_tray=?, archived=?, comment=?, extra_fields=?, spool_weight=?
    WHERE id=?`).run(
    s.filament_profile_id || null, s.remaining_weight_g, s.used_weight_g,
    s.initial_weight_g, s.cost || null, s.lot_number || null, s.purchase_date || null,
    s.location || null, s.printer_id || null, s.ams_unit ?? null, s.ams_tray ?? null,
    s.archived ?? 0, s.comment || null,
    s.extra_fields ? JSON.stringify(s.extra_fields) : null, s.spool_weight ?? null, id);
  try { addSpoolEvent(id, 'edited', null, null); } catch (_) {}
}

export function deleteSpool(id) {
  db.prepare('DELETE FROM spools WHERE id=?').run(id);
}

export function archiveSpool(id, archived = true) {
  db.prepare('UPDATE spools SET archived = ? WHERE id = ?').run(archived ? 1 : 0, id);
  try { addSpoolEvent(id, archived ? 'archived' : 'unarchived', null, null); } catch (_) {}
}

export function useSpoolWeight(spoolId, weightG, source = 'auto', printHistoryId = null, printerId = null) {
  db.prepare(`UPDATE spools SET
    remaining_weight_g = MAX(0, remaining_weight_g - ?),
    used_weight_g = used_weight_g + ?,
    last_used_at = datetime('now'),
    first_used_at = COALESCE(first_used_at, datetime('now'))
    WHERE id = ?`).run(weightG, weightG, spoolId);

  db.prepare(`INSERT INTO spool_usage_log (spool_id, print_history_id, printer_id, used_weight_g, source)
    VALUES (?, ?, ?, ?, ?)`).run(spoolId, printHistoryId || null, printerId || null, weightG, source);
  try { addSpoolEvent(spoolId, 'used', JSON.stringify({ weight_g: weightG, source }), null); } catch (_) {}
}

export function assignSpoolToSlot(spoolId, printerId, amsUnit, amsTray) {
  // Clear any existing spool in this slot
  if (printerId != null && amsUnit != null && amsTray != null) {
    db.prepare('UPDATE spools SET printer_id = NULL, ams_unit = NULL, ams_tray = NULL WHERE printer_id = ? AND ams_unit = ? AND ams_tray = ? AND id != ?')
      .run(printerId, amsUnit, amsTray, spoolId);
  }
  db.prepare('UPDATE spools SET printer_id = ?, ams_unit = ?, ams_tray = ? WHERE id = ?')
    .run(printerId || null, amsUnit ?? null, amsTray ?? null, spoolId);
  try {
    const evt = printerId ? 'assigned' : 'unassigned';
    addSpoolEvent(spoolId, evt, JSON.stringify({ printer_id: printerId, ams_unit: amsUnit, ams_tray: amsTray }), null);
  } catch (_) {}
}

export function getSpoolBySlot(printerId, amsUnit, amsTray) {
  return db.prepare(SPOOL_SELECT + ' WHERE s.printer_id = ? AND s.ams_unit = ? AND s.ams_tray = ? AND s.archived = 0')
    .get(printerId, amsUnit, amsTray) || null;
}

// ---- Spool Usage Log ----

export function getSpoolUsageLog(filters = {}) {
  let sql = `SELECT sul.*, s.id as spool_id, fp.name as profile_name, fp.material, fp.color_hex, v.name as vendor_name
    FROM spool_usage_log sul
    LEFT JOIN spools s ON sul.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id WHERE 1=1`;
  const params = [];
  if (filters.spool_id) { sql += ' AND sul.spool_id = ?'; params.push(filters.spool_id); }
  if (filters.printer_id) { sql += ' AND sul.printer_id = ?'; params.push(filters.printer_id); }
  sql += ' ORDER BY sul.timestamp DESC';
  if (filters.limit) { sql += ' LIMIT ?'; params.push(filters.limit); }
  return db.prepare(sql).all(...params);
}

// ---- Locations ----

export function getLocations() {
  return db.prepare('SELECT * FROM locations ORDER BY name').all();
}

export function addLocation(l) {
  const result = db.prepare('INSERT INTO locations (name, description) VALUES (?, ?)').run(l.name, l.description || null);
  return { id: Number(result.lastInsertRowid), ...l };
}

export function updateLocation(id, data) {
  const location = db.prepare('SELECT name FROM locations WHERE id = ?').get(id);
  if (!location) return null;
  const oldName = location.name;
  db.prepare('UPDATE locations SET name = ?, description = ? WHERE id = ?')
    .run(data.name, data.description ?? null, id);
  if (data.name !== oldName) {
    db.prepare('UPDATE spools SET location = ? WHERE location = ?').run(data.name, oldName);
  }
  return { id, old_name: oldName, new_name: data.name };
}

export function deleteLocation(id) {
  db.prepare('DELETE FROM locations WHERE id=?').run(id);
}

// ---- Inventory Stats ----

export function getInventoryStats() {
  const totalSpools = db.prepare('SELECT COUNT(*) as count FROM spools WHERE archived = 0').get();
  const totalWeight = db.prepare('SELECT COALESCE(SUM(remaining_weight_g), 0) as weight FROM spools WHERE archived = 0').get();
  const totalUsed = db.prepare('SELECT COALESCE(SUM(used_weight_g), 0) as weight FROM spools WHERE archived = 0').get();
  const totalCost = db.prepare('SELECT COALESCE(SUM(cost), 0) as cost FROM spools WHERE archived = 0').get();
  const lowStock = db.prepare('SELECT COUNT(*) as count FROM spools WHERE archived = 0 AND remaining_weight_g < (initial_weight_g * 0.2)').get();
  const byMaterial = db.prepare(`SELECT fp.material, COUNT(*) as count, COALESCE(SUM(s.remaining_weight_g), 0) as remaining_g
    FROM spools s LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    WHERE s.archived = 0 GROUP BY fp.material ORDER BY remaining_g DESC`).all();
  const byVendor = db.prepare(`SELECT v.name as vendor, COUNT(*) as count, COALESCE(SUM(s.remaining_weight_g), 0) as remaining_g, COALESCE(SUM(s.cost), 0) as total_cost
    FROM spools s LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.archived = 0 GROUP BY v.name ORDER BY remaining_g DESC`).all();
  const recentUsage = db.prepare(`SELECT COALESCE(SUM(used_weight_g), 0) as used_g FROM spool_usage_log WHERE timestamp >= datetime('now', '-30 days')`).get();

  return {
    total_spools: totalSpools.count,
    total_remaining_g: Math.round(totalWeight.weight),
    total_used_g: Math.round(totalUsed.weight),
    total_cost: Math.round(totalCost.cost * 100) / 100,
    low_stock_count: lowStock.count,
    by_material: byMaterial,
    by_vendor: byVendor,
    usage_last_30d_g: Math.round(recentUsage.used_g)
  };
}

// ---- Search ----

export function searchSpools(query, limit = 50, offset = 0) {
  const pattern = `%${query}%`;
  const where = ` WHERE (
    s.lot_number LIKE ? OR s.location LIKE ? OR s.comment LIKE ?
    OR fp.name LIKE ? OR fp.material LIKE ? OR fp.color_name LIKE ?
    OR fp.article_number LIKE ? OR v.name LIKE ?
  )`;
  const p = [pattern, pattern, pattern, pattern, pattern, pattern, pattern, pattern];
  const total = db.prepare(`SELECT COUNT(*) as total FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id` + where).get(...p).total;
  const rows = db.prepare(SPOOL_SELECT + where + ' ORDER BY s.last_used_at DESC NULLS LAST LIMIT ? OFFSET ?').all(...p, limit, offset);
  return { rows: _enrichSpoolRows(rows), total };
}

// ---- Duplicate ----

export function duplicateSpool(id) {
  const original = getSpool(id);
  if (!original) return null;
  const result = db.prepare(`INSERT INTO spools
    (filament_profile_id, remaining_weight_g, used_weight_g, initial_weight_g, cost, lot_number,
     purchase_date, location, comment, extra_fields, spool_weight)
    VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    original.filament_profile_id, original.initial_weight_g, original.initial_weight_g,
    original.cost || null, original.lot_number || null, original.purchase_date || null,
    original.location || null, original.comment || null, original.extra_fields || null,
    original.spool_weight ?? null);
  return { id: Number(result.lastInsertRowid) };
}

// ---- Measure Weight ----

export function measureSpoolWeight(spoolId, grossWeightG) {
  const spool = getSpool(spoolId);
  if (!spool) return null;
  const emptySpoolWeight = spool.spool_weight ?? spool.vendor_empty_spool_weight_g ?? 250;
  const netFilamentG = Math.max(0, grossWeightG - emptySpoolWeight);
  const usedG = Math.max(0, (spool.initial_weight_g || 1000) - netFilamentG);

  db.prepare(`UPDATE spools SET remaining_weight_g = ?, used_weight_g = ?, last_used_at = datetime('now') WHERE id = ?`)
    .run(netFilamentG, usedG, spoolId);

  return {
    gross_weight_g: grossWeightG,
    empty_spool_weight_g: emptySpoolWeight,
    net_filament_g: Math.round(netFilamentG),
    used_g: Math.round(usedG),
    remaining_pct: (spool.initial_weight_g || 1000) > 0 ? Math.round((netFilamentG / (spool.initial_weight_g || 1000)) * 100) : 0
  };
}

// ---- Length Calculations ----

export function weightToLength(weightG, density, diameterMm) {
  if (!weightG || !density || !diameterMm) return null;
  const radiusCm = (diameterMm / 10) / 2;
  const volumeCm3 = weightG / density;
  const lengthCm = volumeCm3 / (Math.PI * radiusCm * radiusCm);
  return Math.round(lengthCm / 100 * 10) / 10;
}

export function lengthToWeight(lengthMm, density, diameterMm) {
  if (!lengthMm || !density || !diameterMm) return null;
  const radiusCm = (diameterMm / 10) / 2;
  const lengthCm = lengthMm / 10;
  const volumeCm3 = lengthCm * Math.PI * radiusCm * radiusCm;
  return Math.round(volumeCm3 * density * 100) / 100;
}

function _enrichSpoolRows(rows) {
  for (const r of rows) {
    r.remaining_length_m = weightToLength(r.remaining_weight_g, r.density, r.diameter);
    r.used_length_m = weightToLength(r.used_weight_g, r.density, r.diameter);
  }
  return rows;
}

// ---- Export ----

export function getAllSpoolsForExport() {
  return _enrichSpoolRows(db.prepare(SPOOL_SELECT + ' ORDER BY s.id').all());
}

export function getAllFilamentProfilesForExport() {
  return db.prepare(`SELECT fp.*, v.name as vendor_name FROM filament_profiles fp
    LEFT JOIN vendors v ON fp.vendor_id = v.id ORDER BY fp.id`).all();
}

export function getAllVendorsForExport() {
  return db.prepare('SELECT * FROM vendors ORDER BY id').all();
}

// ---- Color Similarity (CIELAB Delta-E CIE76) ----

function srgbToLab(hex) {
  if (!hex || hex.length < 6) return null;
  const h = hex.replace('#', '');
  let r = parseInt(h.substring(0, 2), 16) / 255;
  let g = parseInt(h.substring(2, 4), 16) / 255;
  let b = parseInt(h.substring(4, 6), 16) / 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  let x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  let y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750);
  let z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883;
  const f = v => v > 0.008856 ? Math.pow(v, 1 / 3) : (7.787 * v) + 16 / 116;
  x = f(x); y = f(y); z = f(z);
  return { L: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

function deltaE(hex1, hex2) {
  const lab1 = srgbToLab(hex1);
  const lab2 = srgbToLab(hex2);
  if (!lab1 || !lab2) return Infinity;
  return Math.sqrt(Math.pow(lab1.L - lab2.L, 2) + Math.pow(lab1.a - lab2.a, 2) + Math.pow(lab1.b - lab2.b, 2));
}

export function findSimilarColors(targetHex, maxDeltaE = 30) {
  const profiles = db.prepare('SELECT id, name, material, color_hex, color_name, vendor_id FROM filament_profiles WHERE color_hex IS NOT NULL').all();
  const results = [];
  for (const p of profiles) {
    const dE = deltaE(targetHex, p.color_hex);
    if (dE <= maxDeltaE) results.push({ ...p, delta_e: Math.round(dE * 10) / 10 });
  }
  results.sort((a, b) => a.delta_e - b.delta_e);
  return results;
}

// ---- Distinct value lists ----

export function getDistinctMaterials() {
  return db.prepare('SELECT DISTINCT material FROM filament_profiles WHERE material IS NOT NULL ORDER BY material').all().map(r => r.material);
}

export function getDistinctLotNumbers() {
  return db.prepare('SELECT DISTINCT lot_number FROM spools WHERE lot_number IS NOT NULL AND lot_number != \'\' ORDER BY lot_number').all().map(r => r.lot_number);
}

export function getDistinctArticleNumbers() {
  return db.prepare('SELECT DISTINCT article_number FROM filament_profiles WHERE article_number IS NOT NULL AND article_number != \'\' ORDER BY article_number').all().map(r => r.article_number);
}

// ---- Inventory Settings ----

export function getInventorySetting(key) {
  const row = db.prepare('SELECT value FROM inventory_settings WHERE key = ?').get(key);
  return row ? row.value : null;
}

export function setInventorySetting(key, value) {
  db.prepare('INSERT OR REPLACE INTO inventory_settings (key, value) VALUES (?, ?)').run(key, String(value));
}

export function getAllInventorySettings() {
  const rows = db.prepare('SELECT key, value FROM inventory_settings ORDER BY key').all();
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  return obj;
}

// ---- Import (CSV/JSON) ----

export function importSpools(spools) {
  let count = 0;
  for (const s of spools) {
    try {
      addSpool(s);
      count++;
    } catch {}
  }
  return count;
}

export function importFilamentProfiles(profiles) {
  let count = 0;
  for (const p of profiles) {
    try {
      addFilamentProfile(p);
      count++;
    } catch {}
  }
  return count;
}

export function importVendors(vendors) {
  let count = 0;
  for (const v of vendors) {
    try {
      addVendor(v);
      count++;
    } catch {}
  }
  return count;
}

// ---- Custom field schemas ----

export function getFieldSchemas(entityType) {
  return db.prepare('SELECT * FROM field_schemas WHERE entity_type = ? ORDER BY key').all(entityType);
}

export function addFieldSchema(entityType, key, schema) {
  const result = db.prepare('INSERT INTO field_schemas (entity_type, key, name, field_type, unit) VALUES (?, ?, ?, ?, ?)')
    .run(entityType, key, schema.name || key, schema.field_type || 'text', schema.unit || null);
  return { id: Number(result.lastInsertRowid), entity_type: entityType, key, ...schema };
}

export function deleteFieldSchema(entityType, key) {
  db.prepare('DELETE FROM field_schemas WHERE entity_type = ? AND key = ?').run(entityType, key);
}

// ---- Drying Management ----

export function getDryingSessions(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.spool_id) { where += ' AND ds.spool_id = ?'; params.push(filters.spool_id); }
  if (filters.active !== undefined) { where += ' AND ds.active = ?'; params.push(filters.active ? 1 : 0); }
  let sql = `SELECT ds.*, fp.name AS profile_name, fp.material, fp.color_hex, v.name AS vendor_name
    FROM drying_sessions ds
    LEFT JOIN spools s ON ds.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id` + where + ' ORDER BY ds.started_at DESC';
  if (filters.limit) { sql += ' LIMIT ?'; params.push(filters.limit); }
  return db.prepare(sql).all(...params);
}

export function getActiveDryingSessions() {
  return db.prepare(`SELECT ds.*, fp.name AS profile_name, fp.material, fp.color_hex, v.name AS vendor_name
    FROM drying_sessions ds
    LEFT JOIN spools s ON ds.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE ds.active = 1 ORDER BY ds.started_at DESC`).all();
}

export function startDryingSession(data) {
  const result = db.prepare(`INSERT INTO drying_sessions
    (spool_id, temperature, duration_minutes, method, humidity_before, notes, active)
    VALUES (?, ?, ?, ?, ?, ?, 1)`).run(
    data.spool_id, data.temperature || null, data.duration_minutes,
    data.method || 'dryer_box', data.humidity_before || null, data.notes || null);
  return { id: Number(result.lastInsertRowid) };
}

export function completeDryingSession(sessionId, humidityAfter = null) {
  db.prepare(`UPDATE drying_sessions SET active = 0, completed_at = datetime('now'), humidity_after = ? WHERE id = ?`)
    .run(humidityAfter, sessionId);
  const session = db.prepare('SELECT spool_id FROM drying_sessions WHERE id = ?').get(sessionId);
  if (session) {
    db.prepare(`UPDATE spools SET last_dried_at = datetime('now') WHERE id = ?`).run(session.spool_id);
  }
}

export function deleteDryingSession(sessionId) {
  db.prepare('DELETE FROM drying_sessions WHERE id = ?').run(sessionId);
}

export function getDryingPresets() {
  return db.prepare('SELECT * FROM drying_presets ORDER BY material').all();
}

export function getDryingPreset(material) {
  return db.prepare('SELECT * FROM drying_presets WHERE material = ?').get(material) || null;
}

export function upsertDryingPreset(material, data) {
  const existing = db.prepare('SELECT id FROM drying_presets WHERE material = ?').get(material);
  if (existing) {
    db.prepare('UPDATE drying_presets SET temperature = ?, duration_minutes = ?, max_days_without_drying = ?, notes = ? WHERE id = ?')
      .run(data.temperature, data.duration_minutes, data.max_days_without_drying ?? 30, data.notes || null, existing.id);
  } else {
    db.prepare('INSERT INTO drying_presets (material, temperature, duration_minutes, max_days_without_drying, notes) VALUES (?, ?, ?, ?, ?)')
      .run(material, data.temperature, data.duration_minutes, data.max_days_without_drying ?? 30, data.notes || null);
  }
}

export function deleteDryingPreset(material) {
  db.prepare('DELETE FROM drying_presets WHERE material = ?').run(material);
}

export function getUsagePredictions() {
  const byMaterial = db.prepare(`
    SELECT fp.material,
      SUM(sul.used_weight_g) AS total_used_g,
      COUNT(DISTINCT DATE(sul.timestamp)) AS active_days,
      ROUND(SUM(sul.used_weight_g) / MAX(1, COUNT(DISTINCT DATE(sul.timestamp))), 2) AS avg_daily_g
    FROM spool_usage_log sul
    LEFT JOIN spools s ON sul.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    WHERE sul.timestamp >= datetime('now', '-90 days')
    GROUP BY fp.material
    ORDER BY total_used_g DESC
  `).all();

  const perSpool = db.prepare(`
    SELECT s.id, s.remaining_weight_g, fp.material, fp.name AS profile_name, v.name AS vendor_name, fp.color_hex,
      COALESCE(
        (SELECT ROUND(SUM(sul2.used_weight_g) / MAX(1, COUNT(DISTINCT DATE(sul2.timestamp))), 2)
         FROM spool_usage_log sul2 WHERE sul2.spool_id = s.id AND sul2.timestamp >= datetime('now', '-90 days')),
        0
      ) AS avg_daily_g
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.archived = 0 AND s.remaining_weight_g > 0
    ORDER BY avg_daily_g DESC
  `).all().map(row => ({
    ...row,
    days_until_empty: row.avg_daily_g > 0 ? Math.round(row.remaining_weight_g / row.avg_daily_g) : null,
    needs_reorder: row.avg_daily_g > 0 && (row.remaining_weight_g / row.avg_daily_g) < 14
  }));

  return { by_material: byMaterial, per_spool: perSpool };
}

export function getLowStockSpools(thresholdPct = 20) {
  return db.prepare(`SELECT s.id, s.remaining_weight_g, s.initial_weight_g,
    ROUND((s.remaining_weight_g * 100.0 / s.initial_weight_g), 1) AS remaining_pct,
    fp.name AS profile_name, fp.material, v.name AS vendor_name
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.archived = 0 AND s.initial_weight_g > 0
    AND (s.remaining_weight_g * 100.0 / s.initial_weight_g) < ?
    ORDER BY remaining_pct ASC`).all(thresholdPct);
}

export function estimatePrintCost(filamentUsedG, durationSeconds, spoolId = null) {
  const electricityRate = parseFloat(getInventorySetting('electricity_rate_kwh') || '0');
  const printerWattage = parseFloat(getInventorySetting('printer_wattage') || '0');
  const machineCost = parseFloat(getInventorySetting('machine_cost') || '0');
  const machineLifetimeH = parseFloat(getInventorySetting('machine_lifetime_hours') || '0');

  let filamentCostPerG = 0;
  if (spoolId) {
    const spool = db.prepare(`SELECT s.cost, s.initial_weight_g,
      (SELECT fp.price FROM filament_profiles fp WHERE fp.id = s.filament_profile_id) AS profile_price
      FROM spools s WHERE s.id = ?`).get(spoolId);
    if (spool) {
      if (spool.cost > 0 && spool.initial_weight_g > 0) {
        filamentCostPerG = spool.cost / spool.initial_weight_g;
      } else if (spool.profile_price > 0) {
        filamentCostPerG = spool.profile_price / 1000;
      }
    }
  }

  const filamentCost = Math.round(filamentUsedG * filamentCostPerG * 100) / 100;
  const durationH = durationSeconds / 3600;
  const electricityCost = Math.round(durationH * (printerWattage / 1000) * electricityRate * 100) / 100;
  const depreciationCost = machineLifetimeH > 0 ? Math.round(durationH * (machineCost / machineLifetimeH) * 100) / 100 : 0;
  const totalCost = Math.round((filamentCost + electricityCost + depreciationCost) * 100) / 100;

  return { filament_cost: filamentCost, electricity_cost: electricityCost, depreciation_cost: depreciationCost, total_cost: totalCost };
}

export function getSpoolsDryingStatus() {
  return db.prepare(`SELECT s.id, s.last_dried_at, fp.name AS profile_name, fp.material, fp.color_hex, v.name AS vendor_name,
    dp.max_days_without_drying,
    CASE
      WHEN s.last_dried_at IS NULL THEN 'unknown'
      WHEN julianday('now') - julianday(s.last_dried_at) > COALESCE(dp.max_days_without_drying, 30) THEN 'overdue'
      WHEN julianday('now') - julianday(s.last_dried_at) > COALESCE(dp.max_days_without_drying, 30) * 0.75 THEN 'due_soon'
      ELSE 'fresh'
    END AS drying_status,
    ROUND(julianday('now') - julianday(s.last_dried_at), 1) AS days_since_dried
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    LEFT JOIN drying_presets dp ON fp.material = dp.material
    WHERE s.archived = 0`).all();
}

// ---- Print Queue ----

export function createQueue(opts) {
  const r = db.prepare(`INSERT INTO print_queue (name, description, status, auto_start, cooldown_seconds, bed_clear_gcode, priority_mode, target_printer_id, created_by)
    VALUES (?, ?, 'active', ?, ?, ?, ?, ?, ?)`).run(
    opts.name, opts.description || null, opts.auto_start ? 1 : 0,
    opts.cooldown_seconds || 60, opts.bed_clear_gcode || null,
    opts.priority_mode || 'fifo', opts.target_printer_id || null, opts.created_by || null
  );
  return r.lastInsertRowid;
}

export function getQueues(status) {
  let sql = `SELECT q.*, (SELECT COUNT(*) FROM queue_items qi WHERE qi.queue_id = q.id) AS item_count,
    (SELECT COUNT(*) FROM queue_items qi WHERE qi.queue_id = q.id AND qi.status = 'completed') AS completed_count,
    (SELECT COUNT(*) FROM queue_items qi WHERE qi.queue_id = q.id AND qi.status = 'printing') AS printing_count
    FROM print_queue q`;
  if (status) {
    sql += ` WHERE q.status = ?`;
    return db.prepare(sql + ' ORDER BY q.created_at DESC').all(status);
  }
  return db.prepare(sql + ' ORDER BY q.created_at DESC').all();
}

export function getQueue(id) {
  const queue = db.prepare('SELECT * FROM print_queue WHERE id = ?').get(id);
  if (!queue) return null;
  queue.items = db.prepare('SELECT * FROM queue_items WHERE queue_id = ? ORDER BY sort_order, priority DESC, added_at').all(id);
  return queue;
}

export function updateQueue(id, opts) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'status', 'priority_mode', 'target_printer_id', 'bed_clear_gcode', 'completed_at']) {
    if (opts[key] !== undefined) { fields.push(`${key} = ?`); values.push(opts[key]); }
  }
  if (opts.auto_start !== undefined) { fields.push('auto_start = ?'); values.push(opts.auto_start ? 1 : 0); }
  if (opts.cooldown_seconds !== undefined) { fields.push('cooldown_seconds = ?'); values.push(opts.cooldown_seconds); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE print_queue SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteQueue(id) {
  db.prepare('DELETE FROM queue_log WHERE queue_id = ?').run(id);
  db.prepare('DELETE FROM queue_items WHERE queue_id = ?').run(id);
  db.prepare('DELETE FROM print_queue WHERE id = ?').run(id);
}

export function addQueueItem(queueId, item) {
  const maxSort = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM queue_items WHERE queue_id = ?').get(queueId);
  const r = db.prepare(`INSERT INTO queue_items (queue_id, filename, printer_id, status, priority, copies, estimated_duration_s, estimated_filament_g, required_material, required_nozzle_mm, notes, sort_order)
    VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    queueId, item.filename, item.printer_id || null, item.priority || 0,
    item.copies || 1, item.estimated_duration_s || null, item.estimated_filament_g || null,
    item.required_material || null, item.required_nozzle_mm || null, item.notes || null,
    (maxSort?.m || 0) + 1
  );
  return r.lastInsertRowid;
}

export function getQueueItem(id) {
  return db.prepare('SELECT * FROM queue_items WHERE id = ?').get(id);
}

export function updateQueueItem(id, opts) {
  const fields = [];
  const values = [];
  for (const key of ['filename', 'printer_id', 'status', 'notes', 'started_at', 'completed_at']) {
    if (opts[key] !== undefined) { fields.push(`${key} = ?`); values.push(opts[key]); }
  }
  for (const key of ['priority', 'copies', 'copies_completed', 'print_history_id', 'estimated_duration_s', 'sort_order']) {
    if (opts[key] !== undefined) { fields.push(`${key} = ?`); values.push(opts[key]); }
  }
  if (opts.estimated_filament_g !== undefined) { fields.push('estimated_filament_g = ?'); values.push(opts.estimated_filament_g); }
  if (opts.required_material !== undefined) { fields.push('required_material = ?'); values.push(opts.required_material); }
  if (opts.required_nozzle_mm !== undefined) { fields.push('required_nozzle_mm = ?'); values.push(opts.required_nozzle_mm); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE queue_items SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteQueueItem(id) {
  db.prepare('DELETE FROM queue_items WHERE id = ?').run(id);
}

export function reorderQueueItems(queueId, itemIds) {
  const stmt = db.prepare('UPDATE queue_items SET sort_order = ? WHERE id = ? AND queue_id = ?');
  for (let i = 0; i < itemIds.length; i++) {
    stmt.run(i + 1, itemIds[i], queueId);
  }
}

export function getNextPendingItem(queueId, priorityMode) {
  if (priorityMode === 'priority') {
    return db.prepare('SELECT * FROM queue_items WHERE queue_id = ? AND status = ? ORDER BY priority DESC, sort_order, added_at LIMIT 1').get(queueId, 'pending');
  }
  return db.prepare('SELECT * FROM queue_items WHERE queue_id = ? AND status = ? ORDER BY sort_order, added_at LIMIT 1').get(queueId, 'pending');
}

export function getActiveQueueItems() {
  return db.prepare(`SELECT qi.*, pq.name AS queue_name FROM queue_items qi
    JOIN print_queue pq ON qi.queue_id = pq.id
    WHERE qi.status IN ('printing', 'assigned')
    ORDER BY qi.started_at DESC`).all();
}

export function addQueueLog(queueId, itemId, printerId, event, details) {
  db.prepare('INSERT INTO queue_log (queue_id, item_id, printer_id, event, details) VALUES (?, ?, ?, ?, ?)').run(
    queueId, itemId || null, printerId || null, event, details || null
  );
}

export function getQueueLog(queueId, limit = 50) {
  if (queueId) {
    return db.prepare('SELECT * FROM queue_log WHERE queue_id = ? ORDER BY timestamp DESC LIMIT ?').all(queueId, limit);
  }
  return db.prepare('SELECT * FROM queue_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

// ---- Tags ----

export function getTags(category) {
  if (category) return db.prepare('SELECT * FROM tags WHERE category = ? ORDER BY name').all(category);
  return db.prepare('SELECT * FROM tags ORDER BY category, name').all();
}

export function createTag(name, category, color) {
  const r = db.prepare('INSERT INTO tags (name, category, color) VALUES (?, ?, ?)').run(name, category || 'custom', color || null);
  return r.lastInsertRowid;
}

export function deleteTag(id) {
  db.prepare('DELETE FROM entity_tags WHERE tag_id = ?').run(id);
  db.prepare('DELETE FROM tags WHERE id = ?').run(id);
}

export function assignTag(entityType, entityId, tagId) {
  db.prepare('INSERT OR IGNORE INTO entity_tags (entity_type, entity_id, tag_id) VALUES (?, ?, ?)').run(entityType, entityId, tagId);
}

export function unassignTag(entityType, entityId, tagId) {
  db.prepare('DELETE FROM entity_tags WHERE entity_type = ? AND entity_id = ? AND tag_id = ?').run(entityType, entityId, tagId);
}

export function getEntityTags(entityType, entityId) {
  return db.prepare(`SELECT t.* FROM tags t JOIN entity_tags et ON t.id = et.tag_id
    WHERE et.entity_type = ? AND et.entity_id = ?
    ORDER BY t.name`).all(entityType, entityId);
}

// ---- NFC Mappings ----

export function getNfcMappings() {
  return db.prepare(`SELECT n.*, fp.name AS spool_name, fp.color_hex
    FROM nfc_mappings n
    LEFT JOIN spools s ON n.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    ORDER BY n.created_at DESC`).all();
}

export function lookupNfcTag(uid) {
  return db.prepare(`SELECT n.*, fp.name AS spool_name, fp.color_hex, fp.material, v.name AS vendor_name
    FROM nfc_mappings n
    LEFT JOIN spools s ON n.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE n.tag_uid = ?`).get(uid);
}

export function linkNfcTag(tagUid, spoolId, standard, data) {
  const existing = db.prepare('SELECT id FROM nfc_mappings WHERE tag_uid = ?').get(tagUid);
  if (existing) {
    db.prepare('UPDATE nfc_mappings SET spool_id = ?, standard = ?, data = ?, last_scanned = datetime(\'now\') WHERE tag_uid = ?')
      .run(spoolId, standard || 'openspool', data || null, tagUid);
    return existing.id;
  }
  const r = db.prepare('INSERT INTO nfc_mappings (tag_uid, spool_id, standard, data, last_scanned) VALUES (?, ?, ?, ?, datetime(\'now\'))')
    .run(tagUid, spoolId, standard || 'openspool', data || null);
  return r.lastInsertRowid;
}

export function unlinkNfcTag(uid) {
  db.prepare('DELETE FROM nfc_mappings WHERE tag_uid = ?').run(uid);
}

export function updateNfcScan(uid) {
  db.prepare('UPDATE nfc_mappings SET last_scanned = datetime(\'now\') WHERE tag_uid = ?').run(uid);
}

// ---- Spool Checkout ----

export function checkoutSpool(spoolId, actor, fromLocation) {
  db.prepare('UPDATE spools SET checked_out = 1, checked_out_at = datetime(\'now\'), checked_out_by = ?, checked_out_from = ? WHERE id = ?')
    .run(actor || null, fromLocation || null, spoolId);
  db.prepare('INSERT INTO spool_checkout_log (spool_id, action, from_location, actor) VALUES (?, ?, ?, ?)')
    .run(spoolId, 'checkout', fromLocation || null, actor || null);
  addSpoolEvent(spoolId, 'checked_out', JSON.stringify({ by: actor, from: fromLocation }), actor);
}

export function checkinSpool(spoolId, actor, toLocation) {
  const spool = db.prepare('SELECT checked_out_from FROM spools WHERE id = ?').get(spoolId);
  db.prepare('UPDATE spools SET checked_out = 0, checked_out_at = NULL, checked_out_by = NULL, checked_out_from = NULL WHERE id = ?')
    .run(spoolId);
  db.prepare('INSERT INTO spool_checkout_log (spool_id, action, from_location, to_location, actor) VALUES (?, ?, ?, ?, ?)')
    .run(spoolId, 'checkin', spool?.checked_out_from || null, toLocation || null, actor || null);
  addSpoolEvent(spoolId, 'checked_in', JSON.stringify({ by: actor, to: toLocation }), actor);
}

export function getCheckedOutSpools() {
  return db.prepare(`SELECT s.*, fp.name AS profile_name, fp.material, fp.color_hex, fp.color_name, v.name AS vendor_name
    FROM spools s
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    LEFT JOIN vendors v ON fp.vendor_id = v.id
    WHERE s.checked_out = 1 ORDER BY s.checked_out_at DESC`).all();
}

export function getCheckoutLog(spoolId, limit = 50) {
  if (spoolId) {
    return db.prepare('SELECT * FROM spool_checkout_log WHERE spool_id = ? ORDER BY timestamp DESC LIMIT ?').all(spoolId, limit);
  }
  return db.prepare('SELECT * FROM spool_checkout_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

// ---- Spool Events Timeline ----

export function addSpoolEvent(spoolId, eventType, details, actor) {
  db.prepare('INSERT INTO spool_events (spool_id, event_type, details, actor) VALUES (?, ?, ?, ?)')
    .run(spoolId, eventType, details || null, actor || null);
}

export function getSpoolTimeline(spoolId, limit = 100) {
  return db.prepare('SELECT * FROM spool_events WHERE spool_id = ? ORDER BY timestamp DESC LIMIT ?').all(spoolId, limit);
}

export function getRecentSpoolEvents(limit = 50) {
  return db.prepare(`SELECT se.*, fp.name AS spool_name FROM spool_events se
    LEFT JOIN spools s ON se.spool_id = s.id
    LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
    ORDER BY se.timestamp DESC LIMIT ?`).all(limit);
}

// ---- Bulk Spool Operations ----

export function bulkDeleteSpools(ids) {
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`DELETE FROM spools WHERE id IN (${placeholders})`).run(...ids);
}

export function bulkArchiveSpools(ids) {
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`UPDATE spools SET archived = 1 WHERE id IN (${placeholders})`).run(...ids);
}

export function bulkRelocateSpools(ids, location) {
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`UPDATE spools SET location = ? WHERE id IN (${placeholders})`).run(location, ...ids);
}

export function bulkMarkDried(ids) {
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`UPDATE spools SET last_dried_at = datetime('now') WHERE id IN (${placeholders})`).run(...ids);
}

// ---- G-Code Macros ----

export function getMacros(category) {
  if (category) return db.prepare('SELECT * FROM gcode_macros WHERE category = ? ORDER BY sort_order, name').all(category);
  return db.prepare('SELECT * FROM gcode_macros ORDER BY sort_order, name').all();
}

export function getMacro(id) {
  return db.prepare('SELECT * FROM gcode_macros WHERE id = ?').get(id) || null;
}

export function addMacro(m) {
  const r = db.prepare('INSERT INTO gcode_macros (name, description, gcode, category, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(m.name, m.description || null, m.gcode, m.category || 'manual', m.sort_order || 0);
  return r.lastInsertRowid;
}

export function updateMacro(id, m) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'gcode', 'category', 'sort_order']) {
    if (m[key] !== undefined) { fields.push(`${key} = ?`); values.push(m[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE gcode_macros SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteMacro(id) {
  db.prepare('DELETE FROM gcode_macros WHERE id = ?').run(id);
}

// ---- Outgoing Webhooks ----

export function getWebhookConfigs() {
  return db.prepare('SELECT * FROM webhook_configs ORDER BY created_at DESC').all();
}

export function getWebhookConfig(id) {
  return db.prepare('SELECT * FROM webhook_configs WHERE id = ?').get(id) || null;
}

export function addWebhookConfig(w) {
  const r = db.prepare(`INSERT INTO webhook_configs (name, url, secret, events, headers, template, retry_count, retry_delay_s, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    w.name, w.url, w.secret || null,
    JSON.stringify(w.events || []), JSON.stringify(w.headers || {}),
    w.template || 'generic', w.retry_count ?? 3, w.retry_delay_s ?? 10, w.active ?? 1
  );
  return Number(r.lastInsertRowid);
}

export function updateWebhookConfig(id, w) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'url', 'secret', 'template', 'retry_count', 'retry_delay_s', 'active']) {
    if (w[key] !== undefined) { fields.push(`${key} = ?`); values.push(w[key]); }
  }
  if (w.events !== undefined) { fields.push('events = ?'); values.push(JSON.stringify(w.events)); }
  if (w.headers !== undefined) { fields.push('headers = ?'); values.push(JSON.stringify(w.headers)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE webhook_configs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteWebhookConfig(id) {
  db.prepare('DELETE FROM webhook_configs WHERE id = ?').run(id);
}

export function getActiveWebhooks() {
  return db.prepare('SELECT * FROM webhook_configs WHERE active = 1').all();
}

export function addWebhookDelivery(d) {
  const r = db.prepare(`INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status, attempts)
    VALUES (?, ?, ?, ?, ?)`).run(d.webhook_id, d.event_type, d.payload, d.status || 'pending', d.attempts || 0);
  return Number(r.lastInsertRowid);
}

export function updateWebhookDelivery(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['status', 'attempts', 'last_attempt', 'response_code', 'response_body']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE webhook_deliveries SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function getWebhookDeliveries(webhookId, limit = 50) {
  return db.prepare('SELECT * FROM webhook_deliveries WHERE webhook_id = ? ORDER BY created_at DESC LIMIT ?').all(webhookId, limit);
}

export function getPendingDeliveries() {
  return db.prepare("SELECT wd.*, wc.url, wc.secret, wc.headers, wc.template, wc.retry_count, wc.retry_delay_s FROM webhook_deliveries wd JOIN webhook_configs wc ON wd.webhook_id = wc.id WHERE wd.status IN ('pending','retrying') AND wc.active = 1 ORDER BY wd.created_at ASC LIMIT 50").all();
}

// ---- Print Costs (Advanced) ----

export function savePrintCost(printHistoryId, costs) {
  db.prepare(`INSERT OR REPLACE INTO print_costs (print_history_id, filament_cost, electricity_cost, depreciation_cost, labor_cost, markup_amount, total_cost, currency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    printHistoryId, costs.filament_cost || 0, costs.electricity_cost || 0, costs.depreciation_cost || 0,
    costs.labor_cost || 0, costs.markup_amount || 0, costs.total_cost || 0, costs.currency || 'NOK'
  );
}

export function getPrintCost(printHistoryId) {
  return db.prepare('SELECT * FROM print_costs WHERE print_history_id = ?').get(printHistoryId) || null;
}

export function getCostReport(from, to) {
  let query = `SELECT pc.*, ph.filename, ph.printer_id, ph.started_at, ph.finished_at, ph.duration_seconds, ph.filament_used_g, ph.status
    FROM print_costs pc JOIN print_history ph ON pc.print_history_id = ph.id WHERE 1=1`;
  const params = [];
  if (from) { query += ' AND ph.started_at >= ?'; params.push(from); }
  if (to) { query += ' AND ph.started_at <= ?'; params.push(to); }
  query += ' ORDER BY ph.started_at DESC';
  return db.prepare(query).all(...params);
}

export function getCostSummary(from, to) {
  let query = `SELECT COUNT(*) as print_count,
    COALESCE(SUM(filament_cost), 0) as total_filament,
    COALESCE(SUM(electricity_cost), 0) as total_electricity,
    COALESCE(SUM(depreciation_cost), 0) as total_depreciation,
    COALESCE(SUM(labor_cost), 0) as total_labor,
    COALESCE(SUM(markup_amount), 0) as total_markup,
    COALESCE(SUM(total_cost), 0) as grand_total
    FROM print_costs pc JOIN print_history ph ON pc.print_history_id = ph.id WHERE 1=1`;
  const params = [];
  if (from) { query += ' AND ph.started_at >= ?'; params.push(from); }
  if (to) { query += ' AND ph.started_at <= ?'; params.push(to); }
  return db.prepare(query).get(...params);
}

export function estimatePrintCostAdvanced(filamentUsedG, durationSeconds, spoolId = null) {
  const electricityRate = parseFloat(getInventorySetting('electricity_rate_kwh') || '0');
  const printerWattage = parseFloat(getInventorySetting('printer_wattage') || '0');
  const machineCost = parseFloat(getInventorySetting('machine_cost') || '0');
  const machineLifetimeH = parseFloat(getInventorySetting('machine_lifetime_hours') || '0');
  const laborRate = parseFloat(getInventorySetting('labor_rate_hour') || '0');
  const setupMinutes = parseFloat(getInventorySetting('labor_setup_minutes') || '0');
  const markupPct = parseFloat(getInventorySetting('markup_pct') || '0');
  const currency = getInventorySetting('cost_currency') || 'NOK';

  let filamentCostPerG = 0;
  if (spoolId) {
    const spool = db.prepare(`SELECT s.cost, s.initial_weight_g,
      (SELECT fp.price FROM filament_profiles fp WHERE fp.id = s.filament_profile_id) AS profile_price
      FROM spools s WHERE s.id = ?`).get(spoolId);
    if (spool) {
      if (spool.cost > 0 && spool.initial_weight_g > 0) {
        filamentCostPerG = spool.cost / spool.initial_weight_g;
      } else if (spool.profile_price > 0) {
        filamentCostPerG = spool.profile_price / 1000;
      }
    }
  }

  const filamentCost = Math.round(filamentUsedG * filamentCostPerG * 100) / 100;
  const durationH = durationSeconds / 3600;
  const electricityCost = Math.round(durationH * (printerWattage / 1000) * electricityRate * 100) / 100;
  const depreciationCost = machineLifetimeH > 0 ? Math.round(durationH * (machineCost / machineLifetimeH) * 100) / 100 : 0;
  const laborCost = Math.round((durationH * laborRate + (setupMinutes / 60) * laborRate) * 100) / 100;
  const subtotal = filamentCost + electricityCost + depreciationCost + laborCost;
  const markupAmount = markupPct > 0 ? Math.round(subtotal * (markupPct / 100) * 100) / 100 : 0;
  const totalCost = Math.round((subtotal + markupAmount) * 100) / 100;

  return { filament_cost: filamentCost, electricity_cost: electricityCost, depreciation_cost: depreciationCost, labor_cost: laborCost, markup_amount: markupAmount, total_cost: totalCost, currency };
}

// ---- Material Reference ----

export function getMaterials() {
  return db.prepare('SELECT * FROM material_reference ORDER BY category, material').all();
}

export function getMaterial(id) {
  return db.prepare('SELECT * FROM material_reference WHERE id = ?').get(id) || null;
}

export function getMaterialByName(name) {
  return db.prepare('SELECT * FROM material_reference WHERE material = ? COLLATE NOCASE').get(name) || null;
}

export function updateMaterial(id, m) {
  const fields = [];
  const values = [];
  for (const key of ['material', 'category', 'difficulty', 'strength', 'temp_resistance', 'moisture_sensitivity', 'flexibility', 'layer_adhesion', 'nozzle_temp_min', 'nozzle_temp_max', 'bed_temp_min', 'bed_temp_max', 'chamber_temp', 'enclosure', 'typical_density', 'tips', 'nozzle_recommendation', 'abrasive', 'food_safe', 'uv_resistant']) {
    if (m[key] !== undefined) { fields.push(`${key} = ?`); values.push(m[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE material_reference SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function addMaterial(m) {
  const r = db.prepare(`INSERT INTO material_reference (material, category, difficulty, strength, temp_resistance, moisture_sensitivity, flexibility, layer_adhesion, nozzle_temp_min, nozzle_temp_max, bed_temp_min, bed_temp_max, chamber_temp, enclosure, typical_density, tips, nozzle_recommendation, abrasive, food_safe, uv_resistant)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    m.material, m.category || 'standard', m.difficulty || 1, m.strength || 3, m.temp_resistance || 3,
    m.moisture_sensitivity || 3, m.flexibility || 1, m.layer_adhesion || 3,
    m.nozzle_temp_min || null, m.nozzle_temp_max || null, m.bed_temp_min || null, m.bed_temp_max || null,
    m.chamber_temp || null, m.enclosure || 0, m.typical_density || null,
    m.tips || null, m.nozzle_recommendation || null, m.abrasive || 0, m.food_safe || 0, m.uv_resistant || 0
  );
  return Number(r.lastInsertRowid);
}

// ---- Hardware Database ----

export function getHardwareItems(category) {
  if (category) return db.prepare('SELECT * FROM hardware_items WHERE category = ? ORDER BY name').all(category);
  return db.prepare('SELECT * FROM hardware_items ORDER BY category, name').all();
}

export function getHardwareItem(id) {
  return db.prepare('SELECT * FROM hardware_items WHERE id = ?').get(id) || null;
}

export function addHardwareItem(h) {
  const r = db.prepare(`INSERT INTO hardware_items (category, name, brand, model, compatible_printers, specs, purchase_price, purchase_date, purchase_url, rating, notes, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    h.category, h.name, h.brand || null, h.model || null,
    JSON.stringify(h.compatible_printers || []), JSON.stringify(h.specs || {}),
    h.purchase_price || null, h.purchase_date || null, h.purchase_url || null,
    h.rating || null, h.notes || null, h.image_url || null
  );
  return Number(r.lastInsertRowid);
}

export function updateHardwareItem(id, h) {
  const fields = [];
  const values = [];
  for (const key of ['category', 'name', 'brand', 'model', 'purchase_price', 'purchase_date', 'purchase_url', 'rating', 'notes', 'image_url']) {
    if (h[key] !== undefined) { fields.push(`${key} = ?`); values.push(h[key]); }
  }
  if (h.compatible_printers !== undefined) { fields.push('compatible_printers = ?'); values.push(JSON.stringify(h.compatible_printers)); }
  if (h.specs !== undefined) { fields.push('specs = ?'); values.push(JSON.stringify(h.specs)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE hardware_items SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteHardwareItem(id) {
  db.prepare('DELETE FROM hardware_items WHERE id = ?').run(id);
}

export function assignHardware(hardwareId, printerId) {
  db.prepare('INSERT INTO hardware_printer_assignments (hardware_id, printer_id) VALUES (?, ?)').run(hardwareId, printerId);
}

export function unassignHardware(hardwareId, printerId) {
  db.prepare("UPDATE hardware_printer_assignments SET removed_at = datetime('now') WHERE hardware_id = ? AND printer_id = ? AND removed_at IS NULL").run(hardwareId, printerId);
}

export function getHardwareForPrinter(printerId) {
  return db.prepare(`SELECT hi.*, hpa.installed_at FROM hardware_items hi
    JOIN hardware_printer_assignments hpa ON hi.id = hpa.hardware_id
    WHERE hpa.printer_id = ? AND hpa.removed_at IS NULL
    ORDER BY hi.category, hi.name`).all(printerId);
}

export function getHardwareAssignments(hardwareId) {
  return db.prepare('SELECT * FROM hardware_printer_assignments WHERE hardware_id = ? ORDER BY installed_at DESC').all(hardwareId);
}

// ---- User Roles & Permissions ----

export function getRoles() {
  return db.prepare('SELECT * FROM user_roles ORDER BY name').all();
}

export function getRole(id) {
  return db.prepare('SELECT * FROM user_roles WHERE id = ?').get(id) || null;
}

export function addRole(r) {
  const result = db.prepare('INSERT INTO user_roles (name, permissions, description, is_default) VALUES (?, ?, ?, ?)')
    .run(r.name, JSON.stringify(r.permissions || []), r.description || null, r.is_default || 0);
  return Number(result.lastInsertRowid);
}

export function updateRole(id, r) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'is_default']) {
    if (r[key] !== undefined) { fields.push(`${key} = ?`); values.push(r[key]); }
  }
  if (r.permissions !== undefined) { fields.push('permissions = ?'); values.push(JSON.stringify(r.permissions)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE user_roles SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteRole(id) {
  db.prepare('DELETE FROM user_roles WHERE id = ?').run(id);
}

// ---- Users (DB-backed) ----

export function getUsers() {
  return db.prepare('SELECT u.id, u.username, u.display_name, u.role_id, u.created_at, u.last_login, r.name AS role_name, r.permissions FROM users u LEFT JOIN user_roles r ON u.role_id = r.id ORDER BY u.username').all();
}

export function getUser(id) {
  return db.prepare('SELECT u.id, u.username, u.display_name, u.role_id, u.created_at, u.last_login, r.name AS role_name, r.permissions FROM users u LEFT JOIN user_roles r ON u.role_id = r.id WHERE u.id = ?').get(id) || null;
}

export function getUserByUsername(username) {
  return db.prepare('SELECT u.*, r.name AS role_name, r.permissions FROM users u LEFT JOIN user_roles r ON u.role_id = r.id WHERE u.username = ?').get(username) || null;
}

export function addUser(u) {
  const result = db.prepare('INSERT INTO users (username, password_hash, role_id, display_name) VALUES (?, ?, ?, ?)')
    .run(u.username, u.password_hash, u.role_id || null, u.display_name || null);
  return Number(result.lastInsertRowid);
}

export function updateUser(id, u) {
  const fields = [];
  const values = [];
  for (const key of ['username', 'password_hash', 'role_id', 'display_name', 'last_login']) {
    if (u[key] !== undefined) { fields.push(`${key} = ?`); values.push(u[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteUser(id) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

// ---- API Keys ----

export function getApiKeys() {
  return db.prepare('SELECT id, name, key_prefix, permissions, user_id, last_used, expires_at, active, created_at FROM api_keys ORDER BY created_at DESC').all();
}

export function getApiKeyByHash(hash) {
  return db.prepare('SELECT * FROM api_keys WHERE key_hash = ? AND active = 1').get(hash) || null;
}

export function addApiKey(k) {
  const result = db.prepare('INSERT INTO api_keys (name, key_hash, key_prefix, permissions, user_id, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(k.name, k.key_hash, k.key_prefix, JSON.stringify(k.permissions || ['*']), k.user_id || null, k.expires_at || null);
  return Number(result.lastInsertRowid);
}

export function updateApiKeyLastUsed(id) {
  db.prepare("UPDATE api_keys SET last_used = datetime('now') WHERE id = ?").run(id);
}

export function deleteApiKey(id) {
  db.prepare('DELETE FROM api_keys WHERE id = ?').run(id);
}

export function deactivateApiKey(id) {
  db.prepare('UPDATE api_keys SET active = 0 WHERE id = ?').run(id);
}

// ---- E-Commerce ----

export function getEcommerceConfigs() {
  return db.prepare('SELECT * FROM ecommerce_configs ORDER BY created_at DESC').all();
}

export function getEcommerceConfig(id) {
  return db.prepare('SELECT * FROM ecommerce_configs WHERE id = ?').get(id) || null;
}

export function addEcommerceConfig(c) {
  const result = db.prepare('INSERT INTO ecommerce_configs (platform, name, webhook_secret, api_url, api_key, auto_queue, target_queue_id, sku_to_file_mapping, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(c.platform || 'custom', c.name, c.webhook_secret || null, c.api_url || null, c.api_key || null, c.auto_queue ? 1 : 0, c.target_queue_id || null, JSON.stringify(c.sku_to_file_mapping || {}), c.active !== false ? 1 : 0);
  return Number(result.lastInsertRowid);
}

export function updateEcommerceConfig(id, c) {
  const fields = [];
  const values = [];
  for (const key of ['platform', 'name', 'webhook_secret', 'api_url', 'api_key', 'active']) {
    if (c[key] !== undefined) { fields.push(`${key} = ?`); values.push(key === 'active' ? (c[key] ? 1 : 0) : c[key]); }
  }
  if (c.auto_queue !== undefined) { fields.push('auto_queue = ?'); values.push(c.auto_queue ? 1 : 0); }
  if (c.target_queue_id !== undefined) { fields.push('target_queue_id = ?'); values.push(c.target_queue_id); }
  if (c.sku_to_file_mapping !== undefined) { fields.push('sku_to_file_mapping = ?'); values.push(JSON.stringify(c.sku_to_file_mapping)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE ecommerce_configs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteEcommerceConfig(id) {
  db.prepare('DELETE FROM ecommerce_orders WHERE config_id = ?').run(id);
  db.prepare('DELETE FROM ecommerce_configs WHERE id = ?').run(id);
}

export function getEcommerceOrders(configId = null, limit = 50) {
  if (configId) {
    return db.prepare('SELECT * FROM ecommerce_orders WHERE config_id = ? ORDER BY received_at DESC LIMIT ?').all(configId, limit);
  }
  return db.prepare('SELECT * FROM ecommerce_orders ORDER BY received_at DESC LIMIT ?').all(limit);
}

export function getEcommerceOrder(id) {
  return db.prepare('SELECT * FROM ecommerce_orders WHERE id = ?').get(id) || null;
}

export function addEcommerceOrder(o) {
  const result = db.prepare('INSERT INTO ecommerce_orders (config_id, order_id, platform_order_id, customer_name, items, status, queue_item_ids) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(o.config_id, o.order_id || null, o.platform_order_id || null, o.customer_name || null, JSON.stringify(o.items || []), o.status || 'received', JSON.stringify(o.queue_item_ids || []));
  return Number(result.lastInsertRowid);
}

export function updateEcommerceOrder(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['status', 'customer_name', 'fulfilled_at']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (updates.queue_item_ids !== undefined) { fields.push('queue_item_ids = ?'); values.push(JSON.stringify(updates.queue_item_ids)); }
  if (updates.items !== undefined) { fields.push('items = ?'); values.push(JSON.stringify(updates.items)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE ecommerce_orders SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

// ---- Timelapse ----

export function getTimelapseRecordings(printerId = null, limit = 50) {
  if (printerId) {
    return db.prepare('SELECT * FROM timelapse_recordings WHERE printer_id = ? ORDER BY started_at DESC LIMIT ?').all(printerId, limit);
  }
  return db.prepare('SELECT * FROM timelapse_recordings ORDER BY started_at DESC LIMIT ?').all(limit);
}

export function getTimelapseRecording(id) {
  return db.prepare('SELECT * FROM timelapse_recordings WHERE id = ?').get(id) || null;
}

export function addTimelapseRecording(r) {
  const result = db.prepare('INSERT INTO timelapse_recordings (printer_id, print_history_id, filename, format, file_path, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(r.printer_id, r.print_history_id || null, r.filename || null, r.format || 'mp4', r.file_path || null, r.status || 'recording');
  return Number(result.lastInsertRowid);
}

export function updateTimelapseRecording(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['filename', 'format', 'duration_seconds', 'frame_count', 'file_size_bytes', 'file_path', 'status', 'completed_at', 'print_history_id']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE timelapse_recordings SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteTimelapseRecording(id) {
  db.prepare('DELETE FROM timelapse_recordings WHERE id = ?').run(id);
}

// ---- Push Subscriptions ----

export function getPushSubscriptions() {
  return db.prepare('SELECT * FROM push_subscriptions ORDER BY created_at DESC').all();
}

export function addPushSubscription(sub) {
  try {
    const result = db.prepare('INSERT OR REPLACE INTO push_subscriptions (endpoint, keys_p256dh, keys_auth, user_agent) VALUES (?, ?, ?, ?)')
      .run(sub.endpoint, sub.keys_p256dh || null, sub.keys_auth || null, sub.user_agent || null);
    return Number(result.lastInsertRowid);
  } catch (e) {
    return null;
  }
}

export function deletePushSubscription(endpoint) {
  db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);
}

export function deletePushSubscriptionById(id) {
  db.prepare('DELETE FROM push_subscriptions WHERE id = ?').run(id);
}

// ---- Community Filaments ----

export function getCommunityFilaments(filters = {}) {
  let sql = 'SELECT * FROM community_filaments WHERE 1=1';
  const params = [];
  if (filters.manufacturer) { sql += ' AND manufacturer = ?'; params.push(filters.manufacturer); }
  if (filters.material) { sql += ' AND material = ?'; params.push(filters.material); }
  if (filters.color_hex) { sql += ' AND color_hex = ?'; params.push(filters.color_hex.replace('#', '')); }
  if (filters.search) { sql += ' AND (name LIKE ? OR manufacturer LIKE ? OR color_name LIKE ?)'; params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`); }
  sql += ' ORDER BY manufacturer, name';
  if (filters.limit) { sql += ' LIMIT ?'; params.push(filters.limit); }
  if (filters.offset) { sql += ' OFFSET ?'; params.push(filters.offset); }
  return db.prepare(sql).all(...params);
}

export function getCommunityFilament(id) {
  return db.prepare('SELECT * FROM community_filaments WHERE id = ?').get(id) || null;
}

export function searchCommunityByColor(hex, tolerance = 30) {
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
  return db.prepare('SELECT DISTINCT manufacturer FROM community_filaments ORDER BY manufacturer').all().map(r => r.manufacturer);
}

export function getCommunityMaterials() {
  return db.prepare('SELECT DISTINCT material FROM community_filaments ORDER BY material').all().map(r => r.material);
}

export function addCommunityFilament(f) {
  const result = db.prepare('INSERT INTO community_filaments (manufacturer, name, material, density, diameter, weight, spool_weight, extruder_temp, bed_temp, color_name, color_hex, td_value, shore_hardness, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    f.manufacturer, f.name || null, f.material, f.density || null, f.diameter || 1.75, f.weight || 1000, f.spool_weight || null, f.extruder_temp || null, f.bed_temp || null, f.color_name || null, f.color_hex || null, f.td_value || null, f.shore_hardness || null, f.source || 'user');
  return Number(result.lastInsertRowid);
}

export function updateCommunityFilament(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['manufacturer', 'name', 'material', 'density', 'diameter', 'weight', 'spool_weight', 'extruder_temp', 'bed_temp', 'color_name', 'color_hex', 'td_value', 'shore_hardness', 'source']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE community_filaments SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCommunityFilament(id) {
  db.prepare('DELETE FROM community_filaments WHERE id = ?').run(id);
}

// ---- Brand Defaults ----

export function getBrandDefaults(manufacturer = null) {
  if (manufacturer) return db.prepare('SELECT * FROM brand_defaults WHERE manufacturer = ? ORDER BY material').all(manufacturer);
  return db.prepare('SELECT * FROM brand_defaults ORDER BY manufacturer, material').all();
}

export function getBrandDefault(id) {
  return db.prepare('SELECT * FROM brand_defaults WHERE id = ?').get(id) || null;
}

export function upsertBrandDefault(d) {
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
  db.prepare('DELETE FROM brand_defaults WHERE id = ?').run(id);
}

// ---- Custom Fields ----

export function getCustomFieldDefs(entityType = null) {
  if (entityType) return db.prepare('SELECT * FROM custom_field_defs WHERE entity_type = ? ORDER BY sort_order, field_name').all(entityType);
  return db.prepare('SELECT * FROM custom_field_defs ORDER BY entity_type, sort_order, field_name').all();
}

export function getCustomFieldDef(id) {
  return db.prepare('SELECT * FROM custom_field_defs WHERE id = ?').get(id) || null;
}

export function addCustomFieldDef(d) {
  const result = db.prepare('INSERT INTO custom_field_defs (entity_type, field_name, field_label, field_type, options, default_value, required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    d.entity_type, d.field_name, d.field_label, d.field_type || 'text', d.options ? JSON.stringify(d.options) : null, d.default_value || null, d.required ? 1 : 0, d.sort_order || 0);
  return Number(result.lastInsertRowid);
}

export function updateCustomFieldDef(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['field_label', 'field_type', 'default_value', 'required', 'sort_order']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (updates.options !== undefined) { fields.push('options = ?'); values.push(JSON.stringify(updates.options)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE custom_field_defs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCustomFieldDef(id) {
  db.prepare('DELETE FROM custom_field_values WHERE field_id = ?').run(id);
  db.prepare('DELETE FROM custom_field_defs WHERE id = ?').run(id);
}

export function getCustomFieldValues(entityType, entityId) {
  return db.prepare('SELECT cfv.*, cfd.field_name, cfd.field_label, cfd.field_type FROM custom_field_values cfv JOIN custom_field_defs cfd ON cfv.field_id = cfd.id WHERE cfv.entity_type = ? AND cfv.entity_id = ?').all(entityType, entityId);
}

export function setCustomFieldValue(fieldId, entityType, entityId, value) {
  db.prepare('INSERT OR REPLACE INTO custom_field_values (field_id, entity_type, entity_id, value) VALUES (?, ?, ?, ?)').run(fieldId, entityType, entityId, value);
}

export function deleteCustomFieldValues(entityType, entityId) {
  db.prepare('DELETE FROM custom_field_values WHERE entity_type = ? AND entity_id = ?').run(entityType, entityId);
}

// ---- Printer Groups ----

export function getPrinterGroups() {
  return db.prepare('SELECT * FROM printer_groups ORDER BY name').all();
}

export function getPrinterGroup(id) {
  return db.prepare('SELECT * FROM printer_groups WHERE id = ?').get(id) || null;
}

export function addPrinterGroup(g) {
  const result = db.prepare('INSERT INTO printer_groups (name, description, parent_id, color, stagger_delay_s, max_concurrent, power_limit_w) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    g.name, g.description || null, g.parent_id || null, g.color || null, g.stagger_delay_s || 0, g.max_concurrent || 0, g.power_limit_w || 0);
  return Number(result.lastInsertRowid);
}

export function updatePrinterGroup(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'parent_id', 'color', 'stagger_delay_s', 'max_concurrent', 'power_limit_w']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE printer_groups SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deletePrinterGroup(id) {
  db.prepare('DELETE FROM printer_group_members WHERE group_id = ?').run(id);
  db.prepare('DELETE FROM printer_groups WHERE id = ?').run(id);
}

export function addPrinterToGroup(groupId, printerId) {
  db.prepare('INSERT OR IGNORE INTO printer_group_members (group_id, printer_id) VALUES (?, ?)').run(groupId, printerId);
}

export function removePrinterFromGroup(groupId, printerId) {
  db.prepare('DELETE FROM printer_group_members WHERE group_id = ? AND printer_id = ?').run(groupId, printerId);
}

export function getGroupMembers(groupId) {
  return db.prepare('SELECT * FROM printer_group_members WHERE group_id = ? ORDER BY sort_order').all(groupId);
}

export function getPrinterGroupsForPrinter(printerId) {
  return db.prepare('SELECT pg.* FROM printer_groups pg JOIN printer_group_members pgm ON pg.id = pgm.group_id WHERE pgm.printer_id = ?').all(printerId);
}

// ---- Projects ----

export function getProjects(status = null) {
  if (status) return db.prepare('SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC').all(status);
  return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
}

export function getProject(id) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) || null;
}

export function addProject(p) {
  const result = db.prepare('INSERT INTO projects (name, description, status, client_name, due_date, notes, tags) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    p.name, p.description || null, p.status || 'active', p.client_name || null, p.due_date || null, p.notes || null, p.tags ? JSON.stringify(p.tags) : null);
  return Number(result.lastInsertRowid);
}

export function updateProject(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'status', 'client_name', 'due_date', 'total_prints', 'completed_prints', 'total_cost', 'notes', 'completed_at']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (updates.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(updates.tags)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteProject(id) {
  db.prepare('DELETE FROM project_prints WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function getProjectPrints(projectId) {
  return db.prepare('SELECT * FROM project_prints WHERE project_id = ? ORDER BY added_at DESC').all(projectId);
}

export function addProjectPrint(pp) {
  const result = db.prepare('INSERT INTO project_prints (project_id, print_history_id, queue_item_id, filename, status, notes) VALUES (?, ?, ?, ?, ?, ?)').run(
    pp.project_id, pp.print_history_id || null, pp.queue_item_id || null, pp.filename || null, pp.status || 'pending', pp.notes || null);
  return Number(result.lastInsertRowid);
}

export function updateProjectPrint(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['status', 'notes', 'print_history_id']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE project_prints SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteProjectPrint(id) {
  db.prepare('DELETE FROM project_prints WHERE id = ?').run(id);
}

// ---- Export Templates ----

export function getExportTemplates(entityType = null) {
  if (entityType) return db.prepare('SELECT * FROM export_templates WHERE entity_type = ? ORDER BY name').all(entityType);
  return db.prepare('SELECT * FROM export_templates ORDER BY entity_type, name').all();
}

export function getExportTemplate(id) {
  return db.prepare('SELECT * FROM export_templates WHERE id = ?').get(id) || null;
}

export function addExportTemplate(t) {
  const result = db.prepare('INSERT INTO export_templates (name, entity_type, format, columns, filters) VALUES (?, ?, ?, ?, ?)').run(
    t.name, t.entity_type, t.format || 'csv', JSON.stringify(t.columns), t.filters ? JSON.stringify(t.filters) : null);
  return Number(result.lastInsertRowid);
}

export function deleteExportTemplate(id) {
  db.prepare('DELETE FROM export_templates WHERE id = ?').run(id);
}

// ---- User Quotas ----

export function getUserQuota(userId) {
  return db.prepare('SELECT * FROM user_quotas WHERE user_id = ?').get(userId) || null;
}

export function upsertUserQuota(userId, updates) {
  const existing = db.prepare('SELECT id FROM user_quotas WHERE user_id = ?').get(userId);
  if (existing) {
    const fields = [];
    const values = [];
    for (const key of ['balance', 'print_quota_daily', 'print_quota_monthly', 'filament_quota_g', 'prints_today', 'prints_this_month', 'filament_used_g', 'last_reset_daily', 'last_reset_monthly']) {
      if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
    }
    if (fields.length === 0) return existing.id;
    values.push(existing.id);
    db.prepare(`UPDATE user_quotas SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return existing.id;
  }
  const result = db.prepare('INSERT INTO user_quotas (user_id, balance, print_quota_daily, print_quota_monthly, filament_quota_g) VALUES (?, ?, ?, ?, ?)').run(
    userId, updates.balance || 0, updates.print_quota_daily || 0, updates.print_quota_monthly || 0, updates.filament_quota_g || 0);
  return Number(result.lastInsertRowid);
}

export function addUserTransaction(t) {
  const result = db.prepare('INSERT INTO user_transactions (user_id, type, amount, description, print_history_id) VALUES (?, ?, ?, ?, ?)').run(
    t.user_id, t.type, t.amount, t.description || null, t.print_history_id || null);
  // Update balance
  if (t.type === 'credit') {
    db.prepare('UPDATE user_quotas SET balance = balance + ? WHERE user_id = ?').run(Math.abs(t.amount), t.user_id);
  } else if (t.type === 'debit') {
    db.prepare('UPDATE user_quotas SET balance = balance - ? WHERE user_id = ?').run(Math.abs(t.amount), t.user_id);
  }
  return Number(result.lastInsertRowid);
}

export function getUserTransactions(userId, limit = 50) {
  return db.prepare('SELECT * FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(userId, limit);
}

// ---- Failure Detection ----

export function getFailureDetections(printerId = null, limit = 50) {
  if (printerId) return db.prepare('SELECT * FROM failure_detections WHERE printer_id = ? ORDER BY detected_at DESC LIMIT ?').all(printerId, limit);
  return db.prepare('SELECT * FROM failure_detections ORDER BY detected_at DESC LIMIT ?').all(limit);
}

export function getFailureDetection(id) {
  return db.prepare('SELECT * FROM failure_detections WHERE id = ?').get(id) || null;
}

export function addFailureDetection(d) {
  const result = db.prepare('INSERT INTO failure_detections (printer_id, print_history_id, detection_type, confidence, frame_path, action_taken, details) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    d.printer_id, d.print_history_id || null, d.detection_type, d.confidence || null, d.frame_path || null, d.action_taken || null, d.details ? JSON.stringify(d.details) : null);
  return Number(result.lastInsertRowid);
}

export function acknowledgeFailureDetection(id) {
  db.prepare('UPDATE failure_detections SET acknowledged = 1 WHERE id = ?').run(id);
}

export function deleteFailureDetection(id) {
  db.prepare('DELETE FROM failure_detections WHERE id = ?').run(id);
}

// ---- Price History ----

export function getPriceHistory(profileId, limit = 100) {
  return db.prepare('SELECT * FROM price_history WHERE filament_profile_id = ? ORDER BY recorded_at DESC LIMIT ?').all(profileId, limit);
}

export function addPriceEntry(p) {
  const result = db.prepare('INSERT INTO price_history (filament_profile_id, vendor_id, price, currency, source) VALUES (?, ?, ?, ?, ?)').run(
    p.filament_profile_id, p.vendor_id || null, p.price, p.currency || 'USD', p.source || 'manual');
  return Number(result.lastInsertRowid);
}

export function getLowestPrice(profileId) {
  return db.prepare('SELECT MIN(price) as min_price, currency FROM price_history WHERE filament_profile_id = ?').get(profileId) || null;
}

export function getPriceStats(profileId) {
  return db.prepare('SELECT MIN(price) as min_price, MAX(price) as max_price, AVG(price) as avg_price, COUNT(*) as entries FROM price_history WHERE filament_profile_id = ?').get(profileId) || null;
}

// ---- Build Plates ----

export function getBuildPlates(printerId = null) {
  if (printerId) return db.prepare('SELECT * FROM build_plates WHERE printer_id = ? ORDER BY installed_at DESC').all(printerId);
  return db.prepare('SELECT * FROM build_plates ORDER BY printer_id, installed_at DESC').all();
}

export function getBuildPlate(id) {
  return db.prepare('SELECT * FROM build_plates WHERE id = ?').get(id) || null;
}

export function addBuildPlate(bp) {
  const result = db.prepare('INSERT INTO build_plates (printer_id, name, type, material, surface_condition, notes) VALUES (?, ?, ?, ?, ?, ?)').run(
    bp.printer_id, bp.name, bp.type || 'smooth_pei', bp.material || null, bp.surface_condition || 'good', bp.notes || null);
  return Number(result.lastInsertRowid);
}

export function updateBuildPlate(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'type', 'material', 'surface_condition', 'print_count', 'notes', 'active']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE build_plates SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteBuildPlate(id) {
  db.prepare('DELETE FROM build_plates WHERE id = ?').run(id);
}

export function incrementBuildPlatePrintCount(printerId) {
  db.prepare('UPDATE build_plates SET print_count = print_count + 1 WHERE printer_id = ? AND active = 1').run(printerId);
}

// ---- Dryer Models ----

export function getDryerModels() {
  return db.prepare('SELECT * FROM dryer_models ORDER BY brand, model').all();
}

export function getDryerModel(id) {
  return db.prepare('SELECT * FROM dryer_models WHERE id = ?').get(id) || null;
}

export function addDryerModel(d) {
  const result = db.prepare('INSERT INTO dryer_models (brand, model, max_temp, tray_count, max_spool_diameter, has_humidity_sensor, wattage, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    d.brand, d.model, d.max_temp || null, d.tray_count || 1, d.max_spool_diameter || null, d.has_humidity_sensor ? 1 : 0, d.wattage || null, d.notes || null);
  return Number(result.lastInsertRowid);
}

export function updateDryerModel(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['brand', 'model', 'max_temp', 'tray_count', 'max_spool_diameter', 'has_humidity_sensor', 'wattage', 'notes']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE dryer_models SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteDryerModel(id) {
  db.prepare('DELETE FROM dryer_models WHERE id = ?').run(id);
}

// ---- Storage Conditions ----

export function getStorageConditions(spoolId) {
  return db.prepare('SELECT * FROM storage_conditions WHERE spool_id = ? ORDER BY recorded_at DESC').all(spoolId);
}

export function getLatestStorageCondition(spoolId) {
  return db.prepare('SELECT * FROM storage_conditions WHERE spool_id = ? ORDER BY recorded_at DESC LIMIT 1').get(spoolId) || null;
}

export function addStorageCondition(s) {
  const result = db.prepare('INSERT INTO storage_conditions (spool_id, humidity, temperature, container_type, desiccant_type, desiccant_replaced, sealed, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    s.spool_id, s.humidity || null, s.temperature || null, s.container_type || null, s.desiccant_type || null, s.desiccant_replaced || null, s.sealed ? 1 : 0, s.notes || null);
  return Number(result.lastInsertRowid);
}

export function deleteStorageCondition(id) {
  db.prepare('DELETE FROM storage_conditions WHERE id = ?').run(id);
}

// ---- Courses ----

export function getCourses(category = null) {
  if (category) return db.prepare('SELECT * FROM courses WHERE category = ? ORDER BY difficulty, title').all(category);
  return db.prepare('SELECT * FROM courses ORDER BY category, difficulty, title').all();
}

export function getCourse(id) {
  return db.prepare('SELECT * FROM courses WHERE id = ?').get(id) || null;
}

export function addCourse(c) {
  const result = db.prepare('INSERT INTO courses (title, description, category, difficulty, content, steps, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    c.title, c.description || null, c.category || 'general', c.difficulty || 1, c.content || null, c.steps ? JSON.stringify(c.steps) : null, c.estimated_minutes || null);
  return Number(result.lastInsertRowid);
}

export function updateCourse(id, updates) {
  const fields = [];
  const values = [];
  for (const key of ['title', 'description', 'category', 'difficulty', 'content', 'estimated_minutes']) {
    if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
  }
  if (updates.steps !== undefined) { fields.push('steps = ?'); values.push(JSON.stringify(updates.steps)); }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE courses SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCourse(id) {
  db.prepare('DELETE FROM course_progress WHERE course_id = ?').run(id);
  db.prepare('DELETE FROM courses WHERE id = ?').run(id);
}

export function getCourseProgress(courseId, userId) {
  return db.prepare('SELECT * FROM course_progress WHERE course_id = ? AND user_id = ?').get(courseId, userId) || null;
}

export function upsertCourseProgress(courseId, userId, updates) {
  const existing = db.prepare('SELECT id FROM course_progress WHERE course_id = ? AND user_id = ?').get(courseId, userId);
  if (existing) {
    const fields = [];
    const values = [];
    for (const key of ['status', 'current_step', 'completed_at', 'completed_steps']) {
      if (updates[key] !== undefined) { fields.push(`${key} = ?`); values.push(updates[key]); }
    }
    if (fields.length === 0) return;
    values.push(existing.id);
    db.prepare(`UPDATE course_progress SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  } else {
    db.prepare('INSERT INTO course_progress (course_id, user_id, status, current_step, completed_steps) VALUES (?, ?, ?, ?, ?)').run(
      courseId, userId, updates.status || 'in_progress', updates.current_step || 0, updates.completed_steps || '[]');
  }
}

export function getUserCourseProgress(userId) {
  return db.prepare('SELECT cp.*, c.title, c.category, c.difficulty FROM course_progress cp JOIN courses c ON cp.course_id = c.id WHERE cp.user_id = ? ORDER BY cp.started_at DESC').all(userId);
}

export function getAllCoursesWithProgress(userId) {
  return db.prepare(`
    SELECT c.*, cp.status AS progress_status, cp.current_step, cp.completed_steps,
           cp.completed_at, cp.started_at AS progress_started_at
    FROM courses c
    LEFT JOIN course_progress cp ON cp.course_id = c.id AND cp.user_id = ?
    ORDER BY c.category, c.difficulty, c.title
  `).all(userId);
}

// ---- Hex Color Search (across inventory) ----

export function searchSpoolsByColor(hex, tolerance = 30) {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const all = db.prepare("SELECT s.*, fp.name as profile_name, fp.material, v.name as vendor_name FROM spools s LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id LEFT JOIN vendors v ON fp.vendor_id = v.id WHERE s.color_hex IS NOT NULL AND s.color_hex != ''").all();
  return all.filter(s => {
    const ch = s.color_hex.replace('#', '');
    if (ch.length < 6) return false;
    const sr = parseInt(ch.substring(0, 2), 16);
    const sg = parseInt(ch.substring(2, 4), 16);
    const sb = parseInt(ch.substring(4, 6), 16);
    return Math.sqrt((r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2) <= tolerance;
  }).map(s => {
    const ch = s.color_hex.replace('#', '');
    const sr = parseInt(ch.substring(0, 2), 16);
    const sg = parseInt(ch.substring(2, 4), 16);
    const sb = parseInt(ch.substring(4, 6), 16);
    return { ...s, color_distance: Math.sqrt((r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2) };
  }).sort((a, b) => a.color_distance - b.color_distance);
}

// ---- Auto-Generated Spool Names ----

export function generateSpoolName(profileId) {
  const profile = db.prepare('SELECT fp.*, v.name as vendor_name FROM filament_profiles fp LEFT JOIN vendors v ON fp.vendor_id = v.id WHERE fp.id = ?').get(profileId);
  if (!profile) return 'Spool';
  const count = db.prepare('SELECT COUNT(*) as cnt FROM spools WHERE filament_profile_id = ?').get(profileId).cnt;
  const vendor = profile.vendor_name || 'Unknown';
  const material = profile.material || 'PLA';
  const name = profile.name || '';
  return `${vendor} ${material}${name ? ' ' + name : ''} #${count + 1}`;
}

// ---- E-Commerce License ----

export function getEcomLicense() {
  return db.prepare('SELECT * FROM ecom_license WHERE id = 1').get() || null;
}

export function setEcomLicense(data) {
  const row = getEcomLicense();
  if (!row) return;
  const fields = [];
  const values = [];
  for (const key of ['license_key', 'geektech_email', 'geektech_api_url', 'instance_id', 'status', 'holder_name', 'plan', 'features', 'expires_at', 'last_validated', 'cached_response', 'last_report_at']) {
    if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key]); }
  }
  if (fields.length === 0) return;
  values.push(1);
  db.prepare(`UPDATE ecom_license SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function getEcomFees(reported = null) {
  if (reported !== null) {
    return db.prepare('SELECT * FROM ecom_fees WHERE reported = ? ORDER BY created_at DESC').all(reported);
  }
  return db.prepare('SELECT * FROM ecom_fees ORDER BY created_at DESC').all();
}

export function addEcomFee(fee) {
  const result = db.prepare('INSERT INTO ecom_fees (order_id, ecom_config_id, order_total, fee_pct, fee_amount, currency) VALUES (?, ?, ?, ?, ?, ?)').run(
    fee.order_id || null, fee.ecom_config_id || null, fee.order_total, fee.fee_pct || 5.0, fee.fee_amount, fee.currency || 'NOK'
  );
  return Number(result.lastInsertRowid);
}

export function markFeesReported(feeIds) {
  if (!feeIds.length) return;
  const placeholders = feeIds.map(() => '?').join(',');
  db.prepare(`UPDATE ecom_fees SET reported = 1, reported_at = datetime('now') WHERE id IN (${placeholders})`).run(...feeIds);
}

export function getUnreportedFees() {
  return db.prepare('SELECT ef.*, eo.platform_order_id, ec.platform FROM ecom_fees ef LEFT JOIN ecommerce_orders eo ON ef.order_id = eo.id LEFT JOIN ecommerce_configs ec ON ef.ecom_config_id = ec.id WHERE ef.reported = 0 ORDER BY ef.created_at ASC').all();
}

export function getEcomFeesSummary(from = null, to = null) {
  let sql = 'SELECT COUNT(*) as order_count, COALESCE(SUM(fee_amount), 0) as total_fees, COALESCE(SUM(order_total), 0) as total_revenue, currency FROM ecom_fees';
  const params = [];
  if (from && to) {
    sql += ' WHERE created_at >= ? AND created_at <= ?';
    params.push(from, to);
  } else if (from) {
    sql += ' WHERE created_at >= ?';
    params.push(from);
  }
  sql += ' GROUP BY currency';
  return db.prepare(sql).all(...params);
}

export function getEcomFeesTotal() {
  return db.prepare('SELECT COUNT(*) as pending_count, COALESCE(SUM(fee_amount), 0) as pending_total FROM ecom_fees WHERE reported = 0').get();
}
