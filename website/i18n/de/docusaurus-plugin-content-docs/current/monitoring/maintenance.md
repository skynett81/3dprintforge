---
sidebar_position: 4
title: Wartung
description: Behalten Sie den Überblick über Düsenwechsel, Schmierung und andere Wartungsaufgaben mit Erinnerungen, Intervallen und Kostenprotokoll
---

# Wartung

Das Wartungsmodul hilft Ihnen, alle Wartungsarbeiten an Ihren Bambu Lab-Druckern zu planen und zu verfolgen — vom Düsenwechsel bis zur Schmierung der Schienen.

Navigieren Sie zu: **https://localhost:3443/#maintenance**

## Wartungsplan

Bambu Dashboard wird mit vorkonfigurierten Wartungsintervallen für alle Bambu Lab-Druckermodelle geliefert:

| Aufgabe | Intervall (Standard) | Modell |
|---|---|---|
| Düse reinigen | Alle 200 Stunden | Alle |
| Düse wechseln (Messing) | Alle 500 Stunden | Alle |
| Düse wechseln (gehärtet) | Alle 2000 Stunden | Alle |
| X-Achse schmieren | Alle 300 Stunden | X1C, P1S |
| Z-Achse schmieren | Alle 300 Stunden | Alle |
| AMS-Zahnrad reinigen | Alle 200 Stunden | AMS |
| Kammer reinigen | Alle 500 Stunden | X1C |
| PTFE-Rohr wechseln | Nach Bedarf / 1000 Stunden | Alle |
| Kalibrierung (vollständig) | Monatlich | Alle |

Alle Intervalle können pro Drucker angepasst werden.

## Düsenwechsel-Protokoll

1. Gehen Sie zu **Wartung → Düsen**
2. Klicken Sie auf **Düsenwechsel protokollieren**
3. Füllen Sie aus:
   - **Datum** — automatisch auf heute gesetzt
   - **Düsenmaterial** — Messing / Gehärteter Stahl / Kupfer / Rubinstift
   - **Düsendurchmesser** — 0,2 / 0,4 / 0,6 / 0,8 mm
   - **Marke/Modell** — optional
   - **Preis** — für das Kostenprotokoll
   - **Stunden beim Wechsel** — automatisch aus dem Druckstundenzähler abgerufen
4. Klicken Sie auf **Speichern**

Das Protokoll zeigt die gesamte Düsenhistorie sortiert nach Datum.

:::tip Vorwarnung
Setzen Sie **Warnung X Stunden im Voraus** (z.B. 50 Stunden), um rechtzeitig eine Meldung vor dem nächsten empfohlenen Wechsel zu erhalten.
:::

## Wartungsaufgaben erstellen

1. Klicken Sie auf **Neue Aufgabe** (+ Symbol)
2. Füllen Sie aus:
   - **Aufgabenname** — z.B. „Y-Achse schmieren"
   - **Drucker** — betreffenden Drucker auswählen
   - **Intervalltyp** — Stunden / Tage / Anzahl Drucke
   - **Intervall** — z.B. 300 Stunden
   - **Zuletzt ausgeführt** — angeben, wann es zuletzt gemacht wurde (Rückdatierung möglich)
3. Klicken Sie auf **Erstellen**

## Intervalle und Erinnerungen

Für aktive Aufgaben wird angezeigt:
- **Grün** — Zeit bis zur nächsten Wartung > 50 % des Intervalls verbleibend
- **Gelb** — Zeit bis zur nächsten Wartung < 50 % verbleibend
- **Orange** — Zeit bis zur nächsten Wartung < 20 % verbleibend
- **Rot** — Wartung überfällig

### Erinnerungen konfigurieren

1. Klicken Sie auf eine Aufgabe → **Bearbeiten**
2. Aktivieren Sie **Erinnerungen**
3. Setzen Sie **Warnen bei** z.B. 10 % bis Fälligkeit
4. Benachrichtigungskanal auswählen (siehe [Benachrichtigungen](../features/notifications))

## Als erledigt markieren

1. Aufgabe in der Liste finden
2. Klicken Sie auf **Erledigt** (Haken-Symbol)
3. Das Intervall wird ab dem heutigen Datum/Stunden zurückgesetzt
4. Ein Protokolleintrag wird automatisch erstellt

## Kostenprotokoll

Alle Wartungsaufgaben können mit Kosten verknüpft werden:

- **Teile** — Düsen, PTFE-Rohre, Schmiermittel
- **Zeit** — verwendete Stunden × Stundensatz
- **Externer Service** — bezahlte Reparatur

Die Kosten werden pro Drucker summiert und in der Statistikübersicht angezeigt.

## Wartungshistorie

Gehen Sie zu **Wartung → Historie**, um folgendes einzusehen:
- Alle durchgeführten Wartungsaufgaben
- Datum, Stunden und Kosten
- Wer die Aufgabe durchgeführt hat (bei Mehrbenutzer-Systemen)
- Kommentare und Notizen

Exportieren Sie die Historie als CSV für Buchführungszwecke.
