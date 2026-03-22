---
sidebar_position: 6
title: Porównanie wydruków
description: Porównaj dwa wydruki obok siebie ze szczegółowymi metrykami, wykresami i zdjęciami galerii do analizy A/B
---

# Porównanie wydruków

Porównanie wydruków pozwala analizować dwa wydruki obok siebie — przydatne do porównywania ustawień, materiałów, drukarek lub wersji tego samego modelu.

Przejdź do: **https://localhost:3443/#comparison**

## Wybór wydruków do porównania

1. Przejdź do **Porównanie wydruków**
2. Kliknij **Wybierz wydruk A** i wyszukaj w historii
3. Kliknij **Wybierz wydruk B** i wyszukaj w historii
4. Kliknij **Porównaj**, aby załadować widok porównania

:::tip Szybszy dostęp
Z **Historii** możesz kliknąć prawym przyciskiem myszy na wydruku i wybrać **Ustaw jako wydruk A** lub **Porównaj z...**, aby przejść bezpośrednio do trybu porównania.
:::

## Porównanie metryk

Metryki są wyświetlane w dwóch kolumnach (A i B) z zaznaczeniem, która jest lepsza:

| Metryka | Opis |
|---|---|
| Sukces | Ukończony / Przerwany / Nieudany |
| Czas trwania | Łączny czas drukowania |
| Zużycie filamentu | Gramy łącznie i na kolor |
| Efektywność filamentu | % modelu z łącznego zużycia |
| Maks. temperatura dyszy | Najwyższa zarejestrowana temperatura dyszy |
| Maks. temperatura stołu | Najwyższa zarejestrowana temperatura stołu |
| Ustawienie prędkości | Cichy / Standardowy / Sport / Turbo |
| Zmiany AMS | Liczba zmian kolorów |
| Błędy HMS | Ewentualne błędy podczas drukowania |
| Drukarka | Która drukarka została użyta |

Komórki z lepszą wartością są wyświetlane z zielonym tłem.

## Wykresy temperatury

Dwa wykresy temperatury są wyświetlane obok siebie (lub nałożone):

- **Widok oddzielny** — wykres A po lewej, wykres B po prawej
- **Widok nałożony** — oba na tym samym wykresie w różnych kolorach

Użyj widoku nałożonego, aby bezpośrednio zobaczyć stabilność temperatury i szybkość nagrzewania.

## Zdjęcia galerii

Jeśli oba wydruki mają zrzuty ekranu z etapów, są wyświetlane w siatce:

| Wydruk A | Wydruk B |
|---|---|
| Zdjęcie 25% A | Zdjęcie 25% B |
| Zdjęcie 50% A | Zdjęcie 50% B |
| Zdjęcie 75% A | Zdjęcie 75% B |
| Zdjęcie 100% A | Zdjęcie 100% B |

Kliknij zdjęcie, aby otworzyć podgląd pełnoekranowy z animacją przesuwania.

## Porównanie timelapse

Jeśli oba wydruki mają timelapse, filmy są wyświetlane obok siebie:

- Zsynchronizowane odtwarzanie — oba startują i zatrzymują się jednocześnie
- Niezależne odtwarzanie — steruj każdym filmem oddzielnie

## Różnice w ustawieniach

System automatycznie podkreśla różnice w ustawieniach drukowania (pobrane z metadanych G-kodu):

- Różne grubości warstw
- Różne wzory lub procenty wypełnienia
- Różne ustawienia podpór
- Różne profile prędkości

Różnice są wyświetlane z pomarańczowym podkreśleniem w tabeli ustawień.

## Zapisywanie porównania

1. Kliknij **Zapisz porównanie**
2. Nadaj porównaniu nazwę (np. „PLA vs PETG - Benchy")
3. Porównanie jest zapisywane i dostępne w **Historia → Porównania**

## Eksport

1. Kliknij **Eksportuj**
2. Wybierz **PDF** dla raportu ze wszystkimi metrykami i zdjęciami
3. Raport można połączyć z projektem w celu dokumentowania wyboru materiałów
