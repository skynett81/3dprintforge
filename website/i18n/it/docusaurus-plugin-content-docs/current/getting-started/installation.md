---
sidebar_position: 1
title: Installazione
description: Installa 3DPrintForge sul tuo server o computer locale
---

# Installazione

## Requisiti

| Requisito | Minimo | Consigliato |
|------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Disco | 500 MB | 2 GB+ |
| OS | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 è obbligatorio
3DPrintForge utilizza `--experimental-sqlite` integrato in Node.js 22. Le versioni precedenti non sono supportate.
:::

## Installazione con install.sh (consigliato)

Il metodo più semplice è usare lo script di installazione interattivo:

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Lo script ti guida attraverso la configurazione nel browser. Per l'installazione da terminale con supporto systemd:

```bash
./install.sh --cli
```

## Installazione manuale

```bash
# 1. Clona il repository
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge

# 2. Installa le dipendenze
npm install

# 3. Avvia il dashboard
npm start
```

Apri il browser su `https://localhost:3443` (oppure `http://localhost:3000` che reindirizza automaticamente).

:::info Certificato SSL auto-generato
Al primo avvio, il dashboard genera un certificato SSL auto-firmato. Il browser mostrerà un avviso — è normale. Vedi [Certificati HTTPS](./setup#https-sertifikater) per installare un certificato personalizzato.
:::

## Docker

```bash
docker-compose up -d
```

Vedi [Configurazione Docker](../advanced/docker) per la configurazione completa.

## Servizio systemd

Per eseguire il dashboard come servizio in background:

```bash
./install.sh --cli
# Scegli "Sì" quando viene chiesto del servizio systemd
```

Oppure manualmente:

```bash
sudo systemctl enable --now 3dprintforge
sudo systemctl status 3dprintforge
```

## Aggiornamento

3DPrintForge ha l'aggiornamento automatico integrato tramite GitHub Releases. Puoi aggiornare dal dashboard in **Impostazioni → Aggiornamento**, oppure manualmente:

```bash
git pull
npm install
npm start
```

## Disinstallazione

```bash
./uninstall.sh
```

Lo script rimuove il servizio, la configurazione e i dati (puoi scegliere cosa eliminare).
