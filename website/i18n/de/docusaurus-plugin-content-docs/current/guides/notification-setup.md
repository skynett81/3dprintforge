---
sidebar_position: 7
title: Benachrichtigungen einrichten
description: Telegram-, Discord-, E-Mail- und Push-Benachrichtigungen im 3DPrintForge konfigurieren
---

# Benachrichtigungen einrichten

3DPrintForge kann Sie über alles benachrichtigen — von abgeschlossenen Drucken bis zu kritischen Fehlern — über Telegram, Discord, E-Mail oder Browser-Push-Benachrichtigungen.

## Übersicht der Benachrichtigungskanäle

| Kanal | Am besten für | Erfordert |
|-------|---------------|-----------|
| Telegram | Schnell, überall | Telegram-Konto + Bot-Token |
| Discord | Team/Community | Discord-Server + Webhook-URL |
| E-Mail (SMTP) | Offizielle Benachrichtigung | SMTP-Server |
| Browser Push | Desktop-Benachrichtigungen | Browser mit Push-Unterstützung |

---

## Telegram-Bot

### Schritt 1 — Den Bot erstellen

1. Telegram öffnen und nach **@BotFather** suchen
2. `/newbot` senden
3. Bot einen Namen geben (z. B. „Bambu Benachrichtigungen")
4. Bot einen Benutzernamen geben (z. B. `bambu_notify_bot`) — muss auf `bot` enden
5. BotFather antwortet mit einem **API-Token**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Diesen Token kopieren und aufbewahren

### Schritt 2 — Ihre Chat-ID finden

1. Eine Unterhaltung mit Ihrem Bot starten (Benutzernamen suchen und **Start** klicken)
2. Eine Nachricht an den Bot senden (z. B. „Hallo")
3. Im Browser zu `https://api.telegram.org/bot<IHR_TOKEN>/getUpdates` gehen
4. `"chat":{"id": 123456789}` finden — das ist Ihre Chat-ID

### Schritt 3 — Mit dem Dashboard verbinden

1. Gehen Sie zu **Einstellungen → Benachrichtigungen → Telegram**
2. **Bot-Token** einfügen
3. **Chat-ID** einfügen
4. Auf **Benachrichtigung testen** klicken — Sie sollten eine Testnachricht in Telegram erhalten
5. Auf **Speichern** klicken

:::tip Gruppenbenachrichtigung
Möchten Sie eine ganze Gruppe benachrichtigen? Bot zu einer Telegram-Gruppe hinzufügen, Gruppen-Chat-ID finden (negative Zahl, z. B. `-100123456789`) und diese verwenden.
:::

---

## Discord-Webhook

### Schritt 1 — Webhook in Discord erstellen

1. Zu Ihrem Discord-Server gehen
2. Rechtsklick auf den Kanal, in dem Sie Benachrichtigungen haben möchten → **Kanal bearbeiten**
3. Zu **Integrationen → Webhooks** gehen
4. Auf **Neuer Webhook** klicken
5. Namen vergeben (z. B. „3DPrintForge")
6. Avatar wählen (optional)
7. Auf **Webhook-URL kopieren** klicken

Die URL sieht so aus:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Schritt 2 — Im Dashboard eintragen

1. Gehen Sie zu **Einstellungen → Benachrichtigungen → Discord**
2. **Webhook-URL** einfügen
3. Auf **Benachrichtigung testen** klicken — der Discord-Kanal sollte eine Testnachricht erhalten
4. Auf **Speichern** klicken

---

## E-Mail (SMTP)

### Erforderliche Informationen

Sie benötigen die SMTP-Einstellungen Ihres E-Mail-Anbieters:

| Anbieter | SMTP-Server | Port | Verschlüsselung |
|----------|-------------|------|-----------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Eigene Domain | smtp.ihredomain.de | 587 | TLS |

:::warning Gmail erfordert App-Passwort
Gmail blockiert die Anmeldung mit normalem Passwort. Sie müssen ein **App-Passwort** unter Google-Konto → Sicherheit → 2-Schritt-Verifizierung → App-Passwörter erstellen.
:::

### Konfiguration im Dashboard

1. Gehen Sie zu **Einstellungen → Benachrichtigungen → E-Mail**
2. Ausfüllen:
   - **SMTP-Server**: z. B. `smtp.gmail.com`
   - **Port**: `587`
   - **Benutzername**: Ihre E-Mail-Adresse
   - **Passwort**: App-Passwort oder normales Passwort
   - **Von-Adresse**: Die E-Mail, von der die Benachrichtigung gesendet wird
   - **An-Adresse**: Die E-Mail, auf der Sie Benachrichtigungen empfangen möchten
3. Auf **Test-E-Mail** klicken
4. Auf **Speichern** klicken

---

## Browser-Push-Benachrichtigungen

Push-Benachrichtigungen erscheinen als Systembenachrichtigungen auf dem Desktop — auch wenn die Browser-Registerkarte im Hintergrund ist.

**Aktivieren:**
1. Gehen Sie zu **Einstellungen → Benachrichtigungen → Push-Benachrichtigungen**
2. Auf **Push-Benachrichtigungen aktivieren** klicken
3. Der Browser fragt nach Erlaubnis — auf **Erlauben** klicken
4. Auf **Benachrichtigung testen** klicken

:::info Nur im Browser, in dem Sie es aktiviert haben
Push-Benachrichtigungen sind an den spezifischen Browser und das Gerät gebunden. Auf jedem Gerät aktivieren, auf dem Sie Benachrichtigungen erhalten möchten.
:::

---

## Zu benachrichtigende Ereignisse auswählen

Nachdem Sie einen Benachrichtigungskanal eingerichtet haben, können Sie genau auswählen, welche Ereignisse Benachrichtigungen auslösen:

**Unter Einstellungen → Benachrichtigungen → Ereignisse:**

| Ereignis | Empfohlen |
|----------|-----------|
| Druck abgeschlossen | Ja |
| Druck fehlgeschlagen / abgebrochen | Ja |
| Print Guard: Spaghetti erkannt | Ja |
| HMS-Fehler (kritisch) | Ja |
| HMS-Warnung | Optional |
| Filament niedriger Füllstand | Ja |
| AMS-Fehler | Ja |
| Drucker getrennt | Optional |
| Wartungserinnerung | Optional |
| Nächtliche Sicherung abgeschlossen | Nein (zu viel Lärm) |

---

## Ruhestunden (nachts nicht benachrichtigen)

Vermeiden Sie, um 03:00 Uhr von einem abgeschlossenen Druck geweckt zu werden:

1. Gehen Sie zu **Einstellungen → Benachrichtigungen → Ruhestunden**
2. **Ruhestunden** aktivieren
3. Von- und Bis-Zeit einstellen (z. B. **22:00 bis 07:00**)
4. Wählen, welche Ereignisse in der Ruheperiode weiterhin benachrichtigen sollen:
   - **Kritische HMS-Fehler** — empfohlen, aktiviert zu lassen
   - **Print Guard** — empfohlen, aktiviert zu lassen
   - **Druck abgeschlossen** — kann nachts deaktiviert werden

:::tip Nachtdruck ohne Störung
Drucke nachts mit aktivierten Ruhestunden laufen lassen. Print Guard passt auf — und Sie erhalten morgens eine Zusammenfassung.
:::
