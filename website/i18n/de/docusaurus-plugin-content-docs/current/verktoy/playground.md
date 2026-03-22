---
sidebar_position: 4
title: API-Spielwiese
description: Testen Sie alle 177 API-Endpunkte direkt im Browser mit integrierter OpenAPI-Dokumentation und Authentifizierung
---

# API-Spielwiese

Die API-Spielwiese ermöglicht es Ihnen, alle 177 API-Endpunkte im Bambu Dashboard direkt im Browser zu erkunden und zu testen — ohne Code zu schreiben.

Navigieren Sie zu: **https://localhost:3443/api/docs**

## Was ist die API-Spielwiese?

Die Spielwiese ist eine interaktive Version der OpenAPI-Dokumentation (Swagger UI), die vollständig in das Dashboard integriert ist. Sie sind bereits authentifiziert, wenn Sie eingeloggt sind, sodass Sie Endpunkte direkt testen können.

## In der Dokumentation navigieren

Die Endpunkte sind in Kategorien organisiert:

| Kategorie | Anzahl Endpunkte | Beschreibung |
|---|---|---|
| Drucker | 24 | Status abrufen, steuern, konfigurieren |
| Drucke / Historie | 18 | Historie abrufen, suchen, exportieren |
| Filament | 22 | Lager, Spulen, Profile |
| Warteschlange | 12 | Druckwarteschlange verwalten |
| Statistiken | 15 | Aggregierte Statistiken und Export |
| Benachrichtigungen | 8 | Benachrichtigungskanäle konfigurieren und testen |
| Benutzer | 10 | Benutzer, Rollen, API-Schlüssel |
| Einstellungen | 14 | Konfiguration lesen und ändern |
| Wartung | 12 | Wartungsaufgaben und Protokoll |
| Integrationen | 18 | HA, Tibber, Webhooks usw. |
| Dateibibliothek | 14 | Hochladen, analysieren, verwalten |
| System | 10 | Backup, Gesundheit, Protokoll |

Klicken Sie auf eine Kategorie, um sie aufzuklappen und alle Endpunkte anzuzeigen.

## Einen Endpunkt testen

1. Klicken Sie auf einen Endpunkt (z.B. `GET /api/printers`)
2. Klicken Sie auf **Try it out** (Ausprobieren)
3. Eventuelle Parameter ausfüllen (Filter, Seitenangaben, Drucker-ID usw.)
4. Klicken Sie auf **Execute**
5. Antwort unten anzeigen: HTTP-Statuscode, Header und JSON-Body

### Beispiel: Alle Drucker abrufen

```
GET /api/printers
```
Gibt eine Liste aller registrierten Drucker mit Echtzeitstatus zurück.

### Beispiel: Befehl an Drucker senden

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Produktionsumgebung
Die API-Spielwiese ist mit dem tatsächlichen System verbunden. Befehle werden an echte Drucker gesendet. Seien Sie vorsichtig mit destruktiven Operationen wie `DELETE` und `POST /command`.
:::

## Authentifizierung

### Session-Authentifizierung (eingeloggter Benutzer)
Wenn Sie im Dashboard eingeloggt sind, ist die Spielwiese bereits über Session-Cookie authentifiziert. Keine zusätzliche Konfiguration erforderlich.

### API-Schlüssel-Authentifizierung

Für externen Zugriff:

1. Klicken Sie auf **Authorize** (Schloss-Symbol oben in der Spielwiese)
2. Tragen Sie Ihren API-Schlüssel in das **ApiKeyAuth**-Feld ein: `Bearer IHR_SCHLÜSSEL`
3. Klicken Sie auf **Authorize**

API-Schlüssel erstellen Sie unter **Einstellungen → API-Schlüssel** (siehe [Authentifizierung](../system/auth)).

## Rate Limiting

Die API hat ein Rate Limit von **200 Anfragen pro Minute** pro Benutzer/Schlüssel. Die Spielwiese zeigt die verbleibenden Anfragen im Antwort-Header `X-RateLimit-Remaining`.

:::info OpenAPI-Spezifikation
Laden Sie die vollständige OpenAPI-Spezifikation als YAML oder JSON herunter:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Verwenden Sie die Spezifikation, um Client-Bibliotheken in Python, TypeScript, Go usw. zu generieren.
:::

## Webhook-Tests

Webhook-Integrationen direkt testen:

1. Gehen Sie zu `POST /api/webhooks/test`
2. Ereignistyp aus der Dropdown-Liste auswählen
3. Das System sendet ein Testereignis an die konfigurierte Webhook-URL
4. Anfrage/Antwort in der Spielwiese anzeigen
