---
sidebar_position: 6
title: Utskriftsjämförelse
description: Jämför två utskrifter sida vid sida med detaljerade mätvärden, grafer och galleribilder för A/B-analys
---

# Utskriftsjämförelse

Utskriftsjämförelsen låter dig analysera två utskrifter sida vid sida — användbart för att jämföra inställningar, material, skrivare eller versioner av samma modell.

Gå till: **https://localhost:3443/#comparison**

## Välja utskrifter att jämföra

1. Gå till **Utskriftsjämförelse**
2. Klicka **Välj utskrift A** och sök i historiken
3. Klicka **Välj utskrift B** och sök i historiken
4. Klicka **Jämför** för att ladda jämförelsevisningen

:::tip Snabbare åtkomst
Från **Historik** kan du högerklicka på en utskrift och välja **Ange som utskrift A** eller **Jämför med...** för att hoppa direkt till jämförelseläge.
:::

## Mätvärdesjämförelse

Mätvärdena visas i två kolumner (A och B) med markering av vilken som är bäst:

| Mätvärde | Beskrivning |
|---|---|
| Framgång | Slutförd / Avbruten / Misslyckad |
| Varaktighet | Total utskriftstid |
| Filamentförbrukning | Gram totalt och per färg |
| Filamenteffektivitet | Modell-% av total förbrukning |
| Max munstyckstemperatur | Högsta registrerade munstyckstemperatur |
| Max bäddtemperatur | Högsta registrerade bäddtemperatur |
| Hastighetsinställning | Tyst / Standard / Sport / Turbo |
| AMS-byten | Antal färgskiften |
| HMS-fel | Eventuella fel under utskrift |
| Skrivare | Vilken skrivare som användes |

Celler med det bästa värdet visas med grön bakgrund.

## Temperaturgrafer

Två temperaturgrafer visas sida vid sida (eller överlappande):

- **Separat visning** — graf A till vänster, graf B till höger
- **Överlappande visning** — båda i samma graf med olika färger

Använd överlappande visning för att se temperaturstabilitet och uppvärmningshastighet direkt.

## Galleribilder

Om båda utskrifterna har milestone-skärmdumpar visas de i ett rutnät:

| Utskrift A | Utskrift B |
|---|---|
| 25%-bild A | 25%-bild B |
| 50%-bild A | 50%-bild B |
| 75%-bild A | 75%-bild B |
| 100%-bild A | 100%-bild B |

Klicka på en bild för att öppna helskärmsförhandsgranskning med bildspelsanimation.

## Timelapse-jämförelse

Om båda utskrifterna har timelapse visas videorna sida vid sida:

- Synkroniserad uppspelning — båda startar och pausar samtidigt
- Oberoende uppspelning — kontrollera varje video separat

## Inställningsskillnader

Systemet lyfter automatiskt fram skillnader i utskriftsinställningar (hämtade från G-code-metadata):

- Olika lagertjocklekar
- Olika infill-mönster eller -procent
- Olika stödinställningar
- Olika hastighetsprofiler

Skillnader visas med orange markering i inställningstabellen.

## Spara jämförelse

1. Klicka **Spara jämförelse**
2. Ge jämförelsen ett namn (t.ex. «PLA vs PETG - Benchy»)
3. Jämförelsen sparas och är tillgänglig via **Historik → Jämförelser**

## Export

1. Klicka **Exportera**
2. Välj **PDF** för en rapport med alla mätvärden och bilder
3. Rapporten kan kopplas till ett projekt för dokumentation av materialval
