// Thumbnail service — extracts print preview images from 3MF files
// Supports: demo mode (SVG placeholders), real printers (FTPS + ZIP extraction)

import { inflateRawSync } from 'node:zlib';
import { getPrinters } from './database.js';

// In-memory cache: printerId → { subtask, buffer, contentType }
const _cache = new Map();

// ---- Minimal ZIP reader (extracts a single file from a ZIP/3MF buffer) ----

function findEOCD(buf) {
  // End of Central Directory signature: 0x06054b50
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65558); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i;
  }
  return -1;
}

function extractFromZip(zipBuf, targetPaths) {
  const eocdOff = findEOCD(zipBuf);
  if (eocdOff < 0) return null;

  const cdOffset = zipBuf.readUInt32LE(eocdOff + 16);
  const entryCount = zipBuf.readUInt16LE(eocdOff + 10);

  let pos = cdOffset;
  for (let i = 0; i < entryCount; i++) {
    if (pos + 46 > zipBuf.length) break;
    if (zipBuf.readUInt32LE(pos) !== 0x02014b50) break;

    const compression = zipBuf.readUInt16LE(pos + 10);
    const compressedSize = zipBuf.readUInt32LE(pos + 20);
    const fnLen = zipBuf.readUInt16LE(pos + 28);
    const extraLen = zipBuf.readUInt16LE(pos + 30);
    const commentLen = zipBuf.readUInt16LE(pos + 32);
    const localOffset = zipBuf.readUInt32LE(pos + 42);
    const filename = zipBuf.subarray(pos + 46, pos + 46 + fnLen).toString('utf8');

    // Check if this file matches any of the target paths
    const match = targetPaths.some(tp => filename === tp || filename.toLowerCase() === tp.toLowerCase());
    if (match) {
      // Read local file header
      if (localOffset + 30 > zipBuf.length) return null;
      if (zipBuf.readUInt32LE(localOffset) !== 0x04034b50) return null;

      const lfhFnLen = zipBuf.readUInt16LE(localOffset + 26);
      const lfhExtraLen = zipBuf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lfhFnLen + lfhExtraLen;

      if (dataStart + compressedSize > zipBuf.length) return null;
      const data = zipBuf.subarray(dataStart, dataStart + compressedSize);

      if (compression === 0) return data; // stored
      if (compression === 8) {
        try { return inflateRawSync(data); } catch { return null; }
      }
      return null;
    }

    pos += 46 + fnLen + extraLen + commentLen;
  }
  return null;
}

// Thumbnail paths to look for inside 3MF files (priority order)
const THUMBNAIL_PATHS = [
  'Metadata/plate_1.png',
  'Metadata/top_1.png',
  'Metadata/plate_2.png',
  'Metadata/thumbnail.png',
  'Metadata/plate_1.jpg',
  'Thumbnails/thumbnail.png'
];

// ---- Demo thumbnails (SVG placeholders) ----

const DEMO_COLORS = {
  'werewolf_bust.3mf': '#b0bec5',
  'cable_clip_x4.3mf': '#81c784',
  'deadpool_grenade.3mf': '#e57373',
  'rv_15amp_inlet_mount.3mf': '#ffb74d',
  'benchy_v2.3mf': '#4fc3f7',
  'vase_mode.3mf': '#4db6ac'
};

const DEMO_SHAPES = {
  'werewolf_bust.3mf': '<ellipse cx="128" cy="130" rx="35" ry="45" fill="COLOR" opacity="0.9"/><ellipse cx="128" cy="85" rx="30" ry="32" fill="COLOR" opacity="0.95"/><path d="M108 78 L98 55 L115 72 Z" fill="COLOR"/><path d="M148 78 L158 55 L141 72 Z" fill="COLOR"/><circle cx="118" cy="82" r="3" fill="#1a1a2e"/><circle cx="138" cy="82" r="3" fill="#1a1a2e"/><path d="M120 95 Q128 100 136 95" stroke="#1a1a2e" stroke-width="2" fill="none"/>',
  'cable_clip_x4.3mf': '<rect x="88" y="90" width="80" height="80" rx="8" fill="COLOR" opacity="0.9"/><rect x="108" y="110" width="40" height="40" rx="20" fill="#1a1a2e"/>',
  'deadpool_grenade.3mf': '<circle cx="128" cy="115" r="38" fill="COLOR" opacity="0.9"/><rect x="118" y="72" width="20" height="15" rx="3" fill="COLOR"/><line x1="128" y1="60" x2="128" y2="72" stroke="COLOR" stroke-width="3"/><circle cx="128" cy="57" r="5" fill="COLOR" opacity="0.7"/><rect x="104" y="150" width="48" height="8" rx="2" fill="COLOR" opacity="0.6"/>',
  'rv_15amp_inlet_mount.3mf': '<rect x="88" y="90" width="80" height="70" rx="6" fill="COLOR" opacity="0.9"/><rect x="98" y="100" width="60" height="50" rx="4" fill="#1a1a2e" opacity="0.7"/><circle cx="118" cy="125" r="8" fill="COLOR" opacity="0.5"/><circle cx="138" cy="125" r="8" fill="COLOR" opacity="0.5"/>',
  'benchy_v2.3mf': '<path d="M68 160 L128 80 L188 160 Z" fill="COLOR" opacity="0.9"/><rect x="78" y="160" width="100" height="20" rx="4" fill="COLOR" opacity="0.6"/>',
  'vase_mode.3mf': '<path d="M108 170 C88 170 78 150 82 120 C86 90 98 75 128 70 C158 75 170 90 174 120 C178 150 168 170 148 170 Z" fill="none" stroke="COLOR" stroke-width="3"/><path d="M108 170 C88 170 78 150 82 120 C86 90 98 75 128 70 C158 75 170 90 174 120 C178 150 168 170 148 170 Z" fill="COLOR" opacity="0.15"/>'
};

function generateDemoThumbnail(subtaskName) {
  const color = DEMO_COLORS[subtaskName] || '#90a4ae';
  const name = (subtaskName || 'print').replace('.3mf', '').replace(/_/g, ' ');
  const shapeSvg = (DEMO_SHAPES[subtaskName] || DEMO_SHAPES['benchy_v2.3mf']).replace(/COLOR/g, color);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bg)" rx="12"/>
  <line x1="48" y1="190" x2="208" y2="190" stroke="${color}" stroke-width="1" opacity="0.3"/>
  <ellipse cx="128" cy="190" rx="80" ry="6" fill="${color}" opacity="0.1"/>
  ${shapeSvg}
  <text x="128" y="224" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="13" font-weight="500" opacity="0.8">${escapeXml(name)}</text>
</svg>`;

  return Buffer.from(svg, 'utf8');
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- FTPS thumbnail fetch (real printers) ----

let _ftpModule = null;

async function getFtpModule() {
  if (_ftpModule !== undefined && _ftpModule !== null) return _ftpModule;
  try {
    _ftpModule = await import('basic-ftp');
    return _ftpModule;
  } catch {
    _ftpModule = false;
    console.log('[thumbnail] basic-ftp not installed — real printer thumbnails disabled. Run: npm install basic-ftp');
    return false;
  }
}

async function fetchThumbnailFromPrinter(ip, accessCode, gcodeFile) {
  const ftp = await getFtpModule();
  if (!ftp) return null;

  // Convert gcode path to 3mf path: /sdcard/file.gcode → /sdcard/file.3mf
  if (!gcodeFile) return null;
  const threeMfPath = gcodeFile.replace(/\.gcode$/i, '.3mf');

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: ip,
      port: 990,
      user: 'bblp',
      password: accessCode,
      secure: 'implicit',
      secureOptions: { rejectUnauthorized: false }
    });

    // Download 3MF file to memory
    const chunks = [];
    const writable = new (await import('node:stream')).Writable({
      write(chunk, _enc, cb) { chunks.push(chunk); cb(); }
    });

    await client.downloadTo(writable, threeMfPath);
    const zipBuf = Buffer.concat(chunks);

    // Extract thumbnail
    const png = extractFromZip(zipBuf, THUMBNAIL_PATHS);
    return png;
  } catch (err) {
    console.warn(`[thumbnail] FTP error for ${ip}: ${err.message}`);

    // Try /cache/ path as fallback
    if (threeMfPath.startsWith('/sdcard/')) {
      try {
        const cachePath = threeMfPath.replace('/sdcard/', '/cache/');
        const chunks2 = [];
        const writable2 = new (await import('node:stream')).Writable({
          write(chunk, _enc, cb) { chunks2.push(chunk); cb(); }
        });
        await client.downloadTo(writable2, cachePath);
        const zipBuf2 = Buffer.concat(chunks2);
        const png = extractFromZip(zipBuf2, THUMBNAIL_PATHS);
        return png;
      } catch {
        // Both paths failed
      }
    }
    return null;
  } finally {
    client.close();
  }
}

// ---- 3D Model extraction from 3MF ----

const MODEL_PATHS = ['3D/3dmodel.model', '3D/3DModel.model'];
const MAX_TRIANGLES = 150000; // Skip models larger than this

function parse3mfModel(xmlBuf) {
  const xml = xmlBuf.toString('utf8');
  const vertices = [];
  const triangles = [];

  // Parse vertices: <vertex x="..." y="..." z="..."/>
  const vRe = /<vertex\s+x="([^"]+)"\s+y="([^"]+)"\s+z="([^"]+)"/g;
  let m;
  while ((m = vRe.exec(xml)) !== null) {
    vertices.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }

  // Parse triangles: <triangle v1="..." v2="..." v3="..."/>
  const tRe = /<triangle\s+v1="(\d+)"\s+v2="(\d+)"\s+v3="(\d+)"/g;
  while ((m = tRe.exec(xml)) !== null) {
    triangles.push(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
  }

  if (vertices.length === 0 || triangles.length === 0) return null;
  if (triangles.length / 3 > MAX_TRIANGLES) return null;

  return { vertices, triangles };
}

// ---- Demo 3D geometry generators ----

function generateIcosphere(subdivisions, radius) {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [
    -1,t,0, 1,t,0, -1,-t,0, 1,-t,0,
    0,-1,t, 0,1,t, 0,-1,-t, 0,1,-t,
    t,0,-1, t,0,1, -t,0,-1, -t,0,1
  ];
  let tris = [
    0,11,5, 0,5,1, 0,1,7, 0,7,10, 0,10,11,
    1,5,9, 5,11,4, 11,10,2, 10,7,6, 7,1,8,
    3,9,4, 3,4,2, 3,2,6, 3,6,8, 3,8,9,
    4,9,5, 2,4,11, 6,2,10, 8,6,7, 9,8,1
  ];

  // Normalize to sphere
  for (let i = 0; i < verts.length; i += 3) {
    const l = Math.sqrt(verts[i]**2 + verts[i+1]**2 + verts[i+2]**2);
    verts[i]/=l; verts[i+1]/=l; verts[i+2]/=l;
  }

  for (let s = 0; s < subdivisions; s++) {
    const mc = {};
    const nt = [];
    function mid(a, b) {
      const k = Math.min(a,b)+'_'+Math.max(a,b);
      if (mc[k]!==undefined) return mc[k];
      let mx=(verts[a*3]+verts[b*3])/2, my=(verts[a*3+1]+verts[b*3+1])/2, mz=(verts[a*3+2]+verts[b*3+2])/2;
      const l=Math.sqrt(mx*mx+my*my+mz*mz); mx/=l; my/=l; mz/=l;
      const idx = verts.length/3; verts.push(mx,my,mz);
      mc[k]=idx; return idx;
    }
    for (let i = 0; i < tris.length; i += 3) {
      const a=tris[i],b=tris[i+1],c=tris[i+2];
      const ab=mid(a,b), bc=mid(b,c), ca=mid(c,a);
      nt.push(a,ab,ca, b,bc,ab, c,ca,bc, ab,bc,ca);
    }
    tris = nt;
  }

  // Scale
  for (let i = 0; i < verts.length; i++) verts[i] *= radius;
  return { vertices: verts, triangles: tris };
}

function generateBox(w, h, d) {
  const x=w/2, y=h/2, z=d/2;
  const v = [
    -x,-y,-z, x,-y,-z, x,y,-z, -x,y,-z,  // back
    -x,-y,z, x,-y,z, x,y,z, -x,y,z        // front
  ];
  const t = [
    0,1,2, 0,2,3, 4,6,5, 4,7,6, // front/back
    0,4,5, 0,5,1, 2,6,7, 2,7,3, // top/bottom
    0,3,7, 0,7,4, 1,5,6, 1,6,2  // sides
  ];
  return { vertices: v, triangles: t };
}

function generateCylinder(radius, height, segments) {
  const v = [];
  const t = [];
  const halfH = height / 2;

  // Bottom center (0), top center (1)
  v.push(0, -halfH, 0);
  v.push(0, halfH, 0);

  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const cx = Math.cos(a) * radius, cz = Math.sin(a) * radius;
    v.push(cx, -halfH, cz); // bottom ring: index 2+i*2
    v.push(cx, halfH, cz);  // top ring: index 3+i*2
  }

  for (let i = 0; i < segments; i++) {
    const b0 = 2+i*2, t0 = 3+i*2, b1 = 2+(i+1)*2, t1 = 3+(i+1)*2;
    // Side
    t.push(b0, b1, t1, b0, t1, t0);
    // Bottom cap
    t.push(0, b1, b0);
    // Top cap
    t.push(1, t0, t1);
  }
  return { vertices: v, triangles: t };
}

function generateBoatShape() {
  // Simplified benchy-like hull
  const v = [
    // Hull bottom
    0,-5,20,  -12,-5,0,  12,-5,0,  -8,-5,-15,  8,-5,-15,  0,-5,-18,
    // Hull top
    0,0,22,  -14,0,0,  14,0,0,  -10,0,-15,  10,0,-15,  0,0,-15,
    // Cabin
    -8,0,-5,  8,0,-5,  8,0,-15,  -8,0,-15,
    -7,8,-5,  7,8,-5,  7,8,-15,  -7,8,-15,
    // Chimney
    -3,8,-7,  3,8,-7,  3,12,-7,  -3,12,-7,
    -3,8,-10, 3,8,-10, 3,12,-10, -3,12,-10
  ];
  const t = [
    // Hull bottom
    0,2,1, 1,2,3, 2,4,3, 3,4,5,
    // Hull sides
    0,1,7, 0,7,6, 1,3,9, 1,9,7, 3,5,11, 3,11,9,
    0,6,8, 0,8,2, 2,8,10, 2,10,4, 4,10,11, 4,11,5,
    // Hull top (bow)
    6,7,8, 7,11,8, 8,11,10, 7,9,11,
    // Cabin
    12,13,17, 12,17,16, 13,14,18, 13,18,17,
    14,15,19, 14,19,18, 15,12,16, 15,16,19,
    16,17,18, 16,18,19,
    // Chimney
    20,21,22, 20,22,23, 24,26,25, 24,27,26,
    20,24,25, 20,25,21, 22,21,25, 22,25,26,
    23,22,26, 23,26,27, 20,23,27, 20,27,24
  ];
  return { vertices: v, triangles: t };
}

// Bust shape: cylinder base + icosphere head
function generateBustShape() {
  const body = generateCylinder(14, 30, 16);
  const head = generateIcosphere(2, 13);
  // Offset head up above body
  const headOffset = 36;
  const offsetVerts = [];
  for (let i = 0; i < head.vertices.length; i += 3) {
    offsetVerts.push(head.vertices[i], head.vertices[i + 1] + headOffset, head.vertices[i + 2]);
  }
  // Merge
  const bodyVertCount = body.vertices.length / 3;
  const verts = [...body.vertices, ...offsetVerts];
  const tris = [...body.triangles];
  for (const idx of head.triangles) {
    tris.push(idx + bodyVertCount);
  }
  return { vertices: verts, triangles: tris };
}

// Grenade shape: icosphere body + cylinder pin on top
function generateGrenadeShape() {
  const body = generateIcosphere(2, 18);
  // Offset body up so it sits on ground
  const bodyVerts = [];
  for (let i = 0; i < body.vertices.length; i += 3) {
    bodyVerts.push(body.vertices[i], body.vertices[i + 1] + 18, body.vertices[i + 2]);
  }
  const cap = generateCylinder(6, 8, 12);
  const capOffset = 36;
  const capVerts = [];
  for (let i = 0; i < cap.vertices.length; i += 3) {
    capVerts.push(cap.vertices[i], cap.vertices[i + 1] + capOffset, cap.vertices[i + 2]);
  }
  const bodyVertCount = bodyVerts.length / 3;
  const verts = [...bodyVerts, ...capVerts];
  const tris = [...body.triangles];
  for (const idx of cap.triangles) {
    tris.push(idx + bodyVertCount);
  }
  return { vertices: verts, triangles: tris };
}

const DEMO_MODEL_COLORS = {
  'werewolf_bust.3mf': [0.7, 0.75, 0.78],
  'cable_clip_x4.3mf': [0.5, 0.78, 0.5],
  'deadpool_grenade.3mf': [0.9, 0.45, 0.45],
  'rv_15amp_inlet_mount.3mf': [0.95, 0.72, 0.3],
  'benchy_v2.3mf': [0.95, 0.65, 0.25],
  'vase_mode.3mf': [0.3, 0.71, 0.67]
};

function generateDemoModel(subtaskName) {
  let model;
  switch (subtaskName) {
    case 'werewolf_bust.3mf':
      model = generateBustShape();
      break;
    case 'cable_clip_x4.3mf':
      model = generateIcosphere(2, 15);
      break;
    case 'deadpool_grenade.3mf':
      model = generateGrenadeShape();
      break;
    case 'rv_15amp_inlet_mount.3mf':
      model = generateBox(30, 15, 25);
      break;
    case 'benchy_v2.3mf':
      model = generateBoatShape();
      break;
    case 'vase_mode.3mf':
      model = generateCylinder(18, 50, 24);
      break;
    default:
      model = generateIcosphere(2, 20);
  }
  model.color = DEMO_MODEL_COLORS[subtaskName] || [0.95, 0.65, 0.25];
  return model;
}

// ---- Model cache ----
const _modelCache = new Map();

// ---- Public API ----

const IS_DEMO = process.env.BAMBU_DEMO === 'true';

/**
 * Get thumbnail for a printer's current print job.
 * @param {string} printerId
 * @param {object} hub - WebSocketHub instance (for accessing printer states)
 * @returns {{ buffer: Buffer, contentType: string } | null}
 */
export async function getThumbnail(printerId, hub) {
  // Get current printer state from hub
  const printerState = hub?.printerStates?.[printerId];
  if (!printerState) return null;

  const printData = printerState.print || printerState;
  const gcodeState = printData.gcode_state;
  const subtask = printData.subtask_name || '';
  const gcodeFile = printData.gcode_file || '';

  // Only show thumbnail when print is active
  const isActive = ['RUNNING', 'PAUSE', 'PREPARE'].includes(gcodeState);
  if (!isActive || !subtask) return null;

  // Check cache
  const cached = _cache.get(printerId);
  if (cached && cached.subtask === subtask) {
    return { buffer: cached.buffer, contentType: cached.contentType };
  }

  // Demo mode: generate SVG placeholder
  if (IS_DEMO) {
    const svg = generateDemoThumbnail(subtask);
    const entry = { subtask, buffer: svg, contentType: 'image/svg+xml' };
    _cache.set(printerId, entry);
    return { buffer: svg, contentType: 'image/svg+xml' };
  }

  // Real printer: fetch via FTPS
  const printers = getPrinters();
  const printer = printers.find(p => p.id === printerId);
  if (!printer || !printer.ip || !printer.access_code) return null;

  const png = await fetchThumbnailFromPrinter(printer.ip, printer.access_code, gcodeFile);
  if (!png) return null;

  const entry = { subtask, buffer: png, contentType: 'image/png' };
  _cache.set(printerId, entry);
  return { buffer: png, contentType: 'image/png' };
}

/**
 * Get 3D model data for a printer's current print job.
 * @param {string} printerId
 * @param {object} hub - WebSocketHub instance
 * @returns {{ vertices: number[], triangles: number[], color?: number[] } | null}
 */
export async function getModel(printerId, hub) {
  const printerState = hub?.printerStates?.[printerId];
  if (!printerState) return null;

  const printData = printerState.print || printerState;
  const gcodeState = printData.gcode_state;
  const subtask = printData.subtask_name || '';
  const gcodeFile = printData.gcode_file || '';

  const isActive = ['RUNNING', 'PAUSE', 'PREPARE'].includes(gcodeState);
  if (!isActive || !subtask) return null;

  // Check cache
  const cached = _modelCache.get(printerId);
  if (cached && cached.subtask === subtask) return cached.model;

  // Demo mode: generate geometry
  if (IS_DEMO) {
    const model = generateDemoModel(subtask);
    _modelCache.set(printerId, { subtask, model });
    return model;
  }

  // Real printer: fetch 3MF via FTPS and parse model XML
  const printers = getPrinters();
  const printer = printers.find(p => p.id === printerId);
  if (!printer || !printer.ip || !printer.access_code) return null;

  const zipBuf = await download3mf(printer.ip, printer.access_code, gcodeFile);
  if (!zipBuf) return null;

  const modelXml = extractFromZip(zipBuf, MODEL_PATHS);
  if (!modelXml) return null;

  const model = parse3mfModel(modelXml);
  if (!model) return null;

  _modelCache.set(printerId, { subtask, model });
  return model;
}

// Download full 3MF ZIP (shared between thumbnail and model)
async function download3mf(ip, accessCode, gcodeFile) {
  const ftp = await getFtpModule();
  if (!ftp) return null;
  if (!gcodeFile) return null;

  const threeMfPath = gcodeFile.replace(/\.gcode$/i, '.3mf');
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: ip, port: 990, user: 'bblp', password: accessCode,
      secure: 'implicit', secureOptions: { rejectUnauthorized: false }
    });

    const chunks = [];
    const { Writable } = await import('node:stream');
    const writable = new Writable({ write(chunk, _enc, cb) { chunks.push(chunk); cb(); } });
    await client.downloadTo(writable, threeMfPath);
    return Buffer.concat(chunks);
  } catch {
    return null;
  } finally {
    client.close();
  }
}

/**
 * Clear cached thumbnail/model for a printer.
 */
export function clearThumbnailCache(printerId) {
  if (printerId) {
    _cache.delete(printerId);
    _modelCache.delete(printerId);
  } else {
    _cache.clear();
    _modelCache.clear();
  }
}
