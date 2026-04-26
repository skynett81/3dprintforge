/**
 * 3MF and Gcode file parsers for extracting filament usage data
 * Uses lib3mf WASM for standard 3MF metadata + custom ZIP parsing for slicer-specific configs
 */
import { inflateRawSync } from 'node:zlib';
import { parse3mfBuffer } from './lib3mf-parser.js';

/**
 * Parse ZIP entries from a buffer (for slicer-specific config files that lib3mf doesn't expose)
 */
// Reject entry names that escape the archive root. Covers:
//  - absolute paths: "/foo" or "C:\\foo" or "\\foo"
//  - parent-directory traversal: "../bar" or "a/../../b"
//  - null bytes and control chars (defense-in-depth)
// Mirrors the hardening OrcaSlicer applied in 2.3.2 after CVE-worthy 3MF path-traversal.
export function isSafeZipEntryName(name) {
  if (typeof name !== 'string' || name.length === 0) return false;
  if (name.includes('\0')) return false;
  if (name.startsWith('/') || name.startsWith('\\')) return false;
  if (/^[A-Za-z]:[\\/]/.test(name)) return false;  // Windows drive letter
  // Normalize separators and check each segment
  const segments = name.replace(/\\/g, '/').split('/');
  for (const seg of segments) {
    if (seg === '..' || seg === '.') return false;
  }
  return true;
}

function _parseNumericList(str) {
  if (!str) return [];
  return str.split(/[;,\s]+/).map(s => parseFloat(s.trim())).filter(n => !Number.isNaN(n));
}

function parseZipEntries(buf) {
  const entries = [];
  let eocdPos = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocdPos = i; break; }
  }
  if (eocdPos < 0) return entries;
  const cdOffset = buf.readUInt32LE(eocdPos + 16);
  const cdSize = buf.readUInt32LE(eocdPos + 12);
  let pos = cdOffset;
  const cdEnd = cdOffset + cdSize;
  while (pos < cdEnd) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;
    const comprMethod = buf.readUInt16LE(pos + 10);
    const compressedSize = buf.readUInt32LE(pos + 20);
    const uncompressedSize = buf.readUInt32LE(pos + 24);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localHeaderOffset = buf.readUInt32LE(pos + 42);
    const name = buf.toString('utf8', pos + 46, pos + 46 + nameLen);
    // Always advance the cursor — even if we reject this entry — so the loop terminates.
    const advance = 46 + nameLen + extraLen + commentLen;

    if (!isSafeZipEntryName(name)) {
      pos += advance;
      continue;
    }

    const lhPos = localHeaderOffset;
    const lhExtraLen = buf.readUInt16LE(lhPos + 28);
    const lhNameLen = buf.readUInt16LE(lhPos + 26);
    const dataStart = lhPos + 30 + lhNameLen + lhExtraLen;
    let data;
    if (comprMethod === 0) {
      data = buf.subarray(dataStart, dataStart + uncompressedSize);
    } else if (comprMethod === 8) {
      try { data = inflateRawSync(buf.subarray(dataStart, dataStart + compressedSize)); } catch { data = Buffer.alloc(0); }
    } else {
      data = Buffer.alloc(0);
    }
    entries.push({ name, data: data.toString('utf8') });
    pos += advance;
  }
  return entries;
}

/**
 * Parse 3MF file to extract filament usage information
 * Hybrid: lib3mf for standard metadata, ZIP parsing for slicer-specific config
 * Returns: { filaments: [{ material, color, weight_g, vendor }], total_weight_g, estimated_time_min }
 */
export async function parse3mf(buffer) {
  const result = {
    filaments: [], total_weight_g: 0, estimated_time_min: 0, plate_name: '',
    schema_version: null, scarf_seam: false, chamber_temp: null,
    wipe_tower_type: null, per_extruder: [], exclude_objects: [],
    bed_count: 1, multi_bed: false,
  };

  // Get standard 3MF metadata via lib3mf
  let lib3mfData;
  try {
    lib3mfData = await parse3mfBuffer(buffer);
  } catch { /* fall through to ZIP parsing */ }

  // Extract slicer-specific config from ZIP entries (Bambu/Prusa/Orca store these as raw files)
  const entries = parseZipEntries(buffer);

  // BambuStudio 2.0+ writes schema version into .rels — older Studio versions
  // can only load geometry from 2.0+ files, so downstream code may want to warn.
  for (const entry of entries) {
    if (/\.rels$/i.test(entry.name)) {
      const schemaMatch = entry.data.match(/BBL:Schema\s+Version\s*=\s*["']([\d.]+)["']/i);
      if (schemaMatch) { result.schema_version = schemaMatch[1]; break; }
    }
  }

  for (const entry of entries) {
    if (entry.name.match(/Metadata\/slice_info/i) || entry.name.match(/\.config$/i)) {
      const filamentMatches = entry.data.matchAll(/filament_used_g\s*=\s*([\d.;,\s]+)/g);
      for (const m of filamentMatches) {
        const weights = m[1].split(/[;,]/).map(w => parseFloat(w.trim())).filter(w => w > 0);
        for (const w of weights) result.filaments.push({ weight_g: w });
      }

      const materialMatches = entry.data.matchAll(/filament_type\s*=\s*(.+)/g);
      let i = 0;
      for (const m of materialMatches) {
        const types = m[1].trim().split(';');
        for (const type of types) {
          if (result.filaments[i]) result.filaments[i].material = type.trim();
          i++;
        }
      }

      const colorMatches = entry.data.matchAll(/filament_colour\s*=\s*(.+)/g);
      i = 0;
      for (const m of colorMatches) {
        const colors = m[1].trim().split(';');
        for (const c of colors) {
          if (result.filaments[i]) result.filaments[i].color = c.trim();
          i++;
        }
      }

      const timeMatch = entry.data.match(/estimated_time\s*=\s*(\d+)/);
      if (timeMatch) result.estimated_time_min = Math.round(parseInt(timeMatch[1]) / 60);

      // --- New 2025–2026 slicer fields ---

      // Scarf seam (PrusaSlicer 2.9, Cura 5.9, OrcaSlicer 2.3)
      if (/seam_slope_type\s*=\s*scarf/i.test(entry.data)) result.scarf_seam = true;

      // Chamber temperature (BambuStudio H2D, QIDI Plus4/Q1 Pro up to 65°C)
      const chamberMatch = entry.data.match(/chamber_temperature\s*=\s*([\d.]+)/i);
      if (chamberMatch) result.chamber_temp = parseFloat(chamberMatch[1]);

      // Wipe tower type (OrcaSlicer 2.3+)
      const wipeMatch = entry.data.match(/wipe_tower_type\s*=\s*(\w+)/i);
      if (wipeMatch) result.wipe_tower_type = wipeMatch[1].trim();

      // Per-extruder dual-nozzle fields (H2D left/right)
      const flowRatios = _parseNumericList(entry.data.match(/top_surface_flow_ratio\s*=\s*([\d.,\s]+)/i)?.[1]);
      const nozzleVolumes = _parseNumericList(entry.data.match(/nozzle_volume\s*=\s*([\d.,\s]+)/i)?.[1]);
      if (flowRatios.length > 0 || nozzleVolumes.length > 0) {
        const n = Math.max(flowRatios.length, nozzleVolumes.length);
        for (let idx = 0; idx < n; idx++) {
          result.per_extruder.push({
            topSurfaceFlowRatio: flowRatios[idx] ?? null,
            nozzleVolume: nozzleVolumes[idx] ?? null,
          });
        }
      }

      // RFID filament metadata (AMS 2 Pro auto-drying, BambuStudio 2.5+)
      const rfidUids = entry.data.match(/filament_rfid_uid\s*=\s*(.+)/i)?.[1]?.trim().split(';') || [];
      const dryTemps = _parseNumericList(entry.data.match(/filament_drying_temp\s*=\s*([\d.;,\s]+)/i)?.[1]);
      const dryTimes = _parseNumericList(entry.data.match(/filament_drying_time\s*=\s*([\d.;,\s]+)/i)?.[1]);
      for (let idx = 0; idx < result.filaments.length; idx++) {
        if (rfidUids[idx]) result.filaments[idx].rfid_uid = rfidUids[idx].trim();
        if (dryTemps[idx] != null) result.filaments[idx].drying_temp = dryTemps[idx];
        if (dryTimes[idx] != null) result.filaments[idx].drying_time = dryTimes[idx];
      }

      // Multi-bed count (PrusaSlicer 2.9+)
      const bedMatch = entry.data.match(/bed_count\s*=\s*(\d+)/i);
      if (bedMatch) {
        result.bed_count = parseInt(bedMatch[1]);
        result.multi_bed = result.bed_count > 1;
      }
    }

    if (entry.name.match(/Metadata\/model_settings/i)) {
      const plateMatch = entry.data.match(/plate_name[^>]*>([^<]+)/);
      if (plateMatch) result.plate_name = plateMatch[1];

      // exclude_objects / skip_objects — per-object identifiers a user can skip during print
      const objectMatches = entry.data.matchAll(/<object\s+([^>]*)\/?>/g);
      for (const m of objectMatches) {
        const attrs = m[1];
        const id = attrs.match(/\bid\s*=\s*"([^"]+)"/)?.[1];
        const name = attrs.match(/\bname\s*=\s*"([^"]+)"/)?.[1];
        const identifyId = attrs.match(/\bidentify_id\s*=\s*"([^"]+)"/)?.[1];
        if (id || identifyId) {
          result.exclude_objects.push({
            id: id || null,
            name: name || '',
            identifyId: identifyId || null,
          });
        }
      }
    }

    if (entry.name.match(/\.gcode$/i)) {
      const gcodeResult = parseGcodeString(entry.data);
      if (gcodeResult.total_weight_g > 0 && result.filaments.length === 0) {
        result.filaments = gcodeResult.filaments;
      }
      if (gcodeResult.estimated_time_min > 0) result.estimated_time_min = gcodeResult.estimated_time_min;
    }
  }

  // Enrich with standard 3MF metadata from lib3mf
  if (lib3mfData) {
    if (!result.plate_name && lib3mfData.metadata.Title) {
      result.plate_name = lib3mfData.metadata.Title;
    }
    // Store lib3mf parsed data for downstream use (thumbnails, mesh data, etc.)
    result._lib3mf = lib3mfData;
  }

  result.total_weight_g = result.filaments.reduce((sum, f) => sum + (f.weight_g || 0), 0);

  // Estimate color/tool changes for multi-color prints
  if (result.filaments.length > 1) {
    let toolChanges = 0;
    for (const entry of entries) {
      if (entry.name.match(/\.gcode$/i)) {
        const matches = entry.data.match(/^T\d+$/gm);
        if (matches) toolChanges = Math.max(toolChanges, matches.length);
      }
    }
    result._estimated_changes = toolChanges || (result.filaments.length - 1);
    result._change_time_s = toolChanges > 0 ? toolChanges * 35 : 0;
  } else {
    result._estimated_changes = 0;
    result._change_time_s = 0;
  }

  return result;
}

/**
 * Parse Gcode string to extract filament usage
 */
function parseGcodeString(content) {
  const result = { filaments: [], total_weight_g: 0, estimated_time_min: 0 };

  const weightMatch = content.match(/;\s*filament used \[g\]\s*=\s*([\d.,]+)/i);
  if (weightMatch) {
    const weights = weightMatch[1].split(',').map(w => parseFloat(w.trim()));
    for (const w of weights) {
      if (w > 0) result.filaments.push({ weight_g: w });
    }
  }

  const densityMatch = content.match(/;\s*filament_density\s*=\s*([\d.,]+)/i);
  const densities = densityMatch ? densityMatch[1].split(',').map(d => parseFloat(d.trim())) : [];
  const diameterMatch = content.match(/;\s*filament_diameter\s*=\s*([\d.,]+)/i);
  const diameters = diameterMatch ? diameterMatch[1].split(',').map(d => parseFloat(d.trim())) : [];

  if (result.filaments.length === 0) {
    const mmMatch = content.match(/;\s*filament used \[mm\]\s*=\s*([\d.,]+)/i);
    if (mmMatch) {
      const lengths = mmMatch[1].split(',').map(l => parseFloat(l.trim()));
      for (let i = 0; i < lengths.length; i++) {
        const len = lengths[i];
        if (len > 0) {
          const diameter = diameters[i] || diameters[0] || 1.75;
          const density = densities[i] || densities[0] || 1.24;
          const radiusCm = (diameter / 10) / 2;
          const volumeCm3 = (len / 10) * Math.PI * radiusCm * radiusCm;
          const weightG = volumeCm3 * density;
          result.filaments.push({
            weight_g: Math.round(weightG * 100) / 100,
            length_mm: len,
            density,
            diameter,
          });
        }
      }
    }
  }

  for (let i = 0; i < result.filaments.length; i++) {
    if (!result.filaments[i].density && densities[i]) result.filaments[i].density = densities[i];
    if (!result.filaments[i].diameter && diameters[i]) result.filaments[i].diameter = diameters[i];
  }

  const typeMatch = content.match(/;\s*filament_type\s*=\s*(.+)/i);
  if (typeMatch) {
    const types = typeMatch[1].trim().split(';');
    types.forEach((type, i) => {
      if (result.filaments[i]) result.filaments[i].material = type.trim();
    });
  }

  const timeMatch = content.match(/;\s*estimated (?:printing )?time[^=]*=\s*(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?/i);
  if (timeMatch) {
    const d = parseInt(timeMatch[1] || 0);
    const h = parseInt(timeMatch[2] || 0);
    const m = parseInt(timeMatch[3] || 0);
    result.estimated_time_min = d * 1440 + h * 60 + m;
  }

  const curaMatch = content.match(/;\s*Filament used:\s*([\d.]+)m/i);
  if (curaMatch && result.filaments.length === 0) {
    const meters = parseFloat(curaMatch[1]);
    const mm = meters * 1000;
    const diameter = diameters[0] || 1.75;
    const density = densities[0] || 1.24;
    const radiusCm = (diameter / 10) / 2;
    const volumeCm3 = (mm / 10) * Math.PI * radiusCm * radiusCm;
    const weightG = volumeCm3 * density;
    result.filaments.push({ weight_g: Math.round(weightG * 100) / 100, length_mm: mm, density, diameter });
  }

  result.total_weight_g = result.filaments.reduce((sum, f) => sum + (f.weight_g || 0), 0);
  return result;
}

/**
 * Parse Gcode file (Buffer) to extract filament usage
 */
export function parseGcode(buffer) {
  const text = buffer.length > 200000
    ? buffer.toString('utf8', 0, 100000) + '\n' + buffer.toString('utf8', buffer.length - 100000)
    : buffer.toString('utf8');
  return parseGcodeString(text);
}
