---
sidebar_position: 3
title: Utskriftsprofiler
description: Skapa, redigera och hantera utskriftsprofiler med förinställningar för snabb och konsekvent utskrift
---

# Utskriftsprofiler

Utskriftsprofiler är sparade uppsättningar med utskriftsinställningar som du kan återanvända mellan utskrifter och skrivare. Spara tid och säkerställ konsekvent kvalitet genom att definiera profiler för olika ändamål.

Gå till: **https://localhost:3443/#profiles**

## Skapa en profil

1. Gå till **Verktyg → Utskriftsprofiler**
2. Klicka **Ny profil** (+ ikon)
3. Fyll i:
   - **Profilnamn** — beskrivande namn, t.ex. «PLA - Snabb produktion»
   - **Material** — välj från lista (PLA / PETG / ABS / PA / PC / TPU / osv.)
   - **Skrivarmodell** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Alla
   - **Beskrivning** — valfri text

4. Fyll i inställningar (se avsnitt nedan)
5. Klicka **Spara profil**

## Inställningar i en profil

### Temperatur
| Fält | Exempel |
|---|---|
| Munstycketemperatur | 220°C |
| Bäddtemperatur | 60°C |
| Kammartemperatur (X1C) | 35°C |

### Hastighet
| Fält | Exempel |
|---|---|
| Hastighetsinställning | Standard |
| Maxhastighet (mm/s) | 200 |
| Acceleration | 5000 mm/s² |

### Kvalitet
| Fält | Exempel |
|---|---|
| Lagertjocklek | 0.2 mm |
| Infill-procent | 15 % |
| Infill-mönster | Grid |
| Stödmaterial | Auto |

### AMS och färger
| Fält | Beskrivning |
|---|---|
| Purge-volym | Mängd rensning vid färgbyte |
| Föredragna platser | Vilka AMS-platser som föredras |

### Avancerat
| Fält | Beskrivning |
|---|---|
| Torkningsläge | Aktivera AMS-torkning för fuktiga material |
| Avkylningstid | Paus mellan lager för avkylning |
| Fläkthastighet | Kylningsfläktens hastighet i procent |

## Redigera en profil

1. Klicka på profilen i listan
2. Klicka **Redigera** (pennikon)
3. Gör ändringar
4. Klicka **Spara** (skriv över) eller **Spara som ny** (skapar en kopia)

:::tip Versionering
Använd «Spara som ny» för att behålla en fungerande profil medan du experimenterar med ändringar.
:::

## Använda en profil

### Från filbiblioteket

1. Välj fil i biblioteket
2. Klicka **Skicka till skrivare**
3. Välj **Profil** från rullgardinsmenyn
4. Inställningarna från profilen används

### Från utskriftskön

1. Skapa ett nytt köjobb
2. Välj **Profil** under inställningar
3. Profilen kopplas till köjobbet

## Importera och exportera profiler

### Export
1. Välj en eller flera profiler
2. Klicka **Exportera**
3. Välj format: **JSON** (för import i andra dashboards) eller **PDF** (för utskrift/dokumentation)

### Import
1. Klicka **Importera profiler**
2. Välj en `.json`-fil exporterad från ett annat Bambu Dashboard
3. Befintliga profiler med samma namn kan skrivas över eller båda behållas

## Dela profiler

Dela profiler med andra via community-filamentmodulen (se [Community-filamenter](../integrasjoner/community)) eller via direkt JSON-export.

## Standardprofil

Ange en standardprofil per material:

1. Välj profilen
2. Klicka **Ange som standard för [material]**
3. Standardprofilen väljs automatiskt när du skickar en fil med det materialet
