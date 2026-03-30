---
sidebar_position: 7
title: PC
description: PC (polikarbonát) nyomtatási útmutató Bambu Lab-hoz — magas szilárdság, hőállóság és követelmények
---

# PC (Polikarbonát)

A polikarbonát az egyik legerősebb hőre lágyuló műanyag, amely elérhető FDM nyomtatáshoz. Rendkívül magas ütésállóságot, 110–130 °C-ig terjedő hőállóságot és természetes átlátszóságot egyesít. A PC igényes anyag a nyomtatáshoz, de az eredmények megközelítik a fröccsöntött alkatrészek minőségét.

## Beállítások

| Paraméter | Tiszta PC | PC-ABS keverék | PC-CF |
|-----------|--------|-------------|-------|
| Fúvóka hőmérséklet | 260–280 °C | 250–270 °C | 270–290 °C |
| Tálca hőmérséklet | 100–120 °C | 90–110 °C | 100–120 °C |
| Kamra hőmérséklet | 50–60 °C (kötelező) | 45–55 °C | 50–60 °C |
| Alkatrész hűtés | 0–20% | 20–30% | 0–20% |
| Sebesség | 60–80% | 70–90% | 50–70% |
| Szárítás szükséges | Igen (kritikus) | Igen | Igen (kritikus) |

## Ajánlott építőlapok

| Lap | Alkalmasság | Ragasztó? |
|-------|---------|----------|
| High Temp Plate | Kiváló (kötelező) | Nem |
| Engineering Plate | Elfogadható | Igen |
| Textured PEI | Nem ajánlott | — |
| Cool Plate (Smooth PEI) | Ne használja | — |

:::danger High Temp Plate kötelező
A PC 100–120 °C tálcahőmérsékletet igényel. A Cool Plate és Textured PEI nem bírja ezeket a hőmérsékleteket és megsérül. Tiszta PC-hez **mindig** használjon High Temp Plate-et.
:::

## Nyomtató és felszerelés követelmények

### Zárt kamra (kötelező)

A PC **teljesen zárt kamrát** igényel, stabil 50–60 °C hőmérséklettel. Enélkül súlyos vetemedés, rétegszétválás és delamináció lép fel.

### Edzett fúvóka (erősen ajánlott)

A tiszta PC nem koptatja a fúvókát, de PC-CF és PC-GF **edzett acél fúvókát** igényel (pl. Bambu Lab HS01). Tiszta PC-hez is ajánlott az edzett fúvóka a magas hőmérsékletek miatt.

### Nyomtató kompatibilitás

| Nyomtató | Alkalmas PC-hez? | Megjegyzés |
|---------|--------------|---------|
| X1C | Kiváló | Teljesen zárt, HS01 elérhető |
| X1E | Kiváló | Műszaki anyagokhoz tervezve |
| P1S | Korlátozott | Zárt, de nincs aktív kamrafűtés |
| P1P | Nem ajánlott | Nincs burkolat |
| A1 / A1 Mini | Ne használja | Nyitott váz, alacsony hőmérsékletek |

:::warning Csak X1C és X1E ajánlott
A PC aktív kamrafűtést igényel a konzisztens eredményekhez. P1S elfogadható eredményeket adhat kis alkatrészekkel, de nagyobb alkatrészeknél vetemedés és rétegszétválás várható.
:::

## Szárítás

A PC **nagyon higroszkópos** és gyorsan elnyeli a nedvességet. A nedves PC katasztrofális nyomtatási eredményeket ad.

| Paraméter | Érték |
|-----------|-------|
| Szárítási hőmérséklet | 70–80 °C |
| Szárítási idő | 6–8 óra |
| Higroszkópikus szint | Magas |
| Max. ajánlott páratartalom | < 0.02% |

- PC-t nyomtatás előtt **mindig** szárítsa — még az újonnan kinyitott tekercsek is felszívhattak nedvességet
- Ha lehetséges, közvetlenül a szárítódobozból nyomtasson
- Az AMS **nem elegendő** PC tároláshoz — a páratartalom túl magas
- Használjon aktív fűtésű dedikált filamentszárítót

:::danger A nedvesség tönkreteszi a PC nyomatokat
A nedves PC jelei: erős pattogó hangok, buborékok a felületen, nagyon gyenge rétegtapadás, szálhúzás. A nedves PC nem kompenzálható beállításokkal — **előbb** szárítani kell.
:::

## Tulajdonságok

| Tulajdonság | Érték |
|----------|-------|
| Szakítószilárdság | 55–75 MPa |
| Ütésállóság | Rendkívül magas |
| Hőállóság (HDT) | 110–130 °C |
| Átlátszóság | Igen (natúr/átlátszó változat) |
| Kémiai ellenállás | Közepes |
| UV-ellenállás | Közepes (idővel sárgul) |
| Zsugorodás | ~0.5–0.7% |

## PC keverékek

### PC-ABS

A polikarbonát és ABS keveréke, amely mindkét anyag szilárdságát kombinálja:

- **Könnyebb nyomtatni**, mint tiszta PC — alacsonyabb hőmérsékletek és kevesebb vetemedés
- **Ütésállóság** az ABS és PC között
- **Népszerű az iparban** — autóipari belső terekben és elektronikai házakban használják
- 250–270 °C fúvóka, 90–110 °C tálca hőmérsékleten nyomtat

### PC-CF (szénszál)

Szénszállal erősített PC maximális merevséghez és szilárdsághoz:

- **Rendkívül merev** — szerkezeti alkatrészekhez ideális
- **Könnyű** — a szénszál csökkenti a tömeget
- **Edzett fúvóka szükséges** — a sárgaréz órák alatt elkopik
- 270–290 °C fúvóka, 100–120 °C tálca hőmérsékleten nyomtat
- Drágább, mint a tiszta PC, de az alumíniumhoz közeli mechanikai tulajdonságok

### PC-GF (üvegszál)

Üvegszállal erősített PC:

- **Olcsóbb, mint PC-CF**, jó merevséggel
- PC-CF-nél **fehérebb felület**
- **Edzett fúvóka szükséges** — az üvegszálak nagyon koptató hatásúak
- Valamivel kisebb merevség, mint PC-CF, de jobb ütésállóság

## Felhasználási területek

A PC-t ott használják, ahol **maximális szilárdság és/vagy hőállóság** szükséges:

- **Mechanikai alkatrészek** — fogaskerekek, rögzítők, terhelés alatti csatlakozók
- **Optikai alkatrészek** — lencsék, fényvezetők, átlátszó burkolatok (átlátszó PC)
- **Hőálló alkatrészek** — motortér, fűtőelemek közelében
- **Elektronikai házak** — jó ütésállóságú védőburkolat
- **Szerszámok és sablonok** — precíziós szerelőszerszámok

## Tippek a sikeres PC nyomtatáshoz

### Első réteg

- Csökkentse a sebességet **30–40%-ra** az első rétegnél
- Az első 3–5 rétegnél emelje a tálca hőmérsékletét 5 °C-kal a standard fölé
- **Brim kötelező** a legtöbb PC alkatrészhez — használjon 8–10 mm-t

### Kamra hőmérséklet

- Várja meg, amíg a kamra eléri az **50 °C+-t** a nyomtatás megkezdése előtt
- **Ne nyissa ki a kamraajtót** nyomtatás közben — a hőmérsékletesés azonnali vetemedést okoz
- Nyomtatás után: hagyja az alkatrészt **lassan** lehűlni a kamrában (1–2 óra)

### Hűtés

- Használjon **minimális alkatrészhűtést** (0–20%) a legjobb rétegtapadásért
- Hidaknál és túlnyúlásoknál: ideiglenesen növelje 30–40%-ra
- PC-nél az esztétika helyett a rétegerősséget részesítse előnyben

### Tervezési szempontok

- **Kerülje az éles sarkokat** — kerekítse minimum 1 mm sugárral
- **Egyenletes falvastagság** — az egyenetlen vastagság belső feszültségeket okoz
- **Nagy, lapos felületek** nehezek — ossza fel vagy adjon hozzá bordákat

:::tip Először próbálja a PC-t? Kezdjen PC-ABS-sel
Ha még soha nem nyomtatott PC-t, kezdjen PC-ABS keverékkel. Sokkal elnézőbb, mint a tiszta PC, és lehetővé teszi, hogy tapasztalatot szerezzen az anyaggal az extrém követelmények nélkül. Amikor elsajátította a PC-ABS-t, lépjen tovább a tiszta PC-re.
:::

---

## Utólagos feldolgozás

- **Csiszolás** — a PC jól csiszolható, de átlátszó PC-hez használjon nedves csiszolást
- **Polírozás** — az átlátszó PC szinte optikai minőségűre polírozható
- **Ragasztás** — diklórmetán ragasztás láthatatlan illesztéseket hoz létre (használjon védőfelszerelést!)
- **Festés** — alapozó szükséges a jó tapadáshoz
- **Hőkezelés** — 120 °C 1–2 órán át csökkenti a belső feszültségeket

:::warning Diklórmetán ragasztás
A diklórmetán mérgező, elszívást, vegyszerálló kesztyűt és védőszemüveget igényel. Mindig jól szellőztetett helyiségben vagy elszívó fülkében dolgozzon.
:::
