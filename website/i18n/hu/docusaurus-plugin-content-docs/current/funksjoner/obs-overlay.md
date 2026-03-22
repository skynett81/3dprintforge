---
sidebar_position: 4
title: OBS-overlay
description: Adj hozzá egy átlátszó állapot-overlayt a Bambu Lab nyomtatódhoz közvetlenül az OBS Studióban
---

# OBS-overlay

Az OBS-overlay lehetővé teszi a nyomtató valós idejű állapotának megjelenítését közvetlenül az OBS Studióban — tökéletes a 3D nyomtatás élő közvetítéséhez vagy felvételéhez.

## Overlay URL

Az overlay átlátszó hátterű weboldalként érhető el:

```
https://localhost:3443/obs-overlay?printer=NYOMTATO_ID
```

Cseréld le a `NYOMTATO_ID` részt a nyomtató azonosítójára (megtalálható a **Beállítások → Nyomtatók** menüpontban).

### Elérhető paraméterek

| Paraméter | Alapértelmezett | Leírás |
|---|---|---|
| `printer` | első nyomtató | Megjelenítendő nyomtató azonosítója |
| `theme` | `dark` | `dark`, `light` vagy `minimal` |
| `scale` | `1.0` | Méretezés (0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Átlátszóság (0.0–1.0) |
| `fields` | összes | Vesszővel elválasztott lista: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Hangsúlyszín (hex) |

**Példa paraméterekkel:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Beállítás az OBS Studióban

### 1. lépés: Böngészőforrás hozzáadása

1. Nyisd meg az OBS Studiót
2. Kattints a **+** gombra a **Források** alatt
3. Válaszd a **Böngésző** (Browser Source) lehetőséget
4. Adj nevet a forrásnak, pl. `Bambu Overlay`
5. Kattints az **OK** gombra

### 2. lépés: A böngészőforrás konfigurálása

Töltsd ki a következőket a beállítási párbeszédben:

| Mező | Érték |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=A_TE_AZONOSITOD` |
| Szélesség | `400` |
| Magasság | `200` |
| FPS | `30` |
| Egyedi CSS | *(hagyd üresen)* |

Jelöld be:
- ✅ **Forrás kikapcsolása, ha nem látható**
- ✅ **Böngésző frissítése jelenet aktiválásakor**

:::warning HTTPS és localhost
Az OBS figyelmeztethet az önaláírt tanúsítványra. Menj először a `https://localhost:3443` oldalra Chrome-ban/Firefoxban, és fogadd el a tanúsítványt. Az OBS ugyanazt az elfogadást fogja használni.
:::

### 3. lépés: Átlátszó háttér

Az overlay `background: transparent` beállítással készült. Hogy ez működjön az OBS-ben:

1. **Ne** jelöld be az **Egyedi háttérszín** opciót a böngészőforrásnál
2. Győződj meg róla, hogy az overlay nincs átlátszatlan elembe csomagolva
3. Lehetőleg állítsd a **Keverési módot** **Normálra** a forrásnál az OBS-ben

:::tip Alternatíva: Chroma key
Ha az átlátszóság nem működik, használj szűrőt → **Chroma Key** zöld háttérrel:
Add hozzá a `&bg=green` részt az URL-hez, és állítsd be a chroma key szűrőt a forráson az OBS-ben.
:::

## Mi látható az overlayn

Az alapértelmezett overlay tartalmaz:

- **Haladássáv** százalékos értékkel
- **Hátralévő idő** (becsült)
- **Fúvóka-hőmérséklet** és **ágyhőmérséklet**
- **Aktív AMS-nyílás** filamentszínnel és névvel
- **Nyomtatómodell** és név (kikapcsolható)

## Minimális mód streaminghez

Diszkrét overlay streaminghez:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Ez csak egy kis haladássávot jelenít meg a hátralévő idővel a sarokban.
