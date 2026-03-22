---
sidebar_position: 1
title: PLA
description: Anleitung zum PLA-Drucken mit Bambu Lab — Temperatur, Platten, Tipps und Varianten
---

# PLA

PLA (Polylactic Acid) ist das einsteigerfreundlichste Filament. Es druckt leicht, liefert schöne Oberflächen und benötigt weder Einhausung noch spezielle Wärmebehandlung.

## Einstellungen

| Parameter | Standard PLA | PLA+ | PLA Silk |
|-----------|-------------|------|---------|
| Düsentemperatur | 220 °C | 230 °C | 230 °C |
| Betttemperatur | 35–45 °C | 45–55 °C | 45–55 °C |
| Kammertemperatur | — | — | — |
| Teile-Kühlung | 100% | 100% | 80% |
| Geschwindigkeit | Standard | Standard | 80% |
| Trocknung erforderlich | Nein | Nein | Nein |

## Empfohlene Druckplatten

| Platte | Eignung | Klebestift? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Ausgezeichnet | Nein |
| Textured PEI | Gut | Nein |
| Engineering Plate | Gut | Nein |
| High Temp Plate | Vermeiden | — |

## Tipps für erfolgreiches Drucken

- **Kein Klebestift nötig** — PLA haftet gut auf den meisten Platten ohne Klebestift
- **Platte abkühlen lassen** — PLA löst sich leichter von der Platte, wenn sie auf Raumtemperatur abkühlt
- **Erste-Schicht-Geschwindigkeit** — auf 50–70 % setzen für bessere Haftung
- **Teile-Kühlung** — bei 100 % halten für schärfere Details und bessere Brücken

:::tip Z-Offset
Z-Offset für die erste Schicht sorgfältig kalibrieren. Für PLA auf der Cool Plate: live anpassen, bis die erste Schicht leicht transparent und gut haftend ist — nicht gequetscht.
:::

## Varianten

### PLA+
Stärker und wärmestabiler als Standard-PLA. Läuft etwas heißer (225–235 °C). Etwas flexibler und leichter nachzubearbeiten.

### PLA Silk
Erzeugt glänzende, metallische Oberflächen. Erfordert weniger Kühlung und etwas niedrigere Geschwindigkeit für beste Ergebnisse. Brücken sind anspruchsvoller.

### PLA-CF (Kohlefaser)
Kohlefaserverstärktes PLA bietet erhöhte Steifigkeit und geringes Gewicht. Erfordert eine **Hartstahlnagel-Düse** — verwenden Sie niemals eine normale Messingdüse mit CF-Materialien.

### PLA Matte
Matte Oberfläche ohne Glanz. Druckt mit denselben Einstellungen wie Standard-PLA.

## Lagerung

PLA absorbiert Feuchtigkeit nicht so schnell wie PETG und PA, sollte aber dennoch trocken gelagert werden:

- **Empfohlen:** Versiegelte Tüte mit Silicagel
- **Anzeichen für feuchtes Filament:** Knackgeräusche, blasige Oberfläche, schwacher Druck

Bei Bedarf bei **45–55 °C für 4–6 Stunden** trocknen.
