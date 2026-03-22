---
sidebar_position: 6
title: Kioszk mód
description: Bambu Dashboard beállítása falra szerelt képernyőként vagy hub nézetként kioszk móddal és automatikus rotációval
---

# Kioszk mód

A kioszk mód falra szerelt képernyőkre, TV-kre vagy dedikált monitorokra lett tervezve, amelyek folyamatosan mutatják a nyomtatók állapotát — billentyűzet, egér interakció vagy böngésző-UI nélkül.

Navigálj ide: **https://localhost:3443/#settings** → **Rendszer → Kioszk**

## Mi a kioszk mód

Kioszk módban:
- A navigációs menü el van rejtve
- Nincs látható interaktív vezérlő
- A dashboard automatikusan frissül
- A képernyő nyomtatók között rotál (ha konfigurálva)
- Az inaktivitási időtúllépés ki van kapcsolva

## Kioszk mód aktiválása URL-en keresztül

Add hozzá a `?kiosk=true` paramétert az URL-hez, hogy a beállítások módosítása nélkül aktiváld a kioszk módot:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

A kioszk mód deaktiválható a paraméter eltávolításával vagy a `?kiosk=false` hozzáadásával.

## Kioszk beállítások

1. Navigálj a **Beállítások → Rendszer → Kioszk** menüpontra
2. Konfiguráld:

| Beállítás | Alapértelmezett | Leírás |
|---|---|---|
| Alapértelmezett nézet | Flottaáttekintés | Melyik oldal jelenik meg |
| Rotációs intervallum | 30 másodperc | Idő nyomtatónként a rotáció során |
| Rotációs mód | Csak aktívak | Csak az aktív nyomtatók között rotál |
| Téma | Sötét | Képernyőkre ajánlott |
| Betűméret | Nagy | Távolról olvasható |
| Óra megjelenítése | Ki | Óra megjelenítése a sarokban |

## Flottanézet kioszk módhoz

A flottaáttekintés kioszkra van optimalizálva:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Paraméterek a flottanézethez:
- `cols=N` — oszlopok száma (1–6)
- `size=small|medium|large` — kártyaméret

## Egyedi nyomtató rotáció

Nyomtatók közötti rotációhoz (egyszerre egy nyomtató):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — rotáció aktiválása
- `interval=N` — másodperc nyomtatónként

## Beállítás Raspberry Pi-n / NUC-on

Dedikált kioszk hardverhez:

### Chromium kioszk módban (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Helyezd el a parancsot az autostart mappában (`~/.config/autostart/bambu-kiosk.desktop`).

### Automatikus bejelentkezés és indítás

1. Konfiguráld az automatikus bejelentkezést az operációs rendszerben
2. Hozz létre autostart bejegyzést a Chromiumhoz
3. Kapcsold ki a képernyővédőt és az energiatakarékos módot:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Dedikált felhasználói fiók
Hozz létre egy dedikált Bambu Dashboard felhasználói fiókot **Vendég** szerepkörrel a kioszk eszközhöz. Az eszköz csak olvasási hozzáféréssel rendelkezik, és nem módosíthatja a beállításokat, még ha valaki hozzáfér is a képernyőhöz.
:::

## Hub beállítások

A hub mód összefoglaló oldalt mutat az összes nyomtatóval és kulcsstatisztikával — nagy TV-kre tervezve:

```
https://localhost:3443/#hub?kiosk=true
```

A hub nézet tartalmaz:
- Nyomtató rácsot állapottal
- Összesített kulcsmutatókat (aktív nyomtatások, összes haladás)
- Óra és dátum
- Legutóbbi HMS riasztások
