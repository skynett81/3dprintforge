---
sidebar_position: 7
title: Rapporter
description: Automatiska vecko- och månadsrapporter via e-post med statistik, aktivitetssammanfattning och underhållspåminnelser
---

# Rapporter

3DPrintForge kan skicka automatiska e-postrapporter med statistik och aktivitetssammanfattningar — veckovis, månadsvis eller båda.

Gå till: **https://localhost:3443/#settings** → **System → Rapporter**

## Förutsättningar

Rapporter kräver att e-postaviseringar är konfigurerade. Ställ in SMTP under **Inställningar → Aviseringar → E-post** innan du aktiverar rapporter. Se [Aviseringar](../features/notifications).

## Aktivera automatiska rapporter

1. Gå till **Inställningar → Rapporter**
2. Aktivera **Veckorapport** och/eller **Månadsrapport**
3. Välj **Sändningstidpunkt**:
   - Veckovis: veckodag och klockslag
   - Månadsvis: dag i månaden (t.ex. 1:a måndag / sista fredag)
4. Fyll i **Mottagare-e-post** (kommaseparerat för flera)
5. Klicka **Spara**

Skicka en testrapport för att se formateringen: klicka **Skicka testrapport nu**.

## Innehåll i veckorapporten

Veckorapporten täcker de senaste 7 dagarna:

### Sammanfattning
- Totalt antal utskrifter
- Antal lyckade / misslyckade / avbrutna
- Framgångsrate och förändring från föregående vecka
- Mest aktiva skrivare

### Aktivitet
- Utskrifter per dag (minigraf)
- Totala utskriftstimmar
- Total filamentförbrukning (gram och kostnad)

### Filament
- Förbrukning per material och leverantör
- Uppskattad återstående per spole (spolar under 20 % framhävda)

### Underhåll
- Underhållsuppgifter utförda denna vecka
- Förfallna underhållsuppgifter (röd varning)
- Uppgifter som förfaller nästa vecka

### HMS-fel
- Antal HMS-fel denna vecka per skrivare
- Okvitterade fel (kräver uppmärksamhet)

## Innehåll i månadsrapporten

Månadsrapporten täcker de senaste 30 dagarna och innehåller allt från veckorapporten, plus:

### Trend
- Jämförelse med föregående månad (%)
- Aktivitetskarta (heatmap-miniatyr för månaden)
- Månadsvis framgångsratsutveckling

### Kostnader
- Total filamentkostnad
- Total elkostnad (om strömätning är konfigurerad)
- Total slitasjekostnad
- Sammanlagd underhållskostnad

### Slitage och hälsa
- Hälsopoäng per skrivare (med förändring från föregående månad)
- Komponenter som närmar sig bytningstidpunkten

### Statistikhöjdpunkter
- Längsta lyckade utskrift
- Mest använda filamenttyp
- Skrivare med högst aktivitet

## Anpassa rapporten

1. Gå till **Inställningar → Rapporter → Anpassning**
2. Kryssa av/på avsnitt du vill inkludera
3. Välj **Skrivarfilter**: alla skrivare eller ett urval
4. Välj **Logovisning**: visa 3DPrintForge-logotyp i header eller stäng av
5. Klicka **Spara**

## Rapportarkiv

Alla skickade rapporter sparas och kan öppnas igen:

1. Gå till **Inställningar → Rapporter → Arkiv**
2. Välj rapport från listan (sorterad efter datum)
3. Klicka **Öppna** för att se HTML-versionen
4. Klicka **Ladda ner PDF** för att ladda ner rapporten

Rapporter raderas automatiskt efter **90 dagar** (konfigurerbart).
