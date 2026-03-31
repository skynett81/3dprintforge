---
sidebar_position: 3
title: Perfiles de impresión
description: Crea, edita y gestiona perfiles de impresión con configuraciones preestablecidas para una impresión rápida y consistente
---

# Perfiles de impresión

Los perfiles de impresión son conjuntos guardados de configuraciones de impresión que puedes reutilizar entre impresiones e impresoras. Ahorra tiempo y asegura una calidad consistente definiendo perfiles para diferentes propósitos.

Ir a: **https://localhost:3443/#profiles**

## Crear un perfil

1. Ve a **Herramientas → Perfiles de impresión**
2. Haz clic en **Nuevo perfil** (ícono +)
3. Completa:
   - **Nombre del perfil** — nombre descriptivo, p.ej. «PLA - Producción rápida»
   - **Material** — selecciona de la lista (PLA / PETG / ABS / PA / PC / TPU / etc.)
   - **Modelo de impresora** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Todos
   - **Descripción** — texto opcional

4. Completa la configuración (ver secciones a continuación)
5. Haz clic en **Guardar perfil**

## Configuración en un perfil

### Temperatura
| Campo | Ejemplo |
|---|---|
| Temperatura de boquilla | 220 °C |
| Temperatura de cama | 60 °C |
| Temperatura de cámara (X1C) | 35 °C |

### Velocidad
| Campo | Ejemplo |
|---|---|
| Configuración de velocidad | Estándar |
| Velocidad máxima (mm/s) | 200 |
| Aceleración | 5000 mm/s² |

### Calidad
| Campo | Ejemplo |
|---|---|
| Grosor de capa | 0.2 mm |
| Porcentaje de relleno | 15 % |
| Patrón de relleno | Grid |
| Material de soporte | Auto |

### AMS y colores
| Campo | Descripción |
|---|---|
| Volumen de purga | Cantidad de enjuague al cambiar de color |
| Ranuras preferidas | Qué ranuras AMS se prefieren |

### Avanzado
| Campo | Descripción |
|---|---|
| Modo de secado | Activa el secado AMS para materiales húmedos |
| Tiempo de enfriamiento | Pausa entre capas para enfriamiento |
| Velocidad del ventilador | Velocidad del ventilador de enfriamiento en porcentaje |

## Editar un perfil

1. Haz clic en el perfil de la lista
2. Haz clic en **Editar** (ícono de lápiz)
3. Realiza los cambios
4. Haz clic en **Guardar** (sobreescribir) o **Guardar como nuevo** (crea una copia)

:::tip Control de versiones
Usa «Guardar como nuevo» para mantener un perfil funcional mientras experimentas con cambios.
:::

## Usar un perfil

### Desde la biblioteca de archivos

1. Selecciona un archivo en la biblioteca
2. Haz clic en **Enviar a impresora**
3. Selecciona el **Perfil** en el menú desplegable
4. Se aplica la configuración del perfil

### Desde la cola de impresión

1. Crea un nuevo trabajo de cola
2. Selecciona el **Perfil** en la configuración
3. El perfil se vincula al trabajo de la cola

## Importar y exportar perfiles

### Exportar
1. Selecciona uno o más perfiles
2. Haz clic en **Exportar**
3. Selecciona el formato: **JSON** (para importar en otros paneles) o **PDF** (para imprimir/documentar)

### Importar
1. Haz clic en **Importar perfiles**
2. Selecciona un archivo `.json` exportado de otro 3DPrintForge
3. Los perfiles existentes con el mismo nombre pueden sobreescribirse o mantenerse ambos

## Compartir perfiles

Comparte perfiles con otros mediante el módulo de filamentos de la comunidad (ver [Filamentos de la comunidad](../integrations/community)) o mediante exportación directa de JSON.

## Perfil predeterminado

Establece un perfil predeterminado por material:

1. Selecciona el perfil
2. Haz clic en **Establecer como predeterminado para [material]**
3. El perfil predeterminado se selecciona automáticamente cuando envías un archivo con ese material
