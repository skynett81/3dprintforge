// calibration-generator.test.js — verify each generator produces valid
// G-code with the expected structure and parameter validation works.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTempTower, generateRetractTower, generateFlowTest,
  generatePressureAdvanceTower, generateFirstLayerTest, generateSingleLineTest,
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
