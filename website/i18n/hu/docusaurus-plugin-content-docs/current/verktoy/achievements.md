---
sidebar_position: 5
title: Eredmények
description: Gamification-rendszer nyitható eredményekkel, ritkaságfokozatokkal és mérföldkövekkel a Bambu Lab 3D nyomtatáshoz
---

# Eredmények

Az eredmények (achievements) egy gamification-elem, amely jutalmazza a mérföldköveket és izgalmas pillanatokat a nyomtatási utazásod során. Gyűjtsd az eredményeket, és kövesd a haladást a következő megnyitásig.

Navigálj ide: **https://localhost:3443/#achievements**

## Ritkaságfokozatok

Az eredmények négy ritkaságfokozatba vannak besorolva:

| Fokozat | Szín | Leírás |
|---|---|---|
| **Közönséges** | Szürke | Egyszerű mérföldkövek, könnyen elérhetők |
| **Szokatlan** | Zöld | Némi erőfeszítést vagy időt igényel |
| **Ritka** | Kék | Idővel való elhivatott erőfeszítést igényel |
| **Legendás** | Arany | Rendkívüli teljesítmények |

## Példa eredmények

### Nyomtatási mérföldkövek (Közönséges / Szokatlan)
| Eredmény | Követelmény |
|---|---|
| Első nyomtatás | Teljesítsd az első nyomtatásodat |
| Egy teljes nap | Összesen több mint 24 óra nyomtatás |
| Magas sikerességi arány | 10 egymást követő sikeres nyomtatás |
| Filamentgyűjtő | 10 különböző filamenttípus regisztrálása |
| Többszínű | Teljesíts egy többszínű nyomtatást |

### Mennyiségi eredmények (Szokatlan / Ritka)
| Eredmény | Követelmény |
|---|---|
| A kilogramm | 1 kg filament összesített felhasználása |
| 10 kg | 10 kg filament összesített felhasználása |
| 100 nyomtatás | 100 sikeres nyomtatás |
| 500 óra | 500 összesített nyomtatási óra |
| Az éjszakai műszak | Teljesíts egy 20 óránál hosszabb nyomtatást |

### Karbantartás és gondozás (Szokatlan / Ritka)
| Eredmény | Követelmény |
|---|---|
| Lelkiismeretes | Naplózz egy karbantartási feladatot |
| Nyomtatógondozó | 10 naplózott karbantartási feladat |
| Hulladékmentes | Készíts >90%-os anyaghatékonyságú nyomtatást |
| Fúvókamester | Cseréld ki a fúvókát 5-ször (dokumentálva) |

### Legendás eredmények
| Eredmény | Követelmény |
|---|---|
| Fáradhatatlan | 1000 sikeres nyomtatás |
| Filament-titán | 50 kg összesített filamentfelhasználás |
| Hibamentes hét | 7 nap egyetlen sikertelen nyomtatás nélkül |
| Nyomtatókönyvtáros | 100 különböző modell a fájlkönyvtárban |

## Eredmények megtekintése

Az eredmények oldal megjeleníti:

- **Megnyitva** — az elért eredmények (dátummal)
- **Közel** — a közel elért eredmények (előrehaladási sáv)
- **Zárolva** — az összes még el nem ért eredmény

Szűrj **Fokozat**, **Kategória** vagy **Állapot** szerint (megnyitva / folyamatban / zárolva).

## Előrehaladási sáv

A számlálással rendelkező eredményeknél egy előrehaladási sáv jelenik meg:

```
A kilogramm — 1 kg filament
[████████░░] 847 g / 1000 g (84,7 %)
```

## Értesítések

Automatikusan értesítést kapsz, amikor új eredményt érsz el:
- **Böngésző-felugró** az eredmény nevével és grafikával
- Opcionálisan: értesítés Telegramon / Discordon (konfigurálható a **Beállítások → Értesítések → Eredmények** menüponton)

## Többfelhasználós támogatás

Több felhasználót tartalmazó rendszerekben minden felhasználónak saját eredményprofil. Egy **toplista** (leaderboard) rangsorolást mutat a következők alapján:

- Megnyitott eredmények összesített száma
- Összesített nyomtatások száma
- Összesített nyomtatási órák

:::tip Privát mód
Kapcsold ki a toplistát a **Beállítások → Eredmények → Elrejtés a toplistáról** menüponton a profil privátban tartásához.
:::
