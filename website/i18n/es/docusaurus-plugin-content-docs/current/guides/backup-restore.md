---
sidebar_position: 9
title: Copia de seguridad y restauración
description: Copia de seguridad automática y manual de Bambu Dashboard, restauración y migración a un nuevo servidor
---

# Copia de seguridad y restauración

Bambu Dashboard almacena todos los datos localmente — historial de impresión, stock de filamento, configuración, usuarios y más. Las copias de seguridad regulares garantizan que no pierdas nada en caso de fallo del servidor o al migrar.

## ¿Qué se incluye en una copia de seguridad?

| Datos | Incluido | Observación |
|-------|----------|-------------|
| Historial de impresión | Sí | Todos los registros y estadísticas |
| Stock de filamento | Sí | Carretes, pesos, marcas |
| Configuración | Sí | Toda la configuración del sistema |
| Configuración de impresora | Sí | Direcciones IP, códigos de acceso |
| Usuarios y roles | Sí | Contraseñas almacenadas hasheadas |
| Configuración de notificaciones | Sí | Tokens de Telegram, etc. |
| Imágenes de cámara | Opcional | Pueden ser archivos grandes |
| Videos timelapse | Opcional | Excluidos por defecto |

## Copia de seguridad automática nocturna

De forma predeterminada, se realiza una copia de seguridad automática cada noche a las 03:00.

**Ver y configurar la copia de seguridad automática:**
1. Ve a **Sistema → Copia de seguridad**
2. En **Copia de seguridad automática** verás:
   - Última copia de seguridad exitosa y hora
   - Próxima copia de seguridad programada
   - Número de copias de seguridad almacenadas (por defecto: 7 días)

**Configurar:**
- **Hora** — cambiar del predeterminado 03:00 a una hora que te convenga
- **Tiempo de retención** — número de días que se conservan las copias de seguridad (7, 14, 30 días)
- **Ubicación de almacenamiento** — carpeta local (por defecto) o ruta externa
- **Compresión** — activada por defecto (reduce el tamaño un 60–80%)

:::info Los archivos de copia de seguridad se almacenan aquí por defecto
```
/ruta/a/bambu-dashboard/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Copia de seguridad manual

Realiza una copia de seguridad en cualquier momento:

1. Ve a **Sistema → Copia de seguridad**
2. Haz clic en **Hacer copia de seguridad ahora**
3. Espera a que el estado muestre **Completado**
4. Descarga el archivo de copia de seguridad haciendo clic en **Descargar**

**Alternativa mediante terminal:**
```bash
cd /ruta/a/bambu-dashboard
node scripts/backup.js
```

El archivo de copia de seguridad se almacena en `data/backups/` con una marca de tiempo en el nombre del archivo.

## Restaurar desde una copia de seguridad

:::warning La restauración sobrescribe los datos existentes
Todos los datos existentes son reemplazados por el contenido del archivo de copia de seguridad. Asegúrate de restaurar desde el archivo correcto.
:::

### Mediante el panel de control

1. Ve a **Sistema → Copia de seguridad**
2. Haz clic en **Restaurar**
3. Selecciona un archivo de copia de seguridad de la lista o sube un archivo de copia de seguridad desde el disco
4. Haz clic en **Restaurar ahora**
5. El panel de control se reinicia automáticamente después de la restauración

### Mediante terminal

```bash
cd /ruta/a/bambu-dashboard
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Después de la restauración, reinicia el panel de control:
```bash
sudo systemctl restart bambu-dashboard
# o
npm start
```

## Exportar e importar configuración

¿Solo quieres conservar la configuración (sin todo el historial)?

**Exportar:**
1. Ve a **Sistema → Configuración → Exportar**
2. Selecciona qué incluir:
   - Configuración de impresora
   - Configuración de notificaciones
   - Cuentas de usuario
   - Marcas y perfiles de filamento
3. Haz clic en **Exportar** — descargas un archivo `.json`

**Importar:**
1. Ve a **Sistema → Configuración → Importar**
2. Sube el archivo `.json`
3. Selecciona qué partes importar
4. Haz clic en **Importar**

:::tip Útil en una nueva instalación
La configuración exportada es práctica para llevarla a un nuevo servidor. Impórtala después de la nueva instalación para no tener que configurar todo de nuevo.
:::

## Migrar a un nuevo servidor

Cómo mover Bambu Dashboard con todos los datos a una nueva máquina:

### Paso 1 — Crear copia de seguridad en el servidor antiguo

1. Ve a **Sistema → Copia de seguridad → Hacer copia de seguridad ahora**
2. Descarga el archivo de copia de seguridad
3. Copia el archivo al nuevo servidor (USB, scp, red compartida)

### Paso 2 — Instalar en el nuevo servidor

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Sigue la guía de instalación. No necesitas configurar nada — solo hacer funcionar el panel de control.

### Paso 3 — Restaurar la copia de seguridad

Cuando el panel de control funcione en el nuevo servidor:

1. Ve a **Sistema → Copia de seguridad → Restaurar**
2. Sube el archivo de copia de seguridad del servidor antiguo
3. Haz clic en **Restaurar ahora**

Todo está ahora en su lugar: historial, stock de filamento, configuración y usuarios.

### Paso 4 — Verificar la conexión

1. Ve a **Configuración → Impresoras**
2. Prueba la conexión a cada impresora
3. Comprueba que las direcciones IP siguen siendo correctas (el nuevo servidor puede tener una IP diferente)

## Consejos para una buena higiene de copias de seguridad

- **Prueba la restauración** — realiza una copia de seguridad y restáurala en una máquina de prueba al menos una vez. Las copias de seguridad no probadas no son copias de seguridad.
- **Almacena externamente** — copia regularmente el archivo de copia de seguridad en un disco externo o almacenamiento en la nube (Nextcloud, Google Drive, etc.)
- **Configura una notificación** — activa la notificación para "Copia de seguridad fallida" en **Configuración → Notificaciones → Eventos** para saber de inmediato cuando algo sale mal
