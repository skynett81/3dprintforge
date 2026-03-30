---
sidebar_position: 4
title: Schemaläggare
description: Planera utskrifter, administrera utskriftskö och ställ in automatisk dispatch
---

# Schemaläggare

Schemaläggaren låter dig organisera och automatisera utskriftsjobb med kalendervisning och en intelligent utskriftskö.

## Kalendervisning

Kalendervisningen ger en översikt över alla planerade och genomförda utskrifter:

- **Månads-, vecko- och dagsvisning** — välj detaljnivå
- **Färgkodning** — olika färger per skrivare och status
- **Klicka på en händelse** — se detaljer om utskriften

Slutförda utskrifter visas automatiskt baserat på utskriftshistoriken.

## Utskriftskö

Utskriftskön låter dig ställa upp jobb som skickas till skrivaren i ordning:

### Lägga till jobb i kön

1. Klicka **+ Lägg till jobb**
2. Välj fil (från skrivar-SD, lokal uppladdning, eller FTP)
3. Ange prioritet (hög, normal, låg)
4. Välj målskrivare (eller "automatisk")
5. Klicka **Lägg till**

### Köhantering

| Åtgärd | Beskrivning |
|----------|-------------|
| Dra och släpp | Omorganisera ordningen |
| Pausa kö | Stoppa utsändning tillfälligt |
| Hoppa över | Skicka nästa jobb utan att vänta |
| Ta bort | Ta bort jobb från kön |

:::tip Flerskrivar-dispatch
Med flera skrivare kan kön automatiskt fördela jobb till lediga skrivare. Aktivera **Automatisk dispatch** under **Schemaläggare → Inställningar**.
:::

## Planerade utskrifter

Ställ in utskrifter som ska starta vid en bestämd tidpunkt:

1. Klicka **+ Planera utskrift**
2. Välj fil och skrivare
3. Ange starttidpunkt
4. Konfigurera avisering (valfritt)
5. Spara

:::warning Skrivaren måste vara ledig
Planerade utskrifter startar bara om skrivaren är i standby-läge vid angiven tidpunkt. Om skrivaren är upptagen skjuts starten till nästa tillgängliga tidpunkt (konfigurerbart).
:::

## Lastbalansering

Med automatisk lastbalansering fördelas jobb intelligent mellan skrivare:

- **Round-robin** — jämn fördelning mellan alla skrivare
- **Minst upptagen** — skicka till skrivaren med kortast uppskattad färdigtid
- **Manuell** — du väljer skrivare själv för varje jobb

Konfigurera under **Schemaläggare → Lastbalansering**.

## Aviseringar

Schemaläggaren integrerar med aviseringskanaler:

- Avisering när jobb startar
- Avisering när jobb är klart
- Avisering vid fel eller fördröjning

Se [Funktionsöversikt](./overview#aviseringar) för att konfigurera aviseringskanaler.
