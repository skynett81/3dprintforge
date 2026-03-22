---
sidebar_position: 1
title: Print Guard
description: Automatische bewaking met XCam-gebeurtenisdetectie, sensorbewaking en configureerbare acties bij afwijkingen
---

# Print Guard

Print Guard is het realtime bewakingssysteem van Bambu Dashboard. Het bewaakt continu de camera, sensoren en printergegevens, en voert configureerbare acties uit wanneer er iets mis gaat.

Ga naar: **https://localhost:3443/#protection**

## XCam-gebeurtenisdetectie

Bambu Lab-printers sturen XCam-gebeurtenissen via MQTT wanneer de AI-camera problemen detecteert:

| Gebeurtenis | Code | Ernst |
|---|---|---|
| Spaghetti gedetecteerd | `xcam_spaghetti` | Kritiek |
| Bed-hechting losgelaten | `xcam_detach` | Hoog |
| Storing eerste laag | `xcam_first_layer` | Hoog |
| Stringing | `xcam_stringing` | Gemiddeld |
| Extrusieprobleem | `xcam_extrusion` | Hoog |

Voor elk type gebeurtenis kunt u één of meer acties configureren:

- **Melden** — stuur een melding via actieve meldingskanalen
- **Pauzeren** — zet de print op pauze voor handmatige controle
- **Stoppen** — breek de print onmiddellijk af
- **Geen** — negeer de gebeurtenis (maar log deze toch)

:::danger Standaardgedrag
Standaard zijn XCam-gebeurtenissen ingesteld op **Melden** en **Pauzeren**. Wijzig naar **Stoppen** als u volledig vertrouwt op AI-detectie.
:::

## Sensorbewaking

Print Guard bewaakt sensorgegevens continu en slaat alarm bij afwijkingen:

### Temperatuurafwijking

1. Ga naar **Print Guard → Temperatuur**
2. Stel **Maximale afwijking van doeltemperatuur** in (aanbevolen: ±5°C voor spuit, ±3°C voor bed)
3. Kies **Actie bij afwijking**: Melden / Pauzeren / Stoppen
4. Stel **Vertraging** (seconden) in vóór de actie — geeft de temperatuur tijd om te stabiliseren

### Filament bijna op

Het systeem berekent het resterende filament op de spoelen:

1. Ga naar **Print Guard → Filament**
2. Stel **Minimumgrens** in gram in (bijv. 50 g)
3. Kies actie: **Pauzeren en melden** (aanbevolen) om de spoel handmatig te verwisselen

### Printonderbreking detecteren

Detecteert wanneer de print onverwacht is gestopt (MQTT-timeout, filamentbreuk, e.d.):

1. Activeer **Onderbrekingsdetectie**
2. Stel **Timeout** in (aanbevolen: 120 seconden zonder data = gestopt)
3. Actie: Altijd melden — de print kan al gestopt zijn

## Configuratie

### Print Guard activeren

1. Ga naar **Instellingen → Print Guard**
2. Zet **Print Guard activeren** aan
3. Kies welke printers worden bewaakt
4. Klik **Opslaan**

### Per-printer-regels

Verschillende printers kunnen verschillende regels hebben:

1. Klik op een printer in het Print Guard-overzicht
2. Schakel **Globale regels overnemen** uit
3. Configureer eigen regels voor deze printer

## Logboek en gebeurtenisgeschiedenis

Alle Print Guard-gebeurtenissen worden vastgelegd:

- Ga naar **Print Guard → Logboek**
- Filter op printer, type gebeurtenis, datum en ernst
- Klik op een gebeurtenis voor gedetailleerde informatie en eventueel uitgevoerde acties
- Exporteer logboek naar CSV

:::tip Valse positieven
Als Print Guard onnodige pauzes veroorzaakt, pas dan de gevoeligheid aan via **Print Guard → Instellingen → Gevoeligheid**. Begin met «Laag» en verhoog geleidelijk.
:::
