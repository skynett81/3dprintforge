---
sidebar_position: 2
title: Warping
description: Ursachen für Warping und Lösungen — Einhausung, Brim, Temperatur und Draft Shield
---

# Warping

Warping tritt auf, wenn sich Ecken oder Kanten des Drucks während oder nach dem Drucken von der Platte abheben. Es wird durch thermische Schrumpfung des Materials verursacht.

## Was ist Warping?

Wenn Kunststoff abkühlt, schrumpft er. Die oberen Schichten sind wärmer als die unteren — dies erzeugt Spannung, die die Kanten nach oben zieht und den Druck verbiegt. Je größer der Temperaturunterschied, desto mehr Warping.

## Besonders anfällige Materialien

| Material | Warping-Risiko | Einhausung erforderlich |
|-----------|-------------|-----------------|
| PLA | Gering | Nein |
| PETG | Gering–Moderat | Nein |
| ABS | Hoch | Ja |
| ASA | Hoch | Ja |
| PA/Nylon | Sehr hoch | Ja |
| PC | Sehr hoch | Ja |
| TPU | Gering | Nein |

## Lösungen

### 1. Einhausung (Kammer) verwenden

Die wichtigste Maßnahme für ABS, ASA, PA und PC:
- Kammertemperatur bei 40–55 °C halten für beste Ergebnisse
- X1C und P1S: Kammerlüfter im „geschlossenen" Modus aktivieren
- A1/P1P: Abdeckkappe verwenden, um die Wärme zu halten

### 2. Brim verwenden

Brim ist eine einzelne Schicht mit extra breiten Rändern, die den Druck an der Platte fixiert:

```
Bambu Studio:
1. Druck im Slicer auswählen
2. Zu Support → Brim gehen
3. Breite auf 5–10 mm setzen (je mehr Warping, desto breiter)
4. Typ: Outer Brim Only (empfohlen)
```

:::tip Brim-Breite Anleitung
- PLA (selten nötig): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Betttemperatur erhöhen

Höhere Betttemperatur reduziert den Temperaturunterschied zwischen Schichten:
- ABS: 105–110 °C ausprobieren
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Teile-Kühlung reduzieren

Für Materialien mit Warping-Tendenz — Teile-Kühlung senken oder deaktivieren:
- ABS/ASA: 0–20% Teile-Kühlung
- PA: 0–30% Teile-Kühlung

### 5. Zugluft und kalte Luft vermeiden

Drucker fernhalten von:
- Fenstern und Außentüren
- Klimaanlagen und Lüftern
- Zugluft im Raum

Für P1P und A1: Öffnungen bei kritischen Drucken mit Karton abdecken.

### 6. Draft Shield

Ein Draft Shield ist eine dünne Wand um das Objekt, die die Wärme einschließt:

```
Bambu Studio:
1. Zu Support → Draft Shield gehen
2. Aktivieren und Abstand festlegen (3–5 mm)
```

Besonders nützlich für hohe, schlanke Objekte.

### 7. Modelldesign-Maßnahmen

Beim Entwerfen eigener Modelle:
- Große flache Böden vermeiden (Fase/Rundung in Ecken hinzufügen)
- Große flache Teile in kleinere Abschnitte aufteilen
- „Mouse Ears" verwenden — kleine Kreise in Ecken — im Slicer oder CAD

## Warping nach dem Abkühlen

Manchmal sieht der Druck gut aus, aber das Warping tritt nach dem Entfernen von der Platte auf:
- Immer warten bis Platte und Druck **vollständig abgekühlt** sind (unter 40 °C), bevor entfernt wird
- Für ABS: in der geschlossenen Kammer abkühlen lassen für langsamere Abkühlung
- Warmen Druck nicht auf eine kalte Oberfläche stellen
