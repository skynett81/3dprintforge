---
sidebar_position: 5
title: Rozwiązywanie problemów z nieudanymi wydrukami
description: Diagnozuj i rozwiązuj typowe błędy druku za pomocą dzienników błędów i narzędzi 3DPrintForge
---

# Rozwiązywanie problemów z nieudanymi wydrukami

Coś poszło nie tak? Nie panikuj — większość błędów druku ma proste rozwiązania. 3DPrintForge pomoże Ci szybko znaleźć przyczynę.

## Krok 1 — Sprawdź kody błędów HMS

HMS (Handling, Monitoring, Sensing) to system błędów Bambu Labs. Wszystkie błędy są automatycznie logowane w panelu.

1. Przejdź do **Monitorowanie → Błędy**
2. Znajdź nieudany wydruk
3. Kliknij kod błędu, aby uzyskać szczegółowy opis i sugerowane rozwiązanie

Typowe kody HMS:

| Kod | Opis | Szybkie rozwiązanie |
|-----|------|---------------------|
| 0700 1xxx | Błąd AMS (zablokowanie, problem z silnikiem) | Sprawdź ścieżkę filamentu w AMS |
| 0300 0xxx | Błąd ekstruzji (pod/nad-ekstruzja) | Wyczyść dyszę, sprawdź filament |
| 0500 xxxx | Błąd kalibracji | Wykonaj rekalibrację |
| 1200 xxxx | Odchylenie temperatury | Sprawdź połączenia kabli |
| 0C00 xxxx | Błąd kamery | Uruchom drukarkę ponownie |

:::tip Kody błędów w historii
W **Historia → [Wydruk] → Dziennik HMS** możesz zobaczyć wszystkie kody błędów, które wystąpiły podczas druku — nawet jeśli wydruk „zakończył się pomyślnie".
:::

## Typowe błędy i rozwiązania

### Słaba przyczepność (pierwsza warstwa nie przywiera)

**Objawy:** Wydruk odpada od płyty, zwija się, brakuje pierwszej warstwy

**Przyczyny i rozwiązania:**

| Przyczyna | Rozwiązanie |
|-----------|-------------|
| Brudna płyta | Wytrzyj alkoholem IPA |
| Zła temperatura płyty | Zwiększ o 5°C |
| Błędny Z-offset | Ponownie wykonaj Auto Bed Leveling |
| Brak kleju (PETG/ABS) | Nałóż cienką warstwę kleju |
| Za szybka pierwsza warstwa | Obniż do 20–30 mm/s dla pierwszej warstwy |

**Szybka lista kontrolna:**
1. Czy płyta jest czysta? (IPA + bezpyłowy papier)
2. Czy używasz odpowiedniej płyty dla typu filamentu? (patrz [Wybór odpowiedniej płyty](./choosing-plate))
3. Czy kalibracja Z została wykonana po ostatniej wymianie płyty?

---

### Warping (narożniki się uginają)

**Objawy:** Narożniki uginają się od płyty, szczególnie przy dużych płaskich modelach

**Przyczyny i rozwiązania:**

| Przyczyna | Rozwiązanie |
|-----------|-------------|
| Różnica temperatur | Zamknij przednie drzwi drukarki |
| Brak krawędzi (brim) | Włącz brim w Bambu Studio (3–5 mm) |
| Za zimna płyta | Zwiększ temperaturę płyty o 5–10°C |
| Filament o wysokim skurczu (ABS) | Użyj Engineering Plate + komora >40°C |

**ABS i ASA są szczególnie podatne.** Zawsze zapewnij:
- Zamknięte przednie drzwi
- Jak najmniejszą wentylację
- Engineering Plate + klej
- Temperatura komory 40°C+

---

### Stringing (nici między częściami)

**Objawy:** Cienkie plastikowe nici między oddzielnymi częściami modelu

**Przyczyny i rozwiązania:**

| Przyczyna | Rozwiązanie |
|-----------|-------------|
| Wilgotny filament | Susz filament 6–8 godzin (60–70°C) |
| Za wysoka temperatura dyszy | Obniż o 5°C |
| Za mała retrakacja | Zwiększ długość retrakcji w Bambu Studio |
| Za niska prędkość przejazdu | Zwiększ prędkość przejazdu do 200+ mm/s |

**Test wilgotności:** Słuchaj trzaskania lub obserwuj bąble w ekstruzji — to wskazuje na wilgotny filament. Bambu AMS ma wbudowany pomiar wilgotności; sprawdź wilgotność w **Status AMS**.

:::tip Suszarka do filamentów
Zainwestuj w suszarkę do filamentów (np. Bambu Filament Dryer), jeśli pracujesz z nylonem lub TPU — te materiały wchłaniają wilgoć w mniej niż 12 godzin.
:::

---

### Spaghetti (wydruk zapada się w kulę)

**Objawy:** Filament wisi w luźnych nitkach w powietrzu, wydruk jest nierozpoznawalny

**Przyczyny i rozwiązania:**

| Przyczyna | Rozwiązanie |
|-----------|-------------|
| Słaba przyczepność wcześnie → oderwanie → zapaść | Patrz sekcja o przyczepności powyżej |
| Za wysoka prędkość | Obniż prędkość o 20–30% |
| Błędna konfiguracja podpór | Włącz podpory w Bambu Studio |
| Nawis zbyt stromy | Podziel model lub obróć o 45° |

**Użyj Print Guard, aby automatycznie zatrzymać spaghetti** — patrz następna sekcja.

---

### Podekstruzja (cienkie, słabe warstwy)

**Objawy:** Warstwy nie są solidne, dziury w ścianach, słaby model

**Przyczyny i rozwiązania:**

| Przyczyna | Rozwiązanie |
|-----------|-------------|
| Częściowo zatkana dysza | Wykonaj Cold Pull (patrz konserwacja) |
| Filament za wilgotny | Susz filament |
| Za niska temperatura | Zwiększ temperaturę dyszy o 5–10°C |
| Za wysoka prędkość | Obniż o 20–30% |
| Uszkodzona rurka PTFE | Sprawdź i wymień rurkę PTFE |

## Używanie Print Guard do automatycznej ochrony

Print Guard monitoruje zdjęcia z kamery przy użyciu rozpoznawania obrazów i automatycznie zatrzymuje wydruk po wykryciu spaghetti.

**Włączanie Print Guard:**
1. Przejdź do **Monitorowanie → Print Guard**
2. Włącz **Automatyczne wykrywanie**
3. Wybierz akcję: **Wstrzymaj** (zalecane) lub **Anuluj**
4. Ustaw czułość (zacznij od **Średniej**)

**Gdy Print Guard interweniuje:**
1. Otrzymujesz powiadomienie ze zdjęciem z kamery pokazującym, co zostało wykryte
2. Wydruk zostaje wstrzymany
3. Możesz wybrać: **Kontynuuj** (jeśli fałszywy alarm) lub **Anuluj wydruk**

:::info Fałszywe alarmy
Print Guard może czasami reagować na modele z wieloma cienkimi kolumnami. Obniż czułość lub tymczasowo wyłącz dla złożonych modeli.
:::

## Narzędzia diagnostyczne w panelu

### Dziennik temperatur
W **Historia → [Wydruk] → Temperatury** możesz zobaczyć krzywą temperatur przez cały wydruk. Szukaj:
- Nagłych spadków temperatury (problem z dyszą lub płytą)
- Nieregularnych temperatur (potrzeba kalibracji)

### Statystyki filamentu
Sprawdź, czy zużyty filament odpowiada szacunkowi. Duże odchylenie może wskazywać na podekstruzję lub pęknięcie filamentu.

## Kiedy skontaktować się z pomocą techniczną?

Skontaktuj się z pomocą techniczną Bambu Labs, jeśli:
- Kod HMS powtarza się po wykonaniu wszystkich sugerowanych rozwiązań
- Widzisz uszkodzenia mechaniczne drukarki (wygięte pręty, uszkodzone koła zębate)
- Wartości temperatury są niemożliwe (np. dysza odczytuje -40°C)
- Aktualizacja oprogramowania układowego nie rozwiązuje problemu

**Przydatne informacje dla pomocy technicznej:**
- Kody błędów HMS z dziennika błędów panelu
- Zdjęcie z kamery błędu
- Jaki filament i jakie ustawienia były używane (można eksportować z historii)
- Model drukarki i wersja oprogramowania układowego (wyświetlane w **Ustawienia → Drukarka → Informacje**)
