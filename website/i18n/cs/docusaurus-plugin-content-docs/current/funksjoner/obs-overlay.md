---
sidebar_position: 4
title: OBS Overlay
description: Přidejte průhledný stavový overlay pro vaši tiskárnu Bambu Lab přímo do OBS Studio
---

# OBS Overlay

OBS Overlay vám umožňuje zobrazovat stav tiskárny v reálném čase přímo v OBS Studio — ideální pro živé vysílání nebo záznam 3D tisku.

## URL overlayu

Overlay je dostupný jako webová stránka s průhledným pozadím:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Nahraďte `PRINTER_ID` ID vaší tiskárny (najdete ho v **Nastavení → Tiskárny**).

### Dostupné parametry

| Parametr | Výchozí hodnota | Popis |
|---|---|---|
| `printer` | první tiskárna | ID tiskárny k zobrazení |
| `theme` | `dark` | `dark`, `light` nebo `minimal` |
| `scale` | `1.0` | Měřítko (0,5–2,0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Průhlednost (0,0–1,0) |
| `fields` | vše | Čárkou oddělený seznam: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Akcentová barva (hex) |

**Příklad s parametry:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Nastavení v OBS Studio

### Krok 1: Přidejte zdroj prohlížeče

1. Otevřete OBS Studio
2. Klikněte na **+** pod **Zdroji**
3. Vyberte **Prohlížeč** (Browser Source)
4. Pojmenujte zdroj, např. `Bambu Overlay`
5. Klikněte na **OK**

### Krok 2: Nakonfigurujte zdroj prohlížeče

Vyplňte následující v dialogu nastavení:

| Pole | Hodnota |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=VASE_ID` |
| Šířka | `400` |
| Výška | `200` |
| FPS | `30` |
| Vlastní CSS | *(ponechte prázdné)* |

Zaškrtněte:
- ✅ **Vypnout zdroj, když není viditelný**
- ✅ **Obnovit prohlížeč při aktivaci scény**

:::warning HTTPS a localhost
OBS může varovat o self-signed certifikátu. Nejprve přejděte na `https://localhost:3443` v Chrome/Firefox a certifikát přijměte. OBS pak použije stejné schválení.
:::

### Krok 3: Průhledné pozadí

Overlay je postaven s `background: transparent`. Aby to fungovalo v OBS:

1. **Nezaškrtávejte** **Vlastní barvu pozadí** ve zdroji prohlížeče
2. Ujistěte se, že overlay není zabalen v neprůhledném elementu
3. Nastavte **Režim prolnutí** na **Normální** u zdroje v OBS

:::tip Alternativa: Chroma key
Pokud průhlednost nefunguje, použijte filtr → **Chroma Key** se zeleným pozadím:
Přidejte `&bg=green` do URL a nastavte filtr chroma key na zdroj v OBS.
:::

## Co se zobrazuje v overlayi

Standardní overlay obsahuje:

- **Průběhová lišta** s procentuální hodnotou
- **Zbývající čas** (odhadovaný)
- **Teplota trysky** a **teplota podložky**
- **Aktivní slot AMS** s barvou filamentu a názvem
- **Model tiskárny** a název (lze vypnout)

## Minimální režim pro streaming

Pro diskrétní overlay při streamování:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Zobrazí pouze malou průběhovou lištu se zbývajícím časem v rohu.
