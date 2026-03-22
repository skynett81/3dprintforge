---
sidebar_position: 2
title: Záloha
description: Vytvářejte, obnovujte a plánujte automatické zálohy dat Bambu Dashboard
---

# Záloha

Bambu Dashboard může zálohovat veškerou konfiguraci, historii a data, takže je možné snadno obnovit v případě selhání systému, přesunu serveru nebo problémů s aktualizací.

Přejděte na: **https://localhost:3443/#settings** → **Systém → Záloha**

## Co je zahrnuto v záloze

| Typ dat | Zahrnuto | Poznámka |
|---|---|---|
| Nastavení a konfigurace tiskáren | ✅ | |
| Historie tisku | ✅ | |
| Sklad filamentů | ✅ | |
| Uživatelé a role | ✅ | Hesla uložena jako hash |
| Nastavení | ✅ | Včetně konfigurací upozornění |
| Protokol údržby | ✅ | |
| Projekty a faktury | ✅ | |
| Knihovna souborů (metadata) | ✅ | |
| Knihovna souborů (soubory) | Volitelně | Může být velká |
| Timelapse videa | Volitelně | Může být velmi velká |
| Obrázky galerie | Volitelně | |

## Vytvoření ruční zálohy

1. Přejděte na **Nastavení → Záloha**
2. Vyberte, co má být zahrnuto (viz tabulka výše)
3. Klikněte na **Vytvořit zálohu nyní**
4. Zobrazí se indikátor průběhu během vytváření zálohy
5. Po dokončení zálohy klikněte na **Stáhnout**

Záloha se uloží jako soubor `.zip` s časovým razítkem v názvu:
```
bambu-dashboard-backup-2026-03-22T14-30-00.zip
```

## Stažení zálohy

Záložní soubory jsou uloženy ve složce zálohy na serveru (konfigurovatelné). Navíc je lze stáhnout přímo:

1. Přejděte na **Záloha → Existující zálohy**
2. Najděte zálohu v seznamu (seřazeno podle data)
3. Klikněte na **Stáhnout** (ikona stažení)

:::info Složka úložiště
Výchozí složka úložiště: `./data/backups/`. Změňte v části **Nastavení → Záloha → Složka úložiště**.
:::

## Plánovaná automatická záloha

1. Aktivujte **Automatická záloha** v části **Záloha → Plánování**
2. Vyberte interval:
   - **Denně** — spouští se ve 03:00 (konfigurovatelné)
   - **Týdně** — konkrétní den a čas
   - **Měsíčně** — první den v měsíci
3. Vyberte **Počet zálohou k zachování** (např. 7 — starší se automaticky smaží)
4. Klikněte na **Uložit**

:::tip Externí úložiště
Pro důležitá data: připojte externí disk nebo síťový disk jako složku zálohy. Tím zálohy přežijí i selhání systémového disku.
:::

## Obnova ze zálohy

:::warning Obnova přepíše existující data
Obnova nahradí veškerá existující data obsahem záložního souboru. Nejprve se ujistěte, že máte čerstvou zálohu aktuálních dat.
:::

### Z existující zálohy na serveru

1. Přejděte na **Záloha → Existující zálohy**
2. Najděte zálohu v seznamu
3. Klikněte na **Obnovit**
4. Potvrďte v dialogu
5. Systém se po obnově automaticky restartuje

### Ze staženého záložního souboru

1. Klikněte na **Nahrát zálohu**
2. Vyberte soubor `.zip` z počítače
3. Soubor je ověřen — uvidíte, co je zahrnuto
4. Klikněte na **Obnovit ze souboru**
5. Potvrďte v dialogu

## Ověření zálohy

Bambu Dashboard ověřuje všechny záložní soubory před obnovením:

- Kontroluje, zda je formát ZIP platný
- Ověřuje, zda je schéma databáze kompatibilní s aktuální verzí
- Zobrazuje varování, pokud je záloha ze starší verze (migrace bude provedena automaticky)
