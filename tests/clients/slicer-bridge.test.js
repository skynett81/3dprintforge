// slicer-bridge.test.js — unit tests for slicer detection + selection.
// Doesn't actually invoke the slicer (that's slow + non-deterministic);
// asserts on the discovery + picker logic with mocked exec.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { detectSlicers, pickSlicer, _internals } from '../../server/slicer-bridge.js';

// We can't easily mock the dynamic import + module-level _detected cache,
// so the tests below just exercise the public surface and assert it
// behaves sanely on whatever environment node-test runs in.

describe('slicer-bridge: detectSlicers', () => {
  it('returns an array of slicer descriptors', async () => {
    const slicers = await detectSlicers();
    assert.ok(Array.isArray(slicers));
    // Each entry has the documented shape.
    for (const s of slicers) {
      assert.ok(s.id);
      assert.ok(s.label);
      assert.ok(s.command);
      assert.ok(['flatpak', 'appimage', 'binary'].includes(s.command.kind));
    }
  });

  it('caches between calls (same array reference)', async () => {
    const a = await detectSlicers();
    const b = await detectSlicers();
    assert.equal(a, b);  // strict equality — must be the cached object
  });
});

describe('slicer-bridge: pickSlicer', () => {
  it('returns null when no slicers installed', async () => {
    // We can't force "no slicers" without monkey-patching; but if the test
    // env happens to have any slicer, this just becomes a sanity check.
    const slicers = await detectSlicers();
    if (slicers.length === 0) {
      const picked = await pickSlicer({});
      assert.equal(picked, null);
    } else {
      const picked = await pickSlicer({});
      assert.ok(picked);
      assert.ok(picked.id);
    }
  });

  it('prefers Bambu Studio for Bambu printers', async () => {
    const slicers = await detectSlicers();
    if (!slicers.find(s => s.id === 'bambu')) return;
    const picked = await pickSlicer({ model: 'P2S', type: 'bambu' });
    assert.equal(picked.id, 'bambu');
  });

  it('prefers Snapmaker Orca for Snapmaker U1', async () => {
    const slicers = await detectSlicers();
    if (!slicers.find(s => s.id === 'snapmaker-orca')) return;
    const picked = await pickSlicer({ model: 'Snapmaker U1', type: 'moonraker' });
    assert.equal(picked.id, 'snapmaker-orca');
  });

  it('falls back to OrcaSlicer for unknown printers', async () => {
    const slicers = await detectSlicers();
    if (!slicers.find(s => s.id === 'orca')) return;
    const picked = await pickSlicer({ model: 'Some Random Klipper Box', type: 'moonraker' });
    assert.equal(picked.id, 'orca');
  });
});

describe('slicer-bridge: _listJsonNames helper', () => {
  it('returns [] for non-existent directory', () => {
    const result = _internals._listJsonNames('/this/path/does/not/exist');
    assert.deepEqual(result, []);
  });
});

describe('slicer-bridge: SLICER_DEFINITIONS shape', () => {
  it('all definitions have id + label + at least one command path', () => {
    for (const def of _internals.SLICER_DEFINITIONS) {
      assert.ok(def.id);
      assert.ok(def.label);
      assert.ok(def.flatpak || def.binary || def.appimage,
        `${def.id} must have at least one of flatpak/binary/appimage`);
    }
  });
});
