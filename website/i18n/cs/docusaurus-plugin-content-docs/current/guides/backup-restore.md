---
sidebar_position: 9
title: Záloha
description: Automatické a manuální zálohování Bambu Dashboard, obnova dat a přesun na nový server
---

# Záloha a obnova

Bambu Dashboard ukládá všechna data lokálně — historii tisků, zásoby filamentů, nastavení, uživatele a další. Pravidelné zálohování zajistí, že nepřijdete o nic při selhání serveru nebo při přesunu na jiný počítač.

## Co je zahrnuto v záloze?

| Data | Zahrnuto | Poznámka |
|------|----------|----------|
| Historie tisků | Ano | Všechny protokoly a statistiky |
| Zásoby filamentů | Ano | Cívky, hmotnosti, značky |
| Nastavení | Ano | Všechna systémová nastavení |
| Konfigurace tiskáren | Ano | IP adresy, přístupové kódy |
| Uživatelé a role | Ano | Hesla jsou uložena jako hash |
| Konfigurace upozornění | Ano | Telegram tokeny atd. |
| Snímky z kamery | Volitelné | Mohou být velké soubory |
| Timelapse videa | Volitelné | Ve výchozím stavu vyloučena |

## Automatická noční záloha

Ve výchozím nastavení se automatická záloha spouští každou noc ve 03:00.

**Zobrazení a konfigurace automatické zálohy:**
1. Přejděte do **Systém → Záloha**
2. V části **Automatická záloha** vidíte:
   - Poslední úspěšnou zálohu a čas
   - Příští plánovanou zálohu
   - Počet uložených záloh (výchozí: 7 dní)

**Konfigurace:**
- **Čas** — změňte výchozí 03:00 na čas, který vám vyhovuje
- **Doba uchování** — počet dní, po které jsou zálohy uchovávány (7, 14, 30 dní)
- **Umístění úložiště** — lokální složka (výchozí) nebo externí cesta
- **Komprese** — ve výchozím stavu aktivována (snižuje velikost o 60–80 %)

:::info Záložní soubory jsou ve výchozím nastavení uloženy zde
```
/path/til/bambu-dashboard/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Manuální záloha

Zálohujte kdykoliv:

1. Přejděte do **Systém → Záloha**
2. Klikněte na **Zálohovat nyní**
3. Počkejte, dokud stav nezobrazí **Dokončeno**
4. Stáhněte záložní soubor kliknutím na **Stáhnout**

**Alternativně přes terminál:**
```bash
cd /sti/til/bambu-dashboard
node scripts/backup.js
```

Záložní soubor je uložen v `data/backups/` s časovým razítkem v názvu souboru.

## Obnova ze zálohy

:::warning Obnova přepíše existující data
Veškerá existující data budou nahrazena obsahem záložního souboru. Ujistěte se, že obnovujete správný soubor.
:::

### Přes panel

1. Přejděte do **Systém → Záloha**
2. Klikněte na **Obnovit**
3. Vyberte záložní soubor ze seznamu nebo nahrajte záložní soubor z disku
4. Klikněte na **Obnovit nyní**
5. Panel se po obnově automaticky restartuje

### Přes terminál

```bash
cd /sti/til/bambu-dashboard
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Po obnově restartujte panel:
```bash
sudo systemctl restart bambu-dashboard
# nebo
npm start
```

## Export a import nastavení

Chcete uložit pouze nastavení (ne celou historii)?

**Export:**
1. Přejděte do **Systém → Nastavení → Export**
2. Vyberte, co se má zahrnout:
   - Konfigurace tiskáren
   - Konfigurace upozornění
   - Uživatelské účty
   - Značky a profily filamentů
3. Klikněte na **Exportovat** — stáhnete soubor `.json`

**Import:**
1. Přejděte do **Systém → Nastavení → Import**
2. Nahrajte soubor `.json`
3. Vyberte, které části se mají importovat
4. Klikněte na **Importovat**

:::tip Užitečné při nové instalaci
Exportovaná nastavení jsou praktická při přesunu na nový server. Importujte je po nové instalaci, abyste nemuseli vše nastavovat znovu.
:::

## Přesun na nový server

Takto přesunete Bambu Dashboard se všemi daty na nový počítač:

### Krok 1 — Zálohujte na starém serveru

1. Přejděte do **Systém → Záloha → Zálohovat nyní**
2. Stáhněte záložní soubor
3. Zkopírujte soubor na nový server (USB, scp, sdílení v síti)

### Krok 2 — Nainstalujte na novém serveru

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Postupujte podle průvodce instalací. Nemusíte nic konfigurovat — jen spusťte panel.

### Krok 3 — Obnovte zálohu

Když panel běží na novém serveru:

1. Přejděte do **Systém → Záloha → Obnovit**
2. Nahrajte záložní soubor ze starého serveru
3. Klikněte na **Obnovit nyní**

Vše je nyní na místě: historie, zásoby filamentů, nastavení a uživatelé.

### Krok 4 — Ověřte připojení

1. Přejděte do **Nastavení → Tiskárny**
2. Otestujte připojení ke každé tiskárně
3. Zkontrolujte, zda jsou IP adresy stále správné (nový server může mít jinou IP)

## Tipy pro správnou zálohovací hygienu

- **Otestujte obnovu** — proveďte zálohu a obnovte ji na testovacím počítači alespoň jednou. Neotestované zálohy nejsou zálohy.
- **Uchovávejte externně** — pravidelně kopírujte záložní soubor na externí disk nebo cloudové úložiště (Nextcloud, Google Drive atd.)
- **Nastavte upozornění** — aktivujte upozornění pro "Záloha se nezdařila" v části **Nastavení → Upozornění → Události**, abyste ihned věděli, když se něco pokazí
