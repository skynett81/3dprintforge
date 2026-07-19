// model-library.test.js — link a product part to its printable file and
// enrich library files with provenance (Manyfold-inspired).

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addPart, getPart, getPartsUsingFile } from '../../server/db/parts.js';
import { addFileLibraryItem, getFileLibrary, getFileLibraryItem, updateFileLibraryItem } from '../../server/db/queue.js';

describe('Model library ↔ inventory', () => {
  before(() => setupTestDb());

  it('links a part to a printable file, exposing model info + usage', () => {
    const fid = addFileLibraryItem({ filename: 'x.3mf', original_name: 'Benchy', file_type: '3mf' });
    const part = addPart({ name: 'Benchy product', type: 'product', model_file_id: fid }).id;
    const p = getPart(part);
    assert.equal(p.model_file_id, fid);
    assert.equal(p.model_name, 'Benchy');
    assert.equal(p.model_file_type, '3mf');
    const lib = getFileLibrary().find((f) => f.id === fid);
    assert.equal(lib.used_by, 1);
    assert.equal(getPartsUsingFile(fid).length, 1);
  });

  it('enriches a library file with provenance metadata', () => {
    setupTestDb();
    const fid = addFileLibraryItem({ filename: 'y.stl', original_name: 'Gear', file_type: 'stl' });
    updateFileLibraryItem(fid, { source_url: 'https://x/gear', license: 'CC-BY', designer: 'Bob', tags: 'gears,mechanical' });
    const item = getFileLibraryItem(fid);
    assert.equal(item.source_url, 'https://x/gear');
    assert.equal(item.license, 'CC-BY');
    assert.equal(item.designer, 'Bob');
    assert.equal(item.tags, 'gears,mechanical');
  });
});
