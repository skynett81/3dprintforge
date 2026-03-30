---
sidebar_position: 6
title: ASA
description: Anleitung zum ASA-Druck mit Bambu Lab — UV-beständig, Außenbereich, Temperaturen und Tipps
---

# ASA

ASA (Acrylnitril-Styrol-Acrylat) ist eine UV-beständige Variante von ABS, die speziell für den Außenbereich entwickelt wurde. Das Material kombiniert die Festigkeit und Steifigkeit von ABS mit deutlich besserer Beständigkeit gegen UV-Strahlung, Alterung und Witterungseinflüsse.

## Einstellungen

| Parameter | Wert |
|-----------|------|
| Düsentemperatur | 240–260 °C |
| Betttemperatur | 90–110 °C |
| Kammertemperatur | 40–50 °C (empfohlen) |
| Bauteilkühlung | 30–50% |
| Geschwindigkeit | 80–100% |
| Trocknung erforderlich | Ja |

## Empfohlene Druckplatten

| Platte | Eignung | Klebestift? |
|--------|---------|------------|
| Engineering Plate | Ausgezeichnet | Nein |
| High Temp Plate | Gut | Ja |
| Textured PEI | Akzeptabel | Ja |
| Cool Plate (Smooth PEI) | Nicht empfohlen | — |

:::tip Engineering Plate ist am besten für ASA
Die Engineering Plate bietet die zuverlässigste Haftung für ASA ohne Klebestift. Die Platte hält den hohen Betttemperaturen stand und bietet gute Haftung, ohne dass das Teil dauerhaft haftet.
:::

## Druckeranforderungen

ASA erfordert eine **geschlossene Kammer (Enclosure)** für beste Ergebnisse. Ohne Einhausung werden Sie Folgendes erleben:

- **Warping** — Ecken heben sich von der Druckplatte ab
- **Schichttrennung** — schlechte Bindung zwischen den Schichten
- **Oberflächenrisse** — sichtbare Risse entlang des Drucks

| Drucker | Geeignet für ASA? | Anmerkung |
|---------|-------------------|-----------|
| X1C | Ausgezeichnet | Vollständig geschlossen, aktive Heizung |
| X1E | Ausgezeichnet | Vollständig geschlossen, aktive Heizung |
| P1S | Gut | Geschlossen, passive Heizung |
| P1P | Möglich mit Zubehör | Erfordert Einhausungszubehör |
| A1 | Nicht empfohlen | Offener Rahmen |
| A1 Mini | Nicht empfohlen | Offener Rahmen |

## ASA vs ABS — Vergleich

| Eigenschaft | ASA | ABS |
|-------------|-----|-----|
| UV-Beständigkeit | Ausgezeichnet | Schlecht |
| Außenbereich | Ja | Nein (vergilbt und wird spröde) |
| Warping | Mäßig | Hoch |
| Oberfläche | Matt, gleichmäßig | Matt, gleichmäßig |
| Chemische Beständigkeit | Gut | Gut |
| Preis | Etwas höher | Niedriger |
| Geruch beim Drucken | Mäßig | Stark |
| Schlagfestigkeit | Gut | Gut |
| Temperaturbeständigkeit | ~95–105 °C | ~95–105 °C |

:::warning Belüftung
ASA gibt beim Drucken Dämpfe ab, die reizend sein können. Drucken Sie in einem gut belüfteten Raum oder mit einem Luftfiltersystem. Drucken Sie ASA nicht in einem Raum, in dem Sie sich längere Zeit ohne Belüftung aufhalten.
:::

## Trocknung

ASA ist **mäßig hygroskopisch** und nimmt im Laufe der Zeit Feuchtigkeit aus der Luft auf.

| Parameter | Wert |
|-----------|------|
| Trocknungstemperatur | 65 °C |
| Trocknungszeit | 4–6 Stunden |
| Hygroskopisches Niveau | Mittel |
| Anzeichen von Feuchtigkeit | Knackgeräusche, Blasen, schlechte Oberfläche |

- Nach dem Öffnen in versiegeltem Beutel mit Silikagel aufbewahren
- AMS mit Trockenmittel reicht für die Kurzlagerung
- Für längere Lagerung: Vakuumbeutel oder Filament-Trockenbox verwenden

## Anwendungsbereiche

ASA ist das bevorzugte Material für alles, was **im Außenbereich** eingesetzt werden soll:

- **Fahrzeugkomponenten** — Spiegelgehäuse, Armaturenbrettdetails, Lüftungskappen
- **Gartenwerkzeuge** — Halterungen, Klemmen, Teile für Gartenmöbel
- **Außenschilder** — Schilder, Buchstaben, Logos
- **Drohnenteile** — Landegestell, Kamerahalterungen
- **Solarpanel-Montagen** — Halterungen und Winkel
- **Briefkastenteile** — Mechanismen und Dekorationen

## Tipps für erfolgreiches ASA-Drucken

### Brim und Haftung

- **Verwenden Sie Brim** für große Teile und Teile mit kleiner Kontaktfläche
- Brim von 5–8 mm verhindert Warping effektiv
- Für kleinere Teile können Sie es ohne Brim versuchen, aber halten Sie es als Backup bereit

### Zugluft vermeiden

- **Schließen Sie alle Türen und Fenster** im Raum während des Drucks
- Zugluft und kalte Luft sind ASAs schlimmster Feind
- Öffnen Sie nicht die Kammertür während des Drucks

### Temperaturstabilität

- Lassen Sie die Kammer **10–15 Minuten** aufheizen, bevor der Druck beginnt
- Stabile Kammertemperatur gibt gleichmäßigere Ergebnisse
- Vermeiden Sie es, den Drucker in der Nähe von Fenstern oder Lüftungsöffnungen aufzustellen

### Kühlung

- ASA benötigt **begrenzte Bauteilkühlung** — 30–50% ist typisch
- Für Überhänge und Brücken können Sie auf 60–70% erhöhen, erwarten Sie aber etwas Schichttrennung
- Für mechanische Teile: Priorisieren Sie Schichthaftung über Details, indem Sie die Kühlung reduzieren

:::tip Erstes Mal mit ASA?
Beginnen Sie mit einem kleinen Testteil (z. B. einem 30 mm Würfel), um Ihre Einstellungen zu kalibrieren. ASA verhält sich sehr ähnlich wie ABS, aber mit etwas geringerer Warping-Tendenz. Wenn Sie Erfahrung mit ABS haben, wird sich ASA wie ein Upgrade anfühlen.
:::

---

## Schrumpfung

ASA schrumpft mehr als PLA und PETG, aber im Allgemeinen etwas weniger als ABS:

| Material | Schrumpfung |
|----------|------------|
| PLA | ~0,3–0,5% |
| PETG | ~0,3–0,6% |
| ASA | ~0,5–0,7% |
| ABS | ~0,7–0,8% |

Für Teile mit engen Toleranzen: Kompensieren Sie mit 0,5–0,7% im Slicer, oder testen Sie zuerst mit Probeteilen.

---

## Nachbearbeitung

- **Aceton-Glätten** — ASA kann wie ABS mit Acetondämpfen geglättet werden
- **Schleifen** — lässt sich gut mit 200–400er Schleifpapier schleifen
- **Kleben** — CA-Kleber oder Acetonkleben funktioniert hervorragend
- **Lackieren** — nimmt nach leichtem Schleifen gut Farbe an

:::danger Acetonhandhabung
Aceton ist brennbar und gibt giftige Dämpfe ab. Verwenden Sie es immer in einem gut belüfteten Raum, vermeiden Sie offene Flammen und verwenden Sie Schutzausrüstung (Handschuhe und Schutzbrille).
:::
