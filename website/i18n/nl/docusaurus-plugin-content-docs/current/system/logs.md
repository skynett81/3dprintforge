---
sidebar_position: 8
title: Serverlogboek
description: Het serverlogboek in realtime bekijken, filteren op niveau en module, en problemen met Bambu Dashboard oplossen
---

# Serverlogboek

Het serverlogboek geeft inzicht in wat er in Bambu Dashboard gebeurt — nuttig voor probleemoplossing, bewaking en diagnostiek.

Ga naar: **https://localhost:3443/#logs**

## Realtimeweergave

De logstroom wordt in realtime bijgewerkt via WebSocket:

1. Ga naar **Systeem → Serverlogboek**
2. Nieuwe logregels verschijnen automatisch onderaan
3. Klik **Onderaan vergrendelen** om altijd naar het laatste logboek te scrollen
4. Klik **Pauzeren** om automatisch scrollen te stoppen en bestaande regels te lezen

De standaardweergave toont de laatste 500 logregels.

## Logniveaus

Elke logregel heeft een niveau:

| Niveau | Kleur | Beschrijving |
|---|---|---|
| **ERROR** | Rood | Fouten die de functionaliteit beïnvloeden |
| **WARN** | Oranje | Waarschuwingen — er kan iets fout gaan |
| **INFO** | Blauw | Normale bedrijfsinformatie |
| **DEBUG** | Grijs | Gedetailleerde ontwikkelaarsinformatie |

:::info Logniveauconfiguratie
Wijzig het logniveau via **Instellingen → Systeem → Logniveau**. Gebruik **INFO** voor normaal gebruik. Gebruik **DEBUG** alleen bij probleemoplossing, omdat dit veel meer data genereert.
:::

## Filteren

Gebruik de filterwerkbalk bovenaan de logweergave:

1. **Logniveau** — toon alleen ERROR / WARN / INFO / DEBUG of een combinatie
2. **Module** — filter op systeemmodule:
   - `mqtt` — MQTT-communicatie met printers
   - `api` — API-verzoeken
   - `db` — databasebewerkingen
   - `auth` — authenticatiegebeurtenissen
   - `queue` — wachtrijgebeurtenissen
   - `guard` — Print Guard-gebeurtenissen
   - `backup` — back-upbewerkingen
3. **Vrije tekst** — zoek in de logtekst (ondersteunt regex)
4. **Tijdstip** — filter op datumperiode

Combineer filters voor nauwkeurige probleemoplossing.

## Veelvoorkomende foutscenario's

### MQTT-verbindingsproblemen

Zoek naar logregels van de `mqtt`-module:

```
ERROR [mqtt] Verbinding met printer XXXX mislukt: Connection refused
```

**Oplossing:** Controleer of de printer aan staat, de toegangscode correct is en het netwerk werkt.

### Databasefouten

```
ERROR [db] Migratie v95 mislukt: SQLITE_CONSTRAINT
```

**Oplossing:** Maak een back-up en voer databasereparatie uit via **Instellingen → Systeem → Database repareren**.

### Authenticatiefouten

```
WARN [auth] Mislukte aanmelding voor gebruiker admin vanaf IP 192.168.1.x
```

Veel mislukte aanmeldingen kunnen duiden op een brute-force-aanval. Controleer of IP-whitelisting ingeschakeld moet worden.

## Logboeken exporteren

1. Klik **Logboek exporteren**
2. Kies tijdsperiode (standaard: afgelopen 24 uur)
3. Kies formaat: **TXT** (leesbaar) of **JSON** (machineleesbaar)
4. Het bestand wordt gedownload

Geëxporteerde logboeken zijn nuttig bij het melden van bugs of bij contact met ondersteuning.

## Logrotatie

Logboeken worden automatisch geroteerd:

| Instelling | Standaard |
|---|---|
| Maximale logbestandsgrootte | 50 MB |
| Aantal geroteerde bestanden bewaren | 5 |
| Totale maximale loggrootte | 250 MB |

Aanpassen via **Instellingen → Systeem → Logrotatie**. Oudere logbestanden worden automatisch gecomprimeerd met gzip.

## Locatie van logbestanden

Logbestanden worden op de server opgeslagen:

```
./data/logs/
├── bambu-dashboard.log          (actief logboek)
├── bambu-dashboard.log.1.gz     (geroteerd)
├── bambu-dashboard.log.2.gz     (geroteerd)
└── ...
```

:::tip SSH-toegang
Om logboeken rechtstreeks op de server via SSH te lezen:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
