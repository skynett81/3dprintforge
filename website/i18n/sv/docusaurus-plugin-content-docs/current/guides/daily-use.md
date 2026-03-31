---
sidebar_position: 3
title: Daglig användning
description: En praktisk guide till daglig användning av 3DPrintForge — morgonrutin, övervakning, efter utskrift och underhåll
---

# Daglig användning

Den här guiden tar upp hur du använder 3DPrintForge effektivt i vardagen — från att du börjar dagen till att du stänger av ljuset.

## Morgonrutin

Öppna instrumentpanelen och gå snabbt igenom dessa punkter:

### 1. Kontrollera skrivarstatus
Översiktspanelen visar status för alla dina skrivare. Håll utkik efter:
- **Röda ikoner** — fel som kräver uppmärksamhet
- **Väntande meddelanden** — HMS-varningar från natten
- **Oavslutade utskrifter** — om du hade nattutskrift, är den klar?

### 2. Kontrollera AMS-nivåer
Gå till **Filament** eller se AMS-widgeten i instrumentpanelen:
- Har några spoler under 100 g? Byt ut eller beställ ny
- Rätt filament i rätt plats för dagens utskrifter?

### 3. Kontrollera aviseringar och händelser
Under **Aviseringslogg** (klockikonen) ser du:
- Händelser som inträffade under natten
- Fel som loggades automatiskt
- HMS-koder som utlöste larm

## Starta en utskrift

### Från fil (Bambu Studio)
1. Öppna Bambu Studio
2. Läs in och slice-a modellen
3. Skicka till skrivare — instrumentpanelen uppdateras automatiskt

### Från kön
Om du har planerat utskrifter i förväg:
1. Gå till **Kö**
2. Klicka på **Starta nästa** eller dra ett jobb till toppen
3. Bekräfta med **Skicka till skrivare**

Se [Utskriftskö-dokumentation](../features/queue) för fullständig information om köhantering.

### Planerad utskrift (scheduler)
För att starta en utskrift vid en bestämd tidpunkt:
1. Gå till **Planeraren**
2. Klicka på **+ Nytt jobb**
3. Välj fil, skrivare och tidpunkt
4. Aktivera **Elprisoptimering** för att automatiskt välja billigaste timmen

Se [Planeraren](../features/scheduler) för detaljer.

## Övervaka en aktiv utskrift

### Kameravy
Klicka på kameraikonen på skrivarkortet. Du kan:
- Se direktsändning i instrumentpanelen
- Öppna i separat flik för bakgrundsövervakning
- Ta en manuell skärmbild

### Förloppsinformation
Det aktiva utskriftskortet visar:
- Procentandel klar
- Beräknad återstående tid
- Aktuellt lager / totalt antal lager
- Aktivt filament och färg

### Temperaturer
Realtids-temperaturkurvor visas i detaljpanelen:
- Munstyckstemperatur — bör hålla sig stabil inom ±2°C
- Platttemperatur — viktig för god vidhäftning
- Kammartemperatur — stiger gradvis, särskilt relevant för ABS/ASA

### Print Guard
Om **Print Guard** är aktiverat övervakar instrumentpanelen automatiskt efter spaghetti och volumetriska avvikelser. Om något upptäcks:
1. Utskriften sätts på paus
2. Du får en avisering
3. Kamerabilder sparas för efterkontroll

## Efter utskrift — checklista

### Kontrollera kvalitet
1. Öppna kameran och titta på resultatet medan det fortfarande är på plattan
2. Gå till **Historik → Senaste utskrift** för att se statistik
3. Logga en anteckning: vad som gick bra, vad som kan förbättras

### Arkivera
Utskrifter i historiken arkiveras aldrig automatiskt — de ligger kvar. Vill du städa upp:
- Klicka på en utskrift → **Arkivera** för att flytta den till arkivet
- Använd **Projekt** för att gruppera relaterade utskrifter

### Uppdatera filamentvikt
Om du väger spolen för noggrannhet (rekommenderat):
1. Väg spolen
2. Gå till **Filament → [Spolen]**
3. Uppdatera **Återstående vikt**

## Underhållspåminnelser

Instrumentpanelen spårar underhållsintervall automatiskt. Under **Underhåll** ser du:

| Uppgift | Intervall | Status |
|---------|-----------|--------|
| Rensa munstycke | Var 50:e timme | Kontrolleras automatiskt |
| Smörja stänger | Var 200:e timme | Spåras i instrumentpanelen |
| Kalibrera platta | Efter plattbyte | Manuell påminnelse |
| Rensa AMS | Månadsvis | Kalenderavisering |

Aktivera underhållsaviseringar under **Övervakning → Underhåll → Aviseringar**.

:::tip Ställ in en veckovis underhållsdag
En fast underhållsdag i veckan (t.ex. söndagkväll) sparar dig onödiga driftstopp. Använd påminnelsefunktionen i instrumentpanelen.
:::

## Elpris — bästa tid att skriva ut

Om du har anslutit elprisintegrationen (Nordpool / Home Assistant):

1. Gå till **Analys → Elpris**
2. Se priskurva för de närmaste 24 timmarna
3. Billigaste timmarna är markerade med grönt

Använd **Planeraren** med **Elprisoptimering** aktiverat — då startar instrumentpanelen automatiskt jobbet i det billigaste tillgängliga fönstret.

:::info Typiskt billigaste tider
Natten (kl. 01:00–06:00) är som regel billigast i Norden. En 8-timmars utskrift skickad till kön kvällen innan kan spara dig 30–50 % på elkostnaden.
:::
