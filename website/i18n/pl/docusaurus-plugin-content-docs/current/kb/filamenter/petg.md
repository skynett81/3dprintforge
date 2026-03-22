---
sidebar_position: 2
title: PETG
description: Przewodnik do drukowania PETG — temperatura, WAŻNE o kleju, płyta i wskazówki
---

# PETG

PETG (Polyethylene Terephthalate Glycol) to popularny materiał do części funkcjonalnych. Jest mocniejszy i bardziej odporny na ciepło niż PLA, oraz toleruje lekką ekspozycję chemiczną.

## Ustawienia

| Parametr | Wartość |
|-----------|-------|
| Temperatura dyszy | 230–250 °C |
| Temperatura stołu | 70–85 °C |
| Chłodzenie części | 30–60% |
| Prędkość | Standardowa |
| Suszenie | Zalecane (6–8 godz. przy 65 °C) |

## Zalecane płyty robocze

| Płyta | Przydatność | Klej? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Doskonała | Nie/Tak* |
| Textured PEI | Dobra | Tak** |
| Cool Plate (Smooth PEI) | Patrz ostrzeżenie | Patrz ostrzeżenie |
| High Temp Plate | Dobra | Tak |

:::danger WAŻNE: Klej na Smooth PEI z PETG
PETG przylega **ekstremalnie mocno** do Smooth PEI (Cool Plate). Bez kleju ryzykujesz **wyrwanie powłoki z płyty** przy usuwaniu wydruku. Zawsze używaj cienkiej warstwy kleju na Smooth PEI przy drukowaniu PETG — działa jako bariera.

**Alternatywnie:** Używaj Engineering Plate lub Textured PEI — zapewniają dobrą przyczepność bez niszczenia płyty.
:::

## Wskazówki do udanego drukowania

- **Zmniejsz chłodzenie** — zbyt dużo chłodzenia powoduje rozwarstwianie i kruchy wydruk
- **Zwiększ temperaturę dyszy** — przy stringing spróbuj zejść o 5–10 °C; przy słabym łączeniu warstw idź w górę
- **Temperatura stołu pierwszej warstwy** — 80–85 °C dla dobrej przyczepności, zmniejsz do 70 °C po pierwszej warstwie
- **Zmniejsz prędkość** — PETG jest bardziej wymagający niż PLA, zacznij od 80% prędkości

:::warning Stringing
PETG jest podatny na stringing. Zwiększ odległość retrakcji (spróbuj 0,8–1,5 mm dla direct drive), zwiększ prędkość retrakcji i zmniejsz temperaturę dyszy o 5 °C na raz.
:::

## Suszenie

PETG wchłania wilgoć szybciej niż PLA. Wilgotny PETG powoduje:
- Bąbelki i syczenie podczas drukowania
- Słabe warstwy z porowatą powierzchnią
- Zwiększony stringing

**Suszyć w 65 °C przez 6–8 godzin** przed drukowaniem, zwłaszcza jeśli szpula była otwarta przez długi czas.

## Przechowywanie

Zawsze przechowuj w zapieczętowanej torbie lub pudełku z żelem krzemionkowym. PETG nie powinien stać otwarty dłużej niż kilka dni w wilgotnym środowisku.
