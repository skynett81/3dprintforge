---
sidebar_position: 6
title: Meldingen
description: Configureer meldingen via Telegram, Discord, e-mail, webhook, ntfy, Pushover en SMS voor alle printergebeurtenissen
---

# Meldingen

Bambu Dashboard ondersteunt meldingen via verschillende kanalen, zodat u altijd weet wat er met uw printers gebeurt — of u nu thuis bent of onderweg.

Ga naar: **https://localhost:3443/#settings** → tabblad **Meldingen**

## Beschikbare kanalen

| Kanaal | Vereist | Ondersteunt afbeeldingen |
|---|---|---|
| Telegram | Bot-token + Chat-ID | ✅ |
| Discord | Webhook-URL | ✅ |
| E-mail | SMTP-server | ✅ |
| Webhook | URL + optionele sleutel | ✅ (base64) |
| ntfy | ntfy-server + topic | ❌ |
| Pushover | API-token + User-key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Browser push | Geen configuratie nodig | ❌ |

## Instelling per kanaal

### Telegram

1. Maak een bot aan via [@BotFather](https://t.me/BotFather) — stuur `/newbot`
2. Kopieer het **bot-token** (formaat: `123456789:ABC-def...`)
3. Start een gesprek met de bot en stuur `/start`
4. Zoek uw **Chat-ID**: ga naar `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. In Bambu Dashboard: plak het token en de Chat-ID, klik op **Test**

:::tip Groepskanaal
U kunt een Telegram-groep als ontvanger gebruiken. Chat-ID's voor groepen beginnen met `-`.
:::

### Discord

1. Open de Discord-server waarnaar u meldingen wilt sturen
2. Ga naar kanalinstellingen → **Integraties → Webhooks**
3. Klik op **Nieuwe webhook**, geef deze een naam en kies het kanaal
4. Kopieer de webhook-URL
5. Plak de URL in Bambu Dashboard en klik op **Test**

### E-mail

1. Vul SMTP-server en poort in (doorgaans 587 voor TLS)
2. Gebruikersnaam en wachtwoord voor de SMTP-account
3. **Van**-adres en **Aan**-adres(sen) (kommagescheiden voor meerdere)
4. Activeer **TLS/STARTTLS** voor beveiligde verzending
5. Klik op **Test** om een test-e-mail te sturen

:::warning Gmail
Gebruik **App-wachtwoord** voor Gmail, niet het gewone wachtwoord. Activeer eerst tweefactorauthenticatie in uw Google-account.
:::

### ntfy

1. Maak een topic aan op [ntfy.sh](https://ntfy.sh) of voer uw eigen ntfy-server uit
2. Vul de server-URL in (bijv. `https://ntfy.sh`) en de topicnaam
3. Installeer de ntfy-app op uw telefoon en abonneer op hetzelfde topic
4. Klik op **Test**

### Pushover

1. Maak een account aan op [pushover.net](https://pushover.net)
2. Maak een nieuwe applicatie aan — kopieer het **API Token**
3. Zoek uw **User Key** op het Pushover-dashboard
4. Vul beide in in Bambu Dashboard en klik op **Test**

### Webhook (aangepast)

Bambu Dashboard stuurt een HTTP POST met JSON-payload:

```json
{
  "event": "print_complete",
  "printer": "Mijn X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Voeg een **Geheime sleutel** toe om verzoeken te valideren met een HMAC-SHA256-handtekening in de header `X-Bambu-Signature`.

## Gebeurtenisfilter

Kies welke gebeurtenissen meldingen activeren per kanaal:

| Gebeurtenis | Beschrijving |
|---|---|
| Print gestart | Nieuwe afdruk begint |
| Print voltooid | Afdruk klaar (met afbeelding) |
| Print mislukt | Afdruk afgebroken met fout |
| Print gepauzeerd | Handmatige of automatische pauze |
| Print Guard gewaarschuwd | XCam of sensor heeft een actie geactiveerd |
| Filament bijna leeg | Spoel bijna op |
| AMS-fout | Blokkering, vochtig filament, enz. |
| Printer verbroken | MQTT-verbinding verloren |
| Wachtrij-taak verstuurd | Taak verzonden vanuit wachtrij |

Vink de gewenste gebeurtenissen aan voor elk kanaal afzonderlijk.

## Stille uren

Vermijd meldingen 's nachts:

1. Activeer **Stille uren** onder de meldingsinstellingen
2. Stel **Van** en **Tot** tijdstip in (bijv. 23:00 → 07:00)
3. Kies de **Tijdzone** voor de timer
4. Kritieke meldingen (Print Guard fout) kunnen worden overschreven — vink **Altijd kritieke sturen** aan

## Browser push-meldingen

Ontvang meldingen direct in de browser zonder app:

1. Ga naar **Instellingen → Meldingen → Browser Push**
2. Klik op **Push-meldingen activeren**
3. Accepteer het toestemmingsdialoogvenster van de browser
4. Meldingen werken ook als het dashboard geminimaliseerd is (vereist dat het tabblad open is)

:::info PWA
Installeer Bambu Dashboard als PWA voor push-meldingen op de achtergrond zonder open tabblad. Zie [PWA](../system/pwa).
:::
