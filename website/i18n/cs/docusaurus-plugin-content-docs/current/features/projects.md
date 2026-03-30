---
sidebar_position: 9
title: Projekty
description: Organizujte tisky do projektů, sledujte náklady, generujte faktury a sdílejte projekty se zákazníky
---

# Projekty

Projekty umožňují seskupovat související tisky, sledovat náklady na materiál, fakturovat zákazníkům a sdílet přehled vaší práce.

Přejděte na: **https://localhost:3443/#projects**

## Vytvoření projektu

1. Klikněte na **Nový projekt** (ikona +)
2. Vyplňte:
   - **Název projektu** — popisný název (max. 100 znaků)
   - **Zákazník** — volitelný zákaznický účet (viz [E-commerce](../integrations/ecommerce))
   - **Popis** — krátký textový popis
   - **Barva** — vyberte barvu pro vizuální identifikaci
   - **Štítky** — klíčová slova oddělená čárkami
3. Klikněte na **Vytvořit projekt**

## Propojení tisků s projektem

### Během tisku

1. Otevřete dashboard, když tisk probíhá
2. Klikněte na **Propojit s projektem** v bočním panelu
3. Vyberte existující projekt nebo vytvořte nový
4. Tisk se automaticky propojí s projektem po dokončení

### Z historie

1. Přejděte na **Historii**
2. Najděte příslušný tisk
3. Klikněte na tisk → **Propojit s projektem**
4. Vyberte projekt z rozevíracího seznamu

### Hromadné propojení

1. Vyberte více tisků v historii pomocí zaškrtávacích políček
2. Klikněte na **Akce → Propojit s projektem**
3. Vyberte projekt — všechny vybrané tisky se propojí

## Přehled nákladů

Každý projekt vypočítává celkové náklady na základě:

| Typ nákladů | Zdroj |
|---|---|
| Spotřeba filamentů | Gramy × cena za gram na materiál |
| Elektřina | kWh × cena elektřiny (z Tibber/Nordpool pokud je nakonfigurováno) |
| Opotřebení stroje | Vypočítáno z [Predikce opotřebení](../monitoring/wearprediction) |
| Ruční náklady | Volnotextové položky přidané ručně |

Přehled nákladů se zobrazuje jako tabulka a koláčový diagram pro každý tisk a celkově.

:::tip Hodinové ceny
Aktivujte integraci Tibber nebo Nordpool pro přesné náklady na elektřinu pro každý tisk. Viz [Cena elektřiny](../integrations/energy).
:::

## Fakturace

1. Otevřete projekt a klikněte na **Generovat fakturu**
2. Vyplňte:
   - **Datum faktury** a **datum splatnosti**
   - **Sazba DPH** (0 %, 15 %, 25 %)
   - **Přirážka** (%)
   - **Poznámka zákazníkovi**
3. Zobrazte fakturu v náhledu ve formátu PDF
4. Klikněte na **Stáhnout PDF** nebo **Odeslat zákazníkovi** (e-mailem)

Faktury se ukládají pod projektem a lze je znovu otevřít a upravit dokud nejsou odeslány.

:::info Zákaznická data
Zákaznická data (jméno, adresa, IČO) se načítají ze zákaznického účtu propojeného s projektem. Viz [E-commerce](../integrations/ecommerce) pro správu zákazníků.
:::

## Stav projektu

| Stav | Popis |
|---|---|
| Aktivní | Projekt je ve zpracování |
| Dokončen | Všechny tisky jsou připraveny, faktura odeslána |
| Archivován | Skryt ze standardního zobrazení, ale vyhledatelný |
| Čeká | Dočasně pozastaven |

Změňte stav kliknutím na stavový ukazatel v horní části projektu.

## Sdílení projektu

Vygenerujte sdílitelný odkaz pro zobrazení přehledu projektu zákazníkům:

1. Klikněte na **Sdílet projekt** v menu projektu
2. Vyberte, co se má zobrazovat:
   - ✅ Tisky a obrázky
   - ✅ Celková spotřeba filamentů
   - ❌ Náklady a ceny (výchozí skryté)
3. Nastavte čas vypršení odkazu
4. Zkopírujte a sdílejte odkaz

Zákazník vidí stránku jen pro čtení bez přihlášení.
