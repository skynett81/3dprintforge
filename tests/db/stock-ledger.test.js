// stock-ledger.test.js — Procurement Phase 3: unified stock ledger + manual
// stock adjustment with audited transactions.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  adjustSpoolStock, recordStockTransaction, getStockLedger, getStockActivity,
} from '../../server/db/stock-ledger.js';
import { addSpool, getSpool, useSpoolWeight } from '../../server/db/spools.js';
import { checkoutSpool } from '../../server/db/misc.js';

describe('Manual stock adjustment', () => {
  before(() => setupTestDb());

  it('sets absolute remaining weight and records a signed transaction', () => {
    setupTestDb();
    const { id } = addSpool({ initial_weight_g: 1000, remaining_weight_g: 800 });
    const r = adjustSpoolStock(id, { new_remaining_g: 750, reason: 'Re-weighed' });
    assert.equal(r.delta_g, -50);
    assert.equal(r.balance_g, 750);
    assert.equal(getSpool(id).remaining_weight_g, 750);
    const ledger = getStockLedger(id);
    const adj = ledger.find(e => e.type === 'adjust');
    assert.ok(adj, 'adjust txn present in ledger');
    assert.equal(adj.delta_g, -50);
    assert.equal(adj.reason, 'Re-weighed');
  });

  it('applies a signed delta', () => {
    setupTestDb();
    const { id } = addSpool({ initial_weight_g: 1000, remaining_weight_g: 500 });
    const r = adjustSpoolStock(id, { delta_g: -120, reason: 'spill' });
    assert.equal(r.balance_g, 380);
    assert.equal(getSpool(id).remaining_weight_g, 380);
  });

  it('rejects a negative resulting weight', () => {
    setupTestDb();
    const { id } = addSpool({ initial_weight_g: 1000, remaining_weight_g: 100 });
    assert.throws(() => adjustSpoolStock(id, { delta_g: -200 }), /non-negative/);
  });

  it('throws on an unknown spool', () => {
    setupTestDb();
    assert.throws(() => adjustSpoolStock(99999, { new_remaining_g: 10 }), /not found/);
  });
});

describe('Unified ledger read-model', () => {
  before(() => setupTestDb());

  it('merges canonical txns, print consumption, lifecycle events and moves', () => {
    setupTestDb();
    const { id } = addSpool({ initial_weight_g: 1000, remaining_weight_g: 1000, location: 'A' });
    // print consumption (legacy usage log)
    useSpoolWeight(id, 30, 'auto', null, 'printer-1');
    // a manual adjustment (canonical txn)
    adjustSpoolStock(id, { new_remaining_g: 900, reason: 'recount' });
    // a location move (legacy checkout log)
    checkoutSpool(id, 'tester', 'A');

    const ledger = getStockLedger(id);
    assert.ok(ledger.some(e => e.source === 'usage' && e.type === 'consume' && e.delta_g === -30), 'consume present with -30 delta');
    assert.ok(ledger.some(e => e.source === 'transaction' && e.type === 'adjust'), 'adjust txn present');
    assert.ok(ledger.some(e => e.source === 'checkout'), 'move present');
    assert.ok(ledger.some(e => e.source === 'event' && e.type === 'created'), 'created event present');
    // newest-first ordering
    for (let i = 1; i < ledger.length; i++) {
      assert.ok(String(ledger[i - 1].timestamp) >= String(ledger[i].timestamp));
    }
  });

  it('global activity labels each entry with its spool and supports type filter', () => {
    setupTestDb();
    const a = addSpool({ initial_weight_g: 1000, remaining_weight_g: 1000 }).id;
    const b = addSpool({ initial_weight_g: 1000, remaining_weight_g: 1000 }).id;
    adjustSpoolStock(a, { new_remaining_g: 950, reason: 'x' });
    useSpoolWeight(b, 40, 'auto', null, 'printer-1');
    const feed = getStockActivity({ limit: 50 });
    assert.ok(feed.length >= 2);
    assert.ok(feed.every(e => 'spool_label' in e), 'entries are spool-labelled');
    const adjustOnly = getStockActivity({ type: 'adjust' });
    assert.ok(adjustOnly.length >= 1);
    assert.ok(adjustOnly.every(e => e.type === 'adjust'));
  });

  it('recordStockTransaction inserts a raw ledger row', () => {
    setupTestDb();
    const { id } = addSpool({ initial_weight_g: 1000 });
    const txnId = recordStockTransaction({ spool_id: id, txn_type: 'receive', delta_g: 1000, balance_g: 1000, reason: 'PO', ref_type: 'po', ref_id: 7 });
    assert.ok(txnId > 0);
    const ledger = getStockLedger(id);
    assert.ok(ledger.some(e => e.type === 'receive' && e.ref_type === 'po' && e.ref_id === 7));
  });
});
