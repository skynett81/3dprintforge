---
sidebar_position: 1
title: Statystyki
description: Wskaźnik sukcesu, zużycie filamentu, trendy i kluczowe wskaźniki dla wszystkich drukarek Bambu Lab w czasie
---

# Statystyki

Strona statystyk zapewnia kompletny przegląd aktywności drukowania z kluczowymi wskaźnikami, trendami i zużyciem filamentu przez wybrany okres.

Przejdź do: **https://localhost:3443/#statistics**

## Kluczowe wskaźniki

Na górze strony wyświetlane są cztery karty KPI:

| Wskaźnik | Opis |
|---|---|
| **Wskaźnik sukcesu** | Odsetek udanych wydruków z łącznej liczby |
| **Łączny filament** | Użyte gramy w wybranym okresie |
| **Łączny czas drukowania** | Skumulowany czas drukowania |
| **Średni czas wydruku** | Mediana czasu trwania na wydruk |

Każdy wskaźnik pokazuje zmianę w porównaniu z poprzednim okresem (↑ wzrost / ↓ spadek) jako odchylenie procentowe.

## Wskaźnik sukcesu

Wskaźnik sukcesu jest obliczany per drukarka i łącznie:

- **Udany** — wydruk ukończony bez przerwania
- **Przerwany** — ręcznie zatrzymany przez użytkownika
- **Nieudany** — zatrzymany przez Print Guard, błąd HMS lub awarię sprzętu

Kliknij wykres wskaźnika sukcesu, aby zobaczyć, które wydruki się nie powiodły i z jakiego powodu.

:::tip Popraw wskaźnik sukcesu
Użyj [Analizy wzorców błędów](../monitoring/erroranalysis), aby zidentyfikować i naprawić przyczyny nieudanych wydruków.
:::

## Trendy

Widok trendów pokazuje rozwój w czasie jako wykres liniowy:

1. Wybierz **Okres**: Ostatnie 7 / 30 / 90 / 365 dni
2. Wybierz **Grupowanie**: Dzień / Tydzień / Miesiąc
3. Wybierz **Wskaźnik**: Liczba wydruków / Godziny / Gramy / Wskaźnik sukcesu
4. Kliknij **Porównaj**, aby nałożyć dwa wskaźniki

Wykres obsługuje zoom (przewijanie) i przesuwanie (kliknij i przeciągnij).

## Zużycie filamentu

Zużycie filamentu jest wyświetlane jako:

- **Wykres słupkowy** — zużycie dzienne/tygodniowe/miesięczne
- **Wykres kołowy** — podział między materiałami (PLA, PETG, ABS itp.)
- **Tabela** — szczegółowa lista z łącznymi gramami, metrami i kosztem per materiał

### Zużycie per drukarka

Użyj filtru z wielokrotnym wyborem u góry, aby:
- Pokazać tylko jedną drukarkę
- Porównać dwie drukarki obok siebie
- Zobaczyć zagregowany łączny wynik dla wszystkich drukarek

## Kalendarz aktywności

Zobacz kompaktową mapę cieplną w stylu GitHub bezpośrednio na stronie statystyk (uproszczony widok) lub przejdź do pełnego [Kalendarza aktywności](./calendar) dla bardziej szczegółowego widoku.

## Eksport

1. Kliknij **Eksportuj statystyki**
2. Wybierz zakres dat i które wskaźniki chcesz uwzględnić
3. Wybierz format: **CSV** (dane surowe), **PDF** (raport) lub **JSON**
4. Plik zostaje pobrany

Eksport CSV jest kompatybilny z Excelem i Google Sheets do dalszej analizy.

## Porównanie z poprzednim okresem

Aktywuj **Pokaż poprzedni okres**, aby nałożyć wykresy odpowiedniego poprzedniego okresu:

- Ostatnie 30 dni vs. 30 dni wcześniej
- Bieżący miesiąc vs. poprzedni miesiąc
- Bieżący rok vs. poprzedni rok

Ułatwia to sprawdzenie, czy drukujesz więcej czy mniej niż wcześniej, i czy wskaźnik sukcesu się poprawia.
