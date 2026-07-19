// reservations.test.js — planned builds reserve component stock; the build
// shopping list aggregates what must be bought to fulfil them (print-vault idea).

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addPart, getPart } from '../../server/db/parts.js';
import { addStockItem } from '../../server/db/stock-items.js';
import { addBomLine } from '../../server/db/bom.js';
import { addBuild, completeBuild, cancelBuild } from '../../server/db/builds.js';
import { getBuildShoppingList } from '../../server/db/reservations.js';

function setup() {
  setupTestDb();
  const a = addPart({ name: 'CompA' }).id;
  const prod = addPart({ name: 'Product', type: 'product' }).id;
  addBomLine({ parent_part_id: prod, component_part_id: a, quantity: 4 });
  addStockItem({ part_id: a, quantity: 10 });
  return { a, prod };
}

describe('Build reservations', () => {
  before(() => setupTestDb());

  it('a planned build reserves component stock and lowers availability', () => {
    const { a, prod } = setup();
    addBuild({ part_id: prod, quantity: 2 }); // needs 4*2 = 8
    const p = getPart(a);
    assert.equal(p.total_stock, 10);
    assert.equal(p.reserved, 8);
    assert.equal(p.available, 2);
    assert.equal(p.over_reserved, 0);
  });

  it('over-commitment across builds is flagged and drives the shopping list', () => {
    const { a, prod } = setup();
    addBuild({ part_id: prod, quantity: 2 }); // 8
    addBuild({ part_id: prod, quantity: 1 }); // +4 = 12 reserved, only 10 on hand
    const p = getPart(a);
    assert.equal(p.reserved, 12);
    assert.equal(p.available, -2);
    assert.equal(p.over_reserved, 1);
    const list = getBuildShoppingList();
    assert.equal(list.length, 1);
    assert.equal(list[0].part_id, a);
    assert.equal(list[0].needed, 12);
    assert.equal(list[0].on_hand, 10);
    assert.equal(list[0].shortfall, 2);
  });

  it('completed and cancelled builds no longer reserve stock', () => {
    const { a, prod } = setup();
    const b1 = addBuild({ part_id: prod, quantity: 2 }).id;
    const b2 = addBuild({ part_id: prod, quantity: 1 }).id;
    assert.equal(getPart(a).reserved, 12);
    cancelBuild(b2);
    assert.equal(getPart(a).reserved, 8);
    completeBuild(b1); // consumes 8 → stock 2, and no longer reserves
    assert.equal(getPart(a).reserved, 0);
    assert.equal(getPart(a).total_stock, 2);
    assert.equal(getBuildShoppingList().length, 0);
  });
});
