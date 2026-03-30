---
sidebar_position: 6
title: ASA
description: Guide till ASA-utskrift med Bambu Lab — UV-resistent, utomhusbruk, temperatur och tips
---

# ASA

ASA (Akrylonitril Styren Akrylat) är en UV-resistent variant av ABS som är speciellt utvecklad för utomhusbruk. Materialet kombinerar styrkan och styvheten hos ABS med avsevärt bättre motståndskraft mot UV-strålning, åldring och väderexponering.

## Inställningar

| Parameter | Värde |
|-----------|-------|
| Munstyckstemperatur | 240–260 °C |
| Bäddtemperatur | 90–110 °C |
| Kammartemperatur | 40–50 °C (rekommenderad) |
| Delkylning | 30–50% |
| Hastighet | 80–100% |
| Torkning nödvändig | Ja |

## Rekommenderade byggplattor

| Platta | Lämplighet | Limstift? |
|--------|-----------|----------|
| Engineering Plate | Utmärkt | Nej |
| High Temp Plate | Bra | Ja |
| Textured PEI | Acceptabel | Ja |
| Cool Plate (Smooth PEI) | Ej rekommenderad | — |

:::tip Engineering Plate är bäst för ASA
Engineering Plate ger den mest pålitliga vidhäftningen för ASA utan limstift. Plattan tål de höga bäddtemperaturerna och ger bra vidhäftning utan att delen fastnar permanent.
:::

## Skrivarkrav

ASA kräver **sluten kammare (enclosure)** för bästa resultat. Utan hölje kommer du att uppleva:

- **Warping** — hörn lyfter sig från byggplattan
- **Lagerdelning** — dålig bindning mellan lagren
- **Ytsprickor** — synliga sprickor längs utskriften

| Skrivare | Lämplig för ASA? | Anmärkning |
|----------|-----------------|------------|
| X1C | Utmärkt | Helt sluten, aktiv uppvärmning |
| X1E | Utmärkt | Helt sluten, aktiv uppvärmning |
| P1S | Bra | Sluten, passiv uppvärmning |
| P1P | Möjligt med tillägg | Kräver höljestillbehör |
| A1 | Ej rekommenderad | Öppen ram |
| A1 Mini | Ej rekommenderad | Öppen ram |

## ASA vs ABS — jämförelse

| Egenskap | ASA | ABS |
|----------|-----|-----|
| UV-motstånd | Utmärkt | Dåligt |
| Utomhusbruk | Ja | Nej (gulnar och blir sprött) |
| Warping | Måttligt | Högt |
| Yta | Matt, jämn | Matt, jämn |
| Kemisk motståndskraft | Bra | Bra |
| Pris | Något högre | Lägre |
| Lukt vid utskrift | Måttlig | Stark |
| Slaghållfasthet | Bra | Bra |
| Temperaturbeständighet | ~95–105 °C | ~95–105 °C |

:::warning Ventilation
ASA avger gaser vid utskrift som kan vara irriterande. Skriv ut i väl ventilerat rum eller med luftfiltreringssystem. Skriv inte ut ASA i rum där du vistas under längre tid utan ventilation.
:::

## Torkning

ASA är **måttligt hygroskopiskt** och absorberar fukt från luften över tid.

| Parameter | Värde |
|-----------|-------|
| Torktemperatur | 65 °C |
| Torktid | 4–6 timmar |
| Hygroskopisk nivå | Medel |
| Tecken på fukt | Poppande ljud, bubblor, dålig yta |

- Förvara i förseglad påse med silikagel efter öppning
- AMS med torkmedel räcker för kortvarig förvaring
- För längre förvaring: använd vakuumpåse eller filamenttorklåda

## Användningsområden

ASA är det föredragna materialet för allt som ska användas **utomhus**:

- **Bilkomponenter** — spegelhus, instrumentpaneldetaljer, ventilhuvar
- **Trädgårdsverktyg** — fästen, klämmor, delar till trädgårdsmöbler
- **Utomhusskyltar** — skyltar, bokstäver, logotyper
- **Drönare-delar** — landningsställ, kamerafästen
- **Solpanelsmonteringar** — fästen och vinklar
- **Brevlådedelar** — mekanismer och dekorationer

## Tips för lyckad ASA-utskrift

### Brim och vidhäftning

- **Använd brim** för stora delar och delar med liten kontaktyta
- Brim på 5–8 mm förebygger warping effektivt
- För mindre delar kan du prova utan brim, men ha det redo som backup

### Undvik drag

- **Stäng alla dörrar och fönster** i rummet under utskrift
- Drag och kall luft är ASA:s värsta fiende
- Öppna inte kammardörren under utskrift

### Temperaturstabilitet

- Låt kammaren värma upp i **10–15 minuter** innan utskrift startar
- Stabil kammartemperatur ger jämnare resultat
- Undvik att placera skrivaren nära fönster eller ventilationsöppningar

### Kylning

- ASA behöver **begränsad delkylning** — 30–50% är typiskt
- För överhäng och broar kan du öka till 60–70%, men förvänta viss lagerdelning
- För mekaniska delar: prioritera lagerbindning över detaljer genom att sänka kylningen

:::tip Första gången med ASA?
Börja med en liten testdel (t.ex. en 30 mm kub) för att kalibrera dina inställningar. ASA beter sig mycket likt ABS, men med något lägre tendenser till warping. Har du erfarenhet av ABS kommer ASA att kännas som en uppgradering.
:::

---

## Krympning

ASA krymper mer än PLA och PETG, men generellt något mindre än ABS:

| Material | Krympning |
|----------|----------|
| PLA | ~0,3–0,5% |
| PETG | ~0,3–0,6% |
| ASA | ~0,5–0,7% |
| ABS | ~0,7–0,8% |

För delar med snäva toleranser: kompensera med 0,5–0,7% i slicern, eller testa med provdelar först.

---

## Efterbehandling

- **Acetonglättning** — ASA kan glättas med acetonånga, precis som ABS
- **Slipning** — slipas bra med 200–400 korn sandpapper
- **Limning** — CA-lim eller acetonlimning fungerar utmärkt
- **Målning** — tar färg bra efter lätt slipning

:::danger Acetonhantering
Aceton är brandfarligt och avger giftiga gaser. Använd alltid i väl ventilerat rum, undvik öppen eld och använd skyddsutrustning (handskar och skyddsglasögon).
:::
