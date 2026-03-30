---
sidebar_position: 1
title: Düsenwartung
description: Reinigung, Cold Pull, Düsenwechsel und Düsentypen für Bambu Lab-Drucker
---

# Düsenwartung

Die Düse ist eine der kritischsten Komponenten des Druckers. Richtige Wartung verlängert die Lebensdauer und sichert gute Druckergebnisse.

## Düsentypen

| Düsentyp | Materialien | Lebensdauer (geschätzt) | Max. Temp |
|----------|-----------|-------------------|----------|
| Messing (Standard) | PLA, PETG, ABS, TPU | 200–500 Stunden | 300 °C |
| Hartstahl | Alle inkl. CF/GF | 300–600 Stunden | 300 °C |
| HS01 (Bambu) | Alle inkl. CF/GF | 500–1000 Stunden | 300 °C |

:::danger Niemals Messingdüse mit CF/GF verwenden
Kohlefaser- und glasfasergefüllte Filamente verschleißen Messingdüsen in Stunden. Vor dem Drucken von CF/GF-Materialien zu Hartstahl wechseln.
:::

## Reinigung

### Einfache Reinigung (zwischen Spulen)
1. Düse auf 200–220 °C aufheizen
2. Filament manuell durchdrücken, bis es sauber herauskommt
3. Filament schnell herausziehen ("Cold Pull" — siehe unten)

### IPA-Reinigung
Für hartnäckige Rückstände:
1. Düse auf 200 °C aufheizen
2. 1–2 Tropfen IPA auf das Düsenende tropfen (vorsichtig!)
3. Den Dampf die Rückstände auflösen lassen
4. Frisches Filament durchziehen

:::warning Vorsicht mit IPA auf heißer Düse
IPA siedet bei 83 °C und dampft stark auf einer heißen Düse. Geringe Mengen verwenden und Einatmen vermeiden.
:::

## Cold Pull (Kaltauszug)

Der Cold Pull ist die effektivste Methode, um Verunreinigungen und Kohlenstoffrückstände aus der Düse zu entfernen.

**Schritt für Schritt:**
1. Düse auf 200–220 °C aufheizen
2. Nylonfilament (oder das eingelegte Filament) manuell einführen
3. Nylon in der Düse 1–2 Minuten einweichen lassen
4. Temperatur auf 80–90 °C senken (für Nylon)
5. Warten bis die Düse auf die Zieltemperatur abgekühlt ist
6. Filament schnell und bestimmt in einer Bewegung herausziehen
7. Das Ende betrachten: sollte die Form des Düseninneren haben — sauber und ohne Rückstände
8. 3–5 Mal wiederholen, bis das Filament sauber und weiß herausgezogen wird

:::tip Nylon für Cold Pull
Nylon liefert das beste Ergebnis für den Cold Pull, weil es gut an Verunreinigungen haftet. Weiße Nylon macht es leicht zu sehen, ob der Auszug sauber ist.
:::

## Düsenwechsel

### Anzeichen, dass die Düse gewechselt werden sollte
- Klumpige Oberflächen und schlechte Dimensionsgenauigkeit
- Anhaltende Extrusionsprobleme nach der Reinigung
- Sichtbarer Verschleiß oder Verformung der Düsenöffnung
- Düse hat geschätzte Lebensdauer überschritten

### Vorgehensweise (P1S/X1C)
1. Düse auf 200 °C aufheizen
2. Extrudermotor bremsen (Filament freigeben)
3. Düse mit Schlüssel lösen (gegen den Uhrzeigersinn)
4. Düse im warmen Zustand wechseln — **Düse nicht mit Werkzeug abkühlen lassen**
5. Auf gewünschtes Anzugsmoment festziehen (nicht überziehen)
6. Nach dem Wechsel Kalibrierung durchführen

:::warning Immer warm wechseln
Das Anzugsmoment einer kalten Düse kann das Teil beim Aufheizen sprengen. Immer warm wechseln und festziehen (200 °C).
:::

## Wartungsintervalle

| Aktivität | Intervall |
|-----------|---------|
| Reinigung (Cold Pull) | Nach 50 Stunden oder beim Materialwechsel |
| Sichtprüfung | Wöchentlich |
| Düsenwechsel (Messing) | 200–500 Stunden |
| Düsenwechsel (Hartstahl) | 300–600 Stunden |
