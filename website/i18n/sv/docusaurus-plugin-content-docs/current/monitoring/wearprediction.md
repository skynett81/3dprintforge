---
sidebar_position: 5
title: Slitageprediktion
description: Prediktiv analys av 8 skrivarkomponenter med livslängdsberäkning, underhållsaviseringar och kostnadsprognos
---

# Slitageprediktion

Slitageprediktionen beräknar förväntad livslängd för kritiska komponenter baserat på faktisk användning, filamenttyp och skrivarens beteende — så att du kan planera underhåll proaktivt snarare än reaktivt.

Gå till: **https://localhost:3443/#wear**

## Övervakade komponenter

Bambu Dashboard spårar slitage på 8 komponenter per skrivare:

| Komponent | Primär slitagefaktor | Typisk livslängd |
|---|---|---|
| **Munstycke (mässing)** | Filamenttyp + timmar | 300–800 timmar |
| **Munstycke (hardened)** | Timmar + abrasivt material | 1500–3000 timmar |
| **PTFE-rör** | Timmar + hög temperatur | 500–1500 timmar |
| **Extruder-kugghjul** | Timmar + abrasivt material | 1000–2000 timmar |
| **X-axel-stång (CNC)** | Antal utskrifter + hastighet | 2000–5000 timmar |
| **Byggplattans yta** | Antal utskrifter + temperatur | 200–500 utskrifter |
| **AMS-kugghjul** | Antal filamentbyten | 5000–15000 byten |
| **Kammerfläktar** | Timmar i drift | 3000–8000 timmar |

## Slitageberäkning

Slitage beräknas som en samlad procent (0–100 % slitet):

```
Slitage % = (faktisk användning / förväntad livslängd) × 100
           × materialmultiplikator
           × hastighetsmultiplikator
```

**Materialmultiplikatorer:**
- PLA, PETG: 1.0× (normalt slitage)
- ABS, ASA: 1.1× (lite mer aggressivt)
- PA, PC: 1.2× (hårt på PTFE och munstycke)
- CF/GF-kompositer: 2.0–3.0× (mycket abrasivt)

:::warning Kolfibrer
Kolfiberförstärkta filament (CF-PLA, CF-PA, osv.) sliter ned mässingsmunstycken extremt snabbt. Använd härdat stål-munstycke och räkna med 2–3× snabbare slitage.
:::

## Livslängdsberäkning

För varje komponent visas:

- **Nuvarande slitage** — procent använt
- **Uppskattad återstående livslängd** — timmar eller utskrifter
- **Uppskattat slutdatum** — baserat på genomsnittlig användning senaste 30 dagarna
- **Konfidensintervall** — osäkerhetsmarginal för prediktionen

Klicka på en komponent för att se detaljerad graf över slitageackumulering över tid.

## Aviseringar

Konfigurera automatiska aviseringar per komponent:

1. Gå till **Slitage → Inställningar**
2. För varje komponent, ange **Aviseringströskel** (rekommenderat: 75 % och 90 %)
3. Välj aviseringskanal (se [Aviseringar](../features/notifications))

**Exempel på aviseringsmeddelande:**
> ⚠️ Munstycke (mässing) på Min X1C är 78 % slitet. Uppskattad livslängd: ~45 timmar. Rekommenderat: Planera munstyckesbyte.

## Underhållskostnad

Slitagemodhulen integrerar med kostnadsloggen:

- **Kostnad per komponent** — pris på reservdel
- **Total utbytesskostnad** — summa för alla komponenter som närmar sig gränsen
- **Prognos nästa 6 månader** — uppskattad underhållskostnad framöver

Ange komponentpriser under **Slitage → Priser**:

1. Klicka **Ange priser**
2. Fyll i pris per enhet för varje komponent
3. Priset används i kostnadsprognoser och kan variera per skrivarmodell

## Återställa slitageräknare

Efter underhåll, återställ räknaren för den aktuella komponenten:

1. Gå till **Slitage → [Komponentnamn]**
2. Klicka **Markera som ersatt**
3. Fyll i:
   - Datum för byte
   - Kostnad (valfritt)
   - Anteckning (valfritt)
4. Slitageräknaren nollställs och beräknas om

Återställningar visas i underhållshistoriken.

:::tip Kalibrering
Jämför slitageprediktionen med faktiska erfarenhetsdata och justera livslängdsparametrarna under **Slitage → Konfigurera livslängd** för att anpassa beräkningarna till din faktiska användning.
:::
