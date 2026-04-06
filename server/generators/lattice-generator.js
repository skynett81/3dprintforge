/**
 * Lattice Structure Generator — parametric 3D lattice grids
 * Supports cubic, bcc, fcc, octet, and diamond cell types
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

/** Node positions (normalized 0..1) for each cell type */
const CELL_NODES = {
  cubic: [
    [0,0,0],[1,0,0],[1,1,0],[0,1,0],
    [0,0,1],[1,0,1],[1,1,1],[0,1,1],
  ],
  bcc: [
    [0,0,0],[1,0,0],[1,1,0],[0,1,0],
    [0,0,1],[1,0,1],[1,1,1],[0,1,1],
    [0.5,0.5,0.5],
  ],
  fcc: [
    [0,0,0],[1,0,0],[1,1,0],[0,1,0],
    [0,0,1],[1,0,1],[1,1,1],[0,1,1],
    [0.5,0.5,0],[0.5,0,0.5],[1,0.5,0.5],
    [0.5,1,0.5],[0,0.5,0.5],[0.5,0.5,1],
  ],
};
CELL_NODES.octet = [...CELL_NODES.fcc];
CELL_NODES.diamond = [
  ...CELL_NODES.fcc,
  [0.25,0.25,0.25],[0.75,0.75,0.25],
  [0.75,0.25,0.75],[0.25,0.75,0.75],
];

/** Strut pairs (index into CELL_NODES) for each cell type */
const CELL_STRUTS = {
  cubic: [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ],
  bcc: [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
    [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],
  ],
  fcc: [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
    [0,8],[1,8],[2,8],[3,8],
    [0,9],[1,9],[4,9],[5,9],
    [1,10],[2,10],[5,10],[6,10],
    [2,11],[3,11],[6,11],[7,11],
    [0,12],[3,12],[4,12],[7,12],
    [4,13],[5,13],[6,13],[7,13],
  ],
  octet: [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
    [0,8],[1,8],[2,8],[3,8],
    [0,9],[1,9],[4,9],[5,9],
    [1,10],[2,10],[5,10],[6,10],
    [2,11],[3,11],[6,11],[7,11],
    [0,12],[3,12],[4,12],[7,12],
    [4,13],[5,13],[6,13],[7,13],
    [8,9],[9,10],[10,11],[11,12],[12,9],
    [8,13],[9,13],[10,13],[11,13],[12,13],
  ],
  diamond: [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
    [0,14],[1,14],[2,14],[3,14],
    [0,15],[1,15],[2,15],[3,15],
    [4,16],[5,16],[6,16],[7,16],
    [4,17],[5,17],[6,17],[7,17],
    [14,15],[14,16],[15,17],[16,17],
  ],
};

/**
 * Generate a 3MF lattice structure.
 * @param {object} opts
 * @param {'bcc'|'fcc'|'octet'|'diamond'|'cubic'} [opts.cellType='bcc']
 * @param {number} [opts.cellSize=10] - Cell size in mm (5-20)
 * @param {number} [opts.strutDiameter=1.2] - Strut diameter in mm (0.8-3)
 * @param {number} [opts.countX=3] - Cells along X (1-8)
 * @param {number} [opts.countY=3] - Cells along Y (1-8)
 * @param {number} [opts.countZ=3] - Cells along Z (1-8)
 * @param {number} [opts.shellWall=0] - Outer shell thickness (0 = none)
 * @param {{r:number,g:number,b:number}} [opts.color] - RGB color
 * @returns {Promise<Buffer>}
 */
export async function generateLattice3MF(opts = {}) {
  const cellType = opts.cellType || 'bcc';
  const cellSize = Math.max(5, Math.min(20, opts.cellSize || 10));
  const strutDia = Math.max(0.8, Math.min(3, opts.strutDiameter || 1.2));
  const countX = Math.max(1, Math.min(8, opts.countX || 3));
  const countY = Math.max(1, Math.min(8, opts.countY || 3));
  const countZ = Math.max(1, Math.min(8, opts.countZ || 3));
  const shellWall = Math.max(0, opts.shellWall || 0);
  const color = opts.color || { r: 240, g: 160, b: 40 };

  const nodes = CELL_NODES[cellType] || CELL_NODES.bcc;
  const struts = CELL_STRUTS[cellType] || CELL_STRUTS.bcc;
  const r = strutDia / 2;
  const segs = 6;

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const c = new lib.sColor();
    c.set_Red(color.r); c.set_Green(color.g); c.set_Blue(color.b); c.set_Alpha(255);
    const col = matGroup.AddMaterial('Lattice', c); c.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName('Lattice');
    mesh.SetObjectLevelProperty(mgId, col);
    const b = new MeshBuilder(lib, mesh);

    // Build lattice cells
    for (let cz = 0; cz < countZ; cz++) {
      for (let cy = 0; cy < countY; cy++) {
        for (let cx = 0; cx < countX; cx++) {
          const ox = cx * cellSize;
          const oy = cy * cellSize;
          const oz = cz * cellSize;

          // Resolve absolute node positions for this cell
          const abs = nodes.map(n => [
            ox + n[0] * cellSize,
            oy + n[1] * cellSize,
            oz + n[2] * cellSize,
          ]);

          // Add struts
          for (const [a, s] of struts) {
            if (a >= abs.length || s >= abs.length) continue;
            _addStrut(b, abs[a], abs[s], r, segs);
          }

          // Add small spherical nodes at corners (cylinder cap approximation)
          for (const p of abs) {
            b.addCylinder(p[0], p[1], p[2] - r, r, r * 2, segs);
          }
        }
      }
    }

    // Optional outer shell
    if (shellWall > 0) {
      const totalX = countX * cellSize;
      const totalY = countY * cellSize;
      const totalZ = countZ * cellSize;
      // Bottom
      b.addBox(-shellWall, -shellWall, -shellWall, totalX + shellWall * 2, totalY + shellWall * 2, shellWall);
      // Top
      b.addBox(-shellWall, -shellWall, totalZ, totalX + shellWall * 2, totalY + shellWall * 2, shellWall);
      // Front (Y=0)
      b.addBox(-shellWall, -shellWall, 0, totalX + shellWall * 2, shellWall, totalZ);
      // Back (Y=max)
      b.addBox(-shellWall, totalY, 0, totalX + shellWall * 2, shellWall, totalZ);
      // Left (X=0)
      b.addBox(-shellWall, 0, 0, shellWall, totalY, totalZ);
      // Right (X=max)
      b.addBox(totalX, 0, 0, shellWall, totalY, totalZ);
    }

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());
    _addMeta(model, `Lattice ${cellType.toUpperCase()}`);
    return _write(lib, model);
  } finally { model.delete(); wrapper.delete(); }
}

/**
 * Add an oriented cylindrical strut between two 3D points.
 * Creates a proper mesh with top/bottom caps and side quads.
 */
function _addStrut(b, p1, p2, r, segments) {
  const segs = segments || 6;
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1], dz = p2[2] - p1[2];
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len < 0.001) return;

  // Strut axis (normalized)
  const ax = dx / len, ay = dy / len, az = dz / len;

  // Find a perpendicular vector
  let px, py, pz;
  if (Math.abs(ax) < 0.9) {
    px = 0; py = -az; pz = ay;
  } else {
    px = az; py = 0; pz = -ax;
  }
  const pl = Math.sqrt(px * px + py * py + pz * pz);
  px /= pl; py /= pl; pz /= pl;

  // Second perpendicular (cross product)
  const qx = ay * pz - az * py;
  const qy = az * px - ax * pz;
  const qz = ax * py - ay * px;

  const base = b.vOff;

  // Bottom ring vertices
  for (let s = 0; s < segs; s++) {
    const a = (s / segs) * Math.PI * 2;
    const cos = Math.cos(a), sin = Math.sin(a);
    b._addVertex(
      p1[0] + (px * cos + qx * sin) * r,
      p1[1] + (py * cos + qy * sin) * r,
      p1[2] + (pz * cos + qz * sin) * r,
    );
  }

  // Top ring vertices
  for (let s = 0; s < segs; s++) {
    const a = (s / segs) * Math.PI * 2;
    const cos = Math.cos(a), sin = Math.sin(a);
    b._addVertex(
      p2[0] + (px * cos + qx * sin) * r,
      p2[1] + (py * cos + qy * sin) * r,
      p2[2] + (pz * cos + qz * sin) * r,
    );
  }

  // Bottom cap center
  const bc = b._addVertex(p1[0], p1[1], p1[2]);
  for (let s = 0; s < segs; s++) {
    b._addTri(bc, base + (s + 1) % segs, base + s);
  }

  // Top cap center
  const tc = b._addVertex(p2[0], p2[1], p2[2]);
  for (let s = 0; s < segs; s++) {
    b._addTri(tc, base + segs + s, base + segs + (s + 1) % segs);
  }

  // Side quads
  for (let s = 0; s < segs; s++) {
    const bl = base + s;
    const br = base + (s + 1) % segs;
    const tl = base + segs + s;
    const tr = base + segs + (s + 1) % segs;
    b._addTri(bl, br, tr);
    b._addTri(bl, tr, tl);
  }
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
