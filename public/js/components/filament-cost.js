// filament-cost.js
// Shared filament cost helper. Estimates the kr cost of a given filament weight
// using the user's ACTUAL spool prices held in inventory (average cost-per-kg
// per material), falling back to sensible per-material defaults when a material
// has no priced spools yet. Exposes window.estimateFilamentCostNOK(weightG,
// material) plus a one-line window.filamentCostLabel(weightG, material).
(function () {
  'use strict';

  // Per-material fallback price (NOK per kg) when inventory has no priced spool.
  const DEFAULTS = { PLA: 200, PETG: 250, ABS: 220, ASA: 280, TPU: 350, PA: 450, PC: 400, PVA: 600, HIPS: 240 };
  const DEFAULT_ANY = 230;

  let _priceMap = null;     // material(base, upper) -> NOK/kg from real spools
  let _fetchedAt = 0;
  const TTL_MS = 5 * 60 * 1000;

  function _base(material) {
    const m = String(material || '').toUpperCase();
    // Reduce product-line names ("PLA-Basic", "PLA Matte") to the base material.
    for (const key of ['PETG', 'PLA', 'ABS', 'ASA', 'TPU', 'PVA', 'HIPS', 'PA', 'PC']) {
      if (m.includes(key)) return key;
    }
    return m || '';
  }

  // Refresh the per-material average price from real spool costs (cost field /
  // initial weight). Cheap, cached for 5 min, never throws.
  async function _refresh() {
    if (_priceMap && Date.now() - _fetchedAt < TTL_MS) return _priceMap;
    try {
      const r = await fetch('/api/inventory/spools');
      const data = await r.json();
      const rows = Array.isArray(data) ? data : (data.rows || data.spools || []);
      const acc = {};
      for (const s of rows) {
        const cost = Number(s.cost);
        const w = Number(s.initial_weight_g);
        if (!cost || !w || cost <= 0 || w <= 0) continue;
        const key = _base(s.material || s.profile_material);
        if (!key) continue;
        const perKg = (cost / w) * 1000;
        if (!isFinite(perKg) || perKg <= 0) continue;
        (acc[key] = acc[key] || []).push(perKg);
      }
      const map = {};
      for (const k of Object.keys(acc)) map[k] = acc[k].reduce((a, b) => a + b, 0) / acc[k].length;
      _priceMap = map;
      _fetchedAt = Date.now();
    } catch { /* keep whatever we had; defaults still apply */ }
    return _priceMap || {};
  }

  // Kick off a background refresh so the first synchronous call has real prices.
  _refresh();

  function _pricePerKg(material) {
    const key = _base(material);
    if (_priceMap && _priceMap[key] != null) return _priceMap[key];
    return DEFAULTS[key] != null ? DEFAULTS[key] : DEFAULT_ANY;
  }

  // Synchronous best-effort estimate (uses cached real prices when available).
  window.estimateFilamentCostNOK = function (weightG, material) {
    const w = Number(weightG) || 0;
    if (w <= 0) return 0;
    return (w / 1000) * _pricePerKg(material);
  };

  // "~12 kr" style label, formatted via the shared currency formatter.
  window.filamentCostLabel = function (weightG, material) {
    const cost = window.estimateFilamentCostNOK(weightG, material);
    if (window.formatCurrency) return window.formatCurrency(cost, 0);
    return Math.round(cost) + ' kr';
  };

  // Allow callers to force a price refresh (e.g. after editing spool costs).
  window.refreshFilamentPrices = _refresh;
})();
