import { describe, it, expect } from 'vitest';
import { countUnread, maxId } from './notify';
import type { AppNotification } from './types';

const n = (id: number): AppNotification => ({
  id, timestamp: '', event_type: 'x', channel: 'discord', title: 't', message: 'm', status: 'sent',
});

describe('notify', () => {
  it('countUnread counts notifications newer than lastSeen', () => {
    expect(countUnread([n(1), n(2), n(3)], 1)).toBe(2);
    expect(countUnread([n(1), n(2), n(3)], 3)).toBe(0);
    expect(countUnread([], 0)).toBe(0);
  });
  it('maxId returns the highest id', () => {
    expect(maxId([n(4), n(9), n(2)])).toBe(9);
    expect(maxId([])).toBe(0);
  });
});
