// session-features.test.js — tests for inventory + Print Guard features
// added this session: spool expiry/shelf-life, procurement (purchased
// spools), and Print Guard snooze persistence.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addSpool, getSpool, updateSpool } from '../../server/db/spools.js';
import { getExpiringSpools, getExpiredSpools } from '../../server/db/misc.js';
import {
  getPurchasedSpools,
  addPurchasedSpool,
  deletePurchasedSpool,
  linkPurchasedToSpool,
} from '../../server/db/spools.js';
import { getProtectionSettings, upsertProtectionSettings } from '../../server/db/errors.js';

const dateOffset = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

describe('Spool expiry / shelf-life', () => {
  before(() => setupTestDb());

  it('persists expiry_date and expiry_warn_days on create', () => {
    const { id } = addSpool({ initial_weight_g: 1000, expiry_date: dateOffset(20), expiry_warn_days: 30 });
    const s = getSpool(id);
    assert.equal(String(s.expiry_date).slice(0, 10), dateOffset(20));
    assert.equal(s.expiry_warn_days, 30);
  });

  it('updateSpool can change the expiry date', () => {
    const { id } = addSpool({ initial_weight_g: 1000, expiry_date: dateOffset(5) });
    updateSpool(id, { expiry_date: dateOffset(60) });
    assert.equal(String(getSpool(id).expiry_date).slice(0, 10), dateOffset(60));
  });

  it('getExpiringSpools finds spools within the window, excludes far-future', () => {
    setupTestDb();
    const soon = addSpool({ initial_weight_g: 1000, expiry_date: dateOffset(10) }).id;
    addSpool({ initial_weight_g: 1000, expiry_date: dateOffset(120) }); // far future
    addSpool({ initial_weight_g: 1000 }); // no expiry
    const expiring = getExpiringSpools(30);
    const ids = expiring.map((s) => s.id);
    assert.ok(ids.includes(soon), 'spool expiring in 10 days is within the 30-day window');
    assert.equal(expiring.length, 1, 'only the soon-expiring spool is returned');
    assert.ok(expiring[0].days_until_expiry >= 9 && expiring[0].days_until_expiry <= 11);
  });

  it('getExpiredSpools finds spools past their expiry', () => {
    setupTestDb();
    const expired = addSpool({ initial_weight_g: 1000, expiry_date: dateOffset(-3) }).id;
    addSpool({ initial_weight_g: 1000, expiry_date: dateOffset(10) }); // not expired
    const rows = getExpiredSpools();
    assert.ok(rows.map((s) => s.id).includes(expired));
    assert.ok(!rows.some((s) => String(s.expiry_date).slice(0, 10) === dateOffset(10)));
  });
});

describe('Procurement (purchased spools)', () => {
  before(() => setupTestDb());

  it('add -> list -> link -> unlink -> delete', () => {
    const sp = addSpool({ initial_weight_g: 1000 }).id;
    const { id } = addPurchasedSpool({ name: 'eSUN PETG Black', brand: 'eSUN', cost: 189, purchase_date: '2026-06-15' });
    assert.ok(id > 0);

    let list = getPurchasedSpools();
    const row = list.find((p) => p.id === id);
    assert.ok(row, 'purchase appears in the list');
    assert.equal(row.name, 'eSUN PETG Black');
    assert.equal(row.spool_id, null, 'pending (not received) by default');

    // Receive: link to a spool
    linkPurchasedToSpool(id, sp);
    assert.equal(getPurchasedSpools().find((p) => p.id === id).spool_id, sp);

    // Undo receive: unlink with null
    linkPurchasedToSpool(id, null);
    assert.equal(getPurchasedSpools().find((p) => p.id === id).spool_id, null);

    deletePurchasedSpool(id);
    assert.ok(!getPurchasedSpools().some((p) => p.id === id), 'purchase removed');
  });
});

describe('Print Guard snooze persistence', () => {
  before(() => setupTestDb());

  it('upsertProtectionSettings round-trips snooze_until and keeps other fields', () => {
    upsertProtectionSettings('printer-x', { enabled: 1, spaghetti_action: 'pause', temp_deviation_threshold: 20 });
    const until = new Date(Date.now() + 30 * 60000).toISOString();

    // Merge over existing, as the service does, then upsert
    const existing = getProtectionSettings('printer-x');
    upsertProtectionSettings('printer-x', { ...existing, snooze_until: until });

    const s = getProtectionSettings('printer-x');
    assert.equal(s.snooze_until, until, 'snooze_until persisted');
    assert.equal(s.spaghetti_action, 'pause', 'other settings preserved');
    assert.equal(s.temp_deviation_threshold, 20, 'threshold preserved');
  });

  it('clearing snooze sets it back to null', () => {
    const existing = getProtectionSettings('printer-x');
    upsertProtectionSettings('printer-x', { ...existing, snooze_until: null });
    assert.equal(getProtectionSettings('printer-x').snooze_until, null);
  });
});
