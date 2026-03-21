// Filament Inventory Tracker — Core: constants, state, module builders (BUILDERS), cascade filters,
// tab switching, main render loop, global API surface.
// Sub-components (loaded BEFORE this file):
//   filament-spool-cards.js  — spool card rendering, visual cards, detail overlay
//   filament-dialogs.js      — add/edit spool dialogs, manage CRUD
//   filament-labels.js       — QR/barcode labels, QR scanner, import, WS listener
//   filament-drying.js       — drying management
//   filament-tools.js        — tools sub-tabs, NFC, color card
//   filament-bulk.js         — bulk operations
//   filament-database.js     — community filament database browser
(function() {


  // ═══ Constants & Helpers ═══
  // Real-time spool percentage: adjusts for active print consumption
  function spoolPct(s) {
    if (!s) return 0;
    const init = s.initial_weight_g || 0;
    const rem = s.remaining_weight_g || 0;
    if (init <= 0) return 0;
    // Check if this spool is currently active in AMS
    if (typeof window.realtimeFilament === 'function' && s.printer_id && s.ams_unit != null && s.ams_tray != null) {
      const state = window.printerState?.getActivePrinterState?.();
      const ams = state?.ams || state?.print?.ams;
      if (ams) {
        const activeIdx = ams.tray_now != null ? parseInt(ams.tray_now) : -1;
        const spoolIdx = s.ams_unit * 4 + s.ams_tray;
        const isActive = spoolIdx === activeIdx;
        const rt = window.realtimeFilament({ remainG: rem, totalG: init, isActive, data: state });
        return rt.current;
      }
    }
    return Math.max(0, Math.round((rem / init) * 100));
  }

  // Real-time remaining grams for a spool
  function spoolRemainG(s) {
    if (!s) return 0;
    const init = s.initial_weight_g || 0;
    const rem = s.remaining_weight_g || 0;
    if (typeof window.realtimeFilament === 'function' && s.printer_id && s.ams_unit != null && s.ams_tray != null) {
      const state = window.printerState?.getActivePrinterState?.();
      const ams = state?.ams || state?.print?.ams;
      if (ams) {
        const activeIdx = ams.tray_now != null ? parseInt(ams.tray_now) : -1;
        const spoolIdx = s.ams_unit * 4 + s.ams_tray;
        const isActive = spoolIdx === activeIdx;
        const rt = window.realtimeFilament({ remainG: rem, totalG: init, isActive, data: state });
        return rt.currentG;
      }
    }
    return Math.round(rem);
  }

  const FILAMENT_TYPES = {
    'Standard': ['PLA', 'PLA+', 'PLA Matte', 'PLA Silk', 'PLA Marble', 'PLA Metal', 'PLA Glow', 'PLA Galaxy', 'PLA Sparkle', 'PLA Wood'],
    'Engineering': ['PETG', 'PETG-CF', 'ABS', 'ASA', 'PC', 'PA', 'PA-CF', 'PA-GF', 'PA6-CF', 'PA6-GF', 'PAHT-CF', 'PET-CF', 'PPA-CF', 'PPA-GF'],
    'Flexible': ['TPU', 'TPU 95A'],
    'Support': ['PVA', 'HIPS', 'BVOH'],
    'Specialty': ['PP', 'PE', 'EVA']
  };

  function buildMaterialOptions(selected) {
    let html = '<option value="">--</option>';
    let found = false;
    for (const [group, types] of Object.entries(FILAMENT_TYPES)) {
      html += `<optgroup label="${group}">`;
      for (const tp of types) {
        const sel = tp === selected ? 'selected' : '';
        if (sel) found = true;
        html += `<option value="${tp}" ${sel}>${tp}</option>`;
      }
      html += '</optgroup>';
    }
    if (selected && !found) {
      html += `<optgroup label="Custom"><option value="${selected}" selected>${selected}</option></optgroup>`;
    }
    html += `<option value="__custom__">${t('filament.custom_type')}</option>`;
    return html;
  }

  function hexToRgb(hex) { if (!hex || hex.length < 6) return '#888'; return hex.startsWith('#') ? hex : `#${hex.substring(0, 6)}`; }
  function hexToRgbColor(hex) { if (!hex || hex.length < 6) return 'rgb(128,128,128)'; const h = hex.replace('#',''); return `rgb(${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)})`; }
  function isLightColor(hex) { if (!hex || hex.length < 6) return false; const h = hex.replace('#',''); return (parseInt(h.substring(0,2),16)*299+parseInt(h.substring(2,4),16)*587+parseInt(h.substring(4,6),16)*114)/1000 > 160; }
  function printerName(id) { return window.printerState?._printerMeta?.[id]?.name || id || '--'; }
  function fmtW(g) { return g >= 1000 ? (g/1000).toFixed(1)+' kg' : Math.round(g)+'g'; }
  function barRow(lbl, pct, clr, val) { return `<div class="chart-bar-row"><span class="chart-bar-label">${lbl}</span><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${pct}%;background:${clr}"></div></div><span class="chart-bar-value">${val}</span></div>`; }
  function sRow(lbl, val, clr) { return `<div class="stats-detail-item"><span class="stats-detail-item-label">${lbl}</span><span class="stats-detail-item-value"${clr?` style="color:${clr}"`:''}>${val}</span></div>`; }

  function _buildColorStyle(colorHex, multiColorHexes, multiColorDirection) {
    let hexes;
    try { hexes = multiColorHexes ? (typeof multiColorHexes === 'string' ? JSON.parse(multiColorHexes) : multiColorHexes) : null; } catch { hexes = null; }
    if (hexes && hexes.length > 1) {
      const colors = hexes.map(h => hexToRgb(h));
      const dir = multiColorDirection === 'longitudinal' ? '90deg' : '180deg';
      return `linear-gradient(${dir},${colors.join(',')})`;
    }
    return hexToRgb(colorHex);
  }

  const TYPE_COLORS = { 'PLA':'#00e676','PLA+':'#00c853','PETG':'#f0883e','TPU':'#9b4dff','ABS':'#ff5252','ASA':'#1279ff','PA':'#e3b341','PA-CF':'#d2a8ff','PET-CF':'#f778ba','PLA-CF':'#79c0ff','PC':'#8b949e','PLA Silk':'#ffd700','PLA Matte':'#7cb342','PETG-CF':'#ff9800' };

  function heroCard(icon, value, label, color) {
    return `<div class="fil-hero-card">
      <div class="fil-hero-icon" style="background:${color}15;color:${color}">${icon}</div>
      <div class="fil-hero-value" style="color:${color}">${value}</div>
      <div class="fil-hero-label">${label}</div>
    </div>`;
  }

  // ═══ Tab config (alphabetically sorted by translated label at render time) ═══
  const TAB_CONFIG_UNSORTED = {
    inventory: { label: 'filament.tab_inventory', modules: ['spool-summary', 'active-filament', 'low-stock-alert', 'spool-grid'], order: 0 },
    database:  { label: 'filament.tab_database',  modules: ['db-hero', 'db-browser'] },
    drying:    { label: 'filament.tab_drying',    modules: ['drying-dashboard'] },
    multicolor:{ label: 'tabs.multicolor',        modules: ['multicolor-panel'], external: true },
    tools:     { label: 'filament.tab_tools',     modules: ['tools-dashboard'] },
    manage:    { label: 'filament.tab_manage',    modules: ['manage-dashboard'] },
    stats:     { label: 'filament.tab_stats',     modules: ['type-breakdown', 'brand-breakdown', 'cost-summary', 'stock-health', 'restock-suggestions', 'usage-predictions', 'cost-estimation', 'usage-history'] }
  };
  // Sort tabs: inventory always first, rest alphabetically by translated label
  function _getSortedTabs() {
    const entries = Object.entries(TAB_CONFIG_UNSORTED);
    return entries.sort((a, b) => {
      if (a[1].order === 0) return -1;
      if (b[1].order === 0) return 1;
      const la = t(a[1].label) || a[0];
      const lb = t(b[1].label) || b[0];
      return la.localeCompare(lb);
    });
  }
  const TAB_CONFIG = TAB_CONFIG_UNSORTED;
  const MODULE_SIZE = {
    'spool-summary': 'full', 'active-filament': 'full',
    'low-stock-alert': 'full', 'spool-grid': 'full',
    'db-hero': 'full', 'db-browser': 'full',
    'drying-dashboard': 'full',
    'tools-dashboard': 'full',
    'manage-dashboard': 'full',
    'type-breakdown': 'half', 'brand-breakdown': 'half',
    'cost-summary': 'half', 'stock-health': 'half',
    'restock-suggestions': 'full', 'usage-predictions': 'full', 'cost-estimation': 'full', 'usage-history': 'full'
  };

  const STORAGE_PREFIX = 'filament-module-order-';

  const _MOD_VER = 13;
  if (localStorage.getItem('filament-mod-ver') !== String(_MOD_VER)) {
    for (const tab of Object.keys(TAB_CONFIG)) localStorage.removeItem(STORAGE_PREFIX + tab);
    localStorage.setItem('filament-mod-ver', String(_MOD_VER));
  }

  let _activeTab = 'inventory';
  const _locked = true;
  let _spools = [];        // New enriched spools from /api/inventory/spools
  let _vendors = [];
  let _profiles = [];
  let _locations = [];
  let _showArchived = false;
  let _dryingSessions = [];
  let _dryingPresets = [];
  let _dryingStatus = [];
  let _dryingTimers = {};
  let _dryingSubTab = 'active';
  let _toolsSubTab = 'spools';
  let _manageSubTab = 'profiles';
  let _dryingHistory = [];
  let _dryHistoryFilter = { material: '', method: '' };
  let _dryHistorySort = 'date_desc';
  let _filterMaterial = '';
  let _filterVendor = '';
  let _filterLocation = '';
  let _filterPrinter = 'all';
  let _filterFavorites = false;
  let _filterColorFamily = '';
  let _filterTag = '';
  let _filterCategory = '';
  let _tags = [];
  let _viewMode = localStorage.getItem('inv-view-mode') || 'grid';
  let _groupBy = localStorage.getItem('inv-group-by') || 'material';

  // ═══ Filament Database state ═══
  let _dbFilaments = [];
  let _dbOwnedIds = new Set();
  let _dbTotal = 0;
  let _dbPage = 0;
  let _dbPageSize = 50;
  let _dbSearch = '';
  let _dbFilterBrand = '';
  let _dbFilterMaterial = '';
  let _dbFilterCategory = '';
  let _dbFilterHasK = false;
  let _dbFilterHasTd = false;
  let _dbFilterTranslucent = false;
  let _dbFilterGlow = false;
  let _dbFilterMultiColor = false;
  let _dbSort = 'manufacturer';
  let _dbSortDir = 'ASC';
  let _dbViewMode = localStorage.getItem('db-view-mode') || 'cards';
  let _dbStats = null;
  let _dbBrands = [];
  let _dbMaterials = [];
  let _dbCompare = [];
  let _dbLoaded = false;
  let _dbSearchTimer = null;

  // ═══ Color family classification ═══
  const COLOR_FAMILIES = {
    red:         { h: [345, 15],  s: [20, 100], l: [15, 75], hex: '#e53935', label: 'color.red' },
    orange:      { h: [15, 45],   s: [30, 100], l: [25, 75], hex: '#fb8c00', label: 'color.orange' },
    yellow:      { h: [45, 70],   s: [30, 100], l: [30, 80], hex: '#fdd835', label: 'color.yellow' },
    green:       { h: [70, 170],  s: [20, 100], l: [15, 75], hex: '#43a047', label: 'color.green' },
    blue:        { h: [170, 260], s: [20, 100], l: [15, 75], hex: '#1e88e5', label: 'color.blue' },
    purple:      { h: [260, 310], s: [20, 100], l: [15, 75], hex: '#8e24aa', label: 'color.purple' },
    pink:        { h: [310, 345], s: [20, 100], l: [25, 80], hex: '#ec407a', label: 'color.pink' },
    brown:       { h: [10, 45],   s: [15, 70],  l: [10, 40], hex: '#795548', label: 'color.brown' },
    black:       { h: [0, 360],   s: [0, 100],  l: [0, 12],  hex: '#212121', label: 'color.black' },
    white:       { h: [0, 360],   s: [0, 30],   l: [85, 100], hex: '#fafafa', label: 'color.white' },
    gray:        { h: [0, 360],   s: [0, 15],   l: [12, 85], hex: '#9e9e9e', label: 'color.gray' },
    transparent: { h: [0, 0],     s: [0, 0],    l: [0, 0],   hex: 'transparent', label: 'color.transparent' }
  };

  function _hexToHsl(hex) {
    if (!hex) return null;
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = parseInt(hex.substr(0,2),16)/255;
    const g = parseInt(hex.substr(2,2),16)/255;
    const b = parseInt(hex.substr(4,2),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0))*60; break;
        case g: h = ((b-r)/d + 2)*60; break;
        case b: h = ((r-g)/d + 4)*60; break;
      }
    }
    return { h: Math.round(h), s: Math.round(s*100), l: Math.round(l*100) };
  }

  function _classifyColor(hex) {
    const hsl = _hexToHsl(hex);
    if (!hsl) return 'transparent';
    // Check achromatic first (black, white, gray)
    if (hsl.l <= 12) return 'black';
    if (hsl.l >= 85 && hsl.s <= 30) return 'white';
    if (hsl.s <= 15) return 'gray';
    // Brown is low-saturation warm with low lightness
    if (hsl.h >= 10 && hsl.h < 45 && hsl.s >= 15 && hsl.s <= 70 && hsl.l >= 10 && hsl.l <= 40) return 'brown';
    // Chromatic families
    for (const [name, f] of Object.entries(COLOR_FAMILIES)) {
      if (name === 'black' || name === 'white' || name === 'gray' || name === 'brown' || name === 'transparent') continue;
      const hMatch = f.h[0] <= f.h[1]
        ? (hsl.h >= f.h[0] && hsl.h < f.h[1])
        : (hsl.h >= f.h[0] || hsl.h < f.h[1]); // wrap around for red
      if (hMatch && hsl.s >= f.s[0] && hsl.l >= f.l[0] && hsl.l <= f.l[1]) return name;
    }
    return 'gray';
  }

  // ═══ Printer capability map (Bambu Lab printers) ═══
  const PRINTER_CAPS = {
    'X1 Carbon':  { maxNozzle: 300, maxBed: 120, enclosed: true },
    'X1':         { maxNozzle: 300, maxBed: 110, enclosed: true },
    'X1E':        { maxNozzle: 300, maxBed: 120, enclosed: true },
    'P1S':        { maxNozzle: 300, maxBed: 110, enclosed: true },
    'P1P':        { maxNozzle: 300, maxBed: 110, enclosed: false },
    'P2S Combo':  { maxNozzle: 300, maxBed: 110, enclosed: true },
    'A1':         { maxNozzle: 300, maxBed: 100, enclosed: false },
    'A1 Mini':    { maxNozzle: 300, maxBed: 80,  enclosed: false },
    'H2D':        { maxNozzle: 300, maxBed: 110, enclosed: true },
  };
  const ENCLOSURE_MATERIALS = new Set(['ABS', 'ASA', 'PC', 'PA', 'PA-CF', 'PA-GF', 'PA6-CF', 'PAHT-CF', 'PPA-CF', 'PPA-GF']);

  function checkCompatibility(spool) {
    const warnings = [];
    if (!spool.printer_id) return warnings;
    const printer = window.stateStore?._printerMeta?.[spool.printer_id];
    const model = printer?.model || '';
    const caps = PRINTER_CAPS[model];
    if (!caps) return warnings;
    if (spool.nozzle_temp_max && spool.nozzle_temp_max > caps.maxNozzle) {
      warnings.push(t('filament.compat_nozzle_too_hot').replace('{{required}}', spool.nozzle_temp_max).replace('{{max}}', caps.maxNozzle));
    }
    if (spool.bed_temp_max && spool.bed_temp_max > caps.maxBed) {
      warnings.push(t('filament.compat_bed_too_hot').replace('{{required}}', spool.bed_temp_max).replace('{{max}}', caps.maxBed));
    }
    if (!caps.enclosed && ENCLOSURE_MATERIALS.has(spool.material)) {
      warnings.push(t('filament.compat_needs_enclosure').replace('{{material}}', spool.material));
    }
    return warnings;
  }
  let _sortBy = 'recent';
  let _searchQuery = '';
  let _currentPage = 0;
  let _pageSize = 50;
  let _searchDebounce = null;
  let _lowStockPct = 20;
  let _lowStockGrams = 0;

  // ═══ Bulk selection state (used by filament-bulk.js via window._fs) ═══
  let _selectedSpools = new Set();
  let _selectedProfiles = new Set();
  let _selectedVendors = new Set();

  // ═══ Shared state proxy — allows sub-component files to read/write private state ═══
  // Sub-files (filament-dialogs.js, filament-drying.js, etc.) access state via window._fs.xxx
  window._fs = new Proxy({}, {
    get(_, key) {
      const map = {
        spools: () => _spools, vendors: () => _vendors, profiles: () => _profiles,
        locations: () => _locations, tags: () => _tags,
        dryingSessions: () => _dryingSessions, dryingPresets: () => _dryingPresets,
        dryingStatus: () => _dryingStatus, dryingHistory: () => _dryingHistory,
        dryingTimers: () => _dryingTimers, dryingSubTab: () => _dryingSubTab,
        dryHistoryFilter: () => _dryHistoryFilter, dryHistorySort: () => _dryHistorySort,
        manageSubTab: () => _manageSubTab, toolsSubTab: () => _toolsSubTab,
        activeTab: () => _activeTab,
        lowStockPct: () => _lowStockPct, lowStockGrams: () => _lowStockGrams,
        sortBy: () => _sortBy, searchQuery: () => _searchQuery,
        currentPage: () => _currentPage, pageSize: () => _pageSize,
        viewMode: () => _viewMode, groupBy: () => _groupBy,
        selectedSpools: () => _selectedSpools, selectedProfiles: () => _selectedProfiles,
        selectedVendors: () => _selectedVendors,
        dbFilaments: () => _dbFilaments, dbOwnedIds: () => _dbOwnedIds,
        dbTotal: () => _dbTotal, dbPage: () => _dbPage, dbPageSize: () => _dbPageSize,
        dbSearch: () => _dbSearch, dbFilterBrand: () => _dbFilterBrand,
        dbFilterMaterial: () => _dbFilterMaterial, dbFilterCategory: () => _dbFilterCategory,
        dbFilterHasK: () => _dbFilterHasK, dbFilterHasTd: () => _dbFilterHasTd,
        dbFilterTranslucent: () => _dbFilterTranslucent, dbFilterGlow: () => _dbFilterGlow,
        dbFilterMultiColor: () => _dbFilterMultiColor,
        dbSort: () => _dbSort, dbSortDir: () => _dbSortDir, dbViewMode: () => _dbViewMode,
        dbStats: () => _dbStats, dbBrands: () => _dbBrands, dbMaterials: () => _dbMaterials,
        dbCompare: () => _dbCompare, dbLoaded: () => _dbLoaded, dbSearchTimer: () => _dbSearchTimer,
      };
      return map[key] ? map[key]() : undefined;
    },
    set(_, key, value) {
      switch (key) {
        case 'spools': _spools = value; break;
        case 'vendors': _vendors = value; break;
        case 'profiles': _profiles = value; break;
        case 'locations': _locations = value; break;
        case 'tags': _tags = value; break;
        case 'dryingSessions': _dryingSessions = value; break;
        case 'dryingPresets': _dryingPresets = value; break;
        case 'dryingStatus': _dryingStatus = value; break;
        case 'dryingHistory': _dryingHistory = value; break;
        case 'dryingTimers': _dryingTimers = value; break;
        case 'dryingSubTab': _dryingSubTab = value; break;
        case 'dryHistoryFilter': _dryHistoryFilter = value; break;
        case 'dryHistorySort': _dryHistorySort = value; break;
        case 'manageSubTab': _manageSubTab = value; break;
        case 'toolsSubTab': _toolsSubTab = value; break;
        case 'activeTab': _activeTab = value; break;
        case 'lowStockPct': _lowStockPct = value; break;
        case 'lowStockGrams': _lowStockGrams = value; break;
        case 'sortBy': _sortBy = value; break;
        case 'searchQuery': _searchQuery = value; break;
        case 'currentPage': _currentPage = value; break;
        case 'pageSize': _pageSize = value; break;
        case 'viewMode': _viewMode = value; break;
        case 'groupBy': _groupBy = value; break;
        case 'selectedSpools': _selectedSpools = value; break;
        case 'selectedProfiles': _selectedProfiles = value; break;
        case 'selectedVendors': _selectedVendors = value; break;
        case 'dbFilaments': _dbFilaments = value; break;
        case 'dbOwnedIds': _dbOwnedIds = value; break;
        case 'dbTotal': _dbTotal = value; break;
        case 'dbPage': _dbPage = value; break;
        case 'dbPageSize': _dbPageSize = value; break;
        case 'dbSearch': _dbSearch = value; break;
        case 'dbFilterBrand': _dbFilterBrand = value; break;
        case 'dbFilterMaterial': _dbFilterMaterial = value; break;
        case 'dbFilterCategory': _dbFilterCategory = value; break;
        case 'dbFilterHasK': _dbFilterHasK = value; break;
        case 'dbFilterHasTd': _dbFilterHasTd = value; break;
        case 'dbFilterTranslucent': _dbFilterTranslucent = value; break;
        case 'dbFilterGlow': _dbFilterGlow = value; break;
        case 'dbFilterMultiColor': _dbFilterMultiColor = value; break;
        case 'dbSort': _dbSort = value; break;
        case 'dbSortDir': _dbSortDir = value; break;
        case 'dbViewMode': _dbViewMode = value; break;
        case 'dbStats': _dbStats = value; break;
        case 'dbBrands': _dbBrands = value; break;
        case 'dbMaterials': _dbMaterials = value; break;
        case 'dbCompare': _dbCompare = value; break;
        case 'dbLoaded': _dbLoaded = value; break;
        case 'dbSearchTimer': _dbSearchTimer = value; break;
        default: return false;
      }
      return true;
    }
  });

  // ═══ Module order ═══
  function getOrder(tabId) {
    return TAB_CONFIG[tabId]?.modules || [];
  }

  // ═══ Cascade filter options ═══
  function _applyFiltersExcept(spools, excludeDim) {
    return spools.filter(s => {
      if (!_showArchived && s.archived) return false;
      if (_filterFavorites && !s.is_favorite) return false;
      if (excludeDim !== 'material' && _filterMaterial && s.material !== _filterMaterial) return false;
      if (excludeDim !== 'category' && _filterCategory && !Object.entries(FILAMENT_TYPES).some(([cat, types]) => cat === _filterCategory && types.includes(s.material))) return false;
      if (excludeDim !== 'vendor' && _filterVendor && s.vendor_name !== _filterVendor) return false;
      if (excludeDim !== 'location' && _filterLocation && s.location !== _filterLocation) return false;
      if (excludeDim !== 'color' && _filterColorFamily && _classifyColor(s.color_hex) !== _filterColorFamily) return false;
      if (excludeDim !== 'tag' && _filterTag && !(s.tags && s.tags.some(tg => String(tg.id) === _filterTag))) return false;
      if (_searchQuery) {
        const q = _searchQuery.toLowerCase();
        const fields = [s.profile_name, s.material, s.vendor_name, s.color_name, s.lot_number, s.location, s.comment, s.article_number, s.short_id].filter(Boolean);
        if (!fields.some(f => f.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }

  function _computeCascadeOptions(spools) {
    const matPool = _applyFiltersExcept(spools, 'material');
    const catPool = _applyFiltersExcept(spools, 'category');
    const venPool = _applyFiltersExcept(spools, 'vendor');
    const locPool = _applyFiltersExcept(spools, 'location');
    const tagPool = _applyFiltersExcept(spools, 'tag');
    const matCounts = {};
    for (const s of matPool) { if (s.material) matCounts[s.material] = (matCounts[s.material] || 0) + 1; }
    const venCounts = {};
    for (const s of venPool) { if (s.vendor_name) venCounts[s.vendor_name] = (venCounts[s.vendor_name] || 0) + 1; }
    const locCounts = {};
    for (const s of locPool) { if (s.location) locCounts[s.location] = (locCounts[s.location] || 0) + 1; }
    const catCounts = {};
    for (const s of catPool) {
      for (const [cat, types] of Object.entries(FILAMENT_TYPES)) {
        if (types.includes(s.material)) { catCounts[cat] = (catCounts[cat] || 0) + 1; break; }
      }
    }
    const tagCounts = {};
    for (const s of tagPool) { if (s.tags) for (const tg of s.tags) tagCounts[tg.id] = (tagCounts[tg.id] || 0) + 1; }
    return { matCounts, venCounts, locCounts, catCounts, tagCounts };
  }

  function _hasActiveFilters() {
    return !!(_filterMaterial || _filterVendor || _filterLocation || _filterCategory || _filterTag || _filterColorFamily || _filterFavorites || _searchQuery);
  }

  // ═══ Module builders ═══
  const BUILDERS = {
    'spool-summary': (spools) => {
      let totalRemaining = 0, totalValue = 0, lowStockCount = 0;
      const active = spools.filter(s => !s.archived);
      for (const s of active) {
        totalRemaining += spoolRemainG(s);
        if (s.cost) totalValue += s.cost;
        const pct = spoolPct(s);
        const rG = spoolRemainG(s);
        if ((pct > 0 && pct < _lowStockPct) || (_lowStockGrams > 0 && rG > 0 && rG < _lowStockGrams)) lowStockCount++;
      }
      const lowColor = lowStockCount > 0 ? '#f0883e' : '#00e676';
      return `<div class="fil-hero-grid">
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', active.length, t('filament.total_spools'), '#1279ff')}
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', fmtW(totalRemaining), t('filament.total_remaining'), '#00e676')}
        ${totalValue > 0 ? heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', formatCurrency(totalValue, 0), t('filament.total_value'), '#e3b341') : ''}
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', lowStockCount, t('filament.low_stock'), lowColor)}
      </div>`;
    },

    'low-stock-alert': (spools) => {
      const low = spools.filter(s => {
        if (s.archived) return false;
        const pct = spoolPct(s) || 100;
        return (pct > 0 && pct < _lowStockPct) || (_lowStockGrams > 0 && s.remaining_weight_g > 0 && s.remaining_weight_g < _lowStockGrams);
      });
      if (low.length === 0) return '';
      return `<div class="filament-low-stock-alert">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>${t('filament.low_stock_warning', { count: low.length })}</span>
      </div>`;
    },

    'active-filament': () => {
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z"/></svg>
        ${t('common.active_filament')}
      </div>`;
      h += window.buildActiveFilamentContent();
      return h;
    },

    'spool-grid': (spools) => {
      // Filter bar with search
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        ${t('filament.spool_title')}
      </div>`;

      // Cascade filter options — each dropdown only shows options matching OTHER active filters
      const _co = _computeCascadeOptions(spools);

      h += `<div class="inv-filter-bar">
        <label class="bulk-select-all" title="${t('filament.bulk_select_all')}">
          <input type="checkbox" id="bulk-select-all-cb" onchange="window._bulkSelectAll(this.checked)">
          <span>${t('filament.bulk_select_all')}</span>
        </label>
        <input class="form-input form-input-sm inv-search-input" type="text" placeholder="${t('filament.search_placeholder')}" value="${esc(_searchQuery)}" oninput="window._invSearch(this.value)">
        <button class="inv-filter-chip ${_filterFavorites ? 'active' : ''}" onclick="window._invToggleFavorites()" title="${t('filament.favorites_only')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="${_filterFavorites ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <select class="form-input form-input-sm" onchange="window._invFilterMaterial(this.value)">
          <option value="">${t('filament.filter_all')} ${t('filament.filter_material')}</option>
          ${Object.entries(_co.matCounts).sort(([a],[b]) => a.localeCompare(b)).map(([m, n]) => `<option value="${m}" ${m === _filterMaterial ? 'selected' : ''}>${m} (${n})</option>`).join('')}
        </select>
        <select class="form-input form-input-sm" onchange="window._invFilterCategory(this.value)">
          <option value="">${t('filament.filter_all')} ${t('filament.filter_category')}</option>
          ${Object.keys(FILAMENT_TYPES).filter(c => _co.catCounts[c]).map(c => `<option value="${c}" ${c === _filterCategory ? 'selected' : ''}>${c} (${_co.catCounts[c]})</option>`).join('')}
        </select>
        <select class="form-input form-input-sm" onchange="window._invFilterVendor(this.value)">
          <option value="">${t('filament.filter_all')} ${t('filament.filter_vendor')}</option>
          ${Object.entries(_co.venCounts).sort(([a],[b]) => a.localeCompare(b)).map(([v, n]) => `<option value="${v}" ${v === _filterVendor ? 'selected' : ''}>${v} (${n})</option>`).join('')}
        </select>
        <select class="form-input form-input-sm" onchange="window._invFilterLocation(this.value)">
          <option value="">${t('filament.filter_all')} ${t('filament.filter_location')}</option>
          ${Object.entries(_co.locCounts).sort(([a],[b]) => a.localeCompare(b)).map(([l, n]) => `<option value="${l}" ${l === _filterLocation ? 'selected' : ''}>${l} (${n})</option>`).join('')}
        </select>
        ${_tags.length ? `<select class="form-input form-input-sm" onchange="window._invFilterTag(this.value)">
          <option value="">${t('filament.all_tags')}</option>
          ${_tags.filter(tg => _co.tagCounts[tg.id]).map(tg => `<option value="${tg.id}" ${String(tg.id) === _filterTag ? 'selected' : ''}>${esc(tg.name)} (${_co.tagCounts[tg.id]})</option>`).join('')}
        </select>` : ''}
        <select class="form-input form-input-sm" onchange="window._invSort(this.value)">
          <option value="recent" ${_sortBy === 'recent' ? 'selected' : ''}>${t('filament.sort_recent')}</option>
          <option value="name" ${_sortBy === 'name' ? 'selected' : ''}>${t('filament.sort_name')}</option>
          <option value="remaining_asc" ${_sortBy === 'remaining_asc' ? 'selected' : ''}>${t('filament.sort_remaining_asc')}</option>
          <option value="remaining_desc" ${_sortBy === 'remaining_desc' ? 'selected' : ''}>${t('filament.sort_remaining_desc')}</option>
          <option value="fifo" ${_sortBy === 'fifo' ? 'selected' : ''}>${t('filament.sort_fifo')}</option>
        </select>
        ${_hasActiveFilters() ? `<button class="inv-filter-chip" onclick="window._invResetFilters()" title="${t('filament.reset_filters')}" style="color:var(--accent-red)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ${t('filament.reset_filters')}
        </button>` : ''}
        <label class="inv-archive-toggle">
          <input type="checkbox" ${_showArchived ? 'checked' : ''} onchange="window._invToggleArchived(this.checked)">
          <span>${t('filament.show_archived')}</span>
        </label>
        <div class="inv-view-toggle">
          <button class="inv-view-btn ${_viewMode === 'grid' ? 'active' : ''}" onclick="window._invViewMode('grid')" title="${t('filament.view_grid')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <button class="inv-view-btn ${_viewMode === 'list' ? 'active' : ''}" onclick="window._invViewMode('list')" title="${t('filament.view_list')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
          <button class="inv-view-btn ${_viewMode === 'table' ? 'active' : ''}" onclick="window._invViewMode('table')" title="${t('filament.view_table')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </button>
          <button class="inv-view-btn ${_viewMode === 'groups' ? 'active' : ''}" onclick="window._invViewMode('groups')" title="${t('filament.groups_view')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          </button>
        </div>
      </div>`;
      // Active filter chips
      if (_hasActiveFilters()) {
        h += `<div class="inv-active-filters">`;
        if (_searchQuery) h += `<span class="inv-active-chip" onclick="window._invSearch('')">${t('filament.search_placeholder')}: "${esc(_searchQuery)}" &times;</span>`;
        if (_filterMaterial) h += `<span class="inv-active-chip" onclick="window._invFilterMaterial('')">${_filterMaterial} &times;</span>`;
        if (_filterCategory) h += `<span class="inv-active-chip" onclick="window._invFilterCategory('')">${_filterCategory} &times;</span>`;
        if (_filterVendor) h += `<span class="inv-active-chip" onclick="window._invFilterVendor('')">${_filterVendor} &times;</span>`;
        if (_filterLocation) h += `<span class="inv-active-chip" onclick="window._invFilterLocation('')">${_filterLocation} &times;</span>`;
        if (_filterColorFamily) h += `<span class="inv-active-chip" onclick="window._invFilterColor('')">${_filterColorFamily} &times;</span>`;
        if (_filterTag) { const tg = _tags.find(t2 => String(t2.id) === _filterTag); h += `<span class="inv-active-chip" onclick="window._invFilterTag('')">${tg ? esc(tg.name) : _filterTag} &times;</span>`; }
        if (_filterFavorites) h += `<span class="inv-active-chip" onclick="window._invToggleFavorites()">${t('filament.favorites_only')} &times;</span>`;
        h += `</div>`;
      }
      // Color family filter chips
      const colorFamilies = [...new Set(spools.map(s => _classifyColor(s.color_hex)).filter(c => c !== 'transparent'))];
      if (colorFamilies.length > 1) {
        h += `<div class="inv-color-filter-bar">`;
        h += `<button class="inv-color-chip ${!_filterColorFamily ? 'active' : ''}" onclick="window._invFilterColor('')" title="${t('filament.filter_all')}" style="font-size:0.75rem;padding:2px 8px">${t('filament.filter_all')}</button>`;
        for (const [name, fam] of Object.entries(COLOR_FAMILIES)) {
          if (name === 'transparent' || !colorFamilies.includes(name)) continue;
          const isActive = _filterColorFamily === name;
          const border = name === 'white' ? '1px solid var(--border-color)' : 'none';
          h += `<button class="inv-color-chip ${isActive ? 'active' : ''}" onclick="window._invFilterColor('${name}')" title="${t(fam.label)}">
            <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${fam.hex};border:${border};vertical-align:middle"></span>
            <span style="font-size:0.75rem">${t(fam.label)}</span>
          </button>`;
        }
        h += `</div>`;
      }

      // Apply filters
      let filtered = spools.filter(s => {
        if (!_showArchived && s.archived) return false;
        if (_filterFavorites && !s.is_favorite) return false;
        if (_filterMaterial && s.material !== _filterMaterial) return false;
        if (_filterCategory && !Object.entries(FILAMENT_TYPES).some(([cat, types]) => cat === _filterCategory && types.includes(s.material))) return false;
        if (_filterVendor && s.vendor_name !== _filterVendor) return false;
        if (_filterLocation && s.location !== _filterLocation) return false;
        if (_filterColorFamily && _classifyColor(s.color_hex) !== _filterColorFamily) return false;
        if (_filterTag && !(s.tags && s.tags.some(tg => String(tg.id) === _filterTag))) return false;
        if (_searchQuery) {
          const q = _searchQuery.toLowerCase();
          const fields = [s.profile_name, s.material, s.vendor_name, s.color_name, s.lot_number, s.location, s.comment, s.article_number, s.short_id].filter(Boolean);
          if (!fields.some(f => f.toLowerCase().includes(q))) return false;
        }
        return true;
      });

      // Sort — favorites first, then by selected criteria
      filtered.sort((a, b) => {
        const favA = a.is_favorite ? 1 : 0;
        const favB = b.is_favorite ? 1 : 0;
        if (favB !== favA) return favB - favA;
        if (_sortBy === 'name') return (a.profile_name || '').localeCompare(b.profile_name || '');
        if (_sortBy === 'remaining_asc') return spoolRemainG(a) - spoolRemainG(b);
        if (_sortBy === 'remaining_desc') return spoolRemainG(b) - spoolRemainG(a);
        if (_sortBy === 'fifo') {
          const aD = a.purchase_date || a.created_at || '';
          const bD = b.purchase_date || b.created_at || '';
          return aD.localeCompare(bD);
        }
        const aDate = a.last_used_at || a.created_at || '';
        const bDate = b.last_used_at || b.created_at || '';
        return bDate.localeCompare(aDate);
      });

      // Pagination
      const totalFiltered = filtered.length;
      const totalPages = Math.ceil(totalFiltered / _pageSize);
      if (_currentPage >= totalPages) _currentPage = Math.max(0, totalPages - 1);
      const pageStart = _currentPage * _pageSize;
      const pageSpools = filtered.slice(pageStart, pageStart + _pageSize);

      if (filtered.length === 0) {
        h += emptyState({
          icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
          title: _searchQuery ? t('filament.no_search_results') : t('filament.no_spools'),
          desc: _searchQuery ? '' : (t('filament.no_spools_desc') || 'Add your first spool to start tracking filament usage.'),
          actionLabel: _searchQuery ? '' : (t('filament.add_spool') || 'Add Spool'),
          actionOnClick: _searchQuery ? '' : 'document.querySelector(\'.fil-add-btn\')?.click()'
        });
      } else if (_viewMode === 'groups') {
        h += window._renderSpoolGroups(filtered);
      } else if (_viewMode === 'table') {
        h += window._renderSpoolTable(pageSpools);
      } else if (_viewMode === 'list') {
        h += window._renderSpoolList(pageSpools);
      } else {
        h += '<div class="spool-card-grid">';
        for (const s of pageSpools) h += window._renderSpoolVisualCard(s);
        h += '</div>';
      }

      // Pagination controls
      if (totalPages > 1) {
        h += `<div class="inv-pagination">
          <button class="form-btn form-btn-sm" data-ripple onclick="window._invPage(-1)" ${_currentPage === 0 ? 'disabled' : ''}>&laquo; ${t('filament.prev')}</button>
          <span class="inv-page-info">${_currentPage + 1} / ${totalPages} (${totalFiltered} ${t('filament.total_spools').toLowerCase()})</span>
          <button class="form-btn form-btn-sm" data-ripple onclick="window._invPage(1)" ${_currentPage >= totalPages - 1 ? 'disabled' : ''}>${t('filament.next')} &raquo;</button>
        </div>`;
      }
      return h;
    },

    // ── Manage tab modules ──

    // ── Manage dashboard (unified) ──
    'manage-dashboard': (spools) => {
      const tabs = [
        { id: 'profiles', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', label: t('filament.profiles_title') },
        { id: 'vendors', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>', label: t('filament.vendors_title') },
        { id: 'locations', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', label: t('filament.locations_title') },
        { id: 'tags', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>', label: t('filament.tags_title') },
        { id: 'prices', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>', label: t('filament.price_watch_title') },
        { id: 'insights', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', label: t('filament.ai_insights') }
      ];
      let h = `<div class="drying-sub-tabs">`;
      for (const tab of tabs) {
        h += `<button class="drying-sub-tab${_manageSubTab === tab.id ? ' active' : ''}" data-manage-tab="${tab.id}" onclick="window._switchManageSubTab('${tab.id}')" class="drying-sub-tab-inner">${tab.icon} ${tab.label}</button>`;
      }
      h += `</div>`;
      h += `<div id="manage-sub-content"></div>`;
      setTimeout(() => window._renderManageSubContent(spools), 0);
      return h;
    },

    // ── Stats tab ──

    'type-breakdown': (spools) => {
      const active = spools.filter(s => !s.archived);
      if (active.length === 0) return '';
      const byType = {};
      for (const s of active) {
        const tp = s.material || 'Unknown';
        if (!byType[tp]) byType[tp] = { count: 0, remaining_g: 0 };
        byType[tp].count++;
        byType[tp].remaining_g += spoolRemainG(s);
      }
      const sorted = Object.entries(byType).sort((a, b) => b[1].count - a[1].count);
      const mx = sorted[0]?.[1].count || 1;
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        ${t('filament.type_breakdown')}
      </div><div class="chart-bars">`;
      for (const [tp, d] of sorted) {
        const clr = TYPE_COLORS[tp] || 'var(--accent-blue)';
        h += barRow(esc(tp), (d.count / mx) * 100, clr, `${d.count} (${fmtW(d.remaining_g)})`);
      }
      h += '</div>';
      return h;
    },

    'brand-breakdown': (spools) => {
      const active = spools.filter(s => !s.archived);
      if (active.length === 0) return '';
      const byBrand = {};
      for (const s of active) {
        const br = s.vendor_name || 'Unknown';
        if (!byBrand[br]) byBrand[br] = { count: 0, total_cost: 0, total_weight: 0 };
        byBrand[br].count++;
        if (s.cost) byBrand[br].total_cost += s.cost;
        byBrand[br].total_weight += s.initial_weight_g || 0;
      }
      const sorted = Object.entries(byBrand).sort((a, b) => b[1].count - a[1].count);
      const mx = sorted[0]?.[1].count || 1;
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        ${t('filament.brand_breakdown')}
      </div><div class="chart-bars">`;
      for (const [br, d] of sorted) {
        const avgKg = d.total_weight > 0 && d.total_cost > 0 ? Math.round(d.total_cost / (d.total_weight / 1000)) : null;
        const extra = avgKg ? ` · ${formatCurrency(avgKg, 0)}/kg` : '';
        h += barRow(esc(br), (d.count / mx) * 100, 'var(--accent-purple)', `${d.count}${extra}`);
      }
      h += '</div>';
      return h;
    },

    'cost-summary': (spools) => {
      const active = spools.filter(s => !s.archived);
      let invested = 0, usedValue = 0, totalWeightKg = 0;
      const costByType = {};
      for (const s of active) {
        if (s.cost) {
          invested += s.cost;
          const usedPct = s.initial_weight_g > 0 ? (s.used_weight_g || 0) / s.initial_weight_g : 0;
          usedValue += s.cost * usedPct;
          const tp = s.material || 'Unknown';
          if (!costByType[tp]) costByType[tp] = 0;
          costByType[tp] += s.cost;
        }
        totalWeightKg += (s.initial_weight_g || 0) / 1000;
      }
      if (invested === 0) return '';
      const avgKg = totalWeightKg > 0 ? Math.round(invested / totalWeightKg) : 0;
      const expensive = Object.entries(costByType).sort((a, b) => b[1] - a[1])[0];
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        ${t('filament.cost_summary')}
      </div><div class="stats-detail-list">`;
      h += sRow(t('filament.total_invested'), formatCurrency(invested, 0));
      h += sRow(t('filament.total_used_value'), formatCurrency(usedValue, 0), 'var(--accent-orange)');
      h += sRow(t('filament.avg_cost_kg'), `${formatCurrency(avgKg, 0)}/kg`);
      if (expensive) h += sRow(t('filament.most_expensive'), `${esc(expensive[0])} (${formatCurrency(expensive[1], 0)})`);
      h += '</div>';
      return h;
    },

    'stock-health': (spools) => {
      const active = spools.filter(s => !s.archived);
      if (active.length === 0) return '';
      let full = 0, half = 0, low = 0, empty = 0, totalPct = 0;
      for (const s of active) {
        const pct = spoolPct(s);
        totalPct += pct;
        if (pct > 75) full++;
        else if (pct > 40) half++;
        else if (pct > 10) low++;
        else empty++;
      }
      const avg = active.length > 0 ? Math.round(totalPct / active.length) : 0;
      const tp = active.length;
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        ${t('filament.stock_health')}
      </div>`;
      h += '<div class="fil-health-bar">';
      if (full > 0) h += `<div class="fil-health-seg" style="width:${(full/tp)*100}%;background:var(--accent-green)" title="${t('filament.full')} (${full})"></div>`;
      if (half > 0) h += `<div class="fil-health-seg" style="width:${(half/tp)*100}%;background:var(--accent-blue)" title="${t('filament.half')} (${half})"></div>`;
      if (low > 0) h += `<div class="fil-health-seg" style="width:${(low/tp)*100}%;background:var(--accent-orange)" title="${t('filament.low')} (${low})"></div>`;
      if (empty > 0) h += `<div class="fil-health-seg" style="width:${(empty/tp)*100}%;background:var(--accent-red)" title="${t('filament.empty')} (${empty})"></div>`;
      h += '</div>';
      h += `<div class="fil-health-legend">
        <span><span class="fil-health-dot" style="background:var(--accent-green)"></span> ${t('filament.full')} (${full})</span>
        <span><span class="fil-health-dot" style="background:var(--accent-blue)"></span> ${t('filament.half')} (${half})</span>
        <span><span class="fil-health-dot" style="background:var(--accent-orange)"></span> ${t('filament.low')} (${low})</span>
        <span><span class="fil-health-dot" style="background:var(--accent-red)"></span> ${t('filament.empty')} (${empty})</span>
      </div>`;
      h += `<div class="fil-health-avg">
        <span class="fil-health-avg-label">${t('filament.avg_remaining')}</span>
        <span class="fil-health-avg-value" style="color:${avg > 50 ? 'var(--accent-green)' : avg > 20 ? 'var(--accent-orange)' : 'var(--accent-red)'}">${avg}%</span>
      </div>`;
      return h;
    },

    'restock-suggestions': () => {
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        ${t('filament.restock_title')}
      </div>`;
      h += `<div id="restock-container"><span class="text-muted text-sm">Loading...</span></div>`;
      setTimeout(() => _loadRestockSuggestions(), 0);
      return h;
    },

    'usage-predictions': () => {
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        ${t('filament.usage_predictions')}
      </div>`;
      h += `<div id="usage-predictions-container"><span class="text-muted text-sm">Loading...</span></div>`;
      setTimeout(() => _loadUsagePredictions(), 0);
      return h;
    },

    'cost-estimation': () => {
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        ${t('filament.cost_estimate')}
      </div>`;
      h += `<div id="cost-estimation-container"><span class="text-muted text-sm">Loading...</span></div>`;
      setTimeout(() => _loadCostEstimation(), 0);
      return h;
    },

    'usage-history': () => {
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        ${t('filament.usage_history')}
      </div>`;
      h += `<div id="usage-history-container"><span class="text-muted text-sm">Loading...</span></div>`;
      setTimeout(() => loadUsageHistory(), 0);
      return h;
    },

    // ── Drying dashboard (unified) ──
    'drying-dashboard': () => {
      // Stats hero
      const activeCount = _dryingSessions?.length || 0;
      const needsDrying = _dryingStatus?.filter(d => d.drying_status === 'overdue' || d.drying_status === 'due_soon').length || 0;
      const needsColor = needsDrying > 0 ? '#f0883e' : '#3fb950';
      let h = `<div class="fil-hero-grid" style="margin-bottom:16px">
        ${heroCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg>', activeCount, t('filament.drying_stats_active'), activeCount > 0 ? '#f0883e' : '#8b949e')}
        ${heroCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>', '<span id="drying-stat-total">...</span>', t('filament.drying_stats_total'), '#3fb950')}
        ${heroCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>', '<span id="drying-stat-humidity">...</span>', t('filament.drying_stats_humidity'), '#1279ff')}
        ${heroCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', needsDrying, t('filament.drying_stats_needs'), needsColor)}
      </div>`;

      // Sub-tabs + quick-start
      h += `<div class="drying-sub-tabs">
        <button class="drying-sub-tab${_dryingSubTab === 'active' ? ' active' : ''}" onclick="window._switchDryingSubTab('active')">${t('filament.drying_sub_active')}${activeCount > 0 ? ' (' + activeCount + ')' : ''}</button>
        <button class="drying-sub-tab${_dryingSubTab === 'history' ? ' active' : ''}" onclick="window._switchDryingSubTab('history')">${t('filament.drying_sub_history')}</button>
        <button class="drying-sub-tab${_dryingSubTab === 'presets' ? ' active' : ''}" onclick="window._switchDryingSubTab('presets')">${t('filament.drying_sub_presets')}</button>
        <div style="flex:1"></div>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._dryingQuickStart()" style="display:flex;align-items:center;gap:4px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          ${t('filament.drying_quick_start')}
        </button>
      </div>`;

      // Sub-tab content container
      h += `<div id="drying-sub-content"></div>`;
      setTimeout(() => {
        _renderDryingSubContent();
        window._loadDryingStats?.();
      }, 0);
      return h;
    },

    // ── Tools dashboard (unified) ──
    'tools-dashboard': () => {
      const tabs = [
        { id: 'spools', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>', label: t('filament.tools_sub_spools') },
        { id: 'colors', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/></svg>', label: t('filament.color_card') },
        { id: 'tags', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8.32a7.43 7.43 0 010 7.36"/><path d="M9.46 6.21a11.76 11.76 0 010 11.58"/><path d="M12.91 4.1a16.09 16.09 0 010 15.8"/><path d="M16.37 2a20.42 20.42 0 010 20"/></svg>', label: t('filament.nfc_manager') },
        { id: 'reference', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', label: t('filament.material_reference') },
        { id: 'compat', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>', label: t('filament.compatibility') },
        { id: 'tempguide', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>', label: t('filament.temp_guide') }
      ];
      let h = `<div class="drying-sub-tabs">`;
      for (const tab of tabs) {
        h += `<button class="drying-sub-tab${_toolsSubTab === tab.id ? ' active' : ''}" onclick="window._switchToolsSubTab('${tab.id}')" class="drying-sub-tab-inner">${tab.icon} ${tab.label}</button>`;
      }
      h += `</div>`;
      h += `<div id="tools-sub-content"></div>`;
      setTimeout(() => _renderToolsSubContent(), 0);
      return h;
    },

    // ── Filament Database modules ──
    'db-hero': () => {
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
        ${t('filament.tab_database')}
      </div>`;
      if (!_dbStats) {
        h += '<div id="db-hero-container"><span class="text-muted text-sm">Loading...</span></div>';
        setTimeout(() => window._loadDbStats?.(), 0);
        return h;
      }
      h += `<div class="fil-hero-grid">
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>', _dbStats.total.toLocaleString(), t('filament.db_total'), '#1279ff')}
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', _dbStats.brands.toLocaleString(), t('filament.db_brands'), '#00e676')}
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', _dbStats.materials.toLocaleString(), t('filament.db_materials'), '#f0883e')}
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', _dbStats.with_k_value.toLocaleString(), t('filament.db_with_k'), '#9b4dff')}
        ${heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></svg>', _dbStats.with_td.toLocaleString(), t('filament.db_with_td'), '#e3b341')}
        ${_dbStats.translucent ? heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10"/></svg>', _dbStats.translucent.toLocaleString(), t('filament.translucent') || 'Transparent', '#67e8f9') : ''}
        ${_dbStats.glow_in_dark ? heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 009 9 9 9 0 11-9-9z"/></svg>', _dbStats.glow_in_dark.toLocaleString(), t('filament.glow') || 'Glow', '#bef264') : ''}
        ${_dbStats.multi_color ? heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="6"/><circle cx="15" cy="15" r="6"/></svg>', _dbStats.multi_color.toLocaleString(), t('filament.multi_color') || 'Flerfarge', '#f9a8d4') : ''}
      </div>`;
      return h;
    },

    'db-browser': () => {
      let h = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        ${t('filament.db_search_placeholder')}
      </div>`;
      // Search bar
      h += `<div class="db-search-bar">
        <input class="form-input" type="text" placeholder="${t('filament.db_search_placeholder')}" value="${esc(_dbSearch)}" oninput="window._dbOnSearch(this.value)" id="db-search-input">
      </div>`;
      // Filter row
      h += '<div class="db-filters">';
      h += `<select class="form-input form-input-sm" onchange="window._dbSetBrand(this.value)" style="max-width:180px"><option value="">${t('filament.filter_all_brands')}</option>`;
      for (const b of _dbBrands) h += `<option value="${esc(b)}"${b===_dbFilterBrand?' selected':''}>${esc(b)}</option>`;
      h += '</select>';
      h += `<select class="form-input form-input-sm" onchange="window._dbSetMaterial(this.value)" style="max-width:140px"><option value="">${t('filament.filter_all_materials')}</option>`;
      for (const m of _dbMaterials) h += `<option value="${esc(m)}"${m===_dbFilterMaterial?' selected':''}>${esc(m)}</option>`;
      h += '</select>';
      h += `<select class="form-input form-input-sm" onchange="window._dbSetCategory(this.value)" style="max-width:140px"><option value="">${t('filament.db_all_categories')}</option>`;
      for (const c of ['standard','engineering','composite','flexible','specialty','support']) h += `<option value="${c}"${c===_dbFilterCategory?' selected':''}>${c[0].toUpperCase()+c.slice(1)}</option>`;
      h += '</select>';
      h += `<label class="db-filter-check"><input type="checkbox" ${_dbFilterHasK?'checked':''} onchange="window._dbToggleK(this.checked)"> K-Value</label>`;
      h += `<label class="db-filter-check"><input type="checkbox" ${_dbFilterHasTd?'checked':''} onchange="window._dbToggleTd(this.checked)"> TD</label>`;
      h += `<label class="db-filter-check"><input type="checkbox" ${_dbFilterTranslucent?'checked':''} onchange="window._dbToggleTranslucent(this.checked)"> ${t('filament.translucent') || 'Transparent'}</label>`;
      h += `<label class="db-filter-check"><input type="checkbox" ${_dbFilterGlow?'checked':''} onchange="window._dbToggleGlow(this.checked)"> ${t('filament.glow') || 'Glow'}</label>`;
      h += `<label class="db-filter-check"><input type="checkbox" ${_dbFilterMultiColor?'checked':''} onchange="window._dbToggleMultiColor(this.checked)"> ${t('filament.multi_color') || 'Multi'}</label>`;
      h += '</div>';
      // Toolbar
      h += '<div class="db-toolbar">';
      h += '<div class="db-view-toggle">';
      for (const [mode, icon] of [['cards','<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'],['table','<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>']]) {
        h += `<button class="form-btn form-btn-sm${_dbViewMode===mode?' active':''}" onclick="window._dbSetView('${mode}')" title="${mode}">${icon}</button>`;
      }
      h += '</div>';
      h += `<select class="form-input form-input-sm" onchange="window._dbSetSort(this.value)" style="max-width:160px">`;
      for (const [val, label] of [['manufacturer','Brand'],['name','Name'],['material','Material'],['extruder_temp','Temp'],['pressure_advance_k','K-Value'],['td_value','TD Value'],['price','Price'],['rating',t('filament.community_sort_rating')],['newest',t('filament.community_sort_newest')]]) {
        h += `<option value="${val}"${_dbSort===val?' selected':''}>${label}</option>`;
      }
      h += '</select>';
      h += `<button class="form-btn form-btn-sm" onclick="window._dbToggleSortDir()" title="Sort direction">${_dbSortDir==='ASC'?'&#x2191;':'&#x2193;'}</button>`;
      h += `<span class="db-results-count">${_dbTotal.toLocaleString()} ${t('filament.db_results')}</span>`;
      h += '</div>';
      // Results
      h += '<div id="db-results-container">';
      if (!_dbLoaded) {
        h += '<span class="text-muted text-sm">Loading...</span>';
        setTimeout(() => window._loadDbFilaments?.(), 0);
      } else if (_dbFilaments.length === 0) {
        h += `<p class="text-muted" style="font-size:0.85rem;padding:20px 0;text-align:center">${t('filament.db_no_results')}</p>`;
      } else {
        h += _renderDbResults();
      }
      h += '</div>';
      // Pagination
      if (_dbLoaded && _dbTotal > _dbPageSize) {
        const totalPages = Math.ceil(_dbTotal / _dbPageSize);
        h += '<div class="db-pagination">';
        h += `<button class="form-btn form-btn-sm" onclick="window._dbPrevPage()" ${_dbPage===0?'disabled':''}>&#x2190;</button>`;
        h += `<span class="db-page-info">${_dbPage+1} / ${totalPages}</span>`;
        h += `<button class="form-btn form-btn-sm" onclick="window._dbNextPage()" ${_dbPage>=totalPages-1?'disabled':''}>&#x2192;</button>`;
        h += '</div>';
      }
      // Compare bar
      if (_dbCompare.length > 0) {
        h += `<div class="db-compare-bar">
          <span>${_dbCompare.length} ${t('filament.db_compare')}</span>
          <button class="form-btn form-btn-sm" onclick="window._dbShowCompare()">${t('filament.db_compare')}</button>
          <button class="form-btn form-btn-sm" onclick="window._dbClearCompare()">${t('filament.db_clear_compare')}</button>
        </div>`;
      }
      return h;
    }
  };

  // ═══ Tab switching ═══
  function switchTab(tabId) {
    _activeTab = tabId;
    document.querySelectorAll('.filament-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    document.querySelectorAll('.filament-tab-panel').forEach(p => {
      const isActive = p.id === `filament-tab-${tabId}`;
      p.classList.toggle('active', isActive);
      p.style.display = isActive ? (TAB_CONFIG[tabId]?.external ? 'block' : 'grid') : 'none';
      if (isActive) {
        p.classList.add('ix-tab-panel');
        p.addEventListener('animationend', () => p.classList.remove('ix-tab-panel'), { once: true });
      }
    });
    // Load external panel content into tab container
    _loadExternalTab(tabId);
    const slug = tabId === 'inventory' ? 'filament' : `filament/${tabId}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
  }

  function _loadExternalTab(tabId) {
    const cfg = TAB_CONFIG[tabId];
    if (!cfg?.external) return;
    const container = document.getElementById(`filament-tab-${tabId}`);
    if (!container) return;
    // Temporarily swap id so external panels render into our tab container
    const realBody = document.getElementById('overlay-panel-body');
    if (realBody) realBody.removeAttribute('id');
    container.id = 'overlay-panel-body';
    if (tabId === 'multicolor' && typeof loadMulticolorPanel === 'function') loadMulticolorPanel();
    container.id = `filament-tab-${tabId}`;
    if (realBody) realBody.id = 'overlay-panel-body';
  }

  // ═══ Main render ═══
  async function loadFilament(initialTab) {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    // Accept explicit tab from caller (e.g. loadFilamentPanel('forecast'))
    if (initialTab && TAB_CONFIG[initialTab]) {
      _activeTab = initialTab;
    }

    const hashFull = location.hash.replace('#', '');
    const [hashPath, hashQuery] = hashFull.split('?');
    const hashParts = hashPath.split('/');
    if (hashParts[0] === 'filament' && hashParts[1]) {
      if (hashParts[1] === 'printer' && hashParts[2]) {
        _filterPrinter = hashParts[2];
      } else if (TAB_CONFIG[hashParts[1]]) {
        _activeTab = hashParts[1];
      }
    }
    if (hashQuery) {
      const params = new URLSearchParams(hashQuery);
      if (params.has('material')) _filterMaterial = params.get('material');
      if (params.has('brand')) _filterVendor = params.get('brand');
      if (params.has('location')) _filterLocation = params.get('location');
      if (params.has('search')) _searchQuery = params.get('search');
      if (params.has('view')) _viewMode = params.get('view');
    }

    try {
      // Fetch all data in parallel
      const [spoolsRes, vendorsRes, profilesRes, locationsRes, dryingActiveRes, dryingPresetsRes, dryingStatusRes, tagsRes, alertsRes, settingsRes] = await Promise.all([
        fetch('/api/inventory/spools'),
        fetch('/api/inventory/vendors'),
        fetch('/api/inventory/filaments'),
        fetch('/api/inventory/locations'),
        fetch('/api/inventory/drying/sessions/active'),
        fetch('/api/inventory/drying/presets'),
        fetch('/api/inventory/drying/status'),
        fetch('/api/tags'),
        fetch('/api/inventory/location-alerts'),
        fetch('/api/inventory/settings')
      ]);
      _spools = await spoolsRes.json();
      _vendors = await vendorsRes.json();
      _profiles = await profilesRes.json();
      _locations = await locationsRes.json();
      _dryingSessions = await dryingActiveRes.json();
      _dryingPresets = await dryingPresetsRes.json();
      _dryingStatus = await dryingStatusRes.json();
      _tags = await tagsRes.json();
      let _locationAlerts = [];
      try { _locationAlerts = await alertsRes.json(); } catch {}
      try {
        const _invSettings = await settingsRes.json();
        _lowStockPct = parseInt(_invSettings.low_stock_threshold) || 20;
        _lowStockGrams = parseInt(_invSettings.near_empty_grams) || 0;
      } catch {}
      // Clear old drying timers
      for (const tid of Object.values(_dryingTimers)) clearInterval(tid);
      _dryingTimers = {};

      let html = '';

      // ── Top bar ──
      html += `<div class="tele-top-bar">
        ${window._can && window._can('filament') ? `<div class="inv-export-dropdown" style="display:inline-block">
          <button class="form-btn" data-ripple onclick="showAddSpoolForm()" style="display:flex;align-items:center;gap:4px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>${t('filament.add_spool')}</span>
          </button>
          <button class="form-btn form-btn-sm" data-ripple onclick="showQuickCreate(this)" style="padding:2px 4px;margin-left:-4px;border-radius:0 4px 4px 0" title="${t('filament.quick_create')}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>` : ''}
        <button class="form-btn form-btn-sm" data-ripple onclick="importFromAms()" style="display:flex;align-items:center;gap:4px" title="${t('filament.import_ams')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z"/></svg>
          <span>${t('filament.import_ams')}</span>
        </button>
        <button class="form-btn form-btn-sm" data-ripple onclick="switchFilamentTab('database')" style="display:flex;align-items:center;gap:4px" title="${t('filament.tab_database')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          <span>${t('filament.tab_database')}</span>
        </button>
        <div class="inv-export-dropdown">
          <button class="form-btn form-btn-sm" data-ripple onclick="this.nextElementSibling.classList.toggle('show')" style="display:flex;align-items:center;gap:4px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${t('filament.export')}</span>
          </button>
          <div class="inv-export-menu">
            <button onclick="exportInventory('spools','csv')">${t('filament.export_spools_csv')}</button>
            <button onclick="exportInventory('spools','json')">${t('filament.export_spools_json')}</button>
            <button onclick="exportInventory('filaments','csv')">${t('filament.export_profiles_csv')}</button>
            <button onclick="exportInventory('vendors','csv')">${t('filament.export_vendors_csv')}</button>
            <hr style="margin:4px 0;border-color:var(--border-color)">
            <button onclick="showImportDialog()">${t('filament.import')}</button>
            <hr style="margin:4px 0;border-color:var(--border-color)">
            <button onclick="showAnalyzeFileDialog()">${t('filament.analyze_file')}</button>
          </div>
        </div>
        <button class="form-btn form-btn-sm" data-ripple onclick="openQrScanner()" style="display:flex;align-items:center;gap:4px" title="${t('filament.scan_qr')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M20 14v7h-7"/></svg>
        </button>
        <div style="flex:1"></div>
        <button class="form-btn form-btn-sm" data-ripple onclick="showInventorySettings()" title="${t('filament.settings')}" style="display:flex;align-items:center;gap:4px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </button>
      </div>`;

      // ── Printer tabs ──
      const printerIds = [...new Set(_spools.map(s => s.printer_id).filter(Boolean))];
      if (printerIds.length > 1) {
        html += '<div class="tabs history-printer-tabs">';
        html += `<button class="tab-btn ${_filterPrinter === 'all' ? 'active' : ''}" onclick="filterFilamentPrinter('all')">${t('history.all_printers')}</button>`;
        for (const pid of printerIds) {
          html += `<button class="tab-btn ${_filterPrinter === pid ? 'active' : ''}" onclick="filterFilamentPrinter('${pid}')">${esc(printerName(pid))}</button>`;
        }
        html += '</div>';
      }

      // Filter spools by selected printer
      const filteredSpools = _filterPrinter === 'all'
        ? _spools : _spools.filter(s => s.printer_id === _filterPrinter);

      // ── Tab bar (sorted alphabetically, inventory first) ──
      html += '<div class="tabs">';
      for (const [id, cfg] of _getSortedTabs()) {
        html += `<button class="tab-btn filament-tab-btn ${id === _activeTab ? 'active' : ''}" data-tab="${id}" onclick="switchFilamentTab('${id}')">${t(cfg.label)}</button>`;
      }
      html += '</div>';

      // Global form container
      html += `<div id="inv-global-form" style="display:none"></div>`;

      // ── Location alerts ──
      if (_locationAlerts.length > 0 && _activeTab === 'inventory') {
        html += '<div style="margin:4px 0;padding:6px 10px;background:var(--bg-warning, rgba(255,165,0,0.1));border:1px solid var(--accent-orange, orange);border-radius:6px;font-size:0.75rem">';
        for (const a of _locationAlerts) {
          html += `<div style="padding:1px 0">&#9888; ${t('filament.location_alert_' + a.type, { location: a.location, current: a.current, threshold: a.threshold })}</div>`;
        }
        html += '</div>';
      }

      // ── Tab panels ──
      for (const [tabId, cfg] of _getSortedTabs()) {
        if (cfg.external) {
          // External tabs (multicolor) — render empty container, loaded after render
          html += `<div class="tab-panel filament-tab-panel" id="filament-tab-${tabId}" style="display:${tabId === _activeTab ? 'block' : 'none'}"></div>`;
          continue;
        }
        const order = getOrder(tabId);
        html += `<div class="tab-panel filament-tab-panel stats-tab-panel ${tabId === _activeTab ? 'active' : ''}" id="filament-tab-${tabId}" style="display:${tabId === _activeTab ? 'grid' : 'none'}">`;
        for (const modId of order) {
          const builder = BUILDERS[modId];
          if (!builder) continue;
          const content = builder(filteredSpools);
          if (!content) continue;
          const isFull = (MODULE_SIZE[modId] || 'full') === 'full';
          html += `<div class="stats-module${isFull ? ' stats-module-full' : ''}" data-module-id="${modId}">`;
          html += content;
          html += '</div>';
        }
        html += '</div>';
      }

      panel.innerHTML = html;

      // Load external tab content (multicolor) if active
      _loadExternalTab(_activeTab);

      // Update URL hash with current filters
      _updateFilterHash();

      // Attach WS listener for live updates
      if (typeof window.attachInventoryWsListener === 'function') window.attachInventoryWsListener();

      // Close export dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.inv-export-dropdown')) {
          document.querySelectorAll('.inv-export-menu.show').forEach(m => m.classList.remove('show'));
        }
      }, { once: true });
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('filament.load_failed')}</p>`;
    }
  }

  // ═══ Usage History ═══
  async function loadUsageHistory() {
    const container = document.getElementById('usage-history-container');
    if (!container) return;
    try {
      const res = await fetch('/api/inventory/usage?limit=50');
      const log = await res.json();
      if (!log || log.length === 0) {
        container.innerHTML = `<p class="text-muted text-sm">${t('filament.no_data')}</p>`;
        return;
      }
      let html = '<table class="data-table"><thead><tr><th>' + t('history.date') + '</th><th>' + t('filament.profile_name') + '</th><th>' + t('filament.usage_weight') + '</th><th>' + t('filament.usage_source') + '</th></tr></thead><tbody>';
      for (const entry of log) {
        const date = entry.timestamp ? new Date(entry.timestamp).toLocaleString(window.i18n?.getLocale?.() || 'nb') : '--';
        const src = entry.source === 'auto' ? t('filament.usage_auto') : t('filament.usage_manual');
        html += `<tr>
          <td>${date}</td>
          <td>${miniSpool(hexToRgb(entry.color_hex), 10)} ${esc(entry.profile_name || '--')} <span class="text-muted">${esc(entry.vendor_name || '')}</span></td>
          <td>${Math.round(entry.used_weight_g * 10) / 10}g</td>
          <td><span class="inv-source-badge inv-source-${entry.source}">${src}</span></td>
        </tr>`;
      }
      html += '</tbody></table>';
      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<p class="text-muted text-sm">${t('filament.load_failed')}</p>`;
    }
  }

  // ═══ Profile select builder ═══
  function buildProfileSelect(selectedId) {
    let html = `<option value="">${t('filament.add_spool_select_profile')}</option>`;
    const grouped = {};
    for (const p of _profiles) {
      const vName = p.vendor_name || '--';
      if (!grouped[vName]) grouped[vName] = [];
      grouped[vName].push(p);
    }
    for (const [vendor, profiles] of Object.entries(grouped)) {
      html += `<optgroup label="${esc(vendor)}">`;
      for (const p of profiles) {
        const sel = p.id === selectedId ? 'selected' : '';
        const colorDot = p.color_hex ? `⬤ ` : '';
        html += `<option value="${p.id}" ${sel}>${colorDot}${esc(p.name)} (${p.material})</option>`;
      }
      html += '</optgroup>';
    }
    return html;
  }

  function buildLocationSelect(selected) {
    let html = `<option value="">${t('filament.filter_all')}</option>`;
    const byParent = {};
    for (const l of _locations) (byParent[l.parent_id || 0] || (byParent[l.parent_id || 0] = [])).push(l);
    function addLevel(pid, depth) {
      for (const l of (byParent[pid] || [])) {
        const prefix = '\u00A0\u00A0'.repeat(depth);
        html += `<option value="${esc(l.name)}" ${l.name === selected ? 'selected' : ''}>${prefix}${esc(l.name)}</option>`;
        addLevel(l.id, depth + 1);
      }
    }
    addLevel(0, 0);
    return html;
  }

  function buildPrinterOptions(selectedId) {
    const state = window.printerState;
    const ids = state ? state.getPrinterIds() : [];
    let opts = `<option value="" ${!selectedId ? 'selected' : ''}>--</option>`;
    for (const id of ids) {
      opts += `<option value="${id}" ${id === selectedId ? 'selected' : ''}>${printerName(id)}</option>`;
    }
    return opts;
  }

  // ═══ Expose core helpers for sub-component files ═══
  window._filHelpers = {
    spoolPct, spoolRemainG, heroCard,
    hexToRgb, hexToRgbColor, isLightColor, printerName, fmtW, barRow, sRow,
    _buildColorStyle, buildMaterialOptions, _classifyColor, checkCompatibility,
    buildProfileSelect, buildLocationSelect, buildPrinterOptions,
    _applyFiltersExcept, _computeCascadeOptions, _hasActiveFilters,
    FILAMENT_TYPES, COLOR_FAMILIES, TYPE_COLORS, PRINTER_CAPS, ENCLOSURE_MATERIALS
  };

  // ═══ Global API ═══
  window.loadFilamentPanel = loadFilament;
  window.loadFilament = loadFilament;  // alias for sub-component files
  window.switchFilamentTab = switchTab;
  window.filterFilamentPrinter = function(printerId) {
    _filterPrinter = printerId;
    const slug = printerId === 'all' ? 'filament' : `filament/printer/${printerId}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    loadFilament();
  };
  // Filter callbacks
  window._invFilterMaterial = function(v) { _filterMaterial = v; _currentPage = 0; loadFilament(); };
  window._invFilterVendor = function(v) { _filterVendor = v; _currentPage = 0; loadFilament(); };
  window._invFilterLocation = function(v) { _filterLocation = v; _currentPage = 0; loadFilament(); };
  window._invSort = function(v) { _sortBy = v; loadFilament(); };
  window._invToggleArchived = function(v) { _showArchived = v; _currentPage = 0; loadFilament(); };
  window._invToggleFavorites = function() { _filterFavorites = !_filterFavorites; _currentPage = 0; loadFilament(); };
  window._invFilterColor = function(v) { _filterColorFamily = v; _currentPage = 0; loadFilament(); };
  window._invFilterTag = function(v) { _filterTag = v; _currentPage = 0; loadFilament(); };
  window._invFilterCategory = function(v) { _filterCategory = v; _currentPage = 0; loadFilament(); };
  window._invResetFilters = function() { _filterMaterial = ''; _filterVendor = ''; _filterLocation = ''; _filterCategory = ''; _filterTag = ''; _filterColorFamily = ''; _filterFavorites = false; _searchQuery = ''; _currentPage = 0; loadFilament(); };
  window._invViewMode = function(mode) { _viewMode = mode; localStorage.setItem('inv-view-mode', mode); loadFilament(); };

  function _updateFilterHash() {
    const params = new URLSearchParams();
    if (_filterMaterial) params.set('material', _filterMaterial);
    if (_filterVendor) params.set('brand', _filterVendor);
    if (_filterLocation) params.set('location', _filterLocation);
    if (_searchQuery) params.set('search', _searchQuery);
    if (_viewMode !== 'grid') params.set('view', _viewMode);
    const q = params.toString();
    const path = `#filament/${_activeTab}`;
    history.replaceState(null, '', q ? `${path}?${q}` : path);
  }

  window.toggleFavorite = async function(spoolId) {
    await fetch(`/api/inventory/spools/${spoolId}/favorite`, { method: 'POST' });
    const spool = _spools.find(s => s.id === spoolId);
    if (spool) spool.is_favorite = spool.is_favorite ? 0 : 1;
    loadFilament();
  };
  window._invSearch = function(v) {
    clearTimeout(_searchDebounce);
    _searchDebounce = setTimeout(() => { _searchQuery = v; _currentPage = 0; loadFilament(); }, 300);
  };
  window._invPage = function(dir) { _currentPage += dir; loadFilament(); };


  window.showAddFilamentForm = window.showAddSpoolForm;
  window.showGlobalAddFilament = window.showAddSpoolForm;
  window.deleteFilamentSpool = window.deleteSpoolItem;


})();
