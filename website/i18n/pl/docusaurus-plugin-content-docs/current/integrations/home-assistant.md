---
sidebar_position: 1
title: Home Assistant
description: Zintegruj 3DPrintForge z Home Assistant przez wykrywanie MQTT, automatyczne jednostki i przykłady automatyzacji
---

# Home Assistant

Integracja Home Assistant udostępnia wszystkie drukarki Bambu Lab jako urządzenia w Home Assistant przez MQTT Discovery — automatycznie, bez ręcznej konfiguracji YAML.

Przejdź do: **https://localhost:3443/#settings** → zakładka **Integracje → Home Assistant**

## Wymagania wstępne

- Home Assistant działający w sieci
- Broker MQTT (Mosquitto) zainstalowany i skonfigurowany w Home Assistant
- 3DPrintForge i Home Assistant używają tego samego brokera MQTT

## Aktywowanie MQTT Discovery

1. Przejdź do **Ustawienia → Integracje → Home Assistant**
2. Wypełnij ustawienia brokera MQTT (jeśli jeszcze nie skonfigurowane):
   - **Adres brokera**: np. `192.168.1.100`
   - **Port**: `1883` (lub `8883` dla TLS)
   - **Nazwa użytkownika i hasło**: jeśli wymagane przez brokera
3. Aktywuj **MQTT Discovery**
4. Ustaw **Prefiks discovery**: domyślnie `homeassistant`
5. Kliknij **Zapisz i aktywuj**

3DPrintForge teraz publikuje wiadomości discovery dla wszystkich zarejestrowanych drukarek.

## Urządzenia w Home Assistant

Po aktywacji nowe urządzenie na drukarkę pojawia się w Home Assistant (**Ustawienia → Urządzenia i usługi → MQTT**):

### Wzorzec ID encji

ID encji odpowiadają wzorcowi `sensor.{printer_name_slug}_{sensor_id}`, gdzie `printer_name_slug` to nazwa drukarki pisana małymi literami ze znakami specjalnymi zastąpionymi podkreślnikami. Przykład: drukarka o nazwie „Moja P1S" daje `sensor.moja_p1s_status`.

### Czujniki (odczyt)

| ID czujnika | Jednostka | Przykład |
|---|---|---|
| `{slug}_status` | tekst | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | liczba | `124` |
| `{slug}_total_layers` | liczba | `280` |
| `{slug}_nozzle_temp` | °C | `220,5` |
| `{slug}_nozzle_target` | °C | `220,0` |
| `{slug}_bed_temp` | °C | `60,1` |
| `{slug}_bed_target` | °C | `60,0` |
| `{slug}_chamber_temp` | °C | `34,2` |
| `{slug}_current_file` | tekst | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | tekst | `-65dBm` |

### Czujniki binarne

| ID czujnika | Stan |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Uwaga
Przyciski (pause/resume/stop) nie są publikowane przez MQTT Discovery. Użyj API 3DPrintForge do wysyłania poleceń z automatyzacji.
:::

## Przykłady automatyzacji

### Powiadomienie na telefon, gdy wydruk jest gotowy

Zastąp `moja_p1s` slugiem nazwy twojej drukarki.

```yaml
automation:
  - alias: "Bambu - Wydruk gotowy"
    trigger:
      - platform: state
        entity_id: binary_sensor.moja_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.moja_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_moj_telefon
        data:
          title: "Wydruk gotowy!"
          message: "{{ states('sensor.moja_p1s_current_file') }} jest gotowy."
```

### Ściemnienie świateł podczas drukowania

```yaml
automation:
  - alias: "Bambu - Ściemnij światła podczas drukowania"
    trigger:
      - platform: state
        entity_id: binary_sensor.moja_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.piwnica
        data:
          brightness_pct: 30
```

## Monitorowanie energii

Pomiar prądu przez Shelly lub Tasmota jest obsługiwany oddzielnie i nie jest bezpośrednio udostępniany przez MQTT Discovery do Home Assistant. Zobacz [Pomiar prądu](./power), aby skonfigurować inteligentną wtyczkę.
