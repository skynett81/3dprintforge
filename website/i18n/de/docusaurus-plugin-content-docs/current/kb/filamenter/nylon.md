---
sidebar_position: 5
title: PA / Nylon
description: Anleitung zum Nylon-Drucken — Trocknung, Klebestift, Einstellungen und Varianten
---

# PA / Nylon

Nylon (Polyamid / PA) ist eines der stärksten und strapazierfähigsten 3D-Druckmaterialien. Es ist ideal für mechanische Teile, Zahnräder, Lager und andere hochbelastete Teile.

## Einstellungen

| Parameter | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Düsentemperatur | 260–280 °C | 250–270 °C | 270–290 °C |
| Betttemperatur | 70–90 °C | 60–80 °C | 80–100 °C |
| Teile-Kühlung | 0–30% | 0–30% | 0–20% |
| Trocknung (erforderlich) | 80 °C / 8–12 h | 80 °C / 8 h | 80 °C / 12 h |

## Trocknung — kritisch für Nylon

Nylon ist **extrem hygroskopisch**. Es absorbiert in wenigen Stunden Feuchtigkeit aus der Luft.

:::danger Nylon immer trocknen
Feuchtes Nylon liefert schlechte Ergebnisse — schwacher Druck, Blasen, blasige Oberfläche und schlechte Schichtfusion. Nylon **unmittelbar** vor dem Drucken trocknen und innerhalb weniger Stunden danach verwenden.

- **Temperatur:** 75–85 °C
- **Zeit:** 8–12 Stunden
- **Methode:** Filamenttrockner oder Ofen mit Ventilator
:::

Bambu AMS wird für Nylon ohne versiegelte und trockene Konfiguration nicht empfohlen. Wenn möglich, externe Filamentzufuhr direkt zum Drucker verwenden.

## Druckplatten

| Platte | Eignung | Klebestift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Ausgezeichnet | Ja (erforderlich) |
| High Temp Plate | Gut | Ja (erforderlich) |
| Cool Plate | Schlecht | — |

:::warning Klebestift ist erforderlich
Nylon haftet ohne Klebestift schlecht. Einen dünnen, gleichmäßigen Klebestiftauftrag verwenden (Bambu Lab oder Pritt Stick). Ohne Klebestift löst sich Nylon von der Platte.
:::

## Warping

Nylon zeigt erhebliches Warping:
- Brim verwenden (8–15 mm)
- Kammer schließen (X1C/P1S liefert beste Ergebnisse)
- Große flache Teile ohne Brim vermeiden
- Belüftung minimal halten

## Varianten

### PA6 (Nylon 6)
Am häufigsten, gute Festigkeit und Flexibilität. Absorbiert viel Feuchtigkeit.

### PA12 (Nylon 12)
Dimensionsstabiler und absorbiert etwas weniger Feuchtigkeit als PA6. Leichter zu drucken.

### PA-CF (Kohlefaser)
Sehr steif und leicht. Erfordert Hartstahlnagel-Düse. Druckt trockener als Standard-Nylon.

### PA-GF (Glasfaser)
Gute Steifigkeit zu niedrigerem Preis als CF. Erfordert Hartstahlnagel-Düse.

## Lagerung

Nylon in versiegelter Box mit aggressivem Silicagel aufbewahren. Die Bambu Lab-Trockenbox ist ideal. Nylon niemals über Nacht offen liegen lassen.
