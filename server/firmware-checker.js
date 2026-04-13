/**
 * Firmware Checker Service
 *
 * Periodically checks firmware updates across all configured printers.
 * Supports: Bambu Lab, Moonraker/Klipper, PrusaLink, OctoPrint, Snapmaker,
 *           AnkerMake (best-effort).
 *
 * Features:
 * - Initial check 60s after startup (gives printers time to connect)
 * - Periodic check every 24 hours
 * - Manual check via API
 * - Results stored in firmware_history table with update_available flag
 * - Broadcasts to WebSocket clients on status change
 * - Triggers notifications when new updates are detected
 */

import { setFirmwareUpdateStatus, getAvailableFirmwareUpdates, getFirmwareStatus } from './db/telemetry.js';
import { createLogger } from './logger.js';

const log = createLogger('firmware-check');

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const INITIAL_DELAY_MS = 60 * 1000; // 60 seconds after startup
const BETWEEN_PRINTERS_MS = 2000; // 2s pause between printers to avoid hammering

export class FirmwareChecker {
  constructor({ printerManager, hub, notifier }) {
    this.printerManager = printerManager;
    this.hub = hub;
    this.notifier = notifier;
    this._timer = null;
    this._initialTimer = null;
    this._checkInProgress = false;
    this._lastCheckAt = null;
    this._notifiedUpdates = new Set(); // prevent duplicate notifications
  }

  start() {
    // Initial check after startup delay
    this._initialTimer = setTimeout(() => {
      this.checkAll().catch(e => log.error('Initial check failed: ' + e.message));
    }, INITIAL_DELAY_MS);

    // Periodic check every 24 hours
    this._timer = setInterval(() => {
      this.checkAll().catch(e => log.error('Scheduled check failed: ' + e.message));
    }, CHECK_INTERVAL_MS);

    log.info(`Firmware checker started — initial check in ${INITIAL_DELAY_MS / 1000}s, then every ${CHECK_INTERVAL_MS / 3600000}h`);
  }

  shutdown() {
    if (this._initialTimer) { clearTimeout(this._initialTimer); this._initialTimer = null; }
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }

  async checkAll() {
    if (this._checkInProgress) {
      log.warn('Check already in progress, skipping');
      return { skipped: true };
    }
    this._checkInProgress = true;
    this._lastCheckAt = new Date().toISOString();

    const results = [];
    try {
      const printerIds = this.printerManager.getPrinterIds?.() || [];
      log.info(`Checking firmware for ${printerIds.length} printers...`);

      for (const printerId of printerIds) {
        try {
          const result = await this.checkPrinter(printerId);
          results.push(result);
          await new Promise(r => setTimeout(r, BETWEEN_PRINTERS_MS));
        } catch (e) {
          log.error(`Check ${printerId} failed: ${e.message}`);
          results.push({ printerId, error: e.message });
        }
      }

      // Broadcast results to all clients
      if (this.hub) {
        this.hub.broadcast('firmware_check_complete', {
          lastCheckAt: this._lastCheckAt,
          updates: getAvailableFirmwareUpdates(),
          results,
        });
      }

      log.info(`Firmware check complete — ${results.filter(r => r.available).length} updates available`);
      return { ok: true, results };
    } finally {
      this._checkInProgress = false;
    }
  }

  async checkPrinter(printerId) {
    const printer = this.printerManager.printers?.get?.(printerId);
    if (!printer) return { printerId, error: 'Printer not found' };

    const client = printer.client || printer;
    if (typeof client.checkFirmwareUpdate !== 'function') {
      return { printerId, error: 'Connector does not support firmware check' };
    }

    const result = await client.checkFirmwareUpdate();

    // Store result in DB (extract module info — default to 'firmware')
    const module = 'firmware';
    const current = result.current || client.state?._info?.[0]?.sw_ver || 'unknown';
    const latest = result.latest || result.updates?.[0]?.latest || current;
    const changelog = result.releaseNotes || result.updates?.map(u => `${u.module}: ${u.current} → ${u.latest}`).join('\n') || '';

    setFirmwareUpdateStatus({
      printer_id: printerId,
      module,
      sw_ver: current,
      latest_available: latest,
      update_available: result.available || false,
      changelog: changelog.slice(0, 2000),
      release_url: result.releaseUrl || '',
    });

    // Trigger notification if this is a new update
    if (result.available && this.notifier) {
      const updateKey = `${printerId}:${latest}`;
      if (!this._notifiedUpdates.has(updateKey)) {
        this._notifiedUpdates.add(updateKey);
        const printerName = printer.name || printer.config?.name || printerId;
        try {
          await this.notifier.notify?.('firmware_update_available', {
            printerName,
            printer_id: printerId,
            current_version: current,
            latest_version: latest,
            title: `Firmware update available: ${printerName}`,
            message: `${printerName} has a firmware update available.\nCurrent: ${current}\nLatest: ${latest}`,
          });
        } catch (e) { log.warn(`Notification send failed: ${e.message}`); }
      }
    }

    return {
      printerId,
      available: result.available,
      current,
      latest,
      error: result.error || null,
    };
  }

  getStatus() {
    return {
      lastCheckAt: this._lastCheckAt,
      inProgress: this._checkInProgress,
      availableUpdates: getAvailableFirmwareUpdates(),
    };
  }

  getPrinterStatus(printerId) {
    return getFirmwareStatus(printerId);
  }
}
