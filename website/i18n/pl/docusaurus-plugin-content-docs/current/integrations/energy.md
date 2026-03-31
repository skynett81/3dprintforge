---
sidebar_position: 2
title: Cena prądu
description: Połącz z Tibber lub Nordpool dla cen godzinowych na żywo, historii cen i alertów cenowych
---

# Cena prądu

Integracja cen prądu pobiera ceny prądu na żywo z Tibber lub Nordpool, aby zapewnić dokładne obliczenia kosztów prądu na wydruk i alerty o dobrych lub złych porach drukowania.

Przejdź do: **https://localhost:3443/#settings** → **Integracje → Cena prądu**

## Integracja Tibber

Tibber to dostawca prądu z otwartym API dla cen spotowych.

### Konfiguracja

1. Zaloguj się na [developer.tibber.com](https://developer.tibber.com)
2. Wygeneruj **Personal Access Token**
3. W 3DPrintForge: wklej token w **Token API Tibber**
4. Wybierz **Dom** (skąd mają być pobierane ceny, jeśli masz kilka domów)
5. Kliknij **Testuj połączenie**
6. Kliknij **Zapisz**

### Dostępne dane z Tibber

- **Cena spotowa teraz** — natychmiastowa cena z podatkami (zł/kWh)
- **Ceny na następne 24 godziny** — Tibber dostarcza jutrzejsze ceny od ok. godz. 13:00
- **Historia cen** — do 30 dni wstecz
- **Koszt na wydruk** — obliczony na podstawie rzeczywistego czasu drukowania × cen godzinowych

## Integracja Nordpool

Nordpool to giełda energii dostarczająca surowe ceny spotowe dla krajów nordyckich.

### Konfiguracja

1. Przejdź do **Integracje → Nordpool**
2. Wybierz **Obszar cenowy**: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen)
3. Wybierz **Walutę**: NOK / EUR
4. Wybierz **Podatki i opłaty**:
   - Zaznacz **Uwzględnij VAT** (25%)
   - Wpisz **Opłatę sieciową** (zł/kWh) — sprawdź fakturę od operatora sieci
   - Wpisz **Podatek od zużycia energii** (zł/kWh)
5. Kliknij **Zapisz**

:::info Opłata sieciowa
Opłata sieciowa różni się w zależności od operatora i modelu cenowego. Sprawdź swoją ostatnią fakturę za prąd dla właściwej stawki.
:::

## Ceny godzinowe

Ceny godzinowe są wyświetlane jako wykres słupkowy na kolejne 24–48 godzin:

- **Zielony** — tanie godziny (poniżej średniej)
- **Żółty** — cena średnia
- **Czerwony** — drogie godziny (powyżej średniej)
- **Szary** — godziny bez dostępnej prognozy cenowej

Najedź na godzinę, aby zobaczyć dokładną cenę (zł/kWh).

## Historia cen

Przejdź do **Cena prądu → Historia**, aby zobaczyć:

- Dzienną średnią cenę za ostatnie 30 dni
- Najdroższą i najtańszą godzinę każdego dnia
- Łączny koszt prądu dla wydruków dziennie

## Alerty cenowe

Skonfiguruj automatyczne alerty na podstawie ceny prądu:

1. Przejdź do **Cena prądu → Alerty cenowe**
2. Kliknij **Nowy alert**
3. Wybierz typ alertu:
   - **Cena poniżej progu** — alert, gdy cena prądu spada poniżej X zł/kWh
   - **Cena powyżej progu** — alert, gdy cena przekracza X zł/kWh
   - **Najtańsza godzina dzisiaj** — alert, gdy zaczyna się najtańsza godzina dnia
4. Wybierz kanał powiadomień
5. Kliknij **Zapisz**

:::tip Inteligentne planowanie
Połącz alerty cenowe z kolejką wydruków: skonfiguruj automatyzację, która automatycznie wysyła zadania z kolejki, gdy cena prądu jest niska (wymaga integracji webhook lub Home Assistant).
:::

## Cena prądu w kalkulatorze kosztów

Aktywowana integracja cen prądu zapewnia dokładne koszty prądu w [Kalkulatorze kosztów](../analytics/costestimator). Wybierz **Cena na żywo** zamiast stałej ceny, aby użyć aktualnej ceny Tibber/Nordpool.
