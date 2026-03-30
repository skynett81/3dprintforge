---
sidebar_position: 2
title: Warping
description: Przyczyny warpingu i rozwiązania — obudowa, brim, temperatura i osłona przed przeciągiem
---

# Warping

Warping pojawia się gdy narożniki lub krawędzie wydruku unoszą się od płyty podczas lub po drukowaniu. Jest spowodowany termicznym skurczem materiału.

## Czym jest warping?

Gdy plastik ostygnie, kurczy się. Górne warstwy są cieplejsze niż dolne — to tworzy napięcie, które ciągnie krawędzie w górę i wygina wydruk. Im większa różnica temperatur, tym więcej warpingu.

## Materiały najbardziej narażone

| Materiał | Ryzyko warpingu | Wymaga obudowy |
|-----------|-------------|-----------------|
| PLA | Niskie | Nie |
| PETG | Niskie–Umiarkowane | Nie |
| ABS | Wysokie | Tak |
| ASA | Wysokie | Tak |
| PA/Nylon | Bardzo wysokie | Tak |
| PC | Bardzo wysokie | Tak |
| TPU | Niskie | Nie |

## Rozwiązania

### 1. Użyj obudowy (komory)

Najważniejszy środek dla ABS, ASA, PA i PC:
- Utrzymuj temperaturę komory 40–55 °C dla najlepszych wyników
- X1C i P1S: aktywuj wentylatory komory w trybie "zamkniętym"
- A1/P1P: użyj pokrywy ochronnej, aby zatrzymać ciepło

### 2. Użyj brim

Brim to pojedyncza warstwa z szerszymi krawędziami przytrzymująca wydruk na płycie:

```
Bambu Studio:
1. Wybierz wydruk w slicerze
2. Przejdź do Support → Brim
3. Ustaw szerokość na 5–10 mm (im więcej warpingu, tym szersza)
4. Typ: Outer Brim Only (zalecany)
```

:::tip Przewodnik po szerokości brim
- PLA (rzadko potrzebny): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Zwiększ temperaturę stołu

Wyższa temperatura stołu zmniejsza różnicę temperatur między warstwami:
- ABS: spróbuj 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Zmniejsz chłodzenie

Dla materiałów skłonnych do warpingu — zmniejsz lub wyłącz chłodzenie:
- ABS/ASA: 0–20% chłodzenia
- PA: 0–30% chłodzenia

### 5. Unikaj przeciągów i zimnego powietrza

Trzymaj drukarkę z dala od:
- Okien i drzwi zewnętrznych
- Klimatyzacji i wentylatorów
- Przeciągów w pomieszczeniu

Dla P1P i A1: zasłaniaj otwory kartonem podczas krytycznych wydruków.

### 6. Osłona przed przeciągiem (Draft Shield)

Osłona przed przeciągiem to cienka ścianka wokół obiektu zatrzymująca ciepło w środku:

```
Bambu Studio:
1. Przejdź do Support → Draft Shield
2. Aktywuj i ustaw odległość (3–5 mm)
```

Szczególnie przydatna dla wysokich, smukłych obiektów.

### 7. Środki w projekcie modelu

Przy projektowaniu własnych modeli:
- Unikaj dużych płaskich spodów (dodaj fazy/zaokrąglenia w narożnikach)
- Dziel duże płaskie części na mniejsze sekcje
- Używaj "mysich uszu" — małe kółka w narożnikach — w slicerze lub CAD

## Warping po ostudzeniu

Czasami wydruk wygląda dobrze, ale warping pojawia się po usunięciu z płyty:
- Zawsze czekaj, aż płyta i wydruk będą **całkowicie ostudzone** (poniżej 40 °C) przed usunięciem
- Dla ABS: pozwól ostygnąć wewnątrz zamkniętej komory dla wolniejszego chłodzenia
- Unikaj stawiania gorącego wydruku na zimnej powierzchni
