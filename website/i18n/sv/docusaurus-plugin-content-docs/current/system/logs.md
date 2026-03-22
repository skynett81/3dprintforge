---
sidebar_position: 8
title: Serverlogg
description: Se serverloggen i realtid, filtrera på nivå och modul, och felsök problem med Bambu Dashboard
---

# Serverlogg

Serverloggen ger dig insikt i vad som händer inuti Bambu Dashboard — användbart för felsökning, övervakning och diagnostik.

Gå till: **https://localhost:3443/#logs**

## Realtidsvisning

Loggströmmen uppdateras i realtid via WebSocket:

1. Gå till **System → Serverlogg**
2. Nya loggrader visas automatiskt längst ner
3. Klicka **Lås botten** för att alltid scrolla till senaste logg
4. Klicka **Frys** för att stoppa autoscrollning och läsa befintliga rader

Standardvisningen visar de senaste 500 loggraderna.

## Loggnivåer

Varje loggpost har en nivå:

| Nivå | Färg | Beskrivning |
|---|---|---|
| **ERROR** | Röd | Fel som påverkar funktionalitet |
| **WARN** | Orange | Varningar — något kan gå fel |
| **INFO** | Blå | Normal driftsinformation |
| **DEBUG** | Grå | Detaljerad utvecklarinformation |

:::info Loggnivåkonfiguration
Ändra loggnivå under **Inställningar → System → Loggnivå**. För normal drift, använd **INFO**. Använd **DEBUG** endast vid felsökning eftersom det genererar mycket mer data.
:::

## Filtrering

Använd filterverktygsfältet längst upp i loggvyn:

1. **Loggnivå** — visa endast ERROR / WARN / INFO / DEBUG eller en kombination
2. **Modul** — filtrera på systemmodul:
   - `mqtt` — MQTT-kommunikation med skrivare
   - `api` — API-förfrågningar
   - `db` — databasoperationer
   - `auth` — autentiseringshändelser
   - `queue` — utskriftskö-händelser
   - `guard` — Print Guard-händelser
   - `backup` — säkerhetskopieringsoperationer
3. **Fritext** — sök i loggtexten (stöder regex)
4. **Tidpunkt** — filtrera på datumperiod

Kombinera filtren för precis felsökning.

## Vanliga felsituationer

### MQTT-anslutningsproblem

Se efter loggrader från `mqtt`-modulen:

```
ERROR [mqtt] Anslutning till skrivare XXXX misslyckades: Connection refused
```

**Lösning:** Kontrollera att skrivaren är på, åtkomstnyckeln är korrekt och nätverket fungerar.

### Databasfel

```
ERROR [db] Migrationen v95 misslyckades: SQLITE_CONSTRAINT
```

**Lösning:** Ta en säkerhetskopia och kör databasreparation via **Inställningar → System → Reparera databas**.

### Autentiseringsfel

```
WARN [auth] Misslyckad inloggning för användare admin från IP 192.168.1.x
```

Många misslyckade inloggningar kan indikera ett brute-force-försök. Kontrollera om IP-vitlista bör aktiveras.

## Exportera loggar

1. Klicka **Exportera logg**
2. Välj tidsperiod (standard: senaste 24 timmar)
3. Välj format: **TXT** (läsbart) eller **JSON** (maskinläsbart)
4. Filen laddas ner

Exporterade loggar är användbara vid felrapportering eller vid kontakt med support.

## Loggrotation

Loggar roteras automatiskt:

| Inställning | Standard |
|---|---|
| Maximal loggfilsstorlek | 50 MB |
| Antal roterade filer att behålla | 5 |
| Total maximal loggstorlek | 250 MB |

Justera under **Inställningar → System → Loggrotation**. Äldre loggfiler komprimeras automatiskt med gzip.

## Plats för loggfiler

Loggfiler lagras på servern:

```
./data/logs/
├── bambu-dashboard.log          (aktiv logg)
├── bambu-dashboard.log.1.gz     (roterad)
├── bambu-dashboard.log.2.gz     (roterad)
└── ...
```

:::tip SSH-åtkomst
För att läsa loggar direkt på servern via SSH:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
