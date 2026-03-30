---
sidebar_position: 5
title: Fehlerbehebung bei fehlgeschlagenen Drucken
description: Diagnostizieren und lösen Sie häufige Druckfehler mithilfe der Fehlerprotokolle und Werkzeuge des Bambu Dashboards
---

# Fehlerbehebung bei fehlgeschlagenen Drucken

Etwas ist schiefgelaufen? Keine Sorge — die meisten Druckfehler haben einfache Lösungen. Bambu Dashboard hilft Ihnen, die Ursache schnell zu finden.

## Schritt 1 — HMS-Fehlercodes prüfen

HMS (Handling, Monitoring, Sensing) ist das Fehlersystem von Bambu Labs. Alle Fehler werden automatisch im Dashboard protokolliert.

1. Gehen Sie zu **Überwachung → Fehler**
2. Den fehlgeschlagenen Druck finden
3. Auf den Fehlercode klicken, um eine detaillierte Beschreibung und einen Lösungsvorschlag zu erhalten

Häufige HMS-Codes:

| Code | Beschreibung | Schnelllösung |
|------|-------------|---------------|
| 0700 1xxx | AMS-Fehler (verklemmt, Motorproblem) | Filamentpfad im AMS prüfen |
| 0300 0xxx | Extrusionsfehler (Unter-/Überextrusion) | Düse reinigen, Filament prüfen |
| 0500 xxxx | Kalibrierungsfehler | Neukalibrierung durchführen |
| 1200 xxxx | Temperaturabweichung | Kabelverbindungen prüfen |
| 0C00 xxxx | Kamerafehler | Drucker neu starten |

:::tip Fehlercodes im Verlauf
Unter **Verlauf → [Druck] → HMS-Protokoll** können Sie alle Fehlercodes sehen, die während des Drucks aufgetreten sind — auch wenn der Druck „abgeschlossen" wurde.
:::

## Häufige Fehler und Lösungen

### Schlechte Haftung (erste Schicht haftet nicht)

**Symptome:** Druck löst sich von der Platte, rollt sich auf, erste Schicht fehlt

**Ursachen und Lösungen:**

| Ursache | Lösung |
|---------|--------|
| Schmutzige Platte | Mit IPA-Alkohol abwischen |
| Falsche Plattentemperatur | Um 5°C erhöhen |
| Z-Offset falsch | Auto Bed Leveling erneut durchführen |
| Fehlender Klebestift (PETG/ABS) | Dünne Schicht Klebestift auftragen |
| Zu hohe Erstschichtgeschwindigkeit | Auf 20–30 mm/s für erste Schicht senken |

**Schnell-Checkliste:**
1. Ist die Platte sauber? (IPA + fusselfreies Tuch)
2. Verwenden Sie die richtige Platte für den Filamenttyp? (siehe [Richtige Platte wählen](./choosing-plate))
3. Wurde die Z-Kalibrierung nach dem letzten Plattenwechsel durchgeführt?

---

### Warping (Ecken heben sich)

**Symptome:** Ecken biegen sich von der Platte, besonders bei großen flachen Modellen

**Ursachen und Lösungen:**

| Ursache | Lösung |
|---------|--------|
| Temperaturdifferenz | Frontklappe des Druckers schließen |
| Fehlender Brim | Brim in Bambu Studio aktivieren (3–5 mm) |
| Zu kalte Platte | Plattentemperatur um 5–10°C erhöhen |
| Filament mit hoher Schrumpfung (ABS) | Engineering Plate + Kammer >40°C verwenden |

**ABS und ASA sind besonders anfällig.** Immer sicherstellen:
- Frontklappe geschlossen
- So wenig Belüftung wie möglich
- Engineering Plate + Klebestift
- Kammertemperatur 40°C+

---

### Stringing (Fäden zwischen Teilen)

**Symptome:** Feine Plastikfäden zwischen separaten Teilen des Modells

**Ursachen und Lösungen:**

| Ursache | Lösung |
|---------|--------|
| Feuchtes Filament | Filament 6–8 Stunden trocknen (60–70°C) |
| Zu hohe Düsentemperatur | Um 5°C senken |
| Zu wenig Retraktion | Retraktionslänge in Bambu Studio erhöhen |
| Zu niedrige Reisegeschwindigkeit | Travel Speed auf 200+ mm/s erhöhen |

**Feuchtigkeitstest:** Auf Knistergeräusche hören oder auf Blasen in der Extrusion achten — das deutet auf feuchtes Filament hin. Bambu AMS hat eine eingebaute Feuchtigkeitsmessung; Feuchtigkeit unter **AMS-Status** prüfen.

:::tip Filamenttrockner
Investieren Sie in einen Filamenttrockner (z. B. Bambu Filament Dryer), wenn Sie mit Nylon oder TPU arbeiten — diese absorbieren Feuchtigkeit in unter 12 Stunden.
:::

---

### Spaghetti (Druck kollabiert zu einem Klumpen)

**Symptome:** Filament hängt in losen Fäden in der Luft, Druck nicht erkennbar

**Ursachen und Lösungen:**

| Ursache | Lösung |
|---------|--------|
| Schlechte Haftung früh → gelöst → kollabiert | Siehe Haftungsabschnitt oben |
| Zu hohe Geschwindigkeit | Geschwindigkeit um 20–30% senken |
| Falsche Stützkonfiguration | Stützen in Bambu Studio aktivieren |
| Zu steiler Überhang | Modell aufteilen oder um 45° drehen |

**Print Guard verwenden, um Spaghetti automatisch zu stoppen** — siehe nächsten Abschnitt.

---

### Unterextrusion (dünne, schwache Schichten)

**Symptome:** Schichten sind nicht solid, Löcher in Wänden, schwaches Modell

**Ursachen und Lösungen:**

| Ursache | Lösung |
|---------|--------|
| Düse teilweise verstopft | Cold Pull durchführen (siehe Wartung) |
| Filament zu feucht | Filament trocknen |
| Zu niedrige Temperatur | Düsentemperatur um 5–10°C erhöhen |
| Zu hohe Geschwindigkeit | Um 20–30% senken |
| PTFE-Schlauch beschädigt | PTFE-Schlauch prüfen und wechseln |

## Print Guard für automatischen Schutz verwenden

Print Guard überwacht die Kamerabilder mit Bilderkennung und stoppt den Druck automatisch, wenn Spaghetti erkannt wird.

**Print Guard aktivieren:**
1. Gehen Sie zu **Überwachung → Print Guard**
2. **Automatische Erkennung** aktivieren
3. Aktion wählen: **Pause** (empfohlen) oder **Abbrechen**
4. Empfindlichkeit einstellen (mit **Mittel** beginnen)

**Wenn Print Guard eingreift:**
1. Sie erhalten eine Benachrichtigung mit einem Kamerabild des Erkannten
2. Der Druck wird pausiert
3. Sie können wählen: **Fortsetzen** (bei falsch positivem) oder **Druck abbrechen**

:::info Falsch-Positive
Print Guard kann manchmal auf Modelle mit vielen dünnen Säulen reagieren. Empfindlichkeit senken oder vorübergehend für komplexe Modelle deaktivieren.
:::

## Diagnosewerkzeuge im Dashboard

### Temperaturprotokoll
Unter **Verlauf → [Druck] → Temperaturen** können Sie die Temperaturkurve während des gesamten Drucks sehen. Achten Sie auf:
- Plötzliche Temperaturabfälle (Düsen- oder Plattenproblem)
- Ungleichmäßige Temperaturen (Kalibrierungsbedarf)

### Filamentstatistik
Prüfen Sie, ob das verbrauchte Filament mit der Schätzung übereinstimmt. Große Abweichungen können auf Unterextrusion oder Filamentbruch hinweisen.

## Wann den Support kontaktieren?

Kontaktieren Sie den Bambu Labs Support, wenn:
- Der HMS-Code sich wiederholt, nachdem Sie alle Lösungsvorschläge befolgt haben
- Sie mechanische Schäden am Drucker sehen (verbogene Stangen, beschädigte Zahnräder)
- Temperaturwerte unmöglich sind (z. B. Düse zeigt -40°C)
- Ein Firmware-Update das Problem nicht löst

**Nützlich für den Support:**
- HMS-Fehlercodes aus dem Fehlerprotokoll des Dashboards
- Kamerabild des Fehlers
- Welches Filament und welche Einstellungen verwendet wurden (kann aus dem Verlauf exportiert werden)
- Druckermodell und Firmware-Version (angezeigt unter **Einstellungen → Drucker → Info**)
