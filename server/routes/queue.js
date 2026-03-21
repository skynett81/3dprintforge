// routes/queue.js — Print Queue CRUD, pause/resume, items, batch, reorder, dispatch
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  createQueue, getQueues, getQueue, updateQueue, deleteQueue,
  addQueueItem, getQueueItem, updateQueueItem, deleteQueueItem,
  reorderQueueItems, getActiveQueueItems, addQueueLog, getQueueLog, getNextPendingItem,
  getSlicerJobByFilename
} from '../database.js';
import { sendJson, readBody } from '../api-helpers.js';
import { validate } from '../validate.js';

// ---- Validation Schemas ----
const QUEUE_CREATE_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

const QUEUE_UPDATE_SCHEMA = {
  name: { type: 'string', minLength: 1, maxLength: 200 }
};

const QUEUE_ITEM_SCHEMA = {
  filename: { type: 'string', required: true, minLength: 1, maxLength: 500 }
};

const QUEUE_ITEM_UPDATE_SCHEMA = {
  status: { type: 'string', enum: ['pending', 'printing', 'completed', 'failed', 'skipped'] },
  priority: { type: 'number', min: 0, max: 100 }
};

const MULTI_START_SCHEMA = {
  filename: { type: 'string', required: true, minLength: 1, maxLength: 500 }
};

export async function handleQueueRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- Print Queue ----
  if (method === 'GET' && path === '/api/queue') {
    const status = url.searchParams.get('status') || null;
    sendJson(res, getQueues(status));
    return true;
  }

  if (method === 'POST' && path === '/api/queue') {
    return readBody(req, (b) => {
      const vr = validate(QUEUE_CREATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const id = createQueue(b);
      addQueueLog(id, null, null, 'queue_created', b.name);
      if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed' });
      sendJson(res, { ok: true, id }, 201);
    }), true;
  }

  const queueMatch = path.match(/^\/api\/queue\/(\d+)$/);
  if (queueMatch) {
    const queueId = parseInt(queueMatch[1]);
    if (method === 'GET') {
      const queue = getQueue(queueId);
      if (!queue) return sendJson(res, { error: 'Not found' }, 404), true;
      sendJson(res, queue);
      return true;
    }
    if (method === 'PUT') {
      return readBody(req, (b) => {
        const vr = validate(QUEUE_UPDATE_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        updateQueue(queueId, b);
        if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
        sendJson(res, { ok: true });
      }), true;
    }
    if (method === 'DELETE') {
      deleteQueue(queueId);
      if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
      sendJson(res, { ok: true });
      return true;
    }
  }

  const queuePauseMatch = path.match(/^\/api\/queue\/(\d+)\/pause$/);
  if (queuePauseMatch && method === 'POST') {
    const queueId = parseInt(queuePauseMatch[1]);
    updateQueue(queueId, { status: 'paused' });
    addQueueLog(queueId, null, null, 'queue_paused', null);
    if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
    sendJson(res, { ok: true });
    return true;
  }

  const queueResumeMatch = path.match(/^\/api\/queue\/(\d+)\/resume$/);
  if (queueResumeMatch && method === 'POST') {
    const queueId = parseInt(queueResumeMatch[1]);
    updateQueue(queueId, { status: 'active' });
    addQueueLog(queueId, null, null, 'queue_resumed', null);
    if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
    sendJson(res, { ok: true });
    return true;
  }

  const queueItemsMatch = path.match(/^\/api\/queue\/(\d+)\/items$/);
  if (queueItemsMatch) {
    const queueId = parseInt(queueItemsMatch[1]);
    if (method === 'GET') {
      const queue = getQueue(queueId);
      if (!queue) return sendJson(res, { error: 'Not found' }, 404), true;
      sendJson(res, queue.items || []);
      return true;
    }
    if (method === 'POST') {
      return readBody(req, (b) => {
        const vr = validate(QUEUE_ITEM_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        // Auto-fyll estimater fra slicer_jobs hvis ikke oppgitt
        if (!b.estimated_filament_g || !b.estimated_duration_s) {
          const slicerJob = getSlicerJobByFilename(b.filename);
          if (slicerJob) {
            if (!b.estimated_filament_g && slicerJob.estimated_filament_g) b.estimated_filament_g = slicerJob.estimated_filament_g;
            if (!b.estimated_duration_s && slicerJob.estimated_time_s) b.estimated_duration_s = slicerJob.estimated_time_s;
          }
        }
        const id = addQueueItem(queueId, b);
        addQueueLog(queueId, id, null, 'item_added', b.filename);
        if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
        sendJson(res, { ok: true, id }, 201);
      }), true;
    }
  }

  const queueBatchAddMatch = path.match(/^\/api\/queue\/(\d+)\/batch-add$/);
  if (queueBatchAddMatch && method === 'POST') {
    const queueId = parseInt(queueBatchAddMatch[1]);
    return readBody(req, (b) => {
      const items = b.items || [];
      const ids = [];
      for (const item of items) {
        if (!item.filename) continue;
        const id = addQueueItem(queueId, item);
        addQueueLog(queueId, id, null, 'item_added', item.filename);
        ids.push(id);
      }
      if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
      sendJson(res, { ok: true, ids }, 201);
    }), true;
  }

  const queueReorderMatch = path.match(/^\/api\/queue\/(\d+)\/reorder$/);
  if (queueReorderMatch && method === 'POST') {
    const queueId = parseInt(queueReorderMatch[1]);
    return readBody(req, (b) => {
      if (!Array.isArray(b.item_ids)) return sendJson(res, { error: 'item_ids array required' }, 400);
      reorderQueueItems(queueId, b.item_ids);
      if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
      sendJson(res, { ok: true });
    }), true;
  }

  const queueMultiStartMatch = path.match(/^\/api\/queue\/(\d+)\/multi-start$/);
  if (queueMultiStartMatch && method === 'POST') {
    const queueId = parseInt(queueMultiStartMatch[1]);
    return readBody(req, (b) => {
      const vr = validate(MULTI_START_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      const printerIds = b.printer_ids || [];
      const filename = b.filename;
      if (printerIds.length === 0) return sendJson(res, { error: 'printer_ids required' }, 400);
      const ids = [];
      for (let i = 0; i < printerIds.length; i++) {
        const id = addQueueItem(queueId, { filename, printer_id: printerIds[i], priority: b.priority || 0, sort_order: i + 1 });
        addQueueLog(queueId, id, printerIds[i], 'item_added', `Multi-print: ${filename}`);
        ids.push(id);
      }
      if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId });
      sendJson(res, { ok: true, ids }, 201);
    }), true;
  }

  const itemMatch = path.match(/^\/api\/queue\/items\/(\d+)$/);
  if (itemMatch) {
    const itemId = parseInt(itemMatch[1]);
    if (method === 'PUT') {
      return readBody(req, (b) => {
        const vr = validate(QUEUE_ITEM_UPDATE_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        updateQueueItem(itemId, b);
        const item = getQueueItem(itemId);
        if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId: item?.queue_id });
        sendJson(res, { ok: true });
      }), true;
    }
    if (method === 'DELETE') {
      const item = getQueueItem(itemId);
      deleteQueueItem(itemId);
      if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId: item?.queue_id });
      sendJson(res, { ok: true });
      return true;
    }
  }

  const itemSkipMatch = path.match(/^\/api\/queue\/items\/(\d+)\/skip$/);
  if (itemSkipMatch && method === 'POST') {
    const itemId = parseInt(itemSkipMatch[1]);
    const item = getQueueItem(itemId);
    if (item) {
      updateQueueItem(itemId, { status: 'skipped', completed_at: new Date().toISOString() });
      addQueueLog(item.queue_id, itemId, null, 'item_skipped', null);
      if (ctx.broadcast) ctx.broadcast('queue_update', { action: 'queue_changed', queueId: item.queue_id });
    }
    sendJson(res, { ok: true });
    return true;
  }

  if (method === 'GET' && path === '/api/queue/log') {
    const queueId = url.searchParams.get('queue_id') ? parseInt(url.searchParams.get('queue_id')) : null;
    const limit = parseInt(url.searchParams.get('limit') || '50');
    sendJson(res, getQueueLog(queueId, limit));
    return true;
  }

  if (method === 'GET' && path === '/api/queue/active') {
    sendJson(res, getActiveQueueItems());
    return true;
  }

  if (method === 'POST' && path === '/api/queue/dispatch') {
    if (ctx.queueManager) ctx.queueManager.forceDispatch();
    sendJson(res, { ok: true });
    return true;
  }

  return false;
}
