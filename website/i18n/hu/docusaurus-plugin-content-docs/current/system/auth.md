---
sidebar_position: 1
title: Hitelesítés
description: Felhasználók, szerepek, engedélyek, API kulcsok és kétfaktoros hitelesítés (TOTP) kezelése
---

# Hitelesítés

A 3DPrintForge több felhasználót támogat szerepalapú hozzáférés-vezérléssel, API kulcsokkal és opcionális kétfaktoros hitelesítéssel (2FA) TOTP segítségével.

Navigálj ide: **https://localhost:3443/#settings** → **Felhasználók és hozzáférés**

## Felhasználók

### Felhasználó létrehozása

1. Navigálj a **Beállítások → Felhasználók** menüpontra
2. Kattints az **Új felhasználó** gombra
3. Töltsd ki:
   - **Felhasználónév** — a bejelentkezéshez használt
   - **E-mail cím**
   - **Jelszó** — legalább 12 karakter ajánlott
   - **Szerep** — lásd a szerepeket alább
4. Kattints a **Létrehozás** gombra

Az új felhasználó most bejelentkezhet a **https://localhost:3443/login** oldalon.

### Jelszó módosítása

1. Navigálj a **Profil** oldalra (jobb felső sarok → kattints a felhasználónevedre)
2. Kattints a **Jelszó módosítása** gombra
3. Add meg a jelenlegi jelszót és az új jelszót
4. Kattints a **Mentés** gombra

A rendszergazdák visszaállíthatják mások jelszavát a **Beállítások → Felhasználók → [Felhasználó] → Jelszó visszaállítása** menüponton.

## Szerepek

| Szerep | Leírás |
|---|---|
| **Rendszergazda** | Teljes hozzáférés — minden beállítás, felhasználó és funkció |
| **Operátor** | Nyomtatók irányítása, mindent lát, de nem módosítja a rendszerbeállításokat |
| **Vendég** | Csak olvasás — dashboard, előzmények és statisztika megtekintése |
| **API felhasználó** | Csak API hozzáférés — nincs webes felület |

### Egyedi szerepek

1. Navigálj a **Beállítások → Szerepek** menüpontra
2. Kattints az **Új szerep** gombra
3. Válassz engedélyeket egyenként:
   - Dashboard / előzmények / statisztika megtekintése
   - Nyomtatók irányítása (szünet/leállítás/indítás)
   - Filamentraktár kezelése
   - Sor kezelése
   - Kamerafolyam megtekintése
   - Beállítások módosítása
   - Felhasználók kezelése
4. Kattints a **Mentés** gombra

## API kulcsok

Az API kulcsok programozási hozzáférést biztosítanak bejelentkezés nélkül.

### API kulcs létrehozása

1. Navigálj a **Beállítások → API kulcsok** menüpontra
2. Kattints az **Új kulcs** gombra
3. Töltsd ki:
   - **Név** — leíró név (pl. „Home Assistant", „Python szkript")
   - **Lejárati dátum** — opcionális, biztonsági okokból beállítható
   - **Engedélyek** — válassz szerepet vagy konkrét engedélyeket
4. Kattints a **Generálás** gombra
5. **Másold most a kulcsot** — csak egyszer jelenik meg

### Az API kulcs használata

Add hozzá a HTTP fejléchez az összes API hívásban:
```
Authorization: Bearer AZ_TE_API_KULCSOD
```

A teszteléshez lásd az [API játszóteret](../tools/playground).

:::danger Biztonságos tárolás
Az API kulcsok ugyanolyan hozzáféréssel rendelkeznek, mint az a felhasználó, akihez kapcsolódnak. Tárold őket biztonságosan, és rendszeresen forgasd.
:::

## TOTP 2FA

Kétfaktoros hitelesítés aktiválása hitelesítő alkalmazással (Google Authenticator, Authy, Bitwarden stb.):

### 2FA aktiválása

1. Navigálj a **Profil → Biztonság → Kétfaktoros hitelesítés** menüpontra
2. Kattints a **2FA aktiválása** gombra
3. Olvasd be a QR-kódot a hitelesítő alkalmazással
4. Add meg a generált 6 számjegyű kódot a megerősítéshez
5. Mentsd el a **helyreállítási kódokat** (10 egyszeri kód) biztonságos helyen
6. Kattints az **Aktiválás** gombra

### Bejelentkezés 2FA-val

1. Add meg a felhasználónevet és jelszót a szokásos módon
2. Add meg a 6 számjegyű TOTP kódot az alkalmazásból
3. Kattints a **Bejelentkezés** gombra

### 2FA kikényszerítése az összes felhasználóra

A rendszergazdák megkövetelhetik a 2FA-t az összes felhasználónál:

1. Navigálj a **Beállítások → Biztonság → 2FA kikényszerítése** menüpontra
2. Aktiváld a beállítást
3. A 2FA nélküli felhasználókat a következő bejelentkezéskor beállításra kényszeríti

## Munkamenet-kezelés

- Alapértelmezett munkamenet időtartama: 24 óra
- Módosítás a **Beállítások → Biztonság → Munkamenet időtartama** menüponton
- Aktív munkamenetek megtekintése felhasználónként és egyedi munkamenetek lezárása
