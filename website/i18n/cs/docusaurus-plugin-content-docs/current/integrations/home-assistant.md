---
sidebar_position: 1
title: Home Assistant
description: Integrujte Bambu Dashboard s Home Assistant přes MQTT Discovery, automatizované entity a příklady automatizací
---

# Home Assistant

Integrace s Home Assistant zpřístupňuje všechny Bambu Lab tiskárny jako zařízení v Home Assistant přes MQTT Discovery — automaticky, bez ruční konfigurace YAML.

Přejděte na: **https://localhost:3443/#settings** → záložka **Integrace → Home Assistant**

## Předpoklady

- Home Assistant spuštěný v síti
- MQTT broker (Mosquitto) nainstalovaný a nakonfigurovaný v Home Assistant
- Bambu Dashboard a Home Assistant používají stejný MQTT broker

## Aktivace MQTT Discovery

1. Přejděte na **Nastavení → Integrace → Home Assistant**
2. Vyplňte nastavení MQTT brokeru (pokud ještě není nakonfigurováno):
   - **Adresa brokeru**: např. `192.168.1.100`
   - **Port**: `1883` (nebo `8883` pro TLS)
   - **Uživatelské jméno a heslo**: pokud broker vyžaduje
3. Aktivujte **MQTT Discovery**
4. Nastavte **Předponu Discovery**: výchozí je `homeassistant`
5. Klikněte na **Uložit a aktivovat**

Bambu Dashboard nyní zveřejňuje discovery zprávy pro všechny registrované tiskárny.

## Zařízení v Home Assistant

Po aktivaci se v Home Assistant zobrazí nové zařízení pro každou tiskárnu (**Nastavení → Zařízení a služby → MQTT**):

### Vzor ID entity

ID entit se řídí vzorem `sensor.{printer_name_slug}_{sensor_id}`, kde `printer_name_slug` je název tiskárny malými písmeny se speciálními znaky nahrazenými podtržítkem. Příklad: tiskárna s názvem „Moje P1S" dá `sensor.moje_p1s_status`.

### Senzory (čtení)

| ID senzoru | Jednotka | Příklad |
|---|---|---|
| `{slug}_status` | text | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | číslo | `124` |
| `{slug}_total_layers` | číslo | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | text | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | text | `-65dBm` |

### Binární senzory

| ID senzoru | Stav |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Poznámka
Tlačítka (pauza/obnovení/zastavení) nejsou publikována přes MQTT Discovery. Pro odesílání příkazů z automatizací použijte API Bambu Dashboardu.
:::

## Příklady automatizací

### Upozornění na mobil po dokončení tisku

Nahraďte `moje_p1s` názvem slug vaší tiskárny.

```yaml
automation:
  - alias: "Bambu - Tisk dokončen"
    trigger:
      - platform: state
        entity_id: binary_sensor.moje_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.moje_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_muj_telefon
        data:
          title: "Tisk dokončen!"
          message: "{{ states('sensor.moje_p1s_current_file') }} je hotový."
```

### Ztlumení světel při spuštění tisku

```yaml
automation:
  - alias: "Bambu - Ztlumit světla během tisku"
    trigger:
      - platform: state
        entity_id: binary_sensor.moje_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.dilna
        data:
          brightness_pct: 30
```

## Monitorování energie

Měření výkonu přes Shelly nebo Tasmota je řešeno samostatně a není přímo zpřístupněno přes MQTT Discovery do Home Assistant. Viz [Měření výkonu](./power) pro nastavení chytré zásuvky.
