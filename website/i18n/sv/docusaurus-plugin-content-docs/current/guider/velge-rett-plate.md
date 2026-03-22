---
sidebar_position: 4
title: Välja rätt byggplatta
description: Översikt över Bambu Labs byggplattor och vilken som passar bäst till ditt filament
---

# Välja rätt byggplatta

Rätt byggplatta är avgörande för god vidhäftning och enkel borttagning av utskriften. Fel kombination ger antingen dålig vidhäftning eller att utskriften sitter fast och skadar plattan.

## Översiktstabell

| Filament | Rekommenderad platta | Limstift | Platttemperatur |
|----------|---------------------|----------|-----------------|
| PLA | Cool Plate / Textured PEI | Nej / Ja | 35–45°C |
| PETG | Textured PEI | **Ja (krävs)** | 70°C |
| ABS | Engineering Plate / High Temp | Ja | 90–110°C |
| ASA | Engineering Plate / High Temp | Ja | 90–110°C |
| TPU | Textured PEI | Nej | 35–45°C |
| PA (Nylon) | Engineering Plate | Ja | 90°C |
| PC | High Temp Plate | Ja | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Ja | 45–90°C |
| PVA | Cool Plate | Nej | 35°C |

## Plattbeskrivning

### Cool Plate (Slät PEI)
**Bäst för:** PLA, PVA
**Yta:** Slät, ger slät undersida på utskriften
**Borttagning:** Böj plattan lätt eller vänta tills den svalnar — utskriften lossnar av sig själv

Använd inte Cool Plate med PETG — det fäster **för bra** och kan riva av beläggningen från plattan.

### Textured PEI (Mönstrad)
**Bäst för:** PETG, TPU, PLA (ger grov yta)
**Yta:** Mönstrad, ger grov och estetisk undersida
**Borttagning:** Vänta till rumstemperatur — lossnar av sig själv

:::warning PETG kräver limstift på Textured PEI
Utan limstift fäster PETG extremt bra på Textured PEI och kan flaga av beläggning vid borttagning. Applicera alltid ett tunt lager limstift (Bambu-limstift eller Elmer's Disappearing Purple Glue) över hela ytan.
:::

### Engineering Plate
**Bäst för:** ABS, ASA, PA, PLA-CF, PETG-CF
**Yta:** Har en matt PEI-yta med lägre adhesion än Textured PEI
**Borttagning:** Lätt att ta bort efter avkylning. Använd limstift för ABS/ASA

### High Temp Plate
**Bäst för:** PC, PA-CF, ABS vid höga temperaturer
**Yta:** Tål platttemperatur upp till 120°C utan deformation
**Borttagning:** Kyl ned till rumstemperatur

## Vanliga misstag

### PETG på slät Cool Plate (utan limstift)
**Problem:** PETG binder sig så starkt att utskriften inte kan tas bort utan skada
**Lösning:** Använd alltid Textured PEI med limstift, eller Engineering Plate

### ABS på Cool Plate
**Problem:** Warping — hörnen lyfter sig under utskrift
**Lösning:** Engineering Plate + limstift + höja kammartemperaturen (stäng frontluckan)

### PLA på High Temp Plate
**Problem:** För hög platttemperatur ger överdrivet god vidhäftning, svår borttagning
**Lösning:** Cool Plate eller Textured PEI för PLA

### För mycket limstift
**Problem:** Tjockt limstift ger elefantfot (utflytande första lager)
**Lösning:** Ett tunt lager — limstiftet ska knappt synas

## Byta platta

1. **Låt plattan svalna** till rumstemperatur (eller använd handskar — plattan kan vara varm)
2. Lyft plattan från framsidan och dra ut den
3. Lägg in ny platta — magneten håller den på plats
4. **Kör automatisk kalibrering** (Flow Rate och Bed Leveling) efter plattbyte i Bambu Studio eller via instrumentpanelen under **Kontroller → Kalibrering**

:::info Kom ihåg att kalibrera efter byte
Plattorna har lite olika tjocklek. Utan kalibrering kan första lagret bli för långt ifrån eller krascha in i plattan.
:::

## Underhåll av plattor

### Rengöring (efter var 2–5 utskrift)
- Torka av med IPA (isopropanol 70–99%) och ett luddfritt torkpapper
- Undvik att ta på ytan med bara händer — fett från huden minskar vidhäftningen
- För Textured PEI: tvätta med ljummet vatten och mild diskmedel efter många utskrifter

### Ta bort limstiftrester
- Värm upp plattan till 60°C
- Torka av med fuktig trasa
- Avsluta med IPA-torkning

### Utbyte
Byt plattan när du ser:
- Synliga gropar eller märken efter borttagning av utskrifter
- Konsekvent dålig vidhäftning även efter rengöring
- Bubblor eller fläckar i beläggningen

Bambu-plattor håller typiskt 200–500 utskrifter beroende på filamenttyp och behandling.

:::tip Förvara plattorna rätt
Förvara oanvända plattor i originalförpackningen eller stående i en hållare — inte staplade med tunga saker ovanpå. Deformerade plattor ger ojämnt första lager.
:::
