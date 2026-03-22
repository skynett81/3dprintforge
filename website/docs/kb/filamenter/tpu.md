---
sidebar_position: 4
title: TPU
description: Guide til TPU-printing — temperatur, hastighet og retract-innstillinger
---

# TPU

TPU (Thermoplastic Polyurethane) er et fleksibelt materiale brukt til deksler, pakninger, hjul og andre deler som krever elastisitet.

## Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 220–240 °C |
| Sengtemperatur | 30–45 °C |
| Del-kjøling | 50–80% |
| Hastighet | 30–50% (VIKTIG) |
| Retract | Minimal eller deaktivert |
| Tørking | Anbefalt (6–8 t ved 60 °C) |

:::danger Lav hastighet er kritisk
TPU må printes sakte. For høy hastighet fører til at materialet komprimeres i extruderen og skaper stopp. Start med 30% hastighet og øk forsiktig.
:::

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Textured PEI | Utmerket | Nei |
| Cool Plate (Smooth PEI) | Bra | Nei |
| Engineering Plate | Bra | Nei |

## Retract-innstillinger

TPU er elastisk og reagerer dårlig på aggressiv retract:

- **Direct drive (X1C/P1S/A1):** Retract 0.5–1.0 mm, 25 mm/s
- **Bowden (unngå med TPU):** Meget krevende, anbefales ikke

For svært myk TPU (Shore A 85 eller lavere): deaktiver retract helt og stol på temperatur- og hastighetskontroll.

## Tips

- **Tørk filamentet** — fuktig TPU er ekstremt vanskelig å printe
- **Bruk direkte extruder** — Bambu Lab P1S/X1C/A1 har alle direct drive
- **Unngå høy temperatur** — over 250 °C degraderes TPU og gir misfarget print
- **Helling** — TPU heller mot å danne strenger; senk temperatur 5 °C eller øk kjøling

:::tip Shore-hardhet
TPU finnes i ulike Shore-hardheter (A85, A95, A98). Jo lavere Shore A, jo mykere og mer krevende å printe. Bambu Lab sin TPU er Shore A 95 — et godt startpunkt.
:::

## Oppbevaring

TPU er svært hygroskopisk (trekker til seg fuktighet). Fuktig TPU gir:
- Bobler og hissing
- Svak og sprø print (paradoksalt for et fleksibelt material)
- Stringing

**Tørk alltid TPU** ved 60 °C i 6–8 timer før printing. Oppbevar i forseglet boks med silikagel.
