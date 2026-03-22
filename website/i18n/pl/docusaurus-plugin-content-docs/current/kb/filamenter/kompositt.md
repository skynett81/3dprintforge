---
sidebar_position: 6
title: Materiały kompozytowe (CF/GF)
description: Filamenty z włóknem węglowym i szklanym — dysza z hartowanej stali, zużycie i ustawienia
---

# Materiały kompozytowe (CF/GF)

Filamenty kompozytowe zawierają krótkie włókna węglowe (CF) lub szklane (GF) zmieszane z bazowym tworzywem, takim jak PLA, PETG, PA lub ABS. Zapewniają zwiększoną sztywność, zmniejszoną wagę i lepszą stabilność wymiarową.

## Dostępne typy

| Filament | Baza | Sztywność | Redukcja wagi | Trudność |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Wysoka | Umiarkowana | Łatwa |
| PETG-CF | PETG | Wysoka | Umiarkowana | Umiarkowana |
| PA6-CF | Nylon 6 | Bardzo wysoka | Dobra | Wymagająca |
| PA12-CF | Nylon 12 | Bardzo wysoka | Dobra | Umiarkowana |
| ABS-CF | ABS | Wysoka | Umiarkowana | Umiarkowana |
| PLA-GF | PLA | Wysoka | Umiarkowana | Łatwa |

## Dysza z hartowanej stali jest wymagana

:::danger Nigdy nie używaj mosiężnej dyszy z CF/GF
Włókna węglowe i szklane są bardzo ścierne. Zetrą standardową mosiężną dyszę w ciągu godzin do dni. Zawsze używaj **dyszy z hartowanej stali** (Hardened Steel) lub **dyszy HS01** ze wszystkimi materiałami CF i GF.

- Bambu Lab Hardened Steel Nozzle (0,4 mm)
- Bambu Lab HS01 Nozzle (specjalna powłoka, dłuższa żywotność)
:::

## Ustawienia (przykład PA-CF)

| Parametr | Wartość |
|-----------|-------|
| Temperatura dyszy | 270–290 °C |
| Temperatura stołu | 80–100 °C |
| Chłodzenie części | 0–20% |
| Prędkość | 80% |
| Suszenie | 80 °C / 12 godzin |

Dla PLA-CF: dysza 220–230 °C, stół 35–50 °C — znacznie łatwiejszy niż PA-CF.

## Płyty robocze

| Płyta | Przydatność | Klej? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Doskonała | Tak (dla bazy PA) |
| High Temp Plate | Dobra | Tak |
| Cool Plate | Unikaj (CF rysuje) | — |
| Textured PEI | Dobra | Tak |

:::warning Płyta może być zarysowana
Materiały CF mogą rysować gładkie płyty przy usuwaniu. Zawsze używaj Engineering Plate lub Textured PEI. Nie ciągnij wydruku — ostrożnie wyginaj płytę.
:::

## Obróbka powierzchni

Filamenty CF dają matową, węglopodobną powierzchnię, która nie wymaga malowania. Powierzchnia jest nieco porowata i można ją zaimpregnować żywicą epoksydową dla gładszego wykończenia.

## Zużycie i żywotność dyszy

| Typ dyszy | Żywotność z CF | Koszt |
|----------|---------------|---------|
| Mosiądz (standardowa) | Godziny–dni | Niski |
| Hartowana stal | 200–500 godzin | Umiarkowany |
| HS01 (Bambu) | 500–1000 godzin | Wysoki |

Wymieniaj dyszę przy widocznym zużyciu: rozszerzone otwory dyszy, cienkie ścianki, słaba dokładność wymiarowa.

## Suszenie

Warianty CF dla PA i PETG wymagają suszenia tak jak ich baza:
- **PLA-CF:** Suszenie zalecane, ale nie krytyczne
- **PETG-CF:** 65 °C / 6–8 godzin
- **PA-CF:** 80 °C / 12 godzin — krytyczne
