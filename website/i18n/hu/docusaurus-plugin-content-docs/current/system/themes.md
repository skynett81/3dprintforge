---
sidebar_position: 4
title: Téma
description: Szabd személyre a 3DPrintForge megjelenését világos/sötét/automatikus móddal, 6 színpalettával és egyedi kiemelőszínnel
---

# Téma

A 3DPrintForge rugalmas témarendszerrel rendelkezik, amely lehetővé teszi a megjelenés ízlés és felhasználási eset szerint való személyre szabását.

Navigálj ide: **https://localhost:3443/#settings** → **Téma**

## Színmód

Válassz három mód között:

| Mód | Leírás |
|---|---|
| **Világos** | Világos háttér, sötét szöveg — jól megvilágított helyiségekbe |
| **Sötét** | Sötét háttér, világos szöveg — alapértelmezett és monitorozáshoz ajánlott |
| **Automatikus** | Követi az operációs rendszer beállítását (OS sötét/világos) |

Módosítsd a módot a témabeállítások tetején, vagy a navigációs sávban lévő gyorsbillentyűvel (hold/nap ikon).

## Színpaletta

Hat előre beállított színpaletta érhető el:

| Paletta | Elsődleges szín | Stílus |
|---|---|---|
| **Bambu** | Zöld (#00C853) | Alapértelmezett, Bambu Lab ihlette |
| **Kék éjszaka** | Kék (#2196F3) | Nyugodt és professzionális |
| **Naplemente** | Narancssárga (#FF6D00) | Meleg és energikus |
| **Lila** | Lila (#9C27B0) | Kreatív és különleges |
| **Piros** | Piros (#F44336) | Nagy kontraszt, feltűnő |
| **Monokróm** | Szürke (#607D8B) | Semleges és minimalista |

Kattints egy palettára az azonnali előnézethez és aktiváláshoz.

## Egyedi kiemelőszín

Használd teljesen saját színedet kiemelőszínként:

1. Kattints az **Egyedi szín** gombra a palettaválasztó alatt
2. Használd a színválasztót, vagy írj be egy hex kódot (pl. `#FF5722`)
3. Az előnézet valós időben frissül
4. Kattints az **Alkalmaz** gombra az aktiváláshoz

:::tip Kontraszt
Győződj meg róla, hogy a kiemelőszín megfelelő kontrasztban van a háttérrel. A rendszer figyelmeztet, ha a szín olvashatósági problémákat okozhat (WCAG AA-szabvány).
:::

## Lekerekítés

Állítsd be a gombok, kártyák és elemek lekerekítését:

| Beállítás | Leírás |
|---|---|
| **Éles** | Nincs lekerekítés (szögletes stílus) |
| **Kis** | Finom lekerekítés (4 px) |
| **Közepes** | Alapértelmezett lekerekítés (8 px) |
| **Nagy** | Markáns lekerekítés (16 px) |
| **Pill** | Maximális lekerekítés (50 px) |

Húzd a csúszkát a 0–50 px közötti manuális beállításhoz.

## Kompaktság

Szabd személyre a felület sűrűségét:

| Beállítás | Leírás |
|---|---|
| **Tágas** | Több tér az elemek között |
| **Alapértelmezett** | Kiegyensúlyozott, alapértelmezett beállítás |
| **Kompakt** | Sűrűbb elrendezés — több információ a képernyőn |

A kompakt mód 1080p alatti képernyőkhöz vagy kioszk nézethez ajánlott.

## Tipográfia

Válassz betűtípust:

- **Rendszer** — az operációs rendszer alapértelmezett betűtípusát használja (gyors betöltés)
- **Inter** — tiszta és modern (alapértelmezett választás)
- **JetBrains Mono** — monospace, jó adatértékekhez
- **Nunito** — lágyabb és kerekebb stílus

## Animációk

Kapcsold ki vagy szabd személyre az animációkat:

- **Teljes** — minden átmenet és animáció aktív (alapértelmezett)
- **Csökkentett** — csak szükséges animációk (figyelembe veszi az OS-preferenciát)
- **Ki** — nincs animáció a maximális teljesítményhez

:::tip Kioszk mód
Kioszk nézethez aktiváld a **Kompakt** + **Sötét** + **Csökkentett animációk** kombinációt az optimális teljesítmény és távolból való olvashatóság érdekében. Lásd [Kioszk mód](./kiosk).
:::

## Témabeállítások exportálása és importálása

Oszd meg a témádat másokkal:

1. Kattints a **Téma exportálása** gombra — letölt egy `.json` fájlt
2. Oszd meg a fájlt más 3DPrintForge-felhasználókkal
3. Importálják a **Téma importálása** → fájl kiválasztása lehetőséggel
