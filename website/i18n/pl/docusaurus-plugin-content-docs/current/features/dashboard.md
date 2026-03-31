---
sidebar_position: 2
title: Panel główny
description: Przegląd w czasie rzeczywistym aktywnej drukarki z podglądem modelu 3D, statusem AMS, kamerą i konfigurowalnymi widżetami
---

# Panel główny

Panel główny jest centralnym centrum sterowania w 3DPrintForge. Wyświetla status w czasie rzeczywistym dla wybranej drukarki i pozwala monitorować, sterować i dostosowywać widok według potrzeb.

Przejdź do: **https://localhost:3443/**

## Przegląd w czasie rzeczywistym

Gdy drukarka jest aktywna, wszystkie wartości są aktualizowane na bieżąco przez MQTT:

- **Temperatura dyszy** — animowany pierścieniowy miernik SVG z temperaturą docelową
- **Temperatura stołu** — analogiczny miernik pierścieniowy dla płyty roboczej
- **Procent postępu** — duży wskaźnik procentowy z pozostałym czasem
- **Licznik warstw** — aktualna warstwa / całkowita liczba warstw
- **Prędkość** — Cicha / Standardowa / Sport / Turbo z suwakiem

:::tip Aktualizacja w czasie rzeczywistym
Wszystkie wartości są aktualizowane bezpośrednio z drukarki przez MQTT bez przeładowania strony. Opóźnienie wynosi zazwyczaj poniżej 1 sekundy.
:::

## Podgląd modelu 3D

Jeśli drukarka wysyła plik `.3mf` z modelem, wyświetlany jest interaktywny podgląd 3D:

1. Model ładuje się automatycznie po rozpoczęciu wydruku
2. Obracaj model, przeciągając myszą
3. Przewijaj, aby powiększyć/pomniejszyć
4. Kliknij **Resetuj**, aby wrócić do widoku domyślnego

:::info Obsługa
Podgląd 3D wymaga, aby drukarka wysyłała dane modelu. Nie wszystkie zadania wydruku to zawierają.
:::

## Status AMS

Panel AMS wyświetla wszystkie zamontowane urządzenia AMS ze slotami i filamentami:

- **Kolor slotu** — wizualna reprezentacja koloru z metadanych Bambu
- **Nazwa filamentu** — materiał i marka
- **Aktywny slot** — oznaczony animacją pulsowania podczas drukowania
- **Błąd** — czerwony wskaźnik przy błędzie AMS (zablokowanie, pusty, wilgotny)

Kliknij slot, aby zobaczyć pełne informacje o filamencie i powiązać go z magazynem.

## Podgląd kamery

Transmisja kamery na żywo jest konwertowana przez ffmpeg (RTSPS → MPEG1):

1. Kamera uruchamia się automatycznie po otwarciu dashboardu
2. Kliknij obraz z kamery, aby otworzyć pełny ekran
3. Użyj przycisku **Zrzut ekranu**, aby zrobić zdjęcie
4. Kliknij **Ukryj kamerę**, aby zwolnić miejsce

:::warning Wydajność
Strumień kamery zużywa ok. 2–5 Mbit/s. Wyłącz kamerę przy wolnych połączeniach sieciowych.
:::

## Sparklines temperatury

Pod panelem AMS wyświetlane są minigrafy (sparklines) z ostatnich 30 minut:

- Temperatura dyszy w czasie
- Temperatura stołu w czasie
- Temperatura komory (jeśli dostępna)

Kliknij sparkline, aby otworzyć pełny widok wykresu telemetrii.

## Dostosowywanie widżetów

Dashboard używa siatki z przeciąganiem i upuszczaniem (grid layout):

1. Kliknij **Dostosuj układ** (ikona ołówka w prawym górnym rogu)
2. Przeciągnij widżety na żądaną pozycję
3. Zmień rozmiar, przeciągając narożnik
4. Kliknij **Zablokuj układ**, aby zamrozić pozycje
5. Kliknij **Zapisz**, aby zachować układ

Dostępne widżety:
| Widżet | Opis |
|---|---|
| Kamera | Transmisja kamery na żywo |
| AMS | Status szpul i filamentów |
| Temperatura | Mierniki pierścieniowe dla dyszy i stołu |
| Postęp | Wskaźnik procentowy i szacowany czas |
| Telemetria | Wentylatory, ciśnienie, prędkość |
| Model 3D | Interaktywny podgląd modelu |
| Sparklines | Miniwykresy temperatur |

:::tip Zapis
Układ jest zapisywany per użytkownik w przeglądarce (localStorage). Różni użytkownicy mogą mieć różne układy.
:::
