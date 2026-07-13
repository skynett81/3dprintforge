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
  sliceLayer, offsetPolygon, lineInfill, regionInfill, solidInfill,
  patternInfill, buildRegions, fuzzifyPolygon, EPS, PI, _bbox, _isCCW, _signedArea, _near,
  _chainSegments, _pointInPoly,
} from './native-slicer-geo.js';
import { buildSurfaceClassifier } from './native-slicer-surfaces.js';

const FILAMENT_DIAM = 1.75;

// Re-export the geometry primitives so existing importers/tests keep working.
export { sliceLayer, offsetPolygon, lineInfill, regionInfill, solidInfill, buildRegions };

/**
 * Rotate a closed wall loop so it starts at the chosen seam vertex, so the
 * seam lands consistently (aligned/back) or scattered (random). 'nearest'
 * (default) leaves the loop as-is.
 */
export function seamStart(poly, mode) {
  if (!poly || poly.length < 3) return poly;
  let idx = -1;
  if (mode === 'back' || mode === 'rear' || mode === 'aligned') {
    let best = -Infinity;
    for (let i = 0; i < poly.length; i++) if (poly[i][1] > best) { best = poly[i][1]; idx = i; }
  } else if (mode === 'random') {
    // Deterministic pseudo-random by the loop's own geometry (no Math.random).
    const seed = Math.abs(Math.round((poly[0][0] + poly[1][1]) * 131) + poly.length * 977);
    idx = seed % poly.length;
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
    `M190 S${bed0}`,
    `M109 S${noz0}`,
    `G92 E0`,
    `G90`,
    `M82`,
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
    sparse: s.sparseInfillSpeed ?? P,
    support: s.supportSpeed ?? P,
    ironing: s.ironingSpeed ?? Math.max(15, P * 0.4),
    bridge: s.bridgeSpeed ?? Math.max(15, P * 0.5),
    skirt: s.outerWallSpeed ?? P,
    brim: s.outerWallSpeed ?? P,
    wall: P,
  };
  const featSpeed = (feature, layerIdx) => (layerIdx === 0 ? s.firstLayerSpeed : (SP[feature] ?? P));
  // Extrusion factor: volume of a 1 mm path = lineWidth * layerHeight,
  // E (mm filament) = volume / (π · (filamentDiam/2)²).
  const efOf = (w) => (w * s.layerHeight) / (PI * (s.filamentDiam / 2) ** 2);
  const efactor = efOf(s.lineWidth);
  // Per-feature line widths (extrusion width). Fall back to lineWidth.
  const LW = {
    'outer-wall': s.outerWallLineWidth ?? s.lineWidth,
    'inner-wall': s.innerWallLineWidth ?? s.lineWidth,
    solid: s.solidInfillLineWidth ?? s.lineWidth,
    sparse: s.sparseInfillLineWidth ?? s.lineWidth,
    support: s.supportLineWidth ?? s.lineWidth,
    bridge: s.bridgeLineWidth ?? s.lineWidth,
  };
  const efFeat = (feature, layerIdx) => (layerIdx === 0 && s.initialLayerLineWidth)
    ? efOf(s.initialLayerLineWidth) : efOf(LW[feature] ?? s.lineWidth);
  const zHop = s.zHop ?? 0;

  let g = '';
  g += `; Generated by 3DPrintForge native slicer\n`;
  g += `; Layers: ${layers.length}, layer height: ${s.layerHeight} mm\n`;
  g += `; Material: ${s.material}, nozzle ${s.nozzleTemp}C, bed ${s.bedTemp}C\n`;
  g += `; estimated_time: 0\n`;
  g += (s.startGcode ? _interp(s.startGcode, s) + '\n' : _defaultStart(s));

  // Acceleration / jerk control (Marlin M204/M205). Emitted regardless of a
  // custom start block so per-feature motion tuning still applies. The first
  // layer can use its own (usually lower) acceleration for adhesion.
  if (s.acceleration) g += `M204 P${s.initialLayerAccel ?? s.acceleration} T${s.travelAccel ?? s.acceleration}\n`;
  if (s.jerk) g += `M205 X${s.jerk} Y${s.jerk}\n`;

  let e = 0;
  let curX = 0, curY = 0, curZ = 0;
  let curFanG = -1;   // last-emitted M106 S value (PWM 0-255), for overhang cooling

  // Prime line (skip when a custom start gcode already primes, or when
  // reduce-waste is on). A shorter prime line also cuts wasted filament.
  if (!s.startGcode && !s.reduceWaste) {
    const primeLen = s.primeLineLength ?? 60;
    g += `; --- prime line ---\n`;
    g += `G1 Z0.3 F${s.travelSpeed * 60}\n`;
    g += `G1 X20 Y20 F${s.travelSpeed * 60}\n`;
    g += `G1 X${20 + primeLen} Y20 E${(primeLen * efactor).toFixed(4)} F${s.firstLayerSpeed * 60}\n`;
    g += `G92 E0\n`;
    curX = 20 + primeLen; curY = 20; curZ = 0.3;
  }

  const retractFeed = (s.retractionSpeed ?? s.travelSpeed) * 60;
  const deretractFeed = (s.deretractionSpeed ?? s.retractionSpeed ?? s.travelSpeed) * 60;
  const wipeFeed = (s.wipeSpeed ?? s.travelSpeed) * 60;
  let lastPath = null;   // points of the path just printed, for wipe-on-retract
  const emitPath = (pts, speed, closed, flow = 1, ef = efactor * flow) => {
    if (pts.length < 2) return;
    const first = pts[0];
    // Wipe-on-retract: draw the nozzle back over the path just printed while
    // retracting, so the pressure bleeds onto existing extrusion (no blob/ooze
    // at the seam) instead of a stationary retract.
    if (s.wipe && lastPath && lastPath.length >= 2 && s.retraction > 0) {
      const rev = [...lastPath].reverse();
      const wipeDist = s.wipeDistance ?? 2;
      const wipePts = [rev[0]]; let acc = 0;
      for (let i = 1; i < rev.length && acc < wipeDist; i++) { acc += Math.hypot(rev[i][0] - rev[i - 1][0], rev[i][1] - rev[i - 1][1]); wipePts.push(rev[i]); }
      const total = acc || 1; const startE = e; let done = 0;
      for (let i = 1; i < wipePts.length; i++) {
        done += Math.hypot(wipePts[i][0] - wipePts[i - 1][0], wipePts[i][1] - wipePts[i - 1][1]);
        const eNow = startE - s.retraction * Math.min(1, done / total);
        g += `G1 X${wipePts[i][0].toFixed(3)} Y${wipePts[i][1].toFixed(3)} E${eNow.toFixed(4)} F${wipeFeed}\n`;
      }
      e = startE - s.retraction; curX = wipePts[wipePts.length - 1][0]; curY = wipePts[wipePts.length - 1][1];
    } else {
      e -= s.retraction; g += `G1 E${e.toFixed(4)} F${retractFeed.toFixed(0)}\n`;
    }
    if (zHop > 0) g += `G1 Z${(curZ + zHop).toFixed(3)} F${s.travelSpeed * 60}\n`;
    g += `G0 X${first[0].toFixed(3)} Y${first[1].toFixed(3)} F${s.travelSpeed * 60}\n`;
    if (zHop > 0) g += `G1 Z${curZ.toFixed(3)} F${s.travelSpeed * 60}\n`;
    e += s.retraction; g += `G1 E${e.toFixed(4)} F${deretractFeed.toFixed(0)}\n`;
    curX = first[0]; curY = first[1];
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      const d = Math.hypot(p[0] - curX, p[1] - curY);
      e += d * ef;
      g += `G1 X${p[0].toFixed(3)} Y${p[1].toFixed(3)} E${e.toFixed(4)} F${speed * 60}\n`;
      curX = p[0]; curY = p[1];
    }
    if (closed) {
      const d = Math.hypot(first[0] - curX, first[1] - curY);
      if (d > EPS) {
        e += d * ef;
        g += `G1 X${first[0].toFixed(3)} Y${first[1].toFixed(3)} E${e.toFixed(4)} F${speed * 60}\n`;
        curX = first[0]; curY = first[1];
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
      g += `G1 X${loop[i][0].toFixed(3)} Y${loop[i][1].toFixed(3)} Z${zz.toFixed(3)} E${e.toFixed(4)} F${speed * 60}\n`;
      curX = loop[i][0]; curY = loop[i][1]; curZ = zz;
    }
  };

  const pathLen = (pts, closed) => {
    let L = 0;
    for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (closed && pts.length > 2) L += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
    return L;
  };

  layers.forEach((layer, layerIdx) => {
    const z = (layerIdx + 1) * s.layerHeight;
    const paths = layer.paths || [
      ...(layer.perimeters || []).map((p) => ({ feature: 'wall', closed: true, pts: p })),
      ...(layer.infill || []).map((sgm) => ({ feature: 'sparse', closed: false, pts: sgm })),
    ];
    const spiral = paths.some((p) => p.spiral);
    g += `; --- layer ${layerIdx + 1}/${layers.length} z=${z.toFixed(3)} ---\n`;
    g += `;LAYER_CHANGE\n;Z:${z.toFixed(3)}\n`;
    if (!spiral) { g += `G1 Z${z.toFixed(3)} F${s.travelSpeed * 60}\n`; curZ = z; }
    // Custom per-layer G-code hook (e.g. timelapse snapshot, Z-offset tweak).
    if (s.layerChangeGcode) g += _interp(s.layerChangeGcode, s, { layer_num: layerIdx + 1, layer_z: z.toFixed(3), total_layer_count: layers.length }) + '\n';
    // After the first layer, drop from initial-layer temps to steady temps and
    // switch from the first-layer acceleration to the steady one.
    if (layerIdx === 1) {
      if (s.nozzleTempInitial != null && s.nozzleTempInitial !== s.nozzleTemp) g += `M104 S${s.nozzleTemp}\n`;
      if (s.bedTempInitial != null && s.bedTempInitial !== s.bedTemp) g += `M140 S${s.bedTemp}\n`;
      if (s.acceleration && s.initialLayerAccel && s.initialLayerAccel !== s.acceleration) g += `M204 P${s.acceleration} T${s.travelAccel ?? s.acceleration}\n`;
    }
    // Enable the part-cooling fan once past the fan-off layers. When overhang
    // cooling is active the per-path logic below owns the fan instead.
    if (layerIdx === (s.fanOffLayers ?? 1) && s.overhangFanSpeed == null) { const v = Math.round((s.fanSpeed ?? 100) * 2.55); g += `M106 S${v}\n`; curFanG = v; }

    // Cooling: if a layer would print faster than the minimum layer time, slow
    // it down (clamped to the minimum print speed) so small layers get time to
    // cool — the same logic a desktop slicer uses for tiny top caps / spires.
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

    // Fan level that applies to normal features on this layer.
    const layerFanPct = layerIdx >= (s.fanOffLayers ?? 1) ? (s.fanSpeed ?? 100) : 0;

    let curFeature = null;
    for (const path of paths) {
      if (!path.pts || path.pts.length < 2) continue;
      if (path.feature !== curFeature) { g += `; FEATURE:${path.feature}\n`; curFeature = path.feature; }
      const isCooled = path.feature === 'bridge' || path.overhang;
      // Overhang / bridge cooling: boost the part fan over these moves, restore after.
      if (s.overhangFanSpeed != null && layerIdx > 0) {
        const wantFan = isCooled ? Math.round(Math.max(layerFanPct, s.overhangFanSpeed) * 2.55) : Math.round(layerFanPct * 2.55);
        if (wantFan !== curFanG) { g += `M106 S${wantFan}\n`; curFanG = wantFan; }
      }
      let pspeed = featSpeed(path.feature, layerIdx);
      if (path.overhang && s.overhangSpeed) pspeed = Math.min(pspeed, s.overhangSpeed);
      if (speedScale < 1) pspeed = Math.max(minSpeed, pspeed * speedScale);
      const ef = efFeat(path.feature, layerIdx) * (path.flow ?? 1);
      if (path.spiral) { emitSpiral(path.pts, layerIdx * s.layerHeight, z, pspeed); continue; }
      emitPath(path.pts, pspeed, !!path.closed, path.flow ?? 1, ef);
    }
  });

  g += `; --- finished ---\n`;
  e -= s.retraction; g += `G1 E${e.toFixed(4)} F${s.travelSpeed * 60}\n`;
  g += `G1 Z${(curZ + 5).toFixed(3)} F${s.travelSpeed * 60}\n`;
  g += (s.endGcode ? _interp(s.endGcode, s) + '\n' : _defaultEnd());
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
    skirtLoops: 1, skirtGap: 3, brimWidth: 0,
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
  const numLayers = opts.numLayers || Math.max(1, Math.floor(stats.bbox.size[2] / layerHeight));

  // Top/bottom shell thickness (mm) overrides the layer counts when it implies
  // more shells than the configured counts (matches OrcaSlicer's *_shell_thickness).
  if (s.topShellThickness > 0) s.topLayers = Math.max(s.topLayers, Math.ceil(s.topShellThickness / layerHeight));
  if (s.bottomShellThickness > 0) s.bottomLayers = Math.max(s.bottomLayers, Math.ceil(s.bottomShellThickness / layerHeight));

  // Pass 1 — slice every layer into regions (needed up-front for supports).
  const layerRegions = [];
  for (let i = 0; i < numLayers; i++) {
    const z = (i + 0.5) * layerHeight;
    layerRegions.push(buildRegions(sliceLayer(recentered, z)));
  }

  // Supports (optional) — overhang columns down to the bed.
  let supportSegs = null;
  if (s.supports) {
    const { generateSupports } = await import('./native-slicer-support.js');
    supportSegs = generateSupports(layerRegions, {
      lineWidth: lw, gridRes: s.supportGridRes, density: s.supportDensity, xyGap: s.supportXYGap, zGapLayers: s.supportZGap, interfaceLayers: s.supportInterface, onPlateOnly: s.supportOnPlate,
      layerHeight, thresholdAngle: s.supportThreshold ?? 40,
    });
  }

  // Surface classifier — marks infill solid on real top/bottom faces
  // (including over holes/steps), not just the global first/last N layers.
  const surfaces = s.solidSurfaces === false ? null : buildSurfaceClassifier(layerRegions, {
    gridRes: s.surfaceGridRes ?? 2, topLayers: s.topLayers, bottomLayers: s.bottomLayers,
  });
  const midSolid = (surfaces, i, sg) => surfaces.isSolidPoint(i, (sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2);

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
  for (let i = 0; i < numLayers; i++) {
    const regions = layerRegions[i];
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
    // Push solid segments, splitting bottom-over-air lines out as bridges
    // (their own flow + speed + cooling).
    const pushSolid = (segs) => {
      for (const sg of segs) {
        if (bridgeDetect && below && segMidUnsupported(sg)) fills.push({ feature: 'bridge', closed: false, pts: sg, flow: s.bridgeFlow ?? 0.7 });
        else fills.push({ feature: 'solid', closed: false, pts: sg });
      }
    };

    for (const region of regions) {
      // Elephant-foot compensation: pull the first layer's outer wall in a
      // touch so a squished first layer doesn't bulge past the model.
      let outerBoundary = region.outer;
      if (i === 0 && s.elephantFoot > 0) {
        const comp = offsetPolygon(outerBoundary, -s.elephantFoot);
        if (comp && comp.length >= 3) outerBoundary = comp;
      }
      // Vase / spiral mode: a single continuous outer wall that ramps up in
      // Z, above the solid base layers. No inner walls, infill, or top.
      if (s.spiralMode && i >= s.bottomLayers) {
        walls.push({ feature: 'outer-wall', closed: false, spiral: true, pts: outerBoundary });
        continue;
      }
      // Outer walls: shrink inward wall-by-wall (negative = inward).
      const seam = s.seamPosition;
      let inner = outerBoundary;
      const outerPts = s.fuzzySkin ? fuzzifyPolygon(outerBoundary, s.fuzzySkinThickness, Math.max(0.3, lw)) : outerBoundary;
      const mainWalls = [{ feature: 'outer-wall', closed: true, pts: seamStart(outerPts, seam) }];
      for (let p = 1; p < wallLoops; p++) {
        inner = offsetPolygon(inner, -lw);
        if (!inner || inner.length < 3) break;
        mainWalls.push({ feature: 'inner-wall', closed: true, pts: seamStart(inner, seam) });
      }
      // Overhang perimeters: flag walls that jut out over air so they print
      // slower with more cooling.
      if (overhangDetect && below) for (const w of mainWalls) if (wallOverhangFrac(w.pts) > (s.overhangThreshold ?? 0.5)) w.overhang = true;
      // Wall print order: inner-first (better dimensional accuracy) or
      // outer-first (better surface). OrcaSlicer's wall_infill_order.
      if (s.wallOrder === 'inner-outer' && mainWalls.length > 1) walls.push(...mainWalls.slice(1), mainWalls[0]);
      else walls.push(...mainWalls);
      // Hole walls: grow each hole outward into the solid.
      const grownHoles = [];
      for (const hole of region.holes) {
        let hw = hole;
        walls.push({ feature: 'inner-wall', closed: true, pts: seamStart(hw, seam) });
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
        const baseAngle = s.infillAngle + (i % 2) * 90;
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
        if (!surfaces || globalSolid) {
          // No surface detection (or a global shell layer): fill uniformly.
          if (!globalSolid && s.infillPattern === 'concentric') { if (doSparse) concentric(infRegion, 'sparse', false); }
          else if (globalSolid && solidConcentric) { concentric(infRegion, 'solid', true); }
          else if (globalSolid) {
            pushSolid(solidInfill(infRegion, baseAngle, lw));
          } else if (doSparse) {
            const segs = patternInfill(infRegion, s.infillDensity, baseAngle, lw, s.infillPattern, { z: (i + 1) * s.layerHeight });
            for (const sg of segs) fills.push({ feature: 'sparse', closed: false, pts: sg, flow: sparseFlow });
          }
        } else {
          // Per-surface: solid where this is a top/bottom face, sparse elsewhere.
          const solidSegs = solidInfill(infRegion, baseAngle, lw).filter((sg) => midSolid(surfaces, i, sg));
          pushSolid(solidSegs);
          if (s.infillPattern === 'concentric') { if (doSparse) concentric(infRegion, 'sparse', false); }
          else if (doSparse) {
            const sparseSegs = patternInfill(infRegion, s.infillDensity, baseAngle, lw, s.infillPattern, { z: (i + 1) * s.layerHeight }).filter((sg) => !midSolid(surfaces, i, sg));
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
          const ironSegs = regionInfill(infRegion, 1.0, ironAngle, ironSpacing)
            .filter((sg) => surfaces.isTopPoint(i, (sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2));
          for (const sg of ironSegs) fills.push({ feature: 'ironing', closed: false, pts: sg, flow: s.ironingFlow ?? 0.15 });
        }
      }
    }

    // Skirt + brim on the first layer only.
    if (i === 0) {
      for (const region of regions) {
        const brimLoops = Math.max(0, Math.round((s.brimWidth || 0) / lw));
        let ring = region.outer;
        for (let b = 0; b < brimLoops; b++) {
          ring = offsetPolygon(ring, lw);
          if (!ring || ring.length < 3) break;
          adhesion.push({ feature: 'brim', closed: true, pts: ring });
        }
        let sk = offsetPolygon(region.outer, s.skirtGap + (brimLoops * lw));
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
    if (supportSegs && supportSegs[i]) for (const sg of supportSegs[i]) support.push({ feature: 'support', closed: false, pts: sg });

    // Print order: adhesion → walls → infill → support.
    layers.push({ paths: [...adhesion, ...walls, ...fills, ...support] });
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

  const perObj = [];
  for (const o of objects) {
    const settings = { ...globalSettings, ...(o.settings || {}), layerHeight: lh };
    const { layers } = await sliceMeshToLayers(o.mesh, settings, { offset, numLayers });
    perObj.push(layers);
  }

  const combined = [];
  for (let i = 0; i < numLayers; i++) {
    const paths = [];
    for (const layers of perObj) if (layers[i] && layers[i].paths) paths.push(...layers[i].paths);
    combined.push({ paths });
  }
  return { gcode: layersToGcode(combined, { ...globalSettings, layerHeight: lh }), layers: numLayers, objects: objects.length };
}

export const _internals = { _chainSegments, _signedArea, _isCCW, _near, _bbox, _pointInPoly, EPS };
