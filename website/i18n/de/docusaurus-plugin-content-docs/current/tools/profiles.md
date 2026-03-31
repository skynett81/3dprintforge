---
sidebar_position: 3
title: Druckprofile
description: Erstellen, bearbeiten und verwalten Sie Druckprofile mit voreingestellten Einstellungen für schnelles und konsistentes Drucken
---

# Druckprofile

Druckprofile sind gespeicherte Sätze von Druckeinstellungen, die Sie druckübergreifend und druckerübergreifend wiederverwenden können. Sparen Sie Zeit und gewährleisten Sie konsistente Qualität durch die Definition von Profilen für verschiedene Zwecke.

Navigieren Sie zu: **https://localhost:3443/#profiles**

## Ein Profil erstellen

1. Gehen Sie zu **Werkzeuge → Druckprofile**
2. Klicken Sie auf **Neues Profil** (+ Symbol)
3. Füllen Sie aus:
   - **Profilname** — beschreibender Name, z.B. „PLA - Schnellproduktion"
   - **Material** — aus Liste auswählen (PLA / PETG / ABS / PA / PC / TPU usw.)
   - **Druckermodell** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Alle
   - **Beschreibung** — optionaler Text

4. Einstellungen ausfüllen (siehe Abschnitte unten)
5. Klicken Sie auf **Profil speichern**

## Einstellungen in einem Profil

### Temperatur
| Feld | Beispiel |
|---|---|
| Düsentemperatur | 220 °C |
| Betttemperatur | 60 °C |
| Kammertemperatur (X1C) | 35 °C |

### Geschwindigkeit
| Feld | Beispiel |
|---|---|
| Geschwindigkeitseinstellung | Standard |
| Max. Geschwindigkeit (mm/s) | 200 |
| Beschleunigung | 5000 mm/s² |

### Qualität
| Feld | Beispiel |
|---|---|
| Lagenstärke | 0,2 mm |
| Füllprozent | 15 % |
| Füllmuster | Raster |
| Stützmaterial | Auto |

### AMS und Farben
| Feld | Beschreibung |
|---|---|
| Spülvolumen | Menge der Reinigungsspülung beim Farbwechsel |
| Bevorzugte Schächte | Welche AMS-Schächte bevorzugt werden |

### Erweitert
| Feld | Beschreibung |
|---|---|
| Trockenmodus | AMS-Trocknung für feuchte Materialien aktivieren |
| Abkühlzeit | Pause zwischen Lagen zum Abkühlen |
| Lüftergeschwindigkeit | Kühlgebläse-Geschwindigkeit in Prozent |

## Ein Profil bearbeiten

1. Klicken Sie auf das Profil in der Liste
2. Klicken Sie auf **Bearbeiten** (Stift-Symbol)
3. Änderungen vornehmen
4. Klicken Sie auf **Speichern** (überschreiben) oder **Als neu speichern** (Kopie erstellen)

:::tip Versionierung
Verwenden Sie „Als neu speichern", um ein funktionierendes Profil beizubehalten, während Sie mit Änderungen experimentieren.
:::

## Ein Profil verwenden

### Aus der Dateibibliothek

1. Datei in der Bibliothek auswählen
2. Klicken Sie auf **An Drucker senden**
3. **Profil** aus der Dropdown-Liste auswählen
4. Die Einstellungen aus dem Profil werden verwendet

### Aus der Druckwarteschlange

1. Neuen Warteschlangenauftrag erstellen
2. **Profil** unter Einstellungen auswählen
3. Das Profil wird mit dem Warteschlangenauftrag verknüpft

## Profile importieren und exportieren

### Export
1. Ein oder mehrere Profile auswählen
2. Klicken Sie auf **Exportieren**
3. Format wählen: **JSON** (für Import in andere Dashboards) oder **PDF** (zum Drucken/Dokumentieren)

### Import
1. Klicken Sie auf **Profile importieren**
2. Eine `.json`-Datei auswählen, die aus einem anderen 3DPrintForge exportiert wurde
3. Vorhandene Profile mit demselben Namen können überschrieben oder beide behalten werden

## Profile teilen

Teilen Sie Profile mit anderen über das Community-Filamentmodul (siehe [Community-Filamente](../integrations/community)) oder über direkten JSON-Export.

## Standardprofil

Ein Standardprofil pro Material festlegen:

1. Profil auswählen
2. Klicken Sie auf **Als Standard für [Material] setzen**
3. Das Standardprofil wird automatisch ausgewählt, wenn Sie eine Datei mit diesem Material senden
