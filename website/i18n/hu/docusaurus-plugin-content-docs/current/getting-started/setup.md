---
sidebar_position: 2
title: Első beállítás
description: Csatlakoztasd a Bambu Lab nyomtatódat, és konfiguráld a dashboardot
---

# Első beállítás

Amikor a dashboard első alkalommal fut, a beállítási varázsló automatikusan megnyílik.

## Beállítási varázsló

A varázsló a `https://a-te-szervered:3443/setup` címen érhető el. Végigvezet:

1. Rendszergazda felhasználó létrehozása
2. Nyomtató hozzáadása
3. Kapcsolat tesztelése
4. Értesítések konfigurálása (opcionális)

## Nyomtató hozzáadása

Három dologra van szükséged a nyomtatóhoz való csatlakozáshoz:

| Mező | Leírás | Példa |
|------|---------|-------|
| IP cím | A nyomtató helyi IP-je | `192.168.1.100` |
| Sorozatszám | 15 karakter, a nyomtató aljára van írva | `01P09C123456789` |
| Hozzáférési kód | 8 karakter, a nyomtató hálózati beállításaiban található | `12345678` |

### Hozzáférési kód megkeresése a nyomtatón

**X1C / P1S / P1P:**
1. Menj a **Beállítások** menübe a képernyőn
2. Válaszd a **WLAN** vagy **LAN** lehetőséget
3. Keresd az **Access Code** bejegyzést

**A1 / A1 Mini:**
1. Érintsd meg a képernyőt, és válaszd a **Beállítások** menüt
2. Navigálj a **WLAN** menüpontra
3. Keresd az **Access Code** bejegyzést

:::tip Fix IP cím
Állíts be fix IP-t a nyomtatóhoz az útválasztódban (DHCP foglalás). Így nem kell frissítened a dashboardot minden alkalommal, amikor a nyomtató új IP-t kap.
:::

## AMS konfiguráció

Miután a nyomtató csatlakoztatva van, az AMS állapota automatikusan frissül. Lehetőséged van:

- Minden nyílásnak nevet és színt adni
- Orsókat a filamentraktáradhoz csatolni
- Nyílásonkénti filamentfelhasználást megtekinteni

Manuális konfigurációért menj a **Beállítások → Nyomtató → AMS** menüpontra.

## HTTPS tanúsítványok {#https-tanúsítványok}

### Önaláírt tanúsítvány (alapértelmezett)

A dashboard automatikusan önaláírt tanúsítványt generál indításkor. A böngészőben való megbízáshoz:

- **Chrome/Edge:** Kattints a „Speciális" gombra → „Folytatás az oldalhoz"
- **Firefox:** Kattints a „Speciális" gombra → „Kockázat elfogadása és folytatás"

### Saját tanúsítvány

Helyezd el a tanúsítványfájlokat a mappában, és konfiguráld a `config.json` fájlban:

```json
{
  "ssl": {
    "cert": "/ut/a/cert.pem-hez",
    "key": "/ut/a/key.pem-hez"
  }
}
```

:::info Let's Encrypt
Domainnevet használsz? Generálj ingyenes tanúsítványt a Let's Encrypt és Certbot segítségével, és mutass a `cert` és `key` értékekkel a `/etc/letsencrypt/live/a-te-domainedet/` mappában lévő fájlokra.
:::

## Környezeti változók

Az összes beállítás felülírható környezeti változókkal:

| Változó | Alapértelmezett | Leírás |
|---------|-----------------|--------|
| `PORT` | `3000` | HTTP port |
| `HTTPS_PORT` | `3443` | HTTPS port |
| `NODE_ENV` | `production` | Környezet |
| `AUTH_SECRET` | (auto) | JWT titkos kulcs |

## Több nyomtatós beállítás

Több nyomtatót is hozzáadhatsz a **Beállítások → Nyomtatók → Nyomtató hozzáadása** menüponton. Használd a dashboard tetején lévő nyomtatóválasztót a köztük való váltáshoz.
