// ai-forge.test.js — Unit tests for the AI Forge dispatcher

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseIntent } from '../../server/text-intent-parser.js';
import { buildMeshFromIntent, sketchToMesh } from '../../server/ai-forge.js';

describe('ai-forge: buildMeshFromIntent', () => {
  it('builds a cube mesh for "cube 20mm"', () => {
    const intent = parseIntent('cube 20mm');
    const mesh = buildMeshFromIntent(intent);
    assert.equal(mesh.positions.length / 3, 8);
    assert.equal(mesh.indices.length / 3, 12);
  });

  it('builds a sphere mesh', () => {
    const intent = parseIntent('sphere r=12');
    const mesh = buildMeshFromIntent(intent);
    assert.ok(mesh.positions.length / 3 > 50);
  });

  it('builds two copies for "two cubes"', () => {
    const intent = parseIntent('two cubes');
    const mesh = buildMeshFromIntent(intent);
    // Two boxes = 16 vertices.
    assert.equal(mesh.positions.length / 3, 16);
    assert.equal(mesh.indices.length / 3, 24);
  });

  it('falls back to cube for unknown shape', () => {
    const intent = parseIntent('a magical unicorn');
    const mesh = buildMeshFromIntent(intent);
    assert.equal(mesh.positions.length / 3, 8);
  });

  it('builds keychain composite', () => {
    const intent = parseIntent('keychain with text "TAG"');
    const mesh = buildMeshFromIntent(intent);
    // Plate + ring → more vertices than a single box (8).
    assert.ok(mesh.positions.length / 3 > 8);
  });
});

describe('ai-forge: sketchToMesh', () => {
  it('extrudes a triangle SVG path', () => {
    const mesh = sketchToMesh('M 0 0 L 10 0 L 5 10 Z', { depth: 5, scale: 1 });
    // 2 centroids + 2 * 3 = 8 vertices, 12 triangles
    assert.equal(mesh.positions.length / 3, 8);
    assert.equal(mesh.indices.length / 3, 12);
  });

  it('throws on too-few points', () => {
    assert.throws(() => sketchToMesh('M 0 0', { depth: 1 }));
  });

  it('handles relative move/line commands', () => {
    const mesh = sketchToMesh('M 0 0 l 10 0 l 0 10 Z', { depth: 1, scale: 1 });
    assert.ok(mesh.positions.length / 3 >= 8);
  });
});
