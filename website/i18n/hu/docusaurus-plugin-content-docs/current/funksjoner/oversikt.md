---
sidebar_position: 1
title: Funkciók áttekintése
description: A Bambu Dashboard összes funkciójának teljes áttekintése
---

# Funkciók áttekintése

A Bambu Dashboard mindent egy helyre gyűjt, amire szükséged van a Bambu Lab nyomtatóid figyeléséhez és vezérléséhez.

## Dashboard

A főpanel valós idejű állapotot jelenít meg az aktív nyomtatóról:

- **Hőmérséklet** — animált SVG gyűrűmérők a fúvókához és ágyhoz
- **Haladás** — százalékos előrehaladás becsült befejezési idővel
- **Kamera** — élő kameranézet (RTSPS → MPEG1 ffmpeg segítségével)
- **AMS-panel** — az összes AMS-nyílás vizuális megjelenítése filamentszínekkel
- **Sebességvezérlés** — csúszka a sebesség beállításához (Csendes, Normál, Sport, Turbo)
- **Statisztikai panelek** — Grafana-stílusú panelek görgetős grafikonokkal
- **Telemetria** — élő értékek ventilátorokhoz, hőmérsékletekhez, nyomáshoz

A panelek húzhatók és ejthetők az elrendezés testreszabásához. Használd a zárolás gombot az elrendezés rögzítéséhez.

## Filamentraktár

A teljes dokumentációért lásd a [Filament](./filament) oldalt.

- Az összes orsó nyomon követése névvel, színnel, súllyal és szállítóval
- AMS-szinkronizálás — melyik orsók vannak az AMS-ben
- Szárítási napló és szárítási terv
- Színkártyák és NFC-cimke támogatás
- Import/export (CSV)

## Nyomtatási előzmények

A teljes dokumentációért lásd az [Előzmények](./historikk) oldalt.

- Az összes nyomtatás teljes naplója
- Filamentkövetés nyomtatásonként
- Hivatkozások MakerWorld modellekre
- Statisztika és CSV exportálás

## Ütemező

A teljes dokumentációért lásd az [Ütemező](./scheduler) oldalt.

- Nyomtatások naptárnézete
- Nyomtatási sor prioritással
- Több nyomtatós kiadás

## Nyomtatóvezérlés

A teljes dokumentációért lásd a [Vezérlés](./controls) oldalt.

- Hőmérséklet-vezérlés (fúvóka, ágy, kamra)
- Sebességprofil-vezérlés
- Ventilátorvezérlés
- G-kód konzol
- Filament betöltése/eltávolítása

## Értesítések

A Bambu Dashboard 7 értesítési csatornát támogat:

| Csatorna | Események |
|----------|-----------|
| Telegram | Nyomtatás kész, hiba, szünet |
| Discord | Nyomtatás kész, hiba, szünet |
| E-mail | Nyomtatás kész, hiba |
| ntfy | Összes esemény |
| Pushover | Összes esemény |
| SMS (Twilio) | Kritikus hibák |
| Webhook | Testreszabott payload |

Konfiguráld a **Beállítások → Értesítések** menüponton.

## Print Guard

A Print Guard aktív nyomtatást figyel a kamerán (xcam) és érzékelőkön keresztül:

- Automatikus szüneteltetés spagetti hibánál
- Konfigurálható érzékenységi szint
- Észlelt eseményekről szóló napló

## Karbantartás

A karbantartási szekció nyomon követi:

- Következő ajánlott szerviz alkatrészenként (fúvóka, lemezek, AMS)
- Kopáskövetés nyomtatási előzmények alapján
- Karbantartási feladatok manuális rögzítése

## Több nyomtatós

A több nyomtatós támogatással lehetséges:

- Több nyomtató kezelése egy dashboardból
- Nyomtatók közötti váltás a nyomtatóválasztóval
- Az összes nyomtató állapotának egyidejű megtekintése
- Nyomtatási feladatok elosztása a nyomtatási sorral

## OBS-overlay

Egy dedikált `obs.html` oldal tiszta overlayt biztosít az OBS Studio integrációhoz nyomtatások élő közvetítése közben.

## Frissítések

Beépített automatikus frissítés a GitHub kiadásokon keresztül. Értesítés és frissítés közvetlenül a dashboardból a **Beállítások → Frissítés** menüponton.
