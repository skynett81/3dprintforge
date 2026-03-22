---
sidebar_position: 4
title: TPU
description: Anleitung zum TPU-Drucken — Temperatur, Geschwindigkeit und Retract-Einstellungen
---

# TPU

TPU (Thermoplastic Polyurethane) ist ein flexibles Material für Hüllen, Dichtungen, Räder und andere Teile, die Elastizität erfordern.

## Einstellungen

| Parameter | Wert |
|-----------|-------|
| Düsentemperatur | 220–240 °C |
| Betttemperatur | 30–45 °C |
| Teile-Kühlung | 50–80% |
| Geschwindigkeit | 30–50% (WICHTIG) |
| Retract | Minimal oder deaktiviert |
| Trocknung | Empfohlen (6–8 h bei 60 °C) |

:::danger Niedrige Geschwindigkeit ist kritisch
TPU muss langsam gedruckt werden. Zu hohe Geschwindigkeit führt dazu, dass das Material im Extruder komprimiert wird und Verstopfungen verursacht. Mit 30 % Geschwindigkeit beginnen und vorsichtig erhöhen.
:::

## Empfohlene Druckplatten

| Platte | Eignung | Klebestift? |
|-------|---------|----------|
| Textured PEI | Ausgezeichnet | Nein |
| Cool Plate (Smooth PEI) | Gut | Nein |
| Engineering Plate | Gut | Nein |

## Retract-Einstellungen

TPU ist elastisch und reagiert schlecht auf aggressives Retract:

- **Direct Drive (X1C/P1S/A1):** Retract 0,5–1,0 mm, 25 mm/s
- **Bowden (bei TPU vermeiden):** Sehr anspruchsvoll, nicht empfohlen

Für sehr weiches TPU (Shore A 85 oder niedriger): Retract vollständig deaktivieren und auf Temperatur- und Geschwindigkeitskontrolle vertrauen.

## Tipps

- **Filament trocknen** — feuchtes TPU ist extrem schwierig zu drucken
- **Direkten Extruder verwenden** — Bambu Lab P1S/X1C/A1 haben alle Direct Drive
- **Hohe Temperatur vermeiden** — über 250 °C degradiert TPU und ergibt verfärbte Drucke
- **Stringing** — TPU neigt zur Fadenbildung; Temperatur um 5 °C senken oder Kühlung erhöhen

:::tip Shore-Härte
TPU ist in verschiedenen Shore-Härten erhältlich (A85, A95, A98). Je niedriger Shore A, desto weicher und anspruchsvoller zu drucken. Das TPU von Bambu Lab ist Shore A 95 — ein guter Ausgangspunkt.
:::

## Lagerung

TPU ist stark hygroskopisch (zieht Feuchtigkeit an). Feuchtes TPU führt zu:
- Blasen und Zischen
- Schwachem und sprödem Druck (paradox für ein flexibles Material)
- Stringing

**TPU immer trocknen** bei 60 °C für 6–8 Stunden vor dem Drucken. In versiegelter Box mit Silicagel aufbewahren.
