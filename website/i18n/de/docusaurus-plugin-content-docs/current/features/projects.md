---
sidebar_position: 9
title: Projekte
description: Organisieren Sie Drucke in Projekten, verfolgen Sie Kosten, erstellen Sie Rechnungen und teilen Sie Projekte mit Kunden
---

# Projekte

Projekte ermöglichen es Ihnen, zusammengehörige Drucke zu gruppieren, Materialkosten zu verfolgen, Kunden zu fakturieren und eine Übersicht Ihrer Arbeit zu teilen.

Navigieren Sie zu: **https://localhost:3443/#projects**

## Ein Projekt erstellen

1. Klicken Sie auf **Neues Projekt** (+ Symbol)
2. Füllen Sie aus:
   - **Projektname** — beschreibender Name (max. 100 Zeichen)
   - **Kunde** — optionales Kundenkonto (siehe [E-Commerce](../integrations/ecommerce))
   - **Beschreibung** — kurze Textbeschreibung
   - **Farbe** — wählen Sie eine Farbe zur visuellen Identifikation
   - **Tags** — kommagetrennte Stichworte
3. Klicken Sie auf **Projekt erstellen**

## Drucke mit Projekten verknüpfen

### Während eines Drucks

1. Öffnen Sie das Dashboard, während ein Druck läuft
2. Klicken Sie auf **Mit Projekt verknüpfen** im Seitenpanel
3. Wählen Sie ein vorhandenes Projekt oder erstellen Sie ein neues
4. Der Druck wird automatisch mit dem Projekt verknüpft, wenn er abgeschlossen ist

### Aus der Historie

1. Gehen Sie zur **Historie**
2. Finden Sie den betreffenden Druck
3. Klicken Sie auf den Druck → **Mit Projekt verknüpfen**
4. Wählen Sie das Projekt aus der Dropdown-Liste

### Massenverknüpfung

1. Wählen Sie mehrere Drucke in der Historie mit Kontrollkästchen aus
2. Klicken Sie auf **Aktionen → Mit Projekt verknüpfen**
3. Wählen Sie das Projekt — alle ausgewählten Drucke werden verknüpft

## Kostenübersicht

Jedes Projekt berechnet Gesamtkosten basierend auf:

| Kostenart | Quelle |
|---|---|
| Filamentverbrauch | Gramm × Preis pro Gramm pro Material |
| Strom | kWh × Strompreis (von Tibber/Nordpool wenn konfiguriert) |
| Maschinenverschleiß | Berechnet aus [Verschleißprognose](../monitoring/wearprediction) |
| Manuelle Kosten | Freitextposten, die Sie manuell hinzufügen |

Die Kostenübersicht wird als Tabelle und Kreisdiagramm pro Druck und gesamt angezeigt.

:::tip Stundenpreise
Aktivieren Sie die Tibber- oder Nordpool-Integration für genaue Stromkosten pro Druck. Siehe [Strompreis](../integrations/energy).
:::

## Rechnungsstellung

1. Öffnen Sie ein Projekt und klicken Sie auf **Rechnung erstellen**
2. Füllen Sie aus:
   - **Rechnungsdatum** und **Fälligkeitsdatum**
   - **MwSt.-Satz** (0 %, 15 %, 25 %)
   - **Aufschlag** (%)
   - **Notiz an Kunden**
3. Zeigen Sie die Rechnung im PDF-Format als Vorschau an
4. Klicken Sie auf **PDF herunterladen** oder **An Kunden senden** (per E-Mail)

Rechnungen werden unter dem Projekt gespeichert und können bis zum Versand geöffnet und bearbeitet werden.

:::info Kundendaten
Kundendaten (Name, Adresse, USt-IdNr.) werden aus dem Kundenkonto abgerufen, das Sie mit dem Projekt verknüpft haben. Siehe [E-Commerce](../integrations/ecommerce) zur Verwaltung von Kunden.
:::

## Projektstatus

| Status | Beschreibung |
|---|---|
| Aktiv | Das Projekt ist in Bearbeitung |
| Abgeschlossen | Alle Drucke sind fertig, Rechnung gesendet |
| Archiviert | Ausgeblendet aus der Standardansicht, aber durchsuchbar |
| Wartend | Vorübergehend gestoppt |

Ändern Sie den Status, indem Sie auf die Statusanzeige oben im Projekt klicken.

## Ein Projekt teilen

Erstellen Sie einen teilbaren Link, um die Projektübersicht Kunden zu zeigen:

1. Klicken Sie auf **Projekt teilen** im Projektmenü
2. Wählen Sie, was angezeigt werden soll:
   - ✅ Drucke und Bilder
   - ✅ Gesamter Filamentverbrauch
   - ❌ Kosten und Preise (standardmäßig ausgeblendet)
3. Setzen Sie die Ablaufzeit für den Link
4. Kopieren Sie den Link und teilen Sie ihn

Der Kunde sieht eine schreibgeschützte Seite ohne Anmeldung.
