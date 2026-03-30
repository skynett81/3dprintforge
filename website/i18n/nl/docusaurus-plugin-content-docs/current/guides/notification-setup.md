---
sidebar_position: 7
title: Meldingen instellen
description: Configureer Telegram, Discord, e-mail en pushmeldingen in Bambu Dashboard
---

# Meldingen instellen

Bambu Dashboard kan je op de hoogte stellen van alles, van voltooide prints tot kritieke fouten — via Telegram, Discord, e-mail of browser-pushmeldingen.

## Overzicht van meldingskanalen

| Kanaal | Het beste voor | Vereist |
|--------|---------------|---------|
| Telegram | Snel, overal | Telegram-account + bot-token |
| Discord | Team/community | Discord-server + webhook-URL |
| E-mail (SMTP) | Officiële meldingen | SMTP-server |
| Browser push | Desktopmeldingen | Browser met push-ondersteuning |

---

## Telegram-bot

### Stap 1 — Maak de bot aan

1. Open Telegram en zoek naar **@BotFather**
2. Stuur `/newbot`
3. Geef de bot een naam (bijv. "Bambu Meldingen")
4. Geef de bot een gebruikersnaam (bijv. `bambu_meldingen_bot`) — moet eindigen op `bot`
5. BotFather antwoordt met een **API-token**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Kopieer en bewaar dit token

### Stap 2 — Vind je Chat ID

1. Start een gesprek met je bot (zoek de gebruikersnaam op en klik **Start**)
2. Stuur een bericht naar de bot (bijv. "hoi")
3. Ga naar `https://api.telegram.org/bot<JOUW_TOKEN>/getUpdates` in de browser
4. Vind `"chat":{"id": 123456789}` — dat is jouw Chat ID

### Stap 3 — Koppel aan het dashboard

1. Ga naar **Instellingen → Meldingen → Telegram**
2. Plak het **Bot-token**
3. Plak de **Chat ID**
4. Klik **Melding testen** — je zou een testbericht in Telegram moeten ontvangen
5. Klik **Opslaan**

:::tip Groepsmelding
Wil je een hele groep melden? Voeg de bot toe aan een Telegram-groep, vind de groeps-Chat ID (negatief getal, bijv. `-100123456789`) en gebruik dat in plaats daarvan.
:::

---

## Discord-webhook

### Stap 1 — Maak een webhook aan in Discord

1. Ga naar je Discord-server
2. Klik rechts op het kanaal waar je meldingen wilt → **Kanaal bewerken**
3. Ga naar **Integraties → Webhooks**
4. Klik **Nieuwe Webhook**
5. Geef het een naam (bijv. "Bambu Dashboard")
6. Kies een avatar (optioneel)
7. Klik **Webhook URL kopiëren**

De URL ziet er zo uit:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Stap 2 — Voeg in aan het dashboard

1. Ga naar **Instellingen → Meldingen → Discord**
2. Plak de **Webhook URL**
3. Klik **Melding testen** — het Discord-kanaal zou een testbericht moeten ontvangen
4. Klik **Opslaan**

---

## E-mail (SMTP)

### Benodigde informatie

Je hebt de SMTP-instellingen van je e-mailprovider nodig:

| Provider | SMTP-server | Poort | Versleuteling |
|----------|-------------|-------|---------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Eigen domein | smtp.jouwdomein.nl | 587 | TLS |

:::warning Gmail vereist een app-wachtwoord
Gmail blokkeert inloggen met een normaal wachtwoord. Je moet een **App-wachtwoord** aanmaken onder Google-account → Beveiliging → Verificatie in twee stappen → App-wachtwoorden.
:::

### Configuratie in het dashboard

1. Ga naar **Instellingen → Meldingen → E-mail**
2. Vul in:
   - **SMTP-server**: bijv. `smtp.gmail.com`
   - **Poort**: `587`
   - **Gebruikersnaam**: je e-mailadres
   - **Wachtwoord**: app-wachtwoord of normaal wachtwoord
   - **Van-adres**: het e-mailadres waarvan de melding wordt verzonden
   - **Naar-adres**: het e-mailadres waarop je meldingen wilt ontvangen
3. Klik **E-mail testen**
4. Klik **Opslaan**

---

## Browser-pushmeldingen

Pushmeldingen verschijnen als systeemmeldingen op het bureaublad — zelfs wanneer het browsertabblad op de achtergrond staat.

**Activeren:**
1. Ga naar **Instellingen → Meldingen → Pushmeldingen**
2. Klik **Pushmeldingen activeren**
3. De browser vraagt om toestemming — klik **Toestaan**
4. Klik **Melding testen**

:::info Alleen in de browser waar je het hebt geactiveerd
Pushmeldingen zijn gekoppeld aan de specifieke browser en het apparaat. Activeer het op elk apparaat waarop je meldingen wilt ontvangen.
:::

---

## Kiezen welke gebeurtenissen meldingen activeren

Nadat je een meldingskanaal hebt ingesteld, kun je precies kiezen welke gebeurtenissen een melding triggeren:

**Onder Instellingen → Meldingen → Gebeurtenissen:**

| Gebeurtenis | Aanbevolen |
|-------------|------------|
| Print voltooid | Ja |
| Print mislukt / geannuleerd | Ja |
| Print Guard: spaghetti gedetecteerd | Ja |
| HMS-fout (kritiek) | Ja |
| HMS-waarschuwing | Optioneel |
| Filament laag niveau | Ja |
| AMS-fout | Ja |
| Printer verbroken verbinding | Optioneel |
| Onderhoudsherinnering | Optioneel |
| Nachtelijke backup voltooid | Nee (storend) |

---

## Stille uren (geen meldingen 's nachts)

Voorkom dat je wakker wordt door een voltooide print om 03:00:

1. Ga naar **Instellingen → Meldingen → Stille uren**
2. Activeer **Stille uren**
3. Stel van-tijd en tot-tijd in (bijv. **22:00 tot 07:00**)
4. Kies welke gebeurtenissen nog steeds mogen melden tijdens de stille periode:
   - **Kritieke HMS-fouten** — aanbevolen aan te houden
   - **Print Guard** — aanbevolen aan te houden
   - **Print voltooid** — kan 's nachts worden uitgeschakeld

:::tip Nachtprints zonder verstoring
Draai prints 's nachts met stille uren geactiveerd. Print Guard past op — en je ontvangt een samenvatting in de ochtend.
:::
