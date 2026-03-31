---
sidebar_position: 7
title: Configurar notificaciones
description: Configurar notificaciones de Telegram, Discord, email y push en 3DPrintForge
---

# Configurar notificaciones

3DPrintForge puede notificarte de todo — desde impresiones completadas hasta errores críticos — a través de Telegram, Discord, email o notificaciones push del navegador.

## Resumen de canales de notificación

| Canal | Ideal para | Requiere |
|-------|-----------|---------|
| Telegram | Rápido, en cualquier lugar | Cuenta Telegram + token de bot |
| Discord | Equipo/comunidad | Servidor Discord + URL de webhook |
| Email (SMTP) | Notificación oficial | Servidor SMTP |
| Push de navegador | Notificaciones de escritorio | Navegador con soporte push |

---

## Bot de Telegram

### Paso 1 — Crear el bot

1. Abre Telegram y busca **@BotFather**
2. Envía `/newbot`
3. Dale un nombre al bot (por ej. "Bambu Notificaciones")
4. Dale un nombre de usuario al bot (por ej. `bambu_notify_bot`) — debe terminar en `bot`
5. BotFather responde con un **token API**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Copia y guarda este token

### Paso 2 — Encontrar tu Chat ID

1. Inicia una conversación con tu bot (busca el nombre de usuario y haz clic en **Iniciar**)
2. Envía un mensaje al bot (por ej. "hola")
3. Ve a `https://api.telegram.org/bot<TU_TOKEN>/getUpdates` en el navegador
4. Encuentra `"chat":{"id": 123456789}` — ese es tu Chat ID

### Paso 3 — Conectar al panel de control

1. Ve a **Configuración → Notificaciones → Telegram**
2. Pega el **Token del bot**
3. Pega el **Chat ID**
4. Haz clic en **Probar notificación** — deberías recibir un mensaje de prueba en Telegram
5. Haz clic en **Guardar**

:::tip Notificación de grupo
¿Quieres notificar a todo un grupo? Agrega el bot a un grupo de Telegram, encuentra el Chat ID del grupo (número negativo, por ej. `-100123456789`) y úsalo en su lugar.
:::

---

## Webhook de Discord

### Paso 1 — Crear webhook en Discord

1. Ve a tu servidor de Discord
2. Haz clic derecho en el canal donde quieres recibir notificaciones → **Editar canal**
3. Ve a **Integraciones → Webhooks**
4. Haz clic en **Nuevo webhook**
5. Dale un nombre (por ej. "3DPrintForge")
6. Elige un avatar (opcional)
7. Haz clic en **Copiar URL del webhook**

La URL se ve así:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Paso 2 — Ingresar en el panel de control

1. Ve a **Configuración → Notificaciones → Discord**
2. Pega la **URL del webhook**
3. Haz clic en **Probar notificación** — el canal de Discord debería recibir un mensaje de prueba
4. Haz clic en **Guardar**

---

## Email (SMTP)

### Información necesaria

Necesitas la configuración SMTP de tu proveedor de email:

| Proveedor | Servidor SMTP | Puerto | Cifrado |
|-----------|--------------|--------|---------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Dominio propio | smtp.tudominio.com | 587 | TLS |

:::warning Gmail requiere contraseña de aplicación
Gmail bloquea el inicio de sesión con contraseña normal. Debes crear una **Contraseña de aplicación** en Cuenta de Google → Seguridad → Verificación en dos pasos → Contraseñas de aplicación.
:::

### Configuración en el panel de control

1. Ve a **Configuración → Notificaciones → Email**
2. Completa:
   - **Servidor SMTP**: por ej. `smtp.gmail.com`
   - **Puerto**: `587`
   - **Nombre de usuario**: tu dirección de email
   - **Contraseña**: contraseña de aplicación o contraseña normal
   - **Dirección de envío**: el email desde el que se envía la notificación
   - **Dirección de destino**: el email en el que quieres recibir notificaciones
3. Haz clic en **Probar email**
4. Haz clic en **Guardar**

---

## Notificaciones push del navegador

Las notificaciones push aparecen como notificaciones del sistema en el escritorio — incluso cuando la pestaña del navegador está en segundo plano.

**Activar:**
1. Ve a **Configuración → Notificaciones → Notificaciones push**
2. Haz clic en **Activar notificaciones push**
3. El navegador pide permiso — haz clic en **Permitir**
4. Haz clic en **Probar notificación**

:::info Solo en el navegador donde lo activaste
Las notificaciones push están vinculadas al navegador y dispositivo específicos. Actívalas en cada dispositivo en el que quieras recibir notificaciones.
:::

---

## Elegir los eventos a notificar

Después de configurar un canal de notificación, puedes elegir exactamente qué eventos activan una notificación:

**En Configuración → Notificaciones → Eventos:**

| Evento | Recomendado |
|--------|-------------|
| Impresión completada | Sí |
| Impresión fallida / cancelada | Sí |
| Print Guard: espagueti detectado | Sí |
| Error HMS (crítico) | Sí |
| Advertencia HMS | Opcional |
| Filamento en nivel bajo | Sí |
| Error del AMS | Sí |
| Impresora desconectada | Opcional |
| Recordatorio de mantenimiento | Opcional |
| Copia de seguridad nocturna completada | No (demasiado ruido) |

---

## Horas silenciosas (no notificar de noche)

Evita que te despierte una impresión completada a las 03:00:

1. Ve a **Configuración → Notificaciones → Horas silenciosas**
2. Activa las **Horas silenciosas**
3. Establece la hora de inicio y fin (por ej. **22:00 a 07:00**)
4. Elige qué eventos deben seguir notificando durante el período silencioso:
   - **Errores HMS críticos** — se recomienda mantener activo
   - **Print Guard** — se recomienda mantener activo
   - **Impresión completada** — puede desactivarse de noche

:::tip Impresión nocturna sin interrupciones
Ejecuta impresiones de noche con las horas silenciosas activadas. Print Guard vigila — y recibirás un resumen por la mañana.
:::
