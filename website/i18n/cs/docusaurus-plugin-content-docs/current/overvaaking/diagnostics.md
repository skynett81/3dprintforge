---
sidebar_position: 3
title: Diagnostika
description: Skóre zdraví, telemetrické grafy, vizualizace bed mesh a monitorování komponent pro tiskárny Bambu Lab
---

# Diagnostika

Stránka diagnostiky poskytuje hloubkový přehled zdraví, výkonu a stavu tiskárny v průběhu času.

Přejděte na: **https://localhost:3443/#diagnostics**

## Skóre zdraví

Pro každou tiskárnu se vypočítává **skóre zdraví** od 0 do 100 na základě:

| Faktor | Váha | Popis |
|---|---|---|
| Míra úspěšnosti (30 dní) | 30 % | Podíl úspěšných tisků za posledních 30 dní |
| Opotřebení komponent | 25 % | Průměrné opotřebení kritických dílů |
| HMS chyby (30 dní) | 20 % | Počet a závažnost chyb |
| Stav kalibrace | 15 % | Čas od poslední kalibrace |
| Stabilita teploty | 10 % | Odchylka od cílové teploty během tisku |

**Interpretace skóre:**
- 🟢 80–100 — Výborný stav
- 🟡 60–79 — Dobrý, ale něco by mělo být prověřeno
- 🟠 40–59 — Snížený výkon, doporučena údržba
- 🔴 0–39 — Kritický, nutná údržba

:::tip Historie
Kliknutím na graf zdraví zobrazíte vývoj skóre v průběhu času. Velké poklesy mohou naznačovat konkrétní událost.
:::

## Telemetrické grafy

Stránka telemetrie zobrazuje interaktivní grafy pro všechny hodnoty senzorů:

### Dostupné datové sady

- **Teplota trysky** — skutečná vs. cílová
- **Teplota podložky** — skutečná vs. cílová
- **Teplota komory** — okolní teplota uvnitř stroje
- **Motor extruderu** — spotřeba proudu a teplota
- **Rychlosti ventilátorů** — tisková hlava, komora, AMS
- **Tlak** (X1C) — tlak v komoře pro AMS
- **Zrychlení** — vibrační data (ADXL345)

### Navigace v grafech

1. Vyberte **Časové období**: Poslední hodina / 24 hodin / 7 dní / 30 dní / Vlastní
2. Vyberte **Tiskárnu** z rozbalovacího seznamu
3. Vyberte **Datové sady** k zobrazení (podporuje vícenásobný výběr)
4. Scrollujte pro přiblížení časové osy
5. Klikněte a přetáhněte pro posun
6. Dvojklikem resetujte přiblížení

### Export telemetrických dat

1. Klikněte na **Exportovat** v grafu
2. Vyberte formát: **CSV**, **JSON** nebo **PNG** (obrázek)
3. Vybrané časové období a datové sady jsou exportovány

## Bed Mesh

Vizualizace bed mesh zobrazuje kalibraci rovinnosti podložky:

1. Přejděte na **Diagnostika → Bed Mesh**
2. Vyberte tiskárnu
3. Poslední mesh se zobrazí jako 3D povrch a heatmapa:
   - **Modrá** — nižší než střed (konkávní)
   - **Zelená** — přibližně rovná
   - **Červená** — vyšší než střed (konvexní)
4. Najeďte myší na bod pro zobrazení přesné odchylky v mm

### Skenování bed mesh z rozhraní

1. Klikněte na **Skenovat nyní** (vyžaduje nečinnou tiskárnu)
2. Potvrďte v dialogu — tiskárna automaticky zahájí kalibraci
3. Počkejte na dokončení skenování (cca 3–5 minut)
4. Nová mesh se automaticky zobrazí

:::warning Nejprve zahřejte
Bed mesh by měl být skenován s zahřátou podložkou (50–60 °C pro PLA) pro přesnou kalibraci.
:::

## Opotřebení komponent

Viz [Predikce opotřebení](./wearprediction) pro podrobnou dokumentaci.

Stránka diagnostiky zobrazuje stručný přehled:
- Procentuální skóre pro každou komponentu
- Doporučená příští údržba
- Kliknutím na **Detaily** zobrazíte úplnou analýzu opotřebení
