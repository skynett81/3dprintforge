---
sidebar_position: 1
title: Autenticación
description: Administra usuarios, roles, permisos, claves API y autenticación de dos factores con TOTP
---

# Autenticación

Bambu Dashboard admite múltiples usuarios con control de acceso basado en roles, claves API y autenticación de dos factores (2FA) opcional mediante TOTP.

Ir a: **https://localhost:3443/#settings** → **Usuarios y acceso**

## Usuarios

### Crear un usuario

1. Ve a **Configuración → Usuarios**
2. Haz clic en **Nuevo usuario**
3. Completa:
   - **Nombre de usuario** — se usa para iniciar sesión
   - **Correo electrónico**
   - **Contraseña** — se recomienda un mínimo de 12 caracteres
   - **Rol** — ver roles a continuación
4. Haz clic en **Crear**

El nuevo usuario ahora puede iniciar sesión en **https://localhost:3443/login**.

### Cambiar contraseña

1. Ve a **Perfil** (esquina superior derecha → haz clic en el nombre de usuario)
2. Haz clic en **Cambiar contraseña**
3. Ingresa la contraseña actual y la nueva contraseña
4. Haz clic en **Guardar**

Los administradores pueden restablecer la contraseña de otros desde **Configuración → Usuarios → [Usuario] → Restablecer contraseña**.

## Roles

| Rol | Descripción |
|---|---|
| **Administrador** | Acceso completo — todos los ajustes, usuarios y funciones |
| **Operador** | Controlar impresoras, ver todo, pero no cambiar la configuración del sistema |
| **Invitado** | Solo lectura — ver panel, historial y estadísticas |
| **Usuario API** | Solo acceso a API — sin interfaz web |

### Roles personalizados

1. Ve a **Configuración → Roles**
2. Haz clic en **Nuevo rol**
3. Selecciona los permisos individualmente:
   - Ver panel / historial / estadísticas
   - Controlar impresoras (pausar/detener/iniciar)
   - Administrar inventario de filamento
   - Administrar cola
   - Ver transmisión de cámara
   - Cambiar configuración
   - Administrar usuarios
4. Haz clic en **Guardar**

## Claves API

Las claves API proporcionan acceso programático sin necesidad de iniciar sesión.

### Crear una clave API

1. Ve a **Configuración → Claves API**
2. Haz clic en **Nueva clave**
3. Completa:
   - **Nombre** — nombre descriptivo (p.ej. «Home Assistant», «Script Python»)
   - **Fecha de vencimiento** — opcional, establecer por seguridad
   - **Permisos** — elige rol o permisos específicos
4. Haz clic en **Generar**
5. **Copia la clave ahora** — solo se muestra una vez

### Usar la clave API

Agrega en el encabezado HTTP para todas las llamadas a la API:
```
Authorization: Bearer TU_CLAVE_API
```

Consulta el [Área de pruebas de API](../verktoy/playground) para pruebas.

:::danger Almacenamiento seguro
Las claves API tienen el mismo acceso que el usuario al que están vinculadas. Guárdalas de forma segura y rótarlas regularmente.
:::

## TOTP 2FA

Activa la autenticación de dos factores con una aplicación de autenticación (Google Authenticator, Authy, Bitwarden, etc.):

### Activar 2FA

1. Ve a **Perfil → Seguridad → Autenticación de dos factores**
2. Haz clic en **Activar 2FA**
3. Escanea el código QR con la aplicación de autenticación
4. Ingresa el código de 6 dígitos generado para confirmar
5. Guarda los **códigos de recuperación** (10 códigos de un solo uso) en un lugar seguro
6. Haz clic en **Activar**

### Iniciar sesión con 2FA

1. Ingresa el nombre de usuario y la contraseña normalmente
2. Ingresa el código TOTP de 6 dígitos de la aplicación
3. Haz clic en **Iniciar sesión**

### Forzar 2FA para todos los usuarios

Los administradores pueden requerir 2FA para todos los usuarios:

1. Ve a **Configuración → Seguridad → Forzar 2FA**
2. Activa la configuración
3. Los usuarios sin 2FA serán obligados a configurarlo en el próximo inicio de sesión

## Gestión de sesiones

- Duración estándar de sesión: 24 horas
- Ajusta en **Configuración → Seguridad → Duración de sesión**
- Ver sesiones activas por usuario y cerrar sesiones individuales
