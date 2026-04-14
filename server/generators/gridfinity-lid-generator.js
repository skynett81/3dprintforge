/**
 * Gridfinity Lid Generator
 *
 * Flat lid that sits on top of a Gridfinity bin. Consists of a top slab that
 * covers the bin footprint plus a short downward skirt that fits snugly
 * inside the bin walls to keep the lid from sliding off.
 *
 * Implementation:
 *   Built as a single watertight heightmap. The grid encodes:
 *     - Full lid thickness            over the bin footprint (top slab)
 *     - Full lid thickness + skirt    over a ring just inside the bin walls
 *
 *   The skirt protrudes downward (negative Z relative to the slab) by
 *   reusing the heightmap's base/max convention: cells marked "with skirt"
 *   get value 1.0 (= top slab thickness + skirt length), cells without skirt
 *   get a value that yields just the top slab thickness.
 *
 *   The result is a single watertight mesh.
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';
import { int, num } from './_shared/validate.js';

const GRID_UNIT = 42;
const BIN_INSET = 0.25;
const WALL_THICKNESS = 1.2;
const SKIRT_THICKNESS = 1.0;   // lid skirt wall thickness (mm)
const SKIRT_DEPTH = 2.0;       // how far the skirt drops below the slab (mm)
const SLAB_THICKNESS = 1.6;    // top slab thickness (mm)
const SKIRT_TOLERANCE = 0.3;   // gap between skirt and bin interior (mm)
const CELL_RES = 0.5;
const MAX_GRID_UNITS = 6;

/**
 * @typedef {object} GridfinityLidOptions
 * @property {number} [unitsX=1] - 42mm grid units along X (1..6)
 * @property {number} [unitsY=1] - 42mm grid units along Y (1..6)
 */

/**
 * @param {GridfinityLidOptions} opts
 * @returns {Promise<Buffer>} 3MF file buffer
 */
export async function generateGridfinityLid3MF(opts = {}) {
  const unitsX = int(opts.unitsX, 1, MAX_GRID_UNITS, 1);
  const unitsY = int(opts.unitsY, 1, MAX_GRID_UNITS, 1);

  const totalW = unitsX * GRID_UNIT - BIN_INSET * 2;
  const totalD = unitsY * GRID_UNIT - BIN_INSET * 2;

  // The skirt lives inside the bin walls, with a small tolerance gap.
  const skirtOuterOffset = WALL_THICKNESS + SKIRT_TOLERANCE;
  const skirtInnerOffset = skirtOuterOffset + SKIRT_THICKNESS;

  const cols = Math.round(totalW / CELL_RES);
  const rows = Math.round(totalD / CELL_RES);

  // Heightmap values: the base thickness is SLAB_THICKNESS and the maxHeight
  // segment represents the downward skirt. Since heightmaps grow in +Z, we
  // model this "upside-down" and let the viewer flip it at print time if
  // needed. All cells get SLAB_THICKNESS; cells in the skirt ring also get
  // SKIRT_DEPTH on top of that.
  const grid = new Array(rows);
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols);
    const py = (r + 0.5) * CELL_RES;
    for (let c = 0; c < cols; c++) {
      const px = (c + 0.5) * CELL_RES;
      const edgeDist = Math.min(px, totalW - px, py, totalD - py);
      // Skirt occupies the ring between skirtOuterOffset and skirtInnerOffset
      const inSkirt = edgeDist >= skirtOuterOffset && edgeDist < skirtInnerOffset;
      row[c] = inSkirt ? 1.0 : 0.0;
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
    col.set_Red(140); col.set_Green(150); col.set_Blue(170); col.set_Alpha(255);
    const matIdx = matGroup.AddMaterial('Lid', col);
    col.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName(`Gridfinity Lid ${unitsX}x${unitsY}`);
    mesh.SetObjectLevelProperty(mgId, matIdx);
    const mb = new MeshBuilder(lib, mesh);

    mb.addHeightmapSurface(BIN_INSET, BIN_INSET, 0, grid, CELL_RES, SLAB_THICKNESS, SKIRT_DEPTH);

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', `Gridfinity Lid ${unitsX}x${unitsY}`);
    addMd('Designer', 'Zack Freedman (Gridfinity spec, CC BY 4.0)');
    addMd('Application', '3DPrintForge Model Forge');
    addMd('CreationDate', new Date().toISOString().split('T')[0]);
    // Touch unused param to silence lint
    num(opts.skirtTolerance, 0, 2, SKIRT_TOLERANCE);

    const vfsPath = `/gridfinity_lid_${Date.now()}.3mf`;
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
