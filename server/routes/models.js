// routes/models.js — MakerWorld, Printables, Thingiverse, modellsøk, modelllenker,
//                    3D-modell, thumbnail, HMS-koder, SD-kortfiler, Cloud Slicer
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getModelLink, setModelLink, deleteModelLink, getRecentModelLinks, getPrinters
} from '../database.js';
import { getThumbnail, getModel } from '../thumbnail-service.js';
import { lookupHmsCode, getHmsWikiUrl } from '../print-tracker.js';
import { sendJson, readBody, fetchJson, fetchHtml } from '../api-helpers.js';
import { withBreaker } from '../circuit-breaker.js';
import { createLogger } from '../logger.js';
import { validate } from '../validate.js';

// ---- Validation Schemas ----
const MODEL_LINK_SCHEMA = {
  filename: { type: 'string', required: true, minLength: 1, maxLength: 500 },
  source: { type: 'string', required: true, minLength: 1, maxLength: 50 },
  source_id: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};
import { existsSync, statSync, createReadStream, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const log = createLogger('route:models');
const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- MakerWorld cache ----
const _mwCache = new Map();
const MW_CACHE_TTL = 3600000; // 1 time

async function handleMakerWorldFetch(designId, res, bambuCloud) {
  const cached = _mwCache.get(designId);
  if (cached && Date.now() - cached.ts < MW_CACHE_TTL) {
    return sendJson(res, cached.data);
  }
  const mwUrl = `https://makerworld.com/en/models/${designId}`;
  const apiUrl = `https://api.bambulab.com/v1/design-service/design/${designId}`;
  try {
    const json = await fetchJson(apiUrl, 5000);
    const creator = json.designCreator || {};
    const instance = (json.instances || [])[0] || {};
    const printSettings = {};
    if (instance.printProfile) {
      const pp = instance.printProfile;
      if (pp.resolution) printSettings.resolution = pp.resolution;
      if (pp.infill) printSettings.infill = pp.infill;
      if (pp.supports != null) printSettings.supports = pp.supports ? 'Yes' : 'No';
      if (pp.rafts != null) printSettings.rafts = pp.rafts ? 'Yes' : 'No';
    }
    if (json.filamentType) printSettings.filament = json.filamentType;
    const data = {
      title: json.titleTranslated || json.title || null,
      image: json.coverUrl || instance.cover || null,
      description: (json.summaryTranslated || json.summary || '').replace(/<[^>]*>/g, ''),
      url: mwUrl, designer: creator.name || null, designerAvatar: creator.avatar || null,
      likes: json.likeCount || 0, downloads: json.downloadCount || 0, prints: json.printCount || 0,
      category: json.categoryName || json.tags?.[0] || null,
      print_settings: Object.keys(printSettings).length ? printSettings : null, fallback: false
    };
    _mwCache.set(designId, { data, ts: Date.now() });
    sendJson(res, data);
  } catch {
    if (bambuCloud?.isAuthenticated()) {
      try {
        const tasks = await bambuCloud.getTaskHistory();
        const task = tasks.find(t => String(t.id) === String(designId));
        if (task?.cover) {
          const data = {
            title: task.designTitle || task.title || null, image: task.cover,
            description: task.title || '', url: mwUrl, designer: null, designerAvatar: null,
            likes: 0, downloads: 0, prints: 0, category: null, print_settings: null, fallback: false,
            estimated_weight_g: task.weight || null, estimated_time_s: task.costTime || null,
            filament_type: task.amsDetailMapping?.[0]?.filamentType || null
          };
          _mwCache.set(designId, { data, ts: Date.now() });
          return sendJson(res, data);
        }
      } catch (e2) { log.debug('Bambu Cloud fallback feilet for design ' + designId + ': ' + e2.message); }
    }
    const fallback = { url: mwUrl, fallback: true };
    _mwCache.set(designId, { data: fallback, ts: Date.now() });
    sendJson(res, fallback);
  }
}

// ---- Printables cache ----
const _printablesCache = new Map();
async function handlePrintablesFetch(id, res) {
  const cached = _printablesCache.get(id);
  if (cached && Date.now() - cached.ts < MW_CACHE_TTL) return sendJson(res, cached.data);
  const url = `https://www.printables.com/model/${id}`;
  try {
    const html = await fetchHtml(url, 8000);
    const og = (name) => {
      const m = html.match(new RegExp(`<meta\\s+(?:property|name)=["']og:${name}["']\\s+content=["']([^"']+)["']`, 'i'))
        || html.match(new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+(?:property|name)=["']og:${name}["']`, 'i'));
      return m ? m[1] : null;
    };
    let ld = {};
    const ldMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/s);
    if (ldMatch) { try { ld = JSON.parse(ldMatch[1]); } catch (e) { log.debug('Ugyldig LD+JSON på Printables-side ' + id + ': ' + e.message); } }
    const ogTitle = og('title');
    const title = ld.name || (ogTitle ? ogTitle.replace(/\s*\|.*$/, '') : null) || `Printables #${id}`;
    const image = ld.image?.url || og('image') || null;
    const description = (ld.description || og('description') || '').substring(0, 500);
    let designer = null;
    if (ogTitle) { const byMatch = ogTitle.match(/by\s+(.+?)\s*\|/i); if (byMatch) designer = byMatch[1].trim(); }
    const printSettings = {};
    if (ld.material) printSettings.filament = ld.material;
    if (ld.weight?.value) printSettings.weight = `${ld.weight.value}${ld.weight.unitCode || 'g'}`;
    const data = {
      title, image, description, url, designer,
      likes: ld.aggregateRating?.ratingCount || 0, downloads: 0,
      category: null, print_settings: Object.keys(printSettings).length ? printSettings : null,
      source: 'printables', fallback: false
    };
    _printablesCache.set(id, { data, ts: Date.now() });
    sendJson(res, data);
  } catch {
    const fallback = { url, source: 'printables', fallback: true };
    _printablesCache.set(id, { data: fallback, ts: Date.now() });
    sendJson(res, fallback);
  }
}

// ---- Thingiverse cache ----
const _thingiverseCache = new Map();
async function handleThingiverseFetch(id, res) {
  const cached = _thingiverseCache.get(id);
  if (cached && Date.now() - cached.ts < MW_CACHE_TTL) return sendJson(res, cached.data);
  const url = `https://www.thingiverse.com/thing:${id}`;
  try {
    const json = await fetchJson(`https://api.thingiverse.com/things/${id}`, 8000);
    const printSettings = {};
    if (json.print_settings) {
      const ps = json.print_settings;
      if (ps.printer_brand) printSettings.printer = ps.printer_brand;
      if (ps.printer_model) printSettings.printer_model = ps.printer_model;
      if (ps.rafts) printSettings.rafts = ps.rafts;
      if (ps.supports) printSettings.supports = ps.supports;
      if (ps.resolution) printSettings.resolution = ps.resolution;
      if (ps.infill) printSettings.infill = ps.infill;
      if (ps.filament_brand) printSettings.filament = `${ps.filament_brand} ${ps.filament_color || ''}`.trim();
    }
    const data = {
      title: json.name || `Thingiverse #${id}`,
      image: json.thumbnail || null,
      description: (json.description || '').replace(/<[^>]*>/g, '').substring(0, 500),
      url, designer: json.creator?.name || null, likes: json.like_count || 0,
      downloads: json.download_count || 0,
      category: json.category?.name || (json.tags?.[0]?.name) || null,
      print_settings: Object.keys(printSettings).length ? printSettings : null,
      source: 'thingiverse', fallback: false
    };
    _thingiverseCache.set(id, { data, ts: Date.now() });
    sendJson(res, data);
  } catch {
    try {
      const html = await fetchHtml(url, 8000);
      const og = (name) => {
        const m = html.match(new RegExp(`<meta\\s+property=["']og:${name}["']\\s+content=["']([^"']+)["']`, 'i'));
        return m ? m[1] : null;
      };
      const data = { title: og('title') || `Thingiverse #${id}`, image: og('image') || null, url, designer: null, likes: 0, downloads: 0, source: 'thingiverse', fallback: true };
      _thingiverseCache.set(id, { data, ts: Date.now() });
      sendJson(res, data);
    } catch {
      const fallback = { url, source: 'thingiverse', fallback: true };
      _thingiverseCache.set(id, { data: fallback, ts: Date.now() });
      sendJson(res, fallback);
    }
  }
}

async function handleModelSearch(query, source, res) {
  const encodedQuery = encodeURIComponent(query);
  const searches = [];
  if (source === 'all' || source === 'makerworld') {
    searches.push(withBreaker('makerworld', async () => {
      const json = await fetchJson(`https://api.bambulab.com/v1/design-service/design/search?keyword=${encodedQuery}&limit=5`, 8000);
      if (json.code && json.code !== 200) return [];
      return (json.hits || json.designs || []).slice(0, 5).map(d => ({
        source: 'makerworld', source_id: String(d.id || d.designId),
        title: d.titleTranslated || d.title || 'Untitled', image: d.coverUrl || d.cover || null,
        url: `https://makerworld.com/en/models/${d.id || d.designId}`,
        designer: d.designCreator?.name || null, likes: d.likeCount || 0, downloads: d.downloadCount || 0
      }));
    }, []).catch(() => []));
  }
  if (source === 'all' || source === 'printables') {
    searches.push(withBreaker('printables', async () => {
      const html = await fetchHtml(`https://www.printables.com/search/models?q=${encodedQuery}`, 8000);
      const imgMap = {};
      const imgRegex = /https:\/\/media\.printables\.com\/media\/prints\/(\d+)\/images\/[^"'\s]+thumbs\/inside\/320x240\/[^"'\s]+/g;
      let im;
      while ((im = imgRegex.exec(html)) !== null) { if (!imgMap[im[1]]) imgMap[im[1]] = im[0]; }
      const results = [];
      const regex = /href="\/model\/(\d+)-([^"]+)"/g;
      let match;
      while ((match = regex.exec(html)) !== null && results.length < 5) {
        const id = match[1];
        const slug = match[2].replace(/-/g, ' ');
        if (!results.find(r => r.source_id === id)) {
          results.push({ source: 'printables', source_id: id, title: slug.charAt(0).toUpperCase() + slug.slice(1), image: imgMap[id] || null, url: `https://www.printables.com/model/${id}`, designer: null, likes: 0, downloads: 0 });
        }
      }
      return results;
    }, []).catch(() => []));
  }
  if (source === 'all' || source === 'thingiverse') {
    searches.push(withBreaker('thingiverse', async () => {
      const json = await fetchJson(`https://api.thingiverse.com/search/${encodedQuery}?type=things&per_page=5`, 8000);
      return (json.hits || []).slice(0, 5).map(d => ({
        source: 'thingiverse', source_id: String(d.id), title: d.name || 'Untitled', image: d.thumbnail || null,
        url: `https://www.thingiverse.com/thing:${d.id}`, designer: d.creator?.name || null,
        likes: d.like_count || 0, downloads: d.download_count || 0
      }));
    }, []).catch(() => []));
  }
  const results = (await Promise.all(searches)).flat();
  sendJson(res, results);
}

export async function handleModelRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Cloud image proxy (lokalt bufrede miniatyrbilder) ----
  const cloudImgMatch = path.match(/^\/api\/cloud-image\/(\d+)$/);
  if (cloudImgMatch && method === 'GET') {
    const imgPath = join(__dirname, '..', '..', 'data', 'thumbnails', `${cloudImgMatch[1]}.png`);
    if (existsSync(imgPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      return createReadStream(imgPath).pipe(res), true;
    }
    return sendJson(res, { error: 'Not found' }, 404), true;
  }

  // ---- MakerWorld ----
  const mwMatch = path.match(/^\/api\/makerworld\/(\d+)$/);
  if (mwMatch && method === 'GET') {
    await handleMakerWorldFetch(mwMatch[1], res, ctx.bambuCloud);
    return true;
  }

  // ---- Printables ----
  const printablesMatch = path.match(/^\/api\/printables\/(\d+)$/);
  if (printablesMatch && method === 'GET') {
    await handlePrintablesFetch(printablesMatch[1], res);
    return true;
  }

  // ---- Thingiverse ----
  const thingiverseMatch = path.match(/^\/api\/thingiverse\/(\d+)$/);
  if (thingiverseMatch && method === 'GET') {
    await handleThingiverseFetch(thingiverseMatch[1], res);
    return true;
  }

  // ---- Model Search ----
  if (method === 'GET' && path === '/api/model-search') {
    const q = url.searchParams.get('q');
    const source = url.searchParams.get('source') || 'all';
    if (!q || q.length < 2) return sendJson(res, { error: 'Query too short' }, 400), true;
    await handleModelSearch(q, source, res);
    return true;
  }

  // ---- Model Link CRUD ----
  const mlMatch = path.match(/^\/api\/model-link\/([a-zA-Z0-9_-]+)$/);
  if (mlMatch) {
    const printerId = mlMatch[1];
    const filename = url.searchParams.get('filename');
    if (method === 'GET') {
      if (!filename) return sendJson(res, { error: 'filename required' }, 400), true;
      const link = getModelLink(printerId, filename);
      if (link && link.print_settings && typeof link.print_settings === 'string') {
        try { link.print_settings = JSON.parse(link.print_settings); } catch (e) { log.warn('Failed to parse print_settings JSON', e.message); }
      }
      sendJson(res, link || null);
      return true;
    }
    if (method === 'PUT') {
      return readBody(req, (b) => {
        const vr = validate(MODEL_LINK_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        setModelLink({ printer_id: printerId, ...b });
        sendJson(res, { ok: true });
      }), true;
    }
    if (method === 'DELETE') {
      if (!filename) return sendJson(res, { error: 'filename required' }, 400), true;
      deleteModelLink(printerId, filename);
      sendJson(res, { ok: true });
      return true;
    }
  }

  if (method === 'GET' && path === '/api/model-links/recent') {
    sendJson(res, getRecentModelLinks(20));
    return true;
  }

  // ---- 3D Model ----
  const modelMatch = path.match(/^\/api\/model\/([a-zA-Z0-9_-]+)$/);
  if (modelMatch && method === 'GET') {
    const id = modelMatch[1];
    try {
      const model = await getModel(id, ctx.hub);
      if (!model) return sendJson(res, null, 404), true;
      sendJson(res, model);
    } catch (err) {
      log.warn('Model error: ' + err.message);
      sendJson(res, { error: 'Model error' }, 500);
    }
    return true;
  }

  // ---- Thumbnail ----
  const thumbMatch = path.match(/^\/api\/thumbnail\/([a-zA-Z0-9_-]+)$/);
  if (thumbMatch && method === 'GET') {
    const id = thumbMatch[1];
    try {
      const result = await getThumbnail(id, ctx.hub);
      if (!result) { res.writeHead(404); res.end(); return true; }
      res.writeHead(200, { 'Content-Type': result.contentType, 'Content-Length': result.buffer.length, 'Cache-Control': 'private, max-age=60' });
      res.end(result.buffer);
    } catch (err) {
      log.warn('Thumbnail error: ' + err.message);
      res.writeHead(500); res.end();
    }
    return true;
  }

  // ---- HMS Codes ----
  if (method === 'GET' && path === '/api/hms-codes') {
    try {
      const { readFileSync } = await import('node:fs');
      const codes = JSON.parse(readFileSync(join(__dirname, '..', 'hms-codes.json'), 'utf8'));
      sendJson(res, codes);
    } catch { sendJson(res, {}); }
    return true;
  }

  const hmsMatch = path.match(/^\/api\/hms-codes\/([a-zA-Z0-9_-]+)$/);
  if (hmsMatch && method === 'GET') {
    const code = hmsMatch[1];
    const description = lookupHmsCode(code);
    const wikiUrl = getHmsWikiUrl(code);
    sendJson(res, { code, description: description || null, wiki_url: wikiUrl });
    return true;
  }

  return false;
}
