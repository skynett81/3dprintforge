---
sidebar_position: 5
title: Przewidywanie zużycia
description: Analiza predykcyjna 8 komponentów drukarki z obliczaniem czasu życia, alertami konserwacyjnymi i prognozą kosztów
---

# Przewidywanie zużycia

Przewidywanie zużycia oblicza oczekiwany czas życia krytycznych komponentów na podstawie rzeczywistego użytkowania, rodzaju filamentu i zachowania drukarki — dzięki czemu możesz proaktywnie planować konserwację zamiast reagować reaktywnie.

Przejdź do: **https://localhost:3443/#wear**

## Monitorowane komponenty

3DPrintForge śledzi zużycie 8 komponentów na drukarkę:

| Komponent | Główny czynnik zużycia | Typowy czas życia |
|---|---|---|
| **Dysza (mosiądz)** | Typ filamentu + godziny | 300–800 godzin |
| **Dysza (hartowana)** | Godziny + materiał ścierny | 1500–3000 godzin |
| **Rurka PTFE** | Godziny + wysoka temperatura | 500–1500 godzin |
| **Koło zębate wytłaczacza** | Godziny + materiał ścierny | 1000–2000 godzin |
| **Drążek osi X (CNC)** | Liczba wydruków + prędkość | 2000–5000 godzin |
| **Powierzchnia płyty roboczej** | Liczba wydruków + temperatura | 200–500 wydruków |
| **Koło zębate AMS** | Liczba wymian filamentu | 5000–15000 wymian |
| **Wentylatory komory** | Godziny pracy | 3000–8000 godzin |

## Obliczanie zużycia

Zużycie jest obliczane jako łączny procent (0–100% zużyte):

```
Zużycie % = (rzeczywiste użytkowanie / oczekiwany czas życia) × 100
           × multiplikator materiału
           × multiplikator prędkości
```

**Multiplikatory materiałów:**
- PLA, PETG: 1.0× (normalne zużycie)
- ABS, ASA: 1.1× (nieco bardziej agresywny)
- PA, PC: 1.2× (twardy dla PTFE i dyszy)
- Kompozyty CF/GF: 2.0–3.0× (bardzo ścierne)

:::warning Włókno węglowe
Filamenty wzmacniane włóknem węglowym (CF-PLA, CF-PA itp.) bardzo szybko zużywają mosiężne dysze. Używaj dyszy z hartowanej stali i spodziewaj się 2–3× szybszego zużycia.
:::

## Obliczanie czasu życia

Dla każdego komponentu wyświetlane są:

- **Aktualne zużycie** — użyty procent
- **Szacowany pozostały czas życia** — godziny lub wydruki
- **Szacowana data wygaśnięcia** — na podstawie średniego użycia z ostatnich 30 dni
- **Przedział ufności** — margines niepewności dla przewidywania

Kliknij komponent, aby zobaczyć szczegółowy wykres akumulacji zużycia w czasie.

## Alerty

Skonfiguruj automatyczne alerty per komponent:

1. Przejdź do **Zużycie → Ustawienia**
2. Dla każdego komponentu ustaw **Próg alertu** (zalecane: 75% i 90%)
3. Wybierz kanał powiadomień (zobacz [Powiadomienia](../features/notifications))

**Przykładowy komunikat alertu:**
> ⚠️ Dysza (mosiądz) w Moim X1C jest zużyta w 78%. Szacowany czas życia: ~45 godzin. Zalecane: Zaplanuj wymianę dyszy.

## Koszty konserwacji

Moduł zużycia integruje się z dziennikiem kosztów:

- **Koszt per komponent** — cena części zamiennej
- **Łączny koszt wymiany** — suma dla wszystkich komponentów zbliżających się do limitu
- **Prognoza na następne 6 miesięcy** — szacowane koszty konserwacji w przyszłości

Wprowadź ceny komponentów w **Zużycie → Ceny**:

1. Kliknij **Ustaw ceny**
2. Wprowadź cenę per sztukę dla każdego komponentu
3. Cena jest używana w prognozach kosztów i może się różnić w zależności od modelu drukarki

## Resetowanie licznika zużycia

Po konserwacji zresetuj licznik dla danego komponentu:

1. Przejdź do **Zużycie → [Nazwa komponentu]**
2. Kliknij **Oznacz jako wymieniony**
3. Wypełnij:
   - Data wymiany
   - Koszt (opcjonalnie)
   - Notatka (opcjonalnie)
4. Licznik zużycia jest resetowany i przeliczany na nowo

Resetowania są wyświetlane w historii konserwacji.

:::tip Kalibracja
Porównaj przewidywanie zużycia z rzeczywistymi danymi z doświadczenia i dostosuj parametry czasu życia w **Zużycie → Skonfiguruj czas życia**, aby dostosować obliczenia do Twojego rzeczywistego użytkowania.
:::
