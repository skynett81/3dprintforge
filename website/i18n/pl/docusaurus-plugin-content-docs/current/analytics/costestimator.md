---
sidebar_position: 4
title: Kalkulator kosztów
description: Prześlij plik 3MF lub GCode i oblicz całkowity koszt filamentu, prądu i zużycia maszyny przed drukowaniem
---

# Kalkulator kosztów

Kalkulator kosztów pozwala oszacować całkowity koszt wydruku przed wysłaniem go do drukarki — na podstawie zużycia filamentu, ceny prądu i zużycia maszyny.

Przejdź do: **https://localhost:3443/#cost-estimator**

## Przesyłanie pliku

1. Przejdź do **Kalkulator kosztów**
2. Przeciągnij i upuść plik w obszarze przesyłania lub kliknij **Wybierz plik**
3. Obsługiwane formaty: `.3mf`, `.gcode`, `.bgcode`
4. Kliknij **Analizuj**

:::info Analiza
System analizuje G-kod, aby wyodrębnić zużycie filamentu, szacowany czas drukowania i profil materiału. Zwykle trwa to 2–10 sekund.
:::

## Obliczanie filamentu

Po analizie wyświetlane są:

| Pole | Wartość (przykład) |
|---|---|
| Szacowany filament | 47,3 g |
| Materiał (z pliku) | PLA |
| Cena za gram | 0,025 zł (z magazynu filamentów) |
| **Koszt filamentu** | **1,18 zł** |

Zmień materiał z listy rozwijanej, aby porównać koszty z różnymi typami filamentów lub dostawcami.

:::tip Zmiana materiału
Jeśli G-kod nie zawiera informacji o materiale, wybierz materiał ręcznie z listy. Cena jest pobierana automatycznie z magazynu filamentów.
:::

## Obliczanie prądu

Koszt prądu jest obliczany na podstawie:

- **Szacowanego czasu drukowania** — z analizy G-kodu
- **Mocy drukarki** — skonfigurowanej dla modelu drukarki (W)
- **Ceny prądu** — stała cena (zł/kWh) lub na żywo z Tibber/Nordpool

| Pole | Wartość (przykład) |
|---|---|
| Szacowany czas drukowania | 3 godziny 22 min |
| Moc drukarki | 350 W (X1C) |
| Szacowane zużycie | 1,17 kWh |
| Cena prądu | 0,85 zł/kWh |
| **Koszt prądu** | **0,99 zł** |

Aktywuj integrację Tibber lub Nordpool, aby używać zaplanowanych cen godzinowych na podstawie żądanego czasu startu.

## Zużycie maszyny

Koszt zużycia jest szacowany na podstawie:

- Czasu drukowania × koszt godzinowy dla modelu drukarki
- Dodatkowego zużycia dla materiałów ściernych (CF, GF itp.)

| Pole | Wartość (przykład) |
|---|---|
| Czas drukowania | 3 godziny 22 min |
| Koszt godzinowy (zużycie) | 0,35 zł/godz |
| **Koszt zużycia** | **1,18 zł** |

Koszt godzinowy jest obliczany z cen komponentów i oczekiwanej żywotności (zob. [Przewidywanie zużycia](../monitoring/wearprediction)).

## Suma całkowita

| Pozycja kosztowa | Kwota |
|---|---|
| Filament | 1,18 zł |
| Prąd | 0,99 zł |
| Zużycie maszyny | 1,18 zł |
| **Łącznie** | **3,35 zł** |
| + Marża (30%) | 1,01 zł |
| **Cena sprzedaży** | **4,36 zł** |

Dostosuj marżę w polu procentowym, aby obliczyć zalecaną cenę sprzedaży dla klienta.

## Zapisywanie szacunku

Kliknij **Zapisz szacunek**, aby połączyć analizę z projektem:

1. Wybierz istniejący projekt lub utwórz nowy
2. Szacunek jest zapisywany i może być używany jako podstawa faktury
3. Rzeczywisty koszt (po wydruku) jest automatycznie porównywany z szacunkiem

## Obliczanie zbiorcze

Prześlij wiele plików jednocześnie, aby obliczyć łączny koszt kompletnego zestawu:

1. Kliknij **Tryb zbiorczy**
2. Prześlij wszystkie pliki `.3mf`/`.gcode`
3. System oblicza koszty indywidualne i sumaryczne
4. Eksportuj podsumowanie jako PDF lub CSV
