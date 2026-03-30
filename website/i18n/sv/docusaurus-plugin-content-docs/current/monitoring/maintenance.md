---
sidebar_position: 4
title: Underhåll
description: Håll koll på munstyckesbyte, smörjning och andra underhållsuppgifter med påminnelser, intervall och kostnadslogg
---

# Underhåll

Underhållsmodulen hjälper dig att planera och spåra allt underhåll på dina Bambu Lab-skrivare — från munstyckesbyte till smörjning av skenor.

Gå till: **https://localhost:3443/#maintenance**

## Underhållsplan

Bambu Dashboard levereras med förkonfigurerade underhållsintervall för alla Bambu Lab-skrivarmodeller:

| Uppgift | Intervall (standard) | Modell |
|---|---|---|
| Rengör munstycke | Var 200:e timme | Alla |
| Byt munstycke (mässing) | Var 500:e timme | Alla |
| Byt munstycke (hardened) | Var 2000:e timme | Alla |
| Smörj X-axel | Var 300:e timme | X1C, P1S |
| Smörj Z-axel | Var 300:e timme | Alla |
| Rengör AMS-kugghjul | Var 200:e timme | AMS |
| Rengör kammare | Var 500:e timme | X1C |
| Byt PTFE-rör | Vid behov / 1000 timmar | Alla |
| Kalibrering (full) | Månadsvis | Alla |

Alla intervall kan anpassas per skrivare.

## Munstyckesbyte-logg

1. Gå till **Underhåll → Munstycken**
2. Klicka **Logga munstyckesbyte**
3. Fyll i:
   - **Datum** — automatiskt satt till idag
   - **Munstyckesmaterial** — Mässing / Härdat stål / Koppar / Rubinstift
   - **Munstycksdiameter** — 0.2 / 0.4 / 0.6 / 0.8 mm
   - **Märke/modell** — valfritt
   - **Pris** — för kostnadslogg
   - **Timmar vid byte** — automatiskt hämtat från utskriftstidsräknare
4. Klicka **Spara**

Loggen visar all munstyckshistorik sorterad efter datum.

:::tip Förhandspåminnelse
Ange **Avisera X timmar i förväg** (t.ex. 50 timmar) för att få avisering i god tid före nästa rekommenderade byte.
:::

## Skapa underhållsuppgifter

1. Klicka **Ny uppgift** (+ ikon)
2. Fyll i:
   - **Uppgiftsnamn** — t.ex. «Smörj Y-axel»
   - **Skrivare** — välj aktuell skrivare(ar)
   - **Intervalltyp** — Timmar / Dagar / Antal utskrifter
   - **Intervall** — t.ex. 300 timmar
   - **Senast utfört** — ange när det senast gjordes (ange bakåtdatum)
3. Klicka **Skapa**

## Intervall och påminnelser

För aktiva uppgifter visas:
- **Grön** — tid till nästa underhåll > 50 % av intervallet kvar
- **Gul** — tid till nästa underhåll < 50 % kvar
- **Orange** — tid till nästa underhåll < 20 % kvar
- **Röd** — underhåll förfallet

### Konfigurera påminnelser

1. Klicka på en uppgift → **Redigera**
2. Aktivera **Påminnelser**
3. Ange **Avisera vid** t.ex. 10 % kvar till förfall
4. Välj aviseringskanal (se [Aviseringar](../features/notifications))

## Markera som utfört

1. Hitta uppgiften i listan
2. Klicka **Utfört** (bockikon)
3. Intervallet återställs från dagens datum/timmar
4. Loggpost skapas automatiskt

## Kostnadslogg

Alla underhållsuppgifter kan ha en kopplad kostnad:

- **Delar** — munstycken, PTFE-rör, smörjmedel
- **Tid** — timmar använda × timtaxa
- **Extern service** — betald reparation

Kostnaderna summeras per skrivare och visas i statistiköversikten.

## Underhållshistorik

Gå till **Underhåll → Historik** för att se:
- Alla utförda underhållsuppgifter
- Datum, timmar och kostnad
- Vem som utförde (vid flersystem)
- Kommentarer och anteckningar

Exportera historiken till CSV för bokföringsändamål.
