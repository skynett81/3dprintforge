---
sidebar_position: 1
title: Munstycksunderhåll
description: Rengöring, cold pull, munstyckesbyte och munstyckstyper för Bambu Lab-skrivare
---

# Munstycksunderhåll

Munstycket är en av de mest kritiska komponenterna i skrivaren. Korrekt underhåll förlänger livslängden och säkerställer goda utskriftsresultat.

## Munstyckstyper

| Munstyckstyp | Material | Livslängd (uppskattad) | Max temp |
|----------|-----------|-------------------|----------|
| Messing (standard) | PLA, PETG, ABS, TPU | 200–500 timmar | 300 °C |
| Härdat stål | Alla inkl. CF/GF | 300–600 timmar | 300 °C |
| HS01 (Bambu) | Alla inkl. CF/GF | 500–1000 timmar | 300 °C |

:::danger Använd aldrig messingmunstycke med CF/GF
Kolfiberfyllda och glasfiberfyllda filament sliter ned messingmunstycken på timmar. Byt till härdat stål innan du skriver ut CF/GF-material.
:::

## Rengöring

### Enkel rengöring (mellan spolar)
1. Värm upp munstycket till 200–220 °C
2. Tryck manuellt filament genom tills det renas
3. Dra snabbt ut filamentet («cold pull» — se nedan)

### IPA-rengöring
För envis smuts:
1. Värm upp munstycket till 200 °C
2. Droppa 1–2 droppar IPA på munstyckets ände (försiktigt!)
3. Låt ångan lösa upp resterna
4. Dra igenom färskt filament

:::warning Var försiktig med IPA på varmt munstycke
IPA kokar vid 83 °C och ångar kraftigt på varmt munstycke. Använd lite mängder och undvik inandning.
:::

## Cold Pull (Kall Dragning)

Cold pull är den mest effektiva metoden för att ta bort föroreningar och kolrester från munstycket.

**Steg för steg:**
1. Värm upp munstycket till 200–220 °C
2. Tryck nylonfilament (eller det som finns i munstycket) in manuellt
3. Låt nylon mättas i munstycket i 1–2 minuter
4. Sänk temperaturen till 80–90 °C (för nylon)
5. Vänta tills munstycket är avkylt till målet
6. Dra ut filamentet snabbt och bestämt i en rörelse
7. Titta på änden: ska ha formen av munstycksinnanmätet — rent och utan rester
8. Upprepa 3–5 gånger tills filamentet dras ut rent och vitt

:::tip Nylon för cold pull
Nylon ger bäst resultat för cold pull eftersom det fäster väl vid föroreningar. Vitt nylon gör det lätt att se om dragningen är ren.
:::

## Munstyckesbyte

### Tecken på att munstycket bör bytas
- Klumpiga ytor och dålig dimensionsnoggrannhet
- Bestående extruderingsproblem efter rengöring
- Synligt slitage eller deformation av munstyckhålet
- Munstycket har passerat uppskattad livslängd

### Tillvägagångssätt (P1S/X1C)
1. Värm upp munstycket till 200 °C
2. Bromsa extrudermotorn (frigör filament)
3. Använd nyckel för att lossa munstycket (moturs)
4. Byt munstycke medan det är varmt — **låt inte munstycket kylas med verktyg på**
5. Dra åt till önskat värde (dra inte för hårt)
6. Kör kalibrering efter byte

:::warning Byt alltid varmt
Åtdragningsmoment från kallt munstycke kan spräcka komponenten under uppvärmning. Byt och dra alltid åt medan munstycket är varmt (200 °C).
:::

## Underhållsintervall

| Aktivitet | Intervall |
|-----------|---------|
| Rengöring (cold pull) | Efter 50 timmar, eller vid materialbyte |
| Visuell kontroll | Veckovis |
| Munstyckesbyte (messing) | 200–500 timmar |
| Munstyckesbyte (härdat stål) | 300–600 timmar |
