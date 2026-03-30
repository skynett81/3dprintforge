---
sidebar_position: 10
title: Kompatibilitetsmatris
description: Komplett översikt av materialkompatibilitet med Bambu Lab-plattor, skrivare och munstycken
---

# Kompatibilitetsmatris

Denna sida ger en komplett översikt av vilka material som fungerar med vilka byggplattor, skrivare och munstyckstyper. Använd tabellerna som referens när du planerar utskrifter med nya material.

---

## Material och byggplattor

| Material | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Limstift |
|----------|-----------|-------------------|-----------------|--------------|---------|
| PLA | Utmärkt | Bra | Ej rekommenderad | Bra | Nej |
| PLA+ | Utmärkt | Bra | Ej rekommenderad | Bra | Nej |
| PLA-CF | Utmärkt | Bra | Ej rekommenderad | Bra | Nej |
| PLA Silk | Utmärkt | Bra | Ej rekommenderad | Bra | Nej |
| PETG | Dålig | Utmärkt | Bra | Bra | Ja (Cool) |
| PETG-CF | Dålig | Utmärkt | Bra | Acceptabel | Ja (Cool) |
| ABS | Ej rekommenderad | Utmärkt | Bra | Acceptabel | Ja (HT) |
| ASA | Ej rekommenderad | Utmärkt | Bra | Acceptabel | Ja (HT) |
| TPU | Bra | Bra | Ej rekommenderad | Utmärkt | Nej |
| PA (Nylon) | Ej rekommenderad | Utmärkt | Bra | Dålig | Ja |
| PA-CF | Ej rekommenderad | Utmärkt | Bra | Dålig | Ja |
| PA-GF | Ej rekommenderad | Utmärkt | Bra | Dålig | Ja |
| PC | Ej rekommenderad | Acceptabel | Utmärkt | Ej rekommenderad | Ja (Eng) |
| PC-CF | Ej rekommenderad | Acceptabel | Utmärkt | Ej rekommenderad | Ja (Eng) |
| PVA | Utmärkt | Bra | Ej rekommenderad | Bra | Nej |
| HIPS | Ej rekommenderad | Bra | Bra | Acceptabel | Nej |
| PVB | Bra | Bra | Ej rekommenderad | Bra | Nej |

**Förklaring:**
- **Utmärkt** — fungerar optimalt, rekommenderad kombination
- **Bra** — fungerar bra, acceptabelt alternativ
- **Acceptabel** — fungerar, men inte idealiskt — kräver extra åtgärder
- **Dålig** — kan fungera med modifieringar, men ej rekommenderat
- **Ej rekommenderad** — dåliga resultat eller risk för skada på plattan

:::tip PETG och Cool Plate
PETG fäster **för bra** på Cool Plate (Smooth PEI) och kan riva av PEI-beläggningen när delen tas bort. Använd alltid limstift som separationsfilm, eller välj Engineering Plate.
:::

:::warning PC och plattval
PC kräver High Temp Plate på grund av de höga bäddtemperaturerna (100–120 °C). Andra plattor kan deformeras permanent vid dessa temperaturer.
:::

---

## Material och skrivare

| Material | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA+ | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| PETG | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PETG-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| ABS | Nej | Nej | Möjligt** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| ASA | Nej | Nej | Möjligt** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| TPU | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PA (Nylon) | Nej | Nej | Nej | Möjligt** | Möjligt** | Ja | Ja | Ja | Ja | Ja |
| PA-CF | Nej | Nej | Nej | Nej | Nej | Ja | Ja | Möjligt** | Möjligt** | Möjligt** |
| PA-GF | Nej | Nej | Nej | Nej | Nej | Ja | Ja | Möjligt** | Möjligt** | Möjligt** |
| PC | Nej | Nej | Nej | Möjligt** | Nej | Ja | Ja | Möjligt** | Möjligt** | Möjligt** |
| PC-CF | Nej | Nej | Nej | Nej | Nej | Ja | Ja | Nej | Nej | Nej |
| PVA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| HIPS | Nej | Nej | Möjligt** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |

**Förklaring:**
- **Ja** — fullt stöd och rekommenderat
- **Ja*** — kräver härdat stålmunstycke (HS01 eller motsvarande)
- **Möjligt**** — kan fungera med begränsningar, ej officiellt rekommenderat
- **Nej** — ej lämpligt (saknar hölje, för låga temperaturer osv.)

:::danger Höleskrav
Material som kräver hölje (ABS, ASA, PA, PC):
- **A1 och A1 Mini** har öppen ram — ej lämpliga
- **P1P** har öppen ram — kräver höljestillbehör
- **P1S** har hölje, men ingen aktiv kammaruppvärmning
- **X1C och X1E** har fullt hölje med aktiv uppvärmning — rekommenderas för krävande material
:::

---

## Material och munstyckstyper

| Material | Mässing (standard) | Härdat stål (HS01) | Hardened Steel |
|----------|--------------------|--------------------|----------------|
| PLA | Utmärkt | Utmärkt | Utmärkt |
| PLA+ | Utmärkt | Utmärkt | Utmärkt |
| PLA-CF | Använd ej | Utmärkt | Utmärkt |
| PLA Silk | Utmärkt | Utmärkt | Utmärkt |
| PETG | Utmärkt | Utmärkt | Utmärkt |
| PETG-CF | Använd ej | Utmärkt | Utmärkt |
| ABS | Utmärkt | Utmärkt | Utmärkt |
| ASA | Utmärkt | Utmärkt | Utmärkt |
| TPU | Utmärkt | Bra | Bra |
| PA (Nylon) | Bra | Utmärkt | Utmärkt |
| PA-CF | Använd ej | Utmärkt | Utmärkt |
| PA-GF | Använd ej | Utmärkt | Utmärkt |
| PC | Bra | Utmärkt | Utmärkt |
| PC-CF | Använd ej | Utmärkt | Utmärkt |
| PVA | Utmärkt | Bra | Bra |
| HIPS | Utmärkt | Utmärkt | Utmärkt |
| PVB | Utmärkt | Bra | Bra |

:::danger Kolfiber och glasfiber kräver härdat munstycke
Alla material med **-CF** (kolfiber) eller **-GF** (glasfiber) **kräver härdat stålmunstycke**. Mässing slits ut på timmar till dagar med dessa material. Bambu Lab HS01 rekommenderas.

Material som kräver härdat munstycke:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Mässing vs härdat stål för vanliga material
Mässingsmunstycke ger **bättre värmeledning** och därmed jämnare extrudering för vanliga material (PLA, PETG, ABS). Härdat stål fungerar bra, men kan kräva 5–10 °C högre temperatur. Använd mässing för dagligt bruk och byt till härdat stål för CF/GF-material.
:::

---

## Tips för materialbyten

Vid byte mellan material i AMS eller manuellt är korrekt purge viktigt för att undvika kontaminering.

### Rekommenderad purge-mängd

| Från → Till | Purge-mängd | Anmärkning |
|------------|------------|------------|
| PLA → PLA (annan färg) | 100–150 mm³ | Standard färgbyte |
| PLA → PETG | 200–300 mm³ | Temperaturökning, annorlunda flöde |
| PETG → PLA | 200–300 mm³ | Temperatursänkning |
| ABS → PLA | 300–400 mm³ | Stor temperaturskillnad |
| PLA → ABS | 300–400 mm³ | Stor temperaturskillnad |
| PA → PLA | 400–500 mm³ | Nylon dröjer sig kvar i hotend |
| PC → PLA | 400–500 mm³ | PC kräver grundlig purge |
| Mörk → Ljus färg | 200–300 mm³ | Mörkt pigment är svårt att rensa |
| Ljus → Mörk färg | 100–150 mm³ | Enklare övergång |

### Temperaturändring vid materialbyte

| Övergång | Rekommendation |
|----------|---------------|
| Kallt → Varmt (t.ex. PLA → ABS) | Värm upp till nytt material, purga grundligt |
| Varmt → Kallt (t.ex. ABS → PLA) | Purga först vid hög temp, sänk sedan |
| Liknande temperaturer (t.ex. PLA → PLA) | Standard purge |
| Stor skillnad (t.ex. PLA → PC) | Mellanstopp med PETG kan hjälpa |

:::warning Nylon och PC lämnar rester
PA (Nylon) och PC är särskilt svåra att purga ut. Efter användning av dessa material:
1. Purga med **PETG** eller **ABS** vid hög temperatur (260–280 °C)
2. Kör minst **500 mm³** purge-material
3. Inspektera extruderingen visuellt — den ska vara helt ren utan missfärgning
:::

---

## Snabbreferens — materialval

Osäker på vilket material du behöver? Använd denna guide:

| Behov | Rekommenderat material |
|-------|----------------------|
| Prototypning / daglig användning | PLA |
| Mekanisk hållfasthet | PETG, PLA Tough |
| Utomhusbruk | ASA |
| Värmebeständighet | ABS, ASA, PC |
| Flexibla delar | TPU |
| Maximal hållfasthet | PA-CF, PC-CF |
| Transparent | PETG (naturlig), PC (naturlig) |
| Estetik / dekoration | PLA Silk, PLA Sparkle |
| Snap-fit / levande gångjärn | PETG, PA |
| Matkontakt | PLA (med förbehåll) |
