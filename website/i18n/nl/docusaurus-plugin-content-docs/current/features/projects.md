---
sidebar_position: 9
title: Projecten
description: Organiseer prints in projecten, volg kosten, genereer facturen en deel projecten met klanten
---

# Projecten

Projecten laten u gerelateerde prints groeperen, materiaalkosten bijhouden, klanten factureren en een overzicht van uw werk delen.

Ga naar: **https://localhost:3443/#projects**

## Een project aanmaken

1. Klik op **Nieuw project** (+ pictogram)
2. Vul in:
   - **Projectnaam** — beschrijvende naam (max. 100 tekens)
   - **Klant** — optionele klantaccount (zie [E-commerce](../integrations/ecommerce))
   - **Beschrijving** — korte tekstbeschrijving
   - **Kleur** — kies een kleur voor visuele identificatie
   - **Tags** — kommagescheiden trefwoorden
3. Klik op **Project aanmaken**

## Prints aan project koppelen

### Tijdens een print

1. Open het dashboard terwijl een print bezig is
2. Klik op **Aan project koppelen** in het zijpaneel
3. Selecteer een bestaand project of maak een nieuw aan
4. De print wordt automatisch aan het project gekoppeld wanneer deze is voltooid

### Vanuit de geschiedenis

1. Ga naar **Geschiedenis**
2. Zoek de betreffende print
3. Klik op de print → **Aan project koppelen**
4. Selecteer het project in de vervolgkeuzelijst

### Meerdere tegelijk koppelen

1. Selecteer meerdere prints in de geschiedenis via selectievakjes
2. Klik op **Acties → Aan project koppelen**
3. Selecteer het project — alle geselecteerde prints worden gekoppeld

## Kostenoverzicht

Elk project berekent de totale kosten op basis van:

| Kostentype | Bron |
|---|---|
| Filamentverbruik | Gram × prijs per gram per materiaal |
| Stroom | kWh × elektriciteitsprijs (van Tibber/Nordpool indien geconfigureerd) |
| Machineslijtage | Berekend op basis van [Slijtagepredictie](../monitoring/wearprediction) |
| Handmatige kosten | Vrije-tekstposten die u handmatig toevoegt |

Het kostenoverzicht wordt weergegeven als tabel en cirkeldiagram per print en totaal.

:::tip Uurtarieven
Activeer de Tibber- of Nordpool-integratie voor nauwkeurige stroomkosten per print. Zie [Elektriciteitsprijs](../integrations/energy).
:::

## Facturering

1. Open een project en klik op **Factuur genereren**
2. Vul in:
   - **Factuurdatum** en **vervaldatum**
   - **BTW-tarief** (0%, 9%, 21%)
   - **Opslag** (%)
   - **Opmerking voor klant**
3. Bekijk de factuur in PDF-formaat
4. Klik op **PDF downloaden** of **Naar klant sturen** (via e-mail)

Facturen worden opgeslagen bij het project en kunnen opnieuw worden geopend en bewerkt totdat ze zijn verzonden.

:::info Klantgegevens
Klantgegevens (naam, adres, KvK-nummer) worden opgehaald uit de klantaccount die u aan het project heeft gekoppeld. Zie [E-commerce](../integrations/ecommerce) voor het beheren van klanten.
:::

## Projectstatus

| Status | Beschrijving |
|---|---|
| Actief | Het project is in uitvoering |
| Voltooid | Alle prints zijn klaar, factuur verzonden |
| Gearchiveerd | Verborgen uit de standaardweergave, maar doorzoekbaar |
| In de wacht | Tijdelijk stilgezet |

Wijzig de status door op de statusindicator bovenaan het project te klikken.

## Een project delen

Genereer een deelbare link om het projectoverzicht aan klanten te tonen:

1. Klik op **Project delen** in het projectmenu
2. Kies wat er moet worden weergegeven:
   - ✅ Prints en afbeeldingen
   - ✅ Totaal filamentverbruik
   - ❌ Kosten en prijzen (standaard verborgen)
3. Stel de vervaltijd voor de link in
4. Kopieer en deel de link

De klant ziet een alleen-lezen pagina zonder in te loggen.
