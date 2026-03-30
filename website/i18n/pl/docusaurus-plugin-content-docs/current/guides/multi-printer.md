---
sidebar_position: 6
title: Wiele drukarek
description: Konfiguracja wielu drukarek Bambu i zarządzanie nimi w Bambu Dashboard — przegląd floty, kolejka i rozłożony start
---

# Wiele drukarek

Masz więcej niż jedną drukarkę? Bambu Dashboard jest zbudowany do zarządzania flotą — możesz monitorować, sterować i koordynować wszystkie drukarki z jednego miejsca.

## Dodawanie nowej drukarki

1. Przejdź do **Ustawienia → Drukarki**
2. Kliknij **+ Dodaj drukarkę**
3. Wypełnij:

| Pole | Przykład | Wyjaśnienie |
|------|----------|-------------|
| Numer seryjny (SN) | 01P... | Znajdziesz w Bambu Handy lub na ekranie drukarki |
| Adres IP | 192.168.1.101 | Dla trybu LAN (zalecane) |
| Kod dostępu | 12345678 | 8-cyfrowy kod na ekranie drukarki |
| Nazwa | „Bambu #2 - P1S" | Wyświetlana w panelu |
| Model | P1P, P1S, X1C, A1 | Wybierz właściwy model dla odpowiednich ikon i funkcji |

4. Kliknij **Testuj połączenie** — powinieneś zobaczyć zielony status
5. Kliknij **Zapisz**

:::tip Nadawaj drukarkom opisowe nazwy
„Bambu 1" i „Bambu 2" są mylące. Używaj nazw takich jak „X1C - Produkcja" i „P1S - Prototypy", aby zachować przejrzystość.
:::

## Przegląd floty

Po dodaniu wszystkich drukarek są one wyświetlane razem w panelu **Flota**. Tutaj widzisz:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Produkcja │  │ P1S - Prototypy │  │ A1 - Hobbypokój │
│ ████████░░ 82%  │  │ Bezczynna       │  │ ████░░░░░░ 38%  │
│ 1g 24m pozostało│  │ Gotowa do druku │  │ 3g 12m pozostało│
│ Temp: 220/60°C  │  │ AMS: 4 szpule   │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Możesz:
- Kliknąć na drukarkę, aby zobaczyć szczegółowy widok
- Zobaczyć wszystkie temperatury, status AMS i aktywne błędy za jednym razem
- Filtrować według statusu (aktywne wydruki, bezczynne, błędy)

## Kolejka wydruków — rozdzielanie pracy

Kolejka wydruków pozwala planować wydruki dla wszystkich drukarek z jednego miejsca.

**Jak to działa:**
1. Przejdź do **Kolejka**
2. Kliknij **+ Dodaj zadanie**
3. Wybierz plik i ustawienia
4. Wybierz drukarkę lub wybierz **Automatyczne przypisanie**

### Automatyczne przypisanie
Przy automatycznym przypisaniu panel wybiera drukarkę na podstawie:
- Dostępnej pojemności
- Filamentu dostępnego w AMS
- Zaplanowanych okien konserwacji

Włącz w **Ustawienia → Kolejka → Automatyczne przypisanie**.

### Priorytetyzacja
Przeciągaj i upuszczaj zadania w kolejce, aby zmienić kolejność. Zadanie z **Wysokim priorytetem** przeskakuje przed zwykłe zadania.

## Rozłożony start — unikanie skoków poboru prądu

Jeśli uruchamiasz wiele drukarek jednocześnie, faza nagrzewania może spowodować duży skok poboru prądu. Rozłożony start rozprowadza uruchomienie:

**Jak go włączyć:**
1. Przejdź do **Ustawienia → Flota → Rozłożony start**
2. Włącz **Rozłożone uruchomienie**
3. Ustaw opóźnienie między drukarkami (zalecane: 2–5 minut)

**Przykład z 3 drukarkami i opóźnieniem 3 minut:**
```
08:00 — Drukarka 1 rozpoczyna nagrzewanie
08:03 — Drukarka 2 rozpoczyna nagrzewanie
08:06 — Drukarka 3 rozpoczyna nagrzewanie
```

:::tip Istotne dla rozmiaru bezpiecznika
X1C pobiera ok. 1000W podczas nagrzewania. Trzy drukarki jednocześnie = 3000W, co może wyłączyć bezpiecznik 16A. Rozłożony start eliminuje ten problem.
:::

## Grupy drukarek

Grupy drukarek pozwalają logicznie organizować drukarki i wysyłać polecenia do całej grupy:

**Tworzenie grupy:**
1. Przejdź do **Ustawienia → Grupy drukarek**
2. Kliknij **+ Nowa grupa**
3. Nadaj grupie nazwę (np. „Hala produkcyjna", „Hobbypokój")
4. Dodaj drukarki do grupy

**Funkcje grupy:**
- Przeglądanie zagregowanych statystyk grupy
- Wysyłanie polecenia pauzy do całej grupy jednocześnie
- Ustawienie okna konserwacji dla grupy

## Monitorowanie wszystkich drukarek

### Widok wielu kamer
Przejdź do **Flota → Widok kamer**, aby zobaczyć wszystkie podglądy kamer obok siebie:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [Na żywo]   │  │  [Bezczynna] │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Dodaj     │
│  [Na żywo]   │  │              │
└──────────────┘  └──────────────┘
```

### Powiadomienia dla każdej drukarki
Możesz konfigurować różne reguły powiadomień dla różnych drukarek:
- Drukarka produkcyjna: powiadamiaj zawsze, włącznie z nocą
- Drukarka hobbystyczna: powiadamiaj tylko w ciągu dnia

Patrz [Powiadomienia](./notification-setup) po konfigurację.

## Wskazówki dla zarządzania flotą

- **Standaryzuj sloty filamentów**: Trzymaj PLA biały w slocie 1, PLA czarny w slocie 2 na wszystkich drukarkach — wtedy rozdzielanie zadań jest prostsze
- **Sprawdzaj poziomy AMS codziennie**: Patrz [Codzienne użytkowanie](./daily-use) po ranną rutynę
- **Konserwacja rotacyjna**: Nie przeprowadzaj konserwacji wszystkich drukarek jednocześnie — zawsze trzymaj co najmniej jedną aktywną
- **Jasno nazywaj pliki**: Nazwy plików takie jak `logo_x1c_pla_0.2mm.3mf` ułatwiają wybór odpowiedniej drukarki
