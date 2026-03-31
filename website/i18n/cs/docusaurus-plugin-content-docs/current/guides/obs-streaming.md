---
sidebar_position: 10
title: Streamování s OBS
description: Nastavte 3DPrintForge jako overlay v OBS Studio pro profesionální streamování 3D tisku
---

# Streamování 3D tisku do OBS

3DPrintForge má vestavěný OBS overlay, který zobrazuje stav tiskárny, průběh, teploty a kamerový přenos přímo ve vašem streamu.

## Předpoklady

- Nainstalovaný OBS Studio ([obsproject.com](https://obsproject.com))
- 3DPrintForge běžící a připojený k tiskárně
- (Volitelné) Kamera Bambu aktivovaná pro živý přenos

## Krok 1 — OBS Browser Source

OBS má vestavěný **Browser Source**, který zobrazuje webovou stránku přímo ve vaší scéně.

**Přidání overlaye do OBS:**

1. Otevřete OBS Studio
2. V části **Zdroje** (Sources) klikněte na **+**
3. Vyberte **Prohlížeč** (Browser)
4. Pojmenujte zdroj, např. "Bambu Overlay"
5. Vyplňte:

| Nastavení | Hodnota |
|-----------|---------|
| URL | `http://localhost:3000/obs/overlay` |
| Šířka | `1920` |
| Výška | `1080` |
| FPS | `30` |
| Vlastní CSS | Viz níže |

6. Zaškrtněte **Ovládání zvuku přes OBS**
7. Klikněte na **OK**

:::info Přizpůsobte URL svému serveru
Běží panel na jiném počítači než OBS? Nahraďte `localhost` IP adresou serveru, např. `http://192.168.1.50:3000/obs/overlay`
:::

## Krok 2 — Průhledné pozadí

Aby se overlay prolnul s obrazem, musí být pozadí průhledné:

**V nastavení OBS Browser Source:**
- Zaškrtněte **Odebrat pozadí** (Shutdown source when not visible / Remove background)

**Vlastní CSS pro vynucení průhlednosti:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Vložte to do pole **Vlastní CSS** v nastavení Browser Source.

Overlay nyní zobrazuje pouze samotný widget — bez bílého nebo černého pozadí.

## Krok 3 — Přizpůsobení overlaye

V 3DPrintForge můžete nakonfigurovat, co overlay zobrazuje:

1. Přejděte do **Funkce → OBS overlay**
2. Nakonfigurujte:

| Nastavení | Možnosti |
|-----------|----------|
| Poloha | Vlevo nahoře, vpravo nahoře, vlevo dole, vpravo dole |
| Velikost | Malý, střední, velký |
| Téma | Tmavé, světlé, průhledné |
| Barva zvýraznění | Vyberte barvu odpovídající stylu streamu |
| Elementy | Vyberte, co se zobrazí (viz níže) |

**Dostupné elementy overlaye:**

- Název tiskárny a stav (online/tisk/chyba)
- Průběhová lišta s procentem a zbývajícím časem
- Filament a barva
- Teplota trysky a teplota desky
- Spotřebovaný filament (gramy)
- Přehled AMS (kompaktní)
- Stav Print Guard

3. Klikněte na **Náhled** pro zobrazení výsledku bez přepnutí do OBS
4. Klikněte na **Uložit**

:::tip URL pro každou tiskárnu
Máte více tiskáren? Použijte samostatné overlay URL:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Kamerový přenos v OBS (samostatný zdroj)

Kameru Bambu lze přidat jako samostatný zdroj v OBS — nezávisle na overlaye:

**Možnost 1: Přes kamerový proxy panelu**

1. Přejděte do **Systém → Kamera**
2. Zkopírujte **URL RTSP nebo MJPEG streamu**
3. V OBS: Klikněte na **+** → **Mediazdroj** (Media Source)
4. Vložte URL
5. Zaškrtněte **Opakovat** (Loop) a deaktivujte lokální soubory

**Možnost 2: Browser Source s kamerovým zobrazením**

1. V OBS: Přidejte **Browser Source**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Šířka/výška: odpovídá rozlišení kamery (1080p nebo 720p)

Kamerový přenos nyní můžete volně umístit ve scéně a overlay přidat nad něj.

## Tipy pro kvalitní stream

### Uspořádání streamovací scény

Typická scéna pro streamování 3D tisku:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Kamerový přenos z tiskárny]       │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Vlevo dole    │
│  │ Tisk: Logo.3mf   │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1h 24m zbývá     │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Doporučená nastavení

| Parametr | Doporučená hodnota |
|----------|--------------------|
| Velikost overlaye | Střední (ne příliš dominantní) |
| Frekvence aktualizace | 30 FPS (odpovídá OBS) |
| Poloha overlaye | Vlevo dole (nevkrývá obličej/chat) |
| Barevné téma | Tmavé s modrou akcentem |

### Scény a přepínání scén

Vytvořte vlastní OBS scény:

- **"Tisk probíhá"** — kamerové zobrazení + overlay
- **"Pauza / čekání"** — statický obrázek + overlay
- **"Dokončeno"** — výsledný snímek + overlay zobrazující "Dokončeno"

Přepínejte mezi scénami klávesovou zkratkou v OBS nebo přes Kolekci scén.

### Stabilizace kamerového obrazu

Kamera Bambu může někdy zamrznout. V panelu v části **Systém → Kamera**:
- Aktivujte **Automatické opětovné připojení** — panel se automaticky znovu připojí
- Nastavte **Interval opětovného připojení** na 10 sekund

### Zvuk

3D tiskárny vydávají zvuk — zejména AMS a chlazení. Zvažte:
- Umístěte mikrofon dál od tiskárny
- Přidejte filtr potlačení šumu na mikrofon v OBS (Noise Suppression)
- Nebo použijte místo toho hudbu na pozadí / zvuk z chatu

:::tip Automatické přepínání scén
OBS má vestavěnou podporu přepínání scén na základě názvů. Kombinujte s pluginem (např. obs-websocket) a API 3DPrintForge pro automatické přepnutí scény při zahájení a ukončení tisku.
:::
