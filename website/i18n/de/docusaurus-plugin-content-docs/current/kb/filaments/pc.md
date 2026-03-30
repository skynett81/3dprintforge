---
sidebar_position: 7
title: PC
description: Anleitung zum Polycarbonat-Druck mit Bambu Lab — hohe Festigkeit, Wärmebeständigkeit und Anforderungen
---

# PC (Polycarbonat)

Polycarbonat ist eines der stärksten thermoplastischen Materialien, die für den FDM-Druck verfügbar sind. Es kombiniert extrem hohe Schlagfestigkeit, Wärmebeständigkeit bis 110–130 °C und natürliche Transparenz. PC ist ein anspruchsvolles Material zum Drucken, liefert aber Ergebnisse, die an Spritzgussqualität heranreichen.

## Einstellungen

| Parameter | Reines PC | PC-ABS Blend | PC-CF |
|-----------|----------|-------------|-------|
| Düsentemperatur | 260–280 °C | 250–270 °C | 270–290 °C |
| Betttemperatur | 100–120 °C | 90–110 °C | 100–120 °C |
| Kammertemperatur | 50–60 °C (erforderlich) | 45–55 °C | 50–60 °C |
| Bauteilkühlung | 0–20% | 20–30% | 0–20% |
| Geschwindigkeit | 60–80% | 70–90% | 50–70% |
| Trocknung erforderlich | Ja (kritisch) | Ja | Ja (kritisch) |

## Empfohlene Druckplatten

| Platte | Eignung | Klebestift? |
|--------|---------|------------|
| High Temp Plate | Ausgezeichnet (erforderlich) | Nein |
| Engineering Plate | Akzeptabel | Ja |
| Textured PEI | Nicht empfohlen | — |
| Cool Plate (Smooth PEI) | Nicht verwenden | — |

:::danger High Temp Plate ist erforderlich
PC benötigt Betttemperaturen von 100–120 °C. Cool Plate und Textured PEI halten diesen Temperaturen nicht stand und werden beschädigt. Verwenden Sie **immer** High Temp Plate für reines PC.
:::

## Drucker- und Ausrüstungsanforderungen

### Einhausung (erforderlich)

PC erfordert eine **vollständig geschlossene Kammer** mit stabiler Temperatur von 50–60 °C. Ohne dies werden Sie schweres Warping, Schichttrennung und Delamination erleben.

### Gehärtete Düse (dringend empfohlen)

Reines PC ist nicht abrasiv, aber PC-CF und PC-GF **erfordern eine gehärtete Stahldüse** (z. B. Bambu Lab HS01). Für reines PC wird eine gehärtete Düse aufgrund der hohen Temperaturen dennoch empfohlen.

### Druckerkompatibilität

| Drucker | Geeignet für PC? | Anmerkung |
|---------|-----------------|-----------|
| X1C | Ausgezeichnet | Vollständig geschlossen, HS01 verfügbar |
| X1E | Ausgezeichnet | Für Engineering-Materialien konzipiert |
| P1S | Eingeschränkt | Geschlossen, aber ohne aktive Kammerheizung |
| P1P | Nicht empfohlen | Ohne Einhausung |
| A1 / A1 Mini | Nicht verwenden | Offener Rahmen, zu niedrige Temperaturen |

:::warning Nur X1C und X1E empfohlen
PC erfordert aktive Kammerheizung für konsistente Ergebnisse. P1S kann bei kleinen Teilen akzeptable Ergebnisse liefern, erwarten Sie aber Warping und Schichttrennung bei größeren Teilen.
:::

## Trocknung

PC ist **stark hygroskopisch** und nimmt schnell Feuchtigkeit auf. Feuchtes PC gibt katastrophale Druckergebnisse.

| Parameter | Wert |
|-----------|------|
| Trocknungstemperatur | 70–80 °C |
| Trocknungszeit | 6–8 Stunden |
| Hygroskopisches Niveau | Hoch |
| Max. empfohlene Feuchtigkeit | < 0,02% |

- **Immer** PC vor dem Drucken trocknen — auch frisch geöffnete Spulen können Feuchtigkeit aufgenommen haben
- Wenn möglich direkt aus der Trockenbox drucken
- AMS ist **nicht ausreichend** für die PC-Lagerung — die Feuchtigkeit ist zu hoch
- Verwenden Sie einen dedizierten Filamenttrockner mit aktiver Heizung

:::danger Feuchtigkeit zerstört PC-Drucke
Anzeichen von feuchtem PC: lautes Knacken, Blasen auf der Oberfläche, sehr schlechte Schichthaftung, Stringing. Feuchtes PC kann nicht durch Einstellungen kompensiert werden — es **muss** zuerst getrocknet werden.
:::

## Eigenschaften

| Eigenschaft | Wert |
|-------------|------|
| Zugfestigkeit | 55–75 MPa |
| Schlagfestigkeit | Extrem hoch |
| Wärmebeständigkeit (HDT) | 110–130 °C |
| Transparenz | Ja (natürliche/klare Variante) |
| Chemische Beständigkeit | Mäßig |
| UV-Beständigkeit | Mäßig (vergilbt mit der Zeit) |
| Schrumpfung | ~0,5–0,7% |

## PC-Blends

### PC-ABS

Eine Mischung aus Polycarbonat und ABS, die die Stärken beider Materialien kombiniert:

- **Einfacher zu drucken** als reines PC — niedrigere Temperaturen und weniger Warping
- **Schlagfestigkeit** zwischen ABS und PC
- **Beliebt in der Industrie** — wird in Fahrzeuginnenräumen und Elektronikgehäusen verwendet
- Druckt bei 250–270 °C Düse, 90–110 °C Bett

### PC-CF (Kohlefaser)

Kohlefaserverstärktes PC für maximale Steifigkeit und Festigkeit:

- **Extrem steif** — ideal für strukturelle Teile
- **Leicht** — Kohlefaser reduziert das Gewicht
- **Erfordert gehärtete Düse** — Messing verschleißt in Stunden
- Druckt bei 270–290 °C Düse, 100–120 °C Bett
- Teurer als reines PC, bietet aber mechanische Eigenschaften nahe an Aluminium

### PC-GF (Glasfaser)

Glasfaserverstärktes PC:

- **Günstiger als PC-CF** mit guter Steifigkeit
- **Weißere Oberfläche** als PC-CF
- **Erfordert gehärtete Düse** — Glasfasern sind sehr abrasiv
- Etwas weniger steif als PC-CF, aber bessere Schlagfestigkeit

## Anwendungsbereiche

PC wird dort eingesetzt, wo Sie **maximale Festigkeit und/oder Wärmebeständigkeit** benötigen:

- **Mechanische Teile** — Zahnräder, Halterungen, Kupplungen unter Belastung
- **Optische Teile** — Linsen, Lichtleiter, transparente Abdeckungen (klares PC)
- **Wärmebeständige Teile** — Motorraum, in der Nähe von Heizelementen
- **Elektronikgehäuse** — schützende Gehäuse mit guter Schlagfestigkeit
- **Werkzeuge und Vorrichtungen** — präzise Montagewerkzeuge

## Tipps für erfolgreiches PC-Drucken

### Erste Schicht

- Geschwindigkeit auf **30–40%** für die erste Schicht reduzieren
- Betttemperatur um 5 °C über Standard für die ersten 3–5 Schichten erhöhen
- **Brim ist obligatorisch** für die meisten PC-Teile — verwenden Sie 8–10 mm

### Kammertemperatur

- Die Kammer muss **50 °C+** erreichen, bevor der Druck beginnt
- **Öffnen Sie nicht die Kammertür** während des Drucks — der Temperaturabfall verursacht sofortiges Warping
- Nach dem Drucken: das Teil **langsam** in der Kammer abkühlen lassen (1–2 Stunden)

### Kühlung

- **Minimale Bauteilkühlung** (0–20%) für beste Schichthaftung verwenden
- Für Brücken und Überhänge: vorübergehend auf 30–40% erhöhen
- Schichtfestigkeit über Ästhetik bei PC priorisieren

### Designhinweise

- **Scharfe Ecken vermeiden** — mit mindestens 1 mm Radius abrunden
- **Gleichmäßige Wandstärke** — ungleichmäßige Dicke erzeugt innere Spannungen
- **Große, flache Oberflächen** sind schwierig — aufteilen oder Rippen hinzufügen

:::tip Neu bei PC? Beginnen Sie mit PC-ABS
Wenn Sie noch nie PC gedruckt haben, beginnen Sie mit einem PC-ABS Blend. Es ist viel toleranter als reines PC und gibt Ihnen Erfahrung mit dem Material ohne die extremen Anforderungen. Wenn Sie PC-ABS beherrschen, gehen Sie zu reinem PC über.
:::

---

## Nachbearbeitung

- **Schleifen** — PC lässt sich gut schleifen, verwenden Sie aber Nassschleifen für klares PC
- **Polieren** — klares PC kann auf nahezu optische Qualität poliert werden
- **Kleben** — Dichlormethankleben ergibt unsichtbare Nähte (Schutzausrüstung verwenden!)
- **Lackieren** — erfordert Grundierung für gute Haftung
- **Tempern** — 120 °C für 1–2 Stunden reduziert innere Spannungen

:::warning Dichlormethankleben
Dichlormethan ist giftig und erfordert Absaugung, chemikalienbeständige Handschuhe und Schutzbrille. Arbeiten Sie immer in einem gut belüfteten Raum oder Abzug.
:::
