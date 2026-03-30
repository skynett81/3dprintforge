---
sidebar_position: 5
title: Printerbesturing
description: Stuur temperatuur, snelheid, ventilatoren en stuur G-code rechtstreeks naar de printer
---

# Printerbesturing

Het bedieningspaneel geeft u volledige handmatige controle over de printer direct vanuit het dashboard.

## Temperatuursturing

### Spuitmond
- Stel de doeltemperatuur in tussen 0–350 °C
- Klik op **Instellen** om de opdracht te sturen
- Realtime meting wordt weergegeven met een geanimeerde ringmeter

### Verwarmingsbed
- Stel de doeltemperatuur in tussen 0–120 °C
- Automatisch uitschakelen na het printen (configureerbaar)

### Kamer
- Bekijk de kamertemperatuur (realtime meting)
- **X1E, H2S, H2D, H2C**: Actieve kamerverwarmingssturing via M141 (instelbare doeltemperatuur)
- **X1C**: Passieve behuizing — kamertemperatuur wordt weergegeven, maar kan niet direct worden gestuurd
- **P1S**: Passieve behuizing — toont temperatuur, geen actieve kamerverwarmingssturing
- **P1P, A1, A1 mini en H-serie zonder chamberHeat**: Geen kamersensor

:::warning Maximale temperaturen
Overschrijd niet de aanbevolen temperaturen voor spuitmond en bed. Voor gehard staal spuitmond (HF-type): max 300 °C. Voor messing: max 260 °C. Zie de handleiding van de printer.
:::

## Snelheidsprofielen

De snelheidsbesturing biedt vier vooraf ingestelde profielen:

| Profiel | Snelheid | Gebruik |
|--------|----------|-------------|
| Stil | 50% | Geluidsreductie, nachtprinting |
| Standaard | 100% | Normaal gebruik |
| Sport | 124% | Snellere prints |
| Turbo | 166% | Maximale snelheid (kwaliteitsverlies) |

Met de schuifregelaar kunt u een aangepast percentage instellen tussen 50–200%.

## Ventilatorbesturing

Bedien de ventilatorsnelheden handmatig:

| Ventilator | Beschrijving | Bereik |
|-------|-------------|--------|
| Part cooling fan | Koelt het geprinte object | 0–100% |
| Auxiliary fan | Kamercirculatie | 0–100% |
| Chamber fan | Actieve kamerkoeling | 0–100% |

:::tip Goede instellingen
- **PLA/PETG:** Part cooling 100%, aux 30%
- **ABS/ASA:** Part cooling 0–20%, chamber fan uit
- **TPU:** Part cooling 50%, lage snelheid
:::

## G-code console

Stuur G-code-opdrachten rechtstreeks naar de printer:

```gcode
; Voorbeeld: Koppositie verplaatsen
G28 ; Alle assen homen
G1 X150 Y150 Z10 F3000 ; Naar het midden verplaatsen
M104 S220 ; Spuitmondtemperatuur instellen
M140 S60  ; Bedtemperatuur instellen
```

:::danger Wees voorzichtig met G-code
Onjuiste G-code kan de printer beschadigen. Stuur alleen opdrachten die u begrijpt. Vermijd `M600` (filamentwisseling) midden in een print.
:::

## Filamentbewerkingen

Vanuit het bedieningspaneel kunt u:

- **Filament laden** — verwarmt de spuitmond op en trekt filament in
- **Filament verwijderen** — verwarmt op en trekt filament eruit
- **Spuitmond reinigen** — reinigingscyclus uitvoeren

## Macro's

Sla reeksen G-code-opdrachten op en voer ze uit als macro's:

1. Klik op **Nieuwe macro**
2. Geef de macro een naam
3. Schrijf de G-code-reeks
4. Opslaan en uitvoeren met één klik

Voorbeeldmacro voor bedkalibrering:
```gcode
G28
M84
M500
```

## Printbesturing

Tijdens een actieve print kunt u:

- **Pauzeren** — zet de print op pauze na de huidige laag
- **Hervatten** — hervat een gepauzeerde print
- **Stoppen** — breekt de print af (niet omkeerbaar)
- **Noodstop** — onmiddellijke stop van alle motoren
