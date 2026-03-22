---
sidebar_position: 5
title: Skrivarkontroll
description: Styr temperatur, hastighet, fläktar och skicka G-code direkt till skrivaren
---

# Skrivarkontroll

Kontrollpanelen ger dig full manuell kontroll över skrivaren direkt från dashboardet.

## Temperaturstyring

### Munstycke
- Ange måltemperatur mellan 0–350 °C
- Klicka **Ange** för att skicka kommandot
- Realtidsavläsning visas med animerad ringmätare

### Värmebädd
- Ange måltemperatur mellan 0–120 °C
- Automatisk avstängning efter utskrift (konfigurerbart)

### Kammare
- Se kammartemperatur (realtidsavläsning)
- **X1E, H2S, H2D, H2C**: Aktiv kammarvärmestyrning via M141 (kontrollerbar måltemperatur)
- **X1C**: Passiv inkapsling — kammartemperatur visas men kan inte styras direkt
- **P1S**: Passiv inkapsling — visar temperatur, ingen aktiv kammarvärmestyrning
- **P1P, A1, A1 mini och H-serien utan chamberHeat**: Ingen kammarsensor

:::warning Max temperaturer
Överskrid inte rekommenderade temperaturer för munstycke och bädd. För härdat stål-munstycke (HF-typ): max 300 °C. För mässing: max 260 °C. Se skrivarens manual.
:::

## Hastighetsprofiler

Hastighetskontrollen erbjuder fyra förinställda profiler:

| Profil | Hastighet | Användningsområde |
|--------|----------|-------------|
| Tyst | 50% | Bullerminskning, nattutskrift |
| Standard | 100% | Normal användning |
| Sport | 124% | Snabbare utskrifter |
| Turbo | 166% | Max hastighet (kvalitetsförsämring) |

Skjutreglaget låter dig ange en anpassad procentsats mellan 50–200%.

## Fläktkontroll

Kontrollera fläkthastigheter manuellt:

| Fläkt | Beskrivning | Område |
|-------|-------------|--------|
| Part cooling fan | Kyler det utskrivna objektet | 0–100% |
| Auxiliary fan | Kammarcirkulation | 0–100% |
| Chamber fan | Aktiv kammerkylning | 0–100% |

:::tip Bra inställningar
- **PLA/PETG:** Del-kylning 100%, aux 30%
- **ABS/ASA:** Del-kylning 0–20%, kammerfläkt av
- **TPU:** Del-kylning 50%, låg hastighet
:::

## G-code-konsol

Skicka G-code-kommandon direkt till skrivaren:

```gcode
; Exempel: Flytta huvud position
G28 ; Hem alla axlar
G1 X150 Y150 Z10 F3000 ; Flytta till mitten
M104 S220 ; Ange munstyckstemperatur
M140 S60  ; Ange bäddtemperatur
```

:::danger Var försiktig med G-code
Felaktig G-code kan skada skrivaren. Skicka bara kommandon du förstår. Undvik `M600` (filamentbyte) mitt i en utskrift.
:::

## Filamentoperationer

Från kontrollpanelen kan du:

- **Ladda filament** — värmer upp munstycket och drar in filament
- **Lossa filament** — värmer upp och drar ut filament
- **Rengör munstycke** — kör rengöringscykel

## Makron

Spara och kör sekvenser av G-code-kommandon som makron:

1. Klicka **Nytt makro**
2. Ge makrot ett namn
3. Skriv G-code-sekvensen
4. Spara och kör med ett klick

Exempelmakro för bäddkalibrering:
```gcode
G28
M84
M500
```

## Utskriftskontroll

Under aktiv utskrift kan du:

- **Pausa** — sätter utskriften på paus efter aktuellt lager
- **Återuppta** — fortsätter en pausad utskrift
- **Stopp** — avbryter utskriften (inte reversibelt)
- **Nödstopp** — omedelbart stopp av alla motorer
