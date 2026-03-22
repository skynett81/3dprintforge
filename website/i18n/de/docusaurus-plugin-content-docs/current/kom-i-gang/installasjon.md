---
sidebar_position: 1
title: Installation
description: Installieren Sie Bambu Dashboard auf Ihrem Server oder lokalen Computer
---

# Installation

## Anforderungen

| Anforderung | Minimum | Empfohlen |
|-------------|---------|-----------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Festplatte | 500 MB | 2 GB+ |
| Betriebssystem | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 ist erforderlich
Bambu Dashboard verwendet `--experimental-sqlite`, das in Node.js 22 integriert ist. Ältere Versionen werden nicht unterstützt.
:::

## Installation mit install.sh (empfohlen)

Die einfachste Methode ist die Verwendung des interaktiven Installationsskripts:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Das Skript führt Sie durch die Einrichtung im Browser. Für eine terminalbasierte Installation mit systemd-Unterstützung:

```bash
./install.sh --cli
```

## Manuelle Installation

```bash
# 1. Repository klonen
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. Abhängigkeiten installieren
npm install

# 3. Dashboard starten
npm start
```

Öffnen Sie den Browser unter `https://localhost:3443` (oder `http://localhost:3000`, das automatisch weiterleitet).

:::info Selbst signiertes SSL-Zertifikat
Beim ersten Start generiert das Dashboard ein selbst signiertes SSL-Zertifikat. Der Browser zeigt eine Warnung an — das ist normal. Siehe [HTTPS-Zertifikate](./oppsett#https-sertifikater), um ein eigenes Zertifikat zu installieren.
:::

## Docker

```bash
docker-compose up -d
```

Siehe [Docker-Einrichtung](../avansert/docker) für die vollständige Konfiguration.

## Systemd-Dienst

So führen Sie das Dashboard als Hintergrunddienst aus:

```bash
./install.sh --cli
# Wählen Sie "Ja", wenn Sie nach dem systemd-Dienst gefragt werden
```

Oder manuell:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## Aktualisierung

Bambu Dashboard verfügt über eine integrierte Auto-Aktualisierung über GitHub Releases. Sie können das Dashboard unter **Einstellungen → Aktualisierung** aktualisieren oder manuell:

```bash
git pull
npm install
npm start
```

## Deinstallation

```bash
./uninstall.sh
```

Das Skript entfernt den Dienst, die Konfiguration und die Daten (Sie wählen, was gelöscht wird).
