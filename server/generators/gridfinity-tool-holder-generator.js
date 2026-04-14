/**
 * Gridfinity Tool Holder Generator
 *
 * A Gridfinity-compatible bin with a grid of circular tool slots drilled into
 * the top for holding drill bits, screwdrivers, pens, or similar round tools.
 *
 * Implementation:
 *   Single watertight heightmap. Every XY sample is assigned one of three
 *   heights:
 *     - Outside bin footprint: n/a (outside the grid)
 *     - Inside a tool slot:    floor height only (slot = pocket in the top)
 *     - Everywhere else:       full bin height (solid block)
 *
 *   The tool slot pattern is a regular grid sized to fit `rows × cols` slots
 *   of the configured diameter with sensible wall spacing.
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';
import { int, num } from './_shared/validate.js';

const GRID_UNIT = 42;
const BIN_INSET = 0.25;
const WALL_THICKNESS = 1.2;
const FLOOR_THICKNESS = 1.5;
const H_UNIT_HEIGHT = 7;
const CELL_RES = 0.5;
const MAX_GRID_UNITS = 6;

/**
 * @typedef {object} GridfinityToolHolderOptions
 * @property {number} [unitsX=1] - 42mm grid units along X (1..6)
 * @property {number} [unitsY=1] - 42mm grid units along Y (1..6)
 * @property {number} [heightUnits=3] - 7mm height units (2..15)
 * @property {number} [slotDiameter=8] - tool slot diameter in mm (2..30)
 * @property {number} [slotSpacing=3] - minimum wall between slots (mm)
 */

/**
 * @param {GridfinityToolHolderOptions} opts
 * @returns {Promise<Buffer>} 3MF file buffer
 */
export async function generateGridfinityToolHolder3MF(opts = {}) {
  const unitsX = int(opts.unitsX, 1, MAX_GRID_UNITS, 1);
  const unitsY = int(opts.unitsY, 1, MAX_GRID_UNITS, 1);
  const heightUnits = int(opts.heightUnits, 2, 15, 3);
  const slotDiameter = num(opts.slotDiameter, 2, 30, 8);
  const slotSpacing = num(opts.slotSpacing, 1, 10, 3);

  const totalW = unitsX * GRID_UNIT - BIN_INSET * 2;
  const totalD = unitsY * GRID_UNIT - BIN_INSET * 2;
  const totalH = heightUnits * H_UNIT_HEIGHT;
  const wallHeight = totalH - FLOOR_THICKNESS;

  // Compute slot grid — how many slots fit along each axis.
  const slotPitch = slotDiameter + slotSpacing;
  const usableW = totalW - WALL_THICKNESS * 2 - slotSpacing;
  const usableD = totalD - WALL_THICKNESS * 2 - slotSpacing;
  const slotCols = Math.max(1, Math.floor(usableW / slotPitch));
  const slotRows = Math.max(1, Math.floor(usableD / slotPitch));
  const slotR = slotDiameter / 2;

  // Precompute slot center coordinates (centered within the bin)
  const gridW = slotCols * slotPitch - slotSpacing;
  const gridD = slotRows * slotPitch - slotSpacing;
  const startX = (totalW - gridW) / 2 + slotR;
  const startY = (totalD - gridD) / 2 + slotR;
  const slotCenters = [];
  for (let sy = 0; sy < slotRows; sy++) {
    for (let sx = 0; sx < slotCols; sx++) {
      slotCenters.push([startX + sx * slotPitch, startY + sy * slotPitch]);
    }
  }

  const cols = Math.round(totalW / CELL_RES);
  const rows = Math.round(totalD / CELL_RES);

  // Build heightmap: 1.0 = solid block, 0.0 = slot (pocket down to floor)
  const grid = new Array(rows);
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols);
    const py = (r + 0.5) * CELL_RES;
    for (let c = 0; c < cols; c++) {
      const px = (c + 0.5) * CELL_RES;
      let inSlot = false;
      for (const [scx, scy] of slotCenters) {
        const dx = px - scx;
        const dy = py - scy;
        if (dx * dx + dy * dy < slotR * slotR) {
          inSlot = true;
          break;
        }
      }
      row[c] = inSlot ? 0.0 : 1.0;
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
    col.set_Red(80); col.set_Green(100); col.set_Blue(130); col.set_Alpha(255);
    const matIdx = matGroup.AddMaterial('ToolHolder', col);
    col.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName(`Gridfinity Tool Holder ${unitsX}x${unitsY}x${heightUnits}u (${slotCenters.length} slots)`);
    mesh.SetObjectLevelProperty(mgId, matIdx);
    const mb = new MeshBuilder(lib, mesh);

    mb.addHeightmapSurface(BIN_INSET, BIN_INSET, 0, grid, CELL_RES, FLOOR_THICKNESS, wallHeight);

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', `Gridfinity Tool Holder ${unitsX}x${unitsY}`);
    addMd('Designer', 'Zack Freedman (Gridfinity spec, CC BY 4.0)');
    addMd('Application', '3DPrintForge Model Forge');
    addMd('Description', `${slotCenters.length} slots @ ${slotDiameter}mm diameter`);
    addMd('CreationDate', new Date().toISOString().split('T')[0]);

    const vfsPath = `/gridfinity_tool_holder_${Date.now()}.3mf`;
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
