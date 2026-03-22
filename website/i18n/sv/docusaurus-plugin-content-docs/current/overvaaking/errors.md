---
sidebar_position: 2
title: Fellogg
description: Komplett översikt över HMS-felkoder från skrivarna med allvarlighetsgrad, sökning och länkar till Bambu Wiki
---

# Fellogg

Fellogggen samlar alla fel och HMS-varningar (Health, Maintenance, Safety) från dina skrivare. Bambu Dashboard har en inbyggd databas med 269+ HMS-koder för Bambu Lab-skrivare.

Gå till: **https://localhost:3443/#errors**

## HMS-koder

Bambu Lab-skrivare skickar HMS-koder via MQTT när något är fel. Bambu Dashboard översätter dessa automatiskt till läsbara felmeddelanden:

| Kod | Exempel | Kategori |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Munstycke/extruder |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Byggplatta |
| `0700 0500 0001 0001` | MC disconnect | Elektronik |

Den kompletta listan täcker alla 269+ kända koder för X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D och H2C.

## Allvarlighetsgrad

Fel klassificeras i fyra nivåer:

| Nivå | Färg | Beskrivning |
|---|---|---|
| **Kritisk** | Röd | Kräver omedelbar åtgärd — utskrift stoppad |
| **Hög** | Orange | Bör åtgärdas snabbt — utskrift kan fortsätta |
| **Medium** | Gul | Bör undersökas — ingen omedelbar fara |
| **Info** | Blå | Informationsmeddelande, ingen åtgärd behövs |

## Sökning och filtrering

Använd verktygsfältet överst i felloggen:

1. **Fritextsökning** — sök i felmeddelande, HMS-kod eller skriverbeskrivning
2. **Skrivare** — visa fel bara från en skrivare
3. **Kategori** — AMS / Munstycke / Platta / Elektronik / Kalibrering / Övrigt
4. **Allvarlighetsgrad** — Alla / Kritisk / Hög / Medium / Info
5. **Datum** — filtrera på datumperiod
6. **Okvitterade** — visa bara fel som inte är kvitterade

Klicka **Rensa filter** för att se alla fel.

## Wiki-länkar

För varje HMS-kod visas en länk till Bambu Lab Wiki med:

- Fullständig felbeskrivning
- Möjliga orsaker
- Steg-för-steg felsökningsguide
- Officiella Bambu Lab-rekommendationer

Klicka **Öppna wiki** på en felpost för att öppna den relevanta wiki-sidan i en ny flik.

:::tip Lokal kopia
Bambu Dashboard cachar wiki-innehållet lokalt för offlineanvändning. Innehållet uppdateras veckovis automatiskt.
:::

## Kvittera fel

Kvittering markerar ett fel som hanterat utan att ta bort det:

1. Klicka på ett fel i listan
2. Klicka **Kvittera** (bockikon)
3. Skriv in en valfri anteckning om vad som gjordes
4. Felet markeras med bock och flyttas till «Kvitterade»-listan

### Masskvittering

1. Välj flera fel med kryssrutor
2. Klicka **Kvittera valda**
3. Alla valda fel kvitteras simultaneously

## Statistik

Överst i felloggen visas:

- Totalt antal fel senaste 30 dagarna
- Antal okvitterade fel
- Vanligast förekommande HMS-kod
- Skrivare med flest fel

## Export

1. Klicka **Exportera** (nedladdningsikon)
2. Välj format: **CSV** eller **JSON**
3. Filtret tillämpas på exporten — ange önskat filter först
4. Filen laddas ner automatiskt

## Aviseringar för nya fel

Aktivera aviseringar för nya HMS-fel:

1. Gå till **Inställningar → Aviseringar**
2. Bocka av **Nya HMS-fel**
3. Välj minimiallvarlighetsgrad för avisering (rekommenderat: **Hög** och uppåt)
4. Välj aviseringskanal

Se [Aviseringar](../funksjoner/notifications) för kanalinställning.
