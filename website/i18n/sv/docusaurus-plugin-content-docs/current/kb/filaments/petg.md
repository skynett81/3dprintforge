---
sidebar_position: 2
title: PETG
description: Guide till PETG-utskrift — temperatur, VIKTIGT om limstift, platta och tips
---

# PETG

PETG (Polyethylene Terephthalate Glycol) är ett populärt material för funktionella delar. Det är starkare och mer värmestabilt än PLA, och tål lätt kemisk exponering.

## Inställningar

| Parameter | Värde |
|-----------|-------|
| Munstycketemperatur | 230–250 °C |
| Bäddtemperatur | 70–85 °C |
| Delavkylning | 30–60% |
| Hastighet | Standard |
| Torkning | Rekommenderat (6–8 t vid 65 °C) |

## Rekommenderade byggplattor

| Platta | Lämplighet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmärkt | Nej/Ja* |
| Textured PEI | Bra | Ja** |
| Cool Plate (Smooth PEI) | Se varning | Se varning |
| High Temp Plate | Bra | Ja |

:::danger VIKTIGT: Limstift på Smooth PEI med PETG
PETG häftar **extremt starkt** på Smooth PEI (Cool Plate). Utan limstift riskerar du att **riva av beläggningen från plattan** när du tar bort utskriften. Använd alltid ett tunt lager limstift på Smooth PEI när du skriver ut PETG — detta fungerar som en barriär.

**Alternativt:** Använd Engineering Plate eller Textured PEI — dessa ger bra vidhäftning utan att skada plattan.
:::

## Tips för lyckad utskrift

- **Minska delavkylning** — för mycket kylning ger lagdelning och skör utskrift
- **Öka munstycketemperatur** — vid stringing, försök sänka 5–10 °C; vid dålig lagfusion, öka
- **Första lagrets bäddtemperatur** — 80–85 °C för god vidhäftning, sänk till 70 °C efter första lagret
- **Sänk hastigheten** — PETG är mer krävande än PLA, börja med 80% hastighet

:::warning Stringing
PETG är benäget för stringing. Öka retraktionsavståndet (försök 0.8–1.5 mm för direct drive), öka retraktionshastigheten, och sänk munstycketemperaturen 5 °C i taget.
:::

## Torkning

PETG absorberar fukt snabbare än PLA. Fuktigt PETG ger:
- Bubblor och väsning under utskrift
- Svaga lager med porös yta
- Ökad stringing

**Torka vid 65 °C i 6–8 timmar** före utskrift, särskilt om spolen har legat öppen länge.

## Förvaring

Förvara alltid i förseglad påse eller torkbox med silikagel. PETG bör inte stå öppet mer än några dagar i fuktig miljö.
