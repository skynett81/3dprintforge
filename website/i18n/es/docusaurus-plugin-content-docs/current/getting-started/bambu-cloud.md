---
sidebar_position: 3
title: Integración con Bambu Cloud
description: Conecta el panel al Bambu Lab Cloud para sincronizar modelos e historial de impresión
---

# Integración con Bambu Cloud

Bambu Dashboard puede conectarse a **Bambu Lab Cloud** para obtener imágenes de modelos, historial de impresión y datos de filamento. El panel funciona perfectamente sin conexión a la nube, pero la integración cloud ofrece ventajas adicionales.

## Ventajas de la integración cloud

| Función | Sin cloud | Con cloud |
|---------|-----------|----------|
| Estado de impresora en tiempo real | Sí | Sí |
| Historial de impresión (local) | Sí | Sí |
| Imágenes de modelos de MakerWorld | No | Sí |
| Perfiles de filamento de Bambu | No | Sí |
| Sincronización del historial | No | Sí |
| Filamento AMS desde la nube | No | Sí |

## Conectar a Bambu Cloud

1. Ve a **Configuración → Bambu Cloud**
2. Introduce tu correo electrónico y contraseña de Bambu Lab
3. Haz clic en **Iniciar sesión**
4. Selecciona qué datos sincronizar

:::warning Privacidad
El nombre de usuario y la contraseña no se almacenan en texto plano. El panel utiliza la API de Bambu Labs para obtener un token OAuth que se guarda localmente. Tus datos nunca salen de tu servidor.
:::

## Sincronización

### Imágenes de modelos

Cuando la nube está conectada, las imágenes de modelos se obtienen automáticamente de **MakerWorld** y se muestran en:
- Historial de impresión
- Panel principal (durante una impresión activa)
- Visor de modelos 3D

### Historial de impresión

La sincronización cloud importa el historial de impresión desde la app de Bambu Lab. Los duplicados se filtran automáticamente según la marca de tiempo y el número de serie.

### Perfiles de filamento

Los perfiles oficiales de filamento de Bambu Labs se sincronizan y aparecen en el inventario de filamento. Puedes usarlos como punto de partida para tus propios perfiles.

## ¿Qué funciona sin cloud?

Todas las funciones principales funcionan sin conexión a la nube:

- Conexión MQTT directa a la impresora por LAN
- Estado en tiempo real, temperatura, cámara
- Historial e estadísticas de impresión locales
- Inventario de filamento (administrado manualmente)
- Alertas y planificador

:::tip Modo solo LAN
¿Quieres usar el panel completamente sin conexión a internet? Funciona perfectamente en una red aislada: simplemente conecta a la impresora por IP y deja la integración cloud desactivada.
:::

## Solución de problemas

**El inicio de sesión falla:**
- Verifica que el correo y la contraseña sean correctos para la app de Bambu Lab
- Comprueba si la cuenta usa autenticación de dos factores (aún no soportada)
- Intenta cerrar sesión y volver a iniciarla

**La sincronización se detiene:**
- El token puede haber expirado: cierra sesión y vuelve a iniciarla en Configuración
- Verifica la conexión a internet desde tu servidor
