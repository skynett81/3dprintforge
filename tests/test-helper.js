// test-helper.js — Hjelpefunksjoner for alle tester
// Setter opp en fersk in-memory SQLite-database med fullstendig skjema og migrasjoner.

import { DatabaseSync } from 'node:sqlite';
import { setDb } from '../server/db/connection.js';
import { runMigrations } from '../server/db/migrations.js';

/**
 * Oppretter en in-memory SQLite-database med grunnleggende skjema + alle migrasjoner.
 * Kaller setDb() slik at alle getDb()-kall bruker denne instansen.
 * Returnerer db-instansen.
 */
export function setupTestDb() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA journal_mode=WAL');
  db.exec('PRAGMA busy_timeout=5000');
  db.exec('PRAGMA foreign_keys=ON');

  // Grunnleggende skjema (tilsvarende original initDatabase() i database.js)
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
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      electricity_rate_kwh REAL,
      printer_wattage REAL,
      machine_cost REAL,
      machine_lifetime_hours REAL,
      maintenance_mode INTEGER DEFAULT 0,
      maintenance_note TEXT,
      maintenance_since TEXT
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
      notes TEXT,
      color_changes INTEGER DEFAULT 0,
      waste_g REAL DEFAULT 0,
      nozzle_type TEXT,
      nozzle_diameter REAL,
      speed_level INTEGER,
      bed_target REAL,
      nozzle_target REAL,
      max_nozzle_temp REAL,
      max_bed_temp REAL,
      max_chamber_temp REAL,
      filament_brand TEXT,
      ams_units_used INTEGER,
      tray_id TEXT,
      gcode_file TEXT
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

  // Sett db-singletonen slik at getDb() returnerer denne instansen
  setDb(db);

  // Kjør alle migrasjoner for å sette opp resten av skjemaet (spools, auth, printer_groups, osv.)
  runMigrations();

  return db;
}
