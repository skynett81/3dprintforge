---
sidebar_position: 10
title: Streaming mit OBS
description: Bambu Dashboard als Overlay in OBS Studio einrichten für professionelles 3D-Druck-Streaming
---

# 3D-Druck mit OBS streamen

Bambu Dashboard hat ein eingebautes OBS-Overlay, das Druckerstatus, Fortschritt, Temperaturen und Kamera-Feed direkt in Ihrem Stream anzeigt.

## Voraussetzungen

- OBS Studio installiert ([obsproject.com](https://obsproject.com))
- Bambu Dashboard läuft und ist mit dem Drucker verbunden
- (Optional) Bambu-Kamera für Live-Feed aktiviert

## Schritt 1 — OBS Browser Source

OBS hat eine eingebaute **Browser Source**, die eine Webseite direkt in Ihrer Szene anzeigt.

**Overlay zu OBS hinzufügen:**

1. OBS Studio öffnen
2. Unter **Quellen** (Sources) auf **+** klicken
3. **Browser** wählen
4. Der Quelle einen Namen geben, z. B. „Bambu Overlay"
5. Ausfüllen:

| Einstellung | Wert |
|-------------|------|
| URL | `http://localhost:3000/obs/overlay` |
| Breite | `1920` |
| Höhe | `1080` |
| FPS | `30` |
| Benutzerdefiniertes CSS | Siehe unten |

6. **Audio über OBS steuern** anhaken
7. Auf **OK** klicken

:::info URL an Ihren Server anpassen
Läuft das Dashboard auf einem anderen Rechner als OBS? Ersetzen Sie `localhost` durch die IP-Adresse des Servers, z. B. `http://192.168.1.50:3000/obs/overlay`
:::

## Schritt 2 — Transparenter Hintergrund

Damit sich das Overlay ins Bild einfügt, muss der Hintergrund transparent sein:

**In den OBS Browser Source-Einstellungen:**
- **Hintergrund entfernen** anhaken (Shutdown source when not visible / Remove background)

**Benutzerdefiniertes CSS, um Transparenz zu erzwingen:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Dies in das Feld **Benutzerdefiniertes CSS** in den Browser Source-Einstellungen einfügen.

Das Overlay zeigt nun nur das Widget selbst — ohne weißen oder schwarzen Hintergrund.

## Schritt 3 — Overlay anpassen

Im Bambu Dashboard können Sie konfigurieren, was das Overlay anzeigt:

1. Gehen Sie zu **Funktionen → OBS-Overlay**
2. Konfigurieren:

| Einstellung | Optionen |
|-------------|----------|
| Position | Oben links, rechts, unten links, rechts |
| Größe | Klein, mittel, groß |
| Theme | Dunkel, hell, transparent |
| Akzentfarbe | Farbe passend zum Stream-Stil wählen |
| Elemente | Auswählen, was angezeigt wird (siehe unten) |

**Verfügbare Overlay-Elemente:**

- Druckername und Status (online/druckt/Fehler)
- Fortschrittsbalken mit Prozentsatz und Restzeit
- Filament und Farbe
- Düsentemperatur und Plattentemperatur
- Verbrauchtes Filament (Gramm)
- AMS-Übersicht (kompakt)
- Print Guard-Status

3. Auf **Vorschau** klicken, um das Ergebnis zu sehen, ohne zu OBS wechseln zu müssen
4. Auf **Speichern** klicken

:::tip URL pro Drucker
Haben Sie mehrere Drucker? Separate Overlay-URLs verwenden:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Kamera-Feed in OBS (separate Quelle)

Das Bambu-Kamera kann als separate Quelle in OBS hinzugefügt werden — unabhängig vom Overlay:

**Alternative 1: Über den Kamera-Proxy des Dashboards**

1. Gehen Sie zu **System → Kamera**
2. **RTSP- oder MJPEG-Streaming-URL** kopieren
3. In OBS: **+** → **Medienquelle** (Media Source) klicken
4. URL einfügen
5. **Wiederholen** (Loop) anhaken und lokale Dateien deaktivieren

**Alternative 2: Browser Source mit Kameraansicht**

1. In OBS: **Browser Source** hinzufügen
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Breite/Höhe: der Kameraauflösung entsprechend (1080p oder 720p)

Sie können den Kamera-Feed nun frei in der Szene platzieren und das Overlay darüber legen.

## Tipps für einen guten Stream

### Aufbau einer Stream-Szene

Eine typische Szene für 3D-Druck-Streaming:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Kamera-Feed des Druckers]         │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Unten links   │
│  │ Druck: Logo.3mf  │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1h 24m übrig     │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Empfohlene Einstellungen

| Parameter | Empfohlener Wert |
|-----------|-----------------|
| Overlay-Größe | Mittel (nicht zu dominant) |
| Aktualisierungsrate | 30 FPS (entspricht OBS) |
| Overlay-Position | Unten links (vermeidet Gesicht/Chat) |
| Farbtheme | Dunkel mit blauer Akzentfarbe |

### Szenen und Szenenwechsel

Eigene OBS-Szenen erstellen:

- **„Druck läuft"** — Kameraansicht + Overlay
- **„Pause / Warten"** — Standbild + Overlay
- **„Fertig"** — Ergebnisbild + Overlay, das „Abgeschlossen" anzeigt

Zwischen Szenen mit Tastaturkürzel in OBS oder über die Szenenkollektion wechseln.

### Kamerabild stabilisieren

Das Bambu-Kamera kann manchmal einfrieren. Im Dashboard unter **System → Kamera**:
- **Auto-Reconnect** aktivieren — das Dashboard verbindet sich automatisch wieder
- **Reconnect-Intervall** auf 10 Sekunden einstellen

### Ton

3D-Drucker machen Geräusche — besonders AMS und Kühlung. Erwägen Sie:
- Mikrofon vom Drucker entfernt aufstellen
- Geräuschfilter auf das Mikrofon in OBS anwenden (Rauschunterdrückung)
- Oder Hintergrundmusik / Chat-Ton verwenden

:::tip Automatischer Szenenwechsel
OBS hat eingebaute Unterstützung für Szenenwechsel basierend auf Titeln. Mit einem Plugin (z. B. obs-websocket) und der Bambu Dashboard API kombinieren, um die Szene automatisch zu wechseln, wenn der Druck startet und endet.
:::
