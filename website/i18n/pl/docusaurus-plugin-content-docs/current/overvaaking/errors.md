---
sidebar_position: 2
title: Dziennik błędów
description: Kompletny przegląd kodów błędów HMS z drukarek z poziomem powagi, wyszukiwaniem i linkami do Bambu Wiki
---

# Dziennik błędów

Dziennik błędów zbiera wszystkie błędy i alerty HMS (Health, Maintenance, Safety) z Twoich drukarek. Bambu Dashboard posiada wbudowaną bazę danych z 269+ kodami HMS dla drukarek Bambu Lab.

Przejdź do: **https://localhost:3443/#errors**

## Kody HMS

Drukarki Bambu Lab wysyłają kody HMS przez MQTT gdy coś jest nie w porządku. Bambu Dashboard automatycznie tłumaczy je na czytelne komunikaty błędów:

| Kod | Przykład | Kategoria |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Dysza/wytłaczacz |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Płyta robocza |
| `0700 0500 0001 0001` | MC disconnect | Elektronika |

Kompletna lista obejmuje wszystkie 269+ znanych kodów dla X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D i H2C.

## Poziom powagi

Błędy są klasyfikowane na czterech poziomach:

| Poziom | Kolor | Opis |
|---|---|---|
| **Krytyczny** | Czerwony | Wymaga natychmiastowego działania — wydruk zatrzymany |
| **Wysoki** | Pomarańczowy | Należy szybko zająć się — wydruk może być kontynuowany |
| **Średni** | Żółty | Wymaga sprawdzenia — brak bezpośredniego zagrożenia |
| **Info** | Niebieski | Wiadomość informacyjna, brak wymaganego działania |

## Wyszukiwanie i filtrowanie

Użyj paska narzędzi u góry dziennika błędów:

1. **Wyszukiwanie pełnotekstowe** — szukaj w komunikacie błędu, kodzie HMS lub opisie drukarki
2. **Drukarka** — pokaż błędy tylko z jednej drukarki
3. **Kategoria** — AMS / Dysza / Płyta / Elektronika / Kalibracja / Inne
4. **Poziom powagi** — Wszystkie / Krytyczny / Wysoki / Średni / Info
5. **Data** — filtruj według zakresu dat
6. **Niepotwierzone** — pokaż tylko niepotwierdzony błędy

Kliknij **Wyczyść filtr**, aby zobaczyć wszystkie błędy.

## Linki do Wiki

Dla każdego kodu HMS wyświetlany jest link do Bambu Lab Wiki z:

- Pełnym opisem błędu
- Możliwymi przyczynami
- Przewodnikiem krok po kroku do rozwiązywania problemów
- Oficjalnymi zaleceniami Bambu Lab

Kliknij **Otwórz wiki** na wpisie błędu, aby otworzyć odpowiednią stronę wiki w nowej karcie.

:::tip Lokalna kopia
Bambu Dashboard buforuje zawartość wiki lokalnie do użytku offline. Zawartość jest aktualizowana automatycznie co tydzień.
:::

## Potwierdzanie błędów

Potwierdzenie oznacza błąd jako rozwiązany bez jego usuwania:

1. Kliknij błąd na liście
2. Kliknij **Potwierdź** (ikona znacznika)
3. Opcjonalnie wpisz notatkę o tym, co zostało zrobione
4. Błąd jest oznaczany znacznikiem i przenoszony do listy „Potwierdzone"

### Masowe potwierdzanie

1. Wybierz wiele błędów za pomocą pól wyboru
2. Kliknij **Potwierdź wybrane**
3. Wszystkie wybrane błędy są potwierdzane jednocześnie

## Statystyki

U góry dziennika błędów wyświetlane są:

- Łączna liczba błędów w ciągu ostatnich 30 dni
- Liczba niepotwierdzone błędów
- Najczęściej występujący kod HMS
- Drukarka z największą liczbą błędów

## Eksport

1. Kliknij **Eksportuj** (ikona pobierania)
2. Wybierz format: **CSV** lub **JSON**
3. Filtr jest stosowany do eksportu — najpierw ustaw żądany filtr
4. Plik zostaje automatycznie pobrany

## Powiadomienia o nowych błędach

Aktywuj powiadomienia dla nowych błędów HMS:

1. Przejdź do **Ustawienia → Powiadomienia**
2. Zaznacz **Nowe błędy HMS**
3. Wybierz minimalny poziom powagi do powiadamiania (zalecane: **Wysoki** i powyżej)
4. Wybierz kanał powiadomień

Zobacz [Powiadomienia](../funksjoner/notifications) dla konfiguracji kanałów.
