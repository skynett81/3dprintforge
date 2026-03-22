---
sidebar_position: 5
title: E-commerce
description: Správa objednávek, zákazníků a fakturace pro prodej 3D tisků — vyžaduje licenci od geektech.no
---

# E-commerce

Modul e-commerce vám poskytuje kompletní systém pro správu zákazníků, objednávek a fakturace — ideální pro ty, kteří prodávají 3D tisky profesionálně nebo poloprofesionálně.

Přejděte na: **https://localhost:3443/#orders**

:::danger Vyžadována licence e-commerce
Modul e-commerce vyžaduje platnou licenci. Licence lze **zakoupit pouze na [geektech.no](https://geektech.no)**. Bez aktivní licence je modul uzamčen a nedostupný.
:::

## Licence — nákup a aktivace

### Zakoupení licence

1. Přejděte na **[geektech.no](https://geektech.no)** a vytvořte účet
2. Vyberte **Bambu Dashboard — Licence e-commerce**
3. Vyberte typ licence:

| Typ licence | Popis | Tiskárny |
|---|---|---|
| **Hobby** | Jedna tiskárna, osobní použití a malý prodej | 1 |
| **Profesionální** | Až 5 tiskáren, komerční použití | 1–5 |
| **Enterprise** | Neomezený počet tiskáren, plná podpora | Neomezeno |

4. Dokončete platbu
5. Obdržíte **licenční klíč** e-mailem

### Aktivace licence

1. Přejděte na **Nastavení → E-commerce** v dashboardu
2. Vložte **licenční klíč** do pole
3. Klikněte na **Aktivovat licenci**
4. Dashboard ověří klíč vůči serverům geektech.no
5. Po úspěšné aktivaci se zobrazí typ licence, datum vypršení a počet tiskáren

:::warning Licenční klíč je vázán na vaši instalaci
Klíč se aktivuje pro jednu instalaci Bambu Dashboard. Kontaktujte [geektech.no](https://geektech.no), pokud potřebujete přesunout licenci na nový server.
:::

### Ověření licence

- Licence se **ověřuje online** při spuštění a pak každých 24 hodin
- Při výpadku sítě licence funguje až **7 dní offline**
- Vypršená licence → modul se uzamkne, ale existující data se zachovají
- Obnovení přes **[geektech.no](https://geektech.no)** → Moje licence → Obnovit

### Kontrola stavu licence

Přejděte na **Nastavení → E-commerce** nebo zavolejte API:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

Odpověď obsahuje:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Název firmy s.r.o.",
  "provider": "geektech.no"
}
```

## Zákazníci

### Vytvoření zákazníka

1. Přejděte na **E-commerce → Zákazníci**
2. Klikněte na **Nový zákazník**
3. Vyplňte:
   - **Jméno / Název firmy**
   - **Kontaktní osoba** (pro firmy)
   - **E-mailová adresa**
   - **Telefon**
   - **Adresa** (fakturační adresa)
   - **IČO / Rodné číslo** (volitelné, pro plátce DPH)
   - **Poznámka** — interní poznámka
4. Klikněte na **Vytvořit**

### Přehled zákazníků

Seznam zákazníků zobrazuje:
- Jméno a kontaktní informace
- Celkový počet objednávek
- Celkový obrat
- Datum poslední objednávky
- Stav (Aktivní / Neaktivní)

Kliknutím na zákazníka zobrazíte celou historii objednávek a fakturace.

## Správa objednávek

### Vytvoření objednávky

1. Přejděte na **E-commerce → Objednávky**
2. Klikněte na **Nová objednávka**
3. Vyberte **Zákazníka** ze seznamu
4. Přidejte řádky objednávky:
   - Vyberte soubor/model z knihovny nebo přidejte volnotextovou položku
   - Zadejte množství a jednotkovou cenu
   - Systém vypočítá náklady automaticky pokud je propojen s projektem
5. Zadejte **Datum doručení** (odhadované)
6. Klikněte na **Vytvořit objednávku**

### Stav objednávky

| Stav | Popis |
|---|---|
| Poptávka | Přijata poptávka, nepotvrzena |
| Potvrzena | Zákazník potvrdil |
| Ve výrobě | Tisky probíhají |
| Připravena k doručení | Hotovo, čeká na vyzvednutí/odeslání |
| Doručena | Objednávka dokončena |
| Zrušena | Zákazníkem nebo vámi stornováno |

Aktualizujte stav kliknutím na objednávku → **Změnit stav**.

### Propojení tisků s objednávkou

1. Otevřete objednávku
2. Klikněte na **Propojit tisk**
3. Vyberte tisky z historie (podporován vícenásobný výběr)
4. Nákladová data se automaticky načtou z historie tisků

## Fakturace

Viz [Projekty → Fakturace](../funksjoner/projects#fakturering) pro podrobnou dokumentaci fakturace.

Faktura lze generovat přímo z objednávky:

1. Otevřete objednávku
2. Klikněte na **Generovat fakturu**
3. Zkontrolujte částky a DPH
4. Stáhněte PDF nebo odešlete na e-mail zákazníka

### Číselná řada faktur

Nastavte číselnou řadu faktur v části **Nastavení → E-commerce**:
- **Předpona**: např. `2026-`
- **Počáteční číslo**: např. `1001`
- Čísla faktur se přiřazují automaticky ve vzestupném pořadí

## Přehledy a daně

### Výkazy poplatků

Systém sleduje všechny transakční poplatky:
- Viz poplatky v části **E-commerce → Poplatky**
- Označte poplatky jako vykázané pro účetní účely
- Exportujte souhrn poplatků za období

### Statistiky

V části **E-commerce → Statistiky**:
- Měsíční obrat (sloupcový diagram)
- Nejlepší zákazníci podle obratu
- Nejprodávanější modely/materiály
- Průměrná velikost objednávky

Exportujte do CSV pro účetní systém.

## Podpora a kontakt

:::info Potřebujete pomoc?
- **Otázky k licencím**: kontaktujte podporu [geektech.no](https://geektech.no)
- **Technické problémy**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Požadavky na funkce**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
