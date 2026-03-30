---
sidebar_position: 11
title: Wycena produktów — obliczanie ceny sprzedaży
description: Kompletny przewodnik po wycenie wydruków 3D na sprzedaż ze wszystkimi czynnikami kosztowymi
---

# Wycena produktów — obliczanie ceny sprzedaży

Ten przewodnik wyjaśnia, jak korzystać z kalkulatora kosztów, aby znaleźć odpowiednią cenę sprzedaży wydruków 3D, które sprzedajesz.

## Przegląd kosztów

Koszt wydruku 3D składa się z następujących elementów:

| Składnik | Opis | Przykład |
|-----------|-------------|---------|
| **Filament** | Koszt materiału na podstawie wagi i ceny szpuli | 100g × 0,25 kr/g = 25 kr |
| **Odpady** | Straty materiału (purge, nieudane wydruki, podpory) | 10% dodatkowe = 2,50 kr |
| **Prąd** | Zużycie energii podczas drukowania | 3,5h × 150W × 1,50 kr/kWh = 0,79 kr |
| **Zużycie** | Dysza + wartość maszyny w okresie eksploatacji | 3,5h × 0,15 kr/h = 0,53 kr |
| **Praca** | Twój czas na konfigurację, obróbkę końcową, pakowanie | 10 min × 200 kr/h = 33,33 kr |
| **Marża** | Marża zysku | 20% = 12,43 kr |

**Całkowity koszt produkcji** = suma wszystkich składników

## Konfiguracja ustawień

### Ustawienia podstawowe

Przejdź do **Filament → ⚙ Ustawienia** i wypełnij:

1. **Cena prądu (kr/kWh)** — Twoja cena prądu. Sprawdź rachunek za prąd lub użyj integracji Nordpool
2. **Moc drukarki (W)** — typowo 150W dla drukarek Bambu Lab
3. **Koszt maszyny (kr)** — ile zapłaciłeś za drukarkę
4. **Żywotność maszyny (godziny)** — oczekiwana żywotność (3000-8000 godzin)
5. **Koszt pracy (kr/godzinę)** — Twoja stawka godzinowa
6. **Czas przygotowania (min)** — średni czas na wymianę filamentu, sprawdzenie płyty, pakowanie
7. **Marża (%)** — pożądana marża zysku
8. **Koszt dyszy (kr/godzinę)** — zużycie dyszy (HS01 ≈ 0,05 kr/h)
9. **Współczynnik odpadów** — straty materiału (1,1 = 10% dodatkowe, 1,15 = 15%)

:::tip Typowe wartości dla Bambu Lab
| Ustawienie | Hobbysta | Semi-pro | Profesjonalista |
|---|---|---|---|
| Cena prądu | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Moc drukarki | 150W | 150W | 150W |
| Koszt maszyny | 5 000 kr | 12 000 kr | 25 000 kr |
| Żywotność maszyny | 3 000h | 5 000h | 8 000h |
| Koszt pracy | 0 kr/h | 150 kr/h | 250 kr/h |
| Czas przygotowania | 5 min | 10 min | 15 min |
| Marża | 0% | 30% | 50% |
| Współczynnik odpadów | 1,05 | 1,10 | 1,15 |
:::

## Obliczanie kosztu

1. Przejdź do **Kalkulatora kosztów** (`https://localhost:3443/#costestimator`)
2. **Przeciągnij i upuść** plik `.3mf` lub `.gcode`
3. System automatycznie odczytuje: wagę filamentu, szacowany czas, kolory
4. **Połącz szpule** — wybierz, które szpule z magazynu są używane
5. Kliknij **Oblicz koszt**

### Wynik pokazuje:

- **Filament** — koszt materiału na kolor
- **Odpady/straty** — na podstawie współczynnika odpadów
- **Prąd** — używa ceny spot na żywo z Nordpool, jeśli dostępna
- **Zużycie** — dysza + wartość maszyny
- **Praca** — stawka godzinowa + czas przygotowania
- **Koszt produkcji** — suma wszystkiego powyżej
- **Marża** — Twoja marża zysku
- **Koszt całkowity** — minimum, które powinieneś pobierać
- **Sugerowane ceny sprzedaży** — marża 2×, 2,5×, 3×

## Strategie cenowe

### Marża 2× (zalecane minimum)
Pokrywa koszt produkcji + nieprzewidziane wydatki. Stosuj dla przyjaciół/rodziny i prostej geometrii.

### Marża 2,5× (standard)
Dobra równowaga między ceną a wartością. Sprawdza się dla większości produktów.

### Marża 3× (premium)
Dla złożonych modeli, wielokolorowych, wysokiej jakości lub rynków niszowych.

:::warning Nie zapomnij o ukrytych kosztach
- Nieudane wydruki (5-15% wszystkich wydruków kończy się niepowodzeniem)
- Filament, który się nie zużywa (ostatnie 50g jest często problematyczne)
- Czas poświęcony na obsługę klienta
- Opakowanie i wysyłka
- Konserwacja drukarki
:::

## Przykład: Wycena uchwytu na telefon

| Parametr | Wartość |
|-----------|-------|
| Waga filamentu | 45g PLA |
| Czas druku | 2 godziny |
| Cena spot | 1,20 kr/kWh |

**Obliczenie:**
- Filament: 45g × 0,25 kr/g = 11,25 kr
- Odpady (10%): 1,13 kr
- Prąd: 2h × 0,15kW × 1,20 = 0,36 kr
- Zużycie: 2h × 0,15 = 0,30 kr
- Praca: (2h + 10min) × 200 kr/h = 433 kr (lub 0 dla hobby)
- **Koszt produkcji (hobby)**: ~13 kr
- **Cena sprzedaży 2,5×**: ~33 kr

## Zapisz wycenę

Kliknij **Zapisz wycenę**, aby zarchiwizować obliczenie. Zapisane wyceny znajdziesz w zakładce **Zapisane** w kalkulatorze kosztów.

## E-commerce

Jeśli korzystasz z [modułu e-commerce](../integrations/ecommerce), możesz łączyć wyceny kosztów bezpośrednio z zamówieniami w celu automatycznego obliczania cen.
