/**
 * G-code toolpath parser — extracts 3D line segments from G0/G1 moves
 * Per-layer detection, downsampling, caching, and Moonraker download
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';

const DATA_DIR = process.env.DATA_DIR || join(import.meta.dirname, '..', 'data');
const CACHE_DIR = join(DATA_DIR, 'toolpath-cache');
const MAX_SEGMENTS = 100000;
const MAX_CACHE_MB = 300;

/**
 * Parse gcode text into per-layer line segments
 * @param {string} text - Raw gcode content
 * @returns {{ layers: Array, bounds: Object, layerCount: number, totalMoves: number }}
 */
export function parseGcodeToolpath(text) {
  let x = 0, y = 0, z = 0, e = 0;
  let absXYZ = true, absE = true;
  let currentZ = 0;
  let layers = [];
  let currentLayer = { z: 0, segments: [] };
  let totalMoves = 0;

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    const semi = line.indexOf(';');
    if (semi >= 0) line = line.substring(0, semi).trim();
    if (!line) continue;

    const cmd = line.split(/\s+/)[0].toUpperCase();

    if (cmd === 'G90') { absXYZ = true; absE = true; continue; }
    if (cmd === 'G91') { absXYZ = false; absE = false; continue; }
    if (cmd === 'M82') { absE = true; continue; }
    if (cmd === 'M83') { absE = false; continue; }

    if (cmd === 'G92') {
      const px = parseParam(line, 'X'); if (px !== null) x = px;
      const py = parseParam(line, 'Y'); if (py !== null) y = py;
      const pz = parseParam(line, 'Z'); if (pz !== null) z = pz;
      const pe = parseParam(line, 'E'); if (pe !== null) e = pe;
      continue;
    }

    if (cmd === 'G28') {
      x = 0; y = 0; z = 0;
      continue;
    }

    if (cmd !== 'G0' && cmd !== 'G1') continue;

    const prevX = x, prevY = y, prevZ = z, prevE = e;

    const px = parseParam(line, 'X');
    const py = parseParam(line, 'Y');
    const pz = parseParam(line, 'Z');
    const pe = parseParam(line, 'E');

    if (absXYZ) {
      if (px !== null) x = px;
      if (py !== null) y = py;
      if (pz !== null) z = pz;
    } else {
      if (px !== null) x += px;
      if (py !== null) y += py;
      if (pz !== null) z += pz;
    }

    if (pe !== null) {
      if (absE) e = pe;
      else e += pe;
    }

    totalMoves++;

    // Only emit extrusion moves (not travel)
    const isExtrude = pe !== null && (absE ? e > prevE : pe > 0);
    if (!isExtrude) continue;

    // New layer on Z change
    if (Math.abs(z - currentZ) > 0.001) {
      if (currentLayer.segments.length > 0) {
        layers.push(currentLayer);
      }
      currentZ = z;
      currentLayer = { z: currentZ, segments: [] };
    }

    // Add segment: x1,y1,z1, x2,y2,z2
    currentLayer.segments.push(prevX, prevY, prevZ, x, y, z);
  }

  // Push last layer
  if (currentLayer.segments.length > 0) {
    layers.push(currentLayer);
  }

  // Compute bounds
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const layer of layers) {
    for (let i = 0; i < layer.segments.length; i += 6) {
      for (let j = 0; j < 6; j += 3) {
        const sx = layer.segments[i + j], sy = layer.segments[i + j + 1], sz = layer.segments[i + j + 2];
        if (sx < minX) minX = sx; if (sx > maxX) maxX = sx;
        if (sy < minY) minY = sy; if (sy > maxY) maxY = sy;
        if (sz < minZ) minZ = sz; if (sz > maxZ) maxZ = sz;
      }
    }
  }

  if (!isFinite(minX)) { minX = minY = minZ = maxX = maxY = maxZ = 0; }

  return {
    type: 'toolpath',
    layers,
    bounds: { minX, minY, minZ, maxX, maxY, maxZ },
    layerCount: layers.length,
    totalMoves,
    extrusionSegments: layers.reduce((s, l) => s + l.segments.length / 6, 0),
  };
}

function parseParam(line, param) {
  const re = new RegExp(param + '([\\-\\d.]+)', 'i');
  const m = line.match(re);
  return m ? parseFloat(m[1]) : null;
}

/**
 * Downsample toolpath to max segments
 */
export function downsampleToolpath(toolpath, maxSegments = MAX_SEGMENTS) {
  const totalSegs = toolpath.layers.reduce((s, l) => s + l.segments.length / 6, 0);
  if (totalSegs <= maxSegments) return toolpath;

  const ratio = maxSegments / totalSegs;
  const newLayers = [];

  for (const layer of toolpath.layers) {
    const segCount = layer.segments.length / 6;
    const budget = Math.max(2, Math.ceil(segCount * ratio));
    const step = Math.max(1, Math.floor(segCount / budget));
    const newSegs = [];
    for (let i = 0; i < layer.segments.length; i += step * 6) {
      for (let j = 0; j < 6 && (i + j) < layer.segments.length; j++) {
        newSegs.push(layer.segments[i + j]);
      }
    }
    newLayers.push({ z: layer.z, segments: newSegs });
  }

  return { ...toolpath, layers: newLayers, extrusionSegments: newLayers.reduce((s, l) => s + l.segments.length / 6, 0) };
}

/**
 * Download gcode from Moonraker printer
 */
export async function downloadGcodeFromMoonraker(ip, port, filename) {
  const cleanName = filename.replace(/^\//, '');
  const url = `http://${ip}:${port}/server/files/gcodes/${encodeURIComponent(cleanName)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Cache management
 */
export function getCachedToolpath(key) {
  try {
    const fp = join(CACHE_DIR, key + '.json.gz');
    if (!existsSync(fp)) return null;
    return JSON.parse(gunzipSync(readFileSync(fp)).toString('utf8'));
  } catch { return null; }
}

export function saveCachedToolpath(key, data) {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
    const fp = join(CACHE_DIR, key + '.json.gz');
    writeFileSync(fp, gzipSync(JSON.stringify(data)));
  } catch { /* non-critical */ }
}

export function toolpathCacheKey(filename, fileSize) {
  const safe = (filename || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 80);
  return `${safe}_${fileSize || 0}`;
}

/**
 * Parse and cache a gcode file with downsampling
 */
/**
 * Analyze gcode for statistics, errors, and material estimation
 * @param {string} text - Raw gcode content
 * @returns {object} Analysis results
 */
export function analyzeGcode(text) {
  const lines = text.split('\n');
  let totalExtrusion = 0, totalTravel = 0, retractions = 0;
  let maxTemp = 0, maxBedTemp = 0, layerCount = 0;
  let x = 0, y = 0, z = 0, e = 0, lastZ = 0;
  let estimatedTime = 0; // seconds
  const warnings = [];
  const layerHeights = new Set();

  for (const raw of lines) {
    const line = raw.split(';')[0].trim();
    if (!line) continue;

    // Temperature commands
    const m104 = line.match(/^M10[49]\s+S(\d+)/);
    if (m104) maxTemp = Math.max(maxTemp, parseInt(m104[1]));
    const m140 = line.match(/^M14[09]\s+S(\d+)/);
    if (m140) maxBedTemp = Math.max(maxBedTemp, parseInt(m140[1]));

    // Time estimate from slicer comments
    const timeMatch = raw.match(/;.*estimated.*time.*?(\d+)/i) || raw.match(/;TIME:(\d+)/);
    if (timeMatch) estimatedTime = Math.max(estimatedTime, parseInt(timeMatch[1]));

    // Movement commands
    if (line.startsWith('G0') || line.startsWith('G1')) {
      const xm = line.match(/X([-\d.]+)/), ym = line.match(/Y([-\d.]+)/), zm = line.match(/Z([-\d.]+)/), em = line.match(/E([-\d.]+)/), fm = line.match(/F([\d.]+)/);
      const nx = xm ? parseFloat(xm[1]) : x;
      const ny = ym ? parseFloat(ym[1]) : y;
      const nz = zm ? parseFloat(zm[1]) : z;
      const ne = em ? parseFloat(em[1]) : e;
      const dist = Math.sqrt((nx-x)**2 + (ny-y)**2 + (nz-z)**2);

      if (ne > e) totalExtrusion += ne - e;
      else if (ne < e) retractions++;
      if (ne === e && dist > 0) totalTravel += dist;

      if (nz !== lastZ) { layerCount++; layerHeights.add(+(nz - lastZ).toFixed(3)); lastZ = nz; }

      x = nx; y = ny; z = nz; e = ne;
    }
  }

  // Filament weight estimation (PLA density ~1.24 g/cm³, 1.75mm diameter)
  const filamentLengthMm = totalExtrusion;
  const filamentVolumeCm3 = Math.PI * (0.0875 ** 2) * (filamentLengthMm / 10);
  const filamentWeightG = filamentVolumeCm3 * 1.24;

  // Warnings
  if (maxTemp > 300) warnings.push({ type: 'high_temp', message: `Nozzle temp ${maxTemp}°C exceeds 300°C`, severity: 'warning' });
  if (maxBedTemp > 120) warnings.push({ type: 'high_bed', message: `Bed temp ${maxBedTemp}°C exceeds 120°C`, severity: 'warning' });
  if (retractions > 10000) warnings.push({ type: 'excessive_retractions', message: `${retractions} retractions detected`, severity: 'info' });
  if (layerCount === 0) warnings.push({ type: 'no_layers', message: 'No Z changes detected', severity: 'error' });

  return {
    layerCount,
    layerHeights: [...layerHeights].sort((a,b) => a-b),
    totalExtrusionMm: Math.round(totalExtrusion),
    totalTravelMm: Math.round(totalTravel),
    retractionCount: retractions,
    filamentLengthM: +(filamentLengthMm / 1000).toFixed(2),
    filamentWeightG: +filamentWeightG.toFixed(1),
    maxNozzleTemp: maxTemp,
    maxBedTemp,
    estimatedTimeSeconds: estimatedTime,
    estimatedTimeMinutes: Math.round(estimatedTime / 60),
    objectHeight: +z.toFixed(2),
    warnings,
  };
}

export function parseAndCache(gcodeText, filename) {
  const cacheKey = toolpathCacheKey(filename, gcodeText.length);
  const cached = getCachedToolpath(cacheKey);
  if (cached) return cached;

  const toolpath = parseGcodeToolpath(gcodeText);
  const downsampled = downsampleToolpath(toolpath);
  saveCachedToolpath(cacheKey, downsampled);
  return downsampled;
}
