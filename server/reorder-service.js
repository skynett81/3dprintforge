// reorder-service.js — Fase 3.3 auto-reorder scheduler.
//
// Periodically checks the reorder shortfall and, when a material is below its
// minimum target, either drafts purchase orders or fires a notification —
// controlled by inventory settings:
//   auto_reorder_enabled        'true' | 'false'   (default off)
//   auto_reorder_mode           'notify' | 'draft' (default 'notify')
//   auto_reorder_interval_hours number as string   (default '24')
//
// The heavy lifting (and the anti-stacking dedupe) lives in runAutoReorder;
// this module is just the scheduler + notification glue.

import { runAutoReorder } from './db/reorder.js';
import { getInventorySetting } from './database.js';
import { createLogger } from './logger.js';

const log = createLogger('reorder-service');

let _timer = null;
let _notifier = null;

export function stopReorderScheduler() {
  if (_timer) { clearInterval(_timer); _timer = null; }
}

/** Run one auto-reorder check now. Exposed for tests / manual trigger. */
export async function runReorderTick() {
  if (getInventorySetting('auto_reorder_enabled') !== 'true') return { action: 'disabled' };
  const mode = getInventorySetting('auto_reorder_mode') || 'notify';
  const result = runAutoReorder({ mode });
  if (result.action === 'none') return result;

  log.info(`Auto-reorder: ${result.action} (${result.below_target} below target)`);
  if (_notifier && ['notify', 'drafted', 'none_sourced'].includes(result.action)) {
    const materials = (result.materials || []).map((m) => `${m.material} (${Math.round(m.shortfall_g)} g)`).join(', ');
    try {
      await _notifier.notify('reorder_needed', {
        action: result.action,
        count: result.below_target || 0,
        drafted: result.action === 'drafted' ? (result.created || []).length : 0,
        materials,
        unsourced: (result.unsourced || []).join(', '),
      });
    } catch (e) { log.warn('Auto-reorder notification failed: ' + e.message); }
  }
  return result;
}

export function startReorderScheduler({ notifier } = {}) {
  stopReorderScheduler();
  _notifier = notifier || null;

  const hours = Math.max(1, parseFloat(getInventorySetting('auto_reorder_interval_hours') || '24') || 24);
  const intervalMs = hours * 60 * 60 * 1000;

  const tick = () => { runReorderTick().catch((e) => log.warn('Auto-reorder tick failed: ' + e.message)); };

  // First run 5 minutes after startup so boot isn't blocked, then on interval.
  const initial = setTimeout(tick, 5 * 60 * 1000);
  if (initial.unref) initial.unref();
  _timer = setInterval(tick, intervalMs);
  if (_timer.unref) _timer.unref();

  log.info(`Auto-reorder scheduler started (every ${hours}h)`);
}
