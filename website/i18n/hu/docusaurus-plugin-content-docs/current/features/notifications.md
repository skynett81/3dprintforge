---
sidebar_position: 6
title: Értesítések
description: Konfiguráld az értesítéseket Telegram, Discord, e-mail, webhook, ntfy, Pushover és SMS csatornákon keresztül az összes nyomtatóesemény számára
---

# Értesítések

A 3DPrintForge számos csatornán keresztül támogatja az értesítéseket, hogy mindig tudd, mi történik a nyomtatóiddal — akár otthon vagy, akár úton.

Navigálj ide: **https://localhost:3443/#settings** → **Értesítések** fül

## Elérhető csatornák

| Csatorna | Szükséges | Képeket támogat |
|---|---|---|
| Telegram | Bot token + Chat ID | ✅ |
| Discord | Webhook URL | ✅ |
| E-mail | SMTP szerver | ✅ |
| Webhook | URL + opcionális kulcs | ✅ (base64) |
| ntfy | ntfy szerver + topic | ❌ |
| Pushover | API token + User key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Böngésző push | Nincs konfiguráció szükséges | ❌ |

## Beállítás csatornánként

### Telegram

1. Hozz létre egy botot a [@BotFather](https://t.me/BotFather) segítségével — küldd a `/newbot` parancsot
2. Másold a **bot tokent** (formátum: `123456789:ABC-def...`)
3. Indíts el egy beszélgetést a bottal, és küldd a `/start` parancsot
4. Keresd meg a **Chat ID-t**: menj a `https://api.telegram.org/bot<TOKEN>/getUpdates` oldalra
5. A 3DPrintForgeban: illeszd be a tokent és a Chat ID-t, kattints a **Teszt** gombra

:::tip Csoportcsatorna
Telegram csoportot is használhatsz fogadóként. A csoportok Chat ID-ja `-` jellel kezdődik.
:::

### Discord

1. Nyisd meg azt a Discord szervert, amelyre értesíteni szeretnél
2. Navigálj a csatornabeállításokhoz → **Integráció → Webhookok**
3. Kattints az **Új webhook** gombra, adj neki nevet, és válassz csatornát
4. Másold a webhook URL-t
5. Illeszd be az URL-t a 3DPrintForgeba, és kattints a **Teszt** gombra

### E-mail

1. Töltsd ki az SMTP szervert, portot (általában 587 TLS-hez)
2. Felhasználónév és jelszó az SMTP fiókhoz
3. **Feladó** cím és **Címzett** cím(ek) (vesszővel elválasztva többhöz)
4. Aktiváld a **TLS/STARTTLS** opciót a biztonságos küldéshez
5. Kattints a **Teszt** gombra tesztüzenet küldéséhez

:::warning Gmail
Használj **Alkalmazásjelszót** a Gmailhez, ne normál jelszót. Először aktiváld a 2-faktoros hitelesítést a Google fiókodban.
:::

### ntfy

1. Hozz létre egy topicot az [ntfy.sh](https://ntfy.sh) oldalon, vagy futtasd saját ntfy szerveredet
2. Töltsd ki a szerver URL-t (pl. `https://ntfy.sh`) és a topic nevet
3. Telepítsd az ntfy alkalmazást a telefonodra, és iratkozz fel ugyanarra a topicra
4. Kattints a **Teszt** gombra

### Pushover

1. Hozz létre fiókot a [pushover.net](https://pushover.net) oldalon
2. Hozz létre egy új alkalmazást — másold az **API Token**-t
3. Keresd meg a **User Key**-t a Pushover dashboardon
4. Töltsd ki mindkettőt a 3DPrintForgeban, és kattints a **Teszt** gombra

### Webhook (egyedi)

A 3DPrintForge HTTP POST kérést küld JSON-payloaddal:

```json
{
  "event": "print_complete",
  "printer": "Az én X1C-m",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Adj hozzá egy **Titkos kulcsot** a kérések HMAC-SHA256 aláírással való hitelesítéséhez az `X-Bambu-Signature` fejlécben.

## Eseményszűrő

Válaszd ki, mely események indítsanak értesítéseket csatornánként:

| Esemény | Leírás |
|---|---|
| Nyomtatás elindult | Új nyomtatás kezdődött |
| Nyomtatás befejezve | Nyomtatás kész (képpel) |
| Nyomtatás sikertelen | Nyomtatás hibával megszakadt |
| Nyomtatás szüneteltetve | Manuális vagy automatikus szünet |
| Print Guard riasztott | XCam vagy érzékelő beavatkozott |
| Filament alacsony | Orsó közel van az ürességhez |
| AMS hiba | Elakadás, nedves filament stb. |
| Nyomtató offline | MQTT kapcsolat megszakadt |
| Sorfeladat elküldve | Feladat elküldve a sorból |

Jelöld be a kívánt eseményeket minden csatornánál külön-külön.

## Csendes óra

Az éjszakai értesítések elkerülése:

1. Aktiváld a **Csendes óra** opciót az értesítési beállításoknál
2. Állítsd be a **Tól** és **Ig** időpontokat (pl. 23:00 → 07:00)
3. Válaszd ki a **Időzónát** az időzítőhöz
4. A kritikus értesítések (Print Guard hibák) felülírhatók — jelöld be a **Mindig küldd a kritikusakat** opciót

## Böngésző push értesítések

Értesítések fogadása közvetlenül a böngészőben alkalmazás nélkül:

1. Navigálj a **Beállítások → Értesítések → Böngésző Push** menüpontra
2. Kattints az **Push értesítések aktiválása** gombra
3. Fogadd el a böngésző engedélykérő párbeszédét
4. Az értesítések működnek, ha a dashboard minimálva van (a fülnek nyitva kell lennie)

:::info PWA
Telepítsd a 3DPrintForgeot PWA-ként a háttérben futó push értesítésekhez nyitott fül nélkül. Lásd [PWA](../system/pwa).
:::
