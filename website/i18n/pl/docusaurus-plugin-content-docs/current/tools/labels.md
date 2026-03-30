---
sidebar_position: 1
title: Etykiety
description: Generuj kody QR, etykiety szpul dla drukarek termicznych (ZPL), karty kolorów i udostępniane palety kolorów dla magazynu filamentów
---

# Etykiety

Narzędzie do etykiet generuje profesjonalne etykiety dla szpul filamentów — kody QR, etykiety szpul dla drukarek termicznych i karty kolorów do wizualnej identyfikacji.

Przejdź do: **https://localhost:3443/#labels**

## Kody QR

Generuj kody QR prowadzące do informacji o filamencie w dashboardzie:

1. Przejdź do **Etykiety → Kody QR**
2. Wybierz szpulę, dla której chcesz wygenerować kod QR
3. Kod QR jest generowany automatycznie i wyświetlany w podglądzie
4. Kliknij **Pobierz PNG** lub **Drukuj**

Kod QR zawiera URL do profilu filamentu w dashboardzie. Zeskanuj telefonem, aby szybko pobrać informacje o szpuli.

### Generowanie zbiorcze

1. Kliknij **Zaznacz wszystkie** lub zaznacz poszczególne szpule
2. Kliknij **Generuj wszystkie kody QR**
3. Pobierz jako ZIP z jednym PNG na szpulę lub drukuj wszystkie naraz

## Etykiety szpul

Profesjonalne etykiety dla drukarek termicznych z pełnymi informacjami o szpuli:

### Zawartość etykiety (standardowa)

- Kolor szpuli (wypełniony blok koloru)
- Nazwa materiału (duża czcionka)
- Dostawca
- Kod hex koloru
- Zalecenia temperaturowe (dysza i stół)
- Kod QR
- Kod kreskowy (opcjonalny)

### ZPL dla drukarek termicznych

Generuj kod ZPL (Zebra Programming Language) dla drukarek Zebra, Brother i Dymo:

1. Przejdź do **Etykiety → Drukowanie termiczne**
2. Wybierz rozmiar etykiety: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Wybierz szpulę(y)
4. Kliknij **Generuj ZPL**
5. Wyślij kod ZPL do drukarki przez:
   - **Drukuj bezpośrednio** (połączenie USB)
   - **Skopiuj ZPL** i wyślij przez polecenie terminala
   - **Pobierz plik .zpl**

:::tip Konfiguracja drukarki
Dla automatycznego drukowania, skonfiguruj stację drukarki w **Ustawienia → Drukarka etykiet** z adresem IP i portem (domyślnie: 9100 dla RAW TCP).
:::

### Etykiety PDF

Dla zwykłych drukarek, generuj PDF z odpowiednimi wymiarami:

1. Wybierz rozmiar etykiety z szablonu
2. Kliknij **Generuj PDF**
3. Drukuj na papierze samoprzylepnym (Avery lub podobnym)

## Karty kolorów

Karty kolorów to zwarta siatka wizualnie pokazująca wszystkie szpule:

1. Przejdź do **Etykiety → Karty kolorów**
2. Wybierz, które szpule uwzględnić (wszystkie aktywne lub wybierz ręcznie)
3. Wybierz format karty: **A4** (4×8), **A3** (6×10), **Letter**
4. Kliknij **Generuj PDF**

Każde pole pokazuje:
- Blok koloru z rzeczywistym kolorem
- Nazwę materiału i hex koloru
- Numer materiału (dla szybkiego odniesienia)

Idealnie do laminowania i wieszania przy stacji drukarki.

## Udostępniane palety kolorów

Eksportuj wybór kolorów jako udostępnianą paletę:

1. Przejdź do **Etykiety → Palety kolorów**
2. Wybierz szpule do uwzględnienia w palecie
3. Kliknij **Udostępnij paletę**
4. Skopiuj link — inni mogą zaimportować paletę do swojego dashboardu
5. Paleta jest wyświetlana z kodami hex i można ją eksportować do **Adobe Swatch** (`.ase`) lub **Procreate** (`.swatches`)
