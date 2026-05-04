// Tests for http-compression — encoding negotiation, threshold, brotli
// vs gzip preference, and end-to-end round-trip (compress → decompress
// → original bytes).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import {
  COMPRESS_MIN_BYTES,
  BROTLI_DYNAMIC_QUALITY,
  COMPRESSIBLE_EXTS,
  pickEncoding,
  maybeCompressJson,
} from '../../server/http-compression.js';

const fakeReq = (acceptEncoding) => ({ headers: { 'accept-encoding': acceptEncoding } });

describe('http-compression', () => {
  describe('pickEncoding', () => {
    it('prefers brotli when both are offered', () => {
      assert.equal(pickEncoding(fakeReq('gzip, deflate, br')), 'br');
      assert.equal(pickEncoding(fakeReq('br, gzip')), 'br');
    });

    it('falls back to gzip when brotli is missing', () => {
      assert.equal(pickEncoding(fakeReq('gzip, deflate')), 'gzip');
    });

    it('returns null for empty / missing / unsupported encodings', () => {
      assert.equal(pickEncoding(fakeReq('')), null);
      assert.equal(pickEncoding(fakeReq('deflate')), null);
      assert.equal(pickEncoding({}), null);
      assert.equal(pickEncoding(null), null);
      assert.equal(pickEncoding(undefined), null);
    });
  });

  describe('maybeCompressJson', () => {
    const big = JSON.stringify({ data: 'A'.repeat(2000) }); // > COMPRESS_MIN_BYTES
    const small = JSON.stringify({ ok: 1 });                 // < COMPRESS_MIN_BYTES

    it('skips compression for bodies below COMPRESS_MIN_BYTES', () => {
      const { body, headers } = maybeCompressJson(small, fakeReq('br, gzip'));
      assert.equal(body, small, 'small body should pass through unchanged');
      assert.deepEqual(headers, {}, 'no encoding headers should be set');
    });

    it('compresses with brotli when offered and big enough', () => {
      const { body, headers } = maybeCompressJson(big, fakeReq('br, gzip'));
      assert.equal(headers['Content-Encoding'], 'br');
      assert.equal(headers['Vary'], 'Accept-Encoding');
      assert.ok(Buffer.isBuffer(body), 'compressed body should be a Buffer');
      assert.ok(body.length < big.length, 'brotli should shrink the payload');
    });

    it('falls back to gzip when brotli is unavailable', () => {
      const { body, headers } = maybeCompressJson(big, fakeReq('gzip'));
      assert.equal(headers['Content-Encoding'], 'gzip');
      assert.equal(headers['Vary'], 'Accept-Encoding');
      assert.ok(Buffer.isBuffer(body));
      assert.ok(body.length < big.length);
    });

    it('passes through uncompressed when no supported encoding is offered', () => {
      const { body, headers } = maybeCompressJson(big, fakeReq('deflate'));
      assert.equal(body, big);
      assert.deepEqual(headers, {});
    });

    it('handles a missing req object without throwing', () => {
      const { body, headers } = maybeCompressJson(big, undefined);
      assert.equal(body, big);
      assert.deepEqual(headers, {});
    });

    it('round-trips: brotli-compressed body decompresses to the original JSON string', () => {
      const original = JSON.stringify({ items: Array.from({ length: 50 }, (_, i) => ({ id: i, name: 'spool-' + i })) });
      const { body } = maybeCompressJson(original, fakeReq('br'));
      const decoded = brotliDecompressSync(body).toString('utf8');
      assert.equal(decoded, original);
    });

    it('round-trips: gzip-compressed body decompresses to the original JSON string', () => {
      const original = JSON.stringify({ x: 'B'.repeat(3000) });
      const { body } = maybeCompressJson(original, fakeReq('gzip'));
      const decoded = gunzipSync(body).toString('utf8');
      assert.equal(decoded, original);
    });

    it('achieves >50% reduction on highly-compressible repetitive JSON', () => {
      const original = JSON.stringify({ data: 'AAAAA'.repeat(2000) });
      const { body } = maybeCompressJson(original, fakeReq('br'));
      const ratio = body.length / original.length;
      assert.ok(ratio < 0.5, `expected <50% size, got ${(ratio * 100).toFixed(1)}%`);
    });
  });

  describe('module constants', () => {
    it('COMPRESS_MIN_BYTES is a sensible threshold', () => {
      assert.ok(COMPRESS_MIN_BYTES >= 256 && COMPRESS_MIN_BYTES <= 4096);
    });

    it('BROTLI_DYNAMIC_QUALITY trades speed for size (1-6 range)', () => {
      assert.ok(BROTLI_DYNAMIC_QUALITY >= 1 && BROTLI_DYNAMIC_QUALITY <= 6);
    });

    it('COMPRESSIBLE_EXTS includes the major web text types', () => {
      for (const ext of ['.html', '.js', '.css', '.json', '.svg']) {
        assert.ok(COMPRESSIBLE_EXTS.has(ext), `expected ${ext} in COMPRESSIBLE_EXTS`);
      }
    });

    it('COMPRESSIBLE_EXTS excludes pre-compressed binary types', () => {
      for (const ext of ['.png', '.jpg', '.woff2', '.mp4', '.zip']) {
        assert.ok(!COMPRESSIBLE_EXTS.has(ext), `${ext} should NOT be re-compressed`);
      }
    });
  });
});
