// Regression test for analyze3mf — locks in the JSZip-backed path that
// extracts filament names and model counts. Without jszip installed the
// function silently fell back to a string-grep stub that always returned
// empty filaments and modelCount=0; this test fails fast if that
// regression returns.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { analyze3mf } from '../../server/generators/threemf-converter.js';

async function buildFakeBambu3mf({ filaments = ['Bambu PLA Basic'], modelCount = 1 } = {}) {
  const zip = new JSZip();
  // Markers analyze3mf looks for to identify a Bambu file
  zip.file('Metadata/slice_info.config', '<config/>');
  zip.file('Metadata/model_settings.config', '<config/>');
  zip.file('Metadata/project_settings.config', JSON.stringify({
    filament_settings_id: filaments,
  }));
  for (let i = 0; i < modelCount; i++) {
    zip.file(`3D/Objects/object_${i + 1}.model`, '<model/>');
  }
  return zip.generateAsync({ type: 'nodebuffer' });
}

async function buildFakeSnapmaker3mf() {
  const zip = new JSZip();
  zip.file('Snapmaker/manifest.json', '{}');
  zip.file('3D/Objects/object_1.model', '<model/>');
  return zip.generateAsync({ type: 'nodebuffer' });
}

describe('analyze3mf', () => {
  it('extracts filament names from a Bambu 3MF', async () => {
    const buf = await buildFakeBambu3mf({ filaments: ['Bambu PLA Basic', 'Bambu PETG HF'] });
    const result = await analyze3mf(buf);
    assert.equal(result.isBambu, true);
    assert.equal(result.isSnapmaker, false);
    assert.deepEqual(result.filaments, ['Bambu PLA Basic', 'Bambu PETG HF']);
    assert.ok(result.modelCount >= 1, 'expected at least one model');
  });

  it('counts .model files', async () => {
    const buf = await buildFakeBambu3mf({ modelCount: 3 });
    const result = await analyze3mf(buf);
    assert.equal(result.modelCount, 3);
  });

  it('flags Snapmaker files as not-Bambu', async () => {
    const buf = await buildFakeSnapmaker3mf();
    const result = await analyze3mf(buf);
    assert.equal(result.isSnapmaker, true);
    assert.equal(result.isBambu, false);
  });

  it('returns fileCount on the result (sanity check that JSZip was used)', async () => {
    // The fallback path doesn't set fileCount — this asserts we're on the
    // proper JSZip-backed code path, not the degraded stub.
    const buf = await buildFakeBambu3mf();
    const result = await analyze3mf(buf);
    assert.equal(typeof result.fileCount, 'number');
    assert.ok(result.fileCount > 0);
  });

  it('does not throw on an empty buffer', async () => {
    const result = await analyze3mf(Buffer.alloc(0));
    // Either fallback returns sensible defaults or jszip rejects — the
    // important thing is no unhandled exception bubbling out.
    assert.ok(result === undefined || typeof result === 'object');
  });
});
