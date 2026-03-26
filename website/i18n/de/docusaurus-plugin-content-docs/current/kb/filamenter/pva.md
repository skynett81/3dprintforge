---
sidebar_position: 8
title: PVA und Stützmaterialien
description: Anleitung zu PVA, HIPS, PVB und anderen Stützmaterialien für Bambu Lab-Drucker
---

# PVA und Stützmaterialien

Stützmaterialien werden verwendet, um komplexe Geometrien mit Überhängen, Brücken und inneren Hohlräumen zu drucken, die ohne temporäre Stützstrukturen nicht gedruckt werden können. Nach dem Druck wird das Stützmaterial entfernt — entweder mechanisch oder durch Auflösung in einem Lösungsmittel.

## Übersicht

| Material | Lösungsmittel | Kombinieren mit | Auflösungszeit | Schwierigkeitsgrad |
|----------|--------------|----------------|----------------|-------------------|
| PVA | Wasser | PLA, PETG | 12–24 Stunden | Anspruchsvoll |
| HIPS | d-Limonen | ABS, ASA | 12–24 Stunden | Mäßig |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 Stunden | Mäßig |
| BVOH | Wasser | PLA, PETG, PA | 4–8 Stunden | Anspruchsvoll |

---

## PVA (Polyvinylalkohol)

PVA ist ein wasserlösliches Stützmaterial und die am häufigsten verwendete Wahl für PLA-basierte Drucke mit komplexen Stützstrukturen.

### Einstellungen

| Parameter | Wert |
|-----------|------|
| Düsentemperatur | 190–210 °C |
| Betttemperatur | 45–60 °C |
| Bauteilkühlung | 100% |
| Geschwindigkeit | 60–80% |
| Retraction | Erhöht (6–8 mm) |

### Empfohlene Druckplatten

| Platte | Eignung | Klebestift? |
|--------|---------|------------|
| Cool Plate (Smooth PEI) | Ausgezeichnet | Nein |
| Textured PEI | Gut | Nein |
| Engineering Plate | Gut | Nein |
| High Temp Plate | Vermeiden | — |

### Kompatibilität

PVA funktioniert am besten mit Materialien, die bei **ähnlichen Temperaturen** drucken:

| Hauptmaterial | Kompatibilität | Anmerkung |
|---------------|---------------|-----------|
| PLA | Ausgezeichnet | Ideale Kombination |
| PETG | Gut | Betttemperatur kann etwas hoch für PVA sein |
| ABS/ASA | Schlecht | Kammertemperatur zu hoch — PVA degradiert |
| PA (Nylon) | Schlecht | Temperaturen zu hoch |

### Auflösung

- Den fertigen Druck in **lauwarmes Wasser** (ca. 40 °C) legen
- PVA löst sich innerhalb von **12–24 Stunden** je nach Dicke auf
- Wasser regelmäßig umrühren, um den Prozess zu beschleunigen
- Wasser alle 6–8 Stunden wechseln für schnellere Auflösung
- Ein Ultraschallreiniger liefert deutlich schnellere Ergebnisse (2–6 Stunden)

:::danger PVA ist extrem hygroskopisch
PVA absorbiert Feuchtigkeit aus der Luft **sehr schnell** — schon Stunden der Exposition können das Druckergebnis ruinieren. PVA, das Feuchtigkeit aufgenommen hat, verursacht:

- Starkes Blubbern und Knackgeräusche
- Schlechte Haftung am Hauptmaterial
- Stringing und klebrige Oberfläche
- Verstopfte Düse

**Trocknen Sie PVA immer unmittelbar vor der Verwendung** und drucken Sie aus einer trockenen Umgebung (Trockenbox).
:::

### PVA trocknen

| Parameter | Wert |
|-----------|------|
| Trocknungstemperatur | 45–55 °C |
| Trocknungszeit | 6–10 Stunden |
| Hygroskopisches Niveau | Extrem hoch |
| Aufbewahrungsmethode | Versiegelte Box mit Trockenmittel, immer |

---

## HIPS (High Impact Polystyrene)

HIPS ist ein Stützmaterial, das sich in d-Limonen (Lösungsmittel auf Zitrusbasis) auflöst. Es ist das bevorzugte Stützmaterial für ABS und ASA.

### Einstellungen

| Parameter | Wert |
|-----------|------|
| Düsentemperatur | 220–240 °C |
| Betttemperatur | 90–100 °C |
| Kammertemperatur | 40–50 °C (empfohlen) |
| Bauteilkühlung | 20–40% |
| Geschwindigkeit | 70–90% |

### Kompatibilität

| Hauptmaterial | Kompatibilität | Anmerkung |
|---------------|---------------|-----------|
| ABS | Ausgezeichnet | Ideale Kombination — ähnliche Temperaturen |
| ASA | Ausgezeichnet | Sehr gute Haftung |
| PLA | Schlecht | Temperaturunterschied zu groß |
| PETG | Schlecht | Unterschiedliches thermisches Verhalten |

### Auflösung in d-Limonen

- Den Druck in **d-Limonen** (Lösungsmittel auf Zitrusbasis) legen
- Auflösungszeit: **12–24 Stunden** bei Raumtemperatur
- Erwärmung auf 35–40 °C beschleunigt den Prozess
- d-Limonen kann 2–3 Mal wiederverwendet werden
- Teil nach der Auflösung in Wasser abspülen und trocknen

### Vorteile gegenüber PVA

- **Viel weniger feuchtigkeitsempfindlich** — einfacher zu lagern und zu handhaben
- **Stärker als Stützmaterial** — hält mehr aus, ohne sich zu zersetzen
- **Bessere thermische Kompatibilität** mit ABS/ASA
- **Einfacher zu drucken** — weniger Verstopfungen und Probleme

:::warning d-Limonen ist ein Lösungsmittel
Verwenden Sie Handschuhe und arbeiten Sie in einem belüfteten Raum. d-Limonen kann Haut und Schleimhäute reizen. Außer Reichweite von Kindern aufbewahren.
:::

---

## PVB (Polyvinylbutyral)

PVB ist ein einzigartiges Stützmaterial, das sich in Isopropanol (IPA) auflöst und zur Oberflächenglättung mit IPA-Dampf verwendet werden kann.

### Einstellungen

| Parameter | Wert |
|-----------|------|
| Düsentemperatur | 200–220 °C |
| Betttemperatur | 55–75 °C |
| Bauteilkühlung | 80–100% |
| Geschwindigkeit | 70–80% |

### Kompatibilität

| Hauptmaterial | Kompatibilität | Anmerkung |
|---------------|---------------|-----------|
| PLA | Gut | Akzeptable Haftung |
| PETG | Mäßig | Betttemperatur kann variieren |
| ABS/ASA | Schlecht | Temperaturen zu hoch |

### Oberflächenglättung mit IPA-Dampf

Die einzigartige Eigenschaft von PVB ist, dass die Oberfläche mit IPA-Dampf geglättet werden kann:

1. Das Teil in einen geschlossenen Behälter stellen
2. Ein IPA-getränktes Tuch auf den Boden legen (kein direkter Kontakt mit dem Teil)
3. Den Dampf **30–60 Minuten** einwirken lassen
4. Herausnehmen und 24 Stunden trocknen lassen
5. Das Ergebnis ist eine glatte, halbglänzende Oberfläche

:::tip PVB als Oberflächenfinish
Obwohl PVB hauptsächlich ein Stützmaterial ist, kann es als äußerste Schicht auf PLA-Teilen gedruckt werden, um eine Oberfläche zu erhalten, die mit IPA geglättet werden kann. Dies ergibt ein Finish, das an acetongeglättetes ABS erinnert.
:::

---

## Vergleich der Stützmaterialien

| Eigenschaft | PVA | HIPS | PVB | BVOH |
|-------------|-----|------|-----|------|
| Lösungsmittel | Wasser | d-Limonen | IPA | Wasser |
| Auflösungszeit | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Feuchtigkeitsempfindlichkeit | Extrem hoch | Niedrig | Mäßig | Extrem hoch |
| Schwierigkeitsgrad | Anspruchsvoll | Mäßig | Mäßig | Anspruchsvoll |
| Preis | Hoch | Mäßig | Hoch | Sehr hoch |
| Am besten mit | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Verfügbarkeit | Gut | Gut | Begrenzt | Begrenzt |
| AMS-kompatibel | Ja (mit Trockenmittel) | Ja | Ja | Problematisch |

---

## Tipps für Dual-Extrusion und Multicolor

### Allgemeine Richtlinien

- **Purge-Menge** — Stützmaterialien erfordern gutes Purging beim Materialwechsel (mindestens 150–200 mm³)
- **Interface-Schichten** — verwenden Sie 2–3 Interface-Schichten zwischen Stütze und Hauptteil für eine saubere Oberfläche
- **Abstand** — Stützabstand auf 0,1–0,15 mm für einfache Entfernung nach der Auflösung einstellen
- **Stützmuster** — Dreiecksmuster für PVA/BVOH, Gitter für HIPS verwenden

### AMS-Einrichtung

- Stützmaterial in einen **AMS-Slot mit Trockenmittel** einsetzen
- Für PVA: externe Trockenbox mit Bowden-Anschluss in Betracht ziehen
- Korrektes Materialprofil in Bambu Studio konfigurieren
- Mit einem einfachen Überhang-Modell testen, bevor Sie komplexe Teile drucken

### Häufige Probleme und Lösungen

| Problem | Ursache | Lösung |
|---------|---------|--------|
| Stütze haftet nicht | Zu großer Abstand | Interface-Abstand auf 0,05 mm reduzieren |
| Stütze haftet zu stark | Zu geringer Abstand | Interface-Abstand auf 0,2 mm erhöhen |
| Blasen im Stützmaterial | Feuchtigkeit | Filament gründlich trocknen |
| Stringing zwischen Materialien | Unzureichende Retraction | Retraction um 1–2 mm erhöhen |
| Schlechte Oberfläche zur Stütze | Zu wenige Interface-Schichten | Auf 3–4 Interface-Schichten erhöhen |

:::tip Einfach anfangen
Für Ihren ersten Druck mit Stützmaterial: verwenden Sie PLA + PVA, ein einfaches Modell mit deutlichem Überhang (45°+) und Standardeinstellungen in Bambu Studio. Optimieren Sie, wenn Sie Erfahrung gesammelt haben.
:::
