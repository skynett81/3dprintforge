---
sidebar_position: 1
title: Print Guard
description: Monitoreo automático con detección de eventos XCam, monitoreo de sensores y acciones configurables ante desviaciones
---

# Print Guard

Print Guard es el sistema de monitoreo en tiempo real de Bambu Dashboard. Monitorea continuamente la cámara, los sensores y los datos de la impresora, y ejecuta acciones configurables cuando algo va mal.

Ir a: **https://localhost:3443/#protection**

## Detección de eventos XCam

Las impresoras Bambu Lab envían eventos XCam vía MQTT cuando la cámara IA detecta problemas:

| Evento | Código | Gravedad |
|---|---|---|
| Espagueti detectado | `xcam_spaghetti` | Crítica |
| Despegue de placa | `xcam_detach` | Alta |
| Malformación en primera capa | `xcam_first_layer` | Alta |
| Stringing | `xcam_stringing` | Media |
| Error de extrusión | `xcam_extrusion` | Alta |

Para cada tipo de evento puedes configurar una o más acciones:

- **Alertar** — envía alerta por los canales de alerta activos
- **Pausar** — pausa la impresión para revisión manual
- **Detener** — cancela la impresión inmediatamente
- **Ninguna** — ignora el evento (pero lo registra de todos modos)

:::danger Comportamiento predeterminado
Por defecto, los eventos XCam están configurados para **Alertar** y **Pausar**. Cámbialo a **Detener** si confías completamente en la detección IA.
:::

## Monitoreo de sensores

Print Guard monitorea continuamente los datos de los sensores y activa alarmas ante desviaciones:

### Desviación de temperatura

1. Ve a **Print Guard → Temperatura**
2. Establece la **Desviación máxima de la temperatura objetivo** (recomendado: ±5 °C para boquilla, ±3 °C para cama)
3. Selecciona la **Acción ante desviación**: Alertar / Pausar / Detener
4. Establece el **Retraso** (segundos) antes de ejecutar la acción — da tiempo a que la temperatura se estabilice

### Filamento bajo

El sistema calcula el filamento restante en las bobinas:

1. Ve a **Print Guard → Filamento**
2. Establece el **Límite mínimo** en gramos (p.ej. 50 g)
3. Selecciona la acción: **Pausar y alertar** (recomendado) para cambiar la bobina manualmente

### Detección de impresión detenida

Detecta cuando la impresión se ha detenido inesperadamente (timeout MQTT, rotura de filamento, etc.):

1. Activa **Detección de parada**
2. Establece el **Tiempo de espera** (recomendado: 120 segundos sin datos = detenida)
3. Acción: Alertar siempre — la impresora puede ya haber parado

## Configuración

### Activar Print Guard

1. Ve a **Configuración → Print Guard**
2. Activa **Habilitar Print Guard**
3. Selecciona qué impresoras deben monitorearse
4. Haz clic en **Guardar**

### Reglas por impresora

Las diferentes impresoras pueden tener diferentes reglas:

1. Haz clic en una impresora en el resumen de Print Guard
2. Desactiva **Heredar reglas globales**
3. Configura reglas propias para esta impresora

## Registro e historial de eventos

Todos los eventos de Print Guard se registran:

- Ve a **Print Guard → Registro**
- Filtra por impresora, tipo de evento, fecha y nivel de gravedad
- Haz clic en un evento para ver información detallada y las acciones ejecutadas
- Exporta el registro a CSV

:::tip Falsos positivos
Si Print Guard desencadena pausas innecesarias, ajusta la sensibilidad en **Print Guard → Configuración → Sensibilidad**. Comienza con «Baja» y aumenta gradualmente.
:::
