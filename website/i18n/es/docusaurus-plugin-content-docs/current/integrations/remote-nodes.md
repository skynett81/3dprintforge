---
sidebar_position: 4
title: Servidor remoto
description: Conecta varias instancias de Bambu Dashboard para ver todas las impresoras desde un panel central
---

# Servidor remoto (Remote Nodes)

La función de servidor remoto te permite conectar varias instancias de Bambu Dashboard para ver y controlar todas las impresoras desde una interfaz central — ya sea que estén en la misma red o en ubicaciones distintas.

Ir a: **https://localhost:3443/#settings** → **Integraciones → Servidores remotos**

## Casos de uso

- **Casa + oficina** — Ver impresoras en ambas ubicaciones desde el mismo panel
- **Makerspace** — Panel central para todas las instancias de la sala
- **Instancias de invitados** — Dar acceso limitado a clientes sin acceso completo

## Arquitectura

```
Instancia primaria (tu PC)
  ├── Impresora A (MQTT local)
  ├── Impresora B (MQTT local)
  └── Servidor remoto: Instancia secundaria
        ├── Impresora C (MQTT en ubicación remota)
        └── Impresora D (MQTT en ubicación remota)
```

La instancia primaria sondea los servidores remotos mediante la REST API y agrega los datos localmente.

## Agregar un servidor remoto

### Paso 1: Generar clave API en la instancia remota

1. Inicia sesión en la instancia remota (p.ej. `https://192.168.2.50:3443`)
2. Ve a **Configuración → Claves API**
3. Haz clic en **Nueva clave** → nómbrala «Nodo primario»
4. Establece permisos: **Lectura** (mínimo) o **Lectura + Escritura** (para control remoto)
5. Copia la clave

### Paso 2: Conectar desde la instancia primaria

1. Ve a **Configuración → Servidores remotos**
2. Haz clic en **Agregar servidor remoto**
3. Completa:
   - **Nombre**: p.ej. «Oficina» o «Garaje»
   - **URL**: `https://192.168.2.50:3443` o URL externa
   - **Clave API**: la clave del paso 1
4. Haz clic en **Probar conexión**
5. Haz clic en **Guardar**

:::warning Certificado autofirmado
Si la instancia remota usa un certificado autofirmado, activa **Ignorar errores TLS** — pero hazlo solo para conexiones de red interna.
:::

## Vista agregada

Tras la conexión, las impresoras remotas aparecen en:

- **La vista de flota** — marcadas con el nombre del servidor remoto y un ícono de nube
- **Estadísticas** — agregadas en todas las instancias
- **Inventario de filamento** — resumen unificado

## Control remoto

Con el permiso **Lectura + Escritura** puedes controlar las impresoras remotas directamente:

- Pausar / Reanudar / Detener
- Agregar a la cola de impresión (el trabajo se envía a la instancia remota)
- Ver la transmisión de cámara (con proxy a través de la instancia remota)

:::info Latencia
La transmisión de cámara a través del servidor remoto puede tener un retraso notable dependiendo de la velocidad de la red y la distancia.
:::

## Control de acceso

Limita los datos que comparte el servidor remoto:

1. En la instancia remota: ve a **Configuración → Claves API → [Nombre de clave]**
2. Limita el acceso:
   - Solo impresoras específicas
   - Sin transmisión de cámara
   - Solo lectura

## Estado y monitoreo

El estado de cada servidor remoto se muestra en **Configuración → Servidores remotos**:

- **Conectado** — último sondeo exitoso
- **Desconectado** — no se puede alcanzar el servidor remoto
- **Error de autenticación** — clave API inválida o vencida
- **Última sincronización** — marca de tiempo de la última sincronización de datos exitosa
