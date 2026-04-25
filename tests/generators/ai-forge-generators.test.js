// ai-forge-generators.test.js — Tests for the generator registry +
// intent → real Model Forge generator dispatch.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  GENERATOR_REGISTRY, hasGenerator, listGenerators,
} from '../../server/ai-forge-generators.js';
import { parseIntent } from '../../server/text-intent-parser.js';

describe('ai-forge-generators: registry shape', () => {
  it('exposes 17+ entries with correct fields', () => {
    const keys = Object.keys(GENERATOR_REGISTRY);
    assert.ok(keys.length >= 17, `expected 17+, got ${keys.length}`);
    for (const [key, entry] of Object.entries(GENERATOR_REGISTRY)) {
      assert.equal(typeof entry.import, 'function', `${key}.import`);
      assert.equal(typeof entry.fn, 'string',     `${key}.fn`);
      assert.equal(typeof entry.format, 'string', `${key}.format`);
      assert.equal(typeof entry.mapParams, 'function', `${key}.mapParams`);
      assert.equal(typeof entry.description, 'string', `${key}.description`);
      assert.ok(Array.isArray(entry.examples) && entry.examples.length >= 1, `${key}.examples`);
    }
  });

  it('hasGenerator returns true for registered shapes', () => {
    assert.equal(hasGenerator('keychain'), true);
    assert.equal(hasGenerator('vase'), true);
    assert.equal(hasGenerator('gear'), true);
    assert.equal(hasGenerator('storage_box'), true);
    assert.equal(hasGenerator('plant_pot'), true);
    assert.equal(hasGenerator('phone_stand'), true);
    assert.equal(hasGenerator('hook'), true);
    assert.equal(hasGenerator('cable_clip'), true);
    assert.equal(hasGenerator('spring'), true);
    assert.equal(hasGenerator('hinge'), true);
    assert.equal(hasGenerator('battery_holder'), true);
    assert.equal(hasGenerator('headphone_stand'), true);
    assert.equal(hasGenerator('gridfinity_bin'), true);
    assert.equal(hasGenerator('gridfinity_baseplate'), true);
    assert.equal(hasGenerator('thread'), true);
    assert.equal(hasGenerator('cable_label'), true);
    assert.equal(hasGenerator('sign'), true);
  });

  it('hasGenerator returns false for primitives', () => {
    assert.equal(hasGenerator('cube'), false);
    assert.equal(hasGenerator('sphere'), false);
    assert.equal(hasGenerator('torus'), false);
  });

  it('listGenerators returns array form', () => {
    const list = listGenerators();
    assert.ok(Array.isArray(list));
    assert.ok(list.length >= 17);
    assert.ok(list.every(g => g.key && g.description && Array.isArray(g.examples)));
  });
});

describe('ai-forge-generators: parser → registry resolution', () => {
  it('parses "phone stand" as multi-word keyword', () => {
    const intent = parseIntent('phone stand 90x60');
    assert.equal(intent.shape, 'phone_stand');
    assert.equal(hasGenerator(intent.shape), true);
  });

  it('parses "storage box 60x40x30" with triple dims', () => {
    const intent = parseIntent('storage box 60x40x30');
    assert.equal(intent.shape, 'storage_box');
    assert.equal(intent.params.w, 60);
    assert.equal(intent.params.h, 40);
    assert.equal(intent.params.d, 30);
  });

  it('parses "gridfinity bin 2x3" with units', () => {
    const intent = parseIntent('gridfinity bin 2x3');
    assert.equal(intent.shape, 'gridfinity_bin');
    assert.equal(intent.params.unitsX, 2);
    assert.equal(intent.params.unitsY, 3);
  });

  it('parses "plant pot 80x60"', () => {
    const intent = parseIntent('plant pot 80x60');
    assert.equal(intent.shape, 'plant_pot');
    assert.equal(intent.params.w, 80);
    assert.equal(intent.params.h, 60);
  });

  it('parses "cable clip diameter=8"', () => {
    const intent = parseIntent('cable clip diameter=8');
    assert.equal(intent.shape, 'cable_clip');
    assert.equal(intent.params.diameter, 8);
  });

  it('parses "battery holder count=4"', () => {
    const intent = parseIntent('battery holder count=4');
    assert.equal(intent.shape, 'battery_holder');
    assert.equal(intent.params.count, 4);
  });

  it('mapParams produces sane keychain options', () => {
    const intent = parseIntent('keychain with text "SARA"');
    const opts = GENERATOR_REGISTRY.keychain.mapParams(intent);
    assert.equal(opts.text, 'SARA');
    assert.ok(opts.width > 0);
    assert.ok(opts.thickness > 0);
  });

  it('mapParams produces sane gridfinity_bin options', () => {
    const intent = parseIntent('gridfinity bin 2x3');
    const opts = GENERATOR_REGISTRY.gridfinity_bin.mapParams(intent);
    assert.equal(opts.unitsX, 2);
    assert.equal(opts.unitsY, 3);
  });
});
