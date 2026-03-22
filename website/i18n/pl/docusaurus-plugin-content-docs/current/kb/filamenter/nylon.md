---
sidebar_position: 5
title: PA / Nylon
description: Przewodnik do drukowania nylonu — suszenie, klej, ustawienia i warianty
---

# PA / Nylon

Nylon (Polyamide / PA) to jeden z najmocniejszych i najbardziej odpornych na zużycie materiałów do druku 3D. Idealny dla części mechanicznych, kół zębatych, łożysk i innych części o dużym obciążeniu.

## Ustawienia

| Parametr | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Temperatura dyszy | 260–280 °C | 250–270 °C | 270–290 °C |
| Temperatura stołu | 70–90 °C | 60–80 °C | 80–100 °C |
| Chłodzenie części | 0–30% | 0–30% | 0–20% |
| Suszenie (wymagane) | 80 °C / 8–12 godz. | 80 °C / 8 godz. | 80 °C / 12 godz. |

## Suszenie — krytyczne dla nylonu

Nylon jest **ekstremalnie higroskopijny**. Wchłania wilgoć z powietrza w ciągu godzin.

:::danger Zawsze suszyć nylon
Wilgotny nylon daje złe wyniki — słaby wydruk, bąbelki, bąbelkująca powierzchnia i złe łączenie warstw. Suszyć nylon **natychmiast** przed drukowaniem i używać go w ciągu kilku godzin.

- **Temperatura:** 75–85 °C
- **Czas:** 8–12 godzin
- **Metoda:** Suszarka do filamentów lub piekarnik z wentylatorem
:::

Bambu AMS nie jest zalecany dla nylonu bez uszczelnionej i suchej konfiguracji. Jeśli możliwe, używaj zewnętrznego podajnika filamentu bezpośrednio do drukarki.

## Płyty robocze

| Płyta | Przydatność | Klej? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Doskonała | Tak (wymagany) |
| High Temp Plate | Dobra | Tak (wymagany) |
| Cool Plate | Słaba | — |

:::warning Klej jest wymagany
Nylon słabo przylega bez kleju. Używaj cienkiej, równomiernej warstwy kleju (Bambu Lab lub Pritt stick). Bez kleju nylon odrywa się od płyty.
:::

## Warping

Nylon znacznie warpuje:
- Używaj brim (8–15 mm)
- Zamknij komorę (X1C/P1S dają najlepsze wyniki)
- Unikaj dużych płaskich części bez brim
- Utrzymuj minimalną wentylację

## Warianty

### PA6 (Nylon 6)
Najczęstszy, dobra wytrzymałość i elastyczność. Wchłania dużo wilgoci.

### PA12 (Nylon 12)
Bardziej stabilny wymiarowo i wchłania nieco mniej wilgoci niż PA6. Łatwiejszy w druku.

### PA-CF (włókno węglowe)
Bardzo sztywny i lekki. Wymaga dyszy z hartowanej stali. Drukuje suchszy niż standardowy nylon.

### PA-GF (włókno szklane)
Dobra sztywność w niższych kosztach niż CF. Wymaga dyszy z hartowanej stali.

## Przechowywanie

Przechowuj nylon w zapieczętowanym pojemniku z agresywnym żelem krzemionkowym. Pudełko suszące Bambu Lab jest idealne. Nigdy nie zostawiaj nylonu otwartego przez noc.
