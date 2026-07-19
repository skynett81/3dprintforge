// Central re-export barrel for all database repository modules.
// Consumers can import from './db/index.js' (or the compat shim 'database.js')
// and get the full public API without knowing which domain file owns each function.

export * from './connection.js';
export * from './migrations.js';
export * from './printers.js';
export * from './history.js';
export * from './spools.js';
export * from './filament-profiles.js';
export * from './suppliers.js';
export * from './purchase-orders.js';
export * from './parts.js';
export * from './stock-items.js';
export * from './bom.js';
export * from './builds.js';
export * from './stocktake.js';
export * from './assets.js';
export * from './checkouts.js';
export * from './reservations.js';
export * from './stock-ledger.js';
export * from './reorder.js';
export * from './recordings.js';
export * from './maintenance.js';
export * from './errors.js';
export * from './telemetry.js';
export * from './costs.js';
export * from './queue.js';
export * from './auth.js';
export * from './community.js';
export * from './projects.js';
export * from './ecommerce.js';
export * from './misc.js';
export * from './activity-log.js';
export * from './crm.js';
export * from './order-margins.js';
export * from './shop-products.js';
export * from './shop-fulfillment.js';
export * from './gcode-snippets.js';
