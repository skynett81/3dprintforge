// image-to-heightmap.test.js — Unit tests for PNG decoder and heightmap converter

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { imageToHeightmap } from '../../server/image-to-heightmap.js';
import { deflateSync } from 'node:zlib';

// Helper: create a minimal valid PNG buffer
function createTestPNG(w, h, pixelData) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  function chunk(type, data) {
    const typeBuf = Buffer.from(type);
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length);
    const crcData = Buffer.concat([typeBuf, data]);
    const crc = crc32(crcData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  // IHDR: width, height, bitDepth=8, colorType=6 (RGBA), compression=0, filter=0, interlace=0
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT: raw scanlines with filter type 0 (none)
  const rawData = [];
  for (let y = 0; y < h; y++) {
    rawData.push(0); // filter type: none
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      rawData.push(pixelData[idx] || 0);     // R
      rawData.push(pixelData[idx + 1] || 0); // G
      rawData.push(pixelData[idx + 2] || 0); // B
      rawData.push(pixelData[idx + 3] || 255); // A
    }
  }
  const compressed = deflateSync(Buffer.from(rawData));

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Simple CRC32 for PNG chunks
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

describe('imageToHeightmap', () => {

  it('decodes a 2x2 PNG and returns correct grid dimensions', () => {
    // 2x2 image: white, black, gray, white
    const pixels = new Uint8Array([
      255, 255, 255, 255,  // white
      0, 0, 0, 255,        // black
      128, 128, 128, 255,  // gray
      255, 255, 255, 255,  // white
    ]);
    const png = createTestPNG(2, 2, pixels);
    const result = imageToHeightmap(png);

    assert.equal(result.width, 2);
    assert.equal(result.height, 2);
    assert.equal(result.originalWidth, 2);
    assert.equal(result.originalHeight, 2);
    assert.equal(result.grid.length, 2);
    assert.equal(result.grid[0].length, 2);
  });

  it('maps white pixels to ~1.0 and black pixels to ~0.0', () => {
    const pixels = new Uint8Array([
      255, 255, 255, 255,  // white → 1.0
      0, 0, 0, 255,        // black → 0.0
    ]);
    const png = createTestPNG(2, 1, pixels);
    const result = imageToHeightmap(png);

    assert.ok(result.grid[0][0] > 0.9, `white pixel should be ~1.0, got ${result.grid[0][0]}`);
    assert.ok(result.grid[0][1] < 0.1, `black pixel should be ~0.0, got ${result.grid[0][1]}`);
  });

  it('inverts when invert=true', () => {
    const pixels = new Uint8Array([
      255, 255, 255, 255,  // white
      0, 0, 0, 255,        // black
    ]);
    const png = createTestPNG(2, 1, pixels);
    const result = imageToHeightmap(png, { invert: true });

    assert.ok(result.grid[0][0] < 0.1, 'inverted white should be ~0.0');
    assert.ok(result.grid[0][1] > 0.9, 'inverted black should be ~1.0');
  });

  it('downsamples large images to maxWidth/maxHeight', () => {
    // Create a 10x10 image
    const pixels = new Uint8Array(10 * 10 * 4);
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = 128; pixels[i + 1] = 128; pixels[i + 2] = 128; pixels[i + 3] = 255;
    }
    const png = createTestPNG(10, 10, pixels);
    const result = imageToHeightmap(png, { maxWidth: 4, maxHeight: 4 });

    assert.equal(result.width, 4);
    assert.equal(result.height, 4);
    assert.equal(result.originalWidth, 10);
    assert.equal(result.originalHeight, 10);
  });

  it('applies gamma correction', () => {
    const pixels = new Uint8Array([128, 128, 128, 255]); // mid-gray
    const png = createTestPNG(1, 1, pixels);

    const noGamma = imageToHeightmap(png, { gamma: 1.0 });
    const highGamma = imageToHeightmap(png, { gamma: 2.0 });

    // gamma > 1 darkens mid-tones (value decreases)
    assert.ok(highGamma.grid[0][0] < noGamma.grid[0][0],
      `gamma 2.0 (${highGamma.grid[0][0]}) should be less than gamma 1.0 (${noGamma.grid[0][0]})`);
  });

  it('throws on non-PNG data', () => {
    assert.throws(() => {
      imageToHeightmap(Buffer.from('not a png'));
    }, /Not a valid PNG/);
  });

  it('handles 1x1 image', () => {
    const pixels = new Uint8Array([200, 100, 50, 255]);
    const png = createTestPNG(1, 1, pixels);
    const result = imageToHeightmap(png);

    assert.equal(result.width, 1);
    assert.equal(result.height, 1);
    assert.equal(result.grid.length, 1);
    assert.equal(result.grid[0].length, 1);
    assert.ok(result.grid[0][0] > 0 && result.grid[0][0] < 1);
  });

  it('all grid values are between 0 and 1', () => {
    const pixels = new Uint8Array(4 * 4 * 4);
    for (let i = 0; i < pixels.length; i += 4) {
      const v = Math.floor(Math.random() * 256);
      pixels[i] = v; pixels[i + 1] = v; pixels[i + 2] = v; pixels[i + 3] = 255;
    }
    const png = createTestPNG(4, 4, pixels);
    const result = imageToHeightmap(png);

    for (const row of result.grid) {
      for (const val of row) {
        assert.ok(val >= 0 && val <= 1, `value ${val} should be in [0,1]`);
      }
    }
  });
});
