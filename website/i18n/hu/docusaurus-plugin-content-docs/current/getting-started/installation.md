---
sidebar_position: 1
title: Telepítés
description: Telepítsd a 3DPrintForgeot a szerveredre vagy helyi gépedre
---

# Telepítés

## Követelmények

| Követelmény | Minimum | Ajánlott |
|-------------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Lemez | 500 MB | 2 GB+ |
| Operációs rendszer | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 szükséges
A 3DPrintForge a Node.js 22-be beépített `--experimental-sqlite` parancsot használja. A régebbi verziók nem támogatottak.
:::

## Telepítés install.sh segítségével (ajánlott)

A legegyszerűbb módszer az interaktív telepítőszkript használata:

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

A szkript a böngészőben vezet végig a beállításon. Terminál alapú telepítéshez systemd támogatással:

```bash
./install.sh --cli
```

## Manuális telepítés

```bash
# 1. Klónozd a repozitóriumot
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge

# 2. Telepítsd a függőségeket
npm install

# 3. Indítsd el a dashboardot
npm start
```

Nyisd meg a böngészőt a `https://localhost:3443` (vagy `http://localhost:3000` ami átirányít) címen.

:::info Önaláírt SSL tanúsítvány
Az első indításkor a dashboard automatikusan generál egy önaláírt SSL tanúsítványt. A böngésző figyelmeztetést fog megjeleníteni — ez normális. Lásd a [HTTPS tanúsítványok](./setup#https-tanúsítványok) részt saját tanúsítvány telepítéséhez.
:::

## Docker

```bash
docker-compose up -d
```

A teljes konfigurációért lásd a [Docker beállítás](../advanced/docker) oldalt.

## Systemd szolgáltatás

A dashboard háttérszolgáltatásként való futtatásához:

```bash
./install.sh --cli
# Válaszd az "Igen" lehetőséget, amikor a systemd szolgáltatásról kérdez
```

Vagy manuálisan:

```bash
sudo systemctl enable --now 3dprintforge
sudo systemctl status 3dprintforge
```

## Frissítés

A 3DPrintForge beépített automatikus frissítéssel rendelkezik a GitHub Releaseseken keresztül. Frissíthetsz a dashboardból a **Beállítások → Frissítés** menüponton, vagy manuálisan:

```bash
git pull
npm install
npm start
```

## Eltávolítás

```bash
./uninstall.sh
```

A szkript eltávolítja a szolgáltatást, a konfigurációt és az adatokat (te választod, mi törlődjön).
