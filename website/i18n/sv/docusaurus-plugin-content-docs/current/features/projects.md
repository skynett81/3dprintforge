---
sidebar_position: 9
title: Projekt
description: Organisera utskrifter i projekt, spåra kostnader, generera faktura och dela projekt med kunder
---

# Projekt

Projekt låter dig gruppera relaterade utskrifter, spåra materialkostnader, fakturera kunder och dela en översikt över ditt arbete.

Gå till: **https://localhost:3443/#projects**

## Skapa ett projekt

1. Klicka **Nytt projekt** (+ ikon)
2. Fyll i:
   - **Projektnamn** — beskrivande namn (max 100 tecken)
   - **Kund** — valfritt kundkonto (se [E-handel](../integrations/ecommerce))
   - **Beskrivning** — kort textbeskrivning
   - **Färg** — välj en färg för visuell identifiering
   - **Taggar** — kommaseparerade ämnesord
3. Klicka **Skapa projekt**

## Koppla utskrifter till projekt

### Under en utskrift

1. Öppna dashboardet medan en utskrift pågår
2. Klicka **Koppla till projekt** i sidopanelen
3. Välj befintligt projekt eller skapa nytt
4. Utskriften kopplas automatiskt till projektet när den slutförs

### Från historik

1. Gå till **Historik**
2. Hitta den aktuella utskriften
3. Klicka på utskriften → **Koppla till projekt**
4. Välj projekt från rullgardinsmenyn

### Masskoppling

1. Välj flera utskrifter i historiken med kryssrutor
2. Klicka **Åtgärder → Koppla till projekt**
3. Välj projekt — alla valda utskrifter kopplas

## Kostnadsöversikt

Varje projekt beräknar totala kostnader baserat på:

| Kostnadstyp | Källa |
|---|---|
| Filamentförbrukning | Gram × pris per gram per material |
| El | kWh × elpris (från Tibber/Nordpool om konfigurerat) |
| Maskinslitage | Beräknat från [Slitageprediktion](../monitoring/wearprediction) |
| Manuell kostnad | Fritextposter du lägger till manuellt |

Kostnadsöversikten visas som tabell och cirkeldiagram per utskrift och totalt.

:::tip Timpriser
Aktivera Tibber- eller Nordpool-integrationen för korrekta elkostnader per utskrift. Se [Elpris](../integrations/energy).
:::

## Fakturering

1. Öppna ett projekt och klicka **Generera faktura**
2. Fyll i:
   - **Fakturadatum** och **förfallodatum**
   - **Momssats** (0 %, 15 %, 25 %)
   - **Pålägg** (%)
   - **Anteckning till kund**
3. Förhandsgranska fakturan i PDF-format
4. Klicka **Ladda ner PDF** eller **Skicka till kund** (via e-post)

Fakturor sparas under projektet och kan öppnas på nytt och redigeras tills de är skickade.

:::info Kunddata
Kunddata (namn, adress, org.nr.) hämtas från kundkontot du kopplade till projektet. Se [E-handel](../integrations/ecommerce) för att administrera kunder.
:::

## Projektstatus

| Status | Beskrivning |
|---|---|
| Aktiv | Projektet är under arbete |
| Slutförd | Alla utskrifter är klara, faktura skickad |
| Arkiverad | Dold från standardvisningen men sökbar |
| På väntelistan | Tillfälligt stoppad |

Ändra status genom att klicka på statusindikatorn överst i projektet.

## Dela ett projekt

Generera en delbar länk för att visa projektöversikten för kunder:

1. Klicka **Dela projekt** i projektmenyn
2. Välj vad som ska visas:
   - ✅ Utskrifter och bilder
   - ✅ Total filamentförbrukning
   - ❌ Kostnader och priser (dolt som standard)
3. Ange utgångstid för länken
4. Kopiera och dela länken

Kunden ser en skrivskyddad sida utan att logga in.
