---
sidebar_position: 10
title: Compatibiliteitsmatrix
description: Compleet overzicht van materiaalcompatibiliteit met Bambu Lab-platen, printers en nozzles
---

# Compatibiliteitsmatrix

Deze pagina biedt een compleet overzicht van welke materialen werken met welke bouwplaten, printers en nozzletypes. Gebruik de tabellen als referentie bij het plannen van prints met nieuwe materialen.

---

## Materialen en bouwplaten

| Materiaal | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Lijmstift |
|-----------|-----------|-------------------|-----------------|--------------|----------|
| PLA | Uitstekend | Goed | Niet aanbevolen | Goed | Nee |
| PLA+ | Uitstekend | Goed | Niet aanbevolen | Goed | Nee |
| PLA-CF | Uitstekend | Goed | Niet aanbevolen | Goed | Nee |
| PLA Silk | Uitstekend | Goed | Niet aanbevolen | Goed | Nee |
| PETG | Slecht | Uitstekend | Goed | Goed | Ja (Cool) |
| PETG-CF | Slecht | Uitstekend | Goed | Acceptabel | Ja (Cool) |
| ABS | Niet aanbevolen | Uitstekend | Goed | Acceptabel | Ja (HT) |
| ASA | Niet aanbevolen | Uitstekend | Goed | Acceptabel | Ja (HT) |
| TPU | Goed | Goed | Niet aanbevolen | Uitstekend | Nee |
| PA (Nylon) | Niet aanbevolen | Uitstekend | Goed | Slecht | Ja |
| PA-CF | Niet aanbevolen | Uitstekend | Goed | Slecht | Ja |
| PA-GF | Niet aanbevolen | Uitstekend | Goed | Slecht | Ja |
| PC | Niet aanbevolen | Acceptabel | Uitstekend | Niet aanbevolen | Ja (Eng) |
| PC-CF | Niet aanbevolen | Acceptabel | Uitstekend | Niet aanbevolen | Ja (Eng) |
| PVA | Uitstekend | Goed | Niet aanbevolen | Goed | Nee |
| HIPS | Niet aanbevolen | Goed | Goed | Acceptabel | Nee |
| PVB | Goed | Goed | Niet aanbevolen | Goed | Nee |

**Verklaring:**
- **Uitstekend** — werkt optimaal, aanbevolen combinatie
- **Goed** — werkt goed, acceptabel alternatief
- **Acceptabel** — werkt, maar niet ideaal — vereist extra maatregelen
- **Slecht** — kan werken met aanpassingen, maar niet aanbevolen
- **Niet aanbevolen** — slechte resultaten of risico op schade aan de plaat

:::tip PETG en Cool Plate
PETG hecht **te goed** op Cool Plate (Smooth PEI) en kan de PEI-coating losscheuren bij het verwijderen van het onderdeel. Gebruik altijd lijmstift als scheidingsfilm, of kies Engineering Plate.
:::

:::warning PC en plaatkeuze
PC vereist High Temp Plate vanwege de hoge bedtemperaturen (100–120 °C). Andere platen kunnen permanent vervormen bij deze temperaturen.
:::

---

## Materialen en printers

| Materiaal | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|-----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA+ | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| PETG | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PETG-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| ABS | Nee | Nee | Mogelijk** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| ASA | Nee | Nee | Mogelijk** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| TPU | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PA (Nylon) | Nee | Nee | Nee | Mogelijk** | Mogelijk** | Ja | Ja | Ja | Ja | Ja |
| PA-CF | Nee | Nee | Nee | Nee | Nee | Ja | Ja | Mogelijk** | Mogelijk** | Mogelijk** |
| PA-GF | Nee | Nee | Nee | Nee | Nee | Ja | Ja | Mogelijk** | Mogelijk** | Mogelijk** |
| PC | Nee | Nee | Nee | Mogelijk** | Nee | Ja | Ja | Mogelijk** | Mogelijk** | Mogelijk** |
| PC-CF | Nee | Nee | Nee | Nee | Nee | Ja | Ja | Nee | Nee | Nee |
| PVA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| HIPS | Nee | Nee | Mogelijk** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |

**Verklaring:**
- **Ja** — volledig ondersteund en aanbevolen
- **Ja*** — vereist geharde stalen nozzle (HS01 of equivalent)
- **Mogelijk**** — kan werken met beperkingen, niet officieel aanbevolen
- **Nee** — niet geschikt (ontbreekt behuizing, te lage temperaturen, enz.)

:::danger Behuizingsvereisten
Materialen die een behuizing vereisen (ABS, ASA, PA, PC):
- **A1 en A1 Mini** hebben een open frame — niet geschikt
- **P1P** heeft een open frame — vereist behuizingsaccessoire
- **P1S** heeft een behuizing, maar geen actieve kamerverwarming
- **X1C en X1E** hebben een volledige behuizing met actieve verwarming — aanbevolen voor veeleisende materialen
:::

---

## Materialen en nozzletypes

| Materiaal | Messing (standaard) | Gehard staal (HS01) | Hardened Steel |
|-----------|--------------------|--------------------|----------------|
| PLA | Uitstekend | Uitstekend | Uitstekend |
| PLA+ | Uitstekend | Uitstekend | Uitstekend |
| PLA-CF | Niet gebruiken | Uitstekend | Uitstekend |
| PLA Silk | Uitstekend | Uitstekend | Uitstekend |
| PETG | Uitstekend | Uitstekend | Uitstekend |
| PETG-CF | Niet gebruiken | Uitstekend | Uitstekend |
| ABS | Uitstekend | Uitstekend | Uitstekend |
| ASA | Uitstekend | Uitstekend | Uitstekend |
| TPU | Uitstekend | Goed | Goed |
| PA (Nylon) | Goed | Uitstekend | Uitstekend |
| PA-CF | Niet gebruiken | Uitstekend | Uitstekend |
| PA-GF | Niet gebruiken | Uitstekend | Uitstekend |
| PC | Goed | Uitstekend | Uitstekend |
| PC-CF | Niet gebruiken | Uitstekend | Uitstekend |
| PVA | Uitstekend | Goed | Goed |
| HIPS | Uitstekend | Uitstekend | Uitstekend |
| PVB | Uitstekend | Goed | Goed |

:::danger Koolstofvezel en glasvezel vereisen geharde nozzle
Alle materialen met **-CF** (koolstofvezel) of **-GF** (glasvezel) **vereisen een geharde stalen nozzle**. Messing slijt in uren tot dagen met deze materialen. Bambu Lab HS01 wordt aanbevolen.

Materialen die een geharde nozzle vereisen:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Messing vs gehard staal voor gewone materialen
Messing nozzle biedt **betere warmtegeleiding** en dus gelijkmatigere extrusie voor gewone materialen (PLA, PETG, ABS). Gehard staal werkt prima, maar kan 5–10 °C hogere temperatuur vereisen. Gebruik messing voor dagelijks gebruik en wissel naar gehard staal voor CF/GF-materialen.
:::

---

## Tips voor materiaalwissels

Bij het wisselen tussen materialen in AMS of handmatig is correct purgen belangrijk om verontreiniging te voorkomen.

### Aanbevolen purgehoeveelheid

| Van → Naar | Purgehoeveelheid | Opmerking |
|-----------|-----------------|----------|
| PLA → PLA (andere kleur) | 100–150 mm³ | Standaard kleurwissel |
| PLA → PETG | 200–300 mm³ | Temperatuurverhoging, ander debiet |
| PETG → PLA | 200–300 mm³ | Temperatuurverlaging |
| ABS → PLA | 300–400 mm³ | Groot temperatuurverschil |
| PLA → ABS | 300–400 mm³ | Groot temperatuurverschil |
| PA → PLA | 400–500 mm³ | Nylon blijft achter in hotend |
| PC → PLA | 400–500 mm³ | PC vereist grondig purgen |
| Donker → Licht | 200–300 mm³ | Donker pigment is moeilijk te spoelen |
| Licht → Donker | 100–150 mm³ | Makkelijkere overgang |

### Temperatuurwijziging bij materiaalwissel

| Overgang | Aanbeveling |
|----------|-----------|
| Koud → Warm (bijv. PLA → ABS) | Opwarmen naar nieuw materiaal, grondig purgen |
| Warm → Koud (bijv. ABS → PLA) | Eerst purgen bij hoge temp, dan verlagen |
| Vergelijkbare temperaturen (bijv. PLA → PLA) | Standaard purge |
| Groot verschil (bijv. PLA → PC) | Tussenstop met PETG kan helpen |

:::warning Nylon en PC laten residu achter
PA (Nylon) en PC zijn bijzonder moeilijk te purgen. Na gebruik van deze materialen:
1. Purge met **PETG** of **ABS** bij hoge temperatuur (260–280 °C)
2. Voer minimaal **500 mm³** purgemateriaal door
3. Inspecteer de extrusie visueel — deze moet volledig schoon zijn zonder verkleuring
:::

---

## Snelreferentie — materiaalkeuze

Weet je niet welk materiaal je nodig hebt? Gebruik deze gids:

| Behoefte | Aanbevolen materiaal |
|----------|---------------------|
| Prototyping / dagelijks gebruik | PLA |
| Mechanische sterkte | PETG, PLA Tough |
| Buitengebruik | ASA |
| Warmtebestendigheid | ABS, ASA, PC |
| Flexibele onderdelen | TPU |
| Maximale sterkte | PA-CF, PC-CF |
| Transparant | PETG (naturel), PC (naturel) |
| Esthetiek / decoratie | PLA Silk, PLA Sparkle |
| Snap-fit / levende scharnieren | PETG, PA |
| Voedselcontact | PLA (met voorbehoud) |
