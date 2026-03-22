---
sidebar_position: 4
title: TPU
description: Guide till TPU-utskrift — temperatur, hastighet och retraktionsinställningar
---

# TPU

TPU (Thermoplastic Polyurethane) är ett flexibelt material som används till skydd, packningar, hjul och andra delar som kräver elasticitet.

## Inställningar

| Parameter | Värde |
|-----------|-------|
| Munstycketemperatur | 220–240 °C |
| Bäddtemperatur | 30–45 °C |
| Delavkylning | 50–80% |
| Hastighet | 30–50% (VIKTIGT) |
| Retraktion | Minimal eller inaktiverad |
| Torkning | Rekommenderat (6–8 t vid 60 °C) |

:::danger Låg hastighet är kritisk
TPU måste skrivas ut långsamt. För hög hastighet leder till att materialet komprimeras i extrudern och skapar stopp. Börja med 30% hastighet och öka försiktigt.
:::

## Rekommenderade byggplattor

| Platta | Lämplighet | Limstift? |
|-------|---------|----------|
| Textured PEI | Utmärkt | Nej |
| Cool Plate (Smooth PEI) | Bra | Nej |
| Engineering Plate | Bra | Nej |

## Retraktionsinställningar

TPU är elastiskt och reagerar dåligt på aggressiv retraktion:

- **Direct drive (X1C/P1S/A1):** Retraktion 0.5–1.0 mm, 25 mm/s
- **Bowden (undvik med TPU):** Mycket krävande, rekommenderas inte

För mycket mjukt TPU (Shore A 85 eller lägre): inaktivera retraktion helt och förlita dig på temperatur- och hastighetskontroll.

## Tips

- **Torka filamentet** — fuktigt TPU är extremt svårt att skriva ut
- **Använd direct extruder** — Bambu Lab P1S/X1C/A1 har alla direct drive
- **Undvik hög temperatur** — över 250 °C degraderas TPU och ger missfärgad utskrift
- **Stringing** — TPU tenderar att bilda strängar; sänk temperaturen 5 °C eller öka kylningen

:::tip Shore-hårdhet
TPU finns i olika Shore-hårdheter (A85, A95, A98). Ju lägre Shore A, desto mjukare och mer krävande att skriva ut. Bambu Labs TPU är Shore A 95 — en bra startpunkt.
:::

## Förvaring

TPU är mycket hygroskopiskt (absorberar fukt). Fuktigt TPU ger:
- Bubblor och väsning
- Svag och skör utskrift (paradoxalt för ett flexibelt material)
- Stringing

**Torka alltid TPU** vid 60 °C i 6–8 timmar före utskrift. Förvara i förseglad låda med silikagel.
