---
sidebar_position: 1
title: Instalación
description: Instale Bambu Dashboard en su servidor o máquina local
---

# Instalación

## Requisitos

| Requisito | Mínimo | Recomendado |
|-----------|--------|-------------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Disco | 500 MB | 2 GB+ |
| Sistema operativo | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 es obligatorio
Bambu Dashboard utiliza `--experimental-sqlite` que está integrado en Node.js 22. Las versiones anteriores no son compatibles.
:::

## Instalación con install.sh (recomendado)

La forma más sencilla es usar el script de instalación interactivo:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

El script le guiará a través de la configuración en el navegador. Para una instalación basada en terminal con soporte systemd:

```bash
./install.sh --cli
```

## Instalación manual

```bash
# 1. Clonar el repositorio
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. Instalar dependencias
npm install

# 3. Iniciar el panel
npm start
```

Abra el navegador en `https://localhost:3443` (o `http://localhost:3000` que redirige automáticamente).

:::info Certificado SSL autofirmado
En el primer inicio, el panel genera un certificado SSL autofirmado. El navegador mostrará una advertencia — esto es normal. Consulte [Certificados HTTPS](./oppsett#https-sertifikater) para instalar su propio certificado.
:::

## Docker

```bash
docker-compose up -d
```

Consulte [Configuración de Docker](../avansert/docker) para la configuración completa.

## Servicio systemd

Para ejecutar el panel como un servicio en segundo plano:

```bash
./install.sh --cli
# Seleccione "Sí" cuando se le pregunte sobre el servicio systemd
```

O manualmente:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## Actualización

Bambu Dashboard tiene una actualización automática integrada a través de GitHub Releases. Puede actualizar desde el panel en **Configuración → Actualización**, o manualmente:

```bash
git pull
npm install
npm start
```

## Desinstalación

```bash
./uninstall.sh
```

El script elimina el servicio, la configuración y los datos (usted elige qué se elimina).
