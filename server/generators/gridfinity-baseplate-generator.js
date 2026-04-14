/**
 * Gridfinity Baseplate Generator
 *
 * Generates a Gridfinity-compatible baseplate following the 42mm grid standard
 * (originally designed by Zack Freedman, CC BY 4.0).
 *
 * Implementation approach:
 *   The baseplate is built as a single watertight heightmap. Each XY sample
 *   on the grid is assigned a Z-height that reflects the Gridfinity profile:
 *     - Full surface (top of baseplate) near the cell border
 *     - Linear chamfer stepping down as we move inward
 *     - Pocket floor (constant Z) in the center of each cell
 *
 *   Because MeshBuilder.addHeightmapSurface produces guaranteed-watertight
 *   geometry, this avoids the gaps that come from stacking separate frustum
 *   shells and gives us a printable solid on the first try.
 *
 *   The profile compresses the Gridfinity straight-wall segment into the
 *   lower chamfer (heightmaps cannot represent vertical walls with zero
 *   radial thickness). The resulting pocket is still slightly undersized and
 *   mates correctly with standard bin feet.
 *
 * Limitations in v1:
 *   - Outer corners are square (no 4mm outer fillet)
 *   - Magnet holes are not yet carved (needs CSG)
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';
import { int, bool } from './_shared/validate.js';

const GRID_UNIT = 42;
const CELL_RES = 0.5;              // heightmap resolution in mm
const FLOOR_H = 1.2;               // pocket floor thickness (mm)
const MAX_H = 4.75;                // total profile height above floor (mm)

// Normalised radial offsets (distance from cell edge, in mm) where the
// profile transitions between segments:
const TOP_CHAMFER_END = 0.25;      // inward radial distance where top chamfer ends
const LOWER_CHAMFER_END = 2.4;     // inward radial distance where pocket floor starts
const TOP_CHAMFER_Z_DROP = 0.8;    // z-drop across the top chamfer (mm)

/**
 * @typedef {object} GridfinityBaseplateOptions
 * @property {number} [unitsX=2] - Number of 42mm cells along X (1..12)
 * @property {number} [unitsY=2] - Number of 42mm cells along Y (1..12)
 * @property {boolean} [magnetHoles=false] - Reserved for future (no-op in v1)
 */

/**
 * Compute the normalised height (0..1) for a given radial distance from the
 * nearest cell edge. 0 = pocket floor, 1 = full baseplate surface.
 * @param {number} edgeDist - mm from nearest cell edge (0 = on edge)
 * @returns {number}
 */
function profileHeight(edgeDist) {
  if (edgeDist <= 0) return 1.0;
  if (edgeDist < TOP_CHAMFER_END) {
    // Top chamfer: 1.0 -> (MAX_H - 0.8) / MAX_H
    const t = edgeDist / TOP_CHAMFER_END;
    return 1.0 - t * (TOP_CHAMFER_Z_DROP / MAX_H);
  }
  if (edgeDist < LOWER_CHAMFER_END) {
    // Combined straight wall + lower chamfer: linear from end-of-top-chamfer
    // down to 0 over (LOWER_CHAMFER_END - TOP_CHAMFER_END) mm.
    const startHeight = 1.0 - TOP_CHAMFER_Z_DROP / MAX_H;
    const t = (edgeDist - TOP_CHAMFER_END) / (LOWER_CHAMFER_END - TOP_CHAMFER_END);
    return startHeight * (1 - t);
  }
  return 0.0;
}

/**
 * @param {GridfinityBaseplateOptions} opts
 * @returns {Promise<Buffer>} 3MF file buffer
 */
export async function generateGridfinityBaseplate3MF(opts = {}) {
  const unitsX = int(opts.unitsX, 1, 12, 2);
  const unitsY = int(opts.unitsY, 1, 12, 2);

  const totalW = unitsX * GRID_UNIT;
  const totalD = unitsY * GRID_UNIT;
  const cols = Math.round(totalW / CELL_RES);
  const rows = Math.round(totalD / CELL_RES);

  // Build the heightmap grid.
  const grid = new Array(rows);
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols);
    const py = (r + 0.5) * CELL_RES;
    for (let c = 0; c < cols; c++) {
      const px = (c + 0.5) * CELL_RES;
      const lx = px - Math.floor(px / GRID_UNIT) * GRID_UNIT;
      const ly = py - Math.floor(py / GRID_UNIT) * GRID_UNIT;
      const edgeDist = Math.min(lx, GRID_UNIT - lx, ly, GRID_UNIT - ly);
      row[c] = profileHeight(edgeDist);
    }
    grid[r] = row;
  }

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const col = new lib.sColor();
    col.set_Red(120); col.set_Green(135); col.set_Blue(150); col.set_Alpha(255);
    const matIdx = matGroup.AddMaterial('Baseplate', col);
    col.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName(`Gridfinity Baseplate ${unitsX}x${unitsY}`);
    mesh.SetObjectLevelProperty(mgId, matIdx);
    const mb = new MeshBuilder(lib, mesh);

    mb.addHeightmapSurface(0, 0, 0, grid, CELL_RES, FLOOR_H, MAX_H);

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', `Gridfinity Baseplate ${unitsX}x${unitsY}`);
    addMd('Designer', 'Zack Freedman (Gridfinity spec, CC BY 4.0)');
    addMd('Application', '3DPrintForge Model Forge');
    addMd('CreationDate', new Date().toISOString().split('T')[0]);

    // Consume unused parameter (reserved for future magnet support)
    bool(opts.magnetHoles, false);

    const vfsPath = `/gridfinity_baseplate_${Date.now()}.3mf`;
    const writer = model.QueryWriter('3mf');
    writer.WriteToFile(vfsPath);
    const buf = Buffer.from(lib.FS.readFile(vfsPath));
    try { lib.FS.unlink(vfsPath); } catch { /* ignored */ }
    return buf;
  } finally {
    model.delete();
    wrapper.delete();
  }
}
