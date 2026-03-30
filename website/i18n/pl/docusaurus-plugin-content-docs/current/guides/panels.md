---
sidebar_position: 8
title: Nawigacja w panelu
description: Naucz się nawigować w Bambu Dashboard — pasek boczny, panele, skróty klawiszowe i dostosowanie
---

# Nawigacja w panelu

Ten przewodnik daje Ci szybkie wprowadzenie do tego, jak zorganizowany jest panel i jak efektywnie się po nim poruszać.

## Pasek boczny

Pasek boczny po lewej stronie to Twoje centrum nawigacji. Jest zorganizowany w sekcje:

```
┌────────────────────┐
│ 🖨  Statusy drukarek│  ← Jeden wiersz na drukarkę
├────────────────────┤
│ Przegląd           │
│ Flota              │
│ Aktywny wydruk     │
├────────────────────┤
│ Filament           │
│ Historia           │
│ Projekty           │
│ Kolejka            │
│ Harmonogram        │
├────────────────────┤
│ Monitorowanie      │
│  └ Print Guard     │
│  └ Błędy           │
│  └ Diagnostyka     │
│  └ Konserwacja     │
├────────────────────┤
│ Analiza            │
│ Narzędzia          │
│ Integracje         │
│ System             │
├────────────────────┤
│ ⚙ Ustawienia      │
└────────────────────┘
```

**Pasek boczny można ukryć** klikając ikonę hamburgera (☰) w lewym górnym rogu. Przydatne na mniejszych ekranach lub w trybie kiosku.

## Panel główny

Gdy klikasz element na pasku bocznym, zawartość jest wyświetlana w panelu głównym po prawej stronie. Układ się zmienia:

| Panel | Układ |
|-------|-------|
| Przegląd | Siatka kart ze wszystkimi drukarkami |
| Aktywny wydruk | Duża karta szczegółów + krzywe temperatur |
| Historia | Filtrowalna tabela |
| Filament | Widok kart z szpulami |
| Analiza | Wykresy i diagramy |

## Klikanie na status drukarki dla szczegółów

Karta drukarki na panelu przeglądowym jest klikalna:

**Pojedyncze kliknięcie** → Otwiera panel szczegółów dla tej drukarki:
- Temperatury w czasie rzeczywistym
- Aktywny wydruk (jeśli w toku)
- Status AMS ze wszystkimi slotami
- Ostatnie błędy i zdarzenia
- Szybkie przyciski: Pauza, Stop, Światło wł./wył.

**Kliknięcie na ikonę kamery** → Otwiera widok kamery na żywo

**Kliknięcie na ikonę ⚙** → Ustawienia drukarki

## Skrót klawiszowy — paleta poleceń

Paleta poleceń zapewnia szybki dostęp do wszystkich funkcji bez nawigacji:

| Skrót | Akcja |
|-------|-------|
| `Ctrl + K` (Linux/Windows) | Otwórz paletę poleceń |
| `Cmd + K` (macOS) | Otwórz paletę poleceń |
| `Esc` | Zamknij paletę |

W palecie poleceń możesz:
- Wyszukiwać strony i funkcje
- Uruchomić wydruk bezpośrednio
- Wstrzymać / wznowić aktywne wydruki
- Przełączyć motyw (jasny/ciemny)
- Nawigować do dowolnej strony

**Przykład:** Naciśnij `Ctrl+K`, wpisz „pauza" → wybierz „Wstrzymaj wszystkie aktywne wydruki"

## Dostosowanie widgetów

Panel przeglądowy można dostosować za pomocą wybranych widgetów:

**Jak edytować panel:**
1. Kliknij **Edytuj układ** (ikona ołówka) w prawym górnym rogu panelu przeglądowego
2. Przeciągnij widgety na żądaną pozycję
3. Kliknij i przeciągnij narożnik widgetu, aby zmienić rozmiar
4. Kliknij **+ Dodaj widget**, aby dodać nowe:

Dostępne widgety:

| Widget | Wyświetla |
|--------|-----------|
| Status drukarek | Karty dla wszystkich drukarek |
| Aktywny wydruk (duży) | Szczegółowy widok trwającego wydruku |
| Przegląd AMS | Wszystkie sloty i poziomy filamentów |
| Krzywa temperatury | Wykres w czasie rzeczywistym |
| Cena prądu | Wykres cen na kolejne 24 godziny |
| Licznik filamentu | Całkowite zużycie przez ostatnie 30 dni |
| Skrót do historii | Ostatnie 5 wydruków |
| Podgląd kamery | Obraz kamery na żywo |

5. Kliknij **Zapisz układ**

:::tip Zapisywanie wielu układów
Możesz mieć różne układy do różnych celów — kompaktowy do codziennego użytku, duży do wyświetlenia na dużym ekranie. Przełączaj się między nimi za pomocą selektora układów.
:::

## Motyw — przełączanie między jasnym a ciemnym

**Szybkie przełączanie:**
- Kliknij ikonę słońca/księżyca w prawym górnym rogu nawigacji
- Lub: `Ctrl+K` → wpisz „motyw"

**Ustawienie trwałe:**
1. Przejdź do **System → Motywy**
2. Wybierz między:
   - **Jasny** — białe tło
   - **Ciemny** — ciemne tło (zalecane w nocy)
   - **Automatyczny** — zgodny z ustawieniem systemowym urządzenia
3. Wybierz kolor akcentu (niebieski, zielony, fioletowy itp.)
4. Kliknij **Zapisz**

## Nawigacja klawiaturą

Do efektywnej nawigacji bez myszy:

| Skrót | Akcja |
|-------|-------|
| `Tab` | Następny interaktywny element |
| `Shift+Tab` | Poprzedni element |
| `Enter` / `Spacja` | Aktywuj przycisk/link |
| `Esc` | Zamknij modal/dropdown |
| `Ctrl+K` | Paleta poleceń |
| `Alt+1` – `Alt+9` | Nawiguj bezpośrednio do 9 pierwszych stron |

## PWA — instalacja jako aplikacja

Bambu Dashboard można zainstalować jako progresywną aplikację webową (PWA) i uruchamiać jako samodzielną aplikację bez menu przeglądarki:

1. Przejdź do panelu w Chrome, Edge lub Safari
2. Kliknij ikonę **Zainstaluj aplikację** w pasku adresu
3. Potwierdź instalację

Patrz [Dokumentacja PWA](../system/pwa), aby uzyskać więcej szczegółów.

## Tryb kiosku

Tryb kiosku ukrywa całą nawigację i wyświetla tylko panel — idealny do dedykowanego ekranu w warsztacie drukarskim:

1. Przejdź do **System → Kiosk**
2. Włącz **Tryb kiosku**
3. Wybierz widgety do wyświetlenia
4. Ustaw interwał odświeżania

Patrz [Dokumentacja kiosku](../system/kiosk) po pełną konfigurację.
