---
sidebar_position: 2
title: Filamentlager
description: Administrera filamentspolar, AMS-synkronisering, torkning och mer
---

# Filamentlager

Filamentlagret ger dig full överblick över alla filamentspolar, integrerat med AMS och utskriftshistorik.

## Översikt

Lagret visar alla registrerade spolar med:

- **Färg** — visuellt färgkort
- **Material** — PLA, PETG, ABS, TPU, PA, osv.
- **Leverantör** — Bambu Lab, Polymaker, eSUN, osv.
- **Vikt** — återstående gram (uppskattat eller vägt)
- **AMS-spår** — vilket spår spolen sitter i
- **Status** — aktiv, tom, torkar, lagrad

## Lägga till spolar

1. Klicka **+ Ny spole**
2. Fyll i material, färg, leverantör och vikt
3. Skanna NFC-tagg om tillgängligt, eller skriv in manuellt
4. Spara

:::tip Bambu Lab-spolar
Bambu Labs officiella spolar kan importeras automatiskt via Bambu Cloud-integrationen. Se [Bambu Cloud](../getting-started/bambu-cloud).
:::

## AMS-synkronisering

När dashboardet är anslutet till skrivaren synkroniseras AMS-statusen automatiskt:

- Spår visas med rätt färg och material från AMS
- Förbrukning uppdateras efter varje utskrift
- Tomma spolar markeras automatiskt

För att koppla en lokal spole till ett AMS-spår:
1. Gå till **Filament → AMS**
2. Klicka på spåret du vill koppla
3. Välj spole från lagret

## Torkning

Registrera torkningscykler för att spåra fuktighetsexponering:

| Fält | Beskrivning |
|------|-------------|
| Torkad datum | När spolen torkades |
| Temperatur | Torkningstemperatur (°C) |
| Varaktighet | Antal timmar |
| Metod | Ugn, torkbox, filamenttorkare |

:::info Rekommenderade torkningstemperaturer
Se [Kunskapsbasen](../kb/intro) för materialspecifika torkningstider och temperaturer.
:::

## Färgkort

Färgkortsvisningen organiserar spolar visuellt efter färg. Användbart för att hitta rätt färg snabbt. Filtrera på material, leverantör eller status.

## NFC-taggar

Bambu Dashboard stödjer NFC-taggar för snabb identifiering av spolar:

1. Skriv NFC-tagg-ID till spolen i lagret
2. Skanna taggen med mobilen
3. Spolen öppnas direkt i dashboardet

## Import och export

### Export
Exportera hela lagret som CSV: **Filament → Export → CSV**

### Import
Importera spolar från CSV: **Filament → Import → Välj fil**

CSV-formatet:
```
namn,material,farg_hex,leverantor,vikt_gram,nfc_id
PLA Vit,PLA,#FFFFFF,Bambu Lab,1000,
PETG Svart,PETG,#000000,Polymaker,850,ABC123
```

## Statistik

Under **Filament → Statistik** hittar du:

- Total förbrukning per material (senaste 30/90/365 dagar)
- Förbrukning per skrivare
- Uppskattad återstående livslängd per spole
- Mest använda färger och leverantörer
