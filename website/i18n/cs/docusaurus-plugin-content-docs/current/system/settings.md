---
sidebar_position: 3
title: Nastavení
description: Kompletní přehled všech nastavení v Bambu Dashboard — tiskárna, upozornění, téma, OBS, energie, webhooks a další
---

# Nastavení

Všechna nastavení v Bambu Dashboard jsou shromážděna na jedné stránce s přehlednými kategoriemi. Zde je přehled toho, co se nachází v každé kategorii.

Přejděte na: **https://localhost:3443/#settings**

## Tiskárny

Správa registrovaných tiskáren:

| Nastavení | Popis |
|---|---|
| Přidat tiskárnu | Zaregistrujte novou tiskárnu se sériovým číslem a přístupovým kódem |
| Název tiskárny | Vlastní zobrazovaný název |
| Model tiskárny | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| MQTT připojení | Bambu Cloud MQTT nebo lokální MQTT |
| Přístupový kód | LAN Access Code z aplikace Bambu Lab |
| IP adresa | Pro lokální (LAN) režim |
| Nastavení kamery | Aktivovat/deaktivovat, rozlišení |

Viz [Začínáme](../getting-started/setup) pro nastavení první tiskárny krok za krokem.

## Upozornění

Viz kompletní dokumentaci v [Upozornění](../features/notifications).

Rychlý přehled:
- Aktivovat/deaktivovat kanály upozornění (Telegram, Discord, e-mail atd.)
- Filtr událostí pro každý kanál
- Tichá doba (časové okno bez upozornění)
- Tlačítko testu pro každý kanál

## Téma

Viz kompletní dokumentaci v [Téma](./themes).

- Světlý / Tmavý / Automatický režim
- 6 barevných palet
- Vlastní akcentová barva
- Zaoblení a kompaktnost

## OBS overlay

Konfigurace pro OBS overlay:

| Nastavení | Popis |
|---|---|
| Výchozí téma | dark / light / minimal |
| Výchozí pozice | Roh pro overlay |
| Výchozí měřítko | Škálování (0,5–2,0) |
| Zobrazit QR kód | Zobrazit QR kód k dashboardu v overlay |

Viz [OBS Overlay](../features/obs-overlay) pro kompletní syntaxi URL a nastavení.

## Energie a výkon

| Nastavení | Popis |
|---|---|
| Token Tibber API | Přístup ke spotovým cenám Tibber |
| Cenová oblast Nordpool | Vyberte norský cenový region |
| Poplatek za distribuci (Kč/kWh) | Vaše sazba poplatku za distribuci |
| Výkon tiskárny (W) | Konfigurace spotřeby výkonu pro každý model tiskárny |

## Home Assistant

| Nastavení | Popis |
|---|---|
| MQTT broker | IP, port, uživatelské jméno, heslo |
| Předpona Discovery | Výchozí: `homeassistant` |
| Aktivovat discovery | Publikovat zařízení do HA |

## Webhooks

Globální nastavení webhooků:

| Nastavení | Popis |
|---|---|
| URL webhooků | Cílová URL pro události |
| Tajný klíč | Podpis HMAC-SHA256 |
| Filtr událostí | Které události jsou odesílány |
| Pokusy o opakování | Počet pokusů při selhání (výchozí: 3) |
| Timeout | Sekundy před vzdáním požadavku (výchozí: 10) |

## Nastavení fronty

| Nastavení | Popis |
|---|---|
| Automatické odesílání | Aktivovat/deaktivovat |
| Strategie odesílání | První volná / Nejméně používaná / Round-robin |
| Vyžadovat potvrzení | Ruční schválení před odesláním |
| Postupné spuštění | Zpoždění mezi tiskárnami ve frontě |

## Zabezpečení

| Nastavení | Popis |
|---|---|
| Délka relace | Hodiny/dny před automatickým odhlášením |
| Vynutit 2FA | Vyžadovat 2FA pro všechny uživatele |
| Whitelist IP | Omezit přístup na konkrétní IP adresy |
| HTTPS certifikát | Nahrát vlastní certifikát |

## Systém

| Nastavení | Popis |
|---|---|
| Port serveru | Výchozí: 3443 |
| Formát protokolu | JSON / Text |
| Úroveň protokolu | Error / Warn / Info / Debug |
| Čistění databáze | Automatické mazání staré historie |
| Aktualizace | Kontrola nových verzí |
