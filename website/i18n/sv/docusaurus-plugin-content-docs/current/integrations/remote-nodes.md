---
sidebar_position: 4
title: Fjärrserver
description: Koppla samman flera Bambu Dashboard-instanser för att se alla skrivare från ett centralt dashboard
---

# Fjärrserver (Remote Nodes)

Fjärrserverfunktionen låter dig koppla samman flera Bambu Dashboard-instanser så att du kan se och styra alla skrivare från ett centralt gränssnitt — oavsett om de befinner sig i samma nätverk eller på olika platser.

Gå till: **https://localhost:3443/#settings** → **Integrationer → Fjärrservrar**

## Användningsscenarier

- **Hemma + kontor** — Se skrivare på båda platserna från samma dashboard
- **Makerspace** — Centralt dashboard för alla instanser i rummet
- **Gästinstanser** — Ge begränsad insyn till kunder utan full åtkomst

## Arkitektur

```
Primär instans (din PC)
  ├── Skrivare A (lokal MQTT)
  ├── Skrivare B (lokal MQTT)
  └── Fjärrserver: Sekundär instans
        ├── Skrivare C (MQTT på fjärrplats)
        └── Skrivare D (MQTT på fjärrplats)
```

Den primära instansen hämtar data från fjärrservrarna via REST API och aggregerar data lokalt.

## Lägga till en fjärrserver

### Steg 1: Generera API-nyckel på fjärrinstansen

1. Logga in på fjärrinstansen (t.ex. `https://192.168.2.50:3443`)
2. Gå till **Inställningar → API-nycklar**
3. Klicka **Ny nyckel** → ge den namnet «Primär nod»
4. Ange behörigheter: **Läs** (minst) eller **Läs + Skriv** (för fjärrstyrning)
5. Kopiera nyckeln

### Steg 2: Anslut från primärinstansen

1. Gå till **Inställningar → Fjärrservrar**
2. Klicka **Lägg till fjärrserver**
3. Fyll i:
   - **Namn**: t.ex. «Kontor» eller «Garage»
   - **URL**: `https://192.168.2.50:3443` eller extern URL
   - **API-nyckel**: nyckeln från steg 1
4. Klicka **Testa anslutning**
5. Klicka **Spara**

:::warning Självsignerat certifikat
Om fjärrinstansen använder ett självsignerat certifikat, aktivera **Ignorera TLS-fel** — men gör detta endast för interna nätverksanslutningar.
:::

## Aggregerad visning

Efter anslutning visas fjärrskrivarnas data i:

- **Flottan** — märkt med fjärrserverns namn och en molnikon
- **Statistik** — aggregerat över alla instanser
- **Filamentlager** — samlad översikt

## Fjärrstyrning

Med **Läs + Skriv**-behörighet kan du styra fjärrskrivare direkt:

- Pausa / Återuppta / Stoppa
- Lägga till i utskriftskö (jobbet skickas till fjärrinstansen)
- Se kameraström (proxad via fjärrinstansen)

:::info Latens
Kameraström via fjärrserver kan ha märkbar fördröjning beroende på nätverkshastighet och avstånd.
:::

## Åtkomstkontroll

Begränsa vilken data fjärrservern delar:

1. På fjärrinstansen: gå till **Inställningar → API-nycklar → [Nyckelnamn]**
2. Begränsa åtkomst:
   - Endast specifika skrivare
   - Ingen kameraström
   - Skrivskyddad (endast läsning)

## Hälsa och övervakning

Status för varje fjärrserver visas i **Inställningar → Fjärrservrar**:

- **Ansluten** — senaste hämtning lyckades
- **Frånkopplad** — kan inte nå fjärrservern
- **Autentiseringsfel** — API-nyckel ogiltig eller utgången
- **Senaste synk** — tidsstämpel för senaste lyckade datasynkronisering
