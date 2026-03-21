// routes/community.js — Community filaments, brand defaults, custom fields, courses, knowledge base
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getCommunityFilaments, getCommunityFilament, searchCommunityByColor,
  getCommunityManufacturers, getCommunityMaterials, addCommunityFilament,
  updateCommunityFilament, deleteCommunityFilament, getCommunityFilamentStats,
  getOwnedCommunityIds, getCommunityFilamentCategories,
  getBrandDefaults, getBrandDefault, upsertBrandDefault, deleteBrandDefault,
  getCustomFieldDefs, getCustomFieldDef, addCustomFieldDef, updateCustomFieldDef,
  deleteCustomFieldDef, getCustomFieldValues, setCustomFieldValue,
  getCourses, getCourse, addCourse, updateCourse, deleteCourse,
  getCourseProgress, upsertCourseProgress, getUserCourseProgress, getAllCoursesWithProgress,
  getKbPrinters, getKbPrinter, addKbPrinter, updateKbPrinter, deleteKbPrinter,
  getKbAccessories, getKbAccessory, addKbAccessory, updateKbAccessory, deleteKbAccessory,
  getKbFilaments, getKbFilament, addKbFilament, updateKbFilament, deleteKbFilament,
  getKbProfiles, getKbProfile, addKbProfile, updateKbProfile, deleteKbProfile,
  searchKb, getKbStats, getKbTags, addKbTag, deleteKbTag, seedKbData,
  shareFilamentProfile, rateCommunityFilament, getCommunityFilamentRatings,
  submitTdVote, getTdVotes, importCommunityToInventory,
  getVendors, addVendor, getFilamentProfiles, addFilamentProfile, addSpool
} from '../database.js';
import { sendJson, readBody } from '../api-helpers.js';
import { validate } from '../validate.js';

// ---- Validation Schemas ----
const COMMUNITY_FILAMENT_SCHEMA = {
  manufacturer: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  material: { type: 'string', required: true, minLength: 1, maxLength: 50 },
  color_hex: { type: 'string', pattern: /^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/ }
};

const BRAND_DEFAULT_SCHEMA = {
  manufacturer: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const CUSTOM_FIELD_DEF_SCHEMA = {
  entity_type: { type: 'string', required: true, minLength: 1, maxLength: 50 },
  field_name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  field_label: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

const CUSTOM_FIELD_VALUE_SCHEMA = {
  field_id: { required: true },
  entity_type: { type: 'string', required: true, minLength: 1 },
  entity_id: { required: true }
};

const COURSE_SCHEMA = {
  title: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const RATING_SCHEMA = {
  rating: { type: 'number', required: true, min: 1, max: 5 }
};

const TD_VOTE_SCHEMA = {
  td_value: { type: 'number', required: true, min: 0 }
};

const KB_PRINTER_SCHEMA = {
  model: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  full_name: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const KB_ACCESSORY_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const KB_FILAMENT_SCHEMA = {
  material: { type: 'string', required: true, minLength: 1, maxLength: 50 }
};

const KB_PROFILE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const KB_TAG_SCHEMA = {
  entity_type: { type: 'string', required: true, minLength: 1 },
  entity_id: { required: true },
  tag: { type: 'string', required: true, minLength: 1, maxLength: 100 }
};

export async function handleCommunityRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Community Filaments ----
  if (method === 'GET' && path === '/api/community-filaments') {
    const filters = {};
    if (url.searchParams.get('manufacturer')) filters.manufacturer = url.searchParams.get('manufacturer');
    if (url.searchParams.get('material')) filters.material = url.searchParams.get('material');
    if (url.searchParams.get('material_type')) filters.material_type = url.searchParams.get('material_type');
    if (url.searchParams.get('category')) filters.category = url.searchParams.get('category');
    if (url.searchParams.get('search')) filters.search = url.searchParams.get('search');
    if (url.searchParams.get('has_k_value')) filters.has_k_value = true;
    if (url.searchParams.get('has_td')) filters.has_td = true;
    if (url.searchParams.get('translucent')) filters.translucent = true;
    if (url.searchParams.get('glow')) filters.glow = true;
    if (url.searchParams.get('multi_color')) filters.multi_color = true;
    if (url.searchParams.get('temp_min')) filters.temp_min = parseInt(url.searchParams.get('temp_min'));
    if (url.searchParams.get('temp_max')) filters.temp_max = parseInt(url.searchParams.get('temp_max'));
    if (url.searchParams.get('sort')) filters.sort = url.searchParams.get('sort');
    if (url.searchParams.get('sort_dir')) filters.sort_dir = url.searchParams.get('sort_dir');
    if (url.searchParams.get('limit')) filters.limit = parseInt(url.searchParams.get('limit'));
    if (url.searchParams.get('offset')) filters.offset = parseInt(url.searchParams.get('offset'));
    const result = getCommunityFilaments(filters);
    const owned_ids = getOwnedCommunityIds();
    if (result.rows) { result.owned_ids = owned_ids; } else { return sendJson(res, { rows: result, total: result.length, owned_ids }), true; }
    sendJson(res, result);
    return true;
  }
  if (method === 'GET' && path === '/api/community-filaments/stats') {
    sendJson(res, getCommunityFilamentStats());
    return true;
  }
  if (method === 'GET' && path === '/api/community-filaments/categories') {
    sendJson(res, getCommunityFilamentCategories());
    return true;
  }
  if (method === 'GET' && path === '/api/community-filaments/manufacturers') {
    sendJson(res, getCommunityManufacturers());
    return true;
  }
  if (method === 'GET' && path === '/api/community-filaments/materials') {
    sendJson(res, getCommunityMaterials());
    return true;
  }
  if (method === 'GET' && path === '/api/community-filaments/color-search') {
    const hex = (url.searchParams.get('hex') || '').replace('#', '');
    const tolerance = parseInt(url.searchParams.get('tolerance') || '30');
    if (!hex || hex.length < 6) return sendJson(res, { error: 'hex parameter required (6 chars)' }, 400), true;
    sendJson(res, searchCommunityByColor(hex, tolerance));
    return true;
  }
  if (method === 'POST' && path === '/api/community-filaments/import-to-inventory') {
    return readBody(req, (b) => {
      const cf = getCommunityFilament(b.id);
      if (!cf) return sendJson(res, { error: 'Not found' }, 404);
      let vendorId = null;
      if (cf.manufacturer) {
        const existing = getVendors().find(v => v.name.toLowerCase() === cf.manufacturer.toLowerCase());
        vendorId = existing ? existing.id : addVendor({ name: cf.manufacturer }).id;
      }
      const profile = addFilamentProfile({
        vendor_id: vendorId, name: cf.name || `${cf.manufacturer} ${cf.material}`,
        material: cf.material, color_name: cf.color_name, color_hex: cf.color_hex,
        density: cf.density || 1.24, diameter: cf.diameter || 1.75,
        spool_weight_g: cf.weight || 1000,
        nozzle_temp_min: cf.extruder_temp ? cf.extruder_temp - 10 : null,
        nozzle_temp_max: cf.extruder_temp,
        bed_temp_min: cf.bed_temp ? cf.bed_temp - 10 : null, bed_temp_max: cf.bed_temp,
        pressure_advance_k: cf.pressure_advance_k, max_volumetric_speed: cf.max_volumetric_speed,
        retraction_distance: cf.retraction_distance, retraction_speed: cf.retraction_speed,
        cooling_fan_speed: cf.fan_speed_max, transmission_distance: cf.td_value, price: cf.price
      });
      if (b.create_spool) {
        addSpool({ filament_profile_id: profile.id, initial_weight_g: cf.weight || 1000, remaining_weight_g: cf.weight || 1000, cost: cf.price });
      }
      sendJson(res, { ok: true, profile_id: profile.id, vendor_id: vendorId }, 201);
    }), true;
  }
  if (method === 'POST' && path === '/api/community-filaments/seed') {
    return readBody(req, async (b) => {
      try {
        const { seedFilamentDatabase } = await import('../seed-filament-db.js');
        const result = await seedFilamentDatabase();
        sendJson(res, result);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }
  const cfMatch = path.match(/^\/api\/community-filaments\/(\d+)$/);
  if (cfMatch && method === 'GET') {
    const cf = getCommunityFilament(parseInt(cfMatch[1]));
    if (!cf) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, cf);
    return true;
  }
  if (method === 'POST' && path === '/api/community-filaments') {
    return readBody(req, (b) => {
      const vr = validate(COMMUNITY_FILAMENT_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addCommunityFilament(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (cfMatch && method === 'PUT') {
    return readBody(req, (b) => {
      updateCommunityFilament(parseInt(cfMatch[1]), b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (cfMatch && method === 'DELETE') {
    deleteCommunityFilament(parseInt(cfMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Community Sharing ----
  if (method === 'POST' && path === '/api/community-filaments/share') {
    return readBody(req, (b) => {
      if (!b.profile_id) return sendJson(res, { error: 'profile_id required' }, 400);
      const user = req._user;
      const id = shareFilamentProfile(b.profile_id, user?.username || 'anonymous');
      if (!id) return sendJson(res, { error: 'Profile not found or already shared' }, 400);
      if (ctx.broadcast) ctx.broadcast('community_update', { action: 'shared', id });
      sendJson(res, { id }, 201);
    }), true;
  }
  const cfRateMatch = path.match(/^\/api\/community-filaments\/(\d+)\/rate$/);
  if (cfRateMatch && method === 'POST') {
    return readBody(req, (b) => {
      const vr = validate(RATING_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = parseInt(cfRateMatch[1]);
      const user = req._user;
      const result = rateCommunityFilament(id, user?.username || 'default', b.rating, b.comment);
      sendJson(res, result);
    }), true;
  }
  const cfRatingsMatch = path.match(/^\/api\/community-filaments\/(\d+)\/ratings$/);
  if (cfRatingsMatch && method === 'GET') {
    sendJson(res, getCommunityFilamentRatings(parseInt(cfRatingsMatch[1])));
    return true;
  }
  const cfTdVoteMatch = path.match(/^\/api\/community-filaments\/(\d+)\/td-vote$/);
  if (cfTdVoteMatch && method === 'POST') {
    return readBody(req, (b) => {
      const vr = validate(TD_VOTE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = parseInt(cfTdVoteMatch[1]);
      const user = req._user;
      const result = submitTdVote(id, user?.username || 'default', parseFloat(b.td_value));
      sendJson(res, result);
    }), true;
  }
  const cfTdVotesMatch = path.match(/^\/api\/community-filaments\/(\d+)\/td-votes$/);
  if (cfTdVotesMatch && method === 'GET') {
    sendJson(res, getTdVotes(parseInt(cfTdVotesMatch[1])));
    return true;
  }
  const cfImportMatch = path.match(/^\/api\/community-filaments\/(\d+)\/import$/);
  if (cfImportMatch && method === 'POST') {
    return readBody(req, (b) => {
      const profileId = importCommunityToInventory(parseInt(cfImportMatch[1]), b.vendor_id);
      if (!profileId) return sendJson(res, { error: 'Community filament not found' }, 404);
      if (ctx.broadcast) ctx.broadcast('inventory_update', { action: 'add', entity: 'profile', id: profileId });
      sendJson(res, { profile_id: profileId }, 201);
    }), true;
  }

  // ---- Brand Defaults ----
  if (method === 'GET' && path === '/api/brand-defaults') {
    const manufacturer = url.searchParams.get('manufacturer');
    sendJson(res, getBrandDefaults(manufacturer || null));
    return true;
  }
  const bdMatch = path.match(/^\/api\/brand-defaults\/(\d+)$/);
  if (bdMatch && method === 'GET') {
    const bd = getBrandDefault(parseInt(bdMatch[1]));
    if (!bd) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, bd);
    return true;
  }
  if (method === 'POST' && path === '/api/brand-defaults') {
    return readBody(req, (b) => {
      const vr = validate(BRAND_DEFAULT_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = upsertBrandDefault(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (bdMatch && method === 'DELETE') {
    deleteBrandDefault(parseInt(bdMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Custom Fields ----
  if (method === 'GET' && path === '/api/custom-fields') {
    const entityType = url.searchParams.get('entity_type');
    sendJson(res, getCustomFieldDefs(entityType || null));
    return true;
  }
  const cfdMatch = path.match(/^\/api\/custom-fields\/(\d+)$/);
  if (cfdMatch && method === 'GET') {
    const cf = getCustomFieldDef(parseInt(cfdMatch[1]));
    if (!cf) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, cf);
    return true;
  }
  if (method === 'POST' && path === '/api/custom-fields') {
    return readBody(req, (b) => {
      const vr = validate(CUSTOM_FIELD_DEF_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addCustomFieldDef(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (cfdMatch && method === 'PUT') {
    return readBody(req, (b) => {
      updateCustomFieldDef(parseInt(cfdMatch[1]), b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (cfdMatch && method === 'DELETE') {
    deleteCustomFieldDef(parseInt(cfdMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  const cfvMatch = path.match(/^\/api\/custom-fields\/values\/([a-z_]+)\/(\d+)$/);
  if (cfvMatch && method === 'GET') {
    sendJson(res, getCustomFieldValues(cfvMatch[1], parseInt(cfvMatch[2])));
    return true;
  }
  if (method === 'POST' && path === '/api/custom-fields/values') {
    return readBody(req, (b) => {
      const vr = validate(CUSTOM_FIELD_VALUE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      setCustomFieldValue(b.field_id, b.entity_type, b.entity_id, b.value || null);
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Courses ----
  if (method === 'GET' && path === '/api/courses') {
    const category = url.searchParams.get('category');
    sendJson(res, getCourses(category || null));
    return true;
  }
  if (method === 'GET' && path === '/api/courses/with-progress') {
    const userId = parseInt(url.searchParams.get('user_id') || '0');
    sendJson(res, getAllCoursesWithProgress(userId));
    return true;
  }
  if (method === 'GET' && path === '/api/courses/user-progress') {
    const userId = parseInt(url.searchParams.get('user_id') || '0');
    sendJson(res, getUserCourseProgress(userId));
    return true;
  }
  const courseMatch = path.match(/^\/api\/courses\/(\d+)$/);
  if (courseMatch && method === 'GET') {
    const c = getCourse(parseInt(courseMatch[1]));
    if (!c) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, c);
    return true;
  }
  if (method === 'POST' && path === '/api/courses') {
    return readBody(req, (b) => {
      const vr = validate(COURSE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addCourse(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (courseMatch && method === 'PUT') {
    return readBody(req, (b) => {
      updateCourse(parseInt(courseMatch[1]), b);
      sendJson(res, { ok: true });
    }), true;
  }
  if (courseMatch && method === 'DELETE') {
    deleteCourse(parseInt(courseMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }
  const cpMatch = path.match(/^\/api\/courses\/(\d+)\/progress$/);
  if (cpMatch && method === 'GET') {
    const userId = parseInt(url.searchParams.get('user_id') || '0');
    sendJson(res, getCourseProgress(parseInt(cpMatch[1]), userId) || { status: 'not_started' });
    return true;
  }
  if (cpMatch && method === 'POST') {
    return readBody(req, (b) => {
      const userId = b.user_id || 0;
      upsertCourseProgress(parseInt(cpMatch[1]), userId, b);
      sendJson(res, { ok: true });
    }), true;
  }

  // ---- Knowledge Base ----
  if (method === 'GET' && path === '/api/kb/stats') {
    sendJson(res, getKbStats());
    return true;
  }
  if (method === 'GET' && path === '/api/kb/search') {
    const q = url.searchParams.get('q') || '';
    if (!q) { sendJson(res, []); return true; }
    sendJson(res, searchKb(q));
    return true;
  }
  if (method === 'POST' && path === '/api/kb/seed') {
    seedKbData();
    sendJson(res, { ok: true });
    return true;
  }

  // KB Printers
  if (method === 'GET' && path === '/api/kb/printers') {
    sendJson(res, getKbPrinters());
    return true;
  }
  const kbPrinterMatch = path.match(/^\/api\/kb\/printers\/(\d+)$/);
  if (kbPrinterMatch && method === 'GET') {
    const item = getKbPrinter(parseInt(kbPrinterMatch[1]));
    if (!item) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, item);
    return true;
  }
  if (method === 'POST' && path === '/api/kb/printers') {
    return readBody(req, (b) => {
      const vr = validate(KB_PRINTER_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addKbPrinter(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (kbPrinterMatch && method === 'PUT') {
    return readBody(req, (b) => { updateKbPrinter(parseInt(kbPrinterMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (kbPrinterMatch && method === 'DELETE') {
    deleteKbPrinter(parseInt(kbPrinterMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // KB Accessories
  if (method === 'GET' && path === '/api/kb/accessories') {
    const cat = url.searchParams.get('category') || null;
    sendJson(res, getKbAccessories(cat));
    return true;
  }
  const kbAccMatch = path.match(/^\/api\/kb\/accessories\/(\d+)$/);
  if (kbAccMatch && method === 'GET') {
    const item = getKbAccessory(parseInt(kbAccMatch[1]));
    if (!item) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, item);
    return true;
  }
  if (method === 'POST' && path === '/api/kb/accessories') {
    return readBody(req, (b) => {
      const vr = validate(KB_ACCESSORY_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addKbAccessory(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (kbAccMatch && method === 'PUT') {
    return readBody(req, (b) => { updateKbAccessory(parseInt(kbAccMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (kbAccMatch && method === 'DELETE') {
    deleteKbAccessory(parseInt(kbAccMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // KB Filaments
  if (method === 'GET' && path === '/api/kb/filaments') {
    const mat = url.searchParams.get('material') || null;
    const brand = url.searchParams.get('brand') || null;
    sendJson(res, getKbFilaments(mat, brand));
    return true;
  }
  const kbFilMatch = path.match(/^\/api\/kb\/filaments\/(\d+)$/);
  if (kbFilMatch && method === 'GET') {
    const item = getKbFilament(parseInt(kbFilMatch[1]));
    if (!item) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, item);
    return true;
  }
  if (method === 'POST' && path === '/api/kb/filaments') {
    return readBody(req, (b) => {
      const vr = validate(KB_FILAMENT_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addKbFilament(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (kbFilMatch && method === 'PUT') {
    return readBody(req, (b) => { updateKbFilament(parseInt(kbFilMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (kbFilMatch && method === 'DELETE') {
    deleteKbFilament(parseInt(kbFilMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // KB Profiles
  if (method === 'GET' && path === '/api/kb/profiles') {
    const printer = url.searchParams.get('printer') || null;
    const mat = url.searchParams.get('material') || null;
    sendJson(res, getKbProfiles(printer, mat));
    return true;
  }
  const kbProfMatch = path.match(/^\/api\/kb\/profiles\/(\d+)$/);
  if (kbProfMatch && method === 'GET') {
    const item = getKbProfile(parseInt(kbProfMatch[1]));
    if (!item) return sendJson(res, { error: 'Not found' }, 404), true;
    sendJson(res, item);
    return true;
  }
  if (method === 'POST' && path === '/api/kb/profiles') {
    return readBody(req, (b) => {
      const vr = validate(KB_PROFILE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addKbProfile(b);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  if (kbProfMatch && method === 'PUT') {
    return readBody(req, (b) => { updateKbProfile(parseInt(kbProfMatch[1]), b); sendJson(res, { ok: true }); }), true;
  }
  if (kbProfMatch && method === 'DELETE') {
    deleteKbProfile(parseInt(kbProfMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  // KB Tags
  if (method === 'GET' && path === '/api/kb/tags') {
    const type = url.searchParams.get('entity_type');
    const eid = parseInt(url.searchParams.get('entity_id'));
    if (!type || isNaN(eid)) return sendJson(res, { error: 'entity_type and entity_id required' }, 400), true;
    sendJson(res, getKbTags(type, eid));
    return true;
  }
  if (method === 'POST' && path === '/api/kb/tags') {
    return readBody(req, (b) => {
      const vr = validate(KB_TAG_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = addKbTag(b.entity_type, b.entity_id, b.tag);
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }
  const kbTagMatch = path.match(/^\/api\/kb\/tags\/(\d+)$/);
  if (kbTagMatch && method === 'DELETE') {
    deleteKbTag(parseInt(kbTagMatch[1]));
    sendJson(res, { ok: true });
    return true;
  }

  return false;
}
