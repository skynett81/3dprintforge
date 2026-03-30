---
sidebar_position: 4
title: OBS-Overlay
description: Fügen Sie ein transparentes Status-Overlay für Ihren Bambu Lab-Drucker direkt in OBS Studio hinzu
---

# OBS-Overlay

Das OBS-Overlay ermöglicht es Ihnen, den Echtzeitstatus des Druckers direkt in OBS Studio anzuzeigen — ideal für Livestreaming oder Aufnahmen von 3D-Drucken.

## Overlay-URL

Das Overlay ist als Webseite mit transparentem Hintergrund verfügbar:

```
https://localhost:3443/obs-overlay?printer=DRUCKER_ID
```

Ersetzen Sie `DRUCKER_ID` durch die ID des Druckers (zu finden unter **Einstellungen → Drucker**).

### Verfügbare Parameter

| Parameter | Standardwert | Beschreibung |
|---|---|---|
| `printer` | Erster Drucker | Drucker-ID, die angezeigt werden soll |
| `theme` | `dark` | `dark`, `light` oder `minimal` |
| `scale` | `1.0` | Skalierung (0,5–2,0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Transparenz (0,0–1,0) |
| `fields` | alle | Kommagetrennte Liste: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Akzentfarbe (Hex) |

**Beispiel mit Parametern:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Einrichtung in OBS Studio

### Schritt 1: Browser-Quelle hinzufügen

1. OBS Studio öffnen
2. Unter **Quellen** auf **+** klicken
3. **Browser** (Browser-Quelle) auswählen
4. Der Quelle einen Namen geben, z.B. `Bambu Overlay`
5. Auf **OK** klicken

### Schritt 2: Browser-Quelle konfigurieren

Füllen Sie im Einstellungsdialog folgendes aus:

| Feld | Wert |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=IHRE_ID` |
| Breite | `400` |
| Höhe | `200` |
| FPS | `30` |
| Benutzerdefiniertes CSS | *(leer lassen)* |

Haken Sie folgendes an:
- ✅ **Quelle deaktivieren, wenn nicht sichtbar**
- ✅ **Browser aktualisieren, wenn Szene aktiviert wird**

:::warning HTTPS und localhost
OBS kann vor einem selbst signierten Zertifikat warnen. Öffnen Sie zuerst `https://localhost:3443` in Chrome/Firefox und akzeptieren Sie das Zertifikat. OBS verwendet dann dieselbe Genehmigung.
:::

### Schritt 3: Transparenter Hintergrund

Das Overlay ist mit `background: transparent` erstellt. Damit dies in OBS funktioniert:

1. Haken Sie **keine** **benutzerdefinierte Hintergrundfarbe** in der Browser-Quelle an
2. Stellen Sie sicher, dass das Overlay nicht in ein undurchsichtiges Element eingebettet ist
3. Setzen Sie den **Mischmodus** auf **Normal** für die Quelle in OBS

:::tip Alternative: Chroma Key
Falls Transparenz nicht funktioniert, verwenden Sie Filter → **Chroma Key** mit grünem Hintergrund:
Fügen Sie `&bg=green` zur URL hinzu und setzen Sie einen Chroma-Key-Filter auf die Quelle in OBS.
:::

## Was im Overlay angezeigt wird

Das Standard-Overlay enthält:

- **Fortschrittsbalken** mit Prozentwert
- **Verbleibende Zeit** (geschätzt)
- **Düsentemperatur** und **Betttemperatur**
- **Aktiver AMS-Schacht** mit Filamentfarbe und -name
- **Druckermodell** und Name (kann deaktiviert werden)

## Minimalmodus für Streaming

Für ein dezentes Overlay beim Streaming:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Dies zeigt nur einen kleinen Fortschrittsbalken mit verbleibender Zeit in der Ecke.
