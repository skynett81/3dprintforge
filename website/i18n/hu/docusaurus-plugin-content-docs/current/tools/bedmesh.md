---
sidebar_position: 6
title: Bed Mesh
description: Az építőlemez síkosságkalibrálásának 3D-vizualizációja hőtérképpel, UI-ból indítható szkenneléssel és kalibrálási útmutatóval
---

# Bed Mesh

A bed mesh eszköz vizuális reprezentációt nyújt az építőlemez síkosságáról — alapvető fontosságú a jó tapadáshoz és az egyenletes első réteghez.

Menj ide: **https://localhost:3443/#bedmesh**

## Mi az a bed mesh?

A Bambu Lab nyomtatók egy szondával letapogatják az építőlemez felületét, és egy térképet (mesh) készítenek a magasságeltérésekről. A nyomtató firmware-je nyomtatás közben automatikusan kompenzálja az eltéréseket. A 3DPrintForge ezt a térképet vizualizálja számodra.

## Vizualizáció

### 3D-felület

A bed mesh-térkép interaktív 3D-felületként jelenik meg:

- Az egérrel forgasd a nézetet
- Görgess a nagyításhoz/kicsinyítéshez
- Kattints a **Felülnézet** gombra madárperspektívához
- Kattints az **Oldalnézet** gombra a profil megtekintéséhez

A színskála az átlagos magasságtól való eltérést mutatja:
- **Kék** — alacsonyabb a középpontnál (homorú)
- **Zöld** — közel sík (< 0,1 mm eltérés)
- **Sárga** — mérsékelt eltérés (0,1–0,2 mm)
- **Piros** — nagy eltérés (> 0,2 mm)

### Hőtérkép

Kattints a **Hőtérkép** gombra a mesh-térkép lapos 2D-nézetéhez — a legtöbb felhasználó számára könnyebb olvasni.

A hőtérkép mutatja:
- Pontos eltérésértékeket (mm) minden mérési ponthoz
- Megjelölt problémás pontokat (eltérés > 0,3 mm)
- A mérési rács méreteit (sorok × oszlopok száma)

## Bed mesh szkennelése UI-ból

:::warning Követelmények
A szkennelés megköveteli, hogy a nyomtató tétlen legyen, és az ágy hőmérséklete stabilizálódjon. Melegítsd fel az ágyat a kívánt hőmérsékletre a szkennelés ELŐTT.
:::

1. Menj a **Bed Mesh** menüpontra
2. Válaszd ki a nyomtatót a legördülő listából
3. Kattints a **Szkennelés most** gombra
4. Válaszd ki az ágy hőmérsékletét a szkenneléshez:
   - **Hideg** (szobahőmérséklet) — gyors, de kevésbé pontos
   - **Meleg** (50–60 °C PLA, 70–90 °C PETG) — ajánlott
5. Erősítsd meg a párbeszédablakban — a nyomtató automatikusan elindítja a szondakövetési szekvenciát
6. Várd meg a szkennelés befejezését (3–8 perc, a mesh-mérettől függően)
7. Az új mesh-térkép automatikusan megjelenik

## Kalibrálási útmutató

Szkennelés után a rendszer konkrét javaslatokat ad:

| Megállapítás | Javaslat |
|---|---|
| Eltérés < 0,1 mm mindenhol | Kiváló — nincs szükség intézkedésre |
| Eltérés 0,1–0,2 mm | Jó — a kompenzációt a firmware kezeli |
| Eltérés > 0,2 mm a sarkoknál | Állítsd be manuálisan az ágyrugókat (ha lehetséges) |
| Eltérés > 0,3 mm | Az ágy sérülhet vagy hibásan lehet felszerelve |
| Középpont magasabb, mint a sarkok | Hőtágulás — meleg ágyaknál normális |

:::tip Korábbi összehasonlítás
Kattints az **Összehasonlítás az előzővel** gombra, hogy lásd, változott-e a mesh-térkép idővel — hasznos annak észlelésére, hogy a lemez fokozatosan meghajlik-e.
:::

## Mesh-előzmények

Minden mesh-szkennelés időbélyeggel tárolódik:

1. Kattints az **Előzmények** gombra a bed mesh oldalpanelén
2. Válassz két szkennelést az összehasonlításhoz (különbségtérkép jelenik meg)
3. Töröld a már nem szükséges régi szkenneléseket

## Exportálás

Exportáld a mesh-adatokat:
- **PNG** — hőtérkép kép (dokumentációhoz)
- **CSV** — nyers adatok X, Y és magasságeltéréssel pontonként
