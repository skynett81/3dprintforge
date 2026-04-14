/**
 * Gridfinity Bin Generator
 *
 * Generates a Gridfinity-compatible storage bin matching the 42mm grid and
 * 7mm height-unit standard (Zack Freedman, CC BY 4.0).
 *
 * Implementation approach:
 *   The bin is produced as a single watertight heightmap. Every point in the
 *   bin footprint is assigned one of two heights:
 *     - Full bin height      (walls, near the outer perimeter)
 *     - Floor thickness only (storage cavity, interior of the bin)
 *
 *   This gives us a guaranteed-watertight printable mesh via
 *   MeshBuilder.addHeightmapSurface, identical to the baseplate strategy.
 *
 * Compromises in v1:
 *   - Flat bottom (no chamfered Gridfinity foot). Bin still fits baseplate
 *     pockets because the footprint is inset 0.25mm per side (83.5 × 83.5 for
 *     a 2×2 bin), matching the straight-wall segment of the baseplate pocket.
 *   - No stacking lip on top (would require a separate mesh or dual heightmap)
 *   - No label tab or scoop floor
 *
 * Later iterations can replace or extend this once a boolean/CSG path exists
 * in MeshBuilder.
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';
import { int } from './_shared/validate.js';

const GRID_UNIT = 42;
const BIN_INSET = 0.25;           // per-side inset so bin slides into baseplate pocket
const WALL_THICKNESS = 1.2;       // bin wall thickness (mm)
const FLOOR_THICKNESS = 1.5;      // cavity floor thickness (mm)
const H_UNIT_HEIGHT = 7;          // one Gridfinity height unit (mm)
const CELL_RES = 0.5;             // heightmap sample resolution (mm)
const MIN_H_UNITS = 2;
const MAX_H_UNITS = 15;
const MAX_GRID_UNITS = 6;         // cap grid size to keep triangle count manageable

/**
 * @typedef {object} GridfinityBinOptions
 * @property {number} [unitsX=1] - 42mm grid units along X (1..6)
 * @property {number} [unitsY=1] - 42mm grid units along Y (1..6)
 * @property {number} [heightUnits=3] - 7mm height units (2..15)
 */

/**
 * @param {GridfinityBinOptions} opts
 * @returns {Promise<Buffer>} 3MF file buffer
 */
export async function generateGridfinityBin3MF(opts = {}) {
  const unitsX = int(opts.unitsX, 1, MAX_GRID_UNITS, 1);
  const unitsY = int(opts.unitsY, 1, MAX_GRID_UNITS, 1);
  const heightUnits = int(opts.heightUnits, MIN_H_UNITS, MAX_H_UNITS, 3);

  const totalW = unitsX * GRID_UNIT - BIN_INSET * 2;
  const totalD = unitsY * GRID_UNIT - BIN_INSET * 2;
  const totalH = heightUnits * H_UNIT_HEIGHT;
  const wallHeight = totalH - FLOOR_THICKNESS;

  const cols = Math.round(totalW / CELL_RES);
  const rows = Math.round(totalD / CELL_RES);

  // Build the heightmap grid: 1.0 = full wall height, 0.0 = cavity floor only.
  const grid = new Array(rows);
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols);
    const py = (r + 0.5) * CELL_RES;
    for (let c = 0; c < cols; c++) {
      const px = (c + 0.5) * CELL_RES;
      const edgeDist = Math.min(px, totalW - px, py, totalD - py);
      row[c] = edgeDist < WALL_THICKNESS ? 1.0 : 0.0;
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
    col.set_Red(90); col.set_Green(110); col.set_Blue(145); col.set_Alpha(255);
    const matIdx = matGroup.AddMaterial('Bin', col);
    col.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName(`Gridfinity Bin ${unitsX}x${unitsY}x${heightUnits}u`);
    mesh.SetObjectLevelProperty(mgId, matIdx);
    const mb = new MeshBuilder(lib, mesh);

    // Origin is offset by BIN_INSET so the bin is centered within the nominal
    // unitsX*42 × unitsY*42 bounding box.
    mb.addHeightmapSurface(BIN_INSET, BIN_INSET, 0, grid, CELL_RES, FLOOR_THICKNESS, wallHeight);

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', `Gridfinity Bin ${unitsX}x${unitsY}x${heightUnits}u`);
    addMd('Designer', 'Zack Freedman (Gridfinity spec, CC BY 4.0)');
    addMd('Application', '3DPrintForge Model Forge');
    addMd('CreationDate', new Date().toISOString().split('T')[0]);

    const vfsPath = `/gridfinity_bin_${Date.now()}.3mf`;
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
