---
sidebar_position: 3
title: Beállítások
description: Teljes áttekintés a Bambu Dashboard összes beállításáról — nyomtató, értesítések, téma, OBS, energia, webhookok és egyebek
---

# Beállítások

A Bambu Dashboard összes beállítása egy helyen, egyértelmű kategóriákba rendezve található. Íme az egyes kategóriákban elérhető lehetőségek áttekintése.

Navigálj ide: **https://localhost:3443/#settings**

## Nyomtatók

Regisztrált nyomtatók kezelése:

| Beállítás | Leírás |
|---|---|
| Nyomtató hozzáadása | Új nyomtató regisztrálása sorozatszámmal és hozzáférési kóddal |
| Nyomtatónév | Egyedi megjelenítési név |
| Nyomtatómodell | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| MQTT-kapcsolat | Bambu Cloud MQTT vagy helyi MQTT |
| Hozzáférési kód | LAN Access Code a Bambu Lab alkalmazásból |
| IP-cím | Helyi (LAN) módhoz |
| Kamerabeállítások | Engedélyezés/letiltás, felbontás |

Lásd [Első lépések](../getting-started/setup) az első nyomtató lépésenkénti beállításához.

## Értesítések

Teljes dokumentáció az [Értesítések](../features/notifications) oldalon.

Gyors áttekintés:
- Értesítési csatornák engedélyezése/letiltása (Telegram, Discord, e-mail stb.)
- Csatornánkénti eseményszűrő
- Csendes időszakok (értesítés nélküli időszak)
- Tesztgomb csatornánként

## Téma

Teljes dokumentáció a [Téma](./themes) oldalon.

- Világos / Sötét / Automatikus mód
- 6 színpaletta
- Egyedi kiemelőszín
- Lekerekítés és kompaktság

## OBS-overlay

OBS-overlay konfigurálása:

| Beállítás | Leírás |
|---|---|
| Alapértelmezett téma | dark / light / minimal |
| Alapértelmezett pozíció | Az overlay sarokba helyezése |
| Alapértelmezett skála | Méretezés (0,5–2,0) |
| QR-kód megjelenítése | QR-kód megjelenítése a dashboardhoz az overlayen |

Lásd [OBS-overlay](../features/obs-overlay) a teljes URL-szintaxisért és beállításért.

## Energia és áram

| Beállítás | Leírás |
|---|---|
| Tibber API Token | Hozzáférés a Tibber spot árakhoz |
| Nordpool-árkörzethez | Válassz árkörzethasználatot |
| Hálózati díj (kr/kWh) | A hálózati díj mértéke |
| Nyomtatóteljesítmény (W) | Energiafogyasztás konfigurálása nyomtatómodellenként |

## Home Assistant

| Beállítás | Leírás |
|---|---|
| MQTT-bróker | IP, port, felhasználónév, jelszó |
| Discovery-előtag | Alapértelmezett: `homeassistant` |
| Discovery aktiválása | Eszközök közzététele HA-ban |

## Webhookok

Globális webhook-beállítások:

| Beállítás | Leírás |
|---|---|
| Webhook URL | Fogadó URL eseményekhez |
| Titkos kulcs | HMAC-SHA256-aláírás |
| Eseményszűrő | Melyik eseményeket küldi el |
| Újrapróbálkozások száma | Próbálkozások száma hiba esetén (alapértelmezett: 3) |
| Időtúllépés | Másodpercek a kérés feladásáig (alapértelmezett: 10) |

## Sor beállítások

| Beállítás | Leírás |
|---|---|
| Automatikus kiszolgálás | Engedélyezés/letiltás |
| Kiszolgálási stratégia | Első szabad / Legkevésbé használt / Körkörös |
| Megerősítés megkövetelése | Manuális jóváhagyás küldés előtt |
| Lépcsőzetes indítás | Késleltetés a sorban lévő nyomtatók között |

## Biztonság

| Beállítás | Leírás |
|---|---|
| Munkamenet időtartama | Óra/nap az automatikus kijelentkezésig |
| 2FA kikényszerítése | 2FA megkövetelése az összes felhasználónál |
| IP-engedélyezési lista | Hozzáférés korlátozása meghatározott IP-címekre |
| HTTPS-tanúsítvány | Egyedi tanúsítvány feltöltése |

## Rendszer

| Beállítás | Leírás |
|---|---|
| Szerver portja | Alapértelmezett: 3443 |
| Naplóformátum | JSON / Szöveg |
| Naplószint | Error / Warn / Info / Debug |
| Adatbázis-karbantartás | Régi előzmények automatikus törlése |
| Frissítések | Új verziók keresése |
