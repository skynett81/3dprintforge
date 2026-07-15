// gcode-parse.ts — minimal G-code → toolpath parser for the preview.
// Walks G0/G1 moves, tracks absolute/relative XYZ + extruder, groups
// segments into layers by Z, and tags extrusion segments by feature
// (wall / infill / support / skirt …) from `; FEATURE:` comments so the
// viewer can colour them like a desktop slicer.

export type Feature =
  | 'outer-wall' | 'inner-wall' | 'wall' | 'solid' | 'sparse' | 'support' | 'skirt' | 'brim' | 'ironing' | 'bridge' | 'gap' | 'wipe_tower';

export interface GcodeLayer {
  z: number;
  /** Extrusion segments per feature, flat: [ax, ay, bx, by, ...] */
  feats: Partial<Record<Feature, number[]>>;
  /** All extrusion segments, flat: [ax, ay, bx, by, ...] (for speed mode) */
  allSeg: number[];
  /** Print speed (mm/s) per extrusion segment, aligned with allSeg. */
  allSpeed: number[];
  /** Volumetric flow (mm³/s) per extrusion segment, aligned with allSeg. */
  allFlow: number[];
  /** Active tool/filament index per extrusion segment, aligned with allSeg. */
  allTool: number[];
  /** Feature type per extrusion segment, aligned with allSeg (for move scrubbing). */
  allFeat: Feature[];
  /** Filament length (mm) extruded per segment, aligned with allSeg. */
  allE: number[];
  /** Part-cooling fan (0-100 %) per segment, aligned with allSeg. */
  allFan: number[];
  /** Travel segments, flat: [ax, ay, bx, by, ...] */
  travel: number[];
  /** Retraction points (nozzle position when filament was retracted), flat [x, y, …]. */
  retractions: number[];
  /** Rough print time for this layer (seconds), from move distance / feedrate. */
  timeSec: number;
  /** Filament extruded on this layer (mm of filament). */
  eLen: number;
}

export interface ParsedGcode {
  layers: GcodeLayer[];
  features: Feature[];
  speedRange: { min: number; max: number };
  flowRange: { min: number; max: number };
  fanRange: { min: number; max: number };
  layerTimeRange: { min: number; max: number };
  tools: number[];
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
    if (!l) { l = { z: key, feats: {}, allSeg: [], allSpeed: [], allFlow: [], allTool: [], allFeat: [], allE: [], allFan: [], travel: [], retractions: [], timeSec: 0, eLen: 0 }; layerByZ.set(key, l); layers.push(l); }
    return l;
  };
  let feed = 0;          // current feedrate (mm/min)
  let tool = 0;          // active tool/filament index
  let fan = 0;           // current part-cooling fan (0-100 %), from M106/M107
  let sMin = Infinity, sMax = 0, fMin = Infinity, fMax = 0, fanMax = 0;
  const toolsSeen = new Set<number>();
  const FIL_AREA = Math.PI * 0.875 * 0.875;   // 1.75 mm filament cross-section (mm²)

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
    // Tool change: "T0", "T1", … selects the active filament.
    if (line[0] === 'T' && /^T\d+$/.test(line)) { tool = parseInt(line.slice(1), 10) || 0; toolsSeen.add(tool); continue; }
    // Part-cooling fan: M106 S<0-255> sets it, M107 turns it off.
    if (head === 'M10') {
      const u = line.toUpperCase();
      if (u.startsWith('M107')) { fan = 0; continue; }
      if (u.startsWith('M106')) { const sm = line.match(/S(-?\d*\.?\d+)/i); const s = sm ? parseFloat(sm[1]) : 255; fan = Math.round(s <= 1 ? s * 100 : (s / 255) * 100); continue; }
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
        case 'F': feed = v; break;
      }
    }

    const extruding = hasE && ne > e + 1e-6;
    const moved = nx !== x || ny !== y;
    if (inPrint) {
      if (nz !== z || !cur) cur = layerFor(nz);
      // Retraction: filament pulled back (E decreases). Record the nozzle spot.
      if (hasE && ne < e - 1e-4 && cur) cur.retractions.push(x, y);
      // Rough per-layer time (distance / feedrate) and filament length.
      if (feed > 0) {
        const dx = nx - x, dy = ny - y, dz = nz - z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 0) cur.timeSec += dist / (feed / 60);
      }
      if (extruding) cur.eLen += ne - e;
      if (moved) {
        if (extruding) {
          const arr = cur.feats[feature] ?? (cur.feats[feature] = []);
          arr.push(x, y, nx, ny);
          const spd = feed / 60;
          const dist2 = Math.hypot(nx - x, ny - y);
          // Volumetric flow (mm³/s) = extruded volume / segment time.
          const flow = dist2 > 0 && spd > 0 ? ((ne - e) * FIL_AREA) / (dist2 / spd) : 0;
          cur.allSeg.push(x, y, nx, ny); cur.allSpeed.push(spd); cur.allFlow.push(flow); cur.allTool.push(tool); cur.allFeat.push(feature); cur.allE.push(ne - e); cur.allFan.push(fan);
          if (fan > fanMax) fanMax = fan;
          if (spd > 0) { if (spd < sMin) sMin = spd; if (spd > sMax) sMax = spd; }
          if (flow > 0) { if (flow < fMin) fMin = flow; if (flow > fMax) fMax = flow; }
          toolsSeen.add(tool);
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
  if (!Number.isFinite(sMin)) sMin = 0;
  if (!Number.isFinite(fMin)) fMin = 0;
  const nonEmpty = layers.filter((l) => Object.keys(l.feats).length || l.travel.length);
  nonEmpty.sort((a, b) => a.z - b.z);
  let ltMin = Infinity, ltMax = 0;
  for (const l of nonEmpty) { if (l.timeSec < ltMin) ltMin = l.timeSec; if (l.timeSec > ltMax) ltMax = l.timeSec; }
  if (!Number.isFinite(ltMin)) ltMin = 0;
  return {
    layers: nonEmpty, features: [...seen],
    speedRange: { min: sMin, max: sMax },
    flowRange: { min: fMin, max: fMax },
    fanRange: { min: 0, max: fanMax },
    layerTimeRange: { min: ltMin, max: ltMax },
    tools: [...toolsSeen].sort((a, b) => a - b),
    bbox: { minX, minY, maxX, maxY, maxZ },
  };
}
