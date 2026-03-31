---
sidebar_position: 3
title: Bambu Cloud-integratie
description: Verbind het dashboard met Bambu Lab Cloud voor synchronisatie van modellen en printgeschiedenis
---

# Bambu Cloud-integratie

3DPrintForge kan verbinding maken met **Bambu Lab Cloud** om modelafbeeldingen, printgeschiedenis en filamentdata op te halen. Het dashboard werkt prima zonder cloudverbinding, maar de cloud-integratie biedt extra voordelen.

## Voordelen van cloud-integratie

| Functie | Zonder cloud | Met cloud |
|---------|-------------|----------|
| Live printerstatus | Ja | Ja |
| Printgeschiedenis (lokaal) | Ja | Ja |
| Modelafbeeldingen van MakerWorld | Nee | Ja |
| Filamentprofielen van Bambu | Nee | Ja |
| Synchronisatie van printgeschiedenis | Nee | Ja |
| AMS-filament vanuit cloud | Nee | Ja |

## Verbinding maken met Bambu Cloud

1. Ga naar **Instellingen → Bambu Cloud**
2. Voer uw Bambu Lab e-mailadres en wachtwoord in
3. Klik op **Inloggen**
4. Selecteer welke data gesynchroniseerd moet worden

:::warning Privacy
Gebruikersnaam en wachtwoord worden niet in leesbare tekst opgeslagen. Het dashboard gebruikt de Bambu Lab API om een OAuth-token op te halen, dat lokaal wordt bewaard. Uw gegevens verlaten nooit uw server.
:::

## Synchronisatie

### Modelafbeeldingen

Wanneer de cloud is verbonden, worden modelafbeeldingen automatisch opgehaald van **MakerWorld** en weergegeven in:
- Printgeschiedenis
- Dashboard (bij actieve print)
- 3D-modelviewer

### Printgeschiedenis

Cloud-synchronisatie importeert de printgeschiedenis vanuit de Bambu Lab-app. Duplicaten worden automatisch gefilterd op basis van tijdstempel en serienummer.

### Filamentprofielen

De officiële filamentprofielen van Bambu Lab worden gesynchroniseerd en weergegeven in de filamentopslag. U kunt deze gebruiken als basis voor eigen profielen.

## Wat werkt zonder cloud?

Alle kernfuncties werken zonder cloudverbinding:

- Directe MQTT-verbinding met de printer via LAN
- Live status, temperatuur, camera
- Lokale printgeschiedenis en statistieken
- Filamentopslag (handmatig beheerd)
- Meldingen en planners

:::tip LAN-only modus
Wilt u het dashboard volledig zonder internetverbinding gebruiken? Het werkt uitstekend in een geïsoleerd netwerk — verbind gewoon de printer via IP en laat de cloud-integratie uitgeschakeld.
:::

## Problemen oplossen

**Inloggen mislukt:**
- Controleer of het e-mailadres en wachtwoord correct zijn voor de Bambu Lab-app
- Controleer of het account tweefactorauthenticatie gebruikt (nog niet ondersteund)
- Probeer uit te loggen en opnieuw in te loggen

**Synchronisatie stopt:**
- Het token kan verlopen zijn — log uit en opnieuw in via Instellingen
- Controleer de internetverbinding van uw server
