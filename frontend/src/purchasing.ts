import type { PurchaseOrder, POLine } from './types';

export function poReceivedPct(po: Pick<PurchaseOrder, 'total_qty' | 'received_qty'>): number {
  if (!po.total_qty || po.total_qty <= 0) return 0;
  return Math.min(100, Math.round((po.received_qty / po.total_qty) * 100));
}

export function lineRemaining(line: Pick<POLine, 'quantity' | 'qty_received'>): number {
  return Math.max(0, line.quantity - line.qty_received);
}

export const PO_STATUSES = ['draft', 'ordered', 'received', 'cancelled'];
