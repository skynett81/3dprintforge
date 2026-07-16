/**
 * Native Slicer Engine — pure-JS mesh-to-G-code slicing pipeline.
 *
 * This is the project's own slicer (not a wrapper around any external
 * binary). Geometry lives in native-slicer-geo.js; this file drives the
 * pipeline and emits G-code.
 *
 * Features:
 *   - Multiple perimeters (walls), hole-aware (walls on both sides of a
 *     pocket, infill excluded from holes via even-odd scanline).
 *   - Solid top/bottom shells (configurable layer counts) with a
 *     cross-hatch grid; sparse infill (lines or grid) in between.
 *   - Skirt (adhesion priming loops) and brim (loops fused to the part).
 *   - Profile-driven start/end G-code (machine_start_gcode /
 *     machine_end_gcode) with a Marlin/Klipper-compatible default.
 *   - Trapezoidal-free but reasonable extrusion model (rectangular path
 *     cross-section) and per-feature speeds.
 *
 * It is honest about its limits: no tree/organic supports, no Arachne
 * variable-width walls, no bridging detection, no multi-material purge.
 * For those, a full desktop slicer is still king. For simple-to-medium
 * parts this produces clean, printable G-code entirely within our stack.
 */

import {
  sliceLayer, offsetPolygon, offsetPolygonAll, lineInfill, regionInfill, solidInfill, simplifyPolygon, bestBridgeAngle,
  patternInfill, buildRegions, fuzzifyPolygon, EPS, PI, _bbox, _isCCW, _signedArea, _near,
  _chainSegments, _pointInPoly, routeInside, combWaypoints, buildCombGraph, topBottomFaceRegions,
} from './native-slicer-geo.js';
import { buildSurfaceClassifier } from './native-slicer-surfaces.js';
import { buildSolidRegions } from './native-slicer-regions.js';
import { clipDifference as _clipDifference, clipExpand as _clipExpand } from './native-slicer-bool.js';
import { medialBeads, arachneBeads } from './native-slicer-arachne.js';
import { fitArcs } from './native-slicer-arc.js';
import { insertProgressM73 } from './native-slicer-progress.js';

const FILAMENT_DIAM = 1.75;

// Our internal feature keys -> BambuStudio's exact G-code "; FEATURE: <name>"
// vocabulary (BambuStudio GCode.cpp / ExtrusionRole). Emitting these verbatim
// makes our G-code colour-classify identically in BambuStudio's own previewer,
// generic viewers, and our GcodePreview — so the sliced model looks the same.
const BAMBU_FEATURE = {
  'outer-wall': 'Outer wall',
  'inner-wall': 'Inner wall',
  'overhang-wall': 'Overhang wall',
  wall: 'Inner wall',
  sparse: 'Sparse infill',
  solid: 'Internal solid infill',
  'top-surface': 'Top surface',
  'bottom-surface': 'Bottom surface',
  bridge: 'Bridge',
  ironing: 'Ironing',
  gap: 'Gap infill',
  skirt: 'Skirt',
  brim: 'Brim',
  support: 'Support',
  'support-interface': 'Support interface',
  wipe_tower: 'Prime tower',
};
const featureLabel = (f) => BAMBU_FEATURE[f] ?? 'Custom';

// Re-export the geometry primitives so existing importers/tests keep working.
export { sliceLayer, offsetPolygon, lineInfill, regionInfill, solidInfill, buildRegions };

// Shortest distance from a point to any edge of a region (outer + holes). Used
// by the Arachne-style variable-width gap fill to gauge local feature width.
function _distToRegionEdge(px, py, region) {
  let min = Infinity;
  const test = (loop) => {
    for (let i = 0; i < loop.length; i++) {
      const a = loop[i], b = loop[(i + 1) % loop.length];
      const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
      let t = L2 > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
      if (d < min) min = d;
    }
  };
  test(region.outer);
  for (const h of region.holes || []) test(h);
  return min;
}

/** A CCW/CW-agnostic circle polygon (closed ring of [x,y]). */
function _circlePoly(cx, cy, r, seg = 24) {
  const pts = [];
  for (let i = 0; i < seg; i++) { const a = (i / seg) * 2 * Math.PI; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return pts;
}

/**
 * Brim "mouse ears": the sharp convex corners of an outline, where a small
 * disc of brim best resists warping (BambuStudio's brim_ears). Returns the
 * corner points whose interior angle is at or below maxAngleDeg.
 */
function _brimEars(poly, maxAngleDeg = 125) {
  if (!poly || poly.length < 3) return [];
  let area = 0;
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; area += a[0] * b[1] - b[0] * a[1]; }
  const ccw = area > 0;
  const n = poly.length, ears = [];
  for (let i = 0; i < n; i++) {
    const p = poly[(i - 1 + n) % n], v = poly[i], q = poly[(i + 1) % n];
    const cross = (v[0] - p[0]) * (q[1] - v[1]) - (v[1] - p[1]) * (q[0] - v[0]);
    const convex = ccw ? cross > 0 : cross < 0;
    if (!convex) continue;
    const ax = p[0] - v[0], ay = p[1] - v[1], bx = q[0] - v[0], by = q[1] - v[1];
    const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    if (la < 1e-6 || lb < 1e-6) continue;
    const cosA = (ax * bx + ay * by) / (la * lb);
    const angle = Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI;
    if (angle <= maxAngleDeg) ears.push([v[0], v[1]]);
  }
  return ears;
}

/**
 * Build raft layers under the object: the first-layer footprint expanded by a
 * margin, printed as a coarse base + denser top layers. Returned layers are
 * prepended to the object (which re-indexes upward, lifting its Z). Uses the
 * 'skirt' feature so it prints at adhesion speed and is visually distinct.
 */
function _buildRaft(regions0, s, lw, offsetPolygon, solidInfill) {
  const n = Math.max(0, s.raftLayers | 0);
  if (!n || !regions0 || !regions0.length) return [];
  const margin = s.raftMargin ?? 3;
  const foot = [];
  for (const r of regions0) { const exp = offsetPolygon(r.outer, margin); if (exp && exp.length >= 3) foot.push(exp); }
  if (!foot.length) return [];
  const out = [];
  for (let r = 0; r < n; r++) {
    const paths = [];
    const spacing = r === 0 ? lw * 3 : lw * 1.4;   // coarse base, denser interface/top
    const angle = r % 2 === 0 ? 0 : 90;
    for (const poly of foot) {
      paths.push({ feature: 'skirt', closed: true, pts: poly });
      for (const sg of solidInfill({ outer: poly, holes: [] }, angle, spacing)) paths.push({ feature: 'skirt', closed: false, pts: sg });
    }
    out.push({ paths, regions: foot.map((p) => ({ outer: p, holes: [] })), z: (r + 1) * s.layerHeight, h: s.layerHeight, raft: true });
  }
  return out;
}

/**
 * Rotate a closed wall loop so it starts at the chosen seam vertex. 'aligned'
 * and 'nearest' hide the seam at the sharpest convex corner (falling back to the
 * rear on cornerless outlines); 'back'/'rear' put it at the rear; 'random'
 * scatters it. Paint enforce/block bands override the position.
 */
// Point-in-triangle for a seam-paint region [x0,y0,x1,y1,x2,y2,zMin,zMax].
function _ptInSeamTri(x, y, t) {
  const d1 = (x - t[2]) * (t[1] - t[3]) - (t[0] - t[2]) * (y - t[3]);
  const d2 = (x - t[4]) * (t[3] - t[5]) - (t[2] - t[4]) * (y - t[5]);
  const d3 = (x - t[0]) * (t[5] - t[1]) - (t[4] - t[0]) * (y - t[1]);
  const neg = d1 < 0 || d2 < 0 || d3 < 0, pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}
function _inSeamBand(x, y, z, tris) {
  for (const t of tris) if (z >= t[6] - 0.5 && z <= t[7] + 0.5 && _ptInSeamTri(x, y, t)) return true;
  return false;
}

/**
 * Reorder a closed perimeter so it starts at the seam point. `mode` is the
 * seam position (aligned/back/random/nearest). `seamCtx` = { enforce, block, z }
 * carries painted seam regions (bed frame): the seam snaps into an enforce band
 * and is nudged out of a block band, overriding the mode where painted.
 */
export function seamStart(poly, mode, seamCtx) {
  if (!poly || poly.length < 3) return poly;
  let idx = -1;
  const hasPaint = seamCtx && (seamCtx.enforce?.length || seamCtx.block?.length);
  if (hasPaint && seamCtx.enforce?.length) {
    // Prefer the first perimeter vertex that falls inside an enforced band.
    for (let i = 0; i < poly.length; i++) {
      if (_inSeamBand(poly[i][0], poly[i][1], seamCtx.z, seamCtx.enforce)) { idx = i; break; }
    }
  }
  if (idx < 0) {
    if (mode === 'random') {
      const seed = Math.abs(Math.round((poly[0][0] + poly[1][1]) * 131) + poly.length * 977);
      idx = seed % poly.length;
    } else if (mode === 'aligned' || mode === 'nearest') {
      // Hide the seam at the sharpest convex corner (BambuStudio's smart aligned
      // seam), where it's least visible. Needs a real corner (>~20°); a
      // cornerless outline (a circle) falls back to the rear below so the seam
      // stays on a consistent vertical line across layers.
      const ccw = _signedArea(poly) > 0 ? 1 : -1;
      let best = 0.35;   // ~20° minimum turn to count as a hiding corner
      for (let i = 0; i < poly.length; i++) {
        const p = poly[(i - 1 + poly.length) % poly.length], c = poly[i], q = poly[(i + 1) % poly.length];
        const ax = c[0] - p[0], ay = c[1] - p[1], bx = q[0] - c[0], by = q[1] - c[1];
        const la = Math.hypot(ax, ay) || 1, lb = Math.hypot(bx, by) || 1;
        const cross = (ax * by - ay * bx) / (la * lb);
        if (cross * ccw <= 0.05) continue;                 // concave / straight → not a hiding corner
        const turn = Math.atan2(Math.abs(cross), (ax * bx + ay * by) / (la * lb));
        if (turn > best) { best = turn; idx = i; }
      }
    }
    // back / rear, or the corner-hiding fallback: the rear-most (max-y) vertex.
    if (idx < 0 && mode !== 'random') {
      let best = -Infinity;
      for (let i = 0; i < poly.length; i++) if (poly[i][1] > best) { best = poly[i][1]; idx = i; }
    }
    // Nudge the chosen seam out of any blocked band to the nearest free vertex.
    if (hasPaint && seamCtx.block?.length && idx >= 0) {
      const blocked = (i) => _inSeamBand(poly[i][0], poly[i][1], seamCtx.z, seamCtx.block);
      if (blocked(idx)) {
        for (let d = 1; d < poly.length; d++) {
          const r = (idx + d) % poly.length, l = (idx - d + poly.length) % poly.length;
          if (!blocked(r)) { idx = r; break; }
          if (!blocked(l)) { idx = l; break; }
        }
      }
    }
  }
  if (idx <= 0) return poly;
  return poly.slice(idx).concat(poly.slice(0, idx));
}

// ── G-code emission ─────────────────────────────────────────────────

function _defaultStart(s) {
  // Heat to the initial-layer temps first (often hotter for adhesion); the
  // layer loop switches to the steady temps after layer 0.
  const bed0 = s.bedTempInitial ?? s.bedTemp;
  const noz0 = s.nozzleTempInitial ?? s.nozzleTemp;
  const fanOff = s.fanOffLayers ?? 1;
  return [
    `M140 S${bed0}`,
    `M104 S${noz0}`,
    `G28 ; home`,
    ...(s.chamberTemp > 0 ? [`M141 S${s.chamberTemp} ; chamber temp`] : []),
    `M190 S${bed0}`,
    `M109 S${noz0}`,
    `G92 E0`,
    `G90`,
    `G17`,   // select the XY arc plane so G2/G3 arc fitting is unambiguous on
             // every firmware (BambuStudio emits this too).
    `M83`,   // relative extrusion (Klipper/BambuStudio standard): each E is a
             // delta, so retracts are unambiguous and the E counter never grows
             // into float-precision loss over a long print.
    // Part-cooling fan: off while printing the first fanOff layer(s).
    fanOff > 0 ? `M107` : `M106 S${Math.round((s.fanSpeed ?? 100) * 2.55)}`,
  ].join('\n') + '\n';
}

function _defaultEnd() {
  return [
    `M104 S0`,
    `M140 S0`,
    `M107`,
    `G28 X Y`,
    `M84`,
  ].join('\n') + '\n';
}

// ── Firmware dialects ── the same slice, emitted in the target firmware's
// G-code so the slicer works like a real slicer for Marlin/Bambu, Klipper and
// RepRapFirmware (Duet), not just "Marlin with a different pressure-advance
// line". Flavor comes from the printer profile (s.gcodeFlavor).

/** Pressure/linear advance in the firmware's dialect. */
function _paCommand(flavor, k) {
  const v = Number(k).toFixed(4);
  if (flavor === 'klipper') return `SET_PRESSURE_ADVANCE ADVANCE=${v}`;
  if (flavor === 'reprap') return `M572 D0 S${v}`;   // Duet: per-extruder PA
  return `M900 K${v}`;                               // Marlin / Bambu (Marlin-derived)
}

/** Machine motion caps (max accel / feedrate / jerk) in the firmware's dialect.
 *  Marlin/Bambu: M201/M203/M205 (mm/s²,mm/s,mm/s). Klipper: one
 *  SET_VELOCITY_LIMIT (jerk ≈ square-corner-velocity). RepRapFirmware: M201 plus
 *  M203 & M566 in mm/MIN. */
function _machineLimitsGcode(s) {
  const f = s.gcodeFlavor || 'marlin';
  const A = s.machineMaxAccel, V = s.machineMaxSpeed, J = s.machineMaxJerk;
  let g = '';
  if (f === 'klipper') {
    const p = [];
    if (V > 0) p.push(`VELOCITY=${V}`);
    if (A > 0) p.push(`ACCEL=${A}`);
    if (J > 0) p.push(`SQUARE_CORNER_VELOCITY=${J}`);
    if (p.length) g += `SET_VELOCITY_LIMIT ${p.join(' ')}\n`;
  } else if (f === 'reprap') {
    if (A > 0) g += `M201 X${A} Y${A}\n`;
    if (V > 0) g += `M203 X${V * 60} Y${V * 60}\n`;   // RRF feedrate limit is mm/min
    if (J > 0) g += `M566 X${J * 60} Y${J * 60}\n`;    // RRF instantaneous-speed (jerk), mm/min
  } else {                                            // marlin, bambu
    if (A > 0) g += `M201 X${A} Y${A}\n`;
    if (V > 0) g += `M203 X${V} Y${V}\n`;
    if (J > 0) g += `M205 X${J} Y${J}\n`;
  }
  return g;
}

/**
 * Convert a stack of layers (each = { perimeters: [[poly]], infill:
 * [[seg]] }) into a G-code string.
 *
 * @param {Array<{perimeters:number[][][], infill:number[][][]}>} layers
 * @param {object} settings — layerHeight, lineWidth, printSpeed,
 *   travelSpeed, retraction, bedTemp, nozzleTemp, filamentDiam,
 *   fanSpeed, firstLayerSpeed, material, startGcode, endGcode.
 */
export function layersToGcode(layers, settings) {
  const s = {
    layerHeight: 0.2, lineWidth: 0.4, printSpeed: 60, travelSpeed: 120,
    retraction: 1.5, bedTemp: 60, nozzleTemp: 215, filamentDiam: FILAMENT_DIAM,
    fanSpeed: 100, firstLayerSpeed: 20, bedSize: [256, 256], material: 'PLA',
    startGcode: null, endGcode: null,
    ...settings,
  };
  // Per-feature speeds (mm/s) — like a desktop slicer. Fall back to printSpeed.
  const P = s.printSpeed;
  const SP = {
    'outer-wall': s.outerWallSpeed ?? P,
    'inner-wall': s.innerWallSpeed ?? (s.outerWallSpeed ? s.outerWallSpeed * 1.4 : P),
    solid: s.solidInfillSpeed ?? P,
    // 0 / unset means "no distinct surface speed" -> fall back to solid infill.
    // (|| not ?? so an explicit 0 is treated as unset, matching solid output.)
    'top-surface': s.topSurfaceSpeed || s.solidInfillSpeed || P,
    'bottom-surface': s.bottomSurfaceSpeed || s.solidInfillSpeed || P,
    sparse: s.sparseInfillSpeed ?? P,
    support: s.supportSpeed ?? P,
    'support-interface': s.supportInterfaceSpeed || s.supportSpeed || P,
    'overhang-wall': s.overhangSpeed || s.outerWallSpeed || P,
    ironing: s.ironingSpeed ?? Math.max(15, P * 0.4),
    bridge: s.bridgeSpeed ?? Math.max(15, P * 0.5),
    gap: s.gapFillSpeed ?? Math.max(15, P * 0.5),
    skirt: s.skirtSpeed ?? s.outerWallSpeed ?? P,
    brim: s.outerWallSpeed ?? P,
    wall: P,
  };
  const featSpeed = (feature, layerIdx) => {
    if (layerIdx === 0) return (s.initialLayerInfillSpeed && (feature === 'solid' || feature === 'top-surface' || feature === 'bottom-surface' || feature === 'sparse' || feature === 'gap')) ? s.initialLayerInfillSpeed : s.firstLayerSpeed;
    return SP[feature] ?? P;
  };
  // Part-cooling fan % for a layer, honoring an optional min→max ramp over the
  // first `fullFanSpeedLayer` layers (BambuStudio fan curve). No curve → flat.
  const fanPctAt = (li) => {
    const off = s.fanOffLayers ?? 1;
    if (li < off) return 0;
    if (s.fanMinSpeed == null && s.fanMaxSpeed == null) return s.fanSpeed ?? 100;
    const mn = s.fanMinSpeed ?? s.fanSpeed ?? 100, mx = s.fanMaxSpeed ?? s.fanSpeed ?? 100;
    const full = Math.max(off, s.fullFanSpeedLayer ?? off);
    if (li >= full) return mx;
    return mn + (mx - mn) * ((li - off) / Math.max(1, full - off));
  };
  // Graduated overhang speed: bucket the overhang fraction into the configured
  // speed levels (BambuStudio's overhang_1_4..4_4). 0 in a bucket = no
  // slow-down there. Falls back to the single overhangSpeed when no table set.
  const gradedOverhangSpeed = (frac) => {
    const arr = s.overhangSpeeds;
    if (Array.isArray(arr) && arr.length) {
      const idx = Math.min(arr.length - 1, Math.max(0, Math.floor(frac * arr.length)));
      return arr[idx] > 0 ? arr[idx] : 0;
    }
    return (frac > (s.overhangThreshold ?? 0.5) && s.overhangSpeed) ? s.overhangSpeed : 0;
  };
  // Overhang speed for a discrete degree 1..4 (0 = supported → no slow-down),
  // for per-segment grading. Uses the overhang_1_4..4_4 table when set, else the
  // single overhangSpeed for the steeper (>=3) buckets.
  const overhangSpeedForDeg = (deg) => {
    if (deg <= 0) return 0;
    const arr = s.overhangSpeeds;
    if (Array.isArray(arr) && arr.length) { const v = arr[Math.min(arr.length - 1, deg - 1)]; return v > 0 ? v : 0; }
    return (deg >= 3 && s.overhangSpeed) ? s.overhangSpeed : 0;
  };
  // Per-feature acceleration (M204). Undefined features fall back to the
  // steady acceleration; the loop only emits M204 when it actually changes.
  const ACC = {
    'outer-wall': s.outerWallAccel, 'inner-wall': s.innerWallAccel, wall: s.outerWallAccel,
    solid: s.topSurfaceAccel, sparse: s.sparseInfillAccel,
    bridge: s.bridgeAccel, support: s.supportAccel, gap: s.gapAccel,
  };
  const featAccel = (feature, layerIdx) => {
    if (layerIdx === 0) return s.initialLayerAccel || s.acceleration;
    const a = ACC[feature];                 // 0 / undefined → fall back to steady accel
    return a && a > 0 ? a : s.acceleration;
  };
  // Per-feature jerk (M205), mirroring per-feature acceleration.
  const JERK = {
    'outer-wall': s.outerWallJerk, 'inner-wall': s.innerWallJerk, wall: s.outerWallJerk,
    solid: s.topSurfaceJerk, sparse: s.infillJerk,
  };
  const anyFeatJerk = !!(s.outerWallJerk || s.innerWallJerk || s.topSurfaceJerk || s.infillJerk || s.initialLayerJerk);
  const featJerk = (feature, layerIdx) => {
    if (layerIdx === 0 && s.initialLayerJerk) return s.initialLayerJerk;
    const j = JERK[feature];
    return j && j > 0 ? j : s.jerk;
  };
  // Extrusion factor: volume of a 1 mm path = lineWidth * layerHeight,
  // E (mm filament) = volume / (π · (filamentDiam/2)²). Scaled by the global
  // flow ratio (print_flow_ratio) so under/over-extrusion can be dialled in.
  const flowRatio = s.flowRatio ?? 1;
  const efOf = (w, h = s.layerHeight) => (w * h * flowRatio) / (PI * (s.filamentDiam / 2) ** 2);
  const efactor = efOf(s.lineWidth);
  // Per-feature line widths (extrusion width). Fall back to lineWidth.
  const LW = {
    'outer-wall': s.outerWallLineWidth ?? s.lineWidth,
    'inner-wall': s.innerWallLineWidth ?? s.lineWidth,
    solid: s.solidInfillLineWidth ?? s.lineWidth,
    'top-surface': s.topSurfaceLineWidth ?? s.solidInfillLineWidth ?? s.lineWidth,
    'bottom-surface': s.solidInfillLineWidth ?? s.lineWidth,
    sparse: s.sparseInfillLineWidth ?? s.lineWidth,
    support: s.supportLineWidth ?? s.lineWidth,
    'support-interface': s.supportLineWidth ?? s.lineWidth,
    'overhang-wall': s.outerWallLineWidth ?? s.lineWidth,
    bridge: s.bridgeLineWidth ?? s.lineWidth,
  };
  const efFeat = (feature, layerIdx, h = s.layerHeight) => {
    const base = (layerIdx === 0 && s.initialLayerLineWidth) ? efOf(s.initialLayerLineWidth, h) : efOf(LW[feature] ?? s.lineWidth, h);
    // initial_layer_flow_ratio: extra extrusion multiplier on the first layer
    // (thicker squish for adhesion). 1 / unset → unchanged.
    return (layerIdx === 0 && s.initialLayerFlowRatio > 0) ? base * s.initialLayerFlowRatio : base;
  };
  const zHop = s.zHop ?? 0;

  let g = '';
  g += `; Generated by 3DPrintForge native slicer\n`;
  g += `; Layers: ${layers.length}, layer height: ${s.layerHeight} mm\n`;
  g += `; Material: ${s.material}, nozzle ${s.nozzleTemp}C, bed ${s.bedTemp}C\n`;
  g += `; estimated_time: 0\n`;
  g += (s.startGcode ? _interp(s.startGcode, s) + '\n' : _defaultStart(s));
  // Machine limits (BambuStudio printer settings): cap the firmware's max
  // acceleration / feedrate / jerk so aggressive profiles stay within the
  // hardware's safe envelope. Emitted once after the start G-code.
  g += _machineLimitsGcode(s);
  // Filament-specific start G-code runs right after the machine start G-code.
  if (s.filamentStartGcode) g += _interp(s.filamentStartGcode, s) + '\n';

  // Pressure advance / linear advance (BambuStudio "flow dynamics"). Emitted
  // after the start block so it applies to the whole print. Klipper uses
  // SET_PRESSURE_ADVANCE; Marlin/others use M900 K.
  if (s.pressureAdvance != null && s.pressureAdvance >= 0) {
    g += _paCommand(s.gcodeFlavor, s.pressureAdvance) + '\n';
  }

  // Acceleration / jerk control (Marlin M204/M205). Emitted regardless of a
  // custom start block so per-feature motion tuning still applies. The first
  // layer can use its own (usually lower) acceleration for adhesion.
  if (s.acceleration) g += `M204 P${s.initialLayerAccel ?? s.acceleration} T${s.travelAccel ?? s.acceleration}\n`;
  if (s.jerk) {
    const f = s.gcodeFlavor || 'marlin';
    if (f === 'reprap') g += `M566 X${s.jerk * 60} Y${s.jerk * 60}\n`;   // Duet jerk in mm/min
    else if (f !== 'klipper') g += `M205 X${s.jerk} Y${s.jerk}\n`;       // Klipper: jerk not per-move settable
  }

  let e = 0;
  // Relative-extrusion output: `e` stays the internal cumulative amount (all the
  // extrusion/retraction bookkeeping below is unchanged), but every E written to
  // g-code is the DELTA since the previous emission — the M83 encoding. dE() must
  // be called exactly once per emitted E, in emission order.
  let eLast = 0;
  const dE = () => { const d = e - eLast; eLast = e; return d.toFixed(4); };
  let curX = 0, curY = 0, curZ = 0;
  let curFanG = -1;   // last-emitted M106 S value (PWM 0-255), for overhang cooling
  let curAccelG = -1; // last-emitted M204 P value, for per-feature acceleration
  let curObj = null;  // current object label (gcode_label_objects / exclude-object)
  let curTool = null; // active tool/extruder (multi-material); null until a path sets one
  let curJerkG = -1;  // last-emitted M205 X/Y value, for per-feature jerk
  // Filament purge on a tool change. flushIntoInfill (default) deposits it into
  // the next extrusion move (waste hidden inside the print); otherwise a
  // stationary in-place purge. flushVolume mm³ → mm of filament.
  const flushE = ((s.flushVolume ?? 0) > 0) ? (s.flushVolume / (PI * (s.filamentDiam / 2) ** 2)) : 0;
  let pendingFlushE = 0;   // purge to deposit into the next extruding move
  let combBoundary = null;   // current layer's solid regions, for avoid-crossing travel
  let combCache = null;      // that layer's lazily-built waypoints + visibility graph
  const combing = s.avoidCrossingWalls !== false;
  const combTol = Math.max(0.3, s.lineWidth);

  // Prime line (skip when a custom start gcode already primes, or when
  // reduce-waste is on). A shorter prime line also cuts wasted filament.
  if (!s.startGcode && !s.reduceWaste) {
    const primeLen = s.primeLineLength ?? 60;
    // Prime at the FIRST LAYER height (not a hardcoded 0.3) so the purge line
    // adheres at the right gap and the nozzle doesn't drop into the first layer.
    const primeZ = (layers[0] && layers[0].z) || s.layerHeight;
    const primeH = (layers[0] && layers[0].h) || s.layerHeight;
    const primeEf = efOf(s.initialLayerLineWidth ?? s.lineWidth, primeH) * (s.initialLayerFlowRatio > 0 ? s.initialLayerFlowRatio : 1);
    g += `; --- prime line ---\n`;
    g += `G1 Z${primeZ.toFixed(3)} F${s.travelSpeed * 60}\n`;
    g += `G1 X20 Y20 F${s.travelSpeed * 60}\n`;
    g += `G1 X${20 + primeLen} Y20 E${(primeLen * primeEf).toFixed(4)} F${s.firstLayerSpeed * 60}\n`;
    g += `G92 E0\n`;
    curX = 20 + primeLen; curY = 20; curZ = primeZ;
  }

  const retractFeed = (s.retractionSpeed ?? s.travelSpeed) * 60;
  const deretractFeed = (s.deretractionSpeed ?? s.retractionSpeed ?? s.travelSpeed) * 60;
  const wipeFeed = (s.wipeSpeed ?? s.travelSpeed) * 60;
  const zTravelFeed = (s.travelSpeedZ > 0 ? s.travelSpeedZ : s.travelSpeed) * 60;   // Z-axis move speed
  const restartExtra = s.retractRestartExtra || 0;              // prime on unretract
  let lastPath = null;   // points of the path just printed, for wipe-on-retract
  // Close a loop back to its start, optionally leaving a small seam gap so the
  // seam is a clean butt-joint instead of an over-extruded overlap.
  const closeLoop = (first, ef, speed) => {
    const d = Math.hypot(first[0] - curX, first[1] - curY);
    if (d <= EPS) return;
    const gap = s.seamGap ?? 0;
    if (gap > 0 && d <= gap) return;                 // whole closing move is within the gap
    const target = gap > 0 ? [curX + (first[0] - curX) * (d - gap) / d, curY + (first[1] - curY) * (d - gap) / d] : first;
    e += (gap > 0 ? d - gap : d) * ef;
    g += `G1 X${target[0].toFixed(3)} Y${target[1].toFixed(3)} E${dE()} F${speed * 60}\n`;
    curX = target[0]; curY = target[1];
  };
  // `widths` (optional, one per point) makes each segment's extrusion track a
  // variable line width — the foundation for Arachne variable-width beads. When
  // absent everything is byte-identical to the fixed-width path.
  const emitPath = (pts, speed, closed, flow = 1, ef = efactor * flow, scarf = 0, widths = null, baseW = s.lineWidth, segSpeeds = null) => {
    if (pts.length < 2) return;
    const varW = widths && widths.length === pts.length && baseW > 0;
    // Per-segment feedrate (overhang grading): segSpeeds[i] is the speed for the
    // move INTO pts[i]; falls back to the path speed where unset. Keeps the loop
    // (and its seam) intact while slowing only the overhanging stretches.
    const spd = (i) => (segSpeeds && segSpeeds[i] > 0 ? segSpeeds[i] : speed);
    const first = pts[0];
    // Avoid-crossing-walls (combing): if a route that stays over solid exists,
    // travel along it WITHOUT retracting — no stringing across gaps, far fewer
    // retractions. Falls back to the retract/wipe path when no interior route
    // exists (e.g. the first travel from the prime line).
    if (combing && combBoundary && !varW) {
      const route = routeInside([curX, curY], first, combBoundary, { tol: combTol, cache: combCache });
      if (route && route.length >= 2) {
        for (let i = 1; i < route.length; i++) g += `G0 X${route[i][0].toFixed(3)} Y${route[i][1].toFixed(3)} F${s.travelSpeed * 60}\n`;
        curX = first[0]; curY = first[1];
        if (pendingFlushE > 0) { e += pendingFlushE; g += `G1 E${dE()} F${Math.round(s.printSpeed * 60)} ; flush into infill\n`; pendingFlushE = 0; }
        for (let i = 1; i < pts.length; i++) { const p = pts[i]; const d = Math.hypot(p[0] - curX, p[1] - curY); if (d < 5e-4) { curX = p[0]; curY = p[1]; continue; } e += d * ef; g += `G1 X${p[0].toFixed(3)} Y${p[1].toFixed(3)} E${dE()} F${spd(i) * 60}\n`; curX = p[0]; curY = p[1]; }
        if (closed) closeLoop(first, ef, speed);
        lastPath = closed ? [...pts, first] : pts;
        return;
      }
    }
    // retract_before_travel: for a hop shorter than this, skip the retract
    // entirely (BambuStudio does the same) — no needless retract/unretract wear
    // or seam blob on tiny moves. Combing already handles most intra-object
    // travel; this catches the short leftover hops.
    const travelD = Math.hypot(first[0] - curX, first[1] - curY);
    const shortHop = (s.retractBeforeTravel > 0) && travelD < s.retractBeforeTravel;
    if (s.retraction > 0 && !shortHop) {
      // Wipe-on-retract: draw the nozzle back over the path just printed while
      // retracting, so the pressure bleeds onto existing extrusion (no blob/ooze
      // at the seam) instead of a stationary retract.
      if (s.wipe && lastPath && lastPath.length >= 2) {
        const rev = [...lastPath].reverse();
        const wipeDist = s.wipeDistance ?? 2;
        const wipePts = [rev[0]]; let acc = 0;
        for (let i = 1; i < rev.length && acc < wipeDist; i++) { acc += Math.hypot(rev[i][0] - rev[i - 1][0], rev[i][1] - rev[i - 1][1]); wipePts.push(rev[i]); }
        const total = acc || 1; const startE = e; let done = 0;
        for (let i = 1; i < wipePts.length; i++) {
          done += Math.hypot(wipePts[i][0] - wipePts[i - 1][0], wipePts[i][1] - wipePts[i - 1][1]);
          e = startE - s.retraction * Math.min(1, done / total);   // absolute target
          g += `G1 X${wipePts[i][0].toFixed(3)} Y${wipePts[i][1].toFixed(3)} E${dE()} F${wipeFeed}\n`;  // dE()=relative delta (M83)
        }
        e = startE - s.retraction; curX = wipePts[wipePts.length - 1][0]; curY = wipePts[wipePts.length - 1][1];
      } else {
        e -= s.retraction; g += `G1 E${dE()} F${retractFeed.toFixed(0)}\n`;
      }
      if (zHop > 0) g += `G1 Z${(curZ + zHop).toFixed(3)} F${zTravelFeed}\n`;
      g += `G0 X${first[0].toFixed(3)} Y${first[1].toFixed(3)} F${s.travelSpeed * 60}\n`;
      if (zHop > 0) g += `G1 Z${curZ.toFixed(3)} F${zTravelFeed}\n`;
      e += s.retraction + restartExtra; g += `G1 E${dE()} F${deretractFeed.toFixed(0)}\n`;
    } else {
      // Short hop (or retraction disabled): travel straight there, no retract.
      g += `G0 X${first[0].toFixed(3)} Y${first[1].toFixed(3)} F${s.travelSpeed * 60}\n`;
    }
    curX = first[0]; curY = first[1];
    if (pendingFlushE > 0) { e += pendingFlushE; g += `G1 E${dE()} F${Math.round(s.printSpeed * 60)} ; flush into infill\n`; pendingFlushE = 0; }
    let sdist = 0;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      const d = Math.hypot(p[0] - curX, p[1] - curY);
      // Drop degenerate sub-resolution segments (duplicate points, e.g. from
      // gyroid tessellation) — they'd emit a same-coordinate G1 with a tiny E,
      // i.e. a stationary blob. Skipping loses only picolitres of filament.
      if (d < 5e-4) { curX = p[0]; curY = p[1]; continue; }
      // Scarf-joint seam: ramp extrusion up over the first `scarf` mm so the seam
      // begins as a taper (paired with the ramp-down overlap below), not a blob.
      let segEf = ef;
      if (scarf > 0 && closed) { const mid = sdist + d / 2; if (mid < scarf) segEf = ef * (0.2 + 0.8 * (mid / scarf)); }
      // Variable width: scale the extrusion by the segment's mean width / base.
      if (varW) segEf = segEf * (((widths[i - 1] + widths[i]) / 2) / baseW);
      e += d * segEf;
      g += `G1 X${p[0].toFixed(3)} Y${p[1].toFixed(3)} E${dE()} F${spd(i) * 60}\n`;
      curX = p[0]; curY = p[1]; sdist += d;
    }
    if (closed) {
      closeLoop(first, ef, speed);
      // Ramp-down overlap: continue along the loop from the seam for `scarf` mm,
      // tapering flow to zero so the joint fades out over the ramp-up region.
      if (scarf > 0) {
        let od = 0, i = 1, px = first[0], py = first[1];
        while (od < scarf && i <= pts.length) {
          const p = pts[i % pts.length];
          const d = Math.hypot(p[0] - px, p[1] - py);
          if (d < EPS) { i++; continue; }
          const seg = Math.min(d, scarf - od);
          const tx = px + (p[0] - px) * (seg / d), ty = py + (p[1] - py) * (seg / d);
          const frac = Math.max(0, 1 - (od + seg / 2) / scarf);
          e += seg * ef * frac;
          g += `G1 X${tx.toFixed(3)} Y${ty.toFixed(3)} E${dE()} F${speed * 60}\n`;
          curX = tx; curY = ty; od += seg; px = tx; py = ty;
          if (seg >= d - EPS) i++;
        }
      }
    }
    lastPath = closed ? [...pts, first] : pts;
  };

  // Continuous spiral (vase mode): ramp Z across the loop, no retract.
  const emitSpiral = (pts, zStart, zEnd, speed) => {
    if (pts.length < 2) return;
    const loop = [...pts, pts[0]];
    let L = 0;
    for (let i = 1; i < loop.length; i++) L += Math.hypot(loop[i][0] - loop[i - 1][0], loop[i][1] - loop[i - 1][1]);
    if (L < EPS) return;
    g += `G1 X${loop[0][0].toFixed(3)} Y${loop[0][1].toFixed(3)} Z${zStart.toFixed(3)} F${speed * 60}\n`;
    curX = loop[0][0]; curY = loop[0][1]; curZ = zStart;
    let acc = 0;
    for (let i = 1; i < loop.length; i++) {
      const d = Math.hypot(loop[i][0] - curX, loop[i][1] - curY);
      acc += d; e += d * efactor;
      const zz = zStart + (acc / L) * (zEnd - zStart);
      g += `G1 X${loop[i][0].toFixed(3)} Y${loop[i][1].toFixed(3)} Z${zz.toFixed(3)} E${dE()} F${speed * 60}\n`;
      curX = loop[i][0]; curY = loop[i][1]; curZ = zz;
    }
  };

  const pathLen = (pts, closed) => {
    let L = 0;
    for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (closed && pts.length > 2) L += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
    return L;
  };

  // Manual colour changes (BambuStudio "add colour change"): 1-based layer
  // numbers where the print pauses for a filament swap.
  const colorChangeSet = Array.isArray(s.colorChangeLayers) && s.colorChangeLayers.length
    ? new Set(s.colorChangeLayers.map((n) => Number(n))) : null;

  layers.forEach((layer, layerIdx) => {
    // Per-layer Z (top) and height — adaptive layers carry their own; uniform
    // layers fall back to the global height (byte-identical behaviour).
    const lh = layer.h ?? s.layerHeight;
    const z = layer.z ?? (layerIdx + 1) * s.layerHeight;
    let paths = layer.paths || [
      ...(layer.perimeters || []).map((p) => ({ feature: 'wall', closed: true, pts: p })),
      ...(layer.infill || []).map((sgm) => ({ feature: 'sparse', closed: false, pts: sgm })),
    ];
    // Travel optimisation: emit paths in a proximity order (BambuStudio orders
    // paths to minimise travel; generation order made the head jump across the
    // model ~2x too much). Adhesion stays first, support last; each region's
    // wall loops stay grouped and in sequence (seam + inner-outer-inner intact);
    // the wall-groups and infill runs are then greedily reordered by nearest
    // entry point from the current nozzle position. Open infill runs may enter
    // from either end (their print direction is free) EXCEPT monotonic surface
    // runs, which must keep a common direction. Deterministic → two slices that
    // differ only in a disabled feature still match byte-for-byte.
    if (s.optimizeTravel !== false && paths.length > 2) {
      const isWall = (f) => f === 'wall' || f === 'outer-wall' || f === 'inner-wall' || f === 'overhang-wall';
      // Greedy nearest-neighbour order for one path list, from (sx,sy).
      const orderOne = (list, sx, sy) => {
        const front = [], back = [], units = [];
        for (const p of list) {
          if (p.feature === 'skirt' || p.feature === 'brim') { front.push(p); continue; }
          if (p.feature === 'support' || p.feature === 'support-interface') { back.push(p); continue; }
          const wu = units.length && units[units.length - 1]._wall;
          if (isWall(p.feature) && wu) units[units.length - 1].paths.push(p);
          else units.push({ _wall: isWall(p.feature), paths: [p] });
        }
        const entry = (u) => u.paths[0].pts[0];
        const exit = (u) => { const l = u.paths[u.paths.length - 1]; return l.closed ? l.pts[0] : l.pts[l.pts.length - 1]; };
        const ordered = []; let cx = sx, cy = sy; const rem = units;
        while (rem.length) {
          let bi = 0, bd = Infinity, brev = false;
          for (let j = 0; j < rem.length; j++) {
            const u = rem[j], e = entry(u);
            const d = (e[0] - cx) * (e[0] - cx) + (e[1] - cy) * (e[1] - cy);
            if (d < bd) { bd = d; bi = j; brev = false; }
            const p0 = u.paths[0];
            if (!u._wall && u.paths.length === 1 && !p0.closed && !p0.monotonic) {
              const x = p0.pts[p0.pts.length - 1];
              const dr = (x[0] - cx) * (x[0] - cx) + (x[1] - cy) * (x[1] - cy);
              if (dr < bd) { bd = dr; bi = j; brev = true; }
            }
          }
          const u = rem.splice(bi, 1)[0];
          if (brev) u.paths[0] = { ...u.paths[0], pts: u.paths[0].pts.slice().reverse() };
          for (const p of u.paths) ordered.push(p);
          const ex = exit(u); cx = ex[0]; cy = ex[1];
        }
        return { seq: [...front, ...ordered, ...back], ex: [cx, cy] };
      };
      // Multi-material: never mix tools within a layer (that would multiply the
      // colour changes). Partition by tool in first-seen order and optimise each
      // tool's paths independently, concatenating in tool order.
      const hasTools = paths.some((p) => p.tool != null);
      if (!hasTools) {
        paths = orderOne(paths, curX, curY).seq;
      } else {
        const order = [], seen = new Set();
        for (const p of paths) { const t = p.tool ?? 0; if (!seen.has(t)) { seen.add(t); order.push(t); } }
        const out = []; let sx = curX, sy = curY;
        for (const t of order) {
          const r = orderOne(paths.filter((p) => (p.tool ?? 0) === t), sx, sy);
          out.push(...r.seq); sx = r.ex[0]; sy = r.ex[1];
        }
        paths = out;
      }
    }
    const spiral = paths.some((p) => p.spiral);
    combBoundary = spiral ? null : (layer.regions || null);
    combCache = (combing && combBoundary) ? {} : null;   // lazy per-layer detour cache
    // Sequential printing: hop to clearance height and mark the object change
    // before starting the next object's first layer.
    if (layer.seqStart) {
      const cz = s.seqClearanceZ ?? (curZ + 5);
      g += `; OBJECT_CHANGE -> object ${layer.seqStart}\n`;
      g += `G1 Z${cz.toFixed(3)} F${s.travelSpeed * 60}\n`; curZ = cz;
    }
    g += `; --- layer ${layerIdx + 1}/${layers.length} z=${z.toFixed(3)} ---\n`;
    g += `;LAYER_CHANGE\n;Z:${z.toFixed(3)}\n`;
    if (!spiral) { g += `G1 Z${z.toFixed(3)} F${s.travelSpeed * 60}\n`; curZ = z; }
    // Custom per-layer G-code hook (e.g. timelapse snapshot, Z-offset tweak).
    if (s.layerChangeGcode) g += _interp(s.layerChangeGcode, s, { layer_num: layerIdx + 1, layer_z: z.toFixed(3), total_layer_count: layers.length }) + '\n';
    // Manual colour change: pause for a filament swap at the start of this layer.
    if (colorChangeSet && layerIdx > 0 && colorChangeSet.has(layerIdx + 1)) g += `; COLOR_CHANGE L${layerIdx + 1}\nM600\n`;
    // After the first layer, drop from initial-layer temps to steady temps and
    // switch from the first-layer acceleration to the steady one.
    if (layerIdx === 1) {
      if (s.nozzleTempInitial != null && s.nozzleTempInitial !== s.nozzleTemp) g += `M104 S${s.nozzleTemp}\n`;
      if (s.bedTempInitial != null && s.bedTempInitial !== s.bedTemp) g += `M140 S${s.bedTemp}\n`;
      if (s.acceleration && s.initialLayerAccel && s.initialLayerAccel !== s.acceleration) g += `M204 P${s.acceleration} T${s.travelAccel ?? s.acceleration}\n`;
    }
    // Cooling: if a layer would print faster than the minimum layer time, slow
    // it down (clamped to the minimum print speed) so small layers get time to
    // cool — the same logic a desktop slicer uses for tiny top caps / spires.
    // Computed before the fan so a slowed layer can also force extra cooling.
    let speedScale = 1;
    if (s.minLayerTime > 0 && layerIdx > 0 && !spiral) {
      let tSec = 0;
      for (const path of paths) {
        if (!path.pts || path.pts.length < 2) continue;
        const sp = featSpeed(path.feature, layerIdx);
        if (sp > 0) tSec += pathLen(path.pts, !!path.closed) / sp;
      }
      if (tSec > 0 && tSec < s.minLayerTime) speedScale = tSec / s.minLayerTime;
    }
    const minSpeed = s.minPrintSpeed ?? 10;
    // When a layer is slowed to meet the minimum layer time, force extra cooling
    // (BambuStudio ramps the fan on short layers) up to cooling_fan_speed —
    // default full, a lower cap protects heat-sensitive materials (ABS/ASA).
    const coolFanFloor = speedScale < 1 ? (s.coolingFanSpeed ?? 100) : 0;
    const fanFor = (li) => Math.max(fanPctAt(li), coolFanFloor);

    // Enable the part-cooling fan once past the fan-off layers. When overhang
    // cooling is active the per-path logic below owns the fan instead. A fan
    // curve (fanMinSpeed→fanMaxSpeed over fullFanSpeedLayer) ramps per layer.
    if (s.overhangFanSpeed == null) {
      if (s.fanMinSpeed != null || s.fanMaxSpeed != null || coolFanFloor > 0) {
        const v = Math.round(fanFor(layerIdx) * 2.55);
        if (v !== curFanG) { g += `M106 S${v}\n`; curFanG = v; }
      } else if (layerIdx === (s.fanOffLayers ?? 1)) {
        const v = Math.round((s.fanSpeed ?? 100) * 2.55); g += `M106 S${v}\n`; curFanG = v;
      }
    }

    // Fan level for normal features on this layer (includes the cooling boost).
    const layerFanPct = fanFor(layerIdx);

    let curFeature = null;
    for (const path of paths) {
      if (!path.pts || path.pts.length < 2) continue;
      // Tool/extruder change (multi-material): retract, switch tool, purge the
      // old colour, then re-prime. Only when a path carries a distinct tool.
      if (path.tool != null && path.tool !== curTool) {
        if (curTool != null) { e -= s.retraction; g += `G1 E${dE()} F${retractFeed.toFixed(0)}\n`; }
        g += `; TOOL_CHANGE ${curTool ?? '-'} -> ${path.tool}\n`;
        g += `T${path.tool - 1}\n`;
        curTool = path.tool;
        if (s.retraction > 0) { e += s.retraction; g += `G1 E${dE()} F${deretractFeed.toFixed(0)}\n`; }
        // Purge the old colour: into the next extrusion move (default, hidden in
        // the print) or as a stationary in-place waste blob when disabled.
        if (flushE > 0) {
          if (s.flushIntoInfill !== false) pendingFlushE = flushE;
          else { e += flushE; g += `G1 E${dE()} F${Math.round(s.travelSpeed * 30)} ; purge\n`; }
        }
      }
      // Object labels (exclude-object): wrap each object's moves.
      if (s.gcodeLabelObjects && path.obj !== curObj) {
        if (curObj != null) g += `EXCLUDE_OBJECT_END NAME=${curObj}\n`;
        curObj = path.obj;
        if (curObj != null) g += `; printing object ${curObj}\nEXCLUDE_OBJECT_START NAME=${curObj}\n`;
      }
      if (path.feature !== curFeature) { g += `; FEATURE: ${featureLabel(path.feature)}\n`; curFeature = path.feature; }
      // Per-feature acceleration switch (only when any per-feature accel is set).
      if (s.acceleration && (s.outerWallAccel || s.innerWallAccel || s.topSurfaceAccel || s.sparseInfillAccel || s.bridgeAccel || s.supportAccel || s.gapAccel)) {
        const fa = Math.round(featAccel(path.feature, layerIdx));
        if (fa > 0 && fa !== curAccelG) { g += `M204 P${fa}\n`; curAccelG = fa; }
      }
      // Per-feature jerk switch (only when any per-feature jerk is set).
      if (anyFeatJerk) {
        const fj = Math.round(featJerk(path.feature, layerIdx));
        if (fj > 0 && fj !== curJerkG) { g += `M205 X${fj} Y${fj}\n`; curJerkG = fj; }
      }
      const isCooled = path.feature === 'bridge' || path.overhang;
      // Overhang / bridge cooling: boost the part fan over these moves, restore after.
      if (s.overhangFanSpeed != null && layerIdx > 0) {
        const wantFan = isCooled ? Math.round(Math.max(layerFanPct, s.overhangFanSpeed) * 2.55) : Math.round(layerFanPct * 2.55);
        if (wantFan !== curFanG) { g += `M106 S${wantFan}\n`; curFanG = wantFan; }
      }
      let pspeed = (layerIdx > 0 && path.speedOverride > 0) ? path.speedOverride : featSpeed(path.feature, layerIdx);
      // Small-perimeter slowdown: tiny closed loops (holes, pillars) print
      // cleaner slower because the head can't accelerate over the short path.
      if (path.closed && s.smallPerimeterSpeed && String(path.feature).includes('wall') && pathLen(path.pts, true) < (s.smallPerimeterThreshold ?? 15)) pspeed = Math.min(pspeed, s.smallPerimeterSpeed);
      // Max volumetric speed: cap the feedrate so flow (width×height×speed) stays
      // within the filament/hot-end limit (BambuStudio filament_max_volumetric_speed).
      if (s.maxVolumetricSpeed > 0) {
        const w = LW[path.feature] ?? s.lineWidth;
        pspeed = Math.min(pspeed, s.maxVolumetricSpeed / Math.max(0.01, w * lh * (path.flow ?? 1)));
      }
      if (speedScale < 1) pspeed = Math.max(minSpeed, pspeed * speedScale);
      // Overhang grading: slow ONLY the overhanging stretches. Per-vertex degrees
      // give a per-segment feedrate; without them fall back to slowing the whole
      // wall by its overhang fraction.
      let segSpeeds = null;
      if (path.overhangDeg && path.overhangDeg.length === path.pts.length) {
        const deg = path.overhangDeg, n = path.pts.length;
        segSpeeds = new Array(n); let anyOh = false;
        for (let i = 1; i < n; i++) {
          let os = overhangSpeedForDeg(Math.max(deg[i - 1], deg[i]));
          if (os > 0) { if (speedScale < 1) os = Math.max(minSpeed, os * speedScale); segSpeeds[i] = Math.min(pspeed, os); anyOh = true; }
          else segSpeeds[i] = pspeed;
        }
        if (!anyOh) segSpeeds = null;
      } else if (path.overhangFrac != null) {
        let os = gradedOverhangSpeed(path.overhangFrac);
        if (os > 0) { if (speedScale < 1) os = Math.max(minSpeed, os * speedScale); pspeed = Math.min(pspeed, os); }
      }
      const ef = efFeat(path.feature, layerIdx, lh) * (path.flow ?? 1);
      if (path.spiral) { emitSpiral(path.pts, layerIdx * s.layerHeight, z, pspeed); continue; }
      // Scarf seam only on outer walls (above the first layer, non-vase).
      const scarf = (s.scarfSeam && path.feature === 'outer-wall' && path.closed && layerIdx > 0) ? (s.scarfLength ?? 5) : 0;
      emitPath(path.pts, pspeed, !!path.closed, path.flow ?? 1, ef, scarf, path.widths, path.baseW ?? (LW[path.feature] ?? s.lineWidth), segSpeeds);
    }
  });
  if (s.gcodeLabelObjects && curObj != null) g += `EXCLUDE_OBJECT_END NAME=${curObj}\n`;

  g += `; --- finished ---\n`;
  e -= s.retraction; g += `G1 E${dE()} F${s.travelSpeed * 60}\n`;
  g += `G1 Z${(curZ + 5).toFixed(3)} F${s.travelSpeed * 60}\n`;
  // Filament-specific end G-code runs before the machine end G-code.
  if (s.filamentEndGcode) g += _interp(s.filamentEndGcode, s) + '\n';
  g += (s.endGcode ? _interp(s.endGcode, s) + '\n' : _defaultEnd());
  // Optional arc fitting: fold runs of straight moves on a circle into G2/G3.
  if (s.arcFitting) g = fitArcs(g, s.arcTolerance ?? 0.05, { relativeE: true });
  // Print-progress (M73 P<pct> R<min>) per layer for the printer display — on by
  // default like BambuStudio; runs last so it sees the final (arc-fitted) moves.
  if (s.progressReport !== false) g = insertProgressM73(g);
  return g;
}

/** Substitute common profile placeholders in start/end G-code. Tokens
 *  must be bracketed ([name] or {name}) so we consume them whole. */
function _interp(tpl, s, extra = {}) {
  const nozzle = /[\[{]\s*(nozzle_temperature_initial_layer|nozzle_temperature|first_layer_temperature|temperature)\s*[\]}]/gi;
  const bed = /[\[{]\s*(bed_temperature_initial_layer|bed_temperature|first_layer_bed_temperature)\s*[\]}]/gi;
  let out = String(tpl).replace(nozzle, s.nozzleTemp).replace(bed, s.bedTemp);
  // Layer-change tokens (used by layer_change_gcode).
  for (const [k, v] of Object.entries(extra)) {
    out = out.replace(new RegExp(`[\\[{]\\s*${k}\\s*[\\]}]`, 'gi'), String(v));
  }
  return out;
}

// ── Pipeline orchestrator ───────────────────────────────────────────

/**
 * End-to-end slicing: mesh → G-code. Repairs + recenters the mesh, then
 * slices into walls / shells / infill / skirt.
 */
/** Slice a mesh into typed per-layer paths (no G-code). Reusable so several
 *  objects can be sliced with their own settings and combined. `opts.offset`
 *  applies a shared recenter (keeps multiple objects aligned); `opts.numLayers`
 *  forces a common layer count. */
export async function sliceMeshToLayers(mesh, settings = {}, opts = {}) {
  const s = {
    layerHeight: 0.2, lineWidth: 0.4, perimeters: 2, infillDensity: 0.2,
    infillAngle: 45, infillPattern: 'grid', topLayers: 4, bottomLayers: 4,
    skirtLoops: 1, skirtGap: 3, brimWidth: 0, brimType: 'outer_only', raftLayers: 0, raftMargin: 3,
    supports: false, supportDensity: 0.2, supportGridRes: 2, supportXYGap: 0.8, supportZGap: 1, supportInterface: 2,
    ironing: false, ironingFlow: 0.15, ironingSpacingFactor: 0.5,
    spiralMode: false, elephantFoot: 0,
    fuzzySkin: false, fuzzySkinThickness: 0.3, draftShield: false, draftShieldGap: 4,
    infillCombination: 1,
    ...settings,
  };
  const wallLoops = Math.max(1, s.perimeters | 0);
  const lw = s.lineWidth;

  const { autoRepair } = await import('./mesh-repair.js');
  const { recenterToOrigin, meshStats } = await import('./mesh-transforms.js');
  const repaired = autoRepair(mesh).mesh;
  // Bounding box of the mesh as received (world / exported-STL frame) — used to
  // map painted support regions through the same recenter+centre translation.
  const bbBefore = meshStats(repaired).bbox;
  let recentered;
  if (opts.offset) {
    const p = Array.from(repaired.positions);
    for (let i = 0; i < p.length; i += 3) { p[i] -= opts.offset[0]; p[i + 1] -= opts.offset[1]; p[i + 2] -= opts.offset[2]; }
    recentered = { positions: p, indices: repaired.indices };
  } else {
    recentered = recenterToOrigin(repaired).mesh;
  }
  const stats = meshStats(recentered);
  const layerHeight = s.layerHeight;
  let numLayers = opts.numLayers || Math.max(1, Math.floor(stats.bbox.size[2] / layerHeight));

  // Centre the model on the bed. recenterToOrigin drops the model into the
  // [0,0] corner; real printers expect bed coordinates, so shift it to the bed
  // centre. Skipped for the multi-object path (that owns its own layout) and
  // when centreOnBed is explicitly disabled.
  const bedX = (Array.isArray(s.bedSize) && s.bedSize[0]) || (s.buildVolume && (s.buildVolume[0] ?? s.buildVolume.x)) || 0;
  const bedY = (Array.isArray(s.bedSize) && s.bedSize[1]) || (s.buildVolume && (s.buildVolume[1] ?? s.buildVolume.y)) || 0;
  let dxApplied = 0, dyApplied = 0;
  if (!opts.offset && s.centerOnBed !== false && bedX > 0 && bedY > 0) {
    dxApplied = bedX / 2 - stats.bbox.size[0] / 2;
    dyApplied = bedY / 2 - stats.bbox.size[1] / 2;
    const P = Array.from(recentered.positions);
    for (let i = 0; i < P.length; i += 3) { P[i] += dxApplied; P[i + 1] += dyApplied; }
    recentered = { positions: P, indices: recentered.indices };
  }

  // Map painted support regions (world frame) into the bed frame with the same
  // pure translation applied to the mesh: engine = world - bbMin + centreOffset.
  const offX = -bbBefore.min[0] + dxApplied;
  const offY = -bbBefore.min[1] + dyApplied;
  const offZ = -bbBefore.min[2];
  const xfPaint = (t) => [t[0] + offX, t[1] + offY, t[2] + offX, t[3] + offY, t[4] + offX, t[5] + offY, t[6] + offZ];
  const paintEnforce = (s.supportPaint && Array.isArray(s.supportPaint.enforce) ? s.supportPaint.enforce : []).map(xfPaint);
  const paintBlock = (s.supportPaint && Array.isArray(s.supportPaint.block) ? s.supportPaint.block : []).map(xfPaint);
  // Seam paint carries [x0,y0,x1,y1,x2,y2,zMin,zMax]; map both z bounds.
  const xfSeam = (t) => [t[0] + offX, t[1] + offY, t[2] + offX, t[3] + offY, t[4] + offX, t[5] + offY, t[6] + offZ, t[7] + offZ];
  if (s.seamPaint && (s.seamPaint.enforce?.length || s.seamPaint.block?.length)) {
    s.seamPaint = {
      enforce: (s.seamPaint.enforce || []).map(xfSeam),
      block: (s.seamPaint.block || []).map(xfSeam),
    };
  }
  // Fuzzy-skin painting: bands (8-value) where the outer wall gets fuzzed.
  if (s.fuzzyPaint && s.fuzzyPaint.enforce?.length) {
    s.fuzzyPaint = { enforce: s.fuzzyPaint.enforce.map(xfSeam) };
  }

  // Modifier volumes: world-frame AABBs [minX,minY,minZ,maxX,maxY,maxZ] with
  // per-region setting overrides (infill density/pattern). Mapped to the bed
  // frame; the sparse-infill pass uses the modifier density/pattern for lines
  // whose midpoint falls inside an active modifier box.
  const modifiers = (Array.isArray(s.modifiers) ? s.modifiers : [])
    .filter((m) => Array.isArray(m.box) && m.box.length === 6)
    .map((m) => ({
      minX: m.box[0] + offX, minY: m.box[1] + offY, minZ: m.box[2] + offZ,
      maxX: m.box[3] + offX, maxY: m.box[4] + offY, maxZ: m.box[5] + offZ,
      density: m.infillDensity != null ? m.infillDensity : null,
      pattern: m.infillPattern || null,
    }));

  // Top/bottom shell thickness (mm) overrides the layer counts when it implies
  // more shells than the configured counts (matches OrcaSlicer's *_shell_thickness).
  if (s.topShellThickness > 0) s.topLayers = Math.max(s.topLayers, Math.ceil(s.topShellThickness / layerHeight));
  if (s.bottomShellThickness > 0) s.bottomLayers = Math.max(s.bottomLayers, Math.ceil(s.bottomShellThickness / layerHeight));

  // Adaptive layer height: vary layer thickness by local surface slope — shallow
  // slopes get thin layers (smoother curves), vertical walls get thick layers
  // (fewer layers, faster). Builds a bottom→top schedule of {centre, top, h}.
  let zCenters = null, zTops = null, heights = null;
  if (s.adaptiveLayers && !opts.offset) {
    const minH = Math.max(0.04, s.minLayerHeight ?? Math.min(layerHeight, 0.08));
    const maxH = Math.max(minH + 0.01, s.maxLayerHeight ?? Math.max(layerHeight, layerHeight * 1.5));
    const cusp = s.adaptiveCusp ?? layerHeight * 0.4;
    const modelH = stats.bbox.size[2];
    const binH = minH / 2;
    const nb = Math.max(1, Math.ceil(modelH / binH));
    const req = new Float32Array(nb).fill(maxH);
    const P = recentered.positions, I = recentered.indices;
    const triCount = I ? I.length / 3 : P.length / 9;
    for (let t = 0; t < triCount; t++) {
      const i0 = (I ? I[t * 3] : t * 3) * 3, i1 = (I ? I[t * 3 + 1] : t * 3 + 1) * 3, i2 = (I ? I[t * 3 + 2] : t * 3 + 2) * 3;
      const ux = P[i1] - P[i0], uy = P[i1 + 1] - P[i0 + 1], uz = P[i1 + 2] - P[i0 + 2];
      const vx = P[i2] - P[i0], vy = P[i2 + 1] - P[i0 + 1], vz = P[i2 + 2] - P[i0 + 2];
      let nz = ux * vy - uy * vx;
      const nl = Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, nz);
      if (nl < 1e-9) continue;
      const anz = Math.abs(nz / nl);                                  // |cos(slope-from-horizontal)|
      const rh = anz < 1e-3 ? maxH : Math.max(minH, Math.min(maxH, cusp / anz));
      const z0 = Math.min(P[i0 + 2], P[i1 + 2], P[i2 + 2]), z1 = Math.max(P[i0 + 2], P[i1 + 2], P[i2 + 2]);
      for (let bb = Math.max(0, Math.floor(z0 / binH)); bb <= Math.min(nb - 1, Math.ceil(z1 / binH)); bb++) if (rh < req[bb]) req[bb] = rh;
    }
    zCenters = []; zTops = []; heights = [];
    let z = 0, guard = 0;
    while (z < modelH - 1e-6 && guard++ < 100000) {
      let h = maxH;
      for (let iter = 0; iter < 8; iter++) {
        let mn = maxH;
        for (let bb = Math.floor(z / binH); bb <= Math.min(nb - 1, Math.floor((z + h) / binH)); bb++) if (req[bb] < mn) mn = req[bb];
        if (mn >= h - 1e-6) break;
        h = Math.max(minH, mn);
      }
      if (z + h > modelH) h = Math.max(minH, modelH - z);
      zCenters.push(z + h / 2); zTops.push(z + h); heights.push(h);
      z += h;
    }
    numLayers = zCenters.length;
  } else if (Array.isArray(s.layerHeightBands) && s.layerHeightBands.length && !opts.offset) {
    // Interactive variable layer height: user-defined Z bands (model-local mm)
    // set an explicit layer thickness; outside the bands the default height is
    // used. Builds the same bottom→top {centre, top, h} schedule.
    const bands = s.layerHeightBands
      .map((b) => ({ z0: Number(b.z0), z1: Number(b.z1), h: Math.max(0.04, Number(b.h)) }))
      .filter((b) => b.z1 > b.z0 && b.h > 0);
    const modelH = stats.bbox.size[2];
    const hAt = (zz) => { for (const b of bands) if (zz >= b.z0 && zz < b.z1) return b.h; return layerHeight; };
    zCenters = []; zTops = []; heights = [];
    let z = 0, guard = 0;
    while (z < modelH - 1e-6 && guard++ < 100000) {
      let h = hAt(z + 1e-4);
      if (z + h > modelH) h = Math.max(0.04, modelH - z);
      zCenters.push(z + h / 2); zTops.push(z + h); heights.push(h);
      z += h;
    }
    numLayers = zCenters.length;
  } else if (s.initialLayerHeight > 0 && Math.abs(s.initialLayerHeight - layerHeight) > 1e-6 && !opts.offset) {
    // Thicker (or thinner) first layer for bed adhesion (BambuStudio
    // initial_layer_print_height): layer 0 = initialLayerHeight, the rest stack
    // at the normal height. Builds the same bottom→top {centre, top, h} schedule.
    const modelH = stats.bbox.size[2];
    zCenters = []; zTops = []; heights = [];
    let z = 0, guard = 0;
    while (z < modelH - 1e-6 && guard++ < 100000) {
      let h = zCenters.length === 0 ? s.initialLayerHeight : layerHeight;
      if (z + h > modelH) h = Math.max(0.04, modelH - z);
      zCenters.push(z + h / 2); zTops.push(z + h); heights.push(h);
      z += h;
    }
    numLayers = zCenters.length;
  }

  // Pass 1 — slice every layer into regions (needed up-front for supports).
  // The multi-material path passes `opts.layerRegions`: pre-unioned per-layer
  // outlines of the combined colour solid. Naively merging colour meshes leaves
  // their internal interface faces in the triangle soup, which slice into phantom
  // horizontal surfaces (mid-model solid shells + bridges). A true 2D union per
  // layer dissolves those interfaces, so we take the supplied regions verbatim.
  const layerRegions = [];
  for (let i = 0; i < numLayers; i++) {
    let regionsAtZ;
    if (opts.layerRegions) {
      regionsAtZ = opts.layerRegions[i] || [];
    } else {
      const z = zCenters ? zCenters[i] : (i + 0.5) * layerHeight;
      regionsAtZ = buildRegions(sliceLayer(recentered, z));
    }
    // Resolution: extra path simplification (drop vertices within `resolution` mm
    // of a straight line) → smaller G-code. Off (0) keeps the fine 0.01mm slice.
    if (s.resolution > 0) {
      regionsAtZ = regionsAtZ
        .map((r) => ({ outer: simplifyPolygon(r.outer, s.resolution), holes: (r.holes || []).map((h) => simplifyPolygon(h, s.resolution)).filter((h) => h.length >= 3) }))
        .filter((r) => r.outer.length >= 3);
    }
    layerRegions.push(regionsAtZ);
  }

  // Supports (optional) — overhang columns down to the bed. Runs when auto
  // support is on OR the user painted enforce regions (paint-only mode then
  // suppresses auto-overhang detection so only painted areas get support).
  let supportSegs = null;
  const treeStyle = /tree|organic/.test(String(s.supportStyle || '')) || /tree|organic/.test(String(s.supportType || ''));
  if (s.supports || paintEnforce.length) {
    // Tree/organic support (branching trunks) when selected and there's no
    // painted enforce/block — painting still uses the grid generator.
    if (treeStyle && s.supports && !paintEnforce.length && !paintBlock.length) {
      const { generateTreeSupports } = await import('./native-slicer-tree.js');
      supportSegs = generateTreeSupports(layerRegions, {
        gridRes: s.supportGridRes ?? 3, layerHeight, zGapLayers: s.supportZGap ?? 1,
        ...(s.supportTopZDist != null ? { zGapLayers: Math.max(0, Math.round(s.supportTopZDist / layerHeight)) } : {}),
        ...(s.treeBranchDistance > 0 ? { branchMerge: s.treeBranchDistance } : {}),
        ...(s.treeBranchAngle > 0 ? { branchDrift: Math.tan(Math.min(80, s.treeBranchAngle) * Math.PI / 180) * layerHeight } : {}),
      });
    } else {
      const { generateSupports } = await import('./native-slicer-support.js');
      supportSegs = generateSupports(layerRegions, {
        lineWidth: lw, gridRes: s.supportGridRes, density: s.supportDensity, xyGap: s.supportXYGap, zGapLayers: s.supportZGap, interfaceLayers: s.supportInterface, onPlateOnly: s.supportOnPlate,
        layerHeight, thresholdAngle: s.supportThreshold ?? 40, wallCount: s.supportWallCount ?? 0,
        removeSmallOverhangs: !!s.supportRemoveSmall, minOverhangArea: s.supportMinArea ?? 3,
        interfaceSpacing: s.supportInterfaceSpacing, basePattern: s.supportBasePattern, interfacePattern: s.supportInterfacePattern,
        ...(s.supportBottomZDist > 0 ? { bottomZGapLayers: Math.max(1, Math.round(s.supportBottomZDist / layerHeight)) } : {}),
        paintEnforce, paintBlock, paintOnly: !s.supports,
        // Top Z distance in mm overrides the layer-count gap when provided.
        ...(s.supportTopZDist != null ? { zGapLayers: Math.max(0, Math.round(s.supportTopZDist / layerHeight)) } : {}),
      });
    }
  }

  // Surface classifier — marks infill solid on real top/bottom faces
  // (including over holes/steps), not just the global first/last N layers.
  const surfaces = s.solidSurfaces === false ? null : buildSurfaceClassifier(layerRegions, {
    gridRes: s.surfaceGridRes ?? 2, topLayers: s.topLayers, bottomLayers: s.bottomLayers,
  });
  // Polygon fill-surfaces (libslic3r-style) — exact solid/sparse regions for the
  // MAIN fill, so boundaries are clean polygons, not a blocky grid mask. The grid
  // `surfaces` above stays for cheap point queries (ironing, surface speeds,
  // adaptive-cubic depth, only_one_wall_top). Opt-out via polygonSurfaces:false.
  // Normal-based top/bottom facet projection (roof/floor facets only) so sloped
  // walls aren't mistaken for solid skin — intersected inside buildSolidRegions
  // with the 2D exposure. Uses the same Z centres as the layer slices.
  const faceZc = zCenters ? zCenters : Array.from({ length: numLayers }, (_, i) => (i + 0.5) * layerHeight);
  const faceRegions = (surfaces && s.polygonSurfaces !== false && s.normalSurfaces !== false)
    ? topBottomFaceRegions(recentered, { numLayers, layerHeight, zCenters: faceZc, cosThreshold: s.surfaceCosThreshold ?? 0.707 })
    : null;
  const solidRegions = (surfaces && s.polygonSurfaces !== false)
    ? buildSolidRegions(layerRegions, {
        topLayers: s.topLayers, bottomLayers: s.bottomLayers, lineWidth: s.lineWidth,
        faceTop: faceRegions ? faceRegions.top : null, faceBottom: faceRegions ? faceRegions.bottom : null,
      })
    : null;
  const midSolid = (surfaces, i, sg) => surfaces.isSolidPoint(i, (sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2);

  // Split a connected infill polyline into maximal runs of segments that pass
  // `keepSeg` (a per-segment predicate taking a 2-point [[ax,ay],[bx,by]]).
  // Needed because infill is now emitted as continuous zigzag chains, so a
  // single chain can cross a classification boundary (solid↔sparse skin,
  // bridge-over-air↔supported); classifying by one endpoint would mis-assign
  // the whole path. Runs of < 2 points are dropped. A single-segment or
  // fully-passing chain returns intact.
  const splitPolyBySeg = (chain, keepSeg) => {
    if (chain.length < 2) return [];
    const runs = [];
    let run = null;
    for (let k = 0; k + 1 < chain.length; k++) {
      if (keepSeg([chain[k], chain[k + 1]])) {
        if (!run) run = [chain[k]];
        run.push(chain[k + 1]);
      } else if (run) { if (run.length >= 2) runs.push(run); run = null; }
    }
    if (run && run.length >= 2) runs.push(run);
    return runs;
  };

  // Distance from a point to the nearest edge of a polygon (unsigned).
  const _distPtSeg = (p, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1]; const l2 = dx * dx + dy * dy;
    let t = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0; t = t < 0 ? 0 : t > 1 ? 1 : t;
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
  };
  const _distToPoly = (p, poly) => { let m = Infinity; for (let i = 0; i < poly.length; i++) { const d = _distPtSeg(p, poly[i], poly[(i + 1) % poly.length]); if (d < m) m = d; } return m; };
  // Is (x,y) supported by solid material on the given regions? A point counts as
  // supported when it is inside an outer contour (and not deep inside a hole),
  // OR within a line-width of a contour edge — the tolerance keeps vertical
  // walls (whose contour matches the layer below) from being flagged as
  // overhangs, while a wall/skin that juts clearly past the layer below is not
  // supported. `offsetPolygon` is deliberately avoided (its miter over-grows
  // smooth contours). `tol` defaults to one line width.
  const supportedBy = (x, y, regions, tol) => {
    if (!regions) return true;
    const p = [x, y];
    for (const r of regions) {
      if (_pointInPoly(p, r.outer)) {
        let deepInHole = false;
        for (const h of (r.holes || [])) { if (_pointInPoly(p, h) && _distToPoly(p, h) >= tol) { deepInHole = true; break; } }
        if (!deepInHole) return true;
      } else if (_distToPoly(p, r.outer) < tol) {
        return true;
      }
    }
    return false;
  };
  const bridgeDetect = s.bridgeDetect !== false;
  const overhangDetect = s.overhangDetect !== false;

  // Pass 2 — walls + shells + infill (+ supports) per layer, as typed
  // paths so the preview can colour each feature like a desktop slicer.
  const layers = [];
  // Lightning infill: a top-down tree that only supports top/overhang surfaces,
  // leaving the deep interior hollow. Precomputed over all layer regions.
  let lightningSegs = null;
  if (s.infillPattern === 'lightning') {
    const { generateLightning } = await import('./native-slicer-lightning.js');
    lightningSegs = generateLightning(layerRegions, { lineWidth: lw, density: s.infillDensity });
  }

  for (let i = 0; i < numLayers; i++) {
    const regions = layerRegions[i];
    // This layer's slice height (adaptive-aware) — used by seam/fuzzy band tests.
    const z = zCenters ? zCenters[i] : (i + 0.5) * s.layerHeight;
    const adhesion = [];   // skirt/brim (layer 0)
    const walls = [];      // outer/inner/hole walls
    const fills = [];      // solid/sparse infill
    const globalSolid = i < s.bottomLayers || i >= numLayers - s.topLayers;
    // Combine infill every N layers: only lay sparse infill on every Nth layer
    // (at N× flow) to speed up prints. Solid shells are unaffected.
    const combN = Math.max(1, s.infillCombination | 0);
    const doSparse = (i % combN) === 0;
    const sparseFlow = combN;
    // Layer below — bottom skin over air (bridge) and overhang walls reference it.
    const below = i > 0 ? layerRegions[i - 1] : null;
    const segMidUnsupported = (sg) => !supportedBy((sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2, below, lw * 0.75);
    const wallOverhangFrac = (pts) => { if (!(overhangDetect && below)) return 0; let un = 0; for (const p of pts) if (!supportedBy(p[0], p[1], below, lw)) un++; return pts.length ? un / pts.length : 0; };
    // Per-point overhang degree 0..4 (0 = on support, 4 = a nozzle width or more
    // past the layer below) — how far each wall vertex hangs over air. Drives
    // per-segment speed grading (BambuStudio detect_overhang_degree).
    const overhangDegAt = (x, y) => {
      if (supportedBy(x, y, below, 0)) return 0;               // strictly over the lower slice
      for (let d = 1; d <= 4; d++) if (supportedBy(x, y, below, lw * 0.25 * d)) return d;
      return 4;                                                // fully unsupported
    };
    // Rolling-max smooth (window ±1) so a lone supported vertex between overhangs
    // doesn't briefly speed the head up — avoids feedrate oscillation.
    const smoothDegrees = (deg) => {
      const n = deg.length, out = new Array(n);
      for (let k = 0; k < n; k++) out[k] = Math.max(deg[(k - 1 + n) % n], deg[k], deg[(k + 1) % n]);
      return out;
    };
    // Hatch a solid region, splitting bottom-over-air lines out as bridges
    // (their own flow + speed + cooling). When bridge_angle is set the bridge
    // lines are hatched in that forced direction (a second pass), so they span
    // the gap the strong way regardless of the layer's base angle.
    // Top-/bottom-surface solid get their own speed (top_surface_speed /
    // bottom_surface_speed).
    // Classify a solid infill chain by which exposed surface it lies on, so it
    // gets BambuStudio's distinct feature label (Top surface / Bottom surface /
    // Internal solid infill) AND the matching surface speed. A chain that
    // touches the exposed top/bottom skin is labelled as that surface; anything
    // else is internal solid infill (solid shell sandwiched between skins).
    const classifySolid = (sg) => {
      if (!surfaces) return { feature: 'solid' };
      const mx = (sg[0][0] + sg[1][0]) / 2, my = (sg[0][1] + sg[1][1]) / 2;
      if (surfaces.isTopPoint(i, mx, my)) return s.topSurfaceSpeed ? { feature: 'top-surface', speedOverride: s.topSurfaceSpeed } : { feature: 'top-surface' };
      if (surfaces.isBottomPoint(i, mx, my)) return s.bottomSurfaceSpeed ? { feature: 'bottom-surface', speedOverride: s.bottomSurfaceSpeed } : { feature: 'bottom-surface' };
      return { feature: 'solid' };
    };
    const pushSolid = (sg) => fills.push({ closed: false, pts: sg, ...classifySolid(sg) });
    const pushBridge = (sg) => fills.push({ feature: 'bridge', closed: false, pts: sg, flow: s.bridgeFlow ?? 0.7 });
    // Internal bridge: hatch a whole solid-over-sparse region as one bridge pass,
    // spanning its shortest direction (BambuStudio bridge_over_infill). Bridge
    // flow + speed + cooling; the top surfaces above then have an anchored layer.
    const pushInternalBridge = (region, fallbackAngle) => {
      const ang = s.bridgeAngle != null ? s.bridgeAngle
        : (s.bridgeAngleAuto !== false ? bestBridgeAngle(region, () => false, lw) : fallbackAngle);
      const bf = s.bridgeFlow ?? 0.7;
      for (const chain of solidInfill(region, ang, lw, false, null)) fills.push({ feature: 'bridge', closed: false, pts: chain, flow: bf });
    };
    // Solid infill arrives as connected zigzag chains; keep-filter (genuine
    // solid surface) and bridge/solid classification are per-segment, so split
    // each chain at those boundaries instead of judging the whole path by one
    // endpoint. Kept runs stay continuous within their class.
    const supPt = (x, y) => supportedBy(x, y, below, lw * 0.75);
    // Cheap pre-check: does the region have ANY unsupported (bridge) area within
    // the kept surface? One COARSE hatch + midpoint tests, early-exit. Lets a
    // fully-supported region skip the expensive 12-angle bridge detection and
    // the support masking entirely — the common case, and what made complex
    // models take ~30 s to slice.
    // A region only counts as bridging when a MEANINGFUL FRACTION of it hangs
    // over air — not merely one unsupported edge sample. A mostly-supported
    // solid surface with a thin overhanging rim is filled as plain solid (its
    // rim just prints slower via overhang grading), matching BambuStudio which
    // reserves bridge flow/speed for genuinely unsupported spans. Without this
    // threshold a tapered/stepped part (Gridfinity pockets) bridge-splits nearly
    // every layer, inflating solid+bridge ~1.7x.
    const bridgeMinFrac = s.bridgeMinFraction ?? 0.2;
    const regionHasUnsupported = (region, keepPt) => {
      let total = 0, unsup = 0;
      for (const L of solidInfill(region, 0, lw * 4, true)) {
        const a = L[0], b = L[L.length - 1], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        if (keepPt && !keepPt(mx, my)) continue;
        total++;
        if (!supPt(mx, my)) unsup++;
      }
      return total > 0 && unsup / total >= bridgeMinFrac;
    };
    // `keepPt(x,y)` (optional) restricts the fill to a sub-area (the genuine
    // solid surface). The fill is generated MASKED — the scanline spans are
    // clipped to the kept/supported area before the zigzag connects — so each
    // solid or bridge patch is a continuous chain, not thousands of 2-point
    // pieces (what made complex/slotted models fragment into ~80k travels).
    const pushSolidRegion = (region, angle, keepPt, monotonic = false, noBridge = false) => {
      const bridgeSplit = bridgeDetect && below && !noBridge;
      const hasBridge = bridgeSplit && (s.bridgeAngle != null || regionHasUnsupported(region, keepPt));
      if (!hasBridge) {
        // Fully-supported (or bridge detection off): one solid pass, no masking.
        for (const chain of solidInfill(region, angle, lw, monotonic, keepPt || null)) pushSolid(chain);
        return;
      }
      const bridgeAngle = s.bridgeAngle != null ? s.bridgeAngle
        : (s.bridgeAngleAuto !== false ? bestBridgeAngle(region, supPt, lw) : null);
      // Solid = kept + supported; bridge = kept + over air, at the bridge angle.
      const solidMask = (x, y) => (!keepPt || keepPt(x, y)) && supPt(x, y);
      for (const chain of solidInfill(region, angle, lw, monotonic, solidMask)) pushSolid(chain);
      const bridgeMask = (x, y) => (!keepPt || keepPt(x, y)) && !supPt(x, y);
      for (const chain of solidInfill(region, bridgeAngle != null ? bridgeAngle : angle, lw, false, bridgeMask)) pushBridge(chain);
    };

    for (const region of regions) {
      // Elephant-foot compensation: pull the first layer's outer wall in a
      // touch so a squished first layer doesn't bulge past the model.
      let outerBoundary = region.outer;
      if (i === 0 && s.elephantFoot > 0) {
        const comp = offsetPolygon(outerBoundary, -s.elephantFoot);
        if (comp && comp.length >= 3) outerBoundary = comp;
      }
      // XY contour compensation: grow/shrink the outline to hit target
      // dimensions (offsets shrink from the squish/flow of the outer wall).
      if (s.xyContourCompensation) {
        const c = offsetPolygon(outerBoundary, s.xyContourCompensation);
        if (c && c.length >= 3) outerBoundary = c;
      }
      // precise_wall: pull the outer wall in by half its line width so the wall's
      // OUTER edge (not its centreline) lands on the model boundary — accurate
      // external dimensions. Off → centreline on the boundary (byte-identical).
      if (s.preciseWall) {
        const pc = offsetPolygon(outerBoundary, -(s.outerWallLineWidth ?? s.lineWidth) / 2);
        if (pc && pc.length >= 3) outerBoundary = pc;
      }
      // Vase / spiral mode: a single continuous outer wall that ramps up in
      // Z, above the solid base layers. No inner walls, infill, or top.
      if (s.spiralMode && i >= s.bottomLayers) {
        walls.push({ feature: 'outer-wall', closed: false, spiral: true, pts: outerBoundary });
        continue;
      }
      // Outer walls: shrink inward wall-by-wall (negative = inward).
      const seam = s.seamPosition;
      const seamCtx = s.seamPaint ? { enforce: s.seamPaint.enforce, block: s.seamPaint.block, z } : undefined;
      let inner = outerBoundary;
      // Fuzzy skin: perturb the wall outline. Global (s.fuzzySkin) or painted
      // (s.fuzzyPaint bands → only those wall stretches fuzz). Point distance and
      // first-layer behaviour are configurable; mode 'all' fuzzes inner walls too.
      const fuzzPaint = (s.fuzzyPaint && s.fuzzyPaint.enforce && s.fuzzyPaint.enforce.length) ? s.fuzzyPaint.enforce : null;
      const fuzzInBand = fuzzPaint ? ((x, y) => _inSeamBand(x, y, z, fuzzPaint)) : null;
      const fuzzOn = (s.fuzzySkin || fuzzPaint) && (i > 0 || s.fuzzySkinFirstLayer !== false);
      const fuzzPD = s.fuzzySkinPointDist ?? Math.max(0.3, lw);
      const fuzz = (poly) => fuzzifyPolygon(poly, s.fuzzySkinThickness, fuzzPD, fuzzInBand);
      const outerPts = fuzzOn ? fuzz(outerBoundary) : outerBoundary;
      const mainWalls = [{ feature: 'outer-wall', closed: true, pts: seamStart(outerPts, seam, seamCtx) }];
      const fuzzInner = fuzzOn && s.fuzzySkinMode === 'all';
      // only_one_wall_top: a top-surface region (nothing directly above) prints a
      // single perimeter for a cleaner top; the freed space becomes solid infill.
      let effLoops = wallLoops;
      if (i === 0 && s.firstLayerWallLoops > 0) effLoops = s.firstLayerWallLoops;
      if (s.onlyOneWallTop && surfaces) {
        let cxp = 0, cyp = 0; for (const p of outerBoundary) { cxp += p[0]; cyp += p[1]; }
        if (surfaces.isTopPoint(i, cxp / outerBoundary.length, cyp / outerBoundary.length)) effLoops = 1;
      }
      // Inner walls, MULTI-ISLAND aware: an inward offset can split a pinching
      // cross-section (U/L/C shape, a narrow neck) into several islands. Emit
      // inner walls for EVERY island so none silently loses its walls (the old
      // largest-only offset dropped the other arms' walls entirely). The infill
      // region follows the largest innermost island.
      let frontier = [outerBoundary];
      for (let p = 1; p < effLoops && frontier.length; p++) {
        const next = [];
        for (const isl of frontier) {
          for (const off of offsetPolygonAll(isl, -lw)) {
            if (!off || off.length < 3) continue;
            mainWalls.push({ feature: 'inner-wall', closed: true, pts: seamStart(fuzzInner ? fuzz(off) : off, seam, seamCtx) });
            next.push(off);
          }
        }
        frontier = next;
        // Infill region follows the largest innermost island of the last
        // non-empty frontier (updated only while walls keep being produced).
        if (next.length) inner = next.reduce((a, b) => Math.abs(_signedArea(b)) > Math.abs(_signedArea(a)) ? b : a);
      }
      // Overhang perimeters: record how much each wall juts over air. The
      // fraction drives the cooling-fan boost; the per-vertex degree array drives
      // a per-segment graduated slow-down (BambuStudio's overhang speed table) so
      // only the actually-overhanging stretches slow, not the whole loop.
      if (overhangDetect && below) for (const w of mainWalls) {
        const f = wallOverhangFrac(w.pts);
        if (f > 0.1) {
          w.overhangFrac = f;
          if (f > (s.overhangThreshold ?? 0.5)) w.overhang = true;
          w.overhangDeg = smoothDegrees(w.pts.map((p) => overhangDegAt(p[0], p[1])));
        }
      }
      // Wall print order (BambuStudio wall_sequence): outer-first (best surface),
      // inner-outer (best dimensional accuracy), or inner-outer-inner — print one
      // inner wall, then the outer against that backing, then the rest of the
      // inners. The backing lets the outer wall (and overhang walls) lay against
      // solid, Bambu's default for clean externals without sag.
      if (s.wallOrder === 'inner-outer' && mainWalls.length > 1) walls.push(...mainWalls.slice(1), mainWalls[0]);
      else if (s.wallOrder === 'inner-outer-inner' && mainWalls.length > 1) walls.push(mainWalls[1], mainWalls[0], ...mainWalls.slice(2));
      else walls.push(...mainWalls);
      // Hole walls: grow each hole outward into the solid.
      const grownHoles = [];
      for (const hole of region.holes) {
        // XY hole compensation: positive enlarges holes (counteracts the
        // tendency of holes to print undersized).
        let hw = hole;
        if (s.xyHoleCompensation) { const c = offsetPolygon(hole, s.xyHoleCompensation); if (c && c.length >= 3) hw = c; }
        // The loop bounding a hole/cavity faces air, so it is an EXTERNAL
        // perimeter (BambuStudio "Outer wall") — gets outer-wall speed/finish.
        // Loops grown outward from it into the solid are inner walls.
        walls.push({ feature: 'outer-wall', closed: true, pts: seamStart(hw, seam) });
        for (let p = 1; p < wallLoops; p++) {
          hw = offsetPolygon(hw, lw);
          if (!hw || hw.length < 3) break;
          walls.push({ feature: 'inner-wall', closed: true, pts: seamStart(hw, seam) });
        }
        grownHoles.push(hw);
      }
      // Infill region = innermost outer wall shrunk by the infill/wall gap,
      // holes grown by the same. `infillWallOverlap` (0..0.5 of a line width)
      // closes that gap so infill bonds to the walls instead of leaving a void.
      const infGap = lw * Math.max(0, 0.5 - (s.infillWallOverlap ?? 0));
      const infOuter = offsetPolygon(inner, -infGap);
      const infHoles = grownHoles.map(h => offsetPolygon(h, infGap)).filter(h => h && h.length >= 3);
      if (infOuter && infOuter.length >= 3) {
        const infRegion = { outer: infOuter, holes: infHoles };
        // Most patterns alternate 90° per layer for cross-layer bonding;
        // "aligned rectilinear" keeps a fixed direction on every layer.
        const aligned = s.infillPattern === 'alignedrectilinear';
        const baseAngle = s.infillAngle + (aligned ? 0 : (i % 2) * 90);
        // Sparse infill honoring modifier volumes. With no active modifier this
        // is byte-identical to a plain patternInfill; inside a modifier box the
        // lines use that modifier's density/pattern (boundary by line midpoint).
        const zc = zCenters ? zCenters[i] : (i + 0.5) * s.layerHeight;
        const ctxZ = (i + 1) * s.layerHeight;
        // infill_anchor: lengthen each straight infill line at both ends so it
        // reaches into the perimeter and bonds (BambuStudio infill_anchor).
        const anchorSegs = (segs) => {
          if (!(s.infillAnchor > 0)) return segs;
          const d = Math.min(s.infillAnchor, lw * 2);
          // Push each infill path's two ENDS outward along their terminal edge so
          // they reach into the perimeter and bond (BambuStudio infill_anchor).
          // Works for both 2-point lines and connected zigzag polylines.
          const push = (p, toward) => { const dx = p[0] - toward[0], dy = p[1] - toward[1], L = Math.hypot(dx, dy) || 1; return [p[0] + (dx / L) * d, p[1] + (dy / L) * d]; };
          return segs.map((sg) => {
            if (sg.length < 2) return sg;
            const o = sg.map((pt) => pt.slice());
            o[0] = push(sg[0], sg[1]);
            o[o.length - 1] = push(sg[o.length - 1], sg[o.length - 2]);
            return o;
          });
        };
        const sparseSegsFor = (region, maskFn = null) => {
          // Skip sparse infill in regions smaller than the minimum area (BambuStudio
          // minimum_sparse_infill_area) — tiny pockets aren't worth infilling.
          if (s.minSparseInfillArea > 0 && Math.abs(_signedArea(region.outer)) < s.minSparseInfillArea) return [];
          const active = modifiers.filter((m) => zc >= m.minZ && zc <= m.maxZ);
          // Adaptive cubic: cubic infill that's denser in the layers just below a
          // top skin (where it supports the top surface) and sparse deep inside —
          // per-cell via the surface classifier's depth-to-top field, so it saves
          // material without weakening tops. Falls back to plain cubic with no
          // surfaces. Modifiers not composed (rare combo).
          if (s.infillPattern === 'adaptivecubic' && surfaces && !active.length) {
            const nearZone = Math.max(s.topLayers + 2, Math.round(s.topLayers * 2.5));   // boost-band depth (layers)
            const depth = (sg) => surfaces.depthBelowTop(i, (sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2);
            const deep = patternInfill(region, s.infillDensity, baseAngle, lw, 'cubic', { z: ctxZ }).filter((sg) => depth(sg) > nearZone);
            const dense = patternInfill(region, Math.min(1, s.infillDensity * 2), baseAngle, lw, 'cubic', { z: ctxZ }).filter((sg) => { const d = depth(sg); return d > s.topLayers && d <= nearZone; });
            return anchorSegs([...deep, ...dense]);
          }
          const base = patternInfill(region, s.infillDensity, baseAngle, lw, s.infillPattern, { z: ctxZ }, maskFn);
          if (!active.length) return anchorSegs(base);
          const inAny = (x, y) => active.some((m) => x >= m.minX && x <= m.maxX && y >= m.minY && y <= m.maxY);
          const out = base.filter((sg) => !inAny((sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2));
          for (const m of active) {
            const dens = m.density != null ? m.density : s.infillDensity;
            const pat = m.pattern || s.infillPattern;
            for (const sg of patternInfill(region, dens, baseAngle, lw, pat, { z: ctxZ })) {
              const mx = (sg[0][0] + sg[1][0]) / 2, my = (sg[0][1] + sg[1][1]) / 2;
              if (mx >= m.minX && mx <= m.maxX && my >= m.minY && my <= m.maxY) out.push(sg);
            }
          }
          return anchorSegs(out);
        };
        // Concentric infill = closed rings stepping inward. `dense` fills solid
        // (spacing = line width) for solid/top-surface rings.
        const concentric = (region2, feat, dense) => {
          const spacing = dense ? lw : Math.max(lw, lw / Math.max(0.05, Math.min(1, s.infillDensity)));
          let ring = offsetPolygon(region2.outer, -spacing);
          while (ring && ring.length >= 3) {
            fills.push({ feature: feat, closed: true, pts: ring });
            ring = offsetPolygon(ring, -spacing);
          }
        };
        const solidConcentric = s.topSurfacePattern === 'concentric';
        // Arachne split: a sparse channel narrower than ~a few line widths can't
        // hold an effective sparse cross-hatch — it prints as a messy speckle of
        // tiny dashes (what we saw filling a 3-4 mm wall). BambuStudio fills such
        // thin sections with WALLS/beads, not sparse. So split each sparse region
        // into its THICK CORE (keeps the sparse pattern) and its THIN BITS
        // (Arachne beads, or concentric perimeters), via a morphological opening.
        // Thin fingers that hang off a thick core are caught too, since the open
        // erases them from the core. wall_generator=classic keeps the old sparse.
        const narrowFillWidth = lw * 5;                       // ~2.1mm at 0.42
        const arachneFill = s.wallGenerator !== 'classic' && s.gapFill !== false;
        const thickCoreOf = (region) => {
          if (!arachneFill || !region.outer || region.outer.length < 3) return [region];
          const er = _clipExpand([region], -narrowFillWidth / 2);
          return er.length ? _clipExpand(er, narrowFillWidth / 2) : [];
        };
        // Fill a region's THIN BITS (region minus its thick core) with beads or,
        // where a bead can't run, concentric perimeters — so nothing is left void.
        const beadThinBits = (region, thick) => {
          if (!arachneFill) return;
          const thin = thick.length ? _clipDifference([region], thick) : [region];
          const bf = s.gapFillFlow ?? 1;
          for (const tp of thin) {
            if (!tp.outer || tp.outer.length < 3) continue;
            // Full Arachne: the beading strategy splits a wider core into the
            // right number of variable-width beads; a thin core stays one bead
            // (identical to the single medial bead). Opt out via arachneFull:false.
            const beads = (s.arachneFull !== false) ? arachneBeads(tp, lw) : medialBeads(tp, lw);
            if (beads && beads.length) { for (const b of beads) fills.push({ feature: 'gap', closed: false, pts: b.pts, widths: b.widths, baseW: lw, flow: bf }); continue; }
            let ring = offsetPolygon(tp.outer, -lw * 0.5), guard = 0;
            while (ring && ring.length >= 3 && guard++ < 30) { fills.push({ feature: 'inner-wall', closed: true, pts: ring }); ring = offsetPolygon(ring, -lw); }
          }
        };
        // Gap fill: a thin infill region (its own inward offset collapses, i.e.
        // narrower than ~2 line widths) can't hold meaningful sparse infill —
        // it would print as air. Fill it solid instead, the way a real slicer's
        // gap fill closes thin ribs and necks. Only on sparse layers; solid
        // shells are already dense.
        const thinProbe = offsetPolygon(infOuter, -lw);
        const thinRegion = s.gapFill !== false && !globalSolid && (!thinProbe || thinProbe.length < 3);
        // Full Arachne — thin FINGERS inside a thick part: a whole-region gap
        // fill only triggers when the ENTIRE contour is thin, so a thick body
        // with a thin neck/tab left that neck as a void (walls don't fill it,
        // sparse infill is too coarse for a <2·lw strip). medialBeads run on the
        // whole region self-limits to thin ridges (thick cores yield no bead —
        // verified), so it lays a continuous variable-width bead down every thin
        // finger while the thick core still gets normal infill. Opt-in (arachne),
        // sparse layers only; a purely thick part gets no beads → byte-identical.
        // (Thin necks inside a thick body are handled per sparse sub-region by
        // fillNarrowAsWalls below — concentric perimeters instead of a coarse
        // sparse cross-hatch — so no separate whole-region finger-bead pass is
        // needed; running both would double-fill the channel.)
        if (thinRegion) {
          // Thin-wall gap fill. A perpendicular zigzag hatch (the old default)
          // leaves a messy cross-hatch in narrow ribs; instead run a continuous
          // variable-width bead down the region's medial axis — clean, seamless,
          // and matching the local width, the way BambuStudio's Arachne fills a
          // thin wall. Only fall back to the hatch when no bead is found (opt out
          // of beads with wall_generator=classic for byte-identical old output).
          const arachne = s.wallGenerator !== 'classic';
          const gapBaseFlow = s.gapFillFlow ?? 1;
          const beads = arachne ? medialBeads(infRegion, lw) : null;
          if (beads && beads.length) {
            for (const bead of beads) fills.push({ feature: 'gap', closed: false, pts: bead.pts, widths: bead.widths, baseW: lw, flow: gapBaseFlow });
          } else {
            for (const sg of solidInfill(infRegion, baseAngle, lw)) {
              // filter_out_small_gaps: skip gap-fill lines shorter than the limit
              // (avoids tiny stringy dabs). 0 = keep all (byte-identical).
              if (s.gapFillMinLength > 0 && Math.hypot(sg[1][0] - sg[0][0], sg[1][1] - sg[0][1]) < s.gapFillMinLength) continue;
              let flow = gapBaseFlow;
              if (arachne) {
                // fallback (no bead found): scale flow by local width.
                const w = 2 * _distToRegionEdge((sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2, infRegion);
                flow = gapBaseFlow * Math.max(0.25, Math.min(1.6, w / lw));
              }
              fills.push({ feature: 'gap', closed: false, pts: sg, flow });
            }
          }
        } else if (solidRegions) {
          // POLYGON fill surfaces (libslic3r-style): fill the exact solid and
          // sparse sub-regions of this layer's infill area. Clean polygon
          // boundaries — no grid blockiness, no hatch-then-mask fragmentation.
          const solidSubs = solidRegions.solidIn(i, infRegion);
          for (const sub of solidSubs) {
            if (!sub.outer || sub.outer.length < 3) continue;
            let cxp = 0, cyp = 0; for (const p of sub.outer) { cxp += p[0]; cyp += p[1]; }
            cxp /= sub.outer.length; cyp /= sub.outer.length;
            // Exposed top/bottom skin → monotonic uniform finish, but ONLY on
            // large surfaces: monotonic prints each line separately (a travel
            // each), so on a part with many tiny exposed faces (slot floors) it
            // explodes travels for no visible gain. Small faces → connected zigzag.
            const isTB = surfaces.isTopPoint(i, cxp, cyp) || surfaces.isBottomPoint(i, cxp, cyp);
            if (solidConcentric && isTB) { concentric(sub, 'solid', true); continue; }
            // Monotonic (same-direction) only on the globally-exposed top/bottom
            // faces of the whole part — the visible skin. Interior top surfaces
            // (slot floors, steps) use connected zigzag: monotonic prints each
            // line as a separate travel, so applying it to every small interior
            // face explodes travel count for no visible gain.
            const globalFace = (i === 0 || i === numLayers - 1);
            const mono = isTB && globalFace && s.monotonicTopSurface !== false && Math.abs(_signedArea(sub.outer)) > (s.monotonicMinArea ?? 4);
            // A pure TOP surface sits on material below → never a bridge; skip the
            // bridge pre-check there (a big slice-time saving on featured models).
            const noBridge = surfaces.isTopPoint(i, cxp, cyp) && !surfaces.isBottomPoint(i, cxp, cyp);
            // Internal bridge: the portion of this solid sub that lies over sparse
            // infill (lowest top-shell layer) is laid as a bridge; the rest stays
            // solid. Anchors the top surfaces above (BambuStudio bridge_over_infill).
            const ibParts = s.internalBridge === false ? [] : solidRegions.internalBridgeIn(i, sub);
            if (ibParts.length) {
              for (const ibp of ibParts) if (ibp.outer && ibp.outer.length >= 3) pushInternalBridge(ibp, baseAngle);
              for (const rest of _clipDifference([sub], ibParts)) if (rest.outer && rest.outer.length >= 3) pushSolidRegion(rest, baseAngle, null, mono, noBridge);
            } else {
              pushSolidRegion(sub, baseAngle, null, mono, noBridge);
            }
          }
          if (doSparse && s.infillPattern !== 'lightning') {
            const sparseSubs = solidRegions.sparseIn(i, infRegion);
            for (const sub of sparseSubs) {
              if (!sub.outer || sub.outer.length < 3) continue;
              const thick = thickCoreOf(sub);
              beadThinBits(sub, thick);                       // thin bits → Arachne beads/walls
              for (const tc of thick) {                       // thick core → sparse
                if (!tc.outer || tc.outer.length < 3) continue;
                if (s.infillPattern === 'concentric') { concentric(tc, 'sparse', false); continue; }
                for (const sg of sparseSegsFor(tc)) fills.push({ feature: 'sparse', closed: false, pts: sg, flow: sparseFlow });
              }
            }
          }
        } else if (!surfaces || globalSolid) {
          // No surface detection (or a global shell layer): fill uniformly.
          if (!globalSolid && s.infillPattern === 'concentric') { if (doSparse) concentric(infRegion, 'sparse', false); }
          else if (globalSolid && solidConcentric) { concentric(infRegion, 'solid', true); }
          else if (globalSolid) {
            // Only the EXPOSED faces (very top + very bottom layer) are visible
            // skin → monotonic ordering there for a uniform surface. The hidden
            // internal solid shells keep the efficient connected zigzag.
            const exposed = i === 0 || i === numLayers - 1;
            pushSolidRegion(infRegion, baseAngle, undefined, exposed && s.monotonicTopSurface !== false);
          } else if (doSparse && s.infillPattern !== 'lightning') {
            const thick = thickCoreOf(infRegion);
            beadThinBits(infRegion, thick);
            for (const tc of thick) {
              if (!tc.outer || tc.outer.length < 3) continue;
              for (const sg of sparseSegsFor(tc)) fills.push({ feature: 'sparse', closed: false, pts: sg, flow: sparseFlow });
            }
          }
        } else {
          // Per-surface: solid where this is a top/bottom face, sparse elsewhere.
          // If this region's solid IS an exposed skin (a real top/bottom face,
          // including curved/stepped surfaces like a dome), lay it monotonically
          // for a uniform finish — decided per region (single hatch, no coverage
          // loss) from whether the region centre is a top/bottom surface point.
          let cxp = 0, cyp = 0; for (const p of infRegion.outer) { cxp += p[0]; cyp += p[1]; }
          cxp /= infRegion.outer.length; cyp /= infRegion.outer.length;
          const monoSurf = s.monotonicTopSurface !== false && (surfaces.isTopPoint(i, cxp, cyp) || surfaces.isBottomPoint(i, cxp, cyp));
          pushSolidRegion(infRegion, baseAngle, (x, y) => surfaces.isSolidPoint(i, x, y), monoSurf);
          if (s.infillPattern === 'concentric') { if (doSparse) concentric(infRegion, 'sparse', false); }
          else if (doSparse && s.infillPattern !== 'lightning') {
            // Keep only the parts of each sparse chain NOT over a solid surface
            // (the solid pass covers those). Sparse lines are widely spaced, so
            // masking-before-connect fragments their long connectors — the
            // post-split keeps them longer, so split rather than mask here.
            const sparseSegs = sparseSegsFor(infRegion).flatMap((sg) => splitPolyBySeg(sg, (seg) => !midSolid(surfaces, i, seg)));
            for (const sg of sparseSegs) fills.push({ feature: 'sparse', closed: false, pts: sg, flow: sparseFlow });
          }
        }
        // Ironing: a fine, low-flow pass over the true top skin to smooth it.
        // Direction and line spacing are configurable (ironing_direction /
        // ironing_spacing); default is a 45° cross-hatch at half a line width.
        if (s.ironing && surfaces) {
          const ironBase = s.ironingDirection != null ? s.ironingDirection : s.infillAngle + 45;
          const ironAngle = ironBase + (i % 2) * 90;
          const ironSpacing = s.ironingSpacing != null ? s.ironingSpacing : lw * (s.ironingSpacingFactor ?? 0.5);
          // ironing_inset pulls the ironing pass in from the edge; ironing_pattern
          // 'concentric' rings instead of straight lines.
          let ironRegion = infRegion;
          if (s.ironingInset > 0) { const io = offsetPolygon(infRegion.outer, -s.ironingInset); if (io && io.length >= 3) ironRegion = { outer: io, holes: infRegion.holes }; }
          const isTop = (a, b) => surfaces.isTopPoint(i, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
          if (s.ironingPattern === 'concentric') {
            let ring = offsetPolygon(ironRegion.outer, -ironSpacing);
            while (ring && ring.length >= 3) {
              if (isTop(ring[0], ring[Math.floor(ring.length / 2)])) fills.push({ feature: 'ironing', closed: true, pts: ring, flow: s.ironingFlow ?? 0.15 });
              ring = offsetPolygon(ring, -ironSpacing);
            }
          } else {
            const ironSegs = regionInfill(ironRegion, 1.0, ironAngle, ironSpacing).filter((sg) => isTop(sg[0], sg[1]));
            for (const sg of ironSegs) fills.push({ feature: 'ironing', closed: false, pts: sg, flow: s.ironingFlow ?? 0.15 });
          }
        }
      }
    }

    // Skirt + brim on the first layer only. A raft provides its own adhesion,
    // so brim/skirt are suppressed when a raft is active.
    if (i === 0 && !(s.raftLayers > 0)) {
      for (const region of regions) {
        const brimType = s.brimType || 'outer_only';
        const brimW = brimType === 'no_brim' ? 0 : (s.brimWidth || 0);
        const brimLoops = Math.max(0, Math.round(brimW / lw));
        if (brimType === 'brim_ears' && brimLoops > 0) {
          // Mouse ears: concentric discs at sharp convex corners only.
          for (const [ex, ey] of _brimEars(region.outer)) {
            for (let b = 1; b <= brimLoops; b++) {
              adhesion.push({ feature: 'brim', closed: true, pts: _circlePoly(ex, ey, b * lw) });
            }
          }
        } else {
          // brim_object_gap leaves a small gap between object and brim (easier removal).
          let ring = s.brimObjectGap > 0 ? (offsetPolygon(region.outer, s.brimObjectGap) || region.outer) : region.outer;
          for (let b = 0; b < brimLoops; b++) {
            ring = offsetPolygon(ring, lw);
            if (!ring || ring.length < 3) break;
            adhesion.push({ feature: 'brim', closed: true, pts: ring });
          }
        }
      }
    }

    // Skirt: priming loops around the object, for `skirtHeight` layers (default
    // 1 = first layer only). On layer 0 it sits outside any outer-loop brim.
    if (i < Math.max(1, s.skirtHeight ?? 1) && !(s.raftLayers > 0) && s.skirtLoops > 0) {
      for (const region of regions) {
        let brimRing = 0;
        if (i === 0) {
          const brimType = s.brimType || 'outer_only';
          const brimLoops = Math.max(0, Math.round((brimType === 'no_brim' ? 0 : (s.brimWidth || 0)) / lw));
          brimRing = brimType === 'outer_only' ? (s.brimObjectGap || 0) + brimLoops * lw : 0;
        }
        let sk = offsetPolygon(region.outer, s.skirtGap + brimRing);
        for (let k = 0; k < s.skirtLoops; k++) {
          if (!sk || sk.length < 3) break;
          adhesion.push({ feature: 'skirt', closed: true, pts: sk });
          sk = offsetPolygon(sk, lw);
        }
      }
    }

    // Draft shield: a wall around the object on every layer, blocking drafts.
    if (s.draftShield) {
      for (const region of regions) {
        const ring = offsetPolygon(region.outer, s.draftShieldGap);
        if (ring && ring.length >= 3) adhesion.push({ feature: 'skirt', closed: true, pts: ring });
      }
    }

    // Support hatch.
    const support = [];
    if (supportSegs && supportSegs[i]) for (const el of supportSegs[i]) support.push(el.iface ? { feature: 'support-interface', closed: !!el.closed, pts: el.pts, ...(s.supportInterfaceSpeed ? { speedOverride: s.supportInterfaceSpeed } : {}) } : { feature: 'support', closed: !!el.closed, pts: el.pts });

    // Print order: adhesion → walls → infill → support. `regions` rides along
    // so the G-code stage can route avoid-crossing-walls travel.
    // Lightning tree edges for this layer (sparse infill only; solid shells and
    // gap fill above are still emitted per-region). Skipped on global-solid
    // shell layers (those are already filled solid).
    if (lightningSegs && !globalSolid && (i % Math.max(1, s.infillCombination | 0)) === 0) {
      for (const sg of lightningSegs[i]) fills.push({ feature: 'sparse', closed: false, pts: sg, flow: sparseFlow });
    }
    layers.push({ paths: [...adhesion, ...walls, ...fills, ...support], regions, ...(zTops ? { z: zTops[i], h: heights[i] } : {}) });
  }

  // Raft: prepend base layers and lift the object. Uniform-height object layers
  // re-index (default z = (idx+1)*layerHeight shifts up automatically); adaptive
  // layers carry explicit z, so shift those by the raft thickness.
  if (s.raftLayers > 0 && layers.length) {
    const raft = _buildRaft(layers[0].regions, s, s.lineWidth, offsetPolygon, solidInfill);
    if (raft.length) {
      if (zTops) { const shift = raft.length * s.layerHeight; for (const L of layers) if (L.z != null) L.z += shift; }
      layers.unshift(...raft);
      numLayers += raft.length;
    }
  }

  return { layers, s, bbox: stats.bbox, numLayers, triangles: recentered.indices.length / 3 };
}

/** End-to-end single-mesh slice → G-code. */
export async function sliceMeshToGcode(mesh, settings = {}) {
  const { layers, s, bbox, triangles } = await sliceMeshToLayers(mesh, settings);
  return { gcode: layersToGcode(layers, s), layers: layers.length, bbox, triangles, supported: !!s.supports };
}

/**
 * Slice several objects on one plate, each with its own settings (merged over
 * the global settings), into a single G-code. Path-affecting overrides (walls,
 * infill, top/bottom, supports, pattern, ironing…) are honoured per object;
 * layer height stays global so the layers interleave. Objects keep their
 * relative positions via a shared recenter.
 *
 * @param {Array<{mesh:object, settings?:object}>} objects
 */
export async function sliceObjectsGcode(objects, globalSettings = {}) {
  const lh = globalSettings.layerHeight ?? 0.2;
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const o of objects) {
    const p = o.mesh.positions;
    for (let i = 0; i < p.length; i += 3) {
      if (p[i] < minX) minX = p[i]; if (p[i] > maxX) maxX = p[i];
      if (p[i + 1] < minY) minY = p[i + 1]; if (p[i + 1] > maxY) maxY = p[i + 1];
      if (p[i + 2] < minZ) minZ = p[i + 2]; if (p[i + 2] > maxZ) maxZ = p[i + 2];
    }
  }
  const offset = [(minX + maxX) / 2, (minY + maxY) / 2, minZ];
  const numLayers = Math.max(1, Math.floor((maxZ - minZ) / lh));

  const bySequence = globalSettings.printSequence === 'by_object' && objects.length > 1;

  // ── Sequential (by-object) printing: each object is printed to full height
  // before the next. Objects keep their XY layout (shared offset) but each is
  // sliced to its OWN height; the combined stack carries explicit per-object z,
  // with an OBJECT_CHANGE Z-hop between them. A clearance warning is returned
  // when a not-last object is taller than the gantry clearance.
  if (bySequence) {
    const clearanceH = globalSettings.extruderClearanceHeight ?? 25;
    const combined = [];
    const heights = [];
    for (let oi = 0; oi < objects.length; oi++) {
      const o = objects[oi];
      const settings = { ...globalSettings, ...(o.settings || {}), layerHeight: lh };
      const { layers } = await sliceMeshToLayers(o.mesh, settings, { offset });
      heights.push(layers.length * lh);
      layers.forEach((L, k) => {
        combined.push({ ...L, z: (k + 1) * lh, ...(k === 0 && oi > 0 ? { seqStart: oi + 1 } : {}) });
      });
    }
    const warnings = [];
    for (let oi = 0; oi < heights.length - 1; oi++) {
      if (heights[oi] > clearanceH) { warnings.push(`Object ${oi + 1} is ${heights[oi].toFixed(0)}mm tall (> ${clearanceH}mm gantry clearance) — the toolhead may hit it while printing a later object.`); }
    }
    return {
      gcode: layersToGcode(combined, { ...globalSettings, layerHeight: lh, seqClearanceZ: Math.max(...heights) + 5 }),
      layers: combined.length, objects: objects.length, sequential: true, warnings,
    };
  }

  const perObj = [];
  for (const o of objects) {
    const settings = { ...globalSettings, ...(o.settings || {}), layerHeight: lh };
    const { layers } = await sliceMeshToLayers(o.mesh, settings, { offset, numLayers });
    perObj.push(layers);
  }

  // Object labels (BambuStudio gcode_label_objects) for printer exclude-object:
  // tag each object's paths so the emitter can wrap them per object.
  const label = !!globalSettings.gcodeLabelObjects;
  const combined = [];
  for (let i = 0; i < numLayers; i++) {
    const paths = [];
    perObj.forEach((layers, oi) => {
      if (layers[i] && layers[i].paths) {
        const nm = objects[oi].name || `object_${oi + 1}`;
        for (const p of layers[i].paths) paths.push(label ? { ...p, obj: nm } : p);
      }
    });
    combined.push({ paths });
  }
  return { gcode: layersToGcode(combined, { ...globalSettings, layerHeight: lh }), layers: numLayers, objects: objects.length };
}

export const _internals = { _chainSegments, _signedArea, _isCCW, _near, _bbox, _pointInPoly, EPS };
