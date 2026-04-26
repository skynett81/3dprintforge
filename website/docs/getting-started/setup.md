---
sidebar_position: 2
title: Førstegangsoppsett
description: Koble til din Bambu Lab-printer og konfigurer dashboardet
---

# Førstegangsoppsett

Når dashboardet kjører for første gang, åpnes oppsettveiviseren automatisk.

## Oppsettveiviser

Veiviseren er tilgjengelig på `https://din-server:3443/setup`. Den guider deg gjennom:

1. Opprett administrator-bruker
2. Legg til printer
3. Test tilkobling
4. Konfigurer varsler (valgfritt)

## Legge til en printer

Velg printertype i oppsettveiviseren. 3DPrintForge støtter følgende tilkoblingsmetoder:

### Bambu Lab (MQTT)

Du trenger tre ting for å koble til en Bambu Lab-printer:

| Felt | Beskrivelse | Eksempel |
|------|-------------|---------|
| IP-adresse | Printerens lokale IP | `192.168.1.100` |
| Serienummer | 15 tegn, står under printeren | `01P09C123456789` |
| Access Code | 8 tegn, finnes i printerens nettverksinnstillinger | `12345678` |

**Finn Access Code:**

- **X1C / P1S / P1P:** Innstillinger → WLAN/LAN → Access Code
- **A1 / A1 Mini:** Innstillinger → WLAN → Access Code
- **P2S / H2-serien:** Innstillinger → Nettverk → Access Code

:::warning Bambu Authorization Control System (2025)
Bambu rullet ut et nytt autorisasjons-system i 2025 som krever signerte kommandoer via Bambu Connect/Studio for cloud og mange lokale operasjoner. For å beholde full tredjeparts-kontroll må du aktivere **LAN-only Developer Mode** på printeren:

**Innstillinger → Generelt → LAN Only Mode → Developer Mode**

Sett deretter `"developerMode": true` på printeren i `config.json`:

```json
{ "printers": [{ "ip": "192.168.1.100", "developerMode": true, ... }] }
```

Uten Developer Mode kan operasjoner som start/pause/stop/kameraendring avvises av printeren. 3DPrintForge viser en banner-advarsel når auth-feil oppstår.
:::

### PrusaLink (HTTP API)

For Prusa MK4, MK4S, MK3.9, MK3.5, Mini, Mini+, XL og Core One (inkl. Core One+ og Core One L):

| Felt | Beskrivelse | Eksempel |
|------|-------------|---------|
| IP-adresse | Printerens lokale IP | `192.168.1.101` |
| Brukernavn | PrusaLink-bruker (standard `maker`) | `maker` |
| Passord | PrusaLink-passord | `abc123...` |
| API-nøkkel | Valgfritt, kun for firmware < 1.8 | `AbCdEf123456` |

:::warning PrusaLink 1.8+ krever brukernavn/passord
PrusaLink 1.8.0 (mars 2025) fjernet støtte for API-key-autentisering. Tredjepartsklienter må nå bruke HTTP Digest-auth med brukernavn og passord. API-key-feltet beholdes kun for eldre firmware.

**Finn/sett brukernavn + passord:**

1. Åpne PrusaLink i nettleseren (`http://printer-ip`)
2. Gå til **Settings → Users** (eller første-gangs-oppsett)
3. Noter brukernavn (standard `maker`) og sett et passord

Ved feil credentials viser 3DPrintForge en auth-banner i dashbordet.
:::

:::tip Core One L bed-LED
På Prusa Core One L driver printerens firmware (6.5.3+) selv bed-LED-indikatoren ut fra intern print-progresjon. Dashbordet trenger ingen egen konfigurasjon — LED-en og progress-verdien er alltid synkronisert.
:::

:::tip Prusa Connect kamera-relé (valgfritt)
3DPrintForge kan speile live kamera-snapshots til din Prusa Connect-konto så du ser printen i Prusa mobile app. Oppsett:

1. Gå til [connect.prusa3d.com](https://connect.prusa3d.com) og registrer en ny kamera på printeren → kopier den genererte **Token**.
2. Legg til denne blokken i `config.json` under den aktuelle printeren:
   ```json
   "prusaConnect": {
     "token": "<token-fra-prusaconnect>",
     "fingerprint": "3dprintforge-<printer-id>"
   }
   ```
   Fingerprint må være 16–64 tegn og kan være hva som helst stabilt (f.eks. kombinasjon av prosjekt-id + printer-id).
3. Ved neste connect begynner 3DPrintForge å pushe JPEG-snapshots via `PUT /c/snapshot`.

Prusa Connect fungerer parallelt med lokal PrusaLink — begge kan brukes samtidig.
:::

### Klipper/Moonraker (WebSocket + REST API)

For Snapmaker, Voron, Creality, Elegoo, AnkerMake, QIDI, RatRig, Sovol og alle andre Klipper-printere:

| Felt | Beskrivelse | Eksempel |
|------|-------------|---------|
| IP-adresse | Printerens lokale IP | `192.168.1.102` |
| Port | Moonraker-port (standard 7125) | `7125` |
| API-nøkkel | Moonraker `[authorization]` API-nøkkel | `abc123...` |
| JWT-token | Alternativt: Bearer-token fra `/access/login` | `eyJhbGci...` |

:::info Moonraker autentisering
Moonraker krever JWT eller API-key for klienter utenfor `trusted_clients`. 3DPrintForge foretrekker JWT-token hvis `token` er satt, ellers brukes `accessCode` (API-key). Ved WebSocket-tilkobling henter klienten et kortvarig oneshot-token fra `/access/oneshot_token` og identifiserer seg via `server.connection.identify`.
:::

:::info Snapmaker U1
Snapmaker U1 har ekstra funksjoner som NFC-filament, AI-defektdeteksjon, timelapse, luftrenser og strømmåler. Disse aktiveres automatisk når en U1 detekteres. For eldre Snapmaker-modeller (A350T, A250T) støttes også SACP-protokollen.
:::

### Generelle tips

:::tip Fast IP-adresse
Sett en fast IP-adresse på printeren i ruteren din (DHCP-reservasjon). Da slipper du å oppdatere dashboardet hver gang printeren får ny IP.
:::

:::tip Automatisk konfigurering
3DPrintForge oppdager automatisk printerens type og konfigurerer filtilgang (FTPS/HTTP), kameramodus og andre funksjoner basert på merke og modell.
:::

## AMS-konfigurasjon

Etter at printeren er koblet til, oppdateres AMS-statusen automatisk. Du kan:

- Gi hver spore et navn og farge
- Koble spoler til filamentlageret ditt
- Se filamentforbruk per spole

Gå til **Innstillinger → Printer → AMS** for manuell konfigurasjon.

## HTTPS-sertifikater {#https-sertifikater}

### Selvgenerert sertifikat (standard)

Dashboardet genererer automatisk et selvgenerert sertifikat ved oppstart. For å stole på det i nettleseren:

- **Chrome/Edge:** Klikk "Avansert" → "Fortsett til siden"
- **Firefox:** Klikk "Avansert" → "Godta risiko og fortsett"

### Eget sertifikat

Legg sertifikatfilene i mappen og konfigurer i `config.json`:

```json
{
  "ssl": {
    "cert": "/sti/til/cert.pem",
    "key": "/sti/til/key.pem"
  }
}
```

:::info Let's Encrypt
Bruker du et domenenavn? Generer gratis sertifikat med Let's Encrypt og Certbot, og pek `cert` og `key` til filene i `/etc/letsencrypt/live/ditt-domene/`.
:::

## Miljøvariabler

Alle innstillinger kan overstyres med miljøvariabler:

| Variabel | Standard | Beskrivelse |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP-port |
| `HTTPS_PORT` | `3443` | HTTPS-port |
| `NODE_ENV` | `production` | Miljø |
| `AUTH_SECRET` | (auto) | JWT-hemmelighet |

## Flerprinter-oppsett

Du kan legge til flere printere under **Innstillinger → Printere → Legg til printer**. Bruk printer-velgeren øverst i dashboardet for å bytte mellom dem.
