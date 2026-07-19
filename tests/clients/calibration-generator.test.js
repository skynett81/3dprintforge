// calibration-generator.test.js — verify each generator produces valid
// G-code with the expected structure and parameter validation works.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTempTower, generateRetractTower, generateFlowTest,
  generatePressureAdvanceTower, generatePressureAdvancePattern,
  generateFirstLayerTest, generateSingleLineTest,
  generate, listGenerators,
} from '../../server/calibration-generator.js';

describe('listGenerators()', () => {
  it('exposes all six generator types', () => {
    const types = listGenerators();
    assert.ok(types.includes('temp-tower'));
    assert.ok(types.includes('retract-tower'));
    assert.ok(types.includes('flow-test'));
    assert.ok(types.includes('pressure-advance'));
    assert.ok(types.includes('first-layer'));
    assert.ok(types.includes('single-line'));
  });
});

describe('generate() dispatcher', () => {
  it('dispatches to correct generator', () => {
    const out = generate('temp-tower', { hotendStart: 200, hotendEnd: 220, blocks: 4 });
    assert.equal(out.type, 'temp-tower');
  });

  it('rejects unknown type', () => {
    assert.throws(() => generate('rocket-launch', {}));
  });
});

describe('Temp Tower', () => {
  it('produces valid G-code with all blocks', () => {
    const out = generateTempTower({ hotendStart: 200, hotendEnd: 230, blocks: 4 });
    assert.ok(out.gcode.startsWith('; CALIBRATION:temp-tower'));
    assert.match(out.gcode, /M104 S200/);
    assert.match(out.gcode, /M104 S230/);
    assert.match(out.gcode, /; ===== BLOCK 1\/4/);
    assert.match(out.gcode, /; ===== BLOCK 4\/4/);
    assert.ok(out.expected_minutes > 0);
    assert.ok(out.filament_g > 0);
  });

  it('rejects out-of-range temps', () => {
    assert.throws(() => generateTempTower({ hotendStart: 100, hotendEnd: 200 })); // < 150
    assert.throws(() => generateTempTower({ hotendStart: 200, hotendEnd: 400 })); // > 320
    assert.throws(() => generateTempTower({ hotendStart: 220, hotendEnd: 200 })); // start > end
  });

  it('rejects bad block count', () => {
    assert.throws(() => generateTempTower({ blocks: 1 }));
    assert.throws(() => generateTempTower({ blocks: 20 }));
  });
});

describe('Retract Tower', () => {
  it('embeds retract value per block', () => {
    const out = generateRetractTower({ retractStart: 1, retractEnd: 5, blocks: 5 });
    assert.match(out.gcode, /retract=1mm/);
    assert.match(out.gcode, /retract=5mm/);
    assert.match(out.gcode, /; CALIBRATION:retract-tower/);
  });

  it('rejects bad retract range', () => {
    assert.throws(() => generateRetractTower({ retractStart: 5, retractEnd: 1 }));
    assert.throws(() => generateRetractTower({ retractStart: -1, retractEnd: 5 }));
  });
});

describe('Flow Test', () => {
  it('emits M221 at each block', () => {
    const out = generateFlowTest({ flowStart: 90, flowEnd: 110, blocks: 5 });
    assert.match(out.gcode, /M221 S90/);
    assert.match(out.gcode, /M221 S110/);
    assert.match(out.gcode, /M221 S100 ; reset flow/);
  });
});

describe('Pressure Advance', () => {
  it('uses TUNING_TOWER for Klipper', () => {
    const out = generatePressureAdvanceTower({ firmware: 'klipper' });
    assert.match(out.gcode, /TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE/);
  });

  it('uses M900 K for Marlin', () => {
    const out = generatePressureAdvanceTower({ firmware: 'marlin' });
    assert.match(out.gcode, /M900 K/);
  });

  it('rejects bad PA range', () => {
    assert.throws(() => generatePressureAdvanceTower({ paStart: 0, paEnd: 0 }));
    assert.throws(() => generatePressureAdvanceTower({ paStart: 0, paEnd: 5 }));
  });
});

describe('First Layer Test', () => {
  it('supports snake/square/concentric patterns', () => {
    for (const pattern of ['snake', 'square', 'concentric']) {
      const out = generateFirstLayerTest({ pattern });
      assert.match(out.gcode, /; CALIBRATION:first-layer/);
      assert.equal(out.type, 'first-layer');
    }
  });

  it('rejects unknown pattern', () => {
    assert.throws(() => generateFirstLayerTest({ pattern: 'spiral' }));
  });
});

describe('Single-line speed test', () => {
  it('emits one line per speed', () => {
    const out = generateSingleLineTest({ speedStart: 50, speedEnd: 200, lines: 5 });
    assert.match(out.gcode, /; LINE 1 speed=50mm\/s/);
    assert.match(out.gcode, /; LINE 5 speed=200mm\/s/);
  });
});

describe('generatePressureAdvancePattern (line method)', () => {
  it('is registered as a calibration type', () => {
    assert.ok(listGenerators().includes('pressure-advance-pattern'));
  });

  it('emits one Klipper SET_PRESSURE_ADVANCE per row with the right values', () => {
    const out = generatePressureAdvancePattern({ paStart: 0, paEnd: 0.08, paStep: 0.005, firmware: 'klipper' });
    const rows = out.pa_values;
    assert.equal(rows.length, 17); // 0..0.08 step 0.005 inclusive
    assert.equal(rows[0], 0);
    assert.equal(rows[rows.length - 1], 0.08);
    // each PA value appears in a SET_PRESSURE_ADVANCE command
    for (const pa of rows) {
      assert.ok(out.gcode.includes(`SET_PRESSURE_ADVANCE ADVANCE=${pa.toFixed(4)}`), `missing PA=${pa}`);
    }
    // resets PA at the end so the test doesn't leave a stray value active
    assert.match(out.gcode, /SET_PRESSURE_ADVANCE ADVANCE=0\.0000\n/);
    // attribution is present in the gcode header
    assert.match(out.gcode, /Sineos/);
    assert.match(out.gcode, /Ellis/);
  });

  it('uses Marlin M900 K when firmware=marlin', () => {
    const out = generatePressureAdvancePattern({ firmware: 'marlin', paStart: 0, paEnd: 0.04, paStep: 0.01 });
    assert.match(out.gcode, /M900 K0\.0100/);
    assert.equal(out.pa_values.length, 5);
    assert.ok(!out.gcode.includes('SET_PRESSURE_ADVANCE'));
  });

  it('produces a slow -> fast -> slow speed pattern per row', () => {
    const out = generatePressureAdvancePattern({ slowFeed: 1200, fastFeed: 6000, paStep: 0.02, paEnd: 0.04 });
    assert.match(out.gcode, /F1200/);
    assert.match(out.gcode, /F6000/);
  });

  it('rejects invalid ranges and feeds', () => {
    assert.throws(() => generatePressureAdvancePattern({ paStart: 0.1, paEnd: 0.05 }), /PA range/);
    assert.throws(() => generatePressureAdvancePattern({ paStep: 0 }), /paStep/);
    assert.throws(() => generatePressureAdvancePattern({ slowFeed: 6000, fastFeed: 1200 }), /fastFeed/);
    assert.throws(() => generatePressureAdvancePattern({ firmware: 'reprap' }), /firmware/);
  });

  it('every E move is finite (no NaN in extrusion)', () => {
    const out = generatePressureAdvancePattern({});
    const eMoves = out.gcode.match(/E-?\d+\.\d+/g) || [];
    assert.ok(eMoves.length > 0);
    for (const m of eMoves) assert.ok(Number.isFinite(parseFloat(m.slice(1))), `bad E: ${m}`);
  });
});

describe('Common output shape', () => {
  it('all generators emit gcode/name/description/expected_minutes/filament_g', () => {
    for (const type of listGenerators()) {
      const out = generate(type, {});
      assert.ok(out.gcode.length > 100, `${type} gcode should be substantial`);
      assert.ok(out.name);
      assert.ok(out.description);
      assert.ok(typeof out.expected_minutes === 'number');
      assert.ok(typeof out.filament_g === 'number');
      assert.equal(out.type, type);
      // All must home before moving
      assert.match(out.gcode, /G28/);
      // All must turn off heaters at end
      assert.match(out.gcode, /M104 S0/);
      assert.match(out.gcode, /M140 S0/);
    }
  });
});

import { generateMaxFlowrate } from '../../server/calibration-generator.js';
describe('calibration: max flowrate', () => {
  it('produces rising-flow lines with correct structure', () => {
    const r = generateMaxFlowrate({ flowStart: 5, flowEnd: 25, lines: 9 });
    assert.equal(r.type, 'max-flowrate');
    assert.equal((r.gcode.match(/; LINE \d+ flow=/g) || []).length, 9, 'one line per step');
    assert.match(r.gcode, /flow=5\.0mm3/);
    assert.match(r.gcode, /flow=25\.0mm3/);
    assert.match(r.gcode, /M104 S0/);
    assert.ok(!r.gcode.includes('NaN'));
  });
  it('validates the flow range', () => {
    assert.throws(() => generateMaxFlowrate({ flowStart: 25, flowEnd: 5 }));
    assert.throws(() => generateMaxFlowrate({ lines: 1 }));
  });
});
