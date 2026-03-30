---
sidebar_position: 1
title: Installation
description: Installera Bambu Dashboard på din server eller lokala dator
---

# Installation

## Krav

| Krav | Minimum | Rekommenderat |
|------|---------|---------------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Disk | 500 MB | 2 GB+ |
| Operativsystem | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 krävs
Bambu Dashboard använder `--experimental-sqlite` som är inbyggt i Node.js 22. Äldre versioner stöds inte.
:::

## Installation med install.sh (rekommenderat)

Det enklaste sättet är att använda det interaktiva installationsskriptet:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Skriptet guidar dig genom konfigurationen i webbläsaren. För terminalbaserad installation med systemd-stöd:

```bash
./install.sh --cli
```

## Manuell installation

```bash
# 1. Klona repositoriet
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. Installera beroenden
npm install

# 3. Starta instrumentpanelen
npm start
```

Öppna webbläsaren på `https://localhost:3443` (eller `http://localhost:3000` som omdirigerar automatiskt).

:::info Självsignerat SSL-certifikat
Vid första start genererar instrumentpanelen ett självsignerat SSL-certifikat. Webbläsaren visar en varning — detta är normalt. Se [HTTPS-certifikat](./setup#https-sertifikater) för att installera ett eget certifikat.
:::

## Docker

```bash
docker-compose up -d
```

Se [Docker-konfiguration](../advanced/docker) för fullständig konfiguration.

## Systemd-tjänst

För att köra instrumentpanelen som en bakgrundstjänst:

```bash
./install.sh --cli
# Välj "Ja" när du tillfrågas om systemd-tjänst
```

Eller manuellt:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## Uppdatering

Bambu Dashboard har inbyggd automatisk uppdatering via GitHub Releases. Du kan uppdatera från instrumentpanelen under **Inställningar → Uppdatering**, eller manuellt:

```bash
git pull
npm install
npm start
```

## Avinstallation

```bash
./uninstall.sh
```

Skriptet tar bort tjänsten, konfigurationen och data (du väljer vad som raderas).
