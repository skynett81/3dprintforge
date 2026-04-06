/**
 * Thread Generator — screws, nuts, standoffs, and snap-fit joints
 * Supports metric thread standards M3-M20
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

const THREAD_SPECS = {
  M3:  { pitch: 0.5,  majorD: 3,  minorD: 2.459,  headD: 5.5,  headH: 2 },
  M4:  { pitch: 0.7,  majorD: 4,  minorD: 3.242,  headD: 7,    headH: 2.8 },
  M5:  { pitch: 0.8,  majorD: 5,  minorD: 4.134,  headD: 8,    headH: 3.5 },
  M6:  { pitch: 1.0,  majorD: 6,  minorD: 4.917,  headD: 10,   headH: 4 },
  M8:  { pitch: 1.25, majorD: 8,  minorD: 6.647,  headD: 13,   headH: 5.3 },
  M10: { pitch: 1.5,  majorD: 10, minorD: 8.376,  headD: 16,   headH: 6.4 },
  M12: { pitch: 1.75, majorD: 12, minorD: 10.106, headD: 18,   headH: 7.5 },
  M16: { pitch: 2.0,  majorD: 16, minorD: 13.835, headD: 24,   headH: 10 },
  M20: { pitch: 2.5,  majorD: 20, minorD: 17.294, headD: 30,   headH: 12.5 },
};

/**
 * @param {object} opts
 * @param {string} [opts.type='bolt'] - Type: bolt, nut, standoff, snap-male, snap-female
 * @param {string} [opts.standard='M6'] - Thread standard: M3-M20
 * @param {number} [opts.length=20] - Shaft length 5-100mm
 * @param {number} [opts.tolerance=0.2] - Clearance tolerance 0-0.5mm
 * @param {string} [opts.headType='hex'] - Head type: hex, socket, flat, none (for bolts)
 * @param {{r:number,g:number,b:number}} [opts.color] - RGB color (default steel grey)
 * @returns {Promise<Buffer>}
 */
export async function generateThread3MF(opts = {}) {
  const type = opts.type || 'bolt';
  const standard = THREAD_SPECS[opts.standard] ? opts.standard : 'M6';
  const spec = THREAD_SPECS[standard];
  const length = Math.max(5, Math.min(100, opts.length || 20));
  const tolerance = Math.max(0, Math.min(0.5, opts.tolerance ?? 0.2));
  const headType = opts.headType || 'hex';
  const color = opts.color || { r: 160, g: 165, b: 175 };

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const c = new lib.sColor();
    c.set_Red(color.r); c.set_Green(color.g); c.set_Blue(color.b); c.set_Alpha(255);
    const col = matGroup.AddMaterial('Thread', c);
    c.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName(`${standard} ${type}`);
    mesh.SetObjectLevelProperty(mgId, col);
    const b = new MeshBuilder(lib, mesh);

    switch (type) {
      case 'bolt':
        _buildBolt(b, spec, length, tolerance, headType);
        break;
      case 'nut':
        _buildNut(b, spec, tolerance);
        break;
      case 'standoff':
        _buildStandoff(b, spec, length, tolerance);
        break;
      case 'snap-male':
        _buildSnapMale(b, spec, length);
        break;
      case 'snap-female':
        _buildSnapFemale(b, spec, length);
        break;
      default:
        _buildBolt(b, spec, length, tolerance, headType);
    }

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());
    _addMeta(model, `${standard} ${type}`);
    return _write(lib, model);
  } finally {
    model.delete();
    wrapper.delete();
  }
}

/**
 * Build a bolt: head + core shaft + helical thread
 */
function _buildBolt(b, spec, length, tolerance, headType) {
  const { pitch, majorD, minorD, headD, headH } = spec;
  let headOffset = 0;

  // Head
  if (headType !== 'none') {
    if (headType === 'hex') {
      _addHexPrism(b, 0, 0, 0, headD / 2, headH);
    } else if (headType === 'socket') {
      b.addCylinder(0, 0, 0, headD / 2, headH, 32);
      // Socket recess (smaller cylinder on top)
      b.addCylinder(0, 0, headH - headH * 0.6, majorD / 2 * 0.6, headH * 0.6 + 0.1, 6);
    } else if (headType === 'flat') {
      b.addCylinder(0, 0, 0, headD / 2, headH * 0.4, 32);
    }
    headOffset = headType === 'flat' ? headH * 0.4 : headH;
  }

  // Core shaft (solid cylinder at minor diameter)
  b.addCylinder(0, 0, headOffset, minorD / 2 - tolerance, length, 16);

  // Helical thread strip
  const profileW = (majorD - minorD) / 2;
  const profileH = pitch * 0.4;
  b.addHelicalStrip(0, 0, headOffset, majorD / 2, pitch, length, profileW, profileH, 32);
}

/**
 * Build a nut: hex tube (outer hex, inner cylinder hole)
 */
function _buildNut(b, spec, tolerance) {
  const { majorD, headD, headH } = spec;

  // Outer hex prism
  _addHexPrism(b, 0, 0, 0, headD / 2, headH);

  // Inner bore (cylinder slightly larger than major diameter for thread clearance)
  b.addCylinder(0, 0, -0.1, majorD / 2 + tolerance, headH + 0.2, 24);
}

/**
 * Build a standoff: center body + threaded ends
 */
function _buildStandoff(b, spec, length, tolerance) {
  const { pitch, majorD, minorD, headD, headH } = spec;
  const threadLen = Math.min(headH * 1.5, length * 0.25);
  const bodyLen = length - threadLen * 2;
  const bodyD = headD * 0.8;

  // Bottom threaded section
  b.addCylinder(0, 0, 0, minorD / 2 - tolerance, threadLen, 16);
  const profileW = (majorD - minorD) / 2;
  const profileH = pitch * 0.4;
  b.addHelicalStrip(0, 0, 0, majorD / 2, pitch, threadLen, profileW, profileH, 32);

  // Center body (hex or cylinder)
  _addHexPrism(b, 0, 0, threadLen, bodyD / 2, bodyLen);

  // Top threaded section
  const topZ = threadLen + bodyLen;
  b.addCylinder(0, 0, topZ, minorD / 2 - tolerance, threadLen, 16);
  b.addHelicalStrip(0, 0, topZ, majorD / 2, pitch, threadLen, profileW, profileH, 32);
}

/**
 * Build a snap-fit male clip: shaft with flexible barb at end
 */
function _buildSnapMale(b, spec, length) {
  const { majorD } = spec;
  const shaftW = majorD;
  const shaftD = majorD;
  const clipH = majorD * 0.6;
  const rampLen = majorD * 0.8;

  // Main shaft
  b.addBox(-shaftW / 2, -shaftD / 2, 0, shaftW, shaftD, length);

  // Clip barb (angled ramp at top)
  b.addBox(-shaftW / 2 - clipH / 2, -shaftD / 2, length - rampLen, clipH / 2, shaftD, rampLen);
  b.addBox(shaftW / 2, -shaftD / 2, length - rampLen, clipH / 2, shaftD, rampLen);

  // Ramp tip (wider at top for catch)
  b.addBox(-shaftW / 2 - clipH, -shaftD / 2, length - rampLen * 0.3, clipH, shaftD, rampLen * 0.3);
  b.addBox(shaftW / 2, -shaftD / 2, length - rampLen * 0.3, clipH, shaftD, rampLen * 0.3);
}

/**
 * Build a snap-fit female receiver: tube with slots for clip catch
 */
function _buildSnapFemale(b, spec, length) {
  const { majorD } = spec;
  const outerW = majorD * 2.2;
  const outerD = majorD * 2.2;
  const wall = majorD * 0.4;
  const slotW = majorD * 0.8;
  const slotH = majorD * 1.2;
  const slotZ = length - slotH - majorD * 0.3;

  // Outer shell
  b.addBox(-outerW / 2, -outerD / 2, 0, outerW, outerD, length);

  // Inner cavity (remove core — slightly larger than male shaft)
  const innerW = majorD + 0.4;
  const innerD = majorD + 0.4;
  b.addBox(-innerW / 2, -innerD / 2, -0.1, innerW, innerD, length + 0.2);

  // Side slots (windows for clip to catch through)
  b.addBox(-outerW / 2 - 0.1, -slotW / 2, slotZ, wall + 0.2, slotW, slotH);
  b.addBox(outerW / 2 - wall, -slotW / 2, slotZ, wall + 0.2, slotW, slotH);
}

/**
 * Build a hexagonal prism (6-sided)
 */
function _addHexPrism(b, cx, cy, z, radius, height) {
  const base = b.vOff;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    b._addVertex(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, z);
    b._addVertex(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, z + height);
  }
  // Bottom cap (fan from center)
  const bc = b._addVertex(cx, cy, z);
  for (let i = 0; i < 6; i++) b._addTri(bc, base + ((i + 1) % 6) * 2, base + i * 2);
  // Top cap
  const tc = b._addVertex(cx, cy, z + height);
  for (let i = 0; i < 6; i++) b._addTri(tc, base + i * 2 + 1, base + ((i + 1) % 6) * 2 + 1);
  // Side faces
  for (let i = 0; i < 6; i++) {
    const bl = base + i * 2, tl = bl + 1;
    const br = base + ((i + 1) % 6) * 2, tr = br + 1;
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
