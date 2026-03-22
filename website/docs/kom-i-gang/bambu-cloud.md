---
sidebar_position: 3
title: Bambu Cloud-integrasjon
description: Koble dashboardet til Bambu Lab Cloud for synkronisering av modeller og printhistorikk
---

# Bambu Cloud-integrasjon

Bambu Dashboard kan koble til **Bambu Lab Cloud** for å hente modellbilder, printhistorikk og filamentdata. Dashboardet fungerer helt fint uten sky-tilkobling, men cloud-integrasjonen gir ekstra fordeler.

## Fordeler med cloud-integrasjon

| Funksjon | Uten cloud | Med cloud |
|---------|-----------|----------|
| Live printerstatus | Ja | Ja |
| Printhistorikk (lokal) | Ja | Ja |
| Modellbilder fra MakerWorld | Nei | Ja |
| Filamentprofiler fra Bambu | Nei | Ja |
| Sync av printhistorikk | Nei | Ja |
| AMS-filament fra sky | Nei | Ja |

## Koble til Bambu Cloud

1. Gå til **Innstillinger → Bambu Cloud**
2. Skriv inn din Bambu Lab e-post og passord
3. Klikk **Logg inn**
4. Velg hvilke data som skal synkroniseres

:::warning Personvern
Brukernavn og passord lagres ikke i klartekst. Dashboardet bruker Bambu Labs API for å hente en OAuth-token som lagres lokalt. Dataene dine forlater aldri din server.
:::

## Synkronisering

### Modellbilder

Når cloud er koblet til, hentes modellbilder automatisk fra **MakerWorld** og vises i:
- Printhistorikk
- Dashboard (under aktiv print)
- 3D-modellviseren

### Printhistorikk

Cloud-synk importerer printhistorikk fra Bambu Lab appen. Dubletter filtreres automatisk basert på tidsstempel og serienummer.

### Filamentprofiler

Bambu Labs offisielle filamentprofiler synkroniseres og vises i filamentlageret. Du kan bruke disse som utgangspunkt for egne profiler.

## Hva fungerer uten cloud?

Alle kjernefunksjoner fungerer uten cloud-tilkobling:

- Direkte MQTT-tilkobling til printer over LAN
- Live status, temperatur, kamera
- Lokal printhistorikk og statistikk
- Filamentlager (manuelt administrert)
- Varsler og planlegger

:::tip LAN-only modus
Ønsker du å bruke dashboardet helt uten internettforbindelse? Det fungerer utmerket i et isolert nettverk — bare koble til printeren via IP og la cloud-integrasjonen stå av.
:::

## Feilsøking

**Innlogging feiler:**
- Sjekk at e-post og passord er korrekt for Bambu Lab appen
- Sjekk om kontoen bruker tofaktorautentisering (ikke støttet ennå)
- Prøv å logge ut og inn igjen

**Synkronisering stopper:**
- Token kan ha utløpt — logg ut og inn igjen under Innstillinger
- Sjekk internettforbindelsen fra serveren din
