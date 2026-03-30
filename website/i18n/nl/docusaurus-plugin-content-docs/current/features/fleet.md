---
sidebar_position: 3
title: Vlootoverzicht
description: Beheer en monitor alle Bambu Lab-printers in één raster met sortering, filtering en realtime status
---

# Vlootoverzicht

Het vlootoverzicht geeft u een compact overzicht van alle verbonden printers op één pagina. Perfect voor werkplaatsen, klaslokalen of iedereen met meer dan één printer.

Ga naar: **https://localhost:3443/#fleet**

## Multi-printer raster

Alle geregistreerde printers worden weergegeven in een responsief raster:

- **Kaartgrootte** — Klein (compact), Medium (standaard), Groot (gedetailleerd)
- **Aantal kolommen** — Automatisch aangepast aan de schermbreedte, of handmatig instellen
- **Bijwerken** — Elke kaart wordt onafhankelijk bijgewerkt via MQTT

Elke printerkaart toont:
| Veld | Beschrijving |
|---|---|
| Printernaam | Geconfigureerde naam met modelpictogram |
| Status | Inactief / Bezig met printen / Pauze / Fout / Verbroken |
| Voortgang | Voortgangsbalk met resterende tijd |
| Temperatuur | Spuitmond en bed (compact) |
| Actief filament | Kleur en materiaal van AMS |
| Cameraminiatuur | Stilstaand beeld bijgewerkt elke 30 seconden |

## Statusindicator per printer

Statuskleuren maken het eenvoudig om de toestand van een afstand te zien:

- **Groene puls** — Actief aan het printen
- **Blauw** — Inactief en gereed
- **Geel** — Gepauzeerd (handmatig of door Print Guard)
- **Rood** — Fout gedetecteerd
- **Grijs** — Verbroken of niet beschikbaar

:::tip Kioskmodus
Gebruik het vlootoverzicht in kioskmodus op een wandgemonteerd scherm. Zie [Kioskmodus](../system/kiosk) voor de installatie.
:::

## Sorteren

Klik op **Sorteren** om de volgorde te kiezen:

1. **Naam** — Alfabetisch A–Z
2. **Status** — Actieve printers bovenaan
3. **Voortgang** — Meest voltooid bovenaan
4. **Laatst actief** — Meest recent gebruikt bovenaan
5. **Model** — Gegroepeerd op printermodel

De sortering wordt onthouden tot het volgende bezoek.

## Filteren

Gebruik het filterveld bovenaan om de weergave te beperken:

- Typ de printernaam of een deel ervan
- Selecteer **Status** in de vervolgkeuzelijst (Alle / Bezig / Inactief / Fout)
- Selecteer **Model** om slechts één printertype te tonen (X1C, P1S, A1, enz.)
- Klik op **Filter wissen** om alles te tonen

:::info Zoeken
De zoekopdracht filtert realtime zonder de pagina opnieuw te laden.
:::

## Acties vanuit het vlootoverzicht

Klik rechts op een kaart (of klik op de drie puntjes) voor snelle acties:

- **Dashboard openen** — Ga direct naar het hoofdpaneel van de printer
- **Print pauzeren** — Zet de printer op pauze
- **Print stoppen** — Breekt de lopende print af (vereist bevestiging)
- **Camera bekijken** — Opent de cameraweergave in een pop-up
- **Naar instellingen** — Opent printerinstellingen

:::danger Print stoppen
Het stoppen van een print is niet omkeerbaar. Bevestig altijd in het dialoogvenster dat wordt weergegeven.
:::

## Geaggregeerde statistieken

Bovenaan het vlootoverzicht wordt een samenvattingsregel weergegeven:

- Totaal aantal printers
- Aantal actieve prints
- Totaal filamentverbruik vandaag
- Geschatte eindtijd voor de langste lopende print
