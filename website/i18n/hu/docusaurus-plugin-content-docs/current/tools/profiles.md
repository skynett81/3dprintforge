---
sidebar_position: 3
title: Nyomtatási profilok
description: Nyomtatási profilok létrehozása, szerkesztése és kezelése előre beállított beállításokkal a gyors és konzisztens nyomtatáshoz
---

# Nyomtatási profilok

A nyomtatási profilok mentett nyomtatási beállítások, amelyeket újra felhasználhatsz különböző nyomtatásoknál és nyomtatóknál. Spórolj időt és biztosíts következetes minőséget profilok definiálásával különböző célokhoz.

Menj ide: **https://localhost:3443/#profiles**

## Profil létrehozása

1. Menj a **Eszközök → Nyomtatási profilok** menüpontra
2. Kattints az **Új profil** gombra (+ ikon)
3. Töltsd ki:
   - **Profilnév** — leíró név, pl. „PLA - Gyors gyártás"
   - **Anyag** — válassz a listából (PLA / PETG / ABS / PA / PC / TPU stb.)
   - **Nyomtatómodell** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Összes
   - **Leírás** — opcionális szöveg

4. Töltsd ki a beállításokat (lásd az alábbi szakaszokat)
5. Kattints a **Profil mentése** gombra

## Profil beállításai

### Hőmérséklet
| Mező | Példa |
|---|---|
| Fúvóka hőmérséklete | 220 °C |
| Ágy hőmérséklete | 60 °C |
| Kamra hőmérséklete (X1C) | 35 °C |

### Sebesség
| Mező | Példa |
|---|---|
| Sebességbeállítás | Normál |
| Maximális sebesség (mm/s) | 200 |
| Gyorsulás | 5000 mm/s² |

### Minőség
| Mező | Példa |
|---|---|
| Rétegvastagság | 0,2 mm |
| Kitöltési százalék | 15 % |
| Kitöltési minta | Rács |
| Tartóanyag | Automatikus |

### AMS és színek
| Mező | Leírás |
|---|---|
| Tisztítási volumen | Öblítés mennyisége színváltásnál |
| Preferált helyek | Melyik AMS-helyek részesítendők előnyben |

### Speciális
| Mező | Leírás |
|---|---|
| Szárítási mód | AMS-szárítás engedélyezése nedves anyagokhoz |
| Hűlési idő | Szünet rétegek között a hűléshez |
| Ventilátor sebessége | Hűtőventilátor sebessége százalékban |

## Profil szerkesztése

1. Kattints a profilra a listában
2. Kattints a **Szerkesztés** gombra (ceruza ikon)
3. Végezd el a módosításokat
4. Kattints a **Mentés** gombra (felülírás) vagy a **Mentés újként** gombra (másolat létrehozása)

:::tip Verziókövetlen
Használd a „Mentés újként" lehetőséget, hogy megőrizz egy működő profilt, miközben kísérletezgetsz a módosításokkal.
:::

## Profil használata

### A fájlkönyvtárból

1. Válassz fájlt a könyvtárban
2. Kattints a **Küldés nyomtatóra** gombra
3. Válaszd ki a **Profilt** a legördülő listából
4. A profil beállításai kerülnek alkalmazásra

### A nyomtatási sorból

1. Hozz létre egy új sorfeladatot
2. Válaszd ki a **Profilt** a beállítások alatt
3. A profil a sorfeladathoz kapcsolódik

## Profilok importálása és exportálása

### Exportálás
1. Válassz ki egy vagy több profilt
2. Kattints az **Exportálás** gombra
3. Válassz formátumot: **JSON** (más dashboardokba importáláshoz) vagy **PDF** (nyomtatáshoz/dokumentációhoz)

### Importálás
1. Kattints a **Profilok importálása** gombra
2. Válassz ki egy másik 3DPrintForgeból exportált `.json`-fájlt
3. Az azonos nevű meglévő profilok felülírhatók, vagy mindkettő megtartható

## Profilok megosztása

Oszd meg profilokat másokkal a közösségi filamentmodulon keresztül (lásd: [Közösségi filamentek](../integrations/community)) vagy közvetlen JSON-exporton keresztül.

## Alapértelmezett profil

Állíts be alapértelmezett profilt anyagonként:

1. Válaszd ki a profilt
2. Kattints a **Beállítás alapértelmezettként [anyaghoz]** gombra
3. Az alapértelmezett profil automatikusan kiválasztódik, amikor az adott anyaggal küldesz fájlt
