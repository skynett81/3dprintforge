// scene-builder-groups.test.js — group transforms + 'group' type

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { validateScene, buildSceneAsync } from '../../server/scene-builder.js';

describe('scene-builder: group type', () => {
  it('validateScene accepts group-type shape with empty params', () => {
    assert.doesNotThrow(() => validateScene({
      shapes: [
        { id: 'g1', type: 'group', params: {}, transform: {} },
        { id: 's1', type: 'box', params: { w: 10, h: 10, d: 10 }, groupId: 'g1' },
      ],
    }));
  });

  it('group shape skipped from build but children still rendered', async () => {
    const scene = {
      shapes: [
        { id: 'g1', type: 'group', params: {}, transform: { px: 0 } },
        { id: 's1', type: 'box', params: { w: 10, h: 10, d: 10 }, transform: {}, groupId: 'g1' },
      ],
    };
    const mesh = await buildSceneAsync(scene, { useCsg: false });
    // Only the box contributes — 8 vertices, 12 faces.
    assert.equal(mesh.positions.length / 3, 8);
    assert.equal(mesh.indices.length / 3, 12);
  });

  it('child inherits parent group translation', async () => {
    const scene = {
      shapes: [
        { id: 'g1', type: 'group', params: {}, transform: { px: 100 } },
        { id: 's1', type: 'box', params: { w: 10, h: 10, d: 10 }, transform: {}, groupId: 'g1' },
      ],
    };
    const mesh = await buildSceneAsync(scene, { useCsg: false });
    // Box vertex 0 starts at (0,0,0); translated +100 by group → (100,0,0).
    assert.equal(mesh.positions[0], 100);
  });

  it('child transform composes with parent (parent translate + child translate)', async () => {
    const scene = {
      shapes: [
        { id: 'g1', type: 'group', params: {}, transform: { px: 50 } },
        { id: 's1', type: 'box', params: { w: 10, h: 10, d: 10 }, transform: { px: 20 }, groupId: 'g1' },
      ],
    };
    const mesh = await buildSceneAsync(scene, { useCsg: false });
    // Box vertex 0: 0 (origin) + 20 (child) + 50 (parent) = 70.
    assert.equal(mesh.positions[0], 70);
  });

  it('parent scale applies to child position', async () => {
    const scene = {
      shapes: [
        { id: 'g1', type: 'group', params: {}, transform: { sx: 2, sy: 2, sz: 2 } },
        { id: 's1', type: 'box', params: { w: 5, h: 5, d: 5 }, transform: { px: 10 }, groupId: 'g1' },
      ],
    };
    const mesh = await buildSceneAsync(scene, { useCsg: false });
    // Box origin: 0 (vertex) + 10 (child px) * 2 (parent scale) = 20.
    // Plus the box itself is scaled by 2 → vertex 1 at (5+10)*2 = 30 in world space.
    assert.equal(mesh.positions[0], 20);
  });

  it('rejects missing generatorKey on generator-type', () => {
    assert.throws(() => validateScene({
      shapes: [{ type: 'generator', params: {} }],
    }));
  });
});
