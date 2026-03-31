---
sidebar_position: 5
title: Kopásbecslés
description: 8 nyomtatókomponens prediktív elemzése élettartam-számítással, karbantartási riasztásokkal és költség-előrejelzéssel
---

# Kopásbecslés

A kopásbecslés a kritikus komponensek várható élettartamát számítja ki a tényleges használat, filamenttípus és nyomtatóviselkedés alapján — hogy proaktívan tervezhess karbantartást reaktív helyett.

Navigálj ide: **https://localhost:3443/#wear**

## Figyelt komponensek

A 3DPrintForge nyomtatónként 8 komponens kopását követi:

| Komponens | Elsődleges kopási tényező | Tipikus élettartam |
|---|---|---|
| **Fúvóka (réz)** | Filamenttípus + óra | 300–800 óra |
| **Fúvóka (edzett)** | Óra + abrazív anyag | 1500–3000 óra |
| **PTFE cső** | Óra + magas hőmérséklet | 500–1500 óra |
| **Extruder fogaskerék** | Óra + abrazív anyag | 1000–2000 óra |
| **X tengely rúd (CNC)** | Nyomtatások száma + sebesség | 2000–5000 óra |
| **Nyomtatóágy felület** | Nyomtatások száma + hőmérséklet | 200–500 nyomtatás |
| **AMS fogaskerék** | Filamentcserék száma | 5000–15000 csere |
| **Kamraventilátok** | Üzemelési óra | 3000–8000 óra |

## Kopásszámítás

A kopás összesített százalékként kerül kiszámításra (0–100% elhasználódás):

```
Kopás % = (tényleges használat / várható élettartam) × 100
         × anyagszorzó
         × sebességszorzó
```

**Anyagszorzók:**
- PLA, PETG: 1,0× (normál kopás)
- ABS, ASA: 1,1× (kissé agresszívabb)
- PA, PC: 1,2× (kemény a PTFE csőre és fúvókára)
- CF/GF kompozitek: 2,0–3,0× (nagyon abrazív)

:::warning Karbonszál
A karbonszállal megerősített filamentek (CF-PLA, CF-PA stb.) rendkívül gyorsan koptatják a réz fúvókákat. Használj edzett acél fúvókát, és számíts 2–3× gyorsabb kopásra.
:::

## Élettartam-számítás

Minden komponenshez a következők jelennek meg:

- **Jelenlegi kopás** — felhasznált százalék
- **Becsült fennmaradó élettartam** — óra vagy nyomtatás
- **Becsült lejárati dátum** — az utolsó 30 nap átlagos használata alapján
- **Megbízhatósági intervallum** — a becslés bizonytalansági határa

Kattints egy komponensre a kopásfelhalmozódás időbeli részletes grafikonjának megtekintéséhez.

## Riasztások

Automatikus riasztások konfigurálása komponensenként:

1. Navigálj a **Kopás → Beállítások** menüpontra
2. Minden komponenshez állítsd be a **Riasztási küszöböt** (ajánlott: 75% és 90%)
3. Válassz értesítési csatornát (lásd [Értesítések](../features/notifications))

**Példa riasztási üzenet:**
> ⚠️ Fúvóka (réz) a Saját X1C-men 78%-ban elhasználódott. Becsült élettartam: ~45 óra. Ajánlott: Tervezze be a fúvókacserét.

## Karbantartási költség

A kopási modul integrálódik a költségnaplóval:

- **Komponensenkénti költség** — alkatrész ára
- **Teljes csereköltség** — a határt közelítő összes komponens összege
- **Előrejelzés a következő 6 hónapra** — becsült karbantartási költség

Alkatrészárak megadása a **Kopás → Árak** menüponton:

1. Kattints az **Árak beállítása** gombra
2. Add meg az egységárat minden komponenshez
3. Az ár a költség-előrejelzésekben kerül felhasználásra, és nyomtatómodellenként változhat

## Kopásszámláló visszaállítása

Karbantartás után állítsd vissza az adott komponens számláját:

1. Navigálj a **Kopás → [Komponens neve]** menüpontra
2. Kattints a **Megjelölés kicseréltként** gombra
3. Töltsd ki:
   - A csere dátuma
   - Költség (opcionális)
   - Megjegyzés (opcionális)
4. A kopásszámláló visszaáll és újraszámítódik

A visszaállítások megjelennek a karbantartási előzményekben.

:::tip Kalibráció
Hasonlítsd össze a kopásbecslést a tényleges tapasztalati adatokkal, és módosítsd az élettartam paramétereit a **Kopás → Élettartam konfigurálása** menüponton, hogy a számításokat a tényleges használatodhoz igazítsd.
:::
