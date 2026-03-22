---
sidebar_position: 6
title: Aviseringar
description: Konfigurera aviseringar via Telegram, Discord, e-post, webhook, ntfy, Pushover och SMS för alla skrivarhändelser
---

# Aviseringar

Bambu Dashboard stödjer aviseringar via ett antal kanaler så att du alltid vet vad som händer med dina skrivare — oavsett om du är hemma eller på språng.

Gå till: **https://localhost:3443/#settings** → fliken **Aviseringar**

## Tillgängliga kanaler

| Kanal | Kräver | Stödjer bilder |
|---|---|---|
| Telegram | Bot-token + Chat-ID | ✅ |
| Discord | Webhook-URL | ✅ |
| E-post | SMTP-server | ✅ |
| Webhook | URL + valfri nyckel | ✅ (base64) |
| ntfy | ntfy-server + topic | ❌ |
| Pushover | API-token + User-key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Browser push | Ingen konfiguration behövs | ❌ |

## Inställning per kanal

### Telegram

1. Skapa en bot via [@BotFather](https://t.me/BotFather) — skicka `/newbot`
2. Kopiera **bot-token** (format: `123456789:ABC-def...`)
3. Starta ett samtal med boten och skicka `/start`
4. Hitta ditt **Chat-ID**: gå till `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. I Bambu Dashboard: klistra in token och Chat-ID, klicka **Test**

:::tip Gruppkanal
Du kan använda en Telegram-grupp som mottagare. Chat-ID för grupper börjar med `-`.
:::

### Discord

1. Öppna Discord-servern du vill skicka aviseringar till
2. Gå till kanalinställningar → **Integrationer → Webhooks**
3. Klicka **Ny webhook**, ge den ett namn och välj kanal
4. Kopiera webhook-URL
5. Klistra in URL i Bambu Dashboard och klicka **Test**

### E-post

1. Fyll i SMTP-server, port (vanligtvis 587 för TLS)
2. Användarnamn och lösenord för SMTP-kontot
3. **Från**-adress och **Till**-adress(er) (kommaseparerade för flera)
4. Aktivera **TLS/STARTTLS** för säker sändning
5. Klicka **Test** för att skicka ett test-e-postmeddelande

:::warning Gmail
Använd **App-lösenord** för Gmail, inte vanligt lösenord. Aktivera tvåfaktorsautentisering i ditt Google-konto först.
:::

### ntfy

1. Skapa ett topic på [ntfy.sh](https://ntfy.sh) eller kör din egen ntfy-server
2. Fyll i server-URL (t.ex. `https://ntfy.sh`) och topic-namn
3. Installera ntfy-appen på mobilen och prenumerera på samma topic
4. Klicka **Test**

### Pushover

1. Skapa ett konto på [pushover.net](https://pushover.net)
2. Skapa en ny applikation — kopiera **API Token**
3. Hitta din **User Key** på Pushover-dashboardet
4. Fyll i båda i Bambu Dashboard och klicka **Test**

### Webhook (anpassad)

Bambu Dashboard skickar en HTTP POST med JSON-payload:

```json
{
  "event": "print_complete",
  "printer": "Min X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Lägg till en **Hemlig nyckel** för att validera förfrågningar med HMAC-SHA256-signatur i headern `X-Bambu-Signature`.

## Händelsefilter

Välj vilka händelser som ska utlösa aviseringar per kanal:

| Händelse | Beskrivning |
|---|---|
| Utskrift startad | Ny utskrift börjar |
| Utskrift slutförd | Utskrift klar (med bild) |
| Utskrift misslyckades | Utskrift avbruten med fel |
| Utskrift pausad | Manuell eller automatisk paus |
| Print Guard aviserade | XCam eller sensor utlöste en åtgärd |
| Filament lågt | Spole nära tom |
| AMS-fel | Blockering, fuktigt filament, osv. |
| Skrivare frånkopplad | MQTT-anslutning förlorad |
| Kö-jobb skickat | Jobb dispatchar från kö |

Bocka av händelserna du vill ha för varje kanal individuellt.

## Stilla timmar

Undvik aviseringar på natten:

1. Aktivera **Stilla timmar** under aviseringsinställningarna
2. Ange **Från** och **Till** klockslag (t.ex. 23:00 → 07:00)
3. Välj **Tidszon** för timern
4. Kritiska aviseringar (Print Guard-fel) kan åsidosättas — bocka av **Skicka alltid kritiska**

## Webbläsarens push-aviseringar

Ta emot aviseringar direkt i webbläsaren utan app:

1. Gå till **Inställningar → Aviseringar → Browser Push**
2. Klicka **Aktivera push-aviseringar**
3. Godkänn behörighetsdialogen från webbläsaren
4. Aviseringar fungerar även om dashboardet är minimerat (kräver att fliken är öppen)

:::info PWA
Installera Bambu Dashboard som PWA för push-aviseringar i bakgrunden utan öppen flik. Se [PWA](../system/pwa).
:::
