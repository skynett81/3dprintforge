---
sidebar_position: 10
title: Kompatibilitätsmatrix
description: Komplette Übersicht über Materialkompatibilität mit Bambu Lab-Platten, Druckern und Düsen
---

# Kompatibilitätsmatrix

Diese Seite bietet eine komplette Übersicht darüber, welche Materialien mit welchen Druckplatten, Druckern und Düsentypen funktionieren. Verwenden Sie die Tabellen als Referenz bei der Planung von Drucken mit neuen Materialien.

---

## Materialien und Druckplatten

| Material | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Klebestift |
|----------|-----------|-------------------|-----------------|--------------|-----------|
| PLA | Ausgezeichnet | Gut | Nicht empfohlen | Gut | Nein |
| PLA+ | Ausgezeichnet | Gut | Nicht empfohlen | Gut | Nein |
| PLA-CF | Ausgezeichnet | Gut | Nicht empfohlen | Gut | Nein |
| PLA Silk | Ausgezeichnet | Gut | Nicht empfohlen | Gut | Nein |
| PETG | Schlecht | Ausgezeichnet | Gut | Gut | Ja (Cool) |
| PETG-CF | Schlecht | Ausgezeichnet | Gut | Akzeptabel | Ja (Cool) |
| ABS | Nicht empfohlen | Ausgezeichnet | Gut | Akzeptabel | Ja (HT) |
| ASA | Nicht empfohlen | Ausgezeichnet | Gut | Akzeptabel | Ja (HT) |
| TPU | Gut | Gut | Nicht empfohlen | Ausgezeichnet | Nein |
| PA (Nylon) | Nicht empfohlen | Ausgezeichnet | Gut | Schlecht | Ja |
| PA-CF | Nicht empfohlen | Ausgezeichnet | Gut | Schlecht | Ja |
| PA-GF | Nicht empfohlen | Ausgezeichnet | Gut | Schlecht | Ja |
| PC | Nicht empfohlen | Akzeptabel | Ausgezeichnet | Nicht empfohlen | Ja (Eng) |
| PC-CF | Nicht empfohlen | Akzeptabel | Ausgezeichnet | Nicht empfohlen | Ja (Eng) |
| PVA | Ausgezeichnet | Gut | Nicht empfohlen | Gut | Nein |
| HIPS | Nicht empfohlen | Gut | Gut | Akzeptabel | Nein |
| PVB | Gut | Gut | Nicht empfohlen | Gut | Nein |

**Erklärung:**
- **Ausgezeichnet** — funktioniert optimal, empfohlene Kombination
- **Gut** — funktioniert gut, akzeptable Alternative
- **Akzeptabel** — funktioniert, aber nicht ideal — erfordert zusätzliche Maßnahmen
- **Schlecht** — kann mit Modifikationen funktionieren, aber nicht empfohlen
- **Nicht empfohlen** — schlechte Ergebnisse oder Risiko einer Beschädigung der Platte

:::tip PETG und Cool Plate
PETG haftet **zu gut** auf Cool Plate (Smooth PEI) und kann die PEI-Beschichtung abreißen, wenn das Teil entfernt wird. Verwenden Sie immer Klebestift als Trennfilm, oder wählen Sie die Engineering Plate.
:::

:::warning PC und Plattenauswahl
PC erfordert High Temp Plate aufgrund der hohen Betttemperaturen (100–120 °C). Andere Platten können bei diesen Temperaturen permanent verformt werden.
:::

---

## Materialien und Drucker

| Material | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA+ | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| PETG | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PETG-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| ABS | Nein | Nein | Möglich** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| ASA | Nein | Nein | Möglich** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| TPU | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PA (Nylon) | Nein | Nein | Nein | Möglich** | Möglich** | Ja | Ja | Ja | Ja | Ja |
| PA-CF | Nein | Nein | Nein | Nein | Nein | Ja | Ja | Möglich** | Möglich** | Möglich** |
| PA-GF | Nein | Nein | Nein | Nein | Nein | Ja | Ja | Möglich** | Möglich** | Möglich** |
| PC | Nein | Nein | Nein | Möglich** | Nein | Ja | Ja | Möglich** | Möglich** | Möglich** |
| PC-CF | Nein | Nein | Nein | Nein | Nein | Ja | Ja | Nein | Nein | Nein |
| PVA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| HIPS | Nein | Nein | Möglich** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |

**Erklärung:**
- **Ja** — vollständig unterstützt und empfohlen
- **Ja*** — erfordert gehärtete Stahldüse (HS01 oder gleichwertig)
- **Möglich**** — kann mit Einschränkungen funktionieren, nicht offiziell empfohlen
- **Nein** — nicht geeignet (fehlende Einhausung, zu niedrige Temperaturen usw.)

:::danger Einhausungsanforderungen
Materialien, die eine Einhausung erfordern (ABS, ASA, PA, PC):
- **A1 und A1 Mini** haben einen offenen Rahmen — nicht geeignet
- **P1P** hat einen offenen Rahmen — erfordert Einhausungszubehör
- **P1S** hat eine Einhausung, aber keine aktive Kammerheizung
- **X1C und X1E** haben eine vollständige Einhausung mit aktiver Heizung — empfohlen für anspruchsvolle Materialien
:::

---

## Materialien und Düsentypen

| Material | Messing (Standard) | Gehärteter Stahl (HS01) | Hardened Steel |
|----------|-------------------|------------------------|----------------|
| PLA | Ausgezeichnet | Ausgezeichnet | Ausgezeichnet |
| PLA+ | Ausgezeichnet | Ausgezeichnet | Ausgezeichnet |
| PLA-CF | Nicht verwenden | Ausgezeichnet | Ausgezeichnet |
| PLA Silk | Ausgezeichnet | Ausgezeichnet | Ausgezeichnet |
| PETG | Ausgezeichnet | Ausgezeichnet | Ausgezeichnet |
| PETG-CF | Nicht verwenden | Ausgezeichnet | Ausgezeichnet |
| ABS | Ausgezeichnet | Ausgezeichnet | Ausgezeichnet |
| ASA | Ausgezeichnet | Ausgezeichnet | Ausgezeichnet |
| TPU | Ausgezeichnet | Gut | Gut |
| PA (Nylon) | Gut | Ausgezeichnet | Ausgezeichnet |
| PA-CF | Nicht verwenden | Ausgezeichnet | Ausgezeichnet |
| PA-GF | Nicht verwenden | Ausgezeichnet | Ausgezeichnet |
| PC | Gut | Ausgezeichnet | Ausgezeichnet |
| PC-CF | Nicht verwenden | Ausgezeichnet | Ausgezeichnet |
| PVA | Ausgezeichnet | Gut | Gut |
| HIPS | Ausgezeichnet | Ausgezeichnet | Ausgezeichnet |
| PVB | Ausgezeichnet | Gut | Gut |

:::danger Kohlefaser und Glasfaser erfordern gehärtete Düse
Alle Materialien mit **-CF** (Kohlefaser) oder **-GF** (Glasfaser) **erfordern eine gehärtete Stahldüse**. Messing verschleißt innerhalb von Stunden bis Tagen mit diesen Materialien. Bambu Lab HS01 wird empfohlen.

Materialien, die eine gehärtete Düse erfordern:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Messing vs gehärteter Stahl für normale Materialien
Messingdüsen bieten **bessere Wärmeleitfähigkeit** und damit gleichmäßigere Extrusion für normale Materialien (PLA, PETG, ABS). Gehärteter Stahl funktioniert gut, kann aber 5–10 °C höhere Temperatur erfordern. Verwenden Sie Messing für den täglichen Gebrauch und wechseln Sie zu gehärtetem Stahl für CF/GF-Materialien.
:::

---

## Tipps für Materialwechsel

Beim Wechsel zwischen Materialien im AMS oder manuell ist korrektes Purging wichtig, um Kontamination zu vermeiden.

### Empfohlene Purge-Menge

| Von → Nach | Purge-Menge | Anmerkung |
|-----------|-------------|-----------|
| PLA → PLA (andere Farbe) | 100–150 mm³ | Standard-Farbwechsel |
| PLA → PETG | 200–300 mm³ | Temperaturerhöhung, unterschiedlicher Fluss |
| PETG → PLA | 200–300 mm³ | Temperaturabsenkung |
| ABS → PLA | 300–400 mm³ | Großer Temperaturunterschied |
| PLA → ABS | 300–400 mm³ | Großer Temperaturunterschied |
| PA → PLA | 400–500 mm³ | Nylon bleibt im Hotend zurück |
| PC → PLA | 400–500 mm³ | PC erfordert gründliches Purging |
| Dunkel → Hell | 200–300 mm³ | Dunkles Pigment ist schwer zu spülen |
| Hell → Dunkel | 100–150 mm³ | Leichterer Übergang |

### Temperaturwechsel beim Materialwechsel

| Übergang | Empfehlung |
|----------|-----------|
| Kalt → Warm (z. B. PLA → ABS) | Auf neues Material aufheizen, gründlich purgen |
| Warm → Kalt (z. B. ABS → PLA) | Zuerst bei hoher Temperatur purgen, dann absenken |
| Ähnliche Temperaturen (z. B. PLA → PLA) | Standard-Purge |
| Großer Unterschied (z. B. PLA → PC) | Zwischenstopp mit PETG kann helfen |

:::warning Nylon und PC hinterlassen Rückstände
PA (Nylon) und PC sind besonders schwer herauszupurgen. Nach der Verwendung dieser Materialien:
1. Mit **PETG** oder **ABS** bei hoher Temperatur (260–280 °C) purgen
2. Mindestens **500 mm³** Purge-Material durchlaufen lassen
3. Extrusion visuell inspizieren — sie sollte völlig sauber ohne Verfärbung sein
:::

---

## Schnellreferenz — Materialauswahl

Unsicher, welches Material Sie brauchen? Verwenden Sie diese Anleitung:

| Bedarf | Empfohlenes Material |
|--------|---------------------|
| Prototyping / täglicher Gebrauch | PLA |
| Mechanische Festigkeit | PETG, PLA Tough |
| Außenbereich | ASA |
| Wärmebeständigkeit | ABS, ASA, PC |
| Flexible Teile | TPU |
| Maximale Festigkeit | PA-CF, PC-CF |
| Transparent | PETG (natur), PC (natur) |
| Ästhetik / Dekoration | PLA Silk, PLA Sparkle |
| Schnappverbindung / Filmscharniere | PETG, PA |
| Lebensmittelkontakt | PLA (mit Vorbehalt) |
