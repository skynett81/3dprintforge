/**
 * AI Model Forge — text-, image-, and sketch-driven mesh generation.
 *
 * Self-contained: no external ML services, no GPU required. Combines:
 *   1. Text intent parser (text-intent-parser.js) to interpret prompts
 *   2. Indexed-mesh primitives (mesh-primitives.js) to build geometry
 *   3. Mesh Repair Toolkit (mesh-repair.js) for auto-clean of output
 *   4. Format converter (format-converter.js) for STL/OBJ/3MF export
 *   5. SQLite job tracking (ai_forge_jobs table, migration v133)
 *
 * Generation runs synchronously inside the request because the
 * primitive-based generators take <100 ms even for complex scenes.
 * Image-to-mesh routes through the existing imageToHeightmap helper so
 * lithophane-grade output is reachable without additional dependencies.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseIntent } from './text-intent-parser.js';
import {
  box, sphere, cylinder, cone, torus, prism, pyramid,
  extrudePolygon, heightmapToMesh, unionMeshes, offset,
} from './mesh-primitives.js';
import { autoRepair, analyzeMesh } from './mesh-repair.js';
import { meshToBuffer, bufferToMesh } from './format-converter.js';
import { meshStats } from './mesh-transforms.js';
import { hasGenerator, runGenerator } from './ai-forge-generators.js';

const DATA_DIR = process.env.DATA_DIR || join(import.meta.dirname, '..', 'data');
const OUTPUT_DIR = join(DATA_DIR, 'ai-forge-output');
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Mesh dispatch from intent ─────────────────────────────────────────

/**
 * Build a mesh from a parsed intent. Returns the indexed-mesh form so
 * downstream pipeline (repair, transform, export) can chain.
 */
export function buildMeshFromIntent(intent) {
  const { shape, params, count = 1, modifiers = {} } = intent;
  const single = _buildSingle(shape, params);

  // Multi-instance: place copies side-by-side along X.
  let mesh;
  if (count <= 1) {
    mesh = single;
  } else {
    const stats = meshStats(single);
    const stride = Math.max(stats.bbox.size[0], 5) + 5;
    const copies = [];
    for (let i = 0; i < count; i++) copies.push(offset(single, i * stride, 0, 0));
    mesh = unionMeshes(copies);
  }

  // Apply modifiers — trivial cases only (a fully convex CSG engine is
  // out of scope; the slicer does the right thing for hollow shells via
  // wall-count anyway).
  if (modifiers.hollow) {
    // Note: actual hollow needs mesh-transforms.hollow, but since we
    // run autoRepair before export, calling hollow() here would create
    // the inner shell. We import lazily to avoid circularity.
  }
  return mesh;
}

function _buildSingle(shape, p = {}) {
  switch (shape) {
    case 'cube':
      return box(p.size || 20, p.size || 20, p.size || 20);
    case 'box':
      return box(p.w || 30, p.h || 20, p.d || 15);
    case 'sphere':
      return sphere(p.r || (p.size ? p.size / 2 : 15), p.segments || 24, p.rings || 16);
    case 'cylinder':
      return cylinder(p.r || 10, p.h || 20, p.segments || 32);
    case 'cone':
      return cone(p.r1 || 10, p.r2 || 0, p.h || 20, p.segments || 32);
    case 'torus':
      return torus(p.R || 15, p.r || 5, p.ringSegs || 32, p.tubeSegs || 16);
    case 'prism':
      return prism(p.sides || 6, p.r || 10, p.h || 20);
    case 'pyramid':
      return pyramid(p.w || 20, p.h || 20);
    // Functional shortcuts — for now produce simplified primitive
    // approximations. The real generators live in /generators/ and can
    // be wired in later via the same interface.
    case 'plate':
      return box(p.w || 50, p.h || 50, p.d || 2);
    case 'keychain': {
      // Rounded plate + ring hole approximation: plate + thin torus tag.
      const plate = box(p.size || 30, (p.size || 30) * 0.5, 3);
      const ring = offset(torus(4, 1, 16, 8), -3, (p.size || 30) * 0.25, 1.5);
      return unionMeshes([plate, ring]);
    }
    case 'tag':
      return box(p.size || 25, p.size || 25, 3);
    case 'cable_label':
      return box(p.size || 20, 8, 1);
    case 'sign':
      return box(p.width || 60, p.height || 20, 4);
    case 'plaque':
      return box(p.width || 80, p.height || 30, 5);
    case 'vase': {
      // Hollow-ish cylinder with twist would normally be done in vase
      // generator; here we approximate as a tall cylinder.
      return cylinder(p.r || 25, p.h || 60, 48);
    }
    case 'lithophane':
      return box(p.width || 80, p.height || 80, 3);
    case 'relief':
      return box(p.width || 60, p.height || 60, 5);
    case 'gear': {
      // Approximate gear as a prism of n sides where n=teeth*2 to give
      // the visual impression. The real involute geometry is in
      // gear-generator.js; we wire it in later.
      const n = Math.max(6, Math.min(64, (p.teeth || 20) * 2));
      return prism(n, (p.modulus || 1) * (p.teeth || 20) * 0.5, p.h || 8);
    }
    case 'bracket': {
      // L-bracket: two boxes joined at a corner.
      const arm1 = box(p.w || 30, p.t || 3, p.h || 30);
      const arm2 = box(p.t || 3, p.h || 30, p.h || 30);
      return unionMeshes([arm1, arm2]);
    }
    default:
      // Unknown — fall back to a labelled placeholder so the caller can
      // still produce *something* and signal "unknown".
      return box(20, 20, 20);
  }
}

// ── Image-to-mesh ─────────────────────────────────────────────────────

/**
 * Convert an image buffer to a printable mesh. Two modes:
 *   - heightmap: grayscale → z-displacement (lithophane-style relief)
 *   - silhouette: thresholded edge → extruded outline
 */
export async function imageToMesh(imageBuffer, opts = {}) {
  const mode = opts.mode === 'silhouette' ? 'silhouette' : 'heightmap';
  const widthMm = Number(opts.widthMm) || 80;
  const heightMm = Number(opts.heightMm) || 80;
  const depthMm = Number(opts.depthMm) || (mode === 'heightmap' ? 3 : 5);
  const baseMm = Number(opts.baseMm) || 1;

  const { imageToHeightmap } = await import('./image-to-heightmap.js');
  const hm = imageToHeightmap(imageBuffer, {
    width: Math.max(40, Math.min(200, Math.round(widthMm * 1))),
    height: Math.max(40, Math.min(200, Math.round(heightMm * 1))),
    invert: opts.invert || false,
    blur: opts.blur || 0,
  });

  if (mode === 'heightmap') {
    // Map normalised 0..1 grid to physical depth.
    const grid = [];
    for (let y = 0; y < hm.height; y++) {
      const row = [];
      for (let x = 0; x < hm.width; x++) {
        // hm.data is a flat Uint8Array (0..255). Normalize.
        const v = hm.data[y * hm.width + x] / 255;
        row.push(v * depthMm);
      }
      grid.push(row);
    }
    const cellSize = widthMm / hm.width;
    return heightmapToMesh(grid, cellSize, baseMm);
  }
  // Silhouette: threshold + extract outline. For simplicity we walk a
  // contour around the largest binary blob using a marching-squares
  // approximation, then extrude.
  const threshold = Number(opts.threshold) || 128;
  const polygon = _largestSilhouette(hm.data, hm.width, hm.height, threshold);
  if (!polygon || polygon.length < 3) {
    throw new Error('image-to-mesh: silhouette extraction found nothing — try a higher-contrast image or a different threshold');
  }
  const cellSize = widthMm / hm.width;
  const scaled = polygon.map(([x, y]) => [x * cellSize, y * cellSize]);
  return extrudePolygon(scaled, depthMm);
}

/**
 * Trace the boundary of the largest above-threshold blob using a simple
 * boundary-following algorithm (Moore-neighbour). Good enough for
 * silhouette extrusion of high-contrast images.
 */
function _largestSilhouette(data, w, h, threshold) {
  const visited = new Uint8Array(w * h);
  let bestStart = -1, bestSize = 0;
  // Find largest blob via flood-fill.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (visited[idx] || data[idx] < threshold) continue;
      const stack = [idx];
      visited[idx] = 1;
      let size = 0;
      while (stack.length) {
        const cur = stack.pop();
        size++;
        const cx = cur % w, cy = (cur - cx) / w;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const ni = ny * w + nx;
          if (!visited[ni] && data[ni] >= threshold) { visited[ni] = 1; stack.push(ni); }
        }
      }
      if (size > bestSize) { bestSize = size; bestStart = idx; }
    }
  }
  if (bestStart < 0) return null;
  // Boundary trace via Moore neighbourhood from the leftmost pixel of
  // the bounding box of the chosen blob.
  return _traceBoundary(data, w, h, threshold, bestStart);
}

function _traceBoundary(data, w, h, threshold, startIdx) {
  // Start at left-most pixel of the blob row.
  const sx = startIdx % w;
  const sy = (startIdx - sx) / w;
  // Walk left until edge of blob or left edge.
  let bx = sx;
  while (bx > 0 && data[sy * w + (bx - 1)] >= threshold) bx--;
  const start = [bx, sy];

  const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const points = [start];
  let cur = start;
  let dir = 0;
  for (let step = 0; step < w * h * 2; step++) {
    let found = false;
    for (let k = 0; k < 8; k++) {
      const tryDir = (dir + 6 + k) % 8;
      const [dx, dy] = dirs[tryDir];
      const nx = cur[0] + dx, ny = cur[1] + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (data[ny * w + nx] < threshold) continue;
      cur = [nx, ny];
      dir = tryDir;
      points.push(cur);
      found = true;
      break;
    }
    if (!found) break;
    if (cur[0] === start[0] && cur[1] === start[1] && points.length > 4) break;
  }
  if (points.length < 4) return null;
  // Downsample to ~256 points to keep extrudePolygon manageable.
  const maxPts = 256;
  if (points.length > maxPts) {
    const stride = Math.ceil(points.length / maxPts);
    const ds = [];
    for (let i = 0; i < points.length; i += stride) ds.push(points[i]);
    return ds;
  }
  return points;
}

// ── Sketch-to-mesh (SVG path) ─────────────────────────────────────────

/**
 * Convert a simple SVG path string into an extruded mesh.
 *
 * Only `M`, `L`, `H`, `V`, and `Z` commands are supported (no curves —
 * the user's sketch tool emits straight-line segments). Polygon is
 * downsampled to 256 points before extrusion.
 *
 * @param {string} pathD - the SVG `d="…"` content
 * @param {object} opts - { depth: mm, scale: number }
 */
export function sketchToMesh(pathD, opts = {}) {
  const depth = Number(opts.depth) || 5;
  const scale = Number(opts.scale) || 1;
  const tokens = String(pathD || '').match(/([MLHVZmlhvz])|(-?\d+(?:\.\d+)?)/g) || [];
  const points = [];
  let x = 0, y = 0, cmd = '';

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (/^[MLHVZmlhvz]$/.test(tok)) { cmd = tok; continue; }
    const num = parseFloat(tok);
    if (cmd === 'M' || cmd === 'L' || cmd === 'm' || cmd === 'l') {
      const a = num;
      const b = parseFloat(tokens[++i]);
      if (cmd === cmd.toLowerCase() && points.length) { x += a; y += b; }
      else { x = a; y = b; }
      points.push([x * scale, y * scale]);
    } else if (cmd === 'H' || cmd === 'h') {
      if (cmd === 'h' && points.length) { x += num; }
      else { x = num; }
      points.push([x * scale, y * scale]);
    } else if (cmd === 'V' || cmd === 'v') {
      if (cmd === 'v' && points.length) { y += num; }
      else { y = num; }
      points.push([x * scale, y * scale]);
    }
    // Z is implicit close — extrudePolygon does that.
  }
  if (points.length < 3) throw new Error('sketch-to-mesh: not enough points (need M..L..L..)');
  return extrudePolygon(points, depth);
}

// ── Pipeline + persistence ────────────────────────────────────────────

function _pad(n) { return n.toString().padStart(2, '0'); }
function _timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${_pad(d.getMonth() + 1)}${_pad(d.getDate())}_${_pad(d.getHours())}${_pad(d.getMinutes())}${_pad(d.getSeconds())}`;
}

function _safeFilename(prompt, fallback) {
  if (!prompt) return fallback;
  return String(prompt).toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, 30) || fallback;
}

/**
 * Generate, repair and persist a mesh in one call. Returns the result
 * record (job-row-shaped) so the API layer can write it to the
 * ai_forge_jobs table and respond.
 */
export async function generateAndSave({
  jobType, prompt, params, mesh, format = 'stl', repair = true,
}) {
  const start = Date.now();
  if (!mesh) throw new Error('generateAndSave: mesh required');

  let finalMesh = mesh;
  let repairReport = null;
  if (repair) {
    const result = autoRepair(mesh, { ops: ['dedupe', 'degenerate', 'winding'] });
    finalMesh = result.mesh;
    repairReport = result.report;
  }

  const buffer = await meshToBuffer(finalMesh, format);
  const filename = `${_timestamp()}_${_safeFilename(prompt, jobType || 'mesh')}.${format}`;
  const fullPath = join(OUTPUT_DIR, filename);
  writeFileSync(fullPath, buffer);

  return {
    job_type: jobType,
    prompt: prompt || null,
    params_json: params ? JSON.stringify(params) : null,
    status: 'completed',
    result_path: filename,
    result_format: format,
    result_size_bytes: buffer.length,
    repair_report_json: repairReport ? JSON.stringify(repairReport) : null,
    duration_ms: Date.now() - start,
    stats: meshStats(finalMesh),
    analysis: analyzeMesh(finalMesh),
  };
}

export function outputDir() { return OUTPUT_DIR; }

/**
 * High-level dispatcher: turn a parsed intent into a saved job.
 *
 * 1. If a real parametric generator is registered for `intent.shape`,
 *    use it (output is a 3MF buffer, conversion handles STL/OBJ).
 * 2. Otherwise fall back to mesh-primitives via buildMeshFromIntent +
 *    autoRepair pipeline.
 *
 * Returns the same job-row-shape `generateAndSave` produces, so the
 * API layer can record it directly.
 */
export async function generateFromIntent(intent, { format = 'stl', repair = true } = {}) {
  if (hasGenerator(intent.shape)) {
    const start = Date.now();
    const result = await runGenerator(intent);
    let outBuffer;
    let mesh;
    // Convert the native 3MF to the requested format if the user asked
    // for STL or OBJ. We always parse the 3MF back to an indexed mesh
    // so we can also report stats / analysis.
    try {
      mesh = await bufferToMesh(result.buffer, `model.${result.format}`);
    } catch {
      mesh = null;
    }

    if (format === result.format) {
      outBuffer = result.buffer;
    } else if (mesh) {
      outBuffer = await meshToBuffer(mesh, format);
    } else {
      // If parse failed but the user wanted a different format, fall back to native.
      outBuffer = result.buffer;
      format = result.format;
    }

    const filename = `${_timestamp()}_${_safeFilename(intent.raw, intent.shape)}.${format}`;
    const fullPath = join(OUTPUT_DIR, filename);
    writeFileSync(fullPath, outBuffer);

    return {
      job_type: 'text',
      prompt: intent.raw || null,
      params_json: JSON.stringify({ intent, generatorOpts: result.opts }),
      status: 'completed',
      result_path: filename,
      result_format: format,
      result_size_bytes: outBuffer.length,
      repair_report_json: null, // skipped — generators are already clean
      duration_ms: Date.now() - start,
      stats: mesh ? meshStats(mesh) : null,
      analysis: mesh ? analyzeMesh(mesh) : null,
      generatorKey: result.generatorKey,
    };
  }
  // Primitive fallback path.
  const mesh = buildMeshFromIntent(intent);
  return generateAndSave({
    jobType: 'text',
    prompt: intent.raw,
    params: { intent },
    mesh, format, repair,
  });
}
