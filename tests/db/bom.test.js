// bom.test.js — Inventory Fase 3: bill of materials + build orders that
// consume component stock and produce finished goods.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addPart, getPartStock } from '../../server/db/parts.js';
import { addStockItem } from '../../server/db/stock-items.js';
import { getBom, addBomLine, deleteBomLine, getBomCost } from '../../server/db/bom.js';
import { addBuild, getBuild, getBuilds, completeBuild, cancelBuild } from '../../server/db/builds.js';

describe('BOM', () => {
  before(() => setupTestDb());

  it('lists BOM lines with component names and per-line cost (incl. waste)', () => {
    const product = addPart({ name: 'Widget', type: 'product' }).id;
    const a = addPart({ name: 'Screw', cost: 2 }).id;
    const b = addPart({ name: 'Magnet', cost: 5 }).id;
    addBomLine({ parent_part_id: product, component_part_id: a, quantity: 4 });
    addBomLine({ parent_part_id: product, component_part_id: b, quantity: 1, waste_pct: 10 });
    const bom = getBom(product);
    assert.equal(bom.length, 2);
    const screw = bom.find((l) => l.component_part_id === a);
    assert.equal(screw.component_name, 'Screw');
    assert.equal(screw.line_cost, 8); // 2 * 4
    const magnet = bom.find((l) => l.component_part_id === b);
    assert.equal(Math.round(magnet.line_cost * 100) / 100, 5.5); // 5 * 1 * 1.1
  });

  it('rolls up total BOM cost', () => {
    setupTestDb();
    const product = addPart({ name: 'P', type: 'product' }).id;
    const a = addPart({ name: 'A', cost: 2 }).id;
    const b = addPart({ name: 'B', cost: 5 }).id;
    addBomLine({ parent_part_id: product, component_part_id: a, quantity: 4 });
    addBomLine({ parent_part_id: product, component_part_id: b, quantity: 1, waste_pct: 10 });
    assert.equal(getBomCost(product), 13.5);
  });

  it('deletes a BOM line', () => {
    setupTestDb();
    const product = addPart({ name: 'P' }).id;
    const a = addPart({ name: 'A' }).id;
    const line = addBomLine({ parent_part_id: product, component_part_id: a, quantity: 1 }).id;
    deleteBomLine(line);
    assert.equal(getBom(product).length, 0);
  });
});

describe('Build orders', () => {
  before(() => setupTestDb());

  function setup() {
    setupTestDb();
    const product = addPart({ name: 'Product', type: 'product' }).id;
    const a = addPart({ name: 'CompA', cost: 2 }).id;
    const b = addPart({ name: 'CompB', cost: 5 }).id;
    addBomLine({ parent_part_id: product, component_part_id: a, quantity: 4 });
    addBomLine({ parent_part_id: product, component_part_id: b, quantity: 1, waste_pct: 10 });
    return { product, a, b };
  }

  it('creates a build order in planned state', () => {
    const { product } = setup();
    const { id } = addBuild({ part_id: product, quantity: 2 });
    const bo = getBuild(id);
    assert.equal(bo.status, 'planned');
    assert.equal(bo.quantity, 2);
    assert.equal(bo.part_name, 'Product');
  });

  it('completing a build consumes component stock and produces finished goods', () => {
    const { product, a, b } = setup();
    addStockItem({ part_id: a, quantity: 10 });
    addStockItem({ part_id: b, quantity: 3 });
    const { id } = addBuild({ part_id: product, quantity: 2 });
    const res = completeBuild(id);
    assert.equal(res.shortages.length, 0);
    assert.equal(getPartStock(a), 2);              // 10 - (4*2)
    assert.equal(Math.round(getPartStock(b) * 100) / 100, 0.8); // 3 - (1*2*1.1)
    assert.equal(getPartStock(product), 2);        // produced 2 finished units
    assert.equal(getBuild(id).status, 'completed');
  });

  it('flags shortages but still completes and clamps at zero', () => {
    const { product, a, b } = setup();
    addStockItem({ part_id: a, quantity: 5 }); // need 8
    addStockItem({ part_id: b, quantity: 3 });
    const { id } = addBuild({ part_id: product, quantity: 2 });
    const res = completeBuild(id);
    assert.equal(res.shortages.length, 1);
    assert.equal(res.shortages[0].part_id, a);
    assert.equal(getPartStock(a), 0);
    assert.equal(getBuild(id).status, 'completed');
  });

  it('cancels a build without touching stock', () => {
    const { product, a } = setup();
    addStockItem({ part_id: a, quantity: 10 });
    const { id } = addBuild({ part_id: product, quantity: 1 });
    cancelBuild(id);
    assert.equal(getBuild(id).status, 'cancelled');
    assert.equal(getPartStock(a), 10);
    assert.equal(getBuilds({ status: 'cancelled' }).length, 1);
  });
});
