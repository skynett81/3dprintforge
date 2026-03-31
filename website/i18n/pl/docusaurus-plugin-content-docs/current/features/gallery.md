---
sidebar_position: 8
title: Galeria
description: Przeglądaj zrzuty ekranu wykonane automatycznie przy 25, 50, 75 i 100% postępu dla wszystkich wydruków
---

# Galeria

Galeria zbiera automatyczne zrzuty ekranu robione podczas każdego wydruku. Zdjęcia są robione przy stałych kamieniach milowych i zapewniają wizualny dziennik postępu wydruku.

Przejdź do: **https://localhost:3443/#gallery**

## Zrzuty ekranu przy kamieniach milowych

3DPrintForge automatycznie robi zrzut ekranu z kamery przy następujących kamieniach milowych:

| Kamień milowy | Czas |
|---|---|
| **25%** | Jedna czwarta wydruku |
| **50%** | W połowie |
| **75%** | Trzy czwarte |
| **100%** | Wydruk ukończony |

Zrzuty ekranu są zapisywane i powiązane z odpowiednim wpisem historii wydruków i wyświetlane w galerii.

:::info Wymagania
Zrzuty ekranu przy kamieniach milowych wymagają podłączonej i aktywnej kamery. Wyłączone kamery nie generują zdjęć.
:::

## Aktywacja funkcji zrzutów ekranu

1. Przejdź do **Ustawienia → Galeria**
2. Włącz **Automatyczne zrzuty ekranu przy kamieniach milowych**
3. Wybierz, które kamienie milowe chcesz aktywować (domyślnie wszystkie cztery są włączone)
4. Wybierz **Jakość zdjęcia**: Niska (640×360) / Średnia (1280×720) / Wysoka (1920×1080)
5. Kliknij **Zapisz**

## Przeglądanie zdjęć

Galeria jest zorganizowana według wydruków:

1. Użyj **filtru** u góry, aby wybrać drukarkę, datę lub nazwę pliku
2. Kliknij wiersz wydruku, aby go rozwinąć i zobaczyć wszystkie cztery zdjęcia
3. Kliknij zdjęcie, aby otworzyć podgląd

### Podgląd

Podgląd wyświetla:
- Zdjęcie w pełnym rozmiarze
- Kamień milowy i znacznik czasu
- Nazwę wydruku i drukarkę
- **←** / **→** do przechodzenia między zdjęciami tego samego wydruku

## Widok pełnoekranowy

Kliknij **Pełny ekran** (lub naciśnij `F`) w podglądzie, aby wypełnić cały ekran. Użyj klawiszy strzałek, aby przeglądać zdjęcia.

## Pobieranie zdjęć

- **Pojedyncze zdjęcie**: Kliknij **Pobierz** w podglądzie
- **Wszystkie zdjęcia dla wydruku**: Kliknij **Pobierz wszystkie** w wierszu wydruku — otrzymasz plik `.zip`
- **Wybierz wiele**: Zaznacz pola wyboru i kliknij **Pobierz wybrane**

## Usuwanie zdjęć

:::warning Miejsce na dysku
Zdjęcia z galerii mogą z czasem zajmować znaczne miejsce. Skonfiguruj automatyczne usuwanie starych zdjęć.
:::

### Ręczne usuwanie

1. Wybierz jedno lub więcej zdjęć (zaznacz pole wyboru)
2. Kliknij **Usuń wybrane**
3. Potwierdź w oknie dialogowym

### Automatyczne porządkowanie

1. Przejdź do **Ustawienia → Galeria → Automatyczne porządkowanie**
2. Aktywuj **Usuń zdjęcia starsze niż**
3. Ustaw liczbę dni (np. 90 dni)
4. Porządkowanie jest uruchamiane automatycznie każdej nocy o 03:00

## Powiązanie z historią wydruków

Każde zdjęcie jest powiązane z wpisem wydruku w historii:

- Kliknij **Pokaż w historii** przy wydruku w galerii, aby przejść do wpisu historii
- W historii wyświetlana jest miniatura zdjęcia 100%, jeśli istnieje

## Udostępnianie

Udostępnij zdjęcie z galerii za pomocą linku z ograniczonym czasem ważności:

1. Otwórz zdjęcie w podglądzie
2. Kliknij **Udostępnij**
3. Wybierz czas wygaśnięcia i skopiuj link
