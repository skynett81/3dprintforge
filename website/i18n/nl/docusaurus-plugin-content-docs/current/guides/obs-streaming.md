---
sidebar_position: 10
title: Streamen met OBS
description: Stel Bambu Dashboard in als overlay in OBS Studio voor professionele 3D-print-streaming
---

# 3D-printen streamen naar OBS

Bambu Dashboard heeft een ingebouwde OBS-overlay die printerstatus, voortgang, temperaturen en camera-feed direct in je stream weergeeft.

## Vereisten

- OBS Studio geïnstalleerd ([obsproject.com](https://obsproject.com))
- Bambu Dashboard actief en verbonden met printer
- (Optioneel) Bambu-camera geactiveerd voor live feed

## Stap 1 — OBS Browser Source

OBS heeft een ingebouwde **Browser Source** die een webpagina direct in je scène weergeeft.

**Overlay toevoegen in OBS:**

1. Open OBS Studio
2. Onder **Bronnen** (Sources), klik **+**
3. Kies **Browser**
4. Geef de bron een naam, bijv. "Bambu Overlay"
5. Vul in:

| Instelling | Waarde |
|------------|--------|
| URL | `http://localhost:3000/obs/overlay` |
| Breedte | `1920` |
| Hoogte | `1080` |
| FPS | `30` |
| Aangepaste CSS | Zie hieronder |

6. Vink **Audio beheren via OBS** aan
7. Klik **OK**

:::info Pas de URL aan voor jouw server
Draait het dashboard op een andere machine dan OBS? Vervang `localhost` door het IP-adres van de server, bijv. `http://192.168.1.50:3000/obs/overlay`
:::

## Stap 2 — Transparante achtergrond

Om de overlay in het beeld te laten opgaan, moet de achtergrond transparant zijn:

**In de OBS Browser Source-instellingen:**
- Vink **Achtergrond verwijderen** aan (Shutdown source when not visible / Remove background)

**Aangepaste CSS om transparantie te forceren:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Plak dit in het veld **Aangepaste CSS** in de Browser Source-instellingen.

De overlay toont nu alleen de widget zelf — zonder witte of zwarte achtergrond.

## Stap 3 — De overlay aanpassen

In Bambu Dashboard kun je configureren wat de overlay toont:

1. Ga naar **Functies → OBS-overlay**
2. Configureer:

| Instelling | Opties |
|------------|--------|
| Positie | Linksboven, rechtsboven, linksonder, rechtsonder |
| Grootte | Klein, medium, groot |
| Thema | Donker, licht, transparant |
| Accentkleur | Kies een kleur die past bij de stijl van je stream |
| Elementen | Kies wat wordt weergegeven (zie hieronder) |

**Beschikbare overlay-elementen:**

- Printernaam en status (online/bezig/fout)
- Voortgangsbalk met percentage en resterende tijd
- Filament en kleur
- Nozzle- en plaattemperatuur
- Verbruikt filament (gram)
- AMS-overzicht (compact)
- Print Guard-status

3. Klik **Voorbeeld** om het resultaat te bekijken zonder naar OBS te wisselen
4. Klik **Opslaan**

:::tip URL per printer
Heb je meerdere printers? Gebruik aparte overlay-URL's:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Camera-feed in OBS (aparte bron)

De Bambu-camera kan als een aparte bron in OBS worden toegevoegd — onafhankelijk van de overlay:

**Optie 1: Via de camera-proxy van het dashboard**

1. Ga naar **Systeem → Camera**
2. Kopieer de **RTSP- of MJPEG-streaming-URL**
3. In OBS: Klik **+** → **Mediabron** (Media Source)
4. Plak de URL
5. Vink **Herhalen** (Loop) aan en deactiveer lokale bestanden

**Optie 2: Browser Source met cameraweergave**

1. In OBS: Voeg een **Browser Source** toe
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Breedte/hoogte: overeenkomend met de resolutie van de camera (1080p of 720p)

Je kunt nu de camera-feed vrij in de scène plaatsen en de overlay eroverheen leggen.

## Tips voor een goede stream

### Scèneopbouw voor streaming

Een typische scène voor 3D-print-streaming:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Camera-feed van de printer]       │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Linksonder    │
│  │ Print: Logo.3mf  │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1u 24m resterend │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Aanbevolen instellingen

| Parameter | Aanbevolen waarde |
|-----------|------------------|
| Overlaygrootte | Medium (niet te dominant) |
| Vernieuwingsfrequentie | 30 FPS (komt overeen met OBS) |
| Overlaypositie | Linksonder (vermijdt gezicht/chat) |
| Kleurthema | Donker met blauwe accent |

### Scènes en scènewisseling

Maak eigen OBS-scènes:

- **"Print bezig"** — cameraweergave + overlay
- **"Pauze / wachten"** — statisch beeld + overlay
- **"Klaar"** — resultaatafbeelding + overlay met "Voltooid"

Wissel tussen scènes met een sneltoets in OBS of via de Scene Collection.

### Camerastabilisatie

De Bambu-camera kan soms bevriezen. In het dashboard onder **Systeem → Camera**:
- Activeer **Automatisch opnieuw verbinden** — het dashboard maakt automatisch opnieuw verbinding
- Stel het **Herverbindingsinterval** in op 10 seconden

### Geluid

3D-printers maken geluid — met name de AMS en koeling. Overweeg:
- Plaats de microfoon uit de buurt van de printer
- Voeg een ruisfilter toe op de microfoon in OBS (Noise Suppression)
- Of gebruik achtergrondmuziek / chataudio in plaats daarvan

:::tip Automatisch scènewisseling
OBS heeft ingebouwde ondersteuning voor scènewisseling op basis van titels. Combineer dit met een plugin (bijv. obs-websocket) en de Bambu Dashboard API om automatisch van scène te wisselen wanneer een print start en stopt.
:::
