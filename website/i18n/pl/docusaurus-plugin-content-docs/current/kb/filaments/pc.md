---
sidebar_position: 7
title: PC
description: Przewodnik po druku z poliwęglanu z Bambu Lab — wysoka wytrzymałość, odporność na ciepło i wymagania
---

# PC (Poliwęglan)

Poliwęglan jest jednym z najwytrzymalszych materiałów termoplastycznych dostępnych do druku FDM. Łączy ekstremalnie wysoką udarność, odporność na ciepło do 110–130 °C i naturalną przezroczystość. PC jest wymagającym materiałem do druku, ale dostarcza wyniki zbliżone do jakości wtrysku.

## Ustawienia

| Parametr | Czysty PC | Blend PC-ABS | PC-CF |
|----------|----------|-------------|-------|
| Temperatura dyszy | 260–280 °C | 250–270 °C | 270–290 °C |
| Temperatura stołu | 100–120 °C | 90–110 °C | 100–120 °C |
| Temperatura komory | 50–60 °C (wymagana) | 45–55 °C | 50–60 °C |
| Chłodzenie elementu | 0–20% | 20–30% | 0–20% |
| Prędkość | 60–80% | 70–90% | 50–70% |
| Suszenie wymagane | Tak (krytyczne) | Tak | Tak (krytyczne) |

## Zalecane płyty budujące

| Płyta | Przydatność | Klej w sztyfcie? |
|-------|------------|-----------------|
| High Temp Plate | Doskonała (wymagana) | Nie |
| Engineering Plate | Akceptowalna | Tak |
| Textured PEI | Niezalecana | — |
| Cool Plate (Smooth PEI) | Nie używać | — |

:::danger High Temp Plate jest wymagana
PC wymaga temperatur stołu 100–120 °C. Cool Plate i Textured PEI nie wytrzymują tych temperatur i ulegną uszkodzeniu. **Zawsze** używaj High Temp Plate do czystego PC.
:::

## Wymagania drukarki i sprzętu

### Obudowa (wymagana)

PC wymaga **w pełni zamkniętej komory** ze stabilną temperaturą 50–60 °C. Bez tego doświadczysz poważnego warpingu, rozwarstwienia i delaminacji.

### Hartowana dysza (zdecydowanie zalecana)

Czysty PC nie jest ścierny, ale PC-CF i PC-GF **wymagają hartowanej dyszy stalowej** (np. Bambu Lab HS01). Dla czystego PC hartowana dysza jest również zalecana ze względu na wysokie temperatury.

### Kompatybilność drukarek

| Drukarka | Odpowiednia dla PC? | Uwaga |
|----------|---------------------|-------|
| X1C | Doskonała | W pełni zamknięta, HS01 dostępna |
| X1E | Doskonała | Zaprojektowana dla materiałów inżynieryjnych |
| P1S | Ograniczona | Zamknięta, ale bez aktywnego ogrzewania komory |
| P1P | Niezalecana | Bez obudowy |
| A1 / A1 Mini | Nie używać | Otwarta rama, zbyt niskie temperatury |

:::warning Tylko X1C i X1E zalecane
PC wymaga aktywnego ogrzewania komory dla spójnych wyników. P1S może dać akceptowalne wyniki z małymi elementami, ale spodziewaj się warpingu i rozwarstwienia przy większych.
:::

## Suszenie

PC jest **wysoce higroskopijny** i szybko pochłania wilgoć. Wilgotny PC daje katastrofalne wyniki druku.

| Parametr | Wartość |
|----------|---------|
| Temperatura suszenia | 70–80 °C |
| Czas suszenia | 6–8 godzin |
| Poziom higroskopijności | Wysoki |
| Maks. zalecana wilgotność | < 0,02% |

- **Zawsze** susz PC przed drukiem — nawet świeżo otwarte szpule mogły pochłonąć wilgoć
- Drukuj bezpośrednio z suszarki jeśli to możliwe
- AMS **nie jest wystarczający** do przechowywania PC — wilgotność jest zbyt wysoka
- Używaj dedykowanej suszarki do filamentu z aktywnym ogrzewaniem

:::danger Wilgoć niszczy wydruki z PC
Oznaki wilgotnego PC: głośne trzaski, bąbelki na powierzchni, bardzo słabe wiązanie warstw, stringing. Wilgotnego PC nie można skompensować ustawieniami — **musi** być najpierw wysuszony.
:::

## Właściwości

| Właściwość | Wartość |
|------------|---------|
| Wytrzymałość na rozciąganie | 55–75 MPa |
| Udarność | Ekstremalnie wysoka |
| Odporność na ciepło (HDT) | 110–130 °C |
| Przezroczystość | Tak (wariant naturalny/przezroczysty) |
| Odporność chemiczna | Umiarkowana |
| Odporność na UV | Umiarkowana (żółknie z czasem) |
| Skurcz | ~0,5–0,7% |

## Blendy PC

### PC-ABS

Mieszanka poliwęglanu i ABS łącząca mocne strony obu materiałów:

- **Łatwiejszy w druku** niż czysty PC — niższe temperatury i mniej warpingu
- **Udarność** pomiędzy ABS a PC
- **Popularny w przemyśle** — stosowany we wnętrzach samochodowych i obudowach elektronicznych
- Drukuje przy 250–270 °C dysza, 90–110 °C stół

### PC-CF (włókno węglowe)

PC wzmocniony włóknem węglowym dla maksymalnej sztywności i wytrzymałości:

- **Ekstremalnie sztywny** — idealny dla części strukturalnych
- **Lekki** — włókno węglowe zmniejsza wagę
- **Wymaga hartowanej dyszy** — mosiądz zużywa się w godzinach
- Drukuje przy 270–290 °C dysza, 100–120 °C stół
- Droższy od czystego PC, ale daje właściwości mechaniczne zbliżone do aluminium

### PC-GF (włókno szklane)

PC wzmocniony włóknem szklanym:

- **Tańszy niż PC-CF** z dobrą sztywnością
- **Bielsza powierzchnia** niż PC-CF
- **Wymaga hartowanej dyszy** — włókna szklane są bardzo ścierne
- Nieco mniej sztywny niż PC-CF, ale lepsza udarność

## Zastosowania

PC jest stosowany tam, gdzie potrzebujesz **maksymalnej wytrzymałości i/lub odporności na ciepło**:

- **Części mechaniczne** — koła zębate, uchwyty, sprzęgła pod obciążeniem
- **Części optyczne** — soczewki, przewody świetlne, przezroczyste osłony (przezroczysty PC)
- **Części odporne na ciepło** — komora silnika, w pobliżu elementów grzewczych
- **Obudowy elektroniczne** — ochronne kapsułki z dobrą udarnością
- **Narzędzia i przyrządy** — precyzyjne narzędzia montażowe

## Wskazówki do udanego druku PC

### Pierwsza warstwa

- Zmniejsz prędkość do **30–40%** dla pierwszej warstwy
- Zwiększ temperaturę stołu o 5 °C powyżej standardu dla pierwszych 3–5 warstw
- **Brim jest obowiązkowy** dla większości elementów PC — użyj 8–10 mm

### Temperatura komory

- Komora musi osiągnąć **50 °C+** przed rozpoczęciem druku
- **Nie otwieraj drzwi komory** podczas druku — spadek temperatury powoduje natychmiastowy warping
- Po druku: pozwól elementowi **powoli** ostygnąć w komorze (1–2 godziny)

### Chłodzenie

- Używaj **minimalnego chłodzenia** (0–20%) dla najlepszego wiązania warstw
- Dla mostków i nawisów: tymczasowo zwiększ do 30–40%
- Priorytetowo traktuj wytrzymałość warstw nad estetyką przy PC

### Uwagi projektowe

- **Unikaj ostrych narożników** — zaokrąglaj z minimum 1 mm promienia
- **Jednolita grubość ścianek** — nierówna grubość tworzy naprężenia wewnętrzne
- **Duże, płaskie powierzchnie** są trudne — podziel lub dodaj żebra

:::tip Nowy z PC? Zacznij od PC-ABS
Jeśli jeszcze nie drukowałeś PC, zacznij od blendu PC-ABS. Jest znacznie bardziej wyrozumiały niż czysty PC i daje ci doświadczenie z materiałem bez ekstremalnych wymagań. Gdy opanujesz PC-ABS, przejdź do czystego PC.
:::

---

## Obróbka końcowa

- **Szlifowanie** — PC szlifuje się dobrze, ale używaj szlifowania na mokro dla przezroczystego PC
- **Polerowanie** — przezroczysty PC można wypolerować do niemal optycznej jakości
- **Klejenie** — klejenie dichlorometanem daje niewidoczne spoiny (używaj środków ochronnych!)
- **Malowanie** — wymaga podkładu dla dobrej przyczepności
- **Wyżarzanie** — 120 °C przez 1–2 godziny zmniejsza naprężenia wewnętrzne

:::warning Klejenie dichlorometanem
Dichlorometan jest toksyczny i wymaga wyciągu, rękawic odpornych na chemikalia i okularów ochronnych. Zawsze pracuj w dobrze wentylowanym pomieszczeniu lub pod dygestorium.
:::
