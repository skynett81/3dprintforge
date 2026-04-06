/**
 * Procedural Texture Surface Generator — creates textured plates and cylinders
 * Supports diamond-plate, knurl, honeycomb, waves, brick, carbon-fiber, dots, crosshatch
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

/** Pattern generators — each returns a 2D grid of floats (0..1) */
const PATTERNS = {
  'diamond-plate': (cols, rows) => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 8, ny = r / rows * 8;
        const diamond = Math.abs(((nx + ny) % 2) - 1) * Math.abs(((nx - ny) % 2) - 1);
        row.push(Math.min(1, diamond * 1.5));
      }
      grid.push(row);
    }
    return grid;
  },

  knurl: (cols, rows) => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 20, ny = r / rows * 20;
        const d1 = Math.abs(Math.sin((nx + ny) * Math.PI));
        const d2 = Math.abs(Math.sin((nx - ny) * Math.PI));
        row.push(Math.min(1, Math.min(d1, d2) * 1.2));
      }
      grid.push(row);
    }
    return grid;
  },

  honeycomb: (cols, rows) => {
    const grid = [];
    const hexW = 6, hexH = hexW * Math.sqrt(3) / 2;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 30, ny = r / rows * 30;
        const gy = Math.floor(ny / hexH);
        const xOff = (gy % 2) * (hexW / 2);
        const lx = ((nx + xOff) % hexW) - hexW / 2;
        const ly = (ny % hexH) - hexH / 2;
        const dist = Math.sqrt(lx * lx + ly * ly);
        const wall = hexW * 0.4;
        row.push(dist > wall ? 1.0 : Math.max(0, dist / wall * 0.3));
      }
      grid.push(row);
    }
    return grid;
  },

  waves: (cols, rows) => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * Math.PI * 6;
        const ny = r / rows * Math.PI * 6;
        const v = (Math.sin(nx) + Math.sin(ny) + 2) / 4;
        row.push(v);
      }
      grid.push(row);
    }
    return grid;
  },

  brick: (cols, rows) => {
    const grid = [];
    const brickW = 8, brickH = 4, mortar = 0.6;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 40, ny = r / rows * 40;
        const brickRow = Math.floor(ny / brickH);
        const xOff = (brickRow % 2) * (brickW / 2);
        const lx = (nx + xOff) % brickW;
        const ly = ny % brickH;
        const isEdge = lx < mortar || ly < mortar;
        row.push(isEdge ? 0.0 : 0.8 + Math.sin(lx * 3 + ly * 2) * 0.1);
      }
      grid.push(row);
    }
    return grid;
  },

  'carbon-fiber': (cols, rows) => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 16, ny = r / rows * 16;
        const weaveX = Math.floor(nx) % 4;
        const weaveY = Math.floor(ny) % 4;
        const over = (weaveX < 2) === (weaveY < 2);
        const frac = nx - Math.floor(nx);
        const edge = Math.min(frac, 1 - frac) * 4;
        row.push(over ? Math.min(1, 0.7 + edge * 0.3) : Math.max(0, 0.3 - edge * 0.1));
      }
      grid.push(row);
    }
    return grid;
  },

  dots: (cols, rows) => {
    const grid = [];
    const spacing = 5, dotR = 1.5;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 30, ny = r / rows * 30;
        const cx = Math.round(nx / spacing) * spacing;
        const cy = Math.round(ny / spacing) * spacing;
        const dist = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
        row.push(dist < dotR ? 1.0 - (dist / dotR) * 0.3 : 0.0);
      }
      grid.push(row);
    }
    return grid;
  },

  crosshatch: (cols, rows) => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 20, ny = r / rows * 20;
        const lineW = 0.3;
        const h = Math.abs(nx % 2 - 1) < lineW || Math.abs(ny % 2 - 1) < lineW ? 1.0 : 0.0;
        row.push(h);
      }
      grid.push(row);
    }
    return grid;
  },
};

/**
 * Generate a 3MF textured surface.
 * @param {object} opts
 * @param {'diamond-plate'|'knurl'|'honeycomb'|'waves'|'brick'|'carbon-fiber'|'dots'|'crosshatch'} [opts.pattern='diamond-plate']
 * @param {number} [opts.width=60] - Width in mm (20-150)
 * @param {number} [opts.depth=60] - Depth in mm (20-150)
 * @param {number} [opts.baseThickness=2] - Base thickness in mm (1-5)
 * @param {number} [opts.reliefDepth=0.8] - Relief height in mm (0.2-3)
 * @param {number} [opts.resolution=50] - Grid resolution (20-100)
 * @param {'flat'|'cylinder'} [opts.surface='flat'] - Surface type
 * @param {number} [opts.cylinderRadius=15] - Cylinder radius in mm
 * @param {number} [opts.cylinderHeight=40] - Cylinder height in mm
 * @param {{r:number,g:number,b:number}} [opts.color] - RGB color
 * @returns {Promise<Buffer>}
 */
export async function generateTexture3MF(opts = {}) {
  const pattern = opts.pattern || 'diamond-plate';
  const width = Math.max(20, Math.min(150, opts.width || 60));
  const depth = Math.max(20, Math.min(150, opts.depth || 60));
  const baseThick = Math.max(1, Math.min(5, opts.baseThickness || 2));
  const reliefDepth = Math.max(0.2, Math.min(3, opts.reliefDepth || 0.8));
  const resolution = Math.max(20, Math.min(100, opts.resolution || 50));
  const surface = opts.surface || 'flat';
  const cylRadius = opts.cylinderRadius || 15;
  const cylHeight = opts.cylinderHeight || 40;
  const color = opts.color || { r: 180, g: 180, b: 180 };

  const patternFn = PATTERNS[pattern] || PATTERNS['diamond-plate'];
  const grid = patternFn(resolution, resolution);

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const c = new lib.sColor();
    c.set_Red(color.r); c.set_Green(color.g); c.set_Blue(color.b); c.set_Alpha(255);
    const col = matGroup.AddMaterial('Texture', c); c.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName(`Texture ${pattern}`);
    mesh.SetObjectLevelProperty(mgId, col);
    const b = new MeshBuilder(lib, mesh);

    if (surface === 'cylinder') {
      b.addCylindricalHeightmap(
        cylRadius + 2, cylRadius + 2, 0,
        cylRadius, cylHeight,
        grid, reliefDepth, baseThick,
      );
    } else {
      const cellSize = width / resolution;
      b.addHeightmapSurface(0, 0, 0, grid, cellSize, baseThick, reliefDepth);
    }

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());
    _addMeta(model, `Texture ${pattern}`);
    return _write(lib, model);
  } finally { model.delete(); wrapper.delete(); }
}

function _addMeta(model, title) {
  const mdg = model.GetMetaDataGroup();
  const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
  addMd('Title', title);
  addMd('Application', '3DPrintForge Model Forge');
  addMd('CreationDate', new Date().toISOString().split('T')[0]);
}

function _write(lib, model) {
  const vfsPath = `/gen_${Date.now()}.3mf`;
  const writer = model.QueryWriter('3mf');
  writer.WriteToFile(vfsPath);
  const buf = Buffer.from(lib.FS.readFile(vfsPath));
  try { lib.FS.unlink(vfsPath); } catch {}
  return buf;
}
