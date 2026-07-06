import type { Project, Part, NewPart, Printer, Spool, Queue, QueueItem, BedHold, HistoryRow, Stats, AuthStatus, AppNotification, NotificationConfig, ReorderRow, Predictions } from './types';

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
  controlPrinter: (id: string, action: string, extra: Record<string, unknown> = {}) =>
    req<{ ok: boolean; action: string }>(`/api/printers/${encodeURIComponent(id)}/control`, {
      method: 'POST',
      body: JSON.stringify({ action, ...extra }),
    }),
  listSpools: (): Promise<Spool[]> => req<Spool[]>('/api/inventory/spools'),
  getReorder: (): Promise<ReorderRow[]> => req<ReorderRow[]>('/api/inventory/reorder'),
  getPredictions: (): Promise<Predictions> => req<Predictions>('/api/inventory/predictions'),
  updateSpool: (id: number, body: Partial<Pick<Spool, 'remaining_weight_g' | 'cost' | 'location'>>) =>
    req<{ ok: boolean }>(`/api/inventory/spools/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
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
  getNotificationConfig: (): Promise<NotificationConfig> => req<NotificationConfig>('/api/notifications/config'),
  saveNotificationConfig: (cfg: NotificationConfig) =>
    req<{ ok: boolean }>('/api/notifications/config', { method: 'PUT', body: JSON.stringify(cfg) }),
  getStatistics: (): Promise<Stats> => req<Stats>('/api/statistics'),
  listHistory: (): Promise<HistoryRow[]> => req<HistoryRow[]>('/api/history?limit=40'),
};
