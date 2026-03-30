---
sidebar_position: 4
title: Die richtige Bauplatte wählen
description: Übersicht über Bambu Labs Bauplatten und welche am besten zu Ihrem Filament passt
---

# Die richtige Bauplatte wählen

Die richtige Bauplatte ist entscheidend für gute Haftung und einfaches Ablösen des Drucks. Die falsche Kombination führt entweder zu schlechter Haftung oder dazu, dass der Druck festsitzt und die Platte beschädigt.

## Übersichtstabelle

| Filament | Empfohlene Platte | Klebestift | Plattentemperatur |
|----------|-------------------|------------|-------------------|
| PLA | Cool Plate / Textured PEI | Nein / Ja | 35–45°C |
| PETG | Textured PEI | **Ja (erforderlich)** | 70°C |
| ABS | Engineering Plate / High Temp | Ja | 90–110°C |
| ASA | Engineering Plate / High Temp | Ja | 90–110°C |
| TPU | Textured PEI | Nein | 35–45°C |
| PA (Nylon) | Engineering Plate | Ja | 90°C |
| PC | High Temp Plate | Ja | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Ja | 45–90°C |
| PVA | Cool Plate | Nein | 35°C |

## Plattenbeschreibung

### Cool Plate (Glatte PEI)
**Am besten für:** PLA, PVA
**Oberfläche:** Glatt, gibt dem Druck eine glatte Unterseite
**Ablösung:** Platte leicht biegen oder abkühlen lassen — der Druck löst sich von selbst

Verwenden Sie die Cool Plate nicht mit PETG — es haftet **zu stark** und kann die Beschichtung von der Platte reißen.

### Textured PEI (Strukturiert)
**Am besten für:** PETG, TPU, PLA (gibt raue Oberfläche)
**Oberfläche:** Strukturiert, gibt dem Druck eine raue und ästhetische Unterseite
**Ablösung:** Auf Raumtemperatur abkühlen lassen — löst sich von selbst

:::warning PETG erfordert Klebestift auf Textured PEI
Ohne Klebestift haftet PETG extrem stark an Textured PEI und kann beim Ablösen die Beschichtung abschälen. Tragen Sie immer eine dünne Schicht Klebestift (Bambu-Klebestift oder Elmer's Disappearing Purple Glue) auf der gesamten Oberfläche auf.
:::

### Engineering Plate
**Am besten für:** ABS, ASA, PA, PLA-CF, PETG-CF
**Oberfläche:** Hat eine matte PEI-Oberfläche mit geringerer Haftung als Textured PEI
**Ablösung:** Leicht zu entfernen nach dem Abkühlen. Klebestift für ABS/ASA verwenden

### High Temp Plate
**Am besten für:** PC, PA-CF, ABS bei hohen Temperaturen
**Oberfläche:** Verträgt Plattentemperaturen bis 120°C ohne Verformung
**Ablösung:** Auf Raumtemperatur abkühlen lassen

## Häufige Fehler

### PETG auf glatter Cool Plate (ohne Klebestift)
**Problem:** PETG haftet so stark, dass der Druck nicht ohne Beschädigung entfernt werden kann
**Lösung:** Immer Textured PEI mit Klebestift oder Engineering Plate verwenden

### ABS auf Cool Plate
**Problem:** Warping — Ecken heben sich während des Drucks
**Lösung:** Engineering Plate + Klebestift + Kammertemperatur erhöhen (Frontklappe schließen)

### PLA auf High Temp Plate
**Problem:** Zu hohe Plattentemperatur führt zu übermäßig guter Haftung, schwieriges Ablösen
**Lösung:** Cool Plate oder Textured PEI für PLA

### Zu viel Klebestift
**Problem:** Dicker Klebestift führt zu Elephant Foot (ausfließende erste Schicht)
**Lösung:** Eine dünne Schicht — der Klebestift sollte kaum sichtbar sein

## Platte wechseln

1. **Platte auf Raumtemperatur abkühlen lassen** (oder Handschuhe verwenden — die Platte kann heiß sein)
2. Platte von vorne anheben und herausziehen
3. Neue Platte einlegen — der Magnet hält sie an Ort und Stelle
4. **Automatische Kalibrierung durchführen** (Flow Rate und Bed Leveling) nach dem Plattenwechsel in Bambu Studio oder über das Dashboard unter **Steuerung → Kalibrierung**

:::info Kalibrierung nach Wechsel nicht vergessen
Platten haben leicht unterschiedliche Stärken. Ohne Kalibrierung kann die erste Schicht zu weit entfernt sein oder in die Platte krachen.
:::

## Plattenpflege

### Reinigung (nach jeweils 2–5 Drucken)
- Mit IPA (Isopropanol 70–99%) und einem fusselfreien Tuch abwischen
- Oberfläche nicht mit bloßen Händen berühren — Hautfett reduziert die Haftung
- Textured PEI: nach vielen Drucken mit lauwarmem Wasser und mildem Spülmittel waschen

### Klebestiftreste entfernen
- Platte auf 60°C aufheizen
- Mit feuchtem Tuch abwischen
- Mit IPA-Tuch abschließen

### Austausch
Platte ersetzen, wenn Sie sehen:
- Sichtbare Kratzer oder Markierungen nach dem Ablösen von Drucken
- Konstant schlechte Haftung trotz Reinigung
- Blasen oder Flecken in der Beschichtung

Bambu-Platten halten typischerweise 200–500 Drucke, je nach Filamenttyp und Behandlung.

:::tip Platten richtig lagern
Unbenutzte Platten in der Originalverpackung oder aufrecht in einem Halter aufbewahren — nicht gestapelt mit schweren Dingen darauf. Verformte Platten führen zu unebenen ersten Schichten.
:::
