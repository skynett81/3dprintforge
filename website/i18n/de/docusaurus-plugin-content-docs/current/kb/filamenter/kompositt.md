---
sidebar_position: 6
title: Verbundmaterialien (CF/GF)
description: Kohlefaser- und glasfasergefüllte Filamente — Hartstahlnagel-Düse, Verschleiß und Einstellungen
---

# Verbundmaterialien (CF/GF)

Verbundfilamente enthalten kurze Kohlefasern (CF) oder Glasfasern (GF), die in einen Basiskunststoff wie PLA, PETG, PA oder ABS eingemischt sind. Sie bieten erhöhte Steifigkeit, reduziertes Gewicht und bessere Dimensionsstabilität.

## Verfügbare Typen

| Filament | Basis | Steifigkeit | Gewichtsreduzierung | Schwierigkeit |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Hoch | Moderat | Einfach |
| PETG-CF | PETG | Hoch | Moderat | Moderat |
| PA6-CF | Nylon 6 | Sehr hoch | Gut | Anspruchsvoll |
| PA12-CF | Nylon 12 | Sehr hoch | Gut | Moderat |
| ABS-CF | ABS | Hoch | Moderat | Moderat |
| PLA-GF | PLA | Hoch | Moderat | Einfach |

## Hartstahlnagel-Düse ist erforderlich

:::danger Niemals Messingdüse mit CF/GF verwenden
Kohle- und Glasfasern sind äußerst abrasiv. Sie verschleißen eine Standard-Messingdüse in Stunden bis Tagen. Verwenden Sie immer eine **Hartstahl-Düse** (Hardened Steel) oder **HS01-Düse** mit allen CF- und GF-Materialien.

- Bambu Lab Hardened Steel Nozzle (0,4 mm)
- Bambu Lab HS01 Nozzle (Spezialbeschichtung, längere Lebensdauer)
:::

## Einstellungen (PA-CF Beispiel)

| Parameter | Wert |
|-----------|-------|
| Düsentemperatur | 270–290 °C |
| Betttemperatur | 80–100 °C |
| Teile-Kühlung | 0–20% |
| Geschwindigkeit | 80% |
| Trocknung | 80 °C / 12 Stunden |

Für PLA-CF: Düse 220–230 °C, Bett 35–50 °C — viel einfacher als PA-CF.

## Druckplatten

| Platte | Eignung | Klebestift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Ausgezeichnet | Ja (bei PA-Basis) |
| High Temp Plate | Gut | Ja |
| Cool Plate | Vermeiden (CF verkratzt) | — |
| Textured PEI | Gut | Ja |

:::warning Platte kann verkratzt werden
CF-Materialien können glatte Platten beim Entfernen verkratzen. Immer Engineering Plate oder Textured PEI verwenden. Den Druck nicht abziehen — die Platte vorsichtig biegen.
:::

## Oberflächenbehandlung

CF-Filamente liefern eine matte, kohlenstoffartige Oberfläche, die keine Lackierung benötigt. Die Oberfläche ist etwas porös und kann für eine glattere Oberfläche mit Epoxy imprägniert werden.

## Verschleiß und Düsenlebensdauer

| Düsentyp | Lebensdauer mit CF | Kosten |
|----------|---------------|---------|
| Messing (Standard) | Stunden–Tage | Niedrig |
| Hartstahl | 200–500 Stunden | Moderat |
| HS01 (Bambu) | 500–1000 Stunden | Hoch |

Düse bei sichtbarem Verschleiß wechseln: erweitertes Düsenloch, dünne Wände, schlechte Dimensionsgenauigkeit.

## Trocknung

CF-Varianten von PA und PETG erfordern Trocknung genauso wie die Basiswerkstoffe:
- **PLA-CF:** Trocknung empfohlen, aber nicht kritisch
- **PETG-CF:** 65 °C / 6–8 Stunden
- **PA-CF:** 80 °C / 12 Stunden — kritisch
