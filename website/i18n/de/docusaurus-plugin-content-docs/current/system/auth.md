---
sidebar_position: 1
title: Authentifizierung
description: Verwalten Sie Benutzer, Rollen, Berechtigungen, API-Schlüssel und Zwei-Faktor-Authentifizierung mit TOTP
---

# Authentifizierung

3DPrintForge unterstützt mehrere Benutzer mit rollenbasierter Zugangskontrolle, API-Schlüssel und optionaler Zwei-Faktor-Authentifizierung (2FA) über TOTP.

Navigieren Sie zu: **https://localhost:3443/#settings** → **Benutzer und Zugriff**

## Benutzer

### Einen Benutzer erstellen

1. Gehen Sie zu **Einstellungen → Benutzer**
2. Klicken Sie auf **Neuer Benutzer**
3. Ausfüllen:
   - **Benutzername** — wird für die Anmeldung verwendet
   - **E-Mail-Adresse**
   - **Passwort** — mindestens 12 Zeichen empfohlen
   - **Rolle** — siehe Rollen unten
4. Klicken Sie auf **Erstellen**

Der neue Benutzer kann sich nun unter **https://localhost:3443/login** anmelden.

### Passwort ändern

1. Gehen Sie zu **Profil** (oben rechts → auf Benutzernamen klicken)
2. Klicken Sie auf **Passwort ändern**
3. Aktuelles Passwort und neues Passwort eingeben
4. Klicken Sie auf **Speichern**

Administratoren können Passwörter anderer Benutzer unter **Einstellungen → Benutzer → [Benutzer] → Passwort zurücksetzen** zurücksetzen.

## Rollen

| Rolle | Beschreibung |
|---|---|
| **Administrator** | Vollzugriff — alle Einstellungen, Benutzer und Funktionen |
| **Bediener** | Drucker steuern, alles anzeigen, aber keine Systemeinstellungen ändern |
| **Gast** | Nur Lesen — Dashboard, Verlauf und Statistiken anzeigen |
| **API-Benutzer** | Nur API-Zugriff — keine Weboberfläche |

### Benutzerdefinierte Rollen

1. Gehen Sie zu **Einstellungen → Rollen**
2. Klicken Sie auf **Neue Rolle**
3. Berechtigungen einzeln auswählen:
   - Dashboard / Verlauf / Statistiken anzeigen
   - Drucker steuern (Pause/Stopp/Start)
   - Filamentlager verwalten
   - Warteschlange verwalten
   - Kamerastream anzeigen
   - Einstellungen ändern
   - Benutzer verwalten
4. Klicken Sie auf **Speichern**

## API-Schlüssel

API-Schlüssel ermöglichen programmatischen Zugriff ohne Anmeldung.

### Einen API-Schlüssel erstellen

1. Gehen Sie zu **Einstellungen → API-Schlüssel**
2. Klicken Sie auf **Neuer Schlüssel**
3. Ausfüllen:
   - **Name** — beschreibender Name (z.B. „Home Assistant", „Python-Skript")
   - **Ablaufdatum** — optional, aus Sicherheitsgründen empfohlen
   - **Berechtigungen** — Rolle oder spezifische Berechtigungen auswählen
4. Klicken Sie auf **Generieren**
5. **Schlüssel jetzt kopieren** — er wird nur einmal angezeigt

### Den API-Schlüssel verwenden

Zu allen API-Aufrufen als HTTP-Header hinzufügen:
```
Authorization: Bearer IHR_API_SCHLÜSSEL
```

Siehe [API-Spielwiese](../tools/playground) zum Testen.

:::danger Sichere Aufbewahrung
API-Schlüssel haben denselben Zugriff wie der Benutzer, dem sie zugeordnet sind. Bewahren Sie sie sicher auf und rotieren Sie sie regelmäßig.
:::

## TOTP 2FA

Zwei-Faktor-Authentifizierung mit einer Authenticator-App aktivieren (Google Authenticator, Authy, Bitwarden usw.):

### 2FA aktivieren

1. Gehen Sie zu **Profil → Sicherheit → Zwei-Faktor-Authentifizierung**
2. Klicken Sie auf **2FA aktivieren**
3. QR-Code mit der Authenticator-App scannen
4. Den generierten 6-stelligen Code zur Bestätigung eingeben
5. **Wiederherstellungscodes** (10 Einmalcodes) an einem sicheren Ort speichern
6. Klicken Sie auf **Aktivieren**

### Mit 2FA anmelden

1. Benutzername und Passwort wie gewohnt eingeben
2. Den 6-stelligen TOTP-Code aus der App eingeben
3. Klicken Sie auf **Anmelden**

### 2FA für alle Benutzer erzwingen

Administratoren können 2FA für alle Benutzer vorschreiben:

1. Gehen Sie zu **Einstellungen → Sicherheit → 2FA erzwingen**
2. Einstellung aktivieren
3. Benutzer ohne 2FA werden bei der nächsten Anmeldung zur Einrichtung gezwungen

## Sitzungsverwaltung

- Standard-Sitzungsdauer: 24 Stunden
- Anpassen unter **Einstellungen → Sicherheit → Sitzungsdauer**
- Aktive Sitzungen pro Benutzer anzeigen und einzelne Sitzungen beenden
