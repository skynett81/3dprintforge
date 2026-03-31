---
sidebar_position: 10
title: Streaming z OBS
description: Skonfiguruj 3DPrintForge jako nakładkę w OBS Studio dla profesjonalnego streamingu druku 3D
---

# Streaming druku 3D do OBS

3DPrintForge ma wbudowaną nakładkę OBS, która wyświetla status drukarki, postęp, temperatury i podgląd kamery bezpośrednio w Twoim streamie.

## Wymagania wstępne

- Zainstalowane OBS Studio ([obsproject.com](https://obsproject.com))
- 3DPrintForge uruchomiony i połączony z drukarką
- (Opcjonalne) Kamera Bambu włączona dla podglądu na żywo

## Krok 1 — OBS Browser Source

OBS posiada wbudowane **Browser Source**, które wyświetla stronę internetową bezpośrednio w Twojej scenie.

**Dodawanie nakładki w OBS:**

1. Otwórz OBS Studio
2. W **Źródła** (Sources) kliknij **+**
3. Wybierz **Przeglądarka** (Browser)
4. Nadaj źródłu nazwę, np. „Bambu Overlay"
5. Wypełnij:

| Ustawienie | Wartość |
|------------|---------|
| URL | `http://localhost:3000/obs/overlay` |
| Szerokość | `1920` |
| Wysokość | `1080` |
| FPS | `30` |
| Własny CSS | Patrz poniżej |

6. Zaznacz **Kontroluj audio przez OBS**
7. Kliknij **OK**

:::info Dostosuj URL do swojego serwera
Panel działa na innej maszynie niż OBS? Zamień `localhost` na adres IP serwera, np. `http://192.168.1.50:3000/obs/overlay`
:::

## Krok 2 — Przezroczyste tło

Aby nakładka wtapiała się w obraz, tło musi być przezroczyste:

**W ustawieniach OBS Browser Source:**
- Zaznacz **Usuń tło** (Shutdown source when not visible / Remove background)

**Własny CSS wymuszający przezroczystość:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Wklej to w pole **Własny CSS** w ustawieniach Browser Source.

Nakładka teraz wyświetla tylko sam widget — bez białego ani czarnego tła.

## Krok 3 — Dostosowanie nakładki

W 3DPrintForge możesz skonfigurować, co wyświetla nakładka:

1. Przejdź do **Funkcje → Nakładka OBS**
2. Skonfiguruj:

| Ustawienie | Opcje |
|------------|-------|
| Pozycja | Góra lewa, prawa, dół lewa, prawa |
| Rozmiar | Mały, średni, duży |
| Motyw | Ciemny, jasny, przezroczysty |
| Kolor akcentu | Wybierz kolor pasujący do stylu streamu |
| Elementy | Wybierz, co jest wyświetlane (patrz poniżej) |

**Dostępne elementy nakładki:**

- Nazwa drukarki i status (online/drukuje/błąd)
- Pasek postępu z procentem i pozostałym czasem
- Filament i kolor
- Temperatura dyszy i płyty
- Zużyty filament (gramy)
- Przegląd AMS (kompaktowy)
- Status Print Guard

3. Kliknij **Podgląd**, aby zobaczyć wynik bez przełączania do OBS
4. Kliknij **Zapisz**

:::tip URL dla każdej drukarki
Masz kilka drukarek? Użyj osobnych URL nakładek:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Podgląd kamery w OBS (osobne źródło)

Kamerę Bambu można dodać jako osobne źródło w OBS — niezależnie od nakładki:

**Opcja 1: Przez proxy kamery panelu**

1. Przejdź do **System → Kamera**
2. Skopiuj **URL strumienia RTSP lub MJPEG**
3. W OBS: Kliknij **+** → **Źródło mediów** (Media Source)
4. Wklej URL
5. Zaznacz **Pętla** (Loop) i dezaktywuj pliki lokalne

**Opcja 2: Browser Source z widokiem kamery**

1. W OBS: Dodaj **Browser Source**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Szerokość/wysokość: odpowiada rozdzielczości kamery (1080p lub 720p)

Teraz możesz swobodnie umieszczać podgląd kamery w scenie i nakładać na niego nakładkę.

## Wskazówki dla dobrego streamu

### Konfiguracja sceny streamingowej

Typowa scena dla streamingu druku 3D:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Podgląd kamery z drukarki]        │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Dół lewa      │
│  │ Druk: Logo.3mf   │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1g 24m pozostało │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Zalecane ustawienia

| Parametr | Zalecana wartość |
|----------|-----------------|
| Rozmiar nakładki | Średni (nie za dominujący) |
| Częstotliwość odświeżania | 30 FPS (zgodne z OBS) |
| Pozycja nakładki | Dół lewa (unika twarzy/czatu) |
| Motyw kolorystyczny | Ciemny z niebieskim akcentem |

### Sceny i przełączanie scen

Utwórz własne sceny OBS:

- **„Druk w toku"** — widok kamery + nakładka
- **„Pauza / oczekiwanie"** — statyczny obraz + nakładka
- **„Gotowe"** — zdjęcie wyniku + nakładka pokazująca „Ukończono"

Przełączaj się między scenami skrótem klawiszowym w OBS lub przez Scene Collection.

### Stabilizacja obrazu kamery

Kamera Bambu może czasami się zawieszać. W panelu w **System → Kamera**:
- Włącz **Automatyczne ponowne połączenie** — panel połączy się automatycznie
- Ustaw **Interwał ponownego połączenia** na 10 sekund

### Dźwięk

Drukarki 3D wydają dźwięk — szczególnie AMS i chłodzenie. Rozważ:
- Umieść mikrofon z dala od drukarki
- Dodaj filtr szumów na mikrofonie w OBS (Noise Suppression)
- Lub użyj muzyki w tle / dźwięku czatu zamiast tego

:::tip Automatyczne przełączanie scen
OBS ma wbudowaną obsługę przełączania scen na podstawie tytułów. Połącz z wtyczką (np. obs-websocket) i API 3DPrintForge, aby automatycznie przełączać sceny, gdy wydruk się rozpoczyna i kończy.
:::
