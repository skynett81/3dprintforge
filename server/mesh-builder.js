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

  /**
   * Revolution surface — watertight solid of revolution around Z axis.
   * @param {number} cx - center X
   * @param {number} cy - center Y
   * @param {number} zStart - base Z
   * @param {Function} profileFn - (z) => radius at that height
   * @param {number} layers - number of vertical slices
   * @param {number} height - total height
   * @param {number} segments - radial segments
   * @param {number} wallThickness - wall thickness (0 = solid)
   */
  addRevolutionSurface(cx, cy, zStart, profileFn, layers, height, segments, wallThickness) {
    const segs = segments || 24;
    const wall = wallThickness || 0;
    const base = this.vOff;
    const layerH = height / layers;

    // Generate outer ring vertices per layer
    for (let l = 0; l <= layers; l++) {
      const z = zStart + l * layerH;
      const r = profileFn(l * layerH);
      for (let s = 0; s < segs; s++) {
        const a = (s / segs) * Math.PI * 2;
        this._addVertex(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z);
      }
    }

    if (wall > 0) {
      // Generate inner ring vertices per layer
      for (let l = 0; l <= layers; l++) {
        const z = zStart + l * layerH;
        const r = Math.max(0.1, profileFn(l * layerH) - wall);
        for (let s = 0; s < segs; s++) {
          const a = (s / segs) * Math.PI * 2;
          this._addVertex(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z);
        }
      }
    }

    const outerIdx = (l, s) => base + l * segs + (s % segs);
    const innerBase = base + (layers + 1) * segs;
    const innerIdx = (l, s) => innerBase + l * segs + (s % segs);

    // Outer wall quads
    for (let l = 0; l < layers; l++) {
      for (let s = 0; s < segs; s++) {
        const a = outerIdx(l, s), b = outerIdx(l, s + 1);
        const c = outerIdx(l + 1, s + 1), d = outerIdx(l + 1, s);
        this._addTri(a, b, c); this._addTri(a, c, d);
      }
    }

    if (wall > 0) {
      // Inner wall quads (reversed winding)
      for (let l = 0; l < layers; l++) {
        for (let s = 0; s < segs; s++) {
          const a = innerIdx(l, s), b = innerIdx(l, s + 1);
          const c = innerIdx(l + 1, s + 1), d = innerIdx(l + 1, s);
          this._addTri(a, c, b); this._addTri(a, d, c);
        }
      }
      // Bottom ring
      for (let s = 0; s < segs; s++) {
        this._addTri(outerIdx(0, s), innerIdx(0, s + 1), outerIdx(0, s + 1));
        this._addTri(outerIdx(0, s), innerIdx(0, s), innerIdx(0, s + 1));
      }
      // Top ring
      for (let s = 0; s < segs; s++) {
        this._addTri(outerIdx(layers, s), outerIdx(layers, s + 1), innerIdx(layers, s + 1));
        this._addTri(outerIdx(layers, s), innerIdx(layers, s + 1), innerIdx(layers, s));
      }
    } else {
      // Solid: bottom cap (fan from center)
      const botCenter = this._addVertex(cx, cy, zStart);
      for (let s = 0; s < segs; s++) {
        this._addTri(botCenter, outerIdx(0, s + 1), outerIdx(0, s));
      }
      // Top cap
      const topCenter = this._addVertex(cx, cy, zStart + height);
      for (let s = 0; s < segs; s++) {
        this._addTri(topCenter, outerIdx(layers, s), outerIdx(layers, s + 1));
      }
    }
  }

  /**
   * Helical strip — generates a helix thread profile for screws/bolts.
   * @param {number} cx - center X
   * @param {number} cy - center Y
   * @param {number} zStart - start Z
   * @param {number} radius - outer thread radius
   * @param {number} pitch - distance between thread peaks (mm)
   * @param {number} length - total thread length (mm)
   * @param {number} profileW - thread profile width (radial depth)
   * @param {number} profileH - thread profile height (along Z)
   * @param {number} segments - segments per revolution
   */
  addHelicalStrip(cx, cy, zStart, radius, pitch, length, profileW, profileH, segments) {
    const segs = segments || 32;
    const turns = length / pitch;
    const totalSteps = Math.ceil(turns * segs);
    const base = this.vOff;

    // Generate two rings of vertices per step: outer peak and inner root
    for (let i = 0; i <= totalSteps; i++) {
      const frac = i / totalSteps;
      const angle = frac * turns * Math.PI * 2;
      const z = zStart + frac * length;
      const cos = Math.cos(angle), sin = Math.sin(angle);

      // Outer peak
      this._addVertex(cx + cos * radius, cy + sin * radius, z + profileH / 2);
      // Inner root
      this._addVertex(cx + cos * (radius - profileW), cy + sin * (radius - profileW), z - profileH / 2);
    }

    // Connect strips
    for (let i = 0; i < totalSteps; i++) {
      const a = base + i * 2, b = a + 1;       // current outer, inner
      const c = base + (i + 1) * 2, d = c + 1; // next outer, inner
      // Outer face
      this._addTri(a, c, d); this._addTri(a, d, b);
    }
  }

  /**
   * Cylindrical heightmap — wraps a 2D grid around a cylinder surface.
   * @param {number} cx - center X
   * @param {number} cy - center Y
   * @param {number} zStart - base Z
   * @param {number} radius - cylinder radius
   * @param {number} height - cylinder height
   * @param {number[][]} grid - 2D array [row][col] of displacement values (0..1)
   * @param {number} maxDisplacement - max outward displacement in mm
   * @param {number} wallThickness - wall thickness in mm
   */
  addCylindricalHeightmap(cx, cy, zStart, radius, height, grid, maxDisplacement, wallThickness) {
    const rows = grid.length;
    if (rows === 0) return;
    const cols = grid[0].length;
    if (cols === 0) return;
    const wall = wallThickness || 2;
    const base = this.vOff;

    // Outer surface: displaced
    for (let r = 0; r <= rows; r++) {
      const z = zStart + (r / rows) * height;
      for (let c = 0; c <= cols; c++) {
        const angle = (c / cols) * Math.PI * 2;
        // Sample height
        const gr = Math.min(r, rows - 1), gc = c % cols;
        const h = grid[gr][gc] || 0;
        const outerR = radius + h * maxDisplacement;
        this._addVertex(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR, z);
      }
    }

    // Inner surface: smooth cylinder
    const innerR = radius - wall;
    for (let r = 0; r <= rows; r++) {
      const z = zStart + (r / rows) * height;
      for (let c = 0; c <= cols; c++) {
        const angle = (c / cols) * Math.PI * 2;
        this._addVertex(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR, z);
      }
    }

    const stride = cols + 1;
    const outerBase = base;
    const innerBase = base + stride * (rows + 1);

    // Outer surface triangles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tl = outerBase + r * stride + c, tr = tl + 1;
        const bl = tl + stride, br = bl + 1;
        this._addTri(tl, bl, tr); this._addTri(tr, bl, br);
      }
    }

    // Inner surface triangles (reversed)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tl = innerBase + r * stride + c, tr = tl + 1;
        const bl = tl + stride, br = bl + 1;
        this._addTri(tl, tr, bl); this._addTri(tr, br, bl);
      }
    }

    // Bottom ring cap
    for (let c = 0; c < cols; c++) {
      const oo = outerBase + c, on = oo + 1;
      const io = innerBase + c, in_ = io + 1;
      this._addTri(oo, on, in_); this._addTri(oo, in_, io);
    }
    // Top ring cap
    for (let c = 0; c < cols; c++) {
      const oo = outerBase + rows * stride + c, on = oo + 1;
      const io = innerBase + rows * stride + c, in_ = io + 1;
      this._addTri(oo, in_, on); this._addTri(oo, io, in_);
    }
  }
}
