---
sidebar_position: 4
title: Wybór odpowiedniej płyty roboczej
description: Przegląd płyt roboczych Bambu Labs i która najlepiej pasuje do Twojego filamentu
---

# Wybór odpowiedniej płyty roboczej

Odpowiednia płyta robocza jest kluczowa dla dobrej przyczepności i łatwego usuwania wydruku. Błędna kombinacja prowadzi do słabej przyczepności lub wydruków, które są przyklejone i uszkadzają płytę.

## Tabela przeglądowa

| Filament | Zalecana płyta | Klej w sztyfcie | Temperatura płyty |
|----------|---------------|-----------------|-------------------|
| PLA | Cool Plate / Textured PEI | Nie / Tak | 35–45°C |
| PETG | Textured PEI | **Tak (wymagane)** | 70°C |
| ABS | Engineering Plate / High Temp | Tak | 90–110°C |
| ASA | Engineering Plate / High Temp | Tak | 90–110°C |
| TPU | Textured PEI | Nie | 35–45°C |
| PA (Nylon) | Engineering Plate | Tak | 90°C |
| PC | High Temp Plate | Tak | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Tak | 45–90°C |
| PVA | Cool Plate | Nie | 35°C |

## Opisy płyt

### Cool Plate (Gładkie PEI)
**Najlepsza dla:** PLA, PVA
**Powierzchnia:** Gładka, daje gładką spodnią stronę wydruku
**Usuwanie:** Lekko zegnij płytę lub poczekaj, aż ostygnie — wydruk odejdzie sam

Nie używaj Cool Plate z PETG — przywiera **zbyt mocno** i może uszkodzić powłokę płyty.

### Textured PEI (Teksturowana)
**Najlepsza dla:** PETG, TPU, PLA (daje szorstką powierzchnię)
**Powierzchnia:** Teksturowana, daje szorstką i estetyczną spodnią stronę
**Usuwanie:** Poczekaj do temperatury pokojowej — wydruk odpada sam

:::warning PETG wymaga kleju na Textured PEI
Bez kleju PETG przywiera ekstremalnie mocno do Textured PEI i może uszkodzić powłokę przy usuwaniu. Zawsze nakładaj cienką warstwę kleju w sztyfcie (klej Bambu lub Elmer's Disappearing Purple Glue) na całą powierzchnię.
:::

### Engineering Plate
**Najlepsza dla:** ABS, ASA, PA, PLA-CF, PETG-CF
**Powierzchnia:** Matowa powłoka PEI o niższej przyczepności niż Textured PEI
**Usuwanie:** Łatwa do usunięcia po schłodzeniu. Używaj kleju dla ABS/ASA

### High Temp Plate
**Najlepsza dla:** PC, PA-CF, ABS w wysokich temperaturach
**Powierzchnia:** Wytrzymuje temperatury płyty do 120°C bez deformacji
**Usuwanie:** Schłodź do temperatury pokojowej

## Częste błędy

### PETG na gładkiej Cool Plate (bez kleju)
**Problem:** PETG przywiera tak mocno, że wydruk nie może zostać usunięty bez uszkodzeń
**Rozwiązanie:** Zawsze używaj Textured PEI z klejem lub Engineering Plate

### ABS na Cool Plate
**Problem:** Warping — narożniki uginają się podczas druku
**Rozwiązanie:** Engineering Plate + klej + podwyższenie temperatury komory (zamknij przednie drzwi)

### PLA na High Temp Plate
**Problem:** Zbyt wysoka temperatura płyty daje nadmierną przyczepność, trudne usuwanie
**Rozwiązanie:** Cool Plate lub Textured PEI dla PLA

### Za dużo kleju
**Problem:** Gruby klej powoduje efekt słoniowej stopki (rozlewająca się pierwsza warstwa)
**Rozwiązanie:** Jedna cienka warstwa — klej powinien być ledwo widoczny

## Wymiana płyty

1. **Pozwól płycie ostygnąć** do temperatury pokojowej (lub użyj rękawic — płyta może być gorąca)
2. Unieś płytę od przodu i wyciągnij
3. Włóż nową płytę — magnes utrzyma ją na miejscu
4. **Wykonaj automatyczną kalibrację** (Flow Rate i Bed Leveling) po wymianie w Bambu Studio lub przez panel w **Sterowanie → Kalibracja**

:::info Pamiętaj o kalibracji po wymianie
Płyty mają nieco różną grubość. Bez kalibracji pierwsza warstwa może być za daleko lub uderzyć w płytę.
:::

## Konserwacja płyt

### Czyszczenie (po każdych 2–5 wydrukach)
- Wytrzyj IPA (izopropanolem 70–99%) i bezpyłowym papierem
- Unikaj dotykania powierzchni gołymi rękami — tłuszcz ze skóry zmniejsza przyczepność
- Dla Textured PEI: myj ciepłą wodą z łagodnym detergentem po wielu wydrukach

### Usuwanie resztek kleju
- Podgrzej płytę do 60°C
- Wytrzyj wilgotną szmatką
- Zakończ wycieraniem IPA

### Wymiana
Wymień płytę, gdy widzisz:
- Widoczne wgłębienia lub ślady po usuwaniu wydruków
- Konsekwentnie słabą przyczepność nawet po czyszczeniu
- Bąble lub plamy w powłoce

Płyty Bambu wytrzymują zazwyczaj 200–500 wydruków w zależności od rodzaju filamentu i sposobu użytkowania.

:::tip Prawidłowe przechowywanie płyt
Przechowuj nieużywane płyty w oryginalnym opakowaniu lub pionowo w uchwycie — nie układaj ich w stosy z ciężkimi rzeczami na wierzchu. Odkształcone płyty dają nierówną pierwszą warstwę.
:::
