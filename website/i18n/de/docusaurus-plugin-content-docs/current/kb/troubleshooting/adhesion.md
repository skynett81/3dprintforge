---
sidebar_position: 1
title: Schlechte Haftung
description: Ursachen und Lösungen für schlechte erste-Schicht-Haftung — Platte, Temperatur, Klebestift, Geschwindigkeit, Z-Offset
---

# Schlechte Haftung

Schlechte Haftung ist eines der häufigsten Probleme beim 3D-Druck. Die erste Schicht haftet nicht, oder Drucke lösen sich mittendrin.

## Symptome

- Erste Schicht klebt nicht — der Druck bewegt sich oder hebt sich
- Kanten und Ecken heben sich (Warping)
- Druck löst sich mitten im Auftrag
- Ungleichmäßige erste Schicht mit Lücken oder losen Fäden

## Checkliste — in dieser Reihenfolge versuchen

### 1. Platte reinigen
Die häufigste Ursache für schlechte Haftung sind Fett oder Schmutz auf der Platte.

```
1. Platte mit IPA (Isopropylalkohol) abwischen
2. Die Druckoberfläche nicht mit bloßen Fingern berühren
3. Bei anhaltenden Problemen: mit Wasser und mildem Spülmittel waschen
```

### 2. Z-Offset kalibrieren

Der Z-Offset ist der Abstand zwischen Düse und Platte bei der ersten Schicht. Zu hoch = Faden hängt lose. Zu niedrig = Düse schabt über die Platte.

**Richtiger Z-Offset:**
- Erste Schicht sollte leicht transparent aussehen
- Faden sollte leicht auf die Platte gedrückt werden ("Squish")
- Fäden sollten leicht ineinander schmelzen

Z-Offset über **Steuerung → Live Z-Offset anpassen** während des Drucks einstellen.

:::tip Live-Anpassung während des Drucks
3DPrintForge zeigt Z-Offset-Einstellungsschaltflächen während eines aktiven Drucks an. In Schritten von ±0,02 mm einstellen, während die erste Schicht beobachtet wird.
:::

### 3. Betttemperatur prüfen

| Material | Zu niedrige Temp | Empfohlen |
|-----------|-------------|---------|
| PLA | Unter 30 °C | 35–45 °C |
| PETG | Unter 60 °C | 70–85 °C |
| ABS | Unter 80 °C | 90–110 °C |
| TPU | Unter 25 °C | 30–45 °C |

Betttemperatur schrittweise um 5 °C erhöhen.

### 4. Klebestift verwenden

Klebestift verbessert die Haftung für die meisten Materialien auf den meisten Platten:
- Dünne, gleichmäßige Schicht auftragen
- 30 Sekunden trocknen lassen vor dem Start
- Besonders wichtig für: ABS, PA, PC, PETG (auf Smooth PEI)

### 5. Erste-Schicht-Geschwindigkeit senken

Niedrigere Geschwindigkeit bei der ersten Schicht verbessert den Kontakt zwischen Filament und Platte:
- Standard: 50 mm/s für erste Schicht
- Versuchen: 30–40 mm/s
- Bambu Studio: unter **Qualität → Erste-Schicht-Geschwindigkeit**

### 6. Plattenzustand prüfen

Eine verschlissene Platte liefert schlechte Haftung, selbst mit perfekten Einstellungen. Platte wechseln, wenn:
- PEI-Beschichtung sichtbar beschädigt ist
- Reinigung nicht hilft

### 7. Brim verwenden

Für Materialien mit Warping-Tendenz (ABS, PA, große flache Objekte):
- Brim im Slicer hinzufügen: 5–10 mm Breite
- Erhöht die Kontaktfläche und hält Kanten unten

## Spezielle Fälle

### Große flache Objekte
Große flache Objekte sind am anfälligsten für Ablösung. Maßnahmen:
- Brim 8–10 mm
- Betttemperatur erhöhen
- Kammer schließen (ABS/PA)
- Teile-Kühlung senken

### Verglaste Oberflächen
Platten mit zu viel Klebestift über Zeit können verglasen. Gründlich mit Wasser waschen und neu beginnen.

### Nach Materialwechsel
Verschiedene Materialien erfordern verschiedene Einstellungen. Prüfen, ob Betttemperatur und Platte für das neue Material konfiguriert sind.
