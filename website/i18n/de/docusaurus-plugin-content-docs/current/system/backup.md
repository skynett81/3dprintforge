---
sidebar_position: 2
title: Datensicherung
description: Erstellen, wiederherstellen und planen Sie automatische Datensicherungen von 3DPrintForge-Daten
---

# Datensicherung

3DPrintForge kann alle Konfigurationen, den Verlauf und die Daten sichern, sodass Sie bei Systemfehlern, Serverumzügen oder Update-Problemen problemlos wiederherstellen können.

Navigieren Sie zu: **https://localhost:3443/#settings** → **System → Datensicherung**

## Was in einer Datensicherung enthalten ist

| Datentyp | Enthalten | Hinweis |
|---|---|---|
| Druckerkonfigurationen | ✅ | |
| Druckverlauf | ✅ | |
| Filamentlager | ✅ | |
| Benutzer und Rollen | ✅ | Passwörter werden gehasht gespeichert |
| Einstellungen | ✅ | Inkl. Benachrichtigungskonfigurationen |
| Wartungsprotokoll | ✅ | |
| Projekte und Rechnungen | ✅ | |
| Dateibibliothek (Metadaten) | ✅ | |
| Dateibibliothek (Dateien) | Optional | Kann groß werden |
| Timelapse-Videos | Optional | Kann sehr groß werden |
| Galeriebilder | Optional | |

## Eine manuelle Datensicherung erstellen

1. Gehen Sie zu **Einstellungen → Datensicherung**
2. Auswählen, was enthalten sein soll (siehe Tabelle oben)
3. Klicken Sie auf **Datensicherung jetzt erstellen**
4. Fortschrittsanzeige wird während der Erstellung angezeigt
5. Klicken Sie auf **Herunterladen**, wenn die Sicherung fertig ist

Die Sicherung wird als `.zip`-Datei mit Zeitstempel im Dateinamen gespeichert:
```
3dprintforge-backup-2026-03-22T14-30-00.zip
```

## Datensicherung herunterladen

Sicherungsdateien werden im Sicherungsordner auf dem Server gespeichert (konfigurierbar). Zusätzlich können Sie sie direkt herunterladen:

1. Gehen Sie zu **Datensicherung → Vorhandene Sicherungen**
2. Sicherung in der Liste finden (nach Datum sortiert)
3. Klicken Sie auf **Herunterladen** (Download-Symbol)

:::info Speicherordner
Standard-Speicherordner: `./data/backups/`. Ändern unter **Einstellungen → Datensicherung → Speicherordner**.
:::

## Geplante automatische Datensicherung

1. **Automatische Datensicherung** unter **Datensicherung → Planung** aktivieren
2. Intervall auswählen:
   - **Täglich** — wird um 03:00 Uhr ausgeführt (konfigurierbar)
   - **Wöchentlich** — ein bestimmter Tag und eine Uhrzeit
   - **Monatlich** — erster Tag des Monats
3. **Anzahl der zu behaltenden Sicherungen** auswählen (z.B. 7 — ältere werden automatisch gelöscht)
4. Klicken Sie auf **Speichern**

:::tip Externer Speicher
Für wichtige Daten: Einen externen Datenträger oder Netzwerkspeicher als Speicherordner für Sicherungen einbinden. Dann überleben die Sicherungen auch dann, wenn die Systemfestplatte ausfällt.
:::

## Aus Datensicherung wiederherstellen

:::warning Wiederherstellung überschreibt vorhandene Daten
Die Wiederherstellung ersetzt alle vorhandenen Daten durch den Inhalt der Sicherungsdatei. Stellen Sie sicher, dass Sie zuerst eine aktuelle Sicherung der aktuellen Daten haben.
:::

### Aus vorhandener Sicherung auf dem Server

1. Gehen Sie zu **Datensicherung → Vorhandene Sicherungen**
2. Sicherung in der Liste finden
3. Klicken Sie auf **Wiederherstellen**
4. Im Dialog bestätigen
5. Das System startet nach der Wiederherstellung automatisch neu

### Aus heruntergeladener Sicherungsdatei

1. Klicken Sie auf **Sicherung hochladen**
2. `.zip`-Datei von Ihrem Computer auswählen
3. Die Datei wird validiert — Sie sehen, was enthalten ist
4. Klicken Sie auf **Aus Datei wiederherstellen**
5. Im Dialog bestätigen

## Sicherungsvalidierung

3DPrintForge validiert alle Sicherungsdateien vor der Wiederherstellung:

- Prüft, ob das ZIP-Format gültig ist
- Verifiziert, dass das Datenbankschema mit der aktuellen Version kompatibel ist
- Zeigt eine Warnung an, wenn die Sicherung von einer älteren Version stammt (Migration wird automatisch durchgeführt)
