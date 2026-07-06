import type { AppNotification } from './types';

const KEY = 'v2.notifications.lastSeenId';

export function getLastSeen(): number {
  const v = Number(localStorage.getItem(KEY));
  return Number.isFinite(v) ? v : 0;
}

export function setLastSeen(id: number): void {
  localStorage.setItem(KEY, String(id));
}

// Notifications are unread when their id is newer than the last one the user
// has seen. Pure so it can be unit-tested without the DOM.
export function countUnread(notifs: AppNotification[], lastSeenId: number): number {
  return notifs.filter((n) => n.id > lastSeenId).length;
}

export function maxId(notifs: AppNotification[]): number {
  return notifs.reduce((m, n) => Math.max(m, n.id), 0);
}
