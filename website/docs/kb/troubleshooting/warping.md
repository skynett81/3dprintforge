---
sidebar_position: 2
title: Warping
description: Årsaker til warping og løsninger — innelukke, brim, temperatur og draft shield
---

# Warping

Warping oppstår når hjørner eller kanter av printen løfter seg fra platen under eller etter printing. Det skyldes termisk krymping av materialet.

## Hva er warping?

Når plasten avkjøles krymper den. Øverste lag er varmere enn nedre lag — dette skaper spenning som trekker kantene oppover og bøyer printen. Jo større temperaturforskjell, jo mer warping.

## Materialer mest utsatt

| Materiale | Warpingrisiko | Krever innelukke |
|-----------|-------------|-----------------|
| PLA | Lav | Nei |
| PETG | Lav–Moderat | Nei |
| ABS | Høy | Ja |
| ASA | Høy | Ja |
| PA/Nylon | Svært høy | Ja |
| PC | Svært høy | Ja |
| TPU | Lav | Nei |

## Løsninger

### 1. Bruk innelukke (kammer)

Det viktigste tiltaket for ABS, ASA, PA og PC:
- Hold kammertemperatur 40–55 °C for best resultat
- X1C og P1S: aktiver kammervifter i "lukket" modus
- A1/P1P: bruk en dekselkappe for å holde varmen

### 2. Bruk brim

Brim er et enkelt lag med ekstra brede kanter som holder printen fast i platen:

```
Bambu Studio:
1. Velg printen i slicer
2. Gå til Support → Brim
3. Sett bredde til 5–10 mm (jo mer warping, jo bredre)
4. Type: Outer Brim Only (anbefalt)
```

:::tip Brim-bredde guide
- PLA (sjeldent nødvendig): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Øk sengtemperatur

Høyere sengtemperatur reduserer temperaturforskjellen mellom lag:
- ABS: Prøv 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Reduser del-kjøling

For materialer med warping-tendens — senk eller deaktiver del-kjøling:
- ABS/ASA: 0–20% del-kjøling
- PA: 0–30% del-kjøling

### 5. Unngå trekk og kald luft

Hold printeren unna:
- Vinduer og ytterdører
- Klimaanlegg og vifter
- Trekk i rommet

For P1P og A1: dekk til åpninger med kartong under kritiske prints.

### 6. Draft Shield

En draft shield er en tynn vegg rundt objektet som holder varmen inne:

```
Bambu Studio:
1. Gå til Support → Draft Shield
2. Aktiver og sett avstand (3–5 mm)
```

Særlig nyttig for høye, slanke objekter.

### 7. Modelldesign-tiltak

Ved design av egne modeller:
- Unngå store flate bunner (legg til chamfer/runding i hjørner)
- Del opp store flate deler i mindre seksjoner
- Bruk "mouse ears" — små sirkler i hjørner — i slicer eller CAD

## Warping etter avkjøling

Noen ganger ser printen fin ut, men warpingen oppstår etter at den er fjernet fra platen:
- Vent alltid til platen og printen er **helt avkjølt** (under 40 °C) før fjerning
- For ABS: la avkjøle inne i lukket kammer for langsommere avkjøling
- Unngå å sette varm print på kald overflate
