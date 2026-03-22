---
sidebar_position: 4
title: Thema
description: Het uiterlijk van Bambu Dashboard aanpassen met licht/donker/auto-modus, 6 kleurpaletten en een aangepaste accentkleur
---

# Thema

Bambu Dashboard heeft een flexibel themasysteem waarmee u het uiterlijk kunt aanpassen naar uw smaak en gebruikssituatie.

Ga naar: **https://localhost:3443/#settings** → **Thema**

## Kleurmodus

Kies uit drie modi:

| Modus | Beschrijving |
|---|---|
| **Licht** | Lichte achtergrond, donkere tekst — goed in goed verlichte ruimtes |
| **Donker** | Donkere achtergrond, lichte tekst — standaard en aanbevolen voor monitoring |
| **Auto** | Volgt de instelling van het besturingssysteem (OS-donker/licht) |

Wijzig de modus bovenaan de thema-instellingen of via de sneltoets in de navigatiebalk (maan/zon-icoon).

## Kleurpaletten

Zes vooringestelde kleurpaletten zijn beschikbaar:

| Palet | Primaire kleur | Stijl |
|---|---|---|
| **Bambu** | Groen (#00C853) | Standaard, geïnspireerd op Bambu Lab |
| **Blauwe nacht** | Blauw (#2196F3) | Rustig en professioneel |
| **Zonsondergang** | Oranje (#FF6D00) | Warm en energiek |
| **Paars** | Paars (#9C27B0) | Creatief en onderscheidend |
| **Rood** | Rood (#F44336) | Hoog contrast, opvallend |
| **Monochroom** | Grijs (#607D8B) | Neutraal en minimalistisch |

Klik op een palet om het onmiddellijk te bekijken en te activeren.

## Aangepaste accentkleur

Gebruik uw eigen kleur als accentkleur:

1. Klik **Aangepaste kleur** onder de paletselectie
2. Gebruik de kleurkiezer of voer een hex-code in (bijv. `#FF5722`)
3. De voorvertoning wordt in realtime bijgewerkt
4. Klik **Toepassen** om te activeren

:::tip Contrast
Zorg ervoor dat de accentkleur voldoende contrast heeft met de achtergrond. Het systeem waarschuwt als de kleur leesbaarheidsrisico's oplevert (WCAG AA-standaard).
:::

## Afronding

Pas de afronding van knoppen, kaarten en elementen aan:

| Instelling | Beschrijving |
|---|---|
| **Scherp** | Geen afronding (rechthoekige stijl) |
| **Klein** | Subtiele afronding (4 px) |
| **Gemiddeld** | Standaard afronding (8 px) |
| **Groot** | Duidelijke afronding (16 px) |
| **Pill** | Maximale afronding (50 px) |

Versleep de schuifregelaar om handmatig aan te passen tussen 0–50 px.

## Compactheid

Pas de dichtheid van de interface aan:

| Instelling | Beschrijving |
|---|---|
| **Ruim** | Meer ruimte tussen elementen |
| **Standaard** | Gebalanceerd, standaardinstelling |
| **Compact** | Dichter gepakt — meer informatie op het scherm |

Compacte modus wordt aanbevolen voor schermen onder 1080p of kiosk-weergave.

## Typografie

Kies een lettertype:

- **Systeem** — gebruikt het standaardlettertype van het besturingssysteem (snel te laden)
- **Inter** — helder en modern (standaardkeuze)
- **JetBrains Mono** — monospace, goed voor datawaarden
- **Nunito** — zachter en meer afgeronde stijl

## Animaties

Schakel animaties uit of pas ze aan:

- **Volledig** — alle overgangen en animaties actief (standaard)
- **Verminderd** — alleen noodzakelijke animaties (respecteert OS-voorkeur)
- **Uit** — geen animaties voor maximale prestaties

:::tip Kioskmodus
Activeer voor kiosk-weergave **Compact** + **Donker** + **Verminderde animaties** voor optimale prestaties en leesbaarheid op afstand. Zie [Kioskmodus](./kiosk).
:::

## Thema-instellingen exporteren en importeren

Deel uw thema met anderen:

1. Klik **Thema exporteren** — downloadt een `.json`-bestand
2. Deel het bestand met andere Bambu Dashboard-gebruikers
3. Zij importeren via **Thema importeren** → kies het bestand
