// printer-image-renderer.test.js — Verify the SVG generator picks the
// right chassis + brand colour for representative models from every
// supported vendor.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderPrinterSvg, _internals } from '../../server/printer-image-renderer.js';

const { _detectBrand, _detectChassis, _featureBadges } = _internals;

describe('printer-image-renderer: brand detection', () => {
  it('identifies Bambu from H2D / X1C / P2S / A1 mini', () => {
    assert.equal(_detectBrand('H2D Pro'), 'bambu');
    assert.equal(_detectBrand('X1C'), 'bambu');
    assert.equal(_detectBrand('P2S'), 'bambu');
    assert.equal(_detectBrand('A1 mini'), 'bambu');
  });

  it('identifies Prusa / Creality / Snapmaker / Voron', () => {
    assert.equal(_detectBrand('Prusa CORE One'), 'prusa');
    assert.equal(_detectBrand('Prusa MK4S'),     'prusa');
    assert.equal(_detectBrand('Creality K2 Plus'),'creality');
    assert.equal(_detectBrand('Snapmaker U1'),   'snapmaker');
    assert.equal(_detectBrand('Voron 2.4'),      'voron');
  });

  it('identifies new vendors (Sovol/FlashForge/BIQU/etc.)', () => {
    assert.equal(_detectBrand('Sovol SV08'),               'sovol');
    assert.equal(_detectBrand('FlashForge Adventurer 5M'), 'flashforge');
    assert.equal(_detectBrand('BIQU Hurakan'),             'biqu');
    assert.equal(_detectBrand('Two Trees SK-1'),           'twotrees');
    assert.equal(_detectBrand('Tronxy CRUX1'),             'tronxy');
    assert.equal(_detectBrand('Mingda Magician X2'),       'mingda');
    assert.equal(_detectBrand('Kywoo Tycoon'),             'kywoo');
    assert.equal(_detectBrand('Anycubic Kobra 3'),         'anycubic');
    assert.equal(_detectBrand('AnkerMake M5C'),            'ankermake');
    assert.equal(_detectBrand('QIDI X-Plus 4'),            'qidi');
  });

  it('falls back to generic for completely unknown models', () => {
    assert.equal(_detectBrand('SomeRandomGarageBuild 9000'), 'generic');
  });
});

describe('printer-image-renderer: chassis detection', () => {
  it('IDEX printers get corexy_idex', () => {
    assert.equal(_detectChassis('H2D Pro', { idex: true }),         'corexy_idex');
    assert.equal(_detectChassis('Snapmaker J1', { idex: true }),    'corexy_idex');
  });

  it('Vortek/H2C gets vortek chassis', () => {
    assert.equal(_detectChassis('H2C', { vortek: true }),           'vortek');
    assert.equal(_detectChassis('Bambu Lab H2C', {}),               'vortek');
  });

  it('Toolchanger printers get toolchanger', () => {
    assert.equal(_detectChassis('Snapmaker U1', {}),                'toolchanger');
    assert.equal(_detectChassis('Prusa XL', { toolheads: 5 }),      'toolchanger');
  });

  it('CoreXZ for Voron Switchwire', () => {
    assert.equal(_detectChassis('Voron Switchwire', { coreXZ: true }), 'corexz');
  });

  it('Enclosed printers get corexy', () => {
    assert.equal(_detectChassis('P1S',                  {}), 'corexy');
    assert.equal(_detectChassis('Creality K1C',         {}), 'corexy');
    assert.equal(_detectChassis('FlashForge Adventurer 5M', {}), 'corexy');
    assert.equal(_detectChassis('Prusa CORE One', { coreXY: true }), 'corexy');
  });

  it('Bedslinger for Ender, Sovol SV06, Mini', () => {
    assert.equal(_detectChassis('Creality Ender-3 V3 SE', {}), 'bedslinger');
    assert.equal(_detectChassis('Sovol SV06',             {}), 'bedslinger');
    assert.equal(_detectChassis('Prusa Mini',             {}), 'bedslinger');
  });
});

describe('printer-image-renderer: feature badges', () => {
  it('Bambu printers get AMS badge', () => {
    const badges = _featureBadges({}, 'bambu');
    assert.ok(badges.find(b => b.label === 'AMS'));
  });

  it('CFS printers get CFS badge', () => {
    const badges = _featureBadges({ cfs: true }, 'creality');
    assert.ok(badges.find(b => b.label === 'CFS'));
  });

  it('chamber + IDEX + AI flags surface', () => {
    const badges = _featureBadges({ chamber: true, idex: true, ai: true }, 'bambu');
    assert.ok(badges.find(b => b.label === 'CHM'));
    assert.ok(badges.find(b => b.label === 'IDEX'));
    assert.ok(badges.find(b => b.label === 'AI'));
  });

  it('caps to 4 badges to avoid clutter', () => {
    const badges = _featureBadges({
      ams: true, cfs: true, ifs: true, chamber: true, idex: true, hasLaser: true,
      ai: true, hardenedHotend: true, highTempBed: true, multiColor: true,
    }, 'bambu');
    assert.equal(badges.length, 4);
  });
});

describe('printer-image-renderer: renderPrinterSvg output', () => {
  it('returns valid SVG with viewBox + the model label', () => {
    const svg = renderPrinterSvg('Bambu Lab P1S', {});
    assert.match(svg, /^<svg /);
    assert.match(svg, /viewBox="0 0 250 220"/);
    assert.match(svg, /Bambu Lab P1S<\/text>/);
    assert.match(svg, /<\/svg>$/);
  });

  it('embeds buildVolume when capabilities include it', () => {
    const svg = renderPrinterSvg('H2D', { buildVolume: [325, 320, 325] });
    assert.match(svg, /325×320×325 mm/);
  });

  it('renders different chassis markup for IDEX vs bedslinger', () => {
    const idex   = renderPrinterSvg('H2D Pro', { features: { idex: true } });
    const slinger = renderPrinterSvg('Sovol SV06', {});
    // The two SVGs must differ — chassis renderer paths are distinct.
    assert.notEqual(idex, slinger);
    // IDEX renders TWO X-gantries (corexy_idex), bedslinger has none.
    const idexLines   = (idex.match(/<line /g) || []).length;
    const slingerLines = (slinger.match(/<line /g) || []).length;
    assert.notEqual(idexLines, slingerLines);
  });

  it('escapes HTML entities in model name', () => {
    const svg = renderPrinterSvg('My <evil> Printer & Co', {});
    assert.match(svg, /My &lt;evil&gt; Printer &amp; Co/);
  });
});
