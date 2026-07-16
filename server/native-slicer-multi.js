/**
 * Native Slicer — multi-material / multi-colour slicing.
 *
 * Slices several meshes (one per extruder/colour) into a single interleaved
 * G-code. Each material is run through the SAME full-quality single-material
 * pipeline (sliceMeshToLayers) — walls, top/bottom surfaces, connected infill,
 * Arachne thin-wall beads, bridges, per-segment overhang, travel ordering — so a
 * multi-colour print is identical in quality to a single-colour one. The layers
 * are then merged: per layer, every material's paths are emitted in tool order,
 * with the shared emitter (layersToGcode) inserting one tool change per colour.
 *
 * Earlier this file was a crude self-contained slicer (single perimeter set +
 * grid infill, retract-every-move, no combing) — which is why multi-colour
 * models looked far worse than single-colour ones. It now reuses the real
 * engine so "the slicer works the same regardless of the model".
 */

import { sliceMeshToLayers, layersToGcode } from './native-slicer.js';
import { solidInfill } from './native-slicer-geo.js';

const FILAMENT_DIAM = 1.75;

/**
 * @param {Array<{positions:Float32Array|number[], indices:number[], extruder:number}>} rawMeshes
 * @param {object} settings
 */
export async function sliceMultiMaterialGcode(rawMeshes, settings = {}) {
  const s = {
    layerHeight: 0.2, lineWidth: 0.42, perimeters: 2, infillDensity: 0.15, infillAngle: 45,
    topLayers: 4, bottomLayers: 4, printSpeed: 60, firstLayerSpeed: 20, travelSpeed: 150,
    retraction: 1.0, bedTemp: 60, nozzleTemp: 210, filamentDiam: FILAMENT_DIAM, fanSpeed: 100,
    material: 'PLA',
    ...settings,
  };
  const lh = s.layerHeight;

  const { autoRepair } = await import('./mesh-repair.js');
  const prepared = rawMeshes.map((m) => {
    const rep = autoRepair({ positions: Array.from(m.positions), indices: Array.from(m.indices) }).mesh;
    return { positions: rep.positions, indices: rep.indices, extruder: m.extruder || 1 };
  });

  // Shared recenter across all material meshes so they stay aligned on the plate
  // and share one layer grid (like sliceObjectsGcode).
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const m of prepared) {
    const p = m.positions;
    for (let i = 0; i < p.length; i += 3) {
      if (p[i] < minX) minX = p[i]; if (p[i] > maxX) maxX = p[i];
      if (p[i + 1] < minY) minY = p[i + 1]; if (p[i + 1] > maxY) maxY = p[i + 1];
      if (p[i + 2] < minZ) minZ = p[i + 2]; if (p[i + 2] > maxZ) maxZ = p[i + 2];
    }
  }
  if (!Number.isFinite(minX)) return { gcode: '', layers: 0, materials: 0 };
  const offset = [(minX + maxX) / 2, (minY + maxY) / 2, minZ];
  const numLayers = Math.max(1, Math.floor((maxZ - minZ) / lh));
  const extruders = [...new Set(prepared.map((m) => m.extruder))].sort((a, b) => a - b);

  // Slice each material through the FULL quality pipeline (shared offset + layer
  // count so every colour lines up).
  const perMat = [];
  for (const m of prepared) {
    const { layers } = await sliceMeshToLayers(m, { ...s, layerHeight: lh }, { offset, numLayers });
    perMat.push({ tool: m.extruder, layers });
  }
  perMat.sort((a, b) => a.tool - b.tool);

  // Optional wipe/prime tower: per-extruder bands beside the model (recentered
  // frame) so the colour-change purge goes into the tower instead of the model.
  // Each material prints its band every layer; the bands carry the tool so they
  // group with that colour's model paths (no extra tool change).
  const lw = s.lineWidth;
  const towerBands = (s.wipeTower && extruders.length > 1) ? (() => {
    const rMaxX = (maxX - minX) / 2, rMinY = -(maxY - minY) / 2;
    const x0base = s.wipeTowerX != null ? s.wipeTowerX : rMaxX + 8;
    const y0 = s.wipeTowerY != null ? s.wipeTowerY : rMinY;
    const bandW = (s.wipeTowerWidth ?? 30) / extruders.length;
    return extruders.map((ext, idx) => {
      const x0 = x0base + idx * bandW, x1 = x0 + bandW * 0.9, y1 = y0 + (s.wipeTowerDepth ?? 30);
      return { ext, rect: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] };
    });
  })() : null;

  // Merge per layer: every material's paths tagged with its tool (ascending), so
  // the shared emitter inserts one tool change + prime per colour per layer.
  const combined = [];
  for (let i = 0; i < numLayers; i++) {
    const paths = [];
    for (const pm of perMat) {
      const L = pm.layers[i];
      if (L && L.paths) for (const p of L.paths) paths.push({ ...p, tool: pm.tool });
      if (towerBands) {
        const b = towerBands.find((tb) => tb.ext === pm.tool);
        if (b) {
          paths.push({ feature: 'wipe_tower', closed: true, pts: b.rect, tool: pm.tool });
          const angle = s.infillAngle + (i % 2) * 90;
          for (const sg of solidInfill({ outer: b.rect, holes: [] }, angle, lw)) paths.push({ feature: 'wipe_tower', closed: false, pts: sg, tool: pm.tool });
        }
      }
    }
    combined.push({ paths });
  }

  const gcode = layersToGcode(combined, { ...s, layerHeight: lh });
  return { gcode, layers: numLayers, materials: extruders.length };
}
