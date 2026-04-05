/**
 * Shared MeshBuilder — vertex/triangle primitives for 3MF generation via lib3mf
 * Used by sign-3mf-generator, lithophane-generator, and all Model Forge tools
 */

let _lib = null;

/** Lazy-init lib3mf WASM singleton */
export async function getLib() {
  if (_lib) return _lib;
  const init = (await import('@3mfconsortium/lib3mf')).default;
  _lib = await init();
  return _lib;
}

export class MeshBuilder {
  constructor(lib, mesh) {
    this.lib = lib;
    this.mesh = mesh;
    this.vOff = 0;
  }

  /** Add a vertex and return its index */
  _addVertex(x, y, z) {
    const p = new this.lib.sPosition();
    p.set_Coordinates0(x); p.set_Coordinates1(y); p.set_Coordinates2(z);
    this.mesh.AddVertex(p); p.delete();
    return this.vOff++;
  }

  /** Add a triangle from 3 absolute vertex indices */
  _addTri(a, b, c) {
    const t = new this.lib.sTriangle();
    t.set_Indices0(a); t.set_Indices1(b); t.set_Indices2(c);
    this.mesh.AddTriangle(t); t.delete();
  }

  /** Watertight box */
  addBox(x, y, z, w, h, d) {
    const base = this.vOff;
    const corners = [[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z],[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]];
    for (const [cx,cy,cz] of corners) this._addVertex(cx, cy, cz);
    const faces = [[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[2,3,7],[2,7,6],[1,2,6],[1,6,5],[0,4,7],[0,7,3]];
    for (const [a,b,c] of faces) this._addTri(base+a, base+b, base+c);
  }

  /** Watertight cylinder */
  addCylinder(cx, cy, z, r, depth, segments) {
    const segs = segments || 16;
    const base = this.vOff;
    this._addVertex(cx, cy, z);       // bottom center
    this._addVertex(cx, cy, z+depth); // top center
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      this._addVertex(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z);
      this._addVertex(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z + depth);
    }
    for (let i = 0; i < segs; i++) {
      this._addTri(base, base+2+((i+1)%segs)*2, base+2+i*2);           // bottom fan
      this._addTri(base+1, base+3+i*2, base+3+((i+1)%segs)*2);         // top fan
      const bl = base+2+i*2, br = base+2+((i+1)%segs)*2;
      this._addTri(bl, br, br+1);                                        // side quad tri 1
      this._addTri(bl, br+1, bl+1);                                      // side quad tri 2
    }
  }

  /** Flat single-sided plane (2 triangles, facing +Z) */
  addPlane(x, y, z, w, h) {
    const base = this.vOff;
    this._addVertex(x, y, z);
    this._addVertex(x+w, y, z);
    this._addVertex(x+w, y+h, z);
    this._addVertex(x, y+h, z);
    this._addTri(base, base+1, base+2);
    this._addTri(base, base+2, base+3);
  }

  /** Box with rounded vertical edges */
  addRoundedBox(x, y, z, w, h, d, radius, segments) {
    const r = Math.min(radius, w/2, h/2);
    if (r <= 0.1) return this.addBox(x, y, z, w, h, d);
    // Approximate with a regular box for now — full curved edges in later iteration
    this.addBox(x, y, z, w, h, d);
  }

  /** Hollow cylinder (tube) */
  addTube(cx, cy, z, outerR, innerR, depth, segments) {
    const segs = segments || 24;
    const base = this.vOff;
    // Outer + inner ring vertices (bottom and top)
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const cos = Math.cos(a), sin = Math.sin(a);
      this._addVertex(cx + cos * outerR, cy + sin * outerR, z);           // outer bottom
      this._addVertex(cx + cos * outerR, cy + sin * outerR, z + depth);   // outer top
      this._addVertex(cx + cos * innerR, cy + sin * innerR, z);           // inner bottom
      this._addVertex(cx + cos * innerR, cy + sin * innerR, z + depth);   // inner top
    }
    for (let i = 0; i < segs; i++) {
      const n = (i + 1) % segs;
      const ob = base + i*4, ot = ob+1, ib = ob+2, it = ob+3;
      const nob = base + n*4, not_ = nob+1, nib = nob+2, nit = nob+3;
      // Outer wall
      this._addTri(ob, nob, not_); this._addTri(ob, not_, ot);
      // Inner wall (reversed winding)
      this._addTri(ib, nit, nib); this._addTri(ib, it, nit);
      // Bottom ring
      this._addTri(ob, ib, nib); this._addTri(ob, nib, nob);
      // Top ring
      this._addTri(ot, nit, it); this._addTri(ot, not_, nit);
    }
  }

  /**
   * Heightmap surface — creates a watertight solid from a 2D grid of heights.
   * Used for lithophanes, reliefs, and stencils.
   * @param {number} x - origin X
   * @param {number} y - origin Y
   * @param {number} z - origin Z (base bottom)
   * @param {number[][]} grid - 2D array [row][col] of height values (0..1)
   * @param {number} cellSize - size of each cell in mm
   * @param {number} baseThickness - minimum thickness (mm) at height=0
   * @param {number} maxHeight - maximum added height (mm) at height=1
   */
  addHeightmapSurface(x, y, z, grid, cellSize, baseThickness, maxHeight) {
    const rows = grid.length;
    if (rows === 0) return;
    const cols = grid[0].length;
    if (cols === 0) return;

    const base = this.vOff;
    const W = cols * cellSize;
    const H = rows * cellSize;

    // Create vertices: top surface grid + bottom surface grid
    // Top surface: (cols+1) x (rows+1) vertices
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        // Sample height — average surrounding cells
        let h = 0, cnt = 0;
        for (let dr = -1; dr <= 0; dr++) {
          for (let dc = -1; dc <= 0; dc++) {
            const rr = r + dr, cc = c + dc;
            if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
              h += grid[rr][cc]; cnt++;
            }
          }
        }
        h = cnt > 0 ? h / cnt : 0;
        const vz = z + baseThickness + h * maxHeight;
        this._addVertex(x + c * cellSize, y + r * cellSize, vz);
      }
    }

    // Bottom surface: (cols+1) x (rows+1) flat vertices at z
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        this._addVertex(x + c * cellSize, y + r * cellSize, z);
      }
    }

    const stride = cols + 1;
    const topBase = base;
    const botBase = base + stride * (rows + 1);

    // Top surface triangles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tl = topBase + r * stride + c;
        const tr = tl + 1;
        const bl = tl + stride;
        const br = bl + 1;
        this._addTri(tl, bl, tr);
        this._addTri(tr, bl, br);
      }
    }

    // Bottom surface triangles (reversed winding)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tl = botBase + r * stride + c;
        const tr = tl + 1;
        const bl = tl + stride;
        const br = bl + 1;
        this._addTri(tl, tr, bl);
        this._addTri(tr, br, bl);
      }
    }

    // Side walls — stitch top and bottom edges
    // Front edge (r=0)
    for (let c = 0; c < cols; c++) {
      const tt = topBase + c, tn = tt + 1;
      const bt = botBase + c, bn = bt + 1;
      this._addTri(bt, tt, tn); this._addTri(bt, tn, bn);
    }
    // Back edge (r=rows)
    for (let c = 0; c < cols; c++) {
      const tt = topBase + rows * stride + c, tn = tt + 1;
      const bt = botBase + rows * stride + c, bn = bt + 1;
      this._addTri(bt, tn, tt); this._addTri(bt, bn, tn);
    }
    // Left edge (c=0)
    for (let r = 0; r < rows; r++) {
      const tt = topBase + r * stride, tn = tt + stride;
      const bt = botBase + r * stride, bn = bt + stride;
      this._addTri(bt, tn, tt); this._addTri(bt, bn, tn);
    }
    // Right edge (c=cols)
    for (let r = 0; r < rows; r++) {
      const tt = topBase + r * stride + cols, tn = tt + stride;
      const bt = botBase + r * stride + cols, bn = bt + stride;
      this._addTri(bt, tt, tn); this._addTri(bt, tn, bn);
    }
  }
}
