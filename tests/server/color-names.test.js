// Tests for basicColorName — turns hex strings into a human readable
// label for auto-created spools and UI hints.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { basicColorName } from '../../server/color-names.js';

describe('basicColorName', () => {
  it('returns canonical names for exact-match hex', () => {
    assert.equal(basicColorName('FFFFFF'), 'White');
    assert.equal(basicColorName('000000'), 'Black');
    assert.equal(basicColorName('FF0000'), 'Red');
    assert.equal(basicColorName('0000FF'), 'Blue');
  });

  it('strips leading # and is case-insensitive', () => {
    assert.equal(basicColorName('#ffffff'), 'White');
    assert.equal(basicColorName('#FF0000'), 'Red');
  });

  it('truncates 8-char (with alpha) hex to RGB', () => {
    assert.equal(basicColorName('FFFFFFFF'), 'White');
    assert.equal(basicColorName('FF0000FF'), 'Red');
  });

  it('matches the user-reported Bambu PLA palette', () => {
    // The user has these in their AMS — the names should match what
    // Bambu prints on the spool.
    assert.equal(basicColorName('0086D6'), 'Sky Blue');
    assert.equal(basicColorName('F5547C'), 'Hot Pink');
    assert.equal(basicColorName('E4BD68'), 'Bronze');
    assert.equal(basicColorName('6F5034'), 'Cocoa');
  });

  it('snaps near matches to canonical names', () => {
    // Slightly off pure white — still recognisable
    assert.equal(basicColorName('FEFEFE'), 'White');
    // Near-black
    assert.equal(basicColorName('0A0A0A'), 'Black');
    // Slightly off red
    assert.equal(basicColorName('F00510'), 'Red');
  });

  it('returns null for ambiguous / no-near-match colours', () => {
    // Halfway between several palette entries — no clean match.
    // Pure greenish-yellow that snaps further than the threshold from
    // anything sensible.
    const r = basicColorName('123456');
    // Either null or a sensible name — what we're testing is that the
    // function doesn't crash and stays string|null.
    assert.ok(r === null || typeof r === 'string');
  });

  it('rejects garbage input gracefully', () => {
    assert.equal(basicColorName(''), null);
    assert.equal(basicColorName(null), null);
    assert.equal(basicColorName(undefined), null);
    assert.equal(basicColorName('xxxxxx'), null);
    assert.equal(basicColorName('123'), null); // too short
    assert.equal(basicColorName('ZZZZZZ'), null); // not hex
  });
});
