---
sidebar_position: 10
title: 3D nyomtatás közvetítése az OBS-be
description: A Bambu Dashboard beállítása az OBS Studio-ban való átlátszó layerként a professzionális 3D-nyomtatás streamléséhez
---

# 3D nyomtatás közvetítése az OBS-be

A Bambu Dashboard egy beépített OBS-átlátszó réteget tartalmaz, amely a nyomtató státuszát, haladást, hőmérsékleteket és kamerafeed-et közvetlenül a streambe jeleníti meg.

## Követelmények

- Az OBS Studio telepített ([obsproject.com](https://obsproject.com))
- Bambu Dashboard futó és csatlakoztatott nyomtatóval
- (Opcionális) Bambu kamera aktiválva az élő feed-hez

## 1. lépés — OBS böngésző forrása

Az OBS beépített **böngésző forráskód** egy weboldalt közvetlenül a jelenetig jeleníti meg.

**Átlátszó réteg hozzáadása az OBS-ben:**

1. Nyissa meg az OBS Studio-t
2. A **Források** alatt kattintson a **+** gombra
3. Válassza a **Böngésző** (Browser) lehetőséget
4. Adjon nevet a forrásnak, pl. "Bambu átlátszó"
5. Töltse ki:

| Beállítás | Érték |
|-----------|-------|
| URL | `http://localhost:3000/obs/overlay` |
| Szélesség | `1920` |
| Magasság | `1080` |
| FPS | `30` |
| Egyéni CSS | Lásd alább |

6. Jelölje be az **Audio kezelése az OBS-ből** lehetőséget
7. Kattintson az **OK** gombra

:::info Az URL-t az Ön szervéhez igazítsa
Az irányítópult egy másik gépen fut, mint az OBS? Cserélje le a `localhost` szerver IP-címével, pl. `http://192.168.1.50:3000/obs/overlay`
:::

## 2. lépés — Átlátszó háttér

Ahhoz, hogy az átlátszó réteg beolvadjon a képbe, a háttérnek átlátszónak kell lennie:

**Az OBS böngésző forrás beállításaiban:**
- Jelölje be az **Háttér eltávolítása** (Shutdown source when not visible / Remove background) lehetőséget

**Egyéni CSS az átlátszóság kényszerítéséhez:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Illessze be ezt az **Egyéni CSS** mezőbe a böngésző forrás beállításaiban.

Az átlátszó réteg csak a widgetet jeleníti meg — fehér vagy fekete háttér nélkül.

## 3. lépés — Az átlátszó réteg testreszabása

A Bambu Dashboard-ban beállíthatja, hogy az átlátszó réteg mit jelenít meg:

1. Lépjen a **Funkciók → OBS-átlátszó** menübe
2. Konfigurálása:

| Beállítás | Lehetőségek |
|-----------|------------|
| Pozíció | Felül bal, jobb, lent bal, jobb |
| Méret | Kicsi, közepes, nagy |
| Téma | Sötét, világos, átlátszó |
| Szín akcentus | Válassza ki a streamhez illő színt |
| Elemek | Válassza ki, mi legyen megjelenítve (lásd alább) |

**Elérhető átlátszó elemek:**

- Nyomtató névés státusz (online/nyomtatás/hiba)
- Haladási sáv százalékkal és hátralévő idővel
- Filament és szín
- Fúvóka és lemez hőmérséklet
- Felhasznált filament (gramm)
- AMS-áttekintés (kompakt)
- Print Guard státusz

3. Kattintson az **Előnézet** gombra az eredmény megtekintéséhez az OBS váltása nélkül
4. Kattintson a **Mentés** gombra

:::tip URL nyomtatónként
Több nyomtatóval rendelkezik? Használjon külön átlátszó URL-eket:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Kamera feed az OBS-ben (külön forrás)

A Bambu kamera külön forrásként adható hozzá az OBS-hez — az átlátszó rétegtől függetlenül:

**1. lehetőség: Az irányítópult kamera proxy-ja által**

1. Lépjen a **Rendszer → Kamera** menübe
2. Másolja az **RTSP- vagy MJPEG-streelming URL-ét**
3. Az OBS-ben: Kattintson a **+** → **Médiaforrás** (Media Source) gombra
4. Illessze be az URL-t
5. Jelölje be az **Ismétlés** (Loop) és a helyi fájlok kikapcsolása

**2. lehetőség: Böngésző forrás kamera nézet**

1. Az OBS-ben: Adjon hozzá **böngésző forrást**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Szélesség/magasság: megegyezik a kamera felbontásával (1080p vagy 720p)

Most a kamerafeed-et szabadon helyezheti a jelenetbe, és az átlátszó réteget ráteheti.

## Tippek a jó streamléséhez

### Jelenetbeállítás a streamléséhez

Egy tipikus jelenet a 3D-nyomtatás streamléséhez:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Kamera feed a nyomtatóból]        │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu átlátszó   │  ← Lent bal      │
│  │ Print: Logo.3mf  │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1ó 24p maradt    │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Ajánlott beállítások

| Paraméter | Ajánlott érték |
|-----------|---------------|
| Átlátszó méret | Közepes (nem túl domináns) |
| Frissítési frekvencia | 30 FPS (az OBS-nek felel meg) |
| Átlátszó pozíció | Lent bal (kerülje az arcot/csevegést) |
| Szín téma | Sötét kék akcentussal |

### Jelenetek és jelenetváltás

Hozzon létre saját OBS-jeleneteket:

- **"Nyomtatás folyamatban"** — kameranézet + átlátszó
- **"Szünetel / vár"** — statikus kép + átlátszó
- **"Kész"** — eredmény kép + átlátszó "Kész" mutatva

Billentyűparancs vagy jelenet gyűjtemény segítségével váltson a jelenetek között az OBS-ben.

### Kamera obraz stabilizálása

A Bambu kamera néha lefagyhat. Az irányítópulton az **Rendszer → Kamera** alatt:
- Engedélyezze az **Automatikus újracsatlakozás** — az irányítópult automatikusan újracsatlakozik
- Állítsa az **Újracsatlakozás intervallumát** 10 másodpercre

### Hangok

A 3D nyomtatók zajosak — különösen az AMS és hűtés. Vegyük figyelembe:
- Helyezze a mikrofont messze a nyomtatótól
- Adjon hozzá zajszűrőt a mikrofonhoz az OBS-ben (Noise Suppression)
- Vagy használjon háttérzene / csevegési hangot

:::tip Automatikus jelenet váltása
Az OBS beépített támogatása a jelenet váltására a címek alapján. Kombináljon egy bővítménnyel (pl. obs-websocket) és a Bambu Dashboard API-val a jelenet automatikus váltásához a nyomtatás kezdésekor és megállításakor.
:::
