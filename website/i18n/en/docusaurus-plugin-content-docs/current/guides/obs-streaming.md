---
sidebar_position: 10
title: Streaming with OBS
description: Set up 3DPrintForge as an overlay in OBS Studio for professional 3D print streaming
---

# Streaming 3D printing to OBS

3DPrintForge has a built-in OBS overlay that shows printer status, progress, temperatures, and camera feed directly in your stream.

## Prerequisites

- OBS Studio installed ([obsproject.com](https://obsproject.com))
- 3DPrintForge running and connected to a printer
- (Optional) Bambu camera enabled for live feed

## Step 1 — OBS Browser Source

OBS has a built-in **Browser Source** that displays a web page directly in your scene.

**Add overlay in OBS:**

1. Open OBS Studio
2. Under **Sources**, click **+**
3. Select **Browser**
4. Give the source a name, e.g. "Bambu Overlay"
5. Fill in:

| Setting | Value |
|---------|-------|
| URL | `http://localhost:3000/obs/overlay` |
| Width | `1920` |
| Height | `1080` |
| FPS | `30` |
| Custom CSS | See below |

6. Check **Control audio via OBS**
7. Click **OK**

:::info Adjust URL to your server
Is the dashboard running on a different machine than OBS? Replace `localhost` with the server's IP address, e.g. `http://192.168.1.50:3000/obs/overlay`
:::

## Step 2 — Transparent background

For the overlay to blend into the image, the background must be transparent:

**In the OBS Browser Source settings:**
- Check **Shutdown source when not visible / Remove background**

**Custom CSS to force transparency:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Paste this into the **Custom CSS** field in the Browser Source settings.

The overlay now shows only the widget itself — without a white or black background.

## Step 3 — Customizing the overlay

In 3DPrintForge you can configure what the overlay shows:

1. Go to **Features → OBS overlay**
2. Configure:

| Setting | Options |
|---------|---------|
| Position | Top left, top right, bottom left, bottom right |
| Size | Small, medium, large |
| Theme | Dark, light, transparent |
| Accent color | Choose a color that fits your stream's style |
| Elements | Choose what is shown (see below) |

**Available overlay elements:**

- Printer name and status (online/printing/error)
- Progress bar with percentage and time remaining
- Filament and color
- Nozzle temperature and plate temperature
- Filament used (grams)
- AMS overview (compact)
- Print Guard status

3. Click **Preview** to see the result without switching to OBS
4. Click **Save**

:::tip URL per printer
Have multiple printers? Use separate overlay URLs:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Camera feed in OBS (separate source)

The Bambu camera can be added as a separate source in OBS — independent of the overlay:

**Option 1: Via the dashboard's camera proxy**

1. Go to **System → Camera**
2. Copy the **RTSP or MJPEG streaming URL**
3. In OBS: Click **+** → **Media Source**
4. Paste the URL
5. Check **Loop** and disable local files

**Option 2: Browser Source with camera view**

1. In OBS: Add **Browser Source**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Width/height: matches the camera's resolution (1080p or 720p)

You can now place the camera feed freely in the scene and put the overlay on top.

## Tips for a good stream

### Scene setup for streaming

A typical scene for 3D print streaming:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Camera feed from the printer]     │
│                                         │
│  ┌──────────────────┐                   │
│  │ Bambu Overlay    │  ← Bottom left    │
│  │ Print: Logo.3mf  │                   │
│  │ ████████░░ 82%   │                   │
│  │ 1h 24m left      │                   │
│  │ 220°C / 60°C     │                   │
│  └──────────────────┘                   │
└─────────────────────────────────────────┘
```

### Recommended settings

| Parameter | Recommended value |
|-----------|------------------|
| Overlay size | Medium (not too dominant) |
| Refresh rate | 30 FPS (matches OBS) |
| Overlay position | Bottom left (avoids face/chat) |
| Color theme | Dark with blue accent |

### Scenes and scene switching

Create your own OBS scenes:

- **"Print in progress"** — camera view + overlay
- **"Pause / waiting"** — static image + overlay
- **"Finished"** — result image + overlay showing "Completed"

Switch between scenes with keyboard shortcuts in OBS or via Scene Collection.

### Camera image stabilization

The Bambu camera can sometimes freeze. In the dashboard under **System → Camera**:
- Enable **Auto-reconnect** — the dashboard reconnects automatically
- Set **Reconnect interval** to 10 seconds

### Audio

3D printers make noise — especially the AMS and cooling fans. Consider:
- Place the microphone away from the printer
- Add a noise filter on the microphone in OBS (Noise Suppression)
- Or use background music / chat audio instead

:::tip Automatic scene switching
OBS has built-in support for scene switching based on window titles. Combine with a plugin (e.g. obs-websocket) and the 3DPrintForge API to switch scenes automatically when a print starts and stops.
:::
