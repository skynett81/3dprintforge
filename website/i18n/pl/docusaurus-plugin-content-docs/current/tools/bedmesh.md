---
sidebar_position: 6
title: Bed Mesh
description: Wizualizacja 3D kalibracji płaskości płyty roboczej z heatmapą, skanowaniem z interfejsu i wskazówkami kalibracji
---

# Bed Mesh

Narzędzie bed mesh zapewnia wizualną reprezentację płaskości płyty roboczej — kluczową dla dobrej przyczepności i równomiernej pierwszej warstwy.

Przejdź do: **https://localhost:3443/#bedmesh**

## Czym jest bed mesh?

Drukarki Bambu Lab skanują powierzchnię płyty roboczej sondą i tworzą mapę (mesh) odchyleń wysokości. Oprogramowanie drukarki automatycznie kompensuje odchylenia podczas drukowania. 3DPrintForge wizualizuje tę mapę.

## Wizualizacja

### Powierzchnia 3D

Mapa bed mesh jest wyświetlana jako interaktywna powierzchnia 3D:

- Użyj myszy do obracania widoku
- Przewijaj, aby powiększać/pomniejszać
- Kliknij **Widok z góry** dla widoku z lotu ptaka
- Kliknij **Widok z boku**, aby zobaczyć profil

Skala kolorów pokazuje odchylenia od średniej wysokości:
- **Niebieski** — niżej niż środek (wklęsły)
- **Zielony** — w przybliżeniu płaski (odchylenie < 0,1 mm)
- **Żółty** — umiarkowane odchylenie (0,1–0,2 mm)
- **Czerwony** — duże odchylenie (> 0,2 mm)

### Heatmapa

Kliknij **Heatmapa** dla płaskiego widoku 2D mapy mesh — łatwiejszego do odczytania dla większości użytkowników.

Heatmapa pokazuje:
- Dokładne wartości odchyleń (mm) dla każdego punktu pomiarowego
- Oznaczone punkty problemowe (odchylenie > 0,3 mm)
- Wymiary pomiarów (liczba wierszy × kolumn)

## Skanowanie bed mesh z interfejsu

:::warning Wymagania
Skanowanie wymaga, aby drukarka była bezczynna, a temperatura stołu ustabilizowana. Podgrzej stół do żądanej temperatury PRZED skanowaniem.
:::

1. Przejdź do **Bed Mesh**
2. Wybierz drukarkę z listy rozwijanej
3. Kliknij **Skanuj teraz**
4. Wybierz temperaturę stołu do skanowania:
   - **Zimny** (temperatura pokojowa) — szybki, ale mniej dokładny
   - **Ciepły** (50–60°C PLA, 70–90°C PETG) — zalecany
5. Potwierdź w oknie dialogowym — drukarka automatycznie rozpoczyna sekwencję sondy
6. Poczekaj, aż skanowanie się zakończy (3–8 minut zależnie od rozmiaru mesh)
7. Nowa mapa mesh pojawi się automatycznie

## Wskazówki kalibracji

Po skanowaniu system podaje konkretne zalecenia:

| Wynik | Zalecenie |
|---|---|
| Odchylenie < 0,1 mm wszędzie | Doskonały — nie wymagane żadne działanie |
| Odchylenie 0,1–0,2 mm | Dobre — kompensacja obsługiwana przez oprogramowanie |
| Odchylenie > 0,2 mm w narożnikach | Ręcznie wyreguluj sprężyny stołu (jeśli możliwe) |
| Odchylenie > 0,3 mm | Stół może być uszkodzony lub błędnie zamontowany |
| Środek wyższy niż narożniki | Rozszerzanie termiczne — normalne dla ciepłych stołów |

:::tip Porównanie historyczne
Kliknij **Porównaj z poprzednim**, aby sprawdzić, czy mapa mesh zmieniła się w czasie — przydatne do wykrywania stopniowego wyginania się płyty.
:::

## Historia mesh

Wszystkie skany mesh są zapisywane z znacznikiem czasu:

1. Kliknij **Historia** w panelu bocznym bed mesh
2. Wybierz dwa skany, aby je porównać (wyświetlana jest mapa różnic)
3. Usuń stare skany, których już nie potrzebujesz

## Eksport

Eksportuj dane mesh jako:
- **PNG** — obraz heatmapy (do dokumentacji)
- **CSV** — dane surowe z X, Y i odchyleniem wysokości na punkt
