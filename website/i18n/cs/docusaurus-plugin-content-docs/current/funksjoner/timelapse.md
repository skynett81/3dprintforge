---
sidebar_position: 7
title: Časosběrné video
description: Aktivujte automatické záznamy časosběrných videí 3D tisků, spravujte videa a přehrávejte je přímo v dashboardu
---

# Časosběrné video

Bambu Dashboard může automaticky pořizovat snímky během tisku a skládat je do časosběrného videa. Videa se ukládají lokálně a lze je přehrávat přímo v dashboardu.

Přejděte na: **https://localhost:3443/#timelapse**

## Aktivace

1. Přejděte na **Nastavení → Časosběrné video**
2. Zapněte **Aktivovat záznam časosběrného videa**
3. Vyberte **Režim záznamu**:
   - **Na vrstvu** — jeden snímek na vrstvu (doporučeno pro vysokou kvalitu)
   - **Časový** — jeden snímek každých N sekund (např. každých 30 sekund)
4. Vyberte, které tiskárny mají mít aktivní časosběrné video
5. Klikněte na **Uložit**

:::tip Interval snímků
„Na vrstvu" poskytuje nejplynulejší animaci, protože pohyb je konzistentní. „Časový" spotřebovává méně úložného prostoru.
:::

## Nastavení záznamu

| Nastavení | Výchozí hodnota | Popis |
|---|---|---|
| Rozlišení | 1280×720 | Velikost snímku (640×480 / 1280×720 / 1920×1080) |
| Kvalita snímku | 85 % | Kvalita komprese JPEG |
| FPS videa | 30 | Snímků za sekundu ve výsledném videu |
| Formát videa | MP4 (H.264) | Výstupní formát |
| Otočit snímek | Vypnuto | Otočit 90°/180°/270° pro orientaci montáže |

:::warning Úložný prostor
Časosběrné video s 500 snímky v 1080p zabírá přibližně 200–400 MB před sloučením. Výsledné MP4 video je typicky 20–80 MB.
:::

## Úložiště

Snímky a videa časosběrného záznamu se ukládají do `data/timelapse/` ve složce projektu. Struktura je organizována podle tiskárny a tisku:

```
data/timelapse/
├── <printer-id>/                     ← Jedinečné ID tiskárny
│   ├── 2026-03-22_nazev-modelu/      ← Tisková relace (datum_nazev)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Surové snímky (smazány po sloučení)
│   ├── 2026-03-22_nazev-modelu.mp4   ← Hotové časosběrné video
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_stojan-na-telefon.mp4
├── <printer-id-2>/                   ← Více tiskáren (při více tiskárnách)
│   └── ...
```

:::tip Externí úložiště
Pro úsporu místa na systémovém disku můžete symlinknout složku časosběrného záznamu na externí disk:
```bash
# Příklad: přesun na externí disk připojený na /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Vytvoření symlinkce zpět
ln -s /mnt/storage/timelapse data/timelapse
```
Dashboard automaticky sleduje symlink. Lze použít jakýkoliv disk nebo síťové úložiště.
:::

## Automatické slučování

Po dokončení tisku se snímky automaticky sloučí do videa pomocí ffmpeg:

1. Bambu Dashboard obdrží událost „tisk dokončen" z MQTT
2. Zavolá se ffmpeg se shromážděnými snímky
3. Video se uloží do složky úložiště
4. Stránka časosběrného záznamu se aktualizuje s novým videem

Průběh si můžete prohlédnout na záložce **Časosběrné video → Zpracovává se**.

## Přehrávání

1. Přejděte na **https://localhost:3443/#timelapse**
2. Vyberte tiskárnu z rozevíracího seznamu
3. Kliknutím na video v seznamu ho přehrajte
4. Použijte ovládací prvky přehrávání:
   - ▶ / ⏸ — Přehrát / Pozastavit
   - ⏪ / ⏩ — Přetočit dozadu / dopředu
   - Tlačítka rychlosti: 0,5× / 1× / 2× / 4×
5. Kliknutím na **Celá obrazovka** otevřete na celé obrazovce
6. Kliknutím na **Stáhnout** stáhnete soubor MP4

## Mazání časosběrných videí

1. Vyberte video v seznamu
2. Klikněte na **Smazat** (ikona odpadkového koše)
3. Potvrďte v dialogovém okně

:::danger Trvalé smazání
Smazaná časosběrná videa a surové snímky nelze obnovit. Nejprve si video stáhněte, pokud ho chcete zachovat.
:::

## Sdílení časosběrného videa

Časosběrná videa lze sdílet prostřednictvím časově omezeného odkazu:

1. Vyberte video a klikněte na **Sdílet**
2. Nastavte čas vypršení (1 hodina / 24 hodin / 7 dní / bez vypršení)
3. Zkopírujte vygenerovaný odkaz a sdílejte ho
4. Příjemce nepotřebuje přihlášení pro sledování videa
