---
sidebar_position: 6
title: Analiza wzorców błędów
description: Analiza wzorców błędów oparta na AI, korelacje między błędami a czynnikami środowiskowymi i konkretne sugestie ulepszeń
---

# Analiza wzorców błędów

Analiza wzorców błędów wykorzystuje dane historyczne z wydruków i błędów do identyfikacji wzorców, przyczyn i korelacji — a następnie dostarcza konkretnych sugestii ulepszeń.

Przejdź do: **https://localhost:3443/#error-analysis**

## Co jest analizowane

System analizuje następujące punkty danych:

- Kody błędów HMS i czasy wystąpienia
- Typ filamentu i dostawca przy błędzie
- Temperatura przy błędzie (dysza, stół, komora)
- Prędkość drukowania i profil
- Pora dnia i dzień tygodnia
- Czas od ostatniej konserwacji
- Model drukarki i wersja oprogramowania układowego

## Analiza korelacji

System szuka statystycznych korelacji między błędami a czynnikami:

**Przykłady wykrywanych korelacji:**
- „78% błędów zablokowania AMS występuje z filamentem od dostawcy X"
- „Zablokowanie dyszy zdarza się 3× częściej po 6+ godzinach ciągłego drukowania"
- „Błędy przyczepności wzrastają przy temperaturze komory poniżej 18°C"
- „Błędy stringing korelują z wilgotnością powyżej 60% (jeśli podłączony higrometr)"

Korelacje ze znaczeniem statystycznym (p < 0.05) są wyświetlane na górze.

:::info Wymagania dotyczące danych
Analiza jest najdokładniejsza przy minimum 50 wydrukach w historii. Przy mniejszej liczbie wydruków wyświetlane są szacunki z niską ufnością.
:::

## Sugestie ulepszeń

Na podstawie analiz generowane są konkretne sugestie:

| Typ sugestii | Przykład |
|---|---|
| Filament | „Zmień na innego dostawcę dla PA-CF — 3 z 4 błędów używało DostawcaX" |
| Temperatura | „Zwiększ temperaturę stołu o 5°C dla PETG — szacowane zmniejszenie błędów przyczepności o 60%" |
| Prędkość | „Zmniejsz prędkość do 80% po 4 godzinach — szacowane zmniejszenie blokad dyszy o 45%" |
| Konserwacja | „Wyczyść koła zębate wytłaczacza — zużycie koreluje z 40% błędów wytłaczania" |
| Kalibracja | „Uruchom poziomowanie stołu — 12 z 15 błędów przyczepności w ostatnim tygodniu koreluje z nieprawidłową kalibracją" |

Każda sugestia pokazuje:
- Szacowany efekt (% redukcja błędów)
- Ufność (niska / średnia / wysoka)
- Implementacja krok po kroku
- Link do odpowiedniej dokumentacji

## Wpływ na wynik zdrowia

Analiza jest połączona z wynikiem zdrowia (zobacz [Diagnostyka](./diagnostics)):

- Pokazuje, które czynniki najbardziej obniżają wynik
- Szacuje poprawę wyniku przy implementacji każdej sugestii
- Priorytetyzuje sugestie według potencjalnej poprawy wyniku

## Widok osi czasu

Przejdź do **Analiza błędów → Oś czasu**, aby zobaczyć chronologiczny przegląd:

1. Wybierz drukarkę i okres
2. Błędy są wyświetlane jako punkty na osi czasu, zakodowane kolorami według typu
3. Poziome linie oznaczają zadania konserwacyjne
4. Skupiska błędów (wiele błędów w krótkim czasie) są wyróżnione na czerwono

Kliknij skupisko, aby otworzyć analizę tego konkretnego okresu.

## Raporty

Wygeneruj raport PDF z analizy błędów:

1. Kliknij **Generuj raport**
2. Wybierz okres (np. ostatnie 90 dni)
3. Wybierz zawartość: korelacje, sugestie, oś czasu, wynik zdrowia
4. Pobierz PDF lub wyślij na e-mail

Raporty są zapisywane pod projektami, jeśli drukarka jest powiązana z projektem.

:::tip Tygodniowy przegląd
Skonfiguruj automatyczny tygodniowy raport e-mailowy w **Ustawienia → Raporty**, aby być na bieżąco bez ręcznego odwiedzania dashboardu. Zobacz [Raporty](../system/reports).
:::
