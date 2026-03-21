// routes/inventory.js — Inventory: Vendors, Filament Profiles, Spools, NFC, Tags, Drying, Build Plates, Dryer Models, Storage Conditions
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getVendors, addVendor, updateVendor, deleteVendor,
  getFilamentProfiles, getFilamentProfile, addFilamentProfile, updateFilamentProfile, deleteFilamentProfile,
  getSpools, getSpool, addSpool, updateSpool, deleteSpool, archiveSpool, useSpoolWeight,
  assignSpoolToSlot, getSpoolUsageLog, duplicateSpool, mergeSpools, measureSpoolWeight,
  getAllSpoolsForExport, getAllFilamentProfilesForExport, getAllVendorsForExport,
  findSimilarColors, getDistinctMaterials, getDistinctLotNumbers, getDistinctArticleNumbers,
  getInventorySetting, setInventorySetting, getAllInventorySettings,
  importSpools, importFilamentProfiles, importVendors,
  getFieldSchemas, addFieldSchema, deleteFieldSchema,
  lengthToWeight, getDryingSessions, getActiveDryingSessions, startDryingSession,
  completeDryingSession, deleteDryingSession, getDryingPresets, getDryingPreset,
  upsertDryingPreset, deleteDryingPreset, getSpoolsDryingStatus,
  getUsagePredictions, getRestockSuggestions, estimatePrintCost,
  getTags, createTag, updateTag, deleteTag, assignTag, unassignTag, getEntityTags,
  getNfcMappings, lookupNfcTag, linkNfcTag, unlinkNfcTag, updateNfcScan,
  checkoutSpool, checkinSpool, getCheckedOutSpools, getCheckoutLog,
  getSpoolTimeline, getSpoolPrintStats, estimateFilamentFromHistory,
  backfillFilamentUsage, syncSpoolWeightsFromLog, getRecentSpoolEvents,
  bulkDeleteSpools, bulkArchiveSpools, bulkRelocateSpools, bulkMarkDried, bulkEditSpools,
  bulkAssignTag, bulkUnassignTag, bulkDeleteProfiles, bulkEditProfiles, bulkDeleteVendors,
  bulkStartDrying, getSpoolsForExportByIds, toggleSpoolFavorite, batchAddSpools,
  createSharedPalette, getSharedPalette, deleteSharedPalette, getSharedPaletteSpools,
  getFifoSpool, getCompatibilityMatrix, addCompatibilityRule, updateCompatibilityRule, deleteCompatibilityRule,
  getTemperatureGuide, matchPrinterForFilament, autoTrashEmptySpools, getRecentProfiles,
  getLocationAlerts, getSpoolBySlot, refillSpool, searchSpoolsByColor,
  getLocations, addLocation, updateLocation, deleteLocation, getInventoryStats, searchSpools,
  getBuildPlates, getBuildPlate, addBuildPlate, updateBuildPlate, deleteBuildPlate,
  getDryerModels, getDryerModel, addDryerModel, updateDryerModel, deleteDryerModel,
  getStorageConditions, addStorageCondition, deleteStorageCondition,
  lookupBambuCode, getBambuFilamentCodes,
  generateSpoolName,
  getPriceHistory, addPriceEntry, getPriceStats, getPriceAlerts, addPriceAlert,
  updatePriceAlert, deletePriceAlert, checkPriceAlerts, triggerPriceAlert,
  getFilamentProfile as _getFilamentProfile
} from '../database.js';
import { sendJson, readBody, readBinaryBody } from '../api-helpers.js';
import { parse3mf, parseGcode } from '../file-parser.js';
import { validate } from '../validate.js';

// ---- Validation Schemas ----
const VENDOR_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  website: { type: 'url' },
  country: { type: 'string', maxLength: 100 },
  empty_spool_weight_g: { type: 'number', min: 0, max: 2000 }
};

const FILAMENT_PROFILE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  material: { type: 'string', required: true, minLength: 1, maxLength: 50 },
  diameter: { type: 'number', min: 0.5, max: 5 },
  density: { type: 'number', min: 0.1, max: 10 },
  color_hex: { type: 'string', pattern: /^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/ },
  nozzle_temp_min: { type: 'number', min: 0, max: 500 },
  nozzle_temp_max: { type: 'number', min: 0, max: 500 },
  bed_temp_min: { type: 'number', min: 0, max: 200 },
  bed_temp_max: { type: 'number', min: 0, max: 200 },
  price: { type: 'number', min: 0 }
};

const SPOOL_SCHEMA = {
  initial_weight_g: { type: 'number', min: 1, max: 100000 },
  remaining_weight_g: { type: 'number', min: 0, max: 100000 },
  cost: { type: 'number', min: 0 }
};

const LOCATION_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  type: { type: 'string', maxLength: 50 }
};

const TAG_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  category: { type: 'string', maxLength: 50 },
  color: { type: 'string', pattern: /^#?[0-9a-fA-F]{6}$/ }
};

const NFC_LINK_SCHEMA = {
  tag_uid: { type: 'string', required: true, minLength: 1, maxLength: 64 },
  spool_id: { required: true }
};

const DRYING_SESSION_SCHEMA = {
  spool_id: { required: true },
  duration_minutes: { type: 'number', required: true, min: 1, max: 10080 },
  temperature: { type: 'number', min: 20, max: 120 }
};

const DRYING_PRESET_SCHEMA = {
  temperature: { type: 'number', required: true, min: 20, max: 120 },
  duration_minutes: { type: 'number', required: true, min: 1, max: 10080 }
};

const BUILD_PLATE_SCHEMA = {
  printer_id: { required: true },
  name: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const DRYER_MODEL_SCHEMA = {
  brand: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  model: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const STORAGE_CONDITION_SCHEMA = {
  spool_id: { required: true },
  temperature: { type: 'number', min: -50, max: 100 },
  humidity: { type: 'number', min: 0, max: 100 }
};

const PRICE_ENTRY_SCHEMA = {
  filament_profile_id: { required: true },
  price: { type: 'number', required: true, min: 0 }
};

// Intern hjelper for broadcast av inventory-events
function _broadcastInventory(ctx, action, entity, data) {
  if (ctx.broadcast) ctx.broadcast('inventory_update', { action, entity, ...data });
}

export async function handleInventoryRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Vendors ----
  if (method === 'GET' && path === '/api/inventory/vendors') {
    const filters = {};
    if (url.searchParams.get('limit')) filters.limit = parseInt(url.searchParams.get('limit'));
    if (url.searchParams.get('offset')) filters.offset = parseInt(url.searchParams.get('offset'));
    if (filters.limit) {
      const result = getVendors(filters);
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Total-Count': String(result.total) });
      res.end(JSON.stringify(result.rows));
      return true;
    }
    sendJson(res, getVendors());
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/vendors') {
    return readBody(req, (b) => {
      const vr = validate(VENDOR_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const vendor = addVendor(b);
        _broadcastInventory(ctx, 'created', 'vendor', { id: vendor.id });
        sendJson(res, vendor, 201);
      } catch (e) { sendJson(res, { error: e.message }, 409); }
    }), true;
  }
  const vendorMatch = path.match(/^\/api\/inventory\/vendors\/(\d+)$/);
  if (vendorMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(VENDOR_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      updateVendor(parseInt(vendorMatch[1]), b);
      _broadcastInventory(ctx, 'updated', 'vendor', { id: parseInt(vendorMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }
  if (vendorMatch && method === 'DELETE') {
    deleteVendor(parseInt(vendorMatch[1]));
    _broadcastInventory(ctx, 'deleted', 'vendor', { id: parseInt(vendorMatch[1]) });
    sendJson(res, { ok: true });
    return true;
  }

  // Bulk vendor operations
  if (method === 'POST' && path === '/api/inventory/vendors/bulk') {
    return readBody(req, (b) => {
      if (!b.action || !Array.isArray(b.vendor_ids) || b.vendor_ids.length === 0) {
        return sendJson(res, { error: 'action and vendor_ids[] required' }, 400);
      }
      const ids = b.vendor_ids.map(Number);
      switch (b.action) {
        case 'delete':
          try { bulkDeleteVendors(ids); } catch (e) { return sendJson(res, { error: e.message }, 409); }
          break;
        default: return sendJson(res, { error: 'Unknown action: ' + b.action }, 400);
      }
      _broadcastInventory(ctx, 'bulk_update', 'vendor', { action: b.action, count: ids.length });
      sendJson(res, { ok: true, count: ids.length });
    }), true;
  }

  // ---- Filament Profiles ----
  if (method === 'GET' && path === '/api/inventory/filaments') {
    const filters = {};
    if (url.searchParams.get('vendor_id')) filters.vendor_id = parseInt(url.searchParams.get('vendor_id'));
    if (url.searchParams.get('material')) filters.material = url.searchParams.get('material');
    if (url.searchParams.get('limit')) filters.limit = parseInt(url.searchParams.get('limit'));
    if (url.searchParams.get('offset')) filters.offset = parseInt(url.searchParams.get('offset'));
    if (filters.limit) {
      const result = getFilamentProfiles(filters);
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Total-Count': String(result.total) });
      res.end(JSON.stringify(result.rows));
      return true;
    }
    sendJson(res, getFilamentProfiles(filters));
    return true;
  }
  const fpMatch = path.match(/^\/api\/inventory\/filaments\/(\d+)$/);
  if (fpMatch && method === 'GET') {
    const profile = getFilamentProfile(parseInt(fpMatch[1]));
    if (!profile) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, profile);
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/filaments') {
    return readBody(req, (b) => {
      const vr = validate(FILAMENT_PROFILE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const result = addFilamentProfile(b);
      _broadcastInventory(ctx, 'created', 'profile', { id: result.id });
      sendJson(res, result, 201);
    }), true;
  }
  if (fpMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(FILAMENT_PROFILE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      updateFilamentProfile(parseInt(fpMatch[1]), b);
      _broadcastInventory(ctx, 'updated', 'profile', { id: parseInt(fpMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }
  if (fpMatch && method === 'DELETE') {
    deleteFilamentProfile(parseInt(fpMatch[1]));
    _broadcastInventory(ctx, 'deleted', 'profile', { id: parseInt(fpMatch[1]) });
    sendJson(res, { ok: true });
    return true;
  }

  // Slicer profile export
  const slicerExportMatch = path.match(/^\/api\/inventory\/filaments\/(\d+)\/slicer-export$/);
  if (slicerExportMatch && method === 'GET') {
    const profile = getFilamentProfile(parseInt(slicerExportMatch[1]));
    if (!profile) return sendJson(res, { error: 'Not found' }, 404), true;
    const format = url.searchParams.get('format') || 'orcaslicer';
    const name = `${profile.vendor_name || 'Custom'} ${profile.name} ${profile.material}`.trim();
    if (format === 'prusaslicer') {
      const ini = [
        `# PrusaSlicer filament profile`,
        `# Generated by Bambu Dashboard`,
        `[filament:${name}]`,
        `filament_type = ${profile.material}`,
        `filament_colour = #${(profile.color_hex || 'FFFFFF').replace('#', '')}`,
        `filament_density = ${profile.density || 1.24}`,
        `filament_diameter = ${profile.diameter || 1.75}`,
        `filament_cost = ${profile.price || 0}`,
        `filament_spool_weight = ${profile.spool_weight_g || 0}`,
        profile.nozzle_temp_min ? `temperature = ${profile.nozzle_temp_max || profile.nozzle_temp_min}` : '',
        profile.nozzle_temp_min ? `first_layer_temperature = ${profile.nozzle_temp_min}` : '',
        profile.bed_temp_min ? `bed_temperature = ${profile.bed_temp_max || profile.bed_temp_min}` : '',
        profile.bed_temp_min ? `first_layer_bed_temperature = ${profile.bed_temp_min}` : '',
        profile.retraction_distance ? `retract_length = ${profile.retraction_distance}` : '',
        profile.retraction_speed ? `retract_speed = ${profile.retraction_speed}` : '',
        profile.cooling_fan_speed != null ? `max_fan_speed = ${profile.cooling_fan_speed}` : '',
        profile.pressure_advance_k ? `pressure_advance = ${profile.pressure_advance_k}` : '',
        profile.max_volumetric_speed ? `filament_max_volumetric_speed = ${profile.max_volumetric_speed}` : '',
      ].filter(Boolean).join('\n');
      res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Disposition': `attachment; filename="${name.replace(/[^a-zA-Z0-9 _-]/g, '')}.ini"` });
      res.end(ini);
      return true;
    }
    // OrcaSlicer JSON format
    const orca = {
      type: 'filament', name, from: 'Bambu Dashboard',
      filament_id: [String(profile.id)], setting_id: '',
      filament_type: [profile.material],
      filament_colour: [`#${(profile.color_hex || 'FFFFFF').replace('#', '')}`],
      filament_density: [String(profile.density || 1.24)],
      filament_diameter: [String(profile.diameter || 1.75)],
      filament_cost: [String(profile.price || 0)],
      nozzle_temperature: [String(profile.nozzle_temp_max || profile.nozzle_temp_min || 200)],
      nozzle_temperature_initial_layer: [String(profile.nozzle_temp_min || 200)],
      bed_temperature: [String(profile.bed_temp_max || profile.bed_temp_min || 60)],
      bed_temperature_initial_layer: [String(profile.bed_temp_min || 60)],
      filament_max_volumetric_speed: [String(profile.max_volumetric_speed || 0)],
      filament_retraction_length: profile.retraction_distance ? [String(profile.retraction_distance)] : undefined,
      filament_retraction_speed: profile.retraction_speed ? [String(profile.retraction_speed)] : undefined,
      fan_max_speed: profile.cooling_fan_speed != null ? [String(profile.cooling_fan_speed)] : undefined,
      pressure_advance: profile.pressure_advance_k ? [String(profile.pressure_advance_k)] : undefined,
    };
    Object.keys(orca).forEach(k => orca[k] === undefined && delete orca[k]);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="${name.replace(/[^a-zA-Z0-9 _-]/g, '')}.json"` });
    res.end(JSON.stringify(orca, null, 2));
    return true;
  }

  // Auto-generated spool name
  const autoNameMatch = path.match(/^\/api\/inventory\/auto-name\/(\d+)$/);
  if (autoNameMatch && method === 'GET') {
    sendJson(res, { name: generateSpoolName(parseInt(autoNameMatch[1])) });
    return true;
  }

  // Bulk profile operations
  if (method === 'POST' && path === '/api/inventory/profiles/bulk') {
    return readBody(req, (b) => {
      if (!b.action || !Array.isArray(b.profile_ids) || b.profile_ids.length === 0) {
        return sendJson(res, { error: 'action and profile_ids[] required' }, 400);
      }
      const ids = b.profile_ids.map(Number);
      switch (b.action) {
        case 'delete': bulkDeleteProfiles(ids); break;
        case 'edit':
          if (!b.fields || typeof b.fields !== 'object') return sendJson(res, { error: 'fields object required' }, 400);
          bulkEditProfiles(ids, b.fields);
          break;
        default: return sendJson(res, { error: 'Unknown action: ' + b.action }, 400);
      }
      _broadcastInventory(ctx, 'bulk_update', 'profile', { action: b.action, count: ids.length });
      sendJson(res, { ok: true, count: ids.length });
    }), true;
  }

  // ---- Spools ----
  if (method === 'GET' && path === '/api/inventory/spools') {
    const filters = {};
    if (url.searchParams.has('archived')) { const av = url.searchParams.get('archived'); filters.archived = av === '1' || av === 'true'; }
    if (url.searchParams.get('material')) filters.material = url.searchParams.get('material');
    if (url.searchParams.get('vendor_id')) filters.vendor_id = parseInt(url.searchParams.get('vendor_id'));
    if (url.searchParams.get('location')) filters.location = url.searchParams.get('location');
    if (url.searchParams.get('printer_id')) filters.printer_id = url.searchParams.get('printer_id');
    if (url.searchParams.get('tag_id')) filters.tag_id = parseInt(url.searchParams.get('tag_id'));
    if (url.searchParams.get('limit')) filters.limit = parseInt(url.searchParams.get('limit'));
    if (url.searchParams.get('offset')) filters.offset = parseInt(url.searchParams.get('offset'));
    const result = getSpools(filters);
    res.writeHead(200, { 'Content-Type': 'application/json', 'X-Total-Count': String(result.total) });
    res.end(JSON.stringify(result.rows));
    return true;
  }
  const spoolMatch = path.match(/^\/api\/inventory\/spools\/(\d+)$/);
  if (spoolMatch && method === 'GET') {
    const spool = getSpool(parseInt(spoolMatch[1]));
    if (!spool) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, spool);
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/spools') {
    return readBody(req, (b) => {
      const vr = validate(SPOOL_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const result = addSpool(b);
      _broadcastInventory(ctx, 'created', 'spool', { id: result.id });
      sendJson(res, result, 201);
    }), true;
  }
  if (spoolMatch && method === 'PUT') {
    return readBody(req, (b) => {
      if (b.used_weight_g_add) {
        const addG = parseFloat(b.used_weight_g_add);
        if (addG > 0) useSpoolWeight(parseInt(spoolMatch[1]), addG, 'manual');
        delete b.used_weight_g_add;
        if (Object.keys(b).length === 0) {
          _broadcastInventory(ctx, 'updated', 'spool', { id: parseInt(spoolMatch[1]) });
          return sendJson(res, { ok: true });
        }
      }
      updateSpool(parseInt(spoolMatch[1]), b);
      _broadcastInventory(ctx, 'updated', 'spool', { id: parseInt(spoolMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }
  if (spoolMatch && method === 'DELETE') {
    deleteSpool(parseInt(spoolMatch[1]));
    _broadcastInventory(ctx, 'deleted', 'spool', { id: parseInt(spoolMatch[1]) });
    sendJson(res, { ok: true });
    return true;
  }

  // Spool actions
  const spoolUseMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/use$/);
  if (spoolUseMatch && method === 'POST') {
    return readBody(req, (b) => {
      let weightG = b.weight_g;
      if (!weightG && b.use_length) {
        const spool = getSpool(parseInt(spoolUseMatch[1]));
        if (!spool) return sendJson(res, { error: 'Not found' }, 404);
        weightG = lengthToWeight(b.use_length, spool.density, spool.diameter);
        if (!weightG) return sendJson(res, { error: 'Cannot convert length: missing density/diameter on profile' }, 400);
      }
      if (!weightG) return sendJson(res, { error: 'weight_g or use_length required' }, 400);
      useSpoolWeight(parseInt(spoolUseMatch[1]), weightG, b.source || 'manual', null, b.printer_id || null);
      _broadcastInventory(ctx, 'used', 'spool', { id: parseInt(spoolUseMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }

  const spoolArchiveMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/archive$/);
  if (spoolArchiveMatch && method === 'PUT') {
    return readBody(req, (b) => {
      archiveSpool(parseInt(spoolArchiveMatch[1]), b.archived !== false);
      _broadcastInventory(ctx, 'archived', 'spool', { id: parseInt(spoolArchiveMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }

  const spoolRefillMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/refill$/);
  if (spoolRefillMatch && method === 'POST') {
    return readBody(req, (b) => {
      const newWeight = parseFloat(b.new_weight_g);
      if (!newWeight || newWeight <= 0) return sendJson(res, { error: 'new_weight_g required (positive number)' }, 400);
      const result = refillSpool(parseInt(spoolRefillMatch[1]), newWeight);
      if (!result) return sendJson(res, { error: 'Spool not found' }, 404);
      _broadcastInventory(ctx, 'refilled', 'spool', { id: parseInt(spoolRefillMatch[1]) });
      sendJson(res, result);
    }), true;
  }

  const spoolAssignMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/assign$/);
  if (spoolAssignMatch && method === 'PUT') {
    return readBody(req, (b) => {
      assignSpoolToSlot(parseInt(spoolAssignMatch[1]), b.printer_id || null, b.ams_unit ?? null, b.ams_tray ?? null);
      _broadcastInventory(ctx, 'assigned', 'spool', { id: parseInt(spoolAssignMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }

  const spoolFavMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/favorite$/);
  if (spoolFavMatch && method === 'POST') {
    const id = parseInt(spoolFavMatch[1]);
    const isFavorite = toggleSpoolFavorite(id);
    _broadcastInventory(ctx, 'updated', 'spool', { id });
    sendJson(res, { ok: true, is_favorite: isFavorite });
    return true;
  }

  if (method === 'POST' && path === '/api/inventory/spools/batch-add') {
    return readBody(req, (b) => {
      const count = Math.min(Math.max(parseInt(b.count) || 1, 1), 50);
      const data = { ...b };
      delete data.count;
      const ids = batchAddSpools(data, count);
      _broadcastInventory(ctx, 'created', 'spool', { ids });
      sendJson(res, { ok: true, ids, count: ids.length }, 201);
    }), true;
  }

  // FIFO spool suggestion
  if (method === 'GET' && path === '/api/inventory/spools/fifo') {
    const material = url.searchParams.get('material');
    const colorHex = url.searchParams.get('color_hex');
    const profileId = url.searchParams.get('profile_id') ? parseInt(url.searchParams.get('profile_id')) : null;
    sendJson(res, getFifoSpool(material, colorHex, profileId));
    return true;
  }

  // Duplicate spool
  const spoolDuplicateMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/duplicate$/);
  if (spoolDuplicateMatch && method === 'POST') {
    const result = duplicateSpool(parseInt(spoolDuplicateMatch[1]));
    if (!result) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, result, 201);
    return true;
  }

  // Merge spools
  if (method === 'POST' && path === '/api/inventory/spools/merge') {
    return readBody(req, (b) => {
      if (!b.target_id || !Array.isArray(b.source_ids) || b.source_ids.length === 0) {
        return sendJson(res, { error: 'target_id and source_ids[] required' }, 400);
      }
      const targetId = Number(b.target_id);
      const sourceIds = b.source_ids.map(Number).filter(id => id !== targetId);
      if (sourceIds.length === 0) return sendJson(res, { error: 'source_ids must differ from target_id' }, 400);
      const result = mergeSpools(targetId, sourceIds, b.actor || null);
      if (!result) return sendJson(res, { error: 'Target spool not found' }, 404);
      if (ctx.broadcast) ctx.broadcast('inventory_update', { action: 'spool_merged', target_id: targetId, source_ids: sourceIds });
      sendJson(res, result);
    }), true;
  }

  // Measure weight
  const spoolMeasureMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/measure$/);
  if (spoolMeasureMatch && method === 'POST') {
    return readBody(req, (b) => {
      if (!b.gross_weight_g || b.gross_weight_g <= 0) return sendJson(res, { error: 'gross_weight_g required' }, 400);
      const spoolId = parseInt(spoolMeasureMatch[1]);
      const result = measureSpoolWeight(spoolId, b.gross_weight_g);
      if (!result) return sendJson(res, { error: 'Not found' }, 404);
      if (ctx.broadcast) ctx.broadcast('spool_weight_synced', { spoolId, weight: result.net_filament_g, source: 'manual_measure' });
      sendJson(res, result);
    }), true;
  }

  // Bulk operations
  if (method === 'POST' && path === '/api/inventory/spools/bulk') {
    return readBody(req, (b) => {
      if (!b.action || !Array.isArray(b.spool_ids) || b.spool_ids.length === 0) {
        return sendJson(res, { error: 'action and spool_ids[] required' }, 400);
      }
      const ids = b.spool_ids.map(Number);
      switch (b.action) {
        case 'delete': bulkDeleteSpools(ids); break;
        case 'archive': bulkArchiveSpools(ids); break;
        case 'relocate':
          if (!b.location) return sendJson(res, { error: 'location required for relocate' }, 400);
          bulkRelocateSpools(ids, b.location);
          break;
        case 'mark_dried': bulkMarkDried(ids); break;
        case 'edit':
          if (!b.fields || typeof b.fields !== 'object') return sendJson(res, { error: 'fields object required' }, 400);
          bulkEditSpools(ids, b.fields);
          break;
        case 'tag': {
          if (!b.tag_id) return sendJson(res, { error: 'tag_id required' }, 400);
          const tagAction = b.tag_action || 'assign';
          if (tagAction === 'unassign') bulkUnassignTag(b.tag_id, 'spool', ids);
          else bulkAssignTag(b.tag_id, 'spool', ids);
          break;
        }
        case 'start_drying': {
          const sessionIds = bulkStartDrying(ids, {
            temperature: b.temperature, duration_minutes: b.duration_minutes,
            method: b.method, notes: b.notes
          });
          return sendJson(res, { ok: true, count: ids.length, session_ids: sessionIds });
        }
        case 'export': {
          const spools = getSpoolsForExportByIds(ids);
          const format = b.format || 'json';
          if (format === 'csv') {
            if (spools.length === 0) return sendJson(res, { error: 'No spools found' }, 404);
            const keys = Object.keys(spools[0]);
            const csv = [keys.join(','), ...spools.map(s => keys.map(k => {
              const v = s[k]; return v == null ? '' : typeof v === 'string' && (v.includes(',') || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v;
            }).join(','))].join('\n');
            res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="spools-export.csv"' });
            return res.end(csv);
          }
          return sendJson(res, spools);
        }
        default: return sendJson(res, { error: 'Unknown action: ' + b.action }, 400);
      }
      _broadcastInventory(ctx, 'bulk_update', 'spool', { action: b.action, count: ids.length });
      sendJson(res, { ok: true, count: ids.length });
    }), true;
  }

  // ---- Import AMS ----
  if (method === 'POST' && path === '/api/inventory/import-ams') {
    const imported = [];
    if (!ctx.printerManager) return sendJson(res, { error: 'No printer manager' }, 500), true;
    for (const [printerId, entry] of ctx.printerManager.printers) {
      if (!entry.live || !entry.client) continue;
      const state = entry.client.state;
      const amsData = state?.ams;
      if (!amsData?.ams) continue;
      for (const unit of amsData.ams) {
        const trays = unit.tray;
        if (!trays) continue;
        for (const tray of trays) {
          if (!tray || !tray.tray_type) continue;
          const amsUnit = parseInt(unit.id) || 0;
          const trayId = parseInt(tray.id) || 0;
          const existing = getSpoolBySlot(printerId, amsUnit, trayId);
          if (existing) {
            const tagUid = tray.tag_uid;
            if (tagUid && tagUid !== '0000000000000000') {
              const nfcEntry = lookupNfcTag(tagUid);
              if (!nfcEntry) {
                linkNfcTag(tagUid, existing.id, 'bambu', JSON.stringify({
                  tray_uuid: tray.tray_uuid || null, tray_id_name: tray.tray_id_name || null, source: 'ams-import'
                }));
                imported.push({ spool_id: existing.id, printer_id: printerId, ams_unit: amsUnit, tray_id: trayId, material: tray.tray_type, color: tray.tray_color?.substring(0, 6), tag_uid: tagUid, nfc_linked: true, remain_pct: tray.remain });
              }
            }
            continue;
          }
          let vendors = getVendors();
          let vendor = vendors.find(v => v.name === 'Bambu Lab');
          if (!vendor) vendor = addVendor({ name: 'Bambu Lab', website: 'https://bambulab.com' });
          const colorHex = tray.tray_color ? tray.tray_color.substring(0, 6) : null;
          const brand = tray.tray_sub_brands || tray.tray_type;
          const profileName = `${brand}${colorHex ? '' : ''}`;
          const profiles = getFilamentProfiles();
          let profile = profiles.find(p =>
            p.vendor_id === vendor.id && p.material === tray.tray_type && p.color_hex?.toLowerCase() === colorHex?.toLowerCase()
          );
          if (!profile) {
            profile = addFilamentProfile({
              vendor_id: vendor.id, name: profileName, material: tray.tray_type,
              color_name: tray.tray_id_name || null, color_hex: colorHex,
              diameter: tray.tray_diameter ? parseFloat(tray.tray_diameter) : 1.75,
              spool_weight_g: tray.tray_weight ? parseInt(tray.tray_weight) : 1000,
              nozzle_temp_min: tray.nozzle_temp_min ? parseInt(tray.nozzle_temp_min) : null,
              nozzle_temp_max: tray.nozzle_temp_max ? parseInt(tray.nozzle_temp_max) : null
            });
          }
          const initialWeight = tray.tray_weight ? parseInt(tray.tray_weight) : 1000;
          const remainPct = tray.remain >= 0 ? tray.remain : 100;
          const remainWeight = Math.round(initialWeight * remainPct / 100);
          const spool = addSpool({
            filament_profile_id: profile.id, initial_weight_g: initialWeight, remaining_weight_g: remainWeight,
            used_weight_g: initialWeight - remainWeight, printer_id: printerId, ams_unit: amsUnit, ams_tray: trayId,
            comment: `Imported from AMS${amsUnit + 1} slot ${trayId + 1}`
          });
          const tagUid = tray.tag_uid;
          if (tagUid && tagUid !== '0000000000000000') {
            linkNfcTag(tagUid, spool.id, 'bambu', JSON.stringify({ tray_uuid: tray.tray_uuid || null, tray_id_name: tray.tray_id_name || null, source: 'ams-import' }));
          }
          imported.push({ spool_id: spool.id, printer_id: printerId, ams_unit: amsUnit, tray_id: trayId, material: tray.tray_type, color: colorHex, brand, tag_uid: tagUid || null, remain_pct: remainPct });
        }
      }
    }
    if (imported.length > 0) _broadcastInventory(ctx, 'created', 'spool', { count: imported.length });
    sendJson(res, { ok: true, imported, count: imported.length }, 201);
    return true;
  }

  // ---- Usage Log ----
  if (method === 'GET' && path === '/api/inventory/usage') {
    const filters = {};
    if (url.searchParams.get('spool_id')) filters.spool_id = parseInt(url.searchParams.get('spool_id'));
    if (url.searchParams.get('printer_id')) filters.printer_id = url.searchParams.get('printer_id');
    filters.limit = parseInt(url.searchParams.get('limit') || '100');
    sendJson(res, getSpoolUsageLog(filters));
    return true;
  }

  // ---- Locations ----
  if (method === 'GET' && path === '/api/inventory/locations') {
    sendJson(res, getLocations());
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/locations') {
    return readBody(req, (b) => {
      const vr = validate(LOCATION_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const loc = addLocation(b);
        sendJson(res, loc, 201);
      } catch (e) { sendJson(res, { error: e.message }, 409); }
    }), true;
  }
  const locMatch = path.match(/^\/api\/inventory\/locations\/(\d+)$/);
  if (locMatch && (method === 'PATCH' || method === 'PUT')) {
    return readBody(req, (b) => {
      const vr = validate(LOCATION_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const result = updateLocation(parseInt(locMatch[1]), b);
      if (!result) return sendJson(res, { error: 'Not found' }, 404);
      sendJson(res, { ok: true, ...result });
    }), true;
  }
  if (locMatch && method === 'DELETE') {
    deleteLocation(parseInt(locMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Stats ----
  if (method === 'GET' && path === '/api/inventory/stats') {
    sendJson(res, getInventoryStats());
    return true;
  }

  // ---- Search ----
  if (method === 'GET' && path === '/api/inventory/search') {
    const q = url.searchParams.get('q');
    if (!q || q.length < 2) return sendJson(res, { error: 'Query too short' }, 400), true;
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const result = searchSpools(q, limit, offset);
    res.writeHead(200, { 'Content-Type': 'application/json', 'X-Total-Count': String(result.total) });
    res.end(JSON.stringify(result.rows));
    return true;
  }

  // ---- Filament Matching ----
  if (method === 'GET' && path === '/api/inventory/match-printer') {
    const material = url.searchParams.get('material');
    const colorHex = url.searchParams.get('color_hex');
    const minWeight = parseFloat(url.searchParams.get('min_weight_g') || '0');
    sendJson(res, matchPrinterForFilament(material, colorHex, minWeight));
    return true;
  }

  // ---- Temperature Guide ----
  if (method === 'GET' && path === '/api/inventory/temperature-guide') {
    sendJson(res, getTemperatureGuide());
    return true;
  }

  // ---- Compatibility Matrix ----
  if (method === 'GET' && path === '/api/inventory/compatibility') {
    const material = url.searchParams.get('material');
    sendJson(res, getCompatibilityMatrix(material || null));
    return true;
  }
  const compatMatch = path.match(/^\/api\/inventory\/compatibility\/(\d+)$/);
  if (method === 'POST' && path === '/api/inventory/compatibility') {
    return readBody(req, (b) => {
      if (!b.material) return sendJson(res, { error: 'material required' }, 400);
      const result = addCompatibilityRule(b);
      sendJson(res, result, 201);
    }), true;
  }
  if (compatMatch && method === 'PUT') {
    return readBody(req, (b) => {
      if (!b.material) return sendJson(res, { error: 'material required' }, 400);
      updateCompatibilityRule(parseInt(compatMatch[1]), b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (compatMatch && method === 'DELETE') {
    deleteCompatibilityRule(parseInt(compatMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Export ----
  if (method === 'GET' && path === '/api/inventory/export/spools') {
    const format = url.searchParams.get('format') || 'csv';
    const rows = getAllSpoolsForExport();
    if (format === 'json') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="spools.json"' });
      return res.end(JSON.stringify(rows, null, 2)), true;
    }
    const header = 'ID;Profile;Material;Vendor;Color;Remaining (g);Used (g);Initial (g);Cost;Location;Lot Number;Printer;Remaining (m);Created\n';
    const csv = '\uFEFF' + header + rows.map(r =>
      `${r.id};${(r.profile_name || '').replace(/;/g, ',')};${r.material || ''};${(r.vendor_name || '').replace(/;/g, ',')};${r.color_name || ''};${r.remaining_weight_g || 0};${r.used_weight_g || 0};${r.initial_weight_g || 0};${r.cost || ''};${(r.location || '').replace(/;/g, ',')};${r.lot_number || ''};${r.printer_id || ''};${r.remaining_length_m || ''};${r.created_at || ''}`
    ).join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="spools.csv"' });
    res.end(csv);
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/export/filaments') {
    const format = url.searchParams.get('format') || 'csv';
    const rows = getAllFilamentProfilesForExport();
    if (format === 'json') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="filaments.json"' });
      return res.end(JSON.stringify(rows, null, 2)), true;
    }
    const header = 'ID;Name;Material;Vendor;Color;Color Hex;Density;Diameter;Spool Weight;Article Number;Price\n';
    const csv = '\uFEFF' + header + rows.map(r =>
      `${r.id};${(r.name || '').replace(/;/g, ',')};${r.material || ''};${(r.vendor_name || '').replace(/;/g, ',')};${r.color_name || ''};${r.color_hex || ''};${r.density};${r.diameter};${r.spool_weight_g};${r.article_number || ''};${r.price || ''}`
    ).join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="filaments.csv"' });
    res.end(csv);
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/export/vendors') {
    const format = url.searchParams.get('format') || 'csv';
    const rows = getAllVendorsForExport();
    if (format === 'json') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="vendors.json"' });
      return res.end(JSON.stringify(rows, null, 2)), true;
    }
    const header = 'ID;Name;Website;Empty Spool Weight\n';
    const csv = '\uFEFF' + header + rows.map(r =>
      `${r.id};${(r.name || '').replace(/;/g, ',')};${r.website || ''};${r.empty_spool_weight_g || ''}`
    ).join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="vendors.csv"' });
    res.end(csv);
    return true;
  }

  // ---- Color Similarity ----
  if (method === 'GET' && path === '/api/inventory/colors/similar') {
    const hex = (url.searchParams.get('hex') || '').replace('#', '');
    if (!hex || hex.length < 6) return sendJson(res, { error: 'hex required (6 chars)' }, 400), true;
    const maxDe = parseFloat(url.searchParams.get('max_delta_e')) || 30;
    sendJson(res, findSimilarColors(hex, maxDe));
    return true;
  }

  // ---- Color Search ----
  if (method === 'GET' && path === '/api/inventory/color-search') {
    const hex = (url.searchParams.get('hex') || '').replace('#', '');
    const tolerance = parseInt(url.searchParams.get('tolerance') || '30');
    if (!hex || hex.length < 6) return sendJson(res, { error: 'hex parameter required (6 chars)' }, 400), true;
    sendJson(res, searchSpoolsByColor(hex, tolerance));
    return true;
  }

  // ---- QR Data ----
  const spoolQrMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/qr$/);
  if (spoolQrMatch && method === 'GET') {
    const spool = getSpool(parseInt(spoolQrMatch[1]));
    if (!spool) return sendJson(res, { error: 'Not found' }, 404), true;
    const host = req.headers.host || 'localhost:3000';
    const proto = req.socket.encrypted ? 'https' : 'http';
    sendJson(res, {
      qr_data: `${proto}://${host}/#filament/spool/${spool.id}`,
      spool_id: spool.id,
      label: {
        name: spool.profile_name || spool.material || '--', vendor: spool.vendor_name || '',
        material: spool.material || '', color: spool.color_name || '',
        color_name: spool.color_name || '', color_hex: spool.color_hex || '',
        weight: spool.initial_weight_g, spool_weight_g: spool.initial_weight_g,
        remaining_weight_g: spool.remaining_weight_g, lot_number: spool.lot_number || '',
        article_number: spool.article_number || '', short_id: spool.short_id || ''
      }
    });
    return true;
  }

  // ---- Distinct values ----
  if (method === 'GET' && path === '/api/inventory/materials') {
    sendJson(res, getDistinctMaterials());
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/lot-numbers') {
    sendJson(res, getDistinctLotNumbers());
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/article-numbers') {
    sendJson(res, getDistinctArticleNumbers());
    return true;
  }

  // ---- Settings ----
  if (method === 'GET' && path === '/api/inventory/settings') {
    sendJson(res, getAllInventorySettings());
    return true;
  }
  const settingMatch = path.match(/^\/api\/inventory\/settings\/([a-zA-Z0-9_.-]+)$/);
  if (settingMatch) {
    const key = settingMatch[1];
    if (method === 'GET') { sendJson(res, { key, value: getInventorySetting(key) }); return true; }
    if (method === 'POST') return readBody(req, (b) => { setInventorySetting(key, b.value); sendJson(res, { ok: true }); }), true;
  }

  // ---- Import ----
  if (method === 'POST' && path === '/api/inventory/import/spools') {
    return readBody(req, (b) => {
      if (!Array.isArray(b)) return sendJson(res, { error: 'Expected array' }, 400);
      const count = importSpools(b);
      _broadcastInventory(ctx, 'import', 'spool', { count });
      sendJson(res, { imported: count }, 201);
    }), true;
  }
  if (method === 'POST' && path === '/api/inventory/import/filaments') {
    return readBody(req, (b) => {
      if (!Array.isArray(b)) return sendJson(res, { error: 'Expected array' }, 400);
      const count = importFilamentProfiles(b);
      _broadcastInventory(ctx, 'import', 'profile', { count });
      sendJson(res, { imported: count }, 201);
    }), true;
  }
  if (method === 'POST' && path === '/api/inventory/import/vendors') {
    return readBody(req, (b) => {
      if (!Array.isArray(b)) return sendJson(res, { error: 'Expected array' }, 400);
      const count = importVendors(b);
      _broadcastInventory(ctx, 'import', 'vendor', { count });
      sendJson(res, { imported: count }, 201);
    }), true;
  }

  // ---- Custom Field Schemas ----
  const fieldMatch = path.match(/^\/api\/inventory\/fields\/(vendor|filament|spool)(?:\/([a-zA-Z0-9_.-]+))?$/);
  if (fieldMatch) {
    const entityType = fieldMatch[1];
    const fieldKey = fieldMatch[2];
    if (method === 'GET' && !fieldKey) { sendJson(res, getFieldSchemas(entityType)); return true; }
    if (method === 'POST' && fieldKey) {
      return readBody(req, (b) => {
        try { const schema = addFieldSchema(entityType, fieldKey, b); sendJson(res, schema, 201); }
        catch (e) { sendJson(res, { error: e.message }, 409); }
      }), true;
    }
    if (method === 'DELETE' && fieldKey) {
      deleteFieldSchema(entityType, fieldKey);
      sendJson(res, { ok: true });
      return true;
    }
  }

  // ---- SpoolmanDB Community Database ----
  if (method === 'GET' && path === '/api/inventory/spoolmandb/manufacturers') {
    // Defer to system.js — handled there
    return false;
  }

  // ---- Drying Management ----
  if (method === 'GET' && path === '/api/inventory/drying/sessions') {
    const filters = {};
    if (url.searchParams.get('spool_id')) filters.spool_id = parseInt(url.searchParams.get('spool_id'));
    if (url.searchParams.has('active')) filters.active = url.searchParams.get('active') === '1';
    if (url.searchParams.get('limit')) filters.limit = parseInt(url.searchParams.get('limit'));
    sendJson(res, getDryingSessions(filters));
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/drying/sessions/active') {
    sendJson(res, getActiveDryingSessions());
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/drying/sessions') {
    return readBody(req, (b) => {
      const vr = validate(DRYING_SESSION_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const result = startDryingSession(b);
      _broadcastInventory(ctx, 'drying_started', 'drying_session', { id: result.id, spool_id: b.spool_id });
      sendJson(res, result, 201);
    }), true;
  }
  const dryingCompleteMatch = path.match(/^\/api\/inventory\/drying\/sessions\/(\d+)\/complete$/);
  if (dryingCompleteMatch && method === 'PUT') {
    return readBody(req, (b) => {
      completeDryingSession(parseInt(dryingCompleteMatch[1]), b.humidity_after || null);
      _broadcastInventory(ctx, 'drying_completed', 'drying_session', { id: parseInt(dryingCompleteMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }
  const dryingDeleteMatch = path.match(/^\/api\/inventory\/drying\/sessions\/(\d+)$/);
  if (dryingDeleteMatch && method === 'DELETE') {
    deleteDryingSession(parseInt(dryingDeleteMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/drying/presets') {
    sendJson(res, getDryingPresets());
    return true;
  }
  const dryingPresetMatch = path.match(/^\/api\/inventory\/drying\/presets\/(.+)$/);
  if (dryingPresetMatch && method === 'GET') {
    const preset = getDryingPreset(decodeURIComponent(dryingPresetMatch[1]));
    if (!preset) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, preset);
    return true;
  }
  if (dryingPresetMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(DRYING_PRESET_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      upsertDryingPreset(decodeURIComponent(dryingPresetMatch[1]), b);
      _broadcastInventory(ctx, 'updated', 'drying_preset', { material: decodeURIComponent(dryingPresetMatch[1]) });
      sendJson(res, { ok: true });
    }), true;
  }
  if (dryingPresetMatch && method === 'DELETE') {
    deleteDryingPreset(decodeURIComponent(dryingPresetMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/drying/status') {
    sendJson(res, getSpoolsDryingStatus());
    return true;
  }

  // ---- Predictions ----
  if (method === 'GET' && path === '/api/inventory/predictions') {
    sendJson(res, getUsagePredictions());
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/restock') {
    const days = parseInt(url.searchParams.get('days') || '30');
    sendJson(res, getRestockSuggestions(days));
    return true;
  }

  // ---- Cost Estimate ----
  if (method === 'GET' && path === '/api/inventory/cost-estimate') {
    const filamentG = parseFloat(url.searchParams.get('filament_g') || '0');
    const durationS = parseInt(url.searchParams.get('duration_s') || '0');
    const spoolId = url.searchParams.get('spool_id') ? parseInt(url.searchParams.get('spool_id')) : null;
    const printerId = url.searchParams.get('printer_id') || null;
    sendJson(res, estimatePrintCost(filamentG, durationS, spoolId, printerId));
    return true;
  }

  // ---- Spool Timeline & Stats ----
  const timelineMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/timeline$/);
  if (timelineMatch && method === 'GET') {
    sendJson(res, getSpoolTimeline(parseInt(timelineMatch[1])));
    return true;
  }
  const printStatsMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/print-stats$/);
  if (printStatsMatch && method === 'GET') {
    const stats = getSpoolPrintStats(parseInt(printStatsMatch[1]));
    if (!stats) return sendJson(res, { error: 'Spool not found' }, 404), true;
    sendJson(res, stats);
    return true;
  }

  if (method === 'GET' && path === '/api/inventory/estimate-usage') {
    sendJson(res, estimateFilamentFromHistory());
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/backfill-usage') {
    const result = backfillFilamentUsage();
    const synced = syncSpoolWeightsFromLog();
    result.synced_spools = synced;
    sendJson(res, result);
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/sync-weights') {
    sendJson(res, syncSpoolWeightsFromLog());
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/events') {
    const limit = parseInt(url.searchParams.get('limit') || '50');
    sendJson(res, getRecentSpoolEvents(limit));
    return true;
  }

  // ---- Checkout ----
  const checkoutMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/(checkout|checkin)$/);
  if (checkoutMatch && method === 'POST') {
    return readBody(req, (b) => {
      const spoolId = parseInt(checkoutMatch[1]);
      if (checkoutMatch[2] === 'checkout') checkoutSpool(spoolId, b.actor, b.from_location);
      else checkinSpool(spoolId, b.actor, b.to_location);
      sendJson(res, { ok: true });
    }), true;
  }
  if (method === 'GET' && path === '/api/inventory/checked-out') {
    sendJson(res, getCheckedOutSpools());
    return true;
  }
  const checkoutLogMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/checkout-log$/);
  if (checkoutLogMatch && method === 'GET') {
    sendJson(res, getCheckoutLog(parseInt(checkoutLogMatch[1])));
    return true;
  }

  // ---- Labels ----
  const swatchMatch = path.match(/^\/api\/inventory\/spools\/(\d+)\/label$/);
  if (swatchMatch && method === 'GET') {
    const spool = getSpool(parseInt(swatchMatch[1]));
    if (!spool) return sendJson(res, { error: 'Spool not found' }, 404), true;
    const format = url.searchParams.get('format') || 'swatch_40x30';
    sendJson(res, { spool, format });
    return true;
  }
  if (method === 'POST' && path === '/api/inventory/labels/batch') {
    return readBody(req, (b) => {
      if (!Array.isArray(b.spool_ids)) return sendJson(res, { error: 'spool_ids[] required' }, 400);
      const spools = b.spool_ids.map(id => getSpool(Number(id))).filter(Boolean);
      sendJson(res, { spools, format: b.format || 'swatch_40x30' });
    }), true;
  }
  if (method === 'GET' && path === '/api/inventory/color-card') {
    const result = getSpools({ archived: false });
    const allSpools = result.rows || [];
    const grouped = {};
    for (const s of allSpools) {
      const mat = s.material || 'Unknown';
      if (!grouped[mat]) grouped[mat] = [];
      grouped[mat].push({ id: s.id, name: s.profile_name || s.material, color_hex: s.color_hex, vendor_name: s.vendor_name, color_name: s.color_name });
    }
    sendJson(res, grouped);
    return true;
  }

  // ZPL label generation
  if (method === 'GET' && path === '/api/inventory/label-zpl') {
    const spoolId = parseInt(url.searchParams.get('spool_id'));
    if (!spoolId) return sendJson(res, { error: 'spool_id required' }, 400), true;
    const spool = getSpool(spoolId);
    if (!spool) return sendJson(res, { error: 'Spool not found' }, 404), true;
    const host = req.headers.host || 'localhost:3443';
    const proto = req.socket?.encrypted ? 'https' : 'http';
    const qrData = `${proto}://${host}/#filament/spool/${spool.id}`;
    const name = (spool.profile_name || spool.material || 'Spool').substring(0, 30);
    const vendor = (spool.vendor_name || '').substring(0, 25);
    const color = (spool.color_name || '').substring(0, 20);
    const weight = `${Math.round(spool.initial_weight_g || 1000)}g`;
    const shortId = spool.short_id || String(spool.id);
    const zpl = `^XA\n^CF0,22\n^FO160,20^FD${name}^FS\n^CF0,18\n^FO160,50^FD${vendor}^FS\n^FO160,75^FD${color}^FS\n^FO160,100^FD${weight}^FS\n^FO160,125^FD#${shortId}^FS\n^FO20,20^BQN,2,4^FDMA,${qrData}^FS\n^XZ`;
    sendJson(res, { zpl: zpl.trim(), spool_id: spool.id, short_id: shortId });
    return true;
  }

  // ---- Shared Palettes ----
  if (method === 'POST' && path === '/api/inventory/palette/share') {
    return readBody(req, (b) => {
      const token = createSharedPalette(b.title, b.filters);
      sendJson(res, { ok: true, token, url: `/palette/${token}` }, 201);
    }), true;
  }
  const paletteMatch = path.match(/^\/api\/palette\/([a-z0-9]+)$/);
  if (paletteMatch && method === 'GET') {
    const palette = getSharedPalette(paletteMatch[1]);
    if (!palette) return sendJson(res, { error: 'Not found' }, 404), true;
    const filters = palette.filters ? JSON.parse(palette.filters) : {};
    const spools = getSharedPaletteSpools(filters);
    sendJson(res, { palette, spools });
    return true;
  }
  if (paletteMatch && method === 'DELETE') {
    deleteSharedPalette(paletteMatch[1]);
    sendJson(res, { ok: true });
    return true;
  }
  const paletteHtmlMatch = path.match(/^\/palette\/([a-z0-9]+)$/);
  if (paletteHtmlMatch && method === 'GET') {
    const palette = getSharedPalette(paletteHtmlMatch[1]);
    if (!palette) { res.writeHead(404); res.end('Palette not found'); return true; }
    const filters = palette.filters ? JSON.parse(palette.filters) : {};
    const spools = getSharedPaletteSpools(filters);
    const grouped = {};
    for (const s of spools) {
      const mat = s.material || 'Other';
      if (!grouped[mat]) grouped[mat] = [];
      grouped[mat].push(s);
    }
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${palette.title || 'Filament Palette'}</title>
      <style>body{font-family:system-ui,sans-serif;margin:0;padding:20px;background:#1a1a2e;color:#e0e0e0}h1{font-size:1.4rem;margin:0 0 16px}h2{font-size:1rem;margin:16px 0 8px;color:#888}.palette-grid{display:flex;flex-wrap:wrap;gap:8px}.swatch{width:60px;height:60px;border-radius:8px;display:flex;align-items:flex-end;justify-content:center;font-size:0.6rem;padding:4px;text-shadow:0 1px 2px rgba(0,0,0,.8);border:1px solid rgba(255,255,255,.1)}.meta{font-size:0.75rem;color:#888;margin-top:16px}</style></head><body>
      <h1>${palette.title || 'Filament Palette'}</h1>`;
    for (const [mat, items] of Object.entries(grouped)) {
      html += `<h2>${mat} (${items.length})</h2><div class="palette-grid">`;
      for (const s of items) {
        const hex = s.color_hex || '#666';
        html += `<div class="swatch" style="background:${hex}" title="${s.profile_name || ''} — ${s.vendor_name || ''}">${s.color_name || ''}</div>`;
      }
      html += '</div>';
    }
    html += `<p class="meta">Shared from Bambu Dashboard · ${spools.length} colors · Viewed ${palette.view_count} times</p></body></html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return true;
  }

  // ---- Tags ----
  if (method === 'GET' && path === '/api/tags') {
    const category = url.searchParams.get('category') || null;
    sendJson(res, getTags(category));
    return true;
  }
  if (method === 'POST' && path === '/api/tags') {
    return readBody(req, (b) => {
      const vr = validate(TAG_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const id = createTag(b.name, b.category, b.color);
        sendJson(res, { ok: true, id }, 201);
      } catch (e) { sendJson(res, { error: 'Tag already exists' }, 409); }
    }), true;
  }
  const tagIdMatch = path.match(/^\/api\/tags\/(\d+)$/);
  if (tagIdMatch && method === 'PUT') {
    return readBody(req, (b) => {
      const vr = validate(TAG_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        updateTag(parseInt(tagIdMatch[1]), b.name, b.category, b.color);
        sendJson(res, { ok: true });
      } catch (e) { sendJson(res, { error: 'Tag name already exists' }, 409); }
    }), true;
  }
  if (tagIdMatch && method === 'DELETE') {
    deleteTag(parseInt(tagIdMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  if (method === 'POST' && path === '/api/tags/assign') {
    return readBody(req, (b) => {
      if (!b.entity_type || !b.entity_id || !b.tag_id) return sendJson(res, { error: 'entity_type, entity_id, tag_id required' }, 400);
      assignTag(b.entity_type, b.entity_id, b.tag_id);
      sendJson(res, { ok: true });
    }), true;
  }
  if (method === 'DELETE' && path === '/api/tags/unassign') {
    return readBody(req, (b) => {
      if (!b.entity_type || !b.entity_id || !b.tag_id) return sendJson(res, { error: 'entity_type, entity_id, tag_id required' }, 400);
      unassignTag(b.entity_type, b.entity_id, b.tag_id);
      sendJson(res, { ok: true });
    }), true;
  }
  const entityTagsMatch = path.match(/^\/api\/tags\/entity\/([a-z_]+)\/(\d+)$/);
  if (entityTagsMatch && method === 'GET') {
    sendJson(res, getEntityTags(entityTagsMatch[1], parseInt(entityTagsMatch[2])));
    return true;
  }
  if (method === 'POST' && path === '/api/tags/bulk-assign') {
    return readBody(req, (b) => {
      if (!b.tag_id || !b.entity_type || !Array.isArray(b.entity_ids) || b.entity_ids.length === 0) {
        return sendJson(res, { error: 'tag_id, entity_type, and entity_ids[] required' }, 400);
      }
      const ids = b.entity_ids.map(Number);
      const action = b.action || 'assign';
      const count = action === 'unassign' ? bulkUnassignTag(b.tag_id, b.entity_type, ids) : bulkAssignTag(b.tag_id, b.entity_type, ids);
      sendJson(res, { ok: true, count });
    }), true;
  }

  // ---- NFC ----
  if (method === 'GET' && path === '/api/nfc/mappings') {
    sendJson(res, getNfcMappings());
    return true;
  }
  const nfcLookupMatch = path.match(/^\/api\/nfc\/lookup\/(.+)$/);
  if (nfcLookupMatch && method === 'GET') {
    const tag = lookupNfcTag(decodeURIComponent(nfcLookupMatch[1]));
    if (!tag) return sendJson(res, { error: 'Tag not found' }, 404), true;
    updateNfcScan(decodeURIComponent(nfcLookupMatch[1]));
    sendJson(res, tag);
    return true;
  }
  if (method === 'POST' && path === '/api/nfc/link') {
    return readBody(req, (b) => {
      const vr = validate(NFC_LINK_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const id = linkNfcTag(b.tag_uid, b.spool_id, b.standard, b.data ? JSON.stringify(b.data) : null);
        sendJson(res, { ok: true, id });
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }
  if (method === 'POST' && path === '/api/nfc/scan') {
    return readBody(req, (b) => {
      if (!b.tag_uid) return sendJson(res, { error: 'tag_uid required' }, 400);
      const mapping = lookupNfcTag(b.tag_uid);
      if (!mapping) return sendJson(res, { error: 'Unknown NFC tag', tag_uid: b.tag_uid }, 404);
      updateNfcScan(b.tag_uid);
      const result = { spool_id: mapping.spool_id, spool_name: mapping.spool_name, material: mapping.material, color_hex: mapping.color_hex, vendor_name: mapping.vendor_name };
      if (b.printer_id && b.ams_unit != null && b.ams_tray != null) {
        assignSpoolToSlot(mapping.spool_id, b.printer_id, b.ams_unit, b.ams_tray);
        result.assigned = true;
        result.printer_id = b.printer_id;
        result.ams_unit = b.ams_unit;
        result.ams_tray = b.ams_tray;
        if (ctx.broadcast) ctx.broadcast('spool_assigned', { spool_id: mapping.spool_id, printer_id: b.printer_id, ams_unit: b.ams_unit, ams_tray: b.ams_tray });
      }
      sendJson(res, result);
    }), true;
  }
  const nfcUnlinkMatch = path.match(/^\/api\/nfc\/link\/(.+)$/);
  if (nfcUnlinkMatch && method === 'DELETE') {
    unlinkNfcTag(decodeURIComponent(nfcUnlinkMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Build Plates ----
  if (method === 'GET' && path === '/api/build-plates') {
    const printerId = url.searchParams.get('printer_id');
    sendJson(res, getBuildPlates(printerId || null));
    return true;
  }
  const bpMatch = path.match(/^\/api\/build-plates\/(\d+)$/);
  if (bpMatch && method === 'GET') {
    const bp = getBuildPlate(parseInt(bpMatch[1]));
    if (!bp) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, bp);
    return true;
  }
  if (method === 'POST' && path === '/api/build-plates') {
    return readBody(req, (b) => {
      const vr = validate(BUILD_PLATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addBuildPlate(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (bpMatch && method === 'PUT') {
    return readBody(req, (b) => { updateBuildPlate(parseInt(bpMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (bpMatch && method === 'DELETE') {
    deleteBuildPlate(parseInt(bpMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Dryer Models ----
  if (method === 'GET' && path === '/api/dryer-models') {
    sendJson(res, getDryerModels());
    return true;
  }
  const dmMatch = path.match(/^\/api\/dryer-models\/(\d+)$/);
  if (dmMatch && method === 'GET') {
    const dm = getDryerModel(parseInt(dmMatch[1]));
    if (!dm) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, dm);
    return true;
  }
  if (method === 'POST' && path === '/api/dryer-models') {
    return readBody(req, (b) => {
      const vr = validate(DRYER_MODEL_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addDryerModel(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (dmMatch && method === 'PUT') {
    return readBody(req, (b) => { updateDryerModel(parseInt(dmMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (dmMatch && method === 'DELETE') {
    deleteDryerModel(parseInt(dmMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Storage Conditions ----
  const scMatch = path.match(/^\/api\/storage-conditions\/(\d+)$/);
  if (scMatch && method === 'GET') {
    sendJson(res, getStorageConditions(parseInt(scMatch[1])));
    return true;
  }
  if (method === 'POST' && path === '/api/storage-conditions') {
    return readBody(req, (b) => {
      const vr = validate(STORAGE_CONDITION_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const id = addStorageCondition(b);
        sendJson(res, { ok: true, id }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 400); }
    }), true;
  }
  const scDelMatch = path.match(/^\/api\/storage-conditions\/entry\/(\d+)$/);
  if (scDelMatch && method === 'DELETE') {
    deleteStorageCondition(parseInt(scDelMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Price History ----
  const phMatch = path.match(/^\/api\/price-history\/(\d+)$/);
  if (phMatch && method === 'GET') {
    const limit = parseInt(url.searchParams.get('limit') || '100');
    sendJson(res, getPriceHistory(parseInt(phMatch[1]), limit));
    return true;
  }
  if (method === 'POST' && path === '/api/price-history') {
    return readBody(req, (b) => {
      const vr = validate(PRICE_ENTRY_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const id = addPriceEntry(b);
        const triggered = checkPriceAlerts();
        for (const alert of triggered) {
          triggerPriceAlert(alert.id);
          if (ctx.notifier) {
            ctx.notifier.notify('filament_low_stock', {
              title: `Price drop: ${alert.profile_name}`,
              message: `${alert.profile_name} (${alert.material}) dropped to ${alert.latest_price} ${alert.currency || ''} — target was ${alert.target_price}`,
              printerName: 'Price Alert'
            });
          }
        }
        sendJson(res, { ok: true, id, alerts_triggered: triggered.length }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 400); }
    }), true;
  }
  const phStatsMatch = path.match(/^\/api\/price-history\/(\d+)\/stats$/);
  if (phStatsMatch && method === 'GET') {
    sendJson(res, getPriceStats(parseInt(phStatsMatch[1])) || {});
    return true;
  }
  // ---- Price Alerts ----
  if (method === 'GET' && path === '/api/price-alerts') {
    sendJson(res, getPriceAlerts());
    return true;
  }
  if (method === 'POST' && path === '/api/price-alerts') {
    return readBody(req, (b) => {
      if (!b.filament_profile_id || !b.target_price) return sendJson(res, { error: 'filament_profile_id and target_price required' }, 400);
      const id = addPriceAlert(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  const paMatch = path.match(/^\/api\/price-alerts\/(\d+)$/);
  if (paMatch && method === 'PUT') {
    return readBody(req, (b) => { updatePriceAlert(parseInt(paMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (paMatch && method === 'DELETE') {
    deletePriceAlert(parseInt(paMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Misc ----
  if (method === 'POST' && path === '/api/inventory/auto-trash') {
    const deleted = autoTrashEmptySpools();
    sendJson(res, { deleted });
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/recent-profiles') {
    const limit = parseInt(url.searchParams.get('limit') || '5');
    sendJson(res, getRecentProfiles(limit));
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/location-alerts') {
    sendJson(res, getLocationAlerts());
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/store-link') {
    const material = url.searchParams.get('material') || '';
    const colorParam = url.searchParams.get('color') || '';
    const searchQuery = [material, colorParam].filter(Boolean).join(' ');
    sendJson(res, {
      bambu_store: `https://store.bambulab.com/collections/filament?q=${encodeURIComponent(searchQuery)}`,
      amazon: `https://www.amazon.com/s?k=bambu+lab+${encodeURIComponent(searchQuery)}+filament`,
      search_query: searchQuery
    });
    return true;
  }
  if (method === 'GET' && path === '/api/inventory/insights') {
    try {
      const predictions = getUsagePredictions();
      const restock = getRestockSuggestions(30);
      const stats = getInventoryStats();
      const insights = [];
      const lowStock = predictions.per_spool.filter(s => s.needs_reorder);
      if (lowStock.length > 0) {
        insights.push({ type: 'warning', title: 'Low Stock Alert', message: `${lowStock.length} spool(s) will run out within 14 days at current usage rate.`, items: lowStock.slice(0, 5).map(s => `${s.profile_name || s.material} - ${s.days_until_empty} days remaining`) });
      }
      const urgentRestock = restock.filter(r => r.urgency === 'high' || r.urgency === 'medium');
      if (urgentRestock.length > 0) {
        insights.push({ type: 'restock', title: 'Restock Recommendations', message: `${urgentRestock.length} filament(s) should be reordered based on usage patterns.`, items: urgentRestock.slice(0, 5).map(r => `${r.profile_name} (${r.vendor_name || '?'}) - ${r.recommended_spools || 1} spool(s)`) });
      }
      if (predictions.by_material.length > 0) {
        const topMaterial = predictions.by_material[0];
        insights.push({ type: 'info', title: 'Top Material Usage', message: `${topMaterial.material || 'Unknown'} is your most used material (${Math.round(topMaterial.total_used_g)}g in 90 days, avg ${topMaterial.avg_daily_g}g/day).`, items: predictions.by_material.slice(0, 3).map(m => `${m.material}: ${Math.round(m.total_used_g)}g total`) });
      }
      if (stats.total_spools > 0 && stats.total_cost > 0) {
        const avgCostPerKg = (stats.total_cost / (stats.total_weight_g / 1000)).toFixed(2);
        insights.push({ type: 'info', title: 'Cost Overview', message: `Average cost: ${avgCostPerKg}/kg across ${stats.total_spools} active spools. Total inventory value: ${stats.total_cost.toFixed(2)}.` });
      }
      const dormant = predictions.per_spool.filter(s => s.avg_daily_g === 0 && s.remaining_weight_g > 100);
      if (dormant.length > 0) {
        insights.push({ type: 'suggestion', title: 'Dormant Spools', message: `${dormant.length} spool(s) haven't been used in 90+ days but still have significant filament remaining.`, items: dormant.slice(0, 5).map(s => `${s.profile_name || s.material} - ${Math.round(s.remaining_weight_g)}g remaining`) });
      }
      sendJson(res, { insights });
    } catch (e) { sendJson(res, { insights: [], error: e.message }); }
    return true;
  }

  // ---- 3MF / Gcode analysis ----
  if (method === 'POST' && path === '/api/inventory/analyze-file') {
    return readBinaryBody(req, (buffer) => {
      try {
        const contentType = req.headers['content-type'] || '';
        const filename = url.searchParams.get('filename') || '';
        let result;
        if (filename.endsWith('.3mf') || contentType.includes('3mf')) {
          result = parse3mf(buffer);
        } else if (filename.endsWith('.gcode') || filename.endsWith('.g') || contentType.includes('gcode')) {
          result = parseGcode(buffer);
        } else {
          return sendJson(res, { error: 'Unsupported file type. Use .3mf or .gcode' }, 400);
        }
        sendJson(res, result);
      } catch (e) { sendJson(res, { error: 'Failed to parse file: ' + e.message }, 500); }
    }), true;
  }

  // ---- Hub/Kiosk Settings ----
  if (method === 'GET' && path === '/api/hub/settings') {
    sendJson(res, {
      hub_mode: getInventorySetting('hub_mode') === '1',
      kiosk_mode: getInventorySetting('kiosk_mode') === '1',
      kiosk_panels: (getInventorySetting('kiosk_panels') || 'dashboard,queue').split(','),
      hub_refresh_interval: parseInt(getInventorySetting('hub_refresh_interval') || '30')
    });
    return true;
  }
  if (method === 'PUT' && path === '/api/hub/settings') {
    return readBody(req, (b) => {
      if (b.hub_mode !== undefined) setInventorySetting('hub_mode', b.hub_mode ? '1' : '0');
      if (b.kiosk_mode !== undefined) setInventorySetting('kiosk_mode', b.kiosk_mode ? '1' : '0');
      if (b.kiosk_panels !== undefined) setInventorySetting('kiosk_panels', Array.isArray(b.kiosk_panels) ? b.kiosk_panels.join(',') : b.kiosk_panels);
      if (b.hub_refresh_interval !== undefined) setInventorySetting('hub_refresh_interval', String(b.hub_refresh_interval));
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- External Price Check ----
  if (method === 'POST' && path === '/api/inventory/price-check') {
    return readBody(req, async (b) => {
      if (!b.url) return sendJson(res, { error: 'url required' }, 400);
      try {
        const { extractPriceFromUrl } = await import('../price-checker.js');
        const result = await extractPriceFromUrl(b.url);
        if (result.price !== null && b.profile_id) {
          addPriceEntry({ filament_profile_id: b.profile_id, vendor_id: b.vendor_id || null, price: result.price, currency: result.currency || 'USD', source_url: b.url });
        }
        sendJson(res, result);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }

  return false;
}
