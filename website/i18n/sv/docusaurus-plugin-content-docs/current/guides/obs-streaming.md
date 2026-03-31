---
sidebar_position: 10
title: Strömma med OBS
description: Ställ in 3DPrintForge som overlay i OBS Studio för professionell 3D-utskriftsströmning
---

# Strömma 3D-utskrift till OBS

3DPrintForge har ett inbyggt OBS-overlay som visar skrivarstatus, förlopp, temperaturer och kameraflöde direkt i din ström.

## Förutsättningar

- OBS Studio installerat ([obsproject.com](https://obsproject.com))
- 3DPrintForge körs och är anslutet till skrivare
- (Valfritt) Bambu-kameran aktiverad för direktsändning

## Steg 1 — OBS Browser Source

OBS har en inbyggd **Browser Source** som visar en webbsida direkt i din scen.

**Lägg till overlay i OBS:**

1. Öppna OBS Studio
2. Under **Källor** (Sources), klicka på **+**
3. Välj **Webbläsare** (Browser)
4. Ge källan ett namn, t.ex. "Bambu Overlay"
5. Fyll i:

| Inställning | Värde |
|-------------|-------|
| URL | `http://localhost:3000/obs/overlay` |
| Bredd | `1920` |
| Höjd | `1080` |
| FPS | `30` |
| Anpassad CSS | Se nedan |

6. Bocka för **Kontrollera ljud via OBS**
7. Klicka på **OK**

:::info Anpassa URL till din server
Körs instrumentpanelen på en annan maskin än OBS? Byt ut `localhost` mot serverns IP-adress, t.ex. `http://192.168.1.50:3000/obs/overlay`
:::

## Steg 2 — Transparent bakgrund

För att overlayet ska smälta in i bilden måste bakgrunden vara genomskinlig:

**I OBS Browser Source-inställningarna:**
- Bocka för **Ta bort bakgrund** (Shutdown source when not visible / Remove background)

**Anpassad CSS för att tvinga genomskinlighet:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Klistra in detta i fältet **Anpassad CSS** i Browser Source-inställningarna.

Overlayet visar nu bara själva widgeten — utan vit eller svart bakgrund.

## Steg 3 — Anpassa overlayet

I 3DPrintForge kan du konfigurera vad overlayet visar:

1. Gå till **Funktioner → OBS-overlay**
2. Konfigurera:

| Inställning | Alternativ |
|-------------|-----------|
| Position | Övre vänster, höger, nedre vänster, höger |
| Storlek | Liten, medium, stor |
| Tema | Mörkt, ljust, genomskinligt |
| Accentfärg | Välj färg som passar strömmens stil |
| Element | Välj vad som visas (se nedan) |

**Tillgängliga overlay-element:**

- Skrivarnamn och status (online/skriver ut/fel)
- Förloppslinje med procent och tid kvar
- Filament och färg
- Munstyckstemperatur och platttemperatur
- Filament använt (gram)
- AMS-översikt (kompakt)
- Print Guard-status

3. Klicka på **Förhandsgranska** för att se resultatet utan att byta till OBS
4. Klicka på **Spara**

:::tip URL per skrivare
Har du flera skrivare? Använd separata overlay-URL:er:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Kameraflöde i OBS (separat källa)

Bambu-kameran kan läggas till som en separat källa i OBS — oberoende av overlayet:

**Alternativ 1: Via instrumentpanelens kamera-proxy**

1. Gå till **System → Kamera**
2. Kopiera **RTSP- eller MJPEG-strömmens URL**
3. I OBS: Klicka på **+** → **Mediakälla** (Media Source)
4. Klistra in URL:en
5. Bocka för **Repetera** (Loop) och inaktivera lokala filer

**Alternativ 2: Browser Source med kameravy**

1. I OBS: Lägg till **Browser Source**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Bredd/höjd: matchar kamerans upplösning (1080p eller 720p)

Du kan nu placera kameraflödet fritt i scenen och lägga overlayet ovanpå.

## Tips för bra ström

### Upplägg för strömscen

En typisk scen för 3D-utskriftsströmning:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Kameraflöde från skrivaren]       │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Nedre vänster │
│  │ Utskrift: Logo   │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1t 24m kvar      │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Rekommenderade inställningar

| Parameter | Rekommenderat värde |
|-----------|---------------------|
| Overlaystorlek | Medium (inte för dominant) |
| Uppdateringsfrekvens | 30 FPS (matchar OBS) |
| Overlayposition | Nedre vänster (undviker ansikte/chatt) |
| Färgtema | Mörkt med blå accent |

### Scener och scenbyte

Skapa egna OBS-scener:

- **"Utskrift pågår"** — kameravy + overlay
- **"Paus / väntar"** — statisk bild + overlay
- **"Klart"** — resultatbild + overlay som visar "Slutförd"

Byt mellan scener med tangentbordsgenväg i OBS eller via Scene Collection.

### Stabilisering av kamerabild

Bambu-kameran kan ibland frysa. I instrumentpanelen under **System → Kamera**:
- Aktivera **Auto-återanslutning** — instrumentpanelen ansluter automatiskt igen
- Ange **Återanslutningsintervall** till 10 sekunder

### Ljud

3D-skrivare låter — särskilt AMS och kylning. Överväg:
- Placera mikrofon långt från skrivaren
- Lägg till brusfilter på mikrofonen i OBS (Noise Suppression)
- Eller använd bakgrundsmusik / chatt-ljud istället

:::tip Automatiskt scenbyte
OBS har inbyggt stöd för scenbyte baserat på titlar. Kombinera med ett plugin (t.ex. obs-websocket) och 3DPrintForge API för att byta scen automatiskt när utskrift startar och slutar.
:::
