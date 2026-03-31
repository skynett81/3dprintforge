---
sidebar_position: 1
title: Installation
description: Installez 3DPrintForge sur votre serveur ou votre machine locale
---

# Installation

## Prérequis

| Prérequis | Minimum | Recommandé |
|-----------|---------|------------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 Mo | 1 Go+ |
| Disque | 500 Mo | 2 Go+ |
| Système d'exploitation | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 est requis
3DPrintForge utilise `--experimental-sqlite` qui est intégré à Node.js 22. Les versions antérieures ne sont pas prises en charge.
:::

## Installation avec install.sh (recommandé)

La méthode la plus simple consiste à utiliser le script d'installation interactif :

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Le script vous guide à travers la configuration dans le navigateur. Pour une installation en mode terminal avec support systemd :

```bash
./install.sh --cli
```

## Installation manuelle

```bash
# 1. Cloner le dépôt
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge

# 2. Installer les dépendances
npm install

# 3. Démarrer le tableau de bord
npm start
```

Ouvrez le navigateur à l'adresse `https://localhost:3443` (ou `http://localhost:3000` qui redirige automatiquement).

:::info Certificat SSL auto-signé
Au premier démarrage, le tableau de bord génère un certificat SSL auto-signé. Le navigateur affichera un avertissement — c'est normal. Consultez [Certificats HTTPS](./setup#https-sertifikater) pour installer votre propre certificat.
:::

## Docker

```bash
docker-compose up -d
```

Consultez [Configuration Docker](../advanced/docker) pour la configuration complète.

## Service systemd

Pour exécuter le tableau de bord en tant que service en arrière-plan :

```bash
./install.sh --cli
# Choisissez "Oui" lorsqu'on vous demande le service systemd
```

Ou manuellement :

```bash
sudo systemctl enable --now 3dprintforge
sudo systemctl status 3dprintforge
```

## Mise à jour

3DPrintForge dispose d'une mise à jour automatique intégrée via GitHub Releases. Vous pouvez mettre à jour depuis le tableau de bord sous **Paramètres → Mise à jour**, ou manuellement :

```bash
git pull
npm install
npm start
```

## Désinstallation

```bash
./uninstall.sh
```

Le script supprime le service, la configuration et les données (vous choisissez ce qui est supprimé).
