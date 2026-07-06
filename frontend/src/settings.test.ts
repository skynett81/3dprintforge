import { describe, it, expect } from 'vitest';
import { isChannelConfigured, CHANNELS } from './settings';

describe('isChannelConfigured', () => {
  it('true when the key field has a value (incl. masked ***)', () => {
    expect(isChannelConfigured('telegram', { botToken: '123', chatId: 'x' })).toBe(true);
    expect(isChannelConfigured('telegram', { botToken: '***' })).toBe(true);
    expect(isChannelConfigured('discord', { webhookUrl: 'https://…' })).toBe(true);
  });
  it('false when empty / missing / unknown channel', () => {
    expect(isChannelConfigured('telegram', { botToken: '' })).toBe(false);
    expect(isChannelConfigured('telegram', undefined)).toBe(false);
    expect(isChannelConfigured('nope', { botToken: 'x' })).toBe(false);
  });
  it('knows the seven channels', () => {
    expect(CHANNELS).toEqual(['telegram', 'discord', 'email', 'webhook', 'ntfy', 'pushover', 'sms']);
  });
});
