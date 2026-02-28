import { getProtectionSettings, upsertProtectionSettings, addProtectionLog, getProtectionLog, resolveProtectionAlert, getActiveAlerts } from './database.js';
import { buildPauseCommand, buildStopCommand } from './mqtt-commands.js';

const ACTION_MAP = {
  spaghetti_detected: 'spaghetti_action',
  first_layer_issue: 'first_layer_action',
  foreign_object: 'foreign_object_action',
  nozzle_clump: 'nozzle_clump_action'
};

export class PrintGuardService {
  constructor(printerManager, notifier, broadcast) {
    this.pm = printerManager;
    this.notifier = notifier;
    this.broadcast = broadcast;
    this._cooldowns = new Map(); // printerId:eventType → timestamp
  }

  handleEvent(printerId, eventType, printId) {
    try {
      const settings = getProtectionSettings(printerId);
      if (!settings || !settings.enabled) return;

      const actionKey = ACTION_MAP[eventType];
      if (!actionKey) return;

      const action = settings[actionKey] || 'notify';
      if (action === 'ignore') return;

      // Check cooldown
      const cooldownKey = `${printerId}:${eventType}`;
      const now = Date.now();
      const lastTime = this._cooldowns.get(cooldownKey) || 0;
      if (now - lastTime < (settings.cooldown_seconds || 60) * 1000) return;
      this._cooldowns.set(cooldownKey, now);

      // Execute action
      if (action === 'pause') {
        this._pausePrint(printerId);
      } else if (action === 'stop') {
        this._stopPrint(printerId);
      }

      // Log
      addProtectionLog({
        printer_id: printerId,
        event_type: eventType,
        action_taken: action,
        print_id: printId || null
      });

      // Broadcast to frontend
      this.broadcast('protection_alert', {
        printerId,
        eventType,
        action,
        timestamp: new Date().toISOString()
      });

      // Send notification
      if (this.notifier) {
        const printer = this.pm.printers.get(printerId);
        const printerName = printer?.config?.name || printerId;
        const labels = {
          spaghetti_detected: 'Spaghetti detected',
          first_layer_issue: 'First layer issue',
          foreign_object: 'Foreign object detected',
          nozzle_clump: 'Nozzle clump detected'
        };
        const actionLabels = { notify: 'Notify only', pause: 'Print paused', stop: 'Print stopped' };
        this.notifier.notify('protection_alert', {
          printerName,
          printer_id: printerId,
          eventType: labels[eventType] || eventType,
          action: actionLabels[action] || action
        });
      }
    } catch (e) {
      console.error('[guard] Error handling event:', e.message);
    }
  }

  _pausePrint(printerId) {
    const printer = this.pm.printers.get(printerId);
    if (!printer?.live || !printer.client) return;
    const cmd = buildPauseCommand();
    printer.client.sendCommand(cmd);
    console.log(`[guard] Paused print on ${printerId}`);
  }

  _stopPrint(printerId) {
    const printer = this.pm.printers.get(printerId);
    if (!printer?.live || !printer.client) return;
    const cmd = buildStopCommand();
    printer.client.sendCommand(cmd);
    console.log(`[guard] Stopped print on ${printerId}`);
  }

  getStatus(printerId) {
    const settings = getProtectionSettings(printerId);
    const alerts = getActiveAlerts(printerId);
    return { settings, alerts };
  }

  resolve(logId) {
    resolveProtectionAlert(logId);
    this.broadcast('protection_resolved', { logId });
  }

  getSettings(printerId) {
    return getProtectionSettings(printerId);
  }

  updateSettings(printerId, settings) {
    upsertProtectionSettings(printerId, settings);
  }

  getLog(printerId, limit) {
    return getProtectionLog(printerId, limit);
  }

  getAllActiveAlerts() {
    return getActiveAlerts(null);
  }
}
