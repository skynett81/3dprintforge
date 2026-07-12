import { useMemo } from 'react';
import { useResource, useLivePrinters } from './hooks';
import { readLive, isPrinting } from './live';
import { api } from './api';
import type { Printer, Queue, ReorderRow, AppError, ProtectionEvent } from './types';

export type BadgeTone = 'accent' | 'blue' | 'red';
export interface NavBadge { count: number; tone: BadgeTone }
export interface FleetHealth { online: number; offline: number; total: number; printing: number; connected: boolean }
export interface SidebarLive { badges: Record<string, NavBadge>; health: FleetHealth }

function isOnline(p: Printer): boolean {
  const s = String((p as { status?: string; state?: string }).status || (p as { state?: string }).state || '').toLowerCase();
  return s === 'online' || s === 'idle' || s === 'printing' || s === 'running';
}

/**
 * Live status counters + fleet health for the sidebar, reusing the same
 * endpoints the dashboard KPIs pull from. `badges` is keyed by panel id (Fleet
 * / Guard / Queue / Errors / Supply / Purchasing); `health` drives the footer
 * connection/health chip.
 */
export function useNavBadges(): SidebarLive {
  const { data: printers } = useResource<Printer[]>(api.listPrinters, 20000);
  const { data: queues } = useResource<Queue[]>(api.listQueues, 20000);
  const { data: reorder } = useResource<ReorderRow[]>(api.getReorder, 30000);
  const { data: errors } = useResource<AppError[]>(api.listErrors, 20000);
  const { data: guard } = useResource<ProtectionEvent[]>(api.getProtectionLog, 20000);
  const { live, connected } = useLivePrinters();

  return useMemo(() => {
    const badges: Record<string, NavBadge> = {};
    const pr = printers ?? [];
    const printing = pr.filter((p) => isPrinting(readLive((live[p.id] ?? {}) as Record<string, unknown>))).length;
    if (printing > 0) badges.fleet = { count: printing, tone: 'blue' };
    const pending = (queues ?? []).reduce((a, q) => a + Math.max(0, (q.item_count ?? 0) - (q.completed_count ?? 0)), 0);
    if (pending > 0) badges.queue = { count: pending, tone: 'accent' };
    const below = (reorder ?? []).filter((r) => r.below_target).length;
    if (below > 0) { badges.supply = { count: below, tone: 'blue' }; badges.purchasing = { count: below, tone: 'blue' }; }
    const unacked = (errors ?? []).filter((e) => !e.acknowledged).length;
    if (unacked > 0) badges.errors = { count: unacked, tone: 'red' };
    const openAlerts = (guard ?? []).filter((e) => !e.resolved).length;
    if (openAlerts > 0) badges.guard = { count: openAlerts, tone: 'red' };
    const onlineCount = pr.filter(isOnline).length;
    const health: FleetHealth = { online: onlineCount, offline: pr.length - onlineCount, total: pr.length, printing, connected };
    return { badges, health };
  }, [printers, queues, reorder, errors, guard, live, connected]);
}
