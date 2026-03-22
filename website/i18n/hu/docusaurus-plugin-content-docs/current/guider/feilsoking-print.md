---
sidebar_position: 5
title: Hibás nyomtatás elhárítása
description: Diagnosztizáljon és oldjon meg gyakori nyomtatási hibákat a Bambu Dashboard hibanapló és eszközeivel
---

# Hibás nyomtatás elhárítása

Valami elromlott? Ne csüggedjen — a legtöbb nyomtatási hiba egyszerű megoldásokat tartalmaz. A Bambu Dashboard segít gyorsan megtalálni az okot.

## 1. lépés — Ellenőrizze a HMS-hibakódokat

Az HMS (kezelés, nyomon követés, érzékelés) a Bambu Labs hibaredszere. Minden hiba automatikusan naplóz az irányítópulton.

1. Lépjen a **Monitorozás → Hibák** menübe
2. Keresse meg a hibás nyomtatást
3. Kattintson a hibakódra a részletes leírás és javasolt megoldás megtekintéséhez

Gyakori HMS-kódok:

| Kód | Leírás | Gyors megoldás |
|-----|-----------|--------------|
| 0700 1xxx | AMS-hiba (megtancolva, motorprobléma) | Ellenőrizze a filament útvonalát az AMS-ben |
| 0300 0xxx | Extrudálási hiba (alul/felül extrudálása) | Tisztítsa meg a fúvókát, ellenőrizze a filamentet |
| 0500 xxxx | Kalibrálási hiba | Futtassa a re-kalibrálást |
| 1200 xxxx | Hőmérséklet eltérése | Ellenőrizze a kábel csatlakozásokat |
| 0C00 xxxx | Kamerahiba | Indítsa újra a nyomtatót |

:::tip Hibakódok az előzményekben
Az **Előzmények → [Nyomtatás] → HMS-napló** alatt megtekintheti az összes hibakódot, amely az alatt fordult elő — még akkor is, ha a nyomtatás "befejeződött".
:::

## Gyakori hibák és megoldások

### Rossz tapadás (az első réteg nem ragad a lemezhez)

**Tünetek:** A nyomtatás a lemezről elválik, görbülhet, első réteg hiányzik

**Okok és megoldások:**

| Ok | Megoldás |
|-------|---------|
| Szennyezett lemez | Törölje le IPA-alkohollal |
| Helytelen lemez hőmérséklet | Emelje meg 5°C-vel |
| Z-offset hiba | Futtassa az Auto Bed Leveling-et újra |
| Hiányzik ragasztóstift (PETG/ABS) | Vigyen fel vékony ragasztóstift réteget |
| Túl gyors első réteg sebesség | Csökkentse 20–30 mm/s-ra az első rétegben |

**Gyors ellenőrzési lista:**
1. Clean lemez? (IPA + szálmentes papírtörlő)
2. Helyes lemez a filament típusához? (lásd [Helyes lemez kiválasztása](./velge-rett-plate))
3. Z-kalibrálás a legutóbbi lemez csere után?

---

### Warping (a sarkok felemelkednek)

**Tünetek:** A sarkok felfelé hajlanak a lemezről, különösen nagy lapos modelleken

**Okok és megoldások:**

| Ok | Megoldás |
|-------|---------|
| Hőmérséklet különbség | Zárja be az ajtót a nyomtatón |
| Hiányzik a szegély | Aktiválja a szegélyt a Bambu Studio-ban (3–5 mm) |
| Túl hideg lemez | Emelje meg a lemez hőmérsékletét 5–10°C-kal |
| Filament magas zsugorodásával (ABS) | Engineering Plate + kamra >40°C |

**Az ABS és az ASA különösen sérülékeny.** Mindig gondoskodjon:
- Ajtó zárva
- Minimum szellőztetés
- Engineering Plate + ragasztóstift
- Kamra hőmérséklet 40°C+

---

### Stringing (szálak az alkatrészek között)

**Tünetek:** Finom műanyag szálak a modell különálló részei között

**Okok és megoldások:**

| Ok | Megoldás |
|-------|---------|
| Nedves filament | Szárítsa meg a filamentet 6–8 órán keresztül (60–70°C) |
| Túl magas fúvóka hőmérséklet | Csökkentse 5°C-vel |
| Túl kevés retrakció | Növelje a retraksciót a Bambu Studio-ban |
| Túl alacsony utazási sebesség | Növelje az utazási sebességet 200+ mm/s-ra |

**Páratartalom teszt:** Hallgasson meg pattanó hangokon vagy lásson boborékokat az extrudálásban — ez nedves filamentet jelez. A Bambu AMS beépített páratartalom-méréseket tartalmaz; ellenőrizze a páratartalmot az **AMS-status** alatt.

:::tip Filament szárító
Fektessen egy filament szárítóban (pl. Bambu Filament Dryer), ha nylonaval vagy TPU-val dolgozik — ezek 12 óra alatt felszívnak nedvességet.
:::

---

### Spagetti (a nyomtatás egy klumphoz omlik össze)

**Tünetek:** A filament lógó szálakban lógó, a nyomtatás nem ismerkedik fel

**Okok és megoldások:**

| Ok | Megoldás |
|-------|---------|
| Rossz tapadás korai → elváló → összeesés | Lásd a tapadás részt fent |
| Túl gyors sebesség | Csökkentse a sebességet 20–30%-kal |
| Hibás támasz konfiguráció | Aktiválja a támasztást a Bambu Studio-ban |
| Az túlnyúlás túl meredek | Ossza fel a modellt, vagy fordítsa 45°-kal |

**Használja a Print Guard-ot a spagetti automatikus leállításához** — lásd a következő részt.

---

### Alulextrudálás (vékony, gyenge rétegek)

**Tünetek:** A rétegek nem szilárdak, lyukak a falakban, gyenge modell

**Okok és megoldások:**

| Ok | Megoldás |
|-------|---------|
| Fúvóka részben eldugult | Futtassa a Cold Pull-t (lásd karbantartás) |
| Túl nedves filament | Szárítsa meg a filamentet |
| Túl alacsony hőmérséklet | Emelje meg a fúvóka hőmérsékletét 5–10°C-kal |
| Túl gyors sebesség | Csökkentse 20–30%-kal |
| PTFE-cső sérült | Vizsgáljon meg és cseréljen PTFE-csövet |

## A Print Guard használata automatikus védelemhez

A Print Guard figyelemmel követi a kamerákat a képfelismerés segítségével, és automatikusan leállítja a nyomtatást, ha spagettit észlel.

**Print Guard aktiválása:**
1. Lépjen a **Monitorozás → Print Guard** menübe
2. Engedélyezze az **Automatikus felismerés**
3. Válassza a műveletet: **Szünetel** (ajánlott) vagy **Záró**
4. Állítsa az érzékenységet (kezdje az **Közepes**-vel)

**Amikor a Print Guard avatkozik be:**
1. Értesítést kap az opplöség alapján való kamerakép
2. A nyomtatás szünetel
3. Választhat: **Folytatás** (ha hamis pozitív) vagy **Nyomtatás lemondása**

:::info Hamis pozitívok
A Print Guard néha sok vékony oszlopból álló modelleken reagálhat. Csökkentse az érzékenységet, vagy ideiglenesen tiltsa le az összetett modellekhez.
:::

## Diagnosztikai eszközök az irányítópulton

### Hőmérséklet napló
Az **Előzmények → [Nyomtatás] → Hőmérsékletek** alatt megtekintheti a hőmérsékleti görbét az egész nyomtatáson keresztül. Keresse:
- Hirtelen hőmérséklet csökkenést (fúvóka vagy lemez probléma)
- Egyenetlen hőmérsékletek (kalibrálásra van szükség)

### Filament statisztika
Ellenőrizze, hogy a felhasznált filament megegyezik-e a becsléssel. A nagy eltérés alul extrudálást vagy filament szünetet jelezhet.

## Mikor kapcsolódjon be a támogatáshoz?

Vegye fel a kapcsolatot a Bambu Labs támogatásával, ha:
- A HMS-kód ismétlődik az összes megoldási javaslat követése után
- A nyomtatón mechanikai sérüléseket lát (hajlított rudak, sérült fogaskerekek)
- A hőmérséklet értékei lehetetlenek (pl. fúvóka -40°C-ot olvas)
- A firmware frissítés nem oldja meg a problémát

**Hasznos a támogatáshoz:**
- HMS-hibakódok az irányítópult hibanapljából
- Kamerakép a hibáról
- Mely filament és beállítások lettek felhasználva (az előzményekből exportálhatók)
- Nyomtató modell és firmware verzió (megjelenik az **Beállítások → Nyomtató → Info** alatt)
