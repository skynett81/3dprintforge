---
sidebar_position: 8
title: Galleri
description: Se milestone-skärmdumpar tagna automatiskt vid 25, 50, 75 och 100 % framsteg för alla utskrifter
---

# Galleri

Galleriet samlar automatiska skärmdumpar tagna under varje utskrift. Bilderna tas vid fasta milstolpar och ger dig en visuell logg över utskriftens utveckling.

Gå till: **https://localhost:3443/#gallery**

## Milestone-skärmdumpar

3DPrintForge tar automatiskt en skärmdump från kameran vid följande milstolpar:

| Milstolpe | Tidpunkt |
|---|---|
| **25 %** | En fjärdedel genom utskriften |
| **50 %** | Halvvägs |
| **75 %** | Tre fjärdedelar igenom |
| **100 %** | Utskrift slutförd |

Skärmdumparna sparas kopplade till den aktuella utskriftshistorikposten och visas i galleriet.

:::info Krav
Milestone-skärmdumpar kräver att kameran är ansluten och aktiv. Inaktiverade kameror genererar inga bilder.
:::

## Aktivera skärmdumpsfunktionen

1. Gå till **Inställningar → Galleri**
2. Aktivera **Automatiska milestone-skärmdumpar**
3. Välj vilka milstolpar du vill aktivera (alla fyra är på som standard)
4. Välj **Bildkvalitet**: Låg (640×360) / Medium (1280×720) / Hög (1920×1080)
5. Klicka **Spara**

## Bildvisning

Galleriet är organiserat per utskrift:

1. Använd **filter** överst för att välja skrivare, datum eller filnamn
2. Klicka på en utskriftsrad för att expandera och se alla fyra bilder
3. Klicka på en bild för att öppna förhandsgranskning

### Förhandsgranskning

Förhandsgranskningen visar:
- Bild i full storlek
- Milstolpe och tidsstämpel
- Utskriftsnamn och skrivare
- **←** / **→** för att bläddra mellan bilder i samma utskrift

## Helskärmsvisning

Klicka **Helskärm** (eller tryck `F`) i förhandsgranskningen för att fylla hela skärmen. Använd piltangenterna för att bläddra mellan bilder.

## Ladda ner bilder

- **Enstaka bild**: Klicka **Ladda ner** i förhandsgranskningen
- **Alla bilder för en utskrift**: Klicka **Ladda ner alla** på utskriftsraden — du får en `.zip`-fil
- **Välj flera**: Bocka av kryssrutorna och klicka **Ladda ner valda**

## Ta bort bilder

:::warning Lagringsutrymme
Galleribilder kan ta betydande utrymme över tid. Ställ in automatisk borttagning för gamla bilder.
:::

### Manuell borttagning

1. Välj en eller flera bilder (bocka av)
2. Klicka **Ta bort valda**
3. Bekräfta i dialogrutan

### Automatisk rensning

1. Gå till **Inställningar → Galleri → Automatisk rensning**
2. Aktivera **Ta bort bilder äldre än**
3. Ange antal dagar (t.ex. 90 dagar)
4. Rensning körs automatiskt varje natt kl. 03:00

## Koppling till utskriftshistorik

Varje bild är kopplad till en utskriftspost i historiken:

- Klicka **Se i historik** på en utskrift i galleriet för att hoppa till historikposten
- I historiken visas en thumbnail av 100 %-bilden om den finns

## Delning

Dela en galleribild via tidsbegränsad länk:

1. Öppna bilden i förhandsgranskning
2. Klicka **Dela**
3. Välj utgångstid och kopiera länken
