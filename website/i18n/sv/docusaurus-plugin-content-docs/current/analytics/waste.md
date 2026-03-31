---
sidebar_position: 5
title: Avfallsspårning
description: Spåra filamentavfall från AMS-purge och stödmaterial, beräkna kostnader och optimera effektiviteten
---

# Avfallsspårning

Avfallsspårning ger dig full insikt i hur mycket filament som går till spillo under utskrift — AMS-purge, spolning vid materialbytenser och stödmaterial — och vad det kostar dig.

Gå till: **https://localhost:3443/#waste**

## Avfallskategorier

3DPrintForge skiljer mellan tre typer av avfall:

| Kategori | Källa | Typisk andel |
|---|---|---|
| **AMS-purge** | Färgskifte i AMS under flerfärgsutskrift | 5–30 g per byte |
| **Materialbytesspölning** | Rensning vid skifte mellan olika material | 10–50 g per byte |
| **Stödmaterial** | Stödstrukturer som tas bort efter utskrift | Varierar |

## AMS-purge-spårning

AMS-purge-data hämtas direkt från MQTT-telemetri och G-code-analys:

- **Gram per färgskifte** — beräknat från G-code-purge-block
- **Antal färgskiften** — räknat från utskriftslogg
- **Total purge-förbrukning** — summan över vald period

:::tip Minska purge
Bambu Studio har inställningar för purge-volym per färgkombination. Minska purge-volymen för färgpar med liten färgskillnad (t.ex. vit → ljusgrå) för att spara filament.
:::

## Effektivitetsberäkning

Effektivitet beräknas som:

```
Effektivitet % = (modellmaterial / total förbrukning) × 100

Total förbrukning = modellmaterial + purge + stödmaterial
```

**Exempel:**
- Modell: 45 g
- Purge: 12 g
- Stöd: 8 g
- Totalt: 65 g
- **Effektivitet: 69 %**

Effektiviteten visas som ett trenddiagram över tid för att se om du förbättrar dig.

## Kostnad för avfall

Baserat på registrerade filamentpriser beräknas:

| Post | Beräkning |
|---|---|
| Purge-kostnad | Purge-gram × pris/gram per färg |
| Stöd-kostnad | Stöd-gram × pris/gram |
| **Total avfallskostnad** | Summa av ovan |
| **Kostnad per lyckad utskrift** | Avfallskostnad / antal utskrifter |

## Avfall per skrivare och material

Filtrera visningen efter:

- **Skrivare** — se vilken skrivare som genererar mest avfall
- **Material** — se avfall per filamenttyp
- **Period** — dag, vecka, månad, år

Tabellvisningen visar rankad lista med högst avfall överst, inklusive uppskattad kostnad.

## Optimeringstips

Systemet genererar automatiska förslag för att minska avfall:

- **Vänd färgordning** — Om färg A→B purgar mer än B→A, föreslår systemet att byta ordning
- **Slå samman färgbytesskikt** — Grupperar skikt med samma färg för att minimera byten
- **Stödstrukturoptimering** — Uppskattar stödminskning vid ändrad orientering

:::info Noggrannhet
Purge-beräkningar är uppskattade från G-code. Faktiskt avfall kan variera 10–20 % på grund av skrivarens beteende.
:::

## Export och rapportering

1. Klicka **Exportera avfallsdata**
2. Välj period och format (CSV / PDF)
3. Avfallsdata kan inkluderas i projektrapporter och fakturor som kostnadspost

Se även [Filamentanalys](./filamentanalytics) för samlad förbrukningsöversikt.
