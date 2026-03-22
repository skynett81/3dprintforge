---
sidebar_position: 2
title: Back-up
description: Back-ups van Bambu Dashboard-data aanmaken, terugzetten en automatisch plannen
---

# Back-up

Bambu Dashboard kan een back-up maken van alle configuraties, geschiedenis en data, zodat u eenvoudig kunt herstellen bij een systeemfout, servermigratie of updateproblemen.

Ga naar: **https://localhost:3443/#settings** → **Systeem → Back-up**

## Wat is inbegrepen in een back-up

| Datatype | Inbegrepen | Opmerking |
|---|---|---|
| Printerconfiguraties en -instellingen | ✅ | |
| Printgeschiedenis | ✅ | |
| Filamentopslag | ✅ | |
| Gebruikers en rollen | ✅ | Wachtwoorden worden gehasht opgeslagen |
| Instellingen | ✅ | Incl. meldingsconfiguraties |
| Onderhoudslogboek | ✅ | |
| Projecten en facturen | ✅ | |
| Bestandsbibliotheek (metadata) | ✅ | |
| Bestandsbibliotheek (bestanden) | Optioneel | Kan groot worden |
| Timelapse-video's | Optioneel | Kan zeer groot worden |
| Galerij-afbeeldingen | Optioneel | |

## Een handmatige back-up aanmaken

1. Ga naar **Instellingen → Back-up**
2. Kies wat inbegrepen moet worden (zie tabel hierboven)
3. Klik **Nu back-up aanmaken**
4. Een voortgangsindicator wordt weergegeven terwijl de back-up wordt aangemaakt
5. Klik **Downloaden** wanneer de back-up klaar is

De back-up wordt opgeslagen als een `.zip`-bestand met een tijdstempel in de bestandsnaam:
```
bambu-dashboard-backup-2026-03-22T14-30-00.zip
```

## Back-up downloaden

Back-upbestanden worden opgeslagen in de back-upmap op de server (configureerbaar). U kunt ze ook rechtstreeks downloaden:

1. Ga naar **Back-up → Bestaande back-ups**
2. Zoek de back-up in de lijst (gesorteerd op datum)
3. Klik **Downloaden** (download-icoon)

:::info Opslagmap
Standaard opslagmap: `./data/backups/`. Wijzigen via **Instellingen → Back-up → Opslagmap**.
:::

## Automatische back-up plannen

1. Activeer **Automatische back-up** via **Back-up → Planning**
2. Kies het interval:
   - **Dagelijks** — wordt uitgevoerd om 03:00 (configureerbaar)
   - **Wekelijks** — een bepaalde dag en tijd
   - **Maandelijks** — eerste dag van de maand
3. Kies **Aantal back-ups bewaren** (bijv. 7 — oudere worden automatisch verwijderd)
4. Klik **Opslaan**

:::tip Externe opslag
Voor belangrijke data: koppel een externe schijf of netwerkschijf als opslagmap voor back-ups. Dan overleven de back-ups zelfs als de systeemschijf uitvalt.
:::

## Herstellen vanuit back-up

:::warning Herstellen overschrijft bestaande data
Herstellen vervangt alle bestaande data met de inhoud van het back-upbestand. Zorg ervoor dat u eerst een recente back-up van de huidige data hebt gemaakt.
:::

### Vanuit een bestaande back-up op de server

1. Ga naar **Back-up → Bestaande back-ups**
2. Zoek de back-up in de lijst
3. Klik **Herstellen**
4. Bevestig in het dialoogvenster
5. Het systeem herstart automatisch na herstel

### Vanuit een gedownload back-upbestand

1. Klik **Back-up uploaden**
2. Selecteer het `.zip`-bestand van uw computer
3. Het bestand wordt gevalideerd — u ziet wat is inbegrepen
4. Klik **Herstellen vanuit bestand**
5. Bevestig in het dialoogvenster

## Back-upvalidatie

Bambu Dashboard valideert alle back-upbestanden vóór herstel:

- Controleert of het ZIP-formaat geldig is
- Verifieert dat het databaseschema compatibel is met de huidige versie
- Toont een waarschuwing als de back-up van een oudere versie is (migratie wordt automatisch uitgevoerd)
