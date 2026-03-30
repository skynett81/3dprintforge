---
sidebar_position: 2
title: Warping
description: Orsaker till warping och lösningar — kammer, brim, temperatur och draft shield
---

# Warping

Warping uppstår när hörn eller kanter av utskriften lyfter sig från plattan under eller efter utskrift. Det beror på termisk krympning av materialet.

## Vad är warping?

När plasten kyls krymper den. Översta lagret är varmare än undre lagret — detta skapar spänning som drar kanterna uppåt och böjer utskriften. Ju större temperaturdifferens, desto mer warping.

## Material som är mest utsatta

| Material | Warpingrisk | Kräver kammer |
|-----------|-------------|-----------------|
| PLA | Låg | Nej |
| PETG | Låg–Måttlig | Nej |
| ABS | Hög | Ja |
| ASA | Hög | Ja |
| PA/Nylon | Mycket hög | Ja |
| PC | Mycket hög | Ja |
| TPU | Låg | Nej |

## Lösningar

### 1. Använd kammer

Den viktigaste åtgärden för ABS, ASA, PA och PC:
- Håll kammartemperaturen 40–55 °C för bästa resultat
- X1C och P1S: aktivera kammarfläktar i «stängt» läge
- A1/P1P: använd ett lock/kåpa för att hålla värmen

### 2. Använd brim

Brim är ett enkelt lager med extra breda kanter som håller utskriften fast i plattan:

```
Bambu Studio:
1. Välj utskriften i slicer
2. Gå till Support → Brim
3. Ange bredd till 5–10 mm (ju mer warping, desto bredare)
4. Typ: Outer Brim Only (rekommenderas)
```

:::tip Brim-bredd guide
- PLA (sällan nödvändigt): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Öka bäddtemperatur

Högre bäddtemperatur minskar temperaturdifferensen mellan lager:
- ABS: Prova 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Minska delavkylning

För material med warptendens — sänk eller inaktivera delavkylning:
- ABS/ASA: 0–20% delavkylning
- PA: 0–30% delavkylning

### 5. Undvik drag och kall luft

Håll skrivaren borta från:
- Fönster och ytterdörrar
- Luftkonditionering och fläktar
- Drag i rummet

För P1P och A1: täck öppningar med kartong under kritiska utskrifter.

### 6. Draft Shield

En draft shield är en tunn vägg runt objektet som håller värmen inne:

```
Bambu Studio:
1. Gå till Support → Draft Shield
2. Aktivera och ange avstånd (3–5 mm)
```

Särskilt användbart för höga, smala objekt.

### 7. Modelldesignåtgärder

Vid design av egna modeller:
- Undvik stora platta bottnar (lägg till avfasning/rundning i hörn)
- Dela upp stora platta delar i mindre sektioner
- Använd «mouse ears» — små cirklar i hörn — i slicer eller CAD

## Warping efter avkylning

Ibland ser utskriften bra ut, men warpingen uppstår efter att den tagits bort från plattan:
- Vänta alltid tills plattan och utskriften är **helt avkylda** (under 40 °C) innan borttagning
- För ABS: låt svalna inuti stängd kammer för långsammare avkylning
- Undvik att sätta varm utskrift på kall yta
