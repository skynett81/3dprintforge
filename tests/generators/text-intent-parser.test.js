// text-intent-parser.test.js — Unit tests for prompt parser

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseIntent } from '../../server/text-intent-parser.js';

describe('text-intent-parser: parseIntent', () => {
  it('parses a simple cube with default size', () => {
    const intent = parseIntent('cube');
    assert.equal(intent.shape, 'cube');
    assert.equal(intent.params.size, 20);
    assert.equal(intent.count, 1);
  });

  it('parses dimensional cube "cube 30mm"', () => {
    const intent = parseIntent('cube 30mm');
    assert.equal(intent.shape, 'cube');
    assert.equal(intent.params.size, 30);
  });

  it('parses triple dimensions "box 30x40x20"', () => {
    const intent = parseIntent('box 30x40x20');
    assert.equal(intent.shape, 'box');
    assert.equal(intent.params.w, 30);
    assert.equal(intent.params.h, 40);
    assert.equal(intent.params.d, 20);
  });

  it('parses sphere with radius keyword', () => {
    const intent = parseIntent('sphere r=15');
    assert.equal(intent.shape, 'sphere');
    assert.equal(intent.params.r, 15);
  });

  it('handles size presets like "small", "huge"', () => {
    assert.equal(parseIntent('small cube').params.size, 10);
    assert.equal(parseIntent('huge cube').params.size, 80);
  });

  it('parses count words', () => {
    assert.equal(parseIntent('two cubes').count, 2);
    assert.equal(parseIntent('three spheres').count, 3);
    assert.equal(parseIntent('5 cylinders').count, 5);
  });

  it('extracts quoted text for keychain', () => {
    const intent = parseIntent('keychain with text "Sara"');
    assert.equal(intent.shape, 'keychain');
    assert.equal(intent.text, 'Sara');
    assert.equal(intent.params.text, 'Sara');
  });

  it('detects modifiers', () => {
    const intent = parseIntent('hollow cylinder');
    assert.equal(intent.shape, 'cylinder');
    assert.equal(intent.modifiers.hollow, true);
  });

  it('falls back gracefully for unknown shapes', () => {
    const intent = parseIntent('a pretty dragon statue');
    assert.equal(intent.unknown, true);
    assert.equal(intent.shape, 'cube');
  });

  it('parses gear with teeth=20', () => {
    const intent = parseIntent('gear teeth=20 modulus=1');
    assert.equal(intent.shape, 'gear');
    assert.equal(intent.params.teeth, 20);
    assert.equal(intent.params.modulus, 1);
  });

  it('parses cm units → mm', () => {
    const intent = parseIntent('cube 5cm');
    assert.equal(intent.params.size, 50);
  });
});
