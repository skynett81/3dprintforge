// shop-part-link.test.js — closing the loop: a shop product linked to a
// finished-good part sells from real inventory and costs from its BOM.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addPart, getPartStock } from '../../server/db/parts.js';
import { addStockItem } from '../../server/db/stock-items.js';
import { addBomLine } from '../../server/db/bom.js';
import { addBuild, completeBuild } from '../../server/db/builds.js';
import { createShopProduct, getShopProduct, updateShopProduct } from '../../server/db/shop-products.js';
import { createShopOrder } from '../../server/db/shop-fulfillment.js';

describe('Shop ↔ inventory sales linkage', () => {
  before(() => setupTestDb());

  it('exposes live part stock + BOM cost, and margin uses BOM cost', () => {
    const comp = addPart({ name: 'Comp', cost: 4 }).id;
    const part = addPart({ name: 'Vase', type: 'product' }).id;
    addBomLine({ parent_part_id: part, component_part_id: comp, quantity: 3 }); // BOM cost 12
    addStockItem({ part_id: part, quantity: 5 });
    const product = createShopProduct({ name: 'Vase', price: 30, part_id: part });
    assert.equal(product.part_id, part);
    assert.equal(product.part_stock, 5);
    assert.equal(product.bom_cost, 12);
    assert.equal(product.unit_cogs, 12); // no manual cost → BOM cost
    assert.equal(product.margin, 18);    // 30 - 12
  });

  it('deducts the linked part finished-good stock on sale', () => {
    setupTestDb();
    const part = addPart({ name: 'Vase', type: 'product' }).id;
    addStockItem({ part_id: part, quantity: 5 });
    const product = createShopProduct({ name: 'Vase', price: 100, part_id: part });
    createShopOrder({ customer: { name: 'Buyer' }, items: [{ product_id: product.id, quantity: 2 }] });
    assert.equal(getPartStock(part), 3);              // 5 - 2 sold
    assert.equal(getShopProduct(product.id).part_stock, 3);
  });

  it('blocks a sale when the linked part is out of stock', () => {
    setupTestDb();
    const part = addPart({ name: 'P', type: 'product' }).id;
    addStockItem({ part_id: part, quantity: 1 });
    const product = createShopProduct({ name: 'P', price: 10, part_id: part });
    assert.throws(() => createShopOrder({ customer: { name: 'Buyer' }, items: [{ product_id: product.id, quantity: 3 }] }), /stock/i);
    assert.equal(getPartStock(part), 1); // unchanged
  });

  it('a build produces sellable stock the product can draw from', () => {
    setupTestDb();
    const comp = addPart({ name: 'Screw', cost: 1 }).id;
    const part = addPart({ name: 'Widget', type: 'product' }).id;
    addBomLine({ parent_part_id: part, component_part_id: comp, quantity: 2 });
    addStockItem({ part_id: comp, quantity: 100 });
    const product = createShopProduct({ name: 'Widget', price: 20, part_id: part });
    assert.equal(getShopProduct(product.id).part_stock, 0); // nothing built yet
    const build = addBuild({ part_id: part, quantity: 4 }).id;
    completeBuild(build);
    assert.equal(getShopProduct(product.id).part_stock, 4); // 4 finished units now sellable
  });

  it('can link an existing product to a part after creation', () => {
    setupTestDb();
    const part = addPart({ name: 'Thing', type: 'product' }).id;
    addStockItem({ part_id: part, quantity: 7 });
    const product = createShopProduct({ name: 'Thing', price: 5 });
    assert.equal(product.part_id, null);
    const linked = updateShopProduct(product.id, { part_id: part });
    assert.equal(linked.part_id, part);
    assert.equal(linked.part_stock, 7);
  });
});
