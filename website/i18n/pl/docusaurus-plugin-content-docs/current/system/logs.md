---
sidebar_position: 8
title: Dziennik serwera
description: Przeglądaj dziennik serwera w czasie rzeczywistym, filtruj według poziomu i modułu oraz diagnozuj problemy z Bambu Dashboard
---

# Dziennik serwera

Dziennik serwera daje wgląd w to, co dzieje się wewnątrz Bambu Dashboard — przydatny do diagnozowania, monitorowania i diagnostyki.

Przejdź do: **https://localhost:3443/#logs**

## Widok w czasie rzeczywistym

Strumień dziennika jest aktualizowany w czasie rzeczywistym przez WebSocket:

1. Przejdź do **System → Dziennik serwera**
2. Nowe linie dziennika pojawiają się automatycznie na dole
3. Kliknij **Zablokuj na dole**, aby zawsze przewijać do ostatniego wpisu
4. Kliknij **Zamroź**, aby zatrzymać automatyczne przewijanie i czytać istniejące linie

Domyślny widok pokazuje ostatnie 500 linii dziennika.

## Poziomy dziennika

Każda linia dziennika ma poziom:

| Poziom | Kolor | Opis |
|---|---|---|
| **ERROR** | Czerwony | Błędy wpływające na funkcjonalność |
| **WARN** | Pomarańczowy | Ostrzeżenia — coś może pójść nie tak |
| **INFO** | Niebieski | Normalne informacje operacyjne |
| **DEBUG** | Szary | Szczegółowe informacje dla deweloperów |

:::info Konfiguracja poziomu dziennika
Zmień poziom dziennika w **Ustawienia → System → Poziom dziennika**. Dla normalnej pracy używaj **INFO**. Używaj **DEBUG** tylko podczas diagnozowania, ponieważ generuje znacznie więcej danych.
:::

## Filtrowanie

Użyj paska narzędzi filtrowania u góry widoku dziennika:

1. **Poziom dziennika** — pokazuj tylko ERROR / WARN / INFO / DEBUG lub kombinację
2. **Moduł** — filtruj według modułu systemowego:
   - `mqtt` — komunikacja MQTT z drukarkami
   - `api` — żądania API
   - `db` — operacje na bazie danych
   - `auth` — zdarzenia uwierzytelniania
   - `queue` — zdarzenia kolejki wydruków
   - `guard` — zdarzenia Print Guard
   - `backup` — operacje tworzenia kopii zapasowych
3. **Dowolny tekst** — szukaj w tekście dziennika (obsługuje wyrażenia regularne)
4. **Czas** — filtruj według zakresu dat

Łącz filtry dla precyzyjnego diagnozowania.

## Typowe sytuacje błędów

### Problemy z połączeniem MQTT

Szukaj linii dziennika z modułu `mqtt`:

```
ERROR [mqtt] Połączenie z drukarką XXXX nie powiodło się: Connection refused
```

**Rozwiązanie:** Sprawdź, czy drukarka jest włączona, klucz dostępu jest prawidłowy i sieć działa.

### Błędy bazy danych

```
ERROR [db] Migracja v95 nie powiodła się: SQLITE_CONSTRAINT
```

**Rozwiązanie:** Utwórz kopię zapasową i uruchom naprawę bazy danych przez **Ustawienia → System → Napraw bazę danych**.

### Błędy uwierzytelniania

```
WARN [auth] Nieudane logowanie dla użytkownika admin z IP 192.168.1.x
```

Wiele nieudanych logowań może wskazywać na próbę brute-force. Sprawdź, czy należy aktywować białą listę IP.

## Eksportowanie dzienników

1. Kliknij **Eksportuj dziennik**
2. Wybierz okres (domyślnie: ostatnie 24 godziny)
3. Wybierz format: **TXT** (czytelny dla człowieka) lub **JSON** (czytelny dla maszyny)
4. Plik jest pobierany

Wyeksportowane dzienniki są przydatne przy zgłaszaniu błędów lub kontaktowaniu się ze wsparciem.

## Rotacja dziennika

Dzienniki są automatycznie rotowane:

| Ustawienie | Domyślne |
|---|---|
| Maksymalny rozmiar pliku dziennika | 50 MB |
| Liczba rotowanych plików do zachowania | 5 |
| Łączny maksymalny rozmiar dziennika | 250 MB |

Dostosuj w **Ustawienia → System → Rotacja dziennika**. Starsze pliki dziennika są automatycznie kompresowane za pomocą gzip.

## Lokalizacja pliku dziennika

Pliki dziennika są przechowywane na serwerze:

```
./data/logs/
├── bambu-dashboard.log          (aktywny dziennik)
├── bambu-dashboard.log.1.gz     (rotowany)
├── bambu-dashboard.log.2.gz     (rotowany)
└── ...
```

:::tip Dostęp SSH
Aby czytać dzienniki bezpośrednio na serwerze przez SSH:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
