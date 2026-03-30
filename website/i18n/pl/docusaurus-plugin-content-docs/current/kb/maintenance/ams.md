---
sidebar_position: 3
title: Konserwacja AMS
description: Konserwacja AMS — rury PTFE, droga filamentu i zapobieganie wilgoci
---

# Konserwacja AMS

AMS (Automatic Material System) to precyzyjny system wymagający regularnej konserwacji dla niezawodnego działania. Najczęstsze problemy to zabrudzona droga filamentu i wilgoć w obudowie.

## Rury PTFE

Rury PTFE transportują filament z AMS do drukarki. Należą do pierwszych zużywających się części.

### Inspekcja
Sprawdź rury PTFE pod kątem:
- **Zagięć lub skrzywień** — utrudniają przepływ filamentu
- **Zużycia przy złączach** — biały pył wokół wejść
- **Deformacji kształtu** — szczególnie przy użyciu materiałów CF

### Wymiana rur PTFE
1. Zwolnij filament z AMS (uruchom cykl rozładowania)
2. Wciśnij niebieski pierścień blokujący wokół rury przy złączu
3. Wyciągnij rurę (wymaga mocnego chwytu)
4. Przytnij nową rurę do odpowiedniej długości (nie krótsza niż oryginał)
5. Wsuń do oporu i zablokuj

:::tip AMS Lite vs. AMS
AMS Lite (A1/A1 Mini) ma prostszą konfigurację PTFE niż pełny AMS (P1S/X1C). Rury są krótsze i łatwiejsze do wymiany.
:::

## Droga filamentu

### Czyszczenie kanału filamentu
Filamenty zostawiają pył i resztki w kanale filamentu, szczególnie materiały CF:

1. Uruchom rozładowanie wszystkich slotów
2. Użyj sprężonego powietrza lub miękkiego pędzla do wydmuchania luźnego pyłu
3. Przepuść przez kanał czysty kawałek nylonu lub filament czyszczący PTFE

### Czujniki
AMS używa czujników do wykrywania pozycji filamentu i jego zerwania. Utrzymuj okienka czujników czyste:
- Delikatnie wytrzyj soczewki czujników czystym pędzlem
- Unikaj IPA bezpośrednio na czujnikach

## Wilgoć

AMS nie chroni filamentu przed wilgocią. Dla materiałów higroskopijnych (PA, PETG, TPU) zaleca się:

### Suche alternatywy AMS
- **Zapieczętowane pudełko:** Umieść szpule w szczelnym pudełku z żelem krzemionkowym
- **Bambu Dry Box:** Oficjalny akcesoria suszarki
- **Zewnętrzny podajnik:** Używaj podajnika filamentu poza AMS dla wrażliwych materiałów

### Wskaźniki wilgoci
Umieść karty wskaźnika wilgoci (higrometr) w obudowie AMS. Wymieniaj woreczki żelu krzemionkowego gdy wilgotność względna przekracza 30%.

## Koła zębate i mechanizm zaciskowy

### Inspekcja
Sprawdź koła zębate (koła ekstrudera w AMS) pod kątem:
- Resztek filamentu między zębami
- Zużycia uzębienia
- Nierównego tarcia przy ręcznym przeciąganiu

### Czyszczenie
1. Użyj szczoteczki do zębów lub pędzla do usunięcia resztek między zębami koła
2. Wydmuch sprężonym powietrzem
3. Unikaj olejów i smarów — poziom tarcia jest skalibrowany dla suchej pracy

## Interwały konserwacji

| Czynność | Interwał |
|-----------|---------|
| Inspekcja wzrokowa rur PTFE | Miesięcznie |
| Czyszczenie kanału filamentu | Co 100 godzin |
| Kontrola czujników | Miesięcznie |
| Wymiana żelu krzemionkowego (konfiguracja z suszeniem) | Wg potrzeb (przy 30%+ wilgotności) |
| Wymiana rur PTFE | Przy widocznym zużyciu |
