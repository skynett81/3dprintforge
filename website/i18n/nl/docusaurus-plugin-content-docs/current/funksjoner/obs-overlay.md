---
sidebar_position: 4
title: OBS-overlay
description: Voeg een transparante statusoverlay voor uw Bambu Lab-printer toe direct in OBS Studio
---

# OBS-overlay

De OBS-overlay laat u de realtime status van de printer direct in OBS Studio weergeven — perfect voor livestreaming of het opnemen van 3D-printing.

## Overlay-URL

De overlay is beschikbaar als een webpagina met transparante achtergrond:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Vervang `PRINTER_ID` door de ID van de printer (te vinden onder **Instellingen → Printers**).

### Beschikbare parameters

| Parameter | Standaardwaarde | Beschrijving |
|---|---|---|
| `printer` | eerste printer | Printer-ID om te tonen |
| `theme` | `dark` | `dark`, `light` of `minimal` |
| `scale` | `1.0` | Schaling (0,5–2,0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Transparantie (0,0–1,0) |
| `fields` | alle | Kommagescheiden lijst: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Accentkleur (hex) |

**Voorbeeld met parameters:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Installatie in OBS Studio

### Stap 1: Browserbron toevoegen

1. Open OBS Studio
2. Klik op **+** onder **Bronnen**
3. Selecteer **Browser** (Browser Source)
4. Geef de bron een naam, bijv. `Bambu Overlay`
5. Klik op **OK**

### Stap 2: De browserbron configureren

Vul het volgende in het instellingsdialoogvenster in:

| Veld | Waarde |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=UW_ID` |
| Breedte | `400` |
| Hoogte | `200` |
| FPS | `30` |
| Aangepaste CSS | *(leeg laten)* |

Vink aan:
- ✅ **Bron uitschakelen wanneer niet zichtbaar**
- ✅ **Browser vernieuwen wanneer scène wordt geactiveerd**

:::warning HTTPS en localhost
OBS kan waarschuwen over een zelfondertekend certificaat. Ga eerst naar `https://localhost:3443` in Chrome/Firefox en accepteer het certificaat. OBS gebruikt dan dezelfde acceptatie.
:::

### Stap 3: Transparante achtergrond

De overlay is gebouwd met `background: transparent`. Opdat dit werkt in OBS:

1. Vink **geen** **Aangepaste achtergrondkleur** aan in de browserbron
2. Zorg ervoor dat de overlay niet is verpakt in een ondoorzichtig element
3. Stel indien gewenst de **Mengmodus** in op **Normaal** op de bron in OBS

:::tip Alternatief: Chroma key
Als transparantie niet werkt, gebruik dan filter → **Chroma Key** met groene achtergrond:
Voeg `&bg=green` toe aan de URL en stel een chroma key-filter in op de bron in OBS.
:::

## Wat wordt weergegeven in de overlay

De standaardoverlay bevat:

- **Voortgangsbalk** met percentagewaarde
- **Resterende tijd** (geschat)
- **Spuitmondtemperatuur** en **bedtemperatuur**
- **Actief AMS-spoor** met filamentkleur en naam
- **Printermodel** en naam (kan worden uitgeschakeld)

## Minimale modus voor streaming

Voor een discrete overlay tijdens het streamen:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Dit toont alleen een kleine voortgangsbalk met resterende tijd in de hoek.
