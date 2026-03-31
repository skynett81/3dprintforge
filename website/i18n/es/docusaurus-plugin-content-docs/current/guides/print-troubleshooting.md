---
sidebar_position: 5
title: Solución de problemas de impresión fallida
description: Diagnostica y resuelve errores de impresión comunes usando los registros de errores y herramientas de 3DPrintForge
---

# Solución de problemas de impresión fallida

¿Algo salió mal? No te preocupes — la mayoría de los errores de impresión tienen soluciones simples. 3DPrintForge te ayuda a encontrar la causa rápidamente.

## Paso 1 — Verificar los códigos de error HMS

HMS (Handling, Monitoring, Sensing) es el sistema de errores de Bambu Labs. Todos los errores se registran automáticamente en el panel de control.

1. Ve a **Monitoreo → Errores**
2. Encuentra la impresión fallida
3. Haz clic en el código de error para obtener una descripción detallada y la solución sugerida

Códigos HMS comunes:

| Código | Descripción | Solución rápida |
|--------|-------------|-----------------|
| 0700 1xxx | Error de AMS (atasco, problema de motor) | Verificar la ruta del filamento en el AMS |
| 0300 0xxx | Error de extrusión (sub/sobre-extrusión) | Limpiar boquilla, verificar filamento |
| 0500 xxxx | Error de calibración | Realizar recalibración |
| 1200 xxxx | Desviación de temperatura | Verificar conexiones de cables |
| 0C00 xxxx | Error de cámara | Reiniciar impresora |

:::tip Códigos de error en el historial
En **Historial → [Impresión] → Registro HMS** puedes ver todos los códigos de error que ocurrieron durante la impresión — incluso si la impresión "completó".
:::

## Errores comunes y soluciones

### Mala adhesión (la primera capa no se adhiere)

**Síntomas:** La impresión se desprende de la placa, se enrolla, falta la primera capa

**Causas y soluciones:**

| Causa | Solución |
|-------|---------|
| Placa sucia | Limpiar con alcohol IPA |
| Temperatura de placa incorrecta | Aumentar 5°C |
| Z-offset incorrecto | Ejecutar Auto Bed Leveling de nuevo |
| Barra de pegamento faltante (PETG/ABS) | Aplicar capa fina de barra de pegamento |
| Velocidad de primera capa demasiado alta | Reducir a 20–30 mm/s en primera capa |

**Lista de verificación rápida:**
1. ¿Está la placa limpia? (IPA + paño sin pelusa)
2. ¿Estás usando la placa correcta para el tipo de filamento? (ver [Elegir la placa correcta](./choosing-plate))
3. ¿Se realizó la calibración Z después del último cambio de placa?

---

### Warping (las esquinas se levantan)

**Síntomas:** Las esquinas se doblan hacia arriba desde la placa, especialmente en modelos planos grandes

**Causas y soluciones:**

| Causa | Solución |
|-------|---------|
| Diferencia de temperatura | Cerrar la puerta frontal de la impresora |
| Falta de brim | Activar brim en Bambu Studio (3–5 mm) |
| Placa demasiado fría | Aumentar temperatura de placa 5–10°C |
| Filamento con alta contracción (ABS) | Usar Engineering Plate + cámara >40°C |

**El ABS y el ASA son especialmente susceptibles.** Siempre asegúrate de:
- Puerta frontal cerrada
- Ventilación mínima
- Engineering Plate + barra de pegamento
- Temperatura de cámara 40°C+

---

### Stringing (hilos entre partes)

**Síntomas:** Finos hilos de plástico entre partes separadas del modelo

**Causas y soluciones:**

| Causa | Solución |
|-------|---------|
| Filamento húmedo | Secar filamento 6–8 horas (60–70°C) |
| Temperatura de boquilla demasiado alta | Reducir 5°C |
| Retracción insuficiente | Aumentar la longitud de retracción en Bambu Studio |
| Velocidad de desplazamiento demasiado baja | Aumentar la velocidad de desplazamiento a 200+ mm/s |

**Prueba de humedad:** Escucha chasquidos o busca burbujas en la extrusión — indica filamento húmedo. El AMS Bambu tiene medición de humedad integrada; verifica la humedad en **Estado del AMS**.

:::tip Secador de filamento
Invierte en un secador de filamento (por ej. Bambu Filament Dryer) si trabajas con nylon o TPU — estos absorben humedad en menos de 12 horas.
:::

---

### Espagueti (la impresión colapsa en un amasijo)

**Síntomas:** El filamento cuelga en hilos sueltos en el aire, la impresión no es reconocible

**Causas y soluciones:**

| Causa | Solución |
|-------|---------|
| Mala adhesión temprana → se desprendió → colapsó | Ver la sección de adhesión arriba |
| Velocidad demasiado alta | Reducir velocidad 20–30% |
| Configuración de soporte incorrecta | Activar soportes en Bambu Studio |
| Voladizo demasiado pronunciado | Dividir el modelo o rotarlo 45° |

**Usa Print Guard para detener automáticamente los espaguetis** — ver la siguiente sección.

---

### Sub-extrusión (capas delgadas y débiles)

**Síntomas:** Las capas no son sólidas, agujeros en paredes, modelo frágil

**Causas y soluciones:**

| Causa | Solución |
|-------|---------|
| Boquilla parcialmente obstruida | Realizar Cold Pull (ver mantenimiento) |
| Filamento demasiado húmedo | Secar filamento |
| Temperatura demasiado baja | Aumentar temperatura de boquilla 5–10°C |
| Velocidad demasiado alta | Reducir 20–30% |
| Tubo PTFE dañado | Inspeccionar y cambiar el tubo PTFE |

## Usar Print Guard para protección automática

Print Guard monitorea las imágenes de la cámara con reconocimiento de imágenes y detiene la impresión automáticamente si se detectan espaguetis.

**Activar Print Guard:**
1. Ve a **Monitoreo → Print Guard**
2. Activa la **Detección automática**
3. Elige la acción: **Pausar** (recomendado) o **Cancelar**
4. Establece la sensibilidad (comienza con **Media**)

**Cuando Print Guard interviene:**
1. Recibes una notificación con una imagen de cámara de lo que se detectó
2. La impresión se pausa
3. Puedes elegir: **Continuar** (si es falso positivo) o **Cancelar impresión**

:::info Falsos positivos
Print Guard a veces puede reaccionar a modelos con muchas columnas delgadas. Reduce la sensibilidad o desactívalo temporalmente para modelos complejos.
:::

## Herramientas de diagnóstico en el panel de control

### Registro de temperaturas
En **Historial → [Impresión] → Temperaturas** puedes ver la curva de temperatura durante toda la impresión. Busca:
- Caídas repentinas de temperatura (problema de boquilla o placa)
- Temperaturas irregulares (necesidad de calibración)

### Estadísticas de filamento
Verifica si el filamento consumido coincide con la estimación. Una gran desviación puede indicar sub-extrusión o rotura de filamento.

## ¿Cuándo contactar al soporte?

Contacta al soporte de Bambu Labs si:
- El código HMS se repite después de seguir todas las soluciones sugeridas
- Ves daños mecánicos en la impresora (varillas dobladas, engranajes rotos)
- Los valores de temperatura son imposibles (por ej. la boquilla lee -40°C)
- Una actualización de firmware no resuelve el problema

**Útil tener listo para el soporte:**
- Códigos de error HMS del registro de errores del panel de control
- Imagen de cámara del error
- Qué filamento y configuraciones se usaron (se puede exportar desde el historial)
- Modelo de impresora y versión de firmware (se muestra en **Configuración → Impresora → Info**)
