---
sidebar_position: 1
title: Słaba przyczepność
description: Przyczyny i rozwiązania słabej przyczepności pierwszej warstwy — płyta, temperatura, klej, prędkość, przesunięcie Z
---

# Słaba przyczepność

Słaba przyczepność to jeden z najczęstszych problemów w druku 3D. Pierwsza warstwa się nie klei lub wydruki odklejają się w połowie.

## Objawy

- Pierwsza warstwa nie przylega — wydruk się przesuwa lub unosi
- Krawędzie i narożniki się podnoszą (warping)
- Wydruk odpada w połowie zadania
- Nierówna pierwsza warstwa z dziurami lub luźnymi nićmi

## Lista kontrolna — próbuj w tej kolejności

### 1. Wyczyść płytę
Najczęstszą przyczyną słabej przyczepności jest tłuszcz lub brud na płycie.

```
1. Wytrzyj płytę IPA (alkohol izopropylowy)
2. Unikaj dotykania powierzchni drukowania gołymi palcami
3. Przy utrzymujących się problemach: myj wodą z łagodnym detergentem
```

### 2. Skalibruj przesunięcie Z

Przesunięcie Z to wysokość między dyszą a płytą przy pierwszej warstwie. Zbyt wysoko = nić wisi luźno. Zbyt nisko = dysza zeskrobuje płytę.

**Prawidłowe przesunięcie Z:**
- Pierwsza warstwa powinna wyglądać lekko przezroczjście
- Nić powinna być dociskana do płyty z lekkim "squish"
- Nitki powinny lekko stopić się w siebie nawzajem

Dostosuj przesunięcie Z przez **Sterowanie → Dostosuj Z na żywo** podczas drukowania.

:::tip Dostosuj na żywo podczas drukowania
3DPrintForge pokazuje przyciski dostosowania przesunięcia Z podczas aktywnego drukowania. Dostosuj krokami ±0,02 mm obserwując pierwszą warstwę.
:::

### 3. Sprawdź temperaturę stołu

| Materiał | Zbyt niska temperatura | Zalecana |
|-----------|-------------|---------|
| PLA | Poniżej 30 °C | 35–45 °C |
| PETG | Poniżej 60 °C | 70–85 °C |
| ABS | Poniżej 80 °C | 90–110 °C |
| TPU | Poniżej 25 °C | 30–45 °C |

Spróbuj zwiększyć temperaturę stołu o 5 °C na raz.

### 4. Użyj kleju

Klej poprawia przyczepność dla większości materiałów na większości płyt:
- Nanieś cienką, równomierną warstwę
- Poczekaj 30 sekund na wyschnięcie przed startem
- Szczególnie ważne dla: ABS, PA, PC, PETG (na gładkim PEI)

### 5. Zmniejsz prędkość pierwszej warstwy

Niższa prędkość przy pierwszej warstwie daje lepszy kontakt między filamentem a płytą:
- Standardowo: 50 mm/s dla pierwszej warstwy
- Spróbuj: 30–40 mm/s
- Bambu Studio: w **Jakość → Prędkość pierwszej warstwy**

### 6. Sprawdź stan płyty

Zużyta płyta daje słabą przyczepność nawet przy doskonałych ustawieniach. Wymień płytę gdy:
- Powłoka PEI jest widocznie uszkodzona
- Czyszczenie nie pomaga

### 7. Użyj brim

Dla materiałów skłonnych do warpingu (ABS, PA, duże płaskie obiekty):
- Dodaj brim w slicerze: 5–10 mm szerokości
- Zwiększa powierzchnię kontaktu i przytrzymuje krawędzie

## Specjalne przypadki

### Duże płaskie obiekty
Duże płaskie obiekty są najbardziej narażone na odklejanie. Środki zaradcze:
- Brim 8–10 mm
- Zwiększ temperaturę stołu
- Zamknij komorę (ABS/PA)
- Zmniejsz chłodzenie

### Zeszklone powierzchnie
Płyty z za dużą ilością kleju z czasem mogą się szklić. Dokładnie umyj wodą i zacznij od nowa.

### Po zmianie filamentu
Różne materiały wymagają różnych ustawień. Sprawdź, czy temperatura stołu i płyta są skonfigurowane dla nowego materiału.
