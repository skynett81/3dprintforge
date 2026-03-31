---
sidebar_position: 1
title: Vítejte v 3DPrintForge
description: Výkonný, samostatně hostovaný dashboard pro 3D tiskárny Bambu Lab
---

# Vítejte v 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** je samostatně hostovaný, plně vybavený ovládací panel pro 3D tiskárny Bambu Lab. Poskytuje vám úplný přehled a kontrolu nad tiskárnou, zásobami filamentů, historií tisku a dalším — vše z jediné záložky prohlížeče.

## Co je 3DPrintForge?

3DPrintForge se připojuje přímo k vaší tiskárně přes MQTT přes LAN, bez závislosti na serverech Bambu Lab. Můžete se také připojit k Bambu Cloud pro synchronizaci modelů a historie tisku.

### Klíčové funkce

- **Live dashboard** — teplota v reálném čase, průběh, kamera, stav AMS s indikátorem LIVE
- **Zásoby filamentů** — spravujte všechny cívky se synchronizací AMS, podporou EXT cívky, informacemi o materiálu, kompatibilitou podložky a průvodcem sušením
- **Sledování filamentů** — přesné sledování se 4úrovňovým záložním mechanismem (senzor AMS → odhad EXT → cloud → trvání)
- **Průvodce materiály** — 15 materiálů s teplotami, kompatibilitou podložky, sušením, vlastnostmi a tipy
- **Historie tisku** — kompletní protokol s názvy modelů, odkazy na MakerWorld, spotřebou filamentů a náklady
- **Plánovač** — zobrazení kalendáře, tisková fronta s vyvažováním zátěže a kontrolou filamentů
- **Ovládání tiskárny** — teplota, rychlost, ventilátory, konzole G-code
- **Print Guard** — automatická ochrana s xcam + 5 monitory senzorů
- **Odhad nákladů** — materiál, energie, práce, opotřebení, marže a návrh prodejní ceny
- **Údržba** — sledování s intervaly na základě KB, životností trysky, životností podložky a průvodcem
- **Zvuková upozornění** — 9 konfigurovatelných událostí s nahráváním vlastních zvuků a reproduktorem tiskárny (M300)
- **Protokol aktivit** — trvalá časová osa všech událostí (tisky, chyby, údržba, filament)
- **Oznámení** — 7 kanálů (Telegram, Discord, e-mail, ntfy, Pushover, SMS, webhook)
- **Více tiskáren** — podporuje celou řadu Bambu Lab
- **17 jazyků** — norština, angličtina, němčina, francouzština, španělština, italština, japonština, korejština, nizozemština, polština, portugalština, švédština, turečtina, ukrajinština, čínština, čeština, maďarština
- **Samostatně hostovaný** — žádná závislost na cloudu, vaše data na vašem stroji

### Novinky ve v1.1.14

- **Integrace AdminLTE 4** — kompletní restrukturalizace HTML s treeview postranním panelem, moderním rozložením a podporou CSP pro CDN
- **CRM systém** — kompletní správa zákazníků se 4 panely: zákazníci, objednávky, faktury a nastavení firmy s integrací historie
- **Moderní UI** — teal akcent, přechodové titulky, hover záře, plovoucí koule a vylepšený tmavý motiv
- **Úspěchy: 18 památek** — vikingská loď, Socha svobody, Eiffel Tower, Big Ben, Braniborská brána, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, holandský větrný mlýn, Wawelský drak, Cristo Redentor, Turning Torso, Hagia Sophia, Matka vlast, Velká čínská zeď, Pražský orloj, Budapeštský parlament — s vyskakovacím oknem podrobností, XP a vzácností
- **Vlhkost/teplota AMS** — 5stupňové hodnocení s doporučeními pro skladování a sušení
- **Živé sledování filamentu** — aktualizace v reálném čase během tisku přes cloudový odhad jako zálohu
- **Redesign sekce filamentů** — velké cívky s úplnými informacemi (značka, hmotnost, teplota, RFID, barva), horizontální rozložení a kliknutí pro podrobnosti
- **EXT cívka inline** — externí cívka zobrazena společně s AMS cívkami s lepším využitím prostoru
- **Rozložení dashboardu optimalizováno** — výchozí 2 sloupce pro monitory 24–27", velký 3D/kamera, kompaktní filament/AMS
- **Čas výměny filamentu** v odhadci nákladů s viditelným počítadlem výměn
- **Globální systém upozornění** — lišta upozornění s toast notifikacemi vpravo dole, neblokuje navigační lištu
- **Průvodce i18n** — všech 14 klíčů průvodce přeloženo do 17 jazyků
- **5 nových KB stránek** — matice kompatibility a nové průvodce filamenty přeložené do 17 jazyků
- **Kompletní i18n** — všech 3252 klíčů přeloženo do 17 jazyků včetně CRM a úspěchů památek

## Rychlý start

| Úkol | Odkaz |
|------|-------|
| Nainstalovat dashboard | [Instalace](./getting-started/installation) |
| Nakonfigurovat první tiskárnu | [Nastavení](./getting-started/setup) |
| Připojit k Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Prozkoumat všechny funkce | [Funkce](./features/overview) |
| Průvodce filamenty | [Průvodce materiály](./kb/filaments/guide) |
| Průvodce údržbou | [Údržba](./kb/maintenance/nozzle) |
| Dokumentace API | [API](./advanced/api) |

:::tip Demo režim
Můžete vyzkoušet dashboard bez fyzické tiskárny spuštěním `npm run demo`. Tím se spustí 3 simulované tiskárny s živými tiskovými cykly.
:::

## Podporované tiskárny

Všechny tiskárny Bambu Lab s režimem LAN:

- **Řada X1**: X1C, X1C Combo, X1E
- **Řada P1**: P1S, P1S Combo, P1P
- **Řada P2**: P2S, P2S Combo
- **Řada A**: A1, A1 Combo, A1 mini
- **Řada H2**: H2S, H2D (dvojitá tryska), H2C (výměník nástrojů, 6 hlav)

## Funkce v detailu

### Sledování filamentů

Dashboard automaticky sleduje spotřebu filamentů se 4úrovňovým záložním mechanismem:

1. **Rozdíl senzoru AMS** — nejpřesnější, porovnává zbývající % na začátku/konci
2. **EXT přímo** — pro P2S/A1 bez vt_tray, používá cloudový odhad
3. **Cloudový odhad** — z dat tiskových úloh Bambu Cloud
4. **Odhad podle trvání** — ~30 g/hod jako poslední záloha

Všechny hodnoty jsou zobrazeny jako minimum ze senzoru AMS a databáze cívek, aby se předešlo chybám po neúspěšných tiscích.

### Průvodce materiály

Vestavěná databáze s 15 materiály zahrnující:
- Teploty (tryska, podložka, komora)
- Kompatibilita podložky (Cool, Engineering, High Temp, Textured PEI)
- Informace o sušení (teplota, čas, hygroskopičnost)
- 8 vlastností (pevnost, flexibilita, odolnost vůči teplu, UV, povrch, snadnost použití)
- Obtížnost a speciální požadavky (kalená tryska, enclosure)

### Zvuková upozornění

9 konfigurovatelných událostí s podporou:
- **Vlastní zvukové klipy** — nahrajte MP3/OGG/WAV (max. 10 sekund, 500 KB)
- **Vestavěné tóny** — kovové/syntetické zvuky generované pomocí Web Audio API
- **Reproduktor tiskárny** — melodie M300 G-code přímo na bzučák tiskárny
- **Odpočítávání** — zvukové upozornění, když zbývá 1 minuta do konce tisku

### Údržba

Kompletní systém údržby:
- Sledování komponent (tryska, PTFE trubka, tyče, ložiska, AMS, podložka, sušení)
- Intervaly na základě KB z dokumentace
- Životnost trysky podle typu (mosaz, kalená ocel, HS01)
- Životnost podložky podle typu (Cool, Engineering, High Temp, Textured PEI)
- Záložka průvodce s tipy a odkazy na úplnou dokumentaci

## Technický přehled

3DPrintForge je postaven na Node.js 22 a vanilla HTML/CSS/JS — žádné těžké frameworky, žádný krok sestavení. Databáze je SQLite, zabudovaná v Node.js 22.

- **Backend**: Node.js 22 pouze se 3 npm balíčky (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, žádný krok sestavení
- **Databáze**: SQLite přes vestavěný `--experimental-sqlite` Node.js 22
- **Dokumentace**: Docusaurus se 17 jazyky, automaticky sestavená při instalaci
- **API**: 177+ endpointů, dokumentace OpenAPI na `/api/docs`

Viz [Architektura](./advanced/architecture) pro podrobnosti.
