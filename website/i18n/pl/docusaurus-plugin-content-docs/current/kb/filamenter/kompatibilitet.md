---
sidebar_position: 10
title: Macierz kompatybilności
description: Kompletny przegląd kompatybilności materiałów z płytami, drukarkami i dyszami Bambu Lab
---

# Macierz kompatybilności

Ta strona zawiera kompletny przegląd, które materiały działają z którymi płytami budującymi, drukarkami i typami dysz. Używaj tabel jako odniesienia przy planowaniu wydruków z nowymi materiałami.

---

## Materiały i płyty budujące

| Materiał | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Klej w sztyfcie |
|----------|-----------|-------------------|-----------------|--------------|----------------|
| PLA | Doskonała | Dobra | Niezalecana | Dobra | Nie |
| PLA+ | Doskonała | Dobra | Niezalecana | Dobra | Nie |
| PLA-CF | Doskonała | Dobra | Niezalecana | Dobra | Nie |
| PLA Silk | Doskonała | Dobra | Niezalecana | Dobra | Nie |
| PETG | Słaba | Doskonała | Dobra | Dobra | Tak (Cool) |
| PETG-CF | Słaba | Doskonała | Dobra | Akceptowalna | Tak (Cool) |
| ABS | Niezalecana | Doskonała | Dobra | Akceptowalna | Tak (HT) |
| ASA | Niezalecana | Doskonała | Dobra | Akceptowalna | Tak (HT) |
| TPU | Dobra | Dobra | Niezalecana | Doskonała | Nie |
| PA (Nylon) | Niezalecana | Doskonała | Dobra | Słaba | Tak |
| PA-CF | Niezalecana | Doskonała | Dobra | Słaba | Tak |
| PA-GF | Niezalecana | Doskonała | Dobra | Słaba | Tak |
| PC | Niezalecana | Akceptowalna | Doskonała | Niezalecana | Tak (Eng) |
| PC-CF | Niezalecana | Akceptowalna | Doskonała | Niezalecana | Tak (Eng) |
| PVA | Doskonała | Dobra | Niezalecana | Dobra | Nie |
| HIPS | Niezalecana | Dobra | Dobra | Akceptowalna | Nie |
| PVB | Dobra | Dobra | Niezalecana | Dobra | Nie |

**Objaśnienie:**
- **Doskonała** — działa optymalnie, zalecana kombinacja
- **Dobra** — działa dobrze, akceptowalna alternatywa
- **Akceptowalna** — działa, ale nie idealnie — wymaga dodatkowych działań
- **Słaba** — może działać z modyfikacjami, ale niezalecana
- **Niezalecana** — słabe wyniki lub ryzyko uszkodzenia płyty

:::tip PETG i Cool Plate
PETG przylega **zbyt mocno** do Cool Plate (Smooth PEI) i może oderwać powłokę PEI przy zdejmowaniu elementu. Zawsze używaj kleju w sztyfcie jako warstwy rozdzielającej, lub wybierz Engineering Plate.
:::

:::warning PC i wybór płyty
PC wymaga High Temp Plate ze względu na wysokie temperatury stołu (100–120 °C). Inne płyty mogą się trwale odkształcić przy tych temperaturach.
:::

---

## Materiały i drukarki

| Materiał | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak |
| PLA+ | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak |
| PLA-CF | Tak* | Tak* | Tak* | Tak* | Tak* | Tak | Tak | Tak* | Tak* | Tak* |
| PETG | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak |
| PETG-CF | Tak* | Tak* | Tak* | Tak* | Tak* | Tak | Tak | Tak* | Tak* | Tak* |
| ABS | Nie | Nie | Możliwe** | Tak | Tak | Tak | Tak | Tak | Tak | Tak |
| ASA | Nie | Nie | Możliwe** | Tak | Tak | Tak | Tak | Tak | Tak | Tak |
| TPU | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak |
| PA (Nylon) | Nie | Nie | Nie | Możliwe** | Możliwe** | Tak | Tak | Tak | Tak | Tak |
| PA-CF | Nie | Nie | Nie | Nie | Nie | Tak | Tak | Możliwe** | Możliwe** | Możliwe** |
| PA-GF | Nie | Nie | Nie | Nie | Nie | Tak | Tak | Możliwe** | Możliwe** | Możliwe** |
| PC | Nie | Nie | Nie | Możliwe** | Nie | Tak | Tak | Możliwe** | Możliwe** | Możliwe** |
| PC-CF | Nie | Nie | Nie | Nie | Nie | Tak | Tak | Nie | Nie | Nie |
| PVA | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak | Tak |
| HIPS | Nie | Nie | Możliwe** | Tak | Tak | Tak | Tak | Tak | Tak | Tak |

**Objaśnienie:**
- **Tak** — w pełni obsługiwany i zalecany
- **Tak*** — wymaga hartowanej dyszy stalowej (HS01 lub równoważna)
- **Możliwe**** — może działać z ograniczeniami, nie zalecane oficjalnie
- **Nie** — nieodpowiedni (brak obudowy, zbyt niskie temperatury itp.)

:::danger Wymagania obudowy
Materiały wymagające obudowy (ABS, ASA, PA, PC):
- **A1 i A1 Mini** mają otwartą ramę — nieodpowiednie
- **P1P** ma otwartą ramę — wymaga akcesorium obudowy
- **P1S** ma obudowę, ale bez aktywnego ogrzewania komory
- **X1C i X1E** mają pełną obudowę z aktywnym ogrzewaniem — zalecane dla wymagających materiałów
:::

---

## Materiały i typy dysz

| Materiał | Mosiądz (standard) | Hartowana stal (HS01) | Hardened Steel |
|----------|--------------------|-----------------------|----------------|
| PLA | Doskonała | Doskonała | Doskonała |
| PLA+ | Doskonała | Doskonała | Doskonała |
| PLA-CF | Nie używać | Doskonała | Doskonała |
| PLA Silk | Doskonała | Doskonała | Doskonała |
| PETG | Doskonała | Doskonała | Doskonała |
| PETG-CF | Nie używać | Doskonała | Doskonała |
| ABS | Doskonała | Doskonała | Doskonała |
| ASA | Doskonała | Doskonała | Doskonała |
| TPU | Doskonała | Dobra | Dobra |
| PA (Nylon) | Dobra | Doskonała | Doskonała |
| PA-CF | Nie używać | Doskonała | Doskonała |
| PA-GF | Nie używać | Doskonała | Doskonała |
| PC | Dobra | Doskonała | Doskonała |
| PC-CF | Nie używać | Doskonała | Doskonała |
| PVA | Doskonała | Dobra | Dobra |
| HIPS | Doskonała | Doskonała | Doskonała |
| PVB | Doskonała | Dobra | Dobra |

:::danger Włókno węglowe i szklane wymagają hartowanej dyszy
Wszystkie materiały z **-CF** (włókno węglowe) lub **-GF** (włókno szklane) **wymagają hartowanej dyszy stalowej**. Mosiądz zużywa się w godzinach do dni z tymi materiałami. Zalecana Bambu Lab HS01.

Materiały wymagające hartowanej dyszy:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Mosiądz vs hartowana stal dla zwykłych materiałów
Dysza mosiężna zapewnia **lepszą przewodność cieplną** i tym samym płynniejszą ekstruzję dla zwykłych materiałów (PLA, PETG, ABS). Hartowana stal działa dobrze, ale może wymagać 5–10 °C wyższej temperatury. Używaj mosiądzu na co dzień i przełączaj na hartowaną stal dla materiałów CF/GF.
:::

---

## Wskazówki dotyczące zmian materiału

Przy zmianie materiałów w AMS lub ręcznie, prawidłowe czyszczenie jest ważne, aby uniknąć zanieczyszczenia.

### Zalecana ilość purge

| Z → Na | Ilość purge | Uwaga |
|--------|------------|-------|
| PLA → PLA (inny kolor) | 100–150 mm³ | Standardowa zmiana koloru |
| PLA → PETG | 200–300 mm³ | Wzrost temperatury, inny przepływ |
| PETG → PLA | 200–300 mm³ | Spadek temperatury |
| ABS → PLA | 300–400 mm³ | Duża różnica temperatur |
| PLA → ABS | 300–400 mm³ | Duża różnica temperatur |
| PA → PLA | 400–500 mm³ | Nylon pozostaje w hotendzie |
| PC → PLA | 400–500 mm³ | PC wymaga dokładnego czyszczenia |
| Ciemny → Jasny | 200–300 mm³ | Ciemny pigment jest trudny do wypłukania |
| Jasny → Ciemny | 100–150 mm³ | Łatwiejsze przejście |

### Zmiana temperatury przy zmianie materiału

| Przejście | Zalecenie |
|-----------|----------|
| Zimny → Gorący (np. PLA → ABS) | Podgrzej do nowego materiału, oczyść dokładnie |
| Gorący → Zimny (np. ABS → PLA) | Najpierw oczyść przy wysokiej temp., potem obniż |
| Podobne temperatury (np. PLA → PLA) | Standardowe czyszczenie |
| Duża różnica (np. PLA → PC) | Pośredni przystanek z PETG może pomóc |

:::warning Nylon i PC pozostawiają resztki
PA (Nylon) i PC są szczególnie trudne do oczyszczenia. Po użyciu tych materiałów:
1. Oczyść **PETG** lub **ABS** przy wysokiej temperaturze (260–280 °C)
2. Przepuść co najmniej **500 mm³** materiału czyszczącego
3. Wzrokowo sprawdź ekstruzję — powinna być całkowicie czysta bez przebarwień
:::

---

## Szybkie odniesienie — wybór materiału

Nie wiesz, jakiego materiału potrzebujesz? Użyj tego przewodnika:

| Potrzeba | Zalecany materiał |
|----------|-------------------|
| Prototypowanie / codzienny użytek | PLA |
| Wytrzymałość mechaniczna | PETG, PLA Tough |
| Zastosowanie na zewnątrz | ASA |
| Odporność na ciepło | ABS, ASA, PC |
| Elastyczne części | TPU |
| Maksymalna wytrzymałość | PA-CF, PC-CF |
| Przezroczysty | PETG (naturalny), PC (naturalny) |
| Estetyka / dekoracja | PLA Silk, PLA Sparkle |
| Snap-fit / zawiasy żywe | PETG, PA |
| Kontakt z żywnością | PLA (z zastrzeżeniami) |
