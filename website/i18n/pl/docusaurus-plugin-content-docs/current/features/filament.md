---
sidebar_position: 2
title: Magazyn filamentów
description: Zarządzaj szpulami filamentu, synchronizacją AMS, suszeniem i nie tylko
---

# Magazyn filamentów

Magazyn filamentów zapewnia pełny przegląd wszystkich szpul filamentu, zintegrowany z AMS i historią wydruków.

## Przegląd

Magazyn wyświetla wszystkie zarejestrowane szpule z:

- **Kolorem** — wizualna próbka koloru
- **Materiałem** — PLA, PETG, ABS, TPU, PA itp.
- **Dostawcą** — Bambu Lab, Polymaker, eSUN itp.
- **Wagą** — pozostałe gramy (szacowane lub zważone)
- **Slotem AMS** — w którym slocie znajduje się szpula
- **Statusem** — aktywna, pusta, suszona, przechowywana

## Dodawanie szpul

1. Kliknij **+ Nowa szpula**
2. Wypełnij materiał, kolor, dostawcę i wagę
3. Zeskanuj tag NFC, jeśli dostępny, lub wprowadź ręcznie
4. Zapisz

:::tip Szpule Bambu Lab
Oficjalne szpule Bambu Lab można importować automatycznie przez integrację Bambu Cloud. Zobacz [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Synchronizacja AMS

Gdy dashboard jest podłączony do drukarki, status AMS jest synchronizowany automatycznie:

- Sloty wyświetlają prawidłowy kolor i materiał z AMS
- Zużycie jest aktualizowane po każdym wydruku
- Puste szpule są oznaczane automatycznie

Aby powiązać lokalną szpulę ze slotem AMS:
1. Przejdź do **Filament → AMS**
2. Kliknij slot, który chcesz powiązać
3. Wybierz szpulę z magazynu

## Suszenie

Rejestruj cykle suszenia, aby śledzić ekspozycję na wilgoć:

| Pole | Opis |
|------|------|
| Data suszenia | Kiedy szpula była suszona |
| Temperatura | Temperatura suszenia (°C) |
| Czas | Liczba godzin |
| Metoda | Piekarnik, suszarka, suszarka do filamentu |

:::info Zalecane temperatury suszenia
Zobacz [Bazę wiedzy](../kb/intro), aby uzyskać czasy i temperatury suszenia specyficzne dla materiałów.
:::

## Karty kolorów

Widok kart kolorów organizuje szpule wizualnie według koloru. Przydatne do szybkiego znalezienia właściwego koloru. Filtruj według materiału, dostawcy lub statusu.

## Tagi NFC

Bambu Dashboard obsługuje tagi NFC do szybkiej identyfikacji szpul:

1. Wpisz ID tagu NFC do szpuli w magazynie
2. Zeskanuj tag telefonem
3. Szpula otwiera się bezpośrednio w dashboardzie

## Import i eksport

### Eksport
Eksportuj cały magazyn jako CSV: **Filament → Eksport → CSV**

### Import
Importuj szpule z CSV: **Filament → Import → Wybierz plik**

Format CSV:
```
nazwa,material,kolor_hex,dostawca,waga_gram,nfc_id
PLA Biały,PLA,#FFFFFF,Bambu Lab,1000,
PETG Czarny,PETG,#000000,Polymaker,850,ABC123
```

## Statystyki

W **Filament → Statystyki** znajdziesz:

- Całkowite zużycie według materiału (ostatnie 30/90/365 dni)
- Zużycie na drukarkę
- Szacowany pozostały czas życia na szpulę
- Najczęściej używane kolory i dostawcy
