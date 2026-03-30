---
sidebar_position: 2
title: Eerste configuratie
description: Verbind uw Bambu Lab-printer en configureer het dashboard
---

# Eerste configuratie

Wanneer het dashboard voor het eerst wordt gestart, opent de installatiewizard automatisch.

## Installatiewizard

De wizard is beschikbaar op `https://uw-server:3443/setup`. Hij begeleidt u door:

1. Administrator-gebruiker aanmaken
2. Printer toevoegen
3. Verbinding testen
4. Meldingen configureren (optioneel)

## Een printer toevoegen

U heeft drie dingen nodig om verbinding te maken met de printer:

| Veld | Beschrijving | Voorbeeld |
|------|-------------|---------|
| IP-adres | Lokaal IP-adres van de printer | `192.168.1.100` |
| Serienummer | 15 tekens, staat onder de printer | `01P09C123456789` |
| Access Code | 8 tekens, te vinden in de netwerkinstellingen van de printer | `12345678` |

### De Access Code vinden op de printer

**X1C / P1S / P1P:**
1. Ga naar **Instellingen** op het scherm
2. Kies **WLAN** of **LAN**
3. Zoek naar **Access Code**

**A1 / A1 Mini:**
1. Tik op het scherm en kies **Instellingen**
2. Ga naar **WLAN**
3. Zoek naar **Access Code**

:::tip Vast IP-adres
Stel een vast IP-adres in voor de printer in uw router (DHCP-reservering). Dan hoeft u het dashboard niet bij te werken elke keer dat de printer een nieuw IP-adres krijgt.
:::

## AMS-configuratie

Nadat de printer is verbonden, wordt de AMS-status automatisch bijgewerkt. U kunt:

- Elke spoel een naam en kleur geven
- Spoelen koppelen aan uw filamentopslag
- Filamentverbruik per spoel bekijken

Ga naar **Instellingen → Printer → AMS** voor handmatige configuratie.

## HTTPS-certificaten {#https-sertifikater}

### Zelfondertekend certificaat (standaard)

Het dashboard genereert automatisch een zelfondertekend certificaat bij het opstarten. Om dit te vertrouwen in de browser:

- **Chrome/Edge:** Klik op "Geavanceerd" → "Doorgaan naar de pagina"
- **Firefox:** Klik op "Geavanceerd" → "Risico accepteren en doorgaan"

### Eigen certificaat

Plaats de certificaatbestanden in de map en configureer in `config.json`:

```json
{
  "ssl": {
    "cert": "/pad/naar/cert.pem",
    "key": "/pad/naar/key.pem"
  }
}
```

:::info Let's Encrypt
Gebruikt u een domeinnaam? Genereer een gratis certificaat met Let's Encrypt en Certbot, en wijs `cert` en `key` naar de bestanden in `/etc/letsencrypt/live/uw-domein/`.
:::

## Omgevingsvariabelen

Alle instellingen kunnen worden overschreven met omgevingsvariabelen:

| Variabele | Standaard | Beschrijving |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP-poort |
| `HTTPS_PORT` | `3443` | HTTPS-poort |
| `NODE_ENV` | `production` | Omgeving |
| `AUTH_SECRET` | (auto) | JWT-geheim |

## Meerdere printers

U kunt extra printers toevoegen via **Instellingen → Printers → Printer toevoegen**. Gebruik de printerkiezer bovenaan het dashboard om tussen printers te wisselen.
