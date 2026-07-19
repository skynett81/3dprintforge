/**
 * Native Slicer — multi-material / multi-colour slicing (BambuStudio-style MMU).
 *
 * A painted multi-colour model is ONE solid whose surface carries colour, not a
 * set of separate solid objects. So this combines every colour mesh into a
 * single solid, slices it ONCE through the full-quality single-material pipeline
 * (walls, top/bottom surfaces, connected infill, Arachne thin-wall beads,
 * bridges, per-segment overhang, travel ordering), and then assigns each path a
 * tool by which colour region its position falls in. The result FOLLOWS the real
 * model shape and prints at single-colour quality — regardless of the model.
 *
 * (Earlier this sliced each colour as its own separate solid, which broke any
 * surface-painted colour into free-floating shells that didn't follow the model.)
 */

import { sliceMeshToLayers, layersToGcode } from './native-slicer.js';
import { sliceLayer, buildRegions, solidInfill, _pointInPoly } from './native-slicer-geo.js';
import { clipUnion } from './native-slicer-bool.js';

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
  const lw = s.lineWidth;

  const { autoRepair } = await import('./mesh-repair.js');
  const prepared = rawMeshes.map((m) => {
    const rep = autoRepair({ positions: Array.from(m.positions), indices: Array.from(m.indices) }).mesh;
    return { positions: rep.positions, indices: rep.indices, extruder: m.extruder || 1 };
  });

  // Shared bbox → one recenter transform + one layer grid for every colour.
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
  const primary = extruders[0];

  // Recenter a mesh into the shared slice frame (matches sliceMeshToLayers).
  const recenter = (m) => {
    const p = m.positions, out = new Float32Array(p.length);
    for (let i = 0; i < p.length; i += 3) { out[i] = p[i] - offset[0]; out[i + 1] = p[i + 1] - offset[1]; out[i + 2] = p[i + 2] - offset[2]; }
    return { positions: out, indices: m.indices };
  };

  // ONE combined solid → the slice follows the real shape. The combined mesh is
  // only used for the bbox / paint frame; the actual per-layer outline comes from
  // a true 2D UNION of each colour mesh's own slice (below), so no internal
  // colour-interface face survives to spawn phantom mid-model solid/bridge skins.
  let totalPos = 0, totalIdx = 0;
  for (const m of prepared) { totalPos += m.positions.length; totalIdx += m.indices.length; }
  const cPos = new Float32Array(totalPos), cIdx = new Uint32Array(totalIdx);
  let po = 0, io = 0, vo = 0;
  for (const m of prepared) {
    cPos.set(m.positions, po);
    for (let i = 0; i < m.indices.length; i++) cIdx[io + i] = m.indices[i] + vo;
    po += m.positions.length; io += m.indices.length; vo += m.positions.length / 3;
  }

  // All colour meshes recentered into the shared slice frame.
  const allMeshes = prepared.map((m) => recenter(m));
  // Per-layer clean outline = union of every colour mesh's cross-section at the
  // layer centre. Dissolves the internal interface faces that a raw triangle
  // merge would leave behind, so top/bottom/solid detection sees only the true
  // exterior surfaces (matches BambuStudio: paint is surface colour on ONE solid).
  const unionLayerRegions = [];
  for (let i = 0; i < numLayers; i++) {
    const zc = (i + 0.5) * lh;
    let acc = [];
    for (const mesh of allMeshes) {
      const regs = buildRegions(sliceLayer(mesh, zc));
      if (regs.length) acc = acc.length ? clipUnion([...acc, ...regs]) : regs;
    }
    unionLayerRegions.push(acc);
  }

  const { layers } = await sliceMeshToLayers({ positions: cPos, indices: cIdx }, { ...s, layerHeight: lh }, { offset, numLayers, layerRegions: unionLayerRegions });

  // Non-primary colour meshes (recentered) for per-path tool assignment.
  const colorMeshes = prepared.filter((m) => m.extruder !== primary).map((m) => ({ tool: m.extruder, mesh: recenter(m) }));

  // Optional wipe/prime tower bands (recentered frame), one per extruder.
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

  const combined = [];
  for (let i = 0; i < layers.length; i++) {
    const L = layers[i];
    const zc = (i + 0.5) * lh;
    // Colour regions crossing this layer (only where a non-primary colour has
    // material) — a path whose midpoint lands inside one is that colour.
    const colRegions = colorMeshes
      .map((cm) => ({ tool: cm.tool, regions: buildRegions(sliceLayer(cm.mesh, zc)) }))
      .filter((c) => c.regions.length);
    const toolOf = (path) => {
      // Brim, skirt, raft and support are structural, not part of the model
      // surface — always the primary tool, never a colour change.
      if (/brim|skirt|raft|support/i.test(path.feature || '')) return primary;
      if (!colRegions.length || !path.pts || path.pts.length < 1) return primary;
      const pts = path.pts, a = pts[0], b = pts[pts.length - 1];
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      for (const c of colRegions) for (const r of c.regions) {
        if (_pointInPoly([mx, my], r.outer)) {
          let inHole = false; for (const h of (r.holes || [])) if (_pointInPoly([mx, my], h)) { inHole = true; break; }
          if (!inHole) return c.tool;
        }
      }
      return primary;
    };
    const paths = (L && L.paths) ? L.paths.map((p) => ({ ...p, tool: toolOf(p) })) : [];
    if (towerBands) {
      const present = new Set(paths.map((p) => p.tool));
      for (const ext of extruders) {
        if (!present.has(ext)) continue;
        const b = towerBands.find((tb) => tb.ext === ext);
        paths.push({ feature: 'wipe_tower', closed: true, pts: b.rect, tool: ext });
        const angle = s.infillAngle + (i % 2) * 90;
        for (const sg of solidInfill({ outer: b.rect, holes: [] }, angle, lw)) paths.push({ feature: 'wipe_tower', closed: false, pts: sg, tool: ext });
      }
    }
    combined.push({ paths });
  }

  const gcode = layersToGcode(combined, { ...s, layerHeight: lh });
  return { gcode, layers: layers.length, materials: extruders.length };
}
