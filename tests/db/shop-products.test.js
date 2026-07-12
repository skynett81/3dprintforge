// shop-products.test.js — storefront product catalog (Fase 2.1).
// A product is a sellable item with a sale price and an estimated per-unit
// COGS (material + labor + electricity + wear). Margin is derived, reusing
// the same computeMargin used by order-margins.

import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  createShopProduct,
  getShopProduct,
  updateShopProduct,
  listShopProducts,
  setShopProductActive,
  deleteShopProduct,
} from '../../server/db/shop-products.js';

const BASE = {
  name: 'Cable clip',
  sku: 'CLIP-01',
  price: 100,
  material_cost: 20,
  labor_cost: 10,
  electricity_cost: 2,
  wear_cost: 1,
};

describe('createShopProduct — validation', () => {
  beforeEach(() => setupTestDb());

  it('requires a non-empty name', () => {
    assert.throws(() => createShopProduct({ price: 10 }), /name/i);
    assert.throws(() => createShopProduct({ name: '   ', price: 10 }), /name/i);
  });

  it('rejects a negative price', () => {
    assert.throws(() => createShopProduct({ name: 'X', price: -5 }), /price/i);
  });

  it('defaults price to 0 and active to true', () => {
    const p = createShopProduct({ name: 'Freebie' });
    assert.equal(p.price, 0);
    assert.equal(p.active, 1);
  });
});

describe('createShopProduct / getShopProduct', () => {
  let id;
  before(() => {
    setupTestDb();
    id = createShopProduct(BASE).id;
  });

  it('round-trips fields', () => {
    const p = getShopProduct(id);
    assert.equal(p.name, 'Cable clip');
    assert.equal(p.sku, 'CLIP-01');
    assert.equal(p.price, 100);
  });

  it('computes unit COGS and margin', () => {
    const p = getShopProduct(id);
    assert.equal(p.unit_cogs, 33);   // 20 + 10 + 2 + 1
    assert.equal(p.margin, 67);      // 100 - 33
    assert.equal(p.margin_pct, 67);
  });

  it('returns null for a missing product', () => {
    assert.equal(getShopProduct(999999), null);
  });

  it('rejects a duplicate SKU', () => {
    assert.throws(() => createShopProduct({ name: 'Dup', sku: 'CLIP-01' }), /sku/i);
  });
});

describe('updateShopProduct', () => {
  let id;
  before(() => {
    setupTestDb();
    id = createShopProduct(BASE).id;
  });

  it('applies partial updates and recomputes margin', () => {
    updateShopProduct(id, { price: 150 });
    const p = getShopProduct(id);
    assert.equal(p.price, 150);
    assert.equal(p.margin, 117); // 150 - 33
  });

  it('ignores unknown fields', () => {
    updateShopProduct(id, { bogus: 'x', name: 'Renamed' });
    assert.equal(getShopProduct(id).name, 'Renamed');
  });

  it('throws on a missing product', () => {
    assert.throws(() => updateShopProduct(999999, { price: 1 }), /not found/i);
  });
});

describe('listShopProducts', () => {
  beforeEach(() => {
    setupTestDb();
    createShopProduct({ name: 'Active A', price: 50, material_cost: 10 });
    createShopProduct({ name: 'Active B', sku: 'B', price: 80, material_cost: 20 });
    const inactive = createShopProduct({ name: 'Hidden', price: 5 });
    setShopProductActive(inactive.id, false);
  });

  it('lists all products with margin fields', () => {
    const rows = listShopProducts();
    assert.equal(rows.length, 3);
    assert.ok('margin' in rows[0] && 'unit_cogs' in rows[0]);
  });

  it('filters to active only', () => {
    const rows = listShopProducts({ active: true });
    assert.equal(rows.length, 2);
    assert.ok(rows.every((r) => r.active === 1));
  });

  it('filters by search on name', () => {
    const rows = listShopProducts({ search: 'Hidden' });
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, 'Hidden');
  });
});

describe('setShopProductActive / deleteShopProduct', () => {
  let id;
  beforeEach(() => {
    setupTestDb();
    id = createShopProduct(BASE).id;
  });

  it('toggles active', () => {
    setShopProductActive(id, false);
    assert.equal(getShopProduct(id).active, 0);
    setShopProductActive(id, true);
    assert.equal(getShopProduct(id).active, 1);
  });

  it('deletes a product', () => {
    deleteShopProduct(id);
    assert.equal(getShopProduct(id), null);
  });
});
