---
sidebar_position: 6
title: ASA
description: Przewodnik po druku ASA z Bambu Lab — odporność na UV, zastosowanie na zewnątrz, temperatury i wskazówki
---

# ASA

ASA (Akrylonitryl Styren Akrylan) to odporna na UV odmiana ABS, opracowana specjalnie do zastosowań na zewnątrz. Materiał łączy wytrzymałość i sztywność ABS ze znacznie lepszą odpornością na promieniowanie UV, starzenie i warunki atmosferyczne.

## Ustawienia

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 240–260 °C |
| Temperatura stołu | 90–110 °C |
| Temperatura komory | 40–50 °C (zalecana) |
| Chłodzenie elementu | 30–50% |
| Prędkość | 80–100% |
| Suszenie wymagane | Tak |

## Zalecane płyty budujące

| Płyta | Przydatność | Klej w sztyfcie? |
|-------|------------|-----------------|
| Engineering Plate | Doskonała | Nie |
| High Temp Plate | Dobra | Tak |
| Textured PEI | Akceptowalna | Tak |
| Cool Plate (Smooth PEI) | Niezalecana | — |

:::tip Engineering Plate jest najlepsza dla ASA
Engineering Plate zapewnia najbardziej niezawodną przyczepność dla ASA bez kleju w sztyfcie. Płyta wytrzymuje wysokie temperatury stołu i zapewnia dobrą przyczepność bez trwałego przylegania elementu.
:::

## Wymagania drukarki

ASA wymaga **zamkniętej komory (obudowy)** dla najlepszych rezultatów. Bez obudowy doświadczysz:

- **Warping** — narożniki unoszą się z płyty budującej
- **Rozwarstwienie** — słabe wiązanie między warstwami
- **Pęknięcia powierzchniowe** — widoczne pęknięcia wzdłuż wydruku

| Drukarka | Odpowiednia dla ASA? | Uwaga |
|----------|---------------------|-------|
| X1C | Doskonała | W pełni zamknięta, aktywne ogrzewanie |
| X1E | Doskonała | W pełni zamknięta, aktywne ogrzewanie |
| P1S | Dobra | Zamknięta, pasywne ogrzewanie |
| P1P | Możliwa z akcesoriami | Wymaga akcesorium obudowy |
| A1 | Niezalecana | Otwarta rama |
| A1 Mini | Niezalecana | Otwarta rama |

## ASA vs ABS — porównanie

| Właściwość | ASA | ABS |
|------------|-----|-----|
| Odporność na UV | Doskonała | Słaba |
| Zastosowanie na zewnątrz | Tak | Nie (żółknie i staje się kruchy) |
| Warping | Umiarkowany | Wysoki |
| Powierzchnia | Matowa, jednolita | Matowa, jednolita |
| Odporność chemiczna | Dobra | Dobra |
| Cena | Nieco wyższa | Niższa |
| Zapach podczas druku | Umiarkowany | Silny |
| Udarność | Dobra | Dobra |
| Odporność temperaturowa | ~95–105 °C | ~95–105 °C |

:::warning Wentylacja
ASA wydziela gazy podczas druku, które mogą być drażniące. Drukuj w dobrze wentylowanym pomieszczeniu lub z systemem filtracji powietrza. Nie drukuj ASA w pomieszczeniu, w którym przebywasz przez dłuższy czas bez wentylacji.
:::

## Suszenie

ASA jest **umiarkowanie higroskopijne** i pochłania wilgoć z powietrza z czasem.

| Parametr | Wartość |
|----------|---------|
| Temperatura suszenia | 65 °C |
| Czas suszenia | 4–6 godzin |
| Poziom higroskopijności | Średni |
| Oznaki wilgoci | Trzaski, bąbelki, zła powierzchnia |

- Przechowuj w szczelnym worku z żelem krzemionkowym po otwarciu
- AMS ze środkiem suszącym wystarczy do krótkotrwałego przechowywania
- Do dłuższego przechowywania: użyj worków próżniowych lub suszarki do filamentu

## Zastosowania

ASA to preferowany materiał do wszystkiego, co będzie używane **na zewnątrz**:

- **Komponenty samochodowe** — obudowy lusterek, detale deski rozdzielczej, nakładki wentylacyjne
- **Narzędzia ogrodowe** — uchwyty, zaciski, części do mebli ogrodowych
- **Tablice zewnętrzne** — szyldy, litery, logotypy
- **Części dronów** — podwozie, uchwyty kamery
- **Montaż paneli słonecznych** — uchwyty i kątowniki
- **Części skrzynki pocztowej** — mechanizmy i dekoracje

## Wskazówki do udanego druku ASA

### Brim i przyczepność

- **Używaj brimu** dla dużych elementów i elementów z małą powierzchnią kontaktu
- Brim 5–8 mm skutecznie zapobiega warpingowi
- Dla mniejszych elementów możesz spróbować bez brimu, ale miej go gotowego jako zapas

### Unikaj przeciągów

- **Zamknij wszystkie drzwi i okna** w pomieszczeniu podczas druku
- Przeciągi i zimne powietrze to najgorszy wróg ASA
- Nie otwieraj drzwi komory podczas druku

### Stabilność temperatury

- Pozwól komorze nagrzać się przez **10–15 minut** przed rozpoczęciem druku
- Stabilna temperatura komory daje bardziej jednolite wyniki
- Unikaj umieszczania drukarki blisko okien lub otworów wentylacyjnych

### Chłodzenie

- ASA potrzebuje **ograniczonego chłodzenia** — 30–50% jest typowe
- Dla nawisów i mostków możesz zwiększyć do 60–70%, ale spodziewaj się pewnego rozwarstwienia
- Dla części mechanicznych: priorytetowo traktuj wiązanie warstw nad detalami, zmniejszając chłodzenie

:::tip Pierwszy raz z ASA?
Zacznij od małego elementu testowego (np. kostki 30 mm), aby skalibrować ustawienia. ASA zachowuje się bardzo podobnie do ABS, ale z nieco mniejszą tendencją do warpingu. Jeśli masz doświadczenie z ABS, ASA poczujesz jak ulepszenie.
:::

---

## Skurcz

ASA kurczy się bardziej niż PLA i PETG, ale ogólnie nieco mniej niż ABS:

| Materiał | Skurcz |
|----------|--------|
| PLA | ~0,3–0,5% |
| PETG | ~0,3–0,6% |
| ASA | ~0,5–0,7% |
| ABS | ~0,7–0,8% |

Dla elementów z wąskimi tolerancjami: kompensuj 0,5–0,7% w slicerze lub najpierw przetestuj na próbnych elementach.

---

## Obróbka końcowa

- **Wygładzanie acetonem** — ASA można wygładzić parami acetonu, tak jak ABS
- **Szlifowanie** — szlifuje się dobrze papierem ściernym o ziarnistości 200–400
- **Klejenie** — klej CA lub spawanie acetonem działa doskonale
- **Malowanie** — przyjmuje farbę dobrze po lekkim szlifowaniu

:::danger Obchodzenie się z acetonem
Aceton jest łatwopalny i wydziela toksyczne opary. Zawsze używaj w dobrze wentylowanym pomieszczeniu, unikaj otwartego ognia i używaj środków ochronnych (rękawice i okulary).
:::
