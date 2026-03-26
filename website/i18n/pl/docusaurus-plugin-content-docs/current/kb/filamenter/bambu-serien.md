---
sidebar_position: 9
title: Filamenty Bambu Lab
description: Kompletny przegląd własnych serii filamentów Bambu Lab — ustawienia, RFID i kompatybilność z AMS
---

# Filamenty Bambu Lab

Bambu Lab produkuje szeroką gamę filamentów specjalnie zoptymalizowanych pod swoje drukarki. Wszystkie filamenty Bambu Lab dostarczane są z **tagiem RFID**, który jest automatycznie wykrywany przez drukarkę i ustawia właściwe parametry.

## RFID i AMS

Wszystkie filamenty Bambu Lab mają **chip RFID** wbudowany w szpulę. Zapewnia to:

- **Automatyczne rozpoznawanie** — drukarka odczytuje typ materiału, kolor i ustawienia
- **Pozostała ilość** — szacowany filament na szpuli
- **Prawidłowe ustawienia** — temperatura, prędkość i chłodzenie ustawiane automatycznie
- **Kompatybilność z AMS** — bezproblemowa zmiana materiału w AMS

:::tip Filamenty innych producentów w AMS
AMS działa również z filamentami innych producentów, ale musisz ustawić parametry ręcznie w Bambu Studio. Automatyczna detekcja RFID jest wyłączna dla filamentów Bambu Lab.
:::

---

## Seria PLA

Seria PLA Bambu Lab jest najbardziej rozbudowana, obejmując wszystko od produktów podstawowych po efekty specjalne.

### PLA Basic

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 220 °C |
| Temperatura stołu | 35–45 °C |
| Chłodzenie | 100% |
| RFID | Tak |
| Kompatybilny z AMS | Tak |
| Cena | Budżetowa |

Standardowy filament do codziennego druku. Dostępny w szerokim wyborze kolorów.

### PLA Matte | PLA Silk | PLA Sparkle | PLA Marble

Warianty PLA z różnymi efektami powierzchniowymi — matowy, jedwabisty metaliczny, brokatowy i marmurkowy. Wszystkie drukują przy standardowych ustawieniach PLA (220–230 °C dysza, 35–45 °C stół, 80–100% chłodzenie).

### PLA Tough (PLA-S)

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 220–230 °C |
| Temperatura stołu | 35–55 °C |
| Chłodzenie | 100% |
| Wytrzymałość | 20–30% mocniejszy niż standardowy PLA |

Wzmocniony PLA ze zwiększoną udarnością.

### PLA Galaxy

Łączy efekt brokatowy z gradientami kolorów. Drukuje na standardowych ustawieniach PLA.

---

## Seria PETG

### PETG Basic

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 240–250 °C |
| Temperatura stołu | 70–80 °C |
| Chłodzenie | 50–70% |
| RFID | Tak |
| Kompatybilny z AMS | Tak |

### PETG HF (High Flow)

Wersja szybkościowa PETG do 300 mm/s. Idealna do dużych elementów i produkcji seryjnej.

### PETG-CF

PETG wzmocniony włóknem węglowym. Wymaga hartowanej dyszy (HS01 lub równoważnej). 250–270 °C dysza, 70–80 °C stół.

:::warning Hartowana dysza dla wariantów CF
Wszystkie filamenty wzmocnione włóknem węglowym (PLA-CF, PETG-CF, PA-CF, PC-CF) wymagają hartowanej dyszy stalowej. Mosiądz zużywa się w godzinach z materiałami CF.
:::

---

## ABS i ASA

### ABS

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 250–270 °C |
| Temperatura stołu | 90–110 °C |
| Temperatura komory | Zalecana 40 °C+ |
| Chłodzenie | 20–40% |
| Obudowa | Zalecana |

### ASA

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 240–260 °C |
| Temperatura stołu | 90–110 °C |
| Temperatura komory | Zalecana 40 °C+ |
| Chłodzenie | 30–50% |
| Obudowa | Zalecana |
| Odporność na UV | Doskonała |

---

## TPU 95A

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 220–240 °C |
| Temperatura stołu | 35–50 °C |
| Chłodzenie | 50–80% |
| Prędkość | 50–70% (zmniejszona) |
| Twardość Shore | 95A |
| Kompatybilny z AMS | Ograniczony (bezpośrednie podawanie zalecane) |

Elastyczny filament do części gumopodobnych.

:::tip TPU w AMS
TPU 95A Bambu Lab jest specjalnie sformułowany do pracy z AMS. Miększe TPU (85A i poniżej) powinno być podawane bezpośrednio do ekstrudera.
:::

---

## Seria PA (Nylon)

### PA6-CF / PA6-GF

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 270–290 °C |
| Temperatura stołu | 90–100 °C |
| Temperatura komory | 50 °C+ (wymagana) |
| Chłodzenie | 0–20% |
| Dysza | Hartowana stal wymagana |
| Obudowa | Wymagana |
| Suszenie | 70–80 °C przez 8–12 godzin |

Nylon wzmocniony włóknem węglowym/szklanym — jedne z najwytrzymalszych materiałów FDM.

---

## PC

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 260–280 °C |
| Temperatura stołu | 100–120 °C |
| Temperatura komory | 50–60 °C (wymagana) |
| Chłodzenie | 0–20% |
| Obudowa | Wymagana |
| Suszenie | 70–80 °C przez 6–8 godzin |

Poliwęglan Bambu Lab dla maksymalnej wytrzymałości i odporności na ciepło.

---

## Materiały podporowe

### PVA

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 190–210 °C |
| Temperatura stołu | 45–60 °C |
| Rozpuszczalnik | Woda |
| Łączyć z | PLA, PETG |

### HIPS

| Parametr | Wartość |
|----------|---------|
| Temperatura dyszy | 220–240 °C |
| Temperatura stołu | 90–100 °C |
| Rozpuszczalnik | d-Limonen |
| Łączyć z | ABS, ASA |

---

## Kontrola jakości i spójność kolorów

Bambu Lab utrzymuje ścisłą kontrolę jakości swoich filamentów:

- **Tolerancja średnicy** — ±0,02 mm (lider branży)
- **Spójność kolorów** — kontrola partii zapewnia jednolity kolor między szpulami
- **Jakość szpuli** — równe nawijanie bez węzłów i nakładek
- **Próżniowe opakowanie** — każda szpula dostarczana w próżni ze środkiem suszącym
- **Testy profilu temperaturowego** — każda partia testowana na optymalną temperaturę

:::tip Numer koloru dla spójności
Bambu Lab używa numerów kolorów (np. „Bambu PLA Matte Charcoal") z kontrolą partii. Jeśli potrzebujesz identycznego koloru na wielu szpulach dla dużego projektu, zamawiaj z tej samej partii lub skontaktuj się z pomocą techniczną w celu dopasowania partii.
:::

---

## Cena i dostępność

| Seria | Przedział cenowy | Dostępność |
|-------|-----------------|-----------|
| PLA Basic | Budżetowy | Dobra — szeroki wybór |
| PLA Matte/Silk/Sparkle | Umiarkowany | Dobra |
| PLA Tough | Umiarkowany | Dobra |
| PETG Basic/HF | Umiarkowany | Dobra |
| PETG-CF | Wysoki | Umiarkowana |
| ABS/ASA | Umiarkowany | Dobra |
| TPU 95A | Umiarkowany | Ograniczony wybór |
| PA6-CF/GF | Wysoki | Umiarkowana |
| PC | Wysoki | Ograniczona |
| PVA/HIPS | Wysoki | Dobra |

Filamenty Bambu Lab są dostępne w sklepie internetowym Bambu Lab i u wybranych dystrybutorów. Ceny są ogólnie konkurencyjne w porównaniu z innymi markami premium, szczególnie PLA Basic, który jest pozycjonowany na rynku budżetowym.
