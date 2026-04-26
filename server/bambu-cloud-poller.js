// Periodically polls Bambu Cloud HTTP API for printer queue/online status
// and broadcasts deltas via the WebSocket hub. Complements MQTT (which carries
// the live print/AMS stream) — useful when LAN MQTT is unreachable but the
// account is signed in to cloud.

import { createLogger } from './logger.js';

const log = createLogger('cloud-poller');

export class BambuCloudPoller {
  constructor(bambuCloud, manager, hub, intervalMs = 30_000) {
    this.bambuCloud = bambuCloud;
    this.manager = manager;
    this.hub = hub;
    this.intervalMs = intervalMs;
    this.timer = null;
    this._lastSeenSerials = new Set();
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this._poll().catch(e => log.warn('poll failed: ' + e.message));
    }, this.intervalMs);
    log.info(`Started (every ${this.intervalMs / 1000}s)`);
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  async _poll() {
    if (!this.bambuCloud?.isAuthenticated?.()) return;

    let cloudList;
    try {
      cloudList = await this.bambuCloud.getPrinters();
    } catch (e) {
      log.warn('Cloud printer list fetch failed: ' + e.message);
      return;
    }
    if (!Array.isArray(cloudList) || !cloudList.length) return;

    const bySerial = new Map(cloudList.map(d => [d.serial, d]));

    for (const id of this.manager.getPrinterIds()) {
      const entry = this.manager.printers.get(id);
      const conf = entry?.config;
      if (!conf?.serial) continue;
      const cloud = bySerial.get(conf.serial);
      if (!cloud) continue;

      // Only emit a synthetic update when MQTT is offline — otherwise we'd
      // race with live data.
      if (entry.live && entry.client?.connected) continue;

      this.hub.broadcast('cloud-status', {
        printerId: id,
        serial: conf.serial,
        name: cloud.name,
        model: cloud.model,
        source: 'bambu-cloud',
        timestamp: Date.now(),
      }, id);
    }
  }
}
