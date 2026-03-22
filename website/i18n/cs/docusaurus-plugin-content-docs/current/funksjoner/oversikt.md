---
sidebar_position: 1
title: Přehled funkcí
description: Kompletní přehled všech funkcí Bambu Dashboard
---

# Přehled funkcí

Bambu Dashboard shromažďuje vše, co potřebujete pro monitorování a správu vašich tiskáren Bambu Lab, na jednom místě.

## Dashboard

Hlavní dashboard zobrazuje stav aktivní tiskárny v reálném čase:

- **Teplota** — animované SVG kruhové ukazatele pro trysku a podložku
- **Průběh** — procentuální průběh s odhadovaným časem dokončení
- **Kamera** — live zobrazení kamery (RTSPS → MPEG1 přes ffmpeg)
- **AMS panel** — vizuální znázornění všech slotů AMS s barvou filamentu
- **Rychlostní ovládání** — posuvník pro nastavení rychlosti (Tichý, Standardní, Sport, Turbo)
- **Statistické panely** — panely ve stylu Grafana s průběžnými grafy
- **Telemetrie** — živé hodnoty pro ventilátory, teploty, tlak

Panely lze přetahovat pro přizpůsobení rozvržení. Použijte tlačítko zamknutí pro uzamčení rozvržení.

## Sklad filamentů

Viz [Filament](./filament) pro úplnou dokumentaci.

- Sledujte všechny cívky s názvem, barvou, hmotností a dodavatelem
- Synchronizace AMS — zobrazení, které cívky jsou v AMS
- Protokol sušení a plán sušení
- Barevné karty a podpora NFC tagů
- Import/export (CSV)

## Historie tisků

Viz [Historie](./historikk) pro úplnou dokumentaci.

- Kompletní protokol všech tisků
- Sledování filamentů pro každý tisk
- Odkazy na modely MakerWorld
- Statistiky a export do CSV

## Plánovač

Viz [Plánovač](./scheduler) pro úplnou dokumentaci.

- Kalendářní zobrazení tisků
- Fronta tisků s prioritizací
- Dispatch pro více tiskáren

## Ovládání tiskárny

Viz [Ovládání](./controls) pro úplnou dokumentaci.

- Řízení teploty (tryska, podložka, komora)
- Řízení rychlostního profilu
- Ovládání ventilátorů
- Konzola G-kódu
- Zasunování/vysouvání filamentu

## Oznámení

Bambu Dashboard podporuje 7 kanálů oznámení:

| Kanál | Události |
|-------|----------|
| Telegram | Tisk dokončen, chyba, pauza |
| Discord | Tisk dokončen, chyba, pauza |
| E-mail | Tisk dokončen, chyba |
| ntfy | Všechny události |
| Pushover | Všechny události |
| SMS (Twilio) | Kritické chyby |
| Webhook | Vlastní payload |

Nastavte v části **Nastavení → Oznámení**.

## Print Guard

Print Guard monitoruje aktivní tisk přes kameru (xcam) a senzory:

- Automatická pauza při chybě spaghetti
- Konfigurovatelná úroveň citlivosti
- Protokol zjištěných událostí

## Údržba

Sekce údržby sleduje:

- Další doporučený servis pro každý komponent (tryska, podložky, AMS)
- Sledování opotřebení na základě historie tisků
- Ruční záznam úkolů údržby

## Více tiskáren

S podporou více tiskáren můžete:

- Spravovat až více tiskáren z jednoho dashboardu
- Přepínat mezi tiskárnami pomocí výběru tiskárny
- Zobrazovat přehled stavu všech tiskáren současně
- Distribuovat tiskové úlohy frontou tisků

## OBS Overlay

Dedicated stránka `obs.html` poskytuje čistý overlay pro integraci OBS Studio při živém streamování tisků.

## Aktualizace

Vestavěná automatická aktualizace přes GitHub Releases. Oznámení a aktualizace přímo z dashboardu v části **Nastavení → Aktualizace**.
