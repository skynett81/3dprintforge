---
sidebar_position: 2
title: Filamentlager
description: Administrer filamentsporer, AMS-synkronisering, tørking og mer
---

# Filamentlager

Filamentlageret gir deg full oversikt over alle filamentsporer, integrert med AMS og printhistorikk.

## Oversikt

Lageret viser alle registrerte spoler med:

- **Farge** — visuelt fargekort
- **Materiale** — PLA, PETG, ABS, TPU, PA, osv.
- **Leverandør** — Bambu Lab, Polymaker, eSUN, osv.
- **Vekt** — gjenværende gram (estimert eller veid)
- **AMS-spor** — hvilken spore spolet sitter i
- **Status** — aktiv, tom, tørking, lagret

## Legge til spoler

1. Klikk **+ Ny spole**
2. Fyll inn materiale, farge, leverandør og vekt
3. Skann NFC-tagg om tilgjengelig, eller skriv inn manuelt
4. Lagre

:::tip Bambu Lab-spoler
Bambu Lab sine offisielle spoler kan importeres automatisk via Bambu Cloud-integrasjonen. Se [Bambu Cloud](../getting-started/bambu-cloud).
:::

## AMS-synkronisering

Når dashboardet er koblet til printeren, synkroniseres AMS-statusen automatisk:

- Sporer vises med riktig farge og materiale fra AMS
- Forbruk oppdateres etter hver print
- Tomme spoler merkes automatisk

For å koble en lokal spole til et AMS-spor:
1. Gå til **Filament → AMS**
2. Klikk på sporet du vil koble
3. Velg spole fra lageret

## Tørking

Registrer tørkesykluser for å spore fuktighet-eksponering:

| Felt | Beskrivelse |
|------|-------------|
| Tørket dato | Når spolet ble tørket |
| Temperatur | Tørketemperatur (°C) |
| Varighet | Antall timer |
| Metode | Ovn, tørkeboks, filament-tørker |

:::info Anbefalte tørketemperaturer
Se [Kunnskapsbasen](../kb/intro) for materiale-spesifikke tørketider og temperaturer.
:::

## Fargekort

Fargekort-visningen organiserer spoler visuelt etter farge. Nyttig for å finne riktig farge raskt. Filtrer på materiale, leverandør eller status.

## NFC-tagger

3DPrintForge støtter NFC-tagger for rask identifikasjon av spoler:

1. Skriv NFC-tagg-ID til spolet i lageret
2. Skann taggen med mobilen
3. Spolet åpnes direkte i dashboardet

## Import og eksport

### Eksport
Eksporter hele lageret som CSV: **Filament → Eksport → CSV**

### Import
Importer spoler fra CSV: **Filament → Import → Velg fil**

CSV-formatet:
```
navn,materiale,farge_hex,leverandor,vekt_gram,nfc_id
PLA Hvit,PLA,#FFFFFF,Bambu Lab,1000,
PETG Sort,PETG,#000000,Polymaker,850,ABC123
```

## Statistikk

Under **Filament → Statistikk** finner du:

- Totalt forbruk per materiale (siste 30/90/365 dager)
- Forbruk per printer
- Estimert gjenværende levetid per spole
- Mest brukte farger og leverandører

## Utløp og holdbarhet

Gi en spole en utløpsdato når du legger den til eller redigerer den, eller klikk *Foreslå fra holdbarhet* for å fylle inn en basert på materialets typiske holdbarhet. Hygroskopiske materialer som TPU, Nylon og PVA har kortest holdbarhet, mens PLA/PETG/ABS har lengst. Spolekortene viser deretter et **Utløper om N dager** (gult) eller **Utløpt** (rødt) merke, og Inventory Health-oversikten teller hvor mange som er i ferd med å gå ut, slik at du kan bruke dem først.

## Innkjøp

**Innkjøp**-fanen (under Lager-gruppen) holder styr på syklusen bestilt → mottatt → på hylla. Logg hva du kjøpte (vare, leverandør, kostnad, dato), se ventende kontra mottatte totaler og denne månedens forbruk, og **Motta** så et innkjøp for å legge det til i lageret som en ny spole eller koble det til en eksisterende. Du kan også trykke **Kjøp på nytt** på et restock-forslag ved lav beholdning for å starte et ferdig utfylt innkjøp.

## Skann og opptelling

Skann en spoles QR- eller kortkode (eller skriv den inn) for å åpne et hurtighandlingsark: se detaljer, rediger, sjekk ut/inn, vei inn, eller merk som tom. **Opptelling**-modus (i lagerets *Mer*-meny) lar deg skanne deg gjennom hylla og krysse av hver spole med en levende telt/ikke-telt fremdriftsliste.

## Rapporter

**Rapporter**-fanen (under Statistikk-gruppen) gir et periodeavgrenset (30/90/365 dager), eksporterbart sammendrag: forbrukt vekt, filamentkostnad, suksessrate og svinn, pluss en tabell per materiale med bruksandel. Eksporter tabellen til CSV med ett klikk.
