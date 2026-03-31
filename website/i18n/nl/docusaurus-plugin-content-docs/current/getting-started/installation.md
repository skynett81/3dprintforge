---
sidebar_position: 1
title: Installatie
description: Installeer 3DPrintForge op uw server of lokale computer
---

# Installatie

## Vereisten

| Vereiste | Minimum | Aanbevolen |
|---------|---------|-----------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Schijfruimte | 500 MB | 2 GB+ |
| OS | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 is vereist
3DPrintForge gebruikt `--experimental-sqlite`, ingebouwd in Node.js 22. Oudere versies worden niet ondersteund.
:::

## Installatie met install.sh (aanbevolen)

De eenvoudigste methode is het interactieve installatiescript:

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Het script begeleidt u door de installatie in de browser. Voor een terminalgebaseerde installatie met systemd-ondersteuning:

```bash
./install.sh --cli
```

## Handmatige installatie

```bash
# 1. Kloon de repository
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge

# 2. Installeer afhankelijkheden
npm install

# 3. Start het dashboard
npm start
```

Open de browser op `https://localhost:3443` (of `http://localhost:3000` voor doorverwijzing).

:::info Zelfondertekend SSL-certificaat
Bij de eerste opstart genereert het dashboard een zelfondertekend SSL-certificaat. De browser toont een waarschuwing — dit is normaal. Zie [HTTPS-certificaten](./setup#https-sertifikater) om een eigen certificaat te installeren.
:::

## Docker

```bash
docker-compose up -d
```

Zie [Docker-configuratie](../advanced/docker) voor volledige configuratie.

## Systemd-service

Om het dashboard als achtergrondservice te draaien:

```bash
./install.sh --cli
# Kies "Ja" wanneer gevraagd om een systemd-service
```

Of handmatig:

```bash
sudo systemctl enable --now 3dprintforge
sudo systemctl status 3dprintforge
```

## Bijwerken

3DPrintForge heeft ingebouwde automatische updates via GitHub Releases. U kunt bijwerken vanuit het dashboard onder **Instellingen → Updates**, of handmatig:

```bash
git pull
npm install
npm start
```

## Verwijderen

```bash
./uninstall.sh
```

Het script verwijdert de service, configuratie en data (u kiest wat er wordt verwijderd).
