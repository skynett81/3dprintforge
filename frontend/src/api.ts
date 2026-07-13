import type { Project, Part, NewPart, Printer, Spool, Queue, QueueItem, BedHold, HistoryRow, Stats, AuthStatus, AppNotification, NotificationConfig, ReorderRow, Predictions, Supplier, PurchaseOrder } from './types';

// Thin typed client over the real 3DPrintForge REST API (proxied by Vite).
async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${body ? ` — ${body}` : ''}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  listActiveProjects: () => req<Project[]>('/api/projects?status=active'),
  listAllProjects: () => req<Project[]>('/api/projects'),
  getParts: (projectId: number) => req<Part[]>(`/api/projects/${projectId}/parts`),
  addPart: (projectId: number, body: NewPart) =>
    req<{ ok: boolean; id: number; part: Part }>(`/api/projects/${projectId}/parts`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  creditPart: (partId: number, qty?: number) =>
    req<{ ok: boolean; part: Part }>(`/api/projects/parts/${partId}/credit`, {
      method: 'POST',
      body: JSON.stringify(qty != null ? { qty } : {}),
    }),
  updatePart: (partId: number, body: Partial<Pick<Part, 'name' | 'target_qty' | 'parts_per_plate' | 'completed_qty'>>) =>
    req<{ ok: boolean; part: Part }>(`/api/projects/parts/${partId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deletePart: (partId: number) =>
    req<{ ok: boolean }>(`/api/projects/parts/${partId}`, { method: 'DELETE' }),
  createProject: (name: string) =>
    req<{ ok: boolean; id: number }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  // Fleet / inventory / queue — read-only panels over existing endpoints.
  listPrinters: (): Promise<Printer[]> => req<Printer[]>('/api/printers'),
  createPrinter: (body: Record<string, unknown>) =>
    req<{ ok: boolean; id: string }>('/api/printers', { method: 'POST', body: JSON.stringify(body) }),
  updatePrinter: (id: string, body: Record<string, unknown>) =>
    req<{ ok: boolean }>(`/api/printers/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) }),
  removePrinter: (id: string) =>
    req<{ ok: boolean }>(`/api/printers/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  listScheduled: (): Promise<import('./types').ScheduledPrint[]> => req('/api/scheduler'),
  addScheduled: (body: { title: string; filename: string; scheduled_at: string; printer_id?: string }) =>
    req<{ ok: boolean; id: number }>('/api/scheduler', { method: 'POST', body: JSON.stringify(body) }),
  deleteScheduled: (id: number) => req<{ ok: boolean }>(`/api/scheduler/${id}`, { method: 'DELETE' }),
  getMaintenanceStatus: (printerId: string): Promise<import('./types').MaintenanceStatus> =>
    req(`/api/maintenance/status?printer_id=${encodeURIComponent(printerId)}`),
  logMaintenance: (printerId: string, component: string, notes?: string) =>
    req<{ ok: boolean }>('/api/maintenance/log', {
      method: 'POST',
      body: JSON.stringify({ printer_id: printerId, component, action: 'maintenance', notes: notes || undefined }),
    }),
  getMaintenanceLog: (printerId: string, limit = 30): Promise<import('./types').MaintenanceLogEntry[]> =>
    req(`/api/maintenance/log?printer_id=${encodeURIComponent(printerId)}&limit=${limit}`),
  updateMaintSchedule: (body: { printer_id: string; component: string; interval_hours: number; label?: string }) =>
    req<{ ok: boolean }>('/api/maintenance/schedule', { method: 'PUT', body: JSON.stringify(body) }),
  getMaintCosts: (printerId: string): Promise<import('./types').MaintenanceCosts> =>
    req(`/api/wear/costs/${encodeURIComponent(printerId)}`),
  addMaintCost: (body: { printer_id: string; component: string; cost: number; description?: string }) =>
    req<{ ok: boolean; id: number }>('/api/wear/costs', { method: 'POST', body: JSON.stringify(body) }),
  changeNozzle: (body: { printer_id: string; nozzle_type: string; nozzle_diameter: number; notes?: string }) =>
    req<{ ok: boolean }>('/api/maintenance/nozzle-change', { method: 'POST', body: JSON.stringify(body) }),
  controlPrinter: (id: string, action: string, extra: Record<string, unknown> = {}) =>
    req<{ ok: boolean; action: string }>(`/api/printers/${encodeURIComponent(id)}/control`, {
      method: 'POST',
      body: JSON.stringify({ action, ...extra }),
    }),
  getSlicerStatus: () => req<import('./types').SlicerStatus>('/api/slicer/status'),
  getSlicerPrinters: () => req<import('./types').SlicerPrinter[]>('/api/slicer/printers'),
  listSlicerProfiles: (kind = 'process') => req<{ profiles: import('./types').SlicerProfile[] }>(`/api/slicer/native/profiles?kind=${encodeURIComponent(kind)}&user=1`),
  createSlicerProfile: (body: { kind: string; name: string; settings: Record<string, unknown>; is_default?: number }) =>
    req<import('./types').SlicerProfile>('/api/slicer/native/profiles', { method: 'POST', body: JSON.stringify(body) }),
  updateSlicerProfile: (id: number, body: { name?: string; settings?: Record<string, unknown>; is_default?: number }) =>
    req<import('./types').SlicerProfile>(`/api/slicer/native/profiles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSlicerProfile: (id: number) => req<{ ok: boolean }>(`/api/slicer/native/profiles/${id}`, { method: 'DELETE' }),
  downloadLibraryModel: async (id: number, name: string): Promise<File> => {
    const res = await fetch(`/api/library/${id}/download`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const buf = await res.arrayBuffer();
    return new File([buf], name, { type: 'application/octet-stream' });
  },
  sliceAndSend: async (printerId: string, file: File, opts?: { print?: boolean; settings?: Record<string, unknown> }): Promise<import('./types').SliceResult> => {
    const q = new URLSearchParams({ printerId, filename: file.name });
    if (opts?.print) q.set('print', '1');
    if (opts?.settings && Object.keys(opts.settings).length) q.set('settings', JSON.stringify(opts.settings));
    const res = await fetch(`/api/slicer/native/slice-and-send?${q.toString()}`, { method: 'POST', body: file });
    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = { error: text }; }
    if (!res.ok) throw new Error((data as { error?: string }).error || `${res.status} ${res.statusText}`);
    return data as import('./types').SliceResult;
  },
  sliceGcode: async (file: File, settings?: Record<string, unknown>): Promise<{ gcode: string; layers: number; timeSec: number; filamentG: number; wasteG: number; durationMs: number }> => {
    const q = new URLSearchParams({ filename: file.name });
    if (settings && Object.keys(settings).length) q.set('settings', JSON.stringify(settings));
    const res = await fetch(`/api/slicer/native/slice?${q.toString()}`, { method: 'POST', body: file });
    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try { const j = JSON.parse(await res.text()); msg = j.error || msg; } catch { /* keep */ }
      throw new Error(msg);
    }
    const gcode = await res.text();
    return {
      gcode,
      layers: Number(res.headers.get('X-Layer-Count') || 0),
      timeSec: Number(res.headers.get('X-Estimated-Time-Sec') || 0),
      filamentG: Number(res.headers.get('X-Filament-G') || 0),
      wasteG: Number(res.headers.get('X-Waste-G') || 0),
      durationMs: Number(res.headers.get('X-Slice-Duration-Ms') || 0),
    };
  },
  sliceMultiAndSend: async (printerId: string, filename: string, parts: { extruder: number; file: File }[], opts?: { print?: boolean; settings?: Record<string, unknown> }): Promise<import('./types').SliceResult> => {
    const toB64 = (buf: ArrayBuffer) => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s); };
    const encoded = await Promise.all(parts.map(async (p) => ({ extruder: p.extruder, stl: toB64(await p.file.arrayBuffer()) })));
    const res = await fetch('/api/slicer/native/slice-multi-and-send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ printerId, filename, print: !!opts?.print, settings: opts?.settings ?? {}, parts: encoded }),
    });
    const text = await res.text();
    let data: unknown; try { data = JSON.parse(text); } catch { data = { error: text }; }
    if (!res.ok) throw new Error((data as { error?: string }).error || `${res.status} ${res.statusText}`);
    return data as import('./types').SliceResult;
  },
  sliceObjectsAndSend: async (printerId: string, filename: string, objects: { file: File; settings: Record<string, unknown> }[], opts?: { print?: boolean; settings?: Record<string, unknown> }): Promise<import('./types').SliceResult> => {
    const toB64 = (buf: ArrayBuffer) => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s); };
    const encoded = await Promise.all(objects.map(async (o) => ({ stl: toB64(await o.file.arrayBuffer()), settings: o.settings })));
    const res = await fetch('/api/slicer/native/slice-objects-and-send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ printerId, filename, print: !!opts?.print, settings: opts?.settings ?? {}, objects: encoded }),
    });
    const text = await res.text();
    let data: unknown; try { data = JSON.parse(text); } catch { data = { error: text }; }
    if (!res.ok) throw new Error((data as { error?: string }).error || `${res.status} ${res.statusText}`);
    return data as import('./types').SliceResult;
  },
  listPrinterFiles: (id: string) => req<Array<{ name?: string } | string>>(`/api/printers/${encodeURIComponent(id)}/files`),
  printFile: (id: string, body: Record<string, unknown>) => req<{ ok: boolean }>(`/api/printers/${encodeURIComponent(id)}/files/print`, { method: 'POST', body: JSON.stringify(body) }),
  listSpools: (): Promise<Spool[]> => req<Spool[]>('/api/inventory/spools'),
  // Inventory Fase 1: generic parts, categories & physical stock.
  listPartCategories: () => req<import('./types').PartCategory[]>('/api/inventory/part-categories'),
  addPartCategory: (b: Record<string, unknown>) => req<{ id: number }>('/api/inventory/part-categories', { method: 'POST', body: JSON.stringify(b) }),
  deletePartCategory: (id: number) => req<{ ok: boolean }>(`/api/inventory/part-categories/${id}`, { method: 'DELETE' }),
  listInvParts: (q?: Record<string, string>) => req<import('./types').InvPart[]>('/api/inventory/parts' + (q && Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : '')),
  getInvPart: (id: number) => req<import('./types').InvPart>(`/api/inventory/parts/${id}`),
  addInvPart: (b: Record<string, unknown>) => req<{ id: number }>('/api/inventory/parts', { method: 'POST', body: JSON.stringify(b) }),
  updateInvPart: (id: number, b: Record<string, unknown>) => req<{ ok: boolean }>(`/api/inventory/parts/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  deleteInvPart: (id: number) => req<{ ok: boolean }>(`/api/inventory/parts/${id}`, { method: 'DELETE' }),
  listPartStock: (id: number) => req<import('./types').StockItem[]>(`/api/inventory/parts/${id}/stock`),
  listPartMoves: (id: number) => req<import('./types').StockMove[]>(`/api/inventory/parts/${id}/moves`),
  listStockItems: (q?: Record<string, string>) => req<import('./types').StockItem[]>('/api/inventory/stock-items' + (q && Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : '')),
  addStockItem: (b: Record<string, unknown>) => req<{ id: number }>('/api/inventory/stock-items', { method: 'POST', body: JSON.stringify(b) }),
  updateStockItem: (id: number, b: Record<string, unknown>) => req<{ ok: boolean }>(`/api/inventory/stock-items/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  deleteStockItem: (id: number) => req<{ ok: boolean }>(`/api/inventory/stock-items/${id}`, { method: 'DELETE' }),
  adjustStock: (id: number, delta: number, reason?: string) => req<{ id: number; quantity: number }>(`/api/inventory/stock-items/${id}/adjust`, { method: 'POST', body: JSON.stringify({ delta, reason }) }),
  moveStock: (id: number, location_id: number | null) => req<{ ok: boolean }>(`/api/inventory/stock-items/${id}/move`, { method: 'POST', body: JSON.stringify({ location_id }) }),
  assignPartQr: (id: number) => req<{ qr_uid: string }>(`/api/inventory/parts/${id}/qr`, { method: 'POST', body: '{}' }),
  resolveQr: (code: string) => req<{ type: string; id: number; name: string; hash: string }>(`/api/inventory/resolve/${encodeURIComponent(code)}`),
  qrImageUrl: (code: string) => `/api/inventory/qr/${encodeURIComponent(code)}.svg`,
  getPartBom: (id: number) => req<{ lines: import('./types').BomLine[]; cost: number }>(`/api/inventory/parts/${id}/bom`),
  addBomLine: (partId: number, b: Record<string, unknown>) => req<{ id: number }>(`/api/inventory/parts/${partId}/bom`, { method: 'POST', body: JSON.stringify(b) }),
  deleteBomLine: (id: number) => req<{ ok: boolean }>(`/api/inventory/bom-lines/${id}`, { method: 'DELETE' }),
  listBuilds: (q?: Record<string, string>) => req<import('./types').Build[]>('/api/inventory/builds' + (q && Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : '')),
  addBuild: (b: Record<string, unknown>) => req<{ id: number }>('/api/inventory/builds', { method: 'POST', body: JSON.stringify(b) }),
  completeBuild: (id: number) => req<{ produced: number; shortages: { part_name: string; needed: number; available: number }[] }>(`/api/inventory/builds/${id}/complete`, { method: 'POST', body: '{}' }),
  cancelBuild: (id: number) => req<{ ok: boolean }>(`/api/inventory/builds/${id}/cancel`, { method: 'POST', body: '{}' }),
  // Fase 4: stocktake, warranties, attachments, CSV.
  listStocktakes: () => req<import('./types').Stocktake[]>('/api/inventory/stocktakes'),
  createStocktake: (b: Record<string, unknown>) => req<{ id: number }>('/api/inventory/stocktakes', { method: 'POST', body: JSON.stringify(b) }),
  getStocktake: (id: number) => req<import('./types').Stocktake>(`/api/inventory/stocktakes/${id}`),
  setStocktakeCount: (lineId: number, counted: number | null) => req<{ ok: boolean }>(`/api/inventory/stocktake-lines/${lineId}`, { method: 'PUT', body: JSON.stringify({ counted }) }),
  applyStocktake: (id: number) => req<{ adjusted: number }>(`/api/inventory/stocktakes/${id}/apply`, { method: 'POST', body: '{}' }),
  cancelStocktake: (id: number) => req<{ ok: boolean }>(`/api/inventory/stocktakes/${id}/cancel`, { method: 'POST', body: '{}' }),
  listWarranties: (entityType: string, entityId: string) => req<import('./types').Warranty[]>(`/api/inventory/warranties?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`),
  addWarranty: (b: Record<string, unknown>) => req<{ id: number }>('/api/inventory/warranties', { method: 'POST', body: JSON.stringify(b) }),
  deleteWarranty: (id: number) => req<{ ok: boolean }>(`/api/inventory/warranties/${id}`, { method: 'DELETE' }),
  listAttachments: (entityType: string, entityId: string) => req<import('./types').Attachment[]>(`/api/inventory/attachments?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`),
  addAttachment: (b: Record<string, unknown>) => req<{ id: number }>('/api/inventory/attachments', { method: 'POST', body: JSON.stringify(b) }),
  deleteAttachment: (id: number) => req<{ ok: boolean }>(`/api/inventory/attachments/${id}`, { method: 'DELETE' }),
  importPartsCsv: (csv: string) => req<{ created: number }>('/api/inventory/parts/import', { method: 'POST', body: JSON.stringify({ csv }) }),
  exportPartsCsvUrl: () => '/api/inventory/parts/export.csv',
  listShopProducts: () => req<import('./types').ShopProduct[]>('/api/shop/products'),
  createShopProduct: (b: Record<string, unknown>) => req<import('./types').ShopProduct>('/api/shop/products', { method: 'POST', body: JSON.stringify(b) }),
  updateShopProduct: (id: number, b: Record<string, unknown>) => req<import('./types').ShopProduct>(`/api/shop/products/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  listFilaments: (): Promise<import('./types').FilamentProfile[]> => req('/api/inventory/filaments'),
  addFilament: (body: Record<string, unknown>) => req<{ id: number }>('/api/inventory/filaments', { method: 'POST', body: JSON.stringify(body) }),
  updateFilament: (id: number, body: Record<string, unknown>) => req<{ ok: boolean }>(`/api/inventory/filaments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteFilament: (id: number) => req<{ ok: boolean }>(`/api/inventory/filaments/${id}`, { method: 'DELETE' }),
  addSpool: (body: Record<string, unknown>) => req<{ id: number }>('/api/inventory/spools', { method: 'POST', body: JSON.stringify(body) }),
  listLocations: (): Promise<import('./types').StorageLocation[]> => req('/api/inventory/locations'),
  addLocation: (body: Record<string, unknown>) => req<{ id: number }>('/api/inventory/locations', { method: 'POST', body: JSON.stringify(body) }),
  updateLocation: (id: number, body: Record<string, unknown>) => req<{ ok: boolean }>(`/api/inventory/locations/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteLocation: (id: number) => req<{ ok: boolean }>(`/api/inventory/locations/${id}`, { method: 'DELETE' }),
  adjustSpoolStock: (id: number, body: { delta_g?: number; new_remaining_g?: number; reason?: string }) =>
    req<{ ok?: boolean }>(`/api/inventory/spools/${id}/adjust`, { method: 'POST', body: JSON.stringify(body) }),
  getSpoolTimeline: (id: number): Promise<import('./types').SpoolEvent[]> => req(`/api/inventory/spools/${id}/timeline`),
  getStockActivity: (): Promise<import('./types').StockMovement[]> => req('/api/inventory/stock-activity?limit=120'),
  getInventoryStats: (): Promise<import('./types').InventoryStats> => req('/api/inventory/stats'),
  listStockTargets: (): Promise<import('./types').StockTarget[]> => req('/api/inventory/stock-targets'),
  setStockTarget: (body: { material: string; min_weight_g: number; notes?: string }) =>
    req<import('./types').StockTarget>('/api/inventory/stock-targets', { method: 'POST', body: JSON.stringify(body) }),
  deleteStockTarget: (material: string) => req<{ ok: boolean }>(`/api/inventory/stock-targets/${encodeURIComponent(material)}`, { method: 'DELETE' }),
  getExpiringSpools: (within = 30): Promise<import('./types').Spool[]> => req(`/api/inventory/spools/expiring?within=${within}`),
  getDryingStatus: (): Promise<import('./types').DryingStatusRow[]> => req('/api/inventory/drying/status'),
  getReorder: (): Promise<ReorderRow[]> => req<ReorderRow[]>('/api/inventory/reorder'),
  listSuppliers: (): Promise<Supplier[]> => req<Supplier[]>('/api/inventory/suppliers'),
  addSupplier: (body: Record<string, unknown>) => req<{ id: number }>('/api/inventory/suppliers', { method: 'POST', body: JSON.stringify(body) }),
  updateSupplier: (id: number, body: Record<string, unknown>) => req<{ ok: boolean }>(`/api/inventory/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSupplier: (id: number) => req<{ ok: boolean }>(`/api/inventory/suppliers/${id}`, { method: 'DELETE' }),
  listSupplierParts: (supplierId: number): Promise<import('./types').SupplierPart[]> => req(`/api/inventory/supplier-parts?supplier_id=${supplierId}`),
  addSupplierPart: (body: Record<string, unknown>) => req<{ id: number }>('/api/inventory/supplier-parts', { method: 'POST', body: JSON.stringify(body) }),
  deleteSupplierPart: (id: number) => req<{ ok: boolean }>(`/api/inventory/supplier-parts/${id}`, { method: 'DELETE' }),
  listPurchaseOrders: (): Promise<PurchaseOrder[]> => req<PurchaseOrder[]>('/api/inventory/purchase-orders'),
  getPurchaseOrder: (id: number): Promise<PurchaseOrder> => req<PurchaseOrder>(`/api/inventory/purchase-orders/${id}`),
  createPurchaseOrder: (body: Record<string, unknown>) =>
    req<PurchaseOrder>('/api/inventory/purchase-orders', { method: 'POST', body: JSON.stringify(body) }),
  deletePurchaseOrder: (id: number) => req<{ ok: boolean }>(`/api/inventory/purchase-orders/${id}`, { method: 'DELETE' }),
  addPoLine: (poId: number, body: Record<string, unknown>) =>
    req<unknown>(`/api/inventory/purchase-orders/${poId}/lines`, { method: 'POST', body: JSON.stringify(body) }),
  deletePoLine: (lineId: number) => req<{ ok: boolean }>(`/api/inventory/purchase-order-lines/${lineId}`, { method: 'DELETE' }),
  updatePurchaseOrder: (id: number, body: { status?: string }) =>
    req<PurchaseOrder>(`/api/inventory/purchase-orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  receivePoLine: (lineId: number, qty?: number) =>
    req<unknown>(`/api/inventory/purchase-order-lines/${lineId}/receive`, { method: 'POST', body: JSON.stringify(qty != null ? { qty } : {}) }),
  getPredictions: (): Promise<Predictions> => req<Predictions>('/api/inventory/predictions'),
  updateSpool: (id: number, body: Partial<Pick<Spool, 'remaining_weight_g' | 'cost' | 'location'>>) =>
    req<{ ok: boolean }>(`/api/inventory/spools/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  bulkSpools: (action: string, spoolIds: number[], extra: Record<string, unknown> = {}) =>
    req<{ ok: boolean; count?: number }>('/api/inventory/spools/bulk', {
      method: 'POST',
      body: JSON.stringify({ action, spool_ids: spoolIds, ...extra }),
    }),
  archiveSpool: (id: number, archived = true) =>
    req<{ ok: boolean }>(`/api/inventory/spools/${id}/archive`, { method: 'PUT', body: JSON.stringify({ archived }) }),
  listQueues: (): Promise<Queue[]> => req<Queue[]>('/api/queue'),
  getQueueItems: (queueId: number) => req<QueueItem[]>(`/api/queue/${queueId}/items`),
  updateQueueItem: (itemId: number, body: Partial<Pick<QueueItem, 'copies' | 'priority' | 'status'>>) =>
    req<{ ok: boolean }>(`/api/queue/items/${itemId}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteQueueItem: (itemId: number) =>
    req<{ ok: boolean }>(`/api/queue/items/${itemId}`, { method: 'DELETE' }),
  pauseQueue: (id: number) => req<{ ok: boolean }>(`/api/queue/${id}/pause`, { method: 'POST' }),
  resumeQueue: (id: number) => req<{ ok: boolean }>(`/api/queue/${id}/resume`, { method: 'POST' }),
  confirmBed: (printerId: string) =>
    req<{ ok: boolean }>(`/api/queue/confirm-bed/${encodeURIComponent(printerId)}`, { method: 'POST' }),
  listHolds: (): Promise<BedHold[]> => req<BedHold[]>('/api/queue/holds'),
  getAuthStatus: (): Promise<AuthStatus> => req<AuthStatus>('/api/auth/status'),
  listNotifications: (): Promise<AppNotification[]> => req<AppNotification[]>('/api/notifications/log?limit=30'),
  getProtectionLog: (): Promise<import('./types').ProtectionEvent[]> => req('/api/protection/log'),
  resolveProtection: (logId: number) => req<{ ok: boolean }>('/api/protection/resolve', { method: 'POST', body: JSON.stringify({ logId }) }),
  getGuardStatus: (printerId: string): Promise<import('./types').GuardStatus> => req(`/api/protection/status?printer_id=${encodeURIComponent(printerId)}`),
  testGuard: (printerId: string, eventType?: string) => req<{ ok: boolean }>('/api/protection/test', { method: 'POST', body: JSON.stringify({ printer_id: printerId, event_type: eventType }) }),
  snoozeGuard: (printerId: string, minutes: number) => req<{ ok: boolean; snooze_until: string | null }>('/api/protection/snooze', { method: 'POST', body: JSON.stringify({ printer_id: printerId, minutes }) }),
  setGuardEnabled: (printerId: string, enabled: boolean) => req<{ ok: boolean }>('/api/protection/settings', { method: 'PUT', body: JSON.stringify({ printer_id: printerId, enabled: enabled ? 1 : 0 }) }),
  updateGuardSettings: (printerId: string, patch: Record<string, unknown>) => req<{ ok: boolean }>('/api/protection/settings', { method: 'PUT', body: JSON.stringify({ printer_id: printerId, ...patch }) }),
  setXcam: (printerId: string, field: string, enable: boolean) => req<{ ok: boolean }>(`/api/printers/${encodeURIComponent(printerId)}/control`, { method: 'POST', body: JSON.stringify({ action: 'xcam_control', field, enable }) }),
  getOpenspoolTag: (spoolId: number) => req<{ tag: Record<string, string>; preview_url: string }>(`/api/inventory/spools/${spoolId}/openspool-tag`),
  matchTigerTag: (dump: string) => req<{ parsed: import('./types').TigerTagParsed; matched_id: number | null }>(`/api/tigertag/match`, { method: 'POST', body: JSON.stringify({ dump }) }),
  matchOpenspool: (tag: unknown) => req<{ parsed: Record<string, unknown>; matched_id: number | null; matched: import('./types').Spool | null; candidates: { id: number; score: number }[] }>(`/api/openspool/match`, { method: 'POST', body: JSON.stringify({ tag }) }),
  applyOpenspool: (printerId: string, tag: unknown, amsId: number, slotId: number) => req<{ ok: boolean }>(`/api/printers/${encodeURIComponent(printerId)}/control`, { method: 'POST', body: JSON.stringify({ action: 'openspool_apply', tag, ams_id: amsId, slot_id: slotId }) }),
  getTelemetry: (printerId: string, fromIso: string, toIso: string): Promise<import('./types').TelemetryPoint[]> => req(`/api/telemetry?printer_id=${encodeURIComponent(printerId)}&from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`),
  listBackups: (): Promise<import('./types').BackupFile[]> => req('/api/backup/list'),
  createBackup: () => req<{ ok?: boolean }>('/api/backup', { method: 'POST', body: '{}' }),
  listCustomers: (): Promise<import('./types').Customer[]> => req('/api/crm/customers'),
  addCustomer: (body: { name: string; email?: string; company?: string }) =>
    req<{ ok?: boolean; id?: number }>('/api/crm/customers', { method: 'POST', body: JSON.stringify(body) }),
  updateCustomer: (id: number, body: Record<string, unknown>) =>
    req<{ ok: boolean }>(`/api/crm/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCustomer: (id: number) => req<{ ok: boolean }>(`/api/crm/customers/${id}`, { method: 'DELETE' }),
  listCrmOrders: (): Promise<import('./types').CrmOrder[]> => req('/api/crm/orders'),
  getCrmOrder: (id: number): Promise<import('./types').CrmOrder> => req(`/api/crm/orders/${id}`),
  createCrmOrder: (body: Record<string, unknown>) => req<{ ok: boolean; id: number }>('/api/crm/orders', { method: 'POST', body: JSON.stringify(body) }),
  updateCrmOrderStatus: (id: number, status: string) => req<{ ok: boolean }>(`/api/crm/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addCrmOrderItem: (orderId: number, body: Record<string, unknown>) => req<{ id: number }>(`/api/crm/orders/${orderId}/items`, { method: 'POST', body: JSON.stringify(body) }),
  createInvoiceFromOrder: (orderId: number) => req<{ ok: boolean; id?: number }>(`/api/crm/orders/${orderId}/invoice`, { method: 'POST', body: '{}' }),
  listCrmInvoices: (): Promise<import('./types').CrmInvoice[]> => req('/api/crm/invoices'),
  getSystemInfo: (): Promise<import('./types').SystemInfo> => req('/api/system/info'),
  getFirmware: (): Promise<import('./types').FirmwareInfo> => req('/api/firmware/updates'),
  listHardware: (): Promise<import('./types').HardwareItem[]> => req('/api/hardware'),
  addHardware: (body: Record<string, unknown>) => req<{ id: number }>('/api/hardware', { method: 'POST', body: JSON.stringify(body) }),
  updateHardware: (id: number, body: Record<string, unknown>) => req<{ ok: boolean }>(`/api/hardware/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteHardware: (id: number) => req<{ ok: boolean }>(`/api/hardware/${id}`, { method: 'DELETE' }),
  listLibrary: (): Promise<import('./types').LibraryFile[]> => req('/api/library'),
  deleteLibrary: (id: number) => req<{ ok: boolean }>(`/api/library/${id}`, { method: 'DELETE' }),
  updateLibrary: (id: number, body: Record<string, unknown>) => req<{ ok: boolean }>(`/api/library/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  listCheckouts: (q?: Record<string, string>) => req<import('./types').Checkout[]>('/api/inventory/checkouts' + (q && Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : '')),
  checkOut: (body: Record<string, unknown>) => req<{ id: number }>('/api/inventory/checkouts', { method: 'POST', body: JSON.stringify(body) }),
  checkIn: (id: number, notes?: string) => req<{ ok: boolean }>(`/api/inventory/checkouts/${id}/checkin`, { method: 'POST', body: JSON.stringify({ notes }) }),
  getBuildShoppingList: () => req<import('./types').BuildShoppingItem[]>('/api/inventory/build-shopping-list'),
  listKbPrinters: (): Promise<import('./types').KbPrinter[]> => req('/api/kb/printers'),
  addKbPrinter: (body: Record<string, unknown>) => req<{ id: number }>('/api/kb/printers', { method: 'POST', body: JSON.stringify(body) }),
  updateKbPrinter: (id: number, body: Record<string, unknown>) => req<{ ok: boolean }>(`/api/kb/printers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteKbPrinter: (id: number) => req<{ ok: boolean }>(`/api/kb/printers/${id}`, { method: 'DELETE' }),
  listErrors: (): Promise<import('./types').AppError[]> => req('/api/errors'),
  ackError: (id: number) => req<{ ok: boolean }>(`/api/errors/${id}`, { method: 'PATCH' }),
  ackAllErrors: () => req<{ ok: boolean }>('/api/errors/acknowledge-all', { method: 'POST', body: '{}' }),
  getHmsInfo: (code: string): Promise<import('./types').HmsInfo> => req(`/api/hms-codes/${encodeURIComponent(code)}`),
  listAchievements: (): Promise<import('./types').Achievement[]> => req('/api/achievements'),
  listActivity: (): Promise<import('./types').ActivityDay[]> => req('/api/activity/daily'),
  getNotificationConfig: (): Promise<NotificationConfig> => req<NotificationConfig>('/api/notifications/config'),
  saveNotificationConfig: (cfg: NotificationConfig) =>
    req<{ ok: boolean }>('/api/notifications/config', { method: 'PUT', body: JSON.stringify(cfg) }),
  getStatistics: (): Promise<Stats> => req<Stats>('/api/statistics'),
  getFilConsumptionByPrinter: (): Promise<import('./types').FilByPrinter[]> => req('/api/filament-analytics/consumption-by-printer'),
  getFilWeeklyTrend: (): Promise<import('./types').FilWeekly[]> => req('/api/filament-analytics/weekly-trend'),
  getFilCost: (): Promise<import('./types').FilCostRow[]> => req('/api/filament-analytics/cost'),
  getMaterialEfficiency: (): Promise<import('./types').MaterialEfficiency[]> => req('/api/filament-analytics/material-efficiency'),
  getWasteStats: (): Promise<import('./types').WasteStats> => req('/api/waste/stats'),
  getWasteHistory: (): Promise<import('./types').WasteEvent[]> => req('/api/waste/history?limit=20'),
  getCostSummary: (): Promise<import('./types').CostSummary> => req('/api/cost/summary'),
  getCostReport: (): Promise<import('./types').CostRow[]> => req('/api/cost/report'),
  listHistory: (): Promise<HistoryRow[]> => req<HistoryRow[]>('/api/history?limit=40'),
  getHistoryDetail: (
    id: number | string,
  ): Promise<HistoryRow & { filaments_used?: import('./types').FilamentUsed[]; cost?: import('./types').PrintCost | null }> =>
    req(`/api/history/${id}`),
  getCloudTasks: (): Promise<{ tasks?: import('./types').CloudTask[] } | import('./types').CloudTask[]> =>
    req('/api/bambu-cloud/tasks'),
};
