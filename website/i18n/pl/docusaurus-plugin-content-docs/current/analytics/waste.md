---
sidebar_position: 5
title: Śledzenie odpadów
description: Śledź odpady filamentu z AMS-purge i materiałów podporowych, obliczaj koszty i optymalizuj efektywność
---

# Śledzenie odpadów

Śledzenie odpadów daje pełny wgląd w ilość filamentu marnowanego podczas drukowania — AMS-purge, czyszczenie przy zmianie materiałów i materiały podporowe — oraz ile cię to kosztuje.

Przejdź do: **https://localhost:3443/#waste**

## Kategorie odpadów

3DPrintForge rozróżnia trzy rodzaje odpadów:

| Kategoria | Źródło | Typowy udział |
|---|---|---|
| **AMS-purge** | Zmiana koloru w AMS podczas drukowania wielokolorowego | 5–30 g na zmianę |
| **Czyszczenie przy zmianie materiału** | Czyszczenie przy przełączaniu między różnymi materiałami | 10–50 g na zmianę |
| **Materiał podporowy** | Struktury podporowe usuwane po wydruku | Różna |

## Śledzenie AMS-purge

Dane AMS-purge są pobierane bezpośrednio z telemetrii MQTT i analizy G-kodu:

- **Gramy na zmianę koloru** — obliczone z bloku purge G-kodu
- **Liczba zmian kolorów** — zliczone z dziennika wydruków
- **Łączne zużycie purge** — suma w wybranym okresie

:::tip Zmniejsz purge
Bambu Studio ma ustawienia dla objętości purge na kombinację kolorów. Zmniejsz objętość purge dla par kolorów o niskim kontraście (np. biały → jasnoszary), aby oszczędzić filament.
:::

## Obliczanie efektywności

Efektywność jest obliczana jako:

```
Efektywność % = (materiał modelu / łączne zużycie) × 100

Łączne zużycie = materiał modelu + purge + materiał podporowy
```

**Przykład:**
- Model: 45 g
- Purge: 12 g
- Podpory: 8 g
- Łącznie: 65 g
- **Efektywność: 69%**

Efektywność jest wyświetlana jako wykres trendu w czasie, aby sprawdzić, czy się poprawiasz.

## Koszt odpadów

Na podstawie zarejestrowanych cen filamentów obliczane są:

| Pozycja | Obliczenie |
|---|---|
| Koszt purge | Gramy purge × cena/gram na kolor |
| Koszt podpor | Gramy podpor × cena/gram |
| **Łączny koszt odpadów** | Suma powyższych |
| **Koszt na udany wydruk** | Koszt odpadów / liczba wydruków |

## Odpady na drukarkę i materiał

Filtruj widok według:

- **Drukarki** — sprawdź, która drukarka generuje najwięcej odpadów
- **Materiału** — sprawdź odpady na typ filamentu
- **Okresu** — dzień, tydzień, miesiąc, rok

Widok tabeli pokazuje posortowaną listę z największymi odpadami na górze, w tym szacowany koszt.

## Wskazówki optymalizacji

System automatycznie generuje sugestie zmniejszenia odpadów:

- **Odwrócona kolejność kolorów** — jeśli kolor A→B purge'uje więcej niż B→A, system sugeruje zamianę kolejności
- **Łączenie warstw zmiany kolorów** — grupuje warstwy o tym samym kolorze, aby zminimalizować zmiany
- **Optymalizacja struktury podporowej** — szacuje redukcję podpor przez zmianę orientacji

:::info Dokładność
Obliczenia purge są szacowane z G-kodu. Faktyczne odpady mogą się różnić o 10–20% z powodu zachowania drukarki.
:::

## Eksport i raportowanie

1. Kliknij **Eksportuj dane odpadów**
2. Wybierz okres i format (CSV / PDF)
3. Dane odpadów można uwzględnić w raportach projektów i fakturach jako pozycję kosztową

Zobacz również [Analizę filamentu](./filamentanalytics) dla zbiorczego przeglądu zużycia.
