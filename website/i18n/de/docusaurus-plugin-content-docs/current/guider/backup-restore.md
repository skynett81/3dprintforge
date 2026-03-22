---
sidebar_position: 9
title: Sicherung und Wiederherstellung
description: Automatische und manuelle Sicherung des Bambu Dashboards, Wiederherstellung und Umzug auf einen neuen Server
---

# Sicherung und Wiederherstellung

Bambu Dashboard speichert alle Daten lokal — Druckverlauf, Filamentlager, Einstellungen, Benutzer und mehr. Regelmäßige Sicherungen stellen sicher, dass Sie bei einem Serverausfall oder beim Umzug nichts verlieren.

## Was wird in einer Sicherung eingeschlossen?

| Daten | Enthalten | Anmerkung |
|-------|-----------|-----------|
| Druckverlauf | Ja | Alle Protokolle und Statistiken |
| Filamentlager | Ja | Spulen, Gewichte, Marken |
| Einstellungen | Ja | Alle Systemeinstellungen |
| Druckereinrichtung | Ja | IP-Adressen, Zugangscodes |
| Benutzer und Rollen | Ja | Passwörter werden gehasht gespeichert |
| Benachrichtigungskonfiguration | Ja | Telegram-Tokens usw. |
| Kamerabilder | Optional | Können große Dateien sein |
| Timelapse-Videos | Optional | Standardmäßig ausgeschlossen |

## Automatische nächtliche Sicherung

Standardmäßig wird jeden Nacht um 03:00 Uhr eine automatische Sicherung durchgeführt.

**Automatische Sicherung anzeigen und konfigurieren:**
1. Gehen Sie zu **System → Sicherung**
2. Unter **Automatische Sicherung** sehen Sie:
   - Letzte erfolgreiche Sicherung und Zeitpunkt
   - Nächste geplante Sicherung
   - Anzahl gespeicherter Sicherungen (Standard: 7 Tage)

**Konfigurieren:**
- **Zeitpunkt** — von Standard 03:00 Uhr auf einen passenden Zeitpunkt ändern
- **Aufbewahrungszeit** — Anzahl der Tage, die Sicherungen aufbewahrt werden (7, 14, 30 Tage)
- **Speicherort** — lokaler Ordner (Standard) oder externer Pfad
- **Komprimierung** — standardmäßig aktiviert (reduziert Größe um 60–80%)

:::info Sicherungsdateien werden standardmäßig hier gespeichert
```
/pfad/zu/bambu-dashboard/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Manuelle Sicherung

Jederzeit eine Sicherung erstellen:

1. Gehen Sie zu **System → Sicherung**
2. Auf **Jetzt sichern** klicken
3. Warten, bis der Status **Abgeschlossen** anzeigt
4. Sicherungsdatei durch Klicken auf **Herunterladen** herunterladen

**Alternativ über Terminal:**
```bash
cd /pfad/zu/bambu-dashboard
node scripts/backup.js
```

Die Sicherungsdatei wird in `data/backups/` mit Zeitstempel im Dateinamen gespeichert.

## Aus einer Sicherung wiederherstellen

:::warning Wiederherstellung überschreibt vorhandene Daten
Alle vorhandenen Daten werden durch den Inhalt der Sicherungsdatei ersetzt. Stellen Sie sicher, dass Sie aus der richtigen Datei wiederherstellen.
:::

### Über das Dashboard

1. Gehen Sie zu **System → Sicherung**
2. Auf **Wiederherstellen** klicken
3. Eine Sicherungsdatei aus der Liste auswählen oder eine Sicherungsdatei vom Datenträger hochladen
4. Auf **Jetzt wiederherstellen** klicken
5. Das Dashboard startet nach der Wiederherstellung automatisch neu

### Über Terminal

```bash
cd /pfad/zu/bambu-dashboard
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Nach der Wiederherstellung das Dashboard neu starten:
```bash
sudo systemctl restart bambu-dashboard
# oder
npm start
```

## Einstellungen exportieren und importieren

Möchten Sie nur die Einstellungen aufbewahren (ohne den gesamten Verlauf)?

**Exportieren:**
1. Gehen Sie zu **System → Einstellungen → Export**
2. Auswählen, was eingeschlossen werden soll:
   - Druckereinrichtung
   - Benachrichtigungskonfiguration
   - Benutzerkonten
   - Filamentmarken und -profile
3. Auf **Exportieren** klicken — Sie laden eine `.json`-Datei herunter

**Importieren:**
1. Gehen Sie zu **System → Einstellungen → Import**
2. Die `.json`-Datei hochladen
3. Auswählen, welche Teile importiert werden sollen
4. Auf **Importieren** klicken

:::tip Nützlich bei Neuinstallation
Exportierte Einstellungen sind praktisch für einen neuen Server. Nach der Neuinstallation importieren, um alles nicht neu einrichten zu müssen.
:::

## Auf einen neuen Server umziehen

So verschieben Sie Bambu Dashboard mit allen Daten auf eine neue Maschine:

### Schritt 1 — Sicherung auf altem Server erstellen

1. Gehen Sie zu **System → Sicherung → Jetzt sichern**
2. Sicherungsdatei herunterladen
3. Datei auf neuen Server kopieren (USB, scp, Netzwerkfreigabe)

### Schritt 2 — Auf neuem Server installieren

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Den Installationsanweisungen folgen. Sie müssen nichts konfigurieren — nur das Dashboard zum Laufen bringen.

### Schritt 3 — Sicherung wiederherstellen

Wenn das Dashboard auf dem neuen Server läuft:

1. Gehen Sie zu **System → Sicherung → Wiederherstellen**
2. Sicherungsdatei vom alten Server hochladen
3. Auf **Jetzt wiederherstellen** klicken

Alles ist nun an Ort und Stelle: Verlauf, Filamentlager, Einstellungen und Benutzer.

### Schritt 4 — Verbindung verifizieren

1. Gehen Sie zu **Einstellungen → Drucker**
2. Verbindung zu jedem Drucker testen
3. Prüfen, ob IP-Adressen noch korrekt sind (neuer Server hat möglicherweise eine andere IP)

## Tipps für gute Sicherungshygiene

- **Wiederherstellung testen** — eine Sicherung erstellen und auf einem Testrechner wiederherstellen, mindestens einmal. Ungetestete Sicherungen sind keine Sicherung.
- **Extern speichern** — Sicherungsdatei regelmäßig auf eine externe Festplatte oder Cloud-Speicher kopieren (Nextcloud, Google Drive usw.)
- **Benachrichtigung einrichten** — Benachrichtigung für „Sicherung fehlgeschlagen" unter **Einstellungen → Benachrichtigungen → Ereignisse** aktivieren, damit Sie sofort wissen, wenn etwas schiefläuft
