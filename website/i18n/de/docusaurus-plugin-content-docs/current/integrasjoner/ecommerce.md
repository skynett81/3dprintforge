---
sidebar_position: 5
title: E-Commerce
description: Verwalten Sie Bestellungen, Kunden und Rechnungsstellung für den Verkauf von 3D-Drucken — erfordert Lizenz von geektech.no
---

# E-Commerce

Das E-Commerce-Modul bietet Ihnen ein vollständiges System zur Verwaltung von Kunden, Bestellungen und Rechnungsstellung — ideal für diejenigen, die 3D-Drucke professionell oder semi-professionell verkaufen.

Navigieren Sie zu: **https://localhost:3443/#orders**

:::danger E-Commerce-Lizenz erforderlich
Das E-Commerce-Modul erfordert eine gültige Lizenz. Lizenzen können **ausschließlich über [geektech.no](https://geektech.no)** erworben werden. Ohne aktive Lizenz ist das Modul gesperrt und nicht zugänglich.
:::

## Lizenz — Kauf und Aktivierung

### Lizenz kaufen

1. Gehen Sie zu **[geektech.no](https://geektech.no)** und erstellen Sie ein Konto
2. Wählen Sie **Bambu Dashboard — E-Commerce-Lizenz**
3. Lizenztyp auswählen:

| Lizenztyp | Beschreibung | Drucker |
|---|---|---|
| **Hobby** | Ein Drucker, persönliche Nutzung und Kleinverkauf | 1 |
| **Professionell** | Bis zu 5 Drucker, kommerzielle Nutzung | 1–5 |
| **Enterprise** | Unbegrenzte Drucker, voller Support | Unbegrenzt |

4. Zahlung abschließen
5. Sie erhalten einen **Lizenzschlüssel** per E-Mail

### Lizenz aktivieren

1. Gehen Sie zu **Einstellungen → E-Commerce** im Dashboard
2. **Lizenzschlüssel** in das Feld einfügen
3. Klicken Sie auf **Lizenz aktivieren**
4. Das Dashboard authentifiziert den Schlüssel gegenüber den Servern von geektech.no
5. Bei erfolgreicher Aktivierung werden Lizenztyp, Ablaufdatum und Anzahl der Drucker angezeigt

:::warning Der Lizenzschlüssel ist an Ihre Installation gebunden
Der Schlüssel wird für eine Bambu Dashboard-Installation aktiviert. Kontaktieren Sie [geektech.no](https://geektech.no), wenn Sie die Lizenz auf einen neuen Server übertragen müssen.
:::

### Lizenzvalidierung

- Die Lizenz wird **online validiert** beim Start und danach alle 24 Stunden
- Bei Netzwerkausfall funktioniert die Lizenz bis zu **7 Tage offline**
- Abgelaufene Lizenz → Modul wird gesperrt, vorhandene Daten bleiben erhalten
- Verlängerung über **[geektech.no](https://geektech.no)** → Meine Lizenzen → Verlängern

### Lizenzstatus prüfen

Gehen Sie zu **Einstellungen → E-Commerce** oder rufen Sie die API auf:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

Die Antwort enthält:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Firmenname GmbH",
  "provider": "geektech.no"
}
```

## Kunden

### Einen Kunden erstellen

1. Gehen Sie zu **E-Commerce → Kunden**
2. Klicken Sie auf **Neuer Kunde**
3. Ausfüllen:
   - **Name / Firmenname**
   - **Ansprechpartner** (für Unternehmen)
   - **E-Mail-Adresse**
   - **Telefon**
   - **Adresse** (Rechnungsadresse)
   - **USt-IdNr. / Steuernummer** (optional, für MwSt.-registrierte)
   - **Notiz** — interne Anmerkung
4. Klicken Sie auf **Erstellen**

### Kundenübersicht

Die Kundenliste zeigt:
- Name und Kontaktdaten
- Gesamtanzahl Bestellungen
- Gesamtumsatz
- Letztes Bestelldatum
- Status (Aktiv / Inaktiv)

Klicken Sie auf einen Kunden, um den gesamten Bestellungs- und Rechnungsverlauf anzuzeigen.

## Auftragsverwaltung

### Eine Bestellung erstellen

1. Gehen Sie zu **E-Commerce → Bestellungen**
2. Klicken Sie auf **Neue Bestellung**
3. **Kunden** aus der Liste auswählen
4. Bestellpositionen hinzufügen:
   - Datei/Modell aus der Dateibibliothek auswählen oder Freitext-Position hinzufügen
   - Menge und Stückpreis angeben
   - System berechnet Kosten automatisch, wenn mit Projekt verknüpft
5. **Lieferdatum** angeben (geschätzt)
6. Klicken Sie auf **Bestellung erstellen**

### Bestellstatus

| Status | Beschreibung |
|---|---|
| Anfrage | Anfrage eingegangen, nicht bestätigt |
| Bestätigt | Vom Kunden bestätigt |
| In Produktion | Drucke laufen |
| Versandbereit | Fertig, wartet auf Abholung/Versand |
| Geliefert | Bestellung abgeschlossen |
| Storniert | Vom Kunden oder von Ihnen abgebrochen |

Status aktualisieren, indem Sie auf die Bestellung klicken → **Status ändern**.

### Drucke mit Bestellung verknüpfen

1. Bestellung öffnen
2. Klicken Sie auf **Druck verknüpfen**
3. Drucke aus dem Verlauf auswählen (Mehrfachauswahl unterstützt)
4. Kostendaten werden automatisch aus dem Druckverlauf abgerufen

## Rechnungsstellung

Siehe [Projekte → Rechnungsstellung](../funksjoner/projects#fakturering) für detaillierte Rechnungsdokumentation.

Rechnungen können direkt aus einer Bestellung generiert werden:

1. Bestellung öffnen
2. Klicken Sie auf **Rechnung generieren**
3. Betrag und MwSt. prüfen
4. Als PDF herunterladen oder an die E-Mail-Adresse des Kunden senden

### Rechnungsnummernserie

Rechnungsnummernserie unter **Einstellungen → E-Commerce** einrichten:
- **Präfix**: z.B. `2026-`
- **Startnummer**: z.B. `1001`
- Rechnungsnummern werden automatisch in aufsteigender Reihenfolge vergeben

## Berichterstattung und Steuern

### Gebührenberichterstattung

Das System verfolgt alle Transaktionsgebühren:
- Gebühren unter **E-Commerce → Gebühren** anzeigen
- Gebühren als gemeldet für Buchhaltungszwecke markieren
- Gebührenübersicht pro Zeitraum exportieren

### Statistiken

Unter **E-Commerce → Statistiken**:
- Monatlicher Umsatz (Balkendiagramm)
- Top-Kunden nach Umsatz
- Meistverkaufte Modelle/Materialien
- Durchschnittliche Bestellgröße

Für das Buchhaltungssystem als CSV exportieren.

## Support und Kontakt

:::info Benötigen Sie Hilfe?
- **Lizenzfragen**: Kontaktieren Sie den [geektech.no](https://geektech.no) Support
- **Technische Probleme**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Funktionswünsche**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
