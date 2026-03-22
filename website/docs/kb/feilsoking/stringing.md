---
sidebar_position: 3
title: Stringing
description: Årsaker til stringing og løsninger — retract, temperatur og tørking
---

# Stringing

Stringing (eller "oozing") er tynne plaststråder som dannes mellom separate deler av objektet mens dysen beveger seg uten å extrude. Det gir et "edderkopp-nett"-lignende utseende på printen.

## Årsaker til stringing

1. **For høy dysetemperatur** — varm plast er flytende og drypper
2. **Dårlig retract-innstillinger** — filamentet trekkes ikke raskt nok tilbake
3. **Fuktig filament** — fuktighet forårsaker damp og ekstra flyt
4. **For lav hastighet** — dysen er lenge i transit-posisjoner

## Diagnose

**Fuktig filament?** Hører du en knatrende/poppende lyd under printing? Da er filamentet fuktig — tørk det først før du justerer andre innstillinger.

**For høy temp?** Ser du drypp fra dysen i "pause"-øyeblikk? Senk temperaturen 5–10 °C.

## Løsninger

### 1. Tørk filamentet

Fuktig filament er den vanligste årsaken til stringing som ikke lar seg justere bort:

| Materiale | Tørketemperatur | Tid |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 timer |
| PETG | 60–65 °C | 6–8 timer |
| TPU | 55–60 °C | 6–8 timer |
| PA | 75–85 °C | 8–12 timer |

### 2. Senk dysetemperatur

Start med å senke 5 °C om gangen:
- PLA: prøv 210–215 °C (ned fra 220 °C)
- PETG: prøv 235–240 °C (ned fra 245 °C)

:::warning For lav temp gir dårlig lagfusing
Senk temperaturen forsiktig. For lav temperatur gir dårlig lagfusing, svak print og extuderingsproblemer.
:::

### 3. Juster retract-innstillinger

Retract trekker filamentet tilbake i dysen under "travel"-bevegelse for å forhindre drypp:

```
Bambu Studio → Filament → Retract:
- Retract-avstand: 0.4–1.0 mm (direct drive)
- Retract-hastighet: 30–45 mm/s
```

:::tip Bambu Lab printere har direct drive
Alle Bambu Lab-printere (X1C, P1S, A1) bruker direct drive extruder. Direct drive krever **kortere** retract-avstand enn Bowden-systemer (typisk 0.5–1.5 mm vs. 3–7 mm).
:::

### 4. Øk travel-hastighet

Rask bevegelse mellom punkter gir dysen kortere tid til å dryppe:
- Øk "travel speed" til 200–300 mm/s
- Bambu Lab-printere håndterer dette godt

### 5. Aktiver "Avoid Crossing Perimeters"

Slicer-innstilling som gjør at dysen unngår å krysse åpne områder der stringing vil bli synlig:
```
Bambu Studio → Kvalitet → Avoid crossing perimeters
```

### 6. Senk hastigheten (for TPU)

For TPU er løsningen motsatt av andre materialer:
- Senk print-hastigheten til 20–35 mm/s
- TPU er elastisk og komprimeres ved for høy hastighet — dette gir "etterflyt"

## Etter justeringer

Test med en standard stringing-test-modell (f.eks. "torture tower" fra MakerWorld). Juster én variabel om gangen og observer endringen.

:::note Perfekt er sjelden mulig
Noe stringing er normalt for de fleste materialer. Fokuser på å redusere til akseptabelt nivå, ikke eliminere helt. PETG vil alltid ha litt mer stringing enn PLA.
:::
