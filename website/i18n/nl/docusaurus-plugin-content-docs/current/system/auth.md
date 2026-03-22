---
sidebar_position: 1
title: Authenticatie
description: Gebruikers, rollen, rechten, API-sleutels en tweefactorauthenticatie met TOTP beheren
---

# Authenticatie

Bambu Dashboard ondersteunt meerdere gebruikers met rolgebaseerde toegangscontrole, API-sleutels en optionele tweefactorauthenticatie (2FA) via TOTP.

Ga naar: **https://localhost:3443/#settings** → **Gebruikers en toegang**

## Gebruikers

### Een gebruiker aanmaken

1. Ga naar **Instellingen → Gebruikers**
2. Klik **Nieuwe gebruiker**
3. Vul in:
   - **Gebruikersnaam** — gebruikt voor inloggen
   - **E-mailadres**
   - **Wachtwoord** — minimaal 12 tekens aanbevolen
   - **Rol** — zie rollen hieronder
4. Klik **Aanmaken**

De nieuwe gebruiker kan nu inloggen op **https://localhost:3443/login**.

### Wachtwoord wijzigen

1. Ga naar **Profiel** (rechterbovenhoek → klik op de gebruikersnaam)
2. Klik **Wachtwoord wijzigen**
3. Vul het huidige wachtwoord en het nieuwe wachtwoord in
4. Klik **Opslaan**

Beheerders kunnen het wachtwoord van anderen resetten via **Instellingen → Gebruikers → [Gebruiker] → Wachtwoord resetten**.

## Rollen

| Rol | Beschrijving |
|---|---|
| **Beheerder** | Volledige toegang — alle instellingen, gebruikers en functies |
| **Operator** | Printers bedienen, alles bekijken, maar geen systeeminstellingen wijzigen |
| **Gast** | Alleen lezen — dashboard, geschiedenis en statistieken bekijken |
| **API-gebruiker** | Alleen API-toegang — geen webinterface |

### Aangepaste rollen

1. Ga naar **Instellingen → Rollen**
2. Klik **Nieuwe rol**
3. Kies rechten afzonderlijk:
   - Dashboard / geschiedenis / statistieken bekijken
   - Printers bedienen (pauzeren/stoppen/starten)
   - Filamentopslag beheren
   - Wachtrij beheren
   - Camerafeed bekijken
   - Instellingen wijzigen
   - Gebruikers beheren
4. Klik **Opslaan**

## API-sleutels

API-sleutels bieden programmatische toegang zonder in te loggen.

### Een API-sleutel aanmaken

1. Ga naar **Instellingen → API-sleutels**
2. Klik **Nieuwe sleutel**
3. Vul in:
   - **Naam** — beschrijvende naam (bijv. «Home Assistant», «Python-script»)
   - **Vervaldatum** — optioneel, stel in voor beveiliging
   - **Rechten** — kies rol of specifieke rechten
4. Klik **Genereren**
5. **Kopieer de sleutel nu** — deze wordt slechts eenmaal weergegeven

### De API-sleutel gebruiken

Voeg toe aan de HTTP-header voor alle API-aanroepen:
```
Authorization: Bearer UW_API_SLEUTEL
```

Zie [API-speeltuin](../verktoy/playground) voor testen.

:::danger Veilige opslag
API-sleutels hebben dezelfde toegang als de gebruiker waaraan ze zijn gekoppeld. Bewaar ze veilig en roteer ze regelmatig.
:::

## TOTP 2FA

Activeer tweefactorauthenticatie met een authenticator-app (Google Authenticator, Authy, Bitwarden, enz.):

### 2FA activeren

1. Ga naar **Profiel → Beveiliging → Tweefactorauthenticatie**
2. Klik **2FA activeren**
3. Scan de QR-code met de authenticator-app
4. Voer de gegenereerde 6-cijferige code in ter bevestiging
5. Sla de **herstelcodes** (10 eenmalige codes) op een veilige plek op
6. Klik **Activeren**

### Inloggen met 2FA

1. Voer gebruikersnaam en wachtwoord in zoals gewoonlijk
2. Voer de 6-cijferige TOTP-code uit de app in
3. Klik **Inloggen**

### 2FA verplicht stellen voor alle gebruikers

Beheerders kunnen 2FA vereisen voor alle gebruikers:

1. Ga naar **Instellingen → Beveiliging → 2FA verplichten**
2. Activeer de instelling
3. Gebruikers zonder 2FA worden bij de volgende aanmelding gedwongen dit in te stellen

## Sessiebeheer

- Standaard sessieduur: 24 uur
- Aanpassen via **Instellingen → Beveiliging → Sessieduur**
- Actieve sessies per gebruiker bekijken en individuele sessies beëindigen
