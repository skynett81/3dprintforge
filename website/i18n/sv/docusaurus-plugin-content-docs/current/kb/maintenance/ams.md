---
sidebar_position: 3
title: AMS-underhåll
description: Underhåll av AMS — PTFE-rör, filamentbana och fuktighetsskydd
---

# AMS-underhåll

AMS (Automatic Material System) är ett precisionssystem som kräver regelbundet underhåll för att fungera tillförlitligt. De vanligaste problemen är smutsig filamentbana och fukt i huset.

## PTFE-rör

PTFE-rören transporterar filamentet från AMS till skrivaren. De är bland de första delarna som slits.

### Inspektion
Kontrollera PTFE-rören för:
- **Knickar eller böjar** — hindrar filamentflödet
- **Slitage vid kopplingar** — vitt damm runt ingångarna
- **Formdeformation** — särskilt vid användning av CF-material

### Byta PTFE-rör
1. Frigör filament från AMS (kör avlastningscykel)
2. Tryck in den blå låsringen runt röret vid kopplingen
3. Dra ut röret (kräver ett fast grepp)
4. Klipp nytt rör till rätt längd (inte kortare än originalet)
5. Tryck in tills det stopper och lås

:::tip AMS Lite vs. AMS
AMS Lite (A1/A1 Mini) har enklare PTFE-konfiguration än full AMS (P1S/X1C). Rören är kortare och lättare att byta.
:::

## Filamentbana

### Rengöring av filamentbanan
Filament lämnar damm och rester i filamentbanan, särskilt CF-material:

1. Kör avlastning av alla platser
2. Använd tryckluft eller en mjuk pensel för att blåsa ut löst damm
3. Kör ett rent stycke nylon eller PTFE-rengöringsfilament genom banan

### Sensorer
AMS använder sensorer för att detektera filamentposition och filamentbrott. Håll sensorglasögon rena:
- Torka försiktigt av sensorlinser med en ren pensel
- Undvik IPA direkt på sensorer

## Fukt

AMS skyddar inte filament mot fukt. För hygroskopiska material (PA, PETG, TPU) rekommenderas:

### Torra AMS-alternativ
- **Förseglad låda:** Placera spolar i en tät låda med silikagel
- **Bambu Dry Box:** Officiellt torkboxstillbehör
- **Extern matare:** Använd filamentmatare utanför AMS för känsliga material

### Fuktighetsindikatorer
Lägg fuktighetsindikatorkort (hygrometer) i AMS-huset. Byt silikagelpåsar vid över 30% relativ luftfuktighet.

## Drivhjul och klämemekanism

### Inspektion
Kontrollera drivhjulen (extruderhjulen i AMS) för:
- Filamentrester mellan tänderna
- Slitage på tanduppsättningen
- Ojämn friktion vid manuell dragning

### Rengöring
1. Använd en tandborste eller borste för att ta bort rester mellan drivhjulets tänder
2. Blås med tryckluft
3. Undvik olja och smörjmedel — dragkraften är kalibrerad för torr drift

## Underhållsintervall

| Aktivitet | Intervall |
|-----------|---------|
| Visuell inspektion PTFE-rör | Månadsvis |
| Rengöring av filamentbana | Var 100:e timme |
| Kontroll av sensorer | Månadsvis |
| Byta silikagel (torkinstallation) | Vid behov (vid 30%+ RF) |
| Byta PTFE-rör | Vid synligt slitage |
