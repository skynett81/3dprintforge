---
sidebar_position: 4
title: Nakładka OBS
description: Dodaj przezroczystą nakładkę ze statusem dla drukarki Bambu Lab bezpośrednio w OBS Studio
---

# Nakładka OBS

Nakładka OBS pozwala wyświetlać aktualny status drukarki bezpośrednio w OBS Studio — idealna do transmisji na żywo lub nagrywania drukowania 3D.

## URL nakładki

Nakładka jest dostępna jako strona internetowa z przezroczystym tłem:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Zastąp `PRINTER_ID` identyfikatorem drukarki (znajdziesz go w **Ustawienia → Drukarki**).

### Dostępne parametry

| Parametr | Wartość domyślna | Opis |
|---|---|---|
| `printer` | pierwsza drukarka | ID drukarki do wyświetlenia |
| `theme` | `dark` | `dark`, `light` lub `minimal` |
| `scale` | `1.0` | Skalowanie (0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Przezroczystość (0.0–1.0) |
| `fields` | wszystkie | Lista rozdzielona przecinkami: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Kolor akcentu (hex) |

**Przykład z parametrami:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Konfiguracja w OBS Studio

### Krok 1: Dodaj źródło przeglądarki

1. Otwórz OBS Studio
2. Kliknij **+** pod **Źródła**
3. Wybierz **Przeglądarka** (Browser Source)
4. Nadaj źródłu nazwę, np. `Bambu Overlay`
5. Kliknij **OK**

### Krok 2: Skonfiguruj źródło przeglądarki

Wypełnij następujące pola w oknie dialogowym ustawień:

| Pole | Wartość |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=TWOJ_ID` |
| Szerokość | `400` |
| Wysokość | `200` |
| FPS | `30` |
| Własny CSS | *(zostaw puste)* |

Zaznacz:
- ✅ **Wyłącz źródło gdy niewidoczne**
- ✅ **Odśwież przeglądarkę gdy scena jest aktywowana**

:::warning HTTPS i localhost
OBS może ostrzegać o samopodpisanym certyfikacie. Najpierw przejdź do `https://localhost:3443` w Chrome/Firefox i zaakceptuj certyfikat. OBS będzie wtedy używał tego samego zatwierdzenia.
:::

### Krok 3: Przezroczyste tło

Nakładka jest zbudowana z `background: transparent`. Aby to działało w OBS:

1. **Nie** zaznaczaj **Własny kolor tła** w źródle przeglądarki
2. Upewnij się, że nakładka nie jest opakowana w nieprzezroczysty element
3. Ustaw **Tryb mieszania** na **Normalny** dla źródła w OBS

:::tip Alternatywa: Chroma key
Jeśli przezroczystość nie działa, użyj filtru → **Chroma Key** z zielonym tłem:
Dodaj `&bg=green` do URL i ustaw filtr chroma key na źródle w OBS.
:::

## Co jest wyświetlane w nakładce

Standardowa nakładka zawiera:

- **Pasek postępu** z wartością procentową
- **Pozostały czas** (szacowany)
- **Temperaturę dyszy** i **temperaturę stołu**
- **Aktywny slot AMS** z kolorem filamentu i nazwą
- **Model drukarki** i nazwę (można wyłączyć)

## Tryb minimalny do transmisji

Dla dyskretnej nakładki podczas transmisji:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Wyświetla tylko mały pasek postępu z pozostałym czasem w rogu.
