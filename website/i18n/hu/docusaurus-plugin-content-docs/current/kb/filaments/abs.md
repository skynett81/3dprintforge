---
sidebar_position: 3
title: ABS
description: Útmutató ABS nyomtatáshoz — hőmérséklet, zárt kamra, warping és ragasztóstift
---

# ABS

Az ABS (Akrilnitril-butadién-sztirol) jó hőállóságú és ütésállóságú termoplaszt. Zárt kamrát igényel és igényesebb a PLA/PETG-nél, de tartós funkcionális alkatrészeket eredményez.

## Beállítások

| Paraméter | Érték |
|-----------|-------|
| Fúvóka hőmérséklete | 240–260 °C |
| Ágy hőmérséklete | 90–110 °C |
| Kamra hőmérséklete | 45–55 °C (X1C/P1S) |
| Részleges hűtés | 0–20% |
| Aux ventilátor | 0% |
| Sebesség | 80–100% |
| Szárítás | Ajánlott (4–6 óra 70 °C-on) |

## Ajánlott építőlemezek

| Lemez | Alkalmasság | Ragasztóstift? |
|-------|------------|----------------|
| Engineering Plate (Textúrált PEI) | Kiváló | Igen (ajánlott) |
| High Temp Plate | Kiváló | Igen |
| Cool Plate (Sima PEI) | Kerülendő | — |
| Textured PEI | Jó | Igen |

:::tip Ragasztóstift ABS-hez
Mindig használj ragasztóstiftet Engineering Plate-en ABS esetén. Javítja a tapadást, és könnyebbé teszi a nyomat eltávolítását a lemez károsítása nélkül.
:::

## Zárt kamra

Az ABS **megköveteli** a zárt kamrát a warping megelőzéséhez:

- **X1C és P1S:** Beépített kamra aktív hőszabályozással — ideális ABS-hez
- **P1P:** Részben nyitott — adj hozzá tetőfedelet (fedél a tetejére) a jobb eredményekért
- **A1 / A1 Mini:** Nyitott CoreXY — **nem ajánlott** ABS-hez saját burkolat nélkül

Tartsd zárva a kamrát a nyomtatás teljes ideje alatt. Ne nyisd ki az ellenőrzéshez — ha megvárod a lehűlést, a leválásnál is elkerülöd a warpingot.

## Warping

Az ABS rendkívül érzékeny a warpingra (a sarkok felemelkednek):

- **Növeld az ágy hőmérsékletét** — próbálj 105–110 °C-ot
- **Használj brimet** — 5–10 mm-es brim a Bambu Studioban
- **Kerüld a huzatot** — zárd el az összes légáramlást a nyomtató körül
- **Csökkentsd a részleges hűtést 0%-ra** — a hűtés csavarodást okoz

:::warning Gőzök
Az ABS sztiréngőzt bocsát ki nyomtatás közben. Gondoskodj megfelelő szellőztetésről a helyiségben, vagy használj HEPA/aktív szén szűrőt. A Bambu P1S beépített szűrővel rendelkezik.
:::

## Utókezelés

Az ABS könnyebben csiszolható, festékelhető és ragasztható, mint a PETG és a PLA. Acetonnal is simítható a sima felületért — de rendkívül óvatos légy az acetonnal való érintkezésnél.

## Tárolás

Szárítsd **70 °C-on 4–6 órán át** nyomtatás előtt. Tárold lezárt dobozban — az ABS nedvességet szív, ami pukkanó hangokat és gyenge rétegeket okoz.
