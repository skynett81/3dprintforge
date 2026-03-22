---
sidebar_position: 3
title: AMS-karbantartás
description: Az AMS karbantartása — PTFE-csövek, filamentút és nedvességmegelőzés
---

# AMS-karbantartás

Az AMS (Automatic Material System) egy precíz rendszer, amely rendszeres karbantartást igényel a megbízható működéshez. A leggyakoribb problémák a szennyezett filamentút és a nedvesség a házban.

## PTFE-csövek

A PTFE-csövek szállítják a filamentet az AMS-ből a nyomtatóba. Ezek az első alkatrészek között vannak, amelyek elkopnak.

### Ellenőrzés
Ellenőrizd a PTFE-csöveket:
- **Törések vagy hajlások** — akadályozzák a filamentáramlást
- **Kopás a csatlakozhozásoknál** — fehér por a bemeneteknél
- **Alakdeformáció** — különösen CF-anyagok használata esetén

### PTFE-cső csere
1. Engedd fel a filamentet az AMS-ből (futtasd le a tehermentesítési ciklust)
2. Nyomd be a kék reteszelőgyűrűt a cső körül a csatlakozóban
3. Húzd ki a csövet (határozott fogást igényel)
4. Vágd az új csövet a megfelelő hosszra (ne rövidebbre az eredetinél)
5. Told be ütközésig és zárd

:::tip AMS Lite vs. AMS
Az AMS Lite (A1/A1 Mini) egyszerűbb PTFE-konfigurációval rendelkezik, mint a teljes AMS (P1S/X1C). A csövek rövidebbek és könnyebben cserélhetők.
:::

## Filamentút

### A filamentút tisztítása
A filamentek port és maradékot hagynak a filamentútban, különösen a CF-anyagok:

1. Futtasd le az összes tárolóhely tehermentesítését
2. Használj sűrített levegőt vagy puha ecsetet a laza por kifújásához
3. Futtass át tiszta nylon vagy PTFE-tisztítófilamentet az úton

### Érzékelők
Az AMS érzékelőkkel érzékeli a filament pozícióját és a filamentszakadást. Tartsd tisztán az érzékelőablakokat:
- Óvatosan töröld le az érzékelőlencséket tiszta ecsettel
- Ne vigyél IPA-t közvetlenül az érzékelőkre

## Nedvesség

Az AMS nem védi meg a filamentet a nedvességtől. Higroszkópos anyagokhoz (PA, PETG, TPU) ajánlott:

### Száraz AMS-alternatívák
- **Lezárt doboz:** Helyezd a tekercseket szoros dobozba szilika-géllel
- **Bambu Dry Box:** Hivatalos száraztartó doboz-kiegészítő
- **Külső adagoló:** Használj filamentadagolót az AMS-en kívül az érzékeny anyagokhoz

### Nedvességjelzők
Helyezz nedvességjelző kártyákat (higromtert) az AMS-házba. Cseréld a szilika-gél zacskókat, ha a relatív páratartalom meghaladja a 30%-ot.

## Hajtókerekek és szorítómechanizmus

### Ellenőrzés
Ellenőrizd a hajtókerekeket (az AMS extruderkerekét):
- Filamentmaradékok a fogak között
- Kopás a fogrendszeren
- Egyenetlen súrlódás kézi húzásnál

### Tisztítás
1. Használj fogkefét vagy kefét a hajtókerék fogai közötti maradékok eltávolítására
2. Fújj sűrített levegőt
3. Kerüld az olajat és kenőanyagokat — a húzási szint száraz üzemre van kalibrálva

## Karbantartási intervallumok

| Tevékenység | Intervallum |
|-------------|------------|
| PTFE-cső vizuális ellenőrzése | Havonta |
| Filamentút tisztítása | Minden 100 óra |
| Érzékelők ellenőrzése | Havonta |
| Szilika-gél csere (száraz konfiguráció) | Szükség esetén (30%+ RF-nél) |
| PTFE-cső csere | Látható kopásnál |
