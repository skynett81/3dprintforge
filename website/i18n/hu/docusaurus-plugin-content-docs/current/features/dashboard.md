---
sidebar_position: 2
title: Főpanel
description: Valós idejű áttekintés az aktív nyomtatóról 3D-modellnézettel, AMS-állapottal, kamerával és testreszabható widgetekkel
---

# Főpanel

A főpanel a 3DPrintForge központi vezérlőközpontja. Valós idejű állapotot jelenít meg a kiválasztott nyomtatóról, és lehetővé teszi a figyelést, vezérlést, valamint a nézet testreszabását.

Navigálj ide: **https://localhost:3443/**

## Valós idejű áttekintés

Amikor egy nyomtató aktív, az összes érték folyamatosan frissül az MQTT-n keresztül:

- **Fúvóka-hőmérséklet** — animált SVG gyűrűmérő célhőmérséklettel
- **Ágyhőmérséklet** — hasonló gyűrűmérő a nyomtatóágyhoz
- **Haladási százalék** — nagy százalékjelző a hátralévő idővel
- **Rétegszámláló** — aktuális réteg / rétegek teljes száma
- **Sebesség** — Csendes / Normál / Sport / Turbo csúszkával

:::tip Valós idejű frissítés
Minden érték közvetlenül a nyomtatóból frissül MQTT-n keresztül anélkül, hogy az oldalt újra kellene tölteni. A késés általában kevesebb mint 1 másodperc.
:::

## 3D-modellnézet

Ha a nyomtató `.3mf` fájlt küld a modellel, interaktív 3D-előnézet jelenik meg:

1. A modell automatikusan betöltődik nyomtatás kezdetekor
2. Forgasd a modellt az egér húzásával
3. Görgets a nagyításhoz/kicsinyítéshez
4. Kattints a **Visszaállítás** gombra az alapértelmezett nézethez való visszatéréshez

:::info Támogatás
A 3D-nézet megköveteli, hogy a nyomtató modelliadatokat küldjön. Nem minden nyomtatási feladat tartalmaz ilyet.
:::

## AMS-állapot

Az AMS-panel az összes csatolt AMS-egységet mutatja nyílásokkal és filamenttel:

- **Nyílás színe** — vizuális színreprezentáció a Bambu metaadataiból
- **Filamentnév** — anyag és márka
- **Aktív nyílás** — pulzáló animációval jelölve nyomtatás közben
- **Hibák** — piros jelző AMS-hiba esetén (elakadás, üres, nedves)

Kattints egy nyílásra a teljes filamentinformáció megtekintéséhez és a filamentraktárral való összekapcsoláshoz.

## Kamera-feed

Az élő kamerakép ffmpeg segítségével konvertálódik (RTSPS → MPEG1):

1. A kamera automatikusan elindul, amikor megnyitod a dashboardot
2. Kattints a kameraképre a teljes képernyős megnyitáshoz
3. Használd a **Pillanatkép** gombot egy állókép elkészítéséhez
4. Kattints a **Kamera elrejtése** gombra a hely felszabadításához

:::warning Teljesítmény
A kamerafolyam körülbelül 2–5 Mbit/s-t használ. Kapcsold ki a kamerát lassú hálózati kapcsolatokon.
:::

## Hőmérséklet-sparkline-ok

Az AMS-panel alatt mini-grafikonok (sparkline-ok) jelennek meg az elmúlt 30 percre:

- Fúvóka-hőmérséklet az idők folyamán
- Ágyhőmérséklet az idők folyamán
- Kamrahőmérséklet (ahol elérhető)

Kattints egy sparkline-ra a teljes telemetria-grafikonnézet megnyitásához.

## Widget-testreszabás

A dashboard húzd-és-ejtsd rácsot (grid layout) használ:

1. Kattints a **Layout testreszabása** (ceruza ikon a jobb felső sarokban)
2. Húzd a widgeteket a kívánt pozícióba
3. Méretezd át a sarok húzásával
4. Kattints a **Layout zárolása** gombra az elhelyezés rögzítéséhez
5. Kattints a **Mentés** gombra az elrendezés megőrzéséhez

Elérhető widgetek:
| Widget | Leírás |
|---|---|
| Kamera | Élő kameranézet |
| AMS | Orsó- és filamentállapot |
| Hőmérséklet | Gyűrűmérők a fúvókához és ágyhoz |
| Haladás | Százalékjelző és időbecslés |
| Telemetria | Ventilátorok, nyomás, sebesség |
| 3D-modell | Interaktív modellnézet |
| Sparkline-ok | Mini hőmérséklet-grafikonok |

:::tip Mentés
Az elrendezés felhasználónként a böngészőben (localStorage) tárolódik. Különböző felhasználóknak eltérő elrendezésük lehet.
:::
