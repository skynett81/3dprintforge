---
sidebar_position: 1
title: Home Assistant
description: Integráld a 3DPrintForgeot a Home Assistanttal MQTT felderítésen, automatizált entitásokon és automatizálási példákon keresztül
---

# Home Assistant

A Home Assistant integráció az összes Bambu Lab nyomtatót entitásként teszi elérhetővé a Home Assistantban MQTT Discovery segítségével — automatikusan, manuális YAML konfiguráció nélkül.

Navigálj ide: **https://localhost:3443/#settings** → **Integrációk → Home Assistant** fül

## Előfeltételek

- A Home Assistant fut a hálózatban
- MQTT broker (Mosquitto) telepítve és konfigurálva a Home Assistantban
- A 3DPrintForge és a Home Assistant ugyanazt az MQTT brokert használja

## MQTT Discovery aktiválása

1. Navigálj a **Beállítások → Integrációk → Home Assistant** menüpontra
2. Töltsd ki az MQTT broker beállításokat (ha még nem konfigurálva):
   - **Broker cím**: pl. `192.168.1.100`
   - **Port**: `1883` (vagy `8883` TLS-hez)
   - **Felhasználónév és jelszó**: ha a broker megköveli
3. Aktiváld az **MQTT Discovery** opciót
4. Állítsd be a **Discovery előtagot**: alapértelmezett `homeassistant`
5. Kattints a **Mentés és aktiválás** gombra

A 3DPrintForge most discovery üzeneteket tesz közzé az összes regisztrált nyomtatóhoz.

## Entitások a Home Assistantban

Az aktiválás után nyomtatónként egy új entitás jelenik meg a Home Assistantban (**Beállítások → Eszközök és szolgáltatások → MQTT**):

### Entitás azonosító minta

Az entitás azonosítók a `sensor.{printer_name_slug}_{sensor_id}` mintát követik, ahol a `printer_name_slug` a nyomtató neve kisbetűsen, speciális karakterek helyett aláhúzással. Példa: egy „Saját P1S" nevű nyomtató a `sensor.sajat_p1s_status` azonosítót kapja.

### Érzékelők (olvasható)

| Érzékelő azonosító | Egység | Példa |
|---|---|---|
| `{slug}_status` | szöveg | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | perc | `83` |
| `{slug}_layer` | szám | `124` |
| `{slug}_total_layers` | szám | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | szöveg | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | szöveg | `-65dBm` |

### Bináris érzékelők

| Érzékelő azonosító | Állapot |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Megjegyzés
A gombok (szünet/folytatás/leállítás) nem kerülnek közzétételre MQTT Discovery-n keresztül. Használd a 3DPrintForge API-t parancsok küldéséhez automatizálásokból.
:::

## Automatizálási példák

### Mobilon értesítés, ha a nyomtatás kész

Cseréld le a `sajat_p1s` részt a nyomtatód névbélyegjére.

```yaml
automation:
  - alias: "Bambu - Nyomtatás kész"
    trigger:
      - platform: state
        entity_id: binary_sensor.sajat_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.sajat_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_sajat_telefon
        data:
          title: "Nyomtatás kész!"
          message: "{{ states('sensor.sajat_p1s_current_file') }} elkészült."
```

### Fények tompítása nyomtatás közben

```yaml
automation:
  - alias: "Bambu - Fények tompítása nyomtatás alatt"
    trigger:
      - platform: state
        entity_id: binary_sensor.sajat_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.pince
        data:
          brightness_pct: 30
```

## Energiafigyelés

A Shelly vagy Tasmota fogyasztásmérés kezelése külön történik, és nem kerül közzétételre közvetlenül MQTT Discovery-n keresztül a Home Assistantba. Lásd a [Fogyasztásmérés](./power) oldalt az okos dugó beállításához.
