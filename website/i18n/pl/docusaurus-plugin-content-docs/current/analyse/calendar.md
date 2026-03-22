---
sidebar_position: 2
title: Kalendarz aktywności
description: Kalendarz w stylu GitHub heatmap pokazujący aktywność drukarki dzień po dniu przez cały rok z wyborem roku i widokiem szczegółów
---

# Kalendarz aktywności

Kalendarz aktywności wyświetla wizualny przegląd aktywności drukowania przez cały rok — inspirowany widokiem wkładów GitHub.

Przejdź do: **https://localhost:3443/#calendar**

## Przegląd heatmapy

Kalendarz pokazuje 365 dni (52 tygodnie) jako siatkę kolorowych kwadratów:

- **Szary** — brak wydruków tego dnia
- **Jasnozielony** — 1–2 wydruki
- **Zielony** — 3–5 wydruków
- **Ciemnozielony** — 6–10 wydruków
- **Głęboka zieleń** — 11+ wydruków

Kwadraty są ułożone z dniami tygodnia w pionie (Pon–Nie) i tygodniami w poziomie od lewej (styczeń) do prawej (grudzień).

:::tip Kodowanie kolorami
Możesz zmienić metrykę heatmapy z **Liczba wydruków** na **Godziny** lub **Gramy filamentu** za pomocą selektora nad kalendarzem.
:::

## Wybór roku

Kliknij **< Rok >**, aby nawigować między latami:

- Wszystkie lata z zarejestrowaną aktywnością drukowania są dostępne
- Bieżący rok jest wyświetlany domyślnie
- Przyszłość jest szara (brak danych)

## Widok szczegółów dnia

Kliknij kwadrat, aby zobaczyć szczegóły dla danego dnia:

- **Data** i dzień tygodnia
- **Liczba wydruków** — udane i nieudane
- **Łączny użyty filament** (gram)
- **Łączne godziny drukowania**
- **Lista wydruków** — kliknij, aby otworzyć w historii

## Przegląd miesięczny

Poniżej heatmapy wyświetlany jest przegląd miesięczny z:
- Łącznymi wydrukami na miesiąc jako wykres słupkowy
- Wyróżnionym najlepszym dniem miesiąca
- Porównaniem z tym samym miesiącem rok wcześniej (%)

## Filtr drukarek

Wybierz drukarkę z listy rozwijanej u góry, aby wyświetlić aktywność tylko dla jednej drukarki, lub wybierz **Wszystkie** dla widoku zagregowanego.

Widok wielu drukarek pokazuje ułożone kolory po kliknięciu **Ułożone** w selektorze widoku.

## Serie i rekordy

Poniżej kalendarza wyświetlane są:

| Statystyka | Opis |
|---|---|
| **Najdłuższa seria** | Największa liczba kolejnych dni z przynajmniej jednym wydrukiem |
| **Bieżąca seria** | Trwająca seria aktywnych dni |
| **Najbardziej aktywny dzień** | Dzień z największą łączną liczbą wydruków |
| **Najbardziej aktywny tydzień** | Tydzień z największą liczbą wydruków |
| **Najbardziej aktywny miesiąc** | Miesiąc z największą liczbą wydruków |

## Eksport

Kliknij **Eksportuj**, aby pobrać dane kalendarza:

- **PNG** — obraz heatmapy (do udostępniania)
- **CSV** — dane surowe z jednym wierszem na dzień (data, liczba, gramy, godziny)

Eksport PNG jest zoptymalizowany do udostępniania w mediach społecznościowych z nazwą drukarki i rokiem jako podpisem.
