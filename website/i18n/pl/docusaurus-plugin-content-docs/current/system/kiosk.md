---
sidebar_position: 6
title: Tryb kiosku
description: Skonfiguruj 3DPrintForge jako ekran ścienny lub widok centrum z trybem kiosku i automatyczną rotacją
---

# Tryb kiosku

Tryb kiosku jest zaprojektowany dla ekranów ściennych, telewizorów lub dedykowanych monitorów, które stale wyświetlają status drukarki — bez klawiatury, interakcji myszą ani interfejsu przeglądarki.

Przejdź do: **https://localhost:3443/#settings** → **System → Kiosk**

## Czym jest tryb kiosku

W trybie kiosku:
- Menu nawigacyjne jest ukryte
- Brak widocznych interaktywnych elementów sterowania
- Dashboard odświeża się automatycznie
- Ekran rotuje między drukarkami (jeśli skonfigurowano)
- Limit czasu bezczynności jest wyłączony

## Aktywowanie trybu kiosku przez URL

Dodaj `?kiosk=true` do URL, aby aktywować tryb kiosku bez zmiany ustawień:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

Tryb kiosku jest wyłączany przez usunięcie parametru lub dodanie `?kiosk=false`.

## Ustawienia kiosku

1. Przejdź do **Ustawienia → System → Kiosk**
2. Skonfiguruj:

| Ustawienie | Wartość domyślna | Opis |
|---|---|---|
| Widok domyślny | Przegląd floty | Która strona jest wyświetlana |
| Interwał rotacji | 30 sekund | Czas na drukarkę w rotacji |
| Tryb rotacji | Tylko aktywne | Rotuj tylko między aktywnymi drukarkami |
| Motyw | Ciemny | Zalecany dla ekranów |
| Rozmiar czcionki | Duży | Czytelny z odległości |
| Wyświetlanie zegara | Wył. | Pokaż zegar w rogu |

## Widok floty dla kiosku

Przegląd floty jest zoptymalizowany dla kiosku:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parametry dla widoku floty:
- `cols=N` — liczba kolumn (1–6)
- `size=small|medium|large` — rozmiar kart

## Rotacja pojedynczej drukarki

Dla rotacji między pojedynczymi drukarkami (jedna drukarka na raz):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — aktywuj rotację
- `interval=N` — sekund na drukarkę

## Konfiguracja na Raspberry Pi / NUC

Dla dedykowanego sprzętu do kiosku:

### Chromium w trybie kiosku (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Dodaj polecenie do autostartu (`~/.config/autostart/bambu-kiosk.desktop`).

### Automatyczne logowanie i uruchamianie

1. Skonfiguruj automatyczne logowanie w systemie operacyjnym
2. Utwórz wpis autostartu dla Chromium
3. Wyłącz wygaszacz ekranu i oszczędzanie energii:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Dedykowane konto użytkownika
Utwórz dedykowane konto 3DPrintForge z rolą **Gość** dla urządzenia kiosku. Wtedy urządzenie ma tylko dostęp do odczytu i nie może zmieniać ustawień, nawet jeśli ktoś uzyska dostęp do ekranu.
:::

## Ustawienia centrum

Tryb centrum pokazuje stronę przeglądu ze wszystkimi drukarkami i kluczowymi statystykami — zaprojektowany dla dużych telewizorów:

```
https://localhost:3443/#hub?kiosk=true
```

Widok centrum zawiera:
- Siatkę drukarek ze statusem
- Zagregowane kluczowe wskaźniki (aktywne wydruki, łączny postęp)
- Zegar i datę
- Najnowsze alerty HMS
