// gcode-parse.ts — minimal G-code → toolpath parser for the preview.
// Walks G0/G1 moves, tracks absolute/relative XYZ + extruder, groups
// segments into layers by Z, and tags extrusion segments by feature
// (wall / infill / support / skirt …) from `; FEATURE:` comments so the
// viewer can colour them like a desktop slicer.

export type Feature =
  | 'outer-wall' | 'inner-wall' | 'wall' | 'solid' | 'sparse' | 'support' | 'skirt' | 'brim';

export interface GcodeLayer {
  z: number;
  /** Extrusion segments per feature, flat: [ax, ay, bx, by, ...] */
  feats: Partial<Record<Feature, number[]>>;
  /** Travel segments, flat: [ax, ay, bx, by, ...] */
  travel: number[];
}

export interface ParsedGcode {
  layers: GcodeLayer[];
  features: Feature[];
  bbox: { minX: number; minY: number; maxX: number; maxY: number; maxZ: number };
}

const NUM = /([XYZEF])(-?\d*\.?\d+)/g;

export function parseGcode(text: string): ParsedGcode {
  let x = 0, y = 0, z = 0, e = 0;
  let absXYZ = true, absE = true;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = 0;
  let feature: Feature = 'wall';
  const seen = new Set<Feature>();

  const layers: GcodeLayer[] = [];
  const layerByZ = new Map<number, GcodeLayer>();
  let cur: GcodeLayer | null = null;

  const layerFor = (zz: number): GcodeLayer => {
    const key = Math.round(zz * 100) / 100;
    let l = layerByZ.get(key);
    if (!l) { l = { z: key, feats: {}, travel: [] }; layerByZ.set(key, l); layers.push(l); }
    return l;
  };

  const gated = text.includes('--- layer');
  let inPrint = !gated;

  const lines = text.split('\n');
  for (let li = 0; li < lines.length; li++) {
    const raw = lines[li];
    if (gated && !inPrint && raw.includes('--- layer')) inPrint = true;
    // Feature tag (read from the comment before stripping).
    const fIdx = raw.indexOf('FEATURE:');
    if (fIdx >= 0) { feature = raw.slice(fIdx + 8).trim() as Feature; continue; }

    const semi = raw.indexOf(';');
    const line = (semi >= 0 ? raw.slice(0, semi) : raw).trim();
    if (!line) continue;
    const head = line.slice(0, 3).toUpperCase();

    if (head === 'G90') { absXYZ = true; continue; }
    if (head === 'G91') { absXYZ = false; continue; }
    if (head === 'M82') { absE = true; continue; }
    if (head === 'M83') { absE = false; continue; }
    if (line.toUpperCase().startsWith('G92')) {
      NUM.lastIndex = 0; let m: RegExpExecArray | null;
      while ((m = NUM.exec(line))) { if (m[1] === 'E') e = parseFloat(m[2]); }
      continue;
    }
    if (head !== 'G0 ' && head !== 'G1 ' && head !== 'G0' && head !== 'G1') continue;

    let nx = x, ny = y, nz = z, ne = e, hasE = false;
    NUM.lastIndex = 0; let mm: RegExpExecArray | null;
    while ((mm = NUM.exec(line))) {
      const v = parseFloat(mm[2]);
      switch (mm[1]) {
        case 'X': nx = absXYZ ? v : x + v; break;
        case 'Y': ny = absXYZ ? v : y + v; break;
        case 'Z': nz = absXYZ ? v : z + v; break;
        case 'E': ne = absE ? v : e + v; hasE = true; break;
      }
    }

    const extruding = hasE && ne > e + 1e-6;
    const moved = nx !== x || ny !== y;
    if (inPrint) {
      if (nz !== z || !cur) cur = layerFor(nz);
      if (moved) {
        if (extruding) {
          const arr = cur.feats[feature] ?? (cur.feats[feature] = []);
          arr.push(x, y, nx, ny);
          seen.add(feature);
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
          if (nx < minX) minX = nx; if (nx > maxX) maxX = nx;
          if (ny < minY) minY = ny; if (ny > maxY) maxY = ny;
        } else {
          cur.travel.push(x, y, nx, ny);
        }
      }
      if (nz > maxZ) maxZ = nz;
    }
    x = nx; y = ny; z = nz; e = ne;
  }

  if (!Number.isFinite(minX)) { minX = minY = 0; maxX = maxY = 0; }
  const nonEmpty = layers.filter((l) => Object.keys(l.feats).length || l.travel.length);
  nonEmpty.sort((a, b) => a.z - b.z);
  return { layers: nonEmpty, features: [...seen], bbox: { minX, minY, maxX, maxY, maxZ } };
}
