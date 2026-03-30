---
sidebar_position: 6
title: Notifications
description: Configure notifications via Telegram, Discord, email, webhook, ntfy, Pushover, and SMS for all printer events
---

# Notifications

Bambu Dashboard supports notifications through a range of channels so you always know what is happening with your printers — whether you are home or on the go.

Go to: **https://localhost:3443/#settings** → the **Notifications** tab

## Available channels

| Channel | Requires | Supports images |
|---------|----------|----------------|
| Telegram | Bot token + Chat ID | ✅ |
| Discord | Webhook URL | ✅ |
| Email | SMTP server | ✅ |
| Webhook | URL + optional key | ✅ (base64) |
| ntfy | ntfy server + topic | ❌ |
| Pushover | API token + User key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Browser push | No configuration needed | ❌ |

## Setup per channel

### Telegram

1. Create a bot via [@BotFather](https://t.me/BotFather) — send `/newbot`
2. Copy the **bot token** (format: `123456789:ABC-def...`)
3. Start a conversation with the bot and send `/start`
4. Find your **Chat ID**: go to `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. In Bambu Dashboard: paste token and Chat ID, click **Test**

:::tip Group channel
You can use a Telegram group as the recipient. Chat IDs for groups start with `-`.
:::

### Discord

1. Open the Discord server you want to notify
2. Go to channel settings → **Integrations → Webhooks**
3. Click **New webhook**, give it a name and select a channel
4. Copy the webhook URL
5. Paste the URL in Bambu Dashboard and click **Test**

### Email

1. Fill in SMTP server, port (usually 587 for TLS)
2. Username and password for the SMTP account
3. **From** address and **To** address(es) (comma-separated for multiple)
4. Enable **TLS/STARTTLS** for secure sending
5. Click **Test** to send a test email

:::warning Gmail
Use an **App password** for Gmail, not your regular password. Enable 2-factor authentication in your Google account first.
:::

### ntfy

1. Create a topic on [ntfy.sh](https://ntfy.sh) or run your own ntfy server
2. Fill in the server URL (e.g. `https://ntfy.sh`) and topic name
3. Install the ntfy app on your phone and subscribe to the same topic
4. Click **Test**

### Pushover

1. Create an account at [pushover.net](https://pushover.net)
2. Create a new application — copy the **API Token**
3. Find your **User Key** on the Pushover dashboard
4. Fill in both in Bambu Dashboard and click **Test**

### Webhook (custom)

Bambu Dashboard sends an HTTP POST with a JSON payload:

```json
{
  "event": "print_complete",
  "printer": "My X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Add a **Secret key** to validate requests with an HMAC-SHA256 signature in the `X-Bambu-Signature` header.

## Event filter

Choose which events should trigger notifications per channel:

| Event | Description |
|-------|-------------|
| Print started | A new print begins |
| Print completed | Print finished (with image) |
| Print failed | Print cancelled with an error |
| Print paused | Manual or automatic pause |
| Print Guard alert | XCam or sensor triggered an action |
| Filament low | Spool nearly empty |
| AMS error | Clog, moist filament, etc. |
| Printer disconnected | MQTT connection lost |
| Queue job dispatched | Job dispatched from queue |

Check the events you want for each channel individually.

## Quiet hours

Avoid notifications at night:

1. Enable **Quiet hours** under notification settings
2. Set **From** and **To** times (e.g. 23:00 → 07:00)
3. Select the **Timezone** for the timer
4. Critical notifications (Print Guard errors) can be overridden — check **Always send critical**

## Browser push notifications

Receive notifications directly in the browser without an app:

1. Go to **Settings → Notifications → Browser Push**
2. Click **Enable push notifications**
3. Accept the permission dialog from the browser
4. Notifications work even when the dashboard is minimized (requires the tab to be open)

:::info PWA
Install Bambu Dashboard as a PWA for background push notifications without an open tab. See [PWA](../system/pwa).
:::
