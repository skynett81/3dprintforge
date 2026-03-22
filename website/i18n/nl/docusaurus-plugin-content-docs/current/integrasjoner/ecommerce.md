---
sidebar_position: 5
title: E-commerce
description: Beheer bestellingen, klanten en facturering voor de verkoop van 3D-prints — vereist een licentie van geektech.no
---

# E-commerce

De e-commercemodule biedt u een compleet systeem voor het beheren van klanten, bestellingen en facturering — perfect voor mensen die professioneel of semi-professioneel 3D-prints verkopen.

Ga naar: **https://localhost:3443/#orders**

:::danger E-commercelicentie vereist
De e-commercemodule vereist een geldige licentie. Licenties kunnen **uitsluitend worden gekocht via [geektech.no](https://geektech.no)**. Zonder actieve licentie is de module vergrendeld en niet beschikbaar.
:::

## Licentie — kopen en activeren

### Licentie kopen

1. Ga naar **[geektech.no](https://geektech.no)** en maak een account aan
2. Selecteer **Bambu Dashboard — E-commercelicentie**
3. Kies het licentietype:

| Licentietype | Beschrijving | Printers |
|---|---|---|
| **Hobby** | Één printer, persoonlijk gebruik en kleinschalige verkoop | 1 |
| **Professioneel** | Tot 5 printers, commercieel gebruik | 1–5 |
| **Enterprise** | Onbeperkt aantal printers, volledige ondersteuning | Onbeperkt |

4. Voltooi de betaling
5. U ontvangt een **licentiesleutel** per e-mail

### Licentie activeren

1. Ga naar **Instellingen → E-commerce** in het dashboard
2. Plak de **licentiesleutel** in het veld
3. Klik op **Licentie activeren**
4. Het dashboard authenticeert de sleutel bij de servers van geektech.no
5. Bij succesvolle activering worden het licentietype, de vervaldatum en het aantal printers weergegeven

:::warning De licentiesleutel is gekoppeld aan uw installatie
De sleutel wordt geactiveerd voor één Bambu Dashboard-installatie. Neem contact op met [geektech.no](https://geektech.no) als u de licentie naar een nieuwe server wilt verplaatsen.
:::

### Licentievalidatie

- De licentie wordt **online gevalideerd** bij het opstarten en vervolgens elke 24 uur
- Bij netwerkstoringen werkt de licentie tot **7 dagen offline**
- Verlopen licentie → de module wordt vergrendeld, maar bestaande data blijft behouden
- Verlenging via **[geektech.no](https://geektech.no)** → Mijn licenties → Verlengen

### Licentiestatus controleren

Ga naar **Instellingen → E-commerce** of roep de API aan:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

Het antwoord bevat:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Bedrijfsnaam BV",
  "provider": "geektech.no"
}
```

## Klanten

### Een klant aanmaken

1. Ga naar **E-commerce → Klanten**
2. Klik op **Nieuwe klant**
3. Vul in:
   - **Naam / Bedrijfsnaam**
   - **Contactpersoon** (voor bedrijven)
   - **E-mailadres**
   - **Telefoon**
   - **Adres** (factuuradres)
   - **KvK-nummer / BSN** (optioneel, voor BTW-geregistreerden)
   - **Opmerking** — interne notitie
4. Klik op **Aanmaken**

### Klantoverzicht

De klantenlijst toont:
- Naam en contactgegevens
- Totaal aantal bestellingen
- Totale omzet
- Datum van laatste bestelling
- Status (Actief / Inactief)

Klik op een klant om alle bestelling- en factureringsgeschiedenis te bekijken.

## Bestelbeheer

### Een bestelling aanmaken

1. Ga naar **E-commerce → Bestellingen**
2. Klik op **Nieuwe bestelling**
3. Selecteer een **Klant** uit de lijst
4. Voeg bestelregels toe:
   - Selecteer bestand/model uit de bestandsbibliotheek, of voeg een vrije-tekstpost toe
   - Geef het aantal en de eenheidsprijs op
   - Systeem berekent kosten automatisch indien gekoppeld aan project
5. Geef de **Leverdatum** op (geschat)
6. Klik op **Bestelling aanmaken**

### Bestelstatus

| Status | Beschrijving |
|---|---|
| Aanvraag | Aanvraag ontvangen, niet bevestigd |
| Bevestigd | Klant heeft bevestigd |
| In productie | Prints lopen |
| Klaar voor levering | Klaar, wacht op afhaling/verzending |
| Geleverd | Bestelling voltooid |
| Geannuleerd | Geannuleerd door klant of door u |

Update de status door op de bestelling te klikken → **Status wijzigen**.

### Prints aan bestelling koppelen

1. Open de bestelling
2. Klik op **Print koppelen**
3. Selecteer prints uit de geschiedenis (meervoudige selectie ondersteund)
4. Kostendata wordt automatisch opgehaald uit de printgeschiedenis

## Facturering

Zie [Projecten → Facturering](../funksjoner/projects#fakturering) voor gedetailleerde factureringsdocumentatie.

Een factuur kan direct vanuit een bestelling worden gegenereerd:

1. Open de bestelling
2. Klik op **Factuur genereren**
3. Controleer bedrag en BTW
4. Download als PDF of stuur naar het e-mailadres van de klant

### Factuurnummerreeks

Stel de factuurnummerreeks in via **Instellingen → E-commerce**:
- **Prefix**: bijv. `2026-`
- **Startnummer**: bijv. `1001`
- Factuurnummers worden automatisch in oplopende volgorde toegewezen

## Rapportage en belastingen

### Kostenrapportage

Het systeem volgt alle transactiekosten:
- Bekijk kosten via **E-commerce → Kosten**
- Markeer kosten als gerapporteerd voor boekhoudkundige doeleinden
- Exporteer kostensamenvatting per periode

### Statistieken

Via **E-commerce → Statistieken**:
- Maandelijkse omzet (staafdiagram)
- Top-klanten op omzet
- Meest verkochte modellen/materialen
- Gemiddelde bestelgrootte

Exporteer naar CSV voor boekhoudprogramma's.

## Ondersteuning en contact

:::info Hulp nodig?
- **Licentievragen**: neem contact op met [geektech.no](https://geektech.no) support
- **Technische problemen**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Functieverzoeken**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
