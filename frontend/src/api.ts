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
  logMaintenance: (printerId: string, component: string) =>
    req<{ ok: boolean }>('/api/maintenance/log', {
      method: 'POST',
      body: JSON.stringify({ printer_id: printerId, component, action: 'maintenance' }),
    }),
  controlPrinter: (id: string, action: string, extra: Record<string, unknown> = {}) =>
    req<{ ok: boolean; action: string }>(`/api/printers/${encodeURIComponent(id)}/control`, {
      method: 'POST',
      body: JSON.stringify({ action, ...extra }),
    }),
  listSpools: (): Promise<Spool[]> => req<Spool[]>('/api/inventory/spools'),
  listFilaments: (): Promise<import('./types').FilamentProfile[]> => req('/api/inventory/filaments'),
  addFilament: (body: Record<string, unknown>) => req<{ id: number }>('/api/inventory/filaments', { method: 'POST', body: JSON.stringify(body) }),
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
  listBackups: (): Promise<import('./types').BackupFile[]> => req('/api/backup/list'),
  createBackup: () => req<{ ok?: boolean }>('/api/backup', { method: 'POST', body: '{}' }),
  listCustomers: (): Promise<import('./types').Customer[]> => req('/api/crm/customers'),
  addCustomer: (body: { name: string; email?: string; company?: string }) =>
    req<{ ok?: boolean; id?: number }>('/api/crm/customers', { method: 'POST', body: JSON.stringify(body) }),
  updateCustomer: (id: number, body: Record<string, unknown>) =>
    req<{ ok: boolean }>(`/api/crm/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCustomer: (id: number) => req<{ ok: boolean }>(`/api/crm/customers/${id}`, { method: 'DELETE' }),
  getSystemInfo: (): Promise<import('./types').SystemInfo> => req('/api/system/info'),
  getFirmware: (): Promise<import('./types').FirmwareInfo> => req('/api/firmware/updates'),
  listHardware: (): Promise<import('./types').HardwareItem[]> => req('/api/hardware'),
  addHardware: (body: Record<string, unknown>) => req<{ id: number }>('/api/hardware', { method: 'POST', body: JSON.stringify(body) }),
  deleteHardware: (id: number) => req<{ ok: boolean }>(`/api/hardware/${id}`, { method: 'DELETE' }),
  listLibrary: (): Promise<import('./types').LibraryFile[]> => req('/api/library'),
  deleteLibrary: (id: number) => req<{ ok: boolean }>(`/api/library/${id}`, { method: 'DELETE' }),
  listKbPrinters: (): Promise<import('./types').KbPrinter[]> => req('/api/kb/printers'),
  addKbPrinter: (body: Record<string, unknown>) => req<{ id: number }>('/api/kb/printers', { method: 'POST', body: JSON.stringify(body) }),
  deleteKbPrinter: (id: number) => req<{ ok: boolean }>(`/api/kb/printers/${id}`, { method: 'DELETE' }),
  listErrors: (): Promise<import('./types').AppError[]> => req('/api/errors'),
  ackError: (id: number) => req<{ ok: boolean }>(`/api/errors/${id}`, { method: 'PATCH' }),
  ackAllErrors: () => req<{ ok: boolean }>('/api/errors/acknowledge-all', { method: 'POST', body: '{}' }),
  listAchievements: (): Promise<import('./types').Achievement[]> => req('/api/achievements'),
  listActivity: (): Promise<import('./types').ActivityDay[]> => req('/api/activity/daily'),
  getNotificationConfig: (): Promise<NotificationConfig> => req<NotificationConfig>('/api/notifications/config'),
  saveNotificationConfig: (cfg: NotificationConfig) =>
    req<{ ok: boolean }>('/api/notifications/config', { method: 'PUT', body: JSON.stringify(cfg) }),
  getStatistics: (): Promise<Stats> => req<Stats>('/api/statistics'),
  getWasteStats: (): Promise<import('./types').WasteStats> => req('/api/waste/stats'),
  getWasteHistory: (): Promise<import('./types').WasteEvent[]> => req('/api/waste/history?limit=20'),
  getCostSummary: (): Promise<import('./types').CostSummary> => req('/api/cost/summary'),
  getCostReport: (): Promise<import('./types').CostRow[]> => req('/api/cost/report'),
  listHistory: (): Promise<HistoryRow[]> => req<HistoryRow[]>('/api/history?limit=40'),
};
