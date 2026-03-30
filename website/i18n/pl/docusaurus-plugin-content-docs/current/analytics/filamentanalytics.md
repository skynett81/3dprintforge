---
sidebar_position: 3
title: Analiza filamentu
description: Szczegółowa analiza zużycia filamentu, kosztów, prognoz, wskaźników zużycia i odpadów na materiał i dostawcę
---

# Analiza filamentu

Analiza filamentu daje pełny wgląd w zużycie filamentu — co zużywasz, ile to kosztuje i co możesz zaoszczędzić.

Przejdź do: **https://localhost:3443/#filament-analytics**

## Przegląd zużycia

Na górze wyświetlane jest podsumowanie dla wybranego okresu:

- **Łączne zużycie** — gramy i metry dla wszystkich materiałów
- **Szacowany koszt** — na podstawie zarejestrowanej ceny na szpulę
- **Najczęściej używany materiał** — typ i dostawca
- **Wskaźnik ponownego użycia** — udział filamentu w faktycznym modelu vs. podpory/purge

### Zużycie na materiał

Wykres kołowy i tabela pokazują podział między materiałami:

| Kolumna | Opis |
|---|---|
| Materiał | PLA, PETG, ABS, PA itp. |
| Dostawca | Bambu Lab, PolyMaker, Prusament itp. |
| Użyte gramy | Łączna waga |
| Metry | Szacowana długość |
| Koszt | Gramy × cena za gram |
| Wydruki | Liczba wydruków z tym materiałem |

Kliknij wiersz, aby przejść do poziomu pojedynczej szpuli.

## Wskaźniki zużycia

Wskaźnik zużycia pokazuje średnie zużycie filamentu na jednostkę czasu:

- **Gramy na godzinę** — podczas aktywnego drukowania
- **Gramy na tydzień** — włącznie z przestojami drukarki
- **Gramy na wydruk** — średnia na wydruk

Są one używane do obliczania prognoz przyszłego zapotrzebowania.

:::tip Planowanie zakupów
Użyj wskaźnika zużycia do planowania zapasów szpul. System automatycznie ostrzega, gdy szacowany zapas wyczerpie się w ciągu 14 dni (konfigurowalne).
:::

## Prognoza kosztów

Na podstawie historycznego wskaźnika zużycia obliczane są:

- **Szacowane zużycie w ciągu następnych 30 dni** (gramy na materiał)
- **Szacowany koszt w ciągu następnych 30 dni**
- **Zalecany poziom zapasów** (wystarczający na 30 / 60 / 90 dni działania)

Prognoza uwzględnia sezonowość, jeśli masz dane z co najmniej jednego roku.

## Odpady i efektywność

Zobacz [Śledzenie odpadów](./waste), aby uzyskać pełną dokumentację. Analiza filamentu pokazuje podsumowanie:

- **AMS-purge** — gramy i udział w łącznym zużyciu
- **Materiał podporowy** — gramy i udział
- **Faktyczny materiał modelu** — pozostały udział (efektywność %)
- **Szacowany koszt odpadów** — ile kosztują cię odpady

## Dziennik szpul

Wszystkie szpule (aktywne i puste) są rejestrowane:

| Pole | Opis |
|---|---|
| Nazwa szpuli | Nazwa materiału i kolor |
| Oryginalna waga | Zarejestrowana waga przy starcie |
| Pozostała waga | Obliczona pozostałość |
| Użyte | Łącznie użyte gramy |
| Ostatnio użyta | Data ostatniego wydruku |
| Status | Aktywna / Pusta / Zmagazynowana |

## Rejestrowanie cen

Dla dokładnej analizy kosztów, rejestruj ceny na szpulę:

1. Przejdź do **Magazyn filamentów**
2. Kliknij szpulę → **Edytuj**
3. Wprowadź **Cenę zakupu** i **Wagę przy zakupie**
4. System automatycznie oblicza cenę za gram

Szpule bez zarejestrowanej ceny używają **standardowej ceny za gram** (ustawionej w **Ustawienia → Filament → Cena domyślna**).

## Eksport

1. Kliknij **Eksportuj dane filamentu**
2. Wybierz okres i format (CSV / PDF)
3. CSV zawiera jeden wiersz na wydruk z gramami, kosztem i materiałem
