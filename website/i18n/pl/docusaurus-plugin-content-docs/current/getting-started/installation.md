---
sidebar_position: 1
title: Instalacja
description: Zainstaluj Bambu Dashboard na swoim serwerze lub lokalnym komputerze
---

# Instalacja

## Wymagania

| Wymaganie | Minimum | Zalecane |
|-----------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Dysk | 500 MB | 2 GB+ |
| System | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 jest wymagany
Bambu Dashboard używa `--experimental-sqlite`, które jest wbudowane w Node.js 22. Starsze wersje nie są obsługiwane.
:::

## Instalacja za pomocą install.sh (zalecana)

Najprostszym sposobem jest użycie interaktywnego skryptu instalacyjnego:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Skrypt przeprowadzi Cię przez konfigurację w przeglądarce. W przypadku instalacji terminalowej z obsługą systemd:

```bash
./install.sh --cli
```

## Instalacja ręczna

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. Zainstaluj zależności
npm install

# 3. Uruchom dashboard
npm start
```

Otwórz przeglądarkę pod adresem `https://localhost:3443` (lub `http://localhost:3000`, który przekierowuje).

:::info Samopodpisany certyfikat SSL
Przy pierwszym uruchomieniu dashboard generuje samopodpisany certyfikat SSL. Przeglądarka wyświetli ostrzeżenie — jest to normalne. Zobacz [Certyfikaty HTTPS](./setup#https-sertifikater), aby zainstalować własny certyfikat.
:::

## Docker

```bash
docker-compose up -d
```

Zobacz [Konfiguracja Docker](../advanced/docker), aby uzyskać pełną konfigurację.

## Usługa systemd

Aby uruchomić dashboard jako usługę działającą w tle:

```bash
./install.sh --cli
# Wybierz "Tak", gdy zostaniesz zapytany o usługę systemd
```

Lub ręcznie:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## Aktualizacja

Bambu Dashboard ma wbudowaną funkcję automatycznej aktualizacji przez GitHub Releases. Możesz aktualizować z dashboardu w **Ustawienia → Aktualizacja**, lub ręcznie:

```bash
git pull
npm install
npm start
```

## Odinstalowanie

```bash
./uninstall.sh
```

Skrypt usuwa usługę, konfigurację i dane (możesz wybrać, co zostanie usunięte).
