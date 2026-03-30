---
sidebar_position: 3
title: Przegląd floty
description: Zarządzaj i monitoruj wszystkie drukarki Bambu Lab w jednej siatce z sortowaniem, filtrowaniem i statusem w czasie rzeczywistym
---

# Przegląd floty

Przegląd floty zapewnia kompaktowy widok wszystkich podłączonych drukarek na jednej stronie. Idealny dla warsztatów, sal lekcyjnych lub każdego, kto ma więcej niż jedną drukarkę.

Przejdź do: **https://localhost:3443/#fleet**

## Siatka wielu drukarek

Wszystkie zarejestrowane drukarki są wyświetlane w responsywnej siatce:

- **Rozmiar karty** — Mały (kompaktowy), Średni (standardowy), Duży (szczegółowy)
- **Liczba kolumn** — Dostosowuje się automatycznie do szerokości ekranu lub ustaw ręcznie
- **Aktualizacja** — Każda karta jest aktualizowana niezależnie przez MQTT

Każda karta drukarki wyświetla:
| Pole | Opis |
|---|---|
| Nazwa drukarki | Skonfigurowana nazwa z ikoną modelu |
| Status | Bezczynna / Drukuje / Pauza / Błąd / Rozłączona |
| Postęp | Pasek procentowy z pozostałym czasem |
| Temperatura | Dysza i stół (kompaktowe) |
| Aktywny filament | Kolor i materiał z AMS |
| Miniatura kamery | Nieruchomy obraz aktualizowany co 30 sekund |

## Wskaźnik statusu dla każdej drukarki

Kolory statusu ułatwiają sprawdzenie stanu z odległości:

- **Zielony puls** — Aktywnie drukuje
- **Niebieski** — Bezczynna i gotowa
- **Żółty** — Wstrzymana (ręcznie lub przez Print Guard)
- **Czerwony** — Wykryto błąd
- **Szary** — Rozłączona lub niedostępna

:::tip Tryb kiosku
Używaj przeglądu floty w trybie kiosku na ekranie montowanym na ścianie. Zobacz [Tryb kiosku](../system/kiosk), aby skonfigurować.
:::

## Sortowanie

Kliknij **Sortuj**, aby wybrać kolejność:

1. **Nazwa** — Alfabetycznie A–Z
2. **Status** — Aktywne drukarki na górze
3. **Postęp** — Najbardziej zaawansowane na górze
4. **Ostatnio aktywna** — Ostatnio używane na górze
5. **Model** — Pogrupowane według modelu drukarki

Sortowanie jest zapamiętywane do następnej wizyty.

## Filtrowanie

Użyj pola filtra u góry, aby ograniczyć widok:

- Wpisz nazwę drukarki lub jej część
- Wybierz **Status** z listy rozwijanej (Wszystkie / Drukuje / Bezczynna / Błąd)
- Wybierz **Model**, aby wyświetlić tylko jeden typ drukarki (X1C, P1S, A1 itp.)
- Kliknij **Wyczyść filtr**, aby wyświetlić wszystkie

:::info Wyszukiwanie
Wyszukiwanie filtruje w czasie rzeczywistym bez przeładowania strony.
:::

## Działania z przeglądu floty

Kliknij prawym przyciskiem myszy na kartę (lub kliknij trzy kropki), aby uzyskać szybkie działania:

- **Otwórz dashboard** — Przejdź bezpośrednio do panelu głównego drukarki
- **Wstrzymaj wydruk** — Wstrzymuje drukarkę
- **Zatrzymaj wydruk** — Przerywa bieżący wydruk (wymaga potwierdzenia)
- **Pokaż kamerę** — Otwiera widok kamery w oknie popup
- **Przejdź do ustawień** — Otwiera ustawienia drukarki

:::danger Zatrzymaj wydruk
Zatrzymanie wydruku jest nieodwracalne. Zawsze potwierdzaj w wyświetlonym oknie dialogowym.
:::

## Zagregowane statystyki

Na górze przeglądu floty wyświetlany jest wiersz podsumowania:

- Łączna liczba drukarek
- Liczba aktywnych wydruków
- Łączne zużycie filamentu w ciągu dnia
- Szacowany czas zakończenia dla najdłużej trwającego wydruku
