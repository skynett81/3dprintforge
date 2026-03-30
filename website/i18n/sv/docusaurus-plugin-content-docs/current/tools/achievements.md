---
sidebar_position: 5
title: Prestationer
description: Gamification-system med upplåsbara prestationer, sällsynthetsgrader och milstolpar för Bambu Lab-utskrift
---

# Prestationer

Prestationer (achievements) är ett gamification-element som belönar milstolpar och spännande ögonblick på din utskriftsresa. Samla prestationer och se ditt framsteg mot nästa upplåsning.

Gå till: **https://localhost:3443/#achievements**

## Sällsynthetsgrader

Prestationer är klassificerade i fyra sällsynthetsgrader:

| Grad | Färg | Beskrivning |
|---|---|---|
| **Vanlig** | Grå | Enkla milstolpar, lätt att uppnå |
| **Ovanlig** | Grön | Kräver lite ansträngning eller tid |
| **Sällsynt** | Blå | Kräver dedikerad ansträngning över tid |
| **Legendarisk** | Guld | Extraordinära bedrifter |

## Exempel på prestationer

### Utskrifts-milstolpar (Vanlig / Ovanlig)
| Prestation | Krav |
|---|---|
| Första utskriften | Slutför din allra första utskrift |
| En hel dag | Skriver ut i mer än 24 timmar totalt |
| Hög framgångsrate | 10 lyckade utskrifter i rad |
| Filamentsamlare | Registrera 10 olika filamenttyper |
| Flerfärger | Slutför en flerfärgsutskrift |

### Volymprestationer (Ovanlig / Sällsynt)
| Prestation | Krav |
|---|---|
| Kilogrammet | Använd 1 kg filament totalt |
| 10 kg | Använd 10 kg filament totalt |
| 100 utskrifter | 100 lyckade utskrifter |
| 500 timmar | 500 ackumulerade utskriftstimmar |
| Nattskiftet | Slutför en utskrift som varar mer än 20 timmar |

### Underhåll och omsorg (Ovanlig / Sällsynt)
| Prestation | Krav |
|---|---|
| Plikttrogen | Logga en underhållsuppgift |
| Skrivarskötare | 10 underhållsuppgifter loggade |
| Inget avfall | Skapa en utskrift med > 90 % materialeffektivitet |
| Mästarmunstycken | Byt munstycke 5 gånger (dokumenterat) |

### Legendariska prestationer
| Prestation | Krav |
|---|---|
| Outtröttlig | 1000 lyckade utskrifter |
| Filament-titan | 50 kg totalt filamentförbrukning |
| Felfri vecka | 7 dagar utan en enda misslyckad utskrift |
| Utskriftsbibliotekarie | 100 olika modeller i filbiblioteket |

## Se prestationer

Prestationssidan visar:

- **Upplåst** — prestationer du har uppnått (med datum)
- **Nära** — prestationer du är nära att uppnå (förloppsbar)
- **Låst** — alla prestationer du ännu inte har uppnått

Filtrera efter **Grad**, **Kategori** eller **Status** (upplåst / pågår / låst).

## Förloppsbar

För prestationer med räknare visas en förloppsbar:

```
Kilogrammet — 1 kg filament
[████████░░] 847 g / 1000 g (84.7 %)
```

## Aviseringar

Du aviseras automatiskt när du uppnår en ny prestation:
- **Browser-popup** med prestationsnamn och grafik
- Valfritt: avisering via Telegram / Discord (konfigurera under **Inställningar → Aviseringar → Prestationer**)

## Fleranvändarstöd

I system med flera användare har varje användare sin egen prestationsprofil. En **topplista** (leaderboard) visar rankingen efter:

- Totalt antal upplåsta prestationer
- Totalt antal utskrifter
- Totala utskriftstimmar

:::tip Privat läge
Stäng av topplistan under **Inställningar → Prestationer → Dölj från topplista** för att hålla profilen privat.
:::
