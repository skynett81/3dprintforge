---
sidebar_position: 2
title: Configuración inicial
description: Conecta tu impresora Bambu Lab y configura el panel
---

# Configuración inicial

La primera vez que el panel se inicia, el asistente de configuración se abre automáticamente.

## Asistente de configuración

El asistente está disponible en `https://tu-servidor:3443/setup`. Te guía a través de:

1. Crear usuario administrador
2. Agregar impresora
3. Probar la conexión
4. Configurar alertas (opcional)

## Agregar una impresora

Necesitas tres datos para conectarte a la impresora:

| Campo | Descripción | Ejemplo |
|------|-------------|---------|
| Dirección IP | IP local de la impresora | `192.168.1.100` |
| Número de serie | 15 caracteres, está bajo la impresora | `01P09C123456789` |
| Access Code | 8 caracteres, en la configuración de red de la impresora | `12345678` |

### Encontrar el Access Code en la impresora

**X1C / P1S / P1P:**
1. Ve a **Configuración** en la pantalla
2. Selecciona **WLAN** o **LAN**
3. Busca **Access Code**

**A1 / A1 Mini:**
1. Toca la pantalla y selecciona **Configuración**
2. Ve a **WLAN**
3. Busca **Access Code**

:::tip Dirección IP fija
Asigna una dirección IP fija a la impresora en tu router (reserva DHCP). Así evitas tener que actualizar el panel cada vez que la impresora recibe una nueva IP.
:::

## Configuración del AMS

Una vez que la impresora está conectada, el estado del AMS se actualiza automáticamente. Puedes:

- Asignar un nombre y color a cada ranura
- Vincular bobinas al inventario de filamento
- Ver el consumo de filamento por bobina

Ve a **Configuración → Impresora → AMS** para la configuración manual.

## Certificados HTTPS {#https-certificados}

### Certificado autogenerado (estándar)

El panel genera automáticamente un certificado autofirmado al iniciarse. Para confiar en él en el navegador:

- **Chrome/Edge:** Haz clic en "Avanzado" → "Continuar al sitio"
- **Firefox:** Haz clic en "Avanzado" → "Aceptar el riesgo y continuar"

### Certificado propio

Coloca los archivos del certificado en la carpeta y configura en `config.json`:

```json
{
  "ssl": {
    "cert": "/ruta/al/cert.pem",
    "key": "/ruta/al/key.pem"
  }
}
```

:::info Let's Encrypt
¿Usas un nombre de dominio? Genera un certificado gratuito con Let's Encrypt y Certbot, y apunta `cert` y `key` a los archivos en `/etc/letsencrypt/live/tu-dominio/`.
:::

## Variables de entorno

Todos los ajustes pueden sobreescribirse con variables de entorno:

| Variable | Valor por defecto | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto HTTP |
| `HTTPS_PORT` | `3443` | Puerto HTTPS |
| `NODE_ENV` | `production` | Entorno |
| `AUTH_SECRET` | (auto) | Secreto JWT |

## Configuración con múltiples impresoras

Puedes agregar más impresoras en **Configuración → Impresoras → Agregar impresora**. Usa el selector de impresoras en la parte superior del panel para cambiar entre ellas.
