---
sidebar_position: 6
title: Kiosk režim
description: Nastavte Bambu Dashboard jako nástěnný displej nebo hub zobrazení s kiosk režimem a automatickou rotací
---

# Kiosk režim

Kiosk režim je navržen pro nástěnné displeje, televizory nebo dedikované monitory, které nepřetržitě zobrazují stav tiskáren — bez klávesnice, interakce myší nebo prohlížečového uživatelského rozhraní.

Přejděte na: **https://localhost:3443/#settings** → **Systém → Kiosk**

## Co je kiosk režim

V kiosk režimu:
- Navigační menu je skryto
- Žádné interaktivní ovládací prvky nejsou viditelné
- Dashboard se automaticky aktualizuje
- Obrazovka rotuje mezi tiskárnami (pokud je nakonfigurováno)
- Timeout nečinnosti je deaktivován

## Aktivace kiosk režimu přes URL

Přidejte `?kiosk=true` do URL pro aktivaci kiosk režimu bez změny nastavení:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

Kiosk režim se deaktivuje odstraněním parametru nebo přidáním `?kiosk=false`.

## Nastavení kiosku

1. Přejděte na **Nastavení → Systém → Kiosk**
2. Nakonfigurujte:

| Nastavení | Výchozí hodnota | Popis |
|---|---|---|
| Výchozí zobrazení | Přehled flotily | Která stránka se zobrazí |
| Interval rotace | 30 sekund | Čas na tiskárnu v rotaci |
| Režim rotace | Pouze aktivní | Rotovat pouze mezi aktivními tiskárnami |
| Téma | Tmavé | Doporučeno pro displeje |
| Velikost písma | Velká | Čitelná z dálky |
| Hodiny | Vypnuto | Zobrazit hodiny v rohu |

## Zobrazení flotily pro kiosk

Přehled flotily je optimalizován pro kiosk:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parametry pro zobrazení flotily:
- `cols=N` — počet sloupců (1–6)
- `size=small|medium|large` — velikost karty

## Rotace mezi jednotlivými tiskárnami

Pro rotaci mezi jednotlivými tiskárnami (jedna tiskárna najednou):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — aktivovat rotaci
- `interval=N` — sekundy na tiskárnu

## Nastavení na Raspberry Pi / NUC

Pro dedikovaný kiosk hardware:

### Chromium v kiosk režimu (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Vložte příkaz do autostart (`~/.config/autostart/bambu-kiosk.desktop`).

### Automatické přihlášení a spuštění

1. Nakonfigurujte automatické přihlášení v operačním systému
2. Vytvořte autostart záznam pro Chromium
3. Deaktivujte spořič obrazovky a úsporu energie:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Dedikovaný uživatelský účet
Vytvořte dedikovaný uživatelský účet Bambu Dashboard s rolí **Host** pro kiosk zařízení. Zařízení pak má pouze přístup ke čtení a nemůže měnit nastavení, i když někdo získá přístup k obrazovce.
:::

## Nastavení Hubu

Hub režim zobrazuje přehledovou stránku se všemi tiskárnami a klíčovými statistikami — navrženo pro velké televizory:

```
https://localhost:3443/#hub?kiosk=true
```

Zobrazení hubu zahrnuje:
- Mřížku tiskáren se stavem
- Agregované klíčové ukazatele (aktivní tisky, celkový průběh)
- Hodiny a datum
- Poslední HMS výstrahy
