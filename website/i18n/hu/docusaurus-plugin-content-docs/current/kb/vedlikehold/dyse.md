---
sidebar_position: 1
title: Fúvókakarbantartás
description: Tisztítás, cold pull, fúvókacslere és fúvókatípusok Bambu Lab nyomtatókhoz
---

# Fúvókakarbantartás

A fúvóka a nyomtató egyik legkritikusabb komponense. A megfelelő karbantartás meghosszabbítja az élettartamot és biztosítja a jó nyomtatási eredményeket.

## Fúvókatípusok

| Fúvóka típusa | Anyagok | Becsült élettartam | Max. hőmérséklet |
|--------------|---------|-------------------|-----------------|
| Réz (standard) | PLA, PETG, ABS, TPU | 200–500 óra | 300 °C |
| Edzett acél | Minden, beleértve CF/GF | 300–600 óra | 300 °C |
| HS01 (Bambu) | Minden, beleértve CF/GF | 500–1000 óra | 300 °C |

:::danger Soha ne használj rézfúvókát CF/GF-hez
A szénszál és üvegszál-töltött filamentek órák alatt elköszörülik a rézfúvókákat. Váltj edzett acélra, mielőtt CF/GF-anyagokat nyomtatsz.
:::

## Tisztítás

### Egyszerű tisztítás (tekercsek között)
1. Melegítsd fel a fúvókát 200–220 °C-ra
2. Kézzel nyomj filamentet át, amíg megtisztul
3. Húzd ki gyorsan a filamentet („cold pull" — lásd alább)

### IPA-tisztítás
Makacs maradékok esetén:
1. Melegítsd fel a fúvókát 200 °C-ra
2. Cseppents 1–2 csepp IPA-t a fúvóka végére (óvatosan!)
3. Hagyd a gőzöt feloldani a maradékokat
4. Húzz át friss filamentet

:::warning Légy óvatos az IPA-val a meleg fúvókán
Az IPA 83 °C-on forr és erősen párolog a meleg fúvókán. Kis mennyiséget használj és kerüld a belélegzést.
:::

## Cold Pull (Hideg húzás)

A cold pull a leghátékonyabb módszer a szennyeződések és széntörmelékek eltávolítására a fúvókából.

**Lépésről lépésre:**
1. Melegítsd fel a fúvókát 200–220 °C-ra
2. Nyomj nylon filamentet (vagy ami a fúvókában van) kézzel be
3. Hagyd a nylont átittatódni a fúvókában 1–2 percig
4. Csökkentsd a hőmérsékletet 80–90 °C-ra (nylonhoz)
5. Várd meg, amíg a fúvóka lehűl a célhőmérsékletre
6. Húzd ki a filamentet gyorsan és határozottan egy mozdulattal
7. Nézd meg a végét: a fúvóka belsejének alakját kell tükröznie — tisztán, maradékok nélkül
8. Ismételd 3–5-ször, amíg a filament tisztán és fehéren jön ki

:::tip Nylon a cold pullhoz
A nylon a legjobb eredményt adja cold pullhoz, mert jól fogja meg a szennyeződéseket. A fehér nylon megkönnyíti látni, hogy a húzás tiszta-e.
:::

## Fúvókacsere

### A fúvókacsere jelei
- Csomós alfelületek és rossz dimenzionális pontosság
- Tartós extrudálási problémák tisztítás után
- Látható kopás vagy deformáció a fúvókalyukon
- A fúvóka elérte a becsült élettartamát

### Eljárás (P1S/X1C)
1. Melegítsd fel a fúvókát 200 °C-ra
2. Oldja ki az extruder motort (engedje el a filamentet)
3. Kulccsal lazítsd meg a fúvókát (az óramutató járásával ellentétesen)
4. Cseréld a fúvókát, amíg meleg — **ne hagyd lehűlni a fúvókát, miközben az eszköz rajta van**
5. Húzd meg a kívánt nyomatékra (ne húzd túl)
6. Fuss kalibrálást csere után

:::warning Mindig melegben cseréld
A hideg fúvóka meghúzásából adódó nyomaték felhasadhat a felmelegedéskor. Mindig meleg fúvókán cseréld és húzd meg (200 °C).
:::

## Karbantartási intervallumok

| Tevékenység | Intervallum |
|-------------|------------|
| Tisztítás (cold pull) | Minden 50 óra után, vagy anyagváltáskor |
| Vizuális ellenőrzés | Hetente |
| Fúvókacsere (réz) | 200–500 óra |
| Fúvókacsere (edzett acél) | 300–600 óra |
