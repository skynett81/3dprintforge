---
sidebar_position: 3
title: Codzienne użytkowanie
description: Praktyczny przewodnik po codziennym użytkowaniu Bambu Dashboard — ranna rutyna, monitorowanie, po wydruku i konserwacja
---

# Codzienne użytkowanie

Ten przewodnik opisuje, jak efektywnie używać Bambu Dashboard na co dzień — od początku dnia do końca.

## Ranna rutyna

Otwórz panel i szybko przejrzyj następujące punkty:

### 1. Sprawdź status drukarek
Panel przeglądowy pokazuje status wszystkich Twoich drukarek. Szukaj:
- **Czerwonych ikon** — błędy wymagające uwagi
- **Oczekujących wiadomości** — ostrzeżenia HMS z nocy
- **Nieukończonych wydruków** — jeśli miałeś nocny wydruk, czy jest gotowy?

### 2. Sprawdź poziomy AMS
Przejdź do **Filament** lub sprawdź widget AMS na panelu:
- Czy jakieś szpule mają mniej niż 100 g? Wymień lub zamów nowe
- Czy właściwy filament jest we właściwym slocie na dzisiejsze wydruki?

### 3. Sprawdź powiadomienia i zdarzenia
W **Dzienniku powiadomień** (ikona dzwonka) widzisz:
- Zdarzenia, które wystąpiły w nocy
- Automatycznie zalogowane błędy
- Kody HMS, które wyzwoliły alarm

## Uruchamianie wydruku

### Z pliku (Bambu Studio)
1. Otwórz Bambu Studio
2. Wczytaj i pokrój model
3. Wyślij do drukarki — panel aktualizuje się automatycznie

### Z kolejki
Jeśli zaplanowałeś wydruki z wyprzedzeniem:
1. Przejdź do **Kolejka**
2. Kliknij **Uruchom następny** lub przeciągnij zadanie na górę
3. Potwierdź **Wyślij do drukarki**

Patrz [Dokumentacja kolejki wydruków](../funksjoner/queue), aby uzyskać pełne informacje o zarządzaniu kolejką.

### Zaplanowany wydruk (harmonogram)
Aby uruchomić wydruk o określonej godzinie:
1. Przejdź do **Harmonogram**
2. Kliknij **+ Nowe zadanie**
3. Wybierz plik, drukarkę i godzinę
4. Włącz **Optymalizację ceny prądu**, aby automatycznie wybrać najtańszą godzinę

Patrz [Harmonogram](../funksjoner/scheduler) po szczegóły.

## Monitorowanie aktywnego wydruku

### Widok kamery
Kliknij ikonę kamery na karcie drukarki. Możesz:
- Oglądać podgląd na żywo w panelu
- Otworzyć w osobnej karcie do monitorowania w tle
- Zrobić ręczny zrzut ekranu

### Informacje o postępie
Karta aktywnego wydruku pokazuje:
- Procent ukończenia
- Szacowany pozostały czas
- Bieżąca warstwa / łączna liczba warstw
- Aktywny filament i kolor

### Temperatury
Krzywe temperatur w czasie rzeczywistym są wyświetlane w panelu szczegółów:
- Temperatura dyszy — powinna utrzymywać się na stałym poziomie w zakresie ±2°C
- Temperatura płyty — ważna dla dobrej przyczepności
- Temperatura komory — stopniowo rośnie, szczególnie istotna dla ABS/ASA

### Print Guard
Gdy **Print Guard** jest włączony, panel automatycznie monitoruje błędy spaghetti i odchylenia wolumetryczne. Jeśli coś zostanie wykryte:
1. Wydruk zostaje wstrzymany
2. Otrzymujesz powiadomienie
3. Zdjęcia z kamery są zapisywane do późniejszej kontroli

## Po wydruku — lista kontrolna

### Sprawdź jakość
1. Otwórz kamerę i przyjrzyj się wynikowi, gdy jeszcze jest na płycie
2. Przejdź do **Historia → Ostatni wydruk**, aby zobaczyć statystyki
3. Zaloguj notatkę: co poszło dobrze, co można poprawić

### Archiwizacja
Wydruki w historii nigdy nie są automatycznie archiwizowane — pozostają. Jeśli chcesz posprzątać:
- Kliknij wydruk → **Archiwizuj**, aby przenieść do archiwum
- Użyj **Projektów** do grupowania powiązanych wydruków

### Aktualizacja wagi filamentu
Jeśli ważysz szpulę dla dokładności (zalecane):
1. Zważ szpulę
2. Przejdź do **Filament → [Szpula]**
3. Zaktualizuj **Pozostała waga**

## Przypomnienia o konserwacji

Panel automatycznie śledzi interwały konserwacji. W **Konserwacja** widzisz:

| Zadanie | Interwał | Status |
|---------|----------|--------|
| Czyszczenie dyszy | Co 50 godzin | Automatycznie sprawdzane |
| Smarowanie prętów | Co 200 godzin | Śledzone w panelu |
| Kalibracja płyty | Po wymianie płyty | Ręczne przypomnienie |
| Czyszczenie AMS | Co miesiąc | Powiadomienie kalendarza |

Włącz powiadomienia o konserwacji w **Monitorowanie → Konserwacja → Powiadomienia**.

:::tip Ustaw cotygodniowy dzień konserwacji
Stały dzień konserwacji w tygodniu (np. niedziela wieczorem) oszczędza Ci niepotrzebnych przestojów. Użyj funkcji przypomnień w panelu.
:::

## Cena prądu — najlepszy czas na drukowanie

Jeśli podłączyłeś integrację cen prądu (Nordpool / Home Assistant):

1. Przejdź do **Analiza → Cena prądu**
2. Zobacz wykres cen na kolejne 24 godziny
3. Najtańsze godziny są oznaczone na zielono

Użyj **Harmonogramu** z włączoną **Optymalizacją ceny prądu** — panel automatycznie uruchomi zadanie w najtańszym dostępnym oknie czasowym.

:::info Typowo najtańsze godziny
Noc (01:00–06:00) jest zazwyczaj najtańsza. 8-godzinny wydruk dodany do kolejki poprzedniego wieczoru może zaoszczędzić Ci 30–50% kosztów energii.
:::
