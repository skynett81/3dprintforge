---
sidebar_position: 4
title: Schmierung
description: Schmierung von Linearschienen, Lagern und Intervallen für Bambu Lab-Drucker
---

# Schmierung

Richtige Schmierung beweglicher Teile reduziert Verschleiß, senkt den Geräuschpegel und gewährleistet präzise Bewegung. Bambu Lab-Drucker verwenden Linearbewegungssysteme, die periodische Schmierung erfordern.

## Schmierungstypen

| Komponente | Schmierungstyp | Produkt |
|-----------|-------------|---------|
| Linearschienen (XY) | Leichtes Maschinenöl oder PTFE-Spray | 3-in-1, Super Lube |
| Z-Achsen-Gewindespindel | Dickes Schmierfett | Super Lube Fett |
| Linearlager | Leichtes Lithiumfett | Bambu Lab Schmierfett |
| Kabelkettengelenke | Keine (trocken) | — |

## Linearschienen

### X- und Y-Achse
Die Schienen sind gehärtete Stahlstangen, die durch Linearlager gleiten:

```
Intervall: Alle 200–300 Stunden oder bei quietschenden Geräuschen
Menge: Sehr wenig — ein Tropfen pro Stangenpunkt reicht
Methode:
1. Drucker ausschalten
2. Schlitten manuell an das Ende fahren
3. 1 Tropfen leichtes Öl in der Mitte der Stange auftragen
4. Schlitten langsam 10 Mal hin und her bewegen
5. Überschüssiges Öl mit fusselfreiem Papier abwischen
```

:::warning Nicht überschmieren
Zu viel Öl zieht Staub an und bildet eine schleifende Paste. Minimale Mengen verwenden und Überschuss immer abwischen.
:::

### Z-Achse (vertikal)
Die Z-Achse verwendet eine Gewindespindel (Leadscrew), die Fett (kein Öl) erfordert:

```
Intervall: Alle 200 Stunden
Methode:
1. Drucker ausschalten
2. Eine dünne Schicht Fett entlang der Gewindespindel auftragen
3. Z-Achse manuell (oder über Wartungsmenü) auf und ab fahren
4. Fett wird automatisch verteilt
```

## Linearlager

Bambu Lab P1S und X1C verwenden Linearlager (MGN12) auf der Y-Achse:

```
Intervall: Alle 300–500 Stunden
Methode:
1. Etwas Fett mit einer Nadel oder einem Zahnstocher aus der Einspritzöffnung entfernen
2. Neues Fett mit einer Spritze und dünner Kanüle einspritzen
3. Achse hin und her fahren, um das Fett zu verteilen
```

Bambu Lab verkauft offizielles Schmierfett (Bambu Lubricant), das auf das System abgestimmt ist.

## Schmierungswartung für verschiedene Modelle

### X1C / P1S
- Y-Achse: Linearlager — Bambu-Fett
- X-Achse: Kohlenstoffstangen — leichtes Öl
- Z-Achse: Doppelte Gewindespindel — Bambu-Fett

### A1 / A1 Mini
- Alle Achsen: Stahlstangen — leichtes Öl
- Z-Achse: Einzelne Gewindespindel — Bambu-Fett

## Anzeichen, dass Schmierung benötigt wird

- **Quietschende oder scharrende Geräusche** bei Bewegung
- **Vibrationsmuster** sichtbar auf vertikalen Wänden (VFA)
- **Ungenaue Abmessungen** ohne andere Ursachen
- **Erhöhte Geräuschentwicklung** vom Bewegungssystem

## Schmierungsintervalle

| Aktivität | Intervall |
|-----------|---------|
| XY-Schienen ölen | Alle 200–300 Stunden |
| Z-Spindel fetten | Alle 200 Stunden |
| Linearlager fetten (X1C/P1S) | Alle 300–500 Stunden |
| Vollständiger Wartungszyklus | Halbjährlich (oder 500 Stunden) |

Das Wartungsmodul im Dashboard verwenden, um Intervalle automatisch zu verfolgen.
