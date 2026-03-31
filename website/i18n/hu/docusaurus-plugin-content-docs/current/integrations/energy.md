---
sidebar_position: 2
title: Áramár
description: Csatlakozz a Tibberhez vagy a Nordpoolhoz élő óránkénti árakért, árhistóriáért és árriadókért
---

# Áramár

Az áramár-integráció élő áramárakat kér le a Tibberből vagy a Nordpoolból, hogy pontos áramköltség-számításokat adjon nyomtatásonként, és értesítsen a nyomtatáshoz jó vagy rossz időszakokról.

Navigálj ide: **https://localhost:3443/#settings** → **Integrációk → Áramár**

## Tibber integráció

A Tibber egy norvég energiaszolgáltató nyílt API-val a spot árakhoz.

### Beállítás

1. Jelentkezz be a [developer.tibber.com](https://developer.tibber.com) oldalon
2. Generálj egy **Personal Access Token**-t
3. A 3DPrintForgeban: illeszd be a tokent a **Tibber API Token** mezőbe
4. Válassz **Otthont** (ahonnan az árakat lekéred, ha több otthonod van)
5. Kattints a **Kapcsolat tesztelése** gombra
6. Kattints a **Mentés** gombra

### Tibberből elérhető adatok

- **Jelenlegi spot ár** — azonnali ár adókkal együtt (Ft/kWh)
- **Árak a következő 24 órára** — a Tibber kb. 13:00-tól szállítja a másnapi árakat
- **Árhistória** — legfeljebb 30 napra visszamenőleg
- **Nyomtatásonkénti költség** — tényleges nyomtatási idő × óránkénti árak alapján számítva

## Nordpool integráció

A Nordpool az energiatőzsde, amely nyers spot árakat szállít Észak-Európának.

### Beállítás

1. Navigálj az **Integrációk → Nordpool** menüpontra
2. Válassz **Árterületet**: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen) / egyéb EU területek
3. Válassz **Valutát**: NOK / EUR / HUF
4. Válaszd az **Adók és illetékek** lehetőséget:
   - Jelöld be az **ÁFA beleszámítása** opciót (27%)
   - Töltsd ki a **Hálózati díjat** (Ft/kWh) — ellenőrizd a villanyszámládon
   - Töltsd ki a **Fogyasztási adót** (Ft/kWh)
5. Kattints a **Mentés** gombra

:::info Hálózati díj
A hálózati díj szolgáltatónként és díjmodellenként változik. Az aktuális mértékért ellenőrizd a legutóbbi villanyszámládat.
:::

## Óránkénti árak

Az óránkénti árak oszlopdiagramként jelennek meg a következő 24–48 órára:

- **Zöld** — olcsó órák (átlag alatti)
- **Sárga** — átlagos ár
- **Piros** — drága órák (átlag feletti)
- **Szürke** — árprognózis nélküli órák

Vidd az egeret egy óra fölé a pontos ár megtekintéséhez (Ft/kWh).

## Árhistória

Navigálj az **Áramár → Előzmények** menüpontra a megtekintéshez:

- Napi átlagár az elmúlt 30 napra
- Legdrágább és legolcsóbb óra naponta
- Nyomtatások napi összes áramköltsége

## Árriadók

Automatikus riadók beállítása áramár alapján:

1. Navigálj az **Áramár → Árriadók** menüpontra
2. Kattints az **Új riadó** gombra
3. Válassz riadótípust:
   - **Ár küszöb alá esik** — értesítés, amikor az áramár X Ft/kWh alá esik
   - **Ár küszöb fölé emelkedik** — értesítés, amikor az ár X Ft/kWh fölé emelkedik
   - **Ma legolcsóbb óra** — értesítés, amikor a mai legolcsóbb óra kezdődik
4. Válassz értesítési csatornát
5. Kattints a **Mentés** gombra

:::tip Intelligens tervezés
Kombináld az árriadókat a nyomtatási sorral: állíts be egy automatizálást, amely automatikusan elküldi a sorfeladatokat, amikor az áramár alacsony (webhook integráció vagy Home Assistant szükséges).
:::

## Áramár a költségkalkulátorban

Az aktivált áramár-integráció pontos áramköltségeket ad a [Költségkalkulátorban](../analytics/costestimator). Válaszd az **Élő ár** lehetőséget a fix ár helyett az aktuális Tibber/Nordpool ár használatához.
