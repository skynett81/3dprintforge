---
sidebar_position: 6
title: Felmönsteranalys
description: AI-baserad analys av felmönster, korrelationer mellan fel och miljöfaktorer, och konkreta förbättringsförslag
---

# Felmönsteranalys

Felmönsteranalysen använder historiska data från utskrifter och fel för att identifiera mönster, orsaker och korrelationer — och ger dig konkreta förbättringsförslag.

Gå till: **https://localhost:3443/#error-analysis**

## Vad analyseras

Systemet analyserar följande datapunkter:

- HMS-felkoder och tidpunkter
- Filamenttyp och leverantör vid fel
- Temperatur vid fel (munstycke, bädd, kammare)
- Utskriftshastighet och -profil
- Tid på dygnet och dag i veckan
- Tid sedan senaste underhåll
- Skrivarmodell och firmware-version

## Korrelationsanalys

Systemet letar efter statistiska korrelationer mellan fel och faktorer:

**Exempel på korrelationer som upptäcks:**
- «78 % av AMS-blockeringsfel uppstår med filament från leverantör X»
- «Munstyckesblockeringar sker 3× oftare efter 6+ timmar kontinuerlig utskrift»
- «Häftningsfel ökar vid kammartemperatur under 18°C»
- «Stringing-fel korrelerar med luftfuktighet över 60 % (om hygrometer ansluten)»

Korrelationer med statistisk signifikans (p < 0.05) visas överst.

:::info Datakrav
Analysen är mest korrekt med minst 50 utskrifter i historiken. Med färre utskrifter visas uppskattningar med lågt konfidensintervall.
:::

## Förbättringsförslag

Baserat på analyserna genereras konkreta förslag:

| Förslagstyp | Exempel |
|---|---|
| Filament | «Byt till en annan leverantör för PA-CF — 3 av 4 fel använde LeverantörX» |
| Temperatur | «Öka bäddtemperatur med 5°C för PETG — häftningsfel minskar uppskattningsvis 60 %» |
| Hastighet | «Minska hastighet till 80 % efter 4 timmar — munstyckesblockeringar minskar uppskattningsvis 45 %» |
| Underhåll | «Rengör extruder-kugghjul — slitage korrelerar med 40 % av extruderingsfel» |
| Kalibrering | «Kör bed leveling — 12 av 15 häftningsfel senaste veckan korrelerar med felaktig kalibrering» |

Varje förslag visar:
- Uppskattad effekt (%-minskning av fel)
- Konfidens (låg / medel / hög)
- Steg-för-steg-implementering
- Länk till relevant dokumentation

## Hälsopoängs påverkan

Analysen kopplas till hälsopoängen (se [Diagnostik](./diagnostics)):

- Visar vilka faktorer som drar ner poängen mest
- Uppskattar poängförbättring vid implementering av varje förslag
- Prioriterar förslag efter potentiell poängförbättring

## Tidslinjevisning

Gå till **Felanalys → Tidslinje** för att se en kronologisk översikt:

1. Välj skrivare och tidsperiod
2. Fel visas som punkter på tidslinjen, färgkodade efter typ
3. Horisontella linjer markerar underhållsuppgifter
4. Kluster av fel (många fel på kort tid) är markerade i rött

Klicka på ett kluster för att öppna analys av den specifika perioden.

## Rapporter

Generera en PDF-rapport över felanalysen:

1. Klicka **Generera rapport**
2. Välj tidsperiod (t.ex. senaste 90 dagarna)
3. Välj innehåll: korrelationer, förslag, tidslinje, hälsopoäng
4. Ladda ner PDF eller skicka till e-post

Rapporterna sparas under projekt om skrivaren är kopplad till ett projekt.

:::tip Veckovis genomgång
Ställ in automatisk veckovis e-postrapport under **Inställningar → Rapporter** för att hålla dig uppdaterad utan att besöka dashboardet manuellt. Se [Rapporter](../system/reports).
:::
