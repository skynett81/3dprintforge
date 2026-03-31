---
sidebar_position: 4
title: API-játszótér
description: Az összes 177 API-végpont tesztelése közvetlenül a böngészőben a beépített OpenAPI-dokumentációval és hitelesítéssel
---

# API-játszótér

Az API-játszótér lehetővé teszi a 3DPrintForge mind a 177 API-végpontjának felfedezését és tesztelését közvetlenül a böngészőben — kódírás nélkül.

Menj ide: **https://localhost:3443/api/docs**

## Mi az az API-játszótér?

A játszótér az OpenAPI-dokumentáció (Swagger UI) egy interaktív verziója, amely teljesen integrált a dashboarddal. Ha be vagy jelentkezve, máris hitelesített vagy, így közvetlenül tesztelheted a végpontokat.

## Navigáció a dokumentációban

A végpontok kategóriákba vannak rendezve:

| Kategória | Végpontok száma | Leírás |
|---|---|---|
| Nyomtatók | 24 | Állapot lekérése, irányítás, konfigurálás |
| Nyomtatások / Előzmények | 18 | Előzmények lekérése, keresése, exportálása |
| Filament | 22 | Raktár, tekercsek, profilok |
| Sor | 12 | Nyomtatási sor kezelése |
| Statisztikák | 15 | Aggregált statisztikák és export |
| Értesítések | 8 | Értesítési csatornák konfigurálása és tesztelése |
| Felhasználók | 10 | Felhasználók, szerepkörök, API-kulcsok |
| Beállítások | 14 | Konfiguráció olvasása és módosítása |
| Karbantartás | 12 | Karbantartási feladatok és napló |
| Integrációk | 18 | HA, Tibber, webhookok stb. |
| Fájlkönyvtár | 14 | Feltöltés, elemzés, kezelés |
| Rendszer | 10 | Biztonsági mentés, állapot, napló |

Kattints egy kategóriára az összes végpont kibontásához és megtekintéséhez.

## Végpont tesztelése

1. Kattints egy végpontra (pl. `GET /api/printers`)
2. Kattints a **Try it out** (kipróbálom) gombra
3. Töltsd ki az esetleges paramétereket (szűrő, lapozás, nyomtató-azonosító stb.)
4. Kattints az **Execute** gombra
5. Nézd meg az alatta lévő választ: HTTP-állapotkód, fejlécek és JSON-törzs

### Példa: Az összes nyomtató lekérése

```
GET /api/printers
```
Az összes regisztrált nyomtató listáját adja vissza valós idejű állapottal.

### Példa: Parancs küldése nyomtatóra

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Éles környezet
Az API-játszótér a tényleges rendszerhez van csatlakoztatva. A parancsok valódi nyomtatókra kerülnek elküldésre. Légy óvatos a destruktív műveletekkel, mint a `DELETE` és a `POST /command`.
:::

## Hitelesítés

### Munkamenet-hitelesítés (bejelentkezett felhasználó)
Ha be vagy jelentkezve a dashboardba, a játszótér már hitelesített a munkamenet-cookie segítségével. Nincs szükség extra konfigurációra.

### API-kulcs-hitelesítés

Külső hozzáféréshez:

1. Kattints az **Authorize** (lakat ikon a játszótér tetején) gombra
2. Add meg az API-kulcsodat az **ApiKeyAuth** mezőben: `Bearer A_TE_KULCSOD`
3. Kattints az **Authorize** gombra

Generálj API-kulcsokat a **Beállítások → API-kulcsok** menüpontban (lásd: [Hitelesítés](../system/auth)).

## Sebességkorlátozás

Az API sebességkorlátozása **200 kérés percenként** felhasználónként/kulcsonként. A játszótér a maradék kérések számát a `X-RateLimit-Remaining` válaszfejlécben mutatja.

:::info OpenAPI-specifikáció
Töltsd le a teljes OpenAPI-specifikációt YAML vagy JSON formátumban:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

A specifikáció segítségével klienskönyvtárakat generálhatsz Python, TypeScript, Go stb. nyelveken.
:::

## Webhook-tesztelés

Teszteld a webhook-integrációkat közvetlenül:

1. Menj a `POST /api/webhooks/test` végpontra
2. Válaszd ki az eseménytípust a legördülő listából
3. A rendszer egy teszteseményt küld a konfigurált webhook URL-re
4. Nézd meg a kérést/választ a játszótéren
