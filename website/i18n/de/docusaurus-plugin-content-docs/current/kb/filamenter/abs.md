---
sidebar_position: 3
title: ABS
description: Anleitung zum ABS-Drucken — Temperatur, Einhausung, Warping und Klebestift
---

# ABS

ABS (Acrylonitrile Butadiene Styrene) ist ein Thermoplast mit guter Wärmestabilität und Schlagzähigkeit. Es erfordert eine Einhausung und ist anspruchsvoller als PLA/PETG, liefert aber langlebige funktionale Teile.

## Einstellungen

| Parameter | Wert |
|-----------|-------|
| Düsentemperatur | 240–260 °C |
| Betttemperatur | 90–110 °C |
| Kammertemperatur | 45–55 °C (X1C/P1S) |
| Teile-Kühlung | 0–20% |
| Aux Fan | 0% |
| Geschwindigkeit | 80–100% |
| Trocknung | Empfohlen (4–6 h bei 70 °C) |

## Empfohlene Druckplatten

| Platte | Eignung | Klebestift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Ausgezeichnet | Ja (empfohlen) |
| High Temp Plate | Ausgezeichnet | Ja |
| Cool Plate (Smooth PEI) | Vermeiden | — |
| Textured PEI | Gut | Ja |

:::tip Klebestift für ABS
Verwenden Sie bei ABS immer Klebestift auf der Engineering Plate. Dies verbessert die Haftung und erleichtert das Lösen des Drucks, ohne die Platte zu beschädigen.
:::

## Einhausung (Kammer)

ABS **erfordert** eine geschlossene Kammer, um Warping zu verhindern:

- **X1C und P1S:** Integrierte Kammer mit aktiver Wärmesteuerung — ideal für ABS
- **P1P:** Teilweise offen — Abdeckungen oben hinzufügen (Verkleidung über die Oberseite) für bessere Ergebnisse
- **A1 / A1 Mini:** Offener CoreXY — **nicht empfohlen** für ABS ohne selbst gebaute Einhausung

Die Kammer während des gesamten Drucks geschlossen halten. Nicht öffnen, um den Druck zu überprüfen — wenn Sie bis zur Abkühlung warten, vermeiden Sie auch Warping beim Ablösen.

## Warping

ABS ist sehr anfällig für Warping (Ecken heben sich):

- **Betttemperatur erhöhen** — 105–110 °C ausprobieren
- **Brim verwenden** — 5–10 mm Brim in Bambu Studio
- **Zugluft vermeiden** — alle Luftströmungen rund um den Drucker schließen
- **Teile-Kühlung auf 0 % senken** — Kühlung verursacht Verzug

:::warning Dämpfe
ABS setzt beim Drucken Styroldämpfe frei. Sorgen Sie für gute Belüftung im Raum oder verwenden Sie ein HEPA/Aktivkohlefilter. Der Bambu P1S hat einen integrierten Filter.
:::

## Nachbearbeitung

ABS lässt sich leichter schleifen, lackieren und kleben als PETG und PLA. Es kann auch mit Aceton dampfgeglättet werden für eine glatte Oberfläche — jedoch äußerste Vorsicht bei der Acetonexposition.

## Lagerung

Bei **70 °C für 4–6 Stunden** vor dem Drucken trocknen. In versiegelter Box aufbewahren — ABS absorbiert Feuchtigkeit, was Knackgeräusche und schwache Schichten verursacht.
