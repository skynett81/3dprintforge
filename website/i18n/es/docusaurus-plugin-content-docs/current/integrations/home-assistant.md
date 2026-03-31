---
sidebar_position: 1
title: Home Assistant
description: Integra 3DPrintForge con Home Assistant mediante MQTT Discovery, entidades de sensores y ejemplos de automatización
---

# Home Assistant

La integración con Home Assistant expone todas las impresoras Bambu Lab como dispositivos en Home Assistant mediante MQTT Discovery — automáticamente, sin configuración manual de YAML.

Ir a: **https://localhost:3443/#settings** → pestaña **Integraciones → Home Assistant**

## Requisitos previos

- Home Assistant en ejecución en la red
- Broker MQTT (Mosquitto) instalado y configurado en Home Assistant
- 3DPrintForge y Home Assistant usan el mismo broker MQTT

## Activar MQTT Discovery

1. Ve a **Configuración → Integraciones → Home Assistant**
2. Completa los ajustes del broker MQTT (si aún no están configurados):
   - **Dirección del broker**: p.ej. `192.168.1.100`
   - **Puerto**: `1883` (o `8883` para TLS)
   - **Usuario y contraseña**: si lo requiere el broker
3. Activa **MQTT Discovery**
4. Establece el **prefijo de descubrimiento**: el estándar es `homeassistant`
5. Haz clic en **Guardar y activar**

3DPrintForge ahora publica mensajes de descubrimiento para todas las impresoras registradas.

## Dispositivos en Home Assistant

Tras la activación, aparece un nuevo dispositivo por impresora en Home Assistant (**Configuración → Dispositivos y servicios → MQTT**):

### Patrón de ID de entidad

Los IDs de entidad siguen el patrón `sensor.{printer_name_slug}_{sensor_id}`, donde `printer_name_slug` es el nombre de la impresora en minúsculas con los caracteres especiales reemplazados por guion bajo. Ejemplo: una impresora con el nombre «Mi P1S» da `sensor.mi_p1s_status`.

### Sensores (lectura)

| ID de sensor | Unidad | Ejemplo |
|---|---|---|
| `{slug}_status` | texto | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | número | `124` |
| `{slug}_total_layers` | número | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | texto | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | texto | `-65dBm` |

### Sensores binarios

| ID de sensor | Estado |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Nota
Los botones (pausa/reanudar/detener) no se publican mediante MQTT Discovery. Usa la API de 3DPrintForge para enviar comandos desde automatizaciones.
:::

## Ejemplos de automatización

### Notificar en el móvil cuando la impresión termina

Reemplaza `mi_p1s` con el slug de nombre de tu impresora.

```yaml
automation:
  - alias: "Bambu - Impresión terminada"
    trigger:
      - platform: state
        entity_id: binary_sensor.mi_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.mi_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_mi_telefono
        data:
          title: "¡Impresión terminada!"
          message: "{{ states('sensor.mi_p1s_current_file') }} ha terminado."
```

### Atenuar las luces cuando comienza la impresión

```yaml
automation:
  - alias: "Bambu - Atenuar luces durante la impresión"
    trigger:
      - platform: state
        entity_id: binary_sensor.mi_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.sotano
        data:
          brightness_pct: 30
```

## Monitoreo de energía

La medición de consumo mediante Shelly o Tasmota se gestiona por separado y no se expone directamente mediante MQTT Discovery a Home Assistant. Consulta [Medición de consumo](./power) para la configuración del enchufe inteligente.
