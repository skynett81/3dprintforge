---
sidebar_position: 4
title: Serwer zdalny
description: Połącz wiele instancji 3DPrintForge, aby zobaczyć wszystkie drukarki z jednego centralnego dashboardu
---

# Serwer zdalny (Remote Nodes)

Funkcja serwera zdalnego pozwala połączyć wiele instancji 3DPrintForge, abyś mógł widzieć i sterować wszystkimi drukarkami z jednego centralnego interfejsu — niezależnie od tego, czy znajdują się w tej samej sieci czy w różnych lokalizacjach.

Przejdź do: **https://localhost:3443/#settings** → **Integracje → Serwery zdalne**

## Scenariusze użycia

- **Dom + biuro** — Widź drukarki w obu lokalizacjach z tego samego dashboardu
- **Makerspace** — Centralny dashboard dla wszystkich instancji w pomieszczeniu
- **Instancje gości** — Daj klientom ograniczony wgląd bez pełnego dostępu

## Architektura

```
Instancja główna (twój komputer)
  ├── Drukarka A (lokalny MQTT)
  ├── Drukarka B (lokalny MQTT)
  └── Serwer zdalny: Instancja pomocnicza
        ├── Drukarka C (MQTT w zdalnej lokalizacji)
        └── Drukarka D (MQTT w zdalnej lokalizacji)
```

Instancja główna odpytuje serwery zdalne przez REST API i agreguje dane lokalnie.

## Dodawanie serwera zdalnego

### Krok 1: Wygeneruj klucz API na zdalnej instancji

1. Zaloguj się do zdalnej instancji (np. `https://192.168.2.50:3443`)
2. Przejdź do **Ustawienia → Klucze API**
3. Kliknij **Nowy klucz** → nadaj mu nazwę „Węzeł główny"
4. Ustaw uprawnienia: **Odczyt** (minimum) lub **Odczyt + Zapis** (dla zdalnego sterowania)
5. Skopiuj klucz

### Krok 2: Połącz z instancji głównej

1. Przejdź do **Ustawienia → Serwery zdalne**
2. Kliknij **Dodaj serwer zdalny**
3. Wypełnij:
   - **Nazwa**: np. „Biuro" lub „Garaż"
   - **URL**: `https://192.168.2.50:3443` lub zewnętrzny URL
   - **Klucz API**: klucz z kroku 1
4. Kliknij **Testuj połączenie**
5. Kliknij **Zapisz**

:::warning Certyfikat z własnym podpisem
Jeśli zdalna instancja używa certyfikatu z własnym podpisem, aktywuj **Ignoruj błędy TLS** — ale rób to tylko dla połączeń w sieci wewnętrznej.
:::

## Widok zagregowany

Po połączeniu drukarki zdalne są wyświetlane w:

- **Przeglądzie floty** — oznaczone nazwą serwera zdalnego i ikoną chmury
- **Statystykach** — zagregowane we wszystkich instancjach
- **Magazynie filamentów** — zbiorczy przegląd

## Zdalne sterowanie

Z uprawnieniami **Odczyt + Zapis** możesz sterować zdalnymi drukarkami bezpośrednio:

- Wstrzymaj / Wznów / Zatrzymaj
- Dodaj do kolejki wydruków (zadanie jest wysyłane do zdalnej instancji)
- Zobacz strumień kamery (proxowany przez zdalną instancję)

:::info Opóźnienie
Strumień kamery przez serwer zdalny może mieć zauważalne opóźnienie w zależności od prędkości sieci i odległości.
:::

## Kontrola dostępu

Ogranicz, które dane serwer zdalny udostępnia:

1. Na zdalnej instancji: przejdź do **Ustawienia → Klucze API → [Nazwa klucza]**
2. Ogranicz dostęp:
   - Tylko określone drukarki
   - Brak strumienia kamery
   - Tylko do odczytu

## Kondycja i monitorowanie

Status każdego serwera zdalnego jest wyświetlany w **Ustawienia → Serwery zdalne**:

- **Połączony** — ostatnie odpytanie udane
- **Rozłączony** — nie można dotrzeć do serwera zdalnego
- **Błąd uwierzytelniania** — klucz API nieprawidłowy lub wygasły
- **Ostatnia synchronizacja** — znacznik czasu ostatniej udanej synchronizacji danych
