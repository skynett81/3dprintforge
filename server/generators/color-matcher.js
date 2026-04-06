/**
 * Color Matcher — matches 3MF material colors against filament spool inventory.
 * Uses CIE76 Delta-E color distance for closest match.
 */

import { getLib } from '../mesh-builder.js';

/**
 * Extract colors from a 3MF file buffer
 * @param {Buffer} buffer - 3MF file
 * @returns {Array<{name: string, r: number, g: number, b: number}>}
 */
export async function extractColors(buffer) {
  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();
  const vfsPath = `/color_${Date.now()}.3mf`;

  try {
    lib.FS.writeFile(vfsPath, new Uint8Array(buffer));
    const reader = model.QueryReader('3mf');
    reader.SetStrictModeActive(false);
    reader.ReadFromFile(vfsPath);

    const colors = [];

    // Extract from BaseMaterialGroups
    try {
      const matIter = model.GetBaseMaterialGroups();
      while (matIter.MoveNext()) {
        const group = matIter.GetCurrentBaseMaterialGroup();
        const count = group.GetCount();
        for (let i = 0; i < count; i++) {
          const name = group.GetName(i);
          const c = group.GetDisplayColor(i);
          colors.push({
            name: name || `Material ${colors.length + 1}`,
            r: c.get_Red(), g: c.get_Green(), b: c.get_Blue(),
          });
        }
      }
    } catch {}

    // Extract from ColorGroups
    try {
      const colorIter = model.GetColorGroups();
      while (colorIter.MoveNext()) {
        const group = colorIter.GetCurrentColorGroup();
        const count = group.GetCount();
        for (let i = 0; i < count; i++) {
          const c = group.GetColor(i);
          colors.push({
            name: `Color ${colors.length + 1}`,
            r: c.get_Red(), g: c.get_Green(), b: c.get_Blue(),
          });
        }
      }
    } catch {}

    return colors;
  } finally {
    try { lib.FS.unlink(vfsPath); } catch {}
    model.delete();
    wrapper.delete();
  }
}

/**
 * Match file colors against spool inventory
 * @param {Array<{name: string, r: number, g: number, b: number}>} fileColors
 * @param {Array<{id: number, name: string, color: string, filament_type: string, remaining_pct: number}>} spools
 * @returns {Array<{material: string, color: {r,g,b}, closestSpool: object, distance: number, exact: boolean}>}
 */
export function matchColors(fileColors, spools) {
  return fileColors.map(fc => {
    let bestDist = Infinity;
    let bestSpool = null;

    for (const spool of spools) {
      const sc = _parseHex(spool.color);
      if (!sc) continue;
      const dist = _deltaE(fc, sc);
      if (dist < bestDist) {
        bestDist = dist;
        bestSpool = spool;
      }
    }

    return {
      material: fc.name,
      color: { r: fc.r, g: fc.g, b: fc.b },
      closestSpool: bestSpool ? {
        id: bestSpool.id,
        name: bestSpool.name,
        color: bestSpool.color,
        type: bestSpool.filament_type,
        remaining: bestSpool.remaining_pct,
      } : null,
      distance: Math.round(bestDist * 10) / 10,
      exact: bestDist < 5,
    };
  });
}

// --- CIE76 Delta-E via simplified sRGB→Lab ---

function _srgbToLab(r, g, b) {
  // sRGB → linear
  let rl = r / 255, gl = g / 255, bl = b / 255;
  rl = rl > 0.04045 ? Math.pow((rl + 0.055) / 1.055, 2.4) : rl / 12.92;
  gl = gl > 0.04045 ? Math.pow((gl + 0.055) / 1.055, 2.4) : gl / 12.92;
  bl = bl > 0.04045 ? Math.pow((bl + 0.055) / 1.055, 2.4) : bl / 12.92;

  // Linear RGB → XYZ (D65)
  let x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047;
  let y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750);
  let z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / 1.08883;

  // XYZ → Lab
  const f = v => v > 0.008856 ? Math.cbrt(v) : (7.787 * v) + 16 / 116;
  x = f(x); y = f(y); z = f(z);

  return { L: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

function _deltaE(c1, c2) {
  const lab1 = _srgbToLab(c1.r, c1.g, c1.b);
  const lab2 = _srgbToLab(c2.r, c2.g, c2.b);
  return Math.sqrt(
    Math.pow(lab1.L - lab2.L, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
}

function _parseHex(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const clean = hex.replace('#', '');
  if (clean.length < 6) return null;
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}
