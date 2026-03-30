---
sidebar_position: 6
title: Hibamintázat-elemzés
description: AI-alapú hibamintázat-elemzés, hibák és környezeti tényezők közötti korrelációk, és konkrét fejlesztési javaslatok
---

# Hibamintázat-elemzés

A hibamintázat-elemzés nyomtatásokból és hibákból származó korábbi adatokat használ a minták, okok és korrelációk azonosítására — és konkrét fejlesztési javaslatokat ad.

Navigálj ide: **https://localhost:3443/#error-analysis**

## Mit elemez a rendszer

A rendszer a következő adatpontokat elemzi:

- HMS hibakódok és időpontjaik
- Filament típusa és szállítója hiba esetén
- Hőmérséklet hiba esetén (fúvóka, ágy, kamra)
- Nyomtatási sebesség és profil
- Napszak és a hét napja
- Az utolsó karbantartás óta eltelt idő
- Nyomtatómodell és firmware verzió

## Korreláció-elemzés

A rendszer statisztikai korrelációkat keres a hibák és tényezők között:

**Példák az észlelt korrelációkra:**
- „Az AMS-elakadási hibák 78%-a X szállítótól származó filamenttel fordul elő"
- „A fúvóka-eltömődés 6+ óra folyamatos nyomtatás után 3× gyakrabban fordul elő"
- „A tapadási hibák 18°C alatti kamrahőmérsékletnél növekednek"
- „A stringing hibák 60% feletti páratartalommal korrelálnak (ha higrométer csatlakoztatva)"

A statisztikai szignifikanciával rendelkező korrelációk (p < 0,05) kerülnek az élre.

:::info Adatkövetelmény
Az elemzés legalább 50 nyomtatással a legrészletesebb az előzményekben. Kevesebb nyomtatással alacsony megbízhatóságú becslések jelennek meg.
:::

## Fejlesztési javaslatok

Az elemzések alapján konkrét javaslatok generálódnak:

| Javaslat típusa | Példa |
|---|---|
| Filament | „Válts másik szállítóra a PA-CF-hez — 4 hibából 3 X szállítótól származott" |
| Hőmérséklet | „Emeld az ágyhőmérsékletet 5°C-kal PETG esetén — a tapadási hibák becsülten 60%-kal csökkennek" |
| Sebesség | „Csökkentsd a sebességet 80%-ra 4 óra után — a fúvóka-elakadások becsülten 45%-kal csökkennek" |
| Karbantartás | „Tisztítsd meg az extruder fogaskereket — a kopás 40%-ával korrelál az extrudálási hibákkal" |
| Kalibrálás | „Futtass ágy szintezést — az elmúlt heti 15 tapadási hibából 12 hibás kalibrálással korrelál" |

Minden javaslat a következőket mutatja:
- Becsült hatás (%-os hibaredukció)
- Megbízhatóság (alacsony / közepes / magas)
- Lépésről lépésre megvalósítás
- Hivatkozás a releváns dokumentációra

## Egészségpontszám-hatás

Az elemzés az egészségpontszámhoz kapcsolódik (lásd [Diagnosztika](./diagnostics)):

- Megmutatja, mely tényezők húzzák le legjobban a pontszámot
- Becsüli a pontszám-javulást minden javaslat megvalósításakor
- Javaslatok rangsorolása a potenciális pontszám-javulás szerint

## Idővonal-nézet

Navigálj a **Hibaelemzés → Idővonal** menüpontra a kronologikus áttekintéshez:

1. Válassz nyomtatót és időszakot
2. A hibák pontokként jelennek meg az idővonalán, típus szerint színkódolva
3. Vízszintes vonalak jelzik a karbantartási feladatokat
4. A hibacsoportosulások (sok hiba rövid idő alatt) pirossal vannak kiemelve

Kattints egy csoportosulásra az adott időszak elemzésének megnyitásához.

## Jelentések

PDF jelentés generálása a hibaelemzésről:

1. Kattints a **Jelentés generálása** gombra
2. Válassz időszakot (pl. utolsó 90 nap)
3. Válaszd ki a tartalmat: korrelációk, javaslatok, idővonal, egészségpontszám
4. Töltsd le PDF-ként, vagy küld e-mailben

A jelentések projektekhez kerülnek mentésre, ha a nyomtató projekthez van csatolva.

:::tip Heti áttekintés
Állíts be automatikus heti e-mail jelentést a **Beállítások → Jelentések** menüponton, hogy naprakész maradj manuális dashboardlátogatás nélkül. Lásd [Jelentések](../system/reports).
:::
