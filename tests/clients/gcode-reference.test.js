// gcode-reference.test.js — Unit tests for the G-code reference database

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  listReference,
  getReference,
  searchReference,
  listCategories,
  listFirmwares,
} from '../../server/gcode-reference.js';

describe('gcode-reference: listReference', () => {
  it('returns a non-empty list of commands', () => {
    const all = listReference();
    assert.ok(Array.isArray(all));
    assert.ok(all.length > 50);
    assert.ok(all.every(cmd => cmd.code && cmd.desc && cmd.category));
  });
});

describe('gcode-reference: getReference', () => {
  it('finds G28 (home) by exact code', () => {
    const cmd = getReference('G28');
    assert.ok(cmd);
    assert.equal(cmd.code, 'G28');
    assert.match(cmd.desc, /home/i);
  });

  it('finds M104 case-insensitively', () => {
    const cmd = getReference('m104');
    assert.ok(cmd);
    assert.equal(cmd.code, 'M104');
  });

  it('returns null for unknown code', () => {
    assert.equal(getReference('M99999'), null);
  });

  it('returns null for null/empty input', () => {
    assert.equal(getReference(''), null);
    assert.equal(getReference(null), null);
  });
});

describe('gcode-reference: searchReference', () => {
  it('returns full list when no query given', () => {
    const out = searchReference({});
    assert.ok(out.length === listReference().length);
  });

  it('filters by query in code', () => {
    const out = searchReference({ q: 'M104' });
    assert.ok(out.length >= 1);
    assert.ok(out.every(c => c.code.includes('M104') || c.desc.toLowerCase().includes('m104')));
  });

  it('filters by query in description', () => {
    const out = searchReference({ q: 'home' });
    assert.ok(out.length >= 1);
    assert.ok(out.some(c => c.code === 'G28'));
  });

  it('filters by category', () => {
    const out = searchReference({ category: 'temperature' });
    assert.ok(out.length >= 1);
    assert.ok(out.every(c => c.category === 'temperature'));
  });

  it('filters by firmware', () => {
    const out = searchReference({ firmware: 'Klipper' });
    assert.ok(out.length >= 1);
    assert.ok(out.every(c => c.firmwares.includes('Klipper')));
  });

  it('combines query + filter', () => {
    const out = searchReference({ q: 'wait', category: 'temperature' });
    assert.ok(out.length >= 1);
    assert.ok(out.every(c => c.category === 'temperature'));
  });
});

describe('gcode-reference: listCategories / listFirmwares', () => {
  it('returns expected category set', () => {
    const cats = listCategories();
    assert.ok(cats.includes('movement'));
    assert.ok(cats.includes('temperature'));
    assert.ok(cats.includes('extruder'));
  });

  it('returns expected firmware set', () => {
    const fws = listFirmwares();
    assert.ok(fws.includes('Marlin'));
    assert.ok(fws.includes('Klipper'));
    assert.ok(fws.includes('RepRap'));
    assert.ok(fws.includes('Bambu'));
  });
});
