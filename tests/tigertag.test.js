// tigertag.test.js — decode TigerTag RFID filament dumps.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TigerTag } from 'tigertag';
import { parseTigerTagDump, normalizeTigerTagDict } from '../server/tigertag.js';

const toHex = (bytes) => Buffer.from(bytes).toString('hex');

describe('tigertag', () => {
  test('decodes a dump (bytes and hex string both accepted)', () => {
    const bytes = TigerTag.erase(); // a valid, blank TigerTag dump
    const fromBytes = parseTigerTagDump(bytes);
    const fromHex = parseTigerTagDump(toHex(bytes));
    assert.equal(fromBytes.protocol, 'tigertag');
    assert.deepEqual(fromHex, fromBytes);
    // blank tag → unknowns normalise to null, colour is 000000
    assert.equal(fromBytes.type, null);
    assert.equal(fromBytes.brand, null);
    assert.equal(fromBytes.colorHex, '000000');
  });

  test('normalises a resolved TigerTag dict to OpenSpool-compatible fields', () => {
    const dict = {
      material: { label: 'PETG' },
      type: { label: 'HF' },
      brand: { label: 'eSUN' },
      diameter: { label: '1.75mm' },
      colors: { primary: { hex: '#FFAABB' } },
      temperatures: { on_chip: { nozzle: { min: 230, max: 250 }, bed: { min: 70, max: 80 } } },
      measure: { measure_gr: 1000 },
      uid: '04A1B2C3',
    };
    const n = normalizeTigerTagDict(dict);
    assert.equal(n.type, 'PETG');
    assert.equal(n.variant, 'HF');
    assert.equal(n.brand, 'eSUN');
    assert.equal(n.colorHex, 'FFAABB');
    assert.equal(n.minTemp, 230);
    assert.equal(n.maxTemp, 250);
    assert.equal(n.bedMin, 70);
    assert.equal(n.weightG, 1000);
    assert.equal(n.uid, '04A1B2C3');
  });

  test('rejects invalid input', () => {
    assert.throws(() => parseTigerTagDump('nothex!!'), /invalid hex|not a TigerTag/);
    assert.throws(() => parseTigerTagDump(12345), /unsupported/);
  });
});
