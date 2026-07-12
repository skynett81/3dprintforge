// checkouts.test.js — asset check-out / custody (Snipe-IT style).

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addPart } from '../../server/db/parts.js';
import { checkOut, checkIn, getCheckouts, getActiveCheckout, getOverdueCheckouts } from '../../server/db/checkouts.js';

describe('Asset check-out / custody', () => {
  before(() => setupTestDb());

  it('checks a tool out to a holder and reports the active custody', () => {
    const tool = addPart({ name: 'Calipers', type: 'tool' }).id;
    const { id } = checkOut({ entity_type: 'part', entity_id: String(tool), holder: 'Alice', due_at: '2099-01-01' });
    const active = getActiveCheckout('part', String(tool));
    assert.equal(active.id, id);
    assert.equal(active.holder, 'Alice');
    assert.equal(active.status, 'out');
  });

  it('checks an item back in', () => {
    setupTestDb();
    const tool = addPart({ name: 'Drill' }).id;
    const { id } = checkOut({ entity_type: 'part', entity_id: String(tool), holder: 'Bob' });
    checkIn(id);
    assert.equal(getActiveCheckout('part', String(tool)), null);
    assert.equal(getCheckouts({ entity_type: 'part', entity_id: String(tool) })[0].status, 'returned');
  });

  it('flags overdue checkouts', () => {
    setupTestDb();
    const a = addPart({ name: 'A' }).id;
    const b = addPart({ name: 'B' }).id;
    checkOut({ entity_type: 'part', entity_id: String(a), holder: 'X', due_at: '2000-01-01' }); // past
    checkOut({ entity_type: 'part', entity_id: String(b), holder: 'Y', due_at: '2099-01-01' }); // future
    const overdue = getOverdueCheckouts();
    assert.equal(overdue.length, 1);
    assert.equal(overdue[0].entity_id, String(a));
  });

  it('lists open checkouts and enriches part names', () => {
    setupTestDb();
    const tool = addPart({ name: 'Wrench', type: 'tool' }).id;
    checkOut({ entity_type: 'part', entity_id: String(tool), holder: 'Z' });
    const open = getCheckouts({ status: 'out' });
    assert.equal(open.length, 1);
    assert.equal(open[0].entity_name, 'Wrench');
  });
});
