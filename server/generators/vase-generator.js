/**
 * Vase Generator — advanced vases with profile shapes
 * Supports cylinder, sine, bulge, flare, twist, hourglass, and tulip profiles
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

const PROFILES = {
  cylinder: (radius, _amplitude, _frequency, _height, _z) => radius,

  sine: (radius, amplitude, frequency, height, z) =>
    radius + amplitude * Math.sin(z * frequency * 2 * Math.PI / height) * radius,

  bulge: (radius, amplitude, _frequency, height, z) =>
    radius * (1 + amplitude * Math.sin(Math.PI * z / height)),

  flare: (radius, _amplitude, _frequency, height, z) =>
    radius * (0.6 + 0.4 * z / height),

  twist: (radius, amplitude, frequency, height, z) =>
    radius + amplitude * Math.sin(z * frequency * 2 * Math.PI / height) * radius,

  hourglass: (radius, amplitude, _frequency, height, z) =>
    radius * (1 - amplitude * Math.sin(Math.PI * z / height)),

  tulip: (radius, _amplitude, _frequency, height, z) =>
    radius * (0.8 + 0.3 * Math.pow(z / height, 2)),
};

/**
 * @param {object} opts
 * @param {string} [opts.shape='sine'] - Profile shape: cylinder, sine, bulge, flare, twist, hourglass, tulip
 * @param {number} [opts.height=80] - Vase height 30-200mm
 * @param {number} [opts.diameter=60] - Vase diameter 20-120mm
 * @param {number} [opts.wallThickness=1.6] - Wall thickness 0.8-4mm
 * @param {number} [opts.baseHeight=2] - Solid base height 1-5mm
 * @param {number} [opts.layers=50] - Vertical resolution 20-100
 * @param {number} [opts.segments=32] - Radial resolution 16-64
 * @param {number} [opts.amplitude=0.15] - Wave amplitude as fraction of radius 0-0.5
 * @param {number} [opts.frequency=3] - Number of wave cycles 1-8 (for sine/twist)
 * @param {{r:number,g:number,b:number}} [opts.color] - RGB color (default teal)
 * @returns {Promise<Buffer>}
 */
export async function generateVase3MF(opts = {}) {
  const shape = opts.shape || 'sine';
  const height = Math.max(30, Math.min(200, opts.height || 80));
  const diameter = Math.max(20, Math.min(120, opts.diameter || 60));
  const wallThickness = Math.max(0.8, Math.min(4, opts.wallThickness || 1.6));
  const baseHeight = Math.max(1, Math.min(5, opts.baseHeight || 2));
  const layers = Math.max(20, Math.min(100, opts.layers || 50));
  const segments = Math.max(16, Math.min(64, opts.segments || 32));
  const amplitude = Math.max(0, Math.min(0.5, opts.amplitude ?? 0.15));
  const frequency = Math.max(1, Math.min(8, opts.frequency || 3));
  const color = opts.color || { r: 60, g: 200, b: 180 };

  const radius = diameter / 2;
  const profileKey = PROFILES[shape] ? shape : 'sine';
  const profileBase = PROFILES[profileKey];

  const profileFn = (z) => profileBase(radius, amplitude, frequency, height, z);

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const c = new lib.sColor();
    c.set_Red(color.r); c.set_Green(color.g); c.set_Blue(color.b); c.set_Alpha(255);
    const col = matGroup.AddMaterial('Vase', c);
    c.delete();

    const mesh = model.AddMeshObject();
    mesh.SetName('Vase');
    mesh.SetObjectLevelProperty(mgId, col);
    const b = new MeshBuilder(lib, mesh);

    // Solid base disc
    const baseRadius = profileFn(0);
    b.addCylinder(0, 0, 0, baseRadius, baseHeight, segments);

    // Vase body (hollow revolution surface)
    b.addRevolutionSurface(0, 0, baseHeight, profileFn, layers, height - baseHeight, segments, wallThickness);

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());
    _addMeta(model, `Vase (${shape})`);
    return _write(lib, model);
  } finally {
    model.delete();
    wrapper.delete();
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
