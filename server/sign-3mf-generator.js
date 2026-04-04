/**
 * 3MF Sign Generator — creates printable 3D sign models
 * Uses lib3mf WASM to generate spec-compliant 3MF files with:
 * - Base plate (customisable size)
 * - QR code as raised/embossed blocks
 * - Text rendered as pixel font blocks
 */

let _lib = null;

async function getLib() {
  if (_lib) return _lib;
  const init = (await import('@3mfconsortium/lib3mf')).default;
  _lib = await init();
  return _lib;
}

// Simple 5x7 pixel font for uppercase + digits
const FONT = {
  'A': [0x7C,0x12,0x11,0x12,0x7C], 'B': [0x7F,0x49,0x49,0x49,0x36], 'C': [0x3E,0x41,0x41,0x41,0x22],
  'D': [0x7F,0x41,0x41,0x22,0x1C], 'E': [0x7F,0x49,0x49,0x49,0x41], 'F': [0x7F,0x09,0x09,0x09,0x01],
  'G': [0x3E,0x41,0x49,0x49,0x7A], 'H': [0x7F,0x08,0x08,0x08,0x7F], 'I': [0x00,0x41,0x7F,0x41,0x00],
  'J': [0x20,0x40,0x41,0x3F,0x01], 'K': [0x7F,0x08,0x14,0x22,0x41], 'L': [0x7F,0x40,0x40,0x40,0x40],
  'M': [0x7F,0x02,0x0C,0x02,0x7F], 'N': [0x7F,0x04,0x08,0x10,0x7F], 'O': [0x3E,0x41,0x41,0x41,0x3E],
  'P': [0x7F,0x09,0x09,0x09,0x06], 'Q': [0x3E,0x41,0x51,0x21,0x5E], 'R': [0x7F,0x09,0x19,0x29,0x46],
  'S': [0x46,0x49,0x49,0x49,0x31], 'T': [0x01,0x01,0x7F,0x01,0x01], 'U': [0x3F,0x40,0x40,0x40,0x3F],
  'V': [0x1F,0x20,0x40,0x20,0x1F], 'W': [0x3F,0x40,0x30,0x40,0x3F], 'X': [0x63,0x14,0x08,0x14,0x63],
  'Y': [0x07,0x08,0x70,0x08,0x07], 'Z': [0x61,0x51,0x49,0x45,0x43],
  '0': [0x3E,0x51,0x49,0x45,0x3E], '1': [0x00,0x42,0x7F,0x40,0x00], '2': [0x42,0x61,0x51,0x49,0x46],
  '3': [0x21,0x41,0x45,0x4B,0x31], '4': [0x18,0x14,0x12,0x7F,0x10], '5': [0x27,0x45,0x45,0x45,0x39],
  '6': [0x3C,0x4A,0x49,0x49,0x30], '7': [0x01,0x71,0x09,0x05,0x03], '8': [0x36,0x49,0x49,0x49,0x36],
  '9': [0x06,0x49,0x49,0x29,0x1E],
  ' ': [0x00,0x00,0x00,0x00,0x00], '.': [0x00,0x60,0x60,0x00,0x00], ':': [0x00,0x36,0x36,0x00,0x00],
  '-': [0x08,0x08,0x08,0x08,0x08], '/': [0x20,0x10,0x08,0x04,0x02], '!': [0x00,0x00,0x5F,0x00,0x00],
  '?': [0x02,0x01,0x51,0x09,0x06], '@': [0x3E,0x41,0x5D,0x55,0x4E],
};

/**
 * Generate a QR code as a 2D boolean grid
 */
function generateQRGrid(text) {
  // Use a simple QR-like pattern for the data
  // In production this would use a proper QR library server-side
  // For now, generate a checkered pattern that encodes data length
  const size = Math.max(21, Math.min(41, 21 + Math.floor(text.length / 10) * 4));
  const grid = [];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      // Finder patterns (top-left, top-right, bottom-left)
      const inFinder = (cx, cy) => Math.max(Math.abs(x - cx), Math.abs(y - cy)) <= 3;
      const finderVal = (cx, cy) => {
        const d = Math.max(Math.abs(x - cx), Math.abs(y - cy));
        return d === 0 || d === 2 || d === 3;
      };
      if (inFinder(3, 3)) { row.push(finderVal(3, 3)); continue; }
      if (inFinder(size - 4, 3)) { row.push(finderVal(size - 4, 3)); continue; }
      if (inFinder(3, size - 4)) { row.push(finderVal(3, size - 4)); continue; }
      // Timing patterns
      if (y === 6) { row.push(x % 2 === 0); continue; }
      if (x === 6) { row.push(y % 2 === 0); continue; }
      // Data — hash-based pseudorandom from the text
      const hash = (text.charCodeAt((x + y * size) % text.length) || 0) * 31 + x * 7 + y * 13;
      row.push(hash % 3 !== 0);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Render text as pixel blocks grid
 * Returns { grid: boolean[][], width, height }
 */
function textToGrid(text) {
  const chars = text.toUpperCase().split('');
  const height = 7;
  const charWidth = 5;
  const spacing = 1;
  const totalWidth = chars.length * (charWidth + spacing) - spacing;
  const grid = Array.from({ length: height }, () => Array(totalWidth).fill(false));

  let xOff = 0;
  for (const ch of chars) {
    const glyph = FONT[ch] || FONT[' '];
    for (let col = 0; col < charWidth; col++) {
      const colData = glyph[col] || 0;
      for (let row = 0; row < height; row++) {
        if (colData & (1 << row)) {
          grid[row][xOff + col] = true;
        }
      }
    }
    xOff += charWidth + spacing;
  }

  return { grid, width: totalWidth, height };
}

/**
 * Add a box mesh to a lib3mf model
 */
function addBox(lib, mesh, x, y, z, w, h, d, vOffset) {
  const corners = [
    [x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],
    [x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d]
  ];
  for (const [cx, cy, cz] of corners) {
    const p = new lib.sPosition();
    p.set_Coordinates0(cx); p.set_Coordinates1(cy); p.set_Coordinates2(cz);
    mesh.AddVertex(p);
    p.delete();
  }
  const faces = [[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[2,3,7],[2,7,6],[1,2,6],[1,6,5],[0,4,7],[0,7,3]];
  for (const [a, b, c] of faces) {
    const t = new lib.sTriangle();
    t.set_Indices0(vOffset + a); t.set_Indices1(vOffset + b); t.set_Indices2(vOffset + c);
    mesh.AddTriangle(t);
    t.delete();
  }
  return vOffset + 8;
}

/**
 * Generate a 3MF sign file
 * @param {Object} opts
 * @param {string} opts.title - Main title text
 * @param {string} opts.subtitle - Subtitle text
 * @param {string} opts.qrData - Data to encode in QR code
 * @param {number} opts.plateWidth - Plate width in mm (default 80)
 * @param {number} opts.plateHeight - Plate height in mm (default 50)
 * @param {number} opts.plateDepth - Plate thickness in mm (default 2)
 * @param {number} opts.textHeight - Raised text height in mm (default 0.8)
 * @param {number} opts.pixelSize - Size of each QR/text pixel in mm (default 1.2)
 * @returns {Promise<Buffer>} 3MF file buffer
 */
export async function generateSign3MF(opts = {}) {
  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const pw = opts.plateWidth || 80;
    const ph = opts.plateHeight || 50;
    const pd = opts.plateDepth || 2;
    const th = opts.textHeight || 0.8;
    const px = opts.pixelSize || 1.2;

    const mesh = model.AddMeshObject();
    mesh.SetName(opts.title || 'Sign');

    let vOff = 0;

    // Base plate
    vOff = addBox(lib, mesh, 0, 0, 0, pw, ph, pd, vOff);

    // QR code blocks
    if (opts.qrData) {
      const qrGrid = generateQRGrid(opts.qrData);
      const qrSize = qrGrid.length;
      const qrTotalSize = qrSize * px;
      const qrX = (pw - qrTotalSize) / 2;
      const qrY = opts.title ? ph * 0.15 : (ph - qrTotalSize) / 2;

      for (let row = 0; row < qrSize; row++) {
        for (let col = 0; col < qrSize; col++) {
          if (qrGrid[row][col]) {
            vOff = addBox(lib, mesh, qrX + col * px, qrY + row * px, pd, px * 0.95, px * 0.95, th, vOff);
          }
        }
      }
    }

    // Title text
    if (opts.title) {
      const titleGrid = textToGrid(opts.title);
      const scale = Math.min(px * 1.5, (pw - 4) / titleGrid.width);
      const textX = (pw - titleGrid.width * scale) / 2;
      const textY = ph - 3 - titleGrid.height * scale;

      for (let row = 0; row < titleGrid.height; row++) {
        for (let col = 0; col < titleGrid.width; col++) {
          if (titleGrid.grid[row][col]) {
            vOff = addBox(lib, mesh, textX + col * scale, textY + row * scale, pd, scale * 0.9, scale * 0.9, th, vOff);
          }
        }
      }
    }

    // Subtitle text
    if (opts.subtitle) {
      const subGrid = textToGrid(opts.subtitle);
      const scale = Math.min(px * 0.8, (pw - 4) / subGrid.width);
      const textX = (pw - subGrid.width * scale) / 2;
      const textY = 2;

      for (let row = 0; row < subGrid.height; row++) {
        for (let col = 0; col < subGrid.width; col++) {
          if (subGrid.grid[row][col]) {
            vOff = addBox(lib, mesh, textX + col * scale, textY + row * scale, pd, scale * 0.9, scale * 0.9, th * 0.8, vOff);
          }
        }
      }
    }

    // Set metadata
    const mdg = model.GetMetaDataGroup();
    if (opts.title) {
      const md = mdg.AddMetaData('', 'Title', opts.title, 'string', true);
      md.delete();
    }
    const appMd = mdg.AddMetaData('', 'Application', '3DPrintForge Sign Maker', 'string', true);
    appMd.delete();

    model.AddBuildItem(mesh, wrapper.GetIdentityTransform());

    // Write to buffer
    const vfsPath = `/sign_${Date.now()}.3mf`;
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
