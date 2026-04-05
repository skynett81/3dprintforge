// mesh-builder.test.js — Unit tests for MeshBuilder primitives

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// MeshBuilder needs lib3mf — mock the lib interface
function createMockLib() {
  const vertices = [];
  const triangles = [];

  class MockPosition {
    set_Coordinates0(v) { this._x = v; }
    set_Coordinates1(v) { this._y = v; }
    set_Coordinates2(v) { this._z = v; }
    delete() {}
  }

  class MockTriangle {
    set_Indices0(v) { this._a = v; }
    set_Indices1(v) { this._b = v; }
    set_Indices2(v) { this._c = v; }
    delete() {}
  }

  const mockMesh = {
    AddVertex(pos) { vertices.push({ x: pos._x, y: pos._y, z: pos._z }); },
    AddTriangle(tri) { triangles.push({ a: tri._a, b: tri._b, c: tri._c }); },
  };

  return {
    lib: { sPosition: MockPosition, sTriangle: MockTriangle },
    mesh: mockMesh,
    vertices,
    triangles,
    reset() { vertices.length = 0; triangles.length = 0; },
  };
}

let MeshBuilder;

before(async () => {
  const mod = await import('../../server/mesh-builder.js');
  MeshBuilder = mod.MeshBuilder;
});

describe('MeshBuilder', () => {

  describe('addBox', () => {
    it('creates 8 vertices and 12 triangles', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      mb.addBox(0, 0, 0, 10, 20, 5);

      assert.equal(mock.vertices.length, 8, 'box should have 8 vertices');
      assert.equal(mock.triangles.length, 12, 'box should have 12 triangles (6 faces × 2)');
    });

    it('positions corners correctly', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      mb.addBox(5, 10, 2, 3, 4, 6);

      const xs = mock.vertices.map(v => v.x);
      const ys = mock.vertices.map(v => v.y);
      const zs = mock.vertices.map(v => v.z);

      assert.ok(xs.includes(5), 'should have x=5');
      assert.ok(xs.includes(8), 'should have x=8 (5+3)');
      assert.ok(ys.includes(10), 'should have y=10');
      assert.ok(ys.includes(14), 'should have y=14 (10+4)');
      assert.ok(zs.includes(2), 'should have z=2');
      assert.ok(zs.includes(8), 'should have z=8 (2+6)');
    });

    it('increments vertex offset for multiple boxes', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      mb.addBox(0, 0, 0, 1, 1, 1);
      mb.addBox(5, 0, 0, 1, 1, 1);

      assert.equal(mock.vertices.length, 16, 'two boxes = 16 vertices');
      assert.equal(mock.triangles.length, 24, 'two boxes = 24 triangles');
      assert.equal(mb.vOff, 16);

      // Second box triangles should reference indices 8-15
      const secondBoxTris = mock.triangles.slice(12);
      for (const t of secondBoxTris) {
        assert.ok(t.a >= 8 && t.a < 16, `triangle index ${t.a} should be >= 8`);
        assert.ok(t.b >= 8 && t.b < 16, `triangle index ${t.b} should be >= 8`);
        assert.ok(t.c >= 8 && t.c < 16, `triangle index ${t.c} should be >= 8`);
      }
    });
  });

  describe('addCylinder', () => {
    it('creates correct vertex and triangle counts', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      const segs = 12;
      mb.addCylinder(0, 0, 0, 5, 10, segs);

      // 2 center vertices + segs * 2 ring vertices
      assert.equal(mock.vertices.length, 2 + segs * 2);
      // segs bottom fan + segs top fan + segs * 2 side quads
      assert.equal(mock.triangles.length, segs * 4);
    });

    it('places center vertices at correct Z', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      mb.addCylinder(5, 10, 3, 4, 7, 8);

      assert.equal(mock.vertices[0].z, 3, 'bottom center z');
      assert.equal(mock.vertices[1].z, 10, 'top center z = 3+7');
      assert.equal(mock.vertices[0].x, 5, 'center x');
      assert.equal(mock.vertices[0].y, 10, 'center y');
    });
  });

  describe('addPlane', () => {
    it('creates 4 vertices and 2 triangles', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      mb.addPlane(0, 0, 0, 10, 20);

      assert.equal(mock.vertices.length, 4);
      assert.equal(mock.triangles.length, 2);
    });
  });

  describe('addTube', () => {
    it('creates correct counts for hollow cylinder', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      const segs = 8;
      mb.addTube(0, 0, 0, 10, 5, 20, segs);

      // 4 vertices per segment (outer bottom/top, inner bottom/top)
      assert.equal(mock.vertices.length, segs * 4);
      // 4 quads per segment (outer, inner, bottom ring, top ring) × 2 tris each
      assert.equal(mock.triangles.length, segs * 8);
    });
  });

  describe('addHeightmapSurface', () => {
    it('creates correct mesh from 2x2 grid', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      const grid = [[0.5, 1.0], [0.0, 0.5]];
      mb.addHeightmapSurface(0, 0, 0, grid, 10, 1, 5);

      const rows = 2, cols = 2;
      const stride = cols + 1; // 3
      // Top surface: (cols+1) × (rows+1) = 9 vertices
      // Bottom surface: 9 vertices
      assert.equal(mock.vertices.length, stride * (rows + 1) * 2);

      // Top quads: rows × cols × 2 = 8
      // Bottom quads: 8
      // Side walls: 4 edges × cols or rows segments × 2 tris each
      const topTris = rows * cols * 2;
      const botTris = rows * cols * 2;
      const sideTris = (cols * 2 + cols * 2 + rows * 2 + rows * 2);
      assert.equal(mock.triangles.length, topTris + botTris + sideTris);
    });

    it('top surface vertices have height based on grid values', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);
      const grid = [[1.0]]; // single cell, max height
      mb.addHeightmapSurface(0, 0, 0, grid, 10, 2, 5);

      // Top vertices (first 4) should have z = baseThickness + height * maxHeight
      // Corner (0,0) averages the single cell: h=1.0
      // z = 2 + 1.0 * 5 = 7
      const topVerts = mock.vertices.slice(0, 4);
      for (const v of topVerts) {
        assert.ok(v.z >= 2, `top vertex z ${v.z} should be >= base thickness 2`);
      }

      // Bottom vertices (last 4) should all be at z=0
      const botVerts = mock.vertices.slice(4, 8);
      for (const v of botVerts) {
        assert.equal(v.z, 0, 'bottom vertex should be at z=0');
      }
    });
  });

  describe('_addVertex and _addTri', () => {
    it('tracks vertex offset correctly', () => {
      const mock = createMockLib();
      const mb = new MeshBuilder(mock.lib, mock.mesh);

      const idx0 = mb._addVertex(1, 2, 3);
      const idx1 = mb._addVertex(4, 5, 6);

      assert.equal(idx0, 0);
      assert.equal(idx1, 1);
      assert.equal(mb.vOff, 2);
    });
  });
});
