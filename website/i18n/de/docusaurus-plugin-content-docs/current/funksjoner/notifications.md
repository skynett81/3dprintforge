---
sidebar_position: 6
title: Benachrichtigungen
description: Konfigurieren Sie Benachrichtigungen über Telegram, Discord, E-Mail, Webhook, ntfy, Pushover und SMS für alle Druckerereignisse
---

# Benachrichtigungen

Bambu Dashboard unterstützt Benachrichtigungen über eine Reihe von Kanälen, damit Sie immer wissen, was mit Ihren Druckern passiert — ob Sie zu Hause oder unterwegs sind.

Navigieren Sie zu: **https://localhost:3443/#settings** → Registerkarte **Benachrichtigungen**

## Verfügbare Kanäle

| Kanal | Erfordert | Unterstützt Bilder |
|---|---|---|
| Telegram | Bot-Token + Chat-ID | ✅ |
| Discord | Webhook-URL | ✅ |
| E-Mail | SMTP-Server | ✅ |
| Webhook | URL + optionaler Schlüssel | ✅ (base64) |
| ntfy | ntfy-Server + Topic | ❌ |
| Pushover | API-Token + User-Key | ✅ |
| SMS (Twilio) | Account SID + Auth-Token | ❌ |
| Browser-Push | Keine Konfiguration erforderlich | ❌ |

## Einrichtung pro Kanal

### Telegram

1. Erstellen Sie einen Bot über [@BotFather](https://t.me/BotFather) — senden Sie `/newbot`
2. Kopieren Sie das **Bot-Token** (Format: `123456789:ABC-def...`)
3. Starten Sie eine Unterhaltung mit dem Bot und senden Sie `/start`
4. Finden Sie Ihre **Chat-ID**: gehen Sie zu `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. In Bambu Dashboard: fügen Sie Token und Chat-ID ein, klicken Sie auf **Test**

:::tip Gruppenkanal
Sie können eine Telegram-Gruppe als Empfänger verwenden. Chat-IDs für Gruppen beginnen mit `-`.
:::

### Discord

1. Öffnen Sie den Discord-Server, an den Sie benachrichtigen möchten
2. Gehen Sie zu Kanaleinstellungen → **Integrationen → Webhooks**
3. Klicken Sie auf **Neuen Webhook**, geben Sie ihm einen Namen und wählen Sie den Kanal
4. Kopieren Sie die Webhook-URL
5. Fügen Sie die URL in Bambu Dashboard ein und klicken Sie auf **Test**

### E-Mail

1. Tragen Sie SMTP-Server und Port ein (normalerweise 587 für TLS)
2. Benutzername und Passwort für das SMTP-Konto
3. **Von**-Adresse und **An**-Adresse(n) (kommagetrennt für mehrere)
4. Aktivieren Sie **TLS/STARTTLS** für sicheres Senden
5. Klicken Sie auf **Test**, um eine Test-E-Mail zu senden

:::warning Gmail
Verwenden Sie für Gmail ein **App-Passwort**, kein normales Passwort. Aktivieren Sie zuerst die 2-Faktor-Authentifizierung in Ihrem Google-Konto.
:::

### ntfy

1. Erstellen Sie ein Topic auf [ntfy.sh](https://ntfy.sh) oder betreiben Sie Ihren eigenen ntfy-Server
2. Geben Sie die Server-URL (z.B. `https://ntfy.sh`) und den Topic-Namen ein
3. Installieren Sie die ntfy-App auf dem Mobilgerät und abonnieren Sie dasselbe Topic
4. Klicken Sie auf **Test**

### Pushover

1. Erstellen Sie ein Konto auf [pushover.net](https://pushover.net)
2. Erstellen Sie eine neue Anwendung — kopieren Sie das **API-Token**
3. Finden Sie Ihren **User Key** auf dem Pushover-Dashboard
4. Geben Sie beide in Bambu Dashboard ein und klicken Sie auf **Test**

### Webhook (benutzerdefiniert)

Bambu Dashboard sendet ein HTTP POST mit JSON-Payload:

```json
{
  "event": "print_complete",
  "printer": "Mein X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Fügen Sie einen **Geheimen Schlüssel** hinzu, um Anfragen mit HMAC-SHA256-Signatur im Header `X-Bambu-Signature` zu validieren.

## Ereignisfilter

Wählen Sie, welche Ereignisse pro Kanal Benachrichtigungen auslösen:

| Ereignis | Beschreibung |
|---|---|
| Druck gestartet | Neuer Druck beginnt |
| Druck abgeschlossen | Druck fertig (mit Bild) |
| Druck fehlgeschlagen | Druck mit Fehler abgebrochen |
| Druck pausiert | Manuell oder automatisch pausiert |
| Print Guard ausgelöst | XCam oder Sensor hat eine Aktion ausgelöst |
| Filament niedrig | Spule fast leer |
| AMS-Fehler | Blockierung, feuchtes Filament, usw. |
| Drucker getrennt | MQTT-Verbindung verloren |
| Warteschlangenauftrag gesendet | Auftrag aus Warteschlange versandt |

Haken Sie die gewünschten Ereignisse für jeden Kanal individuell an.

## Ruhemodus

Vermeiden Sie Benachrichtigungen in der Nacht:

1. Aktivieren Sie den **Ruhemodus** unter den Benachrichtigungseinstellungen
2. Setzen Sie **Von** und **Bis** Uhrzeit (z.B. 23:00 → 07:00)
3. Wählen Sie die **Zeitzone** für den Timer
4. Kritische Benachrichtigungen (Print Guard-Fehler) können überschrieben werden — haken Sie **Kritische immer senden** an

## Browser-Push-Benachrichtigungen

Erhalten Sie Benachrichtigungen direkt im Browser ohne App:

1. Gehen Sie zu **Einstellungen → Benachrichtigungen → Browser-Push**
2. Klicken Sie auf **Push-Benachrichtigungen aktivieren**
3. Akzeptieren Sie den Berechtigungsdialog des Browsers
4. Benachrichtigungen funktionieren auch wenn das Dashboard minimiert ist (Tab muss offen sein)

:::info PWA
Installieren Sie Bambu Dashboard als PWA für Hintergrund-Push-Benachrichtigungen ohne offenen Tab. Siehe [PWA](../system/pwa).
:::
