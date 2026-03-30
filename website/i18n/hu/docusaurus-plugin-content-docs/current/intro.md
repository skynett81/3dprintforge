---
sidebar_position: 1
title: Üdvözöljük a Bambu Dashboard-ban
description: Egy erőteljes, önállóan üzemeltetett dashboard Bambu Lab 3D nyomtatókhoz
---

# Üdvözöljük a Bambu Dashboard-ban

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

A **Bambu Dashboard** egy önállóan üzemeltetett, teljes funkcionalitású vezérlőpanel Bambu Lab 3D nyomtatókhoz. Teljes áttekintést és irányítást biztosít a nyomtatója, filament készlete, nyomtatási előzményei és egyebek felett — mindezt egyetlen böngészőlapból.

## Mi az a Bambu Dashboard?

A Bambu Dashboard közvetlenül csatlakozik a nyomtatójához MQTT-n keresztül LAN-on, a Bambu Lab szervereinek függősége nélkül. Csatlakozhat a Bambu Cloud-hoz is a modellek és a nyomtatási előzmények szinkronizálásához.

### Főbb funkciók

- **Élő dashboard** — valós idejű hőmérséklet, előrehaladás, kamera, AMS állapot LIVE jelzővel
- **Filament készlet** — az összes tekercs kezelése AMS szinkronizálással, EXT orsó támogatással, anyaginformációkkal, lemezkompatibilitással és szárítási útmutatóval
- **Filament követés** — pontos követés 4 szintű tartalékkal (AMS szenzor → EXT becslés → felhő → időtartam)
- **Anyagútmutató** — 15 anyag hőmérsékletekkel, lemezkompatibilitással, szárítással, tulajdonságokkal és tippekkel
- **Nyomtatási előzmények** — teljes napló modellnevekkel, MakerWorld hivatkozásokkal, filamentfelhasználással és költségekkel
- **Tervező** — naptár nézet, nyomtatási sor terheléselosztással és filamentellenőrzéssel
- **Nyomtató vezérlés** — hőmérséklet, sebesség, ventilátorok, G-kód konzol
- **Print Guard** — automatikus védelem xcam + 5 szenzormonitorral
- **Költségbecslő** — anyag, energia, munka, kopás, felár és eladási ár javaslat
- **Karbantartás** — KB-alapú intervallumokkal, fúvóka élettartammal, lemez élettartammal és útmutatóval ellátott követés
- **Hangriasztások** — 9 konfigurálható esemény egyéni hang feltöltéssel és nyomtató hangszóróval (M300)
- **Tevékenységnapló** — az összes esemény (nyomtatások, hibák, karbantartás, filament) állandó idővonala
- **Értesítések** — 7 csatorna (Telegram, Discord, e-mail, ntfy, Pushover, SMS, webhook)
- **Több nyomtató** — támogatja a teljes Bambu Lab sorozatot
- **17 nyelv** — norvég, angol, német, francia, spanyol, olasz, japán, koreai, holland, lengyel, portugál, svéd, török, ukrán, kínai, cseh, magyar
- **Önállóan üzemeltetett** — nincs felhő-függőség, az adatai a saját gépén

### Újdonságok a v1.1.14-ban

- **AdminLTE 4 integráció** — teljes HTML átstrukturálás treeview oldalsávval, modern elrendezéssel és CSP támogatással CDN-hez
- **CRM rendszer** — teljes ügyfélkezelés 4 panellel: ügyfelek, megrendelések, számlák és előzményintegrációval ellátott vállalati beállítások
- **Modern UI** — teal kiemelés, színátmenetes címek, lebegtetés fény, lebegő gömbök és továbbfejlesztett sötét téma
- **Eredmények: 18 nevezetesség** — viking hajó, Szabadság-szobor, Eiffel Tower, Big Ben, Brandenburgi kapu, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, holland szélmalom, Wawel-sárkány, Cristo Redentor, Turning Torso, Hagia Sophia, Az Anyaföld, Kínai Nagy Fal, Prágai csillagászati óra, Budapesti Parlament — részletes felugró ablakkal, XP-vel és ritkaságszinttel
- **AMS páratartalom/hőmérséklet** — 5 szintű értékelés tárolási és szárítási ajánlásokkal
- **Élő filament követés** — valós idejű frissítés nyomtatás közben cloud becslés tartalékon keresztül
- **Filament szekció újratervezés** — nagy orsók teljes információval (márka, súly, hőmérséklet, RFID, szín), vízszintes elrendezés és kattintás a részletekért
- **EXT orsó inline** — külső orsó az AMS orsók mellett megjelenítve jobb helykihasználással
- **Dashboard elrendezés optimalizálva** — 2 oszlopos alapértelmezés 24–27" monitorokhoz, nagy 3D/kamera, kompakt filament/AMS
- **Filamentcsere idő** a költségbecslőben látható csereszámlálóval
- **Globális riasztási rendszer** — riasztási sáv toast értesítésekkel a jobb alsó sarokban, nem blokkolja a navigációs sávot
- **Vezetett túra i18n** — mind a 14 túra kulcs lefordítva 17 nyelvre
- **5 új KB oldal** — kompatibilitási mátrix és új filament útmutatók lefordítva 17 nyelvre
- **Teljes i18n** — mind a 3252 kulcs lefordítva 17 nyelvre, beleértve a CRM-et és a nevezetesség-eredményeket

## Gyors kezdés

| Feladat | Hivatkozás |
|---------|-----------|
| Dashboard telepítése | [Telepítés](./getting-started/installation) |
| Első nyomtató konfigurálása | [Beállítás](./getting-started/setup) |
| Csatlakozás a Bambu Cloud-hoz | [Bambu Cloud](./getting-started/bambu-cloud) |
| Az összes funkció felfedezése | [Funkciók](./features/overview) |
| Filament útmutató | [Anyagútmutató](./kb/filaments/guide) |
| Karbantartási útmutató | [Karbantartás](./kb/maintenance/nozzle) |
| API dokumentáció | [API](./advanced/api) |

:::tip Demo mód
Kipróbálhatja a dashboardot fizikai nyomtató nélkül az `npm run demo` futtatásával. Ez 3 szimulált nyomtatót indít élő nyomtatási ciklusokkal.
:::

## Támogatott nyomtatók

Minden LAN módot támogató Bambu Lab nyomtató:

- **X1 sorozat**: X1C, X1C Combo, X1E
- **P1 sorozat**: P1S, P1S Combo, P1P
- **P2 sorozat**: P2S, P2S Combo
- **A sorozat**: A1, A1 Combo, A1 mini
- **H2 sorozat**: H2S, H2D (kettős fúvóka), H2C (szerszámváltó, 6 fej)

## Funkciók részletesen

### Filament követés

A dashboard automatikusan követi a filamentfelhasználást 4 szintű tartalékkal:

1. **AMS szenzor különbség** — a legpontosabb, összehasonlítja a kezdő/záró maradék%-ot
2. **EXT közvetlen** — vt_tray nélküli P2S/A1-hez, felhőbecslést használ
3. **Felhőbecslés** — a Bambu Cloud nyomtatási feladatok adataiból
4. **Időtartam-becslés** — ~30g/óra mint végső tartalék

Minden érték az AMS szenzor és a tekercsadatbázis minimumjaként jelenik meg, hogy elkerülje a hibákat sikertelen nyomtatások után.

### Anyagútmutató

Beépített adatbázis 15 anyaggal, beleértve:
- Hőmérsékletek (fúvóka, ágy, kamra)
- Lemezkompatibilitás (Cool, Engineering, High Temp, Textured PEI)
- Szárítási információk (hőmérséklet, idő, higroszkópikusság)
- 8 tulajdonság (szilárdság, rugalmasság, hőállóság, UV, felület, könnyű kezelhetőség)
- Nehézségi szint és különleges követelmények (edzett fúvóka, enclosure)

### Hangriasztások

9 konfigurálható esemény a következő támogatással:
- **Egyéni hangklipek** — MP3/OGG/WAV feltöltése (max. 10 másodperc, 500 KB)
- **Beépített hangok** — Web Audio API-val generált fémes/szintetikus hangok
- **Nyomtató hangszóró** — M300 G-kód dallamok közvetlenül a nyomtató csipogójára
- **Visszaszámlálás** — hangriasztás, amikor 1 perc van hátra a nyomtatásból

### Karbantartás

Teljes karbantartási rendszer:
- Komponenskövetés (fúvóka, PTFE cső, rudak, csapágyak, AMS, lemez, szárítás)
- KB-alapú intervallumok a dokumentációból
- Fúvóka élettartam típusonként (réz, edzett acél, HS01)
- Lemez élettartam típusonként (Cool, Engineering, High Temp, Textured PEI)
- Útmutató lap tippekkel és hivatkozásokkal a teljes dokumentációhoz

## Technikai áttekintés

A Bambu Dashboard Node.js 22-vel és vanilla HTML/CSS/JS-sel készült — nincsenek nehéz keretrendszerek, nincs build lépés. Az adatbázis SQLite, beépítve a Node.js 22-be.

- **Backend**: Node.js 22 mindössze 3 npm csomaggal (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, build lépés nélkül
- **Adatbázis**: SQLite a Node.js 22 beépített `--experimental-sqlite` révén
- **Dokumentáció**: Docusaurus 17 nyelvvel, telepítéskor automatikusan felépítve
- **API**: 177+ végpont, OpenAPI dokumentáció a `/api/docs` címen

Lásd az [Architektúra](./advanced/architecture) oldalt a részletekért.
