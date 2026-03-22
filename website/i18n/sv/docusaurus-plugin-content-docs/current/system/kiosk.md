---
sidebar_position: 6
title: Kioskläge
description: Ställ in Bambu Dashboard som en väggmonterad skärm eller hubbvy med kioskläge och automatisk rotation
---

# Kioskläge

Kioskläget är utformat för väggmonterade skärmar, TV-apparater eller dedikerade monitorer som kontinuerligt visar skrivarstatus — utan tangentbord, musinteraktion eller webbläsar-UI.

Gå till: **https://localhost:3443/#settings** → **System → Kiosk**

## Vad är kioskläge

I kioskläge:
- Navigationsmenyn är dold
- Inga interaktiva kontroller är synliga
- Dashboardet uppdateras automatiskt
- Skärmen roterar mellan skrivare (om konfigurerat)
- Inaktivitets-timeout är inaktiverad

## Aktivera kioskläge via URL

Lägg till `?kiosk=true` i URL:en för att aktivera kioskläge utan att ändra inställningarna:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

Kioskläge inaktiveras genom att ta bort parametern eller lägga till `?kiosk=false`.

## Kioskinställningar

1. Gå till **Inställningar → System → Kiosk**
2. Konfigurera:

| Inställning | Standardvärde | Beskrivning |
|---|---|---|
| Standardvy | Flottan | Vilken sida som visas |
| Rotationsintervall | 30 sekunder | Tid per skrivare i rotation |
| Rotationsläge | Enbart aktiva | Rotera endast bland aktiva skrivare |
| Tema | Mörkt | Rekommenderat för skärmar |
| Textstorlek | Stor | Läsbar på avstånd |
| Klockvisning | Av | Visa klocka i hörnet |

## Flottvyn för kiosk

Flottan är optimerad för kiosk:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parametrar för flottvyn:
- `cols=N` — antal kolumner (1–6)
- `size=small|medium|large` — kortstorlek

## Enkeltskrivar-rotation

För rotation mellan enskilda skrivare (en skrivare i taget):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — aktivera rotation
- `interval=N` — sekunder per skrivare

## Installation på Raspberry Pi / NUC

För dedikerad kioskhårdvara:

### Chromium i kioskläge (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Lägg in kommandot i autostart (`~/.config/autostart/bambu-kiosk.desktop`).

### Automatisk inloggning och uppstart

1. Konfigurera automatisk inloggning i operativsystemet
2. Skapa en autostart-post för Chromium
3. Inaktivera skärmsläckare och energisparläge:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Dedikerat användarkonto
Skapa ett dedikerat Bambu Dashboard-användarkonto med **Gäst**-roll för kioskenhetens. Då har enheten enbart läsbehörighet och kan inte ändra inställningar även om någon får tillgång till skärmen.
:::

## Hubb-inställningar

Hubbläget visar en översiktssida med alla skrivare och nyckelstatistik — utformat för stora TV-apparater:

```
https://localhost:3443/#hub?kiosk=true
```

Hubbvyn inkluderar:
- Skrivarrutnät med status
- Aggregerade nyckeltal (aktiva utskrifter, totalt förlopp)
- Klocka och datum
- Senaste HMS-aviseringar
