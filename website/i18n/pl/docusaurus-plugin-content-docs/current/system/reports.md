---
sidebar_position: 7
title: Raporty
description: Automatyczne cotygodniowe i miesięczne raporty e-mail ze statystykami, podsumowaniem aktywności i przypomnieniami o konserwacji
---

# Raporty

Bambu Dashboard może wysyłać automatyczne raporty e-mail ze statystykami i podsumowaniem aktywności — co tydzień, co miesiąc lub oba.

Przejdź do: **https://localhost:3443/#settings** → **System → Raporty**

## Wymagania wstępne

Raporty wymagają skonfigurowanych powiadomień e-mail. Skonfiguruj SMTP w **Ustawienia → Powiadomienia → E-mail** przed aktywowaniem raportów. Zobacz [Powiadomienia](../funksjoner/notifications).

## Aktywowanie automatycznych raportów

1. Przejdź do **Ustawienia → Raporty**
2. Aktywuj **Raport tygodniowy** i/lub **Raport miesięczny**
3. Wybierz **Czas wysyłania**:
   - Tygodniowo: dzień tygodnia i godzina
   - Miesięcznie: dzień miesiąca (np. 1. poniedziałek / ostatni piątek)
4. Wypełnij **E-mail odbiorcy** (oddzielone przecinkami dla wielu)
5. Kliknij **Zapisz**

Wyślij raport testowy, aby zobaczyć formatowanie: kliknij **Wyślij raport testowy teraz**.

## Zawartość raportu tygodniowego

Raport tygodniowy obejmuje ostatnie 7 dni:

### Podsumowanie
- Łączna liczba wydruków
- Liczba udanych / nieudanych / przerwanych
- Wskaźnik sukcesu i zmiana w porównaniu z poprzednim tygodniem
- Najbardziej aktywna drukarka

### Aktywność
- Wydruki dziennie (mini-wykres)
- Łączne godziny drukowania
- Łączne zużycie filamentu (gramy i koszt)

### Filament
- Zużycie na materiał i dostawcę
- Szacowana pozostałość na szpulę (szpule poniżej 20% wyróżnione)

### Konserwacja
- Zadania konserwacyjne wykonane w tym tygodniu
- Zaległe zadania konserwacyjne (czerwone ostrzeżenie)
- Zadania wymagalne w następnym tygodniu

### Błędy HMS
- Liczba błędów HMS w tym tygodniu na drukarkę
- Niepotwierdzne błędy (wymagają uwagi)

## Zawartość raportu miesięcznego

Raport miesięczny obejmuje ostatnie 30 dni i zawiera wszystko z raportu tygodniowego, plus:

### Trend
- Porównanie z poprzednim miesiącem (%)
- Mapa aktywności (miniatura heatmapy za miesiąc)
- Miesięczny rozwój wskaźnika sukcesu

### Koszty
- Łączny koszt filamentu
- Łączny koszt prądu (jeśli skonfigurowany pomiar prądu)
- Łączny koszt zużycia
- Łączny koszt konserwacji

### Zużycie i kondycja
- Wynik kondycji na drukarkę (ze zmianą w porównaniu z poprzednim miesiącem)
- Komponenty zbliżające się do terminu wymiany

### Najważniejsze statystyki
- Najdłuższy udany wydruk
- Najczęściej używany typ filamentu
- Drukarka z najwyższą aktywnością

## Dostosowywanie raportu

1. Przejdź do **Ustawienia → Raporty → Dostosowanie**
2. Zaznacz / odznacz sekcje, które chcesz uwzględnić
3. Wybierz **Filtr drukarek**: wszystkie drukarki lub wybór
4. Wybierz **Wyświetlanie logo**: pokaż logo Bambu Dashboard w nagłówku lub wyłącz
5. Kliknij **Zapisz**

## Archiwum raportów

Wszystkie wysłane raporty są zapisywane i można je ponownie otworzyć:

1. Przejdź do **Ustawienia → Raporty → Archiwum**
2. Wybierz raport z listy (posortowanej według daty)
3. Kliknij **Otwórz**, aby zobaczyć wersję HTML
4. Kliknij **Pobierz PDF**, aby pobrać raport

Raporty są automatycznie usuwane po **90 dniach** (konfigurowalne).
