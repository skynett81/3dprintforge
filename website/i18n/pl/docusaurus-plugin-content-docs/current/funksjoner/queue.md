---
sidebar_position: 5
title: Kolejka wydruków
description: Planuj i automatyzuj wydruki z priorytetową kolejką, automatycznym wysyłaniem i rozłożonym startem
---

# Kolejka wydruków

Kolejka wydruków pozwala planować wydruki z wyprzedzeniem i automatycznie wysyłać je do dostępnych drukarek, gdy są bezczynne.

Przejdź do: **https://localhost:3443/#queue**

## Tworzenie kolejki

1. Przejdź do **Kolejka wydruków** w menu nawigacyjnym
2. Kliknij **Nowe zadanie** (ikona +)
3. Wypełnij:
   - **Nazwa pliku** — prześlij `.3mf` lub `.gcode`
   - **Docelowa drukarka** — wybierz konkretną drukarkę lub **Automatyczna**
   - **Priorytet** — Niski / Normalny / Wysoki / Krytyczny
   - **Planowany start** — teraz lub określona data/godzina
4. Kliknij **Dodaj do kolejki**

:::tip Przeciągnij i upuść
Możesz przeciągać pliki bezpośrednio z eksploratora plików na stronę kolejki, aby szybko je dodać.
:::

## Dodawanie plików

### Prześlij plik

1. Kliknij **Prześlij** lub przeciągnij plik do pola przesyłania
2. Obsługiwane formaty: `.3mf`, `.gcode`, `.bgcode`
3. Plik jest zapisywany w bibliotece plików i powiązany z zadaniem kolejki

### Z biblioteki plików

1. Przejdź do **Biblioteka plików** i znajdź plik
2. Kliknij **Dodaj do kolejki** na pliku
3. Zadanie zostaje utworzone z domyślnymi ustawieniami — edytuj w razie potrzeby

### Z historii

1. Otwórz poprzedni wydruk w **Historii**
2. Kliknij **Drukuj ponownie**
3. Zadanie zostaje dodane z tymi samymi ustawieniami co poprzednio

## Priorytet

Kolejka jest przetwarzana w kolejności priorytetu:

| Priorytet | Kolor | Opis |
|---|---|---|
| Krytyczny | Czerwony | Wysyłany do pierwszej dostępnej drukarki niezależnie od innych zadań |
| Wysoki | Pomarańczowy | Przed zadaniami normalnymi i niskimi |
| Normalny | Niebieski | Standardowa kolejność (FIFO) |
| Niski | Szary | Wysyłany tylko gdy nie czekają zadania o wyższym priorytecie |

Przeciągnij i upuść zadania w kolejce, aby ręcznie zmienić kolejność w ramach tego samego poziomu priorytetu.

## Automatyczne wysyłanie

Gdy **Automatyczne wysyłanie** jest aktywowane, Bambu Dashboard monitoruje wszystkie drukarki i automatycznie wysyła następne zadanie:

1. Przejdź do **Ustawienia → Kolejka**
2. Włącz **Automatyczne wysyłanie**
3. Wybierz **Strategię wysyłania**:
   - **Pierwsza wolna** — wysyła do pierwszej drukarki, która staje się dostępna
   - **Najmniej używana** — preferuje drukarkę z najmniejszą liczbą wydruków w ciągu dnia
   - **Round-robin** — równomiernie rotuje między wszystkimi drukarkami

:::warning Potwierdzenie
Aktywuj **Wymagaj potwierdzenia** w ustawieniach, jeśli chcesz ręcznie zatwierdzać każde wysłanie przed wysłaniem pliku.
:::

## Rozłożony start (staggered start)

Rozłożony start jest przydatny, aby uniknąć sytuacji, gdy wszystkie drukarki zaczynają i kończą jednocześnie:

1. W oknie dialogowym **Nowe zadanie** rozwiń **Zaawansowane ustawienia**
2. Aktywuj **Rozłożony start**
3. Ustaw **Opóźnienie między drukarkami** (np. 30 minut)
4. System automatycznie rozdziela czasy startu

**Przykład:** 4 identyczne zadania z 30-minutowym opóźnieniem startują o 08:00, 08:30, 09:00 i 09:30.

## Status kolejki i śledzenie

Przegląd kolejki wyświetla wszystkie zadania ze statusem:

| Status | Opis |
|---|---|
| Oczekujące | Zadanie w kolejce, oczekuje na drukarkę |
| Zaplanowane | Ma zaplanowany czas startu w przyszłości |
| Wysyłanie | Transferowane do drukarki |
| Drukowanie | Trwa na wybranej drukarce |
| Ukończone | Gotowe — powiązane z historią |
| Nieudane | Błąd podczas wysyłania lub drukowania |
| Anulowane | Ręcznie anulowane |

:::info Powiadomienia
Aktywuj powiadomienia o zdarzeniach kolejki w **Ustawienia → Powiadomienia → Kolejka**, aby otrzymywać wiadomości gdy zadanie się rozpoczyna, kończy lub zawodzi. Zobacz [Powiadomienia](./notifications).
:::
