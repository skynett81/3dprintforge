class StateStore {
  constructor() {
    this._printers = {};         // { printerId: state }
    this._printerMeta = {};      // { printerId: { name, model, cameraPort } }
    this._activePrinterId = null;
    this._listeners = new Map();
  }

  // Public getters used by app.js / dashboard widgets to count online
  // printers, list registered printers, etc. Without these, callers were
  // hitting `undefined` and seeing "0/N online" even with active streams.
  get printers() { return this._printers; }
  get printerMeta() { return this._printerMeta; }

  // Multi-printer methods
  setActivePrinter(id) {
    this._activePrinterId = id;
    this._notifyAll();
  }

  getActivePrinterId() {
    return this._activePrinterId;
  }

  getActivePrinterState() {
    return this._printers[this._activePrinterId] || {};
  }

  getActivePrinterMeta() {
    return this._printerMeta[this._activePrinterId] || {};
  }

  getPrinterIds() {
    const ids = new Set([...Object.keys(this._printerMeta), ...Object.keys(this._printers)]);
    return [...ids];
  }

  updatePrinter(printerId, data) {
    if (!this._printers[printerId]) this._printers[printerId] = {};
    this._printers[printerId] = this._deepMerge(this._printers[printerId], data);

    if (!this._activePrinterId) {
      this._activePrinterId = printerId;
    }

    if (printerId === this._activePrinterId) {
      // Coalesce notifications via rAF — Bambu MQTT can push 5-10 status
      // messages per second during a print, and each one previously fired
      // every wildcard subscriber (AMS panel, active filament, temperature
      // gauges, print progress, etc.) immediately. Batching to once per
      // frame caps re-renders at ~60 Hz regardless of push rate, with at
      // most 16 ms of perceived lag (well below human-noticeable).
      this._scheduleNotify();
    }
  }

  _scheduleNotify() {
    if (this._notifyScheduled) return;
    this._notifyScheduled = true;
    const fire = () => {
      this._notifyScheduled = false;
      this._notifyAll();
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(fire);
    } else {
      // Node test environment fallback — flush synchronously so unit
      // tests that exercise subscribe() still observe the callback.
      fire();
    }
  }

  setPrinterMeta(printerId, meta) {
    this._printerMeta[printerId] = meta;
  }

  replacePrinterMeta(newMeta) {
    this._printerMeta = newMeta;
  }

  removePrinter(printerId) {
    delete this._printers[printerId];
    delete this._printerMeta[printerId];
    if (this._activePrinterId === printerId) {
      const remaining = this.getPrinterIds();
      this._activePrinterId = remaining.length > 0 ? remaining[0] : null;
      this._notifyAll();
    }
  }

  // Legacy get/set for backward compat
  get(path) {
    const state = this.getActivePrinterState();
    if (!path) return state;
    const keys = path.split('.');
    let value = state;
    for (const key of keys) {
      if (value == null) return undefined;
      value = value[key];
    }
    return value;
  }

  set(path, value) {
    // For connection status etc. Routes through updatePrinter so the
    // write goes through _deepMerge (immutable copy at every level)
    // instead of mutating the live object — important when multiple
    // printers share nested object references.
    if (!this._activePrinterId) return;
    if (!path) return;
    const keys = path.split('.');
    // Build {a:{b:{c:value}}} from the path so _deepMerge can fold it in.
    const nested = keys.reduceRight((acc, key) => ({ [key]: acc }), value);
    this.updatePrinter(this._activePrinterId, nested);
  }

  subscribe(path, callback) {
    if (!this._listeners.has(path)) {
      this._listeners.set(path, new Set());
    }
    this._listeners.get(path).add(callback);
    return () => {
      const set = this._listeners.get(path);
      if (set) set.delete(callback);
    };
  }

  _notify(changedPath, value) {
    for (const [path, callbacks] of this._listeners) {
      if (changedPath.startsWith(path) || path.startsWith(changedPath) || path === '*') {
        for (const cb of callbacks) {
          cb(this.get(path), changedPath);
        }
      }
    }
  }

  _notifyAll() {
    for (const [path, callbacks] of this._listeners) {
      for (const cb of callbacks) {
        cb(this.get(path), '*');
      }
    }
  }

  _deepMerge(target, source) {
    if (!source) return target;
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
}

window.printerState = new StateStore();
