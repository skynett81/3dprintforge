---
sidebar_position: 4
title: Smarowanie
description: Smarowanie prętów liniowych, łożysk i interwały dla drukarek Bambu Lab
---

# Smarowanie

Właściwe smarowanie ruchomych części zmniejsza zużycie, obniża poziom hałasu i zapewnia precyzyjny ruch. Drukarki Bambu Lab używają liniowych systemów ruchu wymagających okresowego smarowania.

## Typy smarów

| Komponent | Typ smaru | Produkt |
|-----------|-------------|---------|
| Pręty liniowe (XY) | Lekki olej maszynowy lub spray PTFE | 3-in-1, Super Lube |
| Wrzeciono osi Z | Gęsty smar | Super Lube smar |
| Liniowe łożyska | Lekki smar litowy | Smar Bambu Lab |
| Łańcuchy kablowe | Brak (na sucho) | — |

## Pręty liniowe

### Osie X i Y
Pręty to polerowane stalowe pręty ślizgające się przez liniowe łożyska:

```
Interwał: Co 200–300 godzin lub przy skrzypiacych dźwiękach
Ilość: Bardzo mała — jedna kropla na punkt pręta wystarczy
Metoda:
1. Wyłącz drukarkę
2. Przesuń wózek ręcznie na koniec
3. Nałóż 1 kroplę lekkiego oleju w środku pręta
4. Przesuń wózek powoli tam i z powrotem 10 razy
5. Wytrzyj nadmiar oleju bezpyłowym papierem
```

:::warning Nie przesmarowuj
Zbyt dużo oleju przyciąga pył i tworzy ścierną pastę. Używaj minimalnych ilości i zawsze wycieraj nadmiar.
:::

### Oś Z (pionowa)
Oś Z używa wrzeciona (śruby prowadzącej) wymagającej smaru (nie oleju):

```
Interwał: Co 200 godzin
Metoda:
1. Wyłącz drukarkę
2. Nanieś cienką warstwę smaru wzdłuż wrzeciona
3. Uruchom oś Z w górę i w dół ręcznie (lub przez menu konserwacji)
4. Smar jest automatycznie rozprowadzany
```

## Liniowe łożyska

Bambu Lab P1S i X1C używają liniowych łożysk (MGN12) na osi Y:

```
Interwał: Co 300–500 godzin
Metoda:
1. Usuń nieco smaru igłą lub wykałaczką z otworu wlotowego
2. Wstrzyknij nowy smar strzykawką z cienką kaniulą
3. Uruchom oś tam i z powrotem, aby rozprowadzić smar
```

Bambu Lab sprzedaje oficjalny smar (Bambu Lubricant) skalibrowany dla systemu.

## Konserwacja smarowania dla różnych modeli

### X1C / P1S
- Oś Y: Liniowe łożyska — smar Bambu
- Oś X: Pręty węglowe — lekki olej
- Oś Z: Podwójne wrzeciono — smar Bambu

### A1 / A1 Mini
- Wszystkie osie: Pręty stalowe — lekki olej
- Oś Z: Pojedyncze wrzeciono — smar Bambu

## Oznaki konieczności smarowania

- **Skrzypiące lub szurające dźwięki** przy ruchu
- **Wzorce wibracji** widoczne na pionowych ścianach (VFA)
- **Niedokładne wymiary** bez innych przyczyn
- **Zwiększona głośność** systemu ruchu

## Interwały smarowania

| Czynność | Interwał |
|-----------|---------|
| Olej pręty XY | Co 200–300 godzin |
| Smar wrzeciono Z | Co 200 godzin |
| Smar liniowe łożyska (X1C/P1S) | Co 300–500 godzin |
| Pełny cykl konserwacji | Półrocznie (lub 500 godzin) |

Używaj modułu konserwacji w dashboardzie do automatycznego śledzenia interwałów.
