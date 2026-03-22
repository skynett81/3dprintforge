---
sidebar_position: 6
title: Bed Mesh
description: 3D-Visualisierung der Druckbett-Nivellierungskalibrierung mit Heatmap, Scan aus der Benutzeroberfläche und Kalibrierungsanleitung
---

# Bed Mesh

Das Bed-Mesh-Werkzeug bietet Ihnen eine visuelle Darstellung der Druckbettplanheit — entscheidend für gute Haftung und eine gleichmäßige erste Schicht.

Navigieren Sie zu: **https://localhost:3443/#bedmesh**

## Was ist Bed Mesh?

Bambu Lab-Drucker scannen die Druckbettoberfläche mit einem Sensor und erstellen eine Karte (Mesh) der Höhenabweichungen. Die Drucker-Firmware kompensiert Abweichungen während des Drucks automatisch. Das Bambu Dashboard visualisiert diese Karte für Sie.

## Visualisierung

### 3D-Oberfläche

Die Bed-Mesh-Karte wird als interaktive 3D-Oberfläche angezeigt:

- Verwenden Sie die Maus, um die Ansicht zu drehen
- Scrollen zum Vergrößern/Verkleinern
- Klicken Sie auf **Draufsicht** für die Vogelperspektive
- Klicken Sie auf **Seitenansicht**, um das Profil zu sehen

Die Farbskala zeigt Abweichungen von der durchschnittlichen Höhe:
- **Blau** — niedriger als Mitte (konkav)
- **Grün** — annähernd flach (< 0,1 mm Abweichung)
- **Gelb** — moderate Abweichung (0,1–0,2 mm)
- **Rot** — hohe Abweichung (> 0,2 mm)

### Heatmap

Klicken Sie auf **Heatmap** für eine flache 2D-Ansicht der Mesh-Karte — für die meisten einfacher zu lesen.

Die Heatmap zeigt:
- Genaue Abweichungswerte (mm) für jeden Messpunkt
- Markierte Problempunkte (Abweichung > 0,3 mm)
- Abmessungen der Messungen (Anzahl Zeilen × Spalten)

## Bed Mesh aus der Benutzeroberfläche scannen

:::warning Voraussetzungen
Der Scan erfordert, dass der Drucker im Leerlauf ist und die Betttemperatur stabilisiert ist. Heizen Sie das Bett auf die gewünschte Temperatur VOR dem Scan auf.
:::

1. Gehen Sie zu **Bed Mesh**
2. Drucker aus der Dropdown-Liste auswählen
3. Klicken Sie auf **Jetzt scannen**
4. Betttemperatur für den Scan auswählen:
   - **Kalt** (Raumtemperatur) — schnell, aber weniger genau
   - **Warm** (50–60°C PLA, 70–90°C PETG) — empfohlen
5. Im Dialog bestätigen — der Drucker startet automatisch die Sensor-Sequenz
6. Warten Sie, bis der Scan abgeschlossen ist (3–8 Minuten je nach Mesh-Größe)
7. Die neue Mesh-Karte wird automatisch angezeigt

## Kalibrierungsanleitung

Nach dem Scan gibt das System konkrete Empfehlungen:

| Befund | Empfehlung |
|---|---|
| Abweichung < 0,1 mm überall | Ausgezeichnet — keine Maßnahmen erforderlich |
| Abweichung 0,1–0,2 mm | Gut — Kompensation wird von der Firmware übernommen |
| Abweichung > 0,2 mm in Ecken | Bettfedern manuell einstellen (wenn möglich) |
| Abweichung > 0,3 mm | Das Bett könnte beschädigt oder falsch montiert sein |
| Mitte höher als Ecken | Thermische Ausdehnung — normal für warme Betten |

:::tip Historischer Vergleich
Klicken Sie auf **Mit vorherigem vergleichen**, um zu sehen, ob sich die Mesh-Karte im Laufe der Zeit verändert hat — nützlich, um festzustellen, ob sich die Platte allmählich verbiegt.
:::

## Mesh-Verlauf

Alle Mesh-Scans werden mit Zeitstempel gespeichert:

1. Klicken Sie im Bed-Mesh-Seitenpanel auf **Verlauf**
2. Zwei Scans zum Vergleichen auswählen (Differenzkarte wird angezeigt)
3. Alte Scans löschen, die Sie nicht mehr benötigen

## Export

Mesh-Daten exportieren als:
- **PNG** — Bild der Heatmap (für Dokumentation)
- **CSV** — Rohdaten mit X, Y und Höhenabweichung pro Punkt
