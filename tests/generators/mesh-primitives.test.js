// mesh-primitives.test.js — Unit tests for indexed-mesh primitives

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  box, sphere, cylinder, cone, torus, prism, pyramid,
  extrudePolygon, heightmapToMesh, unionMeshes, offset,
} from '../../server/mesh-primitives.js';

describe('mesh-primitives: box', () => {
  it('produces 8 vertices and 12 faces', () => {
    const m = box(10, 10, 10);
    assert.equal(m.positions.length / 3, 8);
    assert.equal(m.indices.length / 3, 12);
  });
  it('respects custom dimensions', () => {
    const m = box(5, 7, 9);
    assert.equal(m.positions[0], 0);
    assert.equal(m.positions[3], 5);
    assert.equal(m.positions[7], 7);
    assert.equal(m.positions[14], 9);
  });
});

describe('mesh-primitives: sphere', () => {
  it('produces a closed mesh with at least 12 faces', () => {
    const m = sphere(10, 12, 8);
    assert.ok(m.positions.length / 3 > 12);
    assert.ok(m.indices.length / 3 > 24);
  });
});

describe('mesh-primitives: cylinder', () => {
  it('contains base and top centres', () => {
    const m = cylinder(5, 10, 16);
    assert.equal(m.positions.length / 3, 2 + 2 * 16);
    // Centres present at vertex 0 and 1
    assert.equal(m.positions[2], 0);
    assert.equal(m.positions[5], 10);
  });
});

describe('mesh-primitives: cone', () => {
  it('produces solid pointy shape with r2=0', () => {
    const m = cone(10, 0, 20, 16);
    assert.equal(m.positions.length / 3, 2 + 2 * 16);
    // Top "ring" should all be (0,0,20) when r2=0
    assert.equal(m.positions[5], 20);
  });
});

describe('mesh-primitives: torus', () => {
  it('returns watertight mesh with consistent vertex count', () => {
    const m = torus(20, 5, 16, 8);
    assert.equal(m.positions.length / 3, 16 * 8);
    assert.equal(m.indices.length / 3, 16 * 8 * 2);
  });
});

describe('mesh-primitives: prism', () => {
  it('builds a hex prism with 6 sides', () => {
    const m = prism(6, 10, 20);
    assert.equal(m.positions.length / 3, 2 + 2 * 6);
  });
});

describe('mesh-primitives: pyramid', () => {
  it('has 5 vertices and 6 faces (4 sides + 2 base tris)', () => {
    const m = pyramid(20, 30);
    assert.equal(m.positions.length / 3, 5);
    assert.equal(m.indices.length / 3, 6);
  });
});

describe('mesh-primitives: extrudePolygon', () => {
  it('extrudes a triangle into a 5-vertex prism cap', () => {
    const m = extrudePolygon([[0, 0], [10, 0], [5, 10]], 5);
    // 2 centroids + 2 * 3 ring vertices = 8 vertices
    assert.equal(m.positions.length / 3, 8);
    // 3 sides * 2 triangles + 3 bottom + 3 top = 12 triangles
    assert.equal(m.indices.length / 3, 12);
  });
  it('throws when fewer than 3 points', () => {
    assert.throws(() => extrudePolygon([[0, 0], [1, 0]], 1));
  });
});

describe('mesh-primitives: heightmapToMesh', () => {
  it('builds a watertight mesh from a 2x2 grid', () => {
    const grid = [[0, 1], [1, 0]];
    const m = heightmapToMesh(grid, 1, 1);
    // 2*2 top + 2*2 bottom = 8 vertices
    assert.equal(m.positions.length / 3, 8);
    // top + bottom + 4 walls of 1 quad each = 12 triangles
    assert.equal(m.indices.length / 3, 12);
  });
  it('throws on invalid grid', () => {
    assert.throws(() => heightmapToMesh(null));
    assert.throws(() => heightmapToMesh([]));
  });
});

describe('mesh-primitives: union & offset', () => {
  it('unions two boxes into combined mesh', () => {
    const a = box(10, 10, 10);
    const b = offset(box(10, 10, 10), 20, 0, 0);
    const u = unionMeshes([a, b]);
    assert.equal(u.positions.length, a.positions.length + b.positions.length);
    assert.equal(u.indices.length, a.indices.length + b.indices.length);
    // Index space must be remapped: max index in result < total vertex count
    let maxIdx = 0;
    for (const i of u.indices) if (i > maxIdx) maxIdx = i;
    assert.ok(maxIdx < u.positions.length / 3);
  });

  it('offset translates positions', () => {
    const m = offset(box(10, 10, 10), 5, 0, 0);
    assert.equal(m.positions[0], 5);
  });
});
