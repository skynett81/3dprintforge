---
sidebar_position: 3
title: Stringing
description: Ursachen für Stringing und Lösungen — Retract, Temperatur und Trocknung
---

# Stringing

Stringing (oder "Oozing") sind dünne Kunststofffäden, die sich zwischen separaten Teilen des Objekts bilden, wenn sich die Düse bewegt, ohne zu extrudieren. Es verleiht dem Druck ein "Spinnennetz"-ähnliches Aussehen.

## Ursachen für Stringing

1. **Zu hohe Düsentemperatur** — warmer Kunststoff ist flüssig und tropft
2. **Schlechte Retract-Einstellungen** — Filament wird nicht schnell genug zurückgezogen
3. **Feuchtes Filament** — Feuchtigkeit verursacht Dampf und zusätzlichen Fluss
4. **Zu niedrige Geschwindigkeit** — Düse verweilt lange in Transitpositionen

## Diagnose

**Feuchtes Filament?** Hören Sie beim Drucken ein knackendes/knisterndes Geräusch? Dann ist das Filament feucht — zuerst trocknen, bevor andere Einstellungen angepasst werden.

**Zu hohe Temperatur?** Sehen Sie Tropfen von der Düse in „Pause"-Momenten? Temperatur um 5–10 °C senken.

## Lösungen

### 1. Filament trocknen

Feuchtes Filament ist die häufigste Ursache für Stringing, das sich nicht wegstellen lässt:

| Material | Trocknungstemperatur | Zeit |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 Stunden |
| PETG | 60–65 °C | 6–8 Stunden |
| TPU | 55–60 °C | 6–8 Stunden |
| PA | 75–85 °C | 8–12 Stunden |

### 2. Düsentemperatur senken

Mit Senkung um 5 °C pro Schritt beginnen:
- PLA: 210–215 °C ausprobieren (von 220 °C)
- PETG: 235–240 °C ausprobieren (von 245 °C)

:::warning Zu niedrige Temperatur ergibt schlechte Schichtfusion
Temperatur vorsichtig senken. Zu niedrige Temperatur ergibt schlechte Schichtfusion, schwache Drucke und Extrusionsprobleme.
:::

### 3. Retract-Einstellungen anpassen

Retract zieht das Filament bei „Travel"-Bewegungen in die Düse zurück, um Tropfen zu verhindern:

```
Bambu Studio → Filament → Retract:
- Retract-Abstand: 0,4–1,0 mm (Direct Drive)
- Retract-Geschwindigkeit: 30–45 mm/s
```

:::tip Bambu Lab-Drucker haben Direct Drive
Alle Bambu Lab-Drucker (X1C, P1S, A1) verwenden Direct-Drive-Extruder. Direct Drive erfordert **kürzere** Retract-Abstände als Bowden-Systeme (typisch 0,5–1,5 mm vs. 3–7 mm).
:::

### 4. Travel-Geschwindigkeit erhöhen

Schnelle Bewegung zwischen Punkten gibt der Düse weniger Zeit zu tropfen:
- „Travel Speed" auf 200–300 mm/s erhöhen
- Bambu Lab-Drucker bewältigen dies problemlos

### 5. „Avoid Crossing Perimeters" aktivieren

Slicer-Einstellung, die verhindert, dass die Düse offene Bereiche kreuzt, wo Stringing sichtbar wäre:
```
Bambu Studio → Qualität → Avoid crossing perimeters
```

### 6. Geschwindigkeit senken (für TPU)

Für TPU ist die Lösung das Gegenteil anderer Materialien:
- Druckgeschwindigkeit auf 20–35 mm/s senken
- TPU ist elastisch und komprimiert bei zu hoher Geschwindigkeit — dies ergibt "Nachfluss"

## Nach Anpassungen

Mit einem Standard-Stringing-Testmodell testen (z.B. "Torture Tower" von MakerWorld). Eine Variable nach der anderen anpassen und die Änderung beobachten.

:::note Perfekt ist selten erreichbar
Etwas Stringing ist bei den meisten Materialien normal. Das Ziel ist, es auf ein akzeptables Niveau zu reduzieren, nicht vollständig zu eliminieren. PETG wird immer etwas mehr Stringing haben als PLA.
:::
