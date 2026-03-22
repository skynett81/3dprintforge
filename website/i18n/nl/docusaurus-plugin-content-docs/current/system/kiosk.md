---
sidebar_position: 6
title: Kioskmodus
description: Bambu Dashboard instellen als een wandgemonteerd scherm of hub-weergave met kioskmodus en automatische rotatie
---

# Kioskmodus

De kioskmodus is ontworpen voor wandgemonteerde schermen, tv's of speciale monitoren die continu de printerstatus weergeven — zonder toetsenbord, muisinteractie of browser-UI.

Ga naar: **https://localhost:3443/#settings** → **Systeem → Kiosk**

## Wat is kioskmodus

In kioskmodus:
- Het navigatiemenu is verborgen
- Er zijn geen interactieve bedieningselementen zichtbaar
- Het dashboard wordt automatisch vernieuwd
- Het scherm wisselt tussen printers (indien geconfigureerd)
- Inactiviteitstimeout is uitgeschakeld

## Kioskmodus activeren via URL

Voeg `?kiosk=true` toe aan de URL om kioskmodus te activeren zonder de instellingen te wijzigen:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

Kioskmodus wordt uitgeschakeld door de parameter te verwijderen of `?kiosk=false` toe te voegen.

## Kioskinstellingen

1. Ga naar **Instellingen → Systeem → Kiosk**
2. Configureer:

| Instelling | Standaardwaarde | Beschrijving |
|---|---|---|
| Standaardweergave | Vlootoverzicht | Welke pagina wordt weergegeven |
| Rotatieinterval | 30 seconden | Tijd per printer bij rotatie |
| Rotatiemodus | Alleen actief | Roteer alleen tussen actieve printers |
| Thema | Donker | Aanbevolen voor schermen |
| Lettergrootte | Groot | Leesbaar op afstand |
| Klok weergeven | Uit | Klok in hoek weergeven |

## Vlootweergave voor kiosk

Het vlootoverzicht is geoptimaliseerd voor kiosk:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parameters voor vlootweergave:
- `cols=N` — aantal kolommen (1–6)
- `size=small|medium|large` — kaartformaat

## Enkelvoudige printerrotatie

Voor rotatie tussen afzonderlijke printers (één printer tegelijk):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — rotatie activeren
- `interval=N` — seconden per printer

## Instellen op Raspberry Pi / NUC

Voor speciale kioskhardware:

### Chromium in kioskmodus (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Voeg de opdracht toe aan autostart (`~/.config/autostart/bambu-kiosk.desktop`).

### Automatisch inloggen en opstarten

1. Configureer automatisch inloggen in het besturingssysteem
2. Maak een autostart-item aan voor Chromium
3. Schakel schermbeveiliging en energiebesparing uit:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Speciale gebruikersaccount
Maak een speciale Bambu Dashboard-gebruikersaccount aan met de rol **Gast** voor het kioskapparaat. Dan heeft het apparaat alleen leestoegang en kan het geen instellingen wijzigen, ook als iemand toegang krijgt tot het scherm.
:::

## Hub-instellingen

Hub-modus toont een overzichtspagina met alle printers en kerncijfers — ontworpen voor grote tv's:

```
https://localhost:3443/#hub?kiosk=true
```

De hub-weergave omvat:
- Printergrid met status
- Geaggregeerde kerncijfers (actieve prints, totale voortgang)
- Klok en datum
- Meest recente HMS-meldingen
