---
sidebar_position: 3
title: Stringing
description: Orsaker till stringing och lösningar — retraktion, temperatur och torkning
---

# Stringing

Stringing (eller «oozing») är tunna plasttrådar som bildas mellan separata delar av objektet medan munstycket rör sig utan att extrudera. Det ger ett «spindelnät»-liknande utseende på utskriften.

## Orsaker till stringing

1. **För hög munstycketemperatur** — varm plast är flytande och droppar
2. **Dåliga retraktionsinställningar** — filamentet dras inte tillbaka tillräckligt snabbt
3. **Fuktigt filament** — fukt orsakar ånga och extra flöde
4. **För låg hastighet** — munstycket befinner sig länge i transitlägen

## Diagnos

**Fuktigt filament?** Hör du ett knakande/poppande ljud under utskrift? Då är filamentet fuktigt — torka det först innan du justerar andra inställningar.

**För hög temp?** Ser du droppar från munstycket i «pause»-ögonblick? Sänk temperaturen 5–10 °C.

## Lösningar

### 1. Torka filamentet

Fuktigt filament är den vanligaste orsaken till stringing som inte kan justeras bort:

| Material | Torktemperatur | Tid |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 timmar |
| PETG | 60–65 °C | 6–8 timmar |
| TPU | 55–60 °C | 6–8 timmar |
| PA | 75–85 °C | 8–12 timmar |

### 2. Sänk munstycketemperaturen

Börja med att sänka 5 °C i taget:
- PLA: prova 210–215 °C (ned från 220 °C)
- PETG: prova 235–240 °C (ned från 245 °C)

:::warning För låg temp ger dålig lagfusion
Sänk temperaturen försiktigt. För låg temperatur ger dålig lagfusion, svag utskrift och extruderingsproblem.
:::

### 3. Justera retraktionsinställningar

Retraktion drar tillbaka filamentet i munstycket under «travel»-rörelse för att förhindra dropp:

```
Bambu Studio → Filament → Retraktion:
- Retraktionsavstånd: 0.4–1.0 mm (direct drive)
- Retraktionshastighet: 30–45 mm/s
```

:::tip Bambu Lab-skrivare har direct drive
Alla Bambu Lab-skrivare (X1C, P1S, A1) använder direct drive extruder. Direct drive kräver **kortare** retraktionsavstånd än Bowden-system (typiskt 0.5–1.5 mm vs. 3–7 mm).
:::

### 4. Öka travel-hastigheten

Snabb rörelse mellan punkter ger munstycket kortare tid att droppa:
- Öka «travel speed» till 200–300 mm/s
- Bambu Lab-skrivare hanterar detta bra

### 5. Aktivera «Avoid Crossing Perimeters»

Slicerinställning som gör att munstycket undviker att korsa öppna områden där stringing syns:
```
Bambu Studio → Kvalitet → Avoid crossing perimeters
```

### 6. Sänk hastigheten (för TPU)

För TPU är lösningen motsatsen till andra material:
- Sänk utskriftshastigheten till 20–35 mm/s
- TPU är elastiskt och komprimeras vid för hög hastighet — detta ger «efterflöde»

## Efter justeringar

Testa med en standard stringing-testmodell (t.ex. «torture tower» från MakerWorld). Justera en variabel i taget och observera förändringen.

:::note Perfekt är sällan möjligt
Viss stringing är normalt för de flesta material. Fokusera på att minska till acceptabel nivå, inte eliminera helt. PETG kommer alltid ha lite mer stringing än PLA.
:::
