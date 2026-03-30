---
sidebar_position: 3
title: Instellingen
description: Volledig overzicht van alle instellingen in Bambu Dashboard — printer, meldingen, thema, OBS, energie, webhooks en meer
---

# Instellingen

Alle instellingen in Bambu Dashboard zijn verzameld op één pagina met duidelijke categorieën. Hier vindt u een overzicht van wat er in elke categorie te vinden is.

Ga naar: **https://localhost:3443/#settings**

## Printers

Beheer geregistreerde printers:

| Instelling | Beschrijving |
|---|---|
| Printer toevoegen | Een nieuwe printer registreren met serienummer en toegangscode |
| Printernaam | Aangepaste weergavenaam |
| Printermodel | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| MQTT-verbinding | Bambu Cloud MQTT of lokale MQTT |
| Toegangscode | LAN Access Code uit de Bambu Lab-app |
| IP-adres | Voor lokale (LAN) modus |
| Camera-instellingen | In-/uitschakelen, resolutie |

Zie [Aan de slag](../getting-started/setup) voor stap-voor-stap configuratie van de eerste printer.

## Meldingen

Zie volledige documentatie in [Meldingen](../features/notifications).

Kort overzicht:
- Meldingskanalen in-/uitschakelen (Telegram, Discord, e-mail, enz.)
- Gebeurtenisfilter per kanaal
- Stille uren (tijdsperiode zonder meldingen)
- Testknop per kanaal

## Thema

Zie volledige documentatie in [Thema](./themes).

- Licht / Donker / Auto-modus
- 6 kleurpaletten
- Aangepaste accentkleur
- Afronding en compactheid

## OBS-overlay

Configuratie voor OBS-overlay:

| Instelling | Beschrijving |
|---|---|
| Standaardthema | dark / light / minimal |
| Standaardpositie | Hoek voor overlay |
| Standaardschaal | Schaling (0.5–2.0) |
| QR-code weergeven | QR-code naar het dashboard weergeven in de overlay |

Zie [OBS-overlay](../features/obs-overlay) voor volledige URL-syntaxis en configuratie.

## Energie en stroom

| Instelling | Beschrijving |
|---|---|
| Tibber API-token | Toegang tot Tibber-spotprijzen |
| Nordpool-prijsgebied | Kies Europees prijsgebied |
| Netbeheerdertarief (€/kWh) | Uw netbeheerdertarief |
| Printerefficiëntie (W) | Stroomverbruik per printermodel configureren |

## Home Assistant

| Instelling | Beschrijving |
|---|---|
| MQTT-broker | IP, poort, gebruikersnaam, wachtwoord |
| Discovery-prefix | Standaard: `homeassistant` |
| Discovery activeren | Apparaten publiceren naar HA |

## Webhooks

Globale webhook-instellingen:

| Instelling | Beschrijving |
|---|---|
| Webhook URL | Ontvanger-URL voor gebeurtenissen |
| Geheime sleutel | HMAC-SHA256-handtekening |
| Gebeurtenisfilter | Welke gebeurtenissen worden verzonden |
| Herhaalpogingen | Aantal pogingen bij fout (standaard: 3) |
| Timeout | Seconden voordat een verzoek opgeeft (standaard: 10) |

## Wachtrij-instellingen

| Instelling | Beschrijving |
|---|---|
| Automatische verzending | In-/uitschakelen |
| Verzendstrategie | Eerste vrije / Minst gebruikt / Round-robin |
| Bevestiging vereisen | Handmatige goedkeuring vóór verzending |
| Gefaseerde start | Vertraging tussen printers in de wachtrij |

## Beveiliging

| Instelling | Beschrijving |
|---|---|
| Sessieduur | Uren/dagen voor automatisch uitloggen |
| 2FA verplichten | 2FA vereisen voor alle gebruikers |
| IP-whitelist | Toegang beperken tot specifieke IP-adressen |
| HTTPS-certificaat | Aangepast certificaat uploaden |

## Systeem

| Instelling | Beschrijving |
|---|---|
| Serverpoort | Standaard: 3443 |
| Logformaat | JSON / Tekst |
| Logniveau | Error / Warn / Info / Debug |
| Database-opruiming | Automatisch verwijderen van oude geschiedenis |
| Updates | Controleren op nieuwe versies |
