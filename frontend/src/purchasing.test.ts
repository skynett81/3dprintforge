import { describe, it, expect } from 'vitest';
import { poReceivedPct, lineRemaining } from './purchasing';

describe('purchasing', () => {
  it('poReceivedPct', () => {
    expect(poReceivedPct({ total_qty: 16, received_qty: 4 })).toBe(25);
    expect(poReceivedPct({ total_qty: 0, received_qty: 0 })).toBe(0);
    expect(poReceivedPct({ total_qty: 10, received_qty: 20 })).toBe(100);
  });
  it('lineRemaining never goes negative', () => {
    expect(lineRemaining({ quantity: 10, qty_received: 3 })).toBe(7);
    expect(lineRemaining({ quantity: 10, qty_received: 12 })).toBe(0);
  });
});
