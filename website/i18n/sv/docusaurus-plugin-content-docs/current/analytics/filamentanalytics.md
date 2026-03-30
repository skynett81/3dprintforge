---
sidebar_position: 3
title: Filamentanalys
description: Detaljerad analys av filamentförbrukning, kostnader, prognoser, förbrukningshastigheter och avfall per material och leverantör
---

# Filamentanalys

Filamentanalysen ger dig full insikt i din filamentförbrukning — vad du använder, vad det kostar och vad du kan spara.

Gå till: **https://localhost:3443/#filament-analytics**

## Förbrukningsöversikt

Överst visas en sammanfattning för vald period:

- **Total förbrukning** — gram och meter för alla material
- **Uppskattad kostnad** — baserat på registrerat pris per spole
- **Mest använda material** — typ och leverantör
- **Återbruksrate** — andel filament i faktisk modell vs. stöd/purge

### Förbrukning per material

Cirkeldiagram och tabell visar fördelning mellan material:

| Kolumn | Beskrivning |
|---|---|
| Material | PLA, PETG, ABS, PA, osv. |
| Leverantör | Bambu Lab, PolyMaker, Prusament, osv. |
| Gram använt | Total vikt |
| Meter | Uppskattad längd |
| Kostnad | Gram × pris per gram |
| Utskrifter | Antal utskrifter med detta material |

Klicka på en rad för att borra ner till enskild spolnivå.

## Förbrukningshastigheter

Förbrukningshastigheten visar genomsnittlig filamentförbrukning per tidsenhet:

- **Gram per timme** — under aktiv utskrift
- **Gram per vecka** — inklusive skrivarens driftstopp
- **Gram per utskrift** — genomsnitt per utskrift

Dessa används för att beräkna prognoser för framtida behov.

:::tip Inköpsplanering
Använd förbrukningshastigheten för att planera spoellager. Systemet aviserar automatiskt när uppskattat lager tar slut inom 14 dagar (konfigurerbart).
:::

## Kostnadsprognos

Baserat på historisk förbrukningshastighet beräknas:

- **Uppskattad förbrukning nästa 30 dagar** (gram per material)
- **Uppskattad kostnad nästa 30 dagar**
- **Rekommenderat lager** (tillräckligt för 30 / 60 / 90 dagars drift)

Prognosen tar hänsyn till säsongsvariation om du har data från minst ett år.

## Avfall och effektivitet

Se [Avfallsspårning](./waste) för fullständig dokumentation. Filamentanalysen visar en sammanfattning:

- **AMS-purge** — gram och andel av total förbrukning
- **Stödmaterial** — gram och andel
- **Faktiskt modellmaterial** — återstående andel (effektivitet %)
- **Uppskattad kostnad för avfall** — vad avfallet kostar dig

## Spol-logg

Alla spolar (aktiva och tomma) är loggförda:

| Fält | Beskrivning |
|---|---|
| Spolnamn | Materialnamn och färg |
| Ursprunglig vikt | Registrerad vikt vid start |
| Återstående vikt | Beräknad återstående |
| Använt | Gram använt totalt |
| Senast använd | Datum för senaste utskrift |
| Status | Aktiv / Tom / Lagrad |

## Prisregistrering

För korrekt kostnadsanalys, registrera priser per spole:

1. Gå till **Filamentlager**
2. Klicka på en spole → **Redigera**
3. Fyll i **Inköpspris** och **Vikt vid köp**
4. Systemet beräknar pris per gram automatiskt

Spolar utan registrerat pris använder **standardpris per gram** (anges i **Inställningar → Filament → Standardpris**).

## Export

1. Klicka **Exportera filamentdata**
2. Välj period och format (CSV / PDF)
3. CSV inkluderar en rad per utskrift med gram, kostnad och material
