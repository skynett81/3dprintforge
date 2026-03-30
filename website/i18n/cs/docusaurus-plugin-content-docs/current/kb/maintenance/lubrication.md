---
sidebar_position: 4
title: Mazání
description: Mazání lineárních tyčí, ložisek a intervaly pro tiskárny Bambu Lab
---

# Mazání

Správné mazání pohyblivých částí snižuje opotřebení, snižuje hlučnost a zajišťuje přesný pohyb. Tiskárny Bambu Lab používají lineární pohybové systémy, které vyžadují periodické mazání.

## Typy maziv

| Součást | Typ maziva | Produkt |
|-----------|-------------|---------|
| Lineární tyče (XY) | Lehký strojní olej nebo PTFE spray | 3-in-1, Super Lube |
| Šroubový vřeten osy Z | Husté mazivo | Super Lube tuk |
| Lineární ložiska | Lehký lithiový tuk | Bambu Lab grease |
| Klouby kabelového vedení | Žádné (suché) | — |

## Lineární tyče

### Osy X a Y
Tyče jsou kalené ocelové tyče, které kloužou přes lineární ložiska:

```
Interval: Každých 200–300 hodin nebo při skřípavých zvucích
Množství: Velmi málo — jedna kapka na bod tyče stačí
Metoda:
1. Vypněte tiskárnu
2. Ručně posuňte vozík na konec
3. Naneste 1 kapku lehkého oleje doprostřed tyče
4. Pomalu pohybujte vozíkem tam a zpět 10×
5. Otřete přebytečný olej neprachujícím papírem
```

:::warning Nepřemazvávejte
Příliš mnoho oleje přitahuje prach a vytváří brusnou pastu. Používejte minimální množství a vždy otřete přebytek.
:::

### Osa Z (vertikální)
Osa Z používá šroubový vřeten (leadscrew), který vyžaduje tuk (nikoli olej):

```
Interval: Každých 200 hodin
Metoda:
1. Vypněte tiskárnu
2. Naneste tenkou vrstvu tuku podél šroubového vřetenu
3. Ručně pohybujte osou Z nahoru a dolů (nebo přes menu údržby)
4. Tuk se automaticky rozdělí
```

## Lineární ložiska

Bambu Lab P1S a X1C používají lineární ložiska (MGN12) na ose Y:

```
Interval: Každých 300–500 hodin
Metoda:
1. Odstraňte trochu tuku jehlou nebo párátkem ze vstupního otvoru
2. Vstříkněte nový tuk injekční stříkačkou s tenkou kanylou
3. Pohybujte osou tam a zpět pro rovnoměrné rozložení tuku
```

Bambu Lab prodává oficiální mazivo (Bambu Lubricant), které je kalibrováno pro systém.

## Mazání pro různé modely

### X1C / P1S
- Osa Y: Lineární ložiska — tuk od Bambu
- Osa X: Karbonové tyče — lehký olej
- Osa Z: Dvojitý šroubový vřeten — Bambu tuk

### A1 / A1 Mini
- Všechny osy: Ocelové tyče — lehký olej
- Osa Z: Jednoduchý šroubový vřeten — Bambu tuk

## Příznaky, že je třeba mazat

- **Skřípavé nebo drnčivé zvuky** při pohybu
- **Vzory vibrací** viditelné na vertikálních stěnách (VFA)
- **Nepřesné rozměry** bez jiných příčin
- **Zvýšená hlasitost** z pohybového systému

## Intervaly mazání

| Aktivita | Interval |
|-----------|---------|
| Olej na XY tyče | Každých 200–300 hodin |
| Tuk na Z vřeten | Každých 200 hodin |
| Tuk na lineární ložiska (X1C/P1S) | Každých 300–500 hodin |
| Kompletní cyklus údržby | Pololetně (nebo 500 hodin) |

Používejte modul údržby v dashboardu pro automatické sledování intervalů.
