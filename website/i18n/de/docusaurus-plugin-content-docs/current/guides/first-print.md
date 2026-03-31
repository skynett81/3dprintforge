---
sidebar_position: 1
title: Ihr erster Druck
description: Schritt-für-Schritt-Anleitung zum Starten Ihres ersten 3D-Drucks und zur Überwachung im 3DPrintForge
---

# Ihr erster Druck

Diese Anleitung führt Sie durch den gesamten Prozess — vom verbundenen Drucker bis zum fertigen Druck — mit dem 3DPrintForge als Steuerzentrale.

## Schritt 1 — Verbindung des Druckers prüfen

Wenn Sie das Dashboard öffnen, sehen Sie die Statuskarte Ihres Druckers oben in der Seitenleiste oder im Übersichtsbereich.

**Grüner Status** bedeutet, dass der Drucker online und bereit ist.

| Status | Farbe | Bedeutung |
|--------|-------|-----------|
| Online | Grün | Bereit zum Drucken |
| Inaktiv | Grau | Verbunden, aber nicht aktiv |
| Druckt | Blau | Druck läuft |
| Fehler | Rot | Erfordert Aufmerksamkeit |

Wenn der Drucker roten Status anzeigt:
1. Prüfen Sie, ob der Drucker eingeschaltet ist
2. Vergewissern Sie sich, dass er mit demselben Netzwerk wie das Dashboard verbunden ist
3. Gehen Sie zu **Einstellungen → Drucker** und bestätigen Sie IP-Adresse und Zugangscode

:::tip LAN-Modus für schnellere Reaktion verwenden
Der LAN-Modus bietet geringere Latenz als der Cloud-Modus. Aktivieren Sie ihn in den Druckereinstellungen, wenn sich Drucker und Dashboard im selben Netzwerk befinden.
:::

## Schritt 2 — Ihr Modell hochladen

3DPrintForge startet Drucke nicht direkt — das ist Aufgabe von Bambu Studio oder MakerWorld. Das Dashboard übernimmt, sobald der Druck beginnt.

**Über Bambu Studio:**
1. Öffnen Sie Bambu Studio auf Ihrem PC
2. Importieren oder öffnen Sie Ihre `.stl`- oder `.3mf`-Datei
3. Slicen Sie das Modell (Filament, Stützen, Infill usw. wählen)
4. Klicken Sie oben rechts auf **Drucken**

**Über MakerWorld:**
1. Finden Sie das Modell auf [makerworld.com](https://makerworld.com)
2. Klicken Sie direkt auf der Website auf **Drucken**
3. Bambu Studio öffnet sich automatisch mit dem bereitgestellten Modell

## Schritt 3 — Den Druck starten

In Bambu Studio wählen Sie die Übertragungsmethode:

| Methode | Voraussetzung | Vorteile |
|---------|---------------|----------|
| **Cloud** | Bambu-Konto + Internet | Funktioniert überall |
| **LAN** | Gleiches Netzwerk | Schneller, keine Cloud |
| **SD-Karte** | Physischer Zugang | Keine Netzwerkanforderungen |

Klicken Sie auf **Senden** — der Drucker empfängt den Auftrag und beginnt automatisch mit der Aufheizphase.

:::info Der Druck erscheint im Dashboard
Wenige Sekunden nachdem Bambu Studio den Auftrag gesendet hat, wird der aktive Druck im Dashboard unter **Aktiver Druck** angezeigt.
:::

## Schritt 4 — Im Dashboard überwachen

Wenn der Druck läuft, gibt Ihnen das Dashboard einen vollständigen Überblick:

### Fortschritt
- Fertigstellungsprozentsatz und geschätzte Restzeit werden auf der Druckerkarte angezeigt
- Klicken Sie auf die Karte für eine Detailansicht mit Schichtinformationen

### Temperaturen
Das Detailpanel zeigt Echtzeittemperaturen:
- **Düse** — aktuelle und Zieltemperatur
- **Bauplatte** — aktuelle und Zieltemperatur
- **Kammer** — Raumtemperatur innerhalb des Druckers (wichtig für ABS/ASA)

### Kamera
Klicken Sie auf das Kamerasymbol auf der Druckerkarte, um den Live-Feed direkt im Dashboard zu sehen. Sie können die Kamera in einem eigenen Fenster geöffnet lassen, während Sie andere Dinge erledigen.

:::warning Erste Schichten prüfen
Die ersten 3–5 Schichten sind entscheidend. Schlechte Haftung jetzt bedeutet ein fehlgeschlagener Druck später. Beobachten Sie die Kamera und vergewissern Sie sich, dass das Filament sauber und gleichmäßig aufgetragen wird.
:::

### Print Guard
3DPrintForge verfügt über einen KI-gesteuerten **Print Guard**, der Spaghetti-Fehler automatisch erkennt und den Druck pausieren kann. Aktivieren Sie dies unter **Überwachung → Print Guard**.

## Schritt 5 — Nach dem Druck

Wenn der Druck abgeschlossen ist, zeigt das Dashboard eine Abschlussmeldung an (und sendet eine Benachrichtigung, wenn Sie [Benachrichtigungen](./notification-setup) eingerichtet haben).

### Verlauf prüfen
Gehen Sie in der Seitenleiste zu **Verlauf**, um den abgeschlossenen Druck zu sehen:
- Gesamte Druckzeit
- Filamentverbrauch (verwendete Gramm, geschätzte Kosten)
- Fehler oder HMS-Ereignisse während des Drucks
- Kamerabild beim Abschluss (wenn aktiviert)

### Eine Notiz hinterlassen
Klicken Sie auf den Druck im Verlauf und fügen Sie eine Notiz hinzu — z. B. „Etwas mehr Brim benötigt" oder „Perfektes Ergebnis". Dies ist hilfreich, wenn Sie dasselbe Modell erneut drucken.

### Filamentverbrauch prüfen
Unter **Filament** können Sie sehen, dass das Spulengewicht basierend auf dem Verbrauch aktualisiert wurde. Das Dashboard zieht automatisch ab.

## Tipps für Einsteiger

:::tip Ersten Druck nicht verlassen
Beobachten Sie die ersten 10–15 Minuten. Wenn Sie sicher sind, dass der Druck gut haftet, können Sie das Dashboard den Rest überwachen lassen.
:::

- **Leere Spulen wiegen** — Startgewicht der Spulen eingeben für genaue Restberechnung (siehe [Filamentlager](./filament-setup))
- **Telegram-Benachrichtigungen einrichten** — Benachrichtigung erhalten, wenn der Druck fertig ist, ohne warten zu müssen (siehe [Benachrichtigungen](./notification-setup))
- **Bauplatte prüfen** — Saubere Platte = bessere Haftung. Zwischen Drucken mit IPA (Isopropanol) abwischen
- **Richtige Platte verwenden** — siehe [Die richtige Bauplatte wählen](./choosing-plate) für das passende Filament
