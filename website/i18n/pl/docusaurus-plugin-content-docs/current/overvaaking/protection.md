---
sidebar_position: 1
title: Print Guard
description: Automatyczne monitorowanie z detekcją zdarzeń XCam, monitorowaniem czujników i konfigurowalnymi działaniami przy odchyleniach
---

# Print Guard

Print Guard to system monitorowania w czasie rzeczywistym Bambu Dashboard. Stale monitoruje kamerę, czujniki i dane drukarki, a gdy coś jest nie w porządku, wykonuje konfigurowalne działania.

Przejdź do: **https://localhost:3443/#protection**

## Detekcja zdarzeń XCam

Drukarki Bambu Lab wysyłają zdarzenia XCam przez MQTT, gdy kamera AI wykrywa problemy:

| Zdarzenie | Kod | Powaga |
|---|---|---|
| Wykryto spaghetti | `xcam_spaghetti` | Krytyczna |
| Odklejenie płyty | `xcam_detach` | Wysoka |
| Awaria pierwszej warstwy | `xcam_first_layer` | Wysoka |
| Stringing | `xcam_stringing` | Średnia |
| Błąd wytłaczania | `xcam_extrusion` | Wysoka |

Dla każdego typu zdarzenia możesz skonfigurować jedno lub więcej działań:

- **Powiadom** — wyślij powiadomienie przez aktywne kanały
- **Pauza** — wstrzymaj wydruk do ręcznej kontroli
- **Zatrzymaj** — natychmiast przerwij wydruk
- **Brak** — zignoruj zdarzenie (mimo to je zarejestruj)

:::danger Domyślne zachowanie
Domyślnie zdarzenia XCam są ustawione na **Powiadom** i **Pauza**. Zmień na **Zatrzymaj**, jeśli w pełni ufasz detekcji AI.
:::

## Monitorowanie czujników

Print Guard stale monitoruje dane z czujników i alarmuje przy odchyleniach:

### Odchylenia temperatury

1. Przejdź do **Print Guard → Temperatura**
2. Ustaw **Maks. odchylenie od temperatury docelowej** (zalecane: ±5°C dla dyszy, ±3°C dla stołu)
3. Wybierz **Działanie przy odchyleniu**: Powiadom / Pauza / Zatrzymaj
4. Ustaw **Opóźnienie** (sekundy) przed wykonaniem działania — daje temperaturze czas na stabilizację

### Mało filamentu

System oblicza pozostały filament na szpulach:

1. Przejdź do **Print Guard → Filament**
2. Ustaw **Minimalny próg** w gramach (np. 50 g)
3. Wybierz działanie: **Pauza i powiadom** (zalecane) do ręcznej wymiany szpuli

### Detekcja zatrzymania wydruku

Wykrywa gdy wydruk nieoczekiwanie się zatrzymał (timeout MQTT, zerwanie filamentu itp.):

1. Aktywuj **Detekcję zatrzymania**
2. Ustaw **Timeout** (zalecane: 120 sekund bez danych = zatrzymano)
3. Działanie: Zawsze powiadom — drukarka może już być zatrzymana

## Konfiguracja

### Aktywacja Print Guard

1. Przejdź do **Ustawienia → Print Guard**
2. Włącz **Aktywuj Print Guard**
3. Wybierz, które drukarki mają być monitorowane
4. Kliknij **Zapisz**

### Reguły per drukarka

Różne drukarki mogą mieć różne reguły:

1. Kliknij drukarkę w przeglądzie Print Guard
2. Wyłącz **Dziedzicz reguły globalne**
3. Skonfiguruj własne reguły dla tej drukarki

## Dziennik i historia zdarzeń

Wszystkie zdarzenia Print Guard są rejestrowane:

- Przejdź do **Print Guard → Dziennik**
- Filtruj według drukarki, typu zdarzenia, daty i powagi
- Kliknij zdarzenie, aby zobaczyć szczegółowe informacje i działania, które zostały wykonane
- Eksportuj dziennik do CSV

:::tip Fałszywe alarmy
Jeśli Print Guard wywołuje niepotrzebne pauzy, dostosuj czułość w **Print Guard → Ustawienia → Czułość**. Zacznij od „Niska" i stopniowo zwiększaj.
:::
