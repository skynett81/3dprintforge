/**
 * Calibration G-code Generators — six tuning prints used to dial in
 * filament/material/printer combos.
 *
 * Each generator returns { gcode, name, description, expected_minutes,
 * filament_g } so the frontend can preview before sending to the printer.
 *
 * Generators are pure functions over numeric parameters (no I/O); the
 * actual writing/sending is done by the API layer.
 *
 * All generators emit Marlin-compatible G-code with a `; CALIBRATION:<type>`
 * header so the linter/print-tracker can recognise calibration runs and
 * skip waste-stat bookkeeping.
 */

const HEADER = (type, params) =>
  `; CALIBRATION:${type}\n` +
  `; Generator: 3DPrintForge v1.x\n` +
  `; Params: ${JSON.stringify(params)}\n` +
  `; Generated: ${new Date().toISOString()}\n`;

const PRELUDE = (bedTemp, hotendTemp) =>
  `M82 ; absolute extrusion\n` +
  `G21 ; mm\n` +
  `G90 ; absolute positioning\n` +
  `M140 S${bedTemp}\n` +
  `M104 S${hotendTemp}\n` +
  `G28 ; home all\n` +
  `M190 S${bedTemp} ; wait bed\n` +
  `M109 S${hotendTemp} ; wait hotend\n` +
  `G92 E0\n` +
  `G1 X10 Y10 Z0.3 F3000\n` +
  `G1 X100 Y10 Z0.3 E10 F1000 ; purge line\n` +
  `G92 E0\n`;

const POSTLUDE =
  `G91 ; relative\n` +
  `G1 E-2 F2400 ; retract\n` +
  `G1 Z10 F600\n` +
  `G90\n` +
  `G1 X0 Y200 F3000 ; park\n` +
  `M104 S0\n` +
  `M140 S0\n` +
  `M84 ; motors off\n` +
  `; CALIBRATION_END\n`;

// ── Helpers ────────────────────────────────────────────────────────────

function _inSegment(x1, y1, x2, y2, e, feed) {
  return `G1 X${x1.toFixed(2)} Y${y1.toFixed(2)} F${feed}\n` +
    `G1 X${x2.toFixed(2)} Y${y2.toFixed(2)} E${e.toFixed(4)} F${feed}\n`;
}

function _layerHeader(layer, z) {
  return `; LAYER:${layer}\n` +
    `G1 Z${z.toFixed(3)} F1200\n` +
    `G92 E0\n`;
}

function _validateRange(low, high, name, min, max) {
  if (!Number.isFinite(low) || !Number.isFinite(high) || low >= high) {
    throw new Error(`${name}: invalid low/high (${low}/${high})`);
  }
  if (low < min) throw new Error(`${name}: low ${low} < min ${min}`);
  if (high > max) throw new Error(`${name}: high ${high} > max ${max}`);
}

// ── Generators ─────────────────────────────────────────────────────────

/**
 * Temperature tower — extrudes 8 stacked blocks each at a different hotend
 * temperature so the user can identify the cleanest temperature.
 *
 * params: { bedTemp, hotendStart, hotendEnd, blocks, blockHeight, layerHeight, lineWidth, size, feed, retract }
 */
export function generateTempTower(params = {}) {
  const p = {
    bedTemp: 60,
    hotendStart: 200,
    hotendEnd: 230,
    blocks: 8,
    blockHeight: 5,
    layerHeight: 0.2,
    lineWidth: 0.45,
    size: 30,
    feed: 1500,
    retract: 1.5,
    ...params,
  };
  _validateRange(p.hotendStart, p.hotendEnd, 'hotendTemp', 150, 320);
  if (p.blocks < 2 || p.blocks > 12) throw new Error('blocks 2..12');

  const cx = 100, cy = 100;
  const half = p.size / 2;
  const layersPerBlock = Math.max(1, Math.round(p.blockHeight / p.layerHeight));
  const stepTemp = (p.hotendEnd - p.hotendStart) / (p.blocks - 1);

  // Filament cross-section approx (1.75mm filament).
  const xsec = (p.lineWidth * p.layerHeight) / (Math.PI * 0.875 * 0.875);
  const perimE = (2 * (p.size + p.size)) * xsec;

  let g = HEADER('temp-tower', p);
  g += PRELUDE(p.bedTemp, p.hotendStart);

  let z = 0;
  let layer = 0;
  for (let b = 0; b < p.blocks; b++) {
    const temp = Math.round(p.hotendStart + b * stepTemp);
    g += `; ===== BLOCK ${b + 1}/${p.blocks} @ ${temp}°C =====\n`;
    g += `M104 S${temp}\n`;
    if (b > 0) g += `M109 S${temp} ; wait for new temp\n`;

    for (let l = 0; l < layersPerBlock; l++) {
      z += p.layerHeight;
      g += _layerHeader(layer++, z);
      // Square outline
      g += `G1 X${cx - half} Y${cy - half} F${p.feed * 2}\n`;
      g += `G1 X${cx + half} E${perimE / 4} F${p.feed}\n`;
      g += `G1 Y${cy + half} E${perimE / 2}\n`;
      g += `G1 X${cx - half} E${(3 * perimE) / 4}\n`;
      g += `G1 Y${cy - half} E${perimE}\n`;
      g += `G92 E0\n`;
      // Retract before next layer travel
      g += `G1 E-${p.retract} F1800\n`;
    }
  }

  g += POSTLUDE;
  return {
    name: `Temp Tower ${p.hotendStart}-${p.hotendEnd}°C`,
    description: `${p.blocks} blocks, ${p.blockHeight}mm each, hotend stepped ${stepTemp.toFixed(1)}°C per block`,
    gcode: g,
    expected_minutes: Math.round((layersPerBlock * p.blocks * (4 * p.size) / p.feed) * 60 / 60 * 1.2),
    filament_g: +(perimE * p.blocks * layersPerBlock * 1.24).toFixed(1), // PLA-ish density
    type: 'temp-tower',
  };
}

/**
 * Retraction tower — same geometry as temp tower but retraction length
 * varies per block so the cleanest stringing/no-stringing point is visible.
 */
export function generateRetractTower(params = {}) {
  const p = {
    bedTemp: 60, hotendTemp: 215,
    retractStart: 0.5, retractEnd: 5,
    blocks: 6, blockHeight: 5, layerHeight: 0.2, lineWidth: 0.45,
    size: 30, feed: 1500, gapDistance: 60,
    ...params,
  };
  _validateRange(p.retractStart, p.retractEnd, 'retract', 0, 10);
  if (p.blocks < 2 || p.blocks > 12) throw new Error('blocks 2..12');

  const cx1 = 90, cx2 = cx1 + p.gapDistance, cy = 100;
  const half = p.size / 2;
  const layersPerBlock = Math.max(1, Math.round(p.blockHeight / p.layerHeight));
  const stepRetract = (p.retractEnd - p.retractStart) / (p.blocks - 1);
  const xsec = (p.lineWidth * p.layerHeight) / (Math.PI * 0.875 * 0.875);
  const perimE = (2 * (p.size + p.size)) * xsec;

  let g = HEADER('retract-tower', p);
  g += PRELUDE(p.bedTemp, p.hotendTemp);

  let z = 0, layer = 0;
  for (let b = 0; b < p.blocks; b++) {
    const r = +(p.retractStart + b * stepRetract).toFixed(2);
    g += `; ===== BLOCK ${b + 1}/${p.blocks} retract=${r}mm =====\n`;
    for (let l = 0; l < layersPerBlock; l++) {
      z += p.layerHeight;
      g += _layerHeader(layer++, z);
      // Two squares with travel between them — that travel is where
      // stringing happens, so retract length matters.
      for (const cx of [cx1, cx2]) {
        g += `G1 E-${r} F1800\n`;
        g += `G1 X${cx - half} Y${cy - half} F4500\n`;
        g += `G1 E${r} F1800\n`;
        g += `G92 E0\n`;
        g += `G1 X${cx + half} E${perimE / 4} F${p.feed}\n`;
        g += `G1 Y${cy + half} E${perimE / 2}\n`;
        g += `G1 X${cx - half} E${(3 * perimE) / 4}\n`;
        g += `G1 Y${cy - half} E${perimE}\n`;
        g += `G92 E0\n`;
      }
    }
  }
  g += POSTLUDE;
  return {
    name: `Retract Tower ${p.retractStart}-${p.retractEnd}mm`,
    description: `${p.blocks} blocks, ${stepRetract.toFixed(2)}mm retract per block`,
    gcode: g,
    expected_minutes: Math.round((layersPerBlock * p.blocks * (8 * p.size + 2 * p.gapDistance) / p.feed) * 60 / 60 * 1.2),
    filament_g: +(perimE * 2 * p.blocks * layersPerBlock * 1.24).toFixed(1),
    type: 'retract-tower',
  };
}

/**
 * Flow rate test — extrudes a hollow cube at varying flow multipliers so
 * the user can pick the multiplier that produces a perfectly-filled wall.
 * Walls are single-line so flow under/over-extrusion is obvious.
 */
export function generateFlowTest(params = {}) {
  const p = {
    bedTemp: 60, hotendTemp: 215,
    flowStart: 90, flowEnd: 110,
    blocks: 5, blockHeight: 8, layerHeight: 0.2, lineWidth: 0.45,
    size: 25, feed: 1200,
    ...params,
  };
  _validateRange(p.flowStart, p.flowEnd, 'flow%', 50, 150);

  const cx = 100, cy = 100, half = p.size / 2;
  const layersPerBlock = Math.max(1, Math.round(p.blockHeight / p.layerHeight));
  const stepFlow = (p.flowEnd - p.flowStart) / (p.blocks - 1);
  const xsec = (p.lineWidth * p.layerHeight) / (Math.PI * 0.875 * 0.875);
  const perimE = (2 * (p.size + p.size)) * xsec;

  let g = HEADER('flow-test', p);
  g += PRELUDE(p.bedTemp, p.hotendTemp);

  let z = 0, layer = 0;
  for (let b = 0; b < p.blocks; b++) {
    const flowPct = Math.round(p.flowStart + b * stepFlow);
    g += `; ===== BLOCK ${b + 1}/${p.blocks} flow=${flowPct}% =====\n`;
    g += `M221 S${flowPct}\n`;
    for (let l = 0; l < layersPerBlock; l++) {
      z += p.layerHeight;
      g += _layerHeader(layer++, z);
      g += `G1 X${cx - half} Y${cy - half} F4500\n`;
      g += `G1 X${cx + half} E${perimE / 4} F${p.feed}\n`;
      g += `G1 Y${cy + half} E${perimE / 2}\n`;
      g += `G1 X${cx - half} E${(3 * perimE) / 4}\n`;
      g += `G1 Y${cy - half} E${perimE}\n`;
      g += `G92 E0\n`;
    }
  }
  g += `M221 S100 ; reset flow\n`;
  g += POSTLUDE;
  return {
    name: `Flow Test ${p.flowStart}-${p.flowEnd}%`,
    description: `${p.blocks} blocks at ${stepFlow.toFixed(1)}% increments — measure wall thickness, pick block where wall = ${p.lineWidth}mm`,
    gcode: g,
    expected_minutes: Math.round((layersPerBlock * p.blocks * (4 * p.size) / p.feed) * 60 / 60 * 1.2),
    filament_g: +(perimE * p.blocks * layersPerBlock * 1.24 * (p.flowEnd / 100)).toFixed(1),
    type: 'flow-test',
  };
}

/**
 * Pressure Advance / Linear Advance tower — Klipper TUNING_TOWER style.
 * Prints a column where E-axis pressure-advance is ramped from start→end,
 * then a SET_PRESSURE_ADVANCE command picks the matching value.
 */
export function generatePressureAdvanceTower(params = {}) {
  const p = {
    bedTemp: 60, hotendTemp: 215,
    paStart: 0, paEnd: 0.1, paStep: 0.005,
    height: 50, layerHeight: 0.2, lineWidth: 0.45,
    size: 60, feed: 1500, firmware: 'klipper',
    ...params,
  };
  if (p.paStart < 0 || p.paEnd > 2 || p.paEnd <= p.paStart) {
    throw new Error('PA range: start ≥ 0, end ≤ 2, end > start');
  }
  if (!['klipper', 'marlin'].includes(p.firmware)) throw new Error('firmware: klipper|marlin');

  const cx = 100, cy = 100, half = p.size / 2;
  const layers = Math.round(p.height / p.layerHeight);
  const xsec = (p.lineWidth * p.layerHeight) / (Math.PI * 0.875 * 0.875);

  let g = HEADER('pressure-advance', p);
  g += PRELUDE(p.bedTemp, p.hotendTemp);

  if (p.firmware === 'klipper') {
    g += `; Klipper TUNING_TOWER will ramp pressure_advance during this print.\n`;
    g += `TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=${p.paStart} STEP_DELTA=${p.paStep} STEP_HEIGHT=${p.layerHeight}\n`;
  } else {
    g += `; Marlin Linear Advance K-tower\n`;
  }

  let z = 0;
  for (let l = 0; l < layers; l++) {
    z += p.layerHeight;
    g += _layerHeader(l, z);
    if (p.firmware === 'marlin') {
      const k = +(p.paStart + l * p.paStep).toFixed(4);
      g += `M900 K${k} ; set linear advance\n`;
    }
    // Snake-print pattern at varying speeds within the line so artifacts show up
    g += `G1 X${cx - half} Y${cy - (l % 2 === 0 ? half : -half)} F4500\n`;
    g += `G1 X${cx + half} E${(2 * p.size) * xsec} F${p.feed}\n`;
    g += `G92 E0\n`;
  }
  if (p.firmware === 'klipper') g += `RESTORE_GCODE_STATE NAME=tuning_tower\n`;
  g += POSTLUDE;
  return {
    name: `Pressure Advance Tower (${p.firmware})`,
    description: `Ramp ${p.paStart} → ${p.paEnd} in ${p.paStep} steps over ${p.height}mm. Measure where corner artifacts disappear.`,
    gcode: g,
    expected_minutes: Math.round((layers * (2 * p.size) / p.feed) * 60 / 60 * 1.2),
    filament_g: +(layers * (2 * p.size) * xsec * 1.24).toFixed(1),
    type: 'pressure-advance',
  };
}

/**
 * First-layer test — a single-layer pattern (square, snake, or concentric
 * circles) used to verify bed level and Z-offset.
 */
export function generateFirstLayerTest(params = {}) {
  const p = {
    bedTemp: 60, hotendTemp: 215,
    pattern: 'snake', layerHeight: 0.2, lineWidth: 0.45,
    width: 200, height: 200, feed: 1500,
    ...params,
  };
  if (!['snake', 'square', 'concentric'].includes(p.pattern)) {
    throw new Error('pattern: snake|square|concentric');
  }

  const xsec = (p.lineWidth * p.layerHeight) / (Math.PI * 0.875 * 0.875);

  let g = HEADER('first-layer', p);
  g += PRELUDE(p.bedTemp, p.hotendTemp);
  g += _layerHeader(0, p.layerHeight);

  if (p.pattern === 'snake') {
    const rows = Math.floor(p.height / (p.lineWidth * 1.05));
    const x0 = (250 - p.width) / 2;
    const y0 = (250 - p.height) / 2;
    let totalE = 0;
    for (let r = 0; r < rows; r++) {
      const y = y0 + r * p.lineWidth * 1.05;
      const xs = r % 2 === 0 ? x0 : x0 + p.width;
      const xe = r % 2 === 0 ? x0 + p.width : x0;
      totalE += p.width * xsec;
      g += `G1 X${xs.toFixed(2)} Y${y.toFixed(2)} F4500\n`;
      g += `G1 X${xe.toFixed(2)} E${totalE.toFixed(4)} F${p.feed}\n`;
    }
  } else if (p.pattern === 'square') {
    const cx = 125, cy = 125, half = Math.min(p.width, p.height) / 2;
    const perim = 4 * 2 * half;
    g += `G1 X${cx - half} Y${cy - half} F4500\n`;
    let e = 0;
    e += 2 * half * xsec; g += `G1 X${cx + half} E${e.toFixed(4)} F${p.feed}\n`;
    e += 2 * half * xsec; g += `G1 Y${cy + half} E${e.toFixed(4)}\n`;
    e += 2 * half * xsec; g += `G1 X${cx - half} E${e.toFixed(4)}\n`;
    e += 2 * half * xsec; g += `G1 Y${cy - half} E${e.toFixed(4)}\n`;
  } else {
    // Concentric circles
    const cx = 125, cy = 125;
    const ringCount = Math.floor(Math.min(p.width, p.height) / (2 * p.lineWidth * 1.05));
    let e = 0;
    for (let i = 1; i <= ringCount; i++) {
      const r = i * p.lineWidth * 1.05;
      const segments = Math.max(36, Math.round(2 * Math.PI * r / 2));
      for (let s = 0; s <= segments; s++) {
        const a = (s / segments) * 2 * Math.PI;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (s === 0) {
          g += `G1 X${x.toFixed(2)} Y${y.toFixed(2)} F4500\n`;
        } else {
          e += (2 * Math.PI * r / segments) * xsec;
          g += `G1 X${x.toFixed(2)} Y${y.toFixed(2)} E${e.toFixed(4)} F${p.feed}\n`;
        }
      }
    }
  }

  g += POSTLUDE;
  return {
    name: `First Layer ${p.pattern}`,
    description: `${p.pattern} pattern at Z=${p.layerHeight}mm covering ${p.width}×${p.height}mm`,
    gcode: g,
    expected_minutes: Math.round((p.width * p.height) / (p.feed * 60) * 60 * 0.7),
    filament_g: +((p.width * p.height) / (p.lineWidth * 1.05) * xsec * 1.24).toFixed(1),
    type: 'first-layer',
  };
}

/**
 * Single-line test — extrudes a single straight line at varying speeds
 * so the user can find their printer's max volumetric flow rate.
 */
export function generateSingleLineTest(params = {}) {
  const p = {
    bedTemp: 60, hotendTemp: 215,
    speedStart: 30, speedEnd: 200,
    lines: 8, lineWidth: 0.45, layerHeight: 0.2, length: 80,
    ...params,
  };
  _validateRange(p.speedStart, p.speedEnd, 'speed', 5, 500);
  if (p.lines < 2 || p.lines > 20) throw new Error('lines 2..20');

  const xsec = (p.lineWidth * p.layerHeight) / (Math.PI * 0.875 * 0.875);
  const stepSpeed = (p.speedEnd - p.speedStart) / (p.lines - 1);

  let g = HEADER('single-line', p);
  g += PRELUDE(p.bedTemp, p.hotendTemp);
  g += `G1 Z${p.layerHeight.toFixed(3)} F1200\n`;

  for (let i = 0; i < p.lines; i++) {
    const speed = Math.round(p.speedStart + i * stepSpeed);
    const y = 50 + i * 10;
    g += `; LINE ${i + 1} speed=${speed}mm/s\n`;
    g += `G92 E0\n`;
    g += `G1 X20 Y${y} F4500\n`;
    g += `G1 X${20 + p.length} Y${y} E${(p.length * xsec).toFixed(4)} F${speed * 60}\n`;
    g += `G1 E-1 F1800\n`;
  }

  g += POSTLUDE;
  return {
    name: `Single-Line Speed Test ${p.speedStart}-${p.speedEnd}mm/s`,
    description: `${p.lines} lines, ${stepSpeed.toFixed(0)}mm/s steps. Find the line where extrusion stays consistent.`,
    gcode: g,
    expected_minutes: Math.round((p.lines * p.length / 60) / 60 * 60),
    filament_g: +(p.lines * p.length * xsec * 1.24).toFixed(1),
    type: 'single-line',
  };
}

// ── Dispatch ────────────────────────────────────────────────────────────

const GENERATORS = {
  'temp-tower': generateTempTower,
  'retract-tower': generateRetractTower,
  'flow-test': generateFlowTest,
  'pressure-advance': generatePressureAdvanceTower,
  'first-layer': generateFirstLayerTest,
  'single-line': generateSingleLineTest,
};

export function listGenerators() {
  return Object.keys(GENERATORS);
}

export function generate(type, params) {
  const fn = GENERATORS[type];
  if (!fn) throw new Error(`unknown calibration type: ${type}`);
  return fn(params);
}

export const _internals = { HEADER, PRELUDE, POSTLUDE, GENERATORS };
