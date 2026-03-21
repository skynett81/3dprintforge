// Compatibility shim — delegates to the modular db/ repository layer.
// This file exists so that all existing consumers (api-routes.js, index.js, etc.)
// can continue to import from './database.js' without any changes.
//
// New code should import directly from './db/<domain>.js' or './db/index.js'.

import { initConnection } from './db/connection.js';
import { runMigrations } from './db/migrations.js';

// Initialize database connection and run all pending migrations.
// Called once at server startup from server/index.js.
export function initDatabase() {
  initConnection();
  runMigrations();
}

// Re-export the entire public API from all domain repository modules.
export * from './db/index.js';
