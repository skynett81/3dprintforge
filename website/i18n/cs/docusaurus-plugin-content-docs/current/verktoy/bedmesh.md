---
sidebar_position: 6
title: Bed Mesh
description: 3D vizualizace kalibrace rovinnosti podložky s heatmapou, skenováním z rozhraní a průvodcem kalibrací
---

# Bed Mesh

Nástroj bed mesh poskytuje vizuální reprezentaci rovinnosti podložky — klíčové pro dobrou přilnavost a rovnoměrnou první vrstvu.

Přejděte na: **https://localhost:3443/#bedmesh**

## Co je bed mesh?

Tiskárny Bambu Lab skenují povrch podložky sondou a vytváří mapu (mesh) výškových odchylek. Firmware tiskárny automaticky kompenzuje odchylky při tisku. Bambu Dashboard tuto mapu vizualizuje.

## Vizualizace

### 3D povrch

Mapa bed mesh se zobrazuje jako interaktivní 3D povrch:

- Otáčejte pohled pomocí myši
- Scrollujte pro přiblížení/oddálení
- Klikněte na **Pohled shora** pro ptačí perspektivu
- Klikněte na **Pohled ze strany** pro zobrazení profilu

Barevná škála zobrazuje odchylky od průměrné výšky:
- **Modrá** — nižší než střed (konkávní)
- **Zelená** — přibližně rovná (odchylka < 0,1 mm)
- **Žlutá** — střední odchylka (0,1–0,2 mm)
- **Červená** — vysoká odchylka (> 0,2 mm)

### Heatmapa

Klikněte na **Heatmapa** pro ploché 2D zobrazení mapy mesh — pro většinu snazší ke čtení.

Heatmapa zobrazuje:
- Přesné hodnoty odchylek (mm) pro každý měřicí bod
- Označené problémové body (odchylka > 0,3 mm)
- Rozměry měření (počet řádků × sloupců)

## Skenování bed mesh z rozhraní

:::warning Požadavky
Skenování vyžaduje, aby tiskárna byla nečinná a teplota podložky stabilizovaná. Zahřejte podložku na požadovanou teplotu PŘED skenováním.
:::

1. Přejděte na **Bed Mesh**
2. Vyberte tiskárnu z rozbalovacího seznamu
3. Klikněte na **Skenovat nyní**
4. Vyberte teplotu podložky pro skenování:
   - **Studená** (pokojová teplota) — rychlá, ale méně přesná
   - **Teplá** (50–60 °C PLA, 70–90 °C PETG) — doporučeno
5. Potvrďte v dialogu — tiskárna automaticky zahájí sekvenci sondy
6. Počkejte na dokončení skenování (3–8 minut v závislosti na velikosti mesh)
7. Nová mapa mesh se automaticky zobrazí

## Průvodce kalibrací

Po skenování systém poskytuje konkrétní doporučení:

| Nález | Doporučení |
|---|---|
| Odchylka < 0,1 mm všude | Výborné — není nutná žádná akce |
| Odchylka 0,1–0,2 mm | Dobré — kompenzaci zajistí firmware |
| Odchylka > 0,2 mm v rozích | Ručně upravte pružiny podložky (pokud možné) |
| Odchylka > 0,3 mm | Podložka může být poškozena nebo špatně namontována |
| Střed výše než rohy | Tepelná roztažnost — normální pro teplé podložky |

:::tip Historické srovnání
Klikněte na **Porovnat s předchozím** pro zobrazení, zda se mapa mesh v průběhu času změnila — užitečné pro detekci postupného ohýbání podložky.
:::

## Historie mesh

Všechna skenování mesh jsou uložena s časovým razítkem:

1. Klikněte na **Historie** v bočním panelu bed mesh
2. Vyberte dvě skenování pro jejich porovnání (zobrazí se diferenční mapa)
3. Smažte staré skeny, které již nepotřebujete

## Export

Exportujte data mesh jako:
- **PNG** — obrázek heatmapy (pro dokumentaci)
- **CSV** — surová data s X, Y a výškovou odchylkou pro každý bod
