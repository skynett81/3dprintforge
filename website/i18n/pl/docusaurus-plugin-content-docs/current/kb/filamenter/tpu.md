---
sidebar_position: 4
title: TPU
description: Przewodnik do drukowania TPU — temperatura, prędkość i ustawienia retrakcji
---

# TPU

TPU (Thermoplastic Polyurethane) to elastyczny materiał używany do etui, uszczelek, kółek i innych części wymagających elastyczności.

## Ustawienia

| Parametr | Wartość |
|-----------|-------|
| Temperatura dyszy | 220–240 °C |
| Temperatura stołu | 30–45 °C |
| Chłodzenie części | 50–80% |
| Prędkość | 30–50% (WAŻNE) |
| Retrakcja | Minimalna lub wyłączona |
| Suszenie | Zalecane (6–8 godz. przy 60 °C) |

:::danger Niska prędkość jest krytyczna
TPU musi być drukowany wolno. Zbyt wysoka prędkość powoduje, że materiał jest ściskany w ekstruderze i tworzy zator. Zacznij od 30% prędkości i ostrożnie zwiększaj.
:::

## Zalecane płyty robocze

| Płyta | Przydatność | Klej? |
|-------|---------|----------|
| Textured PEI | Doskonała | Nie |
| Cool Plate (Smooth PEI) | Dobra | Nie |
| Engineering Plate | Dobra | Nie |

## Ustawienia retrakcji

TPU jest elastyczny i źle reaguje na agresywną retrakcję:

- **Direct drive (X1C/P1S/A1):** Retrakcja 0,5–1,0 mm, 25 mm/s
- **Bowden (unikaj z TPU):** Bardzo wymagające, nie zalecane

Dla bardzo miękkiego TPU (Shore A 85 lub niżej): wyłącz retrakcję całkowicie i polegaj na kontroli temperatury i prędkości.

## Wskazówki

- **Suszyć filament** — wilgotny TPU jest ekstremalnie trudny do drukowania
- **Używaj direct drive** — Bambu Lab P1S/X1C/A1 mają wszystkie direct drive
- **Unikaj wysokiej temperatury** — powyżej 250 °C TPU degraduje się i daje przebarwiony wydruk
- **Pochylenie** — TPU tworzy nitki; zmniejsz temperaturę o 5 °C lub zwiększ chłodzenie

:::tip Twardość Shore
TPU dostępny jest w różnych twardościach Shore (A85, A95, A98). Im niższe Shore A, tym miększe i trudniejsze do drukowania. TPU Bambu Lab to Shore A 95 — dobry punkt startowy.
:::

## Przechowywanie

TPU jest bardzo higroskopijny (wchłania wilgoć). Wilgotny TPU daje:
- Bąbelki i syczenie
- Słaby i kruchy wydruk (paradoksalnie dla elastycznego materiału)
- Stringing

**Zawsze suszyć TPU** w 60 °C przez 6–8 godzin przed drukowaniem. Przechowywać w zapieczętowanym pudełku z żelem krzemionkowym.
