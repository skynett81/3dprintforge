---
sidebar_position: 4
title: Konserwacja
description: Śledź wymianę dysz, smarowanie i inne zadania konserwacyjne z przypomnieniami, interwałami i dziennikiem kosztów
---

# Konserwacja

Moduł konserwacji pomaga planować i śledzić wszystkie prace konserwacyjne drukarek Bambu Lab — od wymiany dysz po smarowanie prowadnic.

Przejdź do: **https://localhost:3443/#maintenance**

## Plan konserwacji

Bambu Dashboard jest dostarczany z wstępnie skonfigurowanymi interwałami konserwacji dla wszystkich modeli drukarek Bambu Lab:

| Zadanie | Interwał (standardowy) | Model |
|---|---|---|
| Wyczyść dyszę | Co 200 godzin | Wszystkie |
| Wymień dyszę (mosiądz) | Co 500 godzin | Wszystkie |
| Wymień dyszę (hartowana) | Co 2000 godzin | Wszystkie |
| Posmaruj oś X | Co 300 godzin | X1C, P1S |
| Posmaruj oś Z | Co 300 godzin | Wszystkie |
| Wyczyść koła zębate AMS | Co 200 godzin | AMS |
| Wyczyść komorę | Co 500 godzin | X1C |
| Wymień rurkę PTFE | W razie potrzeby / 1000 godzin | Wszystkie |
| Kalibracja (pełna) | Miesięcznie | Wszystkie |

Wszystkie interwały można dostosować per drukarka.

## Dziennik wymiany dysz

1. Przejdź do **Konserwacja → Dysze**
2. Kliknij **Zaloguj wymianę dyszy**
3. Wypełnij:
   - **Data** — automatycznie ustawiona na dzisiaj
   - **Materiał dyszy** — Mosiądz / Hartowana stal / Miedź / Rubin
   - **Średnica dyszy** — 0.2 / 0.4 / 0.6 / 0.8 mm
   - **Marka/model** — opcjonalnie
   - **Cena** — do dziennika kosztów
   - **Godziny przy wymianie** — automatycznie pobrane z licznika czasu drukowania
4. Kliknij **Zapisz**

Dziennik wyświetla całą historię dysz posortowaną według daty.

:::tip Wcześniejsze przypomnienie
Ustaw **Ostrzeż X godzin wcześniej** (np. 50 godzin), aby otrzymać alert z wyprzedzeniem przed następną zalecaną wymianą.
:::

## Tworzenie zadań konserwacyjnych

1. Kliknij **Nowe zadanie** (ikona +)
2. Wypełnij:
   - **Nazwa zadania** — np. „Posmaruj oś Y"
   - **Drukarka** — wybierz odpowiednią drukarkę/drukarki
   - **Typ interwału** — Godziny / Dni / Liczba wydruków
   - **Interwał** — np. 300 godzin
   - **Ostatnio wykonane** — podaj kiedy zostało wykonane ostatnio (wróć do poprzedniej daty)
3. Kliknij **Utwórz**

## Interwały i przypomnienia

Dla aktywnych zadań wyświetlane są:
- **Zielony** — czas do następnej konserwacji > 50% interwału pozostało
- **Żółty** — czas do następnej konserwacji < 50% pozostało
- **Pomarańczowy** — czas do następnej konserwacji < 20% pozostało
- **Czerwony** — konserwacja przeterminowana

### Konfigurowanie przypomnień

1. Kliknij zadanie → **Edytuj**
2. Aktywuj **Przypomnienia**
3. Ustaw **Ostrzeż gdy** np. 10% pozostało do terminu
4. Wybierz kanał powiadomień (zobacz [Powiadomienia](../funksjoner/notifications))

## Oznaczanie jako wykonane

1. Znajdź zadanie na liście
2. Kliknij **Wykonane** (ikona znacznika)
3. Interwał jest resetowany od dzisiejszej daty/godzin
4. Wpis dziennika jest tworzony automatycznie

## Dziennik kosztów

Wszystkie zadania konserwacyjne mogą mieć powiązany koszt:

- **Części** — dysze, rurki PTFE, smary
- **Czas** — godziny × stawka godzinowa
- **Serwis zewnętrzny** — opłacona naprawa

Koszty są sumowane per drukarka i wyświetlane w przeglądzie statystyk.

## Historia konserwacji

Przejdź do **Konserwacja → Historia**, aby zobaczyć:
- Wszystkie wykonane zadania konserwacyjne
- Data, godziny i koszt
- Kto wykonał (w systemie wieloużytkownikowym)
- Komentarze i notatki

Eksportuj historię do CSV dla celów księgowych.
