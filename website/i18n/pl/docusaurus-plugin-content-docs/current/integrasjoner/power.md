---
sidebar_position: 3
title: Pomiar prądu
description: Mierz faktyczne zużycie prądu na wydruk za pomocą inteligentnej wtyczki Shelly lub Tasmota i połącz z przeglądem kosztów
---

# Pomiar prądu

Podłącz inteligentną wtyczkę z pomiarem energii do drukarki, aby rejestrować faktyczne zużycie prądu na wydruk — nie tylko szacunki.

Przejdź do: **https://localhost:3443/#settings** → **Integracje → Pomiar prądu**

## Obsługiwane urządzenia

| Urządzenie | Protokół | Zalecenie |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Zalecane — łatwa konfiguracja |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Do instalacji stałej |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Nowsze modele z rozszerzonym API |
| **Urządzenia Tasmota** | MQTT | Elastyczne dla własnych konfiguracji |

:::tip Zalecane urządzenie
Shelly Plug S Plus z oprogramowaniem 1.0+ jest przetestowany i zalecany. Obsługuje Wi-Fi, MQTT i HTTP REST bez zależności od chmury.
:::

## Konfiguracja z Shelly

### Wymagania wstępne

- Wtyczka Shelly jest podłączona do tej samej sieci co Bambu Dashboard
- Shelly jest skonfigurowany ze statycznym IP lub rezerwacją DHCP

### Konfiguracja

1. Przejdź do **Ustawienia → Pomiar prądu**
2. Kliknij **Dodaj miernik prądu**
3. Wybierz **Typ**: Shelly
4. Wypełnij:
   - **Adres IP**: np. `192.168.1.150`
   - **Kanał**: 0 (dla wtyczek z pojedynczym gniazdem)
   - **Uwierzytelnianie**: nazwa użytkownika i hasło jeśli skonfigurowane
5. Kliknij **Testuj połączenie**
6. Połącz wtyczkę z **Drukarką**: wybierz z listy rozwijanej
7. Kliknij **Zapisz**

### Interwał odpytywania

Domyślny interwał odpytywania to 10 sekund. Zmniejsz do 5 dla dokładniejszych pomiarów, zwiększ do 30 dla mniejszego obciążenia sieci.

## Konfiguracja z Tasmota

1. Skonfiguruj urządzenie Tasmota z MQTT (patrz dokumentacja Tasmota)
2. W Bambu Dashboard: wybierz **Typ**: Tasmota
3. Wypełnij temat MQTT dla urządzenia: np. `tasmota/power-plug-1`
4. Połącz z drukarką i kliknij **Zapisz**

Bambu Dashboard automatycznie subskrybuje `{topic}/SENSOR` dla pomiarów mocy.

## Co jest mierzone

Gdy pomiar prądu jest aktywny, dla każdego wydruku są rejestrowane:

| Metryka | Opis |
|---|---|
| **Chwilowa moc** | Waty podczas drukowania (na żywo) |
| **Łączne zużycie energii** | kWh dla całego wydruku |
| **Średnia moc** | kWh / czas drukowania |
| **Koszt energii** | kWh × cena prądu (z Tibber/Nordpool) |

Dane są przechowywane w historii wydruków i są dostępne do analizy.

## Widok na żywo

Chwilowe zużycie mocy jest wyświetlane w:

- **Dashboardzie** — jako dodatkowy widżet (aktywuj w ustawieniach widżetów)
- **Przeglądzie floty** — jako mały wskaźnik na karcie drukarki

## Porównanie z szacunkiem

Po wydruku wyświetlane jest porównanie:

| | Szacowane | Faktyczne |
|---|---|---|
| Zużycie energii | 1,17 kWh | 1,09 kWh |
| Koszt prądu | 0,99 zł | 0,93 zł |
| Odchylenie | — | -6,8% |

Konsekwentne odchylenie może być użyte do kalibracji szacunków w [Kalkulatorze kosztów](../analyse/costestimator).

## Automatyczne wyłączanie drukarki

Shelly/Tasmota może automatycznie wyłączyć drukarkę po zakończeniu wydruku:

1. Przejdź do **Pomiar prądu → [Drukarka] → Automatyczne wyłączenie**
2. Aktywuj **Wyłącz X minut po zakończeniu wydruku**
3. Ustaw opóźnienie czasowe (np. 10 minut)

:::danger Chłodzenie
Pozwól drukarce ostygnąć przez co najmniej 5–10 minut po zakończeniu wydruku przed odcięciem prądu. Dysza powinna ostygnąć poniżej 50°C, aby uniknąć termicznego pełzania w hotendie.
:::
