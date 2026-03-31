---
sidebar_position: 8
title: Serverový protokol
description: Zobrazujte serverový protokol v reálném čase, filtrujte podle úrovně a modulu a řešte problémy s 3DPrintForge
---

# Serverový protokol

Serverový protokol vám poskytuje přehled o tom, co se děje uvnitř 3DPrintForgeu — užitečné pro odstraňování problémů, monitorování a diagnostiku.

Přejděte na: **https://localhost:3443/#logs**

## Zobrazení v reálném čase

Stream protokolu se aktualizuje v reálném čase přes WebSocket:

1. Přejděte na **Systém → Serverový protokol**
2. Nové řádky protokolu se automaticky zobrazují dole
3. Klikněte na **Zamknout dole** pro vždy scrollování na poslední záznam
4. Klikněte na **Zmrazit** pro zastavení automatického scrollování a čtení existujících řádků

Výchozí zobrazení ukazuje posledních 500 řádků protokolu.

## Úrovně protokolu

Každý řádek protokolu má úroveň:

| Úroveň | Barva | Popis |
|---|---|---|
| **ERROR** | Červená | Chyby ovlivňující funkčnost |
| **WARN** | Oranžová | Varování — něco může jít špatně |
| **INFO** | Modrá | Normální provozní informace |
| **DEBUG** | Šedá | Podrobné informace pro vývojáře |

:::info Konfigurace úrovně protokolu
Změňte úroveň protokolu v části **Nastavení → Systém → Úroveň protokolu**. Pro normální provoz použijte **INFO**. **DEBUG** používejte pouze při odstraňování problémů, protože generuje mnohem více dat.
:::

## Filtrování

Použijte panel filtrů v horní části zobrazení protokolu:

1. **Úroveň protokolu** — zobrazit pouze ERROR / WARN / INFO / DEBUG nebo kombinaci
2. **Modul** — filtrovat podle systémového modulu:
   - `mqtt` — komunikace MQTT s tiskárnami
   - `api` — požadavky API
   - `db` — databázové operace
   - `auth` — události autentizace
   - `queue` — události tiskové fronty
   - `guard` — události Print Guard
   - `backup` — zálohovací operace
3. **Fulltextové** — hledejte v textu protokolu (podporuje regex)
4. **Čas** — filtrujte podle časového rozsahu

Kombinujte filtry pro přesné odstraňování problémů.

## Běžné chybové situace

### Problémy s MQTT připojením

Hledejte řádky protokolu z modulu `mqtt`:

```
ERROR [mqtt] Připojení k tiskárně XXXX selhalo: Connection refused
```

**Řešení:** Zkontrolujte, zda je tiskárna zapnutá, přístupový kód je správný a síť funguje.

### Chyby databáze

```
ERROR [db] Migrace v95 selhala: SQLITE_CONSTRAINT
```

**Řešení:** Vytvořte zálohu a spusťte opravu databáze přes **Nastavení → Systém → Opravit databázi**.

### Chyby autentizace

```
WARN [auth] Neúspěšné přihlášení pro uživatele admin z IP 192.168.1.x
```

Mnoho neúspěšných přihlášení může naznačovat pokus o brute-force. Zkontrolujte, zda by měla být aktivována whitelist IP.

## Export protokolů

1. Klikněte na **Exportovat protokol**
2. Vyberte časové období (výchozí: posledních 24 hodin)
3. Vyberte formát: **TXT** (lidsky čitelný) nebo **JSON** (strojově čitelný)
4. Soubor se stáhne

Exportované protokoly jsou užitečné při hlášení chyb nebo při kontaktu s podporou.

## Rotace protokolů

Protokoly se automaticky rotují:

| Nastavení | Výchozí |
|---|---|
| Maximální velikost souboru protokolu | 50 MB |
| Počet rotovaných souborů k zachování | 5 |
| Celková maximální velikost protokolu | 250 MB |

Upravte v části **Nastavení → Systém → Rotace protokolů**. Starší soubory protokolu jsou automaticky komprimovány pomocí gzip.

## Umístění souborů protokolu

Soubory protokolu jsou uloženy na serveru:

```
./data/logs/
├── 3dprintforge.log          (aktivní protokol)
├── 3dprintforge.log.1.gz     (rotovaný)
├── 3dprintforge.log.2.gz     (rotovaný)
└── ...
```

:::tip SSH přístup
Pro čtení protokolů přímo na serveru přes SSH:
```bash
tail -f ./data/logs/3dprintforge.log
```
:::
