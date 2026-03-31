---
sidebar_position: 8
title: Serverprotokoll
description: Das Serverprotokoll in Echtzeit anzeigen, nach Stufe und Modul filtern und Probleme mit 3DPrintForge beheben
---

# Serverprotokoll

Das Serverprotokoll gibt Ihnen Einblick in das, was im 3DPrintForge passiert — nützlich für die Fehlerbehebung, Überwachung und Diagnose.

Navigieren Sie zu: **https://localhost:3443/#logs**

## Echtzeitansicht

Der Protokollstream wird über WebSocket in Echtzeit aktualisiert:

1. Gehen Sie zu **System → Serverprotokoll**
2. Neue Protokollzeilen erscheinen automatisch unten
3. Klicken Sie auf **Unten sperren**, um immer zum letzten Protokoll zu scrollen
4. Klicken Sie auf **Einfrieren**, um das automatische Scrollen zu stoppen und vorhandene Zeilen zu lesen

Die Standardansicht zeigt die letzten 500 Protokollzeilen.

## Protokollstufen

Jede Protokollzeile hat eine Stufe:

| Stufe | Farbe | Beschreibung |
|---|---|---|
| **ERROR** | Rot | Fehler, die die Funktionalität beeinträchtigen |
| **WARN** | Orange | Warnungen — etwas könnte schief gehen |
| **INFO** | Blau | Normale Betriebsinformationen |
| **DEBUG** | Grau | Detaillierte Entwicklerinformationen |

:::info Protokollstufen-Konfiguration
Protokollstufe unter **Einstellungen → System → Protokollstufe** ändern. Für normalen Betrieb **INFO** verwenden. **DEBUG** nur bei der Fehlerbehebung verwenden, da es viel mehr Daten generiert.
:::

## Filterung

Die Filter-Symbolleiste oben in der Protokollansicht verwenden:

1. **Protokollstufe** — nur ERROR / WARN / INFO / DEBUG oder eine Kombination anzeigen
2. **Modul** — nach Systemmodul filtern:
   - `mqtt` — MQTT-Kommunikation mit Druckern
   - `api` — API-Anfragen
   - `db` — Datenbankoperationen
   - `auth` — Authentifizierungsereignisse
   - `queue` — Druckwarteschlangen-Ereignisse
   - `guard` — Print Guard-Ereignisse
   - `backup` — Datensicherungsoperationen
3. **Freitext** — in Protokolltext suchen (unterstützt Regex)
4. **Zeitpunkt** — nach Datumsbereich filtern

Filter kombinieren für präzise Fehlerbehebung.

## Häufige Fehlersituationen

### MQTT-Verbindungsprobleme

Nach Protokollzeilen aus dem `mqtt`-Modul suchen:

```
ERROR [mqtt] Verbindung zu Drucker XXXX fehlgeschlagen: Connection refused
```

**Lösung:** Prüfen Sie, ob der Drucker eingeschaltet ist, der Zugangscode korrekt ist und das Netzwerk funktioniert.

### Datenbankfehler

```
ERROR [db] Migration v95 fehlgeschlagen: SQLITE_CONSTRAINT
```

**Lösung:** Datensicherung erstellen und Datenbankreparatur über **Einstellungen → System → Datenbank reparieren** ausführen.

### Authentifizierungsfehler

```
WARN [auth] Fehlgeschlagene Anmeldung für Benutzer admin von IP 192.168.1.x
```

Viele fehlgeschlagene Anmeldungen können auf einen Brute-Force-Versuch hinweisen. Prüfen Sie, ob die IP-Whitelist aktiviert werden sollte.

## Protokolle exportieren

1. Klicken Sie auf **Protokoll exportieren**
2. Zeitraum auswählen (Standard: letzte 24 Stunden)
3. Format auswählen: **TXT** (menschenlesbar) oder **JSON** (maschinenlesbar)
4. Datei wird heruntergeladen

Exportierte Protokolle sind nützlich beim Melden von Bugs oder bei der Kontaktaufnahme mit dem Support.

## Protokollrotation

Protokolle werden automatisch rotiert:

| Einstellung | Standard |
|---|---|
| Max. Protokolldateigröße | 50 MB |
| Anzahl rotierter Dateien | 5 |
| Max. Gesamtprotokollgröße | 250 MB |

Anpassen unter **Einstellungen → System → Protokollrotation**. Ältere Protokolldateien werden automatisch mit gzip komprimiert.

## Speicherort der Protokolldateien

Protokolldateien werden auf dem Server gespeichert:

```
./data/logs/
├── 3dprintforge.log          (aktives Protokoll)
├── 3dprintforge.log.1.gz     (rotiert)
├── 3dprintforge.log.2.gz     (rotiert)
└── ...
```

:::tip SSH-Zugriff
Zum direkten Lesen von Protokollen auf dem Server über SSH:
```bash
tail -f ./data/logs/3dprintforge.log
```
:::
