---
sidebar_position: 2
title: Ersteinrichtung
description: Verbinden Sie Ihren Bambu Lab-Drucker und konfigurieren Sie das Dashboard
---

# Ersteinrichtung

Wenn das Dashboard zum ersten Mal gestartet wird, öffnet sich der Einrichtungsassistent automatisch.

## Einrichtungsassistent

Der Assistent ist unter `https://ihr-server:3443/setup` verfügbar. Er führt Sie durch folgende Schritte:

1. Administrator-Benutzer erstellen
2. Drucker hinzufügen
3. Verbindung testen
4. Benachrichtigungen konfigurieren (optional)

## Einen Drucker hinzufügen

Sie benötigen drei Angaben, um sich mit dem Drucker zu verbinden:

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| IP-Adresse | Lokale IP des Druckers | `192.168.1.100` |
| Seriennummer | 15 Zeichen, steht unter dem Drucker | `01P09C123456789` |
| Access Code | 8 Zeichen, zu finden in den Netzwerkeinstellungen des Druckers | `12345678` |

### Access Code am Drucker finden

**X1C / P1S / P1P:**
1. Gehen Sie auf dem Bildschirm zu **Einstellungen**
2. Wählen Sie **WLAN** oder **LAN**
3. Suchen Sie nach dem **Access Code**

**A1 / A1 Mini:**
1. Tippen Sie auf den Bildschirm und wählen Sie **Einstellungen**
2. Gehen Sie zu **WLAN**
3. Suchen Sie nach dem **Access Code**

:::tip Feste IP-Adresse
Legen Sie im Router eine feste IP-Adresse für den Drucker fest (DHCP-Reservierung). So müssen Sie das Dashboard nicht jedes Mal aktualisieren, wenn der Drucker eine neue IP erhält.
:::

## AMS-Konfiguration

Nachdem der Drucker verbunden ist, wird der AMS-Status automatisch aktualisiert. Sie können:

- Jedem Schacht einen Namen und eine Farbe geben
- Spulen mit Ihrem Filamentlager verknüpfen
- Filamentverbrauch pro Spule einsehen

Gehen Sie zu **Einstellungen → Drucker → AMS** für die manuelle Konfiguration.

## HTTPS-Zertifikate {#https-zertifikate}

### Selbst generiertes Zertifikat (Standard)

Das Dashboard generiert beim Start automatisch ein selbst signiertes Zertifikat. So vertrauen Sie ihm im Browser:

- **Chrome/Edge:** Klicken Sie auf „Erweitert" → „Weiter zu der Seite"
- **Firefox:** Klicken Sie auf „Erweitert" → „Risiko akzeptieren und fortfahren"

### Eigenes Zertifikat

Legen Sie die Zertifikatsdateien im Ordner ab und konfigurieren Sie sie in `config.json`:

```json
{
  "ssl": {
    "cert": "/pfad/zu/cert.pem",
    "key": "/pfad/zu/key.pem"
  }
}
```

:::info Let's Encrypt
Verwenden Sie einen Domainnamen? Generieren Sie kostenlos ein Zertifikat mit Let's Encrypt und Certbot, und verweisen Sie `cert` und `key` auf die Dateien in `/etc/letsencrypt/live/ihre-domain/`.
:::

## Umgebungsvariablen

Alle Einstellungen können mit Umgebungsvariablen überschrieben werden:

| Variable | Standard | Beschreibung |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP-Port |
| `HTTPS_PORT` | `3443` | HTTPS-Port |
| `NODE_ENV` | `production` | Umgebung |
| `AUTH_SECRET` | (auto) | JWT-Geheimnis |

## Mehrdruckerkonfiguration

Sie können unter **Einstellungen → Drucker → Drucker hinzufügen** weitere Drucker hinzufügen. Verwenden Sie die Druckerauswahl oben im Dashboard, um zwischen ihnen zu wechseln.
