// model-forge.test.js — Integration tests for all Model Forge API endpoints
// Tests each endpoint returns a valid 3MF (ZIP) buffer

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';

// ── Helper: create a small test PNG ──
function createTestPNG() {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  function chunk(type, data) {
    const typeBuf = Buffer.from(type);
    const lenBuf = Buffer.alloc(4); lenBuf.writeUInt32BE(data.length);
    let crc = 0xFFFFFFFF;
    const crcData = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < crcData.length; i++) { crc ^= crcData[i]; for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0); }
    const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE((crc ^ 0xFFFFFFFF) >>> 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(4, 0); ihdr.writeUInt32BE(4, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = [];
  for (let y = 0; y < 4; y++) { raw.push(0); for (let x = 0; x < 4; x++) { const g = Math.floor((x + y) / 6 * 255); raw.push(g, g, g, 255); } }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.from(raw))), chunk('IEND', Buffer.alloc(0))]);
}

// Direct generator function tests (no HTTP server needed)
describe('Model Forge Generators', () => {

  it('sign-3mf-generator produces valid 3MF', async () => {
    const { generateSign3MF } = await import('../../server/sign-3mf-generator.js');
    const buf = await generateSign3MF({ title: 'Test', qrData: 'hello', plateWidth: 40, plateHeight: 30 });
    assert.ok(Buffer.isBuffer(buf), 'should return a Buffer');
    assert.ok(buf.length > 100, 'buffer should be non-trivial');
    // ZIP signature: PK\x03\x04
    assert.equal(buf[0], 0x50, 'ZIP sig byte 0');
    assert.equal(buf[1], 0x4B, 'ZIP sig byte 1');
  });

  it('lithophane-generator produces valid 3MF from PNG', async () => {
    const { generateLithophane3MF } = await import('../../server/generators/lithophane-generator.js');
    const png = createTestPNG();
    const buf = await generateLithophane3MF(png, { shape: 'flat', width: 30, resolution: 4 });
    assert.ok(Buffer.isBuffer(buf));
    assert.equal(buf[0], 0x50);
    assert.equal(buf[1], 0x4B);
  });

  it('lithophane curved shape works', async () => {
    const { generateLithophane3MF } = await import('../../server/generators/lithophane-generator.js');
    const png = createTestPNG();
    const buf = await generateLithophane3MF(png, { shape: 'curved', width: 30, resolution: 4, curveRadius: 20 });
    assert.ok(buf.length > 100);
    assert.equal(buf[0], 0x50);
  });

  it('storage-box-generator produces valid 3MF', async () => {
    const { generateStorageBox3MF } = await import('../../server/generators/storage-box-generator.js');
    const buf = await generateStorageBox3MF({ width: 42, depth: 42, height: 20, dividersX: 1, dividersY: 1 });
    assert.ok(Buffer.isBuffer(buf));
    assert.equal(buf[0], 0x50);
  });

  it('storage-box gridfinity mode works', async () => {
    const { generateStorageBox3MF } = await import('../../server/generators/storage-box-generator.js');
    const buf = await generateStorageBox3MF({ gridfinity: true, gridUnitsX: 2, gridUnitsY: 2, height: 30 });
    assert.ok(buf.length > 100);
  });

  it('storage-box stackable lip works', async () => {
    const { generateStorageBox3MF } = await import('../../server/generators/storage-box-generator.js');
    const buf = await generateStorageBox3MF({ width: 60, depth: 40, height: 30, stackable: true });
    assert.ok(buf.length > 100);
  });

  it('keychain-generator produces valid 3MF', async () => {
    const { generateKeychain3MF } = await import('../../server/generators/keychain-generator.js');
    const buf = await generateKeychain3MF({ text: 'TEST', width: 40, height: 15 });
    assert.ok(Buffer.isBuffer(buf));
    assert.equal(buf[0], 0x50);
  });

  it('keychain without ring hole works', async () => {
    const { generateKeychain3MF } = await import('../../server/generators/keychain-generator.js');
    const buf = await generateKeychain3MF({ text: 'AB', ringHole: false });
    assert.ok(buf.length > 100);
  });

  it('text-plate-generator produces valid 3MF', async () => {
    const { generateTextPlate3MF } = await import('../../server/generators/text-plate-generator.js');
    const buf = await generateTextPlate3MF({ text: 'Hello\nWorld', fontSize: 8 });
    assert.ok(Buffer.isBuffer(buf));
    assert.equal(buf[0], 0x50);
  });

  it('text-plate with border and holes works', async () => {
    const { generateTextPlate3MF } = await import('../../server/generators/text-plate-generator.js');
    const buf = await generateTextPlate3MF({ text: 'Test', border: true, holes: true });
    assert.ok(buf.length > 100);
  });

  it('cable-label flag style produces valid 3MF', async () => {
    const { generateCableLabel3MF } = await import('../../server/generators/cable-label-generator.js');
    const buf = await generateCableLabel3MF({ text: 'ETH', style: 'flag', cableDiameter: 5 });
    assert.ok(Buffer.isBuffer(buf));
    assert.equal(buf[0], 0x50);
  });

  it('cable-label wrap style produces valid 3MF', async () => {
    const { generateCableLabel3MF } = await import('../../server/generators/cable-label-generator.js');
    const buf = await generateCableLabel3MF({ text: 'USB', style: 'wrap', wrapAngle: 270 });
    assert.ok(buf.length > 100);
  });

  it('relief-generator produces valid 3MF', async () => {
    const { generateRelief3MF } = await import('../../server/generators/relief-generator.js');
    const png = createTestPNG();
    const buf = await generateRelief3MF(png, { width: 30, resolution: 4, maxRelief: 2 });
    assert.ok(Buffer.isBuffer(buf));
    assert.equal(buf[0], 0x50);
  });

  it('relief mirror (stamp) mode works', async () => {
    const { generateRelief3MF } = await import('../../server/generators/relief-generator.js');
    const png = createTestPNG();
    const buf = await generateRelief3MF(png, { width: 30, resolution: 4, mirror: true });
    assert.ok(buf.length > 100);
  });

  it('stencil-generator produces valid 3MF', async () => {
    const { generateStencil3MF } = await import('../../server/generators/stencil-generator.js');
    const png = createTestPNG();
    const buf = await generateStencil3MF(png, { width: 30, resolution: 4, threshold: 0.5 });
    assert.ok(Buffer.isBuffer(buf));
    assert.equal(buf[0], 0x50);
  });

  it('stencil with border works', async () => {
    const { generateStencil3MF } = await import('../../server/generators/stencil-generator.js');
    const png = createTestPNG();
    const buf = await generateStencil3MF(png, { width: 30, resolution: 4, border: true, borderWidth: 3 });
    assert.ok(buf.length > 100);
  });

  it('stencil inverted works', async () => {
    const { generateStencil3MF } = await import('../../server/generators/stencil-generator.js');
    const png = createTestPNG();
    const buf = await generateStencil3MF(png, { width: 30, resolution: 4, invert: true });
    assert.ok(buf.length > 100);
  });
});
