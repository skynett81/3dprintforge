---
sidebar_position: 3
title: Stringing
description: Przyczyny stringing i rozwiązania — retrakcja, temperatura i suszenie
---

# Stringing

Stringing (lub "oozing") to cienkie plastikowe nitki tworzące się między oddzielnymi częściami obiektu podczas ruchu dyszy bez wytłaczania. Daje to wygląd "pajęczyny" na wydruku.

## Przyczyny stringing

1. **Zbyt wysoka temperatura dyszy** — ciepły plastik jest płynny i kapie
2. **Złe ustawienia retrakcji** — filament nie jest wyciągany wystarczająco szybko
3. **Wilgotny filament** — wilgoć powoduje parę i nadmierny przepływ
4. **Zbyt niska prędkość** — dysza długo jest w pozycjach przejazdu

## Diagnoza

**Wilgotny filament?** Czy słyszysz trzaskające/pykające dźwięki podczas drukowania? Wtedy filament jest wilgotny — najpierw go wysusz przed dostosowaniem innych ustawień.

**Zbyt wysoka temperatura?** Czy widzisz kapanie z dyszy w momentach "pauzy"? Zmniejsz temperaturę o 5–10 °C.

## Rozwiązania

### 1. Wysusz filament

Wilgotny filament to najczęstsza przyczyna stringing, której nie da się dostosować ustawieniami:

| Materiał | Temperatura suszenia | Czas |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 godzin |
| PETG | 60–65 °C | 6–8 godzin |
| TPU | 55–60 °C | 6–8 godzin |
| PA | 75–85 °C | 8–12 godzin |

### 2. Zmniejsz temperaturę dyszy

Zacznij od zmniejszania o 5 °C na raz:
- PLA: spróbuj 210–215 °C (w dół z 220 °C)
- PETG: spróbuj 235–240 °C (w dół z 245 °C)

:::warning Zbyt niska temperatura daje złe łączenie warstw
Zmniejszaj temperaturę ostrożnie. Zbyt niska temperatura daje złe łączenie warstw, słaby wydruk i problemy z wytłaczaniem.
:::

### 3. Dostosuj ustawienia retrakcji

Retrakcja wyciąga filament z dyszy podczas ruchu "travel", aby zapobiec kapaniu:

```
Bambu Studio → Filament → Retrakcja:
- Odległość retrakcji: 0,4–1,0 mm (direct drive)
- Prędkość retrakcji: 30–45 mm/s
```

:::tip Drukarki Bambu Lab mają direct drive
Wszystkie drukarki Bambu Lab (X1C, P1S, A1) używają ekstrudera direct drive. Direct drive wymaga **krótszej** odległości retrakcji niż systemy Bowden (typowo 0,5–1,5 mm vs. 3–7 mm).
:::

### 4. Zwiększ prędkość przejazdu

Szybki ruch między punktami daje dyszy mniej czasu na kapanie:
- Zwiększ "travel speed" do 200–300 mm/s
- Drukarki Bambu Lab dobrze sobie z tym radzą

### 5. Aktywuj "Avoid Crossing Perimeters"

Ustawienie slicera sprawiające, że dysza unika przekraczania otwartych obszarów gdzie stringing będzie widoczny:
```
Bambu Studio → Jakość → Avoid crossing perimeters
```

### 6. Zmniejsz prędkość (dla TPU)

Dla TPU rozwiązanie jest odwrotnością innych materiałów:
- Zmniejsz prędkość drukowania do 20–35 mm/s
- TPU jest elastyczny i ściskany przy zbyt wysokiej prędkości — to daje "nadmierny przepływ"

## Po dostosowaniach

Testuj na standardowym modelu testowym stringing (np. "torture tower" z MakerWorld). Dostosowuj jedną zmienną na raz i obserwuj zmianę.

:::note Perfekcja rzadko jest możliwa
Pewien stringing jest normalny dla większości materiałów. Skup się na redukcji do akceptowalnego poziomu, nie na całkowitym wyeliminowaniu. PETG zawsze będzie miał nieco więcej stringing niż PLA.
:::
