---
sidebar_position: 1
title: Installasjon
description: Installer Bambu Dashboard på din server eller lokale maskin
---

# Installasjon

## Krav

| Krav | Minimum | Anbefalt |
|------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Disk | 500 MB | 2 GB+ |
| OS | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 er påkrevd
Bambu Dashboard bruker `--experimental-sqlite` som er innebygd i Node.js 22. Eldre versjoner støttes ikke.
:::

## Installasjon med install.sh (anbefalt)

Den enkleste måten er å bruke den interaktive installasjonsskripten:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Skripten guider deg gjennom oppsett i nettleseren. For terminal-basert installasjon med systemd-støtte:

```bash
./install.sh --cli
```

## Manuell installasjon

```bash
# 1. Klon repositoriet
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. Installer avhengigheter
npm install

# 3. Start dashboardet
npm start
```

Åpne nettleseren på `https://localhost:3443` (eller `http://localhost:3000` som omdirigerer).

:::info Selvgenerert SSL-sertifikat
Ved første oppstart genererer dashboardet et selvgenerert SSL-sertifikat. Nettleseren vil vise en advarsel — dette er normalt. Se [HTTPS-sertifikater](./oppsett#https-sertifikater) for å installere et eget sertifikat.
:::

## Docker

```bash
docker-compose up -d
```

Se [Docker-oppsett](../avansert/docker) for full konfigurasjon.

## Systemd-tjeneste

For å kjøre dashboardet som en bakgrunnstjeneste:

```bash
./install.sh --cli
# Velg "Ja" når du blir spurt om systemd-tjeneste
```

Eller manuelt:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## Oppdatering

Bambu Dashboard har innebygd auto-oppdatering via GitHub Releases. Du kan oppdatere fra dashboardet under **Innstillinger → Oppdatering**, eller manuelt:

```bash
git pull
npm install
npm start
```

## Avinstallasjon

```bash
./uninstall.sh
```

Skripten fjerner tjeneste, konfigurasjon og data (du velger hva som slettes).
