---
sidebar_position: 4
title: Motyw
description: Dostosuj wygląd Bambu Dashboard z trybem jasnym/ciemnym/auto, 6 paletami kolorów i niestandardowym kolorem akcentu
---

# Motyw

Bambu Dashboard ma elastyczny system motywów, który pozwala dostosować wygląd do swoich upodobań i przypadku użycia.

Przejdź do: **https://localhost:3443/#settings** → **Motyw**

## Tryb kolorów

Wybierz spośród trzech trybów:

| Tryb | Opis |
|---|---|
| **Jasny** | Jasne tło, ciemny tekst — dobry w dobrze oświetlonych pomieszczeniach |
| **Ciemny** | Ciemne tło, jasny tekst — domyślny i zalecany do monitorowania |
| **Auto** | Podąża za ustawieniem systemu operacyjnego (ciemny/jasny OS) |

Zmień tryb u góry ustawień motywu lub za pomocą skrótu klawiszowego w pasku nawigacyjnym (ikona księżyca/słońca).

## Palety kolorów

Dostępnych jest sześć predefiniowanych palet kolorów:

| Paleta | Kolor główny | Styl |
|---|---|---|
| **Bambu** | Zielony (#00C853) | Standardowy, inspirowany Bambu Lab |
| **Niebieska noc** | Niebieski (#2196F3) | Spokojny i profesjonalny |
| **Zachód słońca** | Pomarańczowy (#FF6D00) | Ciepły i energiczny |
| **Fioletowy** | Fioletowy (#9C27B0) | Kreatywny i wyróżniający |
| **Czerwony** | Czerwony (#F44336) | Wysoki kontrast, przyciągający uwagę |
| **Monochromatyczny** | Szary (#607D8B) | Neutralny i minimalistyczny |

Kliknij paletę, aby natychmiast podejrzeć i aktywować ją.

## Niestandardowy kolor akcentu

Użyj własnego koloru jako koloru akcentu:

1. Kliknij **Niestandardowy kolor** pod wybierakiem palet
2. Użyj selektora kolorów lub wpisz kod hex (np. `#FF5722`)
3. Podgląd jest aktualizowany w czasie rzeczywistym
4. Kliknij **Zastosuj**, aby aktywować

:::tip Kontrast
Upewnij się, że kolor akcentu ma dobry kontrast z tłem. System ostrzega, jeśli kolor może powodować problemy z czytelnością (standard WCAG AA).
:::

## Zaokrąglenie

Dostosuj zaokrąglenie przycisków, kart i elementów:

| Ustawienie | Opis |
|---|---|
| **Ostre** | Brak zaokrąglenia (styl prostokątny) |
| **Małe** | Subtelne zaokrąglenie (4 px) |
| **Średnie** | Standardowe zaokrąglenie (8 px) |
| **Duże** | Wyraźne zaokrąglenie (16 px) |
| **Pigułka** | Maksymalne zaokrąglenie (50 px) |

Przesuń suwak, aby dostosować ręcznie między 0–50 px.

## Kompaktowość

Dostosuj gęstość w interfejsie:

| Ustawienie | Opis |
|---|---|
| **Przestrzenne** | Więcej przestrzeni między elementami |
| **Standardowe** | Zrównoważone, domyślne ustawienie |
| **Kompaktowe** | Ściślejsze pakowanie — więcej informacji na ekranie |

Tryb kompaktowy jest zalecany dla ekranów poniżej 1080p lub widoku kiosku.

## Typografia

Wybierz czcionkę:

- **System** — używa domyślnej czcionki systemu operacyjnego (szybkie ładowanie)
- **Inter** — czysta i nowoczesna (domyślny wybór)
- **JetBrains Mono** — monospace, dobra dla wartości danych
- **Nunito** — miękkszy i bardziej zaokrąglony styl

## Animacje

Wyłącz lub dostosuj animacje:

- **Pełne** — wszystkie przejścia i animacje aktywne (domyślnie)
- **Zredukowane** — tylko niezbędne animacje (respektuje preferencje OS)
- **Wyłączone** — brak animacji dla maksymalnej wydajności

:::tip Tryb kiosku
Dla widoku kiosku aktywuj **Kompaktowy** + **Ciemny** + **Zredukowane animacje** dla optymalnej wydajności i czytelności z odległości. Zobacz [Tryb kiosku](./kiosk).
:::

## Eksport i import ustawień motywu

Podziel się swoim motywem z innymi:

1. Kliknij **Eksportuj motyw** — pobiera plik `.json`
2. Podziel się plikiem z innymi użytkownikami Bambu Dashboard
3. Importują przez **Importuj motyw** → wybierz plik
