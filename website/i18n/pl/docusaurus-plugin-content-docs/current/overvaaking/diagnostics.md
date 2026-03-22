---
sidebar_position: 3
title: Diagnostyka
description: Wynik zdrowia, wykresy telemetrii, wizualizacja siatki stołu i monitorowanie komponentów dla drukarek Bambu Lab
---

# Diagnostyka

Strona diagnostyki zapewnia dogłębny przegląd zdrowia, wydajności i kondycji drukarki w czasie.

Przejdź do: **https://localhost:3443/#diagnostics**

## Wynik zdrowia

Każda drukarka oblicza **wynik zdrowia** od 0 do 100 na podstawie:

| Czynnik | Waga | Opis |
|---|---|---|
| Wskaźnik sukcesu (30d) | 30% | Odsetek udanych wydruków w ciągu ostatnich 30 dni |
| Zużycie komponentów | 25% | Średnie zużycie krytycznych części |
| Błędy HMS (30d) | 20% | Liczba i powaga błędów |
| Status kalibracji | 15% | Czas od ostatniej kalibracji |
| Stabilność temperatury | 10% | Odchylenie od temperatury docelowej podczas drukowania |

**Interpretacja wyniku:**
- 🟢 80–100 — Doskonały stan
- 🟡 60–79 — Dobry, ale coś warto sprawdzić
- 🟠 40–59 — Zmniejszona wydajność, zalecana konserwacja
- 🔴 0–39 — Krytyczny, wymagana konserwacja

:::tip Historia
Kliknij wykres zdrowia, aby zobaczyć rozwój wyniku w czasie. Duże spadki mogą wskazywać na konkretne zdarzenie.
:::

## Wykresy telemetrii

Strona telemetrii wyświetla interaktywne wykresy dla wszystkich wartości czujników:

### Dostępne zestawy danych

- **Temperatura dyszy** — rzeczywista vs. docelowa
- **Temperatura stołu** — rzeczywista vs. docelowa
- **Temperatura komory** — temperatura otoczenia wewnątrz maszyny
- **Silnik wytłaczacza** — zużycie prądu i temperatura
- **Prędkości wentylatorów** — głowica robocza, komora, AMS
- **Ciśnienie** (X1C) — ciśnienie komory dla AMS
- **Przyspieszenie** — dane wibracji (ADXL345)

### Nawigacja po wykresach

1. Wybierz **Okres**: Ostatnia godzina / 24 godziny / 7 dni / 30 dni / Niestandardowy
2. Wybierz **Drukarkę** z listy rozwijanej
3. Wybierz **Zestawy danych** do wyświetlenia (obsługiwany wielokrotny wybór)
4. Przewijaj, aby powiększyć oś czasu
5. Kliknij i przeciągnij, aby przesuwać
6. Kliknij dwukrotnie, aby zresetować zoom

### Eksport danych telemetrii

1. Kliknij **Eksportuj** na wykresie
2. Wybierz format: **CSV**, **JSON** lub **PNG** (obraz)
3. Wybrany okres i zestawy danych są eksportowane

## Siatka stołu (Bed Mesh)

Wizualizacja siatki stołu pokazuje kalibrację płaskości płyty roboczej:

1. Przejdź do **Diagnostyka → Siatka stołu**
2. Wybierz drukarkę
3. Ostatnia siatka jest wyświetlana jako trójwymiarowa powierzchnia i mapa cieplna:
   - **Niebieski** — niżej niż centrum (wklęsły)
   - **Zielony** — w przybliżeniu płaski
   - **Czerwony** — wyżej niż centrum (wypukły)
4. Najedź na punkt, aby zobaczyć dokładne odchylenie w mm

### Skanuj siatkę stołu z poziomu interfejsu

1. Kliknij **Skanuj teraz** (wymaga, aby drukarka była bezczynna)
2. Potwierdź w oknie dialogowym — drukarka automatycznie rozpoczyna kalibrację
3. Poczekaj, aż skanowanie się zakończy (ok. 3–5 minut)
4. Nowa siatka pojawi się automatycznie

:::warning Najpierw podgrzej
Siatka stołu powinna być skanowana przy podgrzanym stole (50–60°C dla PLA) dla dokładnej kalibracji.
:::

## Zużycie komponentów

Zobacz [Przewidywanie zużycia](./wearprediction), aby uzyskać szczegółową dokumentację.

Strona diagnostyki wyświetla skrócony przegląd:
- Wynik procentowy na komponent
- Następna zalecana konserwacja
- Kliknij **Szczegóły**, aby uzyskać pełną analizę zużycia
