---
sidebar_position: 4
title: Smörjning
description: Smörjning av linjära stänger, lager och intervall för Bambu Lab-skrivare
---

# Smörjning

Korrekt smörjning av rörliga delar minskar slitage, sänker ljudnivån och säkerställer precis rörelse. Bambu Lab-skrivare använder linjära rörelsesystem som kräver periodisk smörjning.

## Smörjningstyper

| Komponent | Smörjningstyp | Produkt |
|-----------|-------------|---------|
| Linjära stänger (XY) | Lätt maskinolja eller PTFE-spray | 3-i-1, Super Lube |
| Z-axelns skruvspindel | Tjockt smörjfett | Super Lube-fett |
| Linjära lager | Lätt litiumfett | Bambu Lab-fett |
| Kabelkedjans leder | Ingen (torr) | — |

## Linjära stänger

### X- och Y-axeln
Stängerna är härdade stålstänger som glider genom linjära lager:

```
Intervall: Var 200–300:e timme, eller vid knarrande ljud
Mängd: Mycket lite — en droppe per stångpunkt är tillräckligt
Metod:
1. Stäng av skrivaren
2. Flytta vagnen manuellt till änden
3. Påför 1 droppe lätt olja mitt på stången
4. Flytta vagnen långsamt fram och tillbaka 10 gånger
5. Torka av överflödig olja med luddfritt papper
```

:::warning Smörj inte för mycket
För mycket olja drar till sig damm och skapar slipande pasta. Använd minimala mängder och torka alltid bort överskott.
:::

### Z-axeln (vertikal)
Z-axeln använder en skruvspindel (leadscrew) som kräver fett (inte olja):

```
Intervall: Var 200:e timme
Metod:
1. Stäng av skrivaren
2. Smörj ett tunt lager fett längs skruvspindeln
3. Kör Z-axeln upp och ned manuellt (eller via underhållsmenyn)
4. Fettet fördelas automatiskt
```

## Linjära lager

Bambu Lab P1S och X1C använder linjära lager (MGN12) på Y-axeln:

```
Intervall: Var 300–500:e timme
Metod:
1. Ta bort lite fett med en nål eller tandpetare från inmatningsöppningen
2. Injicera nytt fett med en spruta och tunn kanyl
3. Kör axeln fram och tillbaka för att fördela fettet
```

Bambu Lab säljer officiellt smörjfett (Bambu Lubricant) som är kalibrerat för systemet.

## Underhåll av smörjning för olika modeller

### X1C / P1S
- Y-axel: Linjära lager — Bambus fett
- X-axel: Kolstänger — lätt olja
- Z-axel: Dubbel skruvspindel — Bambus fett

### A1 / A1 Mini
- Alla axlar: Stålstänger — lätt olja
- Z-axel: Enkel skruvspindel — Bambus fett

## Tecken på att smörjning behövs

- **Knarrande eller skrapande ljud** vid rörelse
- **Vibrationsmönster** synliga på vertikala väggar (VFA)
- **Onoggranna dimensioner** utan andra orsaker
- **Ökad ljudnivå** från rörelsesystemet

## Smörjningsintervall

| Aktivitet | Intervall |
|-----------|---------|
| Olja XY-stänger | Var 200–300:e timme |
| Fett Z-spindel | Var 200:e timme |
| Fett linjära lager (X1C/P1S) | Var 300–500:e timme |
| Fullständig underhållscykel | Halvårsvis (eller 500 timmar) |

Använd underhållsmodulen i dashboardet för att spåra intervall automatiskt.
