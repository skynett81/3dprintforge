import type { NotifChannel } from './types';

// The credential field whose presence means a channel is "configured".
// Masked secrets come back as "***" (non-empty), so they read as configured.
const KEY_FIELD: Record<string, string> = {
  telegram: 'botToken',
  discord: 'webhookUrl',
  email: 'user',
  webhook: 'url',
  ntfy: 'topic',
  pushover: 'apiToken',
  sms: 'accountSid',
};

export const CHANNELS = Object.keys(KEY_FIELD);

export function isChannelConfigured(name: string, ch: NotifChannel | undefined): boolean {
  if (!ch) return false;
  const field = KEY_FIELD[name];
  if (!field) return false;
  const v = ch[field];
  return typeof v === 'string' && v.trim().length > 0;
}
