---
sidebar_position: 3
title: Flottsöversikt
description: Administrera och övervaka alla Bambu Lab-skrivare i ett rutnät med sortering, filtrering och realtidsstatus
---

# Flottsöversikt

Flottsöversikten ger dig en kompakt överblick över alla anslutna skrivare på en sida. Perfekt för verkstäder, klassrum eller alla som har mer än en skrivare.

Gå till: **https://localhost:3443/#fleet**

## Flerskrivar-rutnät

Alla registrerade skrivare visas i ett responsivt rutnät:

- **Kortstorlek** — Liten (kompakt), Medium (standard), Stor (detaljerad)
- **Antal kolumner** — Anpassas automatiskt efter skärmbredd, eller ange manuellt
- **Uppdatering** — Varje kort uppdateras oberoende via MQTT

Varje skrivarkort visar:
| Fält | Beskrivning |
|---|---|
| Skrivarnamn | Konfigurerat namn med modellikon |
| Status | Ledig / Skriver / Paus / Fel / Frånkopplad |
| Framsteg | Procentbar med återstående tid |
| Temperatur | Munstycke och bädd (kompakt) |
| Aktivt filament | Färg och material från AMS |
| Kamera-thumbnail | Stillbild uppdaterad var 30:e sekund |

## Statusindikator per skrivare

Statusfärger gör det enkelt att se tillståndet på avstånd:

- **Grön puls** — Skriver aktivt
- **Blå** — Ledig och redo
- **Gul** — Pausad (manuellt eller av Print Guard)
- **Röd** — Fel upptäckt
- **Grå** — Frånkopplad eller otillgänglig

:::tip Kioskläge
Använd flottsöversikten i kioskläge på en väggmonterad skärm. Se [Kioskläge](../system/kiosk) för inställning.
:::

## Sortering

Klicka **Sortera** för att välja ordning:

1. **Namn** — Alfabetisk A–Ö
2. **Status** — Aktiva skrivare överst
3. **Framsteg** — Mest färdigt överst
4. **Senast aktiv** — Senast använda överst
5. **Modell** — Grupperat efter skrivarmodell

Sorteringen sparas till nästa besök.

## Filtrering

Använd filterfältet överst för att begränsa visningen:

- Skriv in skrivarnamn eller del av namn
- Välj **Status** från rullgardinsmenyn (Alla / Skriver / Ledig / Fel)
- Välj **Modell** för att visa bara en skrivartyp (X1C, P1S, A1, osv.)
- Klicka **Rensa filter** för att visa alla

:::info Sökning
Sökningen filtrerar i realtid utan att ladda om sidan.
:::

## Åtgärder från flottsöversikten

Högerklicka på ett kort (eller klicka de tre prickarna) för snabbåtgärder:

- **Öppna dashboard** — Gå direkt till skrivarens huvudpanel
- **Pausa utskrift** — Sätter skrivaren på paus
- **Stopp utskrift** — Avbryter pågående utskrift (kräver bekräftelse)
- **Se kamera** — Öppnar kameravisning i popup
- **Gå till inställningar** — Öppnar skrivarinställningar

:::danger Stopp utskrift
Att stoppa en utskrift är inte reversibelt. Bekräfta alltid i dialogrutan som visas.
:::

## Aggregerad statistik

Överst i flottsöversikten visas en sammanfattningsrad:

- Totalt antal skrivare
- Antal aktiva utskrifter
- Total filamentförbrukning idag
- Uppskattad färdigtid för längsta pågående utskrift
