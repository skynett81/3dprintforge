---
sidebar_position: 5
title: PA / Nylon
description: Guide till nylonutonskrift — torkning, limstift, inställningar och varianter
---

# PA / Nylon

Nylon (Polyamid / PA) är ett av de starkaste och mest slittåliga 3D-utskriftsmaterialen. Det är idealiskt för mekaniska delar, kugghjul, lager och andra högt belastade delar.

## Inställningar

| Parameter | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Munstycketemperatur | 260–280 °C | 250–270 °C | 270–290 °C |
| Bäddtemperatur | 70–90 °C | 60–80 °C | 80–100 °C |
| Delavkylning | 0–30% | 0–30% | 0–20% |
| Torkning (krävs) | 80 °C / 8–12 t | 80 °C / 8 t | 80 °C / 12 t |

## Torkning — kritisk för nylon

Nylon är **extremt hygroskopiskt**. Det absorberar fukt från luften på timmar.

:::danger Torka alltid nylon
Fuktigt nylon ger dåliga resultat — svag utskrift, bubblor, bubblande yta och dålig lagfusion. Torka nylon **omedelbart** före utskrift, och använd det inom några timmar efteråt.

- **Temperatur:** 75–85 °C
- **Tid:** 8–12 timmar
- **Metod:** Filamenttorkare eller ugn med fläkt
:::

Bambu AMS rekommenderas inte för nylon utan förseglad och torr konfiguration. Använd extern filamentmatare direkt till skrivaren om möjligt.

## Byggplattor

| Platta | Lämplighet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmärkt | Ja (krävs) |
| High Temp Plate | Bra | Ja (krävs) |
| Cool Plate | Dålig | — |

:::warning Limstift krävs
Nylon häftar dåligt utan limstift. Använd ett tunt, jämnt lager limstift (Bambu Lab eller Pritt stick). Utan limstift lyfter nylon sig från plattan.
:::

## Warping

Nylon warpar avsevärt:
- Använd brim (8–15 mm)
- Stäng kammaren (X1C/P1S ger bäst resultat)
- Undvik stora platta delar utan brim
- Håll ventilationen minimal

## Varianter

### PA6 (Nylon 6)
Vanligast, god styrka och flexibilitet. Absorberar mycket fukt.

### PA12 (Nylon 12)
Mer dimensionsstabil och absorberar något mindre fukt än PA6. Lättare att skriva ut.

### PA-CF (kolfiberförstärkt)
Mycket styv och lätt. Kräver härdat stålmunstycke. Skrivs ut torrare än standard nylon.

### PA-GF (glasfiberfyllt)
God styvhet till lägre kostnad än CF. Kräver härdat stålmunstycke.

## Förvaring

Förvara nylon i förseglad låda med aggressivt silikagel. Bambu Labs torkbox är idealisk. Lämna aldrig nylon öppet över natten.
