---
sidebar_position: 2
title: PETG
description: Anleitung zum PETG-Drucken — Temperatur, WICHTIG zum Klebestift, Platte und Tipps
---

# PETG

PETG (Polyethylene Terephthalate Glycol) ist ein beliebtes Material für funktionale Teile. Es ist stärker und wärmestabiler als PLA und verträgt leichte chemische Einwirkung.

## Einstellungen

| Parameter | Wert |
|-----------|-------|
| Düsentemperatur | 230–250 °C |
| Betttemperatur | 70–85 °C |
| Teile-Kühlung | 30–60% |
| Geschwindigkeit | Standard |
| Trocknung | Empfohlen (6–8 h bei 65 °C) |

## Empfohlene Druckplatten

| Platte | Eignung | Klebestift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Ausgezeichnet | Nein/Ja* |
| Textured PEI | Gut | Ja** |
| Cool Plate (Smooth PEI) | Siehe Warnung | Siehe Warnung |
| High Temp Plate | Gut | Ja |

:::danger WICHTIG: Klebestift auf Smooth PEI mit PETG
PETG haftet **extrem stark** auf Smooth PEI (Cool Plate). Ohne Klebestift riskieren Sie, **die Beschichtung von der Platte abzureißen**, wenn Sie den Druck entfernen. Verwenden Sie immer eine dünne Schicht Klebestift auf Smooth PEI beim Drucken von PETG — dieser fungiert als Trennschicht.

**Alternativ:** Verwenden Sie die Engineering Plate oder Textured PEI — diese bieten gute Haftung ohne die Platte zu beschädigen.
:::

## Tipps für erfolgreiches Drucken

- **Teile-Kühlung reduzieren** — zu viel Kühlung führt zu Schichtablösung und spröden Drucken
- **Düsentemperatur erhöhen** — bei Stringing versuchen Sie 5–10 °C zu senken; bei schlechter Schichtfusion erhöhen
- **Erste-Schicht-Betttemperatur** — 80–85 °C für gute Haftung, auf 70 °C nach der ersten Schicht senken
- **Geschwindigkeit reduzieren** — PETG ist anspruchsvoller als PLA, mit 80 % Geschwindigkeit beginnen

:::warning Stringing
PETG neigt zum Stringing. Retract-Abstand erhöhen (0,8–1,5 mm für Direct Drive ausprobieren), Retract-Geschwindigkeit erhöhen und Düsentemperatur schrittweise um 5 °C senken.
:::

## Trocknung

PETG absorbiert Feuchtigkeit schneller als PLA. Feuchtes PETG führt zu:
- Blasen und Zischen beim Drucken
- Schwachen Schichten mit poröser Oberfläche
- Erhöhtem Stringing

**Bei 65 °C für 6–8 Stunden trocknen**, besonders wenn die Spule lange offen war.

## Lagerung

Immer in versiegelter Tüte oder Trockenbox mit Silicagel aufbewahren. PETG sollte in feuchter Umgebung nicht länger als einige Tage offen bleiben.
