import type { Project, Part, NewPart, Printer, Spool, Queue, BedHold, HistoryRow, Stats } from './types';

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
  deletePart: (partId: number) =>
    req<{ ok: boolean }>(`/api/projects/parts/${partId}`, { method: 'DELETE' }),
  createProject: (name: string) =>
    req<{ ok: boolean; id: number }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  // Fleet / inventory / queue — read-only panels over existing endpoints.
  listPrinters: (): Promise<Printer[]> => req<Printer[]>('/api/printers'),
  listSpools: (): Promise<Spool[]> => req<Spool[]>('/api/inventory/spools'),
  listQueues: (): Promise<Queue[]> => req<Queue[]>('/api/queue'),
  listHolds: (): Promise<BedHold[]> => req<BedHold[]>('/api/queue/holds'),
  getStatistics: (): Promise<Stats> => req<Stats>('/api/statistics'),
  listHistory: (): Promise<HistoryRow[]> => req<HistoryRow[]>('/api/history?limit=40'),
};
