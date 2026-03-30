---
sidebar_position: 5
title: Errungenschaften
description: Gamification-System mit freischaltbaren Errungenschaften, Seltenheitsstufen und Meilensteinen für das Bambu Lab-Drucken
---

# Errungenschaften

Errungenschaften sind ein Gamification-Element, das Meilensteine und besondere Momente auf Ihrer Druckreise belohnt. Sammeln Sie Errungenschaften und verfolgen Sie den Fortschritt bis zur nächsten Freischaltung.

Navigieren Sie zu: **https://localhost:3443/#achievements**

## Seltenheitsstufen

Errungenschaften sind in vier Seltenheitsstufen eingeteilt:

| Stufe | Farbe | Beschreibung |
|---|---|---|
| **Gewöhnlich** | Grau | Einfache Meilensteine, leicht zu erreichen |
| **Ungewöhnlich** | Grün | Erfordern etwas Aufwand oder Zeit |
| **Selten** | Blau | Erfordern anhaltenden Einsatz über Zeit |
| **Legendär** | Gold | Außergewöhnliche Leistungen |

## Beispiele für Errungenschaften

### Druck-Meilensteine (Gewöhnlich / Ungewöhnlich)
| Errungenschaft | Anforderung |
|---|---|
| Erster Druck | Schließen Sie Ihren allerersten Druck ab |
| Ein ganzer Tag | Insgesamt mehr als 24 Stunden gedruckt |
| Hohe Erfolgsrate | 10 erfolgreiche Drucke in Folge |
| Filament-Sammler | 10 verschiedene Filamenttypen registriert |
| Mehrfarbig | Einen Mehrfarbdruck abgeschlossen |

### Volumen-Errungenschaften (Ungewöhnlich / Selten)
| Errungenschaft | Anforderung |
|---|---|
| Das Kilogramm | Insgesamt 1 kg Filament verbraucht |
| 10 kg | Insgesamt 10 kg Filament verbraucht |
| 100 Drucke | 100 erfolgreiche Drucke |
| 500 Stunden | 500 kumulierte Druckstunden |
| Die Nachtschicht | Einen Druck abgeschlossen, der mehr als 20 Stunden dauerte |

### Wartung und Pflege (Ungewöhnlich / Selten)
| Errungenschaft | Anforderung |
|---|---|
| Pflichtbewusst | Eine Wartungsaufgabe protokolliert |
| Druckerpfleger | 10 Wartungsaufgaben protokolliert |
| Kein Abfall | Einen Druck mit > 90 % Materialeffizienz erstellt |
| Düsenmeister | Düse 5 Mal gewechselt (dokumentiert) |

### Legendäre Errungenschaften
| Errungenschaft | Anforderung |
|---|---|
| Unermüdlich | 1000 erfolgreiche Drucke |
| Filament-Titan | 50 kg Gesamtfilamentverbrauch |
| Fehlerfreie Woche | 7 Tage ohne einen einzigen fehlgeschlagenen Druck |
| Druck-Bibliothekar | 100 verschiedene Modelle in der Dateibibliothek |

## Errungenschaften anzeigen

Die Errungenschaftsseite zeigt:

- **Freigeschaltet** — Errungenschaften, die Sie erreicht haben (mit Datum)
- **In der Nähe** — Errungenschaften, die Sie fast erreicht haben (Fortschrittsbalken)
- **Gesperrt** — alle Errungenschaften, die Sie noch nicht erreicht haben

Filtern Sie nach **Stufe**, **Kategorie** oder **Status** (freigeschaltet / in Bearbeitung / gesperrt).

## Fortschrittsbalken

Für Errungenschaften mit Zähler wird ein Fortschrittsbalken angezeigt:

```
Das Kilogramm — 1 kg Filament
[████████░░] 847 g / 1000 g (84,7 %)
```

## Benachrichtigungen

Sie werden automatisch benachrichtigt, wenn Sie eine neue Errungenschaft erreichen:
- **Browser-Popup** mit Errungenschaftsname und Grafik
- Optional: Benachrichtigung über Telegram / Discord (konfigurieren unter **Einstellungen → Benachrichtigungen → Errungenschaften**)

## Mehrbenutzerunterstützung

In Systemen mit mehreren Benutzern hat jeder Benutzer sein eigenes Errungenschaftsprofil. Eine **Rangliste** (Leaderboard) zeigt die Platzierung nach:

- Gesamtanzahl freigeschalteter Errungenschaften
- Gesamtanzahl Drucke
- Gesamte Druckstunden

:::tip Privater Modus
Schalten Sie die Rangliste unter **Einstellungen → Errungenschaften → Von Rangliste ausblenden** aus, um Ihr Profil privat zu halten.
:::
