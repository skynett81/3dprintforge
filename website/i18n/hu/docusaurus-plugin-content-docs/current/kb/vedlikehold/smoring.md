---
sidebar_position: 4
title: Kenés
description: Lineáris rudak, csapágyak kenése és intervallumok Bambu Lab nyomtatókhoz
---

# Kenés

A mozgó alkatrészek megfelelő kenése csökkenti a kopást, csökkenti a zajszintet és biztosítja a pontos mozgást. A Bambu Lab nyomtatók lineáris mozgásrendszereket használnak, amelyek időszakos kenést igényelnek.

## Kenési típusok

| Komponens | Kenési típus | Termék |
|-----------|-------------|--------|
| Lineáris rudak (XY) | Könnyű gépolaj vagy PTFE-spray | 3-in-1, Super Lube |
| Z-tengely orsócsavar | Sűrű zsír | Super Lube zsír |
| Lineáris csapágyak | Könnyű lítiumzsír | Bambu Lab zsír |
| Kábellánc-láncszemek | Semmi (száraz) | — |

## Lineáris rudak

### X és Y tengely
A rudak polírozott acélrudak, amelyek lineáris csapágyakon csúsznak:

```
Intervallum: Minden 200–300 óra, vagy csikorgó hangok esetén
Mennyiség: Nagyon kevés — egy csepp olaj rudonként elegendő
Módszer:
1. Kapcsold ki a nyomtatót
2. Told a kocsit kézzel a végéig
3. Vigyél fel 1 csepp könnyű olajat a rúd közepére
4. Told a kocsit lassan oda-vissza 10-szer
5. Töröld le a felesleges olajat szálmentes papírral
```

:::warning Ne kenj túl
Túl sok olaj port vonz és csiszoló masszát hoz létre. Minimális mennyiséget használj és mindig töröld le a felesleget.
:::

### Z-tengely (függőleges)
A Z-tengely orsócsavart (leadscrew) használ, amely zsírt igényel (nem olajat):

```
Intervallum: Minden 200 óra
Módszer:
1. Kapcsold ki a nyomtatót
2. Kend fel a vékony zsírréteget az orsócsavar mentén
3. Futtatsd a Z-tengelyt manuálisan fel és le (vagy a karbantartási menün keresztül)
4. A zsír automatikusan eloszlik
```

## Lineáris csapágyak

A Bambu Lab P1S és X1C lineáris csapágyakat (MGN12) használ a Y-tengelyen:

```
Intervallum: Minden 300–500 óra
Módszer:
1. Távolíts el egy kevés zsírt tűvel vagy fogpiszkálóval a töltőnyílásnál
2. Fecskendezz be új zsírt fecskendővel és vékony kanüllel
3. Futtatsd a tengelyt oda-vissza az zsír elosztásához
```

A Bambu Lab hivatalos kenőanyagot (Bambu Lubricant) árul, amelyet a rendszerhez kalibráltak.

## Kenési karbantartás modellenkénti bontásban

### X1C / P1S
- Y-tengely: Lineáris csapágyak — Bambu zsír
- X-tengely: Szénrudak — könnyű olaj
- Z-tengely: Dupla orsócsavar — Bambu zsír

### A1 / A1 Mini
- Minden tengely: Acélrudak — könnyű olaj
- Z-tengely: Egyszeres orsócsavar — Bambu zsír

## Kenés szükségességének jelei

- **Csikorgó vagy kaparó hangok** mozgás közben
- **Rezgésminták** a függőleges falakon (VFA)
- **Pontatlan méretek** egyéb okok nélkül
- **A mozgásrendszer megnövekedett hangmagassága**

## Kenési intervallumok

| Tevékenység | Intervallum |
|-------------|------------|
| XY-rudak olajozása | Minden 200–300 óra |
| Z-orsó zsírozása | Minden 200 óra |
| Lineáris csapágyak zsírozása (X1C/P1S) | Minden 300–500 óra |
| Teljes karbantartási ciklus | Félévente (vagy 500 óra) |

Használd a dashboard karbantartási modulját az intervallumok automatikus nyomon követéséhez.
