---
sidebar_position: 2
title: Konfiguracja magazynu filamentów
description: Jak tworzyć, konfigurować i śledzić szpule filamentów w 3DPrintForge
---

# Konfiguracja magazynu filamentów

Magazyn filamentów w 3DPrintForge daje Ci pełny przegląd wszystkich Twoich szpul — co pozostało, co zużyłeś i które szpule są aktualnie w AMS.

## Automatyczne tworzenie z AMS

Gdy podłączysz drukarkę z AMS, panel automatycznie odczytuje informacje z chipów RFID na szpulach Bambu:

- Typ filamentu (PLA, PETG, ABS, TPU itp.)
- Kolor (z kodem hex)
- Marka (Bambu Lab)
- Waga szpuli i pozostała ilość

**Te szpule są tworzone automatycznie w magazynie** — nie musisz nic robić. Znajdziesz je w **Filament → Magazyn**.

:::info Tylko szpule Bambu mają RFID
Szpule innych producentów (np. eSUN, Polymaker, uzupełnienia Bambu bez chipa) nie są rozpoznawane automatycznie. Należy je dodać ręcznie.
:::

## Ręczne dodawanie szpul

Dla szpul bez RFID lub szpul, które nie są w AMS:

1. Przejdź do **Filament → Magazyn**
2. Kliknij **+ Nowa szpula** w prawym górnym rogu
3. Wypełnij pola:

| Pole | Przykład | Obowiązkowe |
|------|----------|-------------|
| Marka | eSUN, Polymaker, Bambu | Tak |
| Typ | PLA, PETG, ABS, TPU | Tak |
| Kolor | #FF5500 lub wybierz z koła kolorów | Tak |
| Waga startowa | 1000 g | Zalecane |
| Pozostałe | 850 g | Zalecane |
| Średnica | 1,75 mm | Tak |
| Notatka | „Kupione 2025-01, działa dobrze" | Opcjonalne |

4. Kliknij **Zapisz**

## Konfigurowanie kolorów i marek

Możesz edytować szpulę w dowolnym momencie, klikając ją w przeglądzie magazynu:

- **Kolor** — Wybierz z koła kolorów lub wprowadź wartość hex. Kolor jest używany jako znacznik wizualny w przeglądzie AMS
- **Marka** — Wyświetlana w statystykach i filtrowaniu. Utwórz własne marki w **Filament → Marki**
- **Profil temperatury** — Wprowadź zalecaną temperaturę dyszy i płyty od producenta filamentu. Panel może wtedy ostrzegać, jeśli wybierzesz niewłaściwą temperaturę

## Rozumienie synchronizacji AMS

Panel synchronizuje status AMS w czasie rzeczywistym:

```
Slot AMS 1 → Szpula: Bambu PLA Biały  [███████░░░] 72% pozostało
Slot AMS 2 → Szpula: eSUN PETG Szary  [████░░░░░░] 41% pozostało
Slot AMS 3 → (pusty)
Slot AMS 4 → Szpula: Bambu PLA Czerwony [██████████] 98% pozostało
```

Synchronizacja jest aktualizowana:
- **Podczas druku** — zużycie jest odejmowane w czasie rzeczywistym
- **Po zakończeniu druku** — końcowe zużycie jest logowane w historii
- **Ręcznie** — kliknij ikonę synchronizacji na szpuli, aby pobrać zaktualizowane dane z AMS

:::tip Korygowanie szacunku AMS
Szacunek AMS z RFID nie zawsze jest w 100% dokładny po pierwszym użyciu. Zważ szpulę i ręcznie zaktualizuj wagę dla najlepszej precyzji.
:::

## Sprawdzanie zużycia i pozostałości

### Na szpulę
Kliknij szpulę w magazynie, aby zobaczyć:
- Łączne zużycie (gramy, wszystkie wydruki)
- Szacowana pozostała ilość
- Lista wszystkich wydruków, w których użyto tej szpuli

### Zagregowane statystyki
W **Analiza → Analiza filamentów** widzisz:
- Zużycie według typu filamentu w czasie
- Których marek używasz najczęściej
- Szacowany koszt na podstawie ceny zakupu za kg

### Alerty niskiego poziomu
Skonfiguruj alerty, gdy szpula jest bliska wyczerpania:

1. Przejdź do **Filament → Ustawienia**
2. Włącz **Powiadom o niskim stanie magazynu**
3. Ustaw próg (np. 100 g pozostało)
4. Wybierz kanał powiadomień (Telegram, Discord, e-mail)

## Wskazówka: Ważenie szpul dla dokładności

Szacunki z AMS i statystyk wydruku nigdy nie są w pełni dokładne. Najdokładniejszą metodą jest ważenie samej szpuli:

**Jak to zrobić:**

1. Znajdź wagę tary (pusta szpula) — zazwyczaj 200–250 g, sprawdź stronę producenta lub spód szpuli
2. Zważ szpulę z filamentem na wadze kuchennej
3. Odejmij wagę tary
4. Zaktualizuj **Pozostałe** w profilu szpuli

**Przykład:**
```
Zmierzona waga:   743 g
Tara (pusta):   - 230 g
Pozostały filament: 513 g
```

:::tip Generator etykiet szpul
W **Narzędzia → Etykiety** możesz drukować etykiety z kodem QR dla swoich szpul. Zeskanuj kod telefonem, aby szybko otworzyć profil szpuli.
:::
