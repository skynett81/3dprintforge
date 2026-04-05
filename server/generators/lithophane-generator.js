/**
 * Lithophane Generator — converts images to 3D printable lithophanes
 * Supports flat, curved, and cylindrical shapes
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';
import { imageToHeightmap } from '../image-to-heightmap.js';

/**
 * Generate a lithophane 3MF from an image buffer
 * @param {Buffer} imageBuffer - PNG image data
 * @param {object} opts
 * @param {'flat'|'curved'|'cylinder'} [opts.shape='flat']
 * @param {number} [opts.width=100] - Width in mm
 * @param {number} [opts.maxThickness=3] - Max thickness (bright areas)
 * @param {number} [opts.minThickness=0.4] - Min thickness (dark areas, needs to be >0 for structural integrity)
 * @param {number} [opts.resolution=150] - Max grid dimension
 * @param {boolean} [opts.invert=false] - Invert brightness
 * @param {number} [opts.gamma=1.0] - Gamma correction
 * @param {number} [opts.curveRadius=60] - Radius for curved shape (mm)
 * @param {boolean} [opts.frame=false] - Add a border frame
 * @param {number} [opts.frameWidth=3] - Frame border width (mm)
 * @param {boolean} [opts.base=false] - Add a flat base for standing
 * @param {number} [opts.baseHeight=8] - Base height (mm)
 * @returns {Promise<Buffer>} 3MF file buffer
 */
export async function generateLithophane3MF(imageBuffer, opts = {}) {
  const shape = opts.shape || 'flat';
  const targetWidth = opts.width || 100;
  const maxThick = opts.maxThickness || 3;
  const minThick = opts.minThickness || 0.4;
  const resolution = opts.resolution || 150;
  const addFrame = opts.frame || false;
  const frameW = opts.frameWidth || 3;
  const addBase = opts.base || false;
  const baseH = opts.baseHeight || 8;
  const curveRadius = opts.curveRadius || 60;

  // Convert image to heightmap
  // For lithophanes: bright = thick (blocks light), dark = thin (lets light through)
  // So we INVERT by default (high pixel value → low height → thin → light passes)
  const hm = imageToHeightmap(imageBuffer, {
    maxWidth: resolution,
    maxHeight: resolution,
    invert: !opts.invert, // Default: bright=thick for lithophane
    gamma: opts.gamma || 1.0,
  });

  const cellSize = targetWidth / hm.width;
  const totalHeight = hm.height * cellSize;
  const thicknessRange = maxThick - minThick;

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    // Material
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const c = new lib.sColor(); c.set_Red(240); c.set_Green(240); c.set_Blue(245); c.set_Alpha(255);
    const colWhite = matGroup.AddMaterial('Lithophane', c); c.delete();

    const lithoMesh = model.AddMeshObject();
    lithoMesh.SetName('Lithophane');
    lithoMesh.SetObjectLevelProperty(mgId, colWhite);
    const builder = new MeshBuilder(lib, lithoMesh);

    if (shape === 'flat') {
      // Flat lithophane — heightmap surface standing vertically (XZ plane)
      // Remap: grid row → Y (height), grid col → X (width), value → Z (thickness)
      _buildFlatLithophane(builder, hm, cellSize, minThick, thicknessRange);
    } else if (shape === 'curved') {
      // Curved lithophane — wrapped around a cylinder arc
      _buildCurvedLithophane(builder, hm, cellSize, minThick, thicknessRange, curveRadius);
    } else if (shape === 'cylinder') {
      // Full cylinder lithophane (360°)
      _buildCurvedLithophane(builder, hm, cellSize, minThick, thicknessRange, curveRadius, true);
    }

    // Frame border
    if (addFrame && shape === 'flat') {
      const frameMesh = model.AddMeshObject();
      frameMesh.SetName('Frame');
      const c2 = new lib.sColor(); c2.set_Red(200); c2.set_Green(200); c2.set_Blue(205); c2.set_Alpha(255);
      const colFrame = matGroup.AddMaterial('Frame', c2); c2.delete();
      frameMesh.SetObjectLevelProperty(mgId, colFrame);
      const fb = new MeshBuilder(lib, frameMesh);
      const fw = frameW;
      const tw = targetWidth + fw * 2;
      const th = totalHeight + fw * 2;
      fb.addBox(-fw, -fw, 0, tw, fw, maxThick);           // bottom
      fb.addBox(-fw, totalHeight, 0, tw, fw, maxThick);    // top
      fb.addBox(-fw, 0, 0, fw, totalHeight, maxThick);     // left
      fb.addBox(targetWidth, 0, 0, fw, totalHeight, maxThick); // right
      model.AddBuildItem(frameMesh, wrapper.GetIdentityTransform());
    }

    // Standing base
    if (addBase && shape === 'flat') {
      const baseMesh = model.AddMeshObject();
      baseMesh.SetName('Base');
      const c3 = new lib.sColor(); c3.set_Red(180); c3.set_Green(180); c3.set_Blue(185); c3.set_Alpha(255);
      const colBase = matGroup.AddMaterial('Base', c3); c3.delete();
      baseMesh.SetObjectLevelProperty(mgId, colBase);
      const bb = new MeshBuilder(lib, baseMesh);
      const bw = targetWidth + (addFrame ? frameW * 2 : 0);
      const bx = addFrame ? -frameW : 0;
      // Base block
      bb.addBox(bx, -baseH, 0, bw, baseH, maxThick + 4);
      // Slot for lithophane to sit in
      bb.addBox(bx + 2, -2, 1, bw - 4, 2.5, maxThick);

      const baseSt = new lib.sTransform();
      baseSt.set_Fields_0_0(1); baseSt.set_Fields_1_1(1); baseSt.set_Fields_2_2(1);
      baseSt.set_Fields_3_0(0); baseSt.set_Fields_3_1(0);
      model.AddBuildItem(baseMesh, wrapper.GetIdentityTransform());
    }

    model.AddBuildItem(lithoMesh, wrapper.GetIdentityTransform());

    // Metadata
    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', 'Lithophane');
    addMd('Application', '3DPrintForge Model Forge');
    addMd('CreationDate', new Date().toISOString().split('T')[0]);

    // Write
    const vfsPath = `/litho_${Date.now()}.3mf`;
    const writer = model.QueryWriter('3mf');
    writer.WriteToFile(vfsPath);
    const buf = Buffer.from(lib.FS.readFile(vfsPath));
    try { lib.FS.unlink(vfsPath); } catch {}
    return buf;
  } finally {
    model.delete();
    wrapper.delete();
  }
}

/** Flat lithophane — a vertical slab with varying thickness */
function _buildFlatLithophane(builder, hm, cellSize, minThick, thickRange) {
  const rows = hm.height, cols = hm.width;

  // Use addHeightmapSurface for the front face
  // But for a flat lithophane we need a different approach:
  // The lithophane stands vertically — X=width, Y=height, Z=thickness
  // Front surface varies by pixel brightness, back surface is flat at Z=0

  // Front surface vertices
  const base = builder.vOff;
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      let h = 0, cnt = 0;
      for (let dr = -1; dr <= 0; dr++) {
        for (let dc = -1; dc <= 0; dc++) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) { h += hm.grid[rr][cc]; cnt++; }
        }
      }
      h = cnt > 0 ? h / cnt : 0;
      const z = minThick + h * thickRange;
      builder._addVertex(c * cellSize, r * cellSize, z);
    }
  }

  // Back surface vertices (flat at Z=0)
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      builder._addVertex(c * cellSize, r * cellSize, 0);
    }
  }

  const stride = cols + 1;
  const front = base;
  const back = base + stride * (rows + 1);

  // Front triangles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = front + r * stride + c, tr = tl + 1, bl = tl + stride, br = bl + 1;
      builder._addTri(tl, bl, tr); builder._addTri(tr, bl, br);
    }
  }
  // Back triangles (reversed)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = back + r * stride + c, tr = tl + 1, bl = tl + stride, br = bl + 1;
      builder._addTri(tl, tr, bl); builder._addTri(tr, br, bl);
    }
  }
  // Side walls
  for (let c = 0; c < cols; c++) {
    builder._addTri(back+c, front+c, front+c+1); builder._addTri(back+c, front+c+1, back+c+1); // bottom
    const ro = rows * stride;
    builder._addTri(front+ro+c, back+ro+c, back+ro+c+1); builder._addTri(front+ro+c, back+ro+c+1, front+ro+c+1); // top
  }
  for (let r = 0; r < rows; r++) {
    const l = r * stride;
    builder._addTri(front+l, back+l, back+l+stride); builder._addTri(front+l, back+l+stride, front+l+stride); // left
    const ri = r * stride + cols;
    builder._addTri(back+ri, front+ri, front+ri+stride); builder._addTri(back+ri, front+ri+stride, back+ri+stride); // right
  }
}

/** Curved lithophane — wrapped around a cylinder */
function _buildCurvedLithophane(builder, hm, cellSize, minThick, thickRange, radius, fullCircle) {
  const rows = hm.height, cols = hm.width;
  const totalWidth = cols * cellSize;
  const arcAngle = fullCircle ? Math.PI * 2 : totalWidth / radius; // radians

  const base = builder.vOff;

  // Outer surface (image side — farther from center)
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      let h = 0, cnt = 0;
      for (let dr = -1; dr <= 0; dr++) {
        for (let dc = -1; dc <= 0; dc++) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) { h += hm.grid[rr][cc]; cnt++; }
        }
      }
      h = cnt > 0 ? h / cnt : 0;
      const thick = minThick + h * thickRange;
      const angle = (c / cols) * arcAngle - arcAngle / 2;
      const outerR = radius + thick;
      builder._addVertex(Math.sin(angle) * outerR, r * cellSize, Math.cos(angle) * outerR);
    }
  }

  // Inner surface (flat light side — closer to center)
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const angle = (c / cols) * arcAngle - arcAngle / 2;
      builder._addVertex(Math.sin(angle) * radius, r * cellSize, Math.cos(angle) * radius);
    }
  }

  const stride = cols + 1;
  const outer = base;
  const inner = base + stride * (rows + 1);

  // Outer triangles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = outer + r * stride + c, tr = tl + 1, bl = tl + stride, br = bl + 1;
      builder._addTri(tl, bl, tr); builder._addTri(tr, bl, br);
    }
  }
  // Inner triangles (reversed)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = inner + r * stride + c, tr = tl + 1, bl = tl + stride, br = bl + 1;
      builder._addTri(tl, tr, bl); builder._addTri(tr, br, bl);
    }
  }

  if (!fullCircle) {
    // Side walls (left, right, top, bottom edges)
    for (let r = 0; r < rows; r++) {
      const l = r * stride;
      builder._addTri(outer+l, inner+l, inner+l+stride); builder._addTri(outer+l, inner+l+stride, outer+l+stride);
      const ri = r * stride + cols;
      builder._addTri(inner+ri, outer+ri, outer+ri+stride); builder._addTri(inner+ri, outer+ri+stride, inner+ri+stride);
    }
    for (let c = 0; c < cols; c++) {
      builder._addTri(inner+c, outer+c, outer+c+1); builder._addTri(inner+c, outer+c+1, inner+c+1);
      const ro = rows * stride;
      builder._addTri(outer+ro+c, inner+ro+c, inner+ro+c+1); builder._addTri(outer+ro+c, inner+ro+c+1, outer+ro+c+1);
    }
  } else {
    // Full cylinder — top and bottom caps only
    for (let c = 0; c < cols; c++) {
      builder._addTri(inner+c, outer+c, outer+c+1); builder._addTri(inner+c, outer+c+1, inner+c+1);
      const ro = rows * stride;
      builder._addTri(outer+ro+c, inner+ro+c, inner+ro+c+1); builder._addTri(outer+ro+c, inner+ro+c+1, outer+ro+c+1);
    }
  }
}
