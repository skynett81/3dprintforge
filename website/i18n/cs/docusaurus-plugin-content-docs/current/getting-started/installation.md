---
sidebar_position: 1
title: Instalace
description: Nainstalujte 3DPrintForge na váš server nebo lokální počítač
---

# Instalace

## Požadavky

| Požadavek | Minimum | Doporučeno |
|------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Disk | 500 MB | 2 GB+ |
| OS | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 je povinný
3DPrintForge používá `--experimental-sqlite`, které je zabudováno v Node.js 22. Starší verze nejsou podporovány.
:::

## Instalace pomocí install.sh (doporučeno)

Nejjednodušší způsob je použití interaktivního instalačního skriptu:

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Skript vás provede nastavením v prohlížeči. Pro instalaci přes terminál s podporou systemd:

```bash
./install.sh --cli
```

## Ruční instalace

```bash
# 1. Klonujte repozitář
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge

# 2. Nainstalujte závislosti
npm install

# 3. Spusťte dashboard
npm start
```

Otevřete prohlížeč na adrese `https://localhost:3443` (nebo `http://localhost:3000`, které přesměrovává).

:::info Vlastní podepsaný SSL certifikát
Při prvním spuštění dashboard vygeneruje vlastní podepsaný SSL certifikát. Prohlížeč zobrazí varování — to je normální. Viz [HTTPS certifikáty](./setup#https-sertifikater) pro instalaci vlastního certifikátu.
:::

## Docker

```bash
docker-compose up -d
```

Viz [Nastavení Docker](../advanced/docker) pro kompletní konfiguraci.

## Systemd služba

Pro spuštění dashboardu jako služby na pozadí:

```bash
./install.sh --cli
# Vyberte "Ano" při dotazu na systemd službu
```

Nebo ručně:

```bash
sudo systemctl enable --now 3dprintforge
sudo systemctl status 3dprintforge
```

## Aktualizace

3DPrintForge má vestavěnou automatickou aktualizaci přes GitHub Releases. Lze aktualizovat z dashboardu v části **Nastavení → Aktualizace**, nebo ručně:

```bash
git pull
npm install
npm start
```

## Odinstalace

```bash
./uninstall.sh
```

Skript odstraní službu, konfiguraci a data (vy rozhodujete, co se smaže).
