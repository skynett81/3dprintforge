// routes/plugins.js — Plugin-system (list, enable/disable, settings, state, uninstall)
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getPlugins, getPlugin, registerPlugin, updatePluginEnabled, removePlugin,
  getPluginState, setPluginState, getPluginSettings, setPluginSettings
} from '../database.js';
import { sendJson, readBody } from '../api-helpers.js';

export async function handlePluginRoutes(method, path, req, res, body, ctx) {
  // GET /api/plugins — list alle plugins
  if (method === 'GET' && path === '/api/plugins') {
    const dbPlugins = getPlugins();
    const loaded = ctx.pluginManager ? ctx.pluginManager.getLoadedPlugins() : [];
    const loadedNames = new Set(loaded.map(p => p.name));
    const result = dbPlugins.map(p => ({
      ...p,
      hooks: (() => { try { return JSON.parse(p.hooks || '[]'); } catch { return []; } })(),
      panels: (() => { try { return JSON.parse(p.panels || '[]'); } catch { return []; } })(),
      settings_schema: (() => { try { return JSON.parse(p.settings_schema || '{}'); } catch { return {}; } })(),
      loaded: loadedNames.has(p.name),
      settings: getPluginSettings(p.id)
    }));
    sendJson(res, result);
    return true;
  }

  // GET /api/plugins/hooks — tilgjengelige hook-navn
  if (method === 'GET' && path === '/api/plugins/hooks') {
    const hooks = ctx.pluginManager ? ctx.pluginManager.getHookNames() : [];
    sendJson(res, hooks);
    return true;
  }

  // GET /api/plugins/:name — plugin detalj
  const pluginDetailMatch = path.match(/^\/api\/plugins\/([^/]+)$/);
  if (method === 'GET' && pluginDetailMatch && pluginDetailMatch[1] !== 'hooks') {
    const p = getPlugin(decodeURIComponent(pluginDetailMatch[1]));
    if (!p) return sendJson(res, { error: 'Plugin not found' }, 404), true;
    p.hooks = (() => { try { return JSON.parse(p.hooks || '[]'); } catch { return []; } })();
    p.panels = (() => { try { return JSON.parse(p.panels || '[]'); } catch { return []; } })();
    p.settings_schema = (() => { try { return JSON.parse(p.settings_schema || '{}'); } catch { return {}; } })();
    p.settings = getPluginSettings(p.id);
    p.loaded = ctx.pluginManager ? ctx.pluginManager.getLoadedPlugins().some(lp => lp.name === p.name) : false;
    sendJson(res, p);
    return true;
  }

  // POST /api/plugins/:name/enable
  const pluginEnableMatch = path.match(/^\/api\/plugins\/([^/]+)\/enable$/);
  if (method === 'POST' && pluginEnableMatch) {
    const name = decodeURIComponent(pluginEnableMatch[1]);
    const p = getPlugin(name);
    if (!p) return sendJson(res, { error: 'Plugin not found' }, 404), true;
    if (ctx.pluginManager) {
      try {
        await ctx.pluginManager.enablePlugin(name);
      } catch (e) {
        return sendJson(res, { error: e.message }, 500), true;
      }
    } else {
      updatePluginEnabled(name, 1);
    }
    sendJson(res, { ok: true, name, enabled: true });
    return true;
  }

  // POST /api/plugins/:name/disable
  const pluginDisableMatch = path.match(/^\/api\/plugins\/([^/]+)\/disable$/);
  if (method === 'POST' && pluginDisableMatch) {
    const name = decodeURIComponent(pluginDisableMatch[1]);
    const p = getPlugin(name);
    if (!p) return sendJson(res, { error: 'Plugin not found' }, 404), true;
    if (ctx.pluginManager) {
      try {
        await ctx.pluginManager.disablePlugin(name);
      } catch (e) {
        return sendJson(res, { error: e.message }, 500), true;
      }
    } else {
      updatePluginEnabled(name, 0);
    }
    sendJson(res, { ok: true, name, enabled: false });
    return true;
  }

  // PUT /api/plugins/:name/settings
  const pluginSettingsMatch = path.match(/^\/api\/plugins\/([^/]+)\/settings$/);
  if (method === 'PUT' && pluginSettingsMatch) {
    const name = decodeURIComponent(pluginSettingsMatch[1]);
    const p = getPlugin(name);
    if (!p) return sendJson(res, { error: 'Plugin not found' }, 404), true;
    return readBody(req, (b) => {
      setPluginSettings(p.id, b);
      sendJson(res, { ok: true, settings: b });
    }), true;
  }

  // GET /api/plugins/:name/state
  const pluginStateMatch = path.match(/^\/api\/plugins\/([^/]+)\/state$/);
  if (method === 'GET' && pluginStateMatch) {
    const name = decodeURIComponent(pluginStateMatch[1]);
    const p = getPlugin(name);
    if (!p) return sendJson(res, { error: 'Plugin not found' }, 404), true;
    const settings = getPluginSettings(p.id);
    sendJson(res, { _settings: settings });
    return true;
  }

  // DELETE /api/plugins/:name — avinstaller (fjern fra DB, slett ikke filer)
  const pluginDeleteMatch = path.match(/^\/api\/plugins\/([^/]+)$/);
  if (method === 'DELETE' && pluginDeleteMatch) {
    const name = decodeURIComponent(pluginDeleteMatch[1]);
    const p = getPlugin(name);
    if (!p) return sendJson(res, { error: 'Plugin not found' }, 404), true;
    if (ctx.pluginManager) {
      try { await ctx.pluginManager.disablePlugin(name); } catch (e) { /* plugin allerede deaktivert eller ikke lastet */ }
    }
    removePlugin(name);
    sendJson(res, { ok: true, name, removed: true });
    return true;
  }

  return false;
}
