// reorder-service.test.js — the settings gate around runReorderTick (Fase 3.3).

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { addSupplier, addSupplierPart } from '../../server/db/suppliers.js';
import { setStockTarget } from '../../server/db/reorder.js';
import { setInventorySetting } from '../../server/db/spools.js';
import { runReorderTick } from '../../server/reorder-service.js';

describe('runReorderTick', () => {
  beforeEach(() => {
    setupTestDb();
    const pla = addFilamentProfile({ name: 'PLA', material: 'PLA' }).id;
    const sup = addSupplier({ name: 'ShopA' }).id;
    addSupplierPart({ supplier_id: sup, filament_profile_id: pla, price: 20, weight_g: 1000, pack_qty: 1 });
    setStockTarget('PLA', 2500);
  });

  it('is a no-op when auto-reorder is disabled', async () => {
    const r = await runReorderTick();
    assert.equal(r.action, 'disabled');
  });

  it('drafts POs when enabled in draft mode', async () => {
    setInventorySetting('auto_reorder_enabled', 'true');
    setInventorySetting('auto_reorder_mode', 'draft');
    const r = await runReorderTick();
    assert.equal(r.action, 'drafted');
    assert.equal(r.created.length, 1);
  });

  it('summarises without drafting in notify mode', async () => {
    setInventorySetting('auto_reorder_enabled', 'true');
    setInventorySetting('auto_reorder_mode', 'notify');
    const r = await runReorderTick();
    assert.equal(r.action, 'notify');
    assert.equal(r.below_target, 1);
  });
});
