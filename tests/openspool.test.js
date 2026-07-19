import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOpenSpoolTag, parseOpenSpoolTag, openSpoolPreviewUrl, matchSpoolToTag,
  OPENSPOOL_PROTOCOL, OPENSPOOL_VERSION,
} from '../server/openspool.js';

describe('openspool', () => {
  const spool = {
    id: 7, material: 'PETG', color_hex: '#FFAABB', vendor_name: 'eSUN',
    nozzle_temp_min: 230, nozzle_temp_max: 250,
  };

  test('buildOpenSpoolTag maps a spool row to the OpenSpool schema', () => {
    const tag = buildOpenSpoolTag(spool);
    assert.equal(tag.protocol, OPENSPOOL_PROTOCOL);
    assert.equal(tag.version, OPENSPOOL_VERSION);
    assert.equal(tag.type, 'PETG');
    assert.equal(tag.color_hex, 'FFAABB'); // stripped '#', upper-cased
    assert.equal(tag.brand, 'eSUN');
    assert.equal(tag.min_temp, '230');
    assert.equal(tag.max_temp, '250');
  });

  test('buildOpenSpoolTag falls back sensibly on sparse spools', () => {
    const tag = buildOpenSpoolTag({ id: 1 });
    assert.equal(tag.type, 'PLA');
    assert.equal(tag.color_hex, 'FFFFFF');
    assert.equal(tag.brand, 'Generic');
    assert.equal('min_temp' in tag, false); // omitted when unknown
  });

  test('parse ↔ build round-trips', () => {
    const parsed = parseOpenSpoolTag(buildOpenSpoolTag(spool));
    assert.equal(parsed.type, 'PETG');
    assert.equal(parsed.colorHex, 'FFAABB');
    assert.equal(parsed.brand, 'eSUN');
    assert.equal(parsed.minTemp, 230);
    assert.equal(parsed.maxTemp, 250);
  });

  test('parseOpenSpoolTag accepts a JSON string', () => {
    const parsed = parseOpenSpoolTag('{"protocol":"openspool","type":"PLA","color_hex":"00ff00"}');
    assert.equal(parsed.type, 'PLA');
    assert.equal(parsed.colorHex, '00FF00');
  });

  test('parseOpenSpoolTag rejects non-OpenSpool payloads', () => {
    assert.throws(() => parseOpenSpoolTag({ protocol: 'other', type: 'PLA' }), /not an OpenSpool tag/);
    assert.throws(() => parseOpenSpoolTag('not json'), /invalid JSON/);
  });

  test('openSpoolPreviewUrl builds the openspool.io URL', () => {
    const url = openSpoolPreviewUrl(buildOpenSpoolTag(spool));
    assert.match(url, /^https:\/\/openspool\.io\/tag_info\?/);
    assert.match(url, /color_hex=FFAABB/);
    assert.match(url, /type=PETG/);
    assert.match(url, /min_temp=230/);
  });

  test('matchSpoolToTag ranks by material, colour then brand', () => {
    const spools = [
      { id: 1, material: 'PLA', color_hex: 'FFAABB', vendor_name: 'eSUN' },
      { id: 2, material: 'PETG', color_hex: '112233', vendor_name: 'Other' }, // material only
      { id: 3, material: 'PETG', color_hex: 'FFAABB', vendor_name: 'eSUN' },   // full match
    ];
    const { matched, candidates } = matchSpoolToTag(parseOpenSpoolTag(buildOpenSpoolTag(spool)), spools);
    assert.equal(matched.id, 3);
    assert.equal(candidates[0].id, 3);
    assert.ok(candidates[0].score >= candidates[1].score);
  });

  test('matchSpoolToTag returns null when nothing matches', () => {
    const { matched } = matchSpoolToTag(parseOpenSpoolTag(buildOpenSpoolTag(spool)), [{ id: 9, material: 'ABS', color_hex: '000000', vendor_name: 'X' }]);
    assert.equal(matched, null);
  });
});
