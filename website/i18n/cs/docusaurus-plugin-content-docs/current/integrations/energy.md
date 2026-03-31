---
sidebar_position: 2
title: Cena elektřiny
description: Připojte se k Tibber nebo Nordpool pro živé hodinové ceny, historii cen a cenová upozornění
---

# Cena elektřiny

Integrace ceny elektřiny načítá živé ceny elektřiny z Tibber nebo Nordpool pro přesné výpočty nákladů na elektřinu pro každý tisk a upozornění na dobré nebo špatné cenové časy pro tisk.

Přejděte na: **https://localhost:3443/#settings** → **Integrace → Cena elektřiny**

## Integrace Tibber

Tibber je norský dodavatel elektřiny s otevřeným API pro spotové ceny.

### Nastavení

1. Přihlaste se na [developer.tibber.com](https://developer.tibber.com)
2. Vygenerujte **Personal Access Token**
3. V 3DPrintForge: vložte token do pole **Tibber API Token**
4. Vyberte **Domov** (odkud se mají načítat ceny, pokud máte více domovů)
5. Klikněte na **Test připojení**
6. Klikněte na **Uložit**

### Dostupná data z Tibber

- **Spotová cena nyní** — okamžitá cena včetně daní (Kč/kWh)
- **Ceny na příštích 24 hodin** — Tibber dodává zítřejší ceny od přibližně 13:00
- **Historie cen** — až 30 dní zpět
- **Náklady na tisk** — vypočítáno na základě skutečné doby tisku × hodinové ceny

## Integrace Nordpool

Nordpool je energetická burza poskytující surové spotové ceny pro Skandinávii.

### Nastavení

1. Přejděte na **Integrace → Nordpool**
2. Vyberte **Oblast cen**: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen)
3. Vyberte **Měnu**: NOK / EUR
4. Vyberte **Daně a poplatky**:
   - Zaškrtněte **Zahrnout DPH** (25 %)
   - Vyplňte **Poplatek za distribuci** (Kč/kWh) — viz faktura od distributora
   - Vyplňte **Spotřební daň** (Kč/kWh)
5. Klikněte na **Uložit**

:::info Poplatek za distribuci
Poplatek za distribuci se liší podle distributora a cenového modelu. Zkontrolujte poslední fakturu za elektřinu pro správnou sazbu.
:::

## Hodinové ceny

Hodinové ceny se zobrazují jako sloupcový diagram na příštích 24–48 hodin:

- **Zelená** — levné hodiny (pod průměrem)
- **Žlutá** — průměrná cena
- **Červená** — drahé hodiny (nad průměrem)
- **Šedá** — hodiny bez dostupné prognózy cen

Přejetím myší nad hodinu zobrazíte přesnou cenu (Kč/kWh).

## Historie cen

Přejděte na **Cena elektřiny → Historie** pro zobrazení:

- Denní průměrné ceny za posledních 30 dní
- Nejdražší a nejlevnější hodina za den
- Celkové náklady na elektřinu za tisky za den

## Cenová upozornění

Nastavte automatická upozornění na základě ceny elektřiny:

1. Přejděte na **Cena elektřiny → Cenová upozornění**
2. Klikněte na **Nové upozornění**
3. Vyberte typ upozornění:
   - **Cena pod limitem** — upozornit, když cena elektřiny klesne pod X Kč/kWh
   - **Cena nad limitem** — upozornit, když cena vzroste nad X Kč/kWh
   - **Nejlevnější hodina dnes** — upozornit, když začíná nejlevnější hodina dne
4. Vyberte kanál upozornění
5. Klikněte na **Uložit**

:::tip Inteligentní plánování
Kombinujte cenová upozornění s frontou tisků: nastavte automatizaci, která automaticky odesílá úlohy z fronty, když je cena elektřiny nízká (vyžaduje integraci webhooku nebo Home Assistant).
:::

## Cena elektřiny v kalkulačce nákladů

Aktivovaná integrace ceny elektřiny poskytuje přesné náklady na elektřinu v [Kalkulačce nákladů](../analytics/costestimator). Vyberte **Živá cena** místo pevné ceny pro použití aktuální ceny Tibber/Nordpool.
