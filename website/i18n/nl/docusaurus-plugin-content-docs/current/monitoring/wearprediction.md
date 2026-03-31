---
sidebar_position: 5
title: Slijtagevoorspelling
description: Voorspellende analyse van 8 printercomponenten met levensduurberekening, onderhoudsmeldingen en kostenprognose
---

# Slijtagevoorspelling

De slijtagevoorspelling berekent de verwachte levensduur van kritieke componenten op basis van werkelijk gebruik, filamenttype en printergedrag — zodat u onderhoud proactief kunt plannen in plaats van reactief.

Ga naar: **https://localhost:3443/#wear**

## Bewaakt componenten

3DPrintForge houdt de slijtage bij van 8 componenten per printer:

| Component | Primaire slijtageactor | Typische levensduur |
|---|---|---|
| **Spuit (messing)** | Filamenttype + uren | 300–800 uur |
| **Spuit (gehard)** | Uren + abrasief materiaal | 1500–3000 uur |
| **PTFE-buis** | Uren + hoge temperatuur | 500–1500 uur |
| **Extrudertandwiel** | Uren + abrasief materiaal | 1000–2000 uur |
| **X-as geleider (CNC)** | Aantal prints + snelheid | 2000–5000 uur |
| **Printbedoppervlak** | Aantal prints + temperatuur | 200–500 prints |
| **AMS-tandwielen** | Aantal filamentwisselingen | 5000–15000 wisselingen |
| **Kammerventilatoren** | Bedrijfsuren | 3000–8000 uur |

## Slijtageberekening

Slijtage wordt berekend als een gecombineerd percentage (0–100 % versleten):

```
Slijtage % = (werkelijk gebruik / verwachte levensduur) × 100
           × materiaalmultiplicator
           × snelheidsmultiplicator
```

**Materiaalmultiplicatoren:**
- PLA, PETG: 1.0× (normale slijtage)
- ABS, ASA: 1.1× (iets agressiever)
- PA, PC: 1.2× (zwaar voor PTFE en spuit)
- CF/GF-composieten: 2.0–3.0× (sterk abrasief)

:::warning Koolstofvezel
Koolstofvezelversterkte filamenten (CF-PLA, CF-PA, enz.) slijten messingen spuiten extreem snel. Gebruik een geharde stalen spuit en reken op 2–3× snellere slijtage.
:::

## Levensduurberekening

Voor elk component wordt weergegeven:

- **Huidige slijtage** — percentage verbruikt
- **Geschatte resterende levensduur** — uren of prints
- **Geschatte vervaldatum** — op basis van gemiddeld gebruik afgelopen 30 dagen
- **Betrouwbaarheidsinterval** — onzekerheidsmarges voor de voorspelling

Klik op een component om een gedetailleerde grafiek van de slijtageaccumulatie in de tijd te zien.

## Meldingen

Configureer automatische meldingen per component:

1. Ga naar **Slijtage → Instellingen**
2. Stel voor elk component de **Meldingsdrempel** in (aanbevolen: 75 % en 90 %)
3. Kies het meldingskanaal (zie [Meldingen](../features/notifications))

**Voorbeeld van een melding:**
> ⚠️ Spuit (messing) van Mijn X1C is 78 % versleten. Geschatte levensduur: ~45 uur. Aanbevolen: Plan een spuitverwisseling.

## Onderhoudskosten

De slijtagemodule integreert met het kostenlogboek:

- **Kosten per component** — prijs van het reserveonderdeel
- **Totale vervangingskosten** — som van alle componenten die de grens naderen
- **Prognose volgende 6 maanden** — geschatte toekomstige onderhoudskosten

Stel componentprijzen in via **Slijtage → Prijzen**:

1. Klik **Prijzen instellen**
2. Vul de prijs per eenheid in voor elk component
3. De prijs wordt gebruikt in kostenprognoses en kan per printermodel variëren

## Slijtagetellerreset

Na onderhoud, reset de teller voor het betreffende component:

1. Ga naar **Slijtage → [Componentnaam]**
2. Klik **Markeren als vervangen**
3. Vul in:
   - Datum van verwisseling
   - Kostprijs (optioneel)
   - Opmerking (optioneel)
4. De slijtagetellerl wordt gereset en opnieuw berekend

Resets worden weergegeven in de onderhoudsgeschiedenis.

:::tip Kalibratie
Vergelijk de slijtagevoorspelling met werkelijke ervaringsdata en pas de levensduurparameters aan via **Slijtage → Levensduur configureren** om de berekeningen af te stemmen op uw werkelijk gebruik.
:::
