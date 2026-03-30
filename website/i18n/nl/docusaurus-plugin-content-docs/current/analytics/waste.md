---
sidebar_position: 5
title: Verspillingstracking
description: Volg filamentverspilling van AMS-purge en ondersteuningsmateriaal, bereken kosten en optimaliseer de efficiëntie
---

# Verspillingstracking

Verspillingstracking geeft u volledig inzicht in hoeveel filament er verloren gaat tijdens het printen — AMS-purge, spoelen bij materiaalwisselingen en ondersteuningsmateriaal — en wat dit u kost.

Ga naar: **https://localhost:3443/#waste**

## Verspillingscategorieën

Bambu Dashboard onderscheidt drie soorten verspilling:

| Categorie | Bron | Typisch aandeel |
|---|---|---|
| **AMS-purge** | Kleurwisseling in AMS tijdens multicolor-print | 5–30 g per wissel |
| **Materiaalwisseling-spoeling** | Reiniging bij wisseling tussen verschillende materialen | 10–50 g per wissel |
| **Ondersteuningsmateriaal** | Ondersteuningsstructuren die na het printen worden verwijderd | Varieert |

## AMS-purge-tracking

AMS-purgedata wordt rechtstreeks opgehaald uit MQTT-telemetrie en G-code-analyse:

- **Gram per kleurwisseling** — berekend uit G-code-purgeblok
- **Aantal kleurwisselingen** — geteld uit de printlog
- **Totaal purgeverbruik** — de som over de geselecteerde periode

:::tip Purge verminderen
Bambu Studio heeft instellingen voor purgevolume per kleurencombinatie. Verklein het purgevolume voor kleurparen met weinig kleurverschil (bijv. wit → lichtgrijs) om filament te besparen.
:::

## Efficiëntieberekening

Efficiëntie wordt berekend als:

```
Efficiëntie % = (modelmateriaal / totaal verbruik) × 100

Totaal verbruik = modelmateriaal + purge + ondersteuningsmateriaal
```

**Voorbeeld:**
- Model: 45 g
- Purge: 12 g
- Ondersteuning: 8 g
- Totaal: 65 g
- **Efficiëntie: 69 %**

De efficiëntie wordt weergegeven als een trenddiagram over tijd om te zien of u verbeteringen maakt.

## Kosten van verspilling

Op basis van geregistreerde filamentprijzen wordt het volgende berekend:

| Post | Berekening |
|---|---|
| Purgekosten | Purge-gram × prijs/gram per kleur |
| Ondersteuningskosten | Ondersteuning-gram × prijs/gram |
| **Totale verspillingskosten** | Som van bovenstaande |
| **Kosten per geslaagde print** | Verspillingskosten / aantal prints |

## Verspilling per printer en materiaal

Filter de weergave op:

- **Printer** — zie welke printer de meeste verspilling genereert
- **Materiaal** — zie verspilling per filamenttype
- **Periode** — dag, week, maand, jaar

De tabelweergave toont een gerangschijkte lijst met de hoogste verspilling bovenaan, inclusief geschatte kosten.

## Optimalisatietips

Het systeem genereert automatisch suggesties om verspilling te verminderen:

- **Omgekeerde kleurvolgorde** — als kleur A→B meer purge gebruikt dan B→A, stelt het systeem voor de volgorde om te keren
- **Kleurwissellagen samenvoegen** — groepeert lagen met dezelfde kleur om wisselingen te minimaliseren
- **Ondersteuningsstructuuroptimalisatie** — schat de ondersteuningsvermindering bij het wijzigen van de oriëntatie

:::info Nauwkeurigheid
Purgeberekeningen zijn geschat op basis van G-code. De werkelijke verspilling kan 10–20 % variëren door printergedrag.
:::

## Exporteren en rapporteren

1. Klik op **Verspillingsdata exporteren**
2. Selecteer periode en formaat (CSV / PDF)
3. Verspillingsdata kan worden opgenomen in projectrapporten en facturen als kostenpost

Zie ook [Filamentanalyse](./filamentanalytics) voor een gecombineerd verbruiksoverzicht.
