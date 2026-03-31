---
sidebar_position: 1
title: Autentisering
description: Hantera användare, roller, behörigheter, API-nycklar och tvåfaktorsautentisering med TOTP
---

# Autentisering

3DPrintForge stöder flera användare med rollbaserad åtkomstkontroll, API-nycklar och valfri tvåfaktorsautentisering (2FA) via TOTP.

Gå till: **https://localhost:3443/#settings** → **Användare och åtkomst**

## Användare

### Skapa en användare

1. Gå till **Inställningar → Användare**
2. Klicka **Ny användare**
3. Fyll i:
   - **Användarnamn** — används för inloggning
   - **E-postadress**
   - **Lösenord** — minst 12 tecken rekommenderas
   - **Roll** — se roller nedan
4. Klicka **Skapa**

Den nya användaren kan nu logga in på **https://localhost:3443/login**.

### Ändra lösenord

1. Gå till **Profil** (övre högra hörnet → klicka på användarnamnet)
2. Klicka **Ändra lösenord**
3. Fyll i nuvarande lösenord och nytt lösenord
4. Klicka **Spara**

Administratörer kan återställa andras lösenord från **Inställningar → Användare → [Användare] → Återställ lösenord**.

## Roller

| Roll | Beskrivning |
|---|---|
| **Administratör** | Full åtkomst — alla inställningar, användare och funktioner |
| **Operatör** | Styra skrivare, se allt, men inte ändra systeminställningar |
| **Gäst** | Endast läsa — se dashboard, historik och statistik |
| **API-användare** | Endast API-åtkomst — inget webbgränssnitt |

### Anpassade roller

1. Gå till **Inställningar → Roller**
2. Klicka **Ny roll**
3. Välj behörigheter individuellt:
   - Visa dashboard / historik / statistik
   - Styra skrivare (pausa/stoppa/starta)
   - Hantera filamentlager
   - Hantera kö
   - Se kameraström
   - Ändra inställningar
   - Hantera användare
4. Klicka **Spara**

## API-nycklar

API-nycklar ger programmatisk åtkomst utan att logga in.

### Skapa en API-nyckel

1. Gå till **Inställningar → API-nycklar**
2. Klicka **Ny nyckel**
3. Fyll i:
   - **Namn** — beskrivande namn (t.ex. «Home Assistant», «Python-skript»)
   - **Utgångsdatum** — valfritt, ange för säkerhet
   - **Behörigheter** — välj roll eller specifika behörigheter
4. Klicka **Generera**
5. **Kopiera nyckeln nu** — den visas bara en gång

### Använda API-nyckeln

Lägg till i HTTP-header för alla API-anrop:
```
Authorization: Bearer DIN_API_NYCKEL
```

Se [API-lekplatsen](../tools/playground) för testning.

:::danger Säker förvaring
API-nycklar har samma åtkomst som användaren de är kopplade till. Förvara dem säkert och rotera dem regelbundet.
:::

## TOTP 2FA

Aktivera tvåfaktorsautentisering med en autentiseringsapp (Google Authenticator, Authy, Bitwarden, osv.):

### Aktivera 2FA

1. Gå till **Profil → Säkerhet → Tvåfaktorsautentisering**
2. Klicka **Aktivera 2FA**
3. Skanna QR-koden med autentiseringsappen
4. Skriv in den genererade 6-siffriga koden för att bekräfta
5. Spara **återställningskoderna** (10 engångskoder) på ett säkert ställe
6. Klicka **Aktivera**

### Logga in med 2FA

1. Skriv in användarnamn och lösenord som vanligt
2. Skriv in den 6-siffriga TOTP-koden från appen
3. Klicka **Logga in**

### Tvingad 2FA för alla användare

Administratörer kan kräva 2FA för alla användare:

1. Gå till **Inställningar → Säkerhet → Tvinga 2FA**
2. Aktivera inställningen
3. Användare utan 2FA tvingas att konfigurera det vid nästa inloggning

## Sessionshantering

- Standard sessionsvaraktighet: 24 timmar
- Justera under **Inställningar → Säkerhet → Sessionsvaraktighet**
- Se aktiva sessioner per användare och avsluta enskilda sessioner
