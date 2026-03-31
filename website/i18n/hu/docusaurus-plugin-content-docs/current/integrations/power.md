---
sidebar_position: 3
title: Fogyasztásmérés
description: Mérd a nyomtatónkénti tényleges fogyasztást Shelly vagy Tasmota okos dugóval, és kapcsold össze a költségáttekintéssel
---

# Fogyasztásmérés

Csatlakozz egy energiamérős okos dugót a nyomtatóhoz, hogy az egyes nyomtatások tényleges fogyasztását naplózd — ne csak becsléseket.

Navigálj ide: **https://localhost:3443/#settings** → **Integrációk → Fogyasztásmérés**

## Támogatott eszközök

| Eszköz | Protokoll | Ajánlás |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Ajánlott — egyszerű beállítás |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Rögzített telepítéshez |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Újabb modellek bővített API-val |
| **Tasmota eszközök** | MQTT | Rugalmas egyedi telepítésekhez |

:::tip Ajánlott eszköz
Shelly Plug S Plus 1.0+ firmware-rel tesztelt és ajánlott. Támogatja a Wi-Fi, MQTT és HTTP REST protokollokat felhőfüggőség nélkül.
:::

## Beállítás Shelly-vel

### Előfeltételek

- A Shelly dugó ugyanahhoz a hálózathoz van csatlakoztatva, mint a 3DPrintForge
- A Shelly statikus IP-vel vagy DHCP-foglalással van konfigurálva

### Konfiguráció

1. Navigálj a **Beállítások → Fogyasztásmérés** menüpontra
2. Kattints a **Fogyasztásmérő hozzáadása** gombra
3. Válassz **Típust**: Shelly
4. Töltsd ki:
   - **IP cím**: pl. `192.168.1.150`
   - **Csatorna**: 0 (egykimenetes dugóknál)
   - **Hitelesítés**: felhasználónév és jelszó, ha konfigurálva
5. Kattints a **Kapcsolat tesztelése** gombra
6. Csatold a dugót egy **Nyomtatóhoz**: válassz a legördülő listából
7. Kattints a **Mentés** gombra

### Lekérdezési intervallum

Az alapértelmezett lekérdezési intervallum 10 másodperc. Csökkentsd 5-re a pontosabb mérésekért, növeld 30-ra az alacsonyabb hálózati terhelésért.

## Beállítás Tasmotával

1. Konfiguráld a Tasmota eszközt MQTT-vel (lásd a Tasmota dokumentációt)
2. A 3DPrintForgeban: válassz **Típust**: Tasmota
3. Töltsd ki az eszköz MQTT topicját: pl. `tasmota/power-plug-1`
4. Csatold a nyomtatóhoz, és kattints a **Mentés** gombra

A 3DPrintForge automatikusan feliratkozik a `{topic}/SENSOR` topicra a teljesítménymérésekhez.

## Mit mér a rendszer

Amikor a fogyasztásmérés aktiválva van, a következők kerülnek naplózásra nyomtatásonként:

| Mérőszám | Leírás |
|---|---|
| **Azonnali teljesítmény** | Watt nyomtatás közben (élő) |
| **Összes energiafogyasztás** | kWh az egész nyomtatáshoz |
| **Átlagos teljesítmény** | kWh / nyomtatási idő |
| **Energiaköltség** | kWh × áramár (Tibber/Nordpooltól) |

Az adatok a nyomtatási előzményekbe kerülnek, és elemzésre elérhetők.

## Élő nézet

Az azonnali fogyasztás a következőkben jelenik meg:

- **Dashboardban** — extra widgetként (aktiváld a widget beállításokban)
- **Flottaáttekintésben** — kis jelzőként a nyomtatókártyán

## Összehasonlítás a becsléssel

Nyomtatás után összehasonlítás jelenik meg:

| | Becsült | Tényleges |
|---|---|---|
| Energiafogyasztás | 1,17 kWh | 1,09 kWh |
| Áramköltség | 2,16 Ft | 2,02 Ft |
| Eltérés | — | -6,8% |

A következetes eltérés felhasználható a [Költségkalkulátorban](../analytics/costestimator) lévő becslések kalibrálásához.

## Nyomtató automatikus kikapcsolása

Shelly/Tasmota automatikusan kikapcsolhatja a nyomtatót nyomtatás befejezése után:

1. Navigálj a **Fogyasztásmérés → [Nyomtató] → Automatikus kikapcsolás** menüpontra
2. Aktiváld a **Kikapcsolás X perccel nyomtatás befejezése után** opciót
3. Állítsd be az időkésedelmet (pl. 10 perc)

:::danger Lehűlés
Hagyd a nyomtatót legalább 5–10 percig lehűlni nyomtatás befejezése után, mielőtt lekapcsolod az áramot. A fúvókának 50°C alá kell hűlnie a hotendben lévő hővándorlás elkerüléséhez.
:::
