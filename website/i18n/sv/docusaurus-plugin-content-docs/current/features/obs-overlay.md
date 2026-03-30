---
sidebar_position: 4
title: OBS-overlay
description: Lägg till en genomskinlig statusöverlay för din Bambu Lab-skrivare direkt i OBS Studio
---

# OBS-overlay

OBS-overlayen låter dig visa skrivarens realtidsstatus direkt i OBS Studio — perfekt för livestreaming eller inspelning av 3D-utskrift.

## Overlay-URL

Overlayen är tillgänglig som en webbsida med genomskinlig bakgrund:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Ersätt `PRINTER_ID` med skrivarens ID (finns under **Inställningar → Skrivare**).

### Tillgängliga parametrar

| Parameter | Standardvärde | Beskrivning |
|---|---|---|
| `printer` | första skrivaren | Skrivar-ID som ska visas |
| `theme` | `dark` | `dark`, `light` eller `minimal` |
| `scale` | `1.0` | Skalning (0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Genomskinlighet (0.0–1.0) |
| `fields` | alla | Kommaseparerad lista: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Accentfärg (hex) |

**Exempel med parametrar:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Inställning i OBS Studio

### Steg 1: Lägg till webbläsarkälla

1. Öppna OBS Studio
2. Klicka **+** under **Källor**
3. Välj **Webbläsare** (Browser Source)
4. Ge källan ett namn, t.ex. `Bambu Overlay`
5. Klicka **OK**

### Steg 2: Konfigurera webbläsarkällan

Fyll i följande i inställningsdialogen:

| Fält | Värde |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=DITT_ID` |
| Bredd | `400` |
| Höjd | `200` |
| FPS | `30` |
| Anpassad CSS | *(lämna tomt)* |

Bocka av för:
- ✅ **Stäng av källa när den inte är synlig**
- ✅ **Uppdatera webbläsare när scen aktiveras**

:::warning HTTPS och localhost
OBS kan varna om självgenererat certifikat. Gå till `https://localhost:3443` i Chrome/Firefox först och godkänn certifikatet. OBS använder då samma godkännande.
:::

### Steg 3: Genomskinlig bakgrund

Overlayen är byggd med `background: transparent`. För att detta ska fungera i OBS:

1. Bocka **inte** av **Anpassad bakgrundsfärg** i webbläsarkällan
2. Se till att overlayen inte är inpackad i ett ogenomskinligt element
3. Ange gärna **Blandningsläge** till **Normal** på källan i OBS

:::tip Alternativ: Chroma key
Om genomskinlighet inte fungerar, använd filter → **Chroma Key** med grön bakgrund:
Lägg till `&bg=green` i URL:en, och ange chroma key-filter på källan i OBS.
:::

## Vad visas i overlayen

Standardoverlayen innehåller:

- **Framstegsbar** med procentvärde
- **Återstående tid** (uppskattad)
- **Munstyckstemperatur** och **bäddtemperatur**
- **Aktivt AMS-spår** med filamentfärg och namn
- **Skrivarmodell** och namn (kan stängas av)

## Minimalt läge för streaming

För en diskret overlay under streaming:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Detta visar bara en liten framstegsbar med återstående tid i hörnet.
