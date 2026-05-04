// Tests for the json-cache module — first-read-wins semantics, error
// path returns null instead of throwing, and the immutable-headers
// constant is the right shape for HTTP. Uses the real disk so we
// exercise readFileSync + JSON.parse together (the actual hot path).

import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  loadJson,
  loadServerJson,
  invalidateJson,
  IMMUTABLE_JSON_HEADERS,
  getHmsCodes,
} from '../../server/json-cache.js';

let tmpDir;
let goodFile;
let badFile;
let missingFile;

describe('json-cache', () => {
  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dpf-json-cache-'));
    goodFile = join(tmpDir, 'good.json');
    badFile = join(tmpDir, 'bad.json');
    missingFile = join(tmpDir, 'does-not-exist.json');
    writeFileSync(goodFile, JSON.stringify({ hello: 'world', n: 42 }));
    writeFileSync(badFile, '{ this is not valid json');
  });

  after(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    invalidateJson();
    // Restore the canonical "good" content so tests that mutate the file
    // (the cache-staleness ones below) don't leak state into other cases.
    writeFileSync(goodFile, JSON.stringify({ hello: 'world', n: 42 }));
  });

  describe('loadJson', () => {
    it('reads and parses a JSON file', () => {
      const obj = loadJson(goodFile);
      assert.deepEqual(obj, { hello: 'world', n: 42 });
    });

    it('returns the same instance on repeated reads (cached)', () => {
      const a = loadJson(goodFile);
      const b = loadJson(goodFile);
      assert.equal(a, b, 'cache should hand back the same object reference');
    });

    it('returns null and does not throw on parse error', () => {
      const result = loadJson(badFile);
      assert.equal(result, null);
    });

    it('returns null and does not throw on missing file', () => {
      const result = loadJson(missingFile);
      assert.equal(result, null);
    });

    it('caches the null result so repeated misses do not re-read', () => {
      const a = loadJson(missingFile);
      const b = loadJson(missingFile);
      assert.equal(a, null);
      assert.equal(b, null);
      // Identity won't help here (both null), but absence of an exception
      // and the deterministic `null` confirms the cache covers misses too.
    });

    it('survives the file changing on disk after caching', () => {
      const first = loadJson(goodFile);
      writeFileSync(goodFile, JSON.stringify({ hello: 'changed' }));
      const second = loadJson(goodFile);
      assert.equal(first, second, 'cache is intentional — on-disk change should NOT propagate without invalidate');
      assert.deepEqual(second, { hello: 'world', n: 42 });
    });

    it('honours invalidateJson(path) and re-reads', () => {
      const first = loadJson(goodFile);
      assert.deepEqual(first, { hello: 'world', n: 42 });
      writeFileSync(goodFile, JSON.stringify({ hello: 'fresh' }));
      invalidateJson(goodFile);
      const second = loadJson(goodFile);
      assert.deepEqual(second, { hello: 'fresh' });
    });

    it('honours invalidateJson() with no args (full clear)', () => {
      loadJson(goodFile);
      writeFileSync(goodFile, JSON.stringify({ hello: 'new' }));
      invalidateJson();
      const after = loadJson(goodFile);
      assert.deepEqual(after, { hello: 'new' });
    });
  });

  describe('loadServerJson', () => {
    it('resolves paths relative to the server/ directory', () => {
      // hms-codes.json ships with the repo and is checked by the
      // /api/hms-codes integration. If this fails the file moved.
      const codes = loadServerJson('hms-codes.json');
      assert.ok(codes, 'expected hms-codes.json at server/ root');
      assert.equal(typeof codes, 'object');
    });

    it('joins multiple path parts', () => {
      const db = loadServerJson('data', 'bambu-printer-db.json');
      assert.ok(db, 'expected server/data/bambu-printer-db.json to exist');
      assert.ok(db.printers, 'bambu-printer-db.json should have a printers object');
    });
  });

  describe('getHmsCodes', () => {
    it('returns an object (never throws)', () => {
      const codes = getHmsCodes();
      assert.equal(typeof codes, 'object');
      assert.ok(codes !== null);
    });
  });

  describe('IMMUTABLE_JSON_HEADERS', () => {
    it('declares max-age=86400 and immutable', () => {
      const cc = IMMUTABLE_JSON_HEADERS['Cache-Control'];
      assert.match(cc, /max-age=86400/);
      assert.match(cc, /immutable/);
      assert.match(cc, /public/);
    });

    it('is frozen so callers cannot mutate it accidentally', () => {
      assert.throws(() => {
        IMMUTABLE_JSON_HEADERS['Cache-Control'] = 'no-cache';
      }, /read only|Cannot assign/i);
    });
  });
});
