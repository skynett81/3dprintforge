---
sidebar_position: 3
title: ABS
description: Przewodnik do drukowania ABS — temperatura, obudowa, warping i klej
---

# ABS

ABS (Acrylonitrile Butadiene Styrene) to termoplast z dobrą stabilnością termiczną i odpornością na uderzenia. Wymaga obudowy i jest bardziej wymagający niż PLA/PETG, ale daje trwałe funkcjonalne części.

## Ustawienia

| Parametr | Wartość |
|-----------|-------|
| Temperatura dyszy | 240–260 °C |
| Temperatura stołu | 90–110 °C |
| Temperatura komory | 45–55 °C (X1C/P1S) |
| Chłodzenie części | 0–20% |
| Wentylator pomocniczy | 0% |
| Prędkość | 80–100% |
| Suszenie | Zalecane (4–6 godz. przy 70 °C) |

## Zalecane płyty robocze

| Płyta | Przydatność | Klej? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Doskonała | Tak (zalecany) |
| High Temp Plate | Doskonała | Tak |
| Cool Plate (Smooth PEI) | Unikaj | — |
| Textured PEI | Dobra | Tak |

:::tip Klej do ABS
Zawsze używaj kleju na Engineering Plate przy ABS. Poprawia przyczepność i ułatwia oderwanie wydruku bez uszkodzenia płyty.
:::

## Obudowa (komora)

ABS **wymaga** zamkniętej komory, aby zapobiec warpingowi:

- **X1C i P1S:** Wbudowana komora z aktywnym sterowaniem temperaturą — idealne dla ABS
- **P1P:** Częściowo otwarta — dodaj osłony górne dla lepszych wyników
- **A1 / A1 Mini:** Otwarta CoreXY — **nie zalecane** dla ABS bez własnej obudowy

Utrzymuj komorę zamkniętą przez cały czas drukowania. Nie otwieraj jej, aby sprawdzić wydruk — poczekaj do ochłodzenia, a unikniesz też warpingu przy zwalnianiu.

## Warping

ABS jest bardzo podatny na warping (narożniki się podnoszą):

- **Zwiększ temperaturę stołu** — spróbuj 105–110 °C
- **Użyj brim** — 5–10 mm brim w Bambu Studio
- **Unikaj przeciągów** — zamknij wszelkie przepływy powietrza wokół drukarki
- **Zmniejsz chłodzenie do 0%** — chłodzenie powoduje skręcanie

:::warning Opary
ABS emituje opary styrenu podczas drukowania. Zapewnij dobrą wentylację w pomieszczeniu lub używaj filtra HEPA/węgla aktywnego. Bambu P1S ma wbudowany filtr.
:::

## Obróbka końcowa

ABS można szlifować, malować i klejić łatwiej niż PETG i PLA. Można go też wygładzać parami acetonu dla gładkiej powierzchni — zachowaj jednak dużą ostrożność przy ekspozycji na aceton.

## Przechowywanie

Suszyć w **70 °C przez 4–6 godzin** przed drukowaniem. Przechowywać w zapieczętowanym pojemniku — ABS wchłania wilgoć, co powoduje trzaskające dźwięki i słabe warstwy.
