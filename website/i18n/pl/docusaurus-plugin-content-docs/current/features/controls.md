---
sidebar_position: 5
title: Sterowanie drukarką
description: Steruj temperaturą, prędkością, wentylatorami i wysyłaj G-code bezpośrednio do drukarki
---

# Sterowanie drukarką

Panel sterowania zapewnia pełną ręczną kontrolę nad drukarką bezpośrednio z dashboardu.

## Sterowanie temperaturą

### Dysza
- Ustaw temperaturę docelową od 0 do 350 °C
- Kliknij **Ustaw**, aby wysłać polecenie
- Odczyt w czasie rzeczywistym jest wyświetlany na animowanym mierniku pierścieniowym

### Stół grzejny
- Ustaw temperaturę docelową od 0 do 120 °C
- Automatyczne wyłączanie po wydruku (konfigurowalne)

### Komora
- Sprawdź temperaturę komory (odczyt w czasie rzeczywistym)
- **X1E, H2S, H2D, H2C**: Aktywne sterowanie ogrzewaniem komory przez M141 (konfigurowalna temperatura docelowa)
- **X1C**: Pasywna obudowa — temperatura komory jest wyświetlana, ale nie można jej bezpośrednio sterować
- **P1S**: Pasywna obudowa — wyświetla temperaturę, brak aktywnego sterowania ogrzewaniem komory
- **P1P, A1, A1 mini i seria H bez chamberHeat**: Brak czujnika komory

:::warning Maksymalne temperatury
Nie przekraczaj zalecanych temperatur dla dyszy i stołu. Dla dyszy z hartowanej stali (typ HF): maks. 300 °C. Dla mosiądzu: maks. 260 °C. Zobacz instrukcję drukarki.
:::

## Profile prędkości

Kontrola prędkości oferuje cztery predefiniowane profile:

| Profil | Prędkość | Zastosowanie |
|--------|---------|-------------|
| Cicha | 50% | Redukcja hałasu, drukowanie nocne |
| Standardowa | 100% | Normalne użytkowanie |
| Sport | 124% | Szybsze wydruki |
| Turbo | 166% | Maksymalna prędkość (spadek jakości) |

Suwak pozwala ustawić niestandardowy procent od 50 do 200%.

## Kontrola wentylatorów

Ręczna kontrola prędkości wentylatorów:

| Wentylator | Opis | Zakres |
|-----------|------|--------|
| Part cooling fan | Chłodzi drukowany obiekt | 0–100% |
| Auxiliary fan | Cyrkulacja w komorze | 0–100% |
| Chamber fan | Aktywne chłodzenie komory | 0–100% |

:::tip Dobre ustawienia
- **PLA/PETG:** Chłodzenie części 100%, aux 30%
- **ABS/ASA:** Chłodzenie części 0–20%, wentylator komory wyłączony
- **TPU:** Chłodzenie części 50%, niska prędkość
:::

## Konsola G-code

Wysyłaj polecenia G-code bezpośrednio do drukarki:

```gcode
; Przykład: Przesuń pozycję głowicy
G28 ; Powrót wszystkich osi do pozycji bazowej
G1 X150 Y150 Z10 F3000 ; Przesuń na środek
M104 S220 ; Ustaw temperaturę dyszy
M140 S60  ; Ustaw temperaturę stołu
```

:::danger Zachowaj ostrożność z G-code
Nieprawidłowy G-code może uszkodzić drukarkę. Wysyłaj tylko polecenia, które rozumiesz. Unikaj `M600` (wymiana filamentu) w trakcie wydruku.
:::

## Operacje na filamencie

Z panelu sterowania możesz:

- **Załaduj filament** — podgrzewa dyszę i wciąga filament
- **Rozładuj filament** — podgrzewa i wyciąga filament
- **Wyczyść dyszę** — uruchom cykl czyszczenia

## Makra

Zapisuj i uruchamiaj sekwencje poleceń G-code jako makra:

1. Kliknij **Nowe makro**
2. Nadaj makru nazwę
3. Wpisz sekwencję G-code
4. Zapisz i uruchom jednym kliknięciem

Przykładowe makro kalibracji stołu:
```gcode
G28
M84
M500
```

## Sterowanie wydrukiem

Podczas aktywnego wydruku możesz:

- **Pauza** — wstrzymuje wydruk po bieżącej warstwie
- **Wznów** — kontynuuje wstrzymany wydruk
- **Zatrzymaj** — przerywa wydruk (nieodwracalne)
- **Zatrzymanie awaryjne** — natychmiastowe zatrzymanie wszystkich silników
