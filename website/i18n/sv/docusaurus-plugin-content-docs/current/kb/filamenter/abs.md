---
sidebar_position: 3
title: ABS
description: Guide till ABS-utskrift — temperatur, kammer, warping och limstift
---

# ABS

ABS (Acrylonitrile Butadiene Styrene) är ett termoplast med god värmestabilitet och slagtålighet. Det kräver kammer och är mer krävande än PLA/PETG, men ger hållbara funktionella delar.

## Inställningar

| Parameter | Värde |
|-----------|-------|
| Munstycketemperatur | 240–260 °C |
| Bäddtemperatur | 90–110 °C |
| Kammartemperatur | 45–55 °C (X1C/P1S) |
| Delavkylning | 0–20% |
| Aux-fläkt | 0% |
| Hastighet | 80–100% |
| Torkning | Rekommenderat (4–6 t vid 70 °C) |

## Rekommenderade byggplattor

| Platta | Lämplighet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmärkt | Ja (rekommenderat) |
| High Temp Plate | Utmärkt | Ja |
| Cool Plate (Smooth PEI) | Undvik | — |
| Textured PEI | Bra | Ja |

:::tip Limstift för ABS
Använd alltid limstift på Engineering Plate vid ABS. Det förbättrar vidhäftningen och gör det lättare att lossa utskriften utan att skada plattan.
:::

## Kammer

ABS **kräver** en sluten kammer för att förhindra warping:

- **X1C och P1S:** Inbyggd kammer med aktiv värmestyrning — idealiskt för ABS
- **P1P:** Delvis öppen — lägg till toppkåpa för bättre resultat
- **A1 / A1 Mini:** Öppen CoreXY — **rekommenderas inte** för ABS utan egentillverkad hölje

Håll kammaren stängd under hela utskriften. Öppna den inte för att kontrollera utskriften — väntar du till avkylning undviker du också warping vid lossgörning.

## Warping

ABS är mycket känsligt för warping (hörnen lyfts):

- **Öka bäddtemperatur** — prova 105–110 °C
- **Använd brim** — 5–10 mm brim i Bambu Studio
- **Undvik drag** — stäng alla luftflöden runt skrivaren
- **Sänk delavkylning till 0%** — kylning orsakar vridning

:::warning Ångor
ABS avger styrenångor under utskrift. Se till att rummet har god ventilation, eller använd HEPA/aktivt kolfilter. Bambu P1S har inbyggt filter.
:::

## Efterbehandling

ABS kan slipas, målas och limmas lättare än PETG och PLA. Det kan också ångpoleras med aceton för slät yta — men var mycket försiktig med acetonexponering.

## Förvaring

Torka vid **70 °C i 4–6 timmar** före utskrift. Förvara i förseglad låda — ABS absorberar fukt, vilket ger knackande ljud och svaga lager.
