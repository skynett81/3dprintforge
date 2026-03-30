---
sidebar_position: 7
title: Ställa in aviseringar
description: Konfigurera Telegram-, Discord-, e-post- och push-aviseringar i Bambu Dashboard
---

# Ställa in aviseringar

Bambu Dashboard kan avisera dig om allt från slutförda utskrifter till kritiska fel — via Telegram, Discord, e-post eller webbläsar-push-aviseringar.

## Översikt över aviseringskanaler

| Kanal | Bäst för | Kräver |
|-------|---------|--------|
| Telegram | Snabbt, var som helst | Telegram-konto + bot-token |
| Discord | Team/community | Discord-server + webhook-URL |
| E-post (SMTP) | Officiell avisering | SMTP-server |
| Webbläsar-push | Skrivbordsaviseringar | Webbläsare med push-stöd |

---

## Telegram-bot

### Steg 1 — Skapa boten

1. Öppna Telegram och sök efter **@BotFather**
2. Skicka `/newbot`
3. Ge boten ett namn (t.ex. "Bambu Aviseringar")
4. Ge boten ett användarnamn (t.ex. `bambu_aviseringar_bot`) — måste sluta på `bot`
5. BotFather svarar med en **API-token**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Kopiera och spara denna token

### Steg 2 — Hitta ditt Chat ID

1. Starta ett samtal med din bot (sök upp användarnamnet och klicka på **Start**)
2. Skicka ett meddelande till boten (t.ex. "hej")
3. Gå till `https://api.telegram.org/bot<DIN_TOKEN>/getUpdates` i webbläsaren
4. Hitta `"chat":{"id": 123456789}` — det är ditt Chat ID

### Steg 3 — Anslut till instrumentpanelen

1. Gå till **Inställningar → Aviseringar → Telegram**
2. Klistra in **Bot-token**
3. Klistra in **Chat ID**
4. Klicka på **Testa avisering** — du ska ta emot ett testmeddelande i Telegram
5. Klicka på **Spara**

:::tip Gruppavisering
Vill du avisera en hel grupp? Lägg till boten i en Telegram-grupp, hitta grupp-Chat ID (negativt tal, t.ex. `-100123456789`) och använd det istället.
:::

---

## Discord-webhook

### Steg 1 — Skapa webhook i Discord

1. Gå till din Discord-server
2. Högerklicka på kanalen du vill ha aviseringar i → **Redigera kanal**
3. Gå till **Integrationer → Webhooks**
4. Klicka på **Ny Webhook**
5. Ge den ett namn (t.ex. "Bambu Dashboard")
6. Välj en avatar (valfritt)
7. Klicka på **Kopiera Webhook URL**

URL:en ser ut så här:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Steg 2 — Lägg in i instrumentpanelen

1. Gå till **Inställningar → Aviseringar → Discord**
2. Klistra in **Webhook URL**
3. Klicka på **Testa avisering** — Discord-kanalen ska ta emot ett testmeddelande
4. Klicka på **Spara**

---

## E-post (SMTP)

### Nödvändig information

Du behöver SMTP-inställningarna från din e-postleverantör:

| Leverantör | SMTP-server | Port | Kryptering |
|------------|------------|------|------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Eget domän | smtp.dittdomän.se | 587 | TLS |

:::warning Gmail kräver applösenord
Gmail blockerar inloggning med vanligt lösenord. Du måste skapa ett **Applösenord** under Google-konto → Säkerhet → Tvåstegsverifiering → Applösenord.
:::

### Konfiguration i instrumentpanelen

1. Gå till **Inställningar → Aviseringar → E-post**
2. Fyll i:
   - **SMTP-server**: t.ex. `smtp.gmail.com`
   - **Port**: `587`
   - **Användarnamn**: din e-postadress
   - **Lösenord**: applösenord eller vanligt lösenord
   - **Från-adress**: e-posten aviseringen skickas från
   - **Till-adress**: e-posten du vill ta emot aviseringarna
3. Klicka på **Testa e-post**
4. Klicka på **Spara**

---

## Webbläsar-push-aviseringar

Push-aviseringar dyker upp som systemaviseringar på skrivbordet — även när webbläsarfliken är i bakgrunden.

**Aktivera:**
1. Gå till **Inställningar → Aviseringar → Push-aviseringar**
2. Klicka på **Aktivera push-aviseringar**
3. Webbläsaren frågar om tillåtelse — klicka på **Tillåt**
4. Klicka på **Testa avisering**

:::info Bara i webbläsaren där du aktiverade det
Push-aviseringar är kopplade till den specifika webbläsaren och enheten. Aktivera det på varje enhet du vill ha aviseringar på.
:::

---

## Välja händelser att avisera om

Efter att du har ställt in en aviseringskanal kan du välja exakt vilka händelser som utlöser avisering:

**Under Inställningar → Aviseringar → Händelser:**

| Händelse | Rekommenderat |
|----------|--------------|
| Utskrift slutförd | Ja |
| Utskrift misslyckades / avbröts | Ja |
| Print Guard: spaghetti identifierat | Ja |
| HMS-fel (kritiskt) | Ja |
| HMS-varning | Valfritt |
| Filament låg nivå | Ja |
| AMS-fel | Ja |
| Skrivare frånkopplad | Valfritt |
| Underhållspåminnelse | Valfritt |
| Nattlig säkerhetskopiering slutförd | Nej (för mycket brus) |

---

## Tystlägestider (avisera inte på natten)

Undvik att bli väckt av en slutförd utskrift klockan 03:00:

1. Gå till **Inställningar → Aviseringar → Tystlägestider**
2. Aktivera **Tystlägestider**
3. Ange från-tid och till-tid (t.ex. **22:00 till 07:00**)
4. Välj vilka händelser som fortfarande ska avisera under tystlägesperioden:
   - **Kritiska HMS-fel** — rekommenderas att behålla på
   - **Print Guard** — rekommenderas att behålla på
   - **Utskrift slutförd** — kan stängas av på natten

:::tip Nattutskrift utan störning
Kör utskrifter på natten med tystlägestider aktiverade. Print Guard passar på — och du får en sammanfattning på morgonen.
:::
