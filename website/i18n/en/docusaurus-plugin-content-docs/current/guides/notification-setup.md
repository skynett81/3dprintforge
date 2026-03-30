---
sidebar_position: 7
title: Setting up notifications
description: Configure Telegram, Discord, email, and push notifications in Bambu Dashboard
---

# Setting up notifications

Bambu Dashboard can notify you about everything from completed prints to critical errors — via Telegram, Discord, email, or browser push notifications.

## Overview of notification channels

| Channel | Best for | Requires |
|---------|---------|---------|
| Telegram | Quick, anywhere | Telegram account + bot token |
| Discord | Team/community | Discord server + webhook URL |
| Email (SMTP) | Official notifications | SMTP server |
| Browser push | Desktop notifications | Browser with push support |

---

## Telegram bot

### Step 1 — Create the bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Give the bot a name (e.g. "Bambu Alerts")
4. Give the bot a username (e.g. `bambu_alerts_bot`) — must end in `bot`
5. BotFather replies with an **API token**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Copy and save this token

### Step 2 — Find your Chat ID

1. Start a conversation with your bot (search for the username and click **Start**)
2. Send a message to the bot (e.g. "hello")
3. Go to `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in your browser
4. Find `"chat":{"id": 123456789}` — that is your Chat ID

### Step 3 — Connect to the dashboard

1. Go to **Settings → Notifications → Telegram**
2. Paste the **Bot Token**
3. Paste the **Chat ID**
4. Click **Test notification** — you should receive a test message in Telegram
5. Click **Save**

:::tip Group notifications
Want to notify an entire group? Add the bot to a Telegram group, find the group Chat ID (a negative number, e.g. `-100123456789`) and use that instead.
:::

---

## Discord webhook

### Step 1 — Create webhook in Discord

1. Go to your Discord server
2. Right-click on the channel you want alerts in → **Edit channel**
3. Go to **Integrations → Webhooks**
4. Click **New Webhook**
5. Give it a name (e.g. "Bambu Dashboard")
6. Select an avatar (optional)
7. Click **Copy Webhook URL**

The URL looks like this:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Step 2 — Add to the dashboard

1. Go to **Settings → Notifications → Discord**
2. Paste the **Webhook URL**
3. Click **Test notification** — the Discord channel should receive a test message
4. Click **Save**

---

## Email (SMTP)

### Required information

You need the SMTP settings from your email provider:

| Provider | SMTP server | Port | Encryption |
|----------|-------------|------|------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Custom domain | smtp.yourdomain.com | 587 | TLS |

:::warning Gmail requires an app password
Gmail blocks sign-in with a regular password. You must create an **App password** under Google account → Security → 2-step verification → App passwords.
:::

### Configuration in the dashboard

1. Go to **Settings → Notifications → Email**
2. Fill in:
   - **SMTP server**: e.g. `smtp.gmail.com`
   - **Port**: `587`
   - **Username**: your email address
   - **Password**: app password or regular password
   - **From address**: the email the notification is sent from
   - **To address**: the email you want to receive notifications at
3. Click **Test email**
4. Click **Save**

---

## Browser push notifications

Push notifications appear as system notifications on the desktop — even when the browser tab is in the background.

**Enable:**
1. Go to **Settings → Notifications → Push notifications**
2. Click **Enable push notifications**
3. The browser asks for permission — click **Allow**
4. Click **Test notification**

:::info Only in the browser where you enabled it
Push notifications are tied to the specific browser and device. Enable it on each device you want notifications on.
:::

---

## Choosing which events to be notified about

After you have set up a notification channel, you can choose exactly which events trigger a notification:

**Under Settings → Notifications → Events:**

| Event | Recommended |
|-------|-------------|
| Print completed | Yes |
| Print failed / cancelled | Yes |
| Print Guard: spaghetti detected | Yes |
| HMS error (critical) | Yes |
| HMS warning | Optional |
| Filament low | Yes |
| AMS error | Yes |
| Printer disconnected | Optional |
| Maintenance reminder | Optional |
| Nightly backup completed | No (noisy) |

---

## Quiet hours (no notifications at night)

Avoid being woken up by a completed print at 03:00:

1. Go to **Settings → Notifications → Quiet hours**
2. Enable **Quiet hours**
3. Set from-time and to-time (e.g. **22:00 to 07:00**)
4. Choose which events should still notify during the quiet period:
   - **Critical HMS errors** — recommended to keep on
   - **Print Guard** — recommended to keep on
   - **Print completed** — can be turned off at night

:::tip Night printing without disturbance
Run prints at night with quiet hours enabled. Print Guard keeps watch — and you get a summary in the morning.
:::
