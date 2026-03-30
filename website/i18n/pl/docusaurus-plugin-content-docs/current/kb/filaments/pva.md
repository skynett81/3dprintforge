---
sidebar_position: 8
title: PVA i materiały podporowe
description: Przewodnik po PVA, HIPS, PVB i innych materiałach podporowych dla drukarek Bambu Lab
---

# PVA i materiały podporowe

Materiały podporowe są używane do drukowania złożonych geometrii z nawisami, mostkami i wewnętrznymi wnękami, których nie można drukować bez tymczasowego podparcia. Po wydruku materiał podporowy jest usuwany — mechanicznie lub przez rozpuszczenie w rozpuszczalniku.

## Przegląd

| Materiał | Rozpuszczalnik | Łączyć z | Czas rozpuszczania | Trudność |
|----------|---------------|---------|-------------------|----------|
| PVA | Woda | PLA, PETG | 12–24 godzin | Wymagający |
| HIPS | d-Limonen | ABS, ASA | 12–24 godzin | Umiarkowana |
| PVB | Izopropanol (IPA) | PLA, PETG | 6–12 godzin | Umiarkowana |
| BVOH | Woda | PLA, PETG, PA | 4–8 godzin | Wymagający |

---

## PVA (Alkohol poliwinylowy)

PVA to rozpuszczalny w wodzie materiał podporowy, najczęściej stosowany wybór dla wydruków na bazie PLA ze złożonymi strukturami podporowymi.

### Ustawienia

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 190–210 °C |
| Temperatura stołu | 45–60 °C |
| Chłodzenie elementu | 100% |
| Prędkość | 60–80% |
| Retrakcja | Zwiększona (6–8 mm) |

### Zalecane płyty budujące

| Płyta | Przydatność | Klej w sztyfcie? |
|-------|------------|-----------------|
| Cool Plate (Smooth PEI) | Doskonała | Nie |
| Textured PEI | Dobra | Nie |
| Engineering Plate | Dobra | Nie |
| High Temp Plate | Unikać | — |

### Kompatybilność

PVA działa najlepiej z materiałami drukującymi w **podobnych temperaturach**:

| Materiał główny | Kompatybilność | Uwaga |
|-----------------|---------------|-------|
| PLA | Doskonała | Idealna kombinacja |
| PETG | Dobra | Temperatura stołu może być nieco wysoka dla PVA |
| ABS/ASA | Słaba | Temperatura komory zbyt wysoka — PVA degraduje |
| PA (Nylon) | Słaba | Temperatury zbyt wysokie |

### Rozpuszczanie

- Umieść gotowy wydruk w **letniej wodzie** (ok. 40 °C)
- PVA rozpuszcza się w ciągu **12–24 godzin** w zależności od grubości
- Mieszaj wodę regularnie, aby przyspieszyć proces
- Zmieniaj wodę co 6–8 godzin dla szybszego rozpuszczania
- Myjka ultradźwiękowa daje znacznie szybsze rezultaty (2–6 godzin)

:::danger PVA jest ekstremalnie higroskopijne
PVA pochłania wilgoć z powietrza **bardzo szybko** — nawet godziny ekspozycji mogą zrujnować wynik druku. PVA, które pochłonęło wilgoć, powoduje:

- Silne bąbelkowanie i trzaski
- Słabą przyczepność do materiału głównego
- Stringing i lepką powierzchnię
- Zatkanie dyszy

**Zawsze susz PVA bezpośrednio przed użyciem** i drukuj z suchego środowiska (suszarka).
:::

### Suszenie PVA

| Parametr | Wartość |
|----------|---------|
| Temperatura suszenia | 45–55 °C |
| Czas suszenia | 6–10 godzin |
| Poziom higroskopijności | Ekstremalnie wysoki |
| Metoda przechowywania | Szczelne pudełko ze środkiem suszącym, zawsze |

---

## HIPS (Polistyren wysokoudarowy)

HIPS to materiał podporowy rozpuszczalny w d-limonenie (rozpuszczalnik na bazie cytrusów). Jest preferowanym materiałem podporowym dla ABS i ASA.

### Ustawienia

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 220–240 °C |
| Temperatura stołu | 90–100 °C |
| Temperatura komory | 40–50 °C (zalecana) |
| Chłodzenie elementu | 20–40% |
| Prędkość | 70–90% |

### Kompatybilność

| Materiał główny | Kompatybilność | Uwaga |
|-----------------|---------------|-------|
| ABS | Doskonała | Idealna kombinacja — podobne temperatury |
| ASA | Doskonała | Bardzo dobra przyczepność |
| PLA | Słaba | Zbyt duża różnica temperatur |
| PETG | Słaba | Różne zachowanie termiczne |

### Rozpuszczanie w d-Limonenie

- Umieść wydruk w **d-limonenie** (rozpuszczalnik na bazie cytrusów)
- Czas rozpuszczania: **12–24 godzin** w temperaturze pokojowej
- Podgrzanie do 35–40 °C przyspiesza proces
- d-Limonen można ponownie użyć 2–3 razy
- Przepłucz element wodą i osusz po rozpuszczeniu

### Zalety w porównaniu z PVA

- **Znacznie mniej wrażliwy na wilgoć** — łatwiejszy w przechowywaniu i obsłudze
- **Mocniejszy jako materiał podporowy** — wytrzymuje więcej bez rozkładu
- **Lepsza kompatybilność termiczna** z ABS/ASA
- **Łatwiejszy w druku** — mniej zatorów i problemów

:::warning d-Limonen jest rozpuszczalnikiem
Używaj rękawic i pracuj w wentylowanym pomieszczeniu. d-Limonen może podrażniać skórę i błony śluzowe. Przechowywać w miejscu niedostępnym dla dzieci.
:::

---

## PVB (Poliwinylobutyral)

PVB to unikalny materiał podporowy rozpuszczalny w izopropanolu (IPA), który może być używany do wygładzania powierzchni parą IPA.

### Ustawienia

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 200–220 °C |
| Temperatura stołu | 55–75 °C |
| Chłodzenie elementu | 80–100% |
| Prędkość | 70–80% |

### Kompatybilność

| Materiał główny | Kompatybilność | Uwaga |
|-----------------|---------------|-------|
| PLA | Dobra | Akceptowalna przyczepność |
| PETG | Umiarkowana | Temperatura stołu może się różnić |
| ABS/ASA | Słaba | Temperatury zbyt wysokie |

### Wygładzanie powierzchni parą IPA

Unikalną właściwością PVB jest to, że powierzchnię można wygładzić parą IPA:

1. Umieść element w zamkniętym pojemniku
2. Połóż nasączoną IPA ściereczkę na dnie (bez bezpośredniego kontaktu z elementem)
3. Pozwól parze działać przez **30–60 minut**
4. Wyjmij i pozwól schnąć 24 godziny
5. Rezultat to gładka, półbłyszcząca powierzchnia

:::tip PVB jako wykończenie powierzchni
Chociaż PVB jest przede wszystkim materiałem podporowym, może być drukowany jako zewnętrzna warstwa na elementach PLA, aby uzyskać powierzchnię wygładzaną IPA. Daje to wykończenie przypominające wygładzony acetonem ABS.
:::

---

## Porównanie materiałów podporowych

| Właściwość | PVA | HIPS | PVB | BVOH |
|------------|-----|------|-----|------|
| Rozpuszczalnik | Woda | d-Limonen | IPA | Woda |
| Czas rozpuszczania | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Wrażliwość na wilgoć | Ekstremalnie wysoka | Niska | Umiarkowana | Ekstremalnie wysoka |
| Trudność | Wymagający | Umiarkowana | Umiarkowana | Wymagający |
| Cena | Wysoka | Umiarkowana | Wysoka | Bardzo wysoka |
| Najlepszy z | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Dostępność | Dobra | Dobra | Ograniczona | Ograniczona |
| Kompatybilny z AMS | Tak (ze środkiem suszącym) | Tak | Tak | Problematyczny |

---

## Wskazówki do podwójnej ekstruzji i wielokolorowego

### Ogólne wytyczne

- **Ilość purge** — materiały podporowe wymagają dobrego oczyszczania przy zmianie materiału (minimum 150–200 mm³)
- **Warstwy interfejsu** — użyj 2–3 warstw interfejsu między podporą a głównym elementem dla czystej powierzchni
- **Odległość** — ustaw odległość podpory na 0,1–0,15 mm dla łatwego usunięcia po rozpuszczeniu
- **Wzór podpory** — użyj wzoru trójkątnego dla PVA/BVOH, siatki dla HIPS

### Konfiguracja AMS

- Umieść materiał podporowy w **slocie AMS ze środkiem suszącym**
- Dla PVA: rozważ zewnętrzną suszarkę z połączeniem Bowden
- Skonfiguruj poprawny profil materiałowy w Bambu Studio
- Testuj na prostym modelu z nawisem przed drukiem złożonych elementów

### Częste problemy i rozwiązania

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|------------|
| Podpora nie przylega | Zbyt duża odległość | Zmniejsz odległość interfejsu do 0,05 mm |
| Podpora przylega za mocno | Zbyt mała odległość | Zwiększ odległość interfejsu do 0,2 mm |
| Bąbelki w materiale podporowym | Wilgoć | Wysusz filament dokładnie |
| Stringing między materiałami | Niewystarczająca retrakcja | Zwiększ retrakcję o 1–2 mm |
| Zła powierzchnia przy podporze | Zbyt mało warstw interfejsu | Zwiększ do 3–4 warstw interfejsu |

:::tip Zacznij prosto
Dla pierwszego druku z materiałem podporowym: użyj PLA + PVA, prostego modelu z wyraźnym nawisem (45°+) i domyślnych ustawień w Bambu Studio. Optymalizuj w miarę zdobywania doświadczenia.
:::
