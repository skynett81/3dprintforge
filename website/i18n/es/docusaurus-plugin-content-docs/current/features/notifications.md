---
sidebar_position: 6
title: Alertas
description: Configura alertas mediante Telegram, Discord, correo electrónico, webhook, ntfy, Pushover y SMS para todos los eventos de la impresora
---

# Alertas

3DPrintForge soporta alertas a través de múltiples canales para que siempre sepas qué está pasando con tus impresoras, ya sea en casa o fuera de ella.

Ir a: **https://localhost:3443/#settings** → pestaña **Alertas**

## Canales disponibles

| Canal | Requiere | Soporta imágenes |
|---|---|---|
| Telegram | Token de bot + Chat-ID | ✅ |
| Discord | URL de webhook | ✅ |
| Correo electrónico | Servidor SMTP | ✅ |
| Webhook | URL + clave opcional | ✅ (base64) |
| ntfy | Servidor ntfy + topic | ❌ |
| Pushover | Token API + User-key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Push de navegador | Sin configuración necesaria | ❌ |

## Configuración por canal

### Telegram

1. Crea un bot mediante [@BotFather](https://t.me/BotFather) — envía `/newbot`
2. Copia el **token del bot** (formato: `123456789:ABC-def...`)
3. Inicia una conversación con el bot y envía `/start`
4. Encuentra tu **Chat-ID**: ve a `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. En 3DPrintForge: pega el token y el Chat-ID, haz clic en **Probar**

:::tip Canal de grupo
Puedes usar un grupo de Telegram como destinatario. El Chat-ID de los grupos empieza con `-`.
:::

### Discord

1. Abre el servidor de Discord donde quieres recibir alertas
2. Ve a la configuración del canal → **Integraciones → Webhooks**
3. Haz clic en **Nuevo webhook**, dale un nombre y selecciona el canal
4. Copia la URL del webhook
5. Pega la URL en 3DPrintForge y haz clic en **Probar**

### Correo electrónico

1. Completa el servidor SMTP, puerto (generalmente 587 para TLS)
2. Nombre de usuario y contraseña de la cuenta SMTP
3. Dirección **De** y dirección(es) **Para** (separadas por comas para varias)
4. Activa **TLS/STARTTLS** para envío seguro
5. Haz clic en **Probar** para enviar un correo de prueba

:::warning Gmail
Usa una **Contraseña de aplicación** para Gmail, no la contraseña normal. Activa la autenticación de 2 factores en tu cuenta de Google primero.
:::

### ntfy

1. Crea un topic en [ntfy.sh](https://ntfy.sh) o ejecuta tu propio servidor ntfy
2. Completa la URL del servidor (p.ej. `https://ntfy.sh`) y el nombre del topic
3. Instala la app ntfy en el móvil y suscríbete al mismo topic
4. Haz clic en **Probar**

### Pushover

1. Crea una cuenta en [pushover.net](https://pushover.net)
2. Crea una nueva aplicación — copia el **Token API**
3. Encuentra tu **User Key** en el panel de Pushover
4. Completa ambos en 3DPrintForge y haz clic en **Probar**

### Webhook (personalizado)

3DPrintForge envía un HTTP POST con payload JSON:

```json
{
  "event": "print_complete",
  "printer": "Mi X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Agrega una **Clave secreta** para validar las solicitudes con firma HMAC-SHA256 en el encabezado `X-Bambu-Signature`.

## Filtro de eventos

Elige qué eventos deben desencadenar alertas por canal:

| Evento | Descripción |
|---|---|
| Impresión iniciada | Comienza una nueva impresión |
| Impresión completada | Impresión terminada (con imagen) |
| Impresión fallida | Impresión cancelada con error |
| Impresión pausada | Pausa manual o automática |
| Alerta de Print Guard | XCam o sensor desencadenó una acción |
| Filamento bajo | Bobina casi vacía |
| Error AMS | Bloqueo, filamento húmedo, etc. |
| Impresora desconectada | Conexión MQTT perdida |
| Trabajo de cola enviado | Trabajo despachado desde la cola |

Marca los eventos que deseas para cada canal individualmente.

## Modo silencioso

Evita alertas durante la noche:

1. Activa **Modo silencioso** en la configuración de alertas
2. Establece las horas **Desde** y **Hasta** (p.ej. 23:00 → 07:00)
3. Selecciona la **Zona horaria** del temporizador
4. Las alertas críticas (errores de Print Guard) pueden sobreescribirse — marca **Enviar siempre críticas**

## Push de navegador

Recibe alertas directamente en el navegador sin app:

1. Ve a **Configuración → Alertas → Push de navegador**
2. Haz clic en **Activar notificaciones push**
3. Acepta el diálogo de permisos del navegador
4. Las alertas funcionan incluso cuando el panel está minimizado (requiere que la pestaña esté abierta)

:::info PWA
Instala 3DPrintForge como PWA para recibir notificaciones push en segundo plano sin pestaña abierta. Ver [PWA](../system/pwa).
:::
