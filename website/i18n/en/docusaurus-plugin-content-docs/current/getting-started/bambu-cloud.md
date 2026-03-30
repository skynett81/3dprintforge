---
sidebar_position: 3
title: Bambu Cloud Integration
description: Connect the dashboard to Bambu Lab Cloud for synchronization of models and print history
---

# Bambu Cloud Integration

Bambu Dashboard can connect to **Bambu Lab Cloud** to fetch model images, print history, and filament data. The dashboard works perfectly without a cloud connection, but cloud integration provides additional benefits.

## Benefits of cloud integration

| Feature | Without cloud | With cloud |
|---------|--------------|-----------|
| Live printer status | Yes | Yes |
| Print history (local) | Yes | Yes |
| Model images from MakerWorld | No | Yes |
| Filament profiles from Bambu | No | Yes |
| Print history sync | No | Yes |
| AMS filament from cloud | No | Yes |

## Connecting to Bambu Cloud

1. Go to **Settings → Bambu Cloud**
2. Enter your Bambu Lab email and password
3. Click **Log in**
4. Choose which data should be synchronized

:::warning Privacy
Your username and password are not stored in plain text. The dashboard uses Bambu Lab's API to fetch an OAuth token that is stored locally. Your data never leaves your server.
:::

## Synchronization

### Model images

When cloud is connected, model images are automatically fetched from **MakerWorld** and displayed in:
- Print history
- Dashboard (during active print)
- 3D model viewer

### Print history

Cloud sync imports print history from the Bambu Lab app. Duplicates are filtered automatically based on timestamp and serial number.

### Filament profiles

Bambu Lab's official filament profiles are synchronized and shown in the filament inventory. You can use these as a starting point for your own profiles.

## What works without cloud?

All core features work without a cloud connection:

- Direct MQTT connection to printer over LAN
- Live status, temperature, camera
- Local print history and statistics
- Filament inventory (manually managed)
- Notifications and scheduler

:::tip LAN-only mode
Want to use the dashboard completely without an internet connection? It works great in an isolated network — just connect to the printer via IP and leave the cloud integration off.
:::

## Troubleshooting

**Login fails:**
- Check that the email and password are correct for the Bambu Lab app
- Check whether the account uses two-factor authentication (not yet supported)
- Try logging out and back in

**Synchronization stops:**
- The token may have expired — log out and back in under Settings
- Check the internet connection from your server
